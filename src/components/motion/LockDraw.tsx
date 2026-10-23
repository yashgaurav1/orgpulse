'use client';

import React, { useEffect, useState } from 'react';
import { MOTION_DURATIONS, MOTION_EASINGS, checkPrefersReducedMotion } from '@/lib/motion/tokens';

export interface LockDrawProps {
  size?: number;
  strokeWidth?: number;
  color?: string;
  className?: string;
}

/**
 * <LockDraw>
 * Simple, calm lock outline drawn once for privacy-suppressed states.
 * Strictly guarantees that no numbers, bars, skeletons, or placeholders exist behind it.
 */
export function LockDraw({ size = 20, strokeWidth = 1.5, color = '#57534E', className = '' }: LockDrawProps) {
  const [drawn, setDrawn] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (checkPrefersReducedMotion()) {
      setReducedMotion(true);
      setDrawn(true);
      return;
    }

    const timer = setTimeout(() => {
      setDrawn(true);
    }, 60);

    return () => clearTimeout(timer);
  }, []);

  const pathLength = 48;
  const durationMs = MOTION_DURATIONS.base;
  const easing = MOTION_EASINGS.standard;

  const strokeStyle: React.CSSProperties = reducedMotion
    ? { strokeDasharray: 'none', strokeDashoffset: 0 }
    : {
        strokeDasharray: pathLength,
        strokeDashoffset: drawn ? 0 : pathLength,
        transition: `stroke-dashoffset ${durationMs}ms ${easing}`,
      };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`select-none ${className}`}
      aria-hidden="true"
    >
      {/* Shackle */}
      <path
        d="M 7 11 V 7 A 5 5 0 0 1 17 7 V 11"
        style={strokeStyle}
      />
      {/* Body */}
      <rect
        x="5"
        y="11"
        width="14"
        height="10"
        rx="2"
        style={strokeStyle}
      />
      {/* Keyhole */}
      <circle cx="12" cy="16" r="1" fill={color} />
    </svg>
  );
}
