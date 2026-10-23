'use client';

import React from 'react';
import { ShieldCheck, UserCheck, Key, FileSpreadsheet, Lock } from 'lucide-react';
import { RelativeTime } from './RelativeTime';
import { CopyId } from './CopyId';

export interface AuditEvent {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  target: string;
  status: 'SUCCESS' | 'DENIED' | 'FLAGGED';
}

interface AuditLogProps {
  events?: AuditEvent[];
  logs?: AuditEvent[];
  className?: string;
}

const DEFAULT_EVENTS: AuditEvent[] = [
  {
    id: 'evt-8910',
    timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    actor: 'pilot-lead@enterprise.internal',
    action: 'INVITE_BATCH_DISPATCH',
    target: 'Squad A, B, C, D (100 invites generated)',
    status: 'SUCCESS',
  },
  {
    id: 'evt-8909',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    actor: 'manager-b@enterprise.internal',
    action: 'UNAUTHORIZED_VIEW_ATTEMPT',
    target: 'Squad A (Manager B attempted access)',
    status: 'DENIED',
  },
  {
    id: 'evt-8908',
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    actor: 'system-retention-worker',
    action: 'RAW_SURVEY_PURGE',
    target: 'Cycles > 90 days expired (6 responses deleted)',
    status: 'SUCCESS',
  },
  {
    id: 'evt-8907',
    timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    actor: 'hrbp-lead@enterprise.internal',
    action: 'EXPORT_TEAM_CSV',
    target: 'Excluding Squad E (N < 5 suppression enforced)',
    status: 'SUCCESS',
  },
];

export function AuditLog({ events, logs, className = '' }: AuditLogProps) {
  const displayEvents = events || logs || DEFAULT_EVENTS;
  return (
    <div className={`rounded-panel bg-theme-surface border hairline-border overflow-hidden ${className}`}>
      <div className="px-4 py-3 border-b border-theme-subtle bg-theme-raised flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck size={16} strokeWidth={1.5} className="text-accent" />
          <span className="text-xs font-mono uppercase tracking-[0.04em] text-theme-primary font-semibold">
            Security & Compliance Audit Trail
          </span>
        </div>
        <span className="text-[11px] font-mono text-theme-tertiary">
          Append-only • Immutable
        </span>
      </div>

      <div className="divide-y divide-theme-subtle overflow-x-auto">
        <table className="w-full text-left font-mono text-xs">
          <thead className="bg-theme-surface text-[10px] uppercase tracking-[0.04em] text-theme-tertiary border-b border-theme-subtle">
            <tr>
              <th className="px-4 py-2">Event ID</th>
              <th className="px-4 py-2">Timestamp</th>
              <th className="px-4 py-2">Actor</th>
              <th className="px-4 py-2">Action</th>
              <th className="px-4 py-2">Target & Details</th>
              <th className="px-4 py-2 text-right">Result</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme-subtle">
            {displayEvents.map((evt) => (
              <tr key={evt.id} className="hover:bg-theme-raised/50 transition-colors h-[38px]">
                <td className="px-4 py-2">
                  <CopyId id={evt.id} />
                </td>
                <td className="px-4 py-2 text-theme-secondary whitespace-nowrap">
                  <RelativeTime date={evt.timestamp} />
                </td>
                <td className="px-4 py-2 text-theme-primary font-medium truncate max-w-[180px]">
                  {evt.actor}
                </td>
                <td className="px-4 py-2 text-accent font-semibold">
                  {evt.action}
                </td>
                <td className="px-4 py-2 text-theme-secondary truncate max-w-[280px]">
                  {evt.target}
                </td>
                <td className="px-4 py-2 text-right">
                  <span
                    className={`inline-block px-1.5 py-0.5 rounded-control text-[10px] font-bold ${
                      evt.status === 'SUCCESS'
                        ? 'bg-success/10 text-success border border-success/20'
                        : evt.status === 'DENIED'
                        ? 'bg-danger/10 text-danger border border-danger/20'
                        : 'bg-warning/10 text-warning border border-warning/20'
                    }`}
                  >
                    {evt.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
