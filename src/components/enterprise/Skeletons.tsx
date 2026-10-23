'use client';

import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'rect' | 'text' | 'card' | 'table';
  count?: number;
}

export function Skeleton({ className = '', variant = 'rect', count = 1 }: SkeletonProps) {
  if (variant === 'card') {
    return (
      <div className={`p-4 rounded-panel bg-theme-surface border hairline-border space-y-3 ${className}`}>
        <div className="h-3 w-1/3 bg-theme-raised rounded-xs skeleton-shimmer" />
        <div className="h-7 w-1/2 bg-theme-raised rounded-xs skeleton-shimmer" />
        <div className="h-2 w-2/3 bg-theme-raised rounded-xs skeleton-shimmer" />
      </div>
    );
  }

  if (variant === 'table') {
    return (
      <div className={`rounded-panel bg-theme-surface border hairline-border overflow-hidden divide-y divide-theme-subtle ${className}`}>
        <div className="h-9 bg-theme-raised skeleton-shimmer" />
        {Array.from({ length: count || 4 }).map((_, i) => (
          <div key={i} className="h-9 px-4 flex items-center justify-between gap-4">
            <div className="h-3 w-1/4 bg-theme-raised rounded-xs skeleton-shimmer" />
            <div className="h-3 w-1/6 bg-theme-raised rounded-xs skeleton-shimmer" />
            <div className="h-3 w-1/5 bg-theme-raised rounded-xs skeleton-shimmer" />
            <div className="h-3 w-12 bg-theme-raised rounded-xs skeleton-shimmer" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className={`bg-theme-raised rounded-xs skeleton-shimmer ${className}`}
      style={{ minHeight: variant === 'text' ? '14px' : undefined }}
    />
  );
}
