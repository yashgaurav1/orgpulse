import { DbClientInterface } from './survey-service';

export type UserRole = 'delivery_manager' | 'delivery_director' | 'hrbp' | 'pilot_lead' | 'ld_lead';

export interface AuthContext {
  userId: string;
  role: UserRole;
  assignedSquadId?: string; // For delivery manager
  assignedBusinessUnitId?: string; // For delivery director or HRBP
}

export interface AuditLogEntry {
  actorId: string;
  actorRole: UserRole | 'system';
  targetGroupId?: string;
  cycleId?: string;
  action: string;
}

/**
 * Appends an audit event to the append-only audit_log table.
 */
export async function logAuditEvent(
  entry: AuditLogEntry,
  db: DbClientInterface
): Promise<void> {
  try {
    await db.query(
      `INSERT INTO audit_log (actor_id, actor_role, target_group_id, cycle_id, action)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        entry.actorId,
        entry.actorRole,
        entry.targetGroupId || null,
        entry.cycleId || null,
        entry.action,
      ]
    );
  } catch (err: any) {
    // Audit write failures should be logged safely
    // eslint-disable-next-line no-console
    console.error(`[AUDIT_FAILURE] ${err.message}`);
  }
}

/**
 * Verifies that the authenticated actor is authorized to read squad results.
 * Strictly prevents Manager A from accessing Manager B's squad.
 */
export async function authorizeSquadRead(
  auth: AuthContext,
  squadId: string,
  db: DbClientInterface
): Promise<{ authorized: boolean; reason?: string }> {
  // Pilot leads and HRBPs have authorized access to squad aggregates
  if (auth.role === 'pilot_lead' || auth.role === 'hrbp') {
    return { authorized: true };
  }

  // Delivery managers can only access their own squad
  if (auth.role === 'delivery_manager') {
    const res = await db.query(
      `SELECT manager_user_id FROM squads WHERE id = $1`,
      [squadId]
    );
    if (!res.rows || res.rows.length === 0) {
      return { authorized: false, reason: 'SQUAD_NOT_FOUND' };
    }
    const squadManagerId = res.rows[0].manager_user_id;
    if (squadManagerId !== auth.userId && auth.assignedSquadId !== squadId) {
      // Record unauthorized attempt in audit log
      await logAuditEvent(
        {
          actorId: auth.userId,
          actorRole: auth.role,
          targetGroupId: squadId,
          action: 'UNAUTHORIZED_SQUAD_READ_ATTEMPT',
        },
        db
      );
      return { authorized: false, reason: 'FORBIDDEN_NOT_SQUAD_MANAGER' };
    }
    return { authorized: true };
  }

  // Delivery directors can only access squads in their business unit
  if (auth.role === 'delivery_director') {
    const res = await db.query(
      `SELECT s.id 
       FROM squads s
       JOIN business_units bu ON bu.id = s.business_unit_id
       WHERE s.id = $1 AND (bu.director_user_id = $2 OR bu.id = $3)`,
      [squadId, auth.userId, auth.assignedBusinessUnitId]
    );
    if (!res.rows || res.rows.length === 0) {
      await logAuditEvent(
        {
          actorId: auth.userId,
          actorRole: auth.role,
          targetGroupId: squadId,
          action: 'UNAUTHORIZED_DIRECTOR_SQUAD_READ_ATTEMPT',
        },
        db
      );
      return { authorized: false, reason: 'FORBIDDEN_NOT_UNIT_DIRECTOR' };
    }
    return { authorized: true };
  }

  return { authorized: false, reason: 'ROLE_NOT_AUTHORIZED_FOR_SQUADS' };
}
