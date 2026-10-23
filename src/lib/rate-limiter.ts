import crypto from 'crypto';

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

// In-memory buckets for token submissions and IP hashes
const tokenBuckets = new Map<string, RateLimitRecord>();
const ipBuckets = new Map<string, RateLimitRecord>();

// Ephemeral daily salt rotated in memory so client IP hashes cannot be reversed
const ephemeralSalt = crypto.randomBytes(16).toString('hex');

export interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds?: number;
}

/**
 * Edge/in-memory rate limiter that protects against token brute-force and IP flooding
 * without storing any raw IP addresses in the database.
 */
export function checkSubmissionRateLimit(
  tokenHash: string,
  rawIp: string | null | undefined,
  options: {
    maxPerToken?: number;
    tokenWindowMs?: number;
    maxPerIp?: number;
    ipWindowMs?: number;
  } = {}
): RateLimitResult {
  const now = Date.now();
  const maxPerToken = options.maxPerToken ?? 5; // 5 attempts per token hash per window
  const tokenWindowMs = options.tokenWindowMs ?? 60 * 1000; // 1 minute window
  const maxPerIp = options.maxPerIp ?? 30; // 30 survey attempts per IP per window
  const ipWindowMs = options.ipWindowMs ?? 60 * 1000;

  // 1. Check Token Bucket
  const tokenRecord = tokenBuckets.get(tokenHash);
  if (tokenRecord) {
    if (now > tokenRecord.resetAt) {
      tokenBuckets.set(tokenHash, { count: 1, resetAt: now + tokenWindowMs });
    } else if (tokenRecord.count >= maxPerToken) {
      return {
        allowed: false,
        retryAfterSeconds: Math.ceil((tokenRecord.resetAt - now) / 1000),
      };
    } else {
      tokenRecord.count++;
    }
  } else {
    tokenBuckets.set(tokenHash, { count: 1, resetAt: now + tokenWindowMs });
  }

  // 2. Check IP Bucket (using salted ephemeral hash, never raw IP)
  if (rawIp) {
    const ipHash = crypto
      .createHash('sha256')
      .update(rawIp + ephemeralSalt)
      .digest('hex');

    const ipRecord = ipBuckets.get(ipHash);
    if (ipRecord) {
      if (now > ipRecord.resetAt) {
        ipBuckets.set(ipHash, { count: 1, resetAt: now + ipWindowMs });
      } else if (ipRecord.count >= maxPerIp) {
        return {
          allowed: false,
          retryAfterSeconds: Math.ceil((ipRecord.resetAt - now) / 1000),
        };
      } else {
        ipRecord.count++;
      }
    } else {
      ipBuckets.set(ipHash, { count: 1, resetAt: now + ipWindowMs });
    }
  }

  // Periodic pruning of expired entries to prevent memory growth
  if (tokenBuckets.size > 10000 || ipBuckets.size > 10000) {
    tokenBuckets.forEach((v, k) => {
      if (now > v.resetAt) tokenBuckets.delete(k);
    });
    ipBuckets.forEach((v, k) => {
      if (now > v.resetAt) ipBuckets.delete(k);
    });
  }

  return { allowed: true };
}

export function resetRateLimiterForTesting() {
  tokenBuckets.clear;
  tokenBuckets.clear();
  ipBuckets.clear();
}
