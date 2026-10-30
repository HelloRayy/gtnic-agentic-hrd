import type { Request, Response } from 'express';
import { Octokit } from '@octokit/rest';
import { config } from '../../config/env.js';
import { routerClient } from '../../providers/routerClient.js';
import { auditPipeline } from '../../workflow/pipeline.js';
import type { TechnicalDossier, DiscoveredRepo, ConstructiveFeedbackDraft } from '../../core/types.js';

function parseSelectedRepos(raw: unknown): string[] | undefined {
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : undefined;
    } catch {
      return raw.split(',').map((s) => s.trim()).filter(Boolean);
    }
  }
  return Array.isArray(raw) ? raw : undefined;
}

export async function handleAuditRequest(req: Request, res: Response): Promise<void> {
  try {
    const cvBuffer = req.file?.buffer;
    const { jobTitle, jobDesc, manualGithubUrl, cvText, selectedRepos: rawRepos } = req.body;
    const effectiveGithubUrl = manualGithubUrl || req.body?.githubUrl;
    if (!cvBuffer && !cvText) {
      res.status(400).json({
        success: false,
        error: 'Please upload a CV (PDF) or provide CV text.',
      });
      return;
    }

    const dossier = await auditPipeline.execute({
      cvBuffer,
      cvText,
      jobTitle: jobTitle || 'Fullstack Engineer',
      jobDesc: jobDesc || 'Building enterprise SaaS with React, TypeScript, and Node.js.',
      manualGithubUrl: effectiveGithubUrl,
      selectedRepos: parseSelectedRepos(rawRepos),
    });

    res.json({
      success: true,
      data: dossier,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[AuditController] Error:', msg);
    res.status(500).json({
      success: false,
      error: msg || 'Internal Agent Execution Error',
    });
  }
}

export async function handleSampleAudit(_req: Request, res: Response): Promise<void> {
  try {
    const sampleCvText = `
John Doe - Senior Fullstack Engineer
Email: john.doe@example.com
GitHub: https://github.com/octocat
Skills: TypeScript, React, Node.js, Docker, PostgreSQL, CI/CD, Microservices
Experience:
5+ years designing distributed web systems, REST APIs, and modern React SPAs.
Implemented automated testing pipelines and containerized deployments.
    `.trim();

    const dossier = await auditPipeline.execute({
      cvText: sampleCvText,
      jobTitle: 'Senior Fullstack Engineer (Enterprise)',
      jobDesc: 'Requires 4+ years React, TypeScript, Node.js, Docker, and CI/CD pipelines.',
      manualGithubUrl: 'https://github.com/octocat',
    });

    res.json({
      success: true,
      data: dossier,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({
      success: false,
      error: msg,
    });
  }
}

export async function handleStreamAudit(req: Request, res: Response): Promise<void> {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  const isSample = req.path.includes('/sample') || req.query.sample === 'true';
  const cvBuffer = req.file?.buffer;
  const { jobTitle, jobDesc, manualGithubUrl, cvText, selectedRepos: rawRepos } = req.body || {};
  const effectiveGithubUrl = manualGithubUrl || req.body?.githubUrl;

  let input;
  if (isSample) {
    input = {
      cvText: `
John Doe - Senior Fullstack Engineer
Email: john.doe@example.com
GitHub: https://github.com/octocat
Skills: TypeScript, React, Node.js, Docker, PostgreSQL, CI/CD, Microservices
Experience:
5+ years designing distributed web systems, REST APIs, and modern React SPAs.
Implemented automated testing pipelines and containerized deployments.
      `.trim(),
      jobTitle: 'Senior Fullstack Engineer (Enterprise)',
      jobDesc: 'Requires 4+ years React, TypeScript, Node.js, Docker, and CI/CD pipelines.',
      manualGithubUrl: 'https://github.com/octocat',
    };
  } else {
    input = {
      cvBuffer,
      cvText,
      jobTitle: jobTitle || 'Fullstack Engineer',
      jobDesc: jobDesc || 'Building enterprise SaaS with React, TypeScript, and Node.js.',
      manualGithubUrl: effectiveGithubUrl,
      selectedRepos: parseSelectedRepos(rawRepos),
    };
  }

  try {
    const dossier = await auditPipeline.execute(input, (event) => {
      res.write(`data: ${JSON.stringify({ type: 'progress', event })}\n\n`);
    });

    res.write(`data: ${JSON.stringify({ type: 'complete', data: dossier })}\n\n`);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    res.write(`data: ${JSON.stringify({ type: 'error', error: msg })}\n\n`);
  } finally {
    res.end();
  }
}

export async function handleDiscoverRepos(req: Request, res: Response): Promise<void> {
  try {
    const rawInput =
      (req.query.url as string) ||
      (req.query.username as string) ||
      (req.body?.url as string) ||
      (req.body?.username as string) ||
      '';

    const match = rawInput.match(/github\.com\/([a-zA-Z0-9_-]+)/i);
    const username = match ? match[1] : rawInput.trim().replace(/^@/, '');

    if (!username) {
      res.status(400).json({ success: false, error: 'Username atau URL GitHub kandidat wajib diisi.' });
      return;
    }

    const rawSkills = req.query.skills || req.body?.skills;
    const targetSkills: string[] = typeof rawSkills === 'string'
      ? rawSkills.split(',').map((s) => s.trim())
      : Array.isArray(rawSkills)
        ? rawSkills
        : [];

    const octokit = new Octokit({ auth: config.githubToken || undefined });
    const { data: repos } = await octokit.rest.repos.listForUser({
      username,
      sort: 'pushed',
      direction: 'desc',
      per_page: 30,
    });

    const originalRepos = repos.filter((r) => !r.fork && !r.archived);
    const targetSkillsLower = targetSkills.map((s) => s.toLowerCase());

    const discovered = originalRepos.map((r) => {
      let score = 0;
      let reason = 'Repositori publik aktif.';
      const nameLower = r.name.toLowerCase();
      const descLower = (r.description || '').toLowerCase();
      const langLower = (r.language || '').toLowerCase();
      const rawTopics = 'topics' in r && Array.isArray(r.topics) ? r.topics : [];
      const topics = rawTopics.map((t: string) => t.toLowerCase());

      const matched: string[] = [];
      for (const skill of targetSkillsLower) {
        if (langLower.includes(skill) || skill.includes(langLower)) {
          score += 10;
          if (r.language) matched.push(r.language);
        }
        if (nameLower.includes(skill)) {
          score += 8;
          matched.push(skill);
        }
        if (descLower.includes(skill)) {
          score += 5;
          matched.push(skill);
        }
        if (topics.some((t: string) => t.includes(skill))) {
          score += 6;
          matched.push(skill);
        }
      }

      if (r.stargazers_count && r.stargazers_count > 0) score += Math.min(r.stargazers_count, 5);

      if (matched.length > 0) {
        reason = `Cocok dengan kualifikasi: ${Array.from(new Set(matched)).join(', ')}`;
      }

      return {
        name: r.name,
        description: r.description || 'Tidak ada deskripsi',
        language: r.language || 'Plain Text',
        stars: r.stargazers_count || 0,
        lastUpdated: r.pushed_at || r.updated_at || new Date().toISOString(),
        isRecommended: score >= 6,
        recommendationReason: reason,
        _score: score,
      };
    });

    discovered.sort((a, b) => b._score - a._score);
    for (let i = 0; i < Math.min(3, discovered.length); i++) {
      discovered[i].isRecommended = true;
    }

    const cleanRepos: DiscoveredRepo[] = discovered.map(({ _score, ...rest }) => rest);
    res.json({ success: true, username, repos: cleanRepos });
  } catch (err: unknown) {
    const isRateLimit =
      err !== null &&
      typeof err === 'object' &&
      'status' in err &&
      err.status === 403;

    if (isRateLimit) {
      res.json({
        success: true,
        isFallback: true,
        repos: [
          {
            name: 'distributed-order-service',
            description: 'High-throughput microservices order queue system with event streaming',
            language: 'TypeScript',
            stars: 42,
            lastUpdated: new Date().toISOString(),
            isRecommended: true,
            recommendationReason: 'Rekomendasi AI: Memuat arsitektur microservices & caching.',
          },
          {
            name: 'cloud-infra-automation',
            description: 'Docker and CI/CD automation pipeline for deployment',
            language: 'Shell',
            stars: 12,
            lastUpdated: new Date().toISOString(),
            isRecommended: true,
            recommendationReason: 'Rekomendasi AI: Memuat artefak Docker & CI/CD.',
          },
          {
            name: 'data-analytics-api',
            description: 'FastAPI Python service for real-time analytics',
            language: 'Python',
            stars: 8,
            lastUpdated: new Date().toISOString(),
            isRecommended: true,
            recommendationReason: 'Rekomendasi AI: Implementasi backend Python & API.',
          },
        ],
      });
      return;
    }

    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ success: false, error: msg });
  }
}

export async function handleDeliberationChat(req: Request, res: Response): Promise<void> {
  try {
    const body = req.body as Record<string, unknown>;
    const question = typeof body.question === 'string'
      ? body.question
      : typeof body.message === 'string'
      ? body.message
      : '';

    if (!question) {
      res.status(400).json({ success: false, error: 'Pertanyaan deliberasi wajib diisi.' });
      return;
    }

    // Extract dossier either directly or reconstruct from flat payload fields
    const rawDossier = body.dossier && typeof body.dossier === 'object' ? (body.dossier as Partial<TechnicalDossier>) : null;
    const candidateName = typeof body.candidateName === 'string'
      ? body.candidateName
      : rawDossier?.candidate?.name || 'Kandidat';
    const jobTitle = typeof body.jobTitle === 'string'
      ? body.jobTitle
      : rawDossier?.jobTitle || 'Software Engineer';
    const auditedRepos: string[] = Array.isArray(body.auditedRepos)
      ? (body.auditedRepos as string[])
      : rawDossier?.auditedRepos || [];
    const overallAssessment = typeof body.overallAssessment === 'string'
      ? body.overallAssessment
      : rawDossier?.overallAssessment || 'Assessment kandidat teknis.';

    const evidenceMatrix = Array.isArray(rawDossier?.evidenceMatrix)
      ? rawDossier.evidenceMatrix
      : [];

    if (!routerClient.isConfigured) {
      res.json({
        success: true,
        answer: `[Mode Simulasi Co-Pilot] Pertanyaan Anda terkait kandidat ${candidateName}: "${question}". Kandidat ini memiliki ${evidenceMatrix.filter((e) => e.status === 'VERIFIED').length} klaim terverifikasi di repositori ${auditedRepos.join(', ') || 'publik'}. Analisis codebase menunjukkan pola arsitektur yang konsisten dengan standar teknis modern.`,
        anchors: auditedRepos.slice(0, 2),
      });
      return;
    }

    const systemPrompt = `You are TalentTrace Deliberation Partner, an elite engineering recruitment co-pilot discussing candidate technical assessment.
Rules:
1. Always respond in natural, professional, incisive Bahasa Indonesia.
2. Ground your answers strictly in the candidate's actual dossier and repository facts.
3. Be candid, balanced, and objective (highlight genuine strengths and real risks).
4. Output valid JSON only: { "answer": "your answer in Bahasa Indonesia", "anchors": ["repo/file references"] }`.trim();

    const userPrompt = `
Kandidat: ${candidateName}
Target Posisi: ${jobTitle}
Repositori yang Diaudit: ${auditedRepos.join(', ')}
Ringkasan Eksekutif: ${overallAssessment}
Matriks Bukti Klaim:
${evidenceMatrix.map((e) => `- [${e.status}] ${e.claim}: ${e.evidenceSummary} (Repo: ${e.repoAnchor || 'null'})`).join('\n')}

Pertanyaan Tim Rekruter/Tech Lead:
${question}
    `.trim();

    const response = await routerClient.completeStructured(systemPrompt, userPrompt);
    res.json({
      success: true,
      answer: response.answer || 'Analisis selesai.',
      anchors: response.anchors || [],
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ success: false, error: msg });
  }
}

export async function handleConstructiveFeedback(req: Request, res: Response): Promise<void> {
  try {
    const { dossier } = req.body as { dossier: TechnicalDossier };

    if (!dossier) {
      res.status(400).json({ success: false, error: 'Dossier kandidat wajib disertakan.' });
      return;
    }

    const verifiedSkills = dossier.evidenceMatrix.filter((e) => e.status === 'VERIFIED').map((e) => e.claim);
    const unverifiedSkills = dossier.evidenceMatrix.filter((e) => e.status === 'NO_PUBLIC_EVIDENCE').map((e) => e.claim);
    const candidateName = dossier.candidate.name;
    const jobTitle = dossier.jobTitle;

    if (!routerClient.isConfigured) {
      const fallbackDraft: ConstructiveFeedbackDraft = {
        subject: `Update Proses Rekrutmen: Posisi ${jobTitle} - ${candidateName}`,
        body: `Halo ${candidateName},\n\nTerima kasih banyak atas waktu dan minat Anda untuk posisi ${jobTitle}. Tim engineering kami sangat mengapresiasi portofolio Anda, khususnya keahlian pada ${verifiedSkills.join(', ')}.\n\nUntuk posisi ini, kami saat ini memprioritaskan kandidat yang memiliki rekam jejak mendalam pada ${unverifiedSkills.join(', ')} di lingkungan produksi. Kami mendorong Anda untuk terus memperdalam aspek tersebut dan sangat menyambut aplikasi Anda di masa mendatang.\n\nSalam hangat,\nTim Engineering Recruitment`,
        strengthsHighlighted: verifiedSkills.slice(0, 3),
        recommendedLearning: unverifiedSkills.slice(0, 3),
      };
      res.json({ success: true, draft: fallbackDraft });
      return;
    }

    const systemPrompt = `You are TalentTrace Constructive Feedback Engine.
Your objective: Draft an empathetic, highly constructive rejection & growth feedback email for a candidate who did not pass all qualifications.
Rules:
1. Full Bahasa Indonesia, professional, supportive, warm.
2. Genuinely highlight their verified strengths based on code evidence.
3. Provide actionable, encouraging learning advice on the missing skills without being condescending.
4. Output valid JSON:
{
  "subject": "Judul email...",
  "body": "Isi email lengkap...",
  "strengthsHighlighted": ["skill 1", "skill 2"],
  "recommendedLearning": ["topik 1", "topik 2"]
}`.trim();

    const userPrompt = `
Kandidat: ${candidateName}
Posisi: ${jobTitle}
Keahlian Terverifikasi: ${verifiedSkills.join(', ') || 'Fondasi pemrograman'}
Keahlian Belum Terbukti: ${unverifiedSkills.join(', ') || 'Infrastruktur tingkat lanjut'}
Ringkasan Audit: ${dossier.overallAssessment}
    `.trim();

    const draftResponse = await routerClient.completeStructured(systemPrompt, userPrompt);
    res.json({
      success: true,
      draft: draftResponse as ConstructiveFeedbackDraft,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ success: false, error: msg });
  }
}
