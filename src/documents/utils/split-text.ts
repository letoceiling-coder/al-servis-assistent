/** Target chunk size for RAG / embedding prep (~500–1000 chars). */
const CHUNK_MIN = 500;
const CHUNK_MAX = 1000;

/**
 * Splits text into non-empty chunks by paragraphs and sentence boundaries,
 * keeping each chunk roughly between CHUNK_MIN and CHUNK_MAX when possible.
 */
export function splitText(text: string): string[] {
  const normalized = text.replace(/\r\n/g, '\n').trim();
  if (!normalized) {
    return [];
  }

  const paragraphs = normalized
    .split(/\n\s*\n+/)
    .map((p) => p.replace(/\s+/g, ' ').trim())
    .filter(Boolean);

  const pieces: string[] = [];
  for (const para of paragraphs) {
    for (const piece of splitParagraph(para)) {
      if (piece.length > 0) {
        pieces.push(piece);
      }
    }
  }

  return greedyMerge(pieces);
}

function splitParagraph(para: string): string[] {
  const sentences = para
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

  if (sentences.length === 0) {
    return [];
  }

  const out: string[] = [];
  for (const s of sentences) {
    if (s.length <= CHUNK_MAX) {
      out.push(s);
    } else {
      out.push(...hardSplitLongSegment(s));
    }
  }
  return out;
}

function hardSplitLongSegment(segment: string): string[] {
  const out: string[] = [];
  let i = 0;
  while (i < segment.length) {
    let end = Math.min(i + CHUNK_MAX, segment.length);
    if (end < segment.length) {
      const slice = segment.slice(i, end);
      const lastSpace = slice.lastIndexOf(' ');
      if (lastSpace > CHUNK_MIN) {
        end = i + lastSpace;
      }
    }
    const piece = segment.slice(i, end).trim();
    if (piece) {
      out.push(piece);
    }
    i = end;
    while (i < segment.length && segment[i] === ' ') {
      i++;
    }
  }
  return out;
}

function greedyMerge(pieces: string[]): string[] {
  if (pieces.length === 0) {
    return [];
  }

  const chunks: string[] = [];
  let current: string[] = [];
  let currentLen = 0;

  const flush = () => {
    if (current.length === 0) {
      return;
    }
    chunks.push(current.join(' ').trim());
    current = [];
    currentLen = 0;
  };

  for (const p of pieces) {
    const needSpace = currentLen > 0 ? 1 : 0;
    const nextLen = currentLen + needSpace + p.length;

    if (nextLen > CHUNK_MAX && currentLen > 0) {
      flush();
    }

    const spaceAfter = current.length > 0 ? 1 : 0;
    current.push(p);
    currentLen += spaceAfter + p.length;

    if (currentLen >= CHUNK_MIN) {
      flush();
    }
  }

  flush();
  return chunks.filter((c) => c.length > 0);
}
