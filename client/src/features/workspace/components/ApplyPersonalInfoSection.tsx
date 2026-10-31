import React from 'react';
import { Check } from 'lucide-react';
import { RECRUITMENT_PRESETS, type RecruitmentPreset } from '../demoPresets.js';

interface ApplyPersonalInfoSectionProps {
  candidateName: string;
  setCandidateName: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  phoneNumber: string;
  setPhoneNumber: (v: string) => void;
  selectedPresetId: string;
  setSelectedPresetId: (v: string) => void;
  jobs?: RecruitmentPreset[];
}

export const ApplyPersonalInfoSection: React.FC<ApplyPersonalInfoSectionProps> = ({
  candidateName,
  setCandidateName,
  email,
  setEmail,
  phoneNumber,
  setPhoneNumber,
  selectedPresetId,
  setSelectedPresetId,
  jobs,
}) => {
  const activeJobs = jobs && jobs.length > 0 ? jobs : RECRUITMENT_PRESETS;
  return (
    <>
      {/* Section 1: Data Diri Pelamar (Fully Linear) */}
      <div className="bg-white rounded-2xl border border-[#e9e8e6] p-6 shadow-[0_2px_8px_rgba(57,57,74,0.02)] space-y-4">
        <div className="border-b border-[#f0eee9] pb-2">
          <h2 className="text-sm font-semibold text-[#242730]">1. Data Pribadi</h2>
        </div>

        <div className="space-y-1.5 w-full">
          <label className="block text-xs font-medium text-[#555660]">
            Nama Lengkap <span className="text-[#d9756c]">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="cth. Rayhan Pratama"
            value={candidateName}
            onChange={(e) => setCandidateName(e.target.value)}
            className="w-full text-xs px-3.5 py-3 rounded-xl bg-[#fafafa] border border-[#e3e3e8] focus:bg-white focus:border-[#7285d5] focus:ring-2 focus:ring-[#7285d5]/15 outline-none transition-all"
          />
        </div>

        <div className="space-y-1.5 w-full">
          <label className="block text-xs font-medium text-[#555660]">
            Alamat Email <span className="text-[#d9756c]">*</span>
          </label>
          <input
            type="email"
            required
            placeholder="cth. rayhan@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full text-xs px-3.5 py-3 rounded-xl bg-[#fafafa] border border-[#e3e3e8] focus:bg-white focus:border-[#7285d5] focus:ring-2 focus:ring-[#7285d5]/15 outline-none transition-all"
          />
        </div>

        <div className="space-y-1.5 w-full">
          <label className="block text-xs font-medium text-[#555660]">
            Nomor WhatsApp / Telepon
          </label>
          <input
            type="tel"
            placeholder="cth. 081234567890"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full text-xs px-3.5 py-3 rounded-xl bg-[#fafafa] border border-[#e3e3e8] focus:bg-white focus:border-[#7285d5] focus:ring-2 focus:ring-[#7285d5]/15 outline-none transition-all"
          />
        </div>
      </div>

      {/* Section 2: Posisi yang Dilamar */}
      <div className="bg-white rounded-2xl border border-[#e9e8e6] p-6 shadow-[0_2px_8px_rgba(57,57,74,0.02)] space-y-4">
        <div className="border-b border-[#f0eee9] pb-2">
          <h2 className="text-sm font-semibold text-[#242730]">
            2. Posisi yang Dituju <span className="text-[#d9756c]">*</span>
          </h2>
        </div>

        <div className="space-y-2.5 w-full">
          {activeJobs.map((preset: RecruitmentPreset) => {
            const isSelected = selectedPresetId === preset.id;
            return (
              <label
                key={preset.id}
                onClick={() => setSelectedPresetId(preset.id)}
                className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer w-full transition-all ${
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
    </>
  );
};
