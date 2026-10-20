import type { TraceEvent } from '../core/types.js';

export class TraceStore {
  private events: TraceEvent[] = [];

  public log(phase: TraceEvent['phase'], step: string, detail: string, metadata?: Record<string, any>): void {
    const event: TraceEvent = {
      phase,
      step,
      detail,
      timestamp: new Date().toISOString(),
      metadata,
    };
    this.events.push(event);
  }

  public getEvents(): TraceEvent[] {
    return [...this.events];
  }

  public clear(): void {
    this.events = [];
  }
}
