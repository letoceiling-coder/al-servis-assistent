import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { generateApiKey } from './utils/generate-api-key';

const apiKeyListSelect = {
  id: true,
  name: true,
  assistantId: true,
  createdAt: true,
} as const;

@Injectable()
export class ApiKeysService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, assistantId: string, name: string) {
    const assistant = await this.prisma.assistant.findFirst({
      where: { id: assistantId, userId },
      select: { id: true },
    });
    if (!assistant) {
      throw new NotFoundException('Assistant not found');
    }

    const rawKey = generateApiKey();
    const keyHash = await bcrypt.hash(rawKey, 10);

    const row = await this.prisma.apiKey.create({
      data: {
        name: name.trim(),
        keyHash,
        assistantId,
      },
      select: apiKeyListSelect,
    });

    return { ...row, key: rawKey };
  }

  findAll(userId: string) {
    return this.prisma.apiKey.findMany({
      where: { assistant: { userId } },
      orderBy: { createdAt: 'desc' },
      select: apiKeyListSelect,
    });
  }

  async delete(userId: string, id: string) {
    const row = await this.prisma.apiKey.findFirst({
      where: { id, assistant: { userId } },
      select: { id: true },
    });
    if (!row) {
      throw new NotFoundException('API key not found');
    }
    await this.prisma.apiKey.delete({ where: { id } });
  }

  /**
   * Validates a raw API key. Loads all key hashes and bcrypt-compares
   * (intended for modest key counts; replace with keyed lookup if needed).
   */
  async validateKey(rawKey: string): Promise<string | null> {
    const trimmed = rawKey?.trim();
    if (!trimmed || !trimmed.startsWith('sk_live_')) {
      return null;
    }

    const keys = await this.prisma.apiKey.findMany({
      select: { keyHash: true, assistantId: true },
    });

    for (const row of keys) {
      const ok = await bcrypt.compare(trimmed, row.keyHash);
      if (ok) {
        return row.assistantId;
      }
    }

    return null;
  }
}
