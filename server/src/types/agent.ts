export interface CandidateProfile {
  name: string;
  email?: string;
  githubUrl?: string;
  githubUsername?: string;
  claimedSkills: string[];
  summary?: string;
}

export interface RepoAuditEvidence {
  repoName: string;
  repoUrl: string;
  description: string;
  primaryLanguage: string;
  stars: number;
  isFork: boolean;
  lastUpdated: string;
  manifestFiles: { path: string; dependencies: string[] }[];
  fileTreeSample: string[];
  hasTests: boolean;
  hasCiCd: boolean;
  hasDocker: boolean;
}

export interface EvidenceItem {
  claim: string;
  status: 'VERIFIED' | 'NO_PUBLIC_EVIDENCE' | 'PARTIAL';
  evidenceSummary: string;
  repoAnchor?: string;
  fileAnchor?: string;
}

export interface InterviewQuestion {
  topic: string;
  question: string;
  context: string;
  codeAnchor?: string;
  expectedInsight: string;
}

export interface TechnicalDossier {
  candidate: CandidateProfile;
  jobTitle: string;
  overallAssessment: string;
  evidenceMatrix: EvidenceItem[];
  interviewKit: InterviewQuestion[];
  auditedRepos: string[];
  executionTimeMs: number;
}
