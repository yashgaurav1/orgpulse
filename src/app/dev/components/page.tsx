'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Layers,
  Table,
  Filter,
  BarChart2,
  Sliders,
  Bell,
  Trash2,
  FileDown,
  RefreshCw,
  Plus,
  Eye,
  AlertTriangle,
  Sun,
  Moon,
  CheckCircle,
} from 'lucide-react';
import { useTheme } from '@/components/layout/ThemeContext';
import { useToast } from '@/components/enterprise/EnterpriseToast';
import { StatusBadge, StatusVariant } from '@/components/enterprise/StatusBadge';
import { KpiStatTile } from '@/components/enterprise/KpiStatTile';
import { EnterpriseChart } from '@/components/enterprise/EnterpriseChart';
import { DataTable, ColumnDef } from '@/components/enterprise/DataTable';
import { FilterBar, FilterChip } from '@/components/enterprise/FilterBar';
import { SideDrawer, DrawerRecord } from '@/components/enterprise/SideDrawer';
import { ConfirmDialog } from '@/components/enterprise/ConfirmDialog';
import { Skeleton } from '@/components/enterprise/Skeletons';
import { EmptyState, ErrorState } from '@/components/enterprise/EmptyState';
import { AuditLog } from '@/components/enterprise/AuditLog';
import { CopyId } from '@/components/enterprise/CopyId';
import { RelativeTime } from '@/components/enterprise/RelativeTime';

interface SampleSquadRow {
  id: string;
  name: string;
  domain: string;
  score: number;
  respondents: number;
  status: string;
  statusVariant: StatusVariant;
  actionLogged: boolean;
  lastUpdated: string;
}

const SAMPLE_SQUADS: SampleSquadRow[] = [
  {
    id: 'sq-101',
    name: 'Squad A (Payments Core)',
    domain: 'Payments Engine',
    score: 4.15,
    respondents: 14,
    status: 'Healthy',
    statusVariant: 'success',
    actionLogged: true,
    lastUpdated: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  },
  {
    id: 'sq-102',
    name: 'Squad B (Checkout & Order)',
    domain: 'Order Management',
    score: 3.42,
    respondents: 12,
    status: 'Needs Review',
    statusVariant: 'warning',
    actionLogged: false,
    lastUpdated: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  },
  {
    id: 'sq-103',
    name: 'Squad C (Fulfillment Delivery)',
    domain: 'Logistics',
    score: 2.85,
    respondents: 8,
    status: 'High Friction',
    statusVariant: 'danger',
    actionLogged: true,
    lastUpdated: new Date(Date.now() - 1000 * 60 * 400).toISOString(),
  },
  {
    id: 'sq-104',
    name: 'Squad D (Merchant Portal)',
    domain: 'Platform Services',
    score: 3.92,
    respondents: 11,
    status: 'Committed',
    statusVariant: 'accent',
    actionLogged: true,
    lastUpdated: new Date(Date.now() - 1000 * 60 * 1400).toISOString(),
  },
  {
    id: 'sq-105',
    name: 'Squad E (Data Pipeline)',
    domain: 'Analytics Infra',
    score: 0,
    respondents: 3,
    status: 'Suppressed (N<5)',
    statusVariant: 'neutral',
    actionLogged: false,
    lastUpdated: new Date(Date.now() - 1000 * 60 * 2400).toISOString(),
  },
];

