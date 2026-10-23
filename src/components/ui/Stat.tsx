import React from 'react';
import { CountUp } from '@/components/motion';

export interface StatProps {
  label: string;
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  delta?: {
    value: number;
    direction: 'up' | 'down' | 'flat';
    label?: string;
  };
  suppressed?: boolean;
  suppressionReason?: string;
  className?: string;
}

export function Stat({
  label,
  value,
  decimals = 2,
  prefix = '',
  suffix = '',
  delta,
  suppressed = false,
  suppressionReason = 'Hidden (N < 5)',
  className = '',
}: StatProps) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-xs uppercase tracking-wider text-slate font-medium">
          {label}
        </span>
        {suppressed && (
          <span className="font-mono text-[10px] uppercase tracking-wider bg-slate/15 text-slate px-1.5 py-0.5">
            {suppressionReason}
          </span>
        )}
      </div>

      <div className="flex items-baseline gap-2">
        {suppressed ? (
          <span className="font-mono text-3xl font-light text-slate/50 select-none" aria-label="Suppressed value">
            Hidden
          </span>
        ) : (
          <div className="font-mono text-3xl font-semibold tracking-tight text-ink tabular-nums">
            <CountUp value={value} decimals={decimals} prefix={prefix} suffix={suffix} />
          </div>
        )}

        {!suppressed && delta && (
          <span
            className={`font-mono text-xs flex items-center gap-0.5 tabular-nums ${
              delta.direction === 'up'
                ? 'text-sage'
                : delta.direction === 'down'
                ? 'text-terracotta'
                : 'text-slate'
            }`}
          >
            <span>
              {delta.direction === 'up' ? '+' : delta.direction === 'down' ? '-' : '='}
              {Math.abs(delta.value).toFixed(decimals)}
            </span>
            {delta.label && <span className="text-[10px] text-slate ml-0.5">{delta.label}</span>}
          </span>
        )}
      </div>
    </div>
  );
}
