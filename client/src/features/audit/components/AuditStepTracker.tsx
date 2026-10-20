import Lozenge from '@atlaskit/lozenge';
import Spinner from '@atlaskit/spinner';
import type { TraceEvent } from '../../../types/audit.js';

interface StepInfo {
  id: string;
  title: string;
  description: string;
}

const STEPS: StepInfo[] = [
  {
    id: 'ingestion',
    title: 'Candidate Ingestion & Profile Extraction',
    description: 'Parsing PDF resume, extracting skill claims, and resolving GitHub profiles.',
  },
  {
    id: 'triage',
    title: 'Public Repository Triage',
    description: 'Filtering forks, identifying original source repositories, and ranking by relevance.',
  },
  {
    id: 'deep_audit',
    title: 'Codebase, Manifest & Authorship Audit',
    description: 'Scanning subfolder manifests, test suites, CI/CD configs, and git authorship integrity.',
  },
  {
    id: 'synthesis',
    title: 'Autonomous Synthesis (Gemini 3.8 Flash)',
    description: 'Evaluating claims against audited code anchors and formulating structured interview kits.',
  },
  {
    id: 'gate',
    title: 'Grounding Verification & Clarification Gate',
    description: 'Cross-verifying evidence anchors, enforcing zero-hallucination, and surfacing ambiguities.',
  },
];

interface AuditStepTrackerProps {
  events: TraceEvent[];
  isCompleted?: boolean;
}

export function AuditStepTracker({ events, isCompleted = false }: AuditStepTrackerProps) {
  const hasStep = (name: string) => events.some((e) => e.step.includes(name));

  const getStepStatus = (index: number): 'COMPLETED' | 'IN_PROGRESS' | 'PENDING' => {
    if (isCompleted) return 'COMPLETED';

    switch (index) {
      case 0: // Ingestion
        if (hasStep('INGESTION_COMPLETED') || hasStep('GITHUB_TRIAGE') || hasStep('SYNTHESIS')) {
          return 'COMPLETED';
        }
        return hasStep('INGESTION') ? 'IN_PROGRESS' : 'PENDING';

      case 1: // Triage
        if (hasStep('GITHUB_AUDIT') || hasStep('FALLBACK_MODE') || hasStep('SYNTHESIS')) {
          return 'COMPLETED';
        }
        return hasStep('GITHUB_TRIAGE') ? 'IN_PROGRESS' : 'PENDING';

      case 2: // Deep Audit
        if (hasStep('SYNTHESIS') || hasStep('SELF_CORRECTION')) {
          return 'COMPLETED';
        }
        return hasStep('GITHUB_AUDIT') ? 'IN_PROGRESS' : 'PENDING';

      case 3: // Synthesis
        if (hasStep('SYNTHESIS_SUCCESS') || hasStep('SYNTHESIS_FALLBACK') || hasStep('SELF_CORRECTION')) {
          return 'COMPLETED';
        }
        return hasStep('SYNTHESIS') ? 'IN_PROGRESS' : 'PENDING';

      case 4: // Grounding Gate
        if (hasStep('SELF_CORRECTION_COMPLETED')) {
          return 'COMPLETED';
        }
        return hasStep('SELF_CORRECTION') ? 'IN_PROGRESS' : 'PENDING';

      default:
        return 'PENDING';
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        marginTop: 12,
        padding: '12px 16px',
        background: '#FAFBFC',
        border: '1px solid #EBECF0',
        borderRadius: 4,
      }}
    >
      {STEPS.map((step, idx) => {
        const status = getStepStatus(idx);
        return (
          <div
            key={step.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '6px 0',
              borderBottom: idx < STEPS.length - 1 ? '1px solid #F4F5F7' : 'none',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {status === 'IN_PROGRESS' ? (
                <Spinner size="small" />
              ) : (
                <div
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    background: status === 'COMPLETED' ? '#36B37E' : '#DFE1E6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 10,
                    fontWeight: 700,
                    color: status === 'COMPLETED' ? '#FFFFFF' : '#6B778C',
                  }}
                >
                  {status === 'COMPLETED' ? '✓' : idx + 1}
                </div>
              )}
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#091E42' }}>
                  {step.title}
                </div>
                <div style={{ fontSize: 11, color: '#6B778C' }}>
                  {step.description}
                </div>
              </div>
            </div>

            <div>
              {status === 'COMPLETED' && <Lozenge appearance="success">COMPLETED</Lozenge>}
              {status === 'IN_PROGRESS' && <Lozenge appearance="inprogress">IN PROGRESS</Lozenge>}
              {status === 'PENDING' && <Lozenge appearance="default">PENDING</Lozenge>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
