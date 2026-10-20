import { parseCvBuffer, parseCvText } from '../tools/cvParser.js';
import { fetchUserRepos, auditRepo } from '../tools/githubAuditor.js';
import { runReasoningEngine } from './llmRouter.js';
import type { CandidateProfile, RepoAuditEvidence, TechnicalDossier } from '../types/agent.js';

export interface AuditInput {
  cvBuffer?: Buffer;
  cvText?: string;
  jobTitle?: string;
  jobDesc?: string;
  manualGithubUrl?: string;
}

export async function executeAgentAudit(input: AuditInput): Promise<TechnicalDossier> {
  const startTime = Date.now();
  let candidate: CandidateProfile;

  if (input.cvBuffer) {
    const parsed = await parseCvBuffer(input.cvBuffer);
    candidate = parsed.profile;
  } else if (input.cvText) {
    const parsed = parseCvText(input.cvText);
    candidate = parsed.profile;
  } else {
    throw new Error('Either cvBuffer or cvText must be provided.');
  }

  if (input.manualGithubUrl) {
    candidate.githubUrl = input.manualGithubUrl;
    const match = input.manualGithubUrl.match(/github\.com\/([a-zA-Z0-9_-]+)/i);
    if (match) {
      candidate.githubUsername = match[1];
    }
  }

  const jobTitle = input.jobTitle || 'Senior Software Engineer';
  const jobDesc = input.jobDesc || 'General Engineering Role';

  const auditedRepos: RepoAuditEvidence[] = [];

  if (candidate.githubUsername) {
    const targetRepoNames = await fetchUserRepos(candidate.githubUsername);
    for (const repoName of targetRepoNames) {
      const evidence = await auditRepo(candidate.githubUsername, repoName);
      if (evidence) {
        auditedRepos.push(evidence);
      }
    }
  }

  const dossier = await runReasoningEngine(candidate, jobTitle, jobDesc, auditedRepos, startTime);
  return dossier;
}
