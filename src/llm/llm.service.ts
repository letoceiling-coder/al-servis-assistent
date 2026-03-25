import { Injectable, Logger } from '@nestjs/common';
import { LlamaProvider } from './providers/llama.provider';
import { MistralProvider } from './providers/mistral.provider';

const FALLBACK_MESSAGE = 'AI is temporarily unavailable';

@Injectable()
export class LlmService {
  private readonly logger = new Logger(LlmService.name);

  constructor(
    private readonly mistral: MistralProvider,
    private readonly llama: LlamaProvider,
  ) {}

  async generate(prompt: string, model: string): Promise<string> {
    const id = (model || 'mistral').toLowerCase().trim();

    try {
      if (id === 'mistral') {
        return await this.mistral.generate(prompt);
      }
      if (id === 'llama3' || id === 'llama') {
        return await this.llama.generate(prompt);
      }
      this.logger.warn(`Unknown model "${model}", defaulting to mistral`);
      return await this.mistral.generate(prompt);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      this.logger.warn(`LLM generate failed: ${msg}`);
      return FALLBACK_MESSAGE;
    }
  }
}
