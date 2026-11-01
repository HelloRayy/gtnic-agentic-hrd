import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Sparkles,
  Calendar,
  Code2,
  FileText,
  Search,
  X,
  Maximize2,
  Minimize2,
} from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState<InspectorTab>('cv');
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (targetTab) {
      setActiveTab(targetTab);
    }
  }, [targetTab]);

  const dossier = candidate?.dossier;
  const verifiedCount = dossier?.evidenceMatrix?.filter((e) => e.status === 'VERIFIED').length || 0;
  const matrixCount = dossier?.evidenceMatrix?.length || 0;
  const radarCount = dossier?.interviewKit?.length || 0;

  return (
    <aside className={`result-pane select-none ${isExpanded ? 'expanded' : ''}`}>
      {/* 1. Zed Style Dock Header: Switcher Tabs & Utility Controls */}
      <div className="pane-header">
        <div className="pane-tabs">
          <button
            type="button"
            className={activeTab === 'cv' ? 'selected' : ''}
            onClick={() => setActiveTab('cv')}
            title="Dokumen CV Asli Pelamar"
          >
            <FileText size={13} />
            <span>CV</span>
          </button>

          <button
            type="button"
            className={activeTab === 'ide' ? 'selected' : ''}
            onClick={() => setActiveTab('ide')}
            title="Mini Forensic IDE ala GitHub PR Review"
          >
            <Code2 size={13} />
            <span>IDE</span>
            {candidate && (
              <span className="text-[10px] font-mono px-1 py-0.2 rounded-full bg-[#e4e2dd] text-[#555866] font-medium leading-none">
                3
              </span>
            )}
          </button>

          <button
            type="button"
            className={activeTab === 'matrix' ? 'selected' : ''}
            onClick={() => setActiveTab('matrix')}
            title="Matriks Bukti Klaim"
          >
            <BookOpen size={13} />
            <span>Bukti</span>
            {matrixCount > 0 && (
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-[#e4e2dd] text-[#555866] font-medium leading-none">
                {verifiedCount}/{matrixCount}
              </span>
            )}
          </button>

          <button
            type="button"
            className={activeTab === 'radar' ? 'selected' : ''}
            onClick={() => setActiveTab('radar')}
            title="Radar Investigasi Kasus Wawancara"
          >
            <Sparkles size={13} />
            <span>Radar</span>
            {radarCount > 0 && (
              <span className="text-[10px] font-mono px-1 py-0.2 rounded-full bg-[#e4e2dd] text-[#555866] font-medium leading-none">
                {radarCount}
              </span>
            )}
          </button>

          <button
            type="button"
            className={activeTab === 'action' ? 'selected' : ''}
            onClick={() => setActiveTab('action')}
            title="Penjadwalan Google Meet & Kalender"
          >
            <Calendar size={13} />
            <span>Aksi</span>
          </button>
        </div>

        {/* Zed Dock Utility Actions (Search & Width Expansion) */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => {
              setShowSearch((prev) => !prev);
              if (showSearch) setSearchQuery('');
            }}
            className={`p-1 rounded-md text-[#797d8c] hover:text-[#272a33] hover:bg-[#eeedea] transition-colors cursor-pointer ${
              showSearch ? 'bg-[#eeedea] text-[#272a33]' : ''
            }`}
            title="Cari dalam panel aktif (Filter)"
          >
            <Search size={13} />
          </button>

          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="p-1 rounded-md text-[#797d8c] hover:text-[#272a33] hover:bg-[#eeedea] transition-colors cursor-pointer"
            title={isExpanded ? 'Kecilkan Panel (395px)' : 'Perluas Panel IDE (560px)'}
          >
            {isExpanded ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
          </button>
        </div>
      </div>

      {/* 2. Zed Inline Filter Bar (Slides down when search is active) */}
      {showSearch && (
        <div className="px-3 py-1.5 bg-[#f6f5f1] border-b border-[#eeedea] flex items-center gap-2 animate-in fade-in duration-100">
          <Search size={12} className="text-[#8c8d97] shrink-0" />
          <input
            type="text"
            autoFocus
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Filter ${activeTab === 'matrix' ? 'klaim bukti' : activeTab === 'radar' ? 'pertanyaan interview' : 'item'}…`}
            className="w-full text-xs bg-transparent border-0 outline-none text-[#272a33] placeholder-[#8c8d97]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="text-[#8c8d97] hover:text-[#272a33] cursor-pointer"
            >
              <X size={12} />
            </button>
          )}
        </div>
      )}

      {/* 3. Panel Content */}
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
                searchQuery={searchQuery}
              />
            )}

            {activeTab === 'radar' && (
              <InvestigationRadarView
                interviewKit={candidate.dossier.interviewKit}
                searchQuery={searchQuery}
              />
            )}

            {activeTab === 'action' && (
              <InterviewActionView dossier={candidate.dossier} googleStatus={googleStatus} />
            )}
          </>
        )}
      </div>

      {/* 4. Zed Style Micro Status Bar Footer */}
      <footer className="h-7 px-3 bg-[#f6f5f1] border-t border-[#eeedea] flex items-center justify-between text-[10.5px] font-mono text-[#8c8d97] shrink-0 select-none">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#8cac91]" />
          <span>AST Code Engine · Live</span>
        </div>
        <div className="truncate max-w-[200px] text-[#707380]">
          {dossier?.auditedRepos?.[0] || 'standby'}
        </div>
      </footer>
    </aside>
  );
};
