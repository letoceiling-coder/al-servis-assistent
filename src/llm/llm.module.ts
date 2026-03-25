import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LlamaProvider } from './providers/llama.provider';
import { MistralProvider } from './providers/mistral.provider';
import { LlmService } from './llm.service';

@Module({
  imports: [ConfigModule],
  providers: [MistralProvider, LlamaProvider, LlmService],
  exports: [LlmService],
})
export class LlmModule {}
