import { generateSurveyToken } from './tokens';

export interface CsvInviteRow {
  email: string;
  squadName: string;
}

export interface ProcessInviteResult {
  totalProcessed: number;
  invitesCreated: number;
  errors: string[];
}

/**
 * Parses CSV text with headers 'email,squad_name' (or 'email,squad').
 */
export function parseInviteCsv(csvContent: string): CsvInviteRow[] {
  const lines = csvContent
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length <= 1) {
    return [];
  }

  const header = lines[0].toLowerCase().split(',').map((h) => h.trim());
  const emailIdx = header.findIndex((h) => h === 'email');
  const squadIdx = header.findIndex((h) => h === 'squad' || h === 'squad_name' || h === 'team');

  if (emailIdx === -1 || squadIdx === -1) {
    throw new Error("CSV must include 'email' and 'squad_name' header columns");
  }

  const rows: CsvInviteRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(',').map((p) => p.trim());
    if (parts.length > Math.max(emailIdx, squadIdx)) {
      const email = parts[emailIdx];
      const squadName = parts[squadIdx];
      if (email && squadName) {
        rows.push({ email, squadName });
      }
    }
  }

  return rows;
}

/**
 * Generates invites in database and dispatches single-use survey links.
 * Employs zero-persistence rule for email addresses:
 * Emails are used strictly in memory for dispatch and are immediately dropped.
 */
export async function processInvitesBatch(
  csvContent: string,
  cycleId: string,
  squadLookup: Map<string, string>, // squadName (lowercase) -> squad_id
  dbClient: {
    query: (sql: string, params: any[]) => Promise<any>;
  },
  sendEmailFn: (email: string, surveyLink: string) => Promise<boolean>,
  baseUrl = 'https://pulse.company.internal'
): Promise<ProcessInviteResult> {
  const rows = parseInviteCsv(csvContent);
  const errors: string[] = [];
  let invitesCreated = 0;

  for (const row of rows) {
    const squadId = squadLookup.get(row.squadName.toLowerCase().trim());
    if (!squadId) {
      errors.push(`Unknown squad: "${row.squadName}" for invite ${row.email.substring(0, 3)}***`);
      continue;
    }

    // 1. Generate 32-byte cryptographic token
    const { rawToken, tokenHash } = generateSurveyToken();

    // 2. Insert token_hash into invites table (NO email stored)
    try {
      await dbClient.query(
        `INSERT INTO invites (cycle_id, squad_id, token_hash) VALUES ($1, $2, $3)`,
        [cycleId, squadId, tokenHash]
      );
      invitesCreated++;
    } catch (err: any) {
      errors.push(`Failed to register invite token: ${err.message}`);
      continue;
    }

    // 3. Dispatch email with link containing rawToken
    const surveyLink = `${baseUrl}/survey/${rawToken}`;
    try {
      await sendEmailFn(row.email, surveyLink);
    } catch (err: any) {
      errors.push(`Email delivery failed: ${err.message}`);
    }
    // Note: row.email leaves scope here and is garbage-collected. Never persisted.
  }

  return {
    totalProcessed: rows.length,
    invitesCreated,
    errors,
  };
}
