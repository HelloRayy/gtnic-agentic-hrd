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
  public async execute(input: AuditInput): Promise<TechnicalDossier> {
    const startTime = Date.now();
    const traceStore = new TraceStore();

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

    // 2. Triage & Audit Phase
    if (candidate.githubUsername) {
      traceStore.log('TOOL_CALL', 'GITHUB_TRIAGE', `Searching public original repos for user: ${candidate.githubUsername}`);
      const repoNames = await toolRegistry.executeTool<any, string[]>('github_triage', {
        username: candidate.githubUsername,
      });

      traceStore.log('OBSERVATION', 'GITHUB_TRIAGE', `Selected ${repoNames.length} top repositories for deep inspection: ${repoNames.join(', ')}`);

      for (const repo of repoNames) {
        traceStore.log('TOOL_CALL', 'GITHUB_AUDIT', `Auditing code structure and manifests for repo: ${repo}`);
        const evidence = await toolRegistry.executeTool<any, RepoAuditEvidence | null>('github_repo_audit', {
          owner: candidate.githubUsername,
          repo,
        });
        if (evidence) {
          auditedRepos.push(evidence);
          traceStore.log(
            'OBSERVATION',
            'GITHUB_AUDIT',
            `Repo ${repo}: CI/CD=${evidence.hasCiCd}, Tests=${evidence.hasTests}, Docker=${evidence.hasDocker}, Manifests=${evidence.manifestFiles.length}`
          );
        }
      }
    } else {
      traceStore.log('REFLECTION', 'FALLBACK_MODE', 'No GitHub username detected. Switching to Deep Resume Experience Reasoner mode.');
    }

    // 3. Synthesis Phase via 9router
    traceStore.log('PLAN', 'SYNTHESIS', 'Synthesizing Claim-vs-Evidence matrix and formulating tailored contextual interview questions.');

    let overallAssessment = '';
    let evidenceMatrix: EvidenceItem[] = [];
    let interviewKit: InterviewQuestion[] = [];

    if (routerClient.isConfigured) {
      try {
        const prompt = formatSynthesisPrompt(candidate, jobTitle, jobDesc, auditedRepos);
        const parsed = await routerClient.completeStructured(SYSTEM_PROMPT_ENTERPRISE_AUDITOR, prompt);

        overallAssessment = parsed.overallAssessment || 'Assessment completed.';
        evidenceMatrix = parsed.evidenceMatrix || [];
        interviewKit = parsed.interviewKit || [];

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

    traceStore.log('REFLECTION', 'PIPELINE_DONE', `Completed full evaluation in ${Date.now() - startTime}ms.`);

    return {
      candidate,
      jobTitle,
      overallAssessment,
      evidenceMatrix,
      interviewKit,
      auditedRepos: auditedRepos.map(r => r.repoName),
      executionTimeMs: Date.now() - startTime,
      traceEvents: traceStore.getEvents(),
    };
  }
}

export const auditPipeline = new AuditPipeline();
