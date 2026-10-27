'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Lock, Layers, Calendar, Users } from 'lucide-react';

export function StatsRow() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [counts, setCounts] = useState({ group: 0, dimensions: 0, days: 0, roles: 0 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);

          // Animate count up once
          const duration = 1200; // ms
          const startTime = performance.now();

          const step = (now: number) => {
            const progress = Math.min(1, (now - startTime) / duration);
            const ease = 1 - Math.pow(1 - progress, 3); // cubic ease out

            setCounts({
              group: Math.round(ease * 5),
              dimensions: Math.round(ease * 6),
              days: Math.round(ease * 90),
              roles: Math.round(ease * 4),
            });

            if (progress < 1) {
              requestAnimationFrame(step);
            }
          };

          requestAnimationFrame(step);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasAnimated]);

  return (
    <div
      ref={containerRef}
      className="rounded-panel bg-[#F8F7F4] dark:bg-[#071936] border border-[#E8E6E1] dark:border-[#1F3F6E] p-8 sm:p-10"
    >
      <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[#E8E6E1] dark:divide-[#1F3F6E]">
        {/* Stat 1: Minimum group of 5 */}
        <div className="p-4 sm:p-6 text-center space-y-2">
          <div className="w-8 h-8 mx-auto rounded-full bg-[#2E8EBF]/15 text-[#1D6F9F] dark:text-[#4AA3D6] flex items-center justify-center">
            <Lock size={16} />
          </div>
          <div className="text-4xl sm:text-5xl font-mono font-bold text-[#0B1B33] dark:text-white tabular-nums tracking-tight">
            {counts.group}
          </div>
          <div className="text-xs font-semibold text-[#0B1B33] dark:text-[#EAF0F8]">
            Minimum Group Size
          </div>
          <p className="text-[11px] text-[#5C6778] dark:text-[#9FB2CC] font-sans">
            Guaranteed N ≥ 5 anonymity threshold on all reports.
          </p>
        </div>

        {/* Stat 2: 6 Survey Dimensions */}
        <div className="p-4 sm:p-6 text-center space-y-2 pt-6 md:pt-4">
          <div className="w-8 h-8 mx-auto rounded-full bg-[#2E8EBF]/15 text-[#1D6F9F] dark:text-[#4AA3D6] flex items-center justify-center">
            <Layers size={16} />
          </div>
          <div className="text-4xl sm:text-5xl font-mono font-bold text-[#0B1B33] dark:text-white tabular-nums tracking-tight">
            {counts.dimensions}
          </div>
          <div className="text-xs font-semibold text-[#0B1B33] dark:text-[#EAF0F8]">
            Core Dimensions
          </div>
          <p className="text-[11px] text-[#5C6778] dark:text-[#9FB2CC] font-sans">
            Workload pacing, psychological safety, purpose &amp; tools.
          </p>
        </div>

        {/* Stat 3: 90-Day Retention */}
        <div id="privacy-retention" className="p-4 sm:p-6 text-center space-y-2 pt-6 md:pt-4">
          <div className="w-8 h-8 mx-auto rounded-full bg-[#2E8EBF]/15 text-[#1D6F9F] dark:text-[#4AA3D6] flex items-center justify-center">
            <Calendar size={16} />
          </div>
          <div className="text-4xl sm:text-5xl font-mono font-bold text-[#0B1B33] dark:text-white tabular-nums tracking-tight">
            {counts.days}
          </div>
          <div className="text-xs font-semibold text-[#0B1B33] dark:text-[#EAF0F8]">
            Days Raw Retention
          </div>
          <p className="text-[11px] text-[#5C6778] dark:text-[#9FB2CC] font-sans">
            Scheduled automatic purge of raw tokens and survey text.
          </p>
        </div>

        {/* Stat 4: 4 Role Dashboards */}
        <div className="p-4 sm:p-6 text-center space-y-2 pt-6 md:pt-4">
          <div className="w-8 h-8 mx-auto rounded-full bg-[#2E8EBF]/15 text-[#1D6F9F] dark:text-[#4AA3D6] flex items-center justify-center">
            <Users size={16} />
          </div>
          <div className="text-4xl sm:text-5xl font-mono font-bold text-[#0B1B33] dark:text-white tabular-nums tracking-tight">
            {counts.roles}
          </div>
          <div className="text-xs font-semibold text-[#0B1B33] dark:text-[#EAF0F8]">
            Specialized Role Views
          </div>
          <p className="text-[11px] text-[#5C6778] dark:text-[#9FB2CC] font-sans">
            Employee, Manager, HRBP, and Leadership views.
          </p>
        </div>
      </div>
    </div>
  );
}
