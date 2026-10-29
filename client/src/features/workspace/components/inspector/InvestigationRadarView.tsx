import React, { useState } from 'react';
import { Copy, Check, CheckCircle2, AlertOctagon } from 'lucide-react';
import type { InterviewQuestion } from '@/types/audit.js';

interface InvestigationRadarViewProps {
  interviewKit: InterviewQuestion[];
}

export const InvestigationRadarView: React.FC<InvestigationRadarViewProps> = ({
  interviewKit,
}) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!interviewKit || interviewKit.length === 0) {
    return (
      <div className="p-4 text-center text-xs text-[#8c8d97]">
        Belum ada radar investigasi untuk kandidat ini.
      </div>
    );
  }

  const handleCopy = (item: InterviewQuestion, index: number) => {
    const text = `[Investigasi Teknis] ${item.topic}\nFokus: ${item.investigationTarget || item.context}\nPertanyaan: ${item.question}\nSinyal Positif: ${item.greenFlags?.join(', ') || '-'}\nSinyal Merah: ${item.redFlags?.join(', ') || '-'}`;
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1800);
  };

  return (
    <div className="space-y-3">
      {interviewKit.map((item, idx) => (
        <div
          key={idx}
          className="p-3 bg-white border border-[#e9e8e6] rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-2.5"
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="text-[10px] font-semibold text-[#7285d5] uppercase tracking-wider">
                Probe #{idx + 1}
              </span>
              <div className="text-xs font-semibold text-[#333641] leading-tight mt-0.5">
                {item.topic}
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleCopy(item, idx)}
              className="p-1 text-[#8c8d97] hover:text-[#333641] hover:bg-[#f0eee9] rounded transition-colors cursor-pointer"
              aria-label="Salin probe"
            >
              {copiedIndex === idx ? (
                <Check className="w-3.5 h-3.5 text-[#8cac91]" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          {/* Context & Question */}
          <div className="p-2 bg-[#fbfaf8] border border-[#f0eee9] rounded-lg text-[11px] space-y-1">
            <div className="text-[#8c8d97]">
              <strong>Temuan:</strong> {item.context}
            </div>
            <div className="text-[#333641] font-medium">
              <strong>Tanya:</strong> &ldquo;{item.question}&rdquo;
            </div>
          </div>

          {/* Sinyal Kompeten (Green Flags) */}
          {item.greenFlags && item.greenFlags.length > 0 && (
            <div className="p-2 bg-[#edf3ec]/60 border border-[#dae7da] rounded-lg text-[10.5px] space-y-1">
              <div className="font-semibold text-[#2f5535] flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-[#8cac91]" />
                <span>Sinyal Kompeten (Green Flags):</span>
              </div>
              <ul className="list-disc list-inside text-[#3d6643] space-y-0.5">
                {item.greenFlags.map((flag, fIdx) => (
                  <li key={fIdx}>{flag}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Indikasi Bualan (Red Flags) */}
          {item.redFlags && item.redFlags.length > 0 && (
            <div className="p-2 bg-[#fdf0ef]/60 border border-[#f6cbc7] rounded-lg text-[10.5px] space-y-1">
              <div className="font-semibold text-[#912d26] flex items-center gap-1">
                <AlertOctagon className="w-3 h-3 text-[#d9756c]" />
                <span>Indikasi Bualan (Red Flags):</span>
              </div>
              <ul className="list-disc list-inside text-[#96362e] space-y-0.5">
                {item.redFlags.map((flag, fIdx) => (
                  <li key={fIdx}>{flag}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
