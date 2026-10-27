'use client';

import React, { useState } from 'react';
import {
  Shield,
  Calendar,
  Users,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Plus,
  Trash2,
  Printer,
  FileDown,
  Layers,
  ChevronDown,
  TrendingUp,
  BarChart3,
  HeartHandshake,
  Activity,
  Sliders,
} from 'lucide-react';
import { useToast } from '@/components/enterprise/EnterpriseToast';
import { StatusBadge, StatusVariant } from '@/components/enterprise/StatusBadge';
import { KpiStatTile } from '@/components/enterprise/KpiStatTile';
import { DataTable, ColumnDef } from '@/components/enterprise/DataTable';
import { SideDrawer, DrawerRecord } from '@/components/enterprise/SideDrawer';
import { CopyId } from '@/components/enterprise/CopyId';
import { RelativeTime } from '@/components/enterprise/RelativeTime';
import {
  ENTERPRISE_SQUADS,
  ENTERPRISE_CYCLES,
  EnterpriseSquad,
} from '@/lib/enterprise-data';

interface DirectorSquadRow {
  id: string;
  code: string;
  name: string;
  businessUnit: string;
  leadManager: string;
  respondents: number;
  participationPct: number;
  overallScore: number | null;
  psychologicalSafety: number | null;
  workloadScore: number | null;
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Critical';
  status: string;
  statusVariant: StatusVariant;
  actionStatus: string;
  lastUpdated: string;
}

