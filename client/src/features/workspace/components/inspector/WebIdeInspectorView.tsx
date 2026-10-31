import React from 'react';
import { Terminal, ExternalLink, Code2, CheckCircle2, ShieldAlert } from 'lucide-react';
import type { EvidenceItem, InterviewQuestion } from '@/types/audit.js';

interface WebIdeInspectorViewProps {
  auditedRepos: string[];
  githubUsername?: string;
  evidenceMatrix: EvidenceItem[];
  interviewKit: InterviewQuestion[];
}

export const WebIdeInspectorView: React.FC<WebIdeInspectorViewProps> = ({
  auditedRepos,
  githubUsername,
  evidenceMatrix,
  interviewKit,
}) => {
  const anchors = [
    ...evidenceMatrix
      .filter((e) => e.fileAnchor)
      .map((e) => ({
        repo: e.repoAnchor || auditedRepos[0] || '',
        file: e.fileAnchor || '',
        context: e.claim,
      })),
    ...interviewKit
      .filter((k) => k.codeAnchor)
      .map((k) => ({
        repo: auditedRepos[0] || '',
        file: k.codeAnchor || '',
        context: k.topic,
      })),
  ].filter((a) => Boolean(a.file));

  const primaryRepo = auditedRepos[0] || 'repository';
  const cleanPrimary = primaryRepo.includes('/')
    ? primaryRepo
    : `${githubUsername || 'kandidat'}/${primaryRepo}`;

  return (
    <div className="space-y-3.5">
      {/* Role Notice Card for HRD */}
      <div className="p-3.5 bg-[#f8f9fc] border border-[#e2e6f4] rounded-[9px] space-y-1.5">
        <div className="flex items-center gap-2 text-sm font-semibold text-[#41518c]">
          <ShieldAlert size={16} className="text-[#6474b4] shrink-0" />
          <span>Khusus User / Tech Lead</span>
        </div>
        <p className="text-xs text-[#555866] leading-relaxed">
          Bagian ini disiapkan untuk diserahkan ke User atau Tech Lead saat sesi wawancara teknis. Tim HRD tidak perlu membaca atau mengaudit baris kode secara mandiri.
        </p>
      </div>

      {/* Authentic OpenDots Computer View Bar */}
      <div className="rounded-[9px] border border-[#e9e8e6] overflow-hidden bg-white shadow-[0_1px_3px_rgba(57,57,74,0.03)]">
        <div className="browser-bar">
          <span className="w-2 h-2 rounded-full bg-[#ef4444]" />
          <span className="w-2 h-2 rounded-full bg-[#f59e0b]" />
          <span className="w-2 h-2 rounded-full bg-[#10b981]" />
          <span>https://github.dev/{cleanPrimary}</span>
        </div>
        <div className="p-3.5 bg-[#fbfaf8] text-xs space-y-2.5">
          <div className="text-xs text-[#707280]">
            Web VS Code aktif. Pohon berkas dan kode sumber terbaca langsung tanpa download lokal.
          </div>
          <a
            href={`https://github.dev/${cleanPrimary}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 px-4 rounded-[8px] text-[13px] font-medium text-white bg-[#7689d3] hover:bg-[#6177c5] inline-flex items-center justify-center gap-2 transition-all shadow-[0_1px_2px_rgba(118,137,211,0.25)]"
          >
            <Terminal size={14} />
            <span>Buka Kode Sumber (Khusus Tech Lead)</span>
            <ExternalLink size={13} />
          </a>
        </div>
      </div>

      {/* Repositories List */}
      <div className="space-y-2">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-[#a3a3ab]">
          Repositori Terverifikasi ({auditedRepos.length})
        </div>

        {auditedRepos.map((repo, idx) => {
          const cleanRepo = repo.includes('/') ? repo : `${githubUsername || 'kandidat'}/${repo}`;
          const githubDevUrl = `https://github.dev/${cleanRepo}`;
          const github1sUrl = `https://github1s.com/${cleanRepo}`;

          return (
            <div
              key={idx}
              className="p-3 bg-white border border-[#e9e8e6] rounded-[9px] shadow-[0_1px_2px_rgba(57,57,74,0.02)] space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 min-w-0">
                  <Code2 size={14} className="text-[#8292d6] shrink-0" />
                  <span className="text-xs font-semibold text-[#333641] truncate">
                    {repo}
                  </span>
                </div>
                <span className="text-[9.5px] font-medium text-[#2f5535] bg-[#edf3ec] border border-[#dae7da] px-1.5 py-0.5 rounded-[4px]">
                  Kode Sumber Terhubung
                </span>
              </div>

              <div className="flex items-center gap-1.5 pt-1">
                <a
                  href={githubDevUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-1 px-2 rounded-[6px] text-[10.5px] font-medium text-white bg-[#7689d3] hover:bg-[#6177c5] text-center inline-flex items-center justify-center gap-1 transition-all"
                >
                  <Terminal size={12} />
                  <span>github.dev</span>
                  <ExternalLink size={10} />
                </a>

                <a
                  href={github1sUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-1 px-2 rounded-[6px] text-[10.5px] font-medium text-[#333641] bg-[#f0eee9] hover:bg-[#e4e2dc] inline-flex items-center gap-1 transition-all"
                >
                  <span>1s</span>
                  <ExternalLink size={10} />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Code Anchors */}
      {anchors.length > 0 && (
        <div className="space-y-1.5 pt-1">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-[#a3a3ab]">
            Jangkar Kode Forensik ({anchors.length})
          </div>
          <div className="space-y-1.5">
            {anchors.slice(0, 4).map((anchor, idx) => (
              <div
                key={idx}
                className="p-2 bg-white border border-[#e9e8e6] rounded-[7px] flex items-center justify-between text-xs"
              >
                <div className="min-w-0">
                  <div className="text-[10.5px] font-medium text-[#333641] truncate">
                    {anchor.file}
                  </div>
                  <div className="text-[9px] text-[#8c8d97] truncate">
                    {anchor.context}
                  </div>
                </div>
                <CheckCircle2 size={13} className="text-[#8cac91] shrink-0 ml-2" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
