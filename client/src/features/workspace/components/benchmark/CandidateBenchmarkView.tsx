import React from 'react';
import { Columns, X, Sparkles } from 'lucide-react';
import { CandidateBenchmarkCard } from './CandidateBenchmarkCard.js';
import { EmptyBenchmarkSlot } from './EmptyBenchmarkSlot.js';
import type { WorkspaceCandidate } from '../../types.js';

interface CandidateBenchmarkViewProps {
  allCandidates: WorkspaceCandidate[];
  slotAId: string | null;
  slotBId: string | null;
  onSelectSlotA: (id: string | null) => void;
  onSelectSlotB: (id: string | null) => void;
  onSelectForSchedule?: (candidateId: string) => void;
  onClose?: () => void;
}

export const CandidateBenchmarkView: React.FC<CandidateBenchmarkViewProps> = ({
  allCandidates,
  slotAId,
  slotBId,
  onSelectSlotA,
  onSelectSlotB,
  onSelectForSchedule,
  onClose,
}) => {
  const candidateA = allCandidates.find((c) => c.id === slotAId) || null;
  const candidateB = allCandidates.find((c) => c.id === slotBId) || null;

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f8f7f4] overflow-hidden font-sans select-none">
      {/* 1. Header Toolbar Komparasi */}
      <div className="h-10 px-4 bg-[#f2f0ea] border-b border-[#dedbd2] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Columns size={14} className="text-[#e2a36b]" />
          <span className="text-xs font-bold text-[#333641] uppercase tracking-wider">
            Head-to-Head Benchmark Canvas
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

      {/* 2. Split Screen Two-Column Side-by-Side Area (Full Height Immersion) */}
      <div className="flex-1 p-4 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4">
        {candidateA ? (
          <CandidateBenchmarkCard
            candidate={candidateA}
            onSelectForSchedule={onSelectForSchedule}
            onRemove={() => onSelectSlotA(null)}
            accentColor="#7285d5"
          />
        ) : (
          <EmptyBenchmarkSlot
            slotNumber={1}
            slotLabel="Slot 1: Tarik atau Pilih Kandidat A"
            availableCandidates={allCandidates.filter((c) => c.id !== slotBId)}
            onSelectCandidate={(id) => onSelectSlotA(id)}
            accentColor="#7285d5"
          />
        )}

        {candidateB ? (
          <CandidateBenchmarkCard
            candidate={candidateB}
            onSelectForSchedule={onSelectForSchedule}
            onRemove={() => onSelectSlotB(null)}
            accentColor="#8cac91"
          />
        ) : (
          <EmptyBenchmarkSlot
            slotNumber={2}
            slotLabel="Slot 2: Tarik atau Pilih Kandidat B"
            availableCandidates={allCandidates.filter((c) => c.id !== slotAId)}
            onSelectCandidate={(id) => onSelectSlotB(id)}
            accentColor="#8cac91"
          />
        )}
      </div>

      {/* 3. Bottom Minimal Status Footer */}
      <div className="h-8 px-4 bg-[#f5f4ef] border-t border-[#e6e4dc] flex items-center justify-between text-[11px] text-[#787b89] shrink-0">
        <div className="flex items-center gap-1.5">
          <Sparkles size={12} className="text-[#e2a36b]" />
          <span>
            {candidateA && candidateB
              ? 'Deliberasi aktif di panel kanan. Ajukan pertanyaan komparasi langsung ke Arbiter AI.'
              : 'Pilih 2 kandidat di atas untuk mengaktifkan obrolan AI Arbiter di panel kanan.'}
          </span>
        </div>
        <span className="font-mono text-[10px] text-[#8c8d97]">
          {allCandidates.length} Pelamar Terdaftar
        </span>
      </div>
    </div>
  );
};
