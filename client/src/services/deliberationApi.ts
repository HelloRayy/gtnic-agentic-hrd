import type {
  TechnicalDossier,
  EvidenceItem,
} from '@/types/audit.js';

const API_BASE = '/api';

export interface DeliberationResponse {
  answer: string;
  anchors: string[];
  newAuditedRepo?: string;
  newEvidenceItem?: EvidenceItem;
}

export interface StreamDeliberationCallbacks {
  onStatus?: (message: string) => void;
  onToken: (token: string) => void;
  onComplete: (response: DeliberationResponse) => void;
  onError: (error: string) => void;
}

export async function sendDeliberationQuestion(
  dossier: TechnicalDossier,
  question: string
): Promise<DeliberationResponse> {
  const res = await fetch(`${API_BASE}/deliberate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ dossier, question }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Gagal berkonsultasi dengan AI Deliberation Partner.');
  }
  const json = await res.json();
  return {
    answer: json.answer || '',
    anchors: json.anchors || [],
    newAuditedRepo: json.newAuditedRepo,
    newEvidenceItem: json.newEvidenceItem,
  };
}

export async function streamDeliberationQuestion(
  dossier: TechnicalDossier,
  question: string,
  callbacks: StreamDeliberationCallbacks
): Promise<void> {
  const res = await fetch(`${API_BASE}/deliberate/stream`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ dossier, question }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const errorMsg = err.error || `Koneksi streaming deliberasi gagal (${res.status}): ${res.statusText}`;
    callbacks.onError(errorMsg);
    return;
  }

  const reader = res.body?.getReader();
  if (!reader) {
    callbacks.onError('ReadableStream tidak didukung di lingkungan peramban ini.');
    return;
  }

  const decoder = new TextDecoder();
  let buffer = '';
  let tokenBuffer = '';
  let flushTimer: number | null = null;

  const flushTokens = () => {
    if (tokenBuffer) {
      const chunk = tokenBuffer;
      tokenBuffer = '';
      callbacks.onToken(chunk);
    }
    if (flushTimer) {
      clearTimeout(flushTimer);
      flushTimer = null;
    }
  };

  const scheduleFlush = () => {
    if (!flushTimer) {
      flushTimer = window.setTimeout(flushTokens, 40);
    }
  };

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const chunks = buffer.split('\n\n');
      buffer = chunks.pop() || '';

      for (const chunk of chunks) {
        const trimmed = chunk.trim();
        if (!trimmed.startsWith('data:')) continue;
        const jsonStr = trimmed.slice(5).trim();
        if (!jsonStr) continue;

        try {
          const payload = JSON.parse(jsonStr);
          if (payload.type === 'token' && typeof payload.token === 'string') {
            tokenBuffer += payload.token;
            scheduleFlush();
          } else if (payload.type === 'status' && typeof payload.message === 'string') {
            callbacks.onStatus?.(payload.message);
          } else if (payload.type === 'done') {
            flushTokens();
            callbacks.onComplete({
              answer: payload.answer || '',
              anchors: payload.anchors || [],
              newAuditedRepo: payload.newAuditedRepo,
              newEvidenceItem: payload.newEvidenceItem,
            });
          } else if (payload.type === 'error') {
            flushTokens();
            callbacks.onError(payload.error || 'Terjadi galat pada AI deliberation stream.');
          }
        } catch (parseErr) {
          console.warn('[DeliberationStream] Parse SSE chunk skipped:', parseErr);
        }
      }
    }
  } catch (err: unknown) {
    flushTokens();
    const msg = err instanceof Error ? err.message : String(err);
    callbacks.onError(msg);
  } finally {
    flushTokens();
  }
}
