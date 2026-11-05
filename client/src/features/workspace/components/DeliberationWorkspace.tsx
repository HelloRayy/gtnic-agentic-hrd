import React, { useState } from 'react';
import { Terminal, ChevronDown, ChevronUp } from 'lucide-react';
import { DeliberationTopbar } from './DeliberationTopbar.js';
import { DeliberationChatView } from './DeliberationChatView.js';
import { WorkspaceZeroState } from './WorkspaceZeroState.js';
import { WorkspaceEditorTabBar } from './WorkspaceEditorTabBar.js';
import { CvDocumentView } from './inspector/CvDocumentView.js';
import { EvidenceMatrixView } from './inspector/EvidenceMatrixView.js';
import { InvestigationRadarView } from './inspector/InvestigationRadarView.js';
import { InterviewActionView } from './inspector/InterviewActionView.js';
import { WebIdeInspectorView } from './inspector/WebIdeInspectorView.js';
import { generateIdeSnippets } from '../services/ideCodeAdapter.js';
import { CandidateBenchmarkView } from './benchmark/CandidateBenchmarkView.js';
import type { WorkspaceCandidate } from '../types.js';
import type { TraceEvent, GoogleAuthStatus } from '@/types/audit.js';

interface DeliberationWorkspaceProps {
  candidate: WorkspaceCandidate | null;
  isLoading: boolean;
  isDeliberating: boolean;
  traceEvents: TraceEvent[];
  elapsedSeconds: number;
  onReaudit: () => void;
  onSendMessage: (message: string) => void;
  onOpenWebIde: () => void;
  onOpenUploadModal: () => void;
  activeWorkspaceTab: string;
  openWorkspaceTabs: string[];
  onSelectWorkspaceTab: (tabId: string) => void;
  onCloseWorkspaceTab: (tabId: string) => void;
  googleStatus: GoogleAuthStatus | null;
  onViewCv?: () => void;
  onInspectCode?: () => void;
  allCandidates?: WorkspaceCandidate[];
  benchmarkCandidateIds?: [string, string] | null;
  onSelectCandidate?: (id: string) => void;
  onCloseBenchmark?: () => void;
}

