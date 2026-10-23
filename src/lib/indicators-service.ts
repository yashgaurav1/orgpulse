import { DbClientInterface } from './survey-service';
import { OperationalIndicatorInput, OperationalIndicatorSchema } from '../types/actions-and-indicators';

export const INDICATOR_METADATA = {
  offHoursCodePct: {
    name: 'Off-hours code updates',
    definition: 'Share of squad code updates in configured late window (default: after 9:00 PM).',
    readsAs: 'Possible workload imbalance or unrealistic client deadlines.',
    limits: 'Distorted by time-zone handoffs and personal working preferences.',
    threshold: 35.0, // > 35% triggers playbook
  },
  leavePatternRatio: {
    name: 'Leave-pattern ratio',
    definition: 'Monday/Friday share of leave days taken (0.0 to 1.0).',
    readsAs: 'Possible stress or exhaustion.',
    limits:
      'Cannot distinguish illness, emergencies or family care. Health-adjacent: keep disabled unless legal review approves. Managers must never question valid leave.',
  },
  internalTransfersCount: {
    name: 'Internal transfer applications',
    definition: 'Count of transfer applications per squad over period.',
    readsAs: 'Faith in internal mobility and psychological openness.',
    limits:
      'May reflect project lock-in. HRBP-managed; managers informed only after formal shortlisting.',
  },
  trainingAttendancePct: {
    name: 'Voluntary training attendance',
    definition: 'Squad aggregate attendance rate for voluntary learning sessions.',
    readsAs: 'Professional development interest and spare capacity.',
    limits:
      'Often reflects delivery pressure crowding out study. Sessions are never made mandatory.',
    thresholdDrop: 30.0, // > 30% drop triggers playbook
  },
} as const;

export interface IndicatorEntryResult {
  success: boolean;
  error?: string;
}

/**
 * Validates and records squad-level operational indicators.
 * Strictly enforces:
 * 1. Squad respondent count must meet N >= 5.
 * 2. Rejects any per-person payload (no employee IDs or individual records permitted).
 */
export async function recordSquadOperationalIndicators(
  input: OperationalIndicatorInput,
  rawPayload: any,
  db: DbClientInterface
): Promise<IndicatorEntryResult> {
  // 1. Check for forbidden per-person fields in payload
  const forbiddenFields = ['user_id', 'employee_id', 'name', 'email', 'developer', 'author', 'individual_updates'];
  for (const field of forbiddenFields) {
    if (rawPayload && typeof rawPayload === 'object' && field in rawPayload) {
      return {
        success: false,
        error: `FORBIDDEN_PER_PERSON_DATA: Operational indicators accept squad aggregates only. Received '${field}'.`,
      };
    }
  }

  // 2. Validate input schema
  const parsed = OperationalIndicatorSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: 'INVALID_INDICATOR_DATA: ' + JSON.stringify(parsed.error.flatten()),
    };
  }

  // 3. Verify squad respondent count meets N >= 5 in the cycle
  const respRes = await db.query(
    `SELECT COUNT(*) FROM responses WHERE squad_id = $1 AND cycle_id = $2`,
    [input.squadId, input.cycleId]
  );
  const respCount = Number(respRes.rows[0]?.count ?? 0);

  // Read min_group_size from app_config
  const cfgRes = await db.query(
    `SELECT (value->>'value')::int AS min_n FROM app_config WHERE key = 'min_group_size'`
  );
  const minN = Number(cfgRes.rows[0]?.min_n ?? 5);

  if (respCount < minN) {
    return {
      success: false,
      error: `THRESHOLD_NOT_MET: Squad has ${respCount} respondents, below minimum threshold (N = ${minN}). Indicators cannot be recorded for below-threshold squads.`,
    };
  }

  // 4. Upsert into operational_indicators table
  await db.query(
    `INSERT INTO operational_indicators (
       squad_id, cycle_id, off_hours_code_pct, leave_pattern_ratio, internal_transfers_count, training_attendance_pct
     )
     VALUES ($1, $2, $3, $4, $5, $6)
     ON CONFLICT (squad_id, cycle_id)
     DO UPDATE SET
       off_hours_code_pct = EXCLUDED.off_hours_code_pct,
       leave_pattern_ratio = EXCLUDED.leave_pattern_ratio,
       internal_transfers_count = EXCLUDED.internal_transfers_count,
       training_attendance_pct = EXCLUDED.training_attendance_pct,
       created_at = NOW()`,
    [
      input.squadId,
      input.cycleId,
      input.offHoursCodePct ?? null,
      input.leavePatternRatio ?? null,
      input.internalTransfersCount ?? 0,
      input.trainingAttendancePct ?? null,
    ]
  );

  return { success: true };
}
