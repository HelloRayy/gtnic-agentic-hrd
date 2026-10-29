import Badge from '@atlaskit/badge';
import type { TraceEvent } from '@/types/audit.js';

interface TraceEventsTabProps {
  traceEvents?: TraceEvent[];
}

export function TraceEventsTab({ traceEvents }: TraceEventsTabProps) {
  if (!traceEvents || traceEvents.length === 0) {
    return (
      <div style={{ marginTop: 16 }}>
        <p style={{ fontSize: 13, color: '#6B778C' }}>Tidak ada log jejak penalaran tersimpan.</p>
      </div>
    );
  }

  return (
    <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {traceEvents.map((ev, idx) => (
        <div
          key={idx}
          style={{
            padding: '8px 12px',
            borderLeft: '3px solid #0052CC',
            background: '#F4F5F7',
            fontSize: 12,
          }}
        >
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 2 }}>
            <Badge>{ev.phase}</Badge>
            <strong style={{ color: '#172B4D' }}>{ev.step}</strong>
            <span style={{ color: '#8993A4', fontSize: 10 }}>
              {new Date(ev.timestamp).toLocaleTimeString()}
            </span>
          </div>
          <div style={{ color: '#42526E' }}>{ev.detail}</div>
        </div>
      ))}
    </div>
  );
}
