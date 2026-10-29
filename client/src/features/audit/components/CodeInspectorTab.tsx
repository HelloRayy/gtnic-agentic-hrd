import Button from '@atlaskit/button/standard-button';
import SectionMessage from '@atlaskit/section-message';
import { ExternalLink, Code2, Terminal, CheckCircle2 } from 'lucide-react';
import type { EvidenceItem, InterviewQuestion } from '../../../types/audit.js';

interface CodeInspectorTabProps {
  auditedRepos: string[];
  githubUsername?: string;
  evidenceMatrix: EvidenceItem[];
  interviewKit: InterviewQuestion[];
}

export function CodeInspectorTab({
  auditedRepos,
  githubUsername,
  evidenceMatrix,
  interviewKit,
}: CodeInspectorTabProps) {
  // Collect unique code and file anchors
  const anchors = [
    ...evidenceMatrix
      .filter((e) => e.fileAnchor || e.repoAnchor)
      .map((e) => ({
        repo: e.repoAnchor || auditedRepos[0] || '',
        file: e.fileAnchor || '',
        context: e.claim,
      })),
    ...interviewKit
      .filter((k) => k.codeAnchor)
      .map((k) => ({
        repo: auditedRepos[0] || '',
        file: k.codeAnchor || '',
        context: k.topic,
      })),
  ].filter((a) => a.repo || a.file);

  return (
    <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <SectionMessage
        appearance="information"
        title="Web IDE Forensics: Buka Kode Asli Kandidat dalam 1-Klik"
      >
        <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5 }}>
          Gunakan integrasi <strong>github.dev</strong> (VS Code resmi berbasis peramban) untuk
          mengecek seluruh pohon direktori dan baris kode pelamar tanpa perlu mengunduh atau melakukan{' '}
          <em>git clone</em> ke laptop Anda.
        </p>
      </SectionMessage>

      {/* Daftar Kartu Repositori yang Diaudit */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#172B4D' }}>
          Repositori Terverifikasi yang Siap Diinspeksi ({auditedRepos.length}):
        </span>

        {auditedRepos.length === 0 ? (
          <p style={{ fontSize: 13, color: '#6B778C' }}>Tidak ada repositori publik terdeteksi.</p>
        ) : (
          auditedRepos.map((repo) => {
            const githubDevUrl = githubUsername
              ? `https://github.dev/${githubUsername}/${repo}`
              : `https://github.com/search?q=${repo}`;
            const github1sUrl = githubUsername
              ? `https://github1s.com/${githubUsername}/${repo}`
              : `https://github.com/search?q=${repo}`;
            const githubUrl = githubUsername
              ? `https://github.com/${githubUsername}/${repo}`
              : `https://github.com/search?q=${repo}`;

            return (
              <div
                key={repo}
                style={{
                  border: '1px solid #DFE1E6',
                  borderRadius: 6,
                  padding: 16,
                  background: '#FAFBFC',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 12,
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <Code2 size={16} color="#0052CC" />
                    <span style={{ fontWeight: 700, fontSize: 14, color: '#172B4D' }}>{repo}</span>
                    <span
                      style={{
                        fontSize: 11,
                        background: '#E3FCEF',
                        color: '#006644',
                        padding: '1px 6px',
                        borderRadius: 3,
                        fontWeight: 600,
                      }}
                    >
                      Audit Siap
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: 12, color: '#5E6C84' }}>
                    Pemilik: @{githubUsername || 'kandidat'} | Jalur inspeksi: Web VS Code & AST Tree
                  </p>
                </div>

                {/* Tombol Aksi Inspeksi */}
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <a href={githubDevUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                    <Button appearance="primary" iconBefore={<Terminal size={14} />}>
                      Buka di github.dev (VS Code) <ExternalLink size={12} style={{ marginLeft: 4 }} />
                    </Button>
                  </a>

                  <a href={github1sUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                    <Button appearance="default">
                      Cermin github1s <ExternalLink size={12} style={{ marginLeft: 4 }} />
                    </Button>
                  </a>

                  <a href={githubUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                    <Button appearance="subtle">
                      GitHub Biasa <ExternalLink size={12} style={{ marginLeft: 4 }} />
                    </Button>
                  </a>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* File Jangkar Kode (Code Anchors) */}
      {anchors.length > 0 && (
        <div style={{ marginTop: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#172B4D', display: 'block', marginBottom: 8 }}>
            Berkas Kode Temuan Forensik (Code Anchors):
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {anchors.slice(0, 5).map((a, idx) => {
              const fileDevUrl =
                githubUsername && a.file
                  ? `https://github.dev/${githubUsername}/${a.repo || auditedRepos[0]}/blob/main/${a.file}`
                  : null;

              return (
                <div
                  key={idx}
                  style={{
                    padding: '8px 12px',
                    border: '1px solid #EBECF0',
                    borderRadius: 4,
                    background: '#FFFFFF',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 12,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <CheckCircle2 size={14} color="#00875A" />
                    <div>
                      <span style={{ fontSize: 12, fontWeight: 600, color: '#172B4D', fontFamily: 'monospace' }}>
                        {a.file || a.repo}
                      </span>
                      <span style={{ fontSize: 12, color: '#5E6C84', marginLeft: 8 }}>— {a.context}</span>
                    </div>
                  </div>

                  {fileDevUrl && (
                    <a href={fileDevUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                      <Button appearance="subtle" iconBefore={<ExternalLink size={12} />}>
                        Lihat Berkas
                      </Button>
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
