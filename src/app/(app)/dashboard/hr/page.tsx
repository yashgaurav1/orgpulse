'use client';

import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Calendar,
  Sparkles,
  ShieldCheck,
  Send,
  Download,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Lock,
  Layers,
  ChevronRight,
  RefreshCw,
  MessageSquare,
  UserCheck,
  Clock,
  EyeOff,
  Filter,
} from 'lucide-react';
import { useToast } from '@/components/enterprise/EnterpriseToast';
import { StatusBadge, StatusVariant } from '@/components/enterprise/StatusBadge';
import { KpiStatTile } from '@/components/enterprise/KpiStatTile';
import { DataTable, ColumnDef } from '@/components/enterprise/DataTable';
import { SideDrawer, DrawerRecord } from '@/components/enterprise/SideDrawer';
import { AuditLog } from '@/components/enterprise/AuditLog';
import { CopyId } from '@/components/enterprise/CopyId';
import { RelativeTime } from '@/components/enterprise/RelativeTime';
import {
  ENTERPRISE_SQUADS,
  ENTERPRISE_CYCLES,
  ENTERPRISE_AUDIT_LOGS,
} from '@/lib/enterprise-data';

interface HrSquadRow {
  id: string;
  code: string;
  name: string;
  businessUnit: string;
  respondents: number;
  participationPct: number;
  overallScore: number | null;
  status: string;
  statusVariant: StatusVariant;
  actionStatus: string;
  lastUpdated: string;
}

interface SupportTicket {
  id: string;
  category: string;
  urgency: 'normal' | 'elevated' | 'critical';
  pseudonym: string;
  unit: string;
  subject: string;
  description: string;
  status: 'open' | 'in_review' | 'assigned' | 'resolved';
  assignedHrbp: string;
  submittedAt: string;
  lastMessage: string;
}

const INITIAL_SUPPORT_TICKETS: SupportTicket[] = [
  {
    id: 'req-2026-081',
    category: 'Workload & On-Call Strain',
    urgency: 'elevated',
    pseudonym: 'Engineer Alpha (Anonymous)',
    unit: 'Financial Services (Squad 01)',
    subject: 'Continuous weekend on-call pages without recovery time',
    description: 'Our squad has had 3 consecutive weeks of high on-call volume due to legacy migrations. Experiencing severe sleep deprivation.',
    status: 'assigned',
    assignedHrbp: 'Kavita Menon (Lead HRBP)',
    submittedAt: '2026-02-14 09:30',
    lastMessage: 'HRBP working with director on mandatory 24-hr recovery policy.',
  },
  {
    id: 'req-2026-089',
    category: 'Burnout / Fatigue',
    urgency: 'critical',
    pseudonym: 'Engineer Zeta (Anonymous)',
    unit: 'Platform Infrastructure (Squad 04)',
    subject: 'Severe cognitive exhaustion and imposter syndrome after platform outage',
    description: 'Facing relentless retro scrutiny. Blame-free retro was not honored by stakeholder.',
    status: 'open',
    assignedHrbp: 'Unassigned',
    submittedAt: '2026-02-17 14:10',
    lastMessage: 'Ticket created. Awaiting HRBP triage.',
  },
  {
    id: 'req-2026-092',
    category: 'Team Dynamics / Interpersonal',
    urgency: 'normal',
    pseudonym: 'Senior Frontend Dev (Anonymous)',
    unit: 'Checkout Funnel (Squad 02)',
    subject: 'PR review tone becoming dismissive in daily asynchronous comments',
    description: 'Constructive criticism has degraded into dismissive remarks. Requesting neutral mediation.',
    status: 'in_review',
    assignedHrbp: 'Pooja Hegde (Associate HRBP)',
    submittedAt: '2026-02-18 10:05',
    lastMessage: 'HRBP reviewing communication logs.',
  },
];

