import React from 'react';
import { GitBranch, Shield, Terminal } from 'lucide-react';
import { DeliberationTopbar } from './DeliberationTopbar.js';
import { DeliberationChatView } from './DeliberationChatView.js';
import { OpenDotsMascot } from './OpenDotsMascot.js';
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

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto px-10 py-8">
        <div className="max-w-[860px] mx-auto space-y-6">
          {/* Authentic OpenDots Hero */}
          <div className="hero">
            <div className="hero-copy">
              <div className="eyebrow">
                LIVE CANDIDATE DOSSIER · REALTIME AST FORENSICS
              </div>
              <h1>{candidate.name}</h1>
              <p>{dossier.overallAssessment}</p>
              <div className="ready-pill">
                <span />
                <span>
                  {candidate.role} • Skor Bukti {candidate.matchScore}%
                </span>
              </div>
            </div>

            {/* Mascot with OpenDots Sparkles */}
            <div className="hero-mascot-container">
              <span className="spark spark-one">✦</span>
              <span className="spark spark-two">✧</span>
              <OpenDotsMascot
                color="blue"
                size="lg"
                isWorking={isLoading || isDeliberating}
              />
            </div>
          </div>

          {/* Klaim Skill & Repositories Meta Badges */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-[#fbfaf8] border border-[#e9e8e6] p-3 rounded-[9px]">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#a3a3ab] mr-1">
                Klaim:
              </span>
              {dossier.candidate.claimedSkills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-[5px] bg-white border border-[#e9e8e6] text-[#333641] text-[10.5px] font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-3 text-[11px] text-[#8c8d97]">
              <span className="flex items-center gap-1">
                <GitBranch size={13} className="text-[#8292d6]" />
                {dossier.auditedRepos.length} Repos
              </span>
              <span className="flex items-center gap-1">
                <Shield size={13} className="text-[#8cac91]" />
                Git Verified
              </span>
            </div>
          </div>

          {/* Live CoT Execution Progress Stream (Active when running) */}
          {(isLoading || traceEvents.length > 0) && (
            <div className="bg-white rounded-[13px] border border-[#e9e8e6] p-4 shadow-[0_2px_8px_rgba(57,57,74,0.03)] space-y-3">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Terminal size={14} className="text-[#8292d6]" />
                  <span className="font-semibold text-[#333641]">
                    Live Forensic Execution Stream (CoT 4-P)
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#8c8d97]">
                  {elapsedSeconds.toFixed(1)}s
                </span>
              </div>

              {/* Terminal log viewer */}
              <div className="bg-[#242730] text-[#e2e4ed] p-3 rounded-[9px] font-mono text-[10.5px] max-h-36 overflow-y-auto space-y-1">
                {traceEvents.map((evt, idx) => (
                  <div key={idx} className="flex items-start gap-2 leading-relaxed">
                    <span className="text-[#8c8d97] shrink-0">{evt.timestamp}</span>
                    <span
                      className={`font-semibold shrink-0 ${
                        evt.phase === 'PLAN'
                          ? 'text-[#8292d6]'
                          : evt.phase === 'TOOL_CALL'
                          ? 'text-[#b6a17b]'
                          : evt.phase === 'OBSERVATION'
                          ? 'text-[#8cac91]'
                          : 'text-[#d9756c]'
                      }`}
                    >
                      [{evt.phase}]
                    </span>
                    <span className="text-[#dedcd8]">{evt.detail}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Interactive Composer & Suggestions & Dialogues */}
          <DeliberationChatView
            messages={candidate.chatHistory}
            candidateName={candidate.name}
            isDeliberating={isDeliberating}
            onSendMessage={onSendMessage}
          />
        </div>
      </div>
    </main>
  );
};
