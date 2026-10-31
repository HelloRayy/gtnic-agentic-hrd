import React, { useState, useEffect } from 'react';
import { ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { OpenDotsMascot } from './OpenDotsMascot.js';

interface ApplySuccessReceiptProps {
  onSwitchToWorkspace: () => void;
  onReset: () => void;
  isAnalyzing?: boolean;
}

export const ApplySuccessReceipt: React.FC<ApplySuccessReceiptProps> = ({
  onSwitchToWorkspace,
  onReset,
  isAnalyzing = false,
}) => {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (!isAnalyzing) {
      setActiveStep(3);
      return;
    }
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev < 3 ? prev + 1 : prev));
    }, 2800);
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  const steps = [
    'Ekstraksi berkas CV & pemetaan klaim keahlian',
    'Menghubungi GitHub API & memilih repositori relevan',
    'Membedah pohon sintaksis AST & keaslian commit author',
    'Menyusun matriks bukti faktual & dossier deliberasi',
  ];

  return (
    <div className="min-h-screen bg-[#f8f7f4] py-14 px-4 flex flex-col items-center justify-center">
      <div className="w-full max-w-lg bg-white rounded-2xl border border-[#e9e8e6] p-8 shadow-[0_4px_24px_rgba(57,57,74,0.04)] text-center space-y-6">
        <div className="flex justify-center">
          <OpenDotsMascot
            color="blue"
            size="lg"
            state={isAnalyzing ? 'working' : 'complete'}
          />
        </div>

        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#eeeff7] text-[#596aa9] text-xs font-medium">
            {isAnalyzing ? (
              <>
                <Loader2 size={12} className="animate-spin text-[#7285d5]" />
                Audit Forensik Berjalan
              </>
            ) : (
              <>
                <CheckCircle2 size={12} className="text-[#3b8a5b]" />
                Audit Selesai 100%
              </>
            )}
          </span>
          <h1 className="text-xl font-semibold text-[#242730] tracking-tight">
            {isAnalyzing ? 'Lamaran Diterima & Sedang Diaudit' : 'Berkas Berhasil Terverifikasi'}
          </h1>
          <p className="text-xs text-[#707070] leading-relaxed max-w-sm mx-auto">
            {isAnalyzing
              ? 'AI Agent sedang membedah AST kode dan riwayat commit repositori Anda secara otonom.'
              : 'Seluruh klaim teknis telah dicocokkan dengan bukti repositori nyata dan siap di meja Tech Lead.'}
          </p>
        </div>

        {/* Live Step Progress Box */}
        <div className="bg-[#fafafa] border border-[#e9e8e6] rounded-xl p-4 text-left space-y-2.5">
          <div className="text-[11px] font-semibold text-[#555660] flex items-center justify-between pb-1 border-b border-[#f0eee9]">
            <span>Tahapan Pemeriksaan Agen</span>
            <span className="text-[#7285d5] font-mono text-[10px]">
              {isAnalyzing ? `Tahap ${activeStep + 1} dari 4` : 'Lengkap'}
            </span>
          </div>

          <div className="space-y-2">
            {steps.map((label, idx) => {
              const isPast = !isAnalyzing || idx < activeStep;
              const isCurrent = isAnalyzing && idx === activeStep;

              return (
                <div key={idx} className="flex items-center gap-2.5 text-xs">
                  {isPast ? (
                    <span className="w-4 h-4 rounded-full bg-[#e8f5e9] text-[#2e7d32] flex items-center justify-center shrink-0 text-[10px] font-bold">
                      ✓
                    </span>
                  ) : isCurrent ? (
                    <Loader2 size={14} className="animate-spin text-[#7285d5] shrink-0" />
                  ) : (
                    <span className="w-4 h-4 rounded-full bg-[#f0eee9] text-[#8c8d97] flex items-center justify-center shrink-0 text-[10px]">
                      {idx + 1}
                    </span>
                  )}
                  <span
                    className={
                      isCurrent
                        ? 'font-medium text-[#242730]'
                        : isPast
                          ? 'text-[#555660]'
                          : 'text-[#a0a0ab]'
                    }
                  >
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={onSwitchToWorkspace}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#7285d5] hover:bg-[#5f74cb] text-white text-xs font-semibold cursor-pointer shadow-sm transition-all"
          >
            <span>Buka Ruang Deliberasi Tech Lead</span>
            <ArrowRight size={14} />
          </button>
          <button
            type="button"
            onClick={onReset}
            className="text-xs text-[#707070] hover:text-[#242730] font-medium py-2 px-3 cursor-pointer"
          >
            Kirim lamaran lain
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplySuccessReceipt;
