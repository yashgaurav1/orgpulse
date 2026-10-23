'use client';

import React, { useState } from 'react';
import { CheckCircle2, Lock, Sparkles, ArrowRight } from 'lucide-react';

export function HowItWorksBento() {
  const [selectedRating, setSelectedRating] = useState<number>(4);
  const [revealed, setRevealed] = useState(true);

  return (
    <div className="space-y-6">
      {/* 3 Step Indicator Header */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs pb-2">
        <div className="flex items-center gap-2 text-[#1D6F9F] dark:text-[#4AA3D6] font-semibold">
          <span className="w-5 h-5 rounded-full bg-[#2E8EBF]/15 flex items-center justify-center text-[11px] font-bold">
            1
          </span>
          <span>Anonymous Survey</span>
        </div>
        <div className="flex items-center gap-2 text-[#5C6778] dark:text-[#9FB2CC]">
          <span className="w-5 h-5 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center text-[11px] font-bold">
            2
          </span>
          <span>Mathematical Aggregation</span>
        </div>
        <div className="flex items-center gap-2 text-[#5C6778] dark:text-[#9FB2CC]">
          <span className="w-5 h-5 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center text-[11px] font-bold">
            3
          </span>
          <span>14-Day Action Commitment</span>
        </div>
      </div>

      {/* Bento Grid: 2 Unequal Off-White Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Card 1: 5 Columns: Survey Question Pill Fragment */}
        <div className="lg:col-span-5 relative p-6 sm:p-7 rounded-panel bg-[#F8F7F4] dark:bg-[#071936] border border-[#E8E6E1] dark:border-[#1F3F6E] flex flex-col justify-between overflow-hidden">
          {/* Faint wave line peek behind fragment */}
          <div className="absolute -right-12 -top-12 w-48 h-48 opacity-15 pointer-events-none select-none">
            <svg viewBox="0 0 100 100" fill="none" stroke="#2E8EBF" strokeWidth="1">
              <path d="M 0,50 Q 25,20 50,50 T 100,50" />
              <path d="M 0,60 Q 25,30 50,60 T 100,60" />
              <path d="M 0,70 Q 25,40 50,70 T 100,70" />
            </svg>
          </div>

          <div className="space-y-4 relative z-10">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#1D6F9F] dark:text-[#4AA3D6] font-semibold">Diagnostic Item 03 / 06</span>
              <span className="text-[#5C6778] dark:text-[#9FB2CC]">Workload Pacing</span>
            </div>

            <div className="p-4 rounded-control bg-white dark:bg-[#0A2347] border border-[#E8E6E1] dark:border-[#1F3F6E] shadow-soft space-y-3">
              <p className="text-xs font-sans font-medium text-[#0B1B33] dark:text-[#EAF0F8] leading-relaxed">
                &ldquo;During the last sprint, sprint delivery pacing and after-hours on-call responsibilities were sustainable.&rdquo;
              </p>

              {/* Interactive 1-5 Rating Pill Selector */}
              <div className="flex items-center justify-between gap-1 pt-1">
                {[1, 2, 3, 4, 5].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setSelectedRating(val)}
                    className={`flex-1 h-9 rounded-control font-mono text-xs font-semibold transition-all ${
                      selectedRating === val
                        ? 'bg-[#03173B] text-white dark:bg-[#2E8EBF] dark:text-[#03173B] shadow-xs scale-105'
                        : 'bg-[#F8F7F4] dark:bg-[#11305C] text-[#5C6778] dark:text-[#9FB2CC] hover:bg-[#E8E6E1] dark:hover:bg-[#162C4E]'
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
              <div className="flex justify-between text-[10px] font-mono text-[#5C6778] dark:text-[#9FB2CC]">
                <span>1 Strongly Disagree</span>
                <span>5 Strongly Agree</span>
              </div>
            </div>
          </div>

          {/* Small label at the bottom */}
          <div className="pt-6 mt-4 border-t border-[#E8E6E1] dark:border-[#1F3F6E] text-[11px] font-mono text-[#5C6778] dark:text-[#9FB2CC] relative z-10 flex items-center justify-between">
            <span>Step 01: Confidential Survey</span>
            <span className="text-[#1F7A4F] dark:text-[#2DBE78]">&lt; 4 Minutes</span>
          </div>
        </div>

        {/* Card 2: 7 Columns: Resolving Skeleton to Aggregate Bar */}
        <div className="lg:col-span-7 relative p-6 sm:p-7 rounded-panel bg-[#F8F7F4] dark:bg-[#071936] border border-[#E8E6E1] dark:border-[#1F3F6E] flex flex-col justify-between overflow-hidden">
          {/* Faint wave line peek behind fragment */}
          <div className="absolute -left-12 -bottom-12 w-48 h-48 opacity-15 pointer-events-none select-none">
            <svg viewBox="0 0 100 100" fill="none" stroke="#2E8EBF" strokeWidth="1">
              <path d="M 0,30 Q 35,60 70,30 T 100,30" />
              <path d="M 0,40 Q 35,70 70,40 T 100,40" />
            </svg>
          </div>

          <div className="space-y-4 relative z-10">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#1D6F9F] dark:text-[#4AA3D6] font-semibold">Server-Side Cloud Function Aggregation</span>
              <span className="px-2 py-0.5 rounded-full bg-[#1F7A4F]/15 text-[#1F7A4F] dark:text-[#2DBE78] text-[10px] font-bold">
                N = 12 Responded
              </span>
            </div>

            <div className="p-4 rounded-control bg-white dark:bg-[#0A2347] border border-[#E8E6E1] dark:border-[#1F3F6E] shadow-soft space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#0B1B33] dark:text-[#EAF0F8] font-semibold">Aggregated Result: Workload Pacing</span>
                <span className="text-[#9A5B00] dark:text-[#F5A623] font-bold tabular-nums">3.95 / 5.0 (Review Flag)</span>
              </div>

              {/* Aggregate bar resolving smoothly */}
              <div className="w-full h-3 bg-black/10 dark:bg-black/30 rounded-full overflow-hidden">
                <div className="w-[79%] h-full bg-[#9A5B00] dark:bg-[#F5A623] rounded-full transition-all duration-700" />
              </div>

              {/* 14-Day Reform Action Commit trigger */}
              <div className="p-3 rounded-control bg-[#F8F7F4] dark:bg-[#11305C] border border-[#E8E6E1] dark:border-[#1F3F6E] space-y-1">
                <span className="text-[10px] text-[#1D6F9F] dark:text-[#4AA3D6] uppercase font-bold block">
                  Action Triggered (14-Day Accountability Protocol)
                </span>
                <p className="text-xs font-sans text-[#0B1B33] dark:text-[#EAF0F8]">
                  Manager commits to adjusting sprint velocity and shifting flaky CI tests out of blocking PR gates.
                </p>
              </div>
            </div>
          </div>

          {/* Small label at the bottom */}
          <div className="pt-6 mt-4 border-t border-[#E8E6E1] dark:border-[#1F3F6E] text-[11px] font-mono text-[#5C6778] dark:text-[#9FB2CC] relative z-10 flex items-center justify-between">
            <span>Steps 02 &amp; 03: Aggregate &amp; 14-Day Action Commitment</span>
            <span className="text-[#1D6F9F] dark:text-[#4AA3D6]">Differential Privacy Protected</span>
          </div>
        </div>
      </div>
    </div>
  );
}
