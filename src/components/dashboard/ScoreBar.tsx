'use client';

import React from 'react';
import { BarFill, CountUp } from '@/components/motion';

interface ScoreBarProps {
  label: string;
  domain: string;
  value: number | null;
  previousValue?: number | null;
  isShortInterval?: boolean;
  hidden?: boolean;
}

/**
 * ScoreBar with Motion System integration & Enterprise Design Tokens:
 * - Scores use <BarFill> and <CountUp> (tabular numbers)
 * - Strict Privacy Guard: If hidden === true, suppressed panel is shown with zero score data
 */
export function ScoreBar({
  label,
  domain,
  value,
  previousValue,
  isShortInterval = false,
  hidden = false,
}: ScoreBarProps) {
  if (hidden || value === null) {
    return (
      <div className="py-3 border-b border-theme-subtle space-y-1.5 font-mono text-xs">
        <div className="flex justify-between items-baseline">
          <div>
            <span className="font-bold text-accent mr-2">{label}</span>
            <span className="uppercase tracking-wider text-theme-tertiary">
              {domain}
            </span>
          </div>
          <span className="text-theme-tertiary">{hidden ? 'Hidden' : 'n/a'}</span>
        </div>
        <BarFill value={null} hidden={true} />
      </div>
    );
  }

  const delta =
    previousValue !== null && previousValue !== undefined
      ? Number((value - previousValue).toFixed(2))
      : null;

  let barColorClass = 'bg-accent';
  if (value >= 3.8) {
    barColorClass = 'bg-success';
  } else if (value < 3.0 || (delta !== null && delta <= -0.4)) {
    barColorClass = 'bg-danger';
  }

  return (
    <div className="py-3 border-b border-theme-subtle space-y-2 font-mono text-xs">
      <div className="flex justify-between items-baseline">
        <div className="flex items-center gap-2">
          <span className="font-bold text-accent">{label}</span>
          <span className="font-sans font-medium text-theme-primary">{domain}</span>
        </div>
        <div className="flex items-center gap-3">
          {delta !== null && (
            <span
              className={`text-[11px] tabular-nums font-medium ${
                delta > 0
                  ? 'text-success'
                  : delta < 0
                  ? 'text-danger'
                  : 'text-theme-tertiary'
              }`}
            >
              {delta > 0 ? `+${delta.toFixed(2)}` : delta.toFixed(2)}
            </span>
          )}
          <span className="font-bold text-sm text-theme-primary tabular-nums">
            <CountUp value={value} />
          </span>
        </div>
      </div>

      <BarFill value={value} colorClass={barColorClass} />
    </div>
  );
}
