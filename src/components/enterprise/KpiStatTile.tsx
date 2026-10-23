'use client';

import React, { useEffect, useState } from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { motion } from 'framer-motion';

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
  const width = 80;
  const height = 28;
  const min = Math.min(...sparklineData);
  const max = Math.max(...sparklineData);
  const range = max - min || 1;

  const points = sparklineData
    .map((val, idx) => {
      const x = (idx / (sparklineData.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 6) - 3;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  const isPositive = delta !== undefined && delta > 0;
  const isNegative = delta !== undefined && delta < 0;

  return (
    <div
      className={`relative p-4 rounded-panel bg-theme-raised border hairline-border shadow-inner-highlight-dark transition-all duration-150 ${
        hasFlashed ? 'animate-live-flash' : ''
      } ${className}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-mono uppercase tracking-[0.04em] text-theme-tertiary">
          {label}
        </span>
        {delta !== undefined && (
          <span
            className={`inline-flex items-center gap-0.5 text-[11px] font-mono tabular-nums font-medium ${
              isPositive
                ? 'text-success'
                : isNegative
                ? 'text-danger'
                : 'text-theme-secondary'
            }`}
          >
            {isPositive && <ArrowUpRight size={13} strokeWidth={2} />}
            {isNegative && <ArrowDownRight size={13} strokeWidth={2} />}
            {!isPositive && !isNegative && <Minus size={13} strokeWidth={2} />}
            <span>{isPositive ? `+${delta}%` : `${delta}%`}</span>
          </span>
        )}
      </div>

      <div className="mt-2 flex items-baseline justify-between">
        <div className="text-2xl font-semibold tracking-[-0.02em] font-mono tabular-nums text-theme-primary">
          {formattedNumber()}
        </div>

        {/* Minimal Sparkline */}
        {!suppressed && sparklineData.length > 1 && (
          <div className="w-[80px] h-[28px]">
            <svg
              viewBox={`0 0 ${width} ${height}`}
              className="w-full h-full overflow-visible select-none"
            >
              <polyline
                fill="none"
                stroke="#3D7BFF"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={points}
              />
            </svg>
          </div>
        )}
      </div>

      <div className="mt-1 text-[11px] font-mono text-theme-tertiary flex items-center justify-between">
        <span>{deltaLabel}</span>
        {!suppressed && (
          <span className="text-[10px] text-theme-tertiary/80">
            range: {min}–{max}
          </span>
        )}
      </div>
    </div>
  );
}
