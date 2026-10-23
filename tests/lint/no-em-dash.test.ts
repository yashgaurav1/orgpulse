import { describe, it, expect } from 'vitest';
import { scanRepository } from '../../scripts/check-no-em-dash';

describe('Zero Em Dash Regression Invariant', () => {
  it('enforces that U+2014, &mdash;, &#8212;, and \\u2014 do not appear in source, content, seed, or docs', () => {
    const violations = scanRepository();

    if (violations.length > 0) {
      const summary = violations
        .map((v) => `  ${v.file}:${v.line}:${v.col} [${v.tokenName}]: ${v.snippet}`)
        .join('\n');
      expect.fail(`Found ${violations.length} forbidden em dash occurrences in the repository:\n${summary}`);
    }

    expect(violations.length).toBe(0);
  });
});
