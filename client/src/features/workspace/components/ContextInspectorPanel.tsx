import React, { useState } from 'react';
import { BookOpen, Monitor, Sparkles, Calendar } from 'lucide-react';
import { EvidenceMatrixView } from './inspector/EvidenceMatrixView.js';
import { WebIdeInspectorView } from './inspector/WebIdeInspectorView.js';
import { InvestigationRadarView } from './inspector/InvestigationRadarView.js';
import { InterviewActionView } from './inspector/InterviewActionView.js';
import type { WorkspaceCandidate } from '../types.js';
import type { GoogleAuthStatus } from '@/types/audit.js';

interface ContextInspectorPanelProps {
  candidate: WorkspaceCandidate;
  googleStatus: GoogleAuthStatus | null;
}

export const ContextInspectorPanel: React.FC<ContextInspectorPanelProps> = ({
  candidate,
  googleStatus,
}) => {
  const [activeTab, setActiveTab] = useState<'matrix' | 'webide' | 'radar' | 'action'>('matrix');
  const { dossier } = candidate;

  return (
    <aside className="result-pane select-none">
      {/* Authentic OpenDots Pane Header & Tabs */}
      <div className="pane-header">
        <div className="pane-tabs">
          <button
            type="button"
            className={activeTab === 'matrix' ? 'selected' : ''}
            onClick={() => setActiveTab('matrix')}
          >
            <BookOpen size={13} />
            <span>Bukti</span>
          </button>
          <button
            type="button"
            className={activeTab === 'webide' ? 'selected' : ''}
            onClick={() => setActiveTab('webide')}
          >
            <Monitor size={13} />
            <span>Web IDE</span>
          </button>
          <button
            type="button"
            className={activeTab === 'radar' ? 'selected' : ''}
            onClick={() => setActiveTab('radar')}
          >
            <Sparkles size={13} />
            <span>Radar</span>
          </button>
          <button
            type="button"
            className={activeTab === 'action' ? 'selected' : ''}
            onClick={() => setActiveTab('action')}
          >
            <Calendar size={13} />
            <span>Aksi</span>
          </button>
        </div>
      </div>

      {/* Tab Panels Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeTab === 'matrix' && (
          <EvidenceMatrixView
            evidenceMatrix={dossier.evidenceMatrix}
            githubUsername={dossier.candidate.githubUsername}
          />
        )}

        {activeTab === 'webide' && (
          <WebIdeInspectorView
            auditedRepos={dossier.auditedRepos}
            githubUsername={dossier.candidate.githubUsername}
            evidenceMatrix={dossier.evidenceMatrix}
            interviewKit={dossier.interviewKit}
          />
        )}

        {activeTab === 'radar' && (
          <InvestigationRadarView interviewKit={dossier.interviewKit} />
        )}

        {activeTab === 'action' && (
          <InterviewActionView dossier={dossier} googleStatus={googleStatus} />
        )}
      </div>
    </aside>
  );
};
