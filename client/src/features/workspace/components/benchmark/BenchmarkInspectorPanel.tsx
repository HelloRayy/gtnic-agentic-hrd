import React, { useState, useRef, useEffect } from 'react';
import { ArrowUp, Terminal, Sparkles, Scale, Columns } from 'lucide-react';
import { TalentTraceMascot } from '../TalentTraceMascot.js';
import { FormattedChatMessage } from '../FormattedChatMessage.js';
import type { WorkspaceCandidate } from '../../types.js';
import type { DeliberationMessage } from '@/types/audit.js';

interface BenchmarkInspectorPanelProps {
  candidateA: WorkspaceCandidate | null;
  candidateB: WorkspaceCandidate | null;
  messages: DeliberationMessage[];
  isDeliberating: boolean;
  onSendMessage: (question: string) => void;
  width?: number;
}

export const BenchmarkInspectorPanel: React.FC<BenchmarkInspectorPanelProps> = ({
  candidateA,
  candidateB,
  messages,
  isDeliberating,
  onSendMessage,
  width = 330,
}) => {
  const [input, setInput] = useState('');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const nameA = candidateA?.name || 'Kandidat 1';
  const nameB = candidateB?.name || 'Kandidat 2';
  const isBothSelected = Boolean(candidateA && candidateB);

  const quickPrompts = [
    `Siapa yang lebih siap menangani arsitektur high-scale?`,
    `Bandingkan kedalaman unit testing dan CI/CD ${nameA} vs ${nameB}`,
    `Apa trade-off terbesar jika memilih ${nameA} vs ${nameB}?`,
    `Buatkan 1 pertanyaan wawancara paling tajam untuk menguji batas keduanya`,
  ];

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isDeliberating]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isDeliberating || !isBothSelected) return;
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
    <aside style={{ width, minWidth: width }} className="shrink-0 bg-[#fbfaf8] border-l border-[#e5e3dc] text-[#333641] font-sans text-xs select-none flex flex-col h-screen overflow-hidden">
      {/* 1. Panel Header */}
      <div className="h-10 px-3 bg-[#f5f4ef] border-b border-[#e2dfd7] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Scale size={14} className="text-[#e2a36b]" />
          <span className="text-[11px] font-bold tracking-wider text-[#6b6f7d] uppercase">
            Arbiter Deliberasi
          </span>
        </div>
        <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-semibold bg-[#e8ecf8] text-[#4f64b8]">
          CoT AI
        </span>
      </div>

      {/* 2. Subheader Context Indicator */}
      <div className="px-3.5 py-2.5 bg-[#faf9f5] border-b border-[#ece9df] flex items-center gap-2 text-[11px]">
        <TalentTraceMascot color="blue" size="sm" isWorking={isDeliberating} />
        <div className="min-w-0 flex-1">
          <div className="font-semibold text-[#333641] truncate">
            {isBothSelected ? `${nameA} vs ${nameB}` : 'Menunggu Pilihan Kandidat'}
          </div>
          <div className="text-[10px] text-[#8c8d97] truncate">
            {isBothSelected ? 'Konteks 2 dossier aktif' : 'Pilih 2 kandidat di canvas'}
          </div>
        </div>
      </div>

      {/* 3. Chat Messages Transcript */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3">
        {!isBothSelected ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-4 text-[#8c8d97] space-y-2">
            <Columns size={24} className="text-[#c8c5b8] mb-1" />
            <div className="font-semibold text-xs text-[#555866]">
              Pilih 2 Kandidat Terlebih Dahulu
            </div>
            <p className="text-[11px] leading-relaxed text-[#8c8d97]">
              Tarik atau pilih 2 kandidat ke dalam slot perbandingan di sebelah kiri untuk mengaktifkan AI Arbiter.
            </p>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-4 space-y-2.5">
            <div className="text-[11.5px] font-medium text-[#5c5e6d]">
              Mulai deliberasi komparasi teknis:
            </div>
            <div className="space-y-1.5">
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  type="button"
                  disabled={isDeliberating}
                  onClick={() => onSendMessage(prompt)}
                  className="w-full text-left text-[11px] p-2 rounded-lg bg-white border border-[#dedcd2] text-[#4d5162] hover:bg-[#f0f2fb] hover:border-[#7285d5] transition-all cursor-pointer leading-snug"
                >
                  <Sparkles size={11} className="inline mr-1 text-[#e2a36b]" />
                  <span>{prompt}</span>
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
                className={`flex gap-2 text-xs ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="shrink-0 mt-0.5">
                    <TalentTraceMascot color="blue" size="sm" />
                  </div>
                )}
                <div
                  className={`max-w-[250px] p-2.5 rounded-xl leading-relaxed select-text ${
                    isUser
                      ? 'bg-[#7285d5] text-white rounded-tr-none'
                      : 'bg-white border border-[#e5e3dc] text-[#333641] shadow-[0_1px_2px_rgba(0,0,0,0.02)] rounded-tl-none'
                  }`}
                >
                  <FormattedChatMessage content={msg.content} isUser={isUser} size="compact" />
                  {msg.anchors && msg.anchors.length > 0 && (
                    <div className="mt-1.5 pt-1 border-t border-[#f0eee9] flex items-center gap-1 text-[9.5px] text-[#787b89] font-mono flex-wrap">
                      <Terminal size={10} className="shrink-0" />
                      <span>{msg.anchors.join(', ')}</span>
                    </div>
                  )}
                  <div className={`text-[9px] mt-1 text-right ${isUser ? 'text-white/70' : 'text-[#8c8d97]'}`}>
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            );
          })
        )}

        {isDeliberating && (
          <div className="flex items-center gap-1.5 text-[11px] text-[#7285d5] font-medium py-1 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-[#7285d5]" />
            <span>Menganalisis perbandingan kedua kandidat...</span>
          </div>
        )}
        <div ref={chatBottomRef} />
      </div>

      {/* 4. Bottom Sticky Input Form */}
      <form onSubmit={handleSubmit} className="p-2.5 bg-white border-t border-[#e5e3dc] flex items-center gap-1.5 shrink-0">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isBothSelected ? 'Tanyakan perbandingan... (Enter)' : 'Pilih 2 kandidat di kiri...'}
          rows={1}
          disabled={!isBothSelected || isDeliberating}
          className="flex-1 resize-none text-[11.5px] p-2 rounded-lg border border-[#dedcd4] bg-[#fbfaf8] text-[#333641] focus:outline-none focus:border-[#7285d5] focus:bg-white placeholder:text-[#a0a3b0] disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!input.trim() || isDeliberating || !isBothSelected}
          className="w-8 h-8 rounded-lg bg-[#7285d5] hover:bg-[#5f74cc] text-white flex items-center justify-center transition-all disabled:opacity-40 cursor-pointer shrink-0 shadow-sm"
          title="Kirim pertanyaan"
        >
          <ArrowUp size={15} />
        </button>
      </form>
    </aside>
  );
};
