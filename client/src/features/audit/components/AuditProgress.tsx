import SectionMessage from '@atlaskit/section-message';
import Badge from '@atlaskit/badge';
import { AuditStepTracker } from './AuditStepTracker.js';
import { TraceLog } from './TraceLog.js';
import type { TraceEvent } from '@/types/audit.js';

interface AuditProgressProps {
  isLoading: boolean;
  error: string | null;
  events: TraceEvent[];
  elapsedSeconds: number;
}

export function AuditProgress({ isLoading, error, events, elapsedSeconds }: AuditProgressProps) {
  if (error) {
    return (
      <div style={{ marginBottom: 24 }}>
        <SectionMessage title="Audit Execution Notice" appearance="error">
          <p>{error}</p>
        </SectionMessage>
      </div>
    );
  }

  if (!isLoading && events.length === 0) {
    return null;
  }

  return (
    <div style={{ marginBottom: 24 }}>
      <SectionMessage
        title={isLoading ? 'Autonomous Agent Pipeline in Execution' : 'Autonomous Agent Pipeline Completed'}
        appearance={isLoading ? 'information' : 'success'}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
          <p style={{ margin: 0, fontSize: 13, color: '#42526E' }}>
            {isLoading
              ? 'Multi-stage autonomous verification running with real-time reasoning feedback.'
              : 'Autonomous pipeline finished all inspection stages and verified grounding.'}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 12, color: '#6B778C', fontWeight: 500 }}>Time Elapsed:</span>
            <Badge appearance="added">{elapsedSeconds.toFixed(1)}s</Badge>
          </div>
        </div>

        <AuditStepTracker events={events} isCompleted={!isLoading && events.length > 0} />
        <TraceLog events={events} />
      </SectionMessage>
    </div>
  );
}
