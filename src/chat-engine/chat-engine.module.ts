import { Module } from '@nestjs/common';
import { ApiKeysModule } from '../api-keys/api-keys.module';
import { ChatStorageModule } from '../chat-storage/chat-storage.module';
import { LlmModule } from '../llm/llm.module';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';

@Module({
  imports: [ApiKeysModule, LlmModule, ChatStorageModule],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatEngineModule {}
