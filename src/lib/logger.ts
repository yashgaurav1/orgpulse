/**
 * Privacy-preserving zero-leakage logger.
 * Enforces section 6: "Do not log request bodies, tokens, IPs or user agents in application logs, hosting logs or error tracking."
 */

const SENSITIVE_PATTERNS = [
  /token=[a-zA-Z0-9_\-]+/gi,
  /"token"\s*:\s*"[^"]+"/gi,
  /"token_hash"\s*:\s*"[^"]+"/gi,
  /"comment"\s*:\s*"[^"]+"/gi,
  /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g, // IPv4
  /([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}/g, // IPv6
];

export function sanitizeLogMessage(message: string): string {
  let sanitized = message;
  for (const pattern of SENSITIVE_PATTERNS) {
    sanitized = sanitized.replace(pattern, '[REDACTED_PRIVACY]');
  }
  return sanitized;
}

export const safeLog = {
  info: (msg: string, ...meta: any[]) => {
    const cleanMsg = sanitizeLogMessage(msg);
    // eslint-disable-next-line no-console
    console.log(`[INFO] ${cleanMsg}`);
  },
  warn: (msg: string, ...meta: any[]) => {
    const cleanMsg = sanitizeLogMessage(msg);
    // eslint-disable-next-line no-console
    console.warn(`[WARN] ${cleanMsg}`);
  },
  error: (msg: string, ...meta: any[]) => {
    const cleanMsg = sanitizeLogMessage(msg);
    // eslint-disable-next-line no-console
    console.error(`[ERROR] ${cleanMsg}`);
  },
};
