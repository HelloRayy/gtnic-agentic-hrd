import { useState, useEffect, useRef } from 'react';
import {
  AuditHeader,
  AuditInputForm,
  AuditProgress,
  DossierTabs,
} from '@/features/audit/index.js';
import {
  GoogleAuthBanner,
  HrdIntegrationsModal,
} from '@/features/integrations/index.js';
import { streamAuditExecution, fetchGoogleAuthStatus } from '@/services/auditApi.js';
import type { TechnicalDossier, TraceEvent, GoogleAuthStatus } from '@/types/audit.js';

export default function App() {
  const [dossier, setDossier] = useState<TechnicalDossier | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [traceEvents, setTraceEvents] = useState<TraceEvent[]>([]);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isIntegrationsOpen, setIsIntegrationsOpen] = useState(false);
  const [googleStatus, setGoogleStatus] = useState<GoogleAuthStatus | null>(null);
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const isExecutingRef = useRef(false);
  useEffect(() => {
    fetchGoogleAuthStatus().then(setGoogleStatus);
  }, []);
  useEffect(() => {
    if (isLoading) {
      startTimeRef.current = Date.now();
      timerRef.current = window.setInterval(() => {
        setElapsedSeconds((Date.now() - startTimeRef.current) / 1000);
      }, 100);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isLoading]);

  const handleRunAudit = async (formData: FormData) => {
    if (isExecutingRef.current) return;
    isExecutingRef.current = true;
    setIsLoading(true);
    setError(null);
    setTraceEvents([]);
    setElapsedSeconds(0);

    try {
      await streamAuditExecution(formData, false, {
        onProgress: (event) => setTraceEvents((prev) => [...prev, event]),
        onComplete: (result) => {
          setDossier(result);
          setIsLoading(false);
          isExecutingRef.current = false;
        },
        onError: (err) => {
          setError(err);
          setIsLoading(false);
          isExecutingRef.current = false;
        },
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg || 'Audit execution failed');
      setIsLoading(false);
      isExecutingRef.current = false;
    }
  };

  const handleLoadSample = async () => {
    if (isExecutingRef.current) return;
    isExecutingRef.current = true;
    setIsLoading(true);
    setError(null);
    setTraceEvents([]);
    setElapsedSeconds(0);

    try {
      await streamAuditExecution(null, true, {
        onProgress: (event) => setTraceEvents((prev) => [...prev, event]),
        onComplete: (result) => {
          setDossier(result);
          setIsLoading(false);
          isExecutingRef.current = false;
        },
        onError: (err) => {
          setError(err);
          setIsLoading(false);
          isExecutingRef.current = false;
        },
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg || 'Sample audit failed');
      setIsLoading(false);
      isExecutingRef.current = false;
    }
  };

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '32px 16px', minHeight: '100vh', background: '#FFFFFF' }}>
      <GoogleAuthBanner />
      <AuditHeader
        onOpenIntegrations={() => setIsIntegrationsOpen(true)}
        googleStatus={googleStatus}
      />
      <HrdIntegrationsModal
        isOpen={isIntegrationsOpen}
        onClose={() => setIsIntegrationsOpen(false)}
        onStatusChange={setGoogleStatus}
      />
      <AuditInputForm
        isLoading={isLoading}
        onSubmit={handleRunAudit}
        onLoadSample={handleLoadSample}
      />
      <AuditProgress
        isLoading={isLoading}
        error={error}
        events={traceEvents}
        elapsedSeconds={elapsedSeconds}
      />
      {dossier && <DossierTabs dossier={dossier} />}
    </div>
  );
}
