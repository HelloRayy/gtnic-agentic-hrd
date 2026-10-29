import Button from '@atlaskit/button/standard-button';
import Lozenge from '@atlaskit/lozenge';
import { ExternalLink, Globe } from 'lucide-react';

interface LiveDemoCardProps {
  liveDemos?: { repoName: string; url: string }[];
}

export function LiveDemoCard({ liveDemos }: LiveDemoCardProps) {
  if (!liveDemos || liveDemos.length === 0) {
    return null;
  }

  return (
    <div
      style={{
        border: '1px solid #B3D4FF',
        borderRadius: 8,
        padding: 16,
        marginBottom: 20,
        backgroundColor: '#DEEBFF',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 6,
              backgroundColor: '#0052CC',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
            }}
          >
            <Globe size={20} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontWeight: 600, fontSize: 14, color: '#0747A6' }}>
                Live Deployment & Demo Website Terdeteksi
              </span>
              <Lozenge appearance="success">ACTIVE PRODUCTION</Lozenge>
            </div>
            <p style={{ margin: '2px 0 0 0', fontSize: 12, color: '#172B4D' }}>
              Kandidat melampirkan website produksi yang berjalan langsung dari repositori kodenya.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {liveDemos.map((demo, idx) => (
            <a
              key={idx}
              href={demo.url.startsWith('http') ? demo.url : `https://${demo.url}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'none' }}
            >
              <Button appearance="primary" iconBefore={<ExternalLink size={14} />}>
                Buka Live Demo: {demo.repoName}
              </Button>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
