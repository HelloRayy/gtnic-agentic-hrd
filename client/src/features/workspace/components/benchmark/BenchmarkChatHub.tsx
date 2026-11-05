import React, { useState, useRef, useEffect } from 'react';
import { ArrowUp, Terminal, Sparkles, MessageSquare } from 'lucide-react';
import { OpenDotsMascot } from '../OpenDotsMascot.js';
import type { DeliberationMessage } from '@/types/audit.js';

interface BenchmarkChatHubProps {
  nameA: string;
  nameB: string;
  messages: DeliberationMessage[];
  isDeliberating: boolean;
  onSendMessage: (question: string) => void;
}

export const BenchmarkChatHub: React.FC<BenchmarkChatHubProps> = ({
  nameA,
  nameB,
  messages,
  isDeliberating,
  onSendMessage,
}) => {
  const [input, setInput] = useState('');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    `Siapa yang lebih siap menangani arsitektur sistem skala besar?`,
    `Bandingkan kedalaman unit testing dan otomatisasi CI/CD ${nameA} vs ${nameB}`,
    `Apa trade-off teknis terbesar antara kedua kandidat ini?`,
    `Buatkan 1 pertanyaan wawancara paling tajam untuk menguji batas masing-masing`,
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
    <div className="bg-[#fcfbf9] border-t border-[#e2dfd7] flex flex-col font-sans select-none shrink-0 shadow-[0_-2px_10px_rgba(0,0,0,0.02)]">
      {/* 1. Header Hub Deliberasi Arbiter */}
      <div className="px-5 py-2.5 bg-[#f5f4ee] border-b border-[#e6e4dc] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <OpenDotsMascot color="blue" size="sm" isWorking={isDeliberating} />
          <div>
            <div className="text-xs font-bold text-[#333641] flex items-center gap-1.5">
              <span>Arbiter Deliberasi Head-to-Head</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#e7ebf9] text-[#4f64b8] font-semibold">
                Multi-Dossier CoT
              </span>
            </div>
            <div className="text-[11px] text-[#787b89]">
              Membedah trade-off nyata antara {nameA} dan {nameB} berbasis repositori
            </div>
          </div>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="hidden lg:flex items-center gap-1.5 overflow-x-auto max-w-xl">
          {quickPrompts.slice(0, 2).map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              disabled={isDeliberating}
              onClick={() => onSendMessage(prompt)}
              className="text-[10.5px] px-2.5 py-1 rounded-full bg-white border border-[#dedcd4] text-[#555866] hover:bg-[#eef1fa] hover:text-[#384c98] hover:border-[#ccd5f7] transition-all truncate max-w-xs cursor-pointer disabled:opacity-50"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Chat Transcript Area */}
      <div className="max-h-56 overflow-y-auto px-5 py-3 space-y-3">
        {messages.length === 0 ? (
          <div className="py-2 text-center text-xs text-[#8c8d97] space-y-1">
            <p className="font-medium text-[#5c5e6d]">
              Ajukan pertanyaan komparasi teknis langsung ke AI Arbiter.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
              {quickPrompts.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  disabled={isDeliberating}
                  onClick={() => onSendMessage(p)}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-white border border-[#dedbd2] text-[#4d5162] hover:bg-[#f0f2fb] hover:border-[#7285d5] transition-colors cursor-pointer"
                >
                  <Sparkles size={11} className="inline mr-1 text-[#e2a36b]" />
                  {p}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={index}
                className={`flex gap-2.5 text-xs ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="shrink-0 mt-0.5">
                    <OpenDotsMascot color="blue" size="sm" />
                  </div>
                )}
                <div
                  className={`max-w-2xl p-3 rounded-xl leading-relaxed whitespace-pre-wrap select-text ${
                    isUser
                      ? 'bg-[#7285d5] text-white rounded-tr-none'
                      : 'bg-white border border-[#e5e3dc] text-[#333641] shadow-[0_1px_2px_rgba(0,0,0,0.02)] rounded-tl-none'
                  }`}
                >
                  <div>{msg.content}</div>
                  {msg.anchors && msg.anchors.length > 0 && (
                    <div className="mt-2 pt-1.5 border-t border-[#f0eee9] flex items-center gap-1.5 flex-wrap">
                      <Terminal size={11} className="text-[#8c8d97]" />
                      <span className="text-[10px] text-[#787b89] font-mono">
                        Jangkar: {msg.anchors.join(', ')}
                      </span>
                    </div>
                  )}
                  <div
                    className={`text-[9.5px] mt-1 text-right ${
                      isUser ? 'text-white/70' : 'text-[#8c8d97]'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            );
          })
        )}

        {isDeliberating && (
          <div className="flex items-center gap-2 text-xs text-[#7285d5] font-medium py-1 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-[#7285d5]" />
            <span>AI Arbiter sedang menganalisis kedua repositori dan merumuskan trade-off...</span>
          </div>
        )}
        <div ref={chatBottomRef} />
      </div>

      {/* 3. Input Textarea Bar */}
      <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-[#e8e6de] flex items-center gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Tanyakan komparasi spesifik, misal: "Siapa yang lebih siap scale ke 10k RPS?" (Enter untuk kirim)`}
          rows={1}
          disabled={isDeliberating}
          className="flex-1 resize-none text-xs p-2.5 rounded-lg border border-[#dedcd4] bg-[#fbfaf8] text-[#333641] focus:outline-none focus:border-[#7285d5] focus:bg-white placeholder:text-[#9ea0ac]"
        />
        <button
          type="submit"
          disabled={!input.trim() || isDeliberating}
          className="w-9 h-9 rounded-lg bg-[#7285d5] hover:bg-[#5f74cc] text-white flex items-center justify-center transition-all disabled:opacity-40 cursor-pointer shrink-0 shadow-[0_1px_2px_rgba(114,133,213,0.3)]"
          title="Kirim pertanyaan komparasi"
        >
          <ArrowUp size={16} />
        </button>
      </form>
    </div>
  );
};
