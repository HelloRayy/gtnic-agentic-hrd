import Lozenge from '@atlaskit/lozenge';
import Badge from '@atlaskit/badge';

export function AuditHeader() {
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
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Lozenge appearance="success">GTNIC 2026</Lozenge>
          <Lozenge appearance="new">Gemini 3.8 Flash</Lozenge>
          <Badge max={99}>{94}</Badge>
        </div>
      </div>
    </header>
  );
}
