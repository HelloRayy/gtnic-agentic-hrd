import type { TechnicalDossier } from '../types/audit.js';

const API_BASE = '/api';

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
