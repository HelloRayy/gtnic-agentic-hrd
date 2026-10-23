import OpenAI from 'openai';
import { config } from '../config/env.js';

export class RouterClient {
  private client: OpenAI | null = null;
  private readonly fallbackModels = [
    'ag/gemini-3.8-flash-low',
    'ag/gemini-3.8-flash',
    'gemini-3.8-flash',
    'claude-3-5-sonnet',
    'gpt-4o',
  ];

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
      const modelTimeout = isPrimary ? 45000 : 50000;

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

  private cleanAndParseJson(raw: string): Record<string, unknown> {
    let clean = raw.trim();
    if (clean.includes('```json')) {
      const match = clean.match(/```json\s*([\s\S]*?)\s*```/);
      if (match) clean = match[1];
    } else if (clean.includes('```')) {
      const match = clean.match(/```\s*([\s\S]*?)\s*```/);
      if (match) clean = match[1];
    }
    clean = clean.replace(/:\s*undefined\b/g, ': null');
    try {
      return JSON.parse(clean.trim()) as Record<string, unknown>;
    } catch {
      const start = clean.indexOf('{');
      const end = clean.lastIndexOf('}');
      if (start !== -1 && end !== -1 && end > start) {
        return JSON.parse(clean.slice(start, end + 1)) as Record<string, unknown>;
      }
      throw new Error('Failed to parse structured JSON from LLM response.');
    }
  }
}

export const routerClient = new RouterClient();
