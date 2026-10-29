import type { Request, Response } from 'express';
import { config } from '../../config/env.js';
import { googleAuthService } from '../../services/googleAuthService.js';
import { toolRegistry } from '../../tools/index.js';
import type { ScheduleInterviewParams, ScheduleInterviewResult } from '../../tools/implementations/googleCalendarTool.js';
import type { SendInviteParams, SendInviteResult } from '../../tools/implementations/googleMailTool.js';

export function getGoogleAuthUrl(req: Request, res: Response): void {
  try {
    const isConfigured = googleAuthService.isConfigured();
    if (!isConfigured) {
      res.json({
        success: false,
        isConfigured: false,
        error: 'Google OAuth is not configured. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET.',
      });
      return;
    }

    const state = (req.query.state as string) || 'talenttrace-auth';
    const url = googleAuthService.getAuthUrl(state);
    res.json({ success: true, isConfigured: true, url });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({ success: false, error: message });
  }
}

export async function handleGoogleOAuthCallback(req: Request, res: Response): Promise<void> {
  const code = req.query.code as string;
  const error = req.query.error as string;

  const frontendUrl = process.env.CLIENT_URL || (config.nodeEnv === 'development' ? 'http://localhost:5173' : '');

  if (error) {
    res.redirect(`${frontendUrl}/?google_auth=error&reason=` + encodeURIComponent(error));
    return;
  }

  if (!code) {
    res.redirect(`${frontendUrl}/?google_auth=error&reason=missing_code`);
    return;
  }

  try {
    const result = await googleAuthService.exchangeCode(code);
    res.redirect(`${frontendUrl}/?google_auth=success&email=${encodeURIComponent(result.email || '')}`);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[GoogleAuthController] Callback exchange failed:', message);
    res.redirect(`${frontendUrl}/?google_auth=error&reason=` + encodeURIComponent(message));
  }
}

export function getGoogleAuthStatus(_req: Request, res: Response): void {
  res.json({
    success: true,
    isConfigured: googleAuthService.isConfigured(),
    isAuthenticated: googleAuthService.isAuthenticated(),
    email: googleAuthService.getUserEmail(),
  });
}

export function handleDisconnectGoogleAuth(_req: Request, res: Response): void {
  googleAuthService.disconnect();
  res.json({ success: true, message: 'Google account disconnected.' });
}

export async function handleScheduleInterviewAction(req: Request, res: Response): Promise<void> {
  try {
    const {
      candidateName,
      candidateEmail,
      jobTitle,
      startTime,
      durationMinutes,
      interviewTopics,
      interviewerNotes,
      sendEmail = true,
    } = req.body;

    if (!candidateName || !candidateEmail || !startTime) {
      res.status(400).json({
        success: false,
        error: 'Missing required fields: candidateName, candidateEmail, or startTime.',
      });
      return;
    }

    // 1. Tool Execution: Google Calendar
    const calendarParams: ScheduleInterviewParams = {
      candidateName,
      candidateEmail,
      jobTitle: jobTitle || 'Software Engineer',
      startTime,
      durationMinutes: durationMinutes ? Number(durationMinutes) : 45,
      interviewTopics: Array.isArray(interviewTopics) ? interviewTopics : [],
      interviewerNotes,
    };

    const calendarResult = await toolRegistry.executeTool<ScheduleInterviewParams, ScheduleInterviewResult>(
      'google_calendar_schedule',
      calendarParams
    );

    let mailResult: SendInviteResult | null = null;

    // 2. Tool Execution: Google Mail
    if (sendEmail) {
      const mailParams: SendInviteParams = {
        to: candidateEmail,
        candidateName,
        jobTitle: jobTitle || 'Software Engineer',
        meetLink: calendarResult.meetLink || calendarResult.eventLink || 'https://meet.google.com',
        startTime,
        tailoredTopics: calendarParams.interviewTopics,
      };

      mailResult = await toolRegistry.executeTool<SendInviteParams, SendInviteResult>(
        'google_mail_send_invite',
        mailParams
      );
    }

    res.json({
      success: true,
      data: {
        calendar: calendarResult,
        mail: mailResult,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[GoogleAuthController] Schedule interview failed:', message);
    res.status(500).json({ success: false, error: message });
  }
}