export default function DirectorDashboardPage() {
  const { toast } = useToast();
  const [activeView, setActiveView] = useState<'trends' | 'drivers' | 'actions'>('trends');
  const [selectedCycleId, setSelectedCycleId] = useState<string>('cycle-2026-q1');

  // Skip-level qualitative themes logger
  const [themes, setThemes] = useState<string[]>([
    'Sprint estimation frequently disrupted by unplanned client escalations during Friday deployments.',
    'Tooling blocker: AWS Sandbox environment access requests take over 10 days for new squad joiners.',
    'Desire for protected architecture study hours during sprint lulls.',
  ]);
  const [newTheme, setNewTheme] = useState('');

  // Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<DrawerRecord | null>(null);

  // Map 12 squads to table rows based on active cycle
  const tableRows: DirectorSquadRow[] = ENTERPRISE_SQUADS.map((squad) => {
    const cycle = squad.cycles[selectedCycleId] || squad.cycles['cycle-2026-q1'];
    const isSuppressed = cycle.respondents < 5;

    return {
      id: squad.id,
      code: squad.code,
      name: squad.name,
      businessUnit: squad.businessUnit,
      leadManager: squad.leadManager,
      respondents: cycle.respondents,
      participationPct: cycle.participationPct,
      overallScore: isSuppressed ? null : cycle.overallScore,
      psychologicalSafety: isSuppressed
        ? null
        : cycle.items.find((i) => i.code === 'Q4')?.mean || null,
      workloadScore: isSuppressed
        ? null
        : cycle.items.find((i) => i.code === 'Q5')?.mean || null,
      riskLevel: cycle.riskLevel,
      status: cycle.status,
      statusVariant: cycle.statusVariant,
      actionStatus: cycle.actionCommitted ? cycle.actionCommitted.status : 'Pending',
      lastUpdated: new Date().toISOString(),
    };
  });

  const columns: ColumnDef<DirectorSquadRow>[] = [
    {
      id: 'code',
      header: 'Code',
      width: 100,
      cell: (row) => <CopyId id={row.code} />,
    },
    {
      id: 'name',
      header: 'Squad & Scope',
      accessorKey: 'name',
      sortable: true,
      cell: (row) => (
        <div>
          <div className="font-semibold text-theme-primary">{row.name}</div>
          <div className="text-[10px] text-theme-tertiary">
            {row.businessUnit} • {row.leadManager}
          </div>
        </div>
      ),
    },
    {
      id: 'overallScore',
      header: 'Overall Index',
      accessorKey: 'overallScore',
      sortable: true,
      align: 'right',
      width: 120,
      cell: (row) => (
        <span className="font-mono tabular-nums font-semibold text-theme-primary">
          {row.respondents < 5 ? (
            <span className="text-[10px] text-theme-tertiary">Suppressed (N&lt;5)</span>
          ) : row.overallScore !== null ? (
            row.overallScore.toFixed(2)
          ) : (
            'n/a'
          )}
        </span>
      ),
    },
    {
      id: 'psychologicalSafety',
      header: 'Safety (Q4)',
      accessorKey: 'psychologicalSafety',
      sortable: true,
      align: 'right',
      width: 110,
      cell: (row) => (
        <span
          className={`font-mono tabular-nums ${
            row.psychologicalSafety && row.psychologicalSafety < 3.2
              ? 'text-danger font-semibold'
              : 'text-theme-secondary'
          }`}
        >
          {row.respondents < 5 ? 'Hidden' : row.psychologicalSafety?.toFixed(2) ?? 'n/a'}
        </span>
      ),
    },
    {
      id: 'workloadScore',
      header: 'Workload (Q5)',
      accessorKey: 'workloadScore',
      sortable: true,
      align: 'right',
      width: 120,
      cell: (row) => (
        <span
          className={`font-mono tabular-nums ${
            row.workloadScore && row.workloadScore < 3.0
              ? 'text-danger font-semibold'
              : 'text-theme-secondary'
          }`}
        >
          {row.respondents < 5 ? 'Hidden' : row.workloadScore?.toFixed(2) ?? 'n/a'}
        </span>
      ),
    },
    {
      id: 'actionStatus',
      header: '14-Day Action',
      accessorKey: 'actionStatus',
      sortable: true,
      width: 130,
      cell: (row) => (
        <span
          className={`font-mono text-xs ${
            row.actionStatus === 'Done'
              ? 'text-success font-semibold'
              : row.actionStatus === 'In Progress'
              ? 'text-accent'
              : 'text-theme-tertiary'
          }`}
        >
          {row.actionStatus}
        </span>
      ),
    },
  ];

  const handleRowClick = (row: DirectorSquadRow) => {
    setSelectedRecord({
      id: row.code,
      name: row.name,
      status: row.status,
      statusVariant: row.statusVariant,
      category: row.businessUnit,
      score: row.overallScore ?? undefined,
      respondents: row.respondents,
      owner: row.leadManager,
      lastUpdated: row.lastUpdated,
      description: `Delivery diagnostic record for ${row.name} in ${row.businessUnit}. Status is currently ${row.status}.`,
    });
    setDrawerOpen(true);
  };

  const handlePrintSummary = () => {
    window.print();
  };

  const handleAddTheme = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTheme.trim()) return;
    setThemes([newTheme.trim(), ...themes]);
    setNewTheme('');
    toast({
      type: 'success',
      title: 'Theme Recorded',
      message: 'Skip-level theme added to director executive review.',
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16 print:p-0 print:m-0 print:space-y-4">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-theme-subtle">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-theme-primary">
            Senior Leadership Diagnostic Scorecard
          </h1>
          <p className="text-sm opacity-75 text-theme-secondary font-sans mt-1">
            Cross-squad diagnostic oversight, 6 wellbeing drivers deep-dive, and action plan volume counts.
          </p>
        </div>

        {/* Action Controls & Cycle Toggle */}
        <div className="flex items-center gap-2 print:hidden">
          <button
            onClick={handlePrintSummary}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-theme-surface hover:bg-theme-raised border hairline-border rounded-control text-xs font-sans text-theme-primary transition-colors focus-ring"
            title="Print Executive Summary"
          >
            <Printer size={13} />
            <span>Print Summary</span>
          </button>

          <div className="relative">
            <select
              value={selectedCycleId}
              onChange={(e) => setSelectedCycleId(e.target.value)}
              className="h-9 px-3 pr-8 bg-theme-surface border hairline-border rounded-control text-xs text-theme-primary font-mono focus-ring cursor-pointer appearance-none shadow-xs"
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
        </div>
      </div>

      {/* KPI Stat Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiStatTile
          label="Aggregate Engagement"
          value={3.98}
          format="score"
          delta={3.5}
          deltaLabel="vs previous cycle"
          sparklineData={[3.65, 3.75, 3.82, 3.98]}
        />
        <KpiStatTile
          label="Overall Response Rate"
          value={90.7}
          format="percent"
          delta={1.2}
          deltaLabel="98 of 108 engineers"
          sparklineData={[82, 85, 88, 90.7]}
        />
        <KpiStatTile
          label="14-Day Action Close Rate"
          value={91.7}
          format="percent"
          delta={4.1}
          deltaLabel="11 of 12 squads on-track"
          sparklineData={[75, 80, 85, 91.7]}
        />
        <KpiStatTile
          label="Squads Requiring Review"
          value={2}
          format="number"
          deltaLabel="Squad 03 & Squad 09 flagged"
          sparklineData={[4, 3, 2, 2]}
        />
      </div>

      {/* 3 View Tabs: Trends, 6 Drivers, Action & Support Counts */}
      <div className="flex items-center gap-6 border-b border-theme-subtle text-xs font-sans overflow-x-auto [&::-webkit-scrollbar]:hidden print:hidden">
        {[
          { id: 'trends', label: 'Company Overview Trends', icon: TrendingUp },
          { id: 'drivers', label: '6 Drivers Deep-Dive', icon: BarChart3 },
          { id: 'actions', label: 'Action & Support Volumes', icon: HeartHandshake },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeView === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id as any)}
              className={`flex items-center gap-2 py-2.5 px-1 font-medium transition-colors border-b-2 -mb-[1px] whitespace-nowrap ${
                isActive
                  ? 'border-accent text-accent font-semibold'
                  : 'border-transparent text-theme-secondary hover:text-theme-primary'
              }`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* VIEW 1: Company Overview Trends */}
      {activeView === 'trends' && (
        <div className="space-y-6">
          {/* Principle Callout */}
          <div className="p-4 rounded-panel bg-theme-raised border hairline-border space-y-1 text-xs font-sans">
            <div className="text-theme-primary font-semibold flex items-center gap-2">
              <Shield size={14} className="text-accent" />
              <span>Operational Governance & Data Use</span>
            </div>
            <p className="text-theme-secondary font-sans leading-relaxed text-[13px]">
              Engineering satisfaction scores are never used for stack-ranking, performance ratings, or manager compensation. Directors evaluate managers exclusively on their commitment follow-through (stay interviews completed, 14-day actions logged, and blameless retrospectives held).
            </p>
          </div>

          {/* Full Squad Scorecard Table */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-[11px] font-mono uppercase tracking-[0.04em] text-theme-tertiary font-semibold">
                Twelve Squad Delivery Health Grid ({ENTERPRISE_SQUADS.length} Squads Monitored)
              </div>
              <span className="text-[11px] font-mono text-theme-tertiary">
                Strict Alphabetical Order • Zero League Tabling
              </span>
            </div>

            <DataTable
              columns={columns}
              data={tableRows}
              onRowClick={handleRowClick}
              defaultPageSize={12}
            />
          </section>

          {/* Skip-Level Qualitative Themes Logger */}
          <section className="p-6 rounded-panel bg-theme-surface border hairline-border space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-theme-subtle">
              <span className="text-xs font-mono font-semibold uppercase tracking-[0.04em] text-theme-primary">
                Skip-Level Qualitative Themes (Executive Synthesis)
              </span>
              <span className="text-[11px] font-mono text-theme-tertiary">
                Aggregated & Non-Attributable
              </span>
            </div>

            <form onSubmit={handleAddTheme} className="flex gap-2">
              <input
                type="text"
                required
                value={newTheme}
                onChange={(e) => setNewTheme(e.target.value)}
                placeholder="Record an aggregated pattern observed during 1-on-1 skip-level interviews..."
                className="flex-1 h-9 px-3 bg-theme-raised border hairline-border rounded-control text-xs text-theme-primary font-sans focus-ring"
              />
              <button
                type="submit"
                className="px-3.5 h-9 bg-accent hover:bg-accent-hover text-white rounded-control font-mono text-xs font-medium transition-colors focus-ring flex items-center gap-1.5"
              >
                <Plus size={13} strokeWidth={1.5} />
                <span>Record Theme</span>
              </button>
            </form>

            <div className="divide-y divide-theme-subtle border border-theme-subtle rounded-control overflow-hidden">
              {themes.map((theme, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-theme-surface hover:bg-theme-raised/50 transition-colors flex items-start justify-between gap-3 text-xs"
                >
                  <div className="flex items-start gap-2.5">
                    <span className="font-mono text-accent font-semibold text-[11px] mt-0.5">
                      0{idx + 1}
                    </span>
                    <span className="text-theme-secondary font-sans leading-relaxed">
                      {theme}
                    </span>
                  </div>
                  <button
                    onClick={() => setThemes(themes.filter((_, i) => i !== idx))}
                    className="text-theme-tertiary hover:text-danger p-1 rounded-control transition-colors"
                    title="Remove theme"
                  >
                    <Trash2 size={12} strokeWidth={1.5} />
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* VIEW 2: 6 Drivers Deep-Dive */}
      {activeView === 'drivers' && (
        <div className="space-y-6">
          <div className="p-4 bg-theme-raised border hairline-border rounded-panel text-xs space-y-1">
            <span className="font-mono uppercase text-theme-tertiary text-[10px]">6 Core Workplace Drivers</span>
            <h2 className="text-sm font-semibold text-theme-primary">
              Company-Wide Domain Benchmarks (Q1 2026)
            </h2>
            <p className="text-theme-secondary font-sans">
              Evaluated across all eligible squads. Scores below 3.0 denote critical operational friction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { code: 'Q1', title: 'Purpose & Mission Alignment', score: 4.28, delta: '+0.12', status: 'Healthy', color: 'success' },
              { code: 'Q2', title: 'Autonomy & Tooling Authority', score: 4.14, delta: '+0.08', status: 'Healthy', color: 'success' },
              { code: 'Q3', title: 'Recognition for Quality', score: 3.92, delta: '+0.15', status: 'Healthy', color: 'success' },
              { code: 'Q4', title: 'Psychological Safety', score: 4.08, delta: '+0.04', status: 'Healthy', color: 'success' },
              { code: 'Q5', title: 'Sustainable Workload & Pacing', score: 3.42, delta: '-0.24', status: 'Needs Review', color: 'warning' },
              { code: 'Q6', title: 'Long-term Team Health', score: 4.19, delta: '+0.18', status: 'Healthy', color: 'success' },
            ].map((driver) => (
              <div
                key={driver.code}
                className="p-5 bg-theme-surface border hairline-border rounded-panel space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-control bg-accent/10 border border-accent/20 text-accent font-mono text-[10px] font-bold">
                    {driver.code}
                  </span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                      driver.color === 'success'
                        ? 'bg-success/10 text-success'
                        : 'bg-warning/10 text-warning'
                    }`}
                  >
                    {driver.status}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-sm font-semibold text-theme-primary">
                    {driver.title}
                  </h3>
                  <div className="flex items-baseline gap-2 font-mono">
                    <span className="text-2xl font-bold text-theme-primary">{driver.score}</span>
                    <span className="text-xs text-theme-tertiary">/ 5.0</span>
                    <span
                      className={`text-xs ml-auto ${
                        driver.delta.startsWith('+') ? 'text-success' : 'text-danger'
                      }`}
                    >
                      {driver.delta} QoQ
                    </span>
                  </div>
                </div>

                {/* Score bar */}
                <div className="w-full h-2 bg-theme-raised rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      driver.color === 'success' ? 'bg-success' : 'bg-warning'
                    }`}
                    style={{ width: `${(driver.score / 5) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 3: Action & Support Volume Counts */}
      {activeView === 'actions' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 14-Day Action Plans Tracker */}
            <div className="p-6 bg-theme-surface border hairline-border rounded-panel space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase text-theme-tertiary">Manager Follow-Through</span>
                <h3 className="text-sm font-semibold text-theme-primary">
                  14-Day Action Commitments (12 Squads)
                </h3>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="p-3 bg-theme-raised border hairline-border rounded-control flex items-center justify-between">
                  <span className="text-theme-secondary">Completed on schedule:</span>
                  <span className="text-success font-bold text-sm">8 Squads (66.7%)</span>
                </div>
                <div className="p-3 bg-theme-raised border hairline-border rounded-control flex items-center justify-between">
                  <span className="text-theme-secondary">In progress (Within 14-day SLA):</span>
                  <span className="text-accent font-bold text-sm">3 Squads (25.0%)</span>
                </div>
                <div className="p-3 bg-theme-raised border hairline-border rounded-control flex items-center justify-between">
                  <span className="text-theme-secondary">Pending commitment:</span>
                  <span className="text-warning font-bold text-sm">1 Squad (8.3%)</span>
                </div>
              </div>
            </div>

            {/* Anonymized Support Volumes */}
            <div className="p-6 bg-theme-surface border hairline-border rounded-panel space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase text-theme-tertiary">Confidential Support Volumes</span>
                <h3 className="text-sm font-semibold text-theme-primary">
                  Support Ticket Volume by Category (Aggregated)
                </h3>
                <p className="text-[11px] text-theme-tertiary font-sans">
                  Zero individual attribution. Volume counts assist senior leadership in identifying systemic resource deficits.
                </p>
              </div>

              <div className="space-y-2 text-xs font-mono">
                {[
                  { category: 'Workload & On-Call Strain', count: 5, pct: '45%' },
                  { category: 'Team Dynamics & Interpersonal', count: 3, pct: '27%' },
                  { category: 'Burnout & Fatigue', count: 2, pct: '18%' },
                  { category: 'Career & Growth Roadblocks', count: 1, pct: '10%' },
                ].map((item) => (
                  <div
                    key={item.category}
                    className="p-3 bg-theme-raised border hairline-border rounded-control flex items-center justify-between"
                  >
                    <span className="text-theme-secondary truncate max-w-[220px]">{item.category}</span>
                    <span className="text-theme-primary font-bold">{item.count} tickets ({item.pct})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Side Drawer */}
      <SideDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        record={selectedRecord}
      />
    </div>
  );
}
