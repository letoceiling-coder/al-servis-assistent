import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export type MessageRole = 'user' | 'assistant';

@Injectable()
export class ChatStorageService {
  constructor(private readonly prisma: PrismaService) {}

  createChat(assistantId: string) {
    return this.prisma.chat.create({
      data: { assistantId },
      select: { id: true, createdAt: true },
    });
  }

  saveMessage(chatId: string, role: MessageRole, content: string) {
    return this.prisma.message.create({
      data: { chatId, role, content },
      select: { id: true, createdAt: true },
    });
  }

  getMessages(chatId: string) {
    return this.prisma.message.findMany({
      where: { chatId },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        role: true,
        content: true,
        createdAt: true,
      },
    });
  }
}
