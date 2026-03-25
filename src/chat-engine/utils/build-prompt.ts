export function buildPrompt(
  systemPrompt: string,
  context: string,
  message: string,
): string {
  const sys = systemPrompt.trim();
  const ctx = context.trim();
  const msg = message.trim();

  return `
${sys}

Context:
${ctx}

User:
${msg}

Answer:
`;
}
