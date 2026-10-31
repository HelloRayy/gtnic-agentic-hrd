import React from 'react';
import { UploadCloud, FileCheck, X } from 'lucide-react';

interface ApplyPortfolioSectionProps {
  githubUrl: string;
  setGithubUrl: (v: string) => void;
  linkedinUrl: string;
  setLinkedinUrl: (v: string) => void;
  inputMode: 'file' | 'text';
  setInputMode: (v: 'file' | 'text') => void;
  selectedFile: File | null;
  setSelectedFile: (f: File | null) => void;
  cvText: string;
  setCvText: (v: string) => void;
  additionalNote: string;
  setAdditionalNote: (v: string) => void;
}

export const ApplyPortfolioSection: React.FC<ApplyPortfolioSectionProps> = ({
  githubUrl,
  setGithubUrl,
  linkedinUrl,
  setLinkedinUrl,
  inputMode,
  setInputMode,
  selectedFile,
  setSelectedFile,
  cvText,
  setCvText,
  additionalNote,
  setAdditionalNote,
}) => {
  return (
    <>
      {/* Section 3: Portofolio Rekayasa Teknis */}
      <div className="bg-white rounded-2xl border border-[#e9e8e6] p-6 shadow-[0_2px_8px_rgba(57,57,74,0.02)] space-y-4">
        <div className="border-b border-[#f0eee9] pb-2">
          <h2 className="text-sm font-semibold text-[#242730]">
            3. Portofolio Kode & Profil Profesional
          </h2>
        </div>

        <div className="space-y-1.5 w-full">
          <label className="block text-xs font-medium text-[#555660]">
            Profil / Repositori GitHub <span className="text-[#d9756c]">*</span>
          </label>
          <input
            type="url"
            required
            placeholder="https://github.com/username"
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
            className="w-full text-xs px-3.5 py-3 rounded-xl bg-[#fafafa] border border-[#e3e3e8] focus:bg-white focus:border-[#7285d5] focus:ring-2 focus:ring-[#7285d5]/15 outline-none font-mono transition-all"
          />
        </div>

        <div className="space-y-1.5 w-full">
          <label className="block text-xs font-medium text-[#555660]">
            Tautan Profil LinkedIn
          </label>
          <input
            type="url"
            placeholder="https://linkedin.com/in/username"
            value={linkedinUrl}
            onChange={(e) => setLinkedinUrl(e.target.value)}
            className="w-full text-xs px-3.5 py-3 rounded-xl bg-[#fafafa] border border-[#e3e3e8] focus:bg-white focus:border-[#7285d5] focus:ring-2 focus:ring-[#7285d5]/15 outline-none font-mono transition-all"
          />
        </div>
      </div>

      {/* Section 4: Berkas Resume & Catatan */}
      <div className="bg-white rounded-2xl border border-[#e9e8e6] p-6 shadow-[0_2px_8px_rgba(57,57,74,0.02)] space-y-4">
        <div className="flex items-center justify-between border-b border-[#f0eee9] pb-2">
          <h2 className="text-sm font-semibold text-[#242730]">
            4. Berkas CV & Catatan <span className="text-[#d9756c]">*</span>
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
          <div>
            {selectedFile ? (
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-[#7285d5]/30 bg-[#f6f7fc]">
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <FileCheck size={18} className="text-[#7285d5] shrink-0" />
                  <span className="text-xs font-medium text-[#242730] truncate">
                    {selectedFile.name}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedFile(null)}
                  className="text-[#8c8d97] hover:text-[#d9756c] p-1 cursor-pointer"
                >
                  <X size={15} />
                </button>
              </div>
            ) : (
              <label className="border-2 border-dashed border-[#e3e3e8] hover:border-[#7285d5] rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer bg-[#fafafa] transition-colors w-full">
                <UploadCloud size={24} className="text-[#8c8d97] mb-1.5" />
                <span className="text-xs text-[#242730] font-medium">
                  Pilih berkas PDF CV atau seret ke sini
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
            )}
          </div>
        ) : (
          <textarea
            rows={4}
            placeholder="Tempel teks ringkasan CV atau keahlian teknis Anda di sini..."
            value={cvText}
            onChange={(e) => setCvText(e.target.value)}
            className="w-full text-xs p-3.5 rounded-xl bg-[#fafafa] border border-[#e3e3e8] focus:bg-white focus:border-[#7285d5] outline-none font-mono resize-y"
          />
        )}

        <div className="space-y-1.5 w-full pt-1">
          <label className="block text-xs font-medium text-[#555660]">
            Pesan / Catatan Tambahan untuk Tim
          </label>
          <textarea
            rows={2}
            placeholder="cth. Ekspektasi ketersediaan bergabung, tautan portfolio live, dll."
            value={additionalNote}
            onChange={(e) => setAdditionalNote(e.target.value)}
            className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#fafafa] border border-[#e3e3e8] focus:bg-white focus:border-[#7285d5] focus:ring-2 focus:ring-[#7285d5]/15 outline-none transition-all"
          />
        </div>
      </div>
    </>
  );
};
