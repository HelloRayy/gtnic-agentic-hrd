import React, { useState } from 'react';
import { Plus, Trash2, RotateCcw, Briefcase, CheckCircle2 } from 'lucide-react';
import { Modal } from '@/components/ui/Modal.js';
import {
  RECRUITMENT_PRESETS,
  type RecruitmentPreset,
  saveStoredJobs,
} from '../demoPresets.js';

interface ManageJobsModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobs: RecruitmentPreset[];
  onUpdateJobs: (newJobs: RecruitmentPreset[]) => void;
}

export const ManageJobsModal: React.FC<ManageJobsModalProps> = ({
  isOpen,
  onClose,
  jobs,
  onUpdateJobs,
}) => {
  const [title, setTitle] = useState('');
  const [shortLabel, setShortLabel] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleAddJob = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !jobDesc.trim()) {
      setError('Judul posisi dan kriteria teknis wajib diisi.');
      return;
    }

    const newJob: RecruitmentPreset = {
      id: `job-${Date.now()}`,
      title: title.trim(),
      shortLabel: shortLabel.trim() || title.trim().slice(0, 14),
      jobDesc: jobDesc.trim(),
    };

    const updated = [...jobs, newJob];
    onUpdateJobs(updated);
    saveStoredJobs(updated);

    setTitle('');
    setShortLabel('');
    setJobDesc('');
  };

  const handleDeleteJob = (id: string) => {
    if (jobs.length <= 1) {
      setError('Minimal harus ada 1 posisi lowongan aktif.');
      return;
    }
    const updated = jobs.filter((j) => j.id !== id);
    onUpdateJobs(updated);
    saveStoredJobs(updated);
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset daftar lowongan ke konfigurasi awal?')) {
      onUpdateJobs(RECRUITMENT_PRESETS);
      saveStoredJobs(RECRUITMENT_PRESETS);
      setError(null);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Kelola Lowongan & Kriteria Rekrutmen (Admin)"
      description="Posisi aktif ini otomatis menjadi pilihan di formulir pelamar (/apply) dan dijadikan kriteria audit AI Agent."
      maxWidth="xl"
    >
      <div className="space-y-6">
        {/* Form Tambah Posisi Baru */}
        <form onSubmit={handleAddJob} className="bg-[#fafafa] border border-[#e9e8e6] rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between pb-1">
            <span className="text-xs font-semibold text-[#242730] flex items-center gap-1.5">
              <Plus size={14} className="text-[#7285d5]" />
              Tambah Posisi Lowongan Baru
            </span>
            <button
              type="button"
              onClick={handleResetDefaults}
              className="text-[11px] text-[#8c8d97] hover:text-[#242730] flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw size={11} />
              Reset Default
            </button>
          </div>

          <div className="space-y-2">
            <input
              type="text"
              placeholder="Judul Posisi (cth. Mobile Flutter Specialist)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-lg bg-white border border-[#e3e3e8] focus:border-[#7285d5] outline-none"
            />
            <input
              type="text"
              placeholder="Label Singkat (opsional, cth. Flutter SRE)"
              value={shortLabel}
              onChange={(e) => setShortLabel(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-lg bg-white border border-[#e3e3e8] focus:border-[#7285d5] outline-none"
            />
            <textarea
              rows={2}
              placeholder="Kriteria Kebutuhan Teknis ABCD (cth. Membutuhkan 3+ tahun Flutter, Bloc/Riverpod, Clean Architecture, CI/CD Fastlane, integrasi native Android/iOS)."
              value={jobDesc}
              onChange={(e) => setJobDesc(e.target.value)}
              className="w-full text-xs p-3 rounded-lg bg-white border border-[#e3e3e8] focus:border-[#7285d5] outline-none resize-y"
            />
          </div>

          {error && (
            <div className="text-xs text-[#d9756c] font-medium">{error}</div>
          )}

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[#7285d5] hover:bg-[#5f74cb] text-white text-xs font-medium cursor-pointer shadow-sm transition-all"
            >
              Simpan Posisi Baru
            </button>
          </div>
        </form>

        {/* Daftar Posisi Aktif */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs font-semibold text-[#242730] px-1">
            <span>Daftar Lowongan Aktif ({jobs.length})</span>
            <span className="text-[11px] text-[#8c8d97] font-normal">Sinkronisasi otomatis ke /apply</span>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="flex items-start justify-between gap-3 p-3.5 rounded-xl border border-[#e9e8e6] bg-white hover:border-[#cfcfd8] transition-all"
              >
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-semibold text-[#242730]">{job.title}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#eeeff7] text-[#596aa9] font-medium">
                      {job.shortLabel}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#707070] line-clamp-2 leading-relaxed">
                    {job.jobDesc}
                  </p>
                </div>
                {jobs.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleDeleteJob(job.id)}
                    title="Hapus posisi ini"
                    className="p-1.5 rounded-lg text-[#8c8d97] hover:text-[#d9756c] hover:bg-[#fdf2f1] transition-colors cursor-pointer shrink-0"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2 border-t border-[#f0eee9] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#242730] hover:bg-[#333641] text-white text-xs font-medium cursor-pointer transition-colors"
          >
            Selesai
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ManageJobsModal;
