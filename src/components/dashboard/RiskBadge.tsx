import React from 'react';
import { RiskLevel } from '@/lib/flags';

interface RiskBadgeProps {
  level: RiskLevel;
  activeCount?: number;
}

export function RiskBadge({ level, activeCount }: RiskBadgeProps) {
  const styles: Record<RiskLevel, string> = {
    Low: 'bg-success/10 text-success border-success/30',
    Moderate: 'bg-theme-surface text-theme-secondary border-theme-border',
    High: 'bg-warning/10 text-warning border-warning/30',
    Critical: 'bg-danger/10 text-danger border-danger/30 font-bold',
  };

  const dots: Record<RiskLevel, string> = {
    Low: 'bg-success',
    Moderate: 'bg-theme-tertiary',
    High: 'bg-warning',
    Critical: 'bg-danger',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-control border font-mono text-xs ${styles[level]}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dots[level]}`} />
      <span>{level}</span>
      {activeCount !== undefined && activeCount > 0 && (
        <span className="text-[10px] opacity-80">({activeCount})</span>
      )}
    </span>
  );
}
