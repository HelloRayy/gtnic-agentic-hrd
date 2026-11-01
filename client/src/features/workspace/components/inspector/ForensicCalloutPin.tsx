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
          icon: <CheckCircle2 size={11} className="text-[#1a7f37]" />,
          label: 'VERIFIED CLAIM',
          styles: 'bg-[#dafbe1] border-[#4ac26b]/40 text-[#1a7f37]',
          footerStatus: 'Terverifikasi pada Pohon Sintaksis AST',
          footerColor: 'text-[#1a7f37]',
        };
      case 'PARTIAL':
        return {
          icon: <Sparkles size={11} className="text-[#9a6700]" />,
          label: 'TRANSFERABLE SKILL',
          styles: 'bg-[#fff8c5] border-[#e3b341]/40 text-[#9a6700]',
          footerStatus: 'Kategori Skill Serumpun (Bisa Adaptasi)',
          footerColor: 'text-[#9a6700]',
        };
      case 'WARNING':
      default:
        return {
          icon: <AlertTriangle size={11} className="text-[#cf222e]" />,
          label: 'NO AST EVIDENCE',
          styles: 'bg-[#ffebe9] border-[#ff8182]/40 text-[#cf222e]',
          footerStatus: 'Perlu Konfirmasi Saat Interview Teknis',
          footerColor: 'text-[#cf222e]',
        };
    }
  };

  const status = getStatusBadge();

  return (
    <div className="my-2.5 mx-3 rounded-xl border border-[#d0d7de] bg-[#ffffff] text-[#24292f] shadow-sm text-xs select-text overflow-hidden font-sans">
      {/* GitHub PR Review Comment Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-[#f6f8fa] border-b border-[#d0d7de] text-xs flex-wrap gap-1.5">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-[#ddf4ff] text-[#0969da] flex items-center justify-center font-bold">
            <Bot size={12} />
          </div>
          <span className="font-semibold text-[#24292f] text-[12px]">
            TalentTrace AST Auditor
          </span>
          <span className="text-[9.5px] px-1.5 py-0.2 rounded border border-[#54aeff]/40 text-[#0969da] font-medium uppercase">
            Bot
          </span>
          <span className="text-[11px] text-[#57606a] font-mono">
            lines {callout.startLine}–{callout.endLine}
          </span>
        </div>

        <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${status.styles}`}>
          {status.icon}
          <span>{status.label}</span>
        </span>
      </div>

      {/* GitHub PR Review Comment Body */}
      <div className="p-3 space-y-1.5 text-xs bg-[#ffffff]">
        <div className="text-[12px] font-semibold text-[#24292f] flex items-center gap-1.5 flex-wrap">
          <span className="text-[#57606a]">Validasi Klaim CV:</span>
          <span className="text-[#0969da] font-medium">{callout.claimTitle}</span>
        </div>
        <p className="text-[11.5px] text-[#57606a] leading-relaxed m-0 font-normal">
          {callout.astEvidenceSummary}
        </p>
      </div>

      {/* GitHub Review Resolution Footer */}
      <div className="px-3 py-1.5 bg-[#f6f8fa] border-t border-[#d0d7de] flex items-center justify-between text-[10.5px] text-[#57606a]">
        <div className="flex items-center gap-1">
          <GitCommit size={12} className={status.footerColor} />
          <span className={`font-medium ${status.footerColor}`}>
            {status.footerStatus}
          </span>
        </div>
        <span className="font-mono text-[10px] text-[#8c959f]">AST Grounded Review</span>
      </div>
    </div>
  );
};
