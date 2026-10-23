'use client';

import React, { useState } from 'react';
import {
  Users,
  ChevronDown,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  TrendingDown,
  Lock,
  Layers,
  FileText,
  RotateCcw,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/components/enterprise/EnterpriseToast';
import { StatusBadge } from '@/components/enterprise/StatusBadge';
import { KpiStatTile } from '@/components/enterprise/KpiStatTile';
import { CopyId } from '@/components/enterprise/CopyId';
import { RelativeTime } from '@/components/enterprise/RelativeTime';
import { PrivacyPanel } from '@/components/ui/PrivacyPanel';
import {
  ENTERPRISE_SQUADS,
  ENTERPRISE_CYCLES,
  EnterpriseSquad,
  SquadCycleData,
} from '@/lib/enterprise-data';

export default function ManagerDashboardPage() {
  const { toast } = useToast();

  // State: 10 squad dataset toggles
  const [selectedSquadId, setSelectedSquadId] = useState<string>('squad-01');
  const [selectedCycleId, setSelectedCycleId] = useState<string>('cycle-2026-q1');
  const [showPreviousDelta, setShowPreviousDelta] = useState<boolean>(true);

  // Dynamic local storage of committed actions per squad
  const [squadsData, setSquadsData] = useState<EnterpriseSquad[]>(ENTERPRISE_SQUADS);

  // 14-day action form input
  const [actionInput, setActionInput] = useState('');
  const [actionDomain, setActionDomain] = useState('Workload');
  const [isSubmittingAction, setIsSubmittingAction] = useState(false);

  // Selected squad and cycle data
  const currentSquad = squadsData.find((s) => s.id === selectedSquadId) || squadsData[0];
  const cycleData: SquadCycleData =
    currentSquad.cycles[selectedCycleId] || currentSquad.cycles['cycle-2026-q1'];

  const isSuppressed = cycleData.respondents < 5;

  // Active triggers calculation
  const triggers: { code: string; domain: string; reason: string; recommendation: string }[] = [];
  if (!isSuppressed && cycleData.items) {
    cycleData.items.forEach((item) => {
      if (item.code === 'Q5' && item.mean !== null && item.mean < 3.0) {
        triggers.push({
          code: item.code,
          domain: 'Sustainable Workload',
          reason: `Item 5 mean is ${item.mean.toFixed(2)} (< 3.00 critical threshold).`,
          recommendation: 'Conduct sprint load re-estimation. Do not demand overtime; reduce committed story points with product partner.',
        });
      }
      if (item.code === 'Q4' && item.mean !== null && item.mean < 3.2) {
        triggers.push({
          code: item.code,
          domain: 'Psychological Safety',
          reason: `Item 4 mean is ${item.mean.toFixed(2)} (< 3.20 baseline threshold).`,
          recommendation: 'Schedule an external blameless retrospective. Audit PR review tone and incident escalation procedures.',
        });
      }
      if (item.mean !== null && item.previousMean !== null && item.previousMean - item.mean >= 0.4) {
        triggers.push({
          code: item.code,
          domain: item.domain,
          reason: `${item.domain} experienced a sharp drop of ${(item.previousMean - item.mean).toFixed(2)} vs prior cycle.`,
          recommendation: 'Initiate 1-on-1 stay interviews to understand underlying friction before senior resignations occur.',
        });
      }
    });
  }

  // Handle logging a 14-day action commitment
  const handleCommitAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!actionInput.trim()) return;

    setIsSubmittingAction(true);

    setTimeout(() => {
      const now = new Date();
      const dueDate = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);

      const updated = squadsData.map((sq) => {
        if (sq.id === selectedSquadId) {
          const updatedCycle = { ...sq.cycles[selectedCycleId] };
          updatedCycle.status = 'Action Plan Committed';
          updatedCycle.statusVariant = 'accent';
          updatedCycle.actionCommitted = {
            domain: actionDomain,
            action: actionInput.trim(),
            committedAt: now.toISOString(),
            dueDate: dueDate.toISOString(),
            status: 'In Progress',
            owner: sq.leadManager,
          };
          return {
            ...sq,
            cycles: { ...sq.cycles, [selectedCycleId]: updatedCycle },
          };
        }
        return sq;
      });

      setSquadsData(updated);
      setIsSubmittingAction(false);
      setActionInput('');

      toast({
        type: 'success',
        title: '14-Day Action Committed',
        message: `Plan logged for ${currentSquad.name}. Due on ${dueDate.toISOString().split('T')[0]}.`,
      });
    }, 250);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Top Header & Context */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-theme-subtle">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase tracking-[0.04em] text-accent font-semibold">
              Operations • Delivery Squad Workspace
            </span>
            <CopyId id={currentSquad.code} />
          </div>
          <h1 className="text-2xl font-semibold tracking-[-0.02em] text-theme-primary mt-1">
            {currentSquad.name}
          </h1>
          <p className="text-xs text-theme-secondary font-sans mt-0.5">
            Business Unit: {currentSquad.businessUnit} • {currentSquad.description} • Led by {currentSquad.leadManager}
          </p>
        </div>

        {/* Global Selectors & Toggles */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          {/* Squad Selector Dropdown (All 10 Squads) */}
          <div className="relative">
            <select
              value={selectedSquadId}
              onChange={(e) => setSelectedSquadId(e.target.value)}
              className="h-9 px-3 pr-8 bg-theme-surface border hairline-border rounded-control text-xs text-theme-primary font-mono focus-ring cursor-pointer appearance-none shadow-xs"
            >
              {squadsData.map((squad) => (
                <option key={squad.id} value={squad.id}>
                  {squad.name} {squad.cycles['cycle-2026-q1'].respondents < 5 ? '(N < 5 Shield)' : ''}
                </option>
              ))}
            </select>
            <ChevronDown
              size={13}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-theme-tertiary pointer-events-none"
            />
          </div>

          {/* Cycle Selector Dropdown (4 Historical Cycles) */}
          <div className="relative">
            <select
              value={selectedCycleId}
              onChange={(e) => setSelectedCycleId(e.target.value)}
              className="h-9 px-3 pr-8 bg-theme-surface border hairline-border rounded-control text-xs text-theme-secondary font-mono focus-ring cursor-pointer appearance-none shadow-xs"
            >
              {ENTERPRISE_CYCLES.map((cycle) => (
                <option key={cycle.id} value={cycle.id}>
                  {cycle.name}
                </option>
              ))}
            </select>
            <Calendar
              size={13}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-theme-tertiary pointer-events-none"
            />
          </div>

          {/* Delta Toggle */}
          <button
            onClick={() => setShowPreviousDelta(!showPreviousDelta)}
            className={`h-9 px-3 rounded-control border hairline-border transition-colors duration-100 flex items-center gap-1.5 focus-ring ${
              showPreviousDelta
                ? 'bg-accent/10 border-accent/30 text-accent font-medium'
                : 'bg-theme-surface text-theme-secondary hover:text-theme-primary'
            }`}
          >
            <span>Deltas: {showPreviousDelta ? 'On' : 'Off'}</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Metrics Tiles (4 Tiles) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiStatTile
          label="Overall Pulse Score"
          value={cycleData.overallScore || 0}
          format="score"
          suppressed={isSuppressed}
          delta={
            showPreviousDelta && cycleData.overallScore && cycleData.previousOverallScore
              ? Number(
                  (
                    ((cycleData.overallScore - cycleData.previousOverallScore) /
                      cycleData.previousOverallScore) *
                    100
                  ).toFixed(1)
                )
              : undefined
          }
          deltaLabel="vs previous cycle"
          sparklineData={cycleData.sparklineHistory}
        />

        <KpiStatTile
          label="Squad Participation"
          value={cycleData.participationPct}
          format="percent"
          delta={
            isSuppressed
              ? undefined
              : cycleData.respondents === cycleData.headcount
              ? 0
              : -8.3
          }
          deltaLabel={`${cycleData.respondents} of ${cycleData.headcount} responded`}
          sparklineData={[75, 80, 85, cycleData.participationPct]}
        />

        <KpiStatTile
          label="Psychological Safety (Q4)"
          value={
            isSuppressed
              ? 0
              : cycleData.items.find((i) => i.code === 'Q4')?.mean || 0
          }
          format="score"
          suppressed={isSuppressed}
          deltaLabel="Org baseline: 3.85"
          sparklineData={[3.8, 3.9, 4.0, cycleData.items.find((i) => i.code === 'Q4')?.mean || 3.8]}
        />

        <KpiStatTile
          label="14-Day Action Commitment"
          value={cycleData.actionCommitted ? 100 : 0}
          format="percent"
          suppressed={isSuppressed}
          deltaLabel={
            cycleData.actionCommitted
              ? `Status: ${cycleData.actionCommitted.status}`
              : 'Action Pending'
          }
          sparklineData={[50, 75, 100, cycleData.actionCommitted ? 100 : 0]}
        />
      </div>

      {/* Main Diagnostic Body */}
      {isSuppressed ? (
        /* Strict Section 18 Privacy Shield when N < 5 */
        <div className="p-8 rounded-panel bg-theme-surface border hairline-border space-y-4">
          <PrivacyPanel
            title="Privacy Guard Active: Squad Results Suppressed"
            description="Participation for this squad (N=3) is below the non-negotiable anonymity threshold (N ≥ 5). To eliminate deanonymization risks and protect individual team members, all scores, breakdown charts, and qualitative remarks are mathematically suppressed from both the DOM and API responses."
          />
          <div className="pt-4 border-t border-theme-subtle flex items-center justify-between text-xs font-mono text-theme-tertiary">
            <span>Minimum Group Protection Invariant: COUNT(r.id) &gt;= 5</span>
            <span>Zero Numeric Storage</span>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Domain Score Bars (7 cols) */}
          <div className="lg:col-span-7 p-6 rounded-panel bg-theme-surface border hairline-border space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-theme-subtle">
              <div className="flex items-center gap-2">
                <StatusBadge label={cycleData.status} variant={cycleData.statusVariant} live={cycleData.status === 'Healthy Baseline'} />
                <span className="text-xs font-mono font-semibold text-theme-primary">
                  Diagnostic Domain Breakdown
                </span>
              </div>
              <span className="text-[11px] font-mono text-theme-tertiary">
                Org Baseline: 3.85 / 5.00
              </span>
            </div>

            {/* Score bars list */}
            <div className="space-y-4">
              {cycleData.items.map((item) => {
                const val = item.mean || 0;
                const prev = item.previousMean;
                const delta = prev !== null && showPreviousDelta ? val - prev : null;
                const pct = (val / 5.0) * 100;
                const isUnderperforming = val < 3.2;

                return (
                  <div key={item.code} className="space-y-1.5 font-mono text-xs">
                    <div className="flex items-baseline justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-accent font-semibold">{item.code}</span>
                        <span className="text-theme-primary font-medium">{item.domain}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        {delta !== null && (
                          <span
                            className={`text-[11px] font-mono tabular-nums ${
                              delta > 0
                                ? 'text-success'
                                : delta < 0
                                ? 'text-danger'
                                : 'text-theme-tertiary'
                            }`}
                          >
                            {delta > 0 ? `+${delta.toFixed(2)}` : delta.toFixed(2)}
                          </span>
                        )}
                        <span className="font-semibold text-theme-primary text-sm tabular-nums">
                          {val.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Question text */}
                    <div className="text-[11px] font-sans text-theme-secondary line-clamp-1">
                      {item.question}
                    </div>

                    {/* Score Bar with Benchmark marker */}
                    <div className="relative h-2 w-full bg-theme-raised rounded-xs overflow-hidden border border-theme-subtle">
                      {/* Org Benchmark Line at 3.85 (77%) */}
                      <div
                        className="absolute top-0 bottom-0 w-[1.5px] bg-theme-tertiary z-10 opacity-70"
                        style={{ left: '77%' }}
                        title="Org Benchmark: 3.85"
                      />

                      {/* Bar Fill */}
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.5, ease: [0.2, 0, 0, 1] }}
                        className={`h-full rounded-xs ${
                          val >= 4.0
                            ? 'bg-success'
                            : isUnderperforming
                            ? 'bg-danger'
                            : 'bg-accent'
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Passive Telemetry indicators */}
            <div className="pt-4 border-t border-theme-subtle">
              <div className="text-[11px] font-mono uppercase tracking-[0.04em] text-theme-tertiary mb-2">
                Operational Telemetry Context
              </div>
              <div className="grid grid-cols-3 gap-3 text-xs font-mono">
                <div className="p-2.5 bg-theme-raised border hairline-border rounded-control">
                  <div className="text-theme-tertiary text-[10px]">Late Code Pushes</div>
                  <div className="text-theme-primary font-semibold text-sm mt-0.5">
                    {cycleData.passiveIndicators.lateCodePct !== null
                      ? `${cycleData.passiveIndicators.lateCodePct}%`
                      : 'n/a'}
                  </div>
                </div>
                <div className="p-2.5 bg-theme-raised border hairline-border rounded-control">
                  <div className="text-theme-tertiary text-[10px]">Friday Leave Ratio</div>
                  <div className="text-theme-primary font-semibold text-sm mt-0.5">
                    {cycleData.passiveIndicators.leavePatternRatio !== null
                      ? cycleData.passiveIndicators.leavePatternRatio.toFixed(2)
                      : 'n/a'}
                  </div>
                </div>
                <div className="p-2.5 bg-theme-raised border hairline-border rounded-control">
                  <div className="text-theme-tertiary text-[10px]">On-Call Pages / Wk</div>
                  <div className="text-theme-primary font-semibold text-sm mt-0.5">
                    {cycleData.passiveIndicators.onCallPagesPerWeek !== null
                      ? cycleData.passiveIndicators.onCallPagesPerWeek.toFixed(1)
                      : 'n/a'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Triggered Warning Flags & 14-Day Action Commitment (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Warning Flags Panel */}
            <div className="p-6 rounded-panel bg-theme-raised border hairline-border space-y-4 shadow-inner-highlight-dark">
              <div className="flex items-center justify-between pb-2 border-b border-theme-subtle">
                <div className="flex items-center gap-2">
                  <AlertTriangle
                    size={16}
                    strokeWidth={1.5}
                    className={triggers.length > 0 ? 'text-warning' : 'text-success'}
                  />
                  <span className="text-xs font-mono font-semibold uppercase tracking-[0.04em] text-theme-primary">
                    Calibrated Flags ({triggers.length})
                  </span>
                </div>
                <StatusBadge
                  label={cycleData.riskLevel}
                  variant={
                    cycleData.riskLevel === 'Low'
                      ? 'success'
                      : cycleData.riskLevel === 'Moderate'
                      ? 'warning'
                      : 'danger'
                  }
                />
              </div>

              {/* Core Principle Callout */}
              <div className="p-3 bg-accent/5 border border-accent/20 rounded-control text-xs leading-relaxed text-theme-secondary font-sans">
                <strong className="text-theme-primary font-mono text-[11px] block mb-0.5">
                  Principle: Fix Processes, Not Attitudes
                </strong>
                For unsustainable workloads, delivery leadership renegotiates milestones with stakeholders rather than demanding sustained heroism.
              </div>

              {/* List of Triggers */}
              {triggers.length === 0 ? (
                <div className="py-4 text-center text-xs font-mono text-theme-tertiary">
                  ✓ No critical friction flags triggered for this cycle.
                </div>
              ) : (
                <div className="space-y-3">
                  {triggers.map((t, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-theme-surface border border-warning/30 rounded-control space-y-1.5 text-xs font-mono"
                    >
                      <div className="flex items-center justify-between text-warning font-semibold">
                        <span>{t.domain}</span>
                        <span>Flag: {t.code}</span>
                      </div>
                      <p className="text-theme-secondary text-[11px] font-sans">
                        {t.reason}
                      </p>
                      <div className="pt-1 text-[11px] text-theme-primary font-sans border-t border-theme-subtle">
                        <strong>Playbook:</strong> {t.recommendation}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 14-Day Action Commitment Form */}
            <div className="p-6 rounded-panel bg-theme-surface border hairline-border space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-theme-subtle">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} strokeWidth={1.5} className="text-accent" />
                  <span className="text-xs font-mono font-semibold uppercase tracking-[0.04em] text-theme-primary">
                    14-Day Action Commitment
                  </span>
                </div>
                {cycleData.actionCommitted && (
                  <span className="text-[10px] font-mono text-success bg-success/10 px-1.5 py-0.5 rounded-control">
                    Active
                  </span>
                )}
              </div>

              {cycleData.actionCommitted ? (
                <div className="p-4 bg-theme-raised border hairline-border rounded-control space-y-3 text-xs font-mono">
                  <div className="flex items-center justify-between text-theme-secondary">
                    <span>Target Focus:</span>
                    <span className="text-theme-primary font-semibold">
                      {cycleData.actionCommitted.domain}
                    </span>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase text-theme-tertiary mb-1">
                      Committed Process Improvement:
                    </div>
                    <p className="text-[13px] font-sans text-theme-primary bg-theme-surface p-3 rounded-control border border-theme-subtle leading-relaxed">
                      "{cycleData.actionCommitted.action}"
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-theme-tertiary pt-2 border-t border-theme-subtle">
                    <span>Logged by: {cycleData.actionCommitted.owner}</span>
                    <span>Due: {cycleData.actionCommitted.dueDate.split('T')[0]}</span>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleCommitAction} className="space-y-3 text-xs font-mono">
                  <div>
                    <label className="block text-[11px] text-theme-tertiary mb-1 uppercase tracking-[0.04em]">
                      Select Friction Domain
                    </label>
                    <select
                      value={actionDomain}
                      onChange={(e) => setActionDomain(e.target.value)}
                      className="w-full h-8 px-2.5 bg-theme-raised border hairline-border rounded-control text-xs text-theme-primary focus-ring"
                    >
                      <option value="Workload">Sustainable Workload & Sprint Pacing</option>
                      <option value="Safety">Psychological Safety & Retrospectives</option>
                      <option value="Autonomy">Engineering Autonomy & Tooling</option>
                      <option value="Direction">Roadmap Clarity & Direction</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] text-theme-tertiary mb-1 uppercase tracking-[0.04em]">
                      Specific Action Plan (1 Concrete Change)
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={actionInput}
                      onChange={(e) => setActionInput(e.target.value)}
                      placeholder="e.g. Renegotiate Q2 milestone with stakeholders to allocate 20% sprint capacity for test automation."
                      className="w-full p-2.5 bg-theme-raised border hairline-border rounded-control text-xs text-theme-primary placeholder-theme-tertiary font-sans focus-ring"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingAction}
                    className="w-full h-9 bg-accent hover:bg-accent-hover text-white rounded-control font-medium transition-colors focus-ring flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <span>{isSubmittingAction ? 'Recording...' : 'Commit to 14-Day Action Plan'}</span>
                    <ArrowRight size={13} strokeWidth={1.5} />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
