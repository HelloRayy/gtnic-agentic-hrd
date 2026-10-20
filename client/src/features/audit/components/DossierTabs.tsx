import Tabs, { Tab, TabList, TabPanel } from '@atlaskit/tabs';
import Lozenge from '@atlaskit/lozenge';
import SectionMessage from '@atlaskit/section-message';
import Badge from '@atlaskit/badge';
import type { TechnicalDossier, EvidenceItem } from '../../../types/audit.js';

interface DossierTabsProps {
  dossier: TechnicalDossier;
}

function renderStatusLozenge(status: EvidenceItem['status']) {
  switch (status) {
    case 'VERIFIED':
      return <Lozenge appearance="success">VERIFIED</Lozenge>;
    case 'PARTIAL':
      return <Lozenge appearance="inprogress">PARTIAL</Lozenge>;
    case 'NO_PUBLIC_EVIDENCE':
    default:
      return <Lozenge appearance="removed">NO PUBLIC EVIDENCE</Lozenge>;
  }
}

export function DossierTabs({ dossier }: DossierTabsProps) {
  return (
    <div style={{ background: '#FFFFFF', border: '1px solid #DFE1E6', borderRadius: 8, padding: 20 }}>
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, color: '#172B4D', margin: '0 0 4px 0' }}>
          Executive Dossier: {dossier.candidate.name}
        </h2>
        <p style={{ margin: 0, fontSize: 13, color: '#5E6C84' }}>
          Target: {dossier.jobTitle} | Execution Time: {(dossier.executionTimeMs / 1000).toFixed(1)}s | Audited Repos: {dossier.auditedRepos.join(', ') || 'None'}
        </p>
      </div>

      <div style={{ marginBottom: 20 }}>
        <SectionMessage title="Overall Architectural Assessment" appearance="information">
          <p>{dossier.overallAssessment}</p>
        </SectionMessage>
      </div>

      <Tabs id="dossier-tabs">
        <TabList>
          <Tab>Evidence Matrix ({dossier.evidenceMatrix.length})</Tab>
          <Tab>Tailored Interview Kit ({dossier.interviewKit.length})</Tab>
          <Tab>Clarification Items ({dossier.clarificationPrompts.length})</Tab>
          <Tab>Traceability CoT ({dossier.traceEvents?.length || 0})</Tab>
        </TabList>

        {/* Tab 1: Evidence Matrix */}
        <TabPanel>
          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {dossier.evidenceMatrix.map((item, idx) => (
              <div
                key={idx}
                style={{
                  border: '1px solid #EBECF0',
                  borderRadius: 6,
                  padding: 12,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: '#172B4D', marginBottom: 4 }}>
                    {item.claim}
                  </div>
                  <div style={{ fontSize: 13, color: '#42526E' }}>{item.evidenceSummary}</div>
                  {item.repoAnchor && (
                    <div style={{ fontSize: 11, color: '#0052CC', marginTop: 4 }}>
                      Anchor: {item.repoAnchor}
                    </div>
                  )}
                </div>
                <div>{renderStatusLozenge(item.status)}</div>
              </div>
            ))}
          </div>
        </TabPanel>

        {/* Tab 2: Interview Kit */}
        <TabPanel>
          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {dossier.interviewKit.map((q, idx) => (
              <div key={idx} style={{ border: '1px solid #EBECF0', borderRadius: 6, padding: 14, background: '#FAFBFC' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontWeight: 600, color: '#0052CC', fontSize: 13 }}>{q.topic}</span>
                  {q.codeAnchor && <span style={{ fontSize: 11, color: '#6B778C' }}>{q.codeAnchor}</span>}
                </div>
                <div style={{ fontWeight: 600, fontSize: 14, color: '#172B4D', marginBottom: 6 }}>
                  {q.question}
                </div>
                <p style={{ margin: '0 0 6px 0', fontSize: 12, color: '#5E6C84' }}>
                  <strong>Context:</strong> {q.context}
                </p>
                <p style={{ margin: 0, fontSize: 12, color: '#006644' }}>
                  <strong>Expected Insight:</strong> {q.expectedInsight}
                </p>
              </div>
            ))}
          </div>
        </TabPanel>

        {/* Tab 3: Clarification Prompts */}
        <TabPanel>
          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {dossier.clarificationPrompts.length === 0 ? (
              <p style={{ fontSize: 13, color: '#6B778C' }}>No ambiguities requiring clarification.</p>
            ) : (
              dossier.clarificationPrompts.map((prompt, idx) => (
                <SectionMessage key={idx} appearance="warning" title={`Item #${idx + 1}`}>
                  <p>{prompt}</p>
                </SectionMessage>
              ))
            )}
          </div>
        </TabPanel>

        {/* Tab 4: Chain of Thought Trace */}
        <TabPanel>
          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {dossier.traceEvents?.map((ev, idx) => (
              <div key={idx} style={{ padding: '8px 12px', borderLeft: '3px solid #0052CC', background: '#F4F5F7', fontSize: 12 }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 2 }}>
                  <Badge>{ev.phase}</Badge>
                  <strong style={{ color: '#172B4D' }}>{ev.step}</strong>
                  <span style={{ color: '#8993A4', fontSize: 10 }}>{new Date(ev.timestamp).toLocaleTimeString()}</span>
                </div>
                <div style={{ color: '#42526E' }}>{ev.detail}</div>
              </div>
            ))}
          </div>
        </TabPanel>
      </Tabs>
    </div>
  );
}
