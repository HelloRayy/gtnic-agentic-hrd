import { useState } from 'react';
import Tabs, { Tab, TabList, TabPanel } from '@atlaskit/tabs';
import SectionMessage from '@atlaskit/section-message';
import Button from '@atlaskit/button/standard-button';
import { ExternalLink, GitBranch, Mail, Copy, Check, FileText } from 'lucide-react';
import type { TechnicalDossier } from '@/types/audit.js';
import { LiveDemoCard } from './LiveDemoCard.js';
import { InterviewActionCard } from './InterviewActionCard.js';
import { CodeInspectorTab } from './CodeInspectorTab.js';
import { EvidenceMatrixTab } from './EvidenceMatrixTab.js';
import { InvestigationRadarTab } from './InvestigationRadarTab.js';
import { ClarificationPromptsTab } from './ClarificationPromptsTab.js';
import { TraceEventsTab } from './TraceEventsTab.js';
import { DeliberationChatTab } from './DeliberationChatTab.js';
interface DossierTabsProps {
  dossier: TechnicalDossier;
}

export function DossierTabs({ dossier }: DossierTabsProps) {
  const [copied, setCopied] = useState(false);
  const [showCvSummary, setShowCvSummary] = useState(false);

  const githubUsername =
    dossier.candidate.githubUsername ||
    (dossier.candidate.githubUrl ? dossier.candidate.githubUrl.split('/').pop() : '');
  const githubProfileUrl =
    dossier.candidate.githubUrl || (githubUsername ? `https://github.com/${githubUsername}` : null);

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

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {githubProfileUrl && (
              <a href={githubProfileUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
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

        {/* Daftar Repositori yang Diaudit */}
        <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#42526E' }}>Repositori Diaudit:</span>
          {dossier.auditedRepos.length > 0 ? (
            dossier.auditedRepos.map((repo) => (
              <a
                key={repo}
                href={
                  githubUsername
                    ? `https://github.com/${githubUsername}/${repo}`
                    : `https://github.com/search?q=${repo}`
                }
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

      {/* Ringkasan Penilaian Eksekutif */}
      <div style={{ marginBottom: 20 }}>
        <SectionMessage title="Ringkasan Penilaian Arsitektur & Portofolio (Executive Summary)" appearance="information">
          <p style={{ margin: 0, lineHeight: 1.6, whiteSpace: 'pre-line' }}>{dossier.overallAssessment}</p>
        </SectionMessage>
      </div>
      <LiveDemoCard liveDemos={dossier.liveDemos} />
      <InterviewActionCard dossier={dossier} />

      {/* Tab Konten Interaktif */}
      <Tabs id="dossier-tabs">
        <TabList>
          <Tab>Deliberasi AI (Tanya Co-Pilot)</Tab>
          <Tab>Matriks Bukti ({dossier.evidenceMatrix.length})</Tab>
          <Tab>Kode Sumber (Khusus Tech Lead) ({dossier.auditedRepos.length})</Tab>
          <Tab>Radar Investigasi & Sinyal ({dossier.interviewKit.length})</Tab>
          <Tab>Poin Klarifikasi ({dossier.clarificationPrompts.length})</Tab>
          <Tab>Jejak Penalaran CoT ({dossier.traceEvents?.length || 0})</Tab>
        </TabList>

        <TabPanel>
          <DeliberationChatTab dossier={dossier} />
        </TabPanel>

        <TabPanel>
          <EvidenceMatrixTab
            evidenceMatrix={dossier.evidenceMatrix}
            githubUsername={githubUsername}
          />
        </TabPanel>

        <TabPanel>
          <CodeInspectorTab
            auditedRepos={dossier.auditedRepos}
            githubUsername={githubUsername}
            evidenceMatrix={dossier.evidenceMatrix}
            interviewKit={dossier.interviewKit}
          />
        </TabPanel>

        <TabPanel>
          <InvestigationRadarTab
            interviewKit={dossier.interviewKit}
            githubUsername={githubUsername}
          />
        </TabPanel>

        <TabPanel>
          <ClarificationPromptsTab
            clarificationPrompts={dossier.clarificationPrompts}
          />
        </TabPanel>

        <TabPanel>
          <TraceEventsTab
            traceEvents={dossier.traceEvents}
          />
        </TabPanel>
      </Tabs>
    </div>
  );
}
