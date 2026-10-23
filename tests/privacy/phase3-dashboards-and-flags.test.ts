import { describe, it, expect, beforeEach } from 'vitest';
import { createTestDatabase } from '../../src/db/test-db';
import {
  evaluateSquadFlags,
  calculateSquadRisk,
  isShortInterval,
  ItemMeans,
} from '../../src/lib/flags';
import { authorizeSquadRead, logAuditEvent, AuthContext } from '../../src/lib/audit-and-auth';
import { generateTeamLevelCsv, SquadExportData } from '../../src/lib/export-csv';

describe('Phase 3: Dashboards, Roll-Up, Flags, Risk Level & Audit Log Tests', () => {
  let db: any;

  beforeEach(async () => {
    db = await createTestDatabase();
  });

  // TEST 1: Flag Thresholds Precision
  it('1. Flags trigger with exact numerical precision: Item 5 at 2.99 flags, 3.00 does not; Item 4 at 3.19 flags, 3.20 does not', () => {
    // 1a. Item 5 (Workload sustainability)
    const baseMeans: ItemMeans = {
      q1: 4.0,
      q2: 4.0,
      q3: 4.0,
      q4: 4.0,
      q5: 2.99,
      q6: 4.0,
    };
    const flags299 = evaluateSquadFlags(baseMeans);
    expect(flags299.some((f) => f.item === 'Q5')).toBe(true);

    const means300: ItemMeans = { ...baseMeans, q5: 3.0 };
    const flags300 = evaluateSquadFlags(means300);
    expect(flags300.some((f) => f.item === 'Q5')).toBe(false);

    // 1b. Item 4 (Psychological safety)
    const means319: ItemMeans = { ...baseMeans, q5: 4.0, q4: 3.19 };
    const flags319 = evaluateSquadFlags(means319);
    expect(flags319.some((f) => f.item === 'Q4')).toBe(true);

    const means320: ItemMeans = { ...baseMeans, q5: 4.0, q4: 3.2 };
    const flags320 = evaluateSquadFlags(means320);
    expect(flags320.some((f) => f.item === 'Q4')).toBe(false);

    // 1c. Drop Rule: 0.40 drop triggers flag; 0.39 does not; previous below N suppresses comparison
    const curMeans: ItemMeans = { q1: 3.6, q2: 4.0, q3: 4.0, q4: 4.0, q5: 4.0, q6: 4.0 };
    const prevMeans: ItemMeans = { q1: 4.0, q2: 4.0, q3: 4.0, q4: 4.0, q5: 4.0, q6: 4.0 };

    // Drop = 4.0 - 3.6 = 0.40 -> Must trigger flag when previous cycle met N >= 5
    const drop40Flags = evaluateSquadFlags(curMeans, prevMeans, true);
    expect(drop40Flags.some((f) => f.item === 'Q1')).toBe(true);

    // Drop = 4.0 - 3.61 = 0.39 -> Must NOT trigger flag
    const curMeans39: ItemMeans = { ...curMeans, q1: 3.61 };
    const drop39Flags = evaluateSquadFlags(curMeans39, prevMeans, true);
    expect(drop39Flags.some((f) => f.item === 'Q1')).toBe(false);

    // If previous cycle did NOT meet N (previousMetThreshold = false), drop comparison is suppressed
    const suppressedDropFlags = evaluateSquadFlags(curMeans, prevMeans, false);
    expect(suppressedDropFlags.some((f) => f.item === 'Q1')).toBe(false);
  });

  // TEST 2: Squad Risk Level Calculations (Matching Seed Squad Profiles in Section 18)
  it('2. Squad Risk Level correctly calculates Low, Moderate, High, and Critical matching Section 18 specifications', () => {
    // Squad A (FinTech): Avg pulse 4.15, 0 triggers -> Low
    const riskA = calculateSquadRisk([], 4.15);
    expect(riskA.riskLevel).toBe('Low');

    // Squad C (Cloud): Avg pulse 3.85, 0 triggers -> Moderate (avg < 4.0)
    const riskC = calculateSquadRisk([], 3.85);
    expect(riskC.riskLevel).toBe('Moderate');

    // Squad B (Retail): 1 trigger (Q4 low) -> High (1-2 triggers)
    const triggerQ4 = evaluateSquadFlags({
      q1: 3.5,
      q2: 3.5,
      q3: 3.5,
      q4: 2.8,
      q5: 3.5,
      q6: 3.5,
    });
    const riskB = calculateSquadRisk(triggerQ4, 3.1);
    expect(riskB.riskLevel).toBe('High');

    // Squad D (Legacy): 3 triggers (Q4, Q5, Q6 low) -> Critical (3+ triggers)
    const triggersCritical = evaluateSquadFlags({
      q1: 3.5,
      q2: 3.5,
      q3: 3.5,
      q4: 2.35, // Trigger 1
      q5: 2.85, // Trigger 2
      q6: 2.9, // Trigger 3
    });
    expect(triggersCritical.length).toBeGreaterThanOrEqual(3);
    const riskD = calculateSquadRisk(triggersCritical, 2.85);
    expect(riskD.riskLevel).toBe('Critical');
  });

  // TEST 3: Short-Interval Note Rule
  it('3. Cycle interval detector identifies cycles < 90 days apart for cautious interpretation', () => {
    // 30 days apart -> Short interval
    const res30 = isShortInterval('2026-01-01', '2026-01-31');
    expect(res30.isShort).toBe(true);
    expect(res30.daysBetween).toBe(30);

    // 90 days apart -> Not short
    const res90 = isShortInterval('2026-01-01', '2026-04-02');
    expect(res90.isShort).toBe(false);
    expect(res90.daysBetween).toBeGreaterThanOrEqual(90);
  });

  // TEST 4: Cross-Tenant Authorization Isolation (Manager A cannot read Manager B)
  it('4. Manager A cannot read Manager B squad results; unauthorized attempts log audit events', async () => {
    const buRes = await db.query(`INSERT INTO business_units (name) VALUES ('Core Delivery') RETURNING id`);
    const buId = buRes.rows[0].id;

    // Create Manager A and Manager B IDs
    const managerAId = '11111111-1111-1111-1111-111111111111';
    const managerBId = '22222222-2222-2222-2222-222222222222';

    // Squad A managed by Manager A
    const sqARes = await db.query(
      `INSERT INTO squads (business_unit_id, name, manager_user_id) VALUES ($1, 'Squad A', $2) RETURNING id`,
      [buId, managerAId]
    );
    const sqAId = sqARes.rows[0].id;

    // Squad B managed by Manager B
    const sqBRes = await db.query(
      `INSERT INTO squads (business_unit_id, name, manager_user_id) VALUES ($1, 'Squad B', $2) RETURNING id`,
      [buId, managerBId]
    );
    const sqBId = sqBRes.rows[0].id;

    const authManagerA: AuthContext = {
      userId: managerAId,
      role: 'delivery_manager',
      assignedSquadId: sqAId,
    };

    // Manager A reading Squad A -> Authorized
    const authOwnSquad = await authorizeSquadRead(authManagerA, sqAId, db);
    expect(authOwnSquad.authorized).toBe(true);

    // Manager A attempting to read Squad B -> FORBIDDEN
    const authOtherSquad = await authorizeSquadRead(authManagerA, sqBId, db);
    expect(authOtherSquad.authorized).toBe(false);
    expect(authOtherSquad.reason).toBe('FORBIDDEN_NOT_SQUAD_MANAGER');

    // Verify audit log captured the unauthorized attempt
    const auditRes = await db.query(
      `SELECT * FROM audit_log WHERE actor_id = $1 AND action = 'UNAUTHORIZED_SQUAD_READ_ATTEMPT'`,
      [managerAId]
    );
    expect(auditRes.rows.length).toBe(1);
    expect(auditRes.rows[0].target_group_id).toBe(sqBId);
  });

  // TEST 5: CSV Export Excludes Hidden Groups & Enforces Alphabetical Order
  it('5. Team-level CSV export strictly excludes hidden groups (< 5 respondents) and orders alphabetically', () => {
    const testSquads: SquadExportData[] = [
      {
        squadName: 'Retail Squad',
        businessUnit: 'Consumer Unit',
        hidden: false,
        responseCount: 7,
        averagePulse: 3.1,
        riskLevel: 'High',
      },
      {
        squadName: 'Cloud Squad',
        businessUnit: 'Core Platform',
        hidden: false,
        responseCount: 9,
        averagePulse: 3.85,
        riskLevel: 'Moderate',
      },
      {
        squadName: 'Small Experimental Squad',
        businessUnit: 'Labs',
        hidden: true, // N < 5
        responseCount: 3,
        averagePulse: 2.1,
        riskLevel: 'Critical',
      },
      {
        squadName: 'Alpha Fintech Squad',
        businessUnit: 'Financial Services',
        hidden: false,
        responseCount: 8,
        averagePulse: 4.15,
        riskLevel: 'Low',
      },
    ];

    const csvOutput = generateTeamLevelCsv(testSquads, 'Q1 2026 Full Pulse');

    // 1. Hidden squad MUST NOT appear in CSV
    expect(csvOutput).not.toContain('Small Experimental Squad');

    // 2. Visible squads must appear in strictly alphabetical order:
    // "Alpha Fintech Squad" -> "Cloud Squad" -> "Retail Squad"
    const alphaIdx = csvOutput.indexOf('Alpha Fintech Squad');
    const cloudIdx = csvOutput.indexOf('Cloud Squad');
    const retailIdx = csvOutput.indexOf('Retail Squad');

    expect(alphaIdx).toBeGreaterThan(-1);
    expect(cloudIdx).toBeGreaterThan(-1);
    expect(retailIdx).toBeGreaterThan(-1);

    expect(alphaIdx).toBeLessThan(cloudIdx);
    expect(cloudIdx).toBeLessThan(retailIdx);
  });
});
