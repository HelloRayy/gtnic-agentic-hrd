import React from 'react';
import { CheckCircle2, AlertTriangle, Sparkles, Bot, GitCommit } from 'lucide-react';
import type { ForensicCallout } from '../../types.js';

interface ForensicCalloutPinProps {
  callout: ForensicCallout;
}

export const ForensicCalloutPin: React.FC<ForensicCalloutPinProps> = ({ callout }) => {
  const getStatusBadge = () => {
    switch (callout.type) {
      case 'VERIFIED':
        return {
          icon: <CheckCircle2 size={11} className="text-[#3fb950]" />,
          label: 'VERIFIED CLAIM',
          styles: 'bg-[#238636]/20 border-[#2ea043]/40 text-[#3fb950]',
          footerStatus: 'Terverifikasi pada Pohon Sintaksis AST',
          footerColor: 'text-[#3fb950]',
        };
      case 'PARTIAL':
        return {
          icon: <Sparkles size={11} className="text-[#d29922]" />,
          label: 'TRANSFERABLE SKILL',
          styles: 'bg-[#bb8009]/20 border-[#d29922]/40 text-[#d29922]',
          footerStatus: 'Kategori Skill Serumpun (Bisa Adaptasi)',
          footerColor: 'text-[#d29922]',
        };
      case 'WARNING':
      default:
        return {
          icon: <AlertTriangle size={11} className="text-[#f85149]" />,
          label: 'NO AST EVIDENCE',
          styles: 'bg-[#da3633]/20 border-[#f85149]/40 text-[#f85149]',
          footerStatus: 'Perlu Konfirmasi Saat Interview Teknis',
          footerColor: 'text-[#f85149]',
        };
    }
  };

  const status = getStatusBadge();

  return (
    <div className="my-2.5 mx-3 rounded-xl border border-[#30363d] bg-[#161b22] text-[#e6edf3] shadow-md text-xs select-text overflow-hidden font-sans">
      {/* GitHub PR Review Comment Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-[#0d1117] border-b border-[#30363d] text-xs flex-wrap gap-1.5">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-[#1f6feb]/20 text-[#58a6ff] flex items-center justify-center font-bold">
            <Bot size={12} />
          </div>
          <span className="font-semibold text-[#e6edf3] text-[12px]">
            TalentTrace AST Auditor
          </span>
          <span className="text-[9.5px] px-1.5 py-0.2 rounded border border-[#388bfd]/40 text-[#58a6ff] font-medium uppercase">
            Bot
          </span>
          <span className="text-[11px] text-[#7d8590] font-mono">
            lines {callout.startLine}–{callout.endLine}
          </span>
        </div>

        <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${status.styles}`}>
          {status.icon}
          <span>{status.label}</span>
        </span>
      </div>

      {/* GitHub PR Review Comment Body */}
      <div className="p-3 space-y-1.5 text-xs">
        <div className="text-[12px] font-semibold text-[#f0f6fc] flex items-center gap-1.5 flex-wrap">
          <span className="text-[#7d8590]">Validasi Klaim CV:</span>
          <span className="text-[#58a6ff] font-medium">{callout.claimTitle}</span>
        </div>
        <p className="text-[11.5px] text-[#c9d1d9] leading-relaxed m-0 font-normal">
          {callout.astEvidenceSummary}
        </p>
      </div>

      {/* GitHub Review Resolution Footer */}
      <div className="px-3 py-1.5 bg-[#0d1117]/70 border-t border-[#21262d] flex items-center justify-between text-[10.5px] text-[#7d8590]">
        <div className="flex items-center gap-1">
          <GitCommit size={12} className={status.footerColor} />
          <span className={`font-medium ${status.footerColor}`}>
            {status.footerStatus}
          </span>
        </div>
        <span className="font-mono text-[10px] text-[#6e7681]">AST Grounded Review</span>
      </div>
    </div>
  );
};
