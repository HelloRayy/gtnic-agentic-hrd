import React, { useState } from 'react';
import { ApplyHeaderCard } from './ApplyHeaderCard.js';
import { ApplyPersonalInfoSection } from './ApplyPersonalInfoSection.js';
import { ApplyPortfolioSection } from './ApplyPortfolioSection.js';
import { ApplySuccessReceipt } from './ApplySuccessReceipt.js';
import {
  RECRUITMENT_PRESETS,
  DEMO_PRESET_SNIPPETS,
  getStoredJobs,
  type RecruitmentPreset,
} from '../demoPresets.js';

interface CandidateApplyPageProps {
  onSubmit: (formData: FormData) => Promise<void>;
  onSwitchToWorkspace: () => void;
  isLoading?: boolean;
  jobs?: RecruitmentPreset[];
}

export const CandidateApplyPage: React.FC<CandidateApplyPageProps> = ({
  onSubmit,
  onSwitchToWorkspace,
  isLoading = false,
  jobs,
}) => {
  const availableJobs = jobs && jobs.length > 0 ? jobs : getStoredJobs();
  const defaultPreset = availableJobs[0] || RECRUITMENT_PRESETS[0];

  const [candidateName, setCandidateName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedPresetId, setSelectedPresetId] = useState<string>(defaultPreset.id);
  const [githubUrl, setGithubUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [inputMode, setInputMode] = useState<'file' | 'text'>('file');
  const [cvText, setCvText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [additionalNote, setAdditionalNote] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const selectedPreset =
    availableJobs.find((p) => p.id === selectedPresetId) || defaultPreset;

  const handleApplyPresetSnippet = (snippetKey: 'rayhan' | 'johnDoe') => {
    const snippet = DEMO_PRESET_SNIPPETS[snippetKey];
    setCandidateName(snippet.name);
    setEmail(`${snippetKey}@example.com`);
    setPhoneNumber('081298765432');
    setGithubUrl(snippet.githubUrl);
    setLinkedinUrl(`https://linkedin.com/in/${snippetKey}`);
    setCvText(snippet.cvText);
    setInputMode('text');
    setSelectedPresetId(snippetKey === 'rayhan' ? 'frontend' : 'distributed');
    setAdditionalNote('Siap bergabung secepatnya. Sangat antusias dengan kultur tech tim ini.');
    setError(null);
  };

  const handleClear = () => {
    setCandidateName('');
    setEmail('');
    setPhoneNumber('');
    setGithubUrl('');
    setLinkedinUrl('');
    setCvText('');
    setSelectedFile(null);
    setAdditionalNote('');
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
    if (!email.trim()) {
      setError('Alamat email aktif wajib diisi.');
      return;
    }
    if (!githubUrl.trim()) {
      setError('Tautan profil atau repositori GitHub wajib diisi.');
      return;
    }
    if (inputMode === 'file' && !selectedFile && !cvText.trim()) {
      setError('Silakan lampirkan berkas PDF CV Anda.');
      return;
    }

    const formData = new FormData();
    formData.append('candidateName', candidateName.trim());
    formData.append('jobTitle', selectedPreset.title);
    formData.append('jobDesc', selectedPreset.jobDesc);
    formData.append('githubUrl', githubUrl.trim());
    formData.append('manualGithubUrl', githubUrl.trim());
    formData.append('email', email.trim());

    if (phoneNumber.trim()) formData.append('phone', phoneNumber.trim());
    if (linkedinUrl.trim()) formData.append('linkedinUrl', linkedinUrl.trim());
    if (additionalNote.trim()) formData.append('notes', additionalNote.trim());

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
      const msg = err instanceof Error ? err.message : 'Gagal mengirim berkas lamaran.';
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
      <form onSubmit={handleSubmit} className="w-full max-w-xl space-y-5">
        <ApplyHeaderCard
          onApplyPreset={handleApplyPresetSnippet}
          onSwitchToWorkspace={onSwitchToWorkspace}
        />

        <ApplyPersonalInfoSection
          candidateName={candidateName}
          setCandidateName={setCandidateName}
          email={email}
          setEmail={setEmail}
          phoneNumber={phoneNumber}
          setPhoneNumber={setPhoneNumber}
          selectedPresetId={selectedPresetId}
          setSelectedPresetId={setSelectedPresetId}
          jobs={availableJobs}
        />

        <ApplyPortfolioSection
          githubUrl={githubUrl}
          setGithubUrl={setGithubUrl}
          linkedinUrl={linkedinUrl}
          setLinkedinUrl={setLinkedinUrl}
          inputMode={inputMode}
          setInputMode={setInputMode}
          selectedFile={selectedFile}
          setSelectedFile={setSelectedFile}
          cvText={cvText}
          setCvText={setCvText}
          additionalNote={additionalNote}
          setAdditionalNote={setAdditionalNote}
        />

        {error && (
          <div className="p-3.5 bg-[#fdf2f1] border border-[#fbd3cf] text-[#d9756c] text-xs rounded-xl font-medium">
            {error}
          </div>
        )}

        {/* Submit Actions */}
        <div className="flex items-center justify-between pt-2 pb-6">
          <button
            type="submit"
            disabled={isLoading}
            className="px-7 py-3 rounded-xl bg-[#7285d5] hover:bg-[#5f74cb] text-white text-xs font-semibold cursor-pointer shadow-[0_2px_10px_rgba(114,133,213,0.3)] transition-all disabled:opacity-50"
          >
            {isLoading ? 'Sedang Memproses Lamaran...' : 'Kirim Berkas Lamaran'}
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
