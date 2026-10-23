'use client';

import React, { useState } from 'react';
import { Lock, Unlock, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';
import { SegmentedControl } from '@/components/ui/SegmentedControl';

export function PrivacyThresholdDiagram() {
  const [respondentCount, setRespondentCount] = useState<'4' | '5'>('4');

  const isSuppressed = respondentCount === '4';

  const toggleItems = [
    { id: '4', label: 'Group of 4 (Sub-threshold)' },
    { id: '5', label: 'Group of 5 (Threshold Met)' },
  ];

  return (
    <div className="p-6 rounded-panel bg-[#F8F7F4] dark:bg-[#071936] border border-[#E8E6E1] dark:border-[#1F3F6E] space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E8E6E1] dark:border-[#1F3F6E]">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#1D6F9F] dark:text-[#4AA3D6] font-semibold block">
            Interactive Anonymity Simulator
          </span>
          <h4 className="text-sm font-semibold text-[#0B1B33] dark:text-[#EAF0F8]">
            Differential Privacy &bull; $N \ge 5$ Mathematical Suppression
          </h4>
        </div>

        <div className="w-full sm:w-auto">
          <SegmentedControl
            items={toggleItems}
            activeId={respondentCount}
            onChange={(id) => setRespondentCount(id as any)}
            size="sm"
            aria-label="Simulate group size"
          />
        </div>
      </div>

      {/* Simulator Display Window */}
      <div className="p-5 rounded-control bg-white dark:bg-[#0A2347] border border-[#E8E6E1] dark:border-[#1F3F6E] min-h-[160px] flex flex-col justify-center transition-all">
        {isSuppressed ? (
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left animate-in fade-in-50 duration-200">
            <div className="w-12 h-12 rounded-full bg-[#BF1111]/10 text-[#C01313] dark:text-[#FF7A7A] flex items-center justify-center flex-shrink-0">
              <Lock size={22} />
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="text-sm font-semibold text-[#0B1B33] dark:text-[#EAF0F8]">
                  Squad Telemetry Strictly Suppressed ($N = 4$)
                </span>
                <span className="px-2 py-0.2 rounded-full bg-[#BF1111]/10 text-[#C01313] dark:text-[#FF7A7A] text-[10px] font-mono font-bold">
                  Protected
                </span>
              </div>
              <p className="text-xs text-[#5C6778] dark:text-[#9FB2CC] font-sans leading-relaxed max-w-xl">
                Because fewer than 5 members responded, individual answers could be mathematically inferred by subtraction or process of elimination. Zero scores or text fragments are returned to the client DOM or API payload.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3 animate-in fade-in-50 duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-[#E8E6E1] dark:border-[#1F3F6E]">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#1F7A4F]/10 text-[#1F7A4F] dark:text-[#2DBE78] flex items-center justify-center">
                  <Unlock size={13} />
                </div>
                <span className="text-xs font-semibold text-[#0B1B33] dark:text-[#EAF0F8]">
                  Safe Aggregate Computed ($N = 5 \ge 5$)
                </span>
              </div>
              <span className="text-[11px] font-mono text-[#1F7A4F] dark:text-[#2DBE78] font-bold flex items-center gap-1">
                <CheckCircle2 size={12} /> Safe to Display
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 font-mono text-xs">
              <div>
                <div className="flex justify-between items-center text-[11px] mb-1 text-[#5C6778] dark:text-[#9FB2CC]">
                  <span>Aggregated Squad Mean</span>
                  <span className="font-bold text-[#0B1B33] dark:text-[#EAF0F8] tabular-nums">4.20 / 5.0</span>
                </div>
                <div className="w-full h-2 bg-black/10 dark:bg-black/30 rounded-full overflow-hidden">
                  <div className="w-[84%] h-full bg-[#2E8EBF] rounded-full" />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center text-[11px] mb-1 text-[#5C6778] dark:text-[#9FB2CC]">
                  <span>Differencing Shield</span>
                  <span className="font-bold text-[#1F7A4F] dark:text-[#2DBE78]">Active</span>
                </div>
                <p className="text-[10px] text-[#5C6778] dark:text-[#9FB2CC] font-sans">
                  Prevents derivation by subtracting from department rollup totals.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
