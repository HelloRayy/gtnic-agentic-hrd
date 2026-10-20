import { Octokit } from '@octokit/rest';
import { config } from '../config/env.js';
import type { RepoAuditEvidence } from '../types/agent.js';

const octokit = new Octokit({
  auth: config.githubToken || undefined,
});

export async function fetchUserRepos(username: string): Promise<string[]> {
  try {
    const { data: repos } = await octokit.rest.repos.listForUser({
      username,
      sort: 'pushed',
      direction: 'desc',
      per_page: 15,
    });

    const originalRepos = repos.filter(r => !r.fork && !r.archived);
    return originalRepos.slice(0, 2).map(r => r.name);
  } catch (err: any) {
    console.error(`Error fetching repos for ${username}:`, err.message);
    return [];
  }
}

export async function auditRepo(owner: string, repo: string): Promise<RepoAuditEvidence | null> {
  try {
    const { data: repoInfo } = await octokit.rest.repos.get({
      owner,
      repo,
    });

    let defaultBranch = repoInfo.default_branch || 'main';
    let filePaths: string[] = [];

    try {
      const { data: treeData } = await octokit.rest.git.getTree({
        owner,
        repo,
        tree_sha: defaultBranch,
        recursive: 'true',
      });

      if (treeData.tree) {
        filePaths = treeData.tree
          .filter(item => item.path && item.type === 'blob')
          .map(item => item.path as string);
      }
    } catch {
      const { data: contents } = await octokit.rest.repos.getContent({
        owner,
        repo,
        path: '',
      });
      if (Array.isArray(contents)) {
        filePaths = contents.map(c => c.name);
      }
    }

    const hasTests = filePaths.some(p =>
      p.includes('.test.') ||
      p.includes('.spec.') ||
      p.includes('__tests__') ||
      p.endsWith('_test.go')
    );

    const hasCiCd = filePaths.some(p =>
      p.includes('.github/workflows') ||
      p.includes('.gitlab-ci.yml') ||
      p.includes('Jenkinsfile')
    );

    const hasDocker = filePaths.some(p =>
      p.toLowerCase().includes('dockerfile') ||
      p.toLowerCase().includes('docker-compose')
    );

    const manifestFiles: { path: string; dependencies: string[] }[] = [];
    const manifestCandidates = ['package.json', 'go.mod', 'Cargo.toml', 'requirements.txt'];

    for (const candidate of manifestCandidates) {
      if (filePaths.includes(candidate)) {
        try {
          const { data: contentData } = await octokit.rest.repos.getContent({
            owner,
            repo,
            path: candidate,
          });

          if ('content' in contentData && typeof contentData.content === 'string') {
            const decoded = Buffer.from(contentData.content, 'base64').toString('utf-8');
            let deps: string[] = [];
            if (candidate === 'package.json') {
              try {
                const parsed = JSON.parse(decoded);
                deps = Object.keys({ ...parsed.dependencies, ...parsed.devDependencies }).slice(0, 20);
              } catch {}
            } else {
              deps = decoded.split('\n').filter(l => l.trim().length > 0).slice(0, 15);
            }
            manifestFiles.push({ path: candidate, dependencies: deps });
          }
        } catch {}
      }
    }

    const sampleTree = filePaths.slice(0, 25);

    return {
      repoName: repo,
      repoUrl: repoInfo.html_url,
      description: repoInfo.description || 'No description provided',
      primaryLanguage: repoInfo.language || 'Unknown',
      stars: repoInfo.stargazers_count,
      isFork: repoInfo.fork,
      lastUpdated: repoInfo.pushed_at || repoInfo.updated_at,
      manifestFiles,
      fileTreeSample: sampleTree,
      hasTests,
      hasCiCd,
      hasDocker,
    };
  } catch (err: any) {
    console.error(`Error auditing repo ${owner}/${repo}:`, err.message);
    return null;
  }
}
