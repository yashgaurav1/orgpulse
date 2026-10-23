'use client';

import React from 'react';
import { ScrollProgress } from '@/components/motion';
import { StatusBadge } from '@/components/enterprise/StatusBadge';
import { Calendar, CheckCircle2 } from 'lucide-react';

const PILOT_PHASES = [
  {
    days: '1–15',
    phase: 'Preparation and Baseline Alignment',
    deliverables: 'Build survey instrument; manager training workshops; publish employee privacy notices; legal review',
    owners: 'Pilot lead, HRBP',
    outcome: '12 delivery managers trained on interview and psychological safety protocols',
  },
  {
    days: '16–45',
    phase: 'Initial Pulse and Stay Dialogues',
    deliverables: 'Run first pulse (baseline); aggregate squad scores; initiate stay interviews across pilot delivery squads',
    owners: 'Delivery leads, engineering managers',
    outcome: 'Response-rate target met; top two systemic delivery blockers identified',
  },
  {
    days: '46–75',
    phase: 'Action and Retrospectives',
    deliverables: 'Sprint backlog adjustments; blameless defect retrospectives; skip-level conversations with directors',
    owners: 'Project managers, delivery director',
    outcome: 'Most logged actions resolved within targeted due dates',
  },
  {
    days: '76–90',
    phase: 'Evaluation and Review',
    deliverables: 'Follow-up pulse; compare period-over-period movement; present findings deck to executive leadership',
    owners: 'Delivery lead, lead HRBP',
    outcome: 'Comprehensive findings deck for decision to continue, adjust, or expand rollout',
  },
];

const PILOT_TARGETS = [
  {
    measure: 'Survey Participation Rate',
    target: '80% or more of eligible pilot engineers',
    notes: 'Starting benchmark to calibrate in pilot; response rate tracks voluntary engagement without coercion.',
  },
  {
    measure: 'Action Plan Follow-Through',
    target: '75% of logged actions closed within 21 days',
    notes: 'Managers log response plan within 14 days of results release; overdue actions escalate to HRBP.',
  },
  {
    measure: 'Internal Mobility Interest',
    target: 'Internal transfer applications up from measured baseline',
    notes: 'Measures employee belief that career progression is achievable within the firm.',
  },
  {
    measure: 'Average Pulse Score',
    target: 'Statistically sound improvement over measured baseline',
    notes: 'Baseline established in Cycle 1. No comparison permitted with past unvalidated instruments.',
  },
];

export default function PilotPlanPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16 text-theme-primary">
      <ScrollProgress />

      {/* Header */}
      <header className="border-b border-theme-subtle pb-6 space-y-2">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs uppercase tracking-wider text-accent font-semibold">
            Execution Roadmap
          </span>
          <StatusBadge label="Stage-Gate Governance" variant="accent" size="sm" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-[-0.02em] text-theme-primary leading-tight">
          90-Day Operational Pilot Plan
        </h1>
        <p className="font-mono text-xs text-theme-secondary">
          Stage-gate timeline for 100-person rollout across engineering delivery squads
        </p>
      </header>

      {/* Phased Roadmap Grid */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-[0.04em] text-theme-tertiary font-mono">
          Rollout Timeline (Days 1–90)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PILOT_PHASES.map((phase) => (
            <div
              key={phase.days}
              className="p-5 rounded-panel bg-theme-surface border hairline-border space-y-3"
            >
              <div className="flex items-center justify-between pb-2 border-b border-theme-subtle">
                <span className="px-2 py-0.5 rounded-control bg-accent/10 text-accent font-mono text-xs font-semibold">
                  Days {phase.days}
                </span>
                <span className="text-[11px] font-mono text-theme-tertiary">
                  {phase.owners}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-theme-primary mb-1">
                  {phase.phase}
                </h3>
                <p className="text-xs text-theme-secondary font-sans leading-relaxed">
                  {phase.deliverables}
                </p>
              </div>

              <div className="pt-2 border-t border-theme-subtle flex items-start gap-2 text-xs font-mono text-success">
                <CheckCircle2 size={13} className="mt-0.5 flex-shrink-0" />
                <span>Target: {phase.outcome}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Success Metrics Table */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-[0.04em] text-theme-tertiary font-mono">
          Stage-Gate Calibration Targets
        </h2>

        <div className="rounded-panel bg-theme-surface border hairline-border overflow-hidden">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-theme-raised text-[10px] uppercase tracking-wider text-theme-tertiary border-b border-theme-subtle">
              <tr>
                <th className="px-4 py-3">Measure</th>
                <th className="px-4 py-3">Pilot Target</th>
                <th className="px-4 py-3">Governance Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme-subtle">
              {PILOT_TARGETS.map((target) => (
                <tr key={target.measure} className="hover:bg-theme-raised/50 transition-colors">
                  <td className="px-4 py-3 font-semibold text-theme-primary">
                    {target.measure}
                  </td>
                  <td className="px-4 py-3 text-accent font-medium">
                    {target.target}
                  </td>
                  <td className="px-4 py-3 text-theme-secondary font-sans text-xs">
                    {target.notes}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
