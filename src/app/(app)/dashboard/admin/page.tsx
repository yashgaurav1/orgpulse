'use client';

import React, { useState } from 'react';
import { useAuth, UserRole } from '@/lib/auth-context';
import {
  Shield,
  KeyRound,
  Users,
  Building2,
  RefreshCw,
  CheckCircle2,
  XCircle,
  AlertOctagon,
  Copy,
  Plus,
  Trash2,
  Clock,
  Layers,
  Settings,
  Sliders,
  Sparkles,
} from 'lucide-react';

interface PendingApproval {
  id: string;
  name: string;
  email: string;
  requestedRole: UserRole;
  team: string;
  submittedAt: string;
}

const INITIAL_APPROVALS: PendingApproval[] = [
  {
    id: 'app-01',
    name: 'Sameer Sen',
    email: 'sameer.sen@enterprise.corp',
    requestedRole: 'manager',
    team: 'Squad 04 (Platform Infrastructure & SRE)',
    submittedAt: '2026-02-17 11:20',
  },
  {
    id: 'app-02',
    name: 'Pooja Hegde',
    email: 'pooja.h@enterprise.corp',
    requestedRole: 'hrbp',
    team: 'Financial Services BU',
    submittedAt: '2026-02-18 08:45',
  },
  {
    id: 'app-03',
    name: 'Arjun Mehta',
    email: 'arjun.mehta@enterprise.corp',
    requestedRole: 'senior_leadership',
    team: 'VP Operations',
    submittedAt: '2026-02-18 14:10',
  },
];

interface AuditEntry {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  target: string;
  status: 'SUCCESS' | 'REVOKED' | 'WARNING';
}

const INITIAL_AUDIT_LOGS: AuditEntry[] = [
  {
    id: 'aud-901',
    timestamp: '2026-02-18 15:32:00',
    actor: 'admin@enterprise.internal',
    action: 'ROTATE_COMPANY_CODE',
    target: 'HAVEN-ACME-8942 -> HAVEN-ACME-4182',
    status: 'SUCCESS',
  },
  {
    id: 'aud-902',
    timestamp: '2026-02-17 10:14:00',
    actor: 'admin@enterprise.internal',
    action: 'APPROVE_ROLE_ELEVATION',
    target: 'user:rajesh.nair@enterprise.corp -> manager',
    status: 'SUCCESS',
  },
  {
    id: 'aud-903',
    timestamp: '2026-02-15 00:00:00',
    actor: 'system:cron_retention',
    action: 'RETENTION_PURGE_90_DAY',
    target: 'cycle:2025-q3 raw responses destroyed',
    status: 'SUCCESS',
  },
];

