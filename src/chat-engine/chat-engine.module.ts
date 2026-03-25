import { Module } from '@nestjs/common';
import { ApiKeysModule } from '../api-keys/api-keys.module';
import { LlmModule } from '../llm/llm.module';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';

@Module({
  imports: [ApiKeysModule, LlmModule],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatEngineModule {}
