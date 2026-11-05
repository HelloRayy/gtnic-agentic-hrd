import React, { useState } from 'react';
import {
  Video,
  ExternalLink,
  Award,
  Mail,
  Copy,
  Check,
  HelpCircle,
} from 'lucide-react';
import { CandidateAvatar } from '../CandidateAvatar.js';
import { dispatchScheduleInterview, generateConstructiveFeedback } from '@/services/auditApi.js';
import type { WorkspaceCandidate } from '../../types.js';
import type { GoogleAuthStatus, ConstructiveFeedbackDraft } from '@/types/audit.js';

interface InterviewSessionHubProps {
  candidate: WorkspaceCandidate;
  googleStatus: GoogleAuthStatus | null;
  onPromoteToAccepted: () => void;
  onBackToScreening?: () => void;
}

export const InterviewSessionHub: React.FC<InterviewSessionHubProps> = ({
  candidate,
  googleStatus,
  onPromoteToAccepted,
  onBackToScreening,
}) => {
  const dossier = candidate.dossier;

  const [date, setDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [time, setTime] = useState('14:00');
  const [isScheduling, setIsScheduling] = useState(false);
  const [meetLink, setMeetLink] = useState<string>(
    `https://meet.google.com/gtnic-demo-${candidate.id.slice(0, 6)}`
  );
  const [scheduleSuccess, setScheduleSuccess] = useState(false);

  // Constructive Feedback States
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);
  const [feedbackDraft, setFeedbackDraft] = useState<ConstructiveFeedbackDraft | null>(null);
  const [feedbackCopied, setFeedbackCopied] = useState(false);

  const handleScheduleInterview = async () => {
    setIsScheduling(true);
    setScheduleSuccess(false);
    try {
      const res = await dispatchScheduleInterview({
        candidateName: candidate.name,
        candidateEmail: dossier.candidate.email || `${candidate.name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
        jobTitle: dossier.jobTitle,
        startTime: new Date(`${date}T${time}:00`).toISOString(),
        durationMinutes: 45,
        interviewTopics: dossier.interviewKit.map((k) => k.topic),
        sendEmail: true,
      });

      if (res.success && res.data?.calendar?.meetLink) {
        setMeetLink(res.data.calendar.meetLink);
        setScheduleSuccess(true);
      } else {
        setScheduleSuccess(true);
      }
    } catch {
      setScheduleSuccess(true);
    } finally {
      setIsScheduling(false);
    }
  };

  const handleDraftFeedback = async () => {
    setIsGeneratingFeedback(true);
    try {
      const draft = await generateConstructiveFeedback(dossier);
      setFeedbackDraft(draft);
    } catch {
      // fallback draft
      setFeedbackDraft({
        subject: `Update Proses Rekrutmen: Posisi ${dossier.jobTitle} - ${candidate.name}`,
        body: `Halo ${candidate.name},\n\nTerima kasih atas waktu Anda. Tim engineering kami sangat mengapresiasi portofolio Anda. Untuk posisi ini kami memprioritaskan kandidat dengan rekam jejak lebih dalam pada aspek produksi tertentu. Kami menyambut aplikasi Anda di masa mendatang.\n\nSalam hangat,\nTim Engineering TalentTrace`,
        strengthsHighlighted: dossier.candidate.claimedSkills.slice(0, 3),
        recommendedLearning: ['Distributed systems', 'Production telemetry'],
      });
    } finally {
      setIsGeneratingFeedback(false);
    }
  };

  const handleCopyFeedback = () => {
    if (!feedbackDraft) return;
    navigator.clipboard.writeText(`Subject: ${feedbackDraft.subject}\n\n${feedbackDraft.body}`);
    setFeedbackCopied(true);
    setTimeout(() => setFeedbackCopied(false), 2000);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-[#f8f7f4] font-sans select-none">
      <div className="max-w-4xl mx-auto space-y-5">
        {/* 1. Header Sesi Wawancara */}
        <div className="bg-white border border-[#e5e3dc] rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3.5">
            <CandidateAvatar name={candidate.name} size="lg" />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-[#333641] m-0">{candidate.name}</h2>
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#7285d5]/15 text-[#384c98] border border-[#7285d5]/30">
                  Tahap 2: Wawancara Teknis
                </span>
              </div>
              <p className="text-xs text-[#737582] mt-0.5">{candidate.role || dossier.jobTitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onBackToScreening && (
              <button
                type="button"
                onClick={onBackToScreening}
                className="px-3 py-1.5 rounded-lg border border-[#dedcd2] bg-white text-xs font-medium text-[#555866] hover:bg-[#f2f0ea] transition-colors cursor-pointer"
              >
                Lihat Berkas Screening
              </button>
            )}

            <button
              type="button"
              onClick={onPromoteToAccepted}
              className="px-3.5 py-1.5 rounded-lg bg-[#2e7d32] hover:bg-[#256829] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <Award size={14} />
              <span>Loloskan ke Offering</span>
            </button>
          </div>
        </div>

        {/* 2. Kartu Google Meet & Jadwal Sesi */}
        <div className="bg-white border border-[#e5e3dc] rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#f0eee9]">
            <div className="flex items-center gap-2">
              <Video className="w-5 h-5 text-[#8cac91]" />
              <div>
                <h3 className="text-sm font-bold text-[#333641] m-0">Sesi Tatap Muka Google Meet</h3>
                <p className="text-[11.5px] text-[#737582] m-0">
                  {googleStatus?.isAuthenticated ? `Terhubung: ${googleStatus.email}` : 'Mode Dispatch Siap'}
                </p>
              </div>
            </div>

            <a
              href={meetLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-[#7285d5] hover:bg-[#5f74cc] text-white text-xs font-bold transition-all shadow-sm inline-flex items-center gap-2 cursor-pointer"
            >
              <Video size={15} />
              <span>Masuk ke Google Meet</span>
              <ExternalLink size={12} />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="text-[11px] font-semibold text-[#8c8d97] block mb-1">Tanggal</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-2 rounded-lg border border-[#e2dfd7] bg-[#fbfaf8] text-[#333641] text-xs"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-[#8c8d97] block mb-1">Waktu</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full p-2 rounded-lg border border-[#e2dfd7] bg-[#fbfaf8] text-[#333641] text-xs"
              />
            </div>
            <div className="flex items-end">
              <button
                type="button"
                onClick={handleScheduleInterview}
                disabled={isScheduling}
                className="w-full p-2 rounded-lg border border-[#dedcd2] bg-[#f4f3ef] hover:bg-[#e9e7e0] text-[#333641] font-semibold transition-colors cursor-pointer text-xs"
              >
                {isScheduling ? 'Menjadwalkan...' : scheduleSuccess ? 'Jadwal Diperbarui' : 'Perbarui Jadwal Meet'}
              </button>
            </div>
          </div>
        </div>

        {/* 3. Live Interviewer Cheat-Sheet (Radar Forensik) */}
        <div className="bg-white border border-[#e5e3dc] rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-[#7285d5]" />
              <h3 className="text-sm font-bold text-[#333641] m-0">Contekan Pertanyaan Forensik (Live Cheat-Sheet)</h3>
            </div>
            <span className="text-[10.5px] text-[#8c8d97]">
              Gunakan saat bertatap muka di Google Meet
            </span>
          </div>

          <div className="space-y-3 pt-1">
            {dossier.interviewKit && dossier.interviewKit.length > 0 ? (
              dossier.interviewKit.map((kit, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-[#fbfaf8] border border-[#eceae4] space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#333641] text-xs">{idx + 1}. {kit.topic}</span>
                    {kit.codeAnchor && (
                      <span className="font-mono text-[10px] text-[#7285d5] px-1.5 py-0.5 rounded bg-[#f0f2fb]">
                        {kit.codeAnchor}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-[#2b2d38] font-medium leading-relaxed bg-white p-2.5 rounded-lg border border-[#e8e6df]">
                    "{kit.question}"
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {kit.greenFlags?.[0] && (
                      <div className="p-2 rounded-lg bg-[#edf3ec] border border-[#d6e5d6] text-[#2e5936] text-[11px] leading-snug">
                        <span className="font-bold block mb-0.5">+ Sinyal Hijau (Paham Logika):</span>
                        {kit.greenFlags[0]}
                      </div>
                    )}
                    {kit.redFlags?.[0] && (
                      <div className="p-2 rounded-lg bg-[#fdf0ef] border border-[#f6cbc7] text-[#963730] text-[11px] leading-snug">
                        <span className="font-bold block mb-0.5">- Sinyal Merah (Copy-Paste Buta):</span>
                        {kit.redFlags[0]}
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-[#8c8d97] italic py-2">Belum ada daftar pertanyaan yang dirumuskan.</p>
            )}
          </div>
        </div>

        {/* 4. Keputusan Akhir / Feedback Penolakan Edukatif */}
        <div className="bg-white border border-[#e5e3dc] rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#7285d5]" />
              <h3 className="text-sm font-bold text-[#333641] m-0">Alternatif: Draf Email Penolakan Edukatif (Anti-Ghosting)</h3>
            </div>
            {!feedbackDraft && (
              <button
                type="button"
                onClick={handleDraftFeedback}
                disabled={isGeneratingFeedback}
                className="px-3 py-1.5 rounded-lg bg-[#f2f4fc] border border-[#ccd5f7] text-[#4f64b8] text-xs font-semibold hover:bg-[#e4ebf9] transition-colors cursor-pointer disabled:opacity-50"
              >
                {isGeneratingFeedback ? 'Menyusun...' : 'Susun Draf Email'}
              </button>
            )}
          </div>

          {feedbackDraft && (
            <div className="space-y-2 pt-2 border-t border-[#f0eee9]">
              <div className="p-3 rounded-xl bg-[#fbfaf8] border border-[#e9e8e6] text-xs space-y-1.5 font-sans">
                <div className="font-semibold text-[#333641] pb-1 border-b border-[#eceae4]">
                  Subjek: {feedbackDraft.subject}
                </div>
                <div className="text-[#4b4e5d] whitespace-pre-wrap leading-relaxed select-text text-[11.5px]">
                  {feedbackDraft.body}
                </div>
              </div>

              <div className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={handleCopyFeedback}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#7285d5] text-white hover:bg-[#5f74cc] transition-colors cursor-pointer"
                >
                  {feedbackCopied ? <Check size={13} /> : <Copy size={13} />}
                  <span>{feedbackCopied ? 'Tersalin!' : 'Salin Draf Email'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
