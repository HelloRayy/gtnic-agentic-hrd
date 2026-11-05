import React from 'react';
import { Award, Printer, CheckCircle2, GitBranch, ArrowLeft } from 'lucide-react';
import { CandidateAvatar } from '../CandidateAvatar.js';
import type { WorkspaceCandidate } from '../../types.js';

interface CandidateAcceptedViewProps {
  candidate: WorkspaceCandidate;
  onBackToInterview?: () => void;
  onBackToScreening?: () => void;
}

export const CandidateAcceptedView: React.FC<CandidateAcceptedViewProps> = ({
  candidate,
  onBackToInterview,
  onBackToScreening,
}) => {
  const dossier = candidate.dossier;
  const verifiedList = dossier?.evidenceMatrix?.filter((e) => e.status === 'VERIFIED') || [];
  const repos = dossier?.auditedRepos || [];

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-[#f8f7f4] font-sans select-none">
      <div className="max-w-3xl mx-auto space-y-5">
        {/* 1. Success Celebration Banner */}
        <div className="bg-[#edf3ec] border border-[#d2e4d2] rounded-2xl p-6 text-center space-y-3 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div className="w-12 h-12 rounded-full bg-[#2e7d32] text-white flex items-center justify-center mx-auto shadow-sm">
            <Award size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#1f4a24] m-0">
              Kandidat Lolos: Siap Diberi Tawaran Kerja
            </h2>
            <p className="text-xs text-[#356d3b] mt-1 max-w-md mx-auto leading-relaxed">
              {candidate.name} telah menyelesaikan audit forensik kode GitHub dan evaluasi wawancara teknis dengan predikat memuaskan.
            </p>
          </div>
        </div>

        {/* 2. Profil Rekapitulasi Eksekutif */}
        <div className="bg-white border border-[#e5e3dc] rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
          <div className="flex items-center gap-3.5 pb-4 border-b border-[#f0eee9]">
            <CandidateAvatar name={candidate.name} size="lg" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#333641] m-0">{candidate.name}</h3>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full font-semibold bg-[#edf3ec] text-[#2b5934] border border-[#cbe0cb]">
                  Tahap 3: Offering
                </span>
              </div>
              <p className="text-xs text-[#737582] mt-0.5">{candidate.role || dossier.jobTitle}</p>
            </div>
          </div>

          <div className="space-y-3 text-xs text-[#444654]">
            <div>
              <span className="font-semibold text-[#8c8d97] block mb-1">Bukti Rekayasa Terverifikasi ({verifiedList.length})</span>
              <div className="space-y-1.5">
                {verifiedList.slice(0, 3).map((v, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-[#2b4c30] text-[11.5px]">
                    <CheckCircle2 size={13} className="text-[#8cac91] shrink-0" />
                    <span><strong>{v.claim}</strong>: {v.evidenceSummary}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <span className="font-semibold text-[#8c8d97] block mb-1">Repositori Kunci Teruji ({repos.length})</span>
              <div className="flex flex-wrap gap-1.5">
                {repos.map((r, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded bg-[#f4f3ef] border border-[#e5e3dc] font-mono text-[11px] text-[#444654] flex items-center gap-1">
                    <GitBranch size={11} className="text-[#7285d5]" />
                    {r}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 3. Aksi Dokumen Pimpinan (Ekspor PDF Laporan Resmi) */}
        <div className="bg-white border border-[#e5e3dc] rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex items-center justify-between flex-wrap gap-3">
          <div>
            <div className="font-bold text-[#333641] text-sm">Dokumen Laporan untuk CTO / Direksi</div>
            <div className="text-xs text-[#737582] mt-0.5">
              Cetak berkas lengkap forensik kode dan hasil wawancara untuk penandatanganan penawaran kerja.
            </div>
          </div>

          <button
            type="button"
            onClick={() => window.print()}
            className="px-4 py-2 rounded-xl bg-[#7285d5] hover:bg-[#5f74cc] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer"
          >
            <Printer size={15} />
            <span>Ekspor PDF Laporan Resmi</span>
          </button>
        </div>

        {/* 4. Navigasi Kembali jika Perlu Evaluasi Ulang */}
        <div className="flex items-center justify-between text-xs text-[#737582] pt-2">
          {onBackToInterview && (
            <button
              type="button"
              onClick={onBackToInterview}
              className="inline-flex items-center gap-1 hover:text-[#333641] transition-colors cursor-pointer"
            >
              <ArrowLeft size={13} />
              <span>Kembalikan ke Tahap Wawancara</span>
            </button>
          )}

          {onBackToScreening && (
            <button
              type="button"
              onClick={onBackToScreening}
              className="hover:text-[#333641] transition-colors cursor-pointer underline"
            >
              Buka Berkas Screening Awal
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
