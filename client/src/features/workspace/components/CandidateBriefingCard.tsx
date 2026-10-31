import React from 'react';
import { GitBranch, ShieldCheck, CheckCircle2, ExternalLink, Globe, AlertCircle } from 'lucide-react';
import { OpenDotsMascot } from './OpenDotsMascot.js';
import type { WorkspaceCandidate } from '../types.js';

interface CandidateBriefingCardProps {
  candidate: WorkspaceCandidate;
}

export const CandidateBriefingCard: React.FC<CandidateBriefingCardProps> = ({ candidate }) => {
  const { dossier } = candidate;
  const verifiedCount = dossier.evidenceMatrix.filter((e) => e.status === 'VERIFIED').length;
  const transferableCount = dossier.evidenceMatrix.filter((e) => e.status === 'TRANSFERABLE').length;
  const missingCount = dossier.evidenceMatrix.filter((e) => e.status === 'NO_PUBLIC_EVIDENCE').length;

  return (
    <div className="bg-white rounded-[18px] border border-[#e9e8e6] p-7 shadow-[0_2px_16px_rgba(57,57,74,0.04)] mb-6 space-y-6">
      {/* 1. Header Profil Kandidat */}
      <div className="flex items-start justify-between flex-wrap gap-4 pb-4 border-b border-[#f0eee9]">
        <div className="flex items-center gap-4">
          <OpenDotsMascot identity={candidate.id} size="md" />
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-xl font-semibold text-[#272a33] m-0 tracking-tight">{candidate.name}</h2>
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-[6px] uppercase tracking-wider ${
                  candidate.status === 'verified'
                    ? 'bg-[#e7f5ea] text-[#2b8a3e] border border-[#b2e2be]'
                    : candidate.status === 'partial'
                      ? 'bg-[#fff8e6] text-[#b7791f] border border-[#fbd38d]'
                      : 'bg-[#feecdc] text-[#c05621] border border-[#fbd38d]'
                }`}
              >
                {candidate.statusLabel}
              </span>
            </div>
            <p className="text-sm text-[#707784] m-0 mt-1">{candidate.role}</p>
          </div>
        </div>

        {/* Metrik Faktual Bukti */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] bg-[#eef7ee] border border-[#c4e3c9] text-xs font-semibold text-[#2b8a3e]">
            <CheckCircle2 size={14} className="text-[#2b8a3e]" />
            <span>{verifiedCount}/{dossier.evidenceMatrix.length} Klaim Terverifikasi</span>
          </div>
          <span className="text-xs font-medium tabular-nums text-[#8c8d97] bg-[#fdfcfb] px-2.5 py-1.5 rounded-[8px] border border-[#eeedea]">
            {(dossier.executionTimeMs / 1000).toFixed(1)}s audit
          </span>
        </div>
      </div>

      {/* 2. Ringkasan Eksekutif & Deskripsi Portofolio */}
      <div className="bg-[#fcfbf9] border-l-4 border-[#7285d5] rounded-r-[10px] p-4 text-[13.5px] text-[#333641] leading-[1.8]">
        <strong className="block text-xs uppercase tracking-wider text-[#7988c5] font-semibold mb-1.5">
          Ringkasan Eksekutif Hasil Audit Faktual:
        </strong>
        <p className="m-0 whitespace-pre-line text-[#333641] leading-[1.8]">{dossier.overallAssessment}</p>
      </div>

      {/* 3. Klaim Keahlian (Badges) */}
      <div>
        <span className="block text-xs uppercase tracking-wider font-semibold text-[#8c8d97] mb-2">
          Klaim Keahlian pada CV:
        </span>
        <div className="flex flex-wrap items-center gap-2">
          {dossier.candidate.claimedSkills.map((skill, idx) => (
            <span
              key={idx}
              className="px-3 py-1 rounded-[7px] bg-[#f8f7f4] border border-[#e3e2de] text-[#333641] text-[12.5px] font-medium"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* 4. Repositori Fisik yang Diaudit & Status Git Authorship */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
        <div className="p-4 rounded-[10px] bg-[#fdfcfb] border border-[#eeedea]">
          <span className="text-xs font-semibold text-[#8c8d97] uppercase tracking-wider block mb-2">
            Repositori Publik yang Diaudit:
          </span>
          <div className="flex flex-wrap gap-2">
            {dossier.auditedRepos.length > 0 ? (
              dossier.auditedRepos.map((repo) => (
                <a
                  key={repo}
                  href={`https://github.com/${repo.includes('/') ? repo : `${dossier.candidate.githubUsername || 'kandidat'}/${repo}`}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-[#5269bb] hover:underline font-medium bg-white px-2.5 py-1 rounded-[6px] border border-[#eeedea]"
                >
                  <GitBranch size={13} />
                  <span>{repo}</span>
                  <ExternalLink size={10} />
                </a>
              ))
            ) : (
              <span className="text-xs text-[#a3a4af]">Tidak ada repositori publik terdeteksi</span>
            )}
          </div>
        </div>

        <div className="p-4 rounded-[10px] bg-[#fdfcfb] border border-[#eeedea] flex flex-col justify-center">
          <span className="text-xs font-semibold text-[#8c8d97] uppercase tracking-wider block mb-2">
            Tally Bukti Matriks Grounding:
          </span>
          <div className="flex items-center gap-3.5 text-xs">
            <span className="inline-flex items-center gap-1.5 text-[#2b8a3e] font-medium">
              <CheckCircle2 size={14} /> {verifiedCount} Terverifikasi
            </span>
            {transferableCount > 0 && (
              <span className="inline-flex items-center gap-1.5 text-[#8492c6] font-medium">
                <ShieldCheck size={14} /> {transferableCount} Serumpun
              </span>
            )}
            {missingCount > 0 && (
              <span className="inline-flex items-center gap-1.5 text-[#c05621] font-medium">
                <AlertCircle size={14} /> {missingCount} Perlu Tanya
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 5. Live Production Demo Website (Jika Ada) */}
      {dossier.liveDemos && dossier.liveDemos.length > 0 && (
        <div className="bg-[#eef8f6] border border-[#bce3db] rounded-[10px] p-3.5 flex items-center justify-between flex-wrap gap-2.5">
          <div className="flex items-center gap-2">
            <Globe size={15} className="text-[#35766f]" />
            <span className="text-sm font-semibold text-[#275954]">
              Website Produksi Terdeteksi:
            </span>
            <span className="text-sm text-[#35766f] font-medium">{dossier.liveDemos[0].repoName}</span>
          </div>
          <a
            href={dossier.liveDemos[0].url.startsWith('http') ? dossier.liveDemos[0].url : `https://${dossier.liveDemos[0].url}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium text-white bg-[#35766f] hover:bg-[#285d57] px-3 py-1.5 rounded-[7px] inline-flex items-center gap-1.5 transition-all shadow-xs"
          >
            <span>Buka Live Demo</span>
            <ExternalLink size={11} />
          </a>
        </div>
      )}
    </div>
  );
};
