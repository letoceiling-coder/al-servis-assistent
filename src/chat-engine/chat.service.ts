import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ApiKeysService } from '../api-keys/api-keys.service';
import { buildContextWithinLimit } from './utils/build-context';
import { buildPrompt } from './utils/build-prompt';

/** Max chunks to fetch before trimming by byte/char budget. */
const CONTEXT_CHUNK_FETCH_LIMIT = 50;

/** Max characters included in the RAG context window. */
const MAX_CONTEXT_LENGTH = 8000;

@Injectable()
export class ChatService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly apiKeysService: ApiKeysService,
  ) {}

  async chat(authorizationHeader: string | undefined, message: string) {
    const rawKey = this.parseBearerKey(authorizationHeader);
    const assistantId = await this.apiKeysService.validateKey(rawKey);
    if (!assistantId) {
      throw new UnauthorizedException('Invalid API key');
    }

    const userMessage = message.trim();
    if (userMessage.length < 2) {
      throw new BadRequestException('Message must be at least 2 characters');
    }

    const assistant = await this.prisma.assistant.findUnique({
      where: { id: assistantId },
      select: { id: true, systemPrompt: true },
    });
    if (!assistant) {
      throw new UnauthorizedException('Assistant not found');
    }

    const rows = await this.prisma.documentChunk.findMany({
      where: {
        document: {
          assistantId,
          deletedAt: null,
        },
      },
      take: CONTEXT_CHUNK_FETCH_LIMIT,
      orderBy: { createdAt: 'asc' },
      select: { content: true },
    });

    const chunkContents = rows.map((r) => r.content);
    const { context, chunksUsed } = buildContextWithinLimit(
      chunkContents,
      MAX_CONTEXT_LENGTH,
    );

    console.log({
      assistantId,
      messageLength: userMessage.length,
      chunksUsed,
    });

    const prompt = buildPrompt(assistant.systemPrompt, context, userMessage);
    void prompt;

    const answer = 'Mock AI response based on context';

    return { answer, assistantId };
  }

  private parseBearerKey(header: string | undefined): string {
    if (!header || typeof header !== 'string') {
      throw new UnauthorizedException('Missing Authorization header');
    }
    const match = header.match(/^Bearer\s+(.+)$/i);
    if (!match?.[1]) {
      throw new UnauthorizedException('Invalid Authorization header');
    }
    return match[1].trim();
  }
}
