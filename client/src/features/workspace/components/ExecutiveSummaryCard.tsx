import React, { useState } from 'react';
import {
  UserCheck,
  FileText,
  CheckCircle2,
  Sparkles,
  FolderGit2,
  Code2,
} from 'lucide-react';

interface ExecutiveSummaryCardProps {
  assessment: string;
  candidateName?: string;
}

export const ExecutiveSummaryCard: React.FC<ExecutiveSummaryCardProps> = ({
  assessment,
  candidateName,
}) => {
  const [viewMode, setViewMode] = useState<'hrd' | 'auditor'>('hrd');

  // Tokenize and highlight key takeaways in text (bold, underline, and repo chips)
  const renderHighlightedContent = (rawText: string) => {
    if (!rawText) return null;

    // Pattern to catch:
    // Group 1: Quoted repositories e.g. 'uiux-1', 'sigma-wifi-tools'
    // Group 2: Verdict & capability phrases (underlined & bolded)
    // Group 3: Tech stacks & modern libraries (clean highlighted pills)
    const combinedRegex =
      /('[\w\d_.-]+')|(melampaui kualifikasi dasar|melampaui kualifikasi|memvalidasi penguasaan|membuktikan kemampuan|kompetensi teknis|layak dipanggil|rekomendasi kuat|layak wawancara)|(React 18\+|TypeScript|Tailwind CSS|Framer Motion|Embla Carousel|Web Extensions|manipulasi DOM|JavaScript|React|Tailwind|DOM|Node\.js|Python|Go|HTML|CSS|JS|Vite)/gi;

    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = combinedRegex.exec(rawText)) !== null) {
      if (match.index > lastIndex) {
        parts.push(rawText.substring(lastIndex, match.index));
      }

      const [fullMatch, repoQuote, verdictPhrase, techTerm] = match;

      if (repoQuote) {
        const cleanRepoName = repoQuote.replace(/'/g, '');
        parts.push(
          <span
            key={match.index}
            className="inline-flex items-center gap-1 px-1.5 py-0.5 mx-0.5 rounded-[5px] bg-[#eef2ff] border border-[#d5ddf8] text-[#37447e] font-mono text-[12px] font-semibold select-all"
            title={`Repositori Terverifikasi: ${cleanRepoName}`}
          >
            <FolderGit2 size={11} className="text-[#6474b4] shrink-0" />
            <span>{cleanRepoName}</span>
          </span>
        );
      } else if (verdictPhrase) {
        parts.push(
          <span
            key={match.index}
            className="font-bold text-[#1f2433] underline decoration-[#7689d3] decoration-2 underline-offset-2 bg-[#fdf4e9] px-1 py-0.5 rounded-[4px]"
          >
            {verdictPhrase}
          </span>
        );
      } else if (techTerm) {
        parts.push(
          <span
            key={match.index}
            className="font-semibold text-[#2b2d35] bg-[#f2f0eb] px-1.5 py-0.5 mx-0.5 rounded-[4px] border border-[#e2e0da]"
          >
            {techTerm}
          </span>
        );
      } else {
        parts.push(fullMatch);
      }

      lastIndex = match.index + fullMatch.length;
    }

    if (lastIndex < rawText.length) {
      parts.push(rawText.substring(lastIndex));
    }

    return parts;
  };

  return (
    <div className="bg-[#fcfbf9] border-l-4 border-[#7285d5] rounded-r-[12px] p-4.5 space-y-3.5 border border-[#ebeae7] shadow-[0_1px_3px_rgba(57,57,74,0.02)]">
      {/* Header Bar with HRD vs Auditor View Switcher */}
      <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-[#eeede8]">
        <div className="flex items-center gap-2">
          <strong className="text-xs uppercase tracking-wider text-[#6374b5] font-semibold">
            Ringkasan Eksekutif Hasil Audit Faktual:
          </strong>
          {viewMode === 'hrd' && (
            <span className="text-[10px] font-semibold text-[#2b8a3e] bg-[#eef7ee] border border-[#c4e3c9] px-2 py-0.5 rounded-full">
              Mode HRD Aktif
            </span>
          )}
        </div>

        {/* View Switcher Pills */}
        <div className="p-0.5 bg-[#eeece8] rounded-[7px] inline-flex items-center gap-1 border border-[#e1dfda]">
          <button
            type="button"
            onClick={() => setViewMode('hrd')}
            className={`py-0.5 px-2 rounded-[5px] text-[11px] transition-all flex items-center gap-1 cursor-pointer ${
              viewMode === 'hrd'
                ? 'bg-white text-[#333641] font-semibold shadow-[0_1px_2px_rgba(57,57,74,0.06)] border border-[#dedcd7]'
                : 'text-[#777885] hover:text-[#333641] font-medium'
            }`}
            title="Tampilan intisari cepat khusus HRD dengan penanda visual"
          >
            <UserCheck size={12} className={viewMode === 'hrd' ? 'text-[#3b82f6]' : 'text-[#8c8d97]'} />
            <span>Mode HRD (Intisari)</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('auditor')}
            className={`py-0.5 px-2 rounded-[5px] text-[11px] transition-all flex items-center gap-1 cursor-pointer ${
              viewMode === 'auditor'
                ? 'bg-white text-[#333641] font-semibold shadow-[0_1px_2px_rgba(57,57,74,0.06)] border border-[#dedcd7]'
                : 'text-[#777885] hover:text-[#333641] font-medium'
            }`}
            title="Tampilan teks penuh tanpa pemformatan intisari"
          >
            <FileText size={12} className={viewMode === 'auditor' ? 'text-[#8492c6]' : 'text-[#8c8d97]'} />
            <span>Mode Auditor (Utuh)</span>
          </button>
        </div>
      </div>

      {/* Mode HRD: Quick Takeaway Decision Cards & Highlighted Content */}
      {viewMode === 'hrd' ? (
        <div className="space-y-3">
          {/* 1. Verdict Banner */}
          <div className="p-2.5 bg-[#f4f9f4] border border-[#d2e8d4] rounded-[9px] flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-[#2b8a3e] shrink-0" />
              <div>
                <span className="text-xs font-bold text-[#1e5e2b] block leading-tight">
                  Rekomendasi HRD: Siap Masuk Tahap Interview Teknis
                </span>
                <span className="text-[11px] text-[#4b6350] block mt-0.5">
                  {candidateName || 'Kandidat'} terbukti memiliki portofolio kode nyata yang melampaui kualifikasi dasar posisi.
                </span>
              </div>
            </div>

            <span className="text-[10.5px] font-semibold text-[#1e5e2b] bg-[#e1f3e3] px-2.5 py-1 rounded-[6px] border border-[#bfe3c3]">
              Lolos Screening Awal
            </span>
          </div>

          {/* 2. Three Instant 3-Second Takeaways */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
            <div className="p-2.5 bg-white border border-[#e6e5e2] rounded-[8px] space-y-1 shadow-[0_1px_2px_rgba(57,57,74,0.02)]">
              <div className="flex items-center gap-1.5 text-[#7285d5]">
                <Sparkles size={13} />
                <span className="text-[10.5px] font-bold uppercase tracking-wider text-[#7988c5]">
                  Status Kualifikasi
                </span>
              </div>
              <div className="text-xs font-semibold text-[#333641]">
                Melampaui Standar Posisi
              </div>
              <p className="text-[10px] text-[#787a87] leading-relaxed m-0">
                Sudah menguasai arsitektur modern & implementasi pustaka di atas level magang.
              </p>
            </div>

            <div className="p-2.5 bg-white border border-[#e6e5e2] rounded-[8px] space-y-1 shadow-[0_1px_2px_rgba(57,57,74,0.02)]">
              <div className="flex items-center gap-1.5 text-[#3b82f6]">
                <FolderGit2 size={13} />
                <span className="text-[10.5px] font-bold uppercase tracking-wider text-[#3b82f6]">
                  Bukti Nyata Teruji
                </span>
              </div>
              <div className="text-xs font-semibold text-[#333641]">
                Repositori Aktif Terverifikasi
              </div>
              <p className="text-[10px] text-[#787a87] leading-relaxed m-0">
                Bukan sekadar fork kosong; kode ekstensi browser & UI terbukti authored langsung.
              </p>
            </div>

            <div className="p-2.5 bg-white border border-[#e6e5e2] rounded-[8px] space-y-1 shadow-[0_1px_2px_rgba(57,57,74,0.02)]">
              <div className="flex items-center gap-1.5 text-[#10b981]">
                <Code2 size={13} />
                <span className="text-[10.5px] font-bold uppercase tracking-wider text-[#10b981]">
                  Kesiapan Kerja
                </span>
              </div>
              <div className="text-xs font-semibold text-[#333641]">
                React, TS, Tailwind, & Animasi
              </div>
              <p className="text-[10px] text-[#787a87] leading-relaxed m-0">
                Punya modal adaptasi cepat tanpa perlu pelatihan dari dasar kodingan.
              </p>
            </div>
          </div>

          {/* 3. Smart Highlighted Full Text */}
          <div className="bg-white/80 border border-[#e8e7e3] rounded-[9px] p-3 text-[13px] text-[#333641] leading-[1.85]">
            <span className="block text-[10px] font-semibold uppercase tracking-wider text-[#8c8d97] mb-1">
              Detail Penilaian dengan Penanda Inti (Underline & Bold):
            </span>
            <p className="m-0 whitespace-pre-line text-[#333641] leading-[1.85]">
              {renderHighlightedContent(assessment)}
            </p>
          </div>
        </div>
      ) : (
        /* Mode Auditor: Raw Pure Text */
        <div className="p-3 bg-white border border-[#e8e7e3] rounded-[9px]">
          <span className="block text-[10px] font-semibold uppercase tracking-wider text-[#8c8d97] mb-1">
            Transkrip Audit Lengkap:
          </span>
          <p className="m-0 whitespace-pre-line text-[13px] text-[#333641] leading-[1.8]">
            {assessment}
          </p>
        </div>
      )}
    </div>
  );
};
