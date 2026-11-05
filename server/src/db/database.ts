import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { TraceEvent, RepoAuditEvidence, TechnicalDossier } from '../core/types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../../data');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_PATH = path.join(DATA_DIR, 'talenttrace.db');
export const db = new DatabaseSync(DB_PATH);

// Inisialisasi konfigurasi SQLite WAL untuk performa dan konkurensi optimal
db.exec('PRAGMA journal_mode = WAL;');
db.exec('PRAGMA synchronous = NORMAL;');

// Inisialisasi skema tabel jika belum ada
db.exec(`
  CREATE TABLE IF NOT EXISTS audits (
    id TEXT PRIMARY KEY, candidate_name TEXT NOT NULL, candidate_email TEXT, github_username TEXT,
    job_title TEXT NOT NULL, overall_assessment TEXT, dossier_json TEXT NOT NULL, execution_time_ms INTEGER DEFAULT 0, created_at TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_audits_created_at ON audits(created_at DESC);
  CREATE TABLE IF NOT EXISTS traces (
    id INTEGER PRIMARY KEY AUTOINCREMENT, audit_id TEXT NOT NULL, phase TEXT NOT NULL,
    step TEXT NOT NULL, detail TEXT NOT NULL, metadata_json TEXT, timestamp TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_traces_audit_id ON traces(audit_id);
  CREATE TABLE IF NOT EXISTS github_cache (
    cache_key TEXT PRIMARY KEY, data_json TEXT NOT NULL, expires_at INTEGER NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_github_cache_expires_at ON github_cache(expires_at);
`);

interface AuditDbRow {
  id: string;
  candidate_name: string;
  candidate_email: string | null;
  github_username: string | null;
  job_title: string;
  overall_assessment: string | null;
  dossier_json: string;
  execution_time_ms: number;
  created_at: string;
}

interface TraceDbRow {
  id: number;
  audit_id: string;
  phase: TraceEvent['phase'];
  step: string;
  detail: string;
  metadata_json: string | null;
  timestamp: string;
}

interface CacheDbRow {
  cache_key: string;
  data_json: string;
  expires_at: number;
}

export interface AuditRecord {
  id: string;
  candidateName: string;
  candidateEmail?: string;
  githubUsername?: string;
  jobTitle: string;
  overallAssessment?: string;
  dossier: TechnicalDossier;
  executionTimeMs: number;
  createdAt: string;
  traces?: TraceEvent[];
}

export interface AuditSummary {
  id: string;
  candidateName: string;
  candidateEmail?: string;
  githubUsername?: string;
  jobTitle: string;
  overallAssessment?: string;
  executionTimeMs: number;
  createdAt: string;
}

