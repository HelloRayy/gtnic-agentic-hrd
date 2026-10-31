import React, { useState } from 'react';
import { CheckCircle2, UploadCloud, FileText, ArrowRight, Sparkles, RefreshCw } from 'lucide-react';
import { OpenDotsMascot } from './OpenDotsMascot.js';
import {
  RECRUITMENT_PRESETS,
  DEMO_PRESET_SNIPPETS,
  type RecruitmentPreset,
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
  const [inputMode, setInputMode] = useState<'text' | 'file'>('file');
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
      const msg = err instanceof Error ? err.message : 'Gagal mengirim formulir.';
      setError(msg);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#f0ebf8] py-10 px-4 flex flex-col items-center">
        <div className="w-full max-w-xl space-y-4">
          <div className="bg-white rounded-xl border border-[#dadce0] shadow-sm overflow-hidden">
            <div className="h-2.5 bg-[#673ab7]" />
            <div className="p-7 space-y-4 text-center">
              <div className="flex justify-center">
                <OpenDotsMascot color="blue" size="lg" state="working" />
              </div>
              <div className="space-y-1">
                <h1 className="text-2xl font-normal text-[#202124]">Tanggapan Anda telah direkam.</h1>
                <p className="text-xs text-[#5f6368]">
                  AI Agent sedang menganalisis commit dan AST repositori GitHub Anda.
                </p>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={onSwitchToWorkspace}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#673ab7] hover:bg-[#5e35b1] text-white text-xs font-medium cursor-pointer shadow-sm transition-all"
                >
                  <span>Lihat di Workspace Tech Lead</span>
                  <ArrowRight size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleClear();
                    setIsSubmitted(false);
                  }}
                  className="text-xs text-[#673ab7] hover:underline font-medium py-2 px-3"
                >
                  Kirim tanggapan lain
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0ebf8] py-8 px-4 flex flex-col items-center text-[#202124]">
      {/* Top Bar Switcher to Tech Lead Workspace */}
      <div className="w-full max-w-2xl flex items-center justify-between pb-3 text-xs text-[#5f6368]">
        <div className="flex items-center gap-2">
          <OpenDotsMascot color="blue" size="sm" decorative />
          <span className="font-medium text-[#202124]">TalentTrace Ingestion Portal</span>
        </div>
        <button
          type="button"
          onClick={onSwitchToWorkspace}
          className="inline-flex items-center gap-1.5 font-medium text-[#673ab7] hover:underline cursor-pointer"
        >
          <span>Buka Workspace Tech Lead</span>
          <ArrowRight size={13} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-2xl space-y-3.5">
        {/* Header Card (Google Form Style) */}
        <div className="bg-white rounded-xl border border-[#dadce0] shadow-sm overflow-hidden">
          <div className="h-2.5 bg-[#673ab7]" />
          <div className="p-6 space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-normal text-[#202124] tracking-tight">
                  Formulir Rekrutmen Engineering
                </h1>
                <p className="text-xs text-[#5f6368] mt-1.5 leading-relaxed">
                  Screening teknis berbasis bukti repositori nyata. Tanpa tes koding buang waktu.
                </p>
              </div>
              <OpenDotsMascot color="purple" size="md" decorative />
            </div>

            {/* Quick Preset Buttons for Demo */}
            <div className="pt-2 border-t border-[#f1f3f4] flex items-center gap-2 flex-wrap">
              <span className="text-[11px] text-[#5f6368] font-medium flex items-center gap-1">
                <Sparkles size={12} className="text-[#673ab7]" />
                Demo Cepat:
              </span>
              <button
                type="button"
                onClick={() => handleApplyPresetSnippet('rayhan')}
                className="text-[11px] px-2.5 py-1 rounded-md bg-[#ede7f6] hover:bg-[#d1c4e9] text-[#512da8] font-medium transition-colors cursor-pointer"
              >
                Rayhan (Frontend Lead)
              </button>
              <button
                type="button"
                onClick={() => handleApplyPresetSnippet('johnDoe')}
                className="text-[11px] px-2.5 py-1 rounded-md bg-[#ede7f6] hover:bg-[#d1c4e9] text-[#512da8] font-medium transition-colors cursor-pointer"
              >
                John Doe (Distributed Systems)
              </button>
            </div>

            <div className="text-[11px] text-[#d93025] font-medium pt-1">
              * Menunjukkan pertanyaan yang wajib diisi
            </div>
          </div>
        </div>

        {/* Card 1: Nama Lengkap */}
        <div className="bg-white rounded-xl border border-[#dadce0] p-6 shadow-sm space-y-3 focus-within:border-l-4 focus-within:border-l-[#673ab7]">
          <label className="block text-sm font-medium text-[#202124]">
            Nama Lengkap <span className="text-[#d93025]">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="Jawaban Anda"
            value={candidateName}
            onChange={(e) => setCandidateName(e.target.value)}
            className="w-full text-sm py-1.5 border-b border-[#dadce0] focus:border-[#673ab7] outline-none transition-colors"
          />
        </div>

        {/* Card 2: Email Aktif */}
        <div className="bg-white rounded-xl border border-[#dadce0] p-6 shadow-sm space-y-3 focus-within:border-l-4 focus-within:border-l-[#673ab7]">
          <label className="block text-sm font-medium text-[#202124]">Email Aktif</label>
          <input
            type="email"
            placeholder="Jawaban Anda"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full text-sm py-1.5 border-b border-[#dadce0] focus:border-[#673ab7] outline-none transition-colors"
          />
        </div>

        {/* Card 3: Posisi yang Dilamar */}
        <div className="bg-white rounded-xl border border-[#dadce0] p-6 shadow-sm space-y-3 focus-within:border-l-4 focus-within:border-l-[#673ab7]">
          <label className="block text-sm font-medium text-[#202124]">
            Posisi yang Dilamar <span className="text-[#d93025]">*</span>
          </label>
          <div className="space-y-2.5 pt-1">
            {RECRUITMENT_PRESETS.map((preset) => (
              <label
                key={preset.id}
                className="flex items-center gap-3 cursor-pointer text-sm text-[#202124]"
              >
                <input
                  type="radio"
                  name="jobRole"
                  value={preset.id}
                  checked={selectedPresetId === preset.id}
                  onChange={() => setSelectedPresetId(preset.id)}
                  className="w-4 h-4 accent-[#673ab7]"
                />
                <span>{preset.title}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Card 4: Tautan GitHub */}
        <div className="bg-white rounded-xl border border-[#dadce0] p-6 shadow-sm space-y-3 focus-within:border-l-4 focus-within:border-l-[#673ab7]">
          <label className="block text-sm font-medium text-[#202124]">
            Tautan Profil / Repositori GitHub <span className="text-[#d93025]">*</span>
          </label>
          <input
            type="url"
            required
            placeholder="https://github.com/username"
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
            className="w-full text-sm py-1.5 border-b border-[#dadce0] focus:border-[#673ab7] outline-none transition-colors font-mono"
          />
        </div>

        {/* Card 5: CV / Portofolio */}
        <div className="bg-white rounded-xl border border-[#dadce0] p-6 shadow-sm space-y-3 focus-within:border-l-4 focus-within:border-l-[#673ab7]">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-[#202124]">
              Curriculum Vitae (CV) <span className="text-[#d93025]">*</span>
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setInputMode('file')}
                className={`text-[11px] font-medium px-2 py-0.5 rounded cursor-pointer ${
                  inputMode === 'file'
                    ? 'bg-[#673ab7] text-white'
                    : 'bg-[#f1f3f4] text-[#5f6368]'
                }`}
              >
                Upload File
              </button>
              <button
                type="button"
                onClick={() => setInputMode('text')}
                className={`text-[11px] font-medium px-2 py-0.5 rounded cursor-pointer ${
                  inputMode === 'text'
                    ? 'bg-[#673ab7] text-white'
                    : 'bg-[#f1f3f4] text-[#5f6368]'
                }`}
              >
                Tempel Teks
              </button>
            </div>
          </div>

          {inputMode === 'file' ? (
            <label className="border-2 border-dashed border-[#dadce0] hover:border-[#673ab7] rounded-lg p-5 flex flex-col items-center justify-center cursor-pointer bg-[#fafafa] transition-colors">
              <UploadCloud size={24} className="text-[#5f6368] mb-1.5" />
              <span className="text-xs text-[#202124] font-medium">
                {selectedFile ? selectedFile.name : 'Pilih file PDF CV atau seret ke sini'}
              </span>
              <span className="text-[10px] text-[#5f6368] mt-0.5">Format PDF maksimal 10MB</span>
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
              placeholder="Tempel teks ringkasan CV atau keahlian Anda di sini..."
              value={cvText}
              onChange={(e) => setCvText(e.target.value)}
              className="w-full text-xs p-3 border border-[#dadce0] rounded-lg focus:border-[#673ab7] outline-none font-mono resize-y"
            />
          )}
        </div>

        {error && (
          <div className="p-3 bg-[#fce8e6] text-[#c5221f] text-xs rounded-lg font-medium">
            {error}
          </div>
        )}

        {/* Submit Actions */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 rounded-md bg-[#673ab7] hover:bg-[#5e35b1] text-white text-xs font-medium cursor-pointer shadow-sm transition-all disabled:opacity-50"
          >
            {isLoading ? 'Mengirim & Menganalisis...' : 'Kirim'}
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="text-xs text-[#673ab7] hover:underline font-medium cursor-pointer"
          >
            Kosongkan formulir
          </button>
        </div>
      </form>
    </div>
  );
};
