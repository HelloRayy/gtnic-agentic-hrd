import { describe, it, expect } from 'vitest';
import { handleGetRepoCommits } from './repoController.js';
import type { Request, Response } from 'express';

describe('RepoController - Commit History', () => {
  it('should return 400 if owner or repo is missing', async () => {
    let statusCode = 0;
    let jsonBody: any = null;

    const req = {
      query: {},
    } as unknown as Request;

    const res = {
      status: (code: number) => {
        statusCode = code;
        return res;
      },
      json: (data: any) => {
        jsonBody = data;
      },
    } as unknown as Response;

    await handleGetRepoCommits(req, res);

    expect(statusCode).toBe(400);
    expect(jsonBody?.success).toBe(false);
  });

  it('should return commits array on valid repo request', async () => {
    let statusCode = 200;
    let jsonBody: any = null;

    const req = {
      query: { owner: 'ibnumahendra23', repo: 'laundry-be' },
    } as unknown as Request;

    const res = {
      status: (code: number) => {
        statusCode = code;
        return res;
      },
      json: (data: any) => {
        jsonBody = data;
      },
    } as unknown as Response;

    await handleGetRepoCommits(req, res);

    expect(jsonBody?.success).toBe(true);
    expect(Array.isArray(jsonBody?.commits)).toBe(true);
    expect(jsonBody.commits.length).toBeGreaterThan(0);
    expect(jsonBody.commits[0]).toHaveProperty('sha');
    expect(jsonBody.commits[0]).toHaveProperty('shortSha');
    expect(jsonBody.commits[0]).toHaveProperty('message');
    expect(jsonBody.commits[0]).toHaveProperty('authorName');
    expect(jsonBody.commits[0]).toHaveProperty('date');
  });
});
