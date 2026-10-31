import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Loader2, Sparkles, Terminal, ChevronDown, ChevronUp } from 'lucide-react';
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

  // FASE 1: Saat proses audit masih aktif berjalan (Screening Grayed State)
  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-[#ecebe6] py-12 px-4 flex flex-col items-center justify-center text-[#242730]">
        {/* Top Juri Shortcut */}
        <div className="w-full max-w-lg flex items-center justify-end pb-3 text-xs">
          <button
            type="button"
            onClick={onSwitchToWorkspace}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/80 hover:bg-white text-[#596aa9] text-xs font-medium cursor-pointer shadow-xs transition-colors"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#7285d5] animate-ping" />
            <span>Pantau Langsung di Workspace Tech Lead</span>
            <ArrowRight size={12} />
          </button>
        </div>

        {/* Gray Scanning Card */}
        <div className="w-full max-w-lg bg-white rounded-2xl border border-[#d6d4ce] p-8 shadow-[0_8px_30px_rgba(57,57,74,0.06)] text-center space-y-6 relative overflow-hidden">
          {/* Subtle Scanning Line Animation */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#7285d5] to-transparent animate-pulse" />

          <div className="flex justify-center pt-2">
            <OpenDotsMascot color="blue" size="lg" state="working" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#eeeff7] text-[#596aa9] text-xs font-medium">
              <Loader2 size={13} className="animate-spin text-[#7285d5]" />
              <span>Audit Forensik Kode Sedang Berjalan</span>
            </div>
            <h1 className="text-xl font-semibold text-[#242730] tracking-tight">
              Memverifikasi Portofolio GitHub Anda
            </h1>
            <p className="text-xs text-[#707070] leading-relaxed max-w-md mx-auto">
              AI Agent sedang memeriksa repositori publik, menganalisis struktur AST kode, dan memverifikasi keaslian commit author Anda.
            </p>
          </div>

          {/* Animated Processing Indicator */}
          <div className="bg-[#f6f5f1] border border-[#e8e6e1] rounded-xl p-4 text-left space-y-2.5">
            <div className="flex items-center justify-between text-xs text-[#555660]">
              <span className="font-medium flex items-center gap-1.5">
                <Sparkles size={13} className="text-[#7285d5]" />
                Pemeriksaan Otonom AI
              </span>
              <span className="text-[11px] text-[#8c8d97]">Estimasi ~10-15s</span>
            </div>
            <div className="w-full bg-[#e3e1db] h-1.5 rounded-full overflow-hidden">
              <div className="bg-[#7285d5] h-full w-2/3 animate-[pulse_1.5s_ease-in-out_infinite] rounded-full" />
            </div>
            <p className="text-[11px] text-[#8c8d97] italic">
              Mohon tunggu sejenak, layar akan otomatis beralih setelah verifikasi selesai...
            </p>
          </div>

          <div className="pt-1">
            <button
              type="button"
              onClick={onSwitchToWorkspace}
              className="w-full py-2.5 px-4 rounded-xl bg-[#242730] hover:bg-[#333641] text-white text-xs font-medium transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-sm"
            >
              <span>Buka Ruang Deliberasi Tech Lead Sekarang</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // FASE 2: Begitu proses audit selesai 100%
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
            Verifikasi Selesai & Lamaran Diterima
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
                <span className="text-[#8cac91]">Audit Selesai 100%</span>
              </div>
              <div className="space-y-1.5 text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="text-[#8cac91]">✓</span>
                  <span className="text-[#d4d6e0]">Ekstraksi CV & Analisis Klaim Teknis</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#8cac91]">✓</span>
                  <span className="text-[#d4d6e0]">GitHub Triage & Pemilihan Repositori</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#8cac91]">✓</span>
                  <span className="text-[#d4d6e0]">Pohon Sintaksis AST & Integritas Commit</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#8cac91]">✓</span>
                  <span className="text-[#d4d6e0]">Sintesis Matriks Bukti Faktual</span>
                </div>
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
