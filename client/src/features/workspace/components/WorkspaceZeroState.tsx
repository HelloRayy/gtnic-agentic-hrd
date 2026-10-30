import React from 'react';
import { Plus, ShieldCheck, Terminal, Sparkles, BookOpen, ExternalLink } from 'lucide-react';
import { OpenDotsMascot } from './OpenDotsMascot.js';
import type { TraceEvent } from '@/types/audit.js';

interface WorkspaceZeroStateProps {
  isLoading: boolean;
  elapsedSeconds: number;
  traceEvents: TraceEvent[];
  onOpenUploadModal: () => void;
}

export const WorkspaceZeroState: React.FC<WorkspaceZeroStateProps> = ({
  isLoading,
  elapsedSeconds,
  traceEvents,
  onOpenUploadModal,
}) => {
  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-[#eeeff7] flex items-center justify-center animate-pulse">
            <OpenDotsMascot color="blue" size="md" />
          </div>
        </div>

        <div className="space-y-1.5 max-w-md">
          <h2 className="text-base font-semibold text-[#242730]">
            Audit Forensik Otonom Berjalan
          </h2>
          <p className="text-xs text-[#707070] leading-relaxed">
            AI Agent sedang membedah AST kode sumber repositori, memeriksa integritas commit, dan menyusun matriks bukti faktual.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f4f3f0] border border-[#e9e8e6] text-xs font-mono text-[#555660]">
          <span className="w-2 h-2 rounded-full bg-[#7285d5] animate-ping" />
          <span>Waktu Berjalan: {elapsedSeconds.toFixed(1)}s</span>
        </div>

        {traceEvents.length > 0 && (
          <div className="w-full max-w-xl bg-[#242730] text-[#e2e4ed] p-3.5 rounded-xl text-left text-[11px] shadow-sm space-y-1.5 max-h-48 overflow-y-auto font-mono">
            <div className="text-[10px] uppercase tracking-wider text-[#8c8d97] font-sans font-semibold pb-1 border-b border-[#363a47] flex items-center justify-between">
              <span>Jejak Penalaran Agen (CoT 4-P)</span>
              <span>{traceEvents.length} Event</span>
            </div>
            {traceEvents.map((evt, idx) => (
              <div key={idx} className="flex items-start gap-2 leading-relaxed">
                <span className="text-[#8c8d97] shrink-0 text-[10px]">{evt.timestamp}</span>
                <span
                  className={`font-semibold shrink-0 text-[10px] ${
                    evt.phase === 'PLAN'
                      ? 'text-[#8292d6]'
                      : evt.phase === 'TOOL_CALL'
                        ? 'text-[#e2a36b]'
                        : evt.phase === 'OBSERVATION'
                          ? 'text-[#8cac91]'
                          : 'text-[#d9756c]'
                  }`}
                >
                  [{evt.phase}]
                </span>
                <span className="truncate text-[#d4d6e0]">{evt.detail}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 overflow-y-auto">
      <div className="max-w-xl w-full text-center space-y-6">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-white border border-[#e9e8e6] shadow-[0_2px_8px_rgba(57,57,74,0.04)] flex items-center justify-center">
          <OpenDotsMascot color="blue" size="md" />
        </div>

        <div className="space-y-2">
          <h1 className="text-xl font-semibold text-[#242730] tracking-tight">
            Ruang Kerja Deliberasi Forensik Siap
          </h1>
          <p className="text-xs text-[#707070] leading-relaxed max-w-md mx-auto">
            Belum ada kandidat dalam antrean. Mulai sesi demonstrasi dengan menambahkan profil pelamar atau berkas CV untuk diaudit secara langsung.
          </p>
        </div>

        <div>
          <button
            type="button"
            onClick={onOpenUploadModal}
            className="inline-flex items-center gap-2 py-2.5 px-5 rounded-xl text-xs font-semibold text-white bg-[#7285d5] hover:bg-[#5f74cb] shadow-[0_2px_6px_rgba(114,133,213,0.3)] transition-all cursor-pointer"
          >
            <Plus size={15} strokeWidth={2.5} />
            <span>Tambah Pelamar untuk Diaudit</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-4 text-left">
          <div className="bg-white border border-[#e9e8e6] rounded-xl p-3.5 shadow-[0_1px_2px_rgba(57,57,74,0.02)] space-y-1.5">
            <div className="w-7 h-7 rounded-lg bg-[#eeeff7] flex items-center justify-center text-[#7285d5]">
              <ShieldCheck size={15} />
            </div>
            <div className="text-xs font-semibold text-[#242730]">Bedah AST Kode</div>
            <div className="text-[11px] text-[#707070] leading-normal">
              Memeriksa struktur file tree, dependensi riil, dan integritas commit Git kandidat.
            </div>
          </div>

          <div className="bg-white border border-[#e9e8e6] rounded-xl p-3.5 shadow-[0_1px_2px_rgba(57,57,74,0.02)] space-y-1.5">
            <div className="w-7 h-7 rounded-lg bg-[#edf3ec] flex items-center justify-center text-[#8cac91]">
              <BookOpen size={15} />
            </div>
            <div className="text-xs font-semibold text-[#242730]">Matriks Bukti Faktual</div>
            <div className="text-[11px] text-[#707070] leading-normal">
              Memetakan klaim resume terhadap baris kode nyata tanpa persentase arbitrer.
            </div>
          </div>

          <div className="bg-white border border-[#e9e8e6] rounded-xl p-3.5 shadow-[0_1px_2px_rgba(57,57,74,0.02)] space-y-1.5">
            <div className="w-7 h-7 rounded-lg bg-[#fbfaf8] border border-[#f0eee9] flex items-center justify-center text-[#e2a36b]">
              <Sparkles size={15} />
            </div>
            <div className="text-xs font-semibold text-[#242730]">Deliberasi AI Interaktif</div>
            <div className="text-[11px] text-[#707070] leading-normal">
              Konsultasi copilot dengan sitasi berkas dan integrasi 1-klik Google Meet.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
