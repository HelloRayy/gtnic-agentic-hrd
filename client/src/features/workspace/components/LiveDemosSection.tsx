import React from 'react';
import { Globe, ExternalLink } from 'lucide-react';

interface LiveDemosSectionProps {
  liveDemos: { repoName: string; url: string }[];
}

export const LiveDemosSection: React.FC<LiveDemosSectionProps> = ({ liveDemos }) => {
  if (!liveDemos || liveDemos.length === 0) return null;

  return (
    <div className="space-y-3 pt-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Globe size={16} className="text-[#35766f]" />
          <span className="text-[12px] font-bold text-[#275954] uppercase tracking-wider">
            Website Produksi & Live Demo Terdeteksi ({liveDemos.length})
          </span>
        </div>
        <span className="text-xs font-semibold text-[#275954] bg-[#dcf1ec] px-2.5 py-0.5 rounded-full border border-[#b8e2d8]">
          Live Deploy Ready
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {liveDemos.map((demo, idx) => (
          <div
            key={idx}
            className="bg-[#eef8f6] border border-[#bce3db] rounded-[11px] p-3.5 flex items-center justify-between gap-3 shadow-[0_1px_3px_rgba(39,89,84,0.03)]"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#10b981] shrink-0" title="Aktif" />
                <span className="text-sm font-bold text-[#1f4743] truncate">
                  {demo.repoName}
                </span>
              </div>
              <span className="text-[11.5px] text-[#477a74] truncate block mt-0.5 font-mono">
                {demo.url.replace(/^https?:\/\//, '')}
              </span>
            </div>

            <a
              href={demo.url.startsWith('http') ? demo.url : `https://${demo.url}`}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 text-xs font-semibold text-white bg-[#35766f] hover:bg-[#275954] px-3.5 py-2 rounded-[8px] inline-flex items-center gap-1.5 transition-all shadow-[0_1px_2px_rgba(53,118,111,0.2)] cursor-pointer"
            >
              <span>Buka Demo</span>
              <ExternalLink size={12} />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};
