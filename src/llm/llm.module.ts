import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LlamaProvider } from './providers/llama.provider';
import { LlmService } from './llm.service';

@Module({
  imports: [ConfigModule],
  providers: [LlamaProvider, LlmService],
  exports: [LlmService],
})
export class LlmModule {}
