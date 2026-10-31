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
    title: 'Keaslian Portofolio & CV',
    desc: 'Cek apakah proyek dibuat sendiri atau hasil salinan',
    tag: 'Keaslian',
    icon: <ShieldCheck size={15} className="text-[#3b82f6]" />,
    getPrompt: (name) =>
      `Analisis keaslian berkas dan proyek yang dilampirkan oleh ${name}, apakah murni hasil karyanya sendiri atau ada indikasi menyalin template orang lain. Jelaskan secara objektif dan mudah dipahami tim HRD.`,
  },
  {
    id: 'senioritas',
    title: 'Kesesuaian Level & Kompensasi',
    desc: 'Evaluasi apakah keahlian nyata setara level Senior',
    tag: 'Level Skill',
    icon: <Award size={15} className="text-[#8b5cf6]" />,
    getPrompt: (name) =>
      `Berdasarkan bukti kode riil pada repositori ${name}, apakah kapasitas keahlian dan kematangannya sepadan dengan level Senior serta ekspektasi kompensasi yang diminta? Berikan evaluasi komprehensif.`,
  },
  {
    id: 'adaptasi',
    title: 'Kemampuan Beradaptasi',
    desc: 'Tinjau kecepatan belajar teknologi baru di kantor',
    tag: 'Adaptasi',
    icon: <Compass size={15} className="text-[#10b981]" />,
    getPrompt: (name) =>
      `Jika perusahaan menempatkan ${name} pada sistem kerja atau teknologi yang berbeda dari portofolionya, bagaimana proyeksi kemampuan beradaptasi dan perkiraan durasi onboarding yang dibutuhkannya?`,
  },
  {
    id: 'interview',
    title: 'Panduan Pertanyaan Wawancara',
    desc: '3 pertanyaan kunci untuk menguji kemampuan pelamar',
    tag: 'Wawancara',
    icon: <HelpCircle size={15} className="text-[#f59e0b]" />,
    getPrompt: (name) =>
      `Susun 3 pertanyaan wawancara penting berdasarkan proyek riil ${name} untuk menguji pemahaman konseptual dan praktisnya, lengkap dengan panduan indikator jawaban yang kompeten.`,
  },
  {
    id: 'keputusan',
    title: 'Rekomendasi Keputusan Rekrutmen',
    desc: 'Analisis kelayakan: lanjut wawancara atau tolak',
    tag: 'Keputusan',
    icon: <CheckCircle2 size={15} className="text-[#2b8a3e]" />,
    getPrompt: (name) =>
      `Berikan rekomendasi keputusan rekrutmen tahap awal untuk ${name}: apakah kandidat layak dipanggil ke tahap wawancara teknis atau sebaiknya tidak dilanjutkan? Rangkum kelebihan utama serta risiko pertimbangannya.`,
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
            Panduan Evaluasi Kandidat
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
