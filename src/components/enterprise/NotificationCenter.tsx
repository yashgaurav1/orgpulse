'use client';

import React, { useState } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { Bell, CheckCheck, AlertCircle, Info, ShieldAlert } from 'lucide-react';
import { RelativeTime } from './RelativeTime';

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  unread: boolean;
  type: 'alert' | 'info' | 'shield';
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Squad E Response Threshold',
    description: 'Current response count (N=3) is below privacy threshold (N ≥ 5). Results remain suppressed.',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    unread: true,
    type: 'shield',
  },
  {
    id: 'notif-2',
    title: '14-Day Action Commitment Due',
    description: 'Squad A quarterly review closed 12 days ago. Action commitment pending within 48h.',
    timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    unread: true,
    type: 'alert',
  },
  {
    id: 'notif-3',
    title: 'Cycle Archive Job Completed',
    description: 'Retention daemon purged raw responses for cycles older than 90 days.',
    timestamp: new Date(Date.now() - 1000 * 60 * 600).toISOString(),
    unread: false,
    type: 'info',
  },
];

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'shield':
        return <ShieldAlert size={14} strokeWidth={1.5} className="text-warning" />;
      case 'alert':
        return <AlertCircle size={14} strokeWidth={1.5} className="text-danger" />;
      default:
        return <Info size={14} strokeWidth={1.5} className="text-accent" />;
    }
  };

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          className="relative p-1.5 rounded-control text-theme-secondary hover:text-theme-primary hover:bg-theme-raised transition-colors focus-ring"
          aria-label={`Notifications, ${unreadCount} unread`}
        >
          <Bell size={16} strokeWidth={1.5} />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-accent animate-pulse ring-2 ring-theme-surface" />
          )}
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          align="end"
          sideOffset={8}
          className="z-50 w-80 bg-theme-surface border hairline-border rounded-panel shadow-2xl overflow-hidden focus-ring"
        >
          <div className="flex items-center justify-between px-4 py-2.5 bg-theme-raised border-b border-theme-subtle">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-semibold uppercase tracking-[0.04em] text-theme-primary">
                Notifications
              </span>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.2 bg-accent/10 border border-accent/20 rounded-xs text-[10px] font-mono text-accent">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="flex items-center gap-1 text-[11px] font-mono text-theme-secondary hover:text-theme-primary transition-colors"
              >
                <CheckCheck size={12} strokeWidth={1.5} />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-theme-subtle">
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-xs font-mono text-theme-tertiary">
                No notifications.
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  className={`p-3 text-xs flex gap-3 transition-colors ${
                    item.unread ? 'bg-accent/5' : 'hover:bg-theme-raised/50'
                  }`}
                >
                  <div className="mt-0.5 flex-shrink-0">{getIcon(item.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-theme-primary truncate">
                        {item.title}
                      </span>
                      <RelativeTime date={item.timestamp} className="text-[10px]" />
                    </div>
                    <p className="mt-1 text-theme-secondary text-[11px] font-sans leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="px-4 py-2 bg-theme-raised border-t border-theme-subtle text-center text-[10px] font-mono text-theme-tertiary">
            Real-time Operational Telemetry
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
