export interface SquadExportData {
  squadName: string;
  businessUnit: string;
  hidden: boolean;
  responseCount?: number;
  averagePulse?: number;
  q1?: number;
  q2?: number;
  q3?: number;
  q4?: number;
  q5?: number;
  q6?: number;
  riskLevel?: string;
}

/**
 * Generates team-level CSV export.
 * Enforces privacy rule: Hidden groups (N < 5) are completely excluded from the export!
 */
export function generateTeamLevelCsv(
  squads: SquadExportData[],
  cycleName: string
): string {
  // Sort alphabetically by squad name (strict no-ranking invariant)
  const visibleSquads = squads
    .filter((s) => !s.hidden)
    .sort((a, b) => a.squadName.localeCompare(b.squadName));

  const headers = [
    'Squad',
    'Business Unit',
    'Respondents',
    'Average Pulse',
    'Q1 Work Purpose',
    'Q2 Operational Support',
    'Q3 Skill Growth',
    'Q4 Psychological Safety',
    'Q5 Workload Sustainability',
    'Q6 Team Advocacy',
    'Risk Level',
  ];

  const rows = visibleSquads.map((s) => [
    `"${s.squadName.replace(/"/g, '""')}"`,
    `"${s.businessUnit.replace(/"/g, '""')}"`,
    s.responseCount ?? '',
    s.averagePulse?.toFixed(2) ?? '',
    s.q1?.toFixed(2) ?? '',
    s.q2?.toFixed(2) ?? '',
    s.q3?.toFixed(2) ?? '',
    s.q4?.toFixed(2) ?? '',
    s.q5?.toFixed(2) ?? '',
    s.q6?.toFixed(2) ?? '',
    `"${s.riskLevel ?? ''}"`,
  ]);

  const csvContent = [
    `# PULSE TEAM-LEVEL AGGREGATE EXPORT - ${cycleName}`,
    '# Privacy Rule: Groups with fewer than 5 respondents are excluded by design',
    headers.join(','),
    ...rows.map((r) => r.join(',')),
  ].join('\r\n');

  return csvContent;
}
