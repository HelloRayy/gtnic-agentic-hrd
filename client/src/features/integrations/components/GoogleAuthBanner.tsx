import { useState, useEffect } from 'react';
import SectionMessage, { SectionMessageAction } from '@atlaskit/section-message';

export function GoogleAuthBanner() {
  const [notification, setNotification] = useState<{
    appearance: 'success' | 'error';
    title: string;
    message: string;
  } | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const authStatus = params.get('google_auth');
    const email = params.get('email');
    const reason = params.get('reason');

    if (authStatus === 'success') {
      setNotification({
        appearance: 'success',
        title: 'Google Workspace Connected Successfully',
        message: `TalentTrace AI is now authorized to schedule Google Meet events and send Gmail interview invites${
          email ? ` as ${email}` : ''
        }.`,
      });
      // Clean query params from URL without reloading
      window.history.replaceState({}, '', window.location.pathname);
    } else if (authStatus === 'error') {
      setNotification({
        appearance: 'error',
        title: 'Google Workspace Connection Failed',
        message: reason
          ? `Authorization error: ${decodeURIComponent(reason)}`
          : 'Failed to complete Google OAuth consent. Please try again or verify client credentials.',
      });
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  if (!notification) return null;

  return (
    <div style={{ marginBottom: 20 }}>
      <SectionMessage
        appearance={notification.appearance}
        title={notification.title}
        actions={[
          <SectionMessageAction key="dismiss" onClick={() => setNotification(null)}>
            Tutup
          </SectionMessageAction>,
        ]}
      >
        <p>{notification.message}</p>
      </SectionMessage>
    </div>
  );
}
