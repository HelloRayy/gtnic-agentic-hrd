import type { Request, Response } from 'express';
import { Octokit } from '@octokit/rest';
import { config } from '../../config/env.js';
import { routerClient } from '../../providers/routerClient.js';
import { toolRegistry } from '../../tools/index.js';
import type {
  TechnicalDossier,
  EvidenceItem,
  RepoAuditEvidence,
} from '../../core/types.js';

const octokit = new Octokit({ auth: config.githubToken || undefined });

interface DeliberationContext {
  question: string;
  candidateName: string;
  jobTitle: string;
  auditedRepos: string[];
  overallAssessment: string;
  evidenceMatrix: EvidenceItem[];
  userPrompt: string;
  systemPrompt: string;
  newAuditedRepo?: string;
  newEvidenceItem?: EvidenceItem;
}

async function prepareDeliberationContext(
  body: Record<string, unknown>,
  onStatus?: (status: string) => void
): Promise<DeliberationContext> {
  const question = typeof body.question === 'string'
    ? body.question
    : typeof body.message === 'string'
    ? body.message
    : '';

  if (!question) {
    throw new Error('Pertanyaan deliberasi wajib diisi.');
  }

  const rawDossier = body.dossier && typeof body.dossier === 'object'
    ? (body.dossier as Partial<TechnicalDossier>)
    : null;

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

  const evidenceMatrix: EvidenceItem[] = Array.isArray(rawDossier?.evidenceMatrix)
    ? rawDossier.evidenceMatrix
    : [];

  const systemPrompt = `You are TalentTrace Deliberation Partner, an elite engineering recruitment co-pilot discussing candidate technical assessment.
You seamlessly serve both HR Recruiters and Tech Leads with a generalized, high-impact persona:
1. Two-Tier Response Structure:
   - Begin with an intuitive, decisive executive takeaway (so HR immediately understands the hiring recommendation, readiness level, and core risks in clear, accessible language).
   - Follow with concrete technical facts, repository anchors, AST evidence, and architectural specifics (so Tech Leads have undeniable proof).
2. Grounded Truth: Never hallucinate skills or speculate without evidence. Base every claim strictly on the candidate's actual dossier, commit histories, and repository AST facts.
3. Candid & Balanced: Explicitly highlight verified technical strengths alongside real blind spots or missing public proof (no sugarcoating, no unearned praise).
4. Natural Professional Bahasa Indonesia: Speak concisely, authoritatively, and incisively. Zero conversational pleasantries, zero robotic corporate fluff.
5. STRICT FORMATTING RULES:
   - NEVER use markdown heading symbols (#, ##, ###, ####). They clutter the chat interface.
   - Use bold titles (**Judul Bagian**) or numbered lists (1., 2.) to separate sections.
   - Use clean hyphens (-) for bullet points, never asterisks (*).
   - Keep paragraphs concise and easy to read.`.trim();

  let onDemandEvidenceNote = '';
  let newAuditedRepo: string | undefined;
  let newEvidenceItem: EvidenceItem | undefined;

  const githubUsername =
    rawDossier?.candidate?.githubUsername ||
    (typeof body.githubUsername === 'string' ? body.githubUsername : undefined);

  if (githubUsername) {
    try {
      const { data: allRepos } = await octokit.rest.repos.listForUser({
        username: githubUsername,
        per_page: 50,
        sort: 'pushed',
        direction: 'desc',
      });

      const unauditedRepos = allRepos.filter(
        (r) =>
          !r.fork &&
          !r.archived &&
          !auditedRepos.includes(r.name) &&
          r.name.toLowerCase() !== githubUsername.toLowerCase()
      );

      const qLower = question.toLowerCase();
      let targetRepo = unauditedRepos.find((r) => {
        const rName = r.name.toLowerCase();
        const rNorm = rName.replace(/[-_]/g, ' ');
        return qLower.includes(rName) || qLower.includes(rNorm);
      });

      if (!targetRepo) {
        const techKeywords = [
          'websocket', 'socket', 'graphql', 'grpc', 'kafka', 'redis',
          'docker', 'kubernetes', 'python', 'fastapi', 'flutter', 'dart',
          'monorepo', 'next', 'tailwind', 'vue', 'angular', 'django',
          'flask', 'security', 'auth', 'jwt', 'ci/cd', 'actions', 'soccer', 'wifi'
        ];
        const mentioned = techKeywords.filter((k) => qLower.includes(k));
        if (mentioned.length > 0) {
          targetRepo = unauditedRepos.find((r) => {
            const rText = `${r.name} ${r.description || ''} ${r.language || ''}`.toLowerCase();
            return mentioned.some((k) => rText.includes(k));
          });
        }
      }

      if (targetRepo) {
        onStatus?.(`Mengaudit repositori tambahan '${targetRepo.name}' langsung dari GitHub...`);
        const evidence = await toolRegistry.executeTool<Record<string, unknown>, RepoAuditEvidence | null>(
          'github_repo_audit',
          { owner: githubUsername, repo: targetRepo.name }
        );

        if (evidence) {
          newAuditedRepo = targetRepo.name;
          const manifestsSummary = evidence.manifestFiles
            .map((m) => `${m.path} (${m.dependencies.slice(0, 4).join(', ')})`)
            .join('; ');

          onDemandEvidenceNote = `
BUKTI AUDIT ON-DEMAND TERBARU (Baru saja diaudit langsung dari repositori publik tambahan kandidat '${targetRepo.name}'):
- Repositori: ${targetRepo.name} (${targetRepo.html_url})
- Bahasa: ${evidence.primaryLanguage}
- Kepemilikan Author: ${evidence.authorshipStatus} (Commits: ${evidence.commitCountSample})
- Dependensi: ${manifestsSummary || 'Native'}
- Pohon Berkas: ${evidence.fileTreeSample.slice(0, 6).join(', ')}
- Fitur: Docker=${evidence.hasDocker}, Tests=${evidence.hasTests}, CI/CD=${evidence.hasCiCd}
Instruksi: Gunakan temuan riil ini untuk menjawab pertanyaan dan sebutkan bahwa repositori ini baru saja diverifikasi langsung!
`.trim();

          newEvidenceItem = {
            claim: `Implementasi pada proyek ${targetRepo.name}`,
            status: evidence.authorshipStatus === 'MATCHED' ? 'VERIFIED' : 'PARTIAL',
            evidenceSummary: `Diverifikasi on-demand di repo ${targetRepo.name} (${evidence.primaryLanguage}, ${evidence.commitCountSample} commits, dependensi: ${evidence.manifestFiles[0]?.dependencies.slice(0, 3).join(', ') || 'native'}).`,
            repoAnchor: targetRepo.name,
            fileAnchor: evidence.fileTreeSample[0] || null,
          };
        }
      }
    } catch (err: unknown) {
      console.warn('[DeliberationChat] On-demand audit attempt skipped:', err);
    }
  }

  const userPrompt = `
Kandidat: ${candidateName}
Target Posisi: ${jobTitle}
Repositori yang Diaudit: ${auditedRepos.join(', ')}
Ringkasan Eksekutif: ${overallAssessment}
Matriks Bukti Klaim:
${evidenceMatrix.map((e) => `- [${e.status}] ${e.claim}: ${e.evidenceSummary} (Repo: ${e.repoAnchor || 'null'})`).join('\n')}

${onDemandEvidenceNote ? `${onDemandEvidenceNote}\n` : ''}
Pertanyaan Tim Rekruter/Tech Lead:
${question}
  `.trim();

  return {
    question,
    candidateName,
    jobTitle,
    auditedRepos,
    overallAssessment,
    evidenceMatrix,
    userPrompt,
    systemPrompt,
    newAuditedRepo,
    newEvidenceItem,
  };
}

