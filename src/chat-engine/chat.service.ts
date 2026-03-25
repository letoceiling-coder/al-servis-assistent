import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ApiKeysService } from '../api-keys/api-keys.service';

/** Max chunks to include in context (RAG MVP; between 20–50). */
const CONTEXT_CHUNK_LIMIT = 40;

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

    const assistant = await this.prisma.assistant.findUnique({
      where: { id: assistantId },
      select: { id: true },
    });
    if (!assistant) {
      throw new UnauthorizedException('Assistant not found');
    }

    const chunks = await this.prisma.documentChunk.findMany({
      where: {
        document: {
          assistantId,
          deletedAt: null,
        },
      },
      take: CONTEXT_CHUNK_LIMIT,
      orderBy: { createdAt: 'asc' },
      select: { content: true },
    });

    const context = chunks.map((c) => c.content).join('\n\n');
    const userMessage = message.trim();

    const prompt = `
You are AI assistant.

Context:
${context}

User:
${userMessage}

Answer:
`;

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
