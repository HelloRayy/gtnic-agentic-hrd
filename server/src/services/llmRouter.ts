import OpenAI from 'openai';
import { config } from '../config/env.js';
import type { CandidateProfile, RepoAuditEvidence, TechnicalDossier } from '../types/agent.js';

let openaiClient: OpenAI | null = null;
if (config.router.apiKey) {
  openaiClient = new OpenAI({
    apiKey: config.router.apiKey,
    baseURL: config.router.baseUrl,
  });
}

export async function runReasoningEngine(
  candidate: CandidateProfile,
  jobTitle: string,
  jobDesc: string,
  repos: RepoAuditEvidence[],
  startTime: number
): Promise<TechnicalDossier> {
  const prompt = `
You are TalentTrace AI, an autonomous technical screener & portfolio auditor for enterprise engineering teams.
Your objective: Conduct a fact-based claim-vs-evidence verification comparing candidate claims from their CV against audited public GitHub repositories.

<job_specification>
Role: ${jobTitle}
Description: ${jobDesc}
</job_specification>

<candidate_profile>
Name: ${candidate.name}
Claimed Skills: ${candidate.claimedSkills.join(', ')}
Summary: ${candidate.summary || 'None'}
</candidate_profile>

<audited_github_evidence>
${JSON.stringify(repos, null, 2)}
</audited_github_evidence>

INSTRUCTIONS:
1. Compare each claimed skill against the physical evidence found in the repos (manifest dependencies, CI/CD, tests, file tree).
2. For each major claim, assign status: 'VERIFIED' | 'NO_PUBLIC_EVIDENCE' | 'PARTIAL'.
3. Formulate 3-4 tailored contextual interview questions based on the candidate's real code decisions (referencing specific repos or manifest patterns).
4. Strictly follow Explainable AI: DO NOT output arbitrary scores (e.g. '85/100'). Focus purely on factual verification.
5. Return ONLY a valid JSON object matching this schema:
{
  "overallAssessment": "string summarizing technical match",
  "evidenceMatrix": [
    {
      "claim": "string (e.g. React & TypeScript)",
      "status": "VERIFIED" | "NO_PUBLIC_EVIDENCE" | "PARTIAL",
      "evidenceSummary": "string describing evidence found",
      "repoAnchor": "string or undefined",
      "fileAnchor": "string or undefined"
    }
  ],
  "interviewKit": [
    {
      "topic": "string",
      "question": "string (contextual technical question)",
      "context": "string (why this question is asked based on their repo)",
      "codeAnchor": "string (repo or file reference)",
      "expectedInsight": "string (what to look for in candidate answer)"
    }
  ]
}
`;

  if (openaiClient) {
    try {
      const response = await openaiClient.chat.completions.create({
        model: config.router.defaultModel,
        messages: [
          { role: 'system', content: 'You are an objective enterprise engineering auditor. Output valid JSON only.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.2,
        response_format: { type: 'json_object' },
      });

      const text = response.choices[0]?.message?.content || '{}';
      const parsed = JSON.parse(text);

      return {
        candidate,
        jobTitle,
        overallAssessment: parsed.overallAssessment || 'Assessment completed.',
        evidenceMatrix: parsed.evidenceMatrix || [],
        interviewKit: parsed.interviewKit || [],
        auditedRepos: repos.map(r => r.repoName),
        executionTimeMs: Date.now() - startTime,
      };
    } catch (err: any) {
      console.warn('Router LLM request failed, falling back to deterministic fact matcher:', err.message);
    }
  }

  // Deterministic fallback if API key not set or during offline/mock test
  const allDeps = repos.flatMap(r => r.manifestFiles.flatMap(m => m.dependencies.map(d => d.toLowerCase())));
  const evidenceMatrix = candidate.claimedSkills.map(skill => {
    const isPresent = allDeps.some(d => d.includes(skill.toLowerCase()));
    return {
      claim: skill,
      status: isPresent ? ('VERIFIED' as const) : ('NO_PUBLIC_EVIDENCE' as const),
      evidenceSummary: isPresent
        ? `Found matching package dependency in audited repository manifest.`
        : `No direct reference in public manifest dependencies. Recommended for verbal clarification.`,
      repoAnchor: repos[0]?.repoName,
    };
  });

  const interviewKit = [
    {
      topic: 'Architecture & Scalability',
      question: `In repository ${repos[0]?.repoName || 'primary'}, how did you structure service modularity and manage state across components?`,
      context: `Audited file tree shows modular design in ${repos[0]?.primaryLanguage || 'codebase'}.`,
      codeAnchor: repos[0]?.repoName,
      expectedInsight: 'Demonstrates deep understanding of system boundaries and separation of concerns.',
    },
    {
      topic: 'Testing & Reliability',
      question: repos[0]?.hasTests
        ? `We noticed automated test suites in your repo. How did you determine your coverage thresholds?`
        : `What automated testing strategy would you implement if this codebase scaled to 100k daily active users?`,
      context: repos[0]?.hasTests ? 'Automated test suite detected.' : 'No CI/CD unit tests found in public tree.',
      codeAnchor: repos[0]?.repoName,
      expectedInsight: 'Clarity on test-driven development and deployment reliability.',
    },
  ];

  return {
    candidate,
    jobTitle,
    overallAssessment: `Automated audit verified ${evidenceMatrix.filter(e => e.status === 'VERIFIED').length} out of ${candidate.claimedSkills.length} claims against public repository manifests.`,
    evidenceMatrix,
    interviewKit,
    auditedRepos: repos.map(r => r.repoName),
    executionTimeMs: Date.now() - startTime,
  };
}
