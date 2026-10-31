import React, { useState } from 'react';
import { UploadCloud, Check } from 'lucide-react';
import { ApplyHeaderCard } from './ApplyHeaderCard.js';
import { ApplySuccessReceipt } from './ApplySuccessReceipt.js';
import {
  RECRUITMENT_PRESETS,
  DEMO_PRESET_SNIPPETS,
} from '../demoPresets.js';

interface CandidateApplyPageProps {
  onSubmit: (formData: FormData) => Promise<void>;
  onSwitchToWorkspace: () => void;
  isLoading?: boolean;
}

export const CandidateApplyPage: React.FC<CandidateApplyPageProps> = ({
  onSubmit,
  onSwitchToWorkspace,
  isLoading = false,
}) => {
  const defaultPreset = RECRUITMENT_PRESETS[0];

  const [candidateName, setCandidateName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedPresetId, setSelectedPresetId] = useState<string>(defaultPreset.id);
  const [githubUrl, setGithubUrl] = useState('');
  const [inputMode, setInputMode] = useState<'file' | 'text'>('file');
  const [cvText, setCvText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const selectedPreset =
    RECRUITMENT_PRESETS.find((p) => p.id === selectedPresetId) || defaultPreset;

  const handleApplyPresetSnippet = (snippetKey: 'rayhan' | 'johnDoe') => {
    const snippet = DEMO_PRESET_SNIPPETS[snippetKey];
    setCandidateName(snippet.name);
    setEmail(`${snippetKey}@example.com`);
    setGithubUrl(snippet.githubUrl);
    setCvText(snippet.cvText);
    setInputMode('text');
    setSelectedPresetId(snippetKey === 'rayhan' ? 'frontend' : 'distributed');
    setError(null);
  };

  const handleClear = () => {
    setCandidateName('');
    setEmail('');
    setGithubUrl('');
    setCvText('');
    setSelectedFile(null);
    setSelectedPresetId(defaultPreset.id);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!candidateName.trim()) {
      setError('Nama lengkap wajib diisi.');
      return;
    }
    if (!githubUrl.trim()) {
      setError('Tautan profil atau repositori GitHub wajib diisi.');
      return;
    }
    if (inputMode === 'file' && !selectedFile && !cvText.trim()) {
      setError('Silakan pilih berkas PDF CV atau gunakan mode input teks.');
      return;
    }

    const formData = new FormData();
    formData.append('candidateName', candidateName.trim());
    formData.append('jobTitle', selectedPreset.title);
    formData.append('jobDesc', selectedPreset.jobDesc);
    formData.append('githubUrl', githubUrl.trim());
    formData.append('manualGithubUrl', githubUrl.trim());

    if (email.trim()) {
      formData.append('email', email.trim());
    }

    if (inputMode === 'text' && cvText.trim()) {
      formData.append('cvText', cvText.trim());
    } else if (inputMode === 'file' && selectedFile) {
      formData.append('cv', selectedFile);
    } else if (cvText.trim()) {
      formData.append('cvText', cvText.trim());
    }

    try {
      await onSubmit(formData);
      setIsSubmitted(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal mengirim berkas audit.';
      setError(msg);
    }
  };

  if (isSubmitted) {
    return (
      <ApplySuccessReceipt
        onSwitchToWorkspace={onSwitchToWorkspace}
        onReset={() => {
          handleClear();
          setIsSubmitted(false);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f7f4] py-10 px-4 flex flex-col items-center text-[#242730]">
      <form onSubmit={handleSubmit} className="w-full max-w-2xl space-y-4">
        <ApplyHeaderCard
          onApplyPreset={handleApplyPresetSnippet}
          onSwitchToWorkspace={onSwitchToWorkspace}
        />

        {/* Card 1: Identitas Pelamar */}
        <div className="bg-white rounded-2xl border border-[#e9e8e6] p-6 shadow-[0_2px_8px_rgba(57,57,74,0.02)] space-y-4">
          <h2 className="text-sm font-semibold text-[#242730]">Identitas Pelamar</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-[#555660]">
                Nama Lengkap <span className="text-[#d9756c]">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="cth. Rayhan Pratama"
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#fafafa] border border-[#e3e3e8] focus:bg-white focus:border-[#7285d5] outline-none transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-[#555660]">Email</label>
              <input
                type="email"
                placeholder="cth. candidate@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#fafafa] border border-[#e3e3e8] focus:bg-white focus:border-[#7285d5] outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Card 2: Posisi yang Dilamar */}
        <div className="bg-white rounded-2xl border border-[#e9e8e6] p-6 shadow-[0_2px_8px_rgba(57,57,74,0.02)] space-y-3">
          <h2 className="text-sm font-semibold text-[#242730]">
            Posisi yang Dilamar <span className="text-[#d9756c]">*</span>
          </h2>
          <div className="space-y-2 pt-1">
            {RECRUITMENT_PRESETS.map((preset) => {
              const isSelected = selectedPresetId === preset.id;
              return (
                <label
                  key={preset.id}
                  onClick={() => setSelectedPresetId(preset.id)}
                  className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-[#7285d5] bg-[#f6f7fc]'
                      : 'border-[#e3e3e8] bg-white hover:border-[#cfcfd8]'
                  }`}
                >
                  <div className="space-y-0.5">
                    <span className="text-xs font-semibold text-[#242730]">{preset.title}</span>
                    <p className="text-[11px] text-[#707070] line-clamp-1">{preset.jobDesc}</p>
                  </div>
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ml-3 ${
                      isSelected ? 'border-[#7285d5] bg-[#7285d5]' : 'border-[#cfcfd8] bg-white'
                    }`}
                  >
                    {isSelected && <Check size={10} className="text-white" strokeWidth={3} />}
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* Card 3: Profil / Repositori GitHub */}
        <div className="bg-white rounded-2xl border border-[#e9e8e6] p-6 shadow-[0_2px_8px_rgba(57,57,74,0.02)] space-y-2.5">
          <h2 className="text-sm font-semibold text-[#242730]">
            Tautan Profil / Repositori GitHub <span className="text-[#d9756c]">*</span>
          </h2>
          <p className="text-[11px] text-[#707070]">
            Agent akan mengaudit kode sumber, riwayat commit, dan keaslian AST repositori Anda.
          </p>
          <div className="relative">
            <input
              type="url"
              required
              placeholder="https://github.com/username"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              className="w-full text-xs pl-3.5 pr-3 py-2.5 rounded-xl bg-[#fafafa] border border-[#e3e3e8] focus:bg-white focus:border-[#7285d5] outline-none transition-all font-mono"
            />
          </div>
        </div>

        {/* Card 4: Berkas CV / Portofolio */}
        <div className="bg-white rounded-2xl border border-[#e9e8e6] p-6 shadow-[0_2px_8px_rgba(57,57,74,0.02)] space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[#242730]">
              Berkas CV / Ringkasan <span className="text-[#d9756c]">*</span>
            </h2>
            <div className="flex gap-1.5 p-0.5 rounded-lg bg-[#f0eee9]">
              <button
                type="button"
                onClick={() => setInputMode('file')}
                className={`text-[11px] font-medium px-2.5 py-1 rounded-md cursor-pointer transition-all ${
                  inputMode === 'file' ? 'bg-white text-[#242730] shadow-sm' : 'text-[#707070]'
                }`}
              >
                Upload File
              </button>
              <button
                type="button"
                onClick={() => setInputMode('text')}
                className={`text-[11px] font-medium px-2.5 py-1 rounded-md cursor-pointer transition-all ${
                  inputMode === 'text' ? 'bg-white text-[#242730] shadow-sm' : 'text-[#707070]'
                }`}
              >
                Tempel Teks
              </button>
            </div>
          </div>

          {inputMode === 'file' ? (
            <label className="border-2 border-dashed border-[#e3e3e8] hover:border-[#7285d5] rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer bg-[#fafafa] transition-colors">
              <UploadCloud size={24} className="text-[#8c8d97] mb-1.5" />
              <span className="text-xs text-[#242730] font-medium">
                {selectedFile ? selectedFile.name : 'Pilih berkas PDF CV atau seret ke sini'}
              </span>
              <span className="text-[10px] text-[#8c8d97] mt-0.5">Format PDF (maksimal 10MB)</span>
              <input
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) setSelectedFile(f);
                }}
              />
            </label>
          ) : (
            <textarea
              rows={4}
              placeholder="Tempel teks ringkasan CV atau keahlian teknis Anda di sini..."
              value={cvText}
              onChange={(e) => setCvText(e.target.value)}
              className="w-full text-xs p-3.5 rounded-xl bg-[#fafafa] border border-[#e3e3e8] focus:bg-white focus:border-[#7285d5] outline-none font-mono resize-y"
            />
          )}
        </div>

        {error && (
          <div className="p-3 bg-[#fdf2f1] border border-[#fbd3cf] text-[#d9756c] text-xs rounded-xl font-medium">
            {error}
          </div>
        )}

        {/* Submit Actions */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2.5 rounded-xl bg-[#7285d5] hover:bg-[#5f74cb] text-white text-xs font-medium cursor-pointer shadow-[0_2px_8px_rgba(114,133,213,0.25)] transition-all disabled:opacity-50"
          >
            {isLoading ? 'Sedang Memproses...' : 'Kirim Lamaran'}
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="text-xs text-[#8c8d97] hover:text-[#242730] font-medium cursor-pointer transition-colors"
          >
            Reset Formulir
          </button>
        </div>
      </form>
    </div>
  );
};

export default CandidateApplyPage;
