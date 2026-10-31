import React, { useEffect, useRef } from 'react';
import {
  ShieldCheck,
  Award,
  Compass,
  HelpCircle,
  CheckCircle2,
  X,
} from 'lucide-react';

interface SkillItem {
  id: string;
  title: string;
  desc: string;
  tag: string;
  icon: React.ReactNode;
  getPrompt: (candidateName: string) => string;
}

interface SkillsMenuPopoverProps {
  candidateName: string;
  isOpen: boolean;
  onClose: () => void;
  onSelectSkill: (prompt: string) => void;
}

const SKILLS: SkillItem[] = [
  {
    id: 'integritas',
    title: 'Cek Integritas CV',
    desc: 'Klaim jabatan vs keaslian kode nyata',
    tag: 'Integritas',
    icon: <ShieldCheck size={15} className="text-[#3b82f6]" />,
    getPrompt: (name) =>
      `Analisis integritas klaim di CV ${name} terhadap bukti proyek nyata di repositorinya. Apakah ada klaim yang melebih-lebihkan fakta atau indikasi numpang nama? Jelaskan dalam bahasa manusia yang mudah dipahami HRD tanpa istilah teknis rumit.`,
  },
  {
    id: 'senioritas',
    title: 'Validasi Senioritas',
    desc: 'Kematangan arsitektur & kelayakan gaji',
    tag: 'Senioritas',
    icon: <Award size={15} className="text-[#8b5cf6]" />,
    getPrompt: (name) =>
      `Berdasarkan arsitektur, kompleksitas kode, dan kematangan testing pada repositori ${name}, apakah kapasitas aslinya sepadan untuk level Senior? Apakah ekspektasi gaji tinggi masuk akal? Berikan evaluasi objektifnya.`,
  },
  {
    id: 'adaptasi',
    title: 'Risiko Adaptasi Tim',
    desc: 'Kemudahan adaptasi ke stack kantor',
    tag: 'Adaptasi',
    icon: <Compass size={15} className="text-[#10b981]" />,
    getPrompt: (name) =>
      `Jika tim kami menempatkan ${name} pada stack teknologi yang berbeda dari portofolio publiknya, apa saja risiko dan kendala adaptasi terbesarnya? Berapa lama perkiraan waktu onboarding-nya?`,
  },
  {
    id: 'interview',
    title: 'Kisi-Kisi Wawancara',
    desc: '3 pertanyaan investigasi kasus nyata',
    tag: 'Wawancara',
    icon: <HelpCircle size={15} className="text-[#f59e0b]" />,
    getPrompt: (name) =>
      `Buatkan 3 pertanyaan investigasi studi kasus nyata berdasarkan kode ${name} untuk sesi interview teknis. Sertakan kunci contekan: apa sinyal kandidat kompeten vs sinyal bualan yang harus diperhatikan pewawancara.`,
  },
  {
    id: 'keputusan',
    title: 'Rekomendasi Keputusan',
    desc: 'Pro, kontra & panduan lolos/tolak',
    tag: 'Keputusan',
    icon: <CheckCircle2 size={15} className="text-[#2b8a3e]" />,
    getPrompt: (name) =>
      `Rangkum keputusan screening akhir untuk ${name}: apa 3 alasan terkuat untuk meloloskan, apa 3 risiko terbesarnya, dan apa rekomendasi final untuk HRD (Lolos ke Interview / Perlu Uji Khusus / Tolak)?`,
  },
];

export const SkillsMenuPopover: React.FC<SkillsMenuPopoverProps> = ({
  candidateName,
  isOpen,
  onClose,
  onSelectSkill,
}) => {
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={popoverRef}
      className="absolute bottom-full mb-2.5 left-0 w-[420px] max-w-[85vw] bg-white border border-[#dedee6] rounded-2xl shadow-[0_12px_36px_rgba(57,57,74,0.14)] p-3 z-50 animate-in fade-in slide-in-from-bottom-2 duration-150"
    >
      {/* Popover Header */}
      <div className="flex items-center justify-between pb-2 mb-1.5 border-b border-[#f0eee9]">
        <div className="flex items-center gap-1.5">
          <span className="w-4 h-4 rounded-full bg-[#eeeffa] text-[#5269bb] text-[11px] font-bold flex items-center justify-center">
            ?
          </span>
          <span className="text-xs font-semibold text-[#333641]">
            Tanya Cepat HRD
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-[#8c8d97] hover:text-[#333641] p-0.5 rounded hover:bg-[#f2f1ee] transition-colors cursor-pointer"
          aria-label="Tutup menu"
        >
          <X size={13} />
        </button>
      </div>

      {/* Skills List */}
      <div className="space-y-1">
        {SKILLS.map((skill) => (
          <button
            key={skill.id}
            type="button"
            onClick={() => {
              onSelectSkill(skill.getPrompt(candidateName));
              onClose();
            }}
            className="w-full text-left p-2 rounded-xl hover:bg-[#f5f6fc] border border-transparent hover:border-[#dbe1f7] transition-all flex items-center justify-between gap-3 group cursor-pointer"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-[#f8f7f4] group-hover:bg-white flex items-center justify-center shrink-0 border border-[#eeedea] transition-colors">
                {skill.icon}
              </div>
              <div className="min-w-0">
                <div className="text-[13px] font-semibold text-[#333641] group-hover:text-[#45589c] transition-colors">
                  {skill.title}
                </div>
                <div className="text-[11.5px] text-[#787a87] truncate">
                  {skill.desc}
                </div>
              </div>
            </div>

            <span className="text-[10px] font-medium px-2 py-0.5 rounded-[5px] bg-[#f4f3f0] group-hover:bg-[#e9ecfa] text-[#636675] group-hover:text-[#45589c] shrink-0 transition-colors">
              {skill.tag}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
