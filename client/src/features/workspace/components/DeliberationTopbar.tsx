import React from 'react';
import { ExternalLink, RefreshCw } from 'lucide-react';
import type { WorkspaceCandidate } from '../types.js';

interface DeliberationTopbarProps {
  candidate: WorkspaceCandidate | null;
  isLoading: boolean;
  onReaudit: () => void;
  onOpenWebIde: () => void;
}

export const DeliberationTopbar: React.FC<DeliberationTopbarProps> = ({
  candidate,
  isLoading,
  onReaudit,
  onOpenWebIde,
}) => {
  return (
    <header className="topbar select-none">
      {/* Authentic OpenDots Breadcrumbs */}
      <div className="breadcrumbs">
        <span>TalentTrace</span>
        <span>/</span>
        <span>Antrean</span>
        <span>/</span>
        <strong>{candidate ? candidate.name : 'Workspace Siap'}</strong>
      </div>

      {/* Top Actions */}
      <div className="flex items-center gap-3">
        <span className={`mode-badge ${candidate ? 'live' : ''}`}>
          {candidate ? 'LIVE FORENSICS' : 'STANDBY'}
        </span>

        {candidate && (
          <>
            <button
              type="button"
              onClick={onOpenWebIde}
              title="Disiapkan untuk User / Tech Lead saat sesi interview teknis, bukan kewajiban HRD untuk membaca kode."
              className="text-button inline-flex items-center gap-2 cursor-pointer text-[#707380] hover:text-[#333641] transition-colors text-[13px] font-medium"
            >
              <ExternalLink size={14} className="text-[#8492c6]" />
              <span>Buka Kode (Khusus Tech Lead)</span>
            </button>

            <button
              type="button"
              onClick={onReaudit}
              disabled={isLoading}
              className="primary inline-flex items-center gap-2 py-2 px-3.5 rounded-[8px] text-[13px] font-medium text-white bg-[#7689d3] hover:bg-[#6177c5] shadow-[0_1px_2px_rgba(118,137,211,0.25)] transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw size={13} className={isLoading ? 'animate-spin' : ''} />
              <span>{isLoading ? 'Mengaudit...' : 'Audit Ulang'}</span>
            </button>
          </>
        )}
      </div>
    </header>
  );
};
