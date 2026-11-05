import { Router } from 'express';
import multer from 'multer';
import {
  handleAuditRequest,
  handleSampleAudit,
  handleStreamAudit,
  handleDiscoverRepos,
  handleDeliberationChat,
  handleStreamDeliberationChat,
  handleConstructiveFeedback,
  handleGetRepoFileContent,
} from '../controllers/auditController.js';
import {
  handleGetHistory,
  handleGetHistoryById,
  handleDeleteHistoryById,
  handleSaveHistoryRecord,
} from '../controllers/historyController.js';
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
auditRouter.post('/deliberate/stream', handleStreamDeliberationChat);
auditRouter.post('/audit/chat', handleDeliberationChat);
auditRouter.post('/audit/chat/stream', handleStreamDeliberationChat);
auditRouter.post('/constructive-feedback', handleConstructiveFeedback);
auditRouter.get('/repo/file-content', handleGetRepoFileContent);

// History & Persistence Endpoints
auditRouter.get('/history', handleGetHistory);
auditRouter.get('/history/:id', handleGetHistoryById);
auditRouter.delete('/history/:id', handleDeleteHistoryById);
auditRouter.post('/history', handleSaveHistoryRecord);

auditRouter.get('/audit/history', handleGetHistory);
auditRouter.get('/audit/history/:id', handleGetHistoryById);
auditRouter.delete('/audit/history/:id', handleDeleteHistoryById);
