import React, { useState } from 'react';
import Button from '@atlaskit/button/new';
import Textfield from '@atlaskit/textfield';
import TextArea from '@atlaskit/textarea';

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    if (file) formData.append('cv', file);
    if (cvText) formData.append('cvText', cvText);
    formData.append('jobTitle', jobTitle);
    formData.append('jobDesc', jobDesc);
    if (githubUrl) formData.append('manualGithubUrl', githubUrl);

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
              onChange={(e: any) => setJobTitle(e.target.value)}
              placeholder="e.g. Senior Backend Go Engineer"
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#42526E', marginBottom: 4 }}>
              Manual GitHub URL (Optional)
            </label>
            <Textfield
              value={githubUrl}
              onChange={(e: any) => setGithubUrl(e.target.value)}
              placeholder="https://github.com/username"
            />
          </div>
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#42526E', marginBottom: 4 }}>
            Job Description & Qualifications
          </label>
          <TextArea
            value={jobDesc}
            onChange={(e: any) => setJobDesc(e.target.value)}
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
              onChange={(e: any) => setCvText(e.target.value)}
              placeholder="Paste candidate resume text here..."
              rows={2}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
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
