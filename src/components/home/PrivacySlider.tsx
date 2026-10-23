'use client';

import React, { useState } from 'react';
import { LockDraw } from '@/components/motion/LockDraw';
import { ShieldCheck, Lock } from 'lucide-react';

export function PrivacySlider() {
  const [groupSize, setGroupSize] = useState<number>(4);
  const isProtected = groupSize < 5;

  return (
    <div className="bg-theme-surface border hairline-border rounded-panel p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="font-mono text-xs uppercase tracking-wider text-theme-tertiary font-semibold block">
            Interactive Anonymity Demonstration
          </span>
          <h3 className="text-xl font-semibold tracking-[-0.02em] text-theme-primary mt-0.5">
            Minimum Group Size Constraint (N &ge; 5)
          </h3>
          <p className="font-sans text-xs text-theme-secondary mt-1 max-w-lg leading-relaxed">
            Drag the group size slider to test how the aggregation engine locks and unlocks squad reporting in real time.
          </p>
        </div>

        {/* Current Size Indicator */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <span className="font-mono text-xs text-theme-secondary uppercase">Squad Size:</span>
          <span className="font-mono text-base font-bold text-accent bg-theme-raised px-2.5 py-1 rounded-control border hairline-border tabular-nums shadow-xs">
            N = {groupSize}
          </span>
        </div>
      </div>

      {/* Slider Control */}
      <div className="space-y-2">
        <label htmlFor="group-size-slider" className="sr-only">
          Select squad response count from 3 to 8
        </label>
        <input
          id="group-size-slider"
          type="range"
          min="3"
          max="8"
          step="1"
          value={groupSize}
          onChange={(e) => setGroupSize(parseInt(e.target.value, 10))}
          className="w-full accent-accent cursor-pointer h-2 bg-theme-raised rounded-control border hairline-border"
        />
        <div className="flex justify-between font-mono text-[11px] text-theme-secondary px-1">
          <span>3 (Suppressed)</span>
          <span>4 (Suppressed)</span>
          <span className="text-accent font-semibold">5 (Threshold)</span>
          <span>6 (Active)</span>
          <span>7 (Active)</span>
          <span>8 (Active)</span>
        </div>
      </div>

      {/* Dynamic Simulated Output Display */}
      <div className="border hairline-border bg-theme-raised rounded-panel p-5 transition-all duration-200">
        {isProtected ? (
          <div className="flex items-start gap-4">
            <div className="p-3 bg-theme-surface rounded-control border hairline-border flex-shrink-0">
              <LockDraw size={24} color="#3D7BFF" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs uppercase font-bold text-warning">
                  Data Shielded (N &lt; 5)
                </span>
                <span className="text-[10px] font-mono text-theme-tertiary">
                  &bull; Zero Score Leakage
                </span>
              </div>
              <p className="font-sans text-xs text-theme-secondary leading-relaxed">
                Response count is below the minimum threshold. All scores, bar animations, and qualitative responses are completely withheld from the DOM and network payloads.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-theme-subtle pb-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-success animate-live-dot" />
                <span className="font-mono text-xs uppercase font-bold text-success">
                  Aggregated Score Released (N = {groupSize})
                </span>
              </div>
              <span className="font-mono text-xs text-theme-primary font-bold tabular-nums">
                Overall: 3.92 / 5.00
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 font-mono text-xs">
              <div className="p-2.5 bg-theme-surface rounded-control border hairline-border flex justify-between items-center">
                <span className="text-theme-secondary">Workload Health:</span>
                <span className="font-bold text-theme-primary">3.80 / 5.0</span>
              </div>
              <div className="p-2.5 bg-theme-surface rounded-control border hairline-border flex justify-between items-center">
                <span className="text-theme-secondary">Safety Index:</span>
                <span className="font-bold text-theme-primary">4.15 / 5.0</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
