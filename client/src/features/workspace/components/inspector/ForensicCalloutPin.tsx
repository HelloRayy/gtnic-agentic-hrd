import React from 'react';
import { CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';
import type { ForensicCallout } from '../../types.js';

interface ForensicCalloutPinProps {
  callout: ForensicCallout;
}

export const ForensicCalloutPin: React.FC<ForensicCalloutPinProps> = ({ callout }) => {
  const getBadgeConfig = () => {
    switch (callout.type) {
      case 'VERIFIED':
        return {
          icon: <CheckCircle2 size={13} className="text-[#8cac91]" />,
          label: 'BUKTI AST TERVERIFIKASI',
          bg: 'bg-[#edf3ec]/80 border-[#dae7da] text-[#2f5535]',
        };
      case 'PARTIAL':
        return {
          icon: <Sparkles size={13} className="text-[#d9a441]" />,
          label: 'SKILL SERUMPUN (ADAPTASI)',
          bg: 'bg-[#fbf5eb]/80 border-[#ebd9bd] text-[#7a5c24]',
        };
      case 'WARNING':
      default:
        return {
          icon: <AlertTriangle size={13} className="text-[#d9756c]" />,
          label: 'TIDAK TERDETEKSI DI AST',
          bg: 'bg-[#fdf0ef]/80 border-[#f6cbc7] text-[#912d26]',
        };
    }
  };

  const badge = getBadgeConfig();

  return (
    <div className="my-2 mx-3 p-3 rounded-xl bg-[#282a36] border border-[#3e4256] text-[#e2e4ed] shadow-lg text-xs space-y-2 select-text font-sans">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-1.5">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold border ${badge.bg}`}>
            {badge.icon}
            <span>{badge.label}</span>
          </span>
          <span className="text-[10px] text-[#9aa0b8] font-mono">
            L{callout.startLine}–L{callout.endLine}
          </span>
        </div>
      </div>

      <div className="space-y-0.5">
        <div className="text-[12.5px] font-semibold text-[#f0f2fb]">
          {callout.claimTitle}
        </div>
        <p className="text-[11.5px] text-[#b6bbd2] leading-relaxed m-0 font-normal">
          {callout.astEvidenceSummary}
        </p>
      </div>
    </div>
  );
};
