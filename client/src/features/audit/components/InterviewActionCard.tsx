import React, { useState, useEffect } from 'react';
import Button from '@atlaskit/button/standard-button';
import Lozenge from '@atlaskit/lozenge';
import SectionMessage from '@atlaskit/section-message';
import Spinner from '@atlaskit/spinner';
import type { TechnicalDossier, GoogleAuthStatus, ScheduleInterviewResponse } from '@/types/audit.js';
import {
  fetchGoogleAuthStatus,
  fetchGoogleAuthUrl,
  disconnectGoogleAccount,
  dispatchScheduleInterview,
} from '@/services/auditApi.js';

interface InterviewActionCardProps {
  dossier: TechnicalDossier;
}

export function InterviewActionCard({ dossier }: InterviewActionCardProps) {
  const [authStatus, setAuthStatus] = useState<GoogleAuthStatus>({
    isConfigured: false,
    isAuthenticated: false,
    email: null,
  });
  const [isOpen, setIsOpen] = useState(false);
  const [candidateEmail, setCandidateEmail] = useState(
    dossier.candidate.email || 'candidate@example.com'
  );
  const [scheduledTime, setScheduledTime] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0);
    return tomorrow.toISOString().slice(0, 16);
  });
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [sendEmail, setSendEmail] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ScheduleInterviewResponse['data'] | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchGoogleAuthStatus().then(setAuthStatus);
  }, []);

  const handleConnectGoogle = async () => {
    const url = await fetchGoogleAuthUrl();
    if (url) {
      window.location.href = url;
    } else {
      alert('Google OAuth is not configured on the server. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env.');
    }
  };

  const handleDisconnect = async () => {
    await disconnectGoogleAccount();
    const updated = await fetchGoogleAuthStatus();
    setAuthStatus(updated);
  };

  const handleExecuteDispatch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    const topics = dossier.interviewKit.slice(0, 3).map((k) => `${k.topic}: ${k.question}`);

    try {
      const response = await dispatchScheduleInterview({
        candidateName: dossier.candidate.name,
        candidateEmail,
        jobTitle: dossier.jobTitle,
        startTime: new Date(scheduledTime).toISOString(),
        durationMinutes,
        interviewTopics: topics,
        sendEmail,
      });

      if (response.success && response.data) {
        setResult(response.data);
      } else {
        setErrorMsg(response.error || 'Failed to dispatch scheduling action.');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setErrorMsg(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        border: '1px solid #C1C7D0',
        borderRadius: 8,
        padding: 16,
        marginBottom: 20,
        backgroundColor: '#FAFBFC',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontWeight: 600, fontSize: 15, color: '#172B4D' }}>
              Human-in-the-Loop Action: Schedule Technical Interview
            </span>
            {authStatus.isAuthenticated ? (
              <Lozenge appearance="success">Google Connected: {authStatus.email}</Lozenge>
            ) : (
              <Lozenge appearance="inprogress">
                {authStatus.isConfigured ? 'Google Disconnected' : 'Sandbox Simulated Mode'}
              </Lozenge>
            )}
          </div>
          <p style={{ margin: '4px 0 0 0', fontSize: 13, color: '#5E6C84' }}>
            Autonomously creates Google Calendar event with Google Meet and dispatches Gmail invite with tailored topics.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {authStatus.isAuthenticated ? (
            <Button appearance="subtle" onClick={handleDisconnect} isDisabled={isLoading}>
              Disconnect Google
            </Button>
          ) : authStatus.isConfigured ? (
            <Button appearance="default" onClick={handleConnectGoogle} isDisabled={isLoading}>
              Connect Google Account
            </Button>
          ) : null}

          <Button
            appearance="primary"
            onClick={() => setIsOpen(!isOpen)}
            isDisabled={isLoading}
          >
            {isOpen ? 'Close Form' : '1-Click Schedule'}
          </Button>
        </div>
      </div>

      {errorMsg && (
        <div style={{ marginTop: 12 }}>
          <SectionMessage appearance="error" title="Action Execution Failed">
            <p>{errorMsg}</p>
          </SectionMessage>
        </div>
      )}

      {result && (
        <div style={{ marginTop: 16 }}>
          <SectionMessage appearance="success" title="Autonomous Scheduling Dispatched Successfully!">
            <div style={{ fontSize: 13, color: '#172B4D', display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div>
                <strong>Calendar Event:</strong> {result.calendar.summary} ({result.calendar.status})
              </div>
              {result.calendar.meetLink && (
                <div>
                  <strong>Google Meet URL:</strong>{' '}
                  <a href={result.calendar.meetLink} target="_blank" rel="noreferrer" style={{ color: '#0052CC' }}>
                    {result.calendar.meetLink}
                  </a>
                </div>
              )}
              {result.mail && (
                <div>
                  <strong>Gmail Notification:</strong> {result.mail.status} to {result.mail.recipient}
                </div>
              )}
            </div>
          </SectionMessage>
        </div>
      )}

      {isOpen && !result && (
        <form onSubmit={handleExecuteDispatch} style={{ marginTop: 16, borderTop: '1px solid #DFE1E6', paddingTop: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#42526E', marginBottom: 4 }}>
                Candidate Email
              </label>
              <input
                type="email"
                required
                value={candidateEmail}
                onChange={(e) => setCandidateEmail(e.target.value)}
                style={{ width: '100%', padding: '6px 10px', borderRadius: 4, border: '1px solid #DFE1E6', fontSize: 13 }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#42526E', marginBottom: 4 }}>
                Interview Date & Time
              </label>
              <input
                type="datetime-local"
                required
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                style={{ width: '100%', padding: '6px 10px', borderRadius: 4, border: '1px solid #DFE1E6', fontSize: 13 }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#42526E', marginBottom: 4 }}>
                Duration (Minutes)
              </label>
              <input
                type="number"
                min="15"
                max="120"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                style={{ width: '100%', padding: '6px 10px', borderRadius: 4, border: '1px solid #DFE1E6', fontSize: 13 }}
              />
            </div>
          </div>

          <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            <input
              type="checkbox"
              id="sendEmailCheck"
              checked={sendEmail}
              onChange={(e) => setSendEmail(e.target.checked)}
            />
            <label htmlFor="sendEmailCheck" style={{ fontSize: 13, color: '#172B4D' }}>
              Dispatch tailored invitation email via Gmail API with generated verification agenda
            </label>
          </div>

          <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button appearance="subtle" onClick={() => setIsOpen(false)} isDisabled={isLoading}>
              Cancel
            </Button>
            <Button appearance="primary" type="submit" isDisabled={isLoading}>
              {isLoading ? <Spinner size="small" /> : 'Confirm & Execute Action'}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
