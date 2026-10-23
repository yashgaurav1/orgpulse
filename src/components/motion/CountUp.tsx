'use client';

import React, { useEffect, useRef, useState } from 'react';
import { MOTION_DURATIONS, MotionDurationKey, checkPrefersReducedMotion } from '@/lib/motion/tokens';

export interface CountUpProps {
  value: number | null | undefined;
  duration?: MotionDurationKey;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  hidden?: boolean;
  className?: string;
}

/**
 * <CountUp>
 * Animates numbers once on first view using ease-out interpolation.
 * Tabular figures (IBM Plex Mono) prevent layout shift.
 * 
 * CRITICAL PRIVACY INVARIANT:
 * NEVER runs on suppressed or hidden groups. If `hidden === true`, renders a calm static Hidden label,
 * ensuring zero numeric inference or timing leaks.
 */
export function CountUp({
  value,
  duration = 'slow',
  decimals = 2,
  prefix = '',
  suffix = '',
  hidden = false,
  className = '',
}: CountUpProps) {
  // 1. Mandatory Privacy Guard: If group is hidden, never animate or display numbers
  if (hidden) {
    return <span className={`font-mono tabular-nums ${className}`}>Hidden</span>;
  }
  if (value === null || value === undefined || isNaN(value)) {
    return <span className={`font-mono tabular-nums ${className}`}>n/a</span>;
  }

  const [displayValue, setDisplayValue] = useState<number>(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current) return;

    if (checkPrefersReducedMotion()) {
      setDisplayValue(value);
      hasAnimated.current = true;
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          observer.disconnect();

          const durationMs = MOTION_DURATIONS[duration];
          const startTime = performance.now();
          const startVal = 0;
          const endVal = value;

          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / durationMs, 1);
            // standard cubic-bezier(.2,.7,.2,1) ease approximation
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = startVal + (endVal - startVal) * easeOut;

            setDisplayValue(current);

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setDisplayValue(endVal);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [value, duration]);

  const formatted = displayValue.toFixed(decimals);

  return (
    <span
      ref={ref}
      className={`font-mono tabular-nums select-none ${className}`}
      style={{ fontVariantNumeric: 'tabular-nums' }}
      aria-label={`${prefix}${value.toFixed(decimals)}${suffix}`}
    >
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
