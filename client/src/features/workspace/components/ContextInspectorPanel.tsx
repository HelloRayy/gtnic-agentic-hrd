import React, { useState, useEffect } from 'react';
import { BookOpen, Sparkles, Calendar, Code2, FileText } from 'lucide-react';
import { EvidenceMatrixView } from './inspector/EvidenceMatrixView.js';
import { WebIdeInspectorView } from './inspector/WebIdeInspectorView.js';
import { InvestigationRadarView } from './inspector/InvestigationRadarView.js';
import { InterviewActionView } from './inspector/InterviewActionView.js';
import { CvDocumentView } from './inspector/CvDocumentView.js';
import type { WorkspaceCandidate } from '../types.js';
import type { GoogleAuthStatus } from '@/types/audit.js';

export type InspectorTab = 'ide' | 'cv' | 'matrix' | 'radar' | 'action';

interface ContextInspectorPanelProps {
  candidate: WorkspaceCandidate | null;
  googleStatus: GoogleAuthStatus | null;
  targetTab?: InspectorTab;
}

export const ContextInspectorPanel: React.FC<ContextInspectorPanelProps> = ({
  candidate,
  googleStatus,
  targetTab,
}) => {
  const [activeTab, setActiveTab] = useState<InspectorTab>('ide');

  useEffect(() => {
    if (targetTab) {
      setActiveTab(targetTab);
    }
  }, [targetTab]);

  return (
    <aside className="result-pane select-none">
      {/* Authentic OpenDots Pane Header & Tabs */}
      <div className="pane-header">
        <div className="pane-tabs">
          <button
            type="button"
            className={activeTab === 'ide' ? 'selected' : ''}
            onClick={() => setActiveTab('ide')}
            title="Mini Forensic IDE (Inspeksi berkas kode & anotasi AST)"
          >
            <Code2 size={14} />
            <span>IDE</span>
          </button>
          <button
            type="button"
            className={activeTab === 'cv' ? 'selected' : ''}
            onClick={() => setActiveTab('cv')}
            title="Dokumen CV Pelamar"
          >
            <FileText size={14} />
            <span>CV</span>
          </button>
          <button
            type="button"
            className={activeTab === 'matrix' ? 'selected' : ''}
            onClick={() => setActiveTab('matrix')}
          >
            <BookOpen size={14} />
            <span>Bukti</span>
          </button>
          <button
            type="button"
            className={activeTab === 'radar' ? 'selected' : ''}
            onClick={() => setActiveTab('radar')}
          >
            <Sparkles size={14} />
            <span>Radar</span>
          </button>
          <button
            type="button"
            className={activeTab === 'action' ? 'selected' : ''}
            onClick={() => setActiveTab('action')}
          >
            <Calendar size={14} />
            <span>Aksi</span>
          </button>
        </div>
      </div>

      {/* Tab Panels Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {!candidate ? (
          <div className="p-6 text-center space-y-3 bg-white border border-[#e9e8e6] rounded-xl my-4">
            <div className="w-10 h-10 mx-auto rounded-full bg-[#f4f3f0] flex items-center justify-center text-[#7285d5]">
              <Code2 size={18} />
            </div>
            <div className="text-xs font-semibold text-[#333641]">
              Panel Forensik Siap
            </div>
            <p className="text-[11px] text-[#8c8d97] leading-relaxed m-0">
              Pilih atau tambahkan kandidat untuk menginspeksi Mini Forensic IDE, dokumen CV asli, matriks bukti kode, radar investigasi wawancara, dan Google Meet.
            </p>
          </div>
        ) : (
          <>
            {activeTab === 'ide' && (
              <WebIdeInspectorView
                dossier={candidate.dossier}
                auditedRepos={candidate.dossier.auditedRepos}
                githubUsername={candidate.dossier.candidate.githubUsername}
              />
            )}

            {activeTab === 'cv' && (
              <CvDocumentView dossier={candidate.dossier} />
            )}

            {activeTab === 'matrix' && (
              <EvidenceMatrixView
                evidenceMatrix={candidate.dossier.evidenceMatrix}
                githubUsername={candidate.dossier.candidate.githubUsername}
                onInspectCode={() => setActiveTab('ide')}
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
