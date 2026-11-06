import { Octokit } from '@octokit/rest';
import { config } from '../../config/env.js';
import { auditCacheStore } from '../../memory/cacheStore.js';
import { parseManifestContent } from './manifestParsers.js';
import type { BaseTool, ToolParamDef } from '../registry.js';
import type { RepoAuditEvidence, AuthorshipStatus, RepoCommitItem } from '../../core/types.js';

const octokit = new Octokit({
  auth: config.githubToken || undefined,
});

export interface GithubTriageParams {
  username: string;
  targetSkills?: string[];
  cvText?: string;
  maxRepos?: number;
}

export class GithubTriageTool implements BaseTool<GithubTriageParams, string[]> {
  public name = 'github_triage';
  public description = 'Discovers and filters original, active public repositories for a candidate, scored by skill relevance.';
  public parameterSchema: Record<string, ToolParamDef> = {
    username: { type: 'string', required: true, description: 'GitHub username of the candidate' },
  };

  public async execute(params: GithubTriageParams): Promise<string[]> {
    try {
      const { data: repos } = await octokit.rest.repos.listForUser({
        username: params.username,
        sort: 'pushed',
        direction: 'desc',
        per_page: 30,
      });

      const usernameLower = params.username.toLowerCase();
      const originalRepos = repos.filter(
        r => !r.fork && !r.archived && r.name.toLowerCase() !== usernameLower
      );
      const targetSkillsLower = (params.targetSkills || []).map(s => s.toLowerCase());
      const cvTextLower = (params.cvText || '').toLowerCase();

      const scored = originalRepos.map(r => {
        let score = 0;
        const nameLower = r.name.toLowerCase();
        const nameNormalized = nameLower.replace(/[-_]/g, ' ');
        const descLower = (r.description || '').toLowerCase();
        const langLower = (r.language || '').toLowerCase();
        const rawTopics = 'topics' in r && Array.isArray(r.topics) ? r.topics : [];
        const topics = rawTopics.map((t: string) => t.toLowerCase());

        // 1. Direct CV Project claim match (Massive boost for claimed projects!)
        if (cvTextLower && (cvTextLower.includes(nameLower) || cvTextLower.includes(nameNormalized))) {
          score += 50;
        }

        // 2. Language match (Bugfix: ensure langLower is truthy to prevent empty string matches)
        if (langLower) {
          for (const skill of targetSkillsLower) {
            if (langLower.includes(skill) || skill.includes(langLower)) {
              score += 15;
              break;
            }
          }
        }

        // 3. Name, description, topics skill matching
        for (const skill of targetSkillsLower) {
          if (nameLower.includes(skill)) score += 10;
          if (descLower.includes(skill)) score += 5;
          if (topics.some((t: string) => t.includes(skill))) score += 8;
        }

        // 4. Stars & Recency
        const stars = typeof r.stargazers_count === 'number' ? r.stargazers_count : 0;
        if (stars > 0) score += Math.min(stars, 5);

        const dateStr = r.pushed_at || r.updated_at || '';
        if (dateStr) {
          const pushedDate = new Date(dateStr).getTime();
          const oneYearAgo = Date.now() - 365 * 24 * 3600 * 1000;
          if (pushedDate > oneYearAgo) score += 5;
        }

        return { repo: r, score };
      });

      scored.sort((a, b) => b.score - a.score);
      const limit = params.maxRepos || 5;
      const selectedNames = scored.slice(0, limit).map(s => s.repo.name);
      return selectedNames.length > 0 ? selectedNames : originalRepos.slice(0, limit).map(r => r.name);
    } catch (err: unknown) {
      const isRateLimit = typeof err === 'object' && err !== null && 'status' in err && (err as { status: number }).status === 403;
      if (isRateLimit) {
        console.warn(`[GithubTriageTool] Rate limit reached for GitHub API. Provide GITHUB_TOKEN in .env to expand limit.`);
      } else {
        const msg = err instanceof Error ? err.message : String(err);
        console.warn(`[GithubTriageTool] Failed for ${params.username}:`, msg);
      }
      return [];
    }
  }
}

