import { Body, Controller, Headers, Post } from '@nestjs/common';
import { ChatMessageDto } from './dto/chat-message.dto';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  create(
    @Headers('authorization') authorization: string | undefined,
    @Body() dto: ChatMessageDto,
  ) {
    return this.chatService.chat(authorization, dto.message);
  }
}
