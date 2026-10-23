import React from 'react';
import { BarFill } from '@/components/motion/BarFill';

export interface ScoreBarProps {
  label: string;
  score: number;
  maxScore?: number;
  benchmark?: number;
  benchmarkLabel?: string;
  flagged?: boolean;
  suppressed?: boolean;
  className?: string;
}

export function ScoreBar({
  label,
  score,
  maxScore = 5,
  benchmark,
  benchmarkLabel = 'Org',
  flagged = false,
  suppressed = false,
  className = '',
}: ScoreBarProps) {
  if (suppressed) {
    return (
      <div className={`space-y-1.5 ${className}`}>
        <div className="flex items-center justify-between text-xs">
          <span className="font-sans text-slate">{label}</span>
          <span className="font-mono text-xs text-slate">Hidden</span>
        </div>
        <div className="h-2 w-full bg-slate/10 rounded-none relative">
          <span className="sr-only">Data suppressed for privacy</span>
        </div>
      </div>
    );
  }

  const benchmarkPercentage = benchmark
    ? Math.min(Math.max((benchmark / maxScore) * 100, 0), 100)
    : undefined;

  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="flex items-center justify-between text-xs">
        <span className="font-sans text-ink">{label}</span>
        <span className={`font-mono font-medium ${flagged ? 'text-terracotta' : 'text-ink'}`}>
          {score.toFixed(2)}
        </span>
      </div>

      <div className="relative">
        <BarFill
          value={score}
          max={maxScore}
          colorClass={flagged ? 'bg-terracotta' : 'bg-ink'}
          showLabel={false}
        />

        {benchmarkPercentage !== undefined && (
          <div
            className="absolute top-0 bottom-0 w-[1px] bg-slate z-10 pointer-events-none"
            style={{ left: `${benchmarkPercentage}%` }}
            title={`${benchmarkLabel}: ${benchmark?.toFixed(2)}`}
          />
        )}
      </div>

      {benchmark !== undefined && (
        <div className="flex justify-end text-[10px] font-mono text-slate">
          <span>
            {benchmarkLabel}: {benchmark.toFixed(2)}
          </span>
        </div>
      )}
    </div>
  );
}
