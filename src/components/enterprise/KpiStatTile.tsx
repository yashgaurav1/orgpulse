'use client';

import React, { useEffect, useState, useId } from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface KpiStatTileProps {
  label: string;
  value: number;
  format?: 'number' | 'percent' | 'score';
  delta?: number; // e.g. +4.2 or -1.5
  deltaLabel?: string; // e.g. "vs Q4"
  sparklineData?: number[];
  suppressed?: boolean;
  className?: string;
}

export function KpiStatTile({
  label,
  value,
  format = 'number',
  delta,
  deltaLabel = 'vs previous',
  sparklineData = [65, 68, 72, 70, 78, 82, 85],
  suppressed = false,
  className = '',
}: KpiStatTileProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const [hasFlashed, setHasFlashed] = useState(false);
  const rawId = useId();
  const gradientId = `kpi-grad-${rawId.replace(/:/g, '')}`;

  useEffect(() => {
    if (suppressed) return;

    // Fast initial count-up
    const start = 0;
    const end = value;
    const duration = 600;
    const startTime = performance.now();

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = start + (end - start) * ease;
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        // Trigger subtle live flash
        setHasFlashed(true);
        setTimeout(() => setHasFlashed(false), 800);
      }
    };

    requestAnimationFrame(step);
  }, [value, suppressed]);

  const formattedNumber = () => {
    if (suppressed) return 'Hidden';
    if (format === 'score') return displayValue.toFixed(2);
    if (format === 'percent') return `${displayValue.toFixed(1)}%`;
    return Math.round(displayValue).toLocaleString();
  };

  // Sparkline coordinates
  const width = 84;
  const height = 30;
  const min = Math.min(...sparklineData);
  const max = Math.max(...sparklineData);
  const range = max - min || 1;

  const coords = sparklineData.map((val, idx) => {
    const x = (idx / (sparklineData.length - 1)) * width;
    const y = height - ((val - min) / range) * (height - 8) - 4;
    return { x: Number(x.toFixed(1)), y: Number(y.toFixed(1)) };
  });

  const points = coords.map((c) => `${c.x},${c.y}`).join(' ');
  const lastCoord = coords[coords.length - 1] || { x: width, y: height / 2 };
  const areaPoints = `${coords[0]?.x ?? 0},${height} ${points} ${lastCoord.x},${height}`;

  const isPositive = delta !== undefined && delta > 0;
  const isNegative = delta !== undefined && delta < 0;

  return (
    <div
      className={`relative p-5 rounded-2xl bg-theme-raised border hairline-border shadow-inner-highlight-dark flex flex-col justify-between transition-all duration-150 ${
        hasFlashed ? 'animate-live-flash' : ''
      } ${className}`}
    >
      {/* Row 1: Header (Muted uppercase label + Semantic delta badge) */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-semibold tracking-wider uppercase text-theme-tertiary font-sans truncate">
          {label}
        </span>
        {delta !== undefined && (
          <span
            className={`px-2 py-0.5 rounded-full font-mono text-[11px] font-medium tabular-nums shrink-0 inline-flex items-center gap-1 ${
              isPositive
                ? 'bg-success/10 text-success'
                : isNegative
                ? 'bg-danger/10 text-danger'
                : 'bg-theme-surface text-theme-secondary border hairline-border'
            }`}
          >
            {isPositive && <ArrowUpRight size={12} strokeWidth={2.5} />}
            {isNegative && <ArrowDownRight size={12} strokeWidth={2.5} />}
            {!isPositive && !isNegative && <Minus size={12} strokeWidth={2.5} />}
            <span>{isPositive ? `+${delta}%` : `${delta}%`}</span>
          </span>
        )}
      </div>

      {/* Row 2: Hero Metric + Upgraded Sparkline */}
      <div className="mt-3 mb-2 flex items-baseline justify-between gap-3">
        <div className="text-3xl font-bold tracking-tight font-mono tabular-nums text-theme-primary">
          {formattedNumber()}
        </div>

        {/* Upgraded SVG Sparkline with Area Fill and Terminal Dot */}
        {!suppressed && sparklineData.length > 1 && (
          <div className="w-[84px] h-[30px] shrink-0">
            <svg
              viewBox={`0 0 ${width} ${height}`}
              className="w-full h-full overflow-visible select-none"
            >
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3D7BFF" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#3D7BFF" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <polygon
                fill={`url(#${gradientId})`}
                points={areaPoints}
              />
              <polyline
                fill="none"
                stroke="#3D7BFF"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={points}
              />
              <circle
                cx={lastCoord.x}
                cy={lastCoord.y}
                r="2.5"
                fill="#3D7BFF"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Row 3: Separated Footer Metadata with Subtle Top Divider */}
      <div className="border-t border-theme-subtle pt-2.5 mt-auto flex items-center justify-between gap-2 text-xs">
        <span className="font-sans text-theme-secondary text-[11px] truncate">
          {deltaLabel}
        </span>
        {!suppressed && (
          <span className="shrink-0 font-mono text-[11px] text-theme-tertiary tabular-nums">
            Range: {min}-{max}
          </span>
        )}
      </div>
    </div>
  );
}
