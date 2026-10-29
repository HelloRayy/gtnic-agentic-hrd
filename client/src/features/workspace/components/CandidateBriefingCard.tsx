import React from 'react';
import { GitBranch, ShieldCheck, CheckCircle2, ExternalLink, Globe, Award, AlertCircle } from 'lucide-react';
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
    <div className="bg-white rounded-[15px] border border-[#e9e8e6] p-5 shadow-[0_2px_12px_rgba(57,57,74,0.04)] mb-4 space-y-4">
      {/* 1. Header Profil Kandidat */}
      <div className="flex items-start justify-between flex-wrap gap-3 pb-3 border-b border-[#f0eee9]">
        <div className="flex items-center gap-3.5">
          <OpenDotsMascot color="blue" size="md" />
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-semibold text-[#333641] m-0">{candidate.name}</h2>
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-[5px] uppercase tracking-wider ${
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
            <p className="text-xs text-[#79808a] m-0 mt-0.5">{candidate.role}</p>
          </div>
        </div>

        {/* Skor & Metrik Bukti */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-[7px] bg-[#f8f7f4] border border-[#e9e8e6] text-xs font-medium text-[#333641]">
            <Award size={13} className="text-[#8492c6]" />
            <span>Skor Faktual {candidate.matchScore}%</span>
          </div>
          <span className="text-[10.5px] font-medium tabular-nums text-[#8c8d97] bg-[#fdfcfb] px-2 py-1 rounded border border-[#eeedea]">
            {(dossier.executionTimeMs / 1000).toFixed(1)}s audit
          </span>
        </div>
      </div>

      {/* 2. Ringkasan Eksekutif & Deskripsi Portofolio */}
      <div className="bg-[#fbfaf8] border-l-3 border-[#7285d5] rounded-r-[8px] p-3 text-xs text-[#444857] leading-relaxed">
        <strong className="block text-[11px] uppercase tracking-wider text-[#8b97c3] font-semibold mb-1">
          Ringkasan Eksekutif Hasil Audit Faktual:
        </strong>
        <p className="m-0 whitespace-pre-line text-[#333641] leading-relaxed">{dossier.overallAssessment}</p>
      </div>

      {/* 3. Klaim Keahlian (Badges) */}
      <div>
        <span className="block text-[10px] uppercase tracking-wider font-semibold text-[#8c8d97] mb-1.5">
          Klaim Keahlian pada CV:
        </span>
        <div className="flex flex-wrap items-center gap-1.5">
          {dossier.candidate.claimedSkills.map((skill, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 rounded-[5px] bg-[#f8f7f4] border border-[#e3e2de] text-[#333641] text-[11px] font-medium"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* 4. Repositori Fisik yang Diaudit & Status Git Authorship */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
        <div className="p-2.5 rounded-[8px] bg-[#fdfcfb] border border-[#eeedea]">
          <span className="text-[10.5px] font-semibold text-[#8c8d97] uppercase tracking-wider block mb-1">
            Repositori Publik yang Diaudit:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {dossier.auditedRepos.length > 0 ? (
              dossier.auditedRepos.map((repo) => (
                <a
                  key={repo}
                  href={`https://github.com/${repo.includes('/') ? repo : `${dossier.candidate.githubUsername || 'kandidat'}/${repo}`}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-[#5269bb] hover:underline font-medium"
                >
                  <GitBranch size={11} />
                  <span>{repo}</span>
                  <ExternalLink size={9} />
                </a>
              ))
            ) : (
              <span className="text-xs text-[#a3a4af]">Tidak ada repositori publik terdeteksi</span>
            )}
          </div>
        </div>

        <div className="p-2.5 rounded-[8px] bg-[#fdfcfb] border border-[#eeedea] flex flex-col justify-center">
          <span className="text-[10.5px] font-semibold text-[#8c8d97] uppercase tracking-wider block mb-1">
            Tally Bukti Matriks Grounding:
          </span>
          <div className="flex items-center gap-3 text-xs">
            <span className="inline-flex items-center gap-1 text-[#2b8a3e] font-medium">
              <CheckCircle2 size={12} /> {verifiedCount} Terverifikasi
            </span>
            {transferableCount > 0 && (
              <span className="inline-flex items-center gap-1 text-[#8492c6] font-medium">
                <ShieldCheck size={12} /> {transferableCount} Serumpun
              </span>
            )}
            {missingCount > 0 && (
              <span className="inline-flex items-center gap-1 text-[#c05621] font-medium">
                <AlertCircle size={12} /> {missingCount} Perlu Tanya
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 5. Live Production Demo Website (Jika Ada) */}
      {dossier.liveDemos && dossier.liveDemos.length > 0 && (
        <div className="bg-[#eef8f6] border border-[#bce3db] rounded-[8px] p-2.5 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Globe size={14} className="text-[#35766f]" />
            <span className="text-xs font-semibold text-[#275954]">
              Website Produksi Terdeteksi:
            </span>
            <span className="text-xs text-[#35766f]">{dossier.liveDemos[0].repoName}</span>
          </div>
          <a
            href={dossier.liveDemos[0].url.startsWith('http') ? dossier.liveDemos[0].url : `https://${dossier.liveDemos[0].url}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium text-white bg-[#35766f] hover:bg-[#285d57] px-2.5 py-1 rounded-[6px] inline-flex items-center gap-1 transition-all"
          >
            <span>Buka Live Demo</span>
            <ExternalLink size={10} />
          </a>
        </div>
      )}
    </div>
  );
};
