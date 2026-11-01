import React, { useState } from 'react';
import {
  AlertOctagon,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Info,
  UserCheck,
} from 'lucide-react';

interface AssessmentHighlightBoxProps {
  assessment: string;
  status: 'verified' | 'partial' | 'warning' | 'unverified';
}

function highlightKeyPhrases(text: string): React.ReactNode {
  const regex = /(ketidaksesuaian fundamental|tidak direkomendasikan|belum direkomendasikan|sangat berisiko|risiko tinggi|sangat direkomendasikan|sangat layak|terverifikasi penuh|bukti terverifikasi|skill serumpun|perlu klarifikasi|tidak ditemukan bukti publik|tidak ada bukti)/gi;

  const parts = text.split(regex);
  return parts.map((part, idx) => {
    const lower = part.toLowerCase();
    if (
      lower === 'ketidaksesuaian fundamental' ||
      lower === 'tidak direkomendasikan' ||
      lower === 'belum direkomendasikan' ||
      lower === 'sangat berisiko' ||
      lower === 'risiko tinggi' ||
      lower === 'tidak ditemukan bukti publik' ||
      lower === 'tidak ada bukti'
    ) {
      return (
        <mark
          key={idx}
          className="bg-[#fee2e2] text-[#991b1b] px-1.5 py-0.5 rounded font-semibold underline decoration-[#ef4444]/40"
        >
          {part}
        </mark>
      );
    }
    if (
      lower === 'sangat direkomendasikan' ||
      lower === 'sangat layak' ||
      lower === 'terverifikasi penuh' ||
      lower === 'bukti terverifikasi'
    ) {
      return (
        <mark
          key={idx}
          className="bg-[#dcfce7] text-[#166534] px-1.5 py-0.5 rounded font-semibold underline decoration-[#22c55e]/40"
        >
          {part}
        </mark>
      );
    }
    if (lower === 'skill serumpun' || lower === 'perlu klarifikasi') {
      return (
        <mark
          key={idx}
          className="bg-[#fef3c7] text-[#92400e] px-1.5 py-0.5 rounded font-semibold underline decoration-[#f59e0b]/40"
        >
          {part}
        </mark>
      );
    }
    return part;
  });
}

export const AssessmentHighlightBox: React.FC<AssessmentHighlightBoxProps> = ({
  assessment,
  status,
}) => {
  const [isReviewed, setIsReviewed] = useState(false);

  const isNegative =
    status === 'warning' ||
    /tidak direkomendasikan|ketidaksesuaian fundamental|sangat berisiko|risiko tinggi/i.test(assessment);

  const isPositive =
    status === 'verified' &&
    !isNegative &&
    /sangat direkomendasikan|layak|terverifikasi penuh/i.test(assessment);

  const borderColor = isNegative
    ? 'border-l-4 border-[#ef4444] bg-[#fffbfb]'
    : isPositive
      ? 'border-l-4 border-[#22c55e] bg-[#fbfdfb]'
      : 'border-l-4 border-[#f59e0b] bg-[#fffdfb]';

  return (
    <div className={`rounded-r-[12px] p-5 text-[15px] text-[#333641] leading-[1.85] shadow-[0_1px_4px_rgba(57,57,74,0.03)] border-y border-r border-[#e9e8e6] ${borderColor}`}>
      {/* Header Bar with Mandatory HR Review Badge */}
      <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-[#eceae5] flex-wrap gap-2">
        <strong className="block text-[13px] uppercase tracking-wider text-[#636675] font-bold m-0">
          Ringkasan Eksekutif Hasil Audit Faktual:
        </strong>

        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#fef2f2] text-[#b91c1c] border border-[#fecaca] text-[10.5px] font-bold tracking-wide uppercase">
          <ShieldAlert size={12} className="text-[#ef4444]" />
          Wajib Ditinjau Tim HRD
        </span>
      </div>

      {/* Point of Focus Banner for HRD */}
      {isNegative && (
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#fef2f2] border border-[#fecaca] text-[#991b1b] mb-3 select-text">
          <AlertOctagon size={18} className="text-[#ef4444] shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <div className="text-xs font-bold uppercase tracking-wider text-[#b91c1c]">
              Poin Fokus Utama Rekrutmen: Indikasi Ketidaksesuaian Fundamental
            </div>
            <p className="text-[13px] font-medium leading-relaxed m-0 text-[#991b1b]">
              Kandidat tidak direkomendasikan untuk posisi ini karena portofolio nyata tidak memenuhi kriteria minimal peran.
            </p>
          </div>
        </div>
      )}

      {isPositive && (
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#f0fdf4] border border-[#bbf7d0] text-[#166534] mb-3 select-text">
          <CheckCircle2 size={18} className="text-[#22c55e] shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <div className="text-xs font-bold uppercase tracking-wider text-[#15803d]">
              Poin Fokus Utama Rekrutmen: Portofolio Terverifikasi Kuat
            </div>
            <p className="text-[13px] font-medium leading-relaxed m-0 text-[#166534]">
              Kandidat sangat direkomendasikan untuk melanjutkan ke tahapan wawancara teknis bersama tim engineering.
            </p>
          </div>
        </div>
      )}

      {!isNegative && !isPositive && (
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#fffbeb] border border-[#fde68a] text-[#92400e] mb-3 select-text">
          <AlertTriangle size={18} className="text-[#f59e0b] shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <div className="text-xs font-bold uppercase tracking-wider text-[#b45309]">
              Poin Fokus Utama Rekrutmen: Perlu Klarifikasi & Uji Praktik
            </div>
            <p className="text-[13px] font-medium leading-relaxed m-0 text-[#92400e]">
              Terdapat klaim teknologi serumpun yang memerlukan pembuktian saat sesi wawancara sebelum keputusan final.
            </p>
          </div>
        </div>
      )}

      {/* Highlighted Body Paragraphs */}
      <p className="m-0 whitespace-pre-line text-[#333641] leading-[1.85] select-text">
        {highlightKeyPhrases(assessment)}
      </p>

      {/* Human-in-the-Loop Review & Sign-Off Checkpoint */}
      <div className="mt-4 pt-3 border-t border-[#eceae5] flex items-center justify-between flex-wrap gap-3 select-none">
        <div className="flex items-start gap-2 max-w-lg">
          <Info size={14} className="text-[#7285d5] shrink-0 mt-0.5" />
          <p className="text-[11.5px] text-[#6b6f7f] leading-relaxed m-0 font-normal">
            <strong>Mandat Human-in-the-Loop:</strong> Ringkasan ini adalah data pendukung otonom. Tim HRD wajib melakukan peninjauan mandiri sebelum mengambil keputusan akhir.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsReviewed(!isReviewed)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer shadow-xs ${
            isReviewed
              ? 'bg-[#edf7ed] text-[#2e7d32] border border-[#c4e3c9]'
              : 'bg-white hover:bg-[#f6f5f2] text-[#444754] border border-[#d6d4ce]'
          }`}
          title="Tandai bahwa ringkasan ini telah divalidasi oleh HRD"
        >
          {isReviewed ? (
            <>
              <CheckCircle2 size={14} className="text-[#2e7d32]" />
              <span>Telah Ditinjau oleh Recruiter</span>
            </>
          ) : (
            <>
              <UserCheck size={14} className="text-[#7285d5]" />
              <span>Tandai Selesai Ditinjau</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
