import { useState } from 'react';
import Tabs, { Tab, TabList, TabPanel } from '@atlaskit/tabs';
import Lozenge from '@atlaskit/lozenge';
import SectionMessage from '@atlaskit/section-message';
import Badge from '@atlaskit/badge';
import Button from '@atlaskit/button/standard-button';
import { ExternalLink, GitBranch, Mail, Copy, Check, FileText } from 'lucide-react';
import type { TechnicalDossier, EvidenceItem } from '../../../types/audit.js';
import { InterviewActionCard } from './InterviewActionCard.js';
import { InvestigationCard } from './InvestigationCard.js';
import { CodeInspectorTab } from './CodeInspectorTab.js';

interface DossierTabsProps {
  dossier: TechnicalDossier;
}

function renderStatusLozenge(status: EvidenceItem['status']) {
  switch (status) {
    case 'VERIFIED':
      return <Lozenge appearance="success">TERVERIFIKASI</Lozenge>;
    case 'PARTIAL':
      return <Lozenge appearance="inprogress">SEBAGIAN</Lozenge>;
    case 'NO_PUBLIC_EVIDENCE':
    default:
      return <Lozenge appearance="removed">TIDAK ADA BUKTI PUBLIK</Lozenge>;
  }
}

export function DossierTabs({ dossier }: DossierTabsProps) {
  const [copied, setCopied] = useState(false);
  const [showCvSummary, setShowCvSummary] = useState(false);

  const githubUsername = dossier.candidate.githubUsername || (
    dossier.candidate.githubUrl ? dossier.candidate.githubUrl.split('/').pop() : ''
  );
  const githubProfileUrl = dossier.candidate.githubUrl || (
    githubUsername ? `https://github.com/${githubUsername}` : null
  );

  const handleCopySummary = () => {
    const verifiedCount = dossier.evidenceMatrix.filter((e) => e.status === 'VERIFIED').length;
    const text = [
      `[TalentTrace AI] Hasil Audit Teknis: ${dossier.candidate.name}`,
      `Posisi: ${dossier.jobTitle}`,
      `Status Bukti: ${verifiedCount}/${dossier.evidenceMatrix.length} Klaim Terverifikasi`,
      `GitHub: ${githubProfileUrl || 'Tidak disertakan'}`,
      '',
      'Ringkasan Penilaian Eksekutif:',
      dossier.overallAssessment,
    ].join('\n');

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ background: '#FFFFFF', border: '1px solid #DFE1E6', borderRadius: 8, padding: 20 }}>
      {/* Header Profil & Quick Actions HRD */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: '#172B4D', margin: '0 0 4px 0' }}>
              Dossier Teknis Eksekutif: {dossier.candidate.name}
            </h2>
            <p style={{ margin: 0, fontSize: 13, color: '#5E6C84' }}>
              Target: {dossier.jobTitle} | Waktu Eksekusi: {(dossier.executionTimeMs / 1000).toFixed(1)}s
            </p>
          </div>

          {/* Tombol Interaktif untuk HRD */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {githubProfileUrl && (
              <a
                href={githubProfileUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'none' }}
              >
                <Button iconBefore={<GitBranch size={14} />} appearance="default">
                  Profil GitHub <ExternalLink size={12} style={{ marginLeft: 4 }} />
                </Button>
              </a>
            )}

            {dossier.candidate.email && (
              <a href={`mailto:${dossier.candidate.email}`} style={{ textDecoration: 'none' }}>
                <Button iconBefore={<Mail size={14} />} appearance="default">
                  Email Kandidat
                </Button>
              </a>
            )}

            <Button
              iconBefore={copied ? <Check size={14} color="#00875A" /> : <Copy size={14} />}
              onClick={handleCopySummary}
              appearance="default"
            >
              {copied ? 'Tersalin ke Clipboard!' : 'Salin Ringkasan'}
            </Button>

            {dossier.candidate.summary && (
              <Button
                iconBefore={<FileText size={14} />}
                onClick={() => setShowCvSummary(!showCvSummary)}
                appearance="subtle"
              >
                {showCvSummary ? 'Tutup CV' : 'Lihat Teks CV'}
              </Button>
            )}
          </div>
        </div>

        {/* Daftar Repositori yang Diaudit (Bisa Diklik Langsung oleh HRD) */}
        <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#42526E' }}>Repositori Diaudit:</span>
          {dossier.auditedRepos.length > 0 ? (
            dossier.auditedRepos.map((repo) => (
              <a
                key={repo}
                href={githubUsername ? `https://github.com/${githubUsername}/${repo}` : `https://github.com/search?q=${repo}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: 12,
                  color: '#0052CC',
                  background: '#EBECF0',
                  padding: '3px 8px',
                  borderRadius: 4,
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                {repo} <ExternalLink size={10} />
              </a>
            ))
          ) : (
            <span style={{ fontSize: 12, color: '#8993A4' }}>Tidak ada repositori publik terdeteksi</span>
          )}
        </div>

        {/* Tampilan Teks CV Jika Dibuka */}
        {showCvSummary && dossier.candidate.summary && (
          <div style={{ marginTop: 12, padding: 12, background: '#F4F5F7', borderRadius: 6, border: '1px solid #DFE1E6' }}>
            <strong style={{ fontSize: 12, color: '#172B4D', display: 'block', marginBottom: 4 }}>
              Cuplikan Teks CV / Resume Kandidat:
            </strong>
            <p style={{ margin: 0, fontSize: 12, color: '#42526E', whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
              {dossier.candidate.summary}
            </p>
          </div>
        )}
      </div>

      {/* Ringkasan Penilaian Eksekutif (Full Bahasa Indonesia) */}
      <div style={{ marginBottom: 20 }}>
        <SectionMessage title="Ringkasan Penilaian Arsitektur & Portofolio (Executive Summary)" appearance="information">
          <p style={{ margin: 0, lineHeight: 1.6, whiteSpace: 'pre-line' }}>{dossier.overallAssessment}</p>
        </SectionMessage>
      </div>

      <InterviewActionCard dossier={dossier} />

      {/* Tab Konten Interaktif */}
      <Tabs id="dossier-tabs">
        <TabList>
          <Tab>Matriks Bukti ({dossier.evidenceMatrix.length})</Tab>
          <Tab>Inspeksi Kode Web IDE ({dossier.auditedRepos.length})</Tab>
          <Tab>Radar Investigasi & Sinyal ({dossier.interviewKit.length})</Tab>
          <Tab>Poin Klarifikasi ({dossier.clarificationPrompts.length})</Tab>
          <Tab>Jejak Penalaran CoT ({dossier.traceEvents?.length || 0})</Tab>
        </TabList>

        {/* Tab 1: Matriks Bukti */}
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
                        href={githubUsername ? `https://github.com/${githubUsername}/${item.repoAnchor}` : `https://github.com/search?q=${item.repoAnchor}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#0052CC', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}
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
        </TabPanel>
        {/* Tab 2: Inspeksi Kode Web IDE */}
        <TabPanel>
          <CodeInspectorTab
            auditedRepos={dossier.auditedRepos}
            githubUsername={githubUsername}
            evidenceMatrix={dossier.evidenceMatrix}
            interviewKit={dossier.interviewKit}
          />
        </TabPanel>


        {/* Tab 2: Radar Investigasi & Sinyal Interview */}
        <TabPanel>
          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {dossier.interviewKit.map((q, idx) => (
              <InvestigationCard key={idx} item={q} index={idx} githubUsername={githubUsername} />
            ))}
          </div>
        </TabPanel>

        {/* Tab 3: Poin Klarifikasi */}
        <TabPanel>
          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {dossier.clarificationPrompts.length === 0 ? (
              <p style={{ fontSize: 13, color: '#6B778C' }}>Tidak ada ambiguitas yang memerlukan klarifikasi.</p>
            ) : (
              dossier.clarificationPrompts.map((prompt, idx) => (
                <SectionMessage key={idx} appearance="warning" title={`Poin Klarifikasi #${idx + 1}`}>
                  <p>{prompt}</p>
                </SectionMessage>
              ))
            )}
          </div>
        </TabPanel>

        {/* Tab 4: Jejak Penalaran CoT */}
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
