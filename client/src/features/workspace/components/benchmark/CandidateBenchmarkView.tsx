import React, { useState } from 'react';
import { Columns, X } from 'lucide-react';
import { CandidateBenchmarkCard } from './CandidateBenchmarkCard.js';
import { BenchmarkChatHub } from './BenchmarkChatHub.js';
import { sendBenchmarkDeliberation } from '@/services/auditApi.js';
import type { WorkspaceCandidate } from '../../types.js';
import type { DeliberationMessage } from '@/types/audit.js';

interface CandidateBenchmarkViewProps {
  candidateA: WorkspaceCandidate;
  candidateB: WorkspaceCandidate;
  onSelectForSchedule?: (candidateId: string) => void;
  onClose?: () => void;
}

export const CandidateBenchmarkView: React.FC<CandidateBenchmarkViewProps> = ({
  candidateA,
  candidateB,
  onSelectForSchedule,
  onClose,
}) => {
  const [messages, setMessages] = useState<DeliberationMessage[]>([
    {
      role: 'assistant',
      content: `Selamat datang di ruang Head-to-Head Benchmark. Saya siap membandingkan profil teknis antara **${candidateA.name}** dan **${candidateB.name}** secara objektif berbasis bukti repositori nyata. Ajukan pertanyaan komparasi di bawah ini untuk melihat perbandingan trade-off arsitektur, testing, atau kesiapan stack mereka.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [isDeliberating, setIsDeliberating] = useState(false);

  const handleSendMessage = async (question: string) => {
    if (!question.trim() || isDeliberating) return;

    const userTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: DeliberationMessage = {
      role: 'user',
      content: question,
      timestamp: userTimestamp,
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsDeliberating(true);

    try {
      const res = await sendBenchmarkDeliberation(
        {
          name: candidateA.name,
          role: candidateA.role,
          claimedSkills: candidateA.dossier.candidate.claimedSkills,
          dossier: candidateA.dossier,
        },
        {
          name: candidateB.name,
          role: candidateB.role,
          claimedSkills: candidateB.dossier.candidate.claimedSkills,
          dossier: candidateB.dossier,
        },
        question
      );

      const agentTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const agentMsg: DeliberationMessage = {
        role: 'assistant',
        content: res.answer,
        timestamp: agentTimestamp,
        anchors: res.anchors,
      };

      setMessages((prev) => [...prev, agentMsg]);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Gagal memproses komparasi.';
      const errorMsg: DeliberationMessage = {
        role: 'assistant',
        content: `Terjadi kendala saat menganalisis kedua kandidat: ${errMsg}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsDeliberating(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f8f7f4] overflow-hidden font-sans select-none">
      {/* 1. Header Toolbar Komparasi */}
      <div className="h-10 px-4 bg-[#f2f0ea] border-b border-[#dedbd2] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Columns size={14} className="text-[#e2a36b]" />
          <span className="text-xs font-bold text-[#333641] uppercase tracking-wider">
            Head-to-Head Split-Screen Benchmark
          </span>
          <span className="text-[11px] text-[#737582]">
            ({candidateA.name} vs {candidateB.name})
          </span>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-[#737582] hover:text-[#333641] hover:bg-[#e4e2db] transition-colors cursor-pointer"
            title="Tutup mode perbandingan"
          >
            <X size={15} />
          </button>
        )}
      </div>

      {/* 2. Split Screen Two-Column Side-by-Side Area */}
      <div className="flex-1 p-4 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4">
        <CandidateBenchmarkCard
          candidate={candidateA}
          onSelectForSchedule={onSelectForSchedule}
          accentColor="#7285d5"
        />
        <CandidateBenchmarkCard
          candidate={candidateB}
          onSelectForSchedule={onSelectForSchedule}
          accentColor="#8cac91"
        />
      </div>

      {/* 3. Bottom Deliberation Chat Hub */}
      <BenchmarkChatHub
        nameA={candidateA.name}
        nameB={candidateB.name}
        messages={messages}
        isDeliberating={isDeliberating}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
};
