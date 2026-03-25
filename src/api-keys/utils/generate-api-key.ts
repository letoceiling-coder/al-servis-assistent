import { randomBytes } from 'crypto';

const PREFIX = 'sk_live_';

/** Public API key format: sk_live_<random> (random from 32 bytes, hex). */
export function generateApiKey(): string {
  return `${PREFIX}${randomBytes(32).toString('hex')}`;
}