export default function HrDashboardPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'scorecards' | 'triage' | 'synthesis' | 'broadcast' | 'audit' | 'privacy'>('scorecards');
  const [selectedCycleId, setSelectedCycleId] = useState<string>('cycle-2026-q1');

  // Support Triage State
  const [tickets, setTickets] = useState<SupportTicket[]>(INITIAL_SUPPORT_TICKETS);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [replyContent, setReplyContent] = useState('');

  // AI Summary state & kill switch
  const [aiKillSwitch, setAiKillSwitch] = useState<boolean>(true);
  const [isGeneratingAi, setIsGeneratingAi] = useState<boolean>(false);
  const [aiGeneratedText, setAiGeneratedText] = useState<string>(
    'Across 12 squads (N=98), delivery engineers report strong psychological safety in Platform Core and Payments (Q4 > 4.30). Primary operational friction concentrates in Order Fulfillment and Partner APIs (Item 5 Workload < 2.85), driven by unplanned client escalations disrupting Friday release cadences. Recommendation: Prioritize 14-day SLA recalibration and test automation.'
  );

  // Broadcast reminder state
  const [isBroadcasting, setIsBroadcasting] = useState(false);

  // Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<DrawerRecord | null>(null);

  // Table rows mapping all squads
  const tableRows: HrSquadRow[] = ENTERPRISE_SQUADS.map((squad) => {
    const cycle = squad.cycles[selectedCycleId] || squad.cycles['cycle-2026-q1'];
    const isSuppressed = cycle.respondents < 5;

    return {
      id: squad.id,
      code: squad.code,
      name: squad.name,
      businessUnit: squad.businessUnit,
      respondents: cycle.respondents,
      participationPct: cycle.participationPct,
      overallScore: isSuppressed ? null : cycle.overallScore,
      status: cycle.status,
      statusVariant: cycle.statusVariant,
      actionStatus: cycle.actionCommitted ? cycle.actionCommitted.status : 'Pending',
      lastUpdated: new Date().toISOString(),
    };
  });

  const columns: ColumnDef<HrSquadRow>[] = [
    {
      id: 'code',
      header: 'Code',
      width: 100,
      cell: (row) => <CopyId id={row.code} />,
    },
    {
      id: 'name',
      header: 'Squad & Unit',
      accessorKey: 'name',
      sortable: true,
      cell: (row) => (
        <div>
          <div className="font-semibold text-theme-primary">{row.name}</div>
          <div className="text-[10px] text-theme-tertiary">{row.businessUnit}</div>
        </div>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      accessorKey: 'status',
      sortable: true,
      width: 150,
      cell: (row) => (
        <StatusBadge
          label={row.status}
          variant={row.statusVariant}
          live={row.status === 'Healthy Baseline'}
        />
      ),
    },
    {
      id: 'overallScore',
      header: 'Score (5.0)',
      accessorKey: 'overallScore',
      sortable: true,
      align: 'right',
      width: 140,
      cell: (row) => (
        <span className="font-mono tabular-nums font-semibold text-theme-primary">
          {row.respondents < 5 ? (
            <span className="text-[10px] text-theme-tertiary">Suppressed under Section 18 privacy threshold (N &ge; 5)</span>
          ) : row.overallScore !== null ? (
            row.overallScore.toFixed(2)
          ) : (
            'n/a'
          )}
        </span>
      ),
    },
    {
      id: 'respondents',
      header: 'Sample (N)',
      accessorKey: 'respondents',
      sortable: true,
      align: 'right',
      width: 110,
      cell: (row) => (
        <span
          className={`font-mono tabular-nums ${
            row.respondents < 5 ? 'text-warning font-semibold' : 'text-theme-secondary'
          }`}
        >
          {row.respondents} ({row.participationPct.toFixed(0)}%)
        </span>
      ),
    },
    {
      id: 'actionStatus',
      header: '14-Day Plan',
      accessorKey: 'actionStatus',
      sortable: true,
      width: 120,
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

  const handleRowClick = (row: HrSquadRow) => {
    setSelectedRecord({
      id: row.code,
      name: row.name,
      status: row.status,
      statusVariant: row.statusVariant,
      category: row.businessUnit,
      score: row.overallScore ?? undefined,
      respondents: row.respondents,
      owner: 'HR Business Partner Oversight',
      lastUpdated: row.lastUpdated,
      description: `Diagnostic record for ${row.name}. ${
        row.respondents < 5
          ? 'Notice: Aggregate scores are suppressed because respondents (N=3) are below the statistical disclosure threshold of 5.'
          : `Overall engagement index is ${row.overallScore?.toFixed(2)}.`
      }`,
    });
    setDrawerOpen(true);
  };

  const handleBulkExport = (selectedIds: string[]) => {
    const unsuppressed = tableRows.filter((r) => r.respondents >= 5);
    const csvLines = [
      '# PULSE TEAM-LEVEL AGGREGATE EXPORT',
      '# Privacy Rule: Groups with fewer than 5 respondents are excluded by design',
      'Code,Squad Name,Business Unit,Respondents,Participation %,Score,Status',
    ].concat(
      unsuppressed.map(
        (r) =>
          `${r.code},"${r.name}","${r.businessUnit}",${r.respondents},${r.participationPct},${r.overallScore},"${r.status}"`
      )
    );
    const encodedUri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvLines.join('\n'));
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'pulse-squad-aggregates-q1-2026.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      type: 'success',
      title: 'Safe CSV Exported',
      message: `Exported ${unsuppressed.length} unsuppressed squads. Groups with N < 5 were safely excluded.`,
    });
  };

  const handleTriggerAiSynthesis = () => {
    if (!aiKillSwitch) {
      toast({
        type: 'danger',
        title: 'Synthesis Blocked',
        message: 'The AI Synthesis Kill-Switch is engaged. Toggle the switch to resume Gemini analysis.',
      });
      return;
    }

    setIsGeneratingAi(true);
    setTimeout(() => {
      setIsGeneratingAi(false);
      setAiGeneratedText(
        'Refreshed Synthesis (Q1 2026): Engineering satisfaction remains stable across core engineering squads. Workload friction is concentrated in on-call rotations. Recommended mitigation: enforce 24-hr post-call compensatory rest.'
      );
      toast({
        type: 'success',
        title: 'Theme Synthesis Generated',
        message: 'Aggregated themes synthesized across all qualifying responses (N ≥ 10, PII stripped).',
      });
    }, 1200);
  };

  const handleBroadcastReminder = () => {
    setIsBroadcasting(true);
    setTimeout(() => {
      setIsBroadcasting(false);
      toast({
        type: 'success',
        title: 'Reminders Queued',
        message: 'Non-respondent reminder hashes dispatched via one-way email daemon. Zero identifiable recipient links.',
      });
    }, 900);
  };

  const handleAssignTicket = (ticketId: string, hrbpName: string) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, assignedHrbp: hrbpName, status: 'assigned' } : t))
    );
    if (selectedTicket && selectedTicket.id === ticketId) {
      setSelectedTicket((prev) => (prev ? { ...prev, assignedHrbp: hrbpName, status: 'assigned' } : null));
    }
    toast({
      type: 'success',
      title: 'Ticket Assigned',
      message: `Assigned to ${hrbpName}.`,
    });
  };

  const handleStatusTransition = (ticketId: string, newStatus: any) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status: newStatus } : t))
    );
    if (selectedTicket && selectedTicket.id === ticketId) {
      setSelectedTicket((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
    toast({
      type: 'success',
      title: 'Status Updated',
      message: `Ticket ${ticketId} transitioned to ${newStatus}.`,
    });
  };

  const handleSendHrbpReply = (ticketId: string) => {
    if (!replyContent.trim()) return;
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? { ...t, lastMessage: replyContent, status: t.status === 'open' ? 'in_review' : t.status }
          : t
      )
    );
    if (selectedTicket && selectedTicket.id === ticketId) {
      setSelectedTicket((prev) => (prev ? { ...prev, lastMessage: replyContent } : null));
    }
    setReplyContent('');
    toast({
      type: 'success',
      title: 'Reply Dispatched',
      message: 'Confidential message securely routed to employee private workspace.',
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-theme-subtle">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-[0.04em] text-accent font-semibold">
            HRBP Operations • Confidential Governance
          </div>
          <h1 className="text-2xl font-semibold tracking-[-0.02em] text-theme-primary mt-1">
            HRBP Operations &amp; Support Triage
          </h1>
          <p className="text-xs text-theme-secondary font-sans mt-0.5">
            Cross-squad scorecard, confidential wellbeing triage inbox, and manager commitment tracking.
          </p>
        </div>

        {/* Cycle Toggle */}
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

      {/* KPI Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiStatTile
          label="Active Delivery Squads"
          value={ENTERPRISE_SQUADS.length}
          format="number"
          deltaLabel="12 squads monitored"
          sparklineData={[8, 9, 10, 12]}
        />
        <KpiStatTile
          label="Total Survey Responses"
          value={98}
          format="number"
          delta={8.4}
          deltaLabel="98 of 108 engineers (91%)"
          sparklineData={[70, 78, 83, 98]}
        />
        <KpiStatTile
          label="Confidential Support Tickets"
          value={tickets.length}
          format="number"
          deltaLabel="2 in active review"
          sparklineData={[1, 2, 2, 3]}
        />
        <KpiStatTile
          label="Audit Log Status"
          value={100}
          format="percent"
          deltaLabel="Zero policy breaches"
          sparklineData={[100, 100, 100, 100]}
        />
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-theme-subtle text-xs font-mono overflow-x-auto">
        {[
          { id: 'scorecards', label: `All Squads Scorecard (${ENTERPRISE_SQUADS.length})` },
          { id: 'triage', label: `Support Request Triage (${tickets.length})` },
          { id: 'synthesis', label: 'BU Thematic AI Synthesis' },
          { id: 'broadcast', label: 'Anonymous Reminders' },
          { id: 'audit', label: 'Security & Audit Trail' },
          { id: 'privacy', label: 'Privacy Invariants' },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2.5 px-3 font-medium transition-colors border-b-2 -mb-[1px] whitespace-nowrap ${
                isActive
                  ? 'border-accent text-accent font-semibold'
                  : 'border-transparent text-theme-secondary hover:text-theme-primary'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab 1: All Squads Scorecard */}
      {activeTab === 'scorecards' && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-[0.04em] text-theme-tertiary font-semibold">
              Twelve Engineering Squads • Multi-Unit Diagnostics
            </span>
            <button
              onClick={() => handleBulkExport([])}
              className="flex items-center gap-1.5 px-3 py-1 bg-theme-surface hover:bg-theme-raised border hairline-border rounded-control text-xs font-mono text-theme-primary transition-colors focus-ring"
            >
              <Download size={13} strokeWidth={1.5} />
              <span>Export Safe CSV (N &ge; 5)</span>
            </button>
          </div>

          <DataTable
            columns={columns}
            data={tableRows}
            onRowClick={handleRowClick}
            onBulkExport={handleBulkExport}
            defaultPageSize={12}
          />
        </section>
      )}

      {/* Tab 2: Confidential Support Request Triage Inbox */}
      {activeTab === 'triage' && (
        <section className="space-y-4">
          <div className="p-4 bg-theme-raised border hairline-border rounded-panel flex items-start gap-3">
            <ShieldCheck size={18} className="text-accent flex-shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <div className="font-semibold text-theme-primary font-mono uppercase tracking-wider">
                Firewalled Employee Support Triage
              </div>
              <p className="text-theme-secondary font-sans leading-relaxed">
                Requests here are visible strictly to HR Business Partners. Delivery managers, team leads, and executive leadership have zero read permissions in Firestore. All communications are pseudonymized unless the employee opted to share identity.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Tickets List */}
            <div className="lg:col-span-1 space-y-2">
              <div className="text-[11px] font-mono uppercase tracking-wider text-theme-tertiary px-1">
                Incoming Tickets ({tickets.length})
              </div>

              <div className="space-y-2">
                {tickets.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTicket(t)}
                    className={`p-3.5 rounded-panel border transition-all cursor-pointer space-y-2 ${
                      selectedTicket?.id === t.id
                        ? 'bg-theme-raised border-accent shadow-xs'
                        : 'bg-theme-surface hairline-border hover:bg-theme-raised/60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-theme-primary">{t.id}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-mono uppercase ${
                          t.urgency === 'critical'
                            ? 'bg-danger/10 text-danger border border-danger/30'
                            : t.urgency === 'elevated'
                            ? 'bg-warning/10 text-warning border border-warning/30'
                            : 'bg-accent/10 text-accent border border-accent/30'
                        }`}
                      >
                        {t.urgency}
                      </span>
                    </div>

                    <div className="text-xs font-semibold text-theme-primary line-clamp-1">
                      {t.subject}
                    </div>

                    <div className="text-[11px] font-mono text-theme-tertiary truncate">
                      {t.unit}
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono pt-1 border-t border-theme-subtle">
                      <span
                        className={`uppercase font-bold ${
                          t.status === 'assigned'
                            ? 'text-accent'
                            : t.status === 'open'
                            ? 'text-danger'
                            : 'text-warning'
                        }`}
                      >
                        {t.status}
                      </span>
                      <span className="text-theme-tertiary">{t.submittedAt}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Ticket Detail Panel */}
            <div className="lg:col-span-2">
              {selectedTicket ? (
                <div className="p-5 bg-theme-surface border hairline-border rounded-panel space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-theme-subtle">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-bold text-theme-primary">
                          {selectedTicket.id}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-accent/10 text-accent font-mono text-[10px]">
                          {selectedTicket.category}
                        </span>
                      </div>
                      <div className="text-xs text-theme-tertiary font-mono mt-0.5">
                        Author: {selectedTicket.pseudonym} • {selectedTicket.unit}
                      </div>
                    </div>

                    {/* Quick Status Transition */}
                    <div className="flex items-center gap-2 font-mono text-xs">
                      <span>Status:</span>
                      <select
                        value={selectedTicket.status}
                        onChange={(e) => handleStatusTransition(selectedTicket.id, e.target.value)}
                        className="h-8 px-2 bg-theme-raised border hairline-border rounded-control text-xs text-theme-primary"
                      >
                        <option value="open">Open</option>
                        <option value="in_review">In Review</option>
                        <option value="assigned">Assigned</option>
                        <option value="resolved">Resolved</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-sm font-semibold text-theme-primary">
                      {selectedTicket.subject}
                    </h3>
                    <p className="text-xs text-theme-secondary font-sans leading-relaxed p-3 bg-theme-raised rounded-control border hairline-border">
                      {selectedTicket.description}
                    </p>
                  </div>

                  {/* Assignment Controls */}
                  <div className="p-3 bg-theme-raised border hairline-border rounded-control flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <UserCheck size={14} className="text-accent" />
                      <span>Assigned HRBP:</span>
                      <strong className="text-theme-primary">{selectedTicket.assignedHrbp}</strong>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleAssignTicket(selectedTicket.id, 'Kavita Menon (Lead HRBP)')}
                        className="px-2.5 py-1 bg-theme-surface hover:bg-theme-surface/80 border hairline-border rounded-control text-[11px]"
                      >
                        Assign to Kavita
                      </button>
                      <button
                        onClick={() => handleAssignTicket(selectedTicket.id, 'Pooja Hegde (Associate HRBP)')}
                        className="px-2.5 py-1 bg-theme-surface hover:bg-theme-surface/80 border hairline-border rounded-control text-[11px]"
                      >
                        Assign to Pooja
                      </button>
                    </div>
                  </div>

                  {/* Message Thread */}
                  <div className="space-y-2 pt-2">
                    <div className="text-xs font-mono uppercase tracking-wider text-theme-tertiary">
                      Last Action / Note
                    </div>
                    <div className="p-3 bg-accent/5 border border-accent/20 rounded-control text-xs font-sans text-theme-primary">
                      {selectedTicket.lastMessage}
                    </div>

                    <div className="pt-2 flex gap-2">
                      <input
                        type="text"
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder="Write confidential response to employee..."
                        className="flex-1 h-9 px-3 bg-theme-raised border hairline-border rounded-control text-xs text-theme-primary focus-ring"
                      />
                      <button
                        onClick={() => handleSendHrbpReply(selectedTicket.id)}
                        className="h-9 px-4 bg-accent hover:bg-accent-hover text-white text-xs font-mono rounded-control transition-colors shadow-xs flex items-center gap-1.5"
                      >
                        <Send size={12} />
                        <span>Reply</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-12 text-center bg-theme-raised/40 border hairline-border rounded-panel text-xs font-mono text-theme-tertiary">
                  Select a support ticket to review context, reassign ownership, or send confidential replies.
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Tab 3: BU Thematic AI Synthesis */}
      {activeTab === 'synthesis' && (
        <section className="space-y-6">
          <div className="p-5 rounded-panel bg-theme-surface border hairline-border space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono uppercase tracking-[0.04em] text-accent font-semibold">
                    Gemini 1.5 Thematic Synthesis Engine
                  </span>
                  <StatusBadge
                    label={aiKillSwitch ? 'AI Synthesis Enabled' : 'Kill-Switch Engaged'}
                    variant={aiKillSwitch ? 'success' : 'danger'}
                  />
                </div>
                <h3 className="text-lg font-semibold text-theme-primary">
                  Multi-Squad Thematic Comment Summary
                </h3>
                <p className="text-xs text-theme-secondary font-sans max-w-2xl">
                  Synthesizes high-frequency friction patterns across qualifying squads (N &ge; 10, &ge; 5 comments). Personal identifiers, squad codes, and direct quotations are scrubbed in memory prior to inference.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setAiKillSwitch(!aiKillSwitch)}
                  className={`px-3 py-1.5 rounded-control text-xs font-mono font-medium border transition-colors focus-ring ${
                    aiKillSwitch
                      ? 'bg-danger/10 text-danger border-danger/30 hover:bg-danger/20'
                      : 'bg-success/10 text-success border-success/30 hover:bg-success/20'
                  }`}
                >
                  {aiKillSwitch ? 'Engage AI Kill-Switch' : 'Resume AI Analysis'}
                </button>

                <button
                  onClick={handleTriggerAiSynthesis}
                  disabled={isGeneratingAi || !aiKillSwitch}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-accent hover:bg-accent-hover disabled:opacity-40 text-white rounded-control text-xs font-mono font-medium transition-colors shadow-xs focus-ring"
                >
                  <RefreshCw
                    size={13}
                    strokeWidth={1.5}
                    className={isGeneratingAi ? 'animate-spin' : ''}
                  />
                  <span>{isGeneratingAi ? 'Synthesizing...' : 'Re-Run Synthesis'}</span>
                </button>
              </div>
            </div>

            <div className="p-4 rounded-control bg-theme-raised border hairline-border font-sans text-xs sm:text-sm text-theme-primary leading-relaxed">
              {aiGeneratedText}
            </div>

            <div className="pt-2 border-t border-theme-subtle flex flex-wrap items-center justify-between text-[11px] font-mono text-theme-tertiary">
              <span>Guardrails: Grounded in 98 verified responses • No raw quotes emitted</span>
              <span>Differential Privacy: Active</span>
            </div>
          </div>
        </section>
      )}

      {/* Tab 4: Anonymous Broadcast Reminders */}
      {activeTab === 'broadcast' && (
        <section className="space-y-4">
          <div className="p-5 rounded-panel bg-theme-surface border hairline-border space-y-4 max-w-2xl">
            <div className="space-y-1">
              <span className="text-xs font-mono uppercase tracking-[0.04em] text-theme-tertiary font-semibold">
                Survey Completion Operations
              </span>
              <h3 className="text-lg font-semibold text-theme-primary">
                Blind Participation Reminder Dispatch
              </h3>
              <p className="text-xs text-theme-secondary font-sans leading-relaxed">
                Dispatches a standardized reminder email to all team members who have not yet burned their single-use survey token. HRBPs cannot see who has or has not responded; reminders are sent blindly through the hash daemon.
              </p>
            </div>

            <div className="p-4 rounded-control bg-theme-raised border hairline-border space-y-2 text-xs font-mono">
              <div className="flex justify-between text-theme-secondary">
                <span>Active Cycle:</span>
                <span className="text-theme-primary font-bold">Q1 2026 Full Pulse</span>
              </div>
              <div className="flex justify-between text-theme-secondary">
                <span>Remaining Unsent Hashes:</span>
                <span className="text-warning font-bold">10 Tokens</span>
              </div>
              <div className="flex justify-between text-theme-secondary">
                <span>Current Participation Rate:</span>
                <span className="text-success font-bold">90.7% (98 / 108)</span>
              </div>
            </div>

            <button
              onClick={handleBroadcastReminder}
              disabled={isBroadcasting}
              className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover disabled:opacity-50 text-white rounded-control text-xs font-mono font-medium transition-colors shadow-xs focus-ring"
            >
              <Send size={13} strokeWidth={1.5} />
              <span>{isBroadcasting ? 'Broadcasting...' : 'Trigger Blind Reminders'}</span>
            </button>
          </div>
        </section>
      )}

      {/* Tab 5: Security & Audit Trail */}
      {activeTab === 'audit' && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-[0.04em] text-theme-tertiary font-semibold">
              Platform Operational Audit Trail
            </span>
          </div>

          <AuditLog logs={ENTERPRISE_AUDIT_LOGS} />
        </section>
      )}

      {/* Tab 6: Privacy Invariants */}
      {activeTab === 'privacy' && (
        <section className="space-y-4">
          <div className="p-6 rounded-panel bg-theme-surface border hairline-border space-y-4 max-w-3xl">
            <h3 className="text-base font-semibold text-theme-primary">
              Section 18 & Governance Invariants
            </h3>
            <div className="space-y-3 text-xs leading-relaxed text-theme-secondary font-sans">
              <div className="p-3.5 rounded-control bg-theme-raised border hairline-border space-y-1">
                <span className="font-mono text-theme-primary font-semibold">
                  Rule 1: Strict Minimum Response Threshold (N &ge; 5)
                </span>
                <p>
                  Any squad, unit, or filtered cohort with fewer than 5 respondents has all numerical scores and bar charts suppressed in both UI and API payloads.
                </p>
              </div>

              <div className="p-3.5 rounded-control bg-theme-raised border hairline-border space-y-1">
                <span className="font-mono text-theme-primary font-semibold">
                  Rule 2: Support Request Firewall
                </span>
                <p>
                  Confidential support tickets are strictly firewalled to designated HR Business Partners. Managers and Senior Leadership have zero read permissions.
                </p>
              </div>

              <div className="p-3.5 rounded-control bg-theme-raised border hairline-border space-y-1">
                <span className="font-mono text-theme-primary font-semibold">
                  Rule 3: Non-Evaluative AI Grounding
                </span>
                <p>
                  AI summaries must not quote respondents directly or rank individuals. All generation is subject to an immediate administrative kill-switch.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Drawer */}
      <SideDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        record={selectedRecord}
      />
    </div>
  );
}
