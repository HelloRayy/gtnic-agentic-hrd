import React from 'react';
import { Terminal } from 'lucide-react';
import { DeliberationTopbar } from './DeliberationTopbar.js';
import { DeliberationChatView } from './DeliberationChatView.js';
import type { WorkspaceCandidate } from '../types.js';
import type { TraceEvent } from '@/types/audit.js';

interface DeliberationWorkspaceProps {
  candidate: WorkspaceCandidate;
  isLoading: boolean;
  isDeliberating: boolean;
  traceEvents: TraceEvent[];
  elapsedSeconds: number;
  onReaudit: () => void;
  onSendMessage: (message: string) => void;
  onOpenWebIde: () => void;
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
}) => {
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

      {/* Live CoT Execution Progress Stream (Active when running) */}
      {(isLoading || traceEvents.length > 0) && (
        <div className="mx-8 mt-3 bg-white rounded-[11px] border border-[#e9e8e6] p-3 shadow-[0_2px_8px_rgba(57,57,74,0.03)] space-y-2 shrink-0">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Terminal size={13} className="text-[#8292d6]" />
              <span className="font-semibold text-[#333641]">
                Live Forensic Execution Stream (CoT 4-P)
              </span>
            </div>
            <span className="text-[10px] font-mono text-[#8c8d97]">
              {elapsedSeconds.toFixed(1)}s
            </span>
          </div>

          <div className="bg-[#242730] text-[#e2e4ed] p-2.5 rounded-[7px] font-mono text-[10px] max-h-24 overflow-y-auto space-y-1">
            {traceEvents.map((evt, idx) => (
              <div key={idx} className="flex items-start gap-2 leading-relaxed">
                <span className="text-[#8c8d97] shrink-0">{evt.timestamp}</span>
                <span
                  className={`font-semibold shrink-0 ${
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
                <span className="truncate">{evt.detail}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Full-Height Authentic OpenDots Chat Experience */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <DeliberationChatView
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
