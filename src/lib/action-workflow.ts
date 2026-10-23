import { DbClientInterface } from './survey-service';
import { CreateActionInput, UpdateActionInput, ActionItem } from '../types/actions-and-indicators';
import { ActiveTrigger } from './flags';

/**
 * Creates an action row based on an active warning trigger from the playbook.
 */
export async function createActionFromTrigger(
  squadId: string,
  cycleId: string,
  trigger: ActiveTrigger,
  db: DbClientInterface
): Promise<string> {
  // Compute target due date in business days
  const res = await db.query(
    `INSERT INTO actions (
       squad_id, cycle_id, trigger_name, likely_cause, response_plan, owner_role, due_date, status
     )
     VALUES ($1, $2, $3, $4, $5, $6, CURRENT_DATE + ($7 || ' days')::interval, 'Open')
     RETURNING id`,
    [
      squadId,
      cycleId,
      trigger.item,
      trigger.likelyCause,
      trigger.responsePlan,
      trigger.ownerRole,
      trigger.dueDays.toString(),
    ]
  );

  return res.rows[0].id;
}

/**
 * Updates an action item's status and manager notes.
 */
export async function updateActionStatus(
  input: UpdateActionInput,
  db: DbClientInterface
): Promise<boolean> {
  const res = await db.query(
    `UPDATE actions
     SET status = $1, notes = COALESCE($2, notes), updated_at = NOW()
     WHERE id = $3
     RETURNING id`,
    [input.status, input.notes || null, input.actionId]
  );

  return res.rows && res.rows.length > 0;
}

/**
 * Retrieves all actions for a squad, computing overdue status.
 */
export async function getSquadActions(
  squadId: string,
  cycleId: string,
  db: DbClientInterface
): Promise<{
  actions: ActionItem[];
  closedCount: number;
  totalCount: number;
  overdueCount: number;
  completionRatePct: number;
}> {
  const res = await db.query(
    `SELECT 
       id,
       squad_id,
       cycle_id,
       trigger_name,
       likely_cause,
       response_plan,
       owner_role,
       to_char(due_date, 'YYYY-MM-DD') AS due_date,
       status,
       notes,
       (CURRENT_DATE > due_date AND status NOT IN ('Done')) AS is_overdue,
       (due_date - CURRENT_DATE) AS days_remaining,
       created_at,
       updated_at
     FROM actions
     WHERE squad_id = $1 AND cycle_id = $2
     ORDER BY created_at DESC`,
    [squadId, cycleId]
  );

  const actions: ActionItem[] = (res.rows || []).map((r: any) => ({
    id: r.id,
    squadId: r.squad_id,
    cycleId: r.cycle_id,
    triggerName: r.trigger_name,
    likelyCause: r.likely_cause,
    responsePlan: r.response_plan,
    ownerRole: r.owner_role,
    dueDate: r.due_date,
    status: r.status,
    notes: r.notes || '',
    isOverdue: Boolean(r.is_overdue),
    daysToDueOrClose: r.days_remaining,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  }));

  const closedCount = actions.filter((a) => a.status === 'Done').length;
  const totalCount = actions.length;
  const overdueCount = actions.filter((a) => a.isOverdue).length;
  const completionRatePct = totalCount > 0 ? Math.round((closedCount / totalCount) * 100) : 0;

  return {
    actions,
    closedCount,
    totalCount,
    overdueCount,
    completionRatePct,
  };
}

/**
 * Checks manager follow-through compliance:
 * Managers must record an action plan within 14 days of results being released.
 */
export function isActionPlanOverdue(
  cycleEndDate: string | Date,
  actionPlanLogged: boolean,
  currentDate: Date = new Date()
): { isOverdue: boolean; daysElapsed: number } {
  const end = new Date(cycleEndDate).getTime();
  const now = currentDate.getTime();
  const daysElapsed = Math.floor((now - end) / (1000 * 60 * 60 * 24));

  if (!actionPlanLogged && daysElapsed > 14) {
    return { isOverdue: true, daysElapsed };
  }
  return { isOverdue: false, daysElapsed };
}
