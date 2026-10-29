import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Terminal, CheckCircle2, MessageSquare, ArrowUp, ArrowUpRight } from 'lucide-react';
import { OpenDotsMascot } from './OpenDotsMascot.js';
import type { DeliberationMessage } from '@/types/audit.js';

interface DeliberationChatViewProps {
  messages: DeliberationMessage[];
  candidateName: string;
  isDeliberating: boolean;
  onSendMessage: (message: string) => void;
}

export const DeliberationChatView: React.FC<DeliberationChatViewProps> = ({
  messages,
  candidateName,
  isDeliberating,
  onSendMessage,
}) => {
  const [input, setInput] = useState('');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const suggestions = [
    {
      title: 'Uji Concurrency & Locking',
      icon: <Terminal className="suggestion-icon" size={18} />,
      prompt: `Analisis penanganan concurrency, race condition, dan database locking pada repositori ${candidateName}.`,
      desc: 'Analisis race condition, database locking, dan state machine.',
    },
    {
      title: 'Verifikasi Test & CI/CD',
      icon: <CheckCircle2 className="suggestion-icon" size={18} />,
      prompt: `Berapa coverage unit test dan bagaimana kematangan workflow CI/CD pada repositori ${candidateName}?`,
      desc: 'Cakupan coverage dan kematangan workflow GitHub Actions.',
    },
    {
      title: 'Draf Umpan Balik Sopan',
      icon: <MessageSquare className="suggestion-icon" size={18} />,
      prompt: `Buatkan draf email umpan balik konstruktif dan sopan untuk ${candidateName} berdasarkan temuan audit.`,
      desc: 'Buatkan draf email umpan balik konstruktif dan terarah.',
    },
  ];

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isDeliberating]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isDeliberating) return;
    onSendMessage(input.trim());
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex flex-col flex-1 pb-6">
      {/* Authentic OpenDots Composer */}
      <form onSubmit={handleSubmit} className="composer">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Tanyakan rincian kode kandidat ${candidateName} kepada Deliberation Partner...`}
          rows={2}
        />
        <div className="composer-bottom">
          <span>
            <Sparkles size={12} className="text-[#8b97c3]" />
            <span>Enter untuk kirim · Shift+Enter baris baru</span>
          </span>
          <button
            type="submit"
            disabled={!input.trim() || isDeliberating}
            className="send-button"
            aria-label="Kirim pertanyaan"
          >
            <ArrowUp size={16} />
          </button>
        </div>
      </form>
      <div className="composer-footnote">
        Deliberation Partner answers are grounded in audited GitHub codebase AST & Git history.
      </div>

      {/* Authentic OpenDots Suggestions Grid */}
      <div className="suggestions">
        <div className="section-heading">
          <h2>AKSI DELIBERASI CEPAT</h2>
          <span>3 TEMPLATES</span>
        </div>
        <div className="suggestion-grid">
          {suggestions.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onSendMessage(item.prompt)}
              disabled={isDeliberating}
              className="suggestion"
            >
              {item.icon}
              <strong>{item.title}</strong>
              <p>{item.desc}</p>
              <ArrowUpRight size={14} />
            </button>
          ))}
        </div>
      </div>

      {/* Chat Thread Dialogues */}
      <div className="mt-7 space-y-3 min-h-[140px]">
        <div className="section-heading">
          <h2>LOG PERCAKAPAN DELIBERASI</h2>
          <span>{messages.length} PESAN</span>
        </div>

        {messages.map((msg, index) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={index}
              className={`flex items-start gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="mt-0.5 shrink-0">
                  <OpenDotsMascot color="blue" size="sm" />
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-[13px] px-4 py-3 text-xs leading-relaxed shadow-[0_1px_2px_rgba(57,57,74,0.03)] border ${
                  isUser
                    ? 'bg-[#7689d3] text-white border-[#6c80cf] rounded-tr-sm'
                    : 'bg-white border-[#e9e8e6] text-[#333641] rounded-tl-sm'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>
                {msg.timestamp && (
                  <div
                    className={`text-[9px] mt-1 font-mono text-right ${
                      isUser ? 'text-white/70' : 'text-[#a3a3ab]'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isDeliberating && (
          <div className="flex items-start gap-2.5">
            <div className="mt-0.5 shrink-0">
              <OpenDotsMascot color="blue" size="sm" isWorking />
            </div>
            <div className="bg-white border border-[#e9e8e6] rounded-[13px] rounded-tl-sm px-4 py-3 text-xs text-[#8c8d97] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#8292d6] animate-ping" />
              <span>Forensic Dot sedang memverifikasi AST & codebase kandidat...</span>
            </div>
          </div>
        )}
        <div ref={chatBottomRef} />
      </div>
    </div>
  );
};