export const DeliberationWorkspace: React.FC<DeliberationWorkspaceProps> = ({
  candidate,
  isLoading,
  isDeliberating,
  traceEvents,
  elapsedSeconds,
  onReaudit,
  onSendMessage,
  onOpenWebIde,
  onOpenUploadModal,
  activeWorkspaceTab,
  openWorkspaceTabs,
  onSelectWorkspaceTab,
  onCloseWorkspaceTab,
  googleStatus,
  onViewCv,
  onInspectCode,
  allCandidates = [],
  benchmarkCandidateIds = null,
  onSelectCandidate,
  onCloseBenchmark,
}) => {
  const [showTraceDetails, setShowTraceDetails] = useState(false);

  if (!candidate) {
    return (
      <main className="flex-1 h-screen flex flex-col bg-[#f8f7f4] overflow-hidden min-w-0">
        <DeliberationTopbar
          candidate={null}
          isLoading={isLoading}
          onReaudit={onReaudit}
          onOpenWebIde={onOpenWebIde}
        />
        <WorkspaceZeroState
          isLoading={isLoading}
          elapsedSeconds={elapsedSeconds}
          traceEvents={traceEvents}
          onOpenUploadModal={onOpenUploadModal}
        />
      </main>
    );
  }

  const { dossier } = candidate;
  const snippets = generateIdeSnippets(dossier);

  return (
    <main className="flex-1 h-screen flex flex-col bg-[#f8f7f4] overflow-hidden min-w-0">
      {/* 1. Workspace Topbar */}
      <DeliberationTopbar
        candidate={candidate}
        isLoading={isLoading}
        onReaudit={onReaudit}
        onOpenWebIde={onOpenWebIde}
      />

      {/* 2. CoT Forensic Progress Stream Bar (Active only while running) */}
      {isLoading && traceEvents.length > 0 && (
        <div className="mx-8 mt-3 bg-white rounded-[11px] border border-[#e9e8e6] p-3.5 shadow-[0_2px_8px_rgba(57,57,74,0.03)] space-y-2 shrink-0">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#7285d5] animate-ping" />
              <span className="font-semibold text-[#333641]">
                Memverifikasi Bukti Kerja Nyata Kandidat...
              </span>
              <span className="text-xs text-[#8c8d97]">
                ({traceEvents.length} langkah terekam)
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="text-xs text-[#8c8d97] font-medium tabular-nums">
                {elapsedSeconds.toFixed(1)}s
              </span>
              <button
                type="button"
                onClick={() => setShowTraceDetails((prev) => !prev)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#5269bb] hover:text-[#384c98] bg-[#f2f4fc] hover:bg-[#e7eaf9] rounded-md transition-colors cursor-pointer"
              >
                <Terminal size={13} />
                <span>{showTraceDetails ? 'Tutup Detail' : 'Detail Analisis Sistem'}</span>
                {showTraceDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
            </div>
          </div>

          {showTraceDetails && (
            <div className="bg-[#242730] text-[#e2e4ed] p-2.5 rounded-[7px] text-[10.5px] max-h-32 overflow-y-auto space-y-1 font-mono">
              <div className="text-[10px] uppercase tracking-wider text-[#8c8d97] font-sans font-semibold pb-1 border-b border-[#363a47] flex items-center justify-between">
                <span>Jejak Audit Teknis (Plan - Tool - Observation - Reflection)</span>
                <span>{traceEvents.length} Event</span>
              </div>
              {traceEvents.map((evt, idx) => (
                <div key={idx} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-[#8c8d97] shrink-0 text-[10px]">{evt.timestamp}</span>
                  <span
                    className={`font-semibold shrink-0 text-[10px] ${
                      evt.phase === 'PLAN'
                        ? 'text-[#8292d6]'
                        : evt.phase === 'TOOL_CALL'
                          ? 'text-[#e2a36b]'
                          : evt.phase === 'OBSERVATION'
                            ? 'text-[#8cac91]'
                            : 'text-[#d9756c]'
                    }`}
                  >
                    [{evt.phase}]
                  </span>
                  <span className="truncate text-[#d4d6e0]">{evt.detail}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. VS Code / Zed Style Main Workspace Tab Bar (Only visible when user opened a file tab) */}
      {openWorkspaceTabs.length > 0 && (
        <WorkspaceEditorTabBar
          openTabs={openWorkspaceTabs}
          activeTabId={activeWorkspaceTab}
          onSelectTab={onSelectWorkspaceTab}
          onCloseTab={onCloseWorkspaceTab}
          snippets={snippets}
        />
      )}

      {/* 4. Dynamic Main Workspace Canvas View Area */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {activeWorkspaceTab === 'chat' && (
          <DeliberationChatView
            candidate={candidate}
            messages={candidate.chatHistory}
            candidateName={candidate.name}
            candidateRole={candidate.role}
            auditedRepos={dossier.auditedRepos}
            isDeliberating={isDeliberating}
            onSendMessage={onSendMessage}
            onSchedule={() => onSelectWorkspaceTab('action')}
            onViewCv={onViewCv || (() => onSelectWorkspaceTab('cv'))}
            onInspectCode={onInspectCode || (() => onSelectWorkspaceTab('code:core-logic'))}
          />
        )}

        {activeWorkspaceTab === 'cv' && (
          <div className="flex-1 overflow-y-auto p-6 bg-[#f8f7f4]">
            <div className="max-w-3xl mx-auto">
              <CvDocumentView dossier={dossier} />
            </div>
          </div>
        )}

        {activeWorkspaceTab.startsWith('code:') && (
          <div className="flex-1 overflow-hidden flex flex-col p-4 bg-[#f8f7f4]">
            <WebIdeInspectorView
              dossier={dossier}
              initialFileId={activeWorkspaceTab.replace('code:', '')}
            />
          </div>
        )}

        {activeWorkspaceTab === 'matrix' && (
          <div className="flex-1 overflow-y-auto p-6 bg-[#f8f7f4]">
            <div className="max-w-4xl mx-auto">
              <EvidenceMatrixView
                evidenceMatrix={dossier.evidenceMatrix}
                githubUsername={dossier.candidate.githubUsername}
                onInspectCode={() => onSelectWorkspaceTab('code:core-logic')}
              />
            </div>
          </div>
        )}

        {activeWorkspaceTab === 'radar' && (
          <div className="flex-1 overflow-y-auto p-6 bg-[#f8f7f4]">
            <div className="max-w-4xl mx-auto">
              <InvestigationRadarView interviewKit={dossier.interviewKit} />
            </div>
          </div>
        )}

        {activeWorkspaceTab === 'action' && (
          <div className="flex-1 overflow-y-auto p-6 bg-[#f8f7f4]">
            <div className="max-w-2xl mx-auto">
              <InterviewActionView dossier={dossier} googleStatus={googleStatus} />
            </div>
          </div>
        )}

        {activeWorkspaceTab === 'benchmark' && (
          <CandidateBenchmarkView
            allCandidates={allCandidates}
            initialCandidateA={
              benchmarkCandidateIds?.[0]
                ? allCandidates.find((c) => c.id === benchmarkCandidateIds[0]) || null
                : null
            }
            initialCandidateB={
              benchmarkCandidateIds?.[1]
                ? allCandidates.find((c) => c.id === benchmarkCandidateIds[1]) || null
                : null
            }
            onSelectForSchedule={(id) => {
              onSelectCandidate?.(id);
              onSelectWorkspaceTab('action');
            }}
            onClose={onCloseBenchmark || (() => onSelectWorkspaceTab('chat'))}
          />
        )}
      </div>
    </main>
  );
};
