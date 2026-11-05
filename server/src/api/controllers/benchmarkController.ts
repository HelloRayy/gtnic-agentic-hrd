import type { Request, Response } from 'express';
import { routerClient } from '../../providers/routerClient.js';
import type { TechnicalDossier } from '../../core/types.js';

interface CandidatePayload {
  name: string;
  role?: string;
  claimedSkills?: string[];
  dossier?: TechnicalDossier;
}

export async function handleDeliberateCompare(req: Request, res: Response): Promise<void> {
  try {
    const body = req.body as Record<string, unknown>;
    const question = typeof body.question === 'string'
      ? body.question.trim()
      : typeof body.message === 'string'
      ? body.message.trim()
      : '';

    if (!question) {
      res.status(400).json({ success: false, error: 'Pertanyaan komparasi wajib diisi.' });
      return;
    }

    const candidateA = body.candidateA as CandidatePayload | undefined;
    const candidateB = body.candidateB as CandidatePayload | undefined;

    if (!candidateA || !candidateB) {
      res.status(400).json({
        success: false,
        error: 'Dua profil kandidat (candidateA dan candidateB) wajib disertakan untuk komparasi head-to-head.',
      });
      return;
    }

    const nameA = candidateA.name || 'Kandidat A';
    const nameB = candidateB.name || 'Kandidat B';
    const dossierA = candidateA.dossier;
    const dossierB = candidateB.dossier;

    const reposA = dossierA?.auditedRepos || [];
    const reposB = dossierB?.auditedRepos || [];

    const verifiedA = dossierA?.evidenceMatrix?.filter((e) => e.status === 'VERIFIED') || [];
    const verifiedB = dossierB?.evidenceMatrix?.filter((e) => e.status === 'VERIFIED') || [];

    if (!routerClient.isConfigured) {
      res.status(503).json({
        success: false,
        error: 'Layanan AI Router belum terhubung. Periksa konfigurasi ROUTER_BASE_URL dan ROUTER_API_KEY pada server.',
      });
      return;
    }

    const systemPrompt = `You are TalentTrace Head-to-Head Arbiter, an elite Principal Software Architect and Engineering Hiring Director.
Your task is to compare two engineering candidates objectively and incisively based on their real audited dossiers and code evidence.
Persona & Guidelines:
1. Two-Tier Response Structure:
   - Direct Executive Verdict: State clearly who has the stronger track record for the specific aspect queried, or articulate the exact architectural trade-off between them.
   - Deep Technical Evidence: Compare their real repos, manifest dependencies, unit test coverage, and code ownership. Cite specific repository names and proof items.
   - Actionable Probing Question: Provide one sharp interview question for each candidate so the Tech Lead can test their true depth during the live interview.
2. Grounded & Unbiased: Never hallucinate features. Strictly adhere to verified facts from Dossier A and Dossier B.
3. Natural Professional Bahasa Indonesia: High-impact, concise, authoritative engineering tone. Zero corporate fluff, zero decorative emojis.
4. Output valid JSON only: { "answer": "your structured comparison in Bahasa Indonesia", "anchors": ["repo1", "repo2"] }`.trim();

    const userPrompt = `
Kandidat A: ${nameA} (${candidateA.role || dossierA?.jobTitle || 'Engineer'})
- Repositori Diaudit: ${reposA.join(', ') || 'Tidak ada'}
- Bukti Terverifikasi (${verifiedA.length}): ${verifiedA.map((v) => `${v.claim}: ${v.evidenceSummary}`).slice(0, 5).join(' | ')}
- Ringkasan Eksekutif: ${dossierA?.overallAssessment || 'N/A'}
- Interview Kit Green Flags: ${dossierA?.interviewKit?.map((k) => k.greenFlags).slice(0, 3).join('; ') || 'N/A'}
- Interview Kit Red Flags: ${dossierA?.interviewKit?.map((k) => k.redFlags).slice(0, 3).join('; ') || 'N/A'}

Kandidat B: ${nameB} (${candidateB.role || dossierB?.jobTitle || 'Engineer'})
- Repositori Diaudit: ${reposB.join(', ') || 'Tidak ada'}
- Bukti Terverifikasi (${verifiedB.length}): ${verifiedB.map((v) => `${v.claim}: ${v.evidenceSummary}`).slice(0, 5).join(' | ')}
- Ringkasan Eksekutif: ${dossierB?.overallAssessment || 'N/A'}
- Interview Kit Green Flags: ${dossierB?.interviewKit?.map((k) => k.greenFlags).slice(0, 3).join('; ') || 'N/A'}
- Interview Kit Red Flags: ${dossierB?.interviewKit?.map((k) => k.redFlags).slice(0, 3).join('; ') || 'N/A'}

Pertanyaan Tim Engineering: "${question}"
`.trim();

    interface ComparisonResult {
      answer: string;
      anchors?: string[];
    }
    try {
      const response = (await routerClient.completeStructured(systemPrompt, userPrompt)) as ComparisonResult;
      res.json({
        success: true,
        answer: response.answer || 'Komparasi selesai diproses.',
        anchors: Array.isArray(response.anchors) ? response.anchors : [...reposA.slice(0, 1), ...reposB.slice(0, 1)],
      });
    } catch (llmErr: unknown) {
      const msg = llmErr instanceof Error ? llmErr.message : String(llmErr);
      res.status(502).json({
        success: false,
        error: `Gagal berkomunikasi dengan AI Router (${msg}). Periksa ketersediaan koneksi 9Router atau model pilihan Anda.`,
      });
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ success: false, error: msg });
  }
}
