import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { LLMProvider } from '../llm-provider.interface';

/** Default targets Ollama-style POST /api/chat (Llama 3 compatible). */
@Injectable()
export class LlamaProvider implements LLMProvider {
  constructor(private readonly config: ConfigService) {}

  async generate(prompt: string, modelName?: string): Promise<string> {
    const url =
      this.config.get<string>('LLAMA_API_URL') ||
      'http://127.0.0.1:11434/api/chat';
    const model =
      (modelName && modelName.trim()) ||
      this.config.get<string>('LLAMA_MODEL') ||
      'llama3';

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: prompt }],
        stream: false,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Llama HTTP ${res.status}: ${text}`);
    }

    const data = (await res.json()) as { message?: { content?: string } };
    const content = data?.message?.content;
    if (!content || typeof content !== 'string') {
      throw new Error('Invalid Llama response shape');
    }
    return content.trim();
  }
}
