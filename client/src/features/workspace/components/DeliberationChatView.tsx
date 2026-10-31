import React, { useState, useRef, useEffect } from 'react';
import {
  FilePlus,
  Clock3,
  Phone,
  Link2,
  X,
  ArrowUp,
  Square,
  Terminal,
} from 'lucide-react';
import { OpenDotsMascot } from './OpenDotsMascot.js';
import { CandidateBriefingCard } from './CandidateBriefingCard.js';
import { ChatSuggestions } from './ChatSuggestions.js';
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
}) => {
  const [input, setInput] = useState('');
  const [source, setSource] = useState('');
  const [sourceOpen, setSourceOpen] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isDeliberating]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isDeliberating) return;
    const finalMessage = source ? `[Referensi Sumber: ${source}]\n\n${input.trim()}` : input.trim();
    onSendMessage(finalMessage);
    setInput('');
    setSource('');
    setSourceOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="live-chat">
      {/* Authentic OpenDots Chat Transcript (Scrolls Everything Naturally) */}
      <div className="chat-transcript">
        {/* Authentic OpenDots Chat Persona Header */}
        <header className="chat-persona">
          <OpenDotsMascot color="blue" size="md" isWorking={isDeliberating} />
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

        {/* Authentic OpenDots Page Context Indicator */}
        <div className="page-chat-context">
          <span>Working on</span>
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
        <CandidateBriefingCard candidate={candidate} />
        {/* Quick Action Suggestion Cards (HRD vs Tech Lead Modes) */}
        <ChatSuggestions
          candidateName={candidateName}
          isDeliberating={isDeliberating}
          onSendMessage={onSendMessage}
        />

        {/* Dialogue Messages */}
        {messages.map((msg, index) => {
          const isUser = msg.role === 'user';
          return (
            <div key={index} className={`chat-bubble ${isUser ? 'user' : 'assistant'}`}>
              <div style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</div>

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
                    fontSize: 9.5,
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

      {/* Authentic OpenDots Chat Composer (Fixed at Bottom) */}
      <div className="chat-composer-wrapper">
        <form onSubmit={handleSubmit} className="chat-composer">
          {sourceOpen && (
            <div className="source-input">
              <Link2 size={14} />
              <input
                type="text"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="Sematkan URL repositori atau berkas: https://github.com/..."
              />
              <button
                type="button"
                className="icon-button"
                style={{ width: 22, height: 22, border: 'none', background: 'transparent' }}
                onClick={() => {
                  setSourceOpen(false);
                  setSource('');
                }}
              >
                <X size={14} />
              </button>
            </div>
          )}

          <div className="chat-compose-row">
            <button
              type="button"
              className={`icon-button ${sourceOpen ? 'active' : ''}`}
              aria-label="Sematkan sumber tautan kode"
              title="Sematkan tautan repositori spesifik"
              onClick={() => setSourceOpen(!sourceOpen)}
            >
              <Link2 size={16} />
            </button>

            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Tanyakan apa saja seputar audit kandidat ${candidateName}…`}
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
