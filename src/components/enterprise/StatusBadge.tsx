'use client';

import React from 'react';

export type StatusVariant = 'success' | 'warning' | 'danger' | 'accent' | 'neutral';

interface StatusBadgeProps {
  label: string;
  variant?: StatusVariant;
  live?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

const DOT_COLORS: Record<StatusVariant, string> = {
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
  accent: 'bg-accent',
  neutral: 'bg-theme-tertiary',
};

const BADGE_STYLES: Record<StatusVariant, string> = {
  success: 'bg-success/10 text-success border-success/20',
  warning: 'bg-warning/10 text-warning border-warning/20',
  danger: 'bg-danger/10 text-danger border-danger/20',
  accent: 'bg-accent/10 text-accent border-accent/20',
  neutral: 'bg-theme-surface text-theme-secondary border-theme-border',
};

export function StatusBadge({
  label,
  variant = 'neutral',
  live = false,
  size = 'md',
  className = '',
}: StatusBadgeProps) {
  const isSm = size === 'sm';

  return (
    <span
      className={`inline-flex items-center gap-1.5 border hairline-border rounded-control font-mono font-medium tracking-[0.02em] select-none ${
        isSm ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-[11px]'
      } ${BADGE_STYLES[variant]} ${className}`}
    >
      <span className="relative flex h-1.5 w-1.5">
        {live && (
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${DOT_COLORS[variant]}`}
          />
        )}
        <span
          className={`relative inline-flex rounded-full h-1.5 w-1.5 ${DOT_COLORS[variant]} ${
            live ? 'animate-live-dot' : ''
          }`}
        />
      </span>
      <span>{label}</span>
    </span>
  );
}
