import crypto from 'crypto';

/**
 * Generates a 32-byte cryptographically secure random token (256 bits of entropy)
 * and its SHA-256 hash.
 */
export function generateSurveyToken(): { rawToken: string; tokenHash: string } {
  const rawToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = hashSurveyToken(rawToken);
  return { rawToken, tokenHash };
}

/**
 * Computes the SHA-256 hash of a presented token.
 */
export function hashSurveyToken(rawToken: string): string {
  return crypto.createHash('sha256').update(rawToken.trim()).digest('hex');
}
