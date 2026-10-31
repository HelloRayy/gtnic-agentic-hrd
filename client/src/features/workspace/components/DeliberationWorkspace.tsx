import React, { useState } from 'react';
import { Terminal, ChevronDown, ChevronUp } from 'lucide-react';
import { DeliberationTopbar } from './DeliberationTopbar.js';
import { DeliberationChatView } from './DeliberationChatView.js';
import { WorkspaceZeroState } from './WorkspaceZeroState.js';
import type { WorkspaceCandidate } from '../types.js';
import type { TraceEvent } from '@/types/audit.js';

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
}) => {
  const [showTraceDetails, setShowTraceDetails] = useState(false);

  if (!candidate) {
    return (
      <main className="flex-1 h-screen flex flex-col bg-[#f8f7f4] overflow-hidden">
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
  return (
    <main className="flex-1 h-screen flex flex-col bg-[#f8f7f4] overflow-hidden">
      {/* Topbar */}
      <DeliberationTopbar
        candidate={candidate}
        isLoading={isLoading}
        onReaudit={onReaudit}
        onOpenWebIde={onOpenWebIde}
      />

      {/* Verifikasi Bukti Nyata Progress Bar (Accordion untuk HRD) */}
      {isLoading && traceEvents.length > 0 && (
        <div className="mx-8 mt-3 bg-white rounded-[11px] border border-[#e9e8e6] p-3 shadow-[0_2px_8px_rgba(57,57,74,0.03)] space-y-2 shrink-0">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#7285d5] animate-ping" />
              <span className="font-semibold text-[#333641]">
                Memverifikasi Bukti Kerja Nyata Kandidat...
              </span>
              <span className="text-[11px] text-[#8c8d97]">
                ({traceEvents.length} langkah terekam)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-[#8c8d97] font-medium tabular-nums">
                {elapsedSeconds.toFixed(1)}s
              </span>
              <button
                type="button"
                onClick={() => setShowTraceDetails((prev) => !prev)}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-[#5269bb] hover:text-[#384c98] bg-[#f2f4fc] hover:bg-[#e7eaf9] rounded-md transition-colors cursor-pointer"
              >
                <Terminal size={11} />
                <span>{showTraceDetails ? 'Tutup Detail' : 'Detail Analisis Sistem'}</span>
                {showTraceDetails ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              </button>
            </div>
          </div>

          {/* Accordion Konten Log Sistem (Hanya dibuka saat dibutuhkan) */}
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

      {/* Full-Height Authentic OpenDots Chat Experience */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <DeliberationChatView
          candidate={candidate}
          messages={candidate.chatHistory}
          candidateName={candidate.name}
          candidateRole={candidate.role}
          auditedRepos={dossier.auditedRepos}
          isDeliberating={isDeliberating}
          onSendMessage={onSendMessage}
          onSchedule={onOpenWebIde}
        />
      </div>
    </main>
  );
};
