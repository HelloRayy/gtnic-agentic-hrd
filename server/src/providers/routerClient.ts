import OpenAI from 'openai';
import { config } from '../config/env.js';

export class RouterClient {
  private client: OpenAI | null = null;
  private readonly fallbackModels = ['claude-3-5-sonnet', 'gpt-4o'];

  constructor() {
    if (config.router.apiKey) {
      this.client = new OpenAI({
        apiKey: config.router.apiKey,
        baseURL: config.router.baseUrl,
        maxRetries: 0,
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

    const candidateModels = [
      config.router.defaultModel,
      ...this.fallbackModels,
    ].filter((m, idx, arr) => Boolean(m) && arr.indexOf(m) === idx);

    let lastError: any = null;

    for (const model of candidateModels) {
      const isPrimary = model === config.router.defaultModel;
      const modelTimeout = isPrimary ? 8000 : 60000;

      try {
        console.log(`[RouterClient] Dispatching synthesis to model: ${model} (timeout: ${modelTimeout}ms)...`);
        const response = await this.client.chat.completions.create(
          {
            model,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt },
            ],
            temperature: 0.2,
            stream: false,
          },
          { timeout: modelTimeout }
        );

        const content = response.choices[0]?.message?.content || '{}';
        const parsed = this.cleanAndParseJson(content);
        console.log(`[RouterClient] Successfully completed reasoning with model: ${model}`);
        return {
          ...parsed,
          _resolvedModel: model,
        };
      } catch (err: any) {
        lastError = err;
        console.warn(`[RouterClient] Model "${model}" failed (${err.message || 'error'}). Trying next fallback...`);
      }
    }

    throw lastError || new Error('All configured router models failed to respond.');
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
