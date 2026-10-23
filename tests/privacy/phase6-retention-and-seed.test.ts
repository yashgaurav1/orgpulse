import { describe, it, expect, beforeEach } from 'vitest';
import { createTestDatabase } from '../../src/db/test-db';
import { executeRetentionPurge } from '../../src/lib/retention-service';
import { seedDatabase } from '../../src/db/seed';
import crypto from 'crypto';

describe('Phase 6: Retention Job, Historical Archiving & Seed Script Tests', () => {
  let db: any;

  beforeEach(async () => {
    db = await createTestDatabase();
  });

  // TEST 1: Retention Purge Removes Exactly What It Should (Section 22, Test 10)
  it('1. Retention job deletes raw responses, comments, and invites for closed cycles > 90 days, while preserving aggregates and leaving active cycles untouched', async () => {
    const buRes = await db.query(`INSERT INTO business_units (name) VALUES ('Core Delivery') RETURNING id`);
    const buId = buRes.rows[0].id;
    const sqRes = await db.query(
      `INSERT INTO squads (business_unit_id, name) VALUES ($1, 'Alpha Squad') RETURNING id`,
      [buId]
    );
    const sqId = sqRes.rows[0].id;

    // 1a. Create cycle as 'open' first, submit responses, then close it
    const oldCycleRes = await db.query(
      `INSERT INTO cycles (name, cycle_type, status, start_date, end_date)
       VALUES ('Q3 2025 Closed', 'full', 'open', CURRENT_DATE - INTERVAL '130 days', CURRENT_DATE - INTERVAL '100 days')
       RETURNING id`
    );
    const oldCycleId = oldCycleRes.rows[0].id;

    // Seed 6 responses and invites in the cycle while open
    for (let i = 1; i <= 6; i++) {
      const hash = crypto.createHash('sha256').update(`token_old_${i}`).digest('hex');
      await db.query(`INSERT INTO invites (cycle_id, squad_id, token_hash) VALUES ($1, $2, $3)`, [
        oldCycleId,
        sqId,
        hash,
      ]);
      const sub = await db.query(`SELECT submit_response($1, $2, $3, 4, 4, 4, 4, 4, 4, 'Confidential old comment') AS res`, [
        hash,
        oldCycleId,
        sqId,
      ]);
      expect(sub.rows[0].res.success).toBe(true);
    }

    // Now close the cycle (as happens when a survey cycle concludes)
    await db.query(`UPDATE cycles SET status = 'closed' WHERE id = $1`, [oldCycleId]);

    // 1b. Create ACTIVE / CURRENT cycle (ended today or open)
    const activeCycleRes = await db.query(
      `INSERT INTO cycles (name, cycle_type, status, start_date, end_date)
       VALUES ('Q1 2026 Open', 'full', 'open', CURRENT_DATE - INTERVAL '5 days', CURRENT_DATE + INTERVAL '10 days')
       RETURNING id`
    );
    const activeCycleId = activeCycleRes.rows[0].id;

    // Seed 5 responses and invites in the ACTIVE cycle
    for (let i = 1; i <= 5; i++) {
      const hash = crypto.createHash('sha256').update(`token_active_${i}`).digest('hex');
      await db.query(`INSERT INTO invites (cycle_id, squad_id, token_hash) VALUES ($1, $2, $3)`, [
        activeCycleId,
        sqId,
        hash,
      ]);
      await db.query(`SELECT submit_response($1, $2, $3, 5, 5, 5, 5, 5, 5, 'Current open comment')`, [
        hash,
        activeCycleId,
        sqId,
      ]);
    }

    // Pre-retention verification
    const preOldResponses = await db.query(`SELECT COUNT(*) FROM responses WHERE cycle_id = $1`, [oldCycleId]);
    expect(Number(preOldResponses.rows[0].count)).toBe(6);

    const preActiveResponses = await db.query(`SELECT COUNT(*) FROM responses WHERE cycle_id = $1`, [activeCycleId]);
    expect(Number(preActiveResponses.rows[0].count)).toBe(5);

    // 1c. Run Retention Purge with 90-day threshold
    const purgeResult = await executeRetentionPurge(90, db);
    expect(purgeResult.success).toBe(true);
    expect(purgeResult.deletedResponses).toBe(6);
    expect(purgeResult.deletedInvites).toBe(6);

    // 1d. Invariant Check: OLD cycle responses & invites are DELETED
    const postOldResponses = await db.query(`SELECT COUNT(*) FROM responses WHERE cycle_id = $1`, [oldCycleId]);
    expect(Number(postOldResponses.rows[0].count)).toBe(0);

    const postOldInvites = await db.query(`SELECT COUNT(*) FROM invites WHERE cycle_id = $1`, [oldCycleId]);
    expect(Number(postOldInvites.rows[0].count)).toBe(0);

    // 1e. Invariant Check: Historical aggregate was ARCHIVED before purge
    const archived = await db.query(
      `SELECT * FROM squad_historical_aggregates WHERE cycle_id = $1 AND squad_id = $2`,
      [oldCycleId, sqId]
    );
    expect(archived.rows.length).toBe(1);
    expect(archived.rows[0].response_count).toBe(6);
    expect(Number(archived.rows[0].average_pulse)).toBe(4.0);

    // 1f. Invariant Check: ACTIVE cycle data remains 100% UNTOUCHED
    const postActiveResponses = await db.query(`SELECT COUNT(*) FROM responses WHERE cycle_id = $1`, [activeCycleId]);
    expect(Number(postActiveResponses.rows[0].count)).toBe(5);

    const postActiveInvites = await db.query(`SELECT COUNT(*) FROM invites WHERE cycle_id = $1`, [activeCycleId]);
    expect(Number(postActiveInvites.rows[0].count)).toBe(5);
  });

  // TEST 2: Seed Script Execution and Profile Alignment
  it('2. Seed script populates 5 squads, 2 cycles, and matches Section 18 sample data profiles', async () => {
    const seedResult = await seedDatabase(db);
    expect(seedResult.squads).toBe(5);
    expect(seedResult.cycles).toBe(2);
    expect(seedResult.responses).toBe(33); // 8 + 7 + 9 + 6 + 3 = 33

    // Verify Squad E is below threshold (3 responses) for roll-up demonstration
    const sqERes = await db.query(`SELECT id FROM squads WHERE name = 'Squad E (Platform Innovation)'`);
    const sqEId = sqERes.rows[0].id;
    const sqECount = await db.query(`SELECT COUNT(*) FROM responses WHERE squad_id = $1`, [sqEId]);
    expect(Number(sqECount.rows[0].count)).toBe(3);

    // Verify Squad A has 8 responses
    const sqARes = await db.query(`SELECT id FROM squads WHERE name = 'Squad A (FinTech)'`);
    const sqAId = sqARes.rows[0].id;
    const sqACount = await db.query(`SELECT COUNT(*) FROM responses WHERE squad_id = $1`, [sqAId]);
    expect(Number(sqACount.rows[0].count)).toBe(8);
  });
});
