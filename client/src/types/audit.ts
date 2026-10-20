export interface CandidateProfile {
  name: string;
  email?: string;
  githubUrl?: string;
  githubUsername?: string;
  claimedSkills: string[];
  summary?: string;
}

export type AuthorshipStatus = 'MATCHED' | 'UNLINKED_GIT_CONFIG' | 'THIRD_PARTY_OWNED';

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
  commitCountSample: number;
  isSquashedOrMigrated: boolean;
  recentCommitSample: string[];
  license: string | null;
  isMonorepo: boolean;
  authorshipStatus: AuthorshipStatus;
  authorshipNote: string;
  commitAuthors: string[];
  isPotentialClone: boolean;
  cached?: boolean;
}

export interface EvidenceItem {
  claim: string;
  status: 'VERIFIED' | 'NO_PUBLIC_EVIDENCE' | 'PARTIAL';
  evidenceSummary: string;
  repoAnchor: string | null;
  fileAnchor: string | null;
}

export interface InterviewQuestion {
  topic: string;
  question: string;
  context: string;
  codeAnchor: string | null;
  expectedInsight: string;
}

export interface TraceEvent {
  step: string;
  phase: 'PLAN' | 'TOOL_CALL' | 'OBSERVATION' | 'REFLECTION';
  timestamp: string;
  detail: string;
  metadata?: Record<string, any>;
}

export interface TechnicalDossier {
  candidate: CandidateProfile;
  jobTitle: string;
  overallAssessment: string;
  evidenceMatrix: EvidenceItem[];
  interviewKit: InterviewQuestion[];
  clarificationPrompts: string[];
  auditedRepos: string[];
  executionTimeMs: number;
  traceEvents?: TraceEvent[];
}
