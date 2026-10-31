import React, { useState } from 'react';
import {
  UserCheck,
  Terminal,
  ShieldCheck,
  HelpCircle,
  Mail,
  MessageSquare,
  CheckCircle2,
  Layers,
  Cpu,
  ArrowUpRight,
} from 'lucide-react';

interface ChatSuggestionsProps {
  candidateName: string;
  isDeliberating: boolean;
  onSendMessage: (prompt: string) => void;
}

type SuggestionMode = 'hrd' | 'techlead';

interface SuggestionItem {
  title: string;
  icon: React.ReactNode;
  prompt: string;
  desc: string;
}

export const ChatSuggestions: React.FC<ChatSuggestionsProps> = ({
  candidateName,
  isDeliberating,
  onSendMessage,
}) => {
  const [mode, setMode] = useState<SuggestionMode>('hrd');

  const hrdSuggestions: SuggestionItem[] = [
    {
      title: 'Cek Integritas CV',
      icon: <ShieldCheck size={16} className="text-[#3b82f6]" />,
      prompt: `Rangkum apakah klaim di CV ${candidateName} konsisten dengan bukti proyek nyata yang ditemukan. Jelaskan dalam bahasa manusia yang mudah dipahami non-programmer tanpa istilah teknis rumit.`,
      desc: 'Cek apakah klaim pengalaman kerja cocok dengan bukti nyata.',
    },
    {
      title: 'Rekomendasi Lolos/Tolak',
      icon: <HelpCircle size={16} className="text-[#10b981]" />,
      prompt: `Berdasarkan bukti forensik yang ada, apakah kandidat ${candidateName} layak dipanggil ke tahap interview teknis? Berikan poin pro, kontra, dan potensi risikonya.`,
      desc: 'Panduan keputusan cepat untuk screening tahap HRD.',
    },
    {
      title: 'Draf Email Undangan',
      icon: <Mail size={16} className="text-[#8b5cf6]" />,
      prompt: `Buatkan draf email undangan wawancara teknis yang hangat dan profesional untuk ${candidateName}, serta sebutkan apresiasi pada proyek portofolionya.`,
      desc: 'Template email resmi untuk mengundang kandidat ke interview.',
    },
    {
      title: 'Draf Email Penolakan',
      icon: <MessageSquare size={16} className="text-[#f59e0b]" />,
      prompt: `Buatkan draf email penolakan yang sopan, empatik, dan membangun untuk ${candidateName} tanpa menyinggung, serta tetap menjaga hubungan baik perusahaan.`,
      desc: 'Template penolakan halus yang menjaga employer branding.',
    },
  ];

  const techLeadSuggestions: SuggestionItem[] = [
    {
      title: 'Uji Concurrency & Locking',
      icon: <Terminal size={16} className="text-[#8492c6]" />,
      prompt: `Analisis penanganan concurrency, race condition, dan database locking pada repositori ${candidateName}.`,
      desc: 'Analisis race condition, database locking, dan state machine.',
    },
    {
      title: 'Verifikasi Test & CI/CD',
      icon: <CheckCircle2 size={16} className="text-[#8cac91]" />,
      prompt: `Berapa coverage unit test dan bagaimana kematangan workflow CI/CD pada repositori ${candidateName}?`,
      desc: 'Cakupan coverage dan kematangan workflow GitHub Actions.',
    },
    {
      title: 'Arsitektur & Code Smells',
      icon: <Layers size={16} className="text-[#e2a36b]" />,
      prompt: `Evaluasi pola arsitektur, modularitas, dan potensi technical debt pada repositori ${candidateName}. Berikan contoh berkasnya.`,
      desc: 'Analisis kerapian pola desain dan hutang teknis kode.',
    },
    {
      title: '3 Pertanyaan Uji Kode',
      icon: <Cpu size={16} className="text-[#e11d48]" />,
      prompt: `Buatkan 3 pertanyaan teknis mendalam berdasarkan berkas kode terverifikasi untuk menguji apakah ${candidateName} benar-benar menulis kodenya sendiri.`,
      desc: 'Pertanyaan teknis spesifik untuk sesi live coding/interview.',
    },
  ];

  const currentSuggestions = mode === 'hrd' ? hrdSuggestions : techLeadSuggestions;

  return (
    <div className="space-y-2.5 mb-3">
      {/* Mode Switcher Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="p-0.5 bg-[#eceae6] rounded-[8px] inline-flex items-center gap-1 border border-[#e1deda]">
          <button
            type="button"
            onClick={() => setMode('hrd')}
            className={`py-1 px-2.5 rounded-[6px] text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
              mode === 'hrd'
                ? 'bg-white text-[#333641] font-semibold shadow-[0_1px_2px_rgba(57,57,74,0.06)] border border-[#dedcd7]'
                : 'text-[#777885] hover:text-[#333641] font-medium'
            }`}
          >
            <UserCheck size={13} className={mode === 'hrd' ? 'text-[#3b82f6]' : 'text-[#8c8d97]'} />
            <span>Mode HRD (Saringan Awal)</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('techlead')}
            className={`py-1 px-2.5 rounded-[6px] text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
              mode === 'techlead'
                ? 'bg-white text-[#333641] font-semibold shadow-[0_1px_2px_rgba(57,57,74,0.06)] border border-[#dedcd7]'
                : 'text-[#777885] hover:text-[#333641] font-medium'
            }`}
          >
            <Terminal size={13} className={mode === 'techlead' ? 'text-[#8492c6]' : 'text-[#8c8d97]'} />
            <span>Mode Tech Lead (Uji Teknis)</span>
          </button>
        </div>

        <span className="text-[10px] text-[#8c8d97]">
          {mode === 'hrd'
            ? 'Pertanyaan ramah bahasa awam & keputusan rekrutmen'
            : 'Audit mendalam arsitektur, concurrency & codebase'}
        </span>
      </div>

      {/* Suggestion Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        {currentSuggestions.map((item, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSendMessage(item.prompt)}
            disabled={isDeliberating}
            className="suggestion group text-left cursor-pointer disabled:opacity-50"
          >
            <div className="mb-1">{item.icon}</div>
            <strong>{item.title}</strong>
            <p>{item.desc}</p>
            <ArrowUpRight size={13} className="group-hover:text-[#8292d6] transition-colors" />
          </button>
        ))}
      </div>
    </div>
  );
};
