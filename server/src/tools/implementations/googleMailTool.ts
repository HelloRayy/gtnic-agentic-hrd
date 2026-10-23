import { google } from 'googleapis';
import type { BaseTool, ToolParamDef } from '../registry.js';
import { googleAuthService } from '../../services/googleAuthService.js';

export interface SendInviteParams {
  to: string;
  candidateName: string;
  jobTitle: string;
  meetLink: string;
  startTime: string;
  tailoredTopics?: string[];
  customSubject?: string;
}

export interface SendInviteResult {
  status: 'SENT' | 'SIMULATED';
  messageId: string;
  recipient: string;
  subject: string;
  isLive: boolean;
  previewBody: string;
}

export class GoogleMailTool implements BaseTool<SendInviteParams, SendInviteResult> {
  public name = 'google_mail_send_invite';
  public description = 'Dispatches a professional interview invitation email via Gmail with Google Meet link and agenda.';

  public parameterSchema: Record<string, ToolParamDef> = {
    to: { type: 'string', required: true, description: 'Recipient email address' },
    candidateName: { type: 'string', required: true, description: 'Candidate full name' },
    jobTitle: { type: 'string', required: true, description: 'Job position' },
    meetLink: { type: 'string', required: true, description: 'Google Meet conference URL' },
    startTime: { type: 'string', required: true, description: 'Scheduled interview time (ISO or human readable)' },
    tailoredTopics: { type: 'object', required: false, description: 'List of technical talking points' },
    customSubject: { type: 'string', required: false, description: 'Optional email subject line' },
  };

  public async execute(params: SendInviteParams): Promise<SendInviteResult> {
    const subject =
      params.customSubject || `Invitation: Technical Interview - ${params.jobTitle} at Garda Tech`;

    const formattedTime = new Date(params.startTime).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short',
    });

    const topicsText = Array.isArray(params.tailoredTopics) && params.tailoredTopics.length > 0
      ? params.tailoredTopics.map((t) => `  * ${t}`).join('\n')
      : '  * Deep dive into repository architecture and real-world engineering decisions.';

    const emailBody = [
      `Hi ${params.candidateName},`,
      '',
      `Thank you for applying for the ${params.jobTitle} position. We have completed our preliminary portfolio audit and would love to invite you to a technical discussion session.`,
      '',
      `Session Details:`,
      `Date & Time: ${formattedTime}`,
      `Meeting Link: ${params.meetLink}`,
      '',
      `Key Discussion Anchors:`,
      topicsText,
      '',
      `Please let us know if you have any questions ahead of the call. We look forward to speaking with you!`,
      '',
      `Best regards,`,
      `Engineering Hiring Team`,
      `TalentTrace AI Autonomous Operations`,
    ].join('\n');

    if (googleAuthService.isAuthenticated()) {
      try {
        const auth = googleAuthService.getClient();
        const gmail = google.gmail({ version: 'v1', auth });

        // Build RFC 2822 email message
        const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
        const messageParts = [
          `To: ${params.candidateName} <${params.to}>`,
          `Subject: ${utf8Subject}`,
          'MIME-Version: 1.0',
          'Content-Type: text/plain; charset=utf-8',
          'Content-Transfer-Encoding: 7bit',
          '',
          emailBody,
        ];
        const rawMessage = messageParts.join('\r\n');
        const encodedMessage = Buffer.from(rawMessage)
          .toString('base64')
          .replace(/\+/g, '-')
          .replace(/\//g, '_')
          .replace(/=+$/, '');

        const response = await gmail.users.messages.send({
          userId: 'me',
          requestBody: {
            raw: encodedMessage,
          },
        });

        return {
          status: 'SENT',
          messageId: response.data.id || `msg-${Date.now()}`,
          recipient: params.to,
          subject,
          isLive: true,
          previewBody: emailBody,
        };
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        console.warn('[GoogleMailTool] Gmail API send failed, falling back to simulated output:', message);
      }
    }

    // Simulated fallback when Google OAuth is not connected
    return {
      status: 'SIMULATED',
      messageId: `mock-msg-${Date.now().toString(36)}`,
      recipient: params.to,
      subject,
      isLive: false,
      previewBody: emailBody,
    };
  }
}
