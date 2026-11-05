import React, { useState, useRef, useEffect } from 'react';
import { UserPlus, ChevronDown, User } from 'lucide-react';
import { CandidateAvatar } from '../CandidateAvatar.js';
import type { WorkspaceCandidate } from '../../types.js';

interface EmptyBenchmarkSlotProps {
  slotNumber: 1 | 2;
  slotLabel?: string;
  availableCandidates: WorkspaceCandidate[];
  onSelectCandidate: (candidateId: string) => void;
  accentColor?: string;
}

export const EmptyBenchmarkSlot: React.FC<EmptyBenchmarkSlotProps> = ({
  slotNumber,
  slotLabel,
  availableCandidates,
  onSelectCandidate,
  accentColor = '#7285d5',
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const candidateId = e.dataTransfer.getData('text/plain');
    if (candidateId) {
      onSelectCandidate(candidateId);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex-1 flex flex-col items-center justify-center p-8 rounded-xl border-2 border-dashed transition-all font-sans select-none min-h-[380px] ${
        isDragOver
          ? 'bg-[#eef2fc] border-[#7285d5] scale-[1.01]'
          : 'bg-[#faf9f6] border-[#dedcd3] hover:border-[#bcb8ab]'
      }`}
    >
      <div className="w-12 h-12 rounded-full bg-white border border-[#dedbd2] flex items-center justify-center text-[#737582] shadow-sm mb-3.5">
        <UserPlus size={20} style={{ color: isDragOver ? accentColor : '#8c8d97' }} />
      </div>

      <div className="text-center space-y-1 mb-5 max-w-xs">
        <h3 className="text-sm font-bold text-[#333641]">
          {slotLabel || `Pilih Kandidat Slot ${slotNumber}`}
        </h3>
        <p className="text-xs text-[#787b89] leading-relaxed">
          Tarik kartu pelamar dari antrean di sidebar kiri, atau klik tombol pemilih di bawah.
        </p>
      </div>

      {/* CTA Button with Dropdown Popover */}
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsDropdownOpen((prev) => !prev)}
          className="px-3.5 py-2 rounded-lg bg-white border border-[#dedcd2] text-xs font-semibold text-[#333641] hover:bg-[#f4f3ef] hover:border-[#c8c5b8] shadow-sm flex items-center gap-2 transition-all cursor-pointer btn-press"
        >
          <User size={13} style={{ color: accentColor }} />
          <span>Pilih dari Antrean</span>
          <ChevronDown size={13} className="text-[#8c8d97]" />
        </button>

        {isDropdownOpen && (
          <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-64 bg-white border border-[#dedbd2] rounded-xl shadow-lg p-1.5 z-30 space-y-0.5 text-xs">
            <div className="px-2.5 py-1.5 text-[10.5px] font-bold text-[#8c8d97] uppercase tracking-wider border-b border-[#f0eee9]">
              Daftar Pelamar Tersedia ({availableCandidates.length})
            </div>

            <div className="max-h-52 overflow-y-auto space-y-0.5 py-1">
              {availableCandidates.length === 0 ? (
                <div className="p-3 text-center text-[#8c8d97] text-xs">
                  Tidak ada pelamar lain yang tersedia.
                </div>
              ) : (
                availableCandidates.map((cand) => (
                  <button
                    key={cand.id}
                    type="button"
                    onClick={() => {
                      onSelectCandidate(cand.id);
                      setIsDropdownOpen(false);
                    }}
                    className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-[#f2f4fc] flex items-center gap-2.5 transition-colors cursor-pointer group"
                  >
                    <CandidateAvatar name={cand.name} size="sm" />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-[#333641] truncate text-xs group-hover:text-[#384c98]">
                        {cand.name}
                      </div>
                      <div className="text-[10.5px] text-[#8c8d97] truncate">
                        {cand.role || cand.dossier.jobTitle}
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
