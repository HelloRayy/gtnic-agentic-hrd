import type { RepoAuditEvidence } from '../core/types.js';
import { auditRepository } from '../db/database.js';

interface CacheEntry {
  data: RepoAuditEvidence;
  expiresAt: number;
}

export class AuditCacheStore {
  private cache: Map<string, CacheEntry> = new Map();
  private readonly defaultTtlMs = 1000 * 60 * 60 * 24; // 24 jam cache

  public get(owner: string, repo: string): RepoAuditEvidence | null {
    const key = `${owner.toLowerCase()}/${repo.toLowerCase()}`;

    // L1: In-memory cache
    const entry = this.cache.get(key);
    if (entry) {
      if (Date.now() > entry.expiresAt) {
        this.cache.delete(key);
      } else {
        return entry.data;
      }
    }

    // L2: Persistent SQLite cache
    try {
      const persisted = auditRepository.getCachedRepo(key);
      if (persisted) {
        // Isi kembali ke L1 cache
        this.cache.set(key, {
          data: persisted,
          expiresAt: Date.now() + this.defaultTtlMs,
        });
        return persisted;
      }
    } catch (err) {
      console.warn('[AuditCacheStore] Failed to read from SQLite cache:', err);
    }

    return null;
  }

  public set(owner: string, repo: string, data: RepoAuditEvidence, ttlMs = this.defaultTtlMs): void {
    const key = `${owner.toLowerCase()}/${repo.toLowerCase()}`;
    const expiresAt = Date.now() + ttlMs;

    // L1: In-memory
    this.cache.set(key, { data, expiresAt });

    // L2: Persistent SQLite
    try {
      auditRepository.setCachedRepo(key, data, expiresAt);
    } catch (err) {
      console.warn('[AuditCacheStore] Failed to persist to SQLite cache:', err);
    }
  }

  public clear(): void {
    this.cache.clear();
    try {
      auditRepository.clearAllCache();
    } catch (err) {
      console.warn('[AuditCacheStore] Failed to clear SQLite cache:', err);
    }
  }
}

export const auditCacheStore = new AuditCacheStore();
