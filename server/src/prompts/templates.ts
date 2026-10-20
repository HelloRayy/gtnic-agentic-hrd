import type { CandidateProfile, RepoAuditEvidence } from '../core/types.js';

function sanitizeForPrompt(obj: any): string {
  const json = JSON.stringify(obj, null, 2);
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
3. Formulate 3-4 tailored contextual interview questions based on the candidate's real code decisions.
4. AMBIGUITY & CLARIFICATION: Formulate 2-3 friendly clarification prompts under "clarificationPrompts" for anything ambiguous (e.g., git author name vs github username, unlinked git configs, skills likely used in private NDA projects, etc.).
5. Strictly follow Explainable AI: DO NOT output arbitrary scores.
6. Use null instead of undefined for missing string properties.
7. Return ONLY a valid JSON object matching this schema:
{
  "overallAssessment": "string summarizing technical match",
  "evidenceMatrix": [
    {
      "claim": "string",
      "status": "VERIFIED" | "NO_PUBLIC_EVIDENCE" | "PARTIAL",
      "evidenceSummary": "string",
      "repoAnchor": "string or null",
      "fileAnchor": "string or null"
    }
  ],
  "interviewKit": [
    {
      "topic": "string",
      "question": "string",
      "context": "string",
      "codeAnchor": "string or null",
      "expectedInsight": "string"
    }
  ],
  "clarificationPrompts": [
    "string (friendly clarification item for interviewer, e.g. 'Konfirmasi apakah username git X adalah akun lokal kandidat')"
  ]
}
`.trim();
}
