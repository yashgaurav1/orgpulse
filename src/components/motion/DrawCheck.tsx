'use client';

import React, { useEffect, useState } from 'react';
import { MOTION_DURATIONS, MOTION_EASINGS, checkPrefersReducedMotion } from '@/lib/motion/tokens';

export interface DrawCheckProps {
  size?: number;
  strokeWidth?: number;
  color?: string;
  className?: string;
  onComplete?: () => void;
}

/**
 * <DrawCheck>
 * Calm SVG checkmark stroke drawing for survey submission success.
 * Draws stroke smoothly via stroke-dashoffset once mounted.
 */
export function DrawCheck({
  size = 40,
  strokeWidth = 2.5,
  color = '#1B1A17',
  className = '',
  onComplete,
}: DrawCheckProps) {
  const [drawn, setDrawn] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (checkPrefersReducedMotion()) {
      setReducedMotion(true);
      setDrawn(true);
      if (onComplete) onComplete();
      return;
    }

    const timer = setTimeout(() => {
      setDrawn(true);
      if (onComplete) {
        setTimeout(onComplete, MOTION_DURATIONS.base);
      }
    }, 50);

    return () => clearTimeout(timer);
  }, [onComplete]);

  // Total length of the checkmark polyline (roughly 30px)
  const pathLength = 32;
  const durationMs = MOTION_DURATIONS.base;
  const easing = MOTION_EASINGS.standard;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={`overflow-visible select-none ${className}`}
      aria-label="Success checkmark"
      role="img"
    >
      <circle
        cx="16"
        cy="16"
        r="14"
        stroke={color}
        strokeWidth="1.5"
        strokeOpacity="0.25"
      />
      <path
        d="M 9 16.5 L 14 21.5 L 23 11"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          strokeDasharray: pathLength,
          strokeDashoffset: drawn || reducedMotion ? 0 : pathLength,
          transition: reducedMotion ? 'none' : `stroke-dashoffset ${durationMs}ms ${easing}`,
        }}
      />
    </svg>
  );
}
