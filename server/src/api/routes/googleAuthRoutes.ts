import { Router } from 'express';
import {
  getGoogleAuthUrl,
  handleGoogleOAuthCallback,
  getGoogleAuthStatus,
  handleDisconnectGoogleAuth,
  handleScheduleInterviewAction,
} from '../controllers/googleAuthController.js';

export const googleAuthRouter = Router();

// OAuth flow
googleAuthRouter.get('/auth/google/url', getGoogleAuthUrl);
googleAuthRouter.get('/auth/google/callback', handleGoogleOAuthCallback);
googleAuthRouter.get('/auth/google/status', getGoogleAuthStatus);
googleAuthRouter.post('/auth/google/disconnect', handleDisconnectGoogleAuth);

// Autonomous Actions
googleAuthRouter.post('/action/schedule-interview', handleScheduleInterviewAction);
