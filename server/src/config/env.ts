import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const possibleEnvPaths = [
  path.resolve(process.cwd(), '.env'),
  path.resolve(process.cwd(), 'server/.env'),
  path.resolve(__dirname, '../../.env'),
  path.resolve(__dirname, '../.env'),
];

for (const p of possibleEnvPaths) {
  if (fs.existsSync(p)) {
    dotenv.config({ path: p });
    break;
  }
}

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  githubToken: process.env.GITHUB_TOKEN || '',
  router: {
    apiKey: process.env.ROUTER_API_KEY || process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY || '',
    baseUrl: process.env.ROUTER_BASE_URL || 'https://openrouter.ai/api/v1',
    defaultModel: process.env.ROUTER_MODEL || 'gemini-3.8-flash',
  },
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    redirectUri: process.env.GOOGLE_REDIRECT_URI || `http://localhost:${process.env.PORT || '5000'}/api/auth/google/callback`,
  },
};
