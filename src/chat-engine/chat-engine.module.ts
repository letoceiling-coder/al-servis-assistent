import { Module } from '@nestjs/common';
import { ApiKeysModule } from '../api-keys/api-keys.module';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';

@Module({
  imports: [ApiKeysModule],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatEngineModule {}
