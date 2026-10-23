'use client';

import React, { useEffect, useState } from 'react';
import {
  MOTION_DISTANCES,
  MOTION_DURATIONS,
  MOTION_EASINGS,
  checkPrefersReducedMotion,
} from '@/lib/motion/tokens';

export interface ViewTransitionProps {
  children: React.ReactNode;
  direction?: 'forward' | 'backward';
  viewKey?: string | number;
  className?: string;
}

/**
 * <ViewTransition>
 * Directional view transition: 12px horizontal slide + fade.
 * Forward: slides from right (+12px) to center (0).
 * Backward: slides from left (-12px) to center (0).
 * Respects prefers-reduced-motion (pure opacity or instant swap).
 */
export function ViewTransition({
  children,
  direction = 'forward',
  viewKey,
  className = '',
}: ViewTransitionProps) {
  const [active, setActive] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (checkPrefersReducedMotion()) {
      setReducedMotion(true);
      setActive(true);
      return;
    }

    setActive(false);
    const frame = requestAnimationFrame(() => {
      setActive(true);
    });

    return () => cancelAnimationFrame(frame);
  }, [viewKey, direction]);

  const offset = direction === 'forward' ? MOTION_DISTANCES.reveal : -MOTION_DISTANCES.reveal;
  const durationMs = MOTION_DURATIONS.fast;
  const easing = MOTION_EASINGS.standard;

  const style: React.CSSProperties = reducedMotion
    ? { opacity: 1, transform: 'none' }
    : {
        opacity: active ? 1 : 0,
        transform: active ? 'translateX(0)' : `translateX(${offset}px)`,
        transition: `opacity ${durationMs}ms ${easing}, transform ${durationMs}ms ${easing}`,
        willChange: active ? 'auto' : 'opacity, transform',
      };

  return (
    <div key={viewKey} style={style} className={className}>
      {children}
    </div>
  );
}
