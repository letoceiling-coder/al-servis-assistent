import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { LLMProvider } from '../llm-provider.interface';

@Injectable()
export class MistralProvider implements LLMProvider {
  constructor(private readonly config: ConfigService) {}

  async generate(prompt: string): Promise<string> {
    const apiKey = this.config.get<string>('MISTRAL_API_KEY');
    const url =
      this.config.get<string>('MISTRAL_API_URL') ||
      'https://api.mistral.ai/v1/chat/completions';
    const model =
      this.config.get<string>('MISTRAL_MODEL') || 'mistral-small-latest';

    if (!apiKey) {
      throw new Error('MISTRAL_API_KEY is not configured');
    }

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Mistral HTTP ${res.status}: ${text}`);
    }

    const data = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = data?.choices?.[0]?.message?.content;
    if (!content || typeof content !== 'string') {
      throw new Error('Invalid Mistral response shape');
    }
    return content.trim();
  }
}