export default function ComponentGalleryPage() {
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();

  // Table state toggles
  const [tableLoading, setTableLoading] = useState(false);
  const [tableError, setTableError] = useState(false);
  const [tableData, setTableData] = useState<SampleSquadRow[]>(SAMPLE_SQUADS);

  // Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<DrawerRecord | null>(null);

  // Confirm dialog state
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Columns definition for DataTable
  const columns: ColumnDef<SampleSquadRow>[] = [
    {
      id: 'id',
      header: 'Squad ID',
      width: 120,
      cell: (row) => <CopyId id={row.id} />,
    },
    {
      id: 'name',
      header: 'Squad Name',
      accessorKey: 'name',
      sortable: true,
      width: 220,
      cell: (row) => (
        <span className="font-medium text-theme-primary">{row.name}</span>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      accessorKey: 'status',
      sortable: true,
      width: 140,
      cell: (row) => (
        <StatusBadge
          label={row.status}
          variant={row.statusVariant}
          live={row.status === 'Healthy'}
        />
      ),
    },
    {
      id: 'score',
      header: 'Score (5.0)',
      accessorKey: 'score',
      sortable: true,
      align: 'right',
      width: 110,
      cell: (row) => (
        <span className="font-mono tabular-nums font-semibold text-theme-primary">
          {row.respondents < 5 ? (
            <span className="text-theme-tertiary">Suppressed</span>
          ) : (
            row.score.toFixed(2)
          )}
        </span>
      ),
    },
    {
      id: 'respondents',
      header: 'N Sample',
      accessorKey: 'respondents',
      sortable: true,
      align: 'right',
      width: 100,
      cell: (row) => (
        <span
          className={`font-mono tabular-nums ${
            row.respondents < 5 ? 'text-warning font-semibold' : 'text-theme-secondary'
          }`}
        >
          {row.respondents}
        </span>
      ),
    },
    {
      id: 'lastUpdated',
      header: 'Updated',
      accessorKey: 'lastUpdated',
      sortable: true,
      width: 120,
      cell: (row) => <RelativeTime date={row.lastUpdated} />,
    },
  ];

  const handleRowClick = (row: SampleSquadRow) => {
    setSelectedRecord({
      id: row.id,
      name: row.name,
      status: row.status,
      statusVariant: row.statusVariant,
      category: row.domain,
      score: row.respondents < 5 ? undefined : row.score,
      respondents: row.respondents,
      lastUpdated: row.lastUpdated,
      description: `Delivery diagnostic record for ${row.name}. Current focus domain is ${row.domain}.`,
    });
    setDrawerOpen(true);
  };

  const handleBulkExport = (ids: string[]) => {
    toast({
      type: 'success',
      title: 'Export Initiated',
      message: `Exporting ${ids.length > 0 ? ids.length : 'all'} squad records to CSV.`,
    });
  };

  const handleBulkDelete = (ids: string[]) => {
    setConfirmOpen(true);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-24">
      {/* Header and Theme Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-theme-subtle">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-[0.04em] text-accent font-semibold">
            Enterprise Design System
          </div>
          <h1 className="text-2xl font-semibold tracking-[-0.02em] text-theme-primary">
            Component Lab & Primitives Catalog
          </h1>
          <p className="text-xs text-theme-secondary font-sans mt-0.5">
            Production-quality components with default, hover, focus-visible, active, disabled, loading, and error states.
          </p>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-theme-surface hover:bg-theme-raised border hairline-border rounded-control text-xs font-mono text-theme-primary transition-colors focus-ring"
          >
            {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
            <span>Theme: {theme === 'dark' ? 'Dark (#0A0B0D)' : 'Light (#FAFAFB)'}</span>
          </button>
        </div>
      </div>

      {/* 01: KPI Stat Tiles & Sparklines */}
      <section className="space-y-3">
        <div className="text-[11px] font-mono uppercase tracking-[0.04em] text-theme-tertiary font-semibold">
          01 • KPI Stat Tiles with Sparklines & CountUp
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiStatTile
            label="Overall Engagement"
            value={3.94}
            format="score"
            delta={4.2}
            deltaLabel="vs Q4 '25"
            sparklineData={[3.6, 3.7, 3.82, 3.75, 3.94]}
          />
          <KpiStatTile
            label="Participation Rate"
            value={88.5}
            format="percent"
            delta={1.8}
            deltaLabel="100 invited"
            sparklineData={[75, 80, 82, 85, 88.5]}
          />
          <KpiStatTile
            label="14-Day Action Close Rate"
            value={92.0}
            format="percent"
            delta={-2.5}
            deltaLabel="11 of 12 closed"
            sparklineData={[96, 95, 94, 90, 92]}
          />
          <KpiStatTile
            label="Squad E (Suppressed)"
            value={0}
            suppressed={true}
            deltaLabel="N=3 (Below N ≥ 5)"
          />
        </div>
      </section>

      {/* 02: Charts with Minimal Gridlines & Crosshair */}
      <section className="space-y-3">
        <div className="text-[11px] font-mono uppercase tracking-[0.04em] text-theme-tertiary font-semibold">
          02 • Enterprise Chart with Mono-Axes & Crosshair Tracker
        </div>
        <EnterpriseChart
          title="Quarterly Engagement Trajectory vs Org Benchmark (3.85)"
          data={[
            { label: "Q1 '25", value: 3.55, baseline: 3.85 },
            { label: "Q2 '25", value: 3.68, baseline: 3.85 },
            { label: "Q3 '25", value: 3.74, baseline: 3.85 },
            { label: "Q4 '25", value: 3.62, baseline: 3.85 },
            { label: "Q1 '26", value: 3.94, baseline: 3.85 },
          ]}
          seriesName="Delivery Score"
          baselineName="Org Benchmark"
          height={180}
        />
      </section>

      {/* 03: Filter Bar & Saved Views */}
      <section className="space-y-3">
        <div className="text-[11px] font-mono uppercase tracking-[0.04em] text-theme-tertiary font-semibold">
          03 • Composable Filter Bar & Saved Views
        </div>
        <FilterBar
          onSearchChange={(q) => {
            const filtered = SAMPLE_SQUADS.filter((s) =>
              s.name.toLowerCase().includes(q.toLowerCase())
            );
            setTableData(filtered);
          }}
          onSavedViewSelect={(v) => {
            if (v === 'attention') {
              setTableData(SAMPLE_SQUADS.filter((s) => s.score < 3.5 && s.respondents >= 5));
            } else if (v === 'actions') {
              setTableData(SAMPLE_SQUADS.filter((s) => s.actionLogged));
            } else if (v === 'suppressed') {
              setTableData(SAMPLE_SQUADS.filter((s) => s.respondents < 5));
            } else {
              setTableData(SAMPLE_SQUADS);
            }
          }}
        />
      </section>

      {/* 04: Production Data Table */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-[11px] font-mono uppercase tracking-[0.04em] text-theme-tertiary font-semibold">
            04 • Enterprise Data Table (Sticky Header, Resize, Sort, Columns, Density, Bulk Actions)
          </div>
          <div className="flex items-center gap-2 text-xs font-mono">
            <button
              onClick={() => setTableLoading((prev) => !prev)}
              className={`px-2 py-0.5 rounded-control border ${
                tableLoading
                  ? 'bg-accent text-white border-accent'
                  : 'bg-theme-surface text-theme-secondary border-theme-border'
              }`}
            >
              Toggle Loading
            </button>
            <button
              onClick={() => setTableError((prev) => !prev)}
              className={`px-2 py-0.5 rounded-control border ${
                tableError
                  ? 'bg-danger text-white border-danger'
                  : 'bg-theme-surface text-theme-secondary border-theme-border'
              }`}
            >
              Toggle Error
            </button>
            <button
              onClick={() => setTableData(tableData.length > 0 ? [] : SAMPLE_SQUADS)}
              className="px-2 py-0.5 rounded-control bg-theme-surface text-theme-secondary border-theme-border"
            >
              Toggle Empty
            </button>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={tableData}
          isLoading={tableLoading}
          isError={tableError}
          onRetry={() => {
            setTableError(false);
            setTableData(SAMPLE_SQUADS);
          }}
          onRowClick={handleRowClick}
          onBulkExport={handleBulkExport}
          onBulkDelete={handleBulkDelete}
        />
      </section>

      {/* 05: Status Badges & Buttons State Matrix */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Status Badges */}
        <div className="p-4 rounded-panel bg-theme-surface border hairline-border space-y-3">
          <div className="text-[11px] font-mono uppercase tracking-[0.04em] text-theme-tertiary font-semibold">
            05A • Status Badges with Small Dot
          </div>
          <div className="flex flex-wrap gap-2">
            <StatusBadge label="Healthy Baseline" variant="success" live />
            <StatusBadge label="Needs Review" variant="warning" />
            <StatusBadge label="Critical Friction" variant="danger" />
            <StatusBadge label="Action Committed" variant="accent" />
            <StatusBadge label="Suppressed Group" variant="neutral" />
          </div>
        </div>

        {/* Toast Dispatchers */}
        <div className="p-4 rounded-panel bg-theme-surface border hairline-border space-y-3">
          <div className="text-[11px] font-mono uppercase tracking-[0.04em] text-theme-tertiary font-semibold">
            05B • Toast Notifications (Spring/Bounce Enter, Slide Exit)
          </div>
          <div className="flex flex-wrap gap-2 text-xs font-mono">
            <button
              onClick={() =>
                toast({
                  type: 'success',
                  title: '14-Day Action Logged',
                  message: 'Action commitment recorded with immutable timestamp.',
                })
              }
              className="px-2.5 py-1 bg-success/10 text-success border border-success/30 rounded-control hover:bg-success/20 transition-colors"
            >
              Trigger Success Toast
            </button>
            <button
              onClick={() =>
                toast({
                  type: 'warning',
                  title: 'Threshold Caution',
                  message: 'Cycle interval is < 90 days. Treat deltas cautiously.',
                })
              }
              className="px-2.5 py-1 bg-warning/10 text-warning border border-warning/30 rounded-control hover:bg-warning/20 transition-colors"
            >
              Trigger Warning Toast
            </button>
            <button
              onClick={() =>
                toast({
                  type: 'danger',
                  title: 'Access Denied',
                  message: 'Cross-squad response inspection is strictly blocked.',
                })
              }
              className="px-2.5 py-1 bg-danger/10 text-danger border border-danger/30 rounded-control hover:bg-danger/20 transition-colors"
            >
              Trigger Danger Toast
            </button>
          </div>
        </div>
      </section>

      {/* 06: Button State Matrix */}
      <section className="p-4 rounded-panel bg-theme-surface border hairline-border space-y-4">
        <div className="text-[11px] font-mono uppercase tracking-[0.04em] text-theme-tertiary font-semibold">
          06 • Button States (Default, Hover, Focus-Visible, Active 0.98 Scale, Disabled, Loading)
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs font-mono">
          <div className="space-y-1">
            <div className="text-[10px] text-theme-tertiary">Default</div>
            <button className="w-full h-8 px-3 bg-accent hover:bg-accent-hover text-white rounded-control font-medium active:scale-[0.98] transition-transform">
              Primary
            </button>
          </div>
          <div className="space-y-1">
            <div className="text-[10px] text-theme-tertiary">Secondary</div>
            <button className="w-full h-8 px-3 bg-theme-raised hover:bg-theme-border border hairline-border text-theme-primary rounded-control font-medium active:scale-[0.98] transition-transform">
              Secondary
            </button>
          </div>
          <div className="space-y-1">
            <div className="text-[10px] text-theme-tertiary">Focus-Visible</div>
            <button className="w-full h-8 px-3 bg-theme-raised border border-accent ring-1 ring-accent text-theme-primary rounded-control font-medium">
              Focused
            </button>
          </div>
          <div className="space-y-1">
            <div className="text-[10px] text-theme-tertiary">Active Press</div>
            <button className="w-full h-8 px-3 bg-accent-hover text-white rounded-control font-medium scale-[0.98]">
              Pressed 0.98
            </button>
          </div>
          <div className="space-y-1">
            <div className="text-[10px] text-theme-tertiary">Disabled</div>
            <button
              disabled
              className="w-full h-8 px-3 bg-theme-raised text-theme-tertiary border hairline-border rounded-control font-medium opacity-50 cursor-not-allowed"
            >
              Disabled
            </button>
          </div>
          <div className="space-y-1">
            <div className="text-[10px] text-theme-tertiary">Loading</div>
            <button
              disabled
              className="w-full h-8 px-3 bg-accent/70 text-white rounded-control font-medium flex items-center justify-center gap-1.5 cursor-wait"
            >
              <RefreshCw size={12} className="animate-spin" />
              <span>Saving...</span>
            </button>
          </div>
        </div>
      </section>

      {/* 07: Skeletons, Empty & Error States */}
      <section className="space-y-3">
        <div className="text-[11px] font-mono uppercase tracking-[0.04em] text-theme-tertiary font-semibold">
          07 • Skeleton Shimmers (1.6s Slow) & Operational States
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton variant="card" />
          <EmptyState
            title="No Active Flags"
            description="All diagnostic domains are operating above baseline thresholds."
            actionLabel="View Survey Log"
            onAction={() =>
              toast({ type: 'info', title: 'Survey Log', message: 'Opening survey logs.' })
            }
          />
          <ErrorState
            title="Database Connection Timeout"
            message="Supabase telemetry endpoint did not respond within 3000ms."
            onRetry={() =>
              toast({ type: 'info', title: 'Retrying', message: 'Re-connecting to database...' })
            }
          />
        </div>
      </section>

      {/* 08: Security & Compliance Audit Log */}
      <section className="space-y-3">
        <div className="text-[11px] font-mono uppercase tracking-[0.04em] text-theme-tertiary font-semibold">
          08 • Activity & Audit Log with Relative Times & Copyable IDs
        </div>
        <AuditLog />
      </section>

      {/* Side Drawer Component */}
      <SideDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        record={selectedRecord}
      />

      {/* Confirm Dialog Component */}
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete Selected Squad Records?"
        description="This action will permanently delete historical diagnostic records for the selected squads. This action cannot be undone."
        confirmLabel="Delete Records"
        variant="danger"
        onConfirm={() => {
          toast({
            type: 'danger',
            title: 'Records Deleted',
            message: 'Selected records have been removed from the database.',
          });
        }}
      />
    </div>
  );
}
