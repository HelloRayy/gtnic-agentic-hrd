import type { RepoAuditEvidence } from '../core/types.js';

interface CacheEntry {
  data: RepoAuditEvidence;
  expiresAt: number;
}

export class AuditCacheStore {
  private cache: Map<string, CacheEntry> = new Map();
  private readonly defaultTtlMs = 1000 * 60 * 30; // 30 minutes cache

  public get(owner: string, repo: string): RepoAuditEvidence | null {
    const key = `${owner.toLowerCase()}/${repo.toLowerCase()}`;
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  public set(owner: string, repo: string, data: RepoAuditEvidence, ttlMs = this.defaultTtlMs): void {
    const key = `${owner.toLowerCase()}/${repo.toLowerCase()}`;
    this.cache.set(key, {
      data,
      expiresAt: Date.now() + ttlMs,
    });
  }

  public clear(): void {
    this.cache.clear();
  }
}

export const auditCacheStore = new AuditCacheStore();
