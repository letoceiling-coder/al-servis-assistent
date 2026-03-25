import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { splitText } from './utils/split-text';

const documentPublic = {
  id: true,
  title: true,
  content: true,
  type: true,
  assistantId: true,
  createdAt: true,
} as const;

@Injectable()
export class DocumentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateDocumentDto) {
    const assistant = await this.prisma.assistant.findUnique({
      where: { id: dto.assistantId },
      select: { id: true, userId: true },
    });
    if (!assistant) {
      throw new NotFoundException('Assistant not found');
    }
    if (assistant.userId !== userId) {
      throw new ForbiddenException('Assistant does not belong to user');
    }

    const trimmedContent = dto.content.trim();

    return this.prisma.$transaction(async (tx) => {
      const doc = await tx.document.create({
        data: {
          title: dto.title.trim(),
          content: trimmedContent,
          type: dto.type,
          assistantId: dto.assistantId,
        },
        select: { id: true },
      });

      const chunkBodies = splitText(trimmedContent);
      if (chunkBodies.length > 0) {
        await tx.documentChunk.createMany({
          data: chunkBodies.map((content) => ({
            documentId: doc.id,
            content,
          })),
        });
      }

      return tx.document.findUniqueOrThrow({
        where: { id: doc.id },
        select: {
          ...documentPublic,
          _count: { select: { chunks: true } },
        },
      });
    });
  }

  async findAll(userId: string, assistantId: string) {
    const assistant = await this.prisma.assistant.findUnique({
      where: { id: assistantId },
      select: { id: true, userId: true },
    });
    if (!assistant) {
      throw new NotFoundException('Assistant not found');
    }
    if (assistant.userId !== userId) {
      throw new ForbiddenException('Assistant does not belong to user');
    }

    return this.prisma.document.findMany({
      where: { assistantId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
      select: documentPublic,
    });
  }

  async delete(userId: string, id: string) {
    const row = await this.prisma.document.findFirst({
      where: { id, deletedAt: null },
      select: { id: true, assistant: { select: { userId: true } } },
    });

    if (!row) {
      throw new NotFoundException('Document not found');
    }
    if (row.assistant.userId !== userId) {
      throw new ForbiddenException('Document does not belong to user');
    }

    await this.prisma.document.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