export default function CompanyAdminPage() {
  const { profile, isDemo } = useAuth();
  const [activeTab, setActiveTab] = useState<'approvals' | 'tenant' | 'org' | 'governance' | 'audit'>('approvals');

  // Company Code
  const [companyCode, setCompanyCode] = useState('HAVEN-ACME-4182');
  const [copiedCode, setCopiedCode] = useState(false);
  const [isRotating, setIsRotating] = useState(false);

  // Role Approvals
  const [pendingApprovals, setPendingApprovals] = useState<PendingApproval[]>(INITIAL_APPROVALS);

  // AI Kill-switch
  const [aiKillSwitchActive, setAiKillSwitchActive] = useState(false);

  // Audit Logs
  const [auditLogs, setAuditLogs] = useState<AuditEntry[]>(INITIAL_AUDIT_LOGS);

  // Org Units
  const [businessUnits, setBusinessUnits] = useState([
    { id: 'bu-1', name: 'Financial Services', squadCount: 4 },
    { id: 'bu-2', name: 'Core Platform & Infrastructure', squadCount: 3 },
    { id: 'bu-3', name: 'Customer Experience & Mobile', squadCount: 3 },
    { id: 'bu-4', name: 'Data & Applied ML', squadCount: 2 },
  ]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(companyCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleRotateCode = () => {
    setIsRotating(true);
    setTimeout(() => {
      const newCode = `HAVEN-ACME-${Math.floor(1000 + Math.random() * 9000)}`;
      const oldCode = companyCode;
      setCompanyCode(newCode);
      setIsRotating(false);

      // Append audit log
      const logEntry: AuditEntry = {
        id: `aud-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
        actor: profile?.email || 'admin@enterprise.internal',
        action: 'ROTATE_COMPANY_CODE',
        target: `${oldCode} -> ${newCode}`,
        status: 'SUCCESS',
      };
      setAuditLogs((prev) => [logEntry, ...prev]);
    }, 700);
  };

  const handleApproveRole = (id: string, name: string, role: string) => {
    setPendingApprovals((prev) => prev.filter((a) => a.id !== id));

    const logEntry: AuditEntry = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      actor: profile?.email || 'admin@enterprise.internal',
      action: 'APPROVE_ROLE_ELEVATION',
      target: `${name} -> ${role}`,
      status: 'SUCCESS',
    };
    setAuditLogs((prev) => [logEntry, ...prev]);
  };

  const handleRejectRole = (id: string, name: string, role: string) => {
    setPendingApprovals((prev) => prev.filter((a) => a.id !== id));

    const logEntry: AuditEntry = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      actor: profile?.email || 'admin@enterprise.internal',
      action: 'REJECT_ROLE_ELEVATION',
      target: `${name} -> ${role}`,
      status: 'REVOKED',
    };
    setAuditLogs((prev) => [logEntry, ...prev]);
  };

  const handleToggleAiKillSwitch = () => {
    const newState = !aiKillSwitchActive;
    setAiKillSwitchActive(newState);

    const logEntry: AuditEntry = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      actor: profile?.email || 'admin@enterprise.internal',
      action: newState ? 'AI_KILL_SWITCH_ENGAGED' : 'AI_KILL_SWITCH_DISENGAGED',
      target: 'Platform-wide LLM functions & companion chat',
      status: newState ? 'WARNING' : 'SUCCESS',
    };
    setAuditLogs((prev) => [logEntry, ...prev]);
  };

  return (
    <div className="max-w-[1200px] mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="p-6 bg-theme-raised border hairline-border rounded-panel space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-control bg-accent/10 border border-accent/20 text-accent font-mono text-[10px] uppercase font-semibold">
                <Shield size={11} />
                <span>Tenant Governance & IAM</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-semibold text-theme-primary tracking-[-0.02em]">
                Company Administration & Privacy Controls
              </h1>
              <p className="text-xs sm:text-sm text-theme-secondary font-sans max-w-2xl">
                Manage registration keys, role authorization queues, organizational units, and emergency AI kill-switches.
              </p>
            </div>

            {/* Quick Stats */}
            <div className="flex items-center gap-3 font-mono text-xs">
              <div className="p-2.5 bg-theme-surface border hairline-border rounded-control text-center min-w-[90px]">
                <div className="text-[10px] text-theme-tertiary uppercase">Pending Approvals</div>
                <div className="text-base font-bold text-accent">{pendingApprovals.length}</div>
              </div>
              <div className="p-2.5 bg-theme-surface border hairline-border rounded-control text-center min-w-[90px]">
                <div className="text-[10px] text-theme-tertiary uppercase">Active Squads</div>
                <div className="text-base font-bold text-theme-primary">12</div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-theme-subtle bg-theme-surface px-4 rounded-panel border hairline-border">
          {[
            { id: 'approvals', label: `Role Approvals (${pendingApprovals.length})`, icon: Users },
            { id: 'tenant', label: 'Company Key & Tenant', icon: KeyRound },
            { id: 'org', label: 'Organization Units', icon: Building2 },
            { id: 'governance', label: 'AI Kill-Switch & Privacy', icon: Sliders },
            { id: 'audit', label: 'Immutable Audit Log', icon: Clock },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-3 px-4 text-xs font-mono border-b-2 transition-all ${
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

        {/* Tab 1: Role Approvals Queue */}
        {activeTab === 'approvals' && (
          <div className="p-6 bg-theme-surface border hairline-border rounded-panel space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-theme-primary">
                  Pending Elevated Role Authorization Requests
                </h2>
                <p className="text-xs text-theme-secondary font-sans">
                  In accordance with security rules, employees cannot self-assign Manager, HRBP, or Executive permissions.
                </p>
              </div>
            </div>

            {pendingApprovals.length === 0 ? (
              <div className="p-8 text-center bg-theme-raised/40 border hairline-border rounded-control font-mono text-xs text-theme-tertiary">
                <CheckCircle2 size={24} className="mx-auto text-success mb-2" />
                <span>All role requests have been reviewed and resolved.</span>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingApprovals.map((req) => (
                  <div
                    key={req.id}
                    className="p-4 bg-theme-raised border hairline-border rounded-control flex flex-wrap items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-theme-primary">{req.name}</span>
                        <span className="font-mono text-theme-tertiary">({req.email})</span>
                        <span className="px-2 py-0.5 rounded-full bg-accent/10 border border-accent/20 text-accent font-mono uppercase text-[10px]">
                          Requested: {req.requestedRole}
                        </span>
                      </div>
                      <div className="font-mono text-theme-secondary text-[11px]">
                        Target Scope: {req.team} • Submitted: {req.submittedAt}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 font-mono">
                      <button
                        onClick={() => handleRejectRole(req.id, req.name, req.requestedRole)}
                        className="px-3 py-1.5 bg-theme-surface hover:bg-danger/10 border border-theme-border hover:border-danger/40 text-danger rounded-control transition-colors flex items-center gap-1.5 focus-ring"
                      >
                        <XCircle size={13} />
                        <span>Reject</span>
                      </button>
                      <button
                        onClick={() => handleApproveRole(req.id, req.name, req.requestedRole)}
                        className="px-3.5 py-1.5 bg-accent hover:bg-accent-hover text-white rounded-control font-medium transition-colors shadow-xs flex items-center gap-1.5 focus-ring"
                      >
                        <CheckCircle2 size={13} />
                        <span>Approve Elevated Role</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Company Key & Tenant Setup */}
        {activeTab === 'tenant' && (
          <div className="p-6 bg-theme-surface border hairline-border rounded-panel space-y-6 max-w-2xl">
            <div className="space-y-1">
              <h2 className="text-sm font-semibold text-theme-primary">
                Company Onboarding Code (Single Key)
              </h2>
              <p className="text-xs text-theme-secondary font-sans">
                Employees and leaders use this key during sign-up to join your corporate tenant without email invitations.
              </p>
            </div>

            <div className="p-4 bg-theme-raised border hairline-border rounded-control space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase text-theme-tertiary">
                  Current Active Company Key
                </span>
                <span className="text-[10px] font-mono text-success flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-success animate-live-dot" />
                  Active & Valid
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex-1 h-11 px-3 bg-theme-surface border hairline-border rounded-control flex items-center font-mono text-base font-bold text-accent tracking-wider select-all">
                  {companyCode}
                </div>
                <button
                  onClick={handleCopyCode}
                  className="h-11 px-4 bg-theme-surface hover:bg-theme-raised border hairline-border rounded-control text-xs font-mono text-theme-primary transition-colors flex items-center gap-1.5 focus-ring"
                >
                  <Copy size={13} />
                  <span>{copiedCode ? 'Copied!' : 'Copy Key'}</span>
                </button>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-theme-subtle">
                <span className="text-[11px] font-mono text-theme-tertiary">
                  Rotating revokes the old code immediately. Existing accounts remain unaffected.
                </span>
                <button
                  onClick={handleRotateCode}
                  disabled={isRotating}
                  className="px-3 py-1.5 bg-danger/10 hover:bg-danger/20 border border-danger/30 text-danger rounded-control text-xs font-mono flex items-center gap-1.5 transition-colors focus-ring"
                >
                  <RefreshCw size={12} className={isRotating ? 'animate-spin' : ''} />
                  <span>{isRotating ? 'Rotating...' : 'Rotate Key'}</span>
                </button>
              </div>
            </div>

            <div className="p-4 bg-theme-raised border hairline-border rounded-control space-y-2 text-xs font-mono">
              <div className="text-theme-primary font-semibold">Tenant Identification</div>
              <div className="flex justify-between text-theme-secondary">
                <span>Tenant Name:</span>
                <span className="text-theme-primary font-bold">Nexus Global Technologies (Enterprise)</span>
              </div>
              <div className="flex justify-between text-theme-secondary">
                <span>Tenant ID:</span>
                <span className="text-theme-tertiary">comp-nexus-enterprise-01</span>
              </div>
              <div className="flex justify-between text-theme-secondary">
                <span>Verified Email Domain:</span>
                <span className="text-theme-primary">@enterprise.corp</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Organization Units & Teams */}
        {activeTab === 'org' && (
          <div className="p-6 bg-theme-surface border hairline-border rounded-panel space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-theme-primary">
                  Organizational Hierarchy & Squad Mapping
                </h2>
                <p className="text-xs text-theme-secondary font-sans">
                  Structure your business units and delivery squads. Structural updates apply to the upcoming survey cycle.
                </p>
              </div>
              <button className="px-3.5 py-1.5 bg-accent hover:bg-accent-hover text-white text-xs font-mono rounded-control transition-colors shadow-xs flex items-center gap-1.5">
                <Plus size={13} />
                <span>Add Business Unit</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {businessUnits.map((bu) => (
                <div
                  key={bu.id}
                  className="p-4 bg-theme-raised border hairline-border rounded-control flex items-center justify-between"
                >
                  <div>
                    <div className="font-semibold text-theme-primary">{bu.name}</div>
                    <div className="text-[11px] font-mono text-theme-tertiary">
                      {bu.squadCount} Delivery Squads Assigned
                    </div>
                  </div>
                  <button className="text-xs font-mono text-accent hover:underline">
                    Edit Units
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: AI Kill-Switch & Platform Governance */}
        {activeTab === 'governance' && (
          <div className="p-6 bg-theme-surface border hairline-border rounded-panel space-y-6 max-w-2xl">
            <div className="space-y-1">
              <h2 className="text-sm font-semibold text-theme-primary">
                Executive AI Kill-Switch & Data Safety Controls
              </h2>
              <p className="text-xs text-theme-secondary font-sans">
                Instantly disable all generative AI syntheses, comment summaries, and companion chat across the entire company.
              </p>
            </div>

            <div
              className={`p-4 rounded-control border transition-colors space-y-3 ${
                aiKillSwitchActive
                  ? 'bg-danger/10 border-danger/40'
                  : 'bg-theme-raised border hairline-border'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertOctagon
                    size={18}
                    className={aiKillSwitchActive ? 'text-danger' : 'text-theme-tertiary'}
                  />
                  <div>
                    <div className="text-xs font-semibold text-theme-primary">
                      Platform-Wide AI Kill-Switch
                    </div>
                    <div className="text-[11px] text-theme-tertiary font-mono">
                      Status: {aiKillSwitchActive ? 'ENGAGED (AI DISABLED)' : 'NORMAL (ACTIVE)'}
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleToggleAiKillSwitch}
                  className={`px-4 py-1.5 rounded-control text-xs font-mono font-medium transition-colors focus-ring shadow-xs ${
                    aiKillSwitchActive
                      ? 'bg-success hover:bg-success-hover text-white'
                      : 'bg-danger hover:bg-danger-hover text-white'
                  }`}
                >
                  {aiKillSwitchActive ? 'Disengage Kill-Switch (Re-enable AI)' : 'ENGAGE EMERGENCY KILL-SWITCH'}
                </button>
              </div>

              <p className="text-xs text-theme-secondary font-sans leading-relaxed">
                When engaged, the Cloud Functions API immediately returns empty synthesis payloads and chat displays an offline maintenance notice. No third-party LLM APIs are called.
              </p>
            </div>

            <div className="p-4 bg-theme-raised border hairline-border rounded-control space-y-2 text-xs font-mono">
              <div className="text-theme-primary font-semibold">Automated Retention Policy</div>
              <div className="flex justify-between text-theme-secondary">
                <span>Raw Response Deletion Window:</span>
                <span className="text-theme-primary font-bold">90 Days Post-Cycle Close</span>
              </div>
              <div className="flex justify-between text-theme-secondary">
                <span>Aggregate Minimum Group:</span>
                <span className="text-success font-bold">N ≥ 5 Respondents</span>
              </div>
              <div className="flex justify-between text-theme-secondary">
                <span>AI Comment Synthesis Minimum:</span>
                <span className="text-accent font-bold">N ≥ 10 & ≥ 5 Comments</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Immutable Audit Log */}
        {activeTab === 'audit' && (
          <div className="p-6 bg-theme-surface border hairline-border rounded-panel space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-theme-primary">
                  Append-Only Administrative Audit Log
                </h2>
                <p className="text-xs text-theme-secondary font-sans">
                  Every security operation, role elevation, and code rotation is permanently logged.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-theme-subtle text-theme-tertiary uppercase text-[10px]">
                    <th className="py-2 px-3">Log ID</th>
                    <th className="py-2 px-3">Timestamp (UTC)</th>
                    <th className="py-2 px-3">Actor</th>
                    <th className="py-2 px-3">Action</th>
                    <th className="py-2 px-3">Target / Details</th>
                    <th className="py-2 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-theme-subtle">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-theme-raised/40">
                      <td className="py-2.5 px-3 text-theme-primary font-bold">{log.id}</td>
                      <td className="py-2.5 px-3 text-theme-secondary">{log.timestamp}</td>
                      <td className="py-2.5 px-3 text-accent">{log.actor}</td>
                      <td className="py-2.5 px-3 font-semibold text-theme-primary">{log.action}</td>
                      <td className="py-2.5 px-3 text-theme-secondary truncate max-w-xs">{log.target}</td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold ${
                            log.status === 'SUCCESS'
                              ? 'bg-success/10 text-success'
                              : log.status === 'WARNING'
                              ? 'bg-warning/10 text-warning'
                              : 'bg-danger/10 text-danger'
                          }`}
                        >
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
  );
}
