'use client';

import React, { useEffect, useRef, useState } from 'react';
import { MOTION_DURATIONS, MOTION_EASINGS, checkPrefersReducedMotion } from '@/lib/motion/tokens';

export interface BarFillProps {
  value: number | null | undefined;
  max?: number;
  threshold?: number;
  hidden?: boolean;
  duration?: 'base' | 'slow';
  delayMs?: number;
  colorClass?: string;
  barColorClass?: string;
  showLabel?: boolean;
  labelPrefix?: string;
  className?: string;
}

/**
 * <BarFill>
 * Horizontal score bars grow from 0 to value using transform: scaleX(ratio) (origin left).
 * The value label fades in after the bar fill animation completes.
 * 
 * CRITICAL PRIVACY INVARIANT:
 * If hidden === true, renders a calm static panel with zero bar fill, zero values,
 * and zero DOM payload that could imply an underlying score.
 */
export function BarFill({
  value,
  max = 5.0,
  threshold = 3.0,
  hidden = false,
  duration = 'base',
  delayMs = 0,
  colorClass,
  showLabel = true,
  labelPrefix = '',
  className = '',
}: BarFillProps) {
  // 1. Mandatory Privacy Guard
  if (hidden || value === null || value === undefined || isNaN(value)) {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <div className="flex-1 h-3 bg-paper-sunken border border-ink/10 rounded-xs flex items-center px-2">
          <span className="font-mono text-[10px] text-slate italic select-none">
            Hidden for privacy (N &lt; 5)
          </span>
        </div>
        {showLabel && <span className="font-mono text-xs text-slate">{hidden ? 'Hidden' : 'n/a'}</span>}
      </div>
    );
  }

  const [hasAnimated, setHasAnimated] = useState(false);
  const [labelVisible, setLabelVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const durationMs = MOTION_DURATIONS[duration];
  const easing = MOTION_EASINGS.standard;
  const ratio = Math.min(Math.max(value / max, 0), 1);

  // Default color logic: terracotta if below threshold, ink/sage otherwise
  const resolvedColor =
    colorClass || (value < threshold ? 'bg-terracotta' : value >= 4.0 ? 'bg-ink' : 'bg-slate');

  useEffect(() => {
    if (checkPrefersReducedMotion()) {
      setReducedMotion(true);
      setHasAnimated(true);
      setLabelVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          observer.disconnect();

          // Fade in label after bar completes
          const timer = setTimeout(() => {
            setLabelVisible(true);
          }, delayMs + durationMs);

          return () => clearTimeout(timer);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [delayMs, durationMs, hasAnimated]);

  const barStyle: React.CSSProperties = reducedMotion
    ? {
        transform: `scaleX(${ratio})`,
        transformOrigin: 'left',
      }
    : {
        transform: hasAnimated ? `scaleX(${ratio})` : 'scaleX(0)',
        transformOrigin: 'left',
        transition: `transform ${durationMs}ms ${easing} ${delayMs}ms`,
        willChange: hasAnimated && !labelVisible ? 'transform' : 'auto',
      };

  const labelStyle: React.CSSProperties = reducedMotion
    ? { opacity: 1 }
    : {
        opacity: labelVisible ? 1 : 0,
        transition: `opacity ${MOTION_DURATIONS.fast}ms ${MOTION_EASINGS.standard}`,
      };

  return (
    <div ref={ref} className={`flex items-center gap-3 ${className}`}>
      {/* Bar Track */}
      <div className="flex-1 h-3 bg-paper-sunken border border-ink/10 rounded-xs overflow-hidden relative">
        {/* Fill */}
        <div
          className={`h-full w-full ${resolvedColor}`}
          style={barStyle}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
        {/* Faint 3.0 Threshold Mark */}
        {threshold && (
          <div
            className="absolute top-0 bottom-0 border-r border-dashed border-ink/20 pointer-events-none"
            style={{ left: `${(threshold / max) * 100}%` }}
            title={`Threshold: ${threshold}`}
          />
        )}
      </div>

      {/* Numerical Label */}
      {showLabel && (
        <span
          className="font-mono text-xs font-medium text-ink w-10 text-right tabular-nums select-none"
          style={labelStyle}
        >
          {labelPrefix}
          {value.toFixed(2)}
        </span>
      )}
    </div>
  );
}
