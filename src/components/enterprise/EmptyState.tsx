'use client';

import React from 'react';
import { Inbox, AlertTriangle, RefreshCw, LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: LucideIcon;
  className?: string;
}

export function EmptyState({
  title = 'No records found',
  description = 'No results match your current filter criteria.',
  actionLabel,
  onAction,
  icon: Icon = Inbox,
  className = '',
}: EmptyStateProps) {
  return (
    <div
      className={`p-8 rounded-panel bg-theme-surface border hairline-border flex flex-col items-center justify-center text-center ${className}`}
    >
      <div className="p-3 bg-theme-raised border hairline-border rounded-control text-theme-tertiary mb-3">
        <Icon size={20} strokeWidth={1.5} />
      </div>
      <h3 className="text-sm font-semibold text-theme-primary font-mono tracking-[-0.01em]">
        {title}
      </h3>
      <p className="mt-1 text-xs text-theme-secondary font-sans max-w-sm leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-4 px-3 py-1.5 bg-accent hover:bg-accent-hover text-white text-xs font-mono rounded-control font-medium transition-colors focus-ring"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = 'Something went wrong',
  message = 'An unexpected error occurred while fetching system data.',
  onRetry,
  className = '',
}: ErrorStateProps) {
  return (
    <div
      className={`p-8 rounded-panel bg-theme-surface border border-danger/30 flex flex-col items-center justify-center text-center ${className}`}
    >
      <div className="p-3 bg-danger/10 border border-danger/20 rounded-control text-danger mb-3">
        <AlertTriangle size={20} strokeWidth={1.5} />
      </div>
      <h3 className="text-sm font-semibold text-theme-primary font-mono tracking-[-0.01em]">
        {title}
      </h3>
      <p className="mt-1 text-xs text-theme-secondary font-sans max-w-sm leading-relaxed">
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 flex items-center gap-1.5 px-3 py-1.5 bg-theme-raised hover:bg-theme-border border hairline-border text-xs font-mono text-theme-primary rounded-control transition-colors focus-ring"
        >
          <RefreshCw size={13} strokeWidth={1.5} />
          <span>Retry Operation</span>
        </button>
      )}
    </div>
  );
}
