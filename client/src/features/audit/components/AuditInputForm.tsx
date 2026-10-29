import React, { useState } from 'react';
import Button from '@atlaskit/button/standard-button';
import Textfield from '@atlaskit/textfield';
import TextArea from '@atlaskit/textarea';
import Lozenge from '@atlaskit/lozenge';
import Spinner from '@atlaskit/spinner';
import { GitBranch, Star } from 'lucide-react';
import { discoverCandidateRepos } from '@/services/auditApi.js';
import type { DiscoveredRepo } from '@/types/audit.js';

interface AuditInputFormProps {
  isLoading: boolean;
  onSubmit: (formData: FormData) => void;
  onLoadSample: () => void;
}

export function AuditInputForm({ isLoading, onSubmit, onLoadSample }: AuditInputFormProps) {
  const [jobTitle, setJobTitle] = useState('Senior Fullstack Engineer (Enterprise)');
  const [jobDesc, setJobDesc] = useState('Requires 4+ years React, TypeScript, Node.js, Docker, and CI/CD pipelines.');
  const [githubUrl, setGithubUrl] = useState('');
  const [cvText, setCvText] = useState('');
  const [file, setFile] = useState<File | null>(null);

  // Human-in-the-Loop Repo Selector State
  const [discoveredRepos, setDiscoveredRepos] = useState<DiscoveredRepo[]>([]);
  const [selectedRepos, setSelectedRepos] = useState<string[]>([]);
  const [isFetchingRepos, setIsFetchingRepos] = useState(false);
  const [repoFetchMsg, setRepoFetchMsg] = useState<string | null>(null);

  const handleFetchRepos = async () => {
    if (!githubUrl.trim()) {
      setRepoFetchMsg('Masukkan URL atau username GitHub terlebih dahulu.');
      return;
    }

    setIsFetchingRepos(true);
    setRepoFetchMsg(null);

    try {
      const skills = jobDesc
        .split(/[,\s]+/)
        .map((s) => s.trim().replace(/[.]+/, ''))
        .filter((s) => s.length > 2);

      const repos = await discoverCandidateRepos(githubUrl, skills);
      setDiscoveredRepos(repos);

      // Auto pre-select AI recommended repos
      const recommended = repos.filter((r) => r.isRecommended).map((r) => r.name);
      setSelectedRepos(recommended.length > 0 ? recommended : repos.slice(0, 3).map((r) => r.name));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setRepoFetchMsg(msg);
    } finally {
      setIsFetchingRepos(false);
    }
  };

  const toggleRepoSelection = (repoName: string) => {
    setSelectedRepos((prev) =>
      prev.includes(repoName) ? prev.filter((n) => n !== repoName) : [...prev, repoName]
    );
  };

  const selectAllRecommended = () => {
    const recommended = discoveredRepos.filter((r) => r.isRecommended).map((r) => r.name);
    setSelectedRepos(recommended);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    if (file) formData.append('cv', file);
    if (cvText) formData.append('cvText', cvText);
    formData.append('jobTitle', jobTitle);
    formData.append('jobDesc', jobDesc);
    if (githubUrl) formData.append('manualGithubUrl', githubUrl);
    if (selectedRepos.length > 0) {
      formData.append('selectedRepos', JSON.stringify(selectedRepos));
    }

    onSubmit(formData);
  };

  return (
    <div style={{ background: '#FAFBFC', border: '1px solid #DFE1E6', borderRadius: 8, padding: 20, marginBottom: 24 }}>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 12 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#42526E', marginBottom: 4 }}>
              Target Job Title
            </label>
            <Textfield
              value={jobTitle}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setJobTitle(e.target.value)}
              placeholder="e.g. Senior Backend Go Engineer"
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#42526E', marginBottom: 4 }}>
              Manual GitHub URL (Optional)
            </label>
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{ flex: 1 }}>
                <Textfield
                  value={githubUrl}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/username"
                />
              </div>
              <Button appearance="default" onClick={handleFetchRepos} isDisabled={isFetchingRepos}>
                {isFetchingRepos ? <Spinner size="small" /> : 'Scan Repo'}
              </Button>
            </div>
            {repoFetchMsg && (
              <span style={{ fontSize: 11, color: '#DE350B', marginTop: 4, display: 'block' }}>{repoFetchMsg}</span>
            )}
          </div>
        </div>

        {/* Human-in-the-Loop Repository Selection Panel */}
        {discoveredRepos.length > 0 && (
          <div
            style={{
              background: '#FFFFFF',
              border: '1px solid #4C9AFF',
              borderRadius: 6,
              padding: 14,
              marginBottom: 16,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div>
                <strong style={{ fontSize: 13, color: '#0747A6', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <GitBranch size={16} /> Human-in-the-Loop: Pilih Repositori Target ({selectedRepos.length} dipilih)
                </strong>
                <p style={{ margin: '2px 0 0 0', fontSize: 11, color: '#5E6C84' }}>
                  AI merekomendasikan repositori paling relevan. Anda dapat mencentang atau membatalkan pilihan.
                </p>
              </div>
              <Button appearance="subtle" onClick={selectAllRecommended}>
                Pilih Semua Rekomendasi
              </Button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 10 }}>
              {discoveredRepos.map((repo) => {
                const isChecked = selectedRepos.includes(repo.name);
                return (
                  <div
                    key={repo.name}
                    onClick={() => toggleRepoSelection(repo.name)}
                    style={{
                      border: isChecked ? '1.5px solid #0052CC' : '1px solid #DFE1E6',
                      borderRadius: 6,
                      padding: 10,
                      backgroundColor: isChecked ? '#DEEBFF' : '#FAFBFC',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                      <span style={{ fontWeight: 600, fontSize: 12, color: '#172B4D' }}>{repo.name}</span>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        style={{ cursor: 'pointer', marginTop: 2 }}
                      />
                    </div>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap', marginBottom: 4 }}>
                      <Lozenge appearance="default">{repo.language}</Lozenge>
                      {repo.isRecommended && <Lozenge appearance="success">AI RECOMMENDED</Lozenge>}
                      {repo.stars > 0 && (
                        <span style={{ fontSize: 10, color: '#5E6C84', display: 'inline-flex', alignItems: 'center', gap: 2 }}>
                          <Star size={10} /> {repo.stars}
                        </span>
                      )}
                    </div>
                    <p style={{ margin: 0, fontSize: 11, color: '#42526E', lineHeight: 1.3 }}>
                      {repo.recommendationReason || repo.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#42526E', marginBottom: 4 }}>
            Job Description & Qualifications
          </label>
          <TextArea
            value={jobDesc}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setJobDesc(e.target.value)}
            rows={2}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#42526E', marginBottom: 4 }}>
              Upload Candidate CV (PDF)
            </label>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              style={{ fontSize: 13, padding: '6px 0' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#42526E', marginBottom: 4 }}>
              Or Paste CV Text Directly
            </label>
            <TextArea
              value={cvText}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCvText(e.target.value)}
              placeholder="Paste candidate resume text here..."
              rows={2}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <Button appearance="primary" type="submit" isDisabled={isLoading}>
            {isLoading ? 'Running Autonomous Audit...' : 'Run Autonomous Technical Audit'}
          </Button>
          <Button appearance="default" onClick={onLoadSample} isDisabled={isLoading}>
            Load Sample Candidate (Instant Demo)
          </Button>
        </div>
      </form>
    </div>
  );
}
