import type { TraceEvent } from '../core/types.js';
import { auditRepository } from '../db/database.js';

export class TraceStore {
  private events: TraceEvent[] = [];
  private listener?: (event: TraceEvent) => void;
  private auditId?: string;

  constructor(listener?: (event: TraceEvent) => void, auditId?: string) {
    this.listener = listener;
    this.auditId = auditId;
  }

  public setAuditId(id: string): void {
    this.auditId = id;
  }

  public getAuditId(): string | undefined {
    return this.auditId;
  }

  public log(phase: TraceEvent['phase'], step: string, detail: string, metadata?: Record<string, unknown>): void {
    const event: TraceEvent = {
      phase,
      step,
      detail,
      timestamp: new Date().toISOString(),
      metadata,
    };
    this.events.push(event);

    if (this.auditId) {
      try {
        auditRepository.saveTrace(this.auditId, event);
      } catch (err) {
        console.warn('[TraceStore] Failed to persist trace to SQLite:', err);
      }
    }

    if (this.listener) {
      try {
        this.listener(event);
      } catch {}
    }
  }

  public getEvents(): TraceEvent[] {
    return [...this.events];
  }

  public clear(): void {
    this.events = [];
  }
}
