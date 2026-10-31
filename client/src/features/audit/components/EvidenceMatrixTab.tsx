import Lozenge from '@atlaskit/lozenge';
import { ExternalLink } from 'lucide-react';
import type { EvidenceItem } from '@/types/audit.js';

interface EvidenceMatrixTabProps {
  evidenceMatrix: EvidenceItem[];
  githubUsername?: string | null;
}

function renderStatusLozenge(status: EvidenceItem['status']) {
  switch (status) {
    case 'VERIFIED':
      return <Lozenge appearance="success">TERVERIFIKASI</Lozenge>;
    case 'TRANSFERABLE':
      return <Lozenge appearance="moved">SKILL SERUMPUN (BISA ADAPTASI)</Lozenge>;
    case 'PARTIAL':
      return <Lozenge appearance="inprogress">SEBAGIAN</Lozenge>;
    case 'NO_PUBLIC_EVIDENCE':
    default:
      return <Lozenge appearance="removed">TIDAK ADA BUKTI PUBLIK</Lozenge>;
  }
}

export function EvidenceMatrixTab({ evidenceMatrix, githubUsername }: EvidenceMatrixTabProps) {
  return (
    <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
      {evidenceMatrix.map((item, idx) => (
        <div
          key={idx}
          style={{
            border: '1px solid #EBECF0',
            borderRadius: 6,
            padding: 12,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: 16,
          }}
        >
          <div>
            <div style={{ fontWeight: 600, fontSize: 14, color: '#172B4D', marginBottom: 4 }}>
              {item.claim}
            </div>
            <div style={{ fontSize: 13, color: '#42526E' }}>{item.evidenceSummary}</div>
            {item.repoAnchor && (
              <div style={{ fontSize: 11, marginTop: 6 }}>
                <a
                  href={
                    githubUsername
                      ? `https://github.com/${githubUsername}/${item.repoAnchor}`
                      : `https://github.com/search?q=${item.repoAnchor}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: '#0052CC',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  Jangkar Kode: {item.repoAnchor} <ExternalLink size={10} />
                </a>
              </div>
            )}
          </div>
          <div style={{ flexShrink: 0 }}>{renderStatusLozenge(item.status)}</div>
        </div>
      ))}
    </div>
  );
}
