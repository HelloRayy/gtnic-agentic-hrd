import type { TechnicalDossier, DeliberationMessage } from '@/types/audit.js';

export interface WorkspaceCandidate {
  id: string;
  name: string;
  role: string;
  status: 'verified' | 'partial' | 'warning' | 'unverified';
  statusLabel: string;
  stage: 'screening' | 'interview' | 'accepted';
  matchScore: number;
  avatarSeed: string;
  githubUrl: string;
  reposCount: number;
  dossier: TechnicalDossier;
  chatHistory: DeliberationMessage[];
}

export interface ForensicCallout {
  startLine: number;
  endLine: number;
  type: 'VERIFIED' | 'PARTIAL' | 'WARNING';
  claimTitle: string;
  astEvidenceSummary: string;
}

export interface IdeFileSnippet {
  id: string;
  fileName: string;
  filePath: string;
  language: 'typescript' | 'javascript' | 'json' | 'go' | 'python' | 'yaml' | 'sql';
  code: string;
  callouts: ForensicCallout[];
}
