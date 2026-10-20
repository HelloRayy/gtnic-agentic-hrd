import Spinner from '@atlaskit/spinner';
import SectionMessage from '@atlaskit/section-message';

interface AuditProgressProps {
  isLoading: boolean;
  error: string | null;
}

export function AuditProgress({ isLoading, error }: AuditProgressProps) {
  if (error) {
    return (
      <div style={{ marginBottom: 24 }}>
        <SectionMessage title="Audit Execution Notice" appearance="error">
          <p>{error}</p>
        </SectionMessage>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div style={{ marginBottom: 24 }}>
        <SectionMessage title="Autonomous Agent Executing Multi-Step Pipeline" appearance="information">
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 8 }}>
            <Spinner size="medium" />
            <p style={{ margin: 0, fontSize: 13, color: '#42526E' }}>
              Phase 1: Ingesting CV &rarr; Phase 2: Triaging GitHub Repos &rarr; Phase 3: Auditing Tree & Manifests &rarr; Phase 4: Gemini 3.8 Flash Synthesis
            </p>
          </div>
        </SectionMessage>
      </div>
    );
  }

  return null;
}
