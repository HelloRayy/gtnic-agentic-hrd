import React from 'react';
import { CheckCircle2, AlertCircle, GitBranch, ShieldCheck, Calendar, ArrowRight, X } from 'lucide-react';
import { CandidateAvatar } from '../CandidateAvatar.js';
import type { WorkspaceCandidate } from '../../types.js';

interface CandidateBenchmarkCardProps {
  candidate: WorkspaceCandidate;
  onSelectForSchedule?: (candidateId: string) => void;
  onRemove?: () => void;
  accentColor?: string;
}

export const CandidateBenchmarkCard: React.FC<CandidateBenchmarkCardProps> = ({
  candidate,
  onSelectForSchedule,
  onRemove,
  accentColor = '#7285d5',
}) => {
  const dossier = candidate.dossier;
  const verifiedList = dossier?.evidenceMatrix?.filter((e) => e.status === 'VERIFIED') || [];
  const totalEvidence = dossier?.evidenceMatrix?.length || 0;
  const repos = dossier?.auditedRepos || [];

  return (
    <div className="flex-1 flex flex-col bg-white border border-[#e5e3dc] rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden font-sans">
      {/* 1. Header Profil Minimalis */}
      <div className="p-4 bg-[#fbfaf8] border-b border-[#eceae4] flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <CandidateAvatar name={candidate.name} size="md" />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-[#333641] truncate">{candidate.name}</h3>
              <span
                className="text-[10px] px-2 py-0.2 rounded-full font-semibold border shrink-0 flex items-center gap-1"
                style={{
                  backgroundColor: `${accentColor}10`,
                  color: accentColor,
                  borderColor: `${accentColor}25`,
                }}
              >
                <ShieldCheck size={11} />
                {verifiedList.length}/{totalEvidence} Terverifikasi
              </span>
            </div>
            <p className="text-xs text-[#737582] truncate mt-0.5">{candidate.role || dossier.jobTitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {onSelectForSchedule && (
            <button
              type="button"
              onClick={() => onSelectForSchedule(candidate.id)}
              className="text-xs px-2.5 py-1.5 rounded-lg border border-[#dedcd3] bg-white text-[#444654] hover:bg-[#f2f0ea] hover:text-[#22242c] flex items-center gap-1 font-medium transition-colors cursor-pointer"
              title="Loloskan kandidat ini ke tahap jadwal wawancara"
            >
              <Calendar size={12} className="text-[#8cac91]" />
              <span>Pilih</span>
              <ArrowRight size={11} />
            </button>
          )}

          {onRemove && (
            <button
              type="button"
              onClick={onRemove}
              className="p-1.5 rounded-lg text-[#9ea0ac] hover:text-[#d9756c] hover:bg-[#fdf0ef] transition-colors cursor-pointer"
              title="Keluarkan dari perbandingan"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* 2. Body: Spesifikasi Rekayasa Faktual */}
      <div className="p-4 flex-1 overflow-y-auto space-y-4 text-xs text-[#444654] leading-relaxed">
        {/* Repositori Terverifikasi */}
        <div>
          <div className="text-[11px] font-semibold text-[#8c8d97] flex items-center gap-1.5 mb-1.5">
            <GitBranch size={12} className="text-[#7285d5]" />
            <span>Repositori Utama ({repos.length})</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {repos.length > 0 ? (
              repos.map((repo, idx) => (
                <span
                  key={idx}
                  className="font-mono text-[11px] px-2 py-0.5 rounded bg-[#f4f3ef] text-[#444654] border border-[#e5e3dc]"
                >
                  {repo}
                </span>
              ))
            ) : (
              <span className="text-[#8c8d97] italic text-[11px]">Tidak ada repo publik</span>
            )}
          </div>
        </div>

        {/* Ringkasan Temuan */}
        {dossier.overallAssessment && (
          <div className="text-xs text-[#525564] bg-[#fbfaf8] p-2.5 rounded-lg border border-[#eceae4] leading-normal">
            {dossier.overallAssessment}
          </div>
        )}

        {/* Bukti Matriks Kode (List Bersih) */}
        <div>
          <div className="text-[11px] font-semibold text-[#8c8d97] mb-1.5">
            Bukti Kode Nyata ({verifiedList.length})
          </div>
          <div className="space-y-1.5">
            {verifiedList.slice(0, 3).map((item, idx) => (
              <div key={idx} className="flex items-start gap-2 text-[11.5px] text-[#333641]">
                <CheckCircle2 size={13} className="text-[#8cac91] shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <span className="font-semibold text-[#2b2d35]">{item.claim}: </span>
                  <span className="text-[#555866]">{item.evidenceSummary}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Radar Hijau & Merah */}
        {dossier.interviewKit && dossier.interviewKit.length > 0 && (
          <div>
            <div className="text-[11px] font-semibold text-[#8c8d97] mb-1.5">
              Sinyal Wawancara Forensik
            </div>
            <div className="space-y-2">
              {dossier.interviewKit.slice(0, 2).map((kit, idx) => (
                <div key={idx} className="text-[11px] space-y-0.5">
                  <div className="font-medium text-[#444654]">{kit.topic}</div>
                  {kit.greenFlags?.[0] && (
                    <div className="flex items-start gap-1.5 text-[#2e5936] text-[10.5px]">
                      <span className="font-bold text-[#8cac91] shrink-0">+</span>
                      <span>{kit.greenFlags[0]}</span>
                    </div>
                  )}
                  {kit.redFlags?.[0] && (
                    <div className="flex items-start gap-1.5 text-[#a1352e] text-[10.5px]">
                      <AlertCircle size={11} className="text-[#d9756c] shrink-0 mt-0.5" />
                      <span>{kit.redFlags[0]}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
