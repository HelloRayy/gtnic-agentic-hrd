export interface CandidateProfile {
  name: string;
  email?: string;
  githubUrl?: string;
  githubUsername?: string;
  claimedSkills: string[];
  summary?: string;
}

export type AuthorshipStatus = 'MATCHED' | 'UNLINKED_GIT_CONFIG' | 'THIRD_PARTY_OWNED';

export interface RepoCommitItem {
  sha: string;
  shortSha: string;
  message: string;
  authorName: string;
  authorLogin?: string;
  authorAvatar?: string;
  date: string;
  url: string;
  verified?: boolean;
}

export interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface ContributionCalendarData {
  totalContributions: number;
  days: ContributionDay[];
  streak?: number;
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
  commitCountSample: number;
  isSquashedOrMigrated: boolean;
  recentCommitSample: string[];
  commitHistory?: RepoCommitItem[];
  license: string | null;
  isMonorepo: boolean;
  authorshipStatus: AuthorshipStatus;
  authorshipNote: string;
  commitAuthors: string[];
  isPotentialClone: boolean;
  cached?: boolean;
  homepageUrl?: string | null;
}

export interface EvidenceItem {
  claim: string;
  status: 'VERIFIED' | 'NO_PUBLIC_EVIDENCE' | 'PARTIAL' | 'TRANSFERABLE';
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
  greenFlags?: string[];
  redFlags?: string[];
  investigationTarget?: string;
}

export interface TraceEvent {
  step: string;
  phase: 'PLAN' | 'TOOL_CALL' | 'OBSERVATION' | 'REFLECTION';
  timestamp: string;
  detail: string;
  metadata?: Record<string, unknown>;
}

export interface TechnicalDossier {
  id?: string;
  createdAt?: string;
  candidate: CandidateProfile;
  jobTitle: string;
  overallAssessment: string;
  evidenceMatrix: EvidenceItem[];
  interviewKit: InterviewQuestion[];
  clarificationPrompts: string[];
  auditedRepos: string[];
  repoDetails?: RepoAuditEvidence[];
  executionTimeMs: number;
  traceEvents?: TraceEvent[];
  liveDemos?: { repoName: string; url: string }[];
}

export interface GoogleAuthStatus {
  isConfigured: boolean;
  isAuthenticated: boolean;
  email: string | null;
}

export interface ScheduleInterviewPayload {
  candidateName: string;
  candidateEmail: string;
  jobTitle: string;
  startTime: string;
  durationMinutes?: number;
  interviewTopics?: string[];
  interviewerNotes?: string;
  sendEmail?: boolean;
}

export interface ScheduleInterviewResponse {
  success: boolean;
  data?: {
    calendar: {
      status: string;
      eventId: string;
      eventLink?: string;
      meetLink?: string;
      startTime: string;
      endTime: string;
      summary: string;
      attendees: string[];
      isLive: boolean;
    };
    mail?: {
      status: string;
      messageId: string;
      recipient: string;
      subject: string;
      isLive: boolean;
      previewBody: string;
    } | null;
  };
  error?: string;
}

export interface DiscoveredRepo {
  name: string;
  description: string;
  language: string;
  stars: number;
  lastUpdated: string;
  isRecommended: boolean;
  recommendationReason?: string;
}

export interface DeliberationMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  anchors?: string[];
}

export interface ConstructiveFeedbackDraft {
  subject: string;
  body: string;
  strengthsHighlighted: string[];
  recommendedLearning: string[];
}
