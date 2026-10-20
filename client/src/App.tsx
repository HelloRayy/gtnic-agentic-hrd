import { useState } from 'react';
import { AuditHeader } from './features/audit/components/AuditHeader.js';
import { AuditInputForm } from './features/audit/components/AuditInputForm.js';
import { AuditProgress } from './features/audit/components/AuditProgress.js';
import { DossierTabs } from './features/audit/components/DossierTabs.js';
import { submitAudit, fetchSampleAudit } from './services/auditApi.js';
import type { TechnicalDossier } from './types/audit.js';

export default function App() {
  const [dossier, setDossier] = useState<TechnicalDossier | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRunAudit = async (formData: FormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await submitAudit(formData);
      setDossier(result);
    } catch (err: any) {
      setError(err.message || 'Audit execution failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadSample = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchSampleAudit();
      setDossier(result);
    } catch (err: any) {
      setError(err.message || 'Sample audit failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '32px 16px', minHeight: '100vh', background: '#FFFFFF' }}>
      <AuditHeader />
      <AuditInputForm
        isLoading={isLoading}
        onSubmit={handleRunAudit}
        onLoadSample={handleLoadSample}
      />
      <AuditProgress isLoading={isLoading} error={error} />
      {dossier && <DossierTabs dossier={dossier} />}
    </div>
  );
}
