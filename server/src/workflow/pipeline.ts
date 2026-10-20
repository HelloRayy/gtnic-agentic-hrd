import { toolRegistry } from '../tools/index.js';
import { routerClient } from '../providers/routerClient.js';
import { TraceStore } from '../memory/traceStore.js';
import { SYSTEM_PROMPT_ENTERPRISE_AUDITOR } from '../prompts/systemPrompts.js';
import { formatSynthesisPrompt } from '../prompts/templates.js';
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

    // 3. Synthesis Phase via 9router (Gemini 3.8 Flash)
    traceStore.log('PLAN', 'SYNTHESIS', 'Synthesizing Claim-vs-Evidence matrix and formulating tailored contextual interview questions.');

    let overallAssessment = '';
    let evidenceMatrix: EvidenceItem[] = [];
    let interviewKit: InterviewQuestion[] = [];
    let clarificationPrompts: string[] = [];

    if (routerClient.isConfigured) {
      try {
        const prompt = formatSynthesisPrompt(candidate, jobTitle, jobDesc, auditedRepos);
        const parsed = await routerClient.completeStructured(SYSTEM_PROMPT_ENTERPRISE_AUDITOR, prompt);

        overallAssessment = parsed.overallAssessment || 'Assessment completed.';
        evidenceMatrix = parsed.evidenceMatrix || [];
        interviewKit = parsed.interviewKit || [];
        clarificationPrompts = parsed.clarificationPrompts || [];

        traceStore.log('OBSERVATION', 'SYNTHESIS_SUCCESS', 'Autonomous verification reasoning completed by LLM gateway.');
      } catch (err: any) {
        traceStore.log('REFLECTION', 'SYNTHESIS_FALLBACK', `LLM error (${err.message}). Falling back to deterministic matching.`);
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
            ? 'Found matching package dependency in audited repository manifest.'
            : 'No direct reference in public manifest dependencies. Recommended for verbal clarification.',
          repoAnchor: auditedRepos[0]?.repoName || null,
          fileAnchor: null,
        };
      });

      interviewKit = [
        {
          topic: 'Architecture & Modularity',
          question: `In repository ${auditedRepos[0]?.repoName || 'primary'}, how did you manage state and component boundaries?`,
          context: `Audited file tree indicates ${auditedRepos[0]?.primaryLanguage || 'standard'} structure.`,
          codeAnchor: auditedRepos[0]?.repoName || null,
          expectedInsight: 'Demonstrates deep understanding of system boundaries and clean code separation.',
        },
        {
          topic: 'Testing & Reliability',
          question: auditedRepos[0]?.hasTests
            ? 'We noticed automated test suites in your repo. How do you approach integration vs unit test coverage?'
            : 'What automated testing strategy would you implement if this codebase scaled to 100k daily active users?',
          context: auditedRepos[0]?.hasTests ? 'Automated test suite detected.' : 'No CI/CD unit tests found in public tree.',
          codeAnchor: auditedRepos[0]?.repoName || null,
          expectedInsight: 'Clarity on test-driven development and deployment reliability.',
        },
      ];

      overallAssessment = `Automated audit verified ${evidenceMatrix.filter(e => e.status === 'VERIFIED').length} out of ${candidate.claimedSkills.length} claims against public repository manifests.`;
    }

    // 4. Grounding Verification Gate & Ambiguity Clarification Synthesis
    traceStore.log('PLAN', 'SELF_CORRECTION', 'Executing Grounding Verification Gate across synthesized evidence.');
    let correctionCount = 0;

    const allDeps = auditedRepos.flatMap(r => r.manifestFiles.flatMap(m => m.dependencies.map(d => d.toLowerCase())));
    for (const item of evidenceMatrix) {
      if (item.status === 'VERIFIED') {
        const hasManifestEvidence = allDeps.some(d => d.includes(item.claim.toLowerCase()));
        const hasRepoAnchor = item.repoAnchor && auditedRepos.some(r => r.repoName === item.repoAnchor);
        if (!hasManifestEvidence && !hasRepoAnchor) {
          item.status = 'PARTIAL';
          item.evidenceSummary += ' [Self-Correction: Downgraded to PARTIAL due to absence of physical manifest anchor]';
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
