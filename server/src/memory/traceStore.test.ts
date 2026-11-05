import { describe, it, expect, vi } from 'vitest';
import { TraceStore } from './traceStore.js';

describe('TraceStore - Chain-of-Thought Reasoning Logger', () => {
  it('should initialize with empty events array', () => {
    const store = new TraceStore();
    expect(store.getEvents()).toEqual([]);
  });

  it('should log events with correct structure and timestamp', () => {
    const store = new TraceStore();
    store.log('PLAN', 'INGESTION', 'Extracting candidate CV', { file: 'cv.pdf' });

    const events = store.getEvents();
    expect(events.length).toBe(1);
    expect(events[0].phase).toBe('PLAN');
    expect(events[0].step).toBe('INGESTION');
    expect(events[0].detail).toBe('Extracting candidate CV');
    expect(events[0].metadata).toEqual({ file: 'cv.pdf' });
    expect(new Date(events[0].timestamp).getTime()).toBeGreaterThan(0);
  });

  it('should invoke listener callback on every log call', () => {
    const listener = vi.fn();
    const store = new TraceStore(listener);

    store.log('TOOL_CALL', 'GITHUB_AUDIT', 'Fetching user repositories');
    store.log('OBSERVATION', 'CODE_ANALYSIS', 'AST parsing completed');

    expect(listener).toHaveBeenCalledTimes(2);
    expect(listener).toHaveBeenNthCalledWith(1, expect.objectContaining({
      phase: 'TOOL_CALL',
      step: 'GITHUB_AUDIT',
    }));
  });

  it('should gracefully handle listener errors without throwing', () => {
    const faultyListener = vi.fn(() => {
      throw new Error('Listener crash');
    });
    const store = new TraceStore(faultyListener);

    expect(() => {
      store.log('REFLECTION', 'EVALUATION', 'Checking evidence integrity');
    }).not.toThrow();

    expect(store.getEvents().length).toBe(1);
  });

  it('should clear all recorded events', () => {
    const store = new TraceStore();
    store.log('PLAN', 'SETUP', 'Init');
    expect(store.getEvents().length).toBe(1);

    store.clear();
    expect(store.getEvents().length).toBe(0);
  });

  it('should prevent external mutation of internal events', () => {
    const store = new TraceStore();
    store.log('PLAN', 'INIT', 'Initial step');

    const external = store.getEvents();
    external.pop();

    expect(store.getEvents().length).toBe(1);
  });
});
