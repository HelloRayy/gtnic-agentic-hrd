import type { TechnicalDossier, TraceEvent } from '../types/audit.js';

const API_BASE = '/api';

export interface StreamAuditCallbacks {
  onProgress: (event: TraceEvent) => void;
  onComplete: (dossier: TechnicalDossier) => void;
  onError: (error: string) => void;
}

export async function streamAuditExecution(
  formData: FormData | null,
  isSample: boolean,
  callbacks: StreamAuditCallbacks
): Promise<void> {
  const url = isSample ? `${API_BASE}/sample/stream` : `${API_BASE}/audit/stream`;
  const options: RequestInit = isSample
    ? { method: 'GET' }
    : { method: 'POST', body: formData || undefined };

  const res = await fetch(url, options);
  if (!res.ok) {
    throw new Error(`Connection failed (${res.status}): ${res.statusText}`);
  }

  const reader = res.body?.getReader();
  if (!reader) {
    throw new Error('Streaming response not readable in current environment.');
  }

  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const chunks = buffer.split('\n\n');
      buffer = chunks.pop() || '';

      for (const chunk of chunks) {
        const trimmed = chunk.trim();
        if (!trimmed) continue;
        const line = trimmed.startsWith('data:') ? trimmed.slice(5).trim() : trimmed;
        try {
          const payload = JSON.parse(line);
          if (payload.type === 'progress' && payload.event) {
            callbacks.onProgress(payload.event);
          } else if (payload.type === 'complete' && payload.data) {
            callbacks.onComplete(payload.data);
          } else if (payload.type === 'error') {
            callbacks.onError(payload.error || 'Server execution error');
          }
        } catch {
          // ignore incomplete chunk parsing
        }
      }
    }
  } catch (err: any) {
    callbacks.onError(err.message || 'Stream connection closed unexpectedly');
  }
}

export async function fetchSampleAudit(): Promise<TechnicalDossier> {
  const res = await fetch(`${API_BASE}/sample`);
  if (!res.ok) {
    throw new Error(`Failed to load sample audit: ${res.statusText}`);
  }
  const json = await res.json();
  if (!json.success) {
    throw new Error(json.error || 'Sample audit failed');
  }
  return json.data;
}

export async function submitAudit(formData: FormData): Promise<TechnicalDossier> {
  const res = await fetch(`${API_BASE}/audit`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    const errJson = await res.json().catch(() => ({}));
    throw new Error(errJson.error || `Audit request failed: ${res.statusText}`);
  }
  const json = await res.json();
  if (!json.success) {
    throw new Error(json.error || 'Audit processing failed');
  }
  return json.data;
}

export async function checkServerHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/health`);
    return res.ok;
  } catch {
    return false;
  }
}
