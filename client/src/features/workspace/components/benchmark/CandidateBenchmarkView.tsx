import React, { useState } from 'react';
import { Columns, X, Sparkles } from 'lucide-react';
import { CandidateBenchmarkCard } from './CandidateBenchmarkCard.js';
import { EmptyBenchmarkSlot } from './EmptyBenchmarkSlot.js';
import { BenchmarkChatHub } from './BenchmarkChatHub.js';
import { sendBenchmarkDeliberation } from '@/services/auditApi.js';
import type { WorkspaceCandidate } from '../../types.js';
import type { DeliberationMessage } from '@/types/audit.js';

interface CandidateBenchmarkViewProps {
  allCandidates: WorkspaceCandidate[];
  initialCandidateA?: WorkspaceCandidate | null;
  initialCandidateB?: WorkspaceCandidate | null;
  onSelectForSchedule?: (candidateId: string) => void;
  onClose?: () => void;
}

export const CandidateBenchmarkView: React.FC<CandidateBenchmarkViewProps> = ({
  allCandidates,
  initialCandidateA,
  initialCandidateB,
  onSelectForSchedule,
  onClose,
}) => {
  const [slotAId, setSlotAId] = useState<string | null>(initialCandidateA?.id || null);
  const [slotBId, setSlotBId] = useState<string | null>(initialCandidateB?.id || null);

  const candidateA = allCandidates.find((c) => c.id === slotAId) || null;
  const candidateB = allCandidates.find((c) => c.id === slotBId) || null;

  const [customMessages, setCustomMessages] = useState<DeliberationMessage[]>([]);
  const [isDeliberating, setIsDeliberating] = useState(false);

  const baseWelcomeMessage: DeliberationMessage | null =
    candidateA && candidateB
      ? {
          role: 'assistant',
          content: `Ruang Head-to-Head aktif untuk **${candidateA.name}** dan **${candidateB.name}**. Silakan ajukan pertanyaan komparasi teknis di bawah untuk membedah trade-off arsitektur, testing, atau kesiapan stack mereka.`,
          timestamp: 'Siap',
        }
      : null;

  const messages = baseWelcomeMessage ? [baseWelcomeMessage, ...customMessages] : [];

  const handleSelectSlotA = (id: string | null) => {
    setSlotAId(id);
    setCustomMessages([]);
  };

  const handleSelectSlotB = (id: string | null) => {
    setSlotBId(id);
    setCustomMessages([]);
  };

  const handleSendMessage = async (question: string) => {
    if (!question.trim() || isDeliberating || !candidateA || !candidateB) return;

    const userTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: DeliberationMessage = {
      role: 'user',
      content: question,
      timestamp: userTimestamp,
    };

    setCustomMessages((prev) => [...prev, userMsg]);
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

      setCustomMessages((prev) => [...prev, agentMsg]);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Gagal memproses komparasi.';
      const errorMsg: DeliberationMessage = {
        role: 'assistant',
        content: `Terjadi kendala saat menganalisis kedua kandidat: ${errMsg}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setCustomMessages((prev) => [...prev, errorMsg]);
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
            {candidateA && candidateB
              ? `(${candidateA.name} vs ${candidateB.name})`
              : candidateA
              ? `(${candidateA.name} vs Slot 2 Kosong)`
              : candidateB
              ? `(Slot 1 Kosong vs ${candidateB.name})`
              : '(Dua Slot Kosong)'}
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
        {candidateA ? (
          <CandidateBenchmarkCard
            candidate={candidateA}
            onSelectForSchedule={onSelectForSchedule}
            onRemove={() => handleSelectSlotA(null)}
            accentColor="#7285d5"
          />
        ) : (
          <EmptyBenchmarkSlot
            slotNumber={1}
            slotLabel="Slot 1: Tarik atau Pilih Kandidat A"
            availableCandidates={allCandidates.filter((c) => c.id !== slotBId)}
            onSelectCandidate={(id) => handleSelectSlotA(id)}
            accentColor="#7285d5"
          />
        )}

        {candidateB ? (
          <CandidateBenchmarkCard
            candidate={candidateB}
            onSelectForSchedule={onSelectForSchedule}
            onRemove={() => handleSelectSlotB(null)}
            accentColor="#8cac91"
          />
        ) : (
          <EmptyBenchmarkSlot
            slotNumber={2}
            slotLabel="Slot 2: Tarik atau Pilih Kandidat B"
            availableCandidates={allCandidates.filter((c) => c.id !== slotAId)}
            onSelectCandidate={(id) => handleSelectSlotB(id)}
            accentColor="#8cac91"
          />
        )}
      </div>

      {/* 3. Bottom Deliberation Chat Hub */}
      {candidateA && candidateB ? (
        <BenchmarkChatHub
          nameA={candidateA.name}
          nameB={candidateB.name}
          messages={messages}
          isDeliberating={isDeliberating}
          onSendMessage={handleSendMessage}
        />
      ) : (
        <div className="p-3 bg-[#faf9f6] border-t border-[#e2dfd7] text-center text-xs text-[#787b89] flex items-center justify-center gap-2 shrink-0">
          <Sparkles size={13} className="text-[#e2a36b]" />
          <span>
            {candidateA || candidateB
              ? 'Tarik atau pilih 1 kandidat lagi di atas untuk mengaktifkan AI Deliberation Arbiter.'
              : 'Tarik dari sidebar kiri atau pilih 2 kandidat di atas untuk mulai membandingkan.'}
          </span>
        </div>
      )}
    </div>
  );
};
