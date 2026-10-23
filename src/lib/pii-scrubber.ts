/**
 * High-rigor PII Scrubber for Pulse Freeform Comments.
 * Strips emails, phone numbers, URLs, and capitalized proper nouns / name patterns
 * before comments are ever transmitted to an external LLM.
 */

// Regular expressions for sensitive entities
const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi;

// Indian and international phone numbers (e.g. +91 98765 43210, +91-9876543210, 9876543210, (555) 123-4567)
const PHONE_REGEX = /(\+?\d{1,3}[\s-]?)?\(?\d{2,5}\)?[\s-]?\d{3,5}[\s-]?\d{3,5}\b/g;

// URLs and links
const URL_REGEX = /https?:\/\/[^\s]+|www\.[^\s]+|[a-zA-Z0-9.-]+\.(com|org|net|in|io|co|dev)[^\s]*/gi;

// Salutations and name honorifics followed by capitalized words
const HONORIFIC_NAME_REGEX = /\b(Mr\.|Mrs\.|Ms\.|Dr\.|Prof\.|Lead|Manager)\s+[A-Z][a-z]+/g;

// Common Indian and international names and proper noun patterns
// Captures standalone capitalized tokens that look like personal names
// (excluding beginning of sentence words if reasonable, but scrubbing any mid-sentence capitalized word)
const PROPER_NAME_REGEX = /(?<=\s)[A-Z][a-z]{2,}(?=\s|[.,!?]|$)/g;

export function scrubPiiFromText(rawText: string): string {
  if (!rawText || typeof rawText !== 'string') return '';

  let scrubbed = rawText;

  // 1. Strip Email Addresses
  scrubbed = scrubbed.replace(EMAIL_REGEX, '[EMAIL]');

  // 2. Strip Phone Numbers
  scrubbed = scrubbed.replace(PHONE_REGEX, '[PHONE]');

  // 3. Strip URLs
  scrubbed = scrubbed.replace(URL_REGEX, '[URL]');

  // 4. Strip Honorific + Name (e.g., "Mr. Sharma", "Lead Rahul")
  scrubbed = scrubbed.replace(HONORIFIC_NAME_REGEX, '[NAME]');

  // 5. Strip Proper Name patterns mid-sentence
  scrubbed = scrubbed.replace(PROPER_NAME_REGEX, (match) => {
    // Preserve common non-name acronyms or common technical words if needed, otherwise redact
    const lower = match.toLowerCase();
    const commonExceptions = ['monday', 'friday', 'weekend', 'sprint', 'jira', 'github', 'aws', 'posh'];
    if (commonExceptions.includes(lower)) {
      return match;
    }
    return '[NAME]';
  });

  return scrubbed.trim();
}

/**
 * Shuffles an array of strings in-place using Fisher-Yates algorithm
 * to break any sequential correlation before sending to AI.
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Sanitizes and prepares a batch of comments for Gemini summary:
 * - Scrubs PII (emails, phones, URLs, names)
 * - Shuffles order
 * - Caps at maximum 40 comments
 */
export function prepareCommentsForSummary(comments: string[], maxLimit = 40): string[] {
  const validComments = comments
    .filter((c) => c && typeof c === 'string' && c.trim().length > 0)
    .map((c) => scrubPiiFromText(c));

  const shuffled = shuffleArray(validComments);
  return shuffled.slice(0, maxLimit);
}