export async function handleDeliberationChat(req: Request, res: Response): Promise<void> {
  try {
    const ctx = await prepareDeliberationContext(req.body as Record<string, unknown>);

    if (!routerClient.isConfigured) {
      res.status(503).json({
        success: false,
        error: 'Layanan AI Router belum terhubung. Periksa konfigurasi ROUTER_BASE_URL dan ROUTER_API_KEY.',
      });
      return;
    }

    interface SynthesisResult {
      answer?: string;
      anchors?: string[];
    }
    const structuredPrompt = `${ctx.systemPrompt}\nOutput valid JSON only: { "answer": "your comprehensive two-tier answer in Bahasa Indonesia", "anchors": ["repo/file references"] }`;
    const response = (await routerClient.completeStructured(structuredPrompt, ctx.userPrompt)) as SynthesisResult;

    res.json({
      success: true,
      answer: response.answer || 'Analisis selesai.',
      anchors: Array.from(new Set([...(response.anchors || []), ...(ctx.newAuditedRepo ? [ctx.newAuditedRepo] : [])])),
      newAuditedRepo: ctx.newAuditedRepo,
      newEvidenceItem: ctx.newEvidenceItem,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ success: false, error: msg });
  }
}

export async function handleStreamDeliberationChat(req: Request, res: Response): Promise<void> {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  try {
    const ctx = await prepareDeliberationContext(
      req.body as Record<string, unknown>,
      (status) => {
        res.write(`data: ${JSON.stringify({ type: 'status', message: status })}\n\n`);
      }
    );

    if (!routerClient.isConfigured) {
      res.write(`data: ${JSON.stringify({
        type: 'error',
        error: 'Layanan AI Router belum terhubung. Periksa konfigurasi ROUTER_BASE_URL dan ROUTER_API_KEY.',
      })}\n\n`);
      res.end();
      return;
    }

    let fullText = '';
    const streamRes = await routerClient.streamChat(
      ctx.systemPrompt,
      ctx.userPrompt,
      (delta) => {
        res.write(`data: ${JSON.stringify({ type: 'token', token: delta })}\n\n`);
      }
    );
    fullText = streamRes.fullText;

    const detectedAnchors = ctx.auditedRepos.filter((r) =>
      fullText.toLowerCase().includes(r.toLowerCase())
    );
    if (ctx.newAuditedRepo && !detectedAnchors.includes(ctx.newAuditedRepo)) {
      detectedAnchors.push(ctx.newAuditedRepo);
    }

    res.write(`data: ${JSON.stringify({
      type: 'done',
      answer: fullText,
      anchors: detectedAnchors.length > 0 ? detectedAnchors : ctx.auditedRepos.slice(0, 2),
      newAuditedRepo: ctx.newAuditedRepo,
      newEvidenceItem: ctx.newEvidenceItem,
    })}\n\n`);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    res.write(`data: ${JSON.stringify({
      type: 'error',
      error: `Gagal berkomunikasi dengan AI Router (${msg}). Periksa ketersediaan koneksi 9Router atau model pilihan Anda.`,
    })}\n\n`);
  } finally {
    res.end();
  }
}
