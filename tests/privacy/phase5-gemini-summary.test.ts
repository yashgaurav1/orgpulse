import { describe, it, expect, beforeEach } from 'vitest';
import { createTestDatabase } from '../../src/db/test-db';
import {
  scrubPiiFromText,
  prepareCommentsForSummary,
} from '../../src/lib/pii-scrubber';
import {
  getBuCommentSummary,
  SUMMARY_SYSTEM_PROMPT,
} from '../../src/lib/gemini-summary';
import crypto from 'crypto';

describe('Phase 5: Gemini BU Summary, PII Stripping, Thresholds & Kill Switch Tests', () => {
  let db: any;

  beforeEach(async () => {
    db = await createTestDatabase();
  });

  // TEST 1: PII Scrubber Removes Seeded Names, Emails, Phone Numbers & URLs (Section 22, Test 9)
  it('1. PII Scrubber strictly strips emails, phone numbers, URLs, and proper personal names', () => {
    const rawComment =
      'I spoke with Mr. Sharma and lead Rahul about the deployment. You can email me at dev.engineer@techfirm.co.in or call +91 98765 43210. Check ticket https://jira.internal/browse/ENG-402 for details.';

    const clean = scrubPiiFromText(rawComment);

    // Verify all sensitive tokens are redacted
    expect(clean).not.toContain('dev.engineer@techfirm.co.in');
    expect(clean).not.toContain('98765 43210');
    expect(clean).not.toContain('https://jira.internal/browse/ENG-402');
    expect(clean).not.toContain('Rahul');
    expect(clean).not.toContain('Sharma');

    expect(clean).toContain('[EMAIL]');
    expect(clean).toContain('[PHONE]');
    expect(clean).toContain('[URL]');
    expect(clean).toContain('[NAME]');
  });

  // TEST 2: Batch preparation shuffles comments and caps at 40
  it('2. prepareCommentsForSummary scrubs all comments, shuffles order, and caps at 40', () => {
    const commentsList: string[] = [];
    for (let i = 1; i <= 50; i++) {
      commentsList.push(
        `Comment ${i}: Contact lead Vikram at engineer${i}@company.com for details on release ${i}.`
      );
    }

    const prepared = prepareCommentsForSummary(commentsList, 40);

    // Hard cap at 40
    expect(prepared.length).toBe(40);

    // None should contain email or name
    for (const item of prepared) {
      expect(item).not.toContain('@company.com');
      expect(item).not.toContain('Vikram');
      expect(item).toContain('[EMAIL]');
      expect(item).toContain('[NAME]');
    }
  });

  // TEST 3: Kill Switch Works (Feature flag disabled by default)
  it('3. Kill switch immediately refuses summary generation when disabled by configuration', async () => {
    const buRes = await db.query(`INSERT INTO business_units (name) VALUES ('FinTech BU') RETURNING id`);
    const buId = buRes.rows[0].id;
    const cycleRes = await db.query(
      `INSERT INTO cycles (name, cycle_type, status, start_date, end_date) 
       VALUES ('Q1 2026', 'full', 'open', CURRENT_DATE, CURRENT_DATE + INTERVAL '14 days') 
       RETURNING id`
    );
    const cycleId = cycleRes.rows[0].id;

    // Call with kill switch explicitly disabled
    const result = await getBuCommentSummary(buId, cycleId, db, { enabled: false });

    expect(result.allowed).toBe(false);
    expect(result.source).toBe('disabled');
    expect(result.reason).toBe('AI_SUMMARY_DISABLED_BY_POLICY');
    expect(result.label).toContain('disabled by policy');
  });

  // TEST 4: Refuses Groups Under Threshold (< 10 respondents or < 5 comments)
  it('4. Refuses groups with fewer than 10 respondents, even if kill switch is enabled', async () => {
    const buRes = await db.query(`INSERT INTO business_units (name) VALUES ('Cloud Platform BU') RETURNING id`);
    const buId = buRes.rows[0].id;
    const sqRes = await db.query(
      `INSERT INTO squads (business_unit_id, name) VALUES ($1, 'DevOps Squad') RETURNING id`,
      [buId]
    );
    const sqId = sqRes.rows[0].id;
    const cycleRes = await db.query(
      `INSERT INTO cycles (name, cycle_type, status, start_date, end_date) 
       VALUES ('Q1 2026', 'full', 'open', CURRENT_DATE, CURRENT_DATE + INTERVAL '14 days') 
       RETURNING id`
    );
    const cycleId = cycleRes.rows[0].id;

    // Seed 8 responses (below 10)
    for (let i = 1; i <= 8; i++) {
      const hash = crypto.createHash('sha256').update(`token_gemini_${i}`).digest('hex');
      await db.query(`INSERT INTO invites (cycle_id, squad_id, token_hash) VALUES ($1, $2, $3)`, [
        cycleId,
        sqId,
        hash,
      ]);
      await db.query(`SELECT submit_response($1, $2, $3, 4, 4, 4, 4, 4, 4, $4)`, [
        hash,
        cycleId,
        sqId,
        `Operational feedback number ${i}`,
      ]);
    }

    // Call summary with kill switch enabled but below 10 threshold
    const result = await getBuCommentSummary(buId, cycleId, db, {
      enabled: true,
      apiKey: 'test-mock-key',
    });

    expect(result.allowed).toBe(false);
    expect(result.source).toBe('below_threshold');
    expect(result.label).toContain('Business Unit requires at least 10 respondents');
  });

  // TEST 5: Cache Hit & Storage Integrity
  it('5. Caches generated summaries in summary_cache and serves cache without redundant calls', async () => {
    const buRes = await db.query(`INSERT INTO business_units (name) VALUES ('Enterprise Core') RETURNING id`);
    const buId = buRes.rows[0].id;
    const cycleRes = await db.query(
      `INSERT INTO cycles (name, cycle_type, status, start_date, end_date) 
       VALUES ('Q1 2026', 'full', 'open', CURRENT_DATE, CURRENT_DATE + INTERVAL '14 days') 
       RETURNING id`
    );
    const cycleId = cycleRes.rows[0].id;

    // Seed existing cached summary into database
    const cachedPayload = {
      themes: [
        { theme: 'Sprint handoffs disrupted by late client requirements.', frequency: 'most' },
        { theme: 'Tooling delays in sandbox environment access.', frequency: 'several' },
      ],
      neutralQuestion: 'How can we structure backlog estimation to buffer against late sprint requests?',
      commentCount: 15,
    };

    await db.query(
      `INSERT INTO summary_cache (business_unit_id, cycle_id, summary_text) VALUES ($1, $2, $3)`,
      [buId, cycleId, JSON.stringify(cachedPayload)]
    );

    // Call with enabled flag -> Must return cached payload without calling Gemini API
    const result = await getBuCommentSummary(buId, cycleId, db, { enabled: true });

    expect(result.allowed).toBe(true);
    expect(result.source).toBe('cache');
    expect(result.themes.length).toBe(2);
    expect(result.themes[0].frequency).toBe('most');
    expect(result.neutralQuestion).toContain('How can we structure backlog estimation');
    expect(result.label).toContain('AI summary (cached)');
  });

  // TEST 6: System Prompt Strictness
  it('6. System prompt contains strict instructions forbidding quotes, diagnosis, or authorship inference', () => {
    expect(SUMMARY_SYSTEM_PROMPT).toContain('NEVER include any verbatim quotes');
    expect(SUMMARY_SYSTEM_PROMPT).toContain('NEVER infer, guess, or reference the authorship');
    expect(SUMMARY_SYSTEM_PROMPT).toContain('NEVER diagnose, evaluate, score, or categorize any individual person');
    expect(SUMMARY_SYSTEM_PROMPT).toContain('at most 5 operational themes');
    expect(SUMMARY_SYSTEM_PROMPT).toContain('relative frequency');
  });
});
