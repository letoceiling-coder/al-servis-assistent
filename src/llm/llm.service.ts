import { Injectable, Logger } from '@nestjs/common';
import { LlamaProvider } from './providers/llama.provider';

const FALLBACK_MESSAGE = 'AI is temporarily unavailable';

/** assistant.model values → Ollama model tag (local). */
function ollamaModelFromAssistantModel(model: string): string {
  const id = (model || 'llama3').toLowerCase().trim();
  if (id === 'mistral') {
    return 'mistral';
  }
  if (id === 'llama3' || id === 'llama') {
    return 'llama3';
  }
  return 'llama3';
}

@Injectable()
export class LlmService {
  private readonly logger = new Logger(LlmService.name);

  constructor(private readonly ollama: LlamaProvider) {}

  /**
   * All assistant LLM modes route to local Ollama; `mistral` / `llama3` pick the Ollama model name.
   */
  async generate(prompt: string, model: string): Promise<string> {
    const ollamaModel = ollamaModelFromAssistantModel(model);

    try {
      return await this.ollama.generate(prompt, ollamaModel);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      this.logger.warn(`LLM generate failed: ${msg}`);
      return FALLBACK_MESSAGE;
    }
  }
}
