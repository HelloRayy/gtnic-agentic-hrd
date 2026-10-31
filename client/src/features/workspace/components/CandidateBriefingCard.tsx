import React from 'react';
import { GitBranch, ShieldCheck, CheckCircle2, ExternalLink, Globe, AlertCircle, FolderGit2, Layers } from 'lucide-react';
import { CandidateAvatar } from './CandidateAvatar.js';
import { TechBadge } from '@/components/ui/TechBadge.js';
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
          <CandidateAvatar
            name={candidate.name}
            githubUrl={candidate.githubUrl}
            githubUsername={dossier.candidate.githubUsername}
            identity={candidate.id}
            size="md"
          />
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-2xl font-semibold text-[#272a33] m-0 tracking-tight">{candidate.name}</h2>
              <span
                className={`text-sm font-semibold px-3 py-1.5 rounded-[6px] uppercase tracking-wider ${
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
            <p className="text-base text-[#686f7c] m-0 mt-1.5 flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#798099] bg-[#f0eee9] px-2 py-0.5 rounded-[5px]">
                Posisi
              </span>
              <span className="font-medium text-[#3b3e4d]">{candidate.role}</span>
            </p>
          </div>
        </div>

        {/* Metrik Faktual Bukti */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-[8px] bg-[#eef7ee] border border-[#c4e3c9] text-sm font-semibold text-[#2b8a3e]">
            <CheckCircle2 size={16} className="text-[#2b8a3e]" />
            <span>{verifiedCount}/{dossier.evidenceMatrix.length} Klaim Terverifikasi</span>
          </div>
          <span className="text-sm font-medium tabular-nums text-[#8c8d97] bg-[#fdfcfb] px-3 py-2 rounded-[8px] border border-[#eeedea]">
            {(dossier.executionTimeMs / 1000).toFixed(1)}s audit
          </span>
        </div>
      </div>

      {/* 2. Ringkasan Eksekutif & Deskripsi Portofolio */}
      <div className="bg-[#fcfbf9] border-l-4 border-[#7285d5] rounded-r-[10px] p-5 text-[15px] text-[#333641] leading-[1.85]">
        <strong className="block text-[13px] uppercase tracking-wider text-[#7988c5] font-semibold mb-2">
          Ringkasan Eksekutif Hasil Audit Faktual:
        </strong>
        <p className="m-0 whitespace-pre-line text-[#333641] leading-[1.85]">{dossier.overallAssessment}</p>
      </div>

      {/* 3. Klaim Keahlian (Badges) */}
      <div>
        <span className="block text-[13px] uppercase tracking-wider font-semibold text-[#8c8d97] mb-2.5">
          Klaim Keahlian pada CV:
        </span>
        <div className="flex flex-wrap items-center gap-2">
          {dossier.candidate.claimedSkills.map((skill, idx) => (
            <TechBadge key={idx} name={skill} />
          ))}
        </div>
      </div>

      {/* 4. Repositori Fisik yang Diaudit & Status Git Authorship */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
        {/* Kolom Kiri: Repositori Publik yang Diaudit */}
        <div className="p-4.5 rounded-[12px] bg-[#fcfbf9] border border-[#eae8e3] flex flex-col justify-between shadow-[0_1px_3px_rgba(57,57,74,0.02)]">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <FolderGit2 size={15} className="text-[#7285d5]" />
                <span className="text-[12px] font-bold text-[#626471] uppercase tracking-wider">
                  Repositori Publik yang Diaudit
                </span>
              </div>
              <span className="text-[11px] font-semibold text-[#5264a7] bg-[#edf0fb] border border-[#d8e0f7] px-2 py-0.5 rounded-full">
                {dossier.auditedRepos.length} Repositori
              </span>
            </div>

            <div className="flex flex-wrap gap-2 items-start">
              {dossier.auditedRepos.length > 0 ? (
                dossier.auditedRepos.map((repo) => {
                  const fullUrl = `https://github.com/${repo.includes('/') ? repo : `${dossier.candidate.githubUsername || 'kandidat'}/${repo}`}`;
                  return (
                    <a
                      key={repo}
                      href={fullUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-2 text-[13px] text-[#333641] hover:text-[#5269bb] font-medium bg-white hover:bg-[#fafafc] px-3 py-2 rounded-[8px] border border-[#e5e4de] hover:border-[#7285d5] transition-all shadow-[0_1px_2px_rgba(57,57,74,0.03)]"
                      title={`Buka ${repo} di GitHub`}
                    >
                      <GitBranch size={14} className="text-[#7285d5] shrink-0" />
                      <span className="truncate max-w-[200px]">{repo}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] ml-0.5" title="AST Aktif" />
                      <ExternalLink size={12} className="text-[#a5a5ad] group-hover:text-[#5269bb] transition-colors" />
                    </a>
                  );
                })
              ) : (
                <span className="text-xs text-[#a3a4af] italic py-2">Tidak ada repositori publik terdeteksi</span>
              )}
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Rangkuman Bukti Faktual CV */}
        <div className="p-4.5 rounded-[12px] bg-[#fcfbf9] border border-[#eae8e3] flex flex-col justify-between shadow-[0_1px_3px_rgba(57,57,74,0.02)]">
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <Layers size={15} className="text-[#2b8a3e]" />
                <span className="text-[12px] font-bold text-[#626471] uppercase tracking-wider">
                  Rangkuman Bukti Faktual CV
                </span>
              </div>
              <span className="text-[11px] text-[#8c8d97] font-medium">
                Total {dossier.evidenceMatrix.length} Klaim
              </span>
            </div>

            {/* Sleek Segmented Progress Ratio Bar */}
            <div className="w-full h-2 rounded-full bg-[#eeedea] overflow-hidden flex gap-0.5 mb-3">
              <div
                className="bg-[#2b8a3e] transition-all duration-300"
                style={{ width: `${dossier.evidenceMatrix.length ? (verifiedCount / dossier.evidenceMatrix.length) * 100 : 0}%` }}
                title={`${verifiedCount} Terverifikasi`}
              />
              <div
                className="bg-[#5269bb] transition-all duration-300"
                style={{ width: `${dossier.evidenceMatrix.length ? (transferableCount / dossier.evidenceMatrix.length) * 100 : 0}%` }}
                title={`${transferableCount} Serumpun`}
              />
              <div
                className="bg-[#d97736] transition-all duration-300"
                style={{ width: `${dossier.evidenceMatrix.length ? (missingCount / dossier.evidenceMatrix.length) * 100 : 0}%` }}
                title={`${missingCount} Perlu Ditanyakan`}
              />
            </div>

            {/* Structured Stat Cards */}
            <div className="grid grid-cols-3 gap-2">
              <div
                className="p-2.5 rounded-[8px] bg-[#f0f9f1] border border-[#cde8d0] flex flex-col justify-between"
                title="Klaim terbukti langsung di kode repositori"
              >
                <div className="flex items-center justify-between">
                  <CheckCircle2 size={14} className="text-[#2b8a3e]" />
                  <span className="text-base font-bold text-[#206930] tabular-nums">{verifiedCount}</span>
                </div>
                <span className="text-[11px] font-semibold text-[#246b33] mt-1 leading-tight">
                  Terverifikasi
                </span>
              </div>

              <div
                className="p-2.5 rounded-[8px] bg-[#eff3fd] border border-[#d2defa] flex flex-col justify-between cursor-help"
                title="Aman untuk dilanjutkan: kandidat menguasai teknologi ekuivalen sejenis"
              >
                <div className="flex items-center justify-between">
                  <ShieldCheck size={14} className="text-[#4b63b0]" />
                  <span className="text-base font-bold text-[#344a8e] tabular-nums">{transferableCount}</span>
                </div>
                <span className="text-[11px] font-semibold text-[#344a8e] mt-1 leading-tight">
                  Serumpun
                </span>
              </div>

              <div
                className="p-2.5 rounded-[8px] bg-[#fdf6ed] border border-[#fadbc2] flex flex-col justify-between cursor-help"
                title="Belum ada bukti publik: gunakan sebagai bahan klarifikasi interview"
              >
                <div className="flex items-center justify-between">
                  <AlertCircle size={14} className="text-[#c05621]" />
                  <span className="text-base font-bold text-[#a04618] tabular-nums">{missingCount}</span>
                </div>
                <span className="text-[11px] font-semibold text-[#a04618] mt-1 leading-tight">
                  Perlu Tanya
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Live Production Demo Websites (Menampilkan Seluruh Live Deploy yang Terdeteksi) */}
      {dossier.liveDemos && dossier.liveDemos.length > 0 && (
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe size={16} className="text-[#35766f]" />
              <span className="text-[12px] font-bold text-[#275954] uppercase tracking-wider">
                Website Produksi & Live Demo Terdeteksi ({dossier.liveDemos.length})
              </span>
            </div>
            <span className="text-[11px] font-semibold text-[#275954] bg-[#dcf1ec] px-2.5 py-0.5 rounded-full border border-[#b8e2d8]">
              Live Deploy Ready
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {dossier.liveDemos.map((demo, idx) => (
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
      )}
    </div>
  );
};
