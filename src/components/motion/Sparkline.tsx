'use client';

import React, { useEffect, useRef, useState } from 'react';
import { MOTION_DURATIONS, MOTION_EASINGS, checkPrefersReducedMotion } from '@/lib/motion/tokens';

export interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  strokeColor?: string;
  fillDots?: boolean;
  min?: number;
  max?: number;
  className?: string;
}

/**
 * <Sparkline>
 * SVG line that draws smoothly via stroke-dashoffset on first view.
 * Visualizes quarterly longitudinal trends with zero layout shift.
 */
export function Sparkline({
  data,
  width = 120,
  height = 32,
  strokeColor = '#1B1A17',
  fillDots = true,
  min,
  max,
  className = '',
}: SparklineProps) {
  const pathRef = useRef<SVGPathElement>(null);
  const containerRef = useRef<SVGSVGElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [pathLength, setPathLength] = useState(200);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Compute normalized coordinates
  const dataMin = min ?? Math.min(...data, 1);
  const dataMax = max ?? Math.max(...data, 5);
  const range = dataMax - dataMin || 1;

  const padding = 4;
  const usableWidth = width - padding * 2;
  const usableHeight = height - padding * 2;

  const points = data.map((val, idx) => {
    const x = padding + (idx / Math.max(data.length - 1, 1)) * usableWidth;
    const y = height - padding - ((val - dataMin) / range) * usableHeight;
    return { x, y, val };
  });

  const pathD = points.reduce((acc, pt, i) => {
    return i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
  }, '');

  useEffect(() => {
    if (checkPrefersReducedMotion()) {
      setReducedMotion(true);
      setHasAnimated(true);
      return;
    }

    if (pathRef.current) {
      const length = pathRef.current.getTotalLength();
      setPathLength(length);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  const durationMs = MOTION_DURATIONS.slow;
  const easing = MOTION_EASINGS.standard;

  const pathStyle: React.CSSProperties = reducedMotion
    ? {
        strokeDasharray: 'none',
        strokeDashoffset: 0,
      }
    : {
        strokeDasharray: pathLength,
        strokeDashoffset: hasAnimated ? 0 : pathLength,
        transition: `stroke-dashoffset ${durationMs}ms ${easing}`,
      };

  const lastPoint = points[points.length - 1];

  return (
    <svg
      ref={containerRef}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={`overflow-visible select-none ${className}`}
      aria-hidden="true"
    >
      <path
        ref={pathRef}
        d={pathD}
        fill="none"
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={pathStyle}
      />
      {fillDots && lastPoint && (
        <circle
          cx={lastPoint.x}
          cy={lastPoint.y}
          r="2.5"
          fill={strokeColor}
          style={{
            opacity: hasAnimated || reducedMotion ? 1 : 0,
            transition: `opacity ${MOTION_DURATIONS.fast}ms ${easing} ${durationMs * 0.75}ms`,
          }}
        />
      )}
    </svg>
  );
}
