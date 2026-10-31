import React from 'react';
import { ExternalLink } from 'lucide-react';
import { PillBadge } from '@/components/ui/PillBadge.js';
import type { EvidenceItem } from '@/types/audit.js';

interface EvidenceMatrixViewProps {
  evidenceMatrix: EvidenceItem[];
  githubUsername?: string;
}

export const EvidenceMatrixView: React.FC<EvidenceMatrixViewProps> = ({
  evidenceMatrix,
  githubUsername,
}) => {
  if (!evidenceMatrix || evidenceMatrix.length === 0) {
    return (
      <div className="p-4 text-center text-xs text-[#8c8d97]">
        Belum ada matriks bukti yang dipetakan.
      </div>
    );
  }

  const getStatusBadge = (status: EvidenceItem['status']) => {
    switch (status) {
      case 'VERIFIED':
        return <PillBadge variant="verified" size="sm">TERVERIFIKASI</PillBadge>;
      case 'PARTIAL':
        return <PillBadge variant="partial" size="sm">SEBAGIAN</PillBadge>;
      case 'TRANSFERABLE':
        return (
          <span title="Aman untuk dilanjutkan ke interview teknis: Kandidat menguasai teknologi serumpun yang relevan">
            <PillBadge variant="live" size="sm">SKILL SERUMPUN (BISA ADAPTASI)</PillBadge>
          </span>
        );
      case 'NO_PUBLIC_EVIDENCE':
      default:
        return (
          <span title="Belum ada bukti publik di GitHub. Wajib ditanyakan saat sesi interview teknis.">
            <PillBadge variant="unverified" size="sm">TIDAK ADA BUKTI PUBLIK</PillBadge>
          </span>
        );
    }
  };

  return (
    <div className="space-y-2.5">
      {evidenceMatrix.map((item, idx) => (
        <div
          key={idx}
          className="p-3.5 bg-white border border-[#e9e8e6] rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-2"
        >
          <div className="flex items-start justify-between gap-2.5">
            <span className="text-sm font-semibold text-[#333641] leading-tight">
              {item.claim}
            </span>
            {getStatusBadge(item.status)}
          </div>

          <p className="text-[13px] text-[#555660] leading-relaxed">
            {item.evidenceSummary}
          </p>

          {item.status === 'TRANSFERABLE' && (
            <div className="text-xs text-[#465799] bg-[#f2f4fc] px-3 py-1.5 rounded-[7px] border border-[#d8dcf7] flex items-center gap-2 font-medium">
              <span>Rekomendasi HRD: Aman dilanjutkan ke interview teknis (kandidat menguasai teknologi sejenis).</span>
            </div>
          )}

          {item.status === 'NO_PUBLIC_EVIDENCE' && (
            <div className="text-xs text-[#912d26] bg-[#fdf0ef] px-3 py-1.5 rounded-[7px] border border-[#f6cbc7] flex items-center gap-2 font-medium">
              <span>Catatan HRD: Belum ada bukti publik. Jadikan bahan pertanyaan klarifikasi saat interview.</span>
            </div>
          )}
          {item.fileAnchor && (
            <div className="pt-1.5 flex items-center justify-between text-xs text-[#8c8d97] border-t border-[#f4f3f0]">
              <span className="text-[#7285d5] font-medium truncate max-w-[220px]">
                {item.fileAnchor}
              </span>
              {item.repoAnchor && (
                <a
                  href={`https://github.com/${githubUsername || 'repo'}/${item.repoAnchor}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-0.5 text-[#7285d5] hover:underline"
                >
                  <span>Lihat Git</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
