import type { TechnicalDossier, DeliberationMessage } from '@/types/audit.js';

export interface WorkspaceCandidate {
  id: string;
  name: string;
  role: string;
  status: 'verified' | 'partial' | 'warning' | 'unverified';
  statusLabel: string;
  matchScore: number;
  avatarSeed: string;
  githubUrl: string;
  reposCount: number;
  dossier: TechnicalDossier;
  chatHistory: DeliberationMessage[];
}
