const CHUNK_SEPARATOR = '\n\n';

/**
 * Greedily includes whole chunks until `MAX_CONTEXT_LENGTH` would be exceeded.
 */
export function buildContextWithinLimit(
  chunkContents: string[],
  maxLength: number,
): { context: string; chunksUsed: number } {
  const parts: string[] = [];
  let totalLen = 0;

  for (const raw of chunkContents) {
    const piece = raw.trim();
    if (!piece) {
      continue;
    }

    const addLen =
      parts.length === 0
        ? piece.length
        : totalLen + CHUNK_SEPARATOR.length + piece.length;

    if (addLen > maxLength) {
      if (parts.length === 0) {
        return {
          context: piece.slice(0, maxLength),
          chunksUsed: 1,
        };
      }
      break;
    }

    parts.push(piece);
    totalLen = addLen;
  }

  return {
    context: parts.join(CHUNK_SEPARATOR),
    chunksUsed: parts.length,
  };
}
