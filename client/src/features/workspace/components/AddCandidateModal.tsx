import React, { useState } from 'react';
import { Sparkles, AlertCircle, FileText, UploadCloud, RotateCcw, CheckCircle2 } from 'lucide-react';
import { Modal } from '@/components/ui/Modal.js';
import { Button } from '@/components/ui/button.js';
import {
  RECRUITMENT_PRESETS,
  DEMO_PRESET_SNIPPETS,
  type RecruitmentPreset,
} from '../demoPresets.js';

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
  const defaultPreset = RECRUITMENT_PRESETS[0];

  const [selectedPresetId, setSelectedPresetId] = useState<string>(defaultPreset.id);
  const [candidateName, setCandidateName] = useState('');
  const [jobTitle, setJobTitle] = useState(defaultPreset.title);
  const [jobDesc, setJobDesc] = useState(defaultPreset.jobDesc);
  const [githubUrl, setGithubUrl] = useState('');
  const [cvText, setCvText] = useState('');
  const [inputMode, setInputMode] = useState<'text' | 'file'>('text');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSelectPreset = (preset: RecruitmentPreset) => {
    setSelectedPresetId(preset.id);
    setJobTitle(preset.title);
    setJobDesc(preset.jobDesc);
  };

  const handleApplySnippet = (snippetKey: 'rayhan' | 'johnDoe') => {
    const snippet = DEMO_PRESET_SNIPPETS[snippetKey];
    setCandidateName(snippet.name);
    setJobTitle(snippet.role);
    setJobDesc(snippet.jobDesc);
    setGithubUrl(snippet.githubUrl);
    setCvText(snippet.cvText);
    setInputMode('text');
    setSelectedPresetId(snippetKey === 'rayhan' ? 'frontend' : 'distributed');
    setError(null);
  };

  const handleResetForm = () => {
    setCandidateName('');
    setGithubUrl('');
    setCvText('');
    setSelectedFile(null);
    setSelectedPresetId(defaultPreset.id);
    setJobTitle(defaultPreset.title);
    setJobDesc(defaultPreset.jobDesc);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!candidateName.trim()) {
      setError('Nama lengkap kandidat wajib diisi.');
      return;
    }

    if (inputMode === 'text' && !cvText.trim() && !githubUrl.trim()) {
      setError('Masukkan teks CV atau URL repositori GitHub untuk diaudit.');
      return;
    }

    const formData = new FormData();
    formData.append('candidateName', candidateName.trim());
    formData.append('jobTitle', jobTitle.trim());
    formData.append('jobDesc', jobDesc.trim());
    formData.append('githubUrl', githubUrl.trim());
    formData.append('manualGithubUrl', githubUrl.trim());

    if (inputMode === 'text' && cvText.trim()) {
      formData.append('cvText', cvText.trim());
    }

    if (inputMode === 'file' && selectedFile) {
      formData.append('cv', selectedFile);
    }

    try {
      await onSubmit(formData);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal mengirim berkas audit.';
      setError(msg);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Tambah Pelamar & Ingest Rekrutmen"
      description="Pilih kriteria posisi rekrutmen dan masukkan teks CV pelamar untuk memulai audit forensik otonom."
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-[#fdf0ef] border border-[#f6cbc7] rounded-xl text-xs text-[#912d26] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* 1. Recruitment Role & Preset Selection */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-[#333641]">
              1. Kriteria Posisi Rekrutmen
            </label>
            <span className="text-xs text-[#8c8d97]">Pilih template lowongan</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {RECRUITMENT_PRESETS.map((preset) => {
              const isSelected = selectedPresetId === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className={`text-[13px] px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#eeeff7] border-[#7285d5] text-[#4d5eb0] font-medium shadow-sm'
                      : 'bg-[#fbfaf8] border-[#e9e8e6] text-[#555660] hover:bg-white'
                  }`}
                >
                  {preset.shortLabel}
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1">
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="Target Posisi / Peran"
              className="text-sm p-2.5 rounded-lg border border-[#e9e8e6] bg-[#fbfaf8] text-[#333641] focus:outline-none focus:border-[#7285d5]"
            />
            <input
              type="text"
              value={jobDesc}
              onChange={(e) => setJobDesc(e.target.value)}
              placeholder="Kualifikasi / Job Description"
              className="text-sm p-2.5 rounded-lg border border-[#e9e8e6] bg-[#fbfaf8] text-[#333641] focus:outline-none focus:border-[#7285d5]"
            />
          </div>
        </div>
        {/* 2. Candidate Identity */}
        <div className="space-y-2 pt-1 border-t border-[#f0eee9]">
          <div className="text-sm font-semibold text-[#333641]">
            2. Profil Pelamar
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-[#555660] block mb-1">
                Nama Lengkap Kandidat *
              </label>
              <input
                type="text"
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value)}
                placeholder="Contoh: Budi Santoso"
                required
                className="w-full text-sm p-2.5 rounded-lg border border-[#e9e8e6] bg-[#fbfaf8] text-[#333641] focus:outline-none focus:border-[#7285d5]"
              />
            </div>
            <div>
              <label className="text-xs text-[#555660] block mb-1">
                URL Profil / Repositori GitHub
              </label>
              <input
                type="text"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/username"
                className="w-full text-sm p-2.5 rounded-lg border border-[#e9e8e6] bg-[#fbfaf8] text-[#333641] focus:outline-none focus:border-[#7285d5]"
              />
            </div>
          </div>
        </div>

        {/* 3. CV Input Mode (Direct Text by Default) */}
        <div className="space-y-2 pt-1 border-t border-[#f0eee9]">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="text-sm font-semibold text-[#333641]">
              3. Berkas CV & Pengalaman
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleApplySnippet('rayhan')}
                className="text-xs px-2.5 py-1 rounded-md bg-[#edf3ec] border border-[#dae7da] text-[#2f5535] hover:bg-[#e4ede3] font-medium transition-colors cursor-pointer"
                title="Muat teks CV Rayhan Pratama (Terverifikasi / High Fit)"
              >
                + Template CV Rayhan (High Fit)
              </button>
              <button
                type="button"
                onClick={() => handleApplySnippet('johnDoe')}
                className="text-xs px-2.5 py-1 rounded-md bg-[#fdf0ef] border border-[#f6cbc7] text-[#912d26] hover:bg-[#fae6e4] font-medium transition-colors cursor-pointer"
                title="Muat teks CV John Doe (Klaim Bualan / Low Fit)"
              >
                + Template CV John Doe (Low Fit)
              </button>
              {(candidateName || cvText || githubUrl) && (
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="text-[10.5px] p-1 rounded-md text-[#8c8d97] hover:text-[#333641] hover:bg-[#f0eee9] transition-colors cursor-pointer"
                  title="Kosongkan form"
                >
                  <RotateCcw size={13} />
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button
              type="button"
              onClick={() => setInputMode('text')}
              className={`flex items-center gap-1.5 py-1.5 px-3 rounded-md transition-all cursor-pointer ${
                inputMode === 'text'
                  ? 'bg-white border border-[#e9e8e6] text-[#7285d5] font-semibold shadow-xs'
                  : 'text-[#8c8d97] hover:text-[#333641]'
              }`}
            >
              <FileText size={13} />
              <span>Input Teks Langsung</span>
            </button>
            <button
              type="button"
              onClick={() => setInputMode('file')}
              className={`flex items-center gap-1.5 py-1 px-2.5 rounded-md transition-all cursor-pointer ${
                inputMode === 'file'
                  ? 'bg-white border border-[#e9e8e6] text-[#7285d5] font-semibold shadow-xs'
                  : 'text-[#8c8d97] hover:text-[#333641]'
              }`}
            >
              <UploadCloud size={13} />
              <span>Unggah File PDF</span>
            </button>
          </div>

          {inputMode === 'text' ? (
            <textarea
              rows={6}
              value={cvText}
              onChange={(e) => setCvText(e.target.value)}
              placeholder="Tempel teks CV pelamar di sini (ringkasan profil, klaim keahlian, riwayat proyek, tautan GitHub)..."
              className="w-full text-[13px] p-3 rounded-xl border border-[#e9e8e6] bg-[#fbfaf8] text-[#333641] font-mono leading-relaxed focus:outline-none focus:border-[#7285d5] resize-y"
            />
          ) : (
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
              <UploadCloud className="w-5 h-5 text-[#7285d5] mx-auto mb-1" />
              <div className="text-sm font-medium text-[#333641]">
                {selectedFile ? selectedFile.name : 'Pilih file PDF atau seret ke sini'}
              </div>
              <div className="text-xs text-[#8c8d97] mt-1">
                Maksimal 10MB • Format PDF
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-3 flex items-center justify-between border-t border-[#f0eee9]">
          <div className="text-xs text-[#8c8d97] flex items-center gap-1.5">
            <CheckCircle2 size={14} className="text-[#8cac91]" />
            <span>AI akan memverifikasi bukti kode proyek & mencocokkan klaim CV</span>
          </div>
          <div className="flex items-center gap-2">
            <Button type="button" variant="subtle" onClick={onClose} disabled={isLoading}>
              Batal
            </Button>
            <Button type="submit" variant="primary" isLoading={isLoading}>
              <Sparkles className="w-3.5 h-3.5 mr-1" />
              Mulai Audit Forensik
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};
