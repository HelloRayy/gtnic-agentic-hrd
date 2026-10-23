import { toolRegistry } from '../tools/index.js';
import { routerClient } from '../providers/routerClient.js';
import { TraceStore } from '../memory/traceStore.js';
import { SYSTEM_PROMPT_ENTERPRISE_AUDITOR } from '../prompts/systemPrompts.js';
import { formatSynthesisPrompt, formatAssessmentPrompt, formatInterviewPrompt } from '../prompts/templates.js';
import type {
  AuditInput,
  CandidateProfile,
  RepoAuditEvidence,
  TechnicalDossier,
  EvidenceItem,
  InterviewQuestion,
} from '../core/types.js';

export class AuditPipeline {
  public async execute(input: AuditInput, onProgress?: (event: any) => void): Promise<TechnicalDossier> {
    const startTime = Date.now();
    const traceStore = new TraceStore(onProgress);

    // 1. Ingestion Phase
    traceStore.log('PLAN', 'INGESTION', 'Initiating candidate CV extraction and metadata parsing.');
    const cvResult = await toolRegistry.executeTool('cv_parser', {
      buffer: input.cvBuffer,
      text: input.cvText,
    });
    const candidate: CandidateProfile = cvResult.profile;

    if (input.manualGithubUrl) {
      candidate.githubUrl = input.manualGithubUrl;
      const match = input.manualGithubUrl.match(/github\.com\/([a-zA-Z0-9_-]+)/i);
      if (match) {
        candidate.githubUsername = match[1];
      }
    }

    traceStore.log(
      'OBSERVATION',
      'INGESTION_COMPLETED',
      `Parsed profile: ${candidate.name}, identified ${candidate.claimedSkills.length} claims, GitHub: ${candidate.githubUsername || 'none'}`
    );

    const jobTitle = input.jobTitle || 'Senior Software Engineer';
    const jobDesc = input.jobDesc || 'General Engineering Role';
    const auditedRepos: RepoAuditEvidence[] = [];

    // 2. Triage & Deep Structural Audit Phase
    if (candidate.githubUsername) {
      traceStore.log('TOOL_CALL', 'GITHUB_TRIAGE', `Searching public original repos for user: ${candidate.githubUsername}`);
      const repoNames = await toolRegistry.executeTool<any, string[]>('github_triage', {
        username: candidate.githubUsername,
      });

      traceStore.log('OBSERVATION', 'GITHUB_TRIAGE', `Selected ${repoNames.length} top repositories for deep inspection: ${repoNames.join(', ')}`);

      for (const repo of repoNames) {
        traceStore.log('TOOL_CALL', 'GITHUB_AUDIT', `Auditing code structure, subfolder manifests, and authorship for: ${repo}`);
        const evidence = await toolRegistry.executeTool<any, RepoAuditEvidence | null>('github_repo_audit', {
          owner: candidate.githubUsername,
          repo,
        });

        if (evidence) {
          auditedRepos.push(evidence);
          traceStore.log(
            'OBSERVATION',
            'GITHUB_AUDIT',
            `Repo ${repo}: Monorepo=${evidence.isMonorepo}, AuthorshipStatus=${evidence.authorshipStatus}, PotentialClone=${evidence.isPotentialClone}, Commits=${evidence.commitCountSample}`
          );
        }
      }
    } else {
      traceStore.log('REFLECTION', 'FALLBACK_MODE', 'No GitHub username detected. Switching to Enterprise Experience Density Index mode.');
    }

    // 3. Synthesis Phase via Parallel Dual-Stream Gateway (Gemini 3.8 Flash Low)
    traceStore.log('PLAN', 'SYNTHESIS', 'Synthesizing Claim-vs-Evidence matrix and formulating tailored contextual interview questions.');

    // Pre-match physical facts deterministically in Node.js
    const allDeps = auditedRepos.flatMap(r => r.manifestFiles.flatMap(m => m.dependencies.map(d => d.toLowerCase())));
    const verifiedSkills: string[] = [];
    const missingSkills: string[] = [];

    for (const skill of candidate.claimedSkills) {
      const lower = skill.toLowerCase();
      if (allDeps.some(d => d.includes(lower))) {
        verifiedSkills.push(skill);
      } else {
        missingSkills.push(skill);
      }
    }

    const preMatchedFacts = {
      matchedDeps: Array.from(new Set(allDeps)).slice(0, 30),
      verifiedSkills,
      missingSkills,
    };

    let overallAssessment = '';
    let evidenceMatrix: EvidenceItem[] = [];
    let interviewKit: InterviewQuestion[] = [];
    let clarificationPrompts: string[] = [];

    if (routerClient.isConfigured) {
      try {
        const assessmentPrompt = formatAssessmentPrompt(candidate, jobTitle, jobDesc, auditedRepos, preMatchedFacts);
        const interviewPrompt = formatInterviewPrompt(candidate, jobTitle, jobDesc, auditedRepos, preMatchedFacts);

        traceStore.log('TOOL_CALL', 'DUAL_SYNTHESIS', 'Dispatching parallel dual-stream synthesis (Assessment + Interview Kit)');

        const [assessmentRes, interviewRes] = await Promise.all([
          routerClient.completeStructured(SYSTEM_PROMPT_ENTERPRISE_AUDITOR, assessmentPrompt),
          routerClient.completeStructured(SYSTEM_PROMPT_ENTERPRISE_AUDITOR, interviewPrompt),
        ]);

        overallAssessment = assessmentRes.overallAssessment || 'Assessment completed.';
        evidenceMatrix = assessmentRes.evidenceMatrix || [];
        interviewKit = interviewRes.interviewKit || [];
        clarificationPrompts = interviewRes.clarificationPrompts || [];

        const modelUsed = assessmentRes._resolvedModel || interviewRes._resolvedModel || 'LLM';
        traceStore.log(
          'OBSERVATION',
          'SYNTHESIS_SUCCESS',
          `Dual-stream parallel synthesis completed in record time via ${modelUsed}.`
        );
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        traceStore.log('REFLECTION', 'SYNTHESIS_FALLBACK', `Parallel LLM error (${message}). Falling back to single-stream or deterministic.`);
      }
    }

    // Deterministic fallback if LLM synthesis returned empty
    if (evidenceMatrix.length === 0) {
      const allDeps = auditedRepos.flatMap(r => r.manifestFiles.flatMap(m => m.dependencies.map(d => d.toLowerCase())));
      evidenceMatrix = candidate.claimedSkills.map(skill => {
        const isPresent = allDeps.some(d => d.includes(skill.toLowerCase()));
        return {
          claim: skill,
          status: isPresent ? ('VERIFIED' as const) : ('NO_PUBLIC_EVIDENCE' as const),
          evidenceSummary: isPresent
            ? 'Ditemukan paket dependensi yang cocok pada manifest repositori yang diaudit.'
            : 'Tidak ditemukan referensi langsung pada manifest repositori publik. Direkomendasikan untuk klarifikasi lisan saat wawancara.',
          repoAnchor: auditedRepos[0]?.repoName || null,
          fileAnchor: null,
        };
      });

      interviewKit = [
        {
          topic: 'Arsitektur & Modularitas Kode',
          question: `Pada repositori ${auditedRepos[0]?.repoName || 'utama'}, bagaimana Anda mengelola batasan komponen dan pemisahan logika bisnis?`,
          context: `Struktur folder repositori menunjukkan susunan berbasis ${auditedRepos[0]?.primaryLanguage || 'standar'}.`,
          codeAnchor: auditedRepos[0]?.repoName || null,
          expectedInsight: 'Memahami prinsip pemisahan tanggung jawab (separation of concerns) dan kebersihan arsitektur sistem.',
        },
        {
          topic: 'Keandalan & Pengujian Otomatis',
          question: auditedRepos[0]?.hasTests
            ? 'Kami mendeteksi adanya automated test suite di repositori Anda. Bagaimana strategi Anda membagi cakupan unit test vs integration test?'
            : 'Strategi pengujian otomatis apa yang akan Anda terapkan jika codebase ini diskalakan ke 100 ribu pengguna aktif harian?',
          context: auditedRepos[0]?.hasTests ? 'Ditemukan rangkaian automated test.' : 'Belum ditemukan unit test atau konfigurasi CI/CD di repositori publik.',
          codeAnchor: auditedRepos[0]?.repoName || null,
          expectedInsight: 'Kejelasan wawasan kandidat terhadap test-driven development dan keandalan rilis produksi.',
        },
      ];

      overallAssessment = `Audit otomatis berhasil memverifikasi ${evidenceMatrix.filter(e => e.status === 'VERIFIED').length} dari total ${candidate.claimedSkills.length} klaim keahlian kandidat terhadap manifest repositori publik yang diaudit.`;
    }

    // 4. Grounding Verification Gate & Ambiguity Clarification Synthesis
    traceStore.log('PLAN', 'SELF_CORRECTION', 'Executing Grounding Verification Gate across synthesized evidence.');
    let correctionCount = 0;

    for (const item of evidenceMatrix) {
      if (item.status === 'VERIFIED') {
        const hasManifestEvidence = allDeps.some(d => d.includes(item.claim.toLowerCase()));
        const hasRepoAnchor = item.repoAnchor && auditedRepos.some(r => r.repoName === item.repoAnchor);
        if (!hasManifestEvidence && !hasRepoAnchor) {
          item.status = 'PARTIAL';
          item.evidenceSummary += ' [Koreksi Mandiri: Diturunkan ke PARTIAL karena tidak ditemukan jangkar fisik manifest]';
          correctionCount++;
        }
      }
    }

    // Automatically inject deterministic ambiguity clarification items
    for (const repo of auditedRepos) {
      if (repo.authorshipStatus === 'UNLINKED_GIT_CONFIG') {
        const prompt = `Klarifikasi Konfigurasi Git (${repo.repoName}): ${repo.authorshipNote}`;
        if (!clarificationPrompts.includes(prompt)) clarificationPrompts.push(prompt);
      } else if (repo.authorshipStatus === 'THIRD_PARTY_OWNED') {
        const prompt = `Klarifikasi Kepemilikan Kode (${repo.repoName}): ${repo.authorshipNote} Tanyakan peran kontribusi spesifik kandidat.`;
        if (!clarificationPrompts.includes(prompt)) clarificationPrompts.push(prompt);
      }
      if (repo.isPotentialClone) {
        const prompt = `Verifikasi Orisinalitas Proyek (${repo.repoName}): Terdapat indikasi proyek kursus/tutorial. Tanyakan bagian arsitektur mana yang dibuat mandiri oleh kandidat.`;
        if (!clarificationPrompts.includes(prompt)) clarificationPrompts.push(prompt);
      }
    }

    traceStore.log(
      'REFLECTION',
      'SELF_CORRECTION_COMPLETED',
      `Grounding verification passed. Self-corrected: ${correctionCount}, Clarification prompts: ${clarificationPrompts.length}. Total execution: ${Date.now() - startTime}ms.`
    );

    return {
      candidate,
      jobTitle,
      overallAssessment,
      evidenceMatrix,
      interviewKit,
      clarificationPrompts,
      auditedRepos: auditedRepos.map(r => r.repoName),
      executionTimeMs: Date.now() - startTime,
      traceEvents: traceStore.getEvents(),
    };
  }
}

export const auditPipeline = new AuditPipeline();
