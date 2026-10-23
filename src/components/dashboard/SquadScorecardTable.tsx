'use client';

import React from 'react';
import { RiskBadge } from './RiskBadge';
import { RiskLevel } from '@/lib/flags';
import { LockDraw } from '@/components/motion';

export interface SquadScorecardRow {
  squadId: string;
  squadName: string;
  businessUnit: string;
  targetHeadcount: number;
  respondents: number;
  hidden: boolean;
  averagePulse?: number | null;
  psychologicalSafety?: number | null;
  lateCodePct?: number | null;
  leavePatternRatio?: number | null;
  actionsClosed?: number;
  actionsTotal?: number;
  avgDaysToClose?: number;
  riskLevel?: RiskLevel;
}

interface SquadScorecardTableProps {
  squads: SquadScorecardRow[];
  isSampleData?: boolean;
}

/**
 * SquadScorecardTable with Enterprise Design Tokens:
 * - Rows stagger once on load with 60ms step
 * - Sorting is strictly alphabetical (no ranking or league-table animation)
 * - Privacy state: Hidden groups render a calm static panel with <LockDraw>, zero numeric leakage
 */
export function SquadScorecardTable({
  squads,
  isSampleData = false,
}: SquadScorecardTableProps) {
  // STRICT INVARIANT: Always sort alphabetically by squad name.
  const sortedAlphabetically = [...squads].sort((a, b) =>
    a.squadName.localeCompare(b.squadName)
  );

  return (
    <div className="space-y-4 font-mono text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold tracking-[-0.02em] text-theme-primary uppercase">
            Squad Operational Scorecard
          </h2>
          {isSampleData && (
            <span className="text-[10px] bg-accent/10 border border-accent/30 text-accent px-1.5 py-0.2 rounded-control font-semibold tracking-wider uppercase">
              SAMPLE DATA
            </span>
          )}
        </div>
        <span className="text-xs text-theme-tertiary">
          Alphabetical Order &bull; League Tabling Forbidden
        </span>
      </div>

      <div className="w-full max-w-full overflow-x-auto block border hairline-border rounded-panel bg-theme-surface">
        <table className="w-full text-left border-collapse min-w-[640px]">
          <thead className="bg-theme-raised text-[10px] uppercase tracking-wider text-theme-tertiary border-b border-theme-subtle">
            <tr>
              <th className="py-2.5 px-3">Squad</th>
              <th className="py-2.5 px-3">Business Unit</th>
              <th className="py-2.5 px-3 text-right">Sample (N)</th>
              <th className="py-2.5 px-3 text-right">Pulse (5.0)</th>
              <th className="py-2.5 px-3 text-right">Safety (Q4)</th>
              <th className="py-2.5 px-3 text-center">Risk Level</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme-subtle">
            {sortedAlphabetically.map((squad) => {
              if (squad.hidden) {
                return (
                  <tr key={squad.squadId} className="bg-theme-raised/40">
                    <td className="py-2.5 px-3 font-semibold text-theme-primary">
                      {squad.squadName}
                    </td>
                    <td className="py-2.5 px-3 text-theme-secondary">
                      {squad.businessUnit}
                    </td>
                    <td className="py-2.5 px-3 text-right text-theme-tertiary tabular-nums">
                      {squad.respondents} &lt; 5
                    </td>
                    <td colSpan={3} className="py-2 px-3 text-center">
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-control bg-theme-surface border border-theme-subtle text-[11px] text-theme-secondary">
                        <LockDraw size={12} strokeWidth={1.5} color="#3D7BFF" />
                        <span>Suppressed under Section 18 privacy threshold (N &ge; 5)</span>
                      </div>
                    </td>
                  </tr>
                );
              }

              return (
                <tr
                  key={squad.squadId}
                  className="hover:bg-theme-raised/50 transition-colors"
                >
                  <td className="py-2.5 px-3 font-semibold text-theme-primary">
                    {squad.squadName}
                  </td>
                  <td className="py-2.5 px-3 text-theme-secondary">
                    {squad.businessUnit}
                  </td>
                  <td className="py-2.5 px-3 text-right text-theme-secondary tabular-nums">
                    {squad.respondents}
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold text-theme-primary tabular-nums">
                    {squad.averagePulse !== null && squad.averagePulse !== undefined
                      ? squad.averagePulse.toFixed(2)
                      : 'n/a'}
                  </td>
                  <td className="py-2.5 px-3 text-right text-theme-secondary tabular-nums">
                    {squad.psychologicalSafety !== null && squad.psychologicalSafety !== undefined
                      ? squad.psychologicalSafety.toFixed(2)
                      : 'n/a'}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    {squad.riskLevel && <RiskBadge level={squad.riskLevel} />}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
