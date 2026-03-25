import { Module } from '@nestjs/common';
import { ChatStorageService } from './chat-storage.service';

@Module({
  providers: [ChatStorageService],
  exports: [ChatStorageService],
})
export class ChatStorageModule {}
