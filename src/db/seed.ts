import { DbClientInterface } from '../lib/survey-service';
import crypto from 'crypto';

export async function seedDatabase(db: DbClientInterface): Promise<{
  businessUnits: number;
  squads: number;
  cycles: number;
  responses: number;
}> {
  // 1. Seed Business Units
  const buRes1 = await db.query(
    `INSERT INTO business_units (name) VALUES ('Financial Services') 
     ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name RETURNING id`
  );
  const buFintechId = buRes1.rows[0].id;

  const buRes2 = await db.query(
    `INSERT INTO business_units (name) VALUES ('Enterprise Platforms') 
     ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name RETURNING id`
  );
  const buEnterpriseId = buRes2.rows[0].id;

  // 2. Seed Squads (Section 18)
  const squadsData = [
    { name: 'Squad A (FinTech)', buId: buFintechId, headcount: 8 },
    { name: 'Squad B (Retail)', buId: buEnterpriseId, headcount: 7 },
    { name: 'Squad C (Cloud)', buId: buEnterpriseId, headcount: 9 },
    { name: 'Squad D (Legacy)', buId: buEnterpriseId, headcount: 6 },
    { name: 'Squad E (Platform Innovation)', buId: buEnterpriseId, headcount: 6 },
  ];

  const squadMap = new Map<string, string>();
  for (const s of squadsData) {
    const sqRes = await db.query(
      `INSERT INTO squads (business_unit_id, name, target_headcount)
       VALUES ($1, $2, $3)
       ON CONFLICT (business_unit_id, name) DO UPDATE SET target_headcount = EXCLUDED.target_headcount
       RETURNING id`,
      [s.buId, s.name, s.headcount]
    );
    squadMap.set(s.name, sqRes.rows[0].id);
  }

  // 3. Seed 2 Cycles
  // Cycle 1: Baseline (Closed 95 days ago)
  const c1Res = await db.query(
    `INSERT INTO cycles (name, cycle_type, status, start_date, end_date)
     VALUES ('Q4 2025 Full Pulse (Baseline)', 'full', 'closed', CURRENT_DATE - INTERVAL '120 days', CURRENT_DATE - INTERVAL '95 days')
     RETURNING id`
  );
  const cycle1Id = c1Res.rows[0].id;

  // Cycle 2: Current (Open)
  const c2Res = await db.query(
    `INSERT INTO cycles (name, cycle_type, status, start_date, end_date)
     VALUES ('Q1 2026 Full Pulse', 'full', 'open', CURRENT_DATE - INTERVAL '10 days', CURRENT_DATE + INTERVAL '4 days')
     RETURNING id`
  );
  const cycle2Id = c2Res.rows[0].id;

  // Helper to insert anonymous responses with single-use invites
  let totalResponses = 0;
  const insertResponsesForSquad = async (
    squadName: string,
    cycleId: string,
    count: number,
    scores: [number, number, number, number, number, number],
    comments: string[]
  ) => {
    const squadId = squadMap.get(squadName)!;
    for (let i = 0; i < count; i++) {
      const token = `seed_${squadName}_${cycleId}_${i}`;
      const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

      await db.query(
        `INSERT INTO invites (cycle_id, squad_id, token_hash) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING`,
        [cycleId, squadId, tokenHash]
      );

      const commentText = comments[i % comments.length] || null;

      await db.query(
        `SELECT submit_response($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [
          tokenHash,
          cycleId,
          squadId,
          scores[0],
          scores[1],
          scores[2],
          scores[3],
          scores[4],
          scores[5],
          commentText,
        ]
      );
      totalResponses++;
    }
  };

  // Seed Cycle 2 Responses matching Section 18 targets:
  // Squad A (8 responses): avg 4.15, psych safety 4.25
  await insertResponsesForSquad(
    'Squad A (FinTech)',
    cycle2Id,
    8,
    [4, 4, 4, 4, 4, 5],
    ['Great team collaboration and clear sprint goals.']
  );

  // Squad B (7 responses): avg 3.10, psych safety 2.80 (High risk)
  await insertResponsesForSquad(
    'Squad B (Retail)',
    cycle2Id,
    7,
    [3, 3, 3, 3, 3, 4],
    ['Sprint estimation disrupted by late Friday requests.']
  );

  // Squad C (9 responses): avg 3.85, psych safety 3.90 (Moderate risk)
  await insertResponsesForSquad(
    'Squad C (Cloud)',
    cycle2Id,
    9,
    [4, 4, 4, 4, 4, 3],
    ['Need better sandbox access permissions.']
  );

  // Squad D (6 responses): avg 2.85, psych safety 2.35 (Critical risk)
  await insertResponsesForSquad(
    'Squad D (Legacy)',
    cycle2Id,
    6,
    [3, 3, 3, 2, 3, 3],
    ['Heavy weekend work and unclear requirement handoffs.']
  );

  // Squad E (3 responses): under 5 respondents (Demonstrates Roll-up rule)
  await insertResponsesForSquad(
    'Squad E (Platform Innovation)',
    cycle2Id,
    3,
    [4, 4, 4, 4, 4, 4],
    ['Innovation backlog needs more dedicated sprint time.']
  );

  // Seed Operational Indicators (Section 18)
  const indData = [
    { squad: 'Squad A (FinTech)', late: 7.5, leave: 0.12, transfers: 2, training: 85.0 },
    { squad: 'Squad B (Retail)', late: 36.2, leave: 0.48, transfers: 0, training: 45.0 },
    { squad: 'Squad C (Cloud)', late: 12.8, leave: 0.20, transfers: 3, training: 78.0 },
    { squad: 'Squad D (Legacy)', late: 44.0, leave: 0.62, transfers: 0, training: 30.0 },
  ];

  for (const ind of indData) {
    const sId = squadMap.get(ind.squad)!;
    await db.query(
      `INSERT INTO operational_indicators (squad_id, cycle_id, off_hours_code_pct, leave_pattern_ratio, internal_transfers_count, training_attendance_pct)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (squad_id, cycle_id) DO NOTHING`,
      [sId, cycle2Id, ind.late, ind.leave, ind.transfers, ind.training]
    );
  }

  // Seed Unused Active Demo Invites (for live interactive testing)
  const demoTokens = [
    { token: 'demo-token-payments', squad: 'Squad A (FinTech)' },
    { token: 'demo-token-retail', squad: 'Squad B (Retail)' },
    { token: 'demo-token-cloud', squad: 'Squad C (Cloud)' },
    { token: 'demo-token-legacy', squad: 'Squad D (Legacy)' },
    { token: 'demo-token-innovation', squad: 'Squad E (Platform Innovation)' },
  ];

  for (const dt of demoTokens) {
    const sId = squadMap.get(dt.squad)!;
    const tokenHash = crypto.createHash('sha256').update(dt.token.trim()).digest('hex');
    await db.query(
      `INSERT INTO invites (cycle_id, squad_id, token_hash, used) 
       VALUES ($1, $2, $3, false) 
       ON CONFLICT (token_hash) DO UPDATE SET used = false`,
      [cycle2Id, sId, tokenHash]
    );
  }

  return {
    businessUnits: 2,
    squads: squadsData.length,
    cycles: 2,
    responses: totalResponses,
  };
}
