import React, { useState } from 'react';
import { BookOpen, Monitor, Sparkles, Calendar } from 'lucide-react';
import { EvidenceMatrixView } from './inspector/EvidenceMatrixView.js';
import { WebIdeInspectorView } from './inspector/WebIdeInspectorView.js';
import { InvestigationRadarView } from './inspector/InvestigationRadarView.js';
import { InterviewActionView } from './inspector/InterviewActionView.js';
import type { WorkspaceCandidate } from '../types.js';
import type { GoogleAuthStatus } from '@/types/audit.js';

interface ContextInspectorPanelProps {
  candidate: WorkspaceCandidate | null;
  googleStatus: GoogleAuthStatus | null;
}

export const ContextInspectorPanel: React.FC<ContextInspectorPanelProps> = ({
  candidate,
  googleStatus,
}) => {
  const [activeTab, setActiveTab] = useState<'matrix' | 'webide' | 'radar' | 'action'>('matrix');
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
        {!candidate ? (
          <div className="p-6 text-center space-y-3 bg-white border border-[#e9e8e6] rounded-xl my-4">
            <div className="w-10 h-10 mx-auto rounded-full bg-[#f4f3f0] flex items-center justify-center text-[#7285d5]">
              <BookOpen size={18} />
            </div>
            <div className="text-xs font-semibold text-[#333641]">
              Panel Forensik Siap
            </div>
            <p className="text-[11px] text-[#8c8d97] leading-relaxed">
              Pilih atau tambahkan kandidat untuk menginspeksi matriks bukti kode, Web IDE github.dev, radar investigasi wawancara, dan penjadwalan Google Meet.
            </p>
          </div>
        ) : (
          <>
            {activeTab === 'matrix' && (
              <EvidenceMatrixView
                evidenceMatrix={candidate.dossier.evidenceMatrix}
                githubUsername={candidate.dossier.candidate.githubUsername}
              />
            )}

            {activeTab === 'webide' && (
              <WebIdeInspectorView
                auditedRepos={candidate.dossier.auditedRepos}
                githubUsername={candidate.dossier.candidate.githubUsername}
                evidenceMatrix={candidate.dossier.evidenceMatrix}
                interviewKit={candidate.dossier.interviewKit}
              />
            )}

            {activeTab === 'radar' && (
              <InvestigationRadarView interviewKit={candidate.dossier.interviewKit} />
            )}

            {activeTab === 'action' && (
              <InterviewActionView dossier={candidate.dossier} googleStatus={googleStatus} />
            )}
          </>
        )}
      </div>
    </aside>
  );
};
