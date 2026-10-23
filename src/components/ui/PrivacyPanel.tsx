import React from 'react';
import { LockDraw } from '@/components/motion/LockDraw';

export interface PrivacyPanelProps {
  threshold?: number;
  responseCount?: number;
  title?: string;
  description?: string;
  className?: string;
}

export function PrivacyPanel({
  threshold = 5,
  title = 'Data Suppressed for Anonymity Protection',
  description,
  className = '',
}: PrivacyPanelProps) {
  const defaultDescription = `To prevent individual identity deduction in small teams, metrics are strictly withheld until at least ${threshold} responses are recorded in this cycle.`;

  return (
    <div
      role="region"
      aria-label="Privacy protection panel"
      className={`border hairline-border bg-theme-surface rounded-panel p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6 ${className}`}
    >
      <div className="p-3 bg-theme-raised border hairline-border rounded-control flex-shrink-0">
        <LockDraw size={28} color="#2E8EBF" />
      </div>

      <div className="space-y-1.5 flex-1">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-wider bg-warning/10 text-warning border border-warning/20 px-1.5 py-0.5 rounded-control font-semibold">
            N &lt; {threshold} Invariant
          </span>
          <h4 className="text-base font-semibold tracking-[-0.02em] text-theme-primary">{title}</h4>
        </div>
        <p className="font-sans text-xs text-theme-secondary leading-relaxed">
          {description || defaultDescription}
        </p>
      </div>
    </div>
  );
}
