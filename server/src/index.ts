import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { config } from './config/env.js';
import { initializeTools } from './tools/index.js';
import { auditRouter } from './api/routes/auditRoutes.js';
import { googleAuthRouter } from './api/routes/googleAuthRoutes.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Tool Registry
initializeTools();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount API routes
app.use('/api', auditRouter);
app.use('/api', googleAuthRouter);

// Serve compiled client static files in production or if dist exists
const clientDistPath = path.resolve(__dirname, '../../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.use((_req, res) => {
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

app.listen(config.port, () => {
  console.log(`[TalentTrace AI] Server listening on port ${config.port} (${config.nodeEnv})`);
  console.log(`[TalentTrace AI] Active Router Model: ${config.router.defaultModel}`);
  console.log(`[TalentTrace AI] Health check available at http://localhost:${config.port}/api/health`);
});