export class GithubRepoAuditTool implements BaseTool<{ owner: string; repo: string }, RepoAuditEvidence | null> {
  public name = 'github_repo_audit';
  public description = 'Performs structural codebase audit (tree level-3, manifests, tests, CI/CD, Docker, and commit lens).';
  public parameterSchema: Record<string, ToolParamDef> = {
    owner: { type: 'string', required: true, description: 'Repository owner or organization' },
    repo: { type: 'string', required: true, description: 'Repository name' },
  };

  public async execute(params: { owner: string; repo: string }): Promise<RepoAuditEvidence | null> {
    const { owner, repo } = params;

    const cached = auditCacheStore.get(owner, repo);
    if (cached) {
      return { ...cached, cached: true };
    }

    try {
      const { data: repoInfo } = await octokit.rest.repos.get({ owner, repo });
      const defaultBranch = repoInfo.default_branch || 'main';
      let rawFilePaths: string[] = [];

      try {
        const { data: treeData } = await octokit.rest.git.getTree({
          owner,
          repo,
          tree_sha: defaultBranch,
          recursive: 'true',
        });
        if (treeData.tree) {
          rawFilePaths = treeData.tree
            .filter(item => item.path && item.type === 'blob')
            .map(item => item.path as string);
        }
      } catch {
        const { data: contents } = await octokit.rest.repos.getContent({ owner, repo, path: '' });
        if (Array.isArray(contents)) {
          rawFilePaths = contents.map(c => c.name);
        }
      }

      const ignoredPrefixes = ['node_modules/', 'dist/', 'build/', '.next/', 'vendor/', '.git/', 'coverage/'];
      const filePaths = rawFilePaths.filter(p => !ignoredPrefixes.some(prefix => p.startsWith(prefix)));

      const manifestFileNames = ['package.json', 'go.mod', 'Cargo.toml', 'requirements.txt', 'Pipfile', 'pyproject.toml', 'pom.xml', 'build.gradle'];
      const manifestPaths = filePaths.filter(p => {
        const parts = p.split('/');
        return parts.length <= 4 && manifestFileNames.includes(parts[parts.length - 1]);
      }).slice(0, 8);

      const isMonorepo = manifestPaths.length > 1 || filePaths.some(p => p === 'pnpm-workspace.yaml' || p === 'turbo.json' || p === 'lerna.json');

      const manifestResults = await Promise.all(
        manifestPaths.map(async (manifestPath) => {
          try {
            const { data: contentData } = await octokit.rest.repos.getContent({ owner, repo, path: manifestPath });
            if ('content' in contentData && typeof contentData.content === 'string') {
              const decoded = Buffer.from(contentData.content, 'base64').toString('utf-8');
              return { path: manifestPath, dependencies: parseManifestContent(manifestPath, decoded) };
            }
          } catch {}
          return null;
        })
      );
      const manifestFiles = manifestResults.filter((m): m is { path: string; dependencies: string[] } => m !== null);
      const hasTests = filePaths.some(p => p.includes('.test.') || p.includes('.spec.') || p.includes('__tests__') || p.endsWith('_test.go') || p.startsWith('tests/'));
      const hasCiCd = filePaths.some(p => p.includes('.github/workflows') || p.includes('.gitlab-ci.yml') || p.includes('Jenkinsfile'));
      const hasDocker = filePaths.some(p => p.toLowerCase().includes('dockerfile') || p.toLowerCase().includes('docker-compose'));

      if (hasDocker) manifestFiles.push({ path: 'Dockerfile', dependencies: ['docker', 'container', 'containerization'] });
      if (hasCiCd) manifestFiles.push({ path: '.github/workflows', dependencies: ['ci/cd', 'github-actions', 'automation'] });
      // Authorship Analysis (Fuzzy & Non-Punitive)
      let recentCommitSample: string[] = [];
      let commitHistory: RepoCommitItem[] = [];
      let commitAuthors: string[] = [];
      let isSquashedOrMigrated = false;
      let authorshipStatus: AuthorshipStatus = 'MATCHED';
      let authorshipNote = 'Commit author matches repository owner profile.';
      let isPotentialClone = false;
      let commitCountSample = 0;

      try {
        const { data: commits } = await octokit.rest.repos.listCommits({ owner, repo, per_page: 15 });
        commitCountSample = commits.length;
        recentCommitSample = commits.map(c => c.commit.message.split('\n')[0].slice(0, 70));
        commitHistory = commits.map(c => {
          const shortSha = c.sha ? c.sha.slice(0, 7) : '';
          const authorLogin = c.author?.login || '';
          const authorName = c.commit.author?.name || authorLogin || 'Developer';
          const authorAvatar = c.author?.avatar_url || `https://github.com/${authorLogin || owner}.png`;
          const date = c.commit.author?.date || new Date().toISOString();
          const commitUrl = c.html_url || `https://github.com/${owner}/${repo}/commit/${c.sha}`;
          const isVerified = Boolean(c.commit.verification?.verified);

          return {
            sha: c.sha,
            shortSha,
            message: c.commit.message,
            authorName,
            authorLogin,
            authorAvatar,
            date,
            url: commitUrl,
            verified: isVerified,
          };
        });

        const authorLogins = commits.map(c => c.author?.login).filter(Boolean) as string[];
        const gitNames = commits.map(c => c.commit.author?.name).filter(Boolean) as string[];
        commitAuthors = Array.from(new Set([...authorLogins, ...gitNames]));

        const hasOwnerLoginMatch = authorLogins.some(l => l.toLowerCase() === owner.toLowerCase());
        if (hasOwnerLoginMatch) {
          authorshipStatus = 'MATCHED';
          authorshipNote = 'Verified GitHub profile login authorship on commits.';
        } else if (authorLogins.length === 0 && gitNames.length > 0) {
          authorshipStatus = 'UNLINKED_GIT_CONFIG';
          authorshipNote = `Commits authored by local git user "${gitNames[0]}". Not linked to GitHub account login. Requires verbal confirmation.`;
        } else if (authorLogins.length > 0 && !hasOwnerLoginMatch) {
          authorshipStatus = 'THIRD_PARTY_OWNED';
          authorshipNote = `Commits authored by GitHub user "${authorLogins[0]}", differing from candidate username "${owner}".`;
        }

        if (commits.length === 1 && (recentCommitSample[0]?.toLowerCase().includes('initial') || recentCommitSample[0]?.toLowerCase().includes('import'))) {
          isSquashedOrMigrated = true;
        }

        const repoText = `${repoInfo.description || ''} ${recentCommitSample.join(' ')}`.toLowerCase();
        if (repoText.includes('tutorial') || repoText.includes('course project') || repoText.includes('cloned from')) {
          isPotentialClone = true;
        }
      } catch {}

      const result: RepoAuditEvidence = {
        repoName: repo,
        repoUrl: repoInfo.html_url,
        description: repoInfo.description || 'No description provided',
        primaryLanguage: repoInfo.language || 'Unknown',
        stars: repoInfo.stargazers_count,
        isFork: repoInfo.fork,
        lastUpdated: repoInfo.pushed_at || repoInfo.updated_at,
        manifestFiles,
        fileTreeSample: filePaths.slice(0, 60),
        hasTests,
        hasCiCd,
        hasDocker,
        commitCountSample,
        isSquashedOrMigrated,
        recentCommitSample,
        commitHistory,
        license: repoInfo.license?.spdx_id || null,
        isMonorepo,
        authorshipStatus,
        authorshipNote,
        commitAuthors,
        isPotentialClone,
        cached: false,
        homepageUrl: (() => {
          if (repoInfo.homepage && repoInfo.homepage.trim()) return repoInfo.homepage.trim();
          if (repoInfo.description) {
            const match = repoInfo.description.match(/https?:\/\/[^\s)]+(?:vercel\.app|netlify\.app|github\.io|[a-zA-Z0-9-]+\.[a-zA-Z]{2,}\b[^\s)]*)/i);
            if (match) return match[0];
          }
          if ('has_pages' in repoInfo && Boolean(repoInfo.has_pages)) {
            return `https://${owner}.github.io/${repo}`;
          }
          return null;
        })(),
      };

      auditCacheStore.set(owner, repo, result);
      return result;
    } catch (err: unknown) {
      const isRateLimit = typeof err === 'object' && err !== null && 'status' in err && (err as { status: number }).status === 403;
      if (isRateLimit) {
        console.warn(`[GithubRepoAuditTool] GitHub API Rate Limit exceeded for ${owner}/${repo}.`);
      } else {
        const msg = err instanceof Error ? err.message : String(err);
        console.warn(`[GithubRepoAuditTool] Failed for ${owner}/${repo}:`, msg);
      }
      return null;
    }
  }
}
