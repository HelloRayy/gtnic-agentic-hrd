import React, { useState } from 'react';
import { Calendar, Video, CheckCircle2, AlertCircle } from 'lucide-react';
import { dispatchScheduleInterview } from '@/services/auditApi.js';
import type { TechnicalDossier, GoogleAuthStatus } from '@/types/audit.js';

interface InterviewActionViewProps {
  dossier: TechnicalDossier;
  googleStatus: GoogleAuthStatus | null;
}

export const InterviewActionView: React.FC<InterviewActionViewProps> = ({
  dossier,
  googleStatus,
}) => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDate = tomorrow.toISOString().split('T')[0];

  const [date, setDate] = useState(defaultDate);
  const [time, setTime] = useState('14:00');
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [sendEmail, setSendEmail] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    meetLink?: string;
    eventLink?: string;
    message?: string;
  } | null>(null);

  const candidateEmail = dossier.candidate.email || `${dossier.candidate.name.toLowerCase().replace(/\s+/g, '.')}@example.com`;

  const handleSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setResult(null);

    try {
      const startTime = new Date(`${date}T${time}:00`).toISOString();
      const payload = {
        candidateName: dossier.candidate.name,
        candidateEmail,
        jobTitle: dossier.jobTitle,
        startTime,
        durationMinutes,
        interviewTopics: dossier.interviewKit.map((q) => q.topic),
        interviewerNotes: `Audit TalentTrace: ${dossier.candidate.name} - ${dossier.candidate.claimedSkills.join(', ')}`,
        sendEmail,
      };

      const res = await dispatchScheduleInterview(payload);
      if (res.success && res.data) {
        setResult({
          success: true,
          meetLink: res.data.calendar?.meetLink,
          eventLink: res.data.calendar?.eventLink,
          message: 'Undangan wawancara dan tautan Google Meet berhasil dibuat!',
        });
      } else {
        setResult({
          success: false,
          message: res.error || 'Gagal menjadwalkan wawancara.',
        });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Terjadi kesalahan jaringan.';
      setResult({
        success: false,
        message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-3.5">
      {/* Auth Status Notification */}
      <div className="p-3.5 bg-[#edf3ec]/70 border border-[#dae7da] rounded-xl text-[13px] text-[#2f5535] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Calendar className="w-4 h-4 text-[#8cac91]" />
          <div>
            <div className="font-semibold text-sm">Integrasi Google Meet & Calendar</div>
            <div className="text-xs text-[#3d6643] mt-0.5">
              {googleStatus?.isAuthenticated ? `Terhubung: ${googleStatus.email}` : 'Mode Dispatch Siap'}
            </div>
          </div>
        </div>
        <span className="w-2.5 h-2.5 rounded-full bg-[#8cac91]" />
      </div>

      {/* Result Confirmation Banner */}
      {result && (
        <div
          className={`p-3 rounded-xl border text-xs space-y-2 ${
            result.success
              ? 'bg-[#edf3ec] border-[#dae7da] text-[#2f5535]'
              : 'bg-[#fdf0ef] border-[#f6cbc7] text-[#912d26]'
          }`}
        >
          <div className="flex items-center gap-1.5 font-semibold">
            {result.success ? (
              <CheckCircle2 className="w-4 h-4 text-[#8cac91]" />
            ) : (
              <AlertCircle className="w-4 h-4 text-[#d9756c]" />
            )}
            <span>{result.message}</span>
          </div>
          {result.meetLink && (
            <div className="pt-1">
              <a
                href={result.meetLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-white border border-[#dae7da] text-[#2f5535] text-[11px] font-semibold hover:bg-[#fafafc]"
              >
                <Video className="w-3.5 h-3.5 text-[#8cac91]" />
                <span>Buka Google Meet</span>
              </a>
            </div>
          )}
        </div>
      )}

      {/* Scheduler Form */}
      <form onSubmit={handleSchedule} className="p-3.5 bg-white border border-[#e9e8e6] rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-3.5">
        <div className="text-sm font-semibold text-[#333641]">
          Jadwalkan Wawancara Forensik
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label className="text-xs font-medium text-[#737582] block mb-1">
              Tanggal
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full text-[13px] p-2 rounded-lg border border-[#e9e8e6] bg-[#fbfaf8] text-[#333641] focus:outline-none focus:border-[#7285d5]"
              required
            />
          </div>
          <div>
            <label className="text-xs font-medium text-[#737582] block mb-1">
              Waktu
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full text-[13px] p-2 rounded-lg border border-[#e9e8e6] bg-[#fbfaf8] text-[#333641] focus:outline-none focus:border-[#7285d5]"
              required
            />
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-[#737582] block mb-1.5">
            Durasi Sesi
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[30, 45, 60].map((mins) => (
              <button
                key={mins}
                type="button"
                onClick={() => setDurationMinutes(mins)}
                className={`py-1.5 text-xs rounded-lg border transition-all cursor-pointer ${
                  durationMinutes === mins
                    ? 'bg-[#7285d5] text-white border-[#7285d5] font-semibold'
                    : 'bg-[#fbfaf8] text-[#555660] border-[#e9e8e6] hover:bg-[#f0eee9]'
                }`}
              >
                {mins} mnt
              </button>
            ))}
          </div>
        </div>

        <div className="pt-1 border-t border-[#f0eee9] flex items-center justify-between text-xs">
          <label className="flex items-center gap-1.5 cursor-pointer text-[#555660]">
            <input
              type="checkbox"
              checked={sendEmail}
              onChange={(e) => setSendEmail(e.target.checked)}
              className="rounded text-[#7285d5]"
            />
            <span className="text-xs font-medium">Kirim Draf Gmail ke Pelamar</span>
          </label>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-[#7285d5] hover:bg-[#6074ca] shadow-[0_1px_3px_rgba(114,133,213,0.3)] transition-all flex items-center justify-center gap-2 disabled:opacity-50 btn-press cursor-pointer"
        >
          {isSubmitting ? (
            <span>Memproses...</span>
          ) : (
            <>
              <Calendar className="w-4 h-4" />
              <span>Jadwalkan & Kirim Undangan Meet</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
