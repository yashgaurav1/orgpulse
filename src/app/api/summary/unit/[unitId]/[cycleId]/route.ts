import { NextRequest, NextResponse } from 'next/server';
import { getBuCommentSummary } from '@/lib/gemini-summary';
import { supabaseServer } from '@/lib/supabase-server';
import { safeLog } from '@/lib/logger';

interface RouteContext {
  params: {
    unitId: string;
    cycleId: string;
  };
}

export async function GET(req: NextRequest, { params }: RouteContext) {
  try {
    const { unitId, cycleId } = params;

    // Database client adapter using Supabase server client
    const dbAdapter = {
      query: async (sql: string, sqlParams: any[] = []) => {
        // In full Postgres we run SQL queries directly; for Supabase we can call rpc or raw query
        // Let's implement an adapter that bridges to the SECURITY DEFINER functions or RPC
        if (sql.includes('summary_cache')) {
          const { data, error } = await supabaseServer
            .from('summary_cache')
            .select('summary_text')
            .eq('business_unit_id', unitId)
            .eq('cycle_id', cycleId)
            .maybeSingle();

          if (error) {
            safeLog.warn(`Cache lookup error: ${error.message}`);
            return { rows: [] };
          }
          return { rows: data ? [data] : [] };
        }

        if (sql.includes('get_bu_comments_for_summary')) {
          const { data, error } = await supabaseServer.rpc('get_bu_comments_for_summary', {
            p_unit_id: unitId,
            p_cycle_id: cycleId,
          });

          if (error) {
            throw new Error(error.message);
          }
          return { rows: [{ data }] };
        }

        // Default empty rows for unhandled queries
        return { rows: [] };
      },
    };

    const result = await getBuCommentSummary(unitId, cycleId, dbAdapter);

    return NextResponse.json(result);
  } catch (err: any) {
    safeLog.error('Error generating BU AI comment summary');
    return NextResponse.json(
      {
        allowed: false,
        source: 'disabled',
        themes: [],
        neutralQuestion: '',
        label: 'Summary could not be loaded at this time.',
        reason: 'SERVER_ERROR',
      },
      { status: 500 }
    );
  }
}
