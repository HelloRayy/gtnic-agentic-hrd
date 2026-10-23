import { useState, useEffect } from 'react';
import Button from '@atlaskit/button/standard-button';
import Lozenge from '@atlaskit/lozenge';
import SectionMessage from '@atlaskit/section-message';
import Spinner from '@atlaskit/spinner';
import type { GoogleAuthStatus } from '../../../types/audit.js';
import {
  fetchGoogleAuthStatus,
  fetchGoogleAuthUrl,
  disconnectGoogleAccount,
} from '../../../services/auditApi.js';

interface HrdIntegrationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStatusChange?: (status: GoogleAuthStatus) => void;
}

export function HrdIntegrationsModal({
  isOpen,
  onClose,
  onStatusChange,
}: HrdIntegrationsModalProps) {
  const [status, setStatus] = useState<GoogleAuthStatus>({
    isConfigured: false,
    isAuthenticated: false,
    email: null,
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetchGoogleAuthStatus()
        .then((s) => {
          setStatus(s);
          onStatusChange?.(s);
        })
        .finally(() => setLoading(false));
    }
  }, [isOpen, onStatusChange]);

  if (!isOpen) return null;

  const handleConnect = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const url = await fetchGoogleAuthUrl();
      if (url) {
        window.location.href = url;
      } else {
        setErrorMsg('Google OAuth is not configured on the server. Please add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to your .env file.');
        setLoading(false);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMsg(msg);
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      await disconnectGoogleAccount();
      const fresh = await fetchGoogleAuthStatus();
      setStatus(fresh);
      onStatusChange?.(fresh);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(9, 30, 66, 0.54)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: 16,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 8,
          boxShadow: '0 8px 24px rgba(9, 30, 66, 0.25)',
          width: '100%',
          maxWidth: 540,
          padding: 24,
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: '#172B4D', margin: 0 }}>
              HRD Workspace Connectors
            </h2>
            <p style={{ margin: '4px 0 0 0', fontSize: 13, color: '#5E6C84' }}>
              Authorize autonomous agent tools to schedule interviews and email candidates.
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: 20,
              cursor: 'pointer',
              color: '#6B778C',
              padding: '0 4px',
            }}
          >
            ×
          </button>
        </div>

        {errorMsg && (
          <div style={{ marginBottom: 16 }}>
            <SectionMessage appearance="error" title="Connector Error">
              <p>{errorMsg}</p>
            </SectionMessage>
          </div>
        )}

        <div
          style={{
            border: '1px solid #DFE1E6',
            borderRadius: 6,
            padding: 16,
            marginBottom: 20,
            backgroundColor: '#FAFBFC',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontWeight: 600, fontSize: 14, color: '#172B4D' }}>
              Google Workspace (Calendar & Gmail)
            </span>
            {loading ? (
              <Spinner size="small" />
            ) : status.isAuthenticated ? (
              <Lozenge appearance="success">CONNECTED</Lozenge>
            ) : status.isConfigured ? (
              <Lozenge appearance="inprogress">READY TO CONNECT</Lozenge>
            ) : (
              <Lozenge appearance="default">SANDBOX MODE</Lozenge>
            )}
          </div>

          <p style={{ fontSize: 12, color: '#5E6C84', margin: '0 0 12px 0' }}>
            {status.isAuthenticated
              ? `Authorized as: ${status.email}. The AI agent can create Google Meet sessions and dispatch customized interview agendas.`
              : 'Connect your corporate Google account to enable 1-click meeting scheduling and candidate email dispatch.'}
          </p>

          <div style={{ fontSize: 12, color: '#42526E', marginBottom: 16 }}>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>Integrated Capabilities:</div>
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              <li><strong>Google Calendar:</strong> Generates Google Meet interview links and syncs to interviewer calendar.</li>
              <li><strong>Gmail API:</strong> Sends personalized invitations with verified code anchors and talking points.</li>
              <li><strong>Human-in-the-Loop:</strong> No email or calendar event is dispatched without explicit user confirmation.</li>
            </ul>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            {status.isAuthenticated ? (
              <Button appearance="danger" onClick={handleDisconnect} isDisabled={loading}>
                Disconnect Google Account
              </Button>
            ) : (
              <Button appearance="primary" onClick={handleConnect} isDisabled={loading}>
                Connect Google Account
              </Button>
            )}
          </div>
        </div>

        {!status.isConfigured && !status.isAuthenticated && (
          <div style={{ marginBottom: 16 }}>
            <SectionMessage appearance="information" title="Sandbox Simulation Mode Active">
              <p style={{ fontSize: 12 }}>
                GOOGLE_CLIENT_ID is not configured in .env. The agent will automatically use simulated Google Meet links and sample email receipts for judging and testing.
              </p>
            </SectionMessage>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button appearance="subtle" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}
