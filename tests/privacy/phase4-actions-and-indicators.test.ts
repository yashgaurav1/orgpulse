import { describe, it, expect, beforeEach } from 'vitest';
import { createTestDatabase } from '../../src/db/test-db';
import {
  createActionFromTrigger,
  updateActionStatus,
  getSquadActions,
  isActionPlanOverdue,
} from '../../src/lib/action-workflow';
import {
  recordSquadOperationalIndicators,
  INDICATOR_METADATA,
} from '../../src/lib/indicators-service';
import { PLAYBOOK_DEFINITIONS } from '../../src/lib/flags';
import crypto from 'crypto';

describe('Phase 4: Action Workflow, Reminders, Indicators Module & Library Tests', () => {
  let db: any;

  beforeEach(async () => {
    db = await createTestDatabase();
  });

  // TEST 1: Passive Indicators reject groups < 5 and per-person payloads (Section 22, Test 8)
  it('1. Operational indicators module strictly rejects squads under 5 respondents and any per-person payload', async () => {
    const buRes = await db.query(`INSERT INTO business_units (name) VALUES ('FinTech BU') RETURNING id`);
    const buId = buRes.rows[0].id;
    const sqRes = await db.query(
      `INSERT INTO squads (business_unit_id, name) VALUES ($1, 'Ledger Squad') RETURNING id`,
      [buId]
    );
    const sqId = sqRes.rows[0].id;

    const cycleRes = await db.query(
      `INSERT INTO cycles (name, cycle_type, status, start_date, end_date) 
       VALUES ('Q1 2026', 'full', 'open', CURRENT_DATE, CURRENT_DATE + INTERVAL '14 days') 
       RETURNING id`
    );
    const cycleId = cycleRes.rows[0].id;

    // 1a. Attempt to record indicators when squad has 0 responses (< 5)
    const emptySquadAttempt = await recordSquadOperationalIndicators(
      {
        squadId: sqId,
        cycleId: cycleId,
        offHoursCodePct: 40.5,
        leavePatternRatio: 0.35,
        internalTransfersCount: 1,
        trainingAttendancePct: 75.0,
      },
      {},
      db
    );
    expect(emptySquadAttempt.success).toBe(false);
    expect(emptySquadAttempt.error).toContain('THRESHOLD_NOT_MET');

    // 1b. Seed 4 responses (still below N=5)
    for (let i = 1; i <= 4; i++) {
      const hash = crypto.createHash('sha256').update(`token_ind_${i}`).digest('hex');
      await db.query(`INSERT INTO invites (cycle_id, squad_id, token_hash) VALUES ($1, $2, $3)`, [
        cycleId,
        sqId,
        hash,
      ]);
      await db.query(`SELECT submit_response($1, $2, $3, 4, 4, 4, 4, 4, 4, 'comment')`, [
        hash,
        cycleId,
        sqId,
      ]);
    }

    const under5Attempt = await recordSquadOperationalIndicators(
      {
        squadId: sqId,
        cycleId: cycleId,
        offHoursCodePct: 40.5,
      },
      {},
      db
    );
    expect(under5Attempt.success).toBe(false);
    expect(under5Attempt.error).toContain('THRESHOLD_NOT_MET');

    // 1c. Add 5th response -> Now meets N=5
    const hash5 = crypto.createHash('sha256').update(`token_ind_5`).digest('hex');
    await db.query(`INSERT INTO invites (cycle_id, squad_id, token_hash) VALUES ($1, $2, $3)`, [
      cycleId,
      sqId,
      hash5,
    ]);
    await db.query(`SELECT submit_response($1, $2, $3, 4, 4, 4, 4, 4, 4, 'comment')`, [
      hash5,
      cycleId,
      sqId,
    ]);

    // 1d. Attempt to send forbidden per-person data payload (e.g. employee_id or individual commits)
    const perPersonAttempt = await recordSquadOperationalIndicators(
      {
        squadId: sqId,
        cycleId: cycleId,
        offHoursCodePct: 32.0,
      },
      {
        employee_id: 'EMP_1024',
        developer: 'Jane Doe',
      },
      db
    );
    expect(perPersonAttempt.success).toBe(false);
    expect(perPersonAttempt.error).toContain('FORBIDDEN_PER_PERSON_DATA');

    // 1e. Clean aggregate payload with N=5 -> Succeeds!
    const validAttempt = await recordSquadOperationalIndicators(
      {
        squadId: sqId,
        cycleId: cycleId,
        offHoursCodePct: 32.0,
        leavePatternRatio: 0.15,
        internalTransfersCount: 2,
        trainingAttendancePct: 80.0,
      },
      {
        squadId: sqId,
        cycleId: cycleId,
        offHoursCodePct: 32.0,
      },
      db
    );
    expect(validAttempt.success).toBe(true);

    // Verify indicators persisted in database
    const saved = await db.query(
      `SELECT * FROM operational_indicators WHERE squad_id = $1 AND cycle_id = $2`,
      [sqId, cycleId]
    );
    expect(saved.rows.length).toBe(1);
    expect(Number(saved.rows[0].off_hours_code_pct)).toBe(32.0);
    expect(Number(saved.rows[0].leave_pattern_ratio)).toBe(0.15);
  });

  // TEST 2: Action Workflow Creation, Due Dates, and Status Progression
  it('2. Actions are created from playbook triggers with due dates, and transition through Open, In progress, and Done', async () => {
    const buRes = await db.query(`INSERT INTO business_units (name) VALUES ('Core Unit') RETURNING id`);
    const buId = buRes.rows[0].id;
    const sqRes = await db.query(
      `INSERT INTO squads (business_unit_id, name) VALUES ($1, 'Auth Squad') RETURNING id`,
      [buId]
    );
    const sqId = sqRes.rows[0].id;

    const cycleRes = await db.query(
      `INSERT INTO cycles (name, cycle_type, status, start_date, end_date) 
       VALUES ('Q1 2026', 'full', 'open', CURRENT_DATE, CURRENT_DATE + INTERVAL '14 days') 
       RETURNING id`
    );
    const cycleId = cycleRes.rows[0].id;

    // Create action for Q5 Workload trigger (due in 10 days)
    const triggerQ5 = {
      id: 'TRIGGER_Q5',
      item: 'Q5' as const,
      domain: 'Workload sustainability',
      triggerCondition: 'Mean score below 3.0',
      currentValue: 2.8,
      threshold: 3.0,
      ...PLAYBOOK_DEFINITIONS.Q5,
    };

    const actionId = await createActionFromTrigger(sqId, cycleId, triggerQ5, db);
    expect(actionId).toBeDefined();

    // Query squad actions
    let actionState = await getSquadActions(sqId, cycleId, db);
    expect(actionState.totalCount).toBe(1);
    expect(actionState.closedCount).toBe(0);
    expect(actionState.completionRatePct).toBe(0);
    expect(actionState.actions[0].triggerName).toBe('Q5');
    expect(actionState.actions[0].ownerRole).toBe('Project manager and delivery lead');
    expect(actionState.actions[0].status).toBe('Open');

    // Update status to 'In progress' with manager notes
    const progressRes = await updateActionStatus(
      {
        actionId,
        status: 'In progress',
        notes: 'Audited sprint backlog. Reduced point allocation by 15% and agreed 8PM evening buffer with client.',
      },
      db
    );
    expect(progressRes).toBe(true);

    actionState = await getSquadActions(sqId, cycleId, db);
    expect(actionState.actions[0].status).toBe('In progress');
    expect(actionState.actions[0].notes).toContain('Audited sprint backlog');

    // Mark as 'Done'
    await updateActionStatus(
      {
        actionId,
        status: 'Done',
        notes: 'Buffer confirmed in place. Late hours eliminated.',
      },
      db
    );

    actionState = await getSquadActions(sqId, cycleId, db);
    expect(actionState.closedCount).toBe(1);
    expect(actionState.completionRatePct).toBe(100);
  });

  // TEST 3: 14-Day Manager Action Plan Compliance Window
  it('3. Manager action plan requirement detects overdue state when 14 days elapse after cycle close', () => {
    const cycleEnd = '2026-10-01';

    // 10 days after close, plan not logged -> Not overdue yet
    const day10 = new Date('2026-10-11');
    const check10 = isActionPlanOverdue(cycleEnd, false, day10);
    expect(check10.isOverdue).toBe(false);
    expect(check10.daysElapsed).toBe(10);

    // 15 days after close, plan not logged -> Overdue!
    const day15 = new Date('2026-10-16');
    const check15 = isActionPlanOverdue(cycleEnd, false, day15);
    expect(check15.isOverdue).toBe(true);
    expect(check15.daysElapsed).toBe(15);

    // 15 days after close, plan WAS logged -> Not overdue
    const checkLogged = isActionPlanOverdue(cycleEnd, true, day15);
    expect(checkLogged.isOverdue).toBe(false);
  });

  // TEST 4: Indicator Metadata Integrity & Limits
  it('4. Indicator metadata provides transparent limitations for all operational metrics', () => {
    expect(INDICATOR_METADATA.offHoursCodePct.limits).toContain('Distorted by time-zone handoffs');
    expect(INDICATOR_METADATA.leavePatternRatio.limits).toContain('Health-adjacent: keep disabled');
    expect(INDICATOR_METADATA.internalTransfersCount.limits).toContain('HRBP-managed');
    expect(INDICATOR_METADATA.trainingAttendancePct.limits).toContain('Sessions are never made mandatory');
  });
});
