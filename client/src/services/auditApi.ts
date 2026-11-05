import type {
  TechnicalDossier,
  TraceEvent,
  GoogleAuthStatus,
  ScheduleInterviewPayload,
  ScheduleInterviewResponse,
  DiscoveredRepo,
  ConstructiveFeedbackDraft,
} from '@/types/audit.js';

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

export async function fetchGoogleAuthStatus(): Promise<GoogleAuthStatus> {
  try {
    const res = await fetch(`${API_BASE}/auth/google/status`);
    if (!res.ok) {
      return { isConfigured: false, isAuthenticated: false, email: null };
    }
    const data = await res.json();
    return {
      isConfigured: Boolean(data.isConfigured),
      isAuthenticated: Boolean(data.isAuthenticated),
      email: data.email || null,
    };
  } catch {
    return { isConfigured: false, isAuthenticated: false, email: null };
  }
}

export async function fetchGoogleAuthUrl(): Promise<string | null> {
  try {
    const res = await fetch(`${API_BASE}/auth/google/url`);
    const data = await res.json();
    return data.success && data.url ? data.url : null;
  } catch {
    return null;
  }
}

export async function disconnectGoogleAccount(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/auth/google/disconnect`, { method: 'POST' });
    return res.ok;
  } catch {
    return false;
  }
}

export async function dispatchScheduleInterview(
  payload: ScheduleInterviewPayload
): Promise<ScheduleInterviewResponse> {
  const res = await fetch(`${API_BASE}/action/schedule-interview`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Failed to schedule interview: ${res.statusText}`);
  }

  return res.json();
}

export async function discoverCandidateRepos(
  usernameOrUrl: string,
  targetSkills?: string[]
): Promise<DiscoveredRepo[]> {
  const skillsQuery = targetSkills && targetSkills.length > 0 ? `&skills=${encodeURIComponent(targetSkills.join(','))}` : '';
  const res = await fetch(`${API_BASE}/discover-repos?url=${encodeURIComponent(usernameOrUrl)}${skillsQuery}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Gagal memuat repositori GitHub kandidat.');
  }
  const json = await res.json();
  return json.repos || [];
}

export {
  sendDeliberationQuestion,
  streamDeliberationQuestion,
  type DeliberationResponse,
  type StreamDeliberationCallbacks,
} from './deliberationApi.js';

export async function generateConstructiveFeedback(
  dossier: TechnicalDossier
): Promise<ConstructiveFeedbackDraft> {
  const res = await fetch(`${API_BASE}/constructive-feedback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ dossier }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Gagal menyusun umpan balik konstruktif.');
  }
  const json = await res.json();
  return json.draft;
}

export async function fetchRepoFileContent(
  owner: string,
  repo: string,
  path: string
): Promise<{ content: string; fileName: string; filePath: string }> {
  const params = new URLSearchParams({ owner, repo, path });
  const res = await fetch(`${API_BASE}/repo/file-content?${params.toString()}`);
  if (!res.ok) {
    throw new Error('Gagal memuat isi berkas dari repositori.');
  }
  const data = await res.json();
  return {
    content: data.content,
    fileName: data.fileName,
    filePath: data.filePath,
  };
}

export interface AuditHistorySummary {
  id: string;
  candidateName: string;
  candidateEmail?: string;
  githubUsername?: string;
  jobTitle: string;
  overallAssessment?: string;
  executionTimeMs: number;
  createdAt: string;
}

export async function fetchAuditHistory(): Promise<AuditHistorySummary[]> {
  const res = await fetch(`${API_BASE}/history`);
  if (!res.ok) {
    throw new Error('Gagal mengambil daftar riwayat audit.');
  }
  const json = await res.json();
  return json.data || [];
}

export async function fetchAuditById(id: string): Promise<TechnicalDossier> {
  const res = await fetch(`${API_BASE}/history/${encodeURIComponent(id)}`);
  if (!res.ok) {
    throw new Error('Gagal memuat detail audit dari database.');
  }
  const json = await res.json();
  return json.data;
}

export async function deleteAuditRecord(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/history/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    throw new Error('Gagal menghapus riwayat audit.');
  }
}

export async function saveAuditRecord(
  dossier: TechnicalDossier,
  candidateName: string,
  jobTitle?: string
): Promise<string> {
  const res = await fetch(`${API_BASE}/history`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: dossier.id,
      candidateName,
      candidateEmail: dossier.candidate.email,
      githubUsername: dossier.candidate.githubUsername,
      jobTitle: jobTitle || dossier.jobTitle,
      overallAssessment: dossier.overallAssessment,
      dossier,
    }),
  });
  if (!res.ok) {
    throw new Error('Gagal menyimpan riwayat audit ke database.');
  }
  const json = await res.json();
  return json.id;
}

export interface BenchmarkDeliberationResponse {
  answer: string;
  anchors: string[];
}

export async function sendBenchmarkDeliberation(
  candidateA: { name: string; role?: string; claimedSkills?: string[]; dossier: TechnicalDossier },
  candidateB: { name: string; role?: string; claimedSkills?: string[]; dossier: TechnicalDossier },
  question: string
): Promise<BenchmarkDeliberationResponse> {
  const res = await fetch(`${API_BASE}/benchmark/deliberate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      candidateA,
      candidateB,
      question,
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Gagal memproses deliberasi komparasi.');
  }
  const json = await res.json();
  return {
    answer: json.answer || '',
    anchors: json.anchors || [],
  };
}
