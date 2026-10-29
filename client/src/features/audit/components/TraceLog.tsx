import { useEffect, useRef } from 'react';
import Badge from '@atlaskit/badge';
import type { TraceEvent } from '@/types/audit.js';

interface TraceLogProps {
  events: TraceEvent[];
}

export function TraceLog({ events }: TraceLogProps) {
  const logContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [events]);

  if (events.length === 0) {
    return null;
  }

  return (
    <div
      style={{
        marginTop: 16,
        border: '1px solid #DFE1E6',
        borderRadius: 4,
        background: '#091E42',
        color: '#F4F5F7',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        fontSize: 12,
        padding: '12px 16px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #253858',
          paddingBottom: 8,
          marginBottom: 8,
        }}
      >
        <span style={{ fontWeight: 600, color: '#B3D4FF', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Agent Execution & Reasoning Trace
        </span>
        <Badge appearance="primary">{events.length}</Badge>
      </div>

      <div
        ref={logContainerRef}
        style={{
          maxHeight: 200,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
        }}
      >
        {events.map((ev, idx) => {
          const time = new Date(ev.timestamp).toLocaleTimeString();
          const phaseColor =
            ev.phase === 'PLAN'
              ? '#FFAB00'
              : ev.phase === 'TOOL_CALL'
              ? '#4C9AFF'
              : ev.phase === 'OBSERVATION'
              ? '#57D9A3'
              : '#FF5630';

          return (
            <div key={idx} style={{ lineHeight: '18px', display: 'flex', gap: 8 }}>
              <span style={{ color: '#7A869A', flexShrink: 0 }}>[{time}]</span>
              <span style={{ color: phaseColor, fontWeight: 600, flexShrink: 0 }}>
                [{ev.phase}]
              </span>
              <span style={{ color: '#EAE6FF', flexShrink: 0 }}>
                {ev.step}:
              </span>
              <span style={{ color: '#FAFBFC', wordBreak: 'break-word' }}>
                {ev.detail}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
