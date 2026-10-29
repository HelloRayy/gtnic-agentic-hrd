import { Octokit } from '@octokit/rest';
import { config } from '../../config/env.js';
import { auditCacheStore } from '../../memory/cacheStore.js';
import type { BaseTool, ToolParamDef } from '../registry.js';
import type { RepoAuditEvidence, AuthorshipStatus } from '../../core/types.js';

const octokit = new Octokit({
  auth: config.githubToken || undefined,
});

export class GithubTriageTool implements BaseTool<{ username: string }, string[]> {
  public name = 'github_triage';
  public description = 'Discovers and filters original, active public repositories for a candidate.';
  public parameterSchema: Record<string, ToolParamDef> = {
    username: { type: 'string', required: true, description: 'GitHub username of the candidate' },
  };

  public async execute(params: { username: string }): Promise<string[]> {
    try {
      const { data: repos } = await octokit.rest.repos.listForUser({
        username: params.username,
        sort: 'pushed',
        direction: 'desc',
        per_page: 15,
      });

      const originalRepos = repos.filter(r => !r.fork && !r.archived);
      return originalRepos.slice(0, 2).map(r => r.name);
    } catch (err: any) {
      if (err.status === 403) {
        console.warn(`[GithubTriageTool] Rate limit reached for GitHub API. Provide GITHUB_TOKEN in .env to expand limit.`);
      } else {
        console.warn(`[GithubTriageTool] Failed for ${params.username}:`, err.message);
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

      const manifestFileNames = ['package.json', 'go.mod', 'Cargo.toml', 'requirements.txt', 'pom.xml', 'build.gradle'];
      const manifestPaths = filePaths.filter(p => {
        const parts = p.split('/');
        return parts.length <= 4 && manifestFileNames.includes(parts[parts.length - 1]);
      }).slice(0, 6);

      const isMonorepo = manifestPaths.length > 1 || filePaths.some(p =>
        p === 'pnpm-workspace.yaml' || p === 'turbo.json' || p === 'lerna.json'
      );

      const manifestResults = await Promise.all(
        manifestPaths.map(async (manifestPath) => {
          try {
            const { data: contentData } = await octokit.rest.repos.getContent({ owner, repo, path: manifestPath });
            if ('content' in contentData && typeof contentData.content === 'string') {
              const decoded = Buffer.from(contentData.content, 'base64').toString('utf-8');
              let deps: string[] = [];
              if (manifestPath.endsWith('package.json')) {
                try {
                  const parsed = JSON.parse(decoded) as { dependencies?: Record<string, string>; devDependencies?: Record<string, string> };
                  deps = Object.keys({ ...parsed.dependencies, ...parsed.devDependencies }).slice(0, 20);
                } catch {}
              } else {
                deps = decoded.split('\n').filter(l => l.trim().length > 0 && !l.startsWith('//') && !l.startsWith('#')).slice(0, 15);
              }
              return { path: manifestPath, dependencies: deps };
            }
          } catch {}
          return null;
        })
      );
      const manifestFiles = manifestResults.filter((m): m is { path: string; dependencies: string[] } => m !== null);

      const hasTests = filePaths.some(p =>
        p.includes('.test.') || p.includes('.spec.') || p.includes('__tests__') || p.endsWith('_test.go')
      );

      const hasCiCd = filePaths.some(p =>
        p.includes('.github/workflows') || p.includes('.gitlab-ci.yml') || p.includes('Jenkinsfile')
      );

      const hasDocker = filePaths.some(p =>
        p.toLowerCase().includes('dockerfile') || p.toLowerCase().includes('docker-compose')
      );

      // Authorship Analysis (Fuzzy & Non-Punitive)
      let recentCommitSample: string[] = [];
      let commitAuthors: string[] = [];
      let isSquashedOrMigrated = false;
      let authorshipStatus: AuthorshipStatus = 'MATCHED';
      let authorshipNote = 'Commit author matches repository owner profile.';
      let isPotentialClone = false;
      let commitCountSample = 0;

      try {
        const { data: commits } = await octokit.rest.repos.listCommits({ owner, repo, per_page: 10 });
        commitCountSample = commits.length;
        recentCommitSample = commits.map(c => c.commit.message.split('\n')[0].slice(0, 70));

        const authorLogins = commits.map(c => c.author?.login).filter(Boolean) as string[];
        const gitNames = commits.map(c => c.commit.author?.name).filter(Boolean) as string[];
        commitAuthors = Array.from(new Set([...authorLogins, ...gitNames]));

        const hasOwnerLoginMatch = authorLogins.some(l => l.toLowerCase() === owner.toLowerCase());

        if (hasOwnerLoginMatch) {
          authorshipStatus = 'MATCHED';
          authorshipNote = 'Verified GitHub profile login authorship on commits.';
        } else if (authorLogins.length === 0 && gitNames.length > 0) {
          // Commits exist, but author is not linked to GitHub profile login (very normal git config scenario)
          authorshipStatus = 'UNLINKED_GIT_CONFIG';
          authorshipNote = `Commits authored by local git user "${gitNames[0]}". Not linked to GitHub account login. Requires verbal confirmation.`;
        } else if (authorLogins.length > 0 && !hasOwnerLoginMatch) {
          // Commits are explicitly authored by someone else entirely
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
        fileTreeSample: filePaths.slice(0, 25),
        hasTests,
        hasCiCd,
        hasDocker,
        commitCountSample,
        isSquashedOrMigrated,
        recentCommitSample,
        license: repoInfo.license?.spdx_id || null,
        isMonorepo,
        authorshipStatus,
        authorshipNote,
        commitAuthors,
        isPotentialClone,
        cached: false,
        homepageUrl: repoInfo.homepage ? repoInfo.homepage.trim() : null,
      };

      auditCacheStore.set(owner, repo, result);
      return result;
    } catch (err: any) {
      if (err.status === 403) {
        console.warn(`[GithubRepoAuditTool] GitHub API Rate Limit exceeded for ${owner}/${repo}.`);
      } else {
        console.warn(`[GithubRepoAuditTool] Failed for ${owner}/${repo}:`, err.message);
      }
      return null;
    }
  }
}
