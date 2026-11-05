import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { TalentTraceMascot } from './TalentTraceMascot.js';

interface ApplyHeaderCardProps {
  onApplyPreset: (snippetKey: 'rayhan' | 'johnDoe') => void;
  onSwitchToWorkspace: () => void;
}

export const ApplyHeaderCard: React.FC<ApplyHeaderCardProps> = ({
  onApplyPreset,
  onSwitchToWorkspace,
}) => {
  return (
    <>
      {/* Top Bar Switcher to Tech Lead Workspace */}
      <div className="w-full max-w-2xl flex items-center justify-between pb-4 text-xs">
        <div className="flex items-center gap-2">
          <span className="dotted-logo">
            <i />
            <i />
            <i />
            <i />
          </span>
          <span className="font-semibold tracking-tight text-[#242730]">Portal Rekrutmen TalentTrace</span>
        </div>
        <button
          type="button"
          onClick={onSwitchToWorkspace}
          className="inline-flex items-center gap-1.5 font-medium text-[#7285d5] hover:text-[#5f74cb] transition-colors cursor-pointer"
        >
          <span>Workspace HR</span>
          <ArrowRight size={13} />
        </button>
      </div>

      {/* Header Card (TalentTrace Enterprise Style) */}
      <div className="bg-white rounded-2xl border border-[#e9e8e6] p-7 shadow-[0_2px_12px_rgba(57,57,74,0.03)] space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#eeeff7] text-[#596aa9] text-[11px] font-medium">
              Portal Rekrutmen Teknis
            </span>
            <h1 className="text-2xl font-semibold text-[#242730] tracking-tight">
              Formulir Aplikasi Engineer
            </h1>
            <p className="text-xs text-[#707070] leading-relaxed">
              Screening teknikal objektif berbasis bukti commit dan arsitektur kode nyata di repositori publik.
            </p>
          </div>
          <TalentTraceMascot color="blue" size="md" decorative />
        </div>

        {/* Quick Demo Pill Fill */}
        <div className="pt-3 border-t border-[#f0eee9] flex items-center gap-2 flex-wrap">
          <span className="text-[11px] text-[#8c8d97] font-medium flex items-center gap-1">
            <Sparkles size={12} className="text-[#7285d5]" />
            Contoh Pelamar:
          </span>
          <button
            type="button"
            onClick={() => onApplyPreset('rayhan')}
            className="text-[11px] px-3 py-1 rounded-lg bg-[#f0eee9] hover:bg-[#e4e2dc] text-[#333641] font-medium transition-colors cursor-pointer"
          >
            Rayhan (Frontend Lead)
          </button>
          <button
            type="button"
            onClick={() => onApplyPreset('johnDoe')}
            className="text-[11px] px-3 py-1 rounded-lg bg-[#f0eee9] hover:bg-[#e4e2dc] text-[#333641] font-medium transition-colors cursor-pointer"
          >
            John Doe (Distributed Systems)
          </button>
        </div>
      </div>
    </>
  );
};
