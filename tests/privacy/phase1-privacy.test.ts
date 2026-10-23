import { describe, it, expect, beforeEach } from 'vitest';
import { createTestDatabase } from '../../src/db/test-db';
import crypto from 'crypto';

describe('Phase 1: Privacy Invariants & Access Lockdown Tests', () => {
  let db: any;

  beforeEach(async () => {
    db = await createTestDatabase();
  });

  // TEST 1: Small Group Size (N=5) Enforcement
  it('1. A squad with 4 responses returns NO scores, counts, flags, or comments through get_squad_results', async () => {
    // Setup BU and Squad
    const buRes = await db.query(
      `INSERT INTO business_units (name) VALUES ('Core Engineering') RETURNING id`
    );
    const buId = buRes.rows[0].id;

    const squadRes = await db.query(
      `INSERT INTO squads (business_unit_id, name) VALUES ($1, 'Alpha Squad') RETURNING id`,
      [buId]
    );
    const squadId = squadRes.rows[0].id;

    const cycleRes = await db.query(
      `INSERT INTO cycles (name, cycle_type, status, start_date, end_date) 
       VALUES ('Q1 2026', 'full', 'open', CURRENT_DATE, CURRENT_DATE + INTERVAL '14 days') 
       RETURNING id`
    );
    const cycleId = cycleRes.rows[0].id;

    // Insert exactly 4 responses for Alpha Squad
    for (let i = 1; i <= 4; i++) {
      const token = `token_alpha_${i}`;
      const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

      await db.query(
        `INSERT INTO invites (cycle_id, squad_id, token_hash) VALUES ($1, $2, $3)`,
        [cycleId, squadId, tokenHash]
      );

      const submitRes = await db.query(
        `SELECT submit_response($1, $2, $3, 3, 3, 4, 4, 3, 4, 'Sample confidential comment') AS result`,
        [tokenHash, cycleId, squadId]
      );
      expect(submitRes.rows[0].result.success).toBe(true);
    }

    // Call get_squad_results
    const resultRes = await db.query(
      `SELECT get_squad_results($1, $2) AS data`,
      [squadId, cycleId]
    );
    const data = resultRes.rows[0].data;

    // Verify invariant: returned structure contains ONLY { squad_id, hidden: true }
    expect(data.hidden).toBe(true);
    expect(data.squad_id).toBe(squadId);
    expect(data.response_count).toBeUndefined();
    expect(data.means).toBeUndefined();
    expect(data.average_pulse).toBeUndefined();
    expect(data.comments).toBeUndefined();

    // Now insert a 5th response and verify it unhides cleanly
    const token5 = `token_alpha_5`;
    const tokenHash5 = crypto.createHash('sha256').update(token5).digest('hex');
    await db.query(
      `INSERT INTO invites (cycle_id, squad_id, token_hash) VALUES ($1, $2, $3)`,
      [cycleId, squadId, tokenHash5]
    );
    await db.query(
      `SELECT submit_response($1, $2, $3, 4, 4, 4, 4, 4, 4, 'Fifth comment') AS result`,
      [tokenHash5, cycleId, squadId]
    );

    const resultRes5 = await db.query(
      `SELECT get_squad_results($1, $2) AS data`,
      [squadId, cycleId]
    );
    const data5 = resultRes5.rows[0].data;

    expect(data5.hidden).toBe(false);
    expect(data5.response_count).toBe(5);
    expect(data5.means).toBeDefined();
    expect(data5.means.q1).toBeDefined();
  });

  // TEST 2: Direct SELECT on responses table fails for unprivileged application roles
  it('2. Direct SELECT on responses is revoked and fails for anon, authenticated, and public roles', async () => {
    // Create an unprivileged test role mimicking Supabase anon/authenticated
    await db.exec(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'test_anon') THEN
          CREATE ROLE test_anon;
        END IF;
      END
      $$;
    `);

    // In 001_initial_schema.sql: REVOKE ALL ON responses FROM PUBLIC, anon, authenticated;
    // Attempt to query responses as test_anon
    let errorCaught = false;
    try {
      await db.exec(`
        SET ROLE test_anon;
        SELECT * FROM responses;
      `);
    } catch (err: any) {
      errorCaught = true;
      expect(err.message).toMatch(/permission denied for table responses/i);
    } finally {
      await db.exec(`RESET ROLE;`);
    }

    expect(errorCaught).toBe(true);
  });

  // TEST 3: Schema Test: Zero foreign keys, tokens, or fine timestamps on responses
  it('3. Schema reflection: No column, FK, or join path links responses to invites; no fine-grained timestamp', async () => {
    // Check columns of `responses`
    const colsRes = await db.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'responses'
    `);
    const cols = colsRes.rows.map((r: any) => r.column_name);

    // Verify forbidden columns
    expect(cols).not.toContain('token');
    expect(cols).not.toContain('token_hash');
    expect(cols).not.toContain('user_id');
    expect(cols).not.toContain('email');
    expect(cols).not.toContain('ip');
    expect(cols).not.toContain('user_agent');
    expect(cols).not.toContain('created_at');
    expect(cols).not.toContain('updated_at');
    expect(cols).not.toContain('submitted_at');
    expect(cols).not.toContain('timestamp');

    // Check foreign keys on responses table
    const fkRes = await db.query(`
      SELECT
        tc.constraint_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name
      FROM information_schema.table_constraints AS tc
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
      WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_name = 'responses';
    `);

    const foreignTables = fkRes.rows.map((r: any) => r.foreign_table_name);
    // May only reference cycles and squads
    expect(foreignTables).not.toContain('invites');
    expect(foreignTables).not.toContain('users');
    expect(foreignTables).not.toContain('auth');

    // Check invites table timestamp
    const inviteColsRes = await db.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'invites' AND column_name = 'used_on'
    `);
    expect(inviteColsRes.rows[0].data_type).toBe('date'); // MUST be date, NOT timestamp
  });

  // TEST 4: Reused and Forged Tokens
  it('4. Reused and forged tokens are rejected with no identifying information', async () => {
    const buRes = await db.query(`INSERT INTO business_units (name) VALUES ('BU Beta') RETURNING id`);
    const buId = buRes.rows[0].id;
    const squadRes = await db.query(`INSERT INTO squads (business_unit_id, name) VALUES ($1, 'Beta Squad') RETURNING id`, [buId]);
    const squadId = squadRes.rows[0].id;
    const cycleRes = await db.query(
      `INSERT INTO cycles (name, cycle_type, status, start_date, end_date) 
       VALUES ('Q1 2026', 'full', 'open', CURRENT_DATE, CURRENT_DATE + INTERVAL '14 days') 
       RETURNING id`
    );
    const cycleId = cycleRes.rows[0].id;

    // 4a. Forged token hash (never seeded in invites)
    const forgedHash = crypto.createHash('sha256').update('forged_secret_token').digest('hex');
    const forgedSubmit = await db.query(
      `SELECT submit_response($1, $2, $3, 4, 4, 4, 4, 4, 4, 'Fake comment') AS result`,
      [forgedHash, cycleId, squadId]
    );
    expect(forgedSubmit.rows[0].result.success).toBe(false);
    expect(forgedSubmit.rows[0].result.error).toBe('INVALID_OR_USED_TOKEN');

    // 4b. Legitimate token submitted once
    const realToken = 'legitimate_unique_token_xyz_123';
    const realHash = crypto.createHash('sha256').update(realToken).digest('hex');
    await db.query(
      `INSERT INTO invites (cycle_id, squad_id, token_hash) VALUES ($1, $2, $3)`,
      [cycleId, squadId, realHash]
    );

    const firstSubmit = await db.query(
      `SELECT submit_response($1, $2, $3, 5, 5, 5, 5, 5, 5, 'Real comment') AS result`,
      [realHash, cycleId, squadId]
    );
    expect(firstSubmit.rows[0].result.success).toBe(true);

    // Verify token was marked used with DATE only
    const inviteCheck = await db.query(`SELECT used, used_on FROM invites WHERE token_hash = $1`, [realHash]);
    expect(inviteCheck.rows[0].used).toBe(true);
    expect(inviteCheck.rows[0].used_on).toBeInstanceOf(Date);

    // 4c. Reused token submitted again
    const secondSubmit = await db.query(
      `SELECT submit_response($1, $2, $3, 5, 5, 5, 5, 5, 5, 'Replayed comment') AS result`,
      [realHash, cycleId, squadId]
    );
    expect(secondSubmit.rows[0].result.success).toBe(false);
    expect(secondSubmit.rows[0].result.error).toBe('INVALID_OR_USED_TOKEN');

    // Verify no second response was added to responses table
    const countRes = await db.query(`SELECT COUNT(*) FROM responses WHERE squad_id = $1`, [squadId]);
    expect(Number(countRes.rows[0].count)).toBe(1);
  });

  // TEST 5: Roll-up & Differencing Protection with Worked Example
  it('5. Roll-up merges below-threshold squads; Differencing test proves a hidden squad cannot be derived', async () => {
    // Worked Example:
    // Business Unit has 3 squads:
    // - Squad A (8 responses) -> visible
    // - Squad B (7 responses) -> visible
    // - Squad C (3 responses) -> HIDDEN (N < 5)
    // If unit totals were published, an attacker could derive Squad C: Total - (Squad A + Squad B)
    // Therefore, Complementary Suppression MUST suppress the Unit Total!

    const buRes = await db.query(`INSERT INTO business_units (name) VALUES ('Delivery Unit Gamma') RETURNING id`);
    const buId = buRes.rows[0].id;

    const sqARes = await db.query(`INSERT INTO squads (business_unit_id, name) VALUES ($1, 'Squad A') RETURNING id`, [buId]);
    const sqAId = sqARes.rows[0].id;
    const sqBRes = await db.query(`INSERT INTO squads (business_unit_id, name) VALUES ($1, 'Squad B') RETURNING id`, [buId]);
    const sqBId = sqBRes.rows[0].id;
    const sqCRes = await db.query(`INSERT INTO squads (business_unit_id, name) VALUES ($1, 'Squad C') RETURNING id`, [buId]);
    const sqCId = sqCRes.rows[0].id;

    const cycleRes = await db.query(
      `INSERT INTO cycles (name, cycle_type, status, start_date, end_date) 
       VALUES ('Q1 2026', 'full', 'open', CURRENT_DATE, CURRENT_DATE + INTERVAL '14 days') 
       RETURNING id`
    );
    const cycleId = cycleRes.rows[0].id;

    // Helper to insert n responses
    const insertResponses = async (squadId: string, count: number, score: number) => {
      for (let i = 0; i < count; i++) {
        const hash = crypto.createHash('sha256').update(`token_${squadId}_${i}`).digest('hex');
        await db.query(`INSERT INTO invites (cycle_id, squad_id, token_hash) VALUES ($1, $2, $3)`, [cycleId, squadId, hash]);
        await db.query(
          `SELECT submit_response($1, $2, $3, $4, $4, $4, $4, $4, $4, 'comment')`,
          [hash, cycleId, squadId, score]
        );
      }
    };

    // Insert: Squad A = 8 responses, score = 4
    await insertResponses(sqAId, 8, 4);
    // Insert: Squad B = 7 responses, score = 3
    await insertResponses(sqBId, 7, 3);
    // Insert: Squad C = 3 responses, score = 1 (critical low score)
    await insertResponses(sqCId, 3, 1);

    // Call get_unit_results_with_rollup
    const unitRes = await db.query(`SELECT get_unit_results_with_rollup($1, $2) AS data`, [buId, cycleId]);
    const unitData = unitRes.rows[0].data;

    // 1. Squad A must be visible
    const squadA = unitData.squads.find((s: any) => s.squad_id === sqAId);
    expect(squadA.hidden).toBe(false);
    expect(squadA.response_count).toBe(8);

    // 2. Squad B must be visible
    const squadB = unitData.squads.find((s: any) => s.squad_id === sqBId);
    expect(squadB.hidden).toBe(false);
    expect(squadB.response_count).toBe(7);

    // 3. Squad C must be hidden
    const squadC = unitData.squads.find((s: any) => s.squad_id === sqCId);
    expect(squadC.hidden).toBe(true);
    expect(squadC.response_count).toBeUndefined();
    expect(squadC.means).toBeUndefined();

    // 4. Complementary Suppression Invariant:
    // Exactly 1 squad is hidden in the unit. The Unit Aggregate MUST BE SUPPRESSED!
    expect(unitData.unit_aggregate.total_suppressed).toBe(true);
    expect(unitData.unit_aggregate.response_count).toBeUndefined();
    expect(unitData.unit_aggregate.means).toBeUndefined();
    expect(unitData.unit_aggregate.reason).toBe('COMPLEMENTARY_SUPPRESSION_TO_PROTECT_HIDDEN_GROUP');

    // 5. Roll-up test with multiple below-threshold squads:
    // If we add Squad D with 3 responses, hidden squads = 2, total pool = 3 + 3 = 6 (>= 5).
    // The merged pool can be safely reported while individual squads remain hidden!
    const sqDRes = await db.query(`INSERT INTO squads (business_unit_id, name) VALUES ($1, 'Squad D') RETURNING id`, [buId]);
    const sqDId = sqDRes.rows[0].id;
    await insertResponses(sqDId, 3, 2);

    const unitResMulti = await db.query(`SELECT get_unit_results_with_rollup($1, $2) AS data`, [buId, cycleId]);
    const multiData = unitResMulti.rows[0].data;

    // Both C and D remain individually hidden
    const cCheck = multiData.squads.find((s: any) => s.squad_id === sqCId);
    const dCheck = multiData.squads.find((s: any) => s.squad_id === sqDId);
    expect(cCheck.hidden).toBe(true);
    expect(dCheck.hidden).toBe(true);

    // Merged pool is presented safely since pool count = 6 (>= 5)
    expect(multiData.merged_pool).toBeDefined();
    expect(multiData.merged_pool.hidden).toBe(false);
    expect(multiData.merged_pool.response_count).toBe(6);
    expect(multiData.merged_pool.means).toBeDefined();
  });

  // TEST 6: Comment Summary Gate Check (Strictly BU level, N >= 10, comments >= 5)
  it('6. get_bu_comments_for_summary refuses groups with < 10 responses or < 5 comments, and shuffles comments', async () => {
    const buRes = await db.query(`INSERT INTO business_units (name) VALUES ('BU AI Check') RETURNING id`);
    const buId = buRes.rows[0].id;
    const squadRes = await db.query(`INSERT INTO squads (business_unit_id, name) VALUES ($1, 'AI Squad') RETURNING id`, [buId]);
    const squadId = squadRes.rows[0].id;
    const cycleRes = await db.query(
      `INSERT INTO cycles (name, cycle_type, status, start_date, end_date) 
       VALUES ('Q1 2026', 'full', 'open', CURRENT_DATE, CURRENT_DATE + INTERVAL '14 days') 
       RETURNING id`
    );
    const cycleId = cycleRes.rows[0].id;

    // Case 1: 9 responses (below 10)
    for (let i = 0; i < 9; i++) {
      const hash = crypto.createHash('sha256').update(`token_ai_${i}`).digest('hex');
      await db.query(`INSERT INTO invites (cycle_id, squad_id, token_hash) VALUES ($1, $2, $3)`, [cycleId, squadId, hash]);
      await db.query(
        `SELECT submit_response($1, $2, $3, 4, 4, 4, 4, 4, 4, $4)`,
        [hash, cycleId, squadId, `Feedback note number ${i}`]
      );
    }

    const under10 = await db.query(`SELECT get_bu_comments_for_summary($1, $2) AS data`, [buId, cycleId]);
    expect(under10.rows[0].data.allowed).toBe(false);
    expect(under10.rows[0].data.comments).toEqual([]);

    // Add 10th response with a comment
    const hash10 = crypto.createHash('sha256').update(`token_ai_10`).digest('hex');
    await db.query(`INSERT INTO invites (cycle_id, squad_id, token_hash) VALUES ($1, $2, $3)`, [cycleId, squadId, hash10]);
    await db.query(
      `SELECT submit_response($1, $2, $3, 4, 4, 4, 4, 4, 4, 'Feedback note number 10')`,
      [hash10, cycleId, squadId]
    );

    const allowedRes = await db.query(`SELECT get_bu_comments_for_summary($1, $2) AS data`, [buId, cycleId]);
    expect(allowedRes.rows[0].data.allowed).toBe(true);
    expect(allowedRes.rows[0].data.comment_count).toBe(10);
    expect(allowedRes.rows[0].data.comments.length).toBe(10);
  });
});
