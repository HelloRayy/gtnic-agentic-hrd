import React from 'react';
import { Printer } from 'lucide-react';
import type { WorkspaceCandidate } from '../types.js';

interface DeliberationTopbarProps {
  candidate: WorkspaceCandidate | null;
  isLoading?: boolean;
  onReaudit?: () => void;
  onOpenWebIde?: () => void;
}

export const DeliberationTopbar: React.FC<DeliberationTopbarProps> = ({
  candidate,
}) => {
  return (
    <header className="topbar select-none flex items-center justify-between px-4">
      {/* TalentTrace Navigation Breadcrumbs */}
      <div className="breadcrumbs">
        <span>TalentTrace</span>
        <span>/</span>
        <span>Antrean</span>
        <span>/</span>
        <strong>{candidate ? candidate.name : 'Workspace Siap'}</strong>
      </div>

      {candidate && (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-[#dedcd2] text-[#4d5162] hover:bg-[#f2f0ea] hover:text-[#22242c] text-xs font-medium transition-colors cursor-pointer shadow-2xs"
            title="Cetak atau ekspor berkas investigasi teknis ke dokumen PDF"
          >
            <Printer size={13} className="text-[#7285d5]" />
            <span>Ekspor PDF</span>
          </button>
        </div>
      )}
    </header>
  );
};

export default DeliberationTopbar;
