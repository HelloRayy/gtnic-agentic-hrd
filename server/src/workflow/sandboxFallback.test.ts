import { describe, it, expect } from 'vitest';
import { createSandboxFallbackRepo } from './sandboxFallback.js';

describe('SandboxFallback - Commit History', () => {
  it('should include commitHistory array with rich commit information', () => {
    const repo = createSandboxFallbackRepo('octocat', 'Octo Cat');

    expect(repo.commitHistory).toBeDefined();
    expect(Array.isArray(repo.commitHistory)).toBe(true);
    expect(repo.commitHistory!.length).toBeGreaterThanOrEqual(3);

    const firstCommit = repo.commitHistory![0];
    expect(firstCommit.sha).toBeTruthy();
    expect(firstCommit.shortSha).toBeTruthy();
    expect(firstCommit.message).toBeTruthy();
    expect(firstCommit.authorName).toBe('Octo Cat');
    expect(firstCommit.date).toBeTruthy();
    expect(firstCommit.url).toContain('https://github.com/octocat');
  });
});
