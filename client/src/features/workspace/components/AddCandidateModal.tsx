import React, { useState } from 'react';
import { UploadCloud, Sparkles, AlertCircle } from 'lucide-react';
import { Modal } from '@/components/ui/Modal.js';
import { Button } from '@/components/ui/button.js';

interface AddCandidateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => Promise<void>;
  isLoading: boolean;
}

export const AddCandidateModal: React.FC<AddCandidateModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}) => {
  const [candidateName, setCandidateName] = useState('');
  const [jobTitle, setJobTitle] = useState('Senior Fullstack Engineer');
  const [githubUrl, setGithubUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!candidateName.trim()) {
      setError('Nama kandidat wajib diisi.');
      return;
    }

    const formData = new FormData();
    formData.append('candidateName', candidateName.trim());
    formData.append('jobTitle', jobTitle.trim());
    formData.append('githubUrl', githubUrl.trim());

    if (selectedFile) {
      formData.append('cv', selectedFile);
    }

    try {
      await onSubmit(formData);
      onClose();
      // Reset form
      setCandidateName('');
      setGithubUrl('');
      setSelectedFile(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal memulai audit kandidat.';
      setError(msg);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Tambah Pelamar & Ingest CV Baru"
      description="Masukkan data kandidat atau unggah berkas CV PDF untuk memulai audit forensik otonom."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-[#fdf0ef] border border-[#f6cbc7] rounded-xl text-xs text-[#912d26] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div>
          <label className="text-xs font-semibold text-[#333641] block mb-1">
            Nama Lengkap Kandidat *
          </label>
          <input
            type="text"
            value={candidateName}
            onChange={(e) => setCandidateName(e.target.value)}
            placeholder="Contoh: Budi Santoso"
            required
            className="w-full text-xs p-2.5 rounded-xl border border-[#e9e8e6] bg-[#fbfaf8] text-[#333641] focus:outline-none focus:border-[#7285d5]"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-[#333641] block mb-1">
            Target Posisi / Peran
          </label>
          <input
            type="text"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="Contoh: Senior Backend Engineer"
            className="w-full text-xs p-2.5 rounded-xl border border-[#e9e8e6] bg-[#fbfaf8] text-[#333641] focus:outline-none focus:border-[#7285d5]"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-[#333641] block mb-1">
            URL Profil / Repositori GitHub
          </label>
          <input
            type="text"
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
            placeholder="https://github.com/username atau @username"
            className="w-full text-xs p-2.5 rounded-xl border border-[#e9e8e6] bg-[#fbfaf8] text-[#333641] focus:outline-none focus:border-[#7285d5]"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-[#333641] block mb-1">
            Unggah Berkas CV (PDF Opsional)
          </label>
          <div className="border-2 border-dashed border-[#e9e8e6] hover:border-[#7285d5]/60 rounded-xl p-4 text-center bg-[#fbfaf8] transition-colors cursor-pointer relative">
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setSelectedFile(e.target.files[0]);
                }
              }}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <UploadCloud className="w-6 h-6 text-[#7285d5] mx-auto mb-1" />
            <div className="text-xs font-medium text-[#333641]">
              {selectedFile ? selectedFile.name : 'Pilih file PDF atau seret ke sini'}
            </div>
            <div className="text-[10px] text-[#8c8d97] mt-0.5">
              Maksimal 10MB • Format PDF
            </div>
          </div>
        </div>

        <div className="pt-2 flex justify-end gap-2 border-t border-[#f0eee9]">
          <Button type="button" variant="subtle" onClick={onClose} disabled={isLoading}>
            Batal
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            <Sparkles className="w-3.5 h-3.5 mr-1" />
            Mulai Audit Forensik
          </Button>
        </div>
      </form>
    </Modal>
  );
};
