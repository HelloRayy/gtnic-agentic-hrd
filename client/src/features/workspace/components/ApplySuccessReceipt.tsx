import React from 'react';
import { ArrowRight } from 'lucide-react';
import { OpenDotsMascot } from './OpenDotsMascot.js';

interface ApplySuccessReceiptProps {
  onSwitchToWorkspace: () => void;
  onReset: () => void;
}

export const ApplySuccessReceipt: React.FC<ApplySuccessReceiptProps> = ({
  onSwitchToWorkspace,
  onReset,
}) => {
  return (
    <div className="min-h-screen bg-[#f8f7f4] py-16 px-4 flex flex-col items-center justify-center">
      <div className="w-full max-w-lg bg-white rounded-2xl border border-[#e9e8e6] p-8 shadow-[0_4px_20px_rgba(57,57,74,0.04)] text-center space-y-6">
        <div className="flex justify-center">
          <OpenDotsMascot color="blue" size="lg" state="working" />
        </div>
        <div className="space-y-2">
          <h1 className="text-xl font-semibold text-[#242730] tracking-tight">
            Lamaran Berhasil Terkirim
          </h1>
          <p className="text-xs text-[#707070] leading-relaxed max-w-sm mx-auto">
            AI Forensic Agent sedang membedah AST kode dan commit repositori GitHub Anda secara otonom.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={onSwitchToWorkspace}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#7285d5] hover:bg-[#5f74cb] text-white text-xs font-medium cursor-pointer shadow-sm transition-all"
          >
            <span>Buka Ruang Deliberasi Tech Lead</span>
            <ArrowRight size={14} />
          </button>
          <button
            type="button"
            onClick={onReset}
            className="text-xs text-[#707070] hover:text-[#242730] font-medium py-2 px-3 cursor-pointer"
          >
            Kirim lamaran lain
          </button>
        </div>
      </div>
    </div>
  );
};
