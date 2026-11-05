import React from 'react';
import { Check, ChevronRight, FileCode, Video, Award } from 'lucide-react';

export type PipelineStage = 'screening' | 'interview' | 'accepted';

interface RecruitmentPipelineStepperProps {
  currentStage: PipelineStage;
  onSelectStage?: (stage: PipelineStage) => void;
}

export const RecruitmentPipelineStepper: React.FC<RecruitmentPipelineStepperProps> = ({
  currentStage,
  onSelectStage,
}) => {
  const steps: Array<{
    id: PipelineStage;
    label: string;
    sublabel: string;
    icon: React.ReactNode;
  }> = [
    {
      id: 'screening',
      label: '1. Screening Kode',
      sublabel: 'Forensik GitHub & CV',
      icon: <FileCode size={13} />,
    },
    {
      id: 'interview',
      label: '2. Wawancara Teknis',
      sublabel: 'Google Meet & Live Radar',
      icon: <Video size={13} />,
    },
    {
      id: 'accepted',
      label: '3. Keputusan Akhir',
      sublabel: 'Offering & Laporan CTO',
      icon: <Award size={13} />,
    },
  ];

  const stageOrder: Record<PipelineStage, number> = {
    screening: 1,
    interview: 2,
    accepted: 3,
  };

  const currentOrder = stageOrder[currentStage] || 1;

  return (
    <div className="px-5 py-2.5 bg-white border-b border-[#e9e8e6] flex items-center justify-between font-sans select-none shrink-0 shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {steps.map((step, idx) => {
          const stepOrder = stageOrder[step.id];
          const isActive = step.id === currentStage;
          const isCompleted = stepOrder < currentOrder;

          return (
            <React.Fragment key={step.id}>
              {idx > 0 && (
                <ChevronRight size={13} className="text-[#c8c6be] shrink-0 mx-0.5" />
              )}
              <button
                type="button"
                onClick={() => onSelectStage?.(step.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#7285d5]/10 text-[#384c98] font-bold border border-[#7285d5]/30'
                    : isCompleted
                    ? 'bg-[#edf3ec] text-[#2b5934] font-medium hover:bg-[#e2ede0]'
                    : 'text-[#787b89] hover:text-[#333641] hover:bg-[#f6f5f0]'
                }`}
                title={`Pindah ke ${step.label}`}
              >
                <span
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] shrink-0 ${
                    isCompleted
                      ? 'bg-[#8cac91] text-white'
                      : isActive
                      ? 'bg-[#7285d5] text-white'
                      : 'bg-[#eeece6] text-[#737582]'
                  }`}
                >
                  {isCompleted ? <Check size={10} strokeWidth={3} /> : stepOrder}
                </span>

                <div className="text-left leading-tight">
                  <div className="truncate font-semibold">{step.label}</div>
                </div>
              </button>
            </React.Fragment>
          );
        })}
      </div>

      <div className="hidden md:flex items-center gap-2 text-[11px] text-[#8c8d97]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#8cac91]" />
        <span>Alur Perekrutan Aktif</span>
      </div>
    </div>
  );
};
