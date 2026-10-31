import React, { useState } from 'react';
import { Copy, Check, Download, FileText, Mail, Github, Globe } from 'lucide-react';
import type { TechnicalDossier } from '@/types/audit.js';

interface CvDocumentViewProps {
  dossier: TechnicalDossier;
}

export const CvDocumentView: React.FC<CvDocumentViewProps> = ({ dossier }) => {
  const [copied, setCopied] = useState(false);
  const { candidate, jobTitle } = dossier;

  const handleCopyText = async () => {
    try {
      const fullText = `CURRICULUM VITAE - ${candidate.name}
Posisi Target: ${jobTitle}
GitHub: ${candidate.githubUrl || '-'}
Ringkasan:
${dossier.overallAssessment}

Klaim Keahlian:
${candidate.claimedSkills.join(', ')}`;
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div className="space-y-3.5 select-text">
      {/* Action Toolbar */}
      <div className="flex items-center justify-between p-2.5 bg-white border border-[#e9e8e6] rounded-xl text-xs">
        <div className="flex items-center gap-2 text-[#333641] font-semibold">
          <FileText size={15} className="text-[#7285d5]" />
          <span>Dokumen CV Pelamar</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyText}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#f6f5f2] hover:bg-[#eae8e3] text-[#333641] text-[11px] font-medium transition-colors cursor-pointer"
          >
            {copied ? <Check size={12} className="text-[#8cac91]" /> : <Copy size={12} />}
            <span>{copied ? 'Tersalin' : 'Salin Teks'}</span>
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#7285d5] hover:bg-[#5f74cb] text-white text-[11px] font-medium transition-colors cursor-pointer shadow-xs"
          >
            <Download size={12} />
            <span>Cetak / PDF</span>
          </button>
        </div>
      </div>

      {/* Realistic Paper CV Sheet */}
      <div className="bg-white border border-[#e3e1da] rounded-xl p-5 shadow-[0_2px_12px_rgba(57,57,74,0.04)] space-y-4 text-xs">
        {/* CV Header */}
        <div className="border-b border-[#f0eee9] pb-3 space-y-1">
          <h2 className="text-lg font-bold text-[#242730] m-0 tracking-tight">
            {candidate.name}
          </h2>
          <div className="text-[13px] font-semibold text-[#7285d5]">
            {jobTitle}
          </div>
          <div className="flex items-center gap-3 text-[11px] text-[#70707a] flex-wrap pt-1">
            {candidate.email && (
              <span className="inline-flex items-center gap-1">
                <Mail size={11} /> {candidate.email}
              </span>
            )}
            {candidate.githubUrl && (
              <a
                href={candidate.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[#5269bb] hover:underline"
              >
                <Github size={11} /> {candidate.githubUsername || 'github'}
              </a>
            )}
          </div>
        </div>

        {/* Professional Summary */}
        <div className="space-y-1">
          <span className="text-[11px] font-bold text-[#8c8d97] uppercase tracking-wider block">
            Ringkasan Profil & Portofolio
          </span>
          <p className="text-[12px] text-[#444754] leading-relaxed m-0">
            {dossier.overallAssessment}
          </p>
        </div>

        {/* Claimed Skills */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold text-[#8c8d97] uppercase tracking-wider block">
            Klaim Keahlian Teknis
          </span>
          <div className="flex flex-wrap gap-1.5">
            {candidate.claimedSkills.map((skill, idx) => (
              <span
                key={idx}
                className="px-2.5 py-0.5 rounded-md bg-[#f6f5f2] border border-[#e3e2de] text-[#333641] text-[11px] font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Audited Repositories Mentioned */}
        {dossier.auditedRepos.length > 0 && (
          <div className="space-y-1.5 pt-1 border-t border-[#f0eee9]">
            <span className="text-[11px] font-bold text-[#8c8d97] uppercase tracking-wider block">
              Repositori Portofolio Terlampir
            </span>
            <div className="space-y-1">
              {dossier.auditedRepos.map((repo, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded-lg bg-[#faf9f6] border border-[#f0eee9]"
                >
                  <span className="font-mono text-[11px] text-[#333641]">{repo}</span>
                  <a
                    href={`https://github.com/${repo.includes('/') ? repo : `${candidate.githubUsername || 'kandidat'}/${repo}`}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#5269bb] hover:underline text-[10.5px] font-medium inline-flex items-center gap-1"
                  >
                    <span>Buka GitHub</span>
                    <Globe size={10} />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
