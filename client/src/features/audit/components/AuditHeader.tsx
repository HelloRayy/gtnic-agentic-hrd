import Lozenge from '@atlaskit/lozenge';
import Button from '@atlaskit/button/standard-button';
import type { GoogleAuthStatus } from '@/types/audit.js';

interface AuditHeaderProps {
  onOpenIntegrations: () => void;
  googleStatus?: GoogleAuthStatus | null;
}

export function AuditHeader({ onOpenIntegrations, googleStatus }: AuditHeaderProps) {
  return (
    <header style={{ marginBottom: 24, borderBottom: '1px solid #EBECF0', paddingBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 600, color: '#172B4D', margin: 0 }}>
            TalentTrace AI
          </h1>
          <p style={{ margin: '4px 0 0 0', fontSize: 14, color: '#6B778C' }}>
            Autonomous Technical Screener & Portfolio Auditor for Enterprise Teams
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <Button appearance="subtle" onClick={onOpenIntegrations}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
              <span>HRD Connectors</span>
              {googleStatus?.isAuthenticated ? (
                <Lozenge appearance="success">Connected</Lozenge>
              ) : (
                <Lozenge appearance="default">OAuth</Lozenge>
              )}
            </span>
          </Button>
          <Lozenge appearance="new">Gemini 3.8 Flash</Lozenge>
        </div>
      </div>
    </header>
  );
}
