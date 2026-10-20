import type { TraceEvent } from '../core/types.js';

export class TraceStore {
  private events: TraceEvent[] = [];
  private listener?: (event: TraceEvent) => void;

  constructor(listener?: (event: TraceEvent) => void) {
    this.listener = listener;
  }

  public log(phase: TraceEvent['phase'], step: string, detail: string, metadata?: Record<string, any>): void {
    const event: TraceEvent = {
      phase,
      step,
      detail,
      timestamp: new Date().toISOString(),
      metadata,
    };
    this.events.push(event);
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
