'use client';

import React, { useState } from 'react';

interface RelativeTimeProps {
  date: string | Date;
  className?: string;
}

export function RelativeTime({ date, className = '' }: RelativeTimeProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const d = typeof date === 'string' ? new Date(date) : date;
  const isoString = isNaN(d.getTime()) ? 'Invalid date' : d.toISOString();
  const utcString = isNaN(d.getTime()) ? 'Invalid date' : d.toUTCString();

  const getRelative = (target: Date): string => {
    if (isNaN(target.getTime())) return 'unknown';
    const now = new Date();
    const diffSec = Math.floor((now.getTime() - target.getTime()) / 1000);

    if (diffSec < 60) return `${Math.max(1, diffSec)}s ago`;
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 30) return `${diffDays}d ago`;
    return target.toISOString().split('T')[0];
  };

  const relativeText = getRelative(d);

  return (
    <span
      className={`relative inline-block cursor-help font-mono text-[11px] tabular-nums text-theme-secondary hover:text-theme-primary transition-colors duration-100 ${className}`}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      title={utcString}
    >
      {relativeText}
      {showTooltip && (
        <span
          role="tooltip"
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-0.5 z-50 bg-theme-raised border hairline-border text-theme-primary text-[10px] font-mono whitespace-nowrap rounded-control shadow-md pointer-events-none"
        >
          {isoString}
        </span>
      )}
    </span>
  );
}
