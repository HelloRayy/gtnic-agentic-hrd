import React from 'react';
import { CheckCircle2, AlertCircle, GitBranch, ShieldCheck, Calendar, ArrowRight } from 'lucide-react';
import { CandidateAvatar } from '../CandidateAvatar.js';
import type { WorkspaceCandidate } from '../../types.js';

interface CandidateBenchmarkCardProps {
  candidate: WorkspaceCandidate;
  onSelectForSchedule?: (candidateId: string) => void;
  accentColor?: string;
}

export const CandidateBenchmarkCard: React.FC<CandidateBenchmarkCardProps> = ({
  candidate,
  onSelectForSchedule,
  accentColor = '#7285d5',
}) => {
  const dossier = candidate.dossier;
  const verifiedList = dossier?.evidenceMatrix?.filter((e) => e.status === 'VERIFIED') || [];
  const totalEvidence = dossier?.evidenceMatrix?.length || 0;
  const reposCount = dossier?.auditedRepos?.length || 0;

  return (
    <div className="flex-1 flex flex-col bg-white border border-[#e5e3dc] rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.03)] overflow-hidden font-sans">
      {/* 1. Header Profil & Meta */}
      <div className="p-4 bg-[#fbfaf8] border-b border-[#e9e8e6] flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <CandidateAvatar name={candidate.name} size="md" />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-[#333641] leading-snug">{candidate.name}</h3>
              <span
                className="text-[10.5px] px-2 py-0.5 rounded-full font-semibold border flex items-center gap-1"
                style={{
                  backgroundColor: `${accentColor}12`,
                  color: accentColor,
                  borderColor: `${accentColor}30`,
                }}
              >
                <ShieldCheck size={12} />
                {verifiedList.length}/{totalEvidence} Terverifikasi
              </span>
            </div>
            <p className="text-xs text-[#737582] mt-0.5">{candidate.role || dossier.jobTitle}</p>
          </div>
        </div>

        {onSelectForSchedule && (
          <button
            type="button"
            onClick={() => onSelectForSchedule(candidate.id)}
            className="text-xs px-2.5 py-1.5 rounded-lg border border-[#e2dfd7] bg-white text-[#555660] hover:bg-[#f0eee9] hover:text-[#333641] flex items-center gap-1.5 font-medium transition-colors cursor-pointer"
            title="Loloskan kandidat ini ke tahap jadwal wawancara"
          >
            <Calendar size={13} className="text-[#8cac91]" />
            <span>Pilih</span>
            <ArrowRight size={12} />
          </button>
        )}
      </div>

      {/* 2. Scrollable Body: Bukti & Analisis */}
      <div className="p-4 flex-1 overflow-y-auto space-y-4 text-xs text-[#444654] leading-relaxed">
        {/* Repositori Terverifikasi */}
        <div>
          <span className="text-[11px] font-bold text-[#797d8c] uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
            <GitBranch size={13} className="text-[#7285d5]" />
            Repositori Kunci ({reposCount})
          </span>
          <div className="flex flex-wrap gap-1.5">
            {dossier.auditedRepos && dossier.auditedRepos.length > 0 ? (
              dossier.auditedRepos.map((repo, idx) => (
                <span
                  key={idx}
                  className="font-mono text-[11px] px-2 py-0.5 rounded bg-[#f2f4fc] border border-[#d6defa] text-[#435bb5]"
                >
                  {repo}
                </span>
              ))
            ) : (
              <span className="text-[#8c8d97] italic">Repositori publik tidak terdeteksi</span>
            )}
          </div>
        </div>

        {/* Ringkasan Eksekutif */}
        <div>
          <span className="text-[11px] font-bold text-[#797d8c] uppercase tracking-wider block mb-1">
            Ringkasan Eksekutif
          </span>
          <p className="text-xs text-[#4b4e5d] bg-[#fbfaf8] p-2.5 rounded-lg border border-[#eceae4]">
            {dossier.overallAssessment || 'Assessment teknis belum tersedia.'}
          </p>
        </div>

        {/* Bukti Matriks Kode Terverifikasi */}
        <div>
          <span className="text-[11px] font-bold text-[#797d8c] uppercase tracking-wider block mb-1.5">
            Bukti Kode Terverifikasi ({verifiedList.length})
          </span>
          <div className="space-y-1.5">
            {verifiedList.slice(0, 3).map((item, idx) => (
              <div
                key={idx}
                className="p-2 rounded-lg bg-[#edf3ec]/60 border border-[#dce8dc] text-[#2b4c30] text-[11.5px]"
              >
                <div className="font-semibold flex items-center gap-1">
                  <CheckCircle2 size={12} className="text-[#8cac91] shrink-0" />
                  <span className="truncate">{item.claim}</span>
                </div>
                <p className="text-[11px] text-[#416045] mt-0.5 line-clamp-2">
                  {item.evidenceSummary}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Detektor Sinyal (Green Flags vs Red Flags) */}
        <div>
          <span className="text-[11px] font-bold text-[#797d8c] uppercase tracking-wider block mb-1.5">
            Radar Sinyal Wawancara
          </span>
          <div className="space-y-2">
            {dossier.interviewKit && dossier.interviewKit.length > 0 ? (
              dossier.interviewKit.slice(0, 2).map((kit, idx) => (
                <div key={idx} className="p-2 rounded-lg bg-[#f8f7f4] border border-[#e8e6df] space-y-1">
                  <div className="font-semibold text-[#333641] text-[11px]">{kit.topic}</div>
                  {kit.greenFlags && kit.greenFlags.length > 0 && (
                    <div className="flex items-start gap-1 text-[#2e5936] text-[10.5px]">
                      <span className="font-bold text-[#448b52] shrink-0">+</span>
                      <span>{kit.greenFlags[0]}</span>
                    </div>
                  )}
                  {kit.redFlags && kit.redFlags.length > 0 && (
                    <div className="flex items-start gap-1 text-[#963730] text-[10.5px]">
                      <AlertCircle size={11} className="text-[#d9756c] shrink-0 mt-0.5" />
                      <span>{kit.redFlags[0]}</span>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <span className="text-[#8c8d97] italic">Belum ada sinyal radar tercatat.</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
