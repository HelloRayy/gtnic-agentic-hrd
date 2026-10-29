import type { InterviewQuestion } from '@/types/audit.js';
import { InvestigationCard } from './InvestigationCard.js';

interface InvestigationRadarTabProps {
  interviewKit: InterviewQuestion[];
  githubUsername?: string | null;
}

export function InvestigationRadarTab({ interviewKit, githubUsername }: InvestigationRadarTabProps) {
  if (interviewKit.length === 0) {
    return (
      <div style={{ marginTop: 16 }}>
        <p style={{ fontSize: 13, color: '#6B778C' }}>Belum ada data radar investigasi untuk kandidat ini.</p>
      </div>
    );
  }

  return (
    <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
      {interviewKit.map((q, idx) => (
        <InvestigationCard key={idx} item={q} index={idx} githubUsername={githubUsername || undefined} />
      ))}
    </div>
  );
}
