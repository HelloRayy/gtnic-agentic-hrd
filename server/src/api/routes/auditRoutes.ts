import { Router } from 'express';
import multer from 'multer';
import {
  handleAuditRequest,
  handleSampleAudit,
  handleStreamAudit,
  handleDiscoverRepos,
  handleDeliberationChat,
  handleConstructiveFeedback,
} from '../controllers/auditController.js';
import { config } from '../../config/env.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

export const auditRouter = Router();

auditRouter.get('/health', (_req, res) => {
  res.json({
    status: 'healthy',
    agent: 'TalentTrace AI Agent Core',
    model: config.router.defaultModel,
    timestamp: new Date().toISOString(),
  });
});

auditRouter.get('/sample', handleSampleAudit);
auditRouter.get('/sample/stream', handleStreamAudit);
auditRouter.post('/audit', upload.single('cv'), handleAuditRequest);
auditRouter.post('/audit/stream', upload.single('cv'), handleStreamAudit);

auditRouter.get('/discover-repos', handleDiscoverRepos);
auditRouter.post('/discover-repos', handleDiscoverRepos);
auditRouter.post('/deliberate', handleDeliberationChat);
auditRouter.post('/audit/chat', handleDeliberationChat);
auditRouter.post('/constructive-feedback', handleConstructiveFeedback);
