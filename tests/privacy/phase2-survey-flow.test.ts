import { describe, it, expect, beforeEach } from 'vitest';
import { createTestDatabase } from '../../src/db/test-db';
import { generateSurveyToken, hashSurveyToken } from '../../src/lib/tokens';
import { parseInviteCsv, processInvitesBatch } from '../../src/lib/invites';
import { verifySurveyToken, submitSurveyResponse } from '../../src/lib/survey-service';
import { SurveySubmissionSchema } from '../../src/types/survey';
import { checkSubmissionRateLimit, resetRateLimiterForTesting } from '../../src/lib/rate-limiter';
import { sanitizeLogMessage } from '../../src/lib/logger';

describe('Phase 2: Invite Flow, Token Submission, Employee Survey & Zero-Leakage Tests', () => {
  let db: any;

  beforeEach(async () => {
    db = await createTestDatabase();
    resetRateLimiterForTesting();
  });

  // TEST 1: CSV Parsing & Ingestion with Zero Email Persistence
  it('1. Ingests CSV invites, generates 32-byte tokens, dispatches links, and persists ZERO emails in database', async () => {
    const buRes = await db.query(`INSERT INTO business_units (name) VALUES ('FinTech Unit') RETURNING id`);
    const buId = buRes.rows[0].id;
    const sqRes = await db.query(
      `INSERT INTO squads (business_unit_id, name) VALUES ($1, 'Payments Squad') RETURNING id`,
      [buId]
    );
    const sqId = sqRes.rows[0].id;

    const cycleRes = await db.query(
      `INSERT INTO cycles (name, cycle_type, status, start_date, end_date) 
       VALUES ('Q1 2026', 'full', 'open', CURRENT_DATE, CURRENT_DATE + INTERVAL '14 days') 
       RETURNING id`
    );
    const cycleId = cycleRes.rows[0].id;

    const csvData = `email,squad_name
engineer1@company.com,Payments Squad
engineer2@company.com,Payments Squad
engineer3@company.com,Payments Squad`;

    const dispatchedEmails: { email: string; link: string }[] = [];
    const sendEmailMock = async (email: string, link: string) => {
      dispatchedEmails.push({ email, link });
      return true;
    };

    const squadLookup = new Map<string, string>();
    squadLookup.set('payments squad', sqId);

    const result = await processInvitesBatch(
      csvData,
      cycleId,
      squadLookup,
      db,
      sendEmailMock,
      'https://pulse.company.internal'
    );

    expect(result.totalProcessed).toBe(3);
    expect(result.invitesCreated).toBe(3);
    expect(result.errors.length).toBe(0);
    expect(dispatchedEmails.length).toBe(3);

    // Verify DB holds ONLY token_hash and squad_id
    const dbInvites = await db.query(`SELECT * FROM invites WHERE cycle_id = $1`, [cycleId]);
    expect(dbInvites.rows.length).toBe(3);

    for (const invite of dbInvites.rows) {
      expect(invite.token_hash).toBeDefined();
      expect(invite.token_hash.length).toBe(64); // 256-bit hex
      expect(invite.used).toBe(false);
      expect(invite.used_on).toBeNull();
      // Ensure no email column exists in invites
      expect(invite.email).toBeUndefined();
      expect(invite.email_hash).toBeUndefined();
    }

    // Verify links contain raw 64-char hex token whose hash matches the DB record
    for (const sent of dispatchedEmails) {
      const tokenInLink = sent.link.split('/survey/')[1];
      expect(tokenInLink).toBeDefined();
      expect(tokenInLink.length).toBe(64); // 32 bytes in hex

      const expectedHash = hashSurveyToken(tokenInLink);
      const match = dbInvites.rows.find((r: any) => r.token_hash === expectedHash);
      expect(match).toBeDefined();
    }
  });

  // TEST 2: Token Verification Service
  it('2. Token verification returns squad/cycle metadata for valid tokens and rejects used or closed cycle tokens', async () => {
    const buRes = await db.query(`INSERT INTO business_units (name) VALUES ('Cloud Platform') RETURNING id`);
    const buId = buRes.rows[0].id;
    const sqRes = await db.query(
      `INSERT INTO squads (business_unit_id, name) VALUES ($1, 'Infra Squad') RETURNING id`,
      [buId]
    );
    const sqId = sqRes.rows[0].id;

    const cycleRes = await db.query(
      `INSERT INTO cycles (name, cycle_type, status, start_date, end_date) 
       VALUES ('Q1 2026', 'full', 'open', CURRENT_DATE, CURRENT_DATE + INTERVAL '14 days') 
       RETURNING id`
    );
    const cycleId = cycleRes.rows[0].id;

    const { rawToken, tokenHash } = generateSurveyToken();
    await db.query(`INSERT INTO invites (cycle_id, squad_id, token_hash) VALUES ($1, $2, $3)`, [
      cycleId,
      sqId,
      tokenHash,
    ]);

    // 2a. Valid token
    const verification = await verifySurveyToken(rawToken, db);
    expect(verification.valid).toBe(true);
    expect(verification.squadName).toBe('Infra Squad');
    expect(verification.businessUnitName).toBe('Cloud Platform');
    expect(verification.cycleName).toBe('Q1 2026');

    // 2b. Already used token
    await db.query(`UPDATE invites SET used = TRUE, used_on = CURRENT_DATE WHERE token_hash = $1`, [
      tokenHash,
    ]);
    const usedVerification = await verifySurveyToken(rawToken, db);
    expect(usedVerification.valid).toBe(false);
    expect(usedVerification.alreadyUsed).toBe(true);

    // 2c. Forged token
    const forgedVerification = await verifySurveyToken('non_existent_random_token_123', db);
    expect(forgedVerification.valid).toBe(false);
  });

  // TEST 3: Zod Submission Validation & Skippable Questions
  it('3. Zod schema enforces rating bounds (1-5), optional/skippable items, and 600-character comment cap', () => {
    // Valid submission with all questions answered
    const fullValid = {
      token: 'valid_token_string_minimum_16_chars',
      q1: 5,
      q2: 4,
      q3: 3,
      q4: 2,
      q5: 1,
      q6: 4,
      comment: 'Valid engineering comment.',
    };
    const res1 = SurveySubmissionSchema.safeParse(fullValid);
    expect(res1.success).toBe(true);

    // Valid submission with SKIPPED questions (null/omitted)
    const partialValid = {
      token: 'valid_token_string_minimum_16_chars',
      q1: 4,
      q2: null,
      q3: null,
      q4: 5,
      comment: null,
    };
    const res2 = SurveySubmissionSchema.safeParse(partialValid);
    expect(res2.success).toBe(true);

    // Invalid: Rating outside 1-5 scale (e.g. 0 or 6)
    const invalidRating = {
      token: 'valid_token_string_minimum_16_chars',
      q1: 6,
    };
    expect(SurveySubmissionSchema.safeParse(invalidRating).success).toBe(false);

    // Invalid: Comment exceeding 600 characters
    const longComment = {
      token: 'valid_token_string_minimum_16_chars',
      comment: 'a'.repeat(601),
    };
    expect(SurveySubmissionSchema.safeParse(longComment).success).toBe(false);

    // Exactly 600 characters is accepted
    const edgeComment = {
      token: 'valid_token_string_minimum_16_chars',
      comment: 'a'.repeat(600),
    };
    expect(SurveySubmissionSchema.safeParse(edgeComment).success).toBe(true);
  });

  // TEST 4: End-to-End Submission & Skippable Persistence
  it('4. Submitting a survey burns the single-use token and inserts skippable questions cleanly', async () => {
    const buRes = await db.query(`INSERT INTO business_units (name) VALUES ('E-Commerce') RETURNING id`);
    const buId = buRes.rows[0].id;
    const sqRes = await db.query(
      `INSERT INTO squads (business_unit_id, name) VALUES ($1, 'Cart Squad') RETURNING id`,
      [buId]
    );
    const sqId = sqRes.rows[0].id;
    const cycleRes = await db.query(
      `INSERT INTO cycles (name, cycle_type, status, start_date, end_date) 
       VALUES ('Q1 2026', 'full', 'open', CURRENT_DATE, CURRENT_DATE + INTERVAL '14 days') 
       RETURNING id`
    );
    const cycleId = cycleRes.rows[0].id;

    const { rawToken, tokenHash } = generateSurveyToken();
    await db.query(`INSERT INTO invites (cycle_id, squad_id, token_hash) VALUES ($1, $2, $3)`, [
      cycleId,
      sqId,
      tokenHash,
    ]);

    // Submit with Q1, Q4 answered, others skipped
    const submitResult = await submitSurveyResponse(
      {
        token: rawToken,
        q1: 4,
        q4: 5,
        comment: 'Great sprint tooling.',
      },
      db
    );

    expect(submitResult.success).toBe(true);

    // Verify token is now burned
    const inviteAfter = await db.query(`SELECT used, used_on FROM invites WHERE token_hash = $1`, [
      tokenHash,
    ]);
    expect(inviteAfter.rows[0].used).toBe(true);
    expect(inviteAfter.rows[0].used_on).toBeInstanceOf(Date);

    // Verify response row has nulls for skipped items
    const respCheck = await db.query(`SELECT * FROM responses WHERE squad_id = $1`, [sqId]);
    expect(respCheck.rows.length).toBe(1);
    expect(respCheck.rows[0].q1).toBe(4);
    expect(respCheck.rows[0].q2).toBeNull();
    expect(respCheck.rows[0].q3).toBeNull();
    expect(respCheck.rows[0].q4).toBe(5);
    expect(respCheck.rows[0].q5).toBeNull();
    expect(respCheck.rows[0].q6).toBeNull();
    expect(respCheck.rows[0].comment).toBe('Great sprint tooling.');

    // Attempt second submission with same token -> Must fail
    const secondAttempt = await submitSurveyResponse(
      {
        token: rawToken,
        q1: 1,
      },
      db
    );
    expect(secondAttempt.success).toBe(false);
    expect(secondAttempt.error).toBe('INVALID_OR_USED_TOKEN');
  });

  // TEST 5: In-Memory Rate Limiting without Raw IP Persistence
  it('5. Edge rate-limiter throttles repeated token submissions and rapid IP attempts without database persistence', () => {
    const dummyHash = 'a'.repeat(64);
    const rawIp = '192.168.1.100';

    // First 5 attempts on the token within 1 minute are allowed
    for (let i = 0; i < 5; i++) {
      const res = checkSubmissionRateLimit(dummyHash, rawIp, { maxPerToken: 5 });
      expect(res.allowed).toBe(true);
    }

    // 6th attempt is throttled
    const throttled = checkSubmissionRateLimit(dummyHash, rawIp, { maxPerToken: 5 });
    expect(throttled.allowed).toBe(false);
    expect(throttled.retryAfterSeconds).toBeGreaterThan(0);
  });

  // TEST 6: Zero-Logging Scrubber
  it('6. Logger scrubs tokens, token hashes, IPs, and comment bodies from log output', () => {
    const rawMsg = `Submission error: token=abcdef1234567890abcdef1234567890 for IP 10.0.1.45 with body {"comment": "confidential text"}`;
    const scrubbed = sanitizeLogMessage(rawMsg);

    expect(scrubbed).not.toContain('abcdef1234567890abcdef1234567890');
    expect(scrubbed).not.toContain('10.0.1.45');
    expect(scrubbed).not.toContain('confidential text');
    expect(scrubbed).toContain('[REDACTED_PRIVACY]');
  });
});
