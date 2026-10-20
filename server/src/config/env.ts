import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  githubToken: process.env.GITHUB_TOKEN || '',
  router: {
    apiKey: process.env.ROUTER_API_KEY || process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY || '',
    baseUrl: process.env.ROUTER_BASE_URL || 'https://openrouter.ai/api/v1',
    defaultModel: process.env.ROUTER_MODEL || 'google/gemini-2.0-flash-001',
  },
  geminiApiKey: process.env.GEMINI_API_KEY || '',
};
