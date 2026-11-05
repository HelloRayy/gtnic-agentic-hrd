import React, { useState, useRef, useEffect } from 'react';
import {
  FilePlus,
  Clock3,
  Phone,
  ArrowUp,
  Square,
  Terminal,
} from 'lucide-react';
import { SkillsMenuPopover } from './SkillsMenuPopover.js';
import { TalentTraceMascot } from './TalentTraceMascot.js';
import { CandidateBriefingCard } from './CandidateBriefingCard.js';
import { FormattedChatMessage } from './FormattedChatMessage.js';
import type { WorkspaceCandidate } from '../types.js';
import type { DeliberationMessage } from '@/types/audit.js';

interface DeliberationChatViewProps {
  candidate: WorkspaceCandidate;
  messages: DeliberationMessage[];
  candidateName: string;
  candidateRole?: string;
  auditedRepos?: string[];
  isDeliberating: boolean;
  onSendMessage: (message: string) => void;
  onSchedule?: () => void;
  onSaveDossier?: () => void;
  onViewCv?: () => void;
  onInspectCode?: () => void;
}

export const DeliberationChatView: React.FC<DeliberationChatViewProps> = ({
  candidate,
  messages,
  candidateName,
  candidateRole = 'Senior Software Engineer',
  auditedRepos = [],
  isDeliberating,
  onSendMessage,
  onSchedule,
  onSaveDossier,
  onViewCv,
  onInspectCode,
}) => {
  const [input, setInput] = useState('');
  const [skillsOpen, setSkillsOpen] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<number | null>(null);

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      window.clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setSkillsOpen(true);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = window.setTimeout(() => {
      setSkillsOpen(false);
    }, 200);
  };

  useEffect(() => {
    // Gunakan 'auto' saat streaming untuk mencegah lag smooth-scroll animation thrashing
    chatBottomRef.current?.scrollIntoView({ behavior: isDeliberating ? 'auto' : 'smooth' });
  }, [messages, isDeliberating]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isDeliberating) return;
    onSendMessage(input.trim());
    setInput('');
    setSkillsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setInput(val);
    if (val.startsWith('/')) {
      setSkillsOpen(true);
    }
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="live-chat">
      {/* TalentTrace Chat Transcript */}
      <div className="chat-transcript">
        {/* TalentTrace Chat Persona Header */}
        <header className="chat-persona">
          <TalentTraceMascot color="blue" size="md" isWorking={isDeliberating} />
          <div className="persona-meta">
            <strong>TalentTrace Co-Pilot</strong>
            <span>Asisten Verifikasi Bukti Kerja Nyata · Berbasis Proyek Asli</span>
          </div>

          <div className="chat-persona-actions">
            {onSaveDossier && (
              <button
                type="button"
                className="icon-button"
                title="Salin ringkasan dossier ke clipboard"
                onClick={onSaveDossier}
              >
                <FilePlus size={16} />
              </button>
            )}

            {onSchedule && (
              <button
                type="button"
                className="icon-button"
                title="Jadwalkan wawancara teknis di Google Calendar"
                onClick={onSchedule}
              >
                <Clock3 size={16} />
              </button>
            )}

            <button
              type="button"
              className="icon-button"
              title="Google Meet live technical session"
              onClick={onSchedule}
            >
              <Phone size={16} />
            </button>
          </div>
        </header>

        {/* TalentTrace Page Context Indicator */}
        <div className="page-chat-context">
          <span>Memeriksa:</span>
          <strong style={{ color: '#333641' }}>{candidateName}</strong>
          <span>·</span>
          <span>{candidateRole}</span>
          {auditedRepos.length > 0 && (
            <>
              <span>·</span>
              <span style={{ color: '#7285d5' }}>{auditedRepos.length} Repos Terverifikasi</span>
            </>
          )}
        </div>

        {/* Super Complete Candidate Profile & Forensic Briefing Card */}
        <CandidateBriefingCard
          candidate={candidate}
          onViewCv={onViewCv}
          onInspectCode={onInspectCode}
        />

        {/* Dialogue Messages */}
        {messages.map((msg, index) => {
          const isUser = msg.role === 'user';
          return (
            <div key={index} className={`chat-bubble ${isUser ? 'user' : 'assistant'}`}>
              <FormattedChatMessage content={msg.content} isUser={isUser} />

              {msg.anchors && msg.anchors.length > 0 && (
                <div style={{ marginTop: 8, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {msg.anchors.map((anchor, aIdx) => (
                    <span
                      key={aIdx}
                      style={{
                        fontSize: 12,
                        background: '#e5f1ef',
                        color: '#35766f',
                        padding: '3px 8px',
                        borderRadius: 5,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 5,
                        fontWeight: 500,
                      }}
                    >
                      <Terminal size={10} /> {anchor}
                    </span>
                  ))}
                </div>
              )}

              {msg.timestamp && (
                <div
                  style={{
                    fontSize: 11,
                    marginTop: 4,
                    textAlign: isUser ? 'right' : 'left',
                    color: isUser ? 'rgba(255, 255, 255, 0.75)' : '#8c8d97',
                  }}
                >
                  {msg.timestamp}
                </div>
              )}
            </div>
          );
        })}

        {isDeliberating && (
          <div className="thinking">
            <span />
            <span />
            <span />
            <span>TalentTrace Co-Pilot sedang memverifikasi bukti kode asli & repositori kandidat...</span>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* TalentTrace Chat Composer (Fixed at Bottom) */}
      <div className="chat-composer-wrapper relative">
        <form onSubmit={handleSubmit} className="chat-composer">
          <div className="chat-compose-row">
            {/* Simple ? Button with Hover Popover */}
            <div
              className="relative flex items-center"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                onClick={() => setSkillsOpen((prev) => !prev)}
                className={`w-7 h-7 rounded-full flex items-center justify-center text-[13px] font-bold transition-all cursor-pointer shrink-0 ${
                  skillsOpen
                    ? 'bg-[#7285d5] text-white shadow-xs'
                    : 'bg-[#f0eee9] hover:bg-[#e4e7f7] text-[#6b6e7b] hover:text-[#5269bb] border border-[#e2dfd7]'
                }`}
                aria-label="Panduan Evaluasi Kandidat (?)"
                title="Panduan Evaluasi Kandidat (?)"
              >
                ?
              </button>

              <SkillsMenuPopover
                candidateName={candidateName}
                isOpen={skillsOpen}
                onClose={() => setSkillsOpen(false)}
                onSelectSkill={(prompt) => {
                  onSendMessage(prompt);
                  setInput('');
                }}
              />
            </div>

            <textarea
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={`Tanyakan tentang ${candidateName} atau klik (?) untuk panduan evaluasi…`}
              rows={1}
              disabled={isDeliberating}
            />

            <button
              type="submit"
              disabled={!input.trim() || isDeliberating}
              className="send-button"
              aria-label="Kirim pesan"
            >
              {isDeliberating ? <Square size={14} /> : <ArrowUp size={16} />}
            </button>
          </div>
        </form>

        <div className="chat-compose-note">
          Jawaban asisten terverifikasi langsung berdasarkan bukti riil riwayat commit dan repositori kandidat.
        </div>
      </div>
    </div>
  );
};