export const auditRepository = {
  saveAudit(params: {
    id: string;
    candidateName: string;
    candidateEmail?: string;
    githubUsername?: string;
    jobTitle: string;
    overallAssessment?: string;
    dossier: TechnicalDossier;
    executionTimeMs?: number;
    createdAt?: string;
  }): void {
    const createdAt = params.createdAt || new Date().toISOString();
    const executionTimeMs = params.executionTimeMs ?? params.dossier.executionTimeMs ?? 0;
    const stmt = db.prepare(`
      INSERT INTO audits (id, candidate_name, candidate_email, github_username, job_title, overall_assessment, dossier_json, execution_time_ms, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        candidate_name = excluded.candidate_name, candidate_email = excluded.candidate_email,
        github_username = excluded.github_username, job_title = excluded.job_title,
        overall_assessment = excluded.overall_assessment, dossier_json = excluded.dossier_json,
        execution_time_ms = excluded.execution_time_ms, created_at = excluded.created_at
    `);
    stmt.run(
      params.id,
      params.candidateName,
      params.candidateEmail || null,
      params.githubUsername || null,
      params.jobTitle,
      params.overallAssessment || null,
      JSON.stringify(params.dossier),
      executionTimeMs,
      createdAt
    );

    // Simpan semua trace events yang ada di dossier jika ada
    if (params.dossier.traceEvents && params.dossier.traceEvents.length > 0) {
      const traceStmt = db.prepare(`
        INSERT INTO traces (audit_id, phase, step, detail, metadata_json, timestamp)
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      for (const t of params.dossier.traceEvents) {
        traceStmt.run(
          params.id,
          t.phase,
          t.step,
          t.detail,
          t.metadata ? JSON.stringify(t.metadata) : null,
          t.timestamp
        );
      }
    }
  },

  getAuditsSummary(): AuditSummary[] {
    const stmt = db.prepare(`
      SELECT id, candidate_name, candidate_email, github_username, job_title, overall_assessment, execution_time_ms, created_at
      FROM audits
      ORDER BY created_at DESC
    `);
    const rows = stmt.all() as unknown as AuditDbRow[];
    return rows.map((r) => ({
      id: String(r.id),
      candidateName: String(r.candidate_name),
      candidateEmail: r.candidate_email ? String(r.candidate_email) : undefined,
      githubUsername: r.github_username ? String(r.github_username) : undefined,
      jobTitle: String(r.job_title),
      overallAssessment: r.overall_assessment ? String(r.overall_assessment) : undefined,
      executionTimeMs: Number(r.execution_time_ms || 0),
      createdAt: String(r.created_at),
    }));
  },

  getAuditById(id: string): AuditRecord | null {
    const stmt = db.prepare(`
      SELECT id, candidate_name, candidate_email, github_username, job_title, overall_assessment, dossier_json, execution_time_ms, created_at
      FROM audits
      WHERE id = ?
    `);
    const row = stmt.get(id) as unknown as AuditDbRow | undefined;
    if (!row) return null;

    let dossier: TechnicalDossier;
    try {
      dossier = JSON.parse(row.dossier_json);
    } catch {
      return null;
    }

    const traces = this.getTracesByAuditId(id);
    if (!dossier.traceEvents || dossier.traceEvents.length === 0) {
      dossier.traceEvents = traces;
    }

    return {
      id: String(row.id),
      candidateName: String(row.candidate_name),
      candidateEmail: row.candidate_email ? String(row.candidate_email) : undefined,
      githubUsername: row.github_username ? String(row.github_username) : undefined,
      jobTitle: String(row.job_title),
      overallAssessment: row.overall_assessment ? String(row.overall_assessment) : undefined,
      dossier,
      executionTimeMs: Number(row.execution_time_ms || 0),
      createdAt: String(row.created_at),
      traces,
    };
  },

  deleteAudit(id: string): boolean {
    db.prepare('DELETE FROM traces WHERE audit_id = ?').run(id);
    const res = db.prepare('DELETE FROM audits WHERE id = ?').run(id);
    return res.changes > 0;
  },

  saveTrace(auditId: string, event: TraceEvent): void {
    const stmt = db.prepare(`
      INSERT INTO traces (audit_id, phase, step, detail, metadata_json, timestamp)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      auditId,
      event.phase,
      event.step,
      event.detail,
      event.metadata ? JSON.stringify(event.metadata) : null,
      event.timestamp
    );
  },

  getTracesByAuditId(auditId: string): TraceEvent[] {
    const stmt = db.prepare(`
      SELECT phase, step, detail, metadata_json, timestamp
      FROM traces
      WHERE audit_id = ?
      ORDER BY id ASC
    `);
    const rows = stmt.all(auditId) as unknown as TraceDbRow[];
    return rows.map((r) => ({
      phase: r.phase,
      step: r.step,
      detail: r.detail,
      timestamp: r.timestamp,
      metadata: r.metadata_json ? JSON.parse(r.metadata_json) : undefined,
    }));
  },

  // Cache Operations
  getCachedRepo(key: string): RepoAuditEvidence | null {
    const stmt = db.prepare(`
      SELECT data_json, expires_at
      FROM github_cache
      WHERE cache_key = ?
    `);
    const row = stmt.get(key) as unknown as CacheDbRow | undefined;
    if (!row) return null;

    if (Date.now() > Number(row.expires_at)) {
      db.prepare('DELETE FROM github_cache WHERE cache_key = ?').run(key);
      return null;
    }

    try {
      return JSON.parse(row.data_json);
    } catch {
      return null;
    }
  },

  setCachedRepo(key: string, data: RepoAuditEvidence, expiresAt: number): void {
    const stmt = db.prepare(`
      INSERT INTO github_cache (cache_key, data_json, expires_at)
      VALUES (?, ?, ?)
      ON CONFLICT(cache_key) DO UPDATE SET
        data_json = excluded.data_json,
        expires_at = excluded.expires_at
    `);
    stmt.run(key, JSON.stringify(data), expiresAt);
  },

  clearExpiredCache(): void {
    db.prepare('DELETE FROM github_cache WHERE expires_at < ?').run(Date.now());
  },

  clearAllCache(): void {
    db.prepare('DELETE FROM github_cache').run();
  },
};
