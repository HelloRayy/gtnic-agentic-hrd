import OpenAI from 'openai';
import { config } from '../config/env.js';

export class RouterClient {
  private client: OpenAI | null = null;

  constructor() {
    if (config.router.apiKey) {
      this.client = new OpenAI({
        apiKey: config.router.apiKey,
        baseURL: config.router.baseUrl,
      });
    }
  }

  public get isConfigured(): boolean {
    return this.client !== null;
  }

  public async completeStructured(systemPrompt: string, userPrompt: string): Promise<any> {
    if (!this.client) {
      throw new Error('LLM Router is not configured with an API key.');
    }

    const response = await this.client.chat.completions.create({
      model: config.router.defaultModel,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.2,
      stream: false,
    });

    const content = response.choices[0]?.message?.content || '{}';
    return this.cleanAndParseJson(content);
  }

  private cleanAndParseJson(raw: string): any {
    let clean = raw.trim();
    if (clean.startsWith('```json')) {
      clean = clean.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (clean.startsWith('```')) {
      clean = clean.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }
    clean = clean.replace(/:\s*undefined\b/g, ': null');
    return JSON.parse(clean.trim());
  }
}

export const routerClient = new RouterClient();
