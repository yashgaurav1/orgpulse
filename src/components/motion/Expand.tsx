'use client';

import React from 'react';
import { MOTION_DURATIONS, MOTION_EASINGS } from '@/lib/motion/tokens';

export interface ExpandProps {
  open: boolean;
  children: React.ReactNode;
  id?: string;
  className?: string;
}

/**
 * <Expand>
 * Robust height accordion animation using CSS Grid (grid-template-rows 0fr -> 1fr).
 * Requires ZERO JavaScript layout measurement or DOM polling.
 */
export function Expand({ open, children, id, className = '' }: ExpandProps) {
  const durationMs = MOTION_DURATIONS.base;
  const easing = MOTION_EASINGS.standard;

  return (
    <div
      id={id}
      aria-hidden={!open}
      className={`grid transition-[grid-template-rows] ${className}`}
      style={{
        gridTemplateRows: open ? '1fr' : '0fr',
        transitionDuration: `${durationMs}ms`,
        transitionTimingFunction: easing,
      }}
    >
      <div className="overflow-hidden min-h-0">
        {children}
      </div>
    </div>
  );
}
