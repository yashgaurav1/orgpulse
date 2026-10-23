'use client';

import React, { useEffect, useRef, useState } from 'react';
import { MOTION_DURATIONS, MOTION_EASINGS, checkPrefersReducedMotion } from '@/lib/motion/tokens';

export interface EngagementAttritionChartProps {
  className?: string;
}

/**
 * <EngagementAttritionChart>
 * Hero motion motif: Draws once via stroke-dashoffset showing the divergent paths
 * of turnover (flat) versus engagement (falling steeply).
 * Scaled with a clean 680x180 viewBox with relative 11-12px font sizing.
 */
export function EngagementAttritionChart({ className = '' }: EngagementAttritionChartProps) {
  const containerRef = useRef<SVGSVGElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (checkPrefersReducedMotion()) {
      setReducedMotion(true);
      setHasAnimated(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  const durationMs = MOTION_DURATIONS.slow;
  const easing = MOTION_EASINGS.standard;

  // Path 1: Voluntary Attrition (Flat / Cautious Market ~ 14%)
  const attritionPath = 'M 50 120 Q 220 118 380 122 T 630 124';
  // Path 2: Engagement (Steep decline from 80% to 38%)
  const engagementPath = 'M 50 36 Q 200 45 350 88 T 630 136';
  // Gap Polygon between engagement and attrition
  const gapArea = 'M 50 36 Q 200 45 350 88 T 630 136 L 630 124 Q 380 122 220 118 T 50 120 Z';

  const strokeStyle: React.CSSProperties = reducedMotion
    ? { strokeDasharray: 'none', strokeDashoffset: 0 }
    : {
        strokeDasharray: '650',
        strokeDashoffset: hasAnimated ? 0 : 650,
        transition: `stroke-dashoffset ${durationMs}ms ${easing}`,
      };

  const labelFadeStyle: React.CSSProperties = reducedMotion
    ? { opacity: 1 }
    : {
        opacity: hasAnimated ? 1 : 0,
        transition: `opacity ${MOTION_DURATIONS.base}ms ${easing} ${durationMs * 0.7}ms`,
      };

  return (
    <div className={`p-4 sm:p-5 bg-theme-surface border hairline-border rounded-panel space-y-3 ${className}`}>
      {/* Top Header with clean spacing and visible ILLUSTRATIVE badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-theme-subtle">
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="font-semibold text-accent uppercase tracking-wider">
            Motif
          </span>
          <span className="text-theme-tertiary">/</span>
          <span className="text-theme-secondary uppercase tracking-wider">
            The Problem Space
          </span>
        </div>

        <span className="font-mono text-[10px] font-semibold bg-accent/10 text-accent border border-accent/30 px-2 py-0.5 rounded-control tracking-wider uppercase">
          ILLUSTRATIVE
        </span>
      </div>

      <p className="font-sans text-xs text-theme-secondary max-w-xl leading-relaxed">
        Voluntary attrition stays flat during a hiring pause while engagement silently drops, masking organizational strain until attrition abruptly spikes.
      </p>

      {/* Responsive SVG with relative 11-12px label sizing at 680px */}
      <svg
        ref={containerRef}
        viewBox="0 0 680 180"
        className="w-full h-auto overflow-visible select-none block"
        aria-label="Illustrative chart contrasting steady voluntary attrition with sharply falling engagement"
      >
        {/* Shaded Divergence Gap */}
        <path
          d={gapArea}
          fill="#2E8EBF"
          fillOpacity="0.08"
          style={labelFadeStyle}
        />

        {/* Axis Guides */}
        <line x1="50" y1="150" x2="630" y2="150" stroke="var(--border-subtle)" strokeWidth="1" />
        <line x1="50" y1="25" x2="50" y2="150" stroke="var(--border-subtle)" strokeWidth="1" />

        {/* Labels along X Axis (11-12px) */}
        <text x="50" y="168" fill="var(--text-tertiary)" fontSize="11" fontFamily="var(--font-mono)">
          T0 (Lateral Market Active)
        </text>
        <text x="630" y="168" textAnchor="end" fill="var(--text-tertiary)" fontSize="11" fontFamily="var(--font-mono)">
          T+12m (Hiring Freeze)
        </text>

        {/* Voluntary Attrition Line (Flat) */}
        <path
          d={attritionPath}
          fill="none"
          stroke="var(--text-secondary)"
          strokeWidth="2"
          strokeLinecap="round"
          style={strokeStyle}
        />

        {/* Engagement Line (Dropping) */}
        <path
          d={engagementPath}
          fill="none"
          stroke="#2E8EBF"
          strokeWidth="2.5"
          strokeLinecap="round"
          style={strokeStyle}
        />

        {/* Series Labels */}
        <g style={labelFadeStyle}>
          <text
            x="635"
            y="126"
            fill="var(--text-secondary)"
            fontSize="11"
            fontFamily="var(--font-mono)"
            dominantBaseline="middle"
          >
            Turnover (Flat)
          </text>
          <text
            x="635"
            y="140"
            fill="#2E8EBF"
            fontSize="12"
            fontWeight="bold"
            fontFamily="var(--font-mono)"
            dominantBaseline="middle"
          >
            Engagement (Decay)
          </text>
        </g>
      </svg>
    </div>
  );
}
