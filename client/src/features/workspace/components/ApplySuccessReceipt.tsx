import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Terminal, ChevronDown, ChevronUp } from 'lucide-react';
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
  const [showDebugLogs, setShowDebugLogs] = useState(false);

  const steps = [
    'Ekstraksi berkas CV & pemetaan klaim keahlian',
    'Menghubungi GitHub API & memilih repositori relevan',
    'Membedah pohon sintaksis AST & keaslian commit author',
    'Menyusun matriks bukti faktual & dossier deliberasi',
  ];

  return (
    <div className="min-h-screen bg-[#f8f7f4] py-10 px-4 flex flex-col items-center justify-center text-[#242730]">
      {/* Top Floating Bar: Khusus Juri / Demo Lomba Only */}
      <div className="w-full max-w-lg flex items-center justify-between pb-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="dotted-logo">
            <i />
            <i />
            <i />
            <i />
          </span>
          <span className="font-semibold text-[#242730] tracking-tight">TalentTrace Portal</span>
        </div>
        <button
          type="button"
          onClick={onSwitchToWorkspace}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#eeeff7] hover:bg-[#e0e4f4] text-[#596aa9] text-xs font-semibold cursor-pointer transition-colors shadow-xs"
          title="Pintasan demonstrasi untuk juri lomba"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#7285d5] animate-pulse" />
          <span>Demo Juri: Ke Workspace Tech Lead</span>
          <ArrowRight size={12} />
        </button>
      </div>

      {/* Main Applicant Confirmation Card */}
      <div className="w-full max-w-lg bg-white rounded-2xl border border-[#e9e8e6] p-8 shadow-[0_4px_24px_rgba(57,57,74,0.04)] text-center space-y-6">
        <div className="flex justify-center">
          <OpenDotsMascot color="blue" size="lg" state="complete" />
        </div>

        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e7f5ea] text-[#2b8a3e] text-xs font-medium">
            <CheckCircle2 size={13} className="text-[#2b8a3e]" />
            Lamaran Berhasil Diterima
          </span>
          <h1 className="text-xl font-semibold text-[#242730] tracking-tight">
            Terima Kasih, Berkas Anda Telah Masuk!
          </h1>
          <p className="text-xs text-[#707070] leading-relaxed max-w-md mx-auto">
            Lamaran dan portofolio Anda telah tersimpan dengan aman di sistem rekrutmen kami.
            Tim engineering akan meninjau kualifikasi teknis Anda dan menghubungi Anda melalui email atau WhatsApp untuk tahapan selanjutnya.
          </p>
        </div>

        {/* Status Info Box for Candidate */}
        <div className="bg-[#fafafa] border border-[#e9e8e6] rounded-xl p-4 text-xs text-[#555660] space-y-1.5 text-left">
          <div className="flex items-center justify-between font-medium">
            <span className="text-[#707070]">Status Aplikasi:</span>
            <span className="text-[#7285d5] font-semibold">Dalam Peninjauan Engineering Lead</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-[#8c8d97]">
            <span>Estimasi Kabar Balik:</span>
            <span>1 - 3 hari kerja</span>
          </div>
        </div>

        {/* Collapsible Debug / Inspection for Judges */}
        <div className="pt-1 text-left">
          <button
            type="button"
            onClick={() => setShowDebugLogs((prev) => !prev)}
            className="w-full flex items-center justify-between text-[11px] font-medium text-[#8c8d97] hover:text-[#555660] py-1.5 px-2 rounded-lg hover:bg-[#fafafa] transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <Terminal size={12} className="text-[#7285d5]" />
              <span>Inspeksi Pipeline Agen Forensik (Khusus Demo Juri)</span>
            </span>
            {showDebugLogs ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>

          {showDebugLogs && (
            <div className="mt-2 p-3 bg-[#242730] text-[#e2e4ed] rounded-xl text-xs space-y-2 font-mono">
              <div className="text-[10px] uppercase tracking-wider text-[#8c8d97] font-sans font-semibold pb-1 border-b border-[#363a47] flex justify-between items-center">
                <span>Autonomous Agent Pipeline</span>
                <span className="text-[#8cac91]">
                  {isAnalyzing ? 'Sedang Audit' : 'Audit Selesai'}
                </span>
              </div>
              <div className="space-y-1.5 text-[11px]">
                {steps.map((label, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-[#8cac91]">✓</span>
                    <span className="text-[#d4d6e0]">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Normal Candidate Actions */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={onReset}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#242730] hover:bg-[#333641] text-white text-xs font-medium cursor-pointer shadow-sm transition-all"
          >
            Kirim Lamaran Posisi Lain
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplySuccessReceipt;
