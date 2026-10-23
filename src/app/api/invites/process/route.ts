import { NextRequest, NextResponse } from 'next/server';
import { processInvitesBatch } from '@/lib/invites';
import { sendSurveyInviteEmail } from '@/lib/email-service';
import { getDbClient } from '@/lib/db-provider';
import { safeLog } from '@/lib/logger';

export async function POST(req: NextRequest) {
  try {
    const { csvContent, cycleId } = await req.json();

    if (!csvContent || typeof csvContent !== 'string') {
      return NextResponse.json(
        { success: false, error: 'CSV_CONTENT_REQUIRED' },
        { status: 400 }
      );
    }

    const db = await getDbClient();

    // 1. Resolve open cycle if not provided
    let targetCycleId = cycleId;
    if (!targetCycleId) {
      const cycleRes = await db.query(
        `SELECT id FROM cycles WHERE status = 'open' ORDER BY start_date DESC LIMIT 1`
      );
      if (!cycleRes.rows || cycleRes.rows.length === 0) {
        return NextResponse.json(
          { success: false, error: 'NO_OPEN_CYCLE_FOUND' },
          { status: 400 }
        );
      }
      targetCycleId = cycleRes.rows[0].id;
    }

    // 2. Fetch squad lookups
    const squadsRes = await db.query(`SELECT id, name FROM squads`);
    const squadLookup = new Map<string, string>();
    for (const sq of squadsRes.rows) {
      squadLookup.set(sq.name.toLowerCase().trim(), sq.id);
      // Support shorthand aliases e.g. "Squad A" for "Squad A (FinTech)"
      const alias = sq.name.split('(')[0].toLowerCase().trim();
      if (alias) squadLookup.set(alias, sq.id);
    }

    // 3. Process invites batch with zero email persistence
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const result = await processInvitesBatch(
      csvContent,
      targetCycleId,
      squadLookup,
      db,
      async (email, link) => {
        return await sendSurveyInviteEmail(email, link);
      },
      baseUrl
    );

    safeLog.info(`Dispatched ${result.invitesCreated} anonymous survey invites`);

    return NextResponse.json({
      success: true,
      invitesCreated: result.invitesCreated,
      totalProcessed: result.totalProcessed,
      errors: result.errors,
      message: `Successfully generated ${result.invitesCreated} single-use invite tokens. Check terminal in dev mode.`,
    });
  } catch (err: any) {
    safeLog.error('Unexpected error processing invites CSV');
    return NextResponse.json(
      { success: false, error: 'SERVER_ERROR', message: err.message },
      { status: 500 }
    );
  }
}
