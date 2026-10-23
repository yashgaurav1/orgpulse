'use client';

import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, ExternalLink, ShieldCheck, Clock, Tag } from 'lucide-react';
import { motion } from 'framer-motion';
import { CopyId } from './CopyId';
import { RelativeTime } from './RelativeTime';
import { StatusBadge, StatusVariant } from './StatusBadge';

export interface DrawerRecord {
  id: string;
  name: string;
  status: string;
  statusVariant?: StatusVariant;
  category: string;
  score?: number;
  respondents?: number;
  lastUpdated: string;
  description?: string;
  owner?: string;
  actions?: Array<{ label: string; date: string; status: string }>;
}

interface SideDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  record: DrawerRecord | null;
}

export function SideDrawer({ open, onOpenChange, record }: SideDrawerProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'metrics' | 'history'>('overview');

  if (!record) return null;

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'metrics', label: 'Metrics & Health' },
    { id: 'history', label: 'Activity Log' },
  ] as const;

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        {/* Backdrop Fade */}
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs transition-opacity duration-200" />

        {/* Sliding Panel */}
        <Dialog.Content className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-theme-surface border-l hairline-border shadow-2xl flex flex-col focus-ring focus:outline-none animate-in slide-in-from-right duration-250 ease-[cubic-bezier(0.2,0,0,1)]">
          {/* Header */}
          <div className="p-4 border-b border-theme-subtle bg-theme-raised flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <StatusBadge
                  label={record.status}
                  variant={record.statusVariant || 'neutral'}
                  live={record.status === 'Active'}
                />
                <CopyId id={record.id} prefix="ID:" />
              </div>
              <Dialog.Title className="text-base font-semibold tracking-[-0.02em] text-theme-primary">
                {record.name}
              </Dialog.Title>
            </div>

            <Dialog.Close
              className="p-1.5 rounded-control text-theme-secondary hover:text-theme-primary hover:bg-theme-surface transition-colors focus-ring"
              aria-label="Close drawer"
            >
              <X size={16} strokeWidth={1.5} />
            </Dialog.Close>
          </div>

          {/* Sliding Tabs */}
          <div className="px-4 border-b border-theme-subtle flex items-center gap-2 relative bg-theme-surface">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative py-2.5 px-2 text-xs font-mono font-medium transition-colors select-none ${
                    isActive
                      ? 'text-accent'
                      : 'text-theme-secondary hover:text-theme-primary'
                  }`}
                >
                  <span>{tab.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="drawerTabIndicator"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent"
                      transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs font-mono">
            {activeTab === 'overview' && (
              <div className="space-y-4">
                <div className="p-3 bg-theme-raised border hairline-border rounded-control space-y-2">
                  <div className="text-[11px] uppercase tracking-[0.04em] text-theme-tertiary">
                    Record Details
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-theme-secondary">
                    <div>Category:</div>
                    <div className="text-theme-primary font-medium">{record.category}</div>
                    <div>Owner / Lead:</div>
                    <div className="text-theme-primary font-medium">{record.owner || 'Assigned Manager'}</div>
                    <div>Last Updated:</div>
                    <div><RelativeTime date={record.lastUpdated} /></div>
                  </div>
                </div>

                {record.description && (
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.04em] text-theme-tertiary mb-1">
                      Context & Notes
                    </div>
                    <p className="font-sans text-[13px] text-theme-secondary leading-relaxed bg-theme-raised p-3 rounded-control border border-theme-subtle">
                      {record.description}
                    </p>
                  </div>
                )}

                <div className="p-3 bg-accent/5 border border-accent/20 rounded-control">
                  <div className="flex items-center gap-2 text-accent font-medium mb-1">
                    <ShieldCheck size={14} strokeWidth={1.5} />
                    <span>Anonymity Shield</span>
                  </div>
                  <p className="text-[11px] font-sans text-theme-secondary">
                    Aggregated safely under Section 18 minimum group protection (N ≥ 5).
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'metrics' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-theme-raised border hairline-border rounded-control">
                  <span className="text-theme-secondary">Quarterly Score</span>
                  <span className="text-base font-semibold text-theme-primary tabular-nums">
                    {record.score !== undefined ? record.score.toFixed(2) : 'n/a'} / 5.00
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-theme-raised border hairline-border rounded-control">
                  <span className="text-theme-secondary">Sample Size (N)</span>
                  <span className="text-base font-semibold text-theme-primary tabular-nums">
                    {record.respondents ?? 'n/a'} respondents
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-theme-raised border hairline-border rounded-control">
                  <span className="text-theme-secondary">Org Benchmark</span>
                  <span className="text-base font-semibold text-theme-tertiary tabular-nums">
                    3.85 / 5.00
                  </span>
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="space-y-3">
                <div className="relative pl-4 space-y-4 before:absolute before:left-1 before:top-2 before:bottom-2 before:w-[1px] before:bg-theme-border">
                  <div className="relative">
                    <div className="absolute -left-[19px] top-1 w-2 h-2 rounded-full bg-accent ring-2 ring-theme-surface" />
                    <div className="text-theme-primary font-medium text-[12px]">
                      14-day action logged
                    </div>
                    <div className="text-theme-tertiary text-[11px]">
                      <RelativeTime date={record.lastUpdated} /> • Assigned to Manager
                    </div>
                  </div>

                  <div className="relative">
                    <div className="absolute -left-[19px] top-1 w-2 h-2 rounded-full bg-theme-tertiary ring-2 ring-theme-surface" />
                    <div className="text-theme-secondary text-[12px]">
                      Survey cycle closed
                    </div>
                    <div className="text-theme-tertiary text-[11px]">
                      7 days ago • Automated
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Drawer Footer */}
          <div className="p-4 border-t border-theme-subtle bg-theme-raised flex items-center justify-end gap-2 text-xs font-mono">
            <button
              onClick={() => onOpenChange(false)}
              className="px-3 py-1.5 text-theme-secondary hover:text-theme-primary rounded-control transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                onOpenChange(false);
              }}
              className="px-3 py-1.5 bg-accent hover:bg-accent-hover text-white rounded-control font-medium transition-colors focus-ring"
            >
              Save Changes
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
