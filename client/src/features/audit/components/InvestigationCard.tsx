import { useState } from 'react';
import Button from '@atlaskit/button/standard-button';
import { ExternalLink, Copy, Check, ShieldAlert, CheckCircle2, HelpCircle } from 'lucide-react';
import type { InterviewQuestion } from '../../../types/audit.js';

interface InvestigationCardProps {
  item: InterviewQuestion;
  index: number;
  githubUsername?: string;
}

export function InvestigationCard({ item, index, githubUsername }: InvestigationCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyProbe = () => {
    const text = [
      `[Investigasi Teknis #${index + 1}] ${item.topic}`,
      item.investigationTarget ? `Fokus Uji: ${item.investigationTarget}` : '',
      `Temuan Kode: ${item.context}`,
      `Panduan Obrolan: ${item.question}`,
      item.greenFlags?.length ? `Sinyal Kompeten (Green Flags):\n- ${item.greenFlags.join('\n- ')}` : '',
      item.redFlags?.length ? `Indikasi Bualan (Red Flags):\n- ${item.redFlags.join('\n- ')}` : '',
    ]
      .filter(Boolean)
      .join('\n\n');

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{
        border: '1px solid #DFE1E6',
        borderRadius: 8,
        padding: 16,
        background: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      {/* Header Kartu */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: '#0052CC',
                background: '#DEEBFF',
                padding: '2px 8px',
                borderRadius: 4,
              }}
            >
              Fokus #{index + 1}
            </span>
            <span style={{ fontWeight: 600, color: '#172B4D', fontSize: 14 }}>{item.topic}</span>
          </div>
          {item.investigationTarget && (
            <p style={{ margin: 0, fontSize: 12, color: '#42526E', fontStyle: 'italic' }}>
              Target Verifikasi: {item.investigationTarget}
            </p>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {item.codeAnchor && (
            <a
              href={githubUsername ? `https://github.com/${githubUsername}/${item.codeAnchor}` : `https://github.com/search?q=${item.codeAnchor}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: 11,
                color: '#0052CC',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                background: '#FAFBFC',
                border: '1px solid #EBECF0',
                padding: '2px 8px',
                borderRadius: 4,
              }}
            >
              Repo: {item.codeAnchor} <ExternalLink size={10} />
            </a>
          )}
          <Button
            appearance="subtle"
            onClick={handleCopyProbe}
            iconBefore={copied ? <Check size={12} color="#00875A" /> : <Copy size={12} />}
          >
            {copied ? 'Tersalin' : 'Salin Poin'}
          </Button>
        </div>
      </div>

      {/* Temuan Forensik Kode */}
      <div style={{ background: '#F4F5F7', borderRadius: 6, padding: '10px 12px', borderLeft: '3px solid #6554C0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
          <HelpCircle size={13} color="#6554C0" />
          <strong style={{ fontSize: 12, color: '#172B4D' }}>Fakta & Celah pada Repositori:</strong>
        </div>
        <p style={{ margin: 0, fontSize: 12, color: '#42526E', lineHeight: 1.5 }}>{item.context}</p>
      </div>

      {/* Panduan Alur Diskusi Terbuka */}
      <div>
        <strong style={{ fontSize: 12, color: '#172B4D', display: 'block', marginBottom: 4 }}>
          Rekomendasi Alur Obrolan Eksploratif:
        </strong>
        <p style={{ margin: 0, fontSize: 13, color: '#172B4D', lineHeight: 1.5, background: '#FAFBFC', padding: '10px 12px', borderRadius: 6, border: '1px solid #EBECF0' }}>
          "{item.question}"
        </p>
      </div>

      {/* Detektor Sinyal (Green Flags vs Red Flags) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 4 }}>
        {/* Box Green Flags */}
        <div style={{ background: '#E3FCEF', border: '1px solid #ABF5D1', borderRadius: 6, padding: '10px 12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            <CheckCircle2 size={14} color="#00875A" />
            <strong style={{ fontSize: 12, color: '#006644' }}>Tanda Kompeten (Green Flags):</strong>
          </div>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12, color: '#006644', lineHeight: 1.4 }}>
            {item.greenFlags && item.greenFlags.length > 0 ? (
              item.greenFlags.map((flag, idx) => <li key={idx}>{flag}</li>)
            ) : (
              <li>{item.expectedInsight || 'Mampu memaparkan arsitektur produksi dengan lancar.'}</li>
            )}
          </ul>
        </div>

        {/* Box Red Flags */}
        <div style={{ background: '#FFEBE6', border: '1px solid #FFBDAD', borderRadius: 6, padding: '10px 12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            <ShieldAlert size={14} color="#DE350B" />
            <strong style={{ fontSize: 12, color: '#BF2600' }}>Indikasi Bualan (Red Flags):</strong>
          </div>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12, color: '#BF2600', lineHeight: 1.4 }}>
            {item.redFlags && item.redFlags.length > 0 ? (
              item.redFlags.map((flag, idx) => <li key={idx}>{flag}</li>)
            ) : (
              <li>Hanya mengulang teori tanpa contoh implementasi produksi nyata.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
