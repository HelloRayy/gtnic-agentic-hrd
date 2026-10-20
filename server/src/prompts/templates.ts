import type { CandidateProfile, RepoAuditEvidence } from '../core/types.js';

function sanitizeForPrompt(obj: any): string {
  const json = JSON.stringify(obj, null, 2);
  // Neutralize closing tags to prevent delimiter escape
  return json.replace(/<\/untrusted_code_evidence>/gi, '&lt;/untrusted_code_evidence&gt;');
}

export function formatSynthesisPrompt(
  candidate: CandidateProfile,
  jobTitle: string,
  jobDesc: string,
  repos: RepoAuditEvidence[]
): string {
  return `
<job_specification>
Role: ${jobTitle}
Description: ${jobDesc}
</job_specification>

<candidate_profile>
Name: ${candidate.name}
Claimed Skills: ${candidate.claimedSkills.join(', ')}
Summary: ${candidate.summary || 'None'}
</candidate_profile>

<untrusted_code_evidence>
${sanitizeForPrompt(repos)}
</untrusted_code_evidence>

INSTRUCTIONS:
1. Compare each claimed skill against the physical evidence found in the repos (manifest dependencies, CI/CD, tests, file tree, commits).
2. For each major claim, assign status: 'VERIFIED' | 'NO_PUBLIC_EVIDENCE' | 'PARTIAL'.
3. Formulate 3-4 tailored contextual interview questions based on the candidate's real code decisions (referencing specific repos or manifest patterns).
4. Strictly follow Explainable AI: DO NOT output arbitrary scores.
5. Use null instead of undefined for missing string properties.
6. Return ONLY a valid JSON object matching this schema:
{
  "overallAssessment": "string summarizing technical match",
  "evidenceMatrix": [
    {
      "claim": "string (e.g. React & TypeScript)",
      "status": "VERIFIED" | "NO_PUBLIC_EVIDENCE" | "PARTIAL",
      "evidenceSummary": "string describing evidence found",
      "repoAnchor": "string or null",
      "fileAnchor": "string or null"
    }
  ],
  "interviewKit": [
    {
      "topic": "string",
      "question": "string (contextual technical question)",
      "context": "string (why this question is asked based on their repo)",
      "codeAnchor": "string or null",
      "expectedInsight": "string (what to look for in candidate answer)"
    }
  ]
}
`.trim();
}
