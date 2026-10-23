import { DbClientInterface } from './survey-service';
import { safeLog } from './logger';

export interface RetentionPurgeResult {
  success: boolean;
  deletedResponses: number;
  deletedInvites: number;
  cutoffDate?: string;
  error?: string;
}

/**
 * Executes the automated data retention purge job.
 * Section 7 Rule 6: Deletes raw responses, comments, and invites 90 days after cycle closes,
 * preserving aggregated squad-level historical trends.
 */
export async function executeRetentionPurge(
  retentionDays = 90,
  db: DbClientInterface
): Promise<RetentionPurgeResult> {
  try {
    const res = await db.query(`SELECT run_retention_purge($1) AS result`, [retentionDays]);
    const data = res.rows[0]?.result;

    if (!data || !data.success) {
      throw new Error('Database retention function failed');
    }

    safeLog.info(
      `Retention job completed. Deleted ${data.deleted_responses} responses and ${data.deleted_invites} invites.`
    );

    return {
      success: true,
      deletedResponses: data.deleted_responses ?? 0,
      deletedInvites: data.deleted_invites ?? 0,
      cutoffDate: data.cutoff_date,
    };
  } catch (err: any) {
    safeLog.error(`Retention purge execution failed: ${err.message}`);
    return {
      success: false,
      deletedResponses: 0,
      deletedInvites: 0,
      error: err.message,
    };
  }
}
