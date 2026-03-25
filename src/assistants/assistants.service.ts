import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAssistantDto } from './dto/create-assistant.dto';
import { UpdateAssistantDto } from './dto/update-assistant.dto';

const assistantPublic = {
  id: true,
  name: true,
  userId: true,
  createdAt: true,
} as const;

@Injectable()
export class AssistantsService {
  constructor(private readonly prisma: PrismaService) {}

  create(userId: string, dto: CreateAssistantDto) {
    return this.prisma.assistant.create({
      data: { name: dto.name.trim(), userId },
      select: assistantPublic,
    });
  }

  findAll(userId: string) {
    return this.prisma.assistant.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: assistantPublic,
    });
  }

  async findOne(userId: string, id: string) {
    const row = await this.prisma.assistant.findFirst({
      where: { id, userId },
      select: assistantPublic,
    });
    if (!row) {
      throw new NotFoundException('Assistant not found');
    }
    return row;
  }

  async update(userId: string, id: string, dto: UpdateAssistantDto) {
    const result = await this.prisma.assistant.updateMany({
      where: { id, userId },
      data: { name: dto.name.trim() },
    });
    if (result.count === 0) {
      throw new NotFoundException('Assistant not found');
    }
    return this.prisma.assistant.findFirstOrThrow({
      where: { id, userId },
      select: assistantPublic,
    });
  }

  async remove(userId: string, id: string) {
    const result = await this.prisma.assistant.deleteMany({
      where: { id, userId },
    });
    if (result.count === 0) {
      throw new NotFoundException('Assistant not found');
    }
  }
}
