import { hashSurveyToken } from './tokens';
import { SurveySubmission, SurveyTokenVerification } from '../types/survey';

export interface DbClientInterface {
  query: (sql: string, params?: any[]) => Promise<{ rows: any[] }>;
}

/**
 * Verifies a survey token prior to displaying the survey form.
 */
export async function verifySurveyToken(
  rawToken: string,
  db: DbClientInterface
): Promise<SurveyTokenVerification> {
  const tokenHash = hashSurveyToken(rawToken);

  const res = await db.query(
    `SELECT 
       i.id AS invite_id,
       i.used,
       i.cycle_id,
       i.squad_id,
       s.name AS squad_name,
       bu.name AS unit_name,
       c.name AS cycle_name,
       c.status AS cycle_status
     FROM invites i
     JOIN squads s ON s.id = i.squad_id
     JOIN business_units bu ON bu.id = s.business_unit_id
     JOIN cycles c ON c.id = i.cycle_id
     WHERE i.token_hash = $1`,
    [tokenHash]
  );

  if (!res.rows || res.rows.length === 0) {
    return { valid: false };
  }

  const row = res.rows[0];

  if (row.used) {
    return {
      valid: false,
      alreadyUsed: true,
      cycleName: row.cycle_name,
      squadName: row.squad_name,
    };
  }

  if (row.cycle_status !== 'open') {
    return {
      valid: false,
      cycleClosed: true,
      cycleName: row.cycle_name,
      squadName: row.squad_name,
    };
  }

  return {
    valid: true,
    cycleId: row.cycle_id,
    squadId: row.squad_id,
    squadName: row.squad_name,
    businessUnitName: row.unit_name,
    cycleName: row.cycle_name,
  };
}

/**
 * Executes survey submission via the SECURITY DEFINER function `submit_response`.
 */
export async function submitSurveyResponse(
  submission: SurveySubmission,
  db: DbClientInterface
): Promise<{ success: boolean; error?: string }> {
  const tokenHash = hashSurveyToken(submission.token);

  // Look up cycle_id and squad_id for the token
  const inviteRes = await db.query(
    `SELECT cycle_id, squad_id FROM invites WHERE token_hash = $1 AND used = FALSE`,
    [tokenHash]
  );

  if (!inviteRes.rows || inviteRes.rows.length === 0) {
    return { success: false, error: 'INVALID_OR_USED_TOKEN' };
  }

  const { cycle_id, squad_id } = inviteRes.rows[0];

  const submitRes = await db.query(
    `SELECT submit_response($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) AS result`,
    [
      tokenHash,
      cycle_id,
      squad_id,
      submission.q1 ?? null,
      submission.q2 ?? null,
      submission.q3 ?? null,
      submission.q4 ?? null,
      submission.q5 ?? null,
      submission.q6 ?? null,
      submission.comment ?? null,
    ]
  );

  const result = submitRes.rows[0]?.result;
  if (!result || !result.success) {
    return {
      success: false,
      error: result?.error || 'SUBMISSION_FAILED',
    };
  }

  return { success: true };
}
