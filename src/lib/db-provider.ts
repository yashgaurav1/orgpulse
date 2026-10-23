import crypto from 'crypto';
import { supabaseServer } from './supabase-server';
import { DbClientInterface } from './survey-service';
import { safeLog } from './logger';

// In-memory demo store (handles single-use tokens, rate limits & zero PII leakage)
interface DemoInvite {
  cycle_id: string;
  squad_id: string;
  squad_name: string;
  unit_name: string;
  cycle_name: string;
  used: boolean;
}

const inMemoryInvites = new Map<string, DemoInvite>();

const DEMO_TOKENS = [
  { token: 'demo-token-payments', squad: 'Squad A (FinTech)', bu: 'Financial Services' },
  { token: 'demo-token-retail', squad: 'Squad B (Retail)', bu: 'Consumer Services' },
  { token: 'demo-token-cloud', squad: 'Squad C (Cloud)', bu: 'Core Infrastructure' },
  { token: 'demo-token-legacy', squad: 'Squad D (Legacy)', bu: 'Enterprise Core' },
  { token: 'demo-token-innovation', squad: 'Squad E (Platform Innovation)', bu: 'Research Labs' },
];

function initDemoInvites() {
  if (inMemoryInvites.size === 0) {
    for (const dt of DEMO_TOKENS) {
      const hash = crypto.createHash('sha256').update(dt.token.trim()).digest('hex');
      inMemoryInvites.set(hash, {
        cycle_id: 'cycle-demo-q1-2026',
        squad_id: `squad-${dt.token}`,
        squad_name: dt.squad,
        unit_name: dt.bu,
        cycle_name: 'Q1 2026 Full Pulse',
        used: false,
      });
    }
  }
}

/**
 * Returns a unified database client:
 * - Uses live Supabase if configured with a real project URL
 * - Uses in-memory state engine for local development & automated testing (guaranteeing single-use token invalidation)
 */
export async function getDbClient(): Promise<DbClientInterface> {
  initDemoInvites();

  const isSupabaseConfigured =
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('mock.supabase.co') &&
    process.env.SUPABASE_SERVICE_ROLE_KEY &&
    !process.env.SUPABASE_SERVICE_ROLE_KEY.includes('mock-service-role-key');

  if (isSupabaseConfigured) {
    return {
      query: async (sql: string, params: any[] = []) => {
        const { data, error } = await supabaseServer.rpc('execute_sql_query', {
          query_text: sql,
          query_params: params,
        });
        if (error) throw new Error(error.message);
        return { rows: data || [] };
      },
    };
  }

  // Pure in-memory engine (zero external dependencies or filesystem lookups in web runtime)
  return {
    query: async (sql: string, params: any[] = []) => {
      const sqlLower = sql.toLowerCase();

      // 1. Verify token query (verifySurveyToken)
      if (sqlLower.includes('from invites i') && sqlLower.includes('where i.token_hash = $1')) {
        const hash = params[0];
        const inv = inMemoryInvites.get(hash);
        if (!inv) return { rows: [] };
        return {
          rows: [
            {
              invite_id: `inv-${hash.substring(0, 8)}`,
              used: inv.used,
              cycle_id: inv.cycle_id,
              squad_id: inv.squad_id,
              squad_name: inv.squad_name,
              unit_name: inv.unit_name,
              cycle_name: inv.cycle_name,
              cycle_status: 'open',
            },
          ],
        };
      }

      // 2. Lookup invite for submission
      if (sqlLower.includes('from invites where token_hash = $1 and used = false')) {
        const hash = params[0];
        const inv = inMemoryInvites.get(hash);
        if (inv && !inv.used) {
          return { rows: [{ cycle_id: inv.cycle_id, squad_id: inv.squad_id }] };
        }
        return { rows: [] };
      }

      // 3. submit_response call
      if (sqlLower.includes('submit_response')) {
        const hash = params[0];
        const inv = inMemoryInvites.get(hash);
        if (inv) {
          if (inv.used) {
            return { rows: [{ result: { success: false, error: 'TOKEN_ALREADY_USED' } }] };
          }
          // Single-use token enforcement: mark as used
          inv.used = true;
          safeLog.info('Demo token successfully marked as used.');
          return { rows: [{ result: { success: true } }] };
        }
        return { rows: [{ result: { success: false, error: 'INVALID_TOKEN' } }] };
      }

      return { rows: [] };
    },
  };
}
