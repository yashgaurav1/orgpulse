'use client';

import React, { useState } from 'react';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import {
  Activity,
  Heart,
  Users,
  FileSpreadsheet,
  Shield,
  Lock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Bot,
  MessageSquare,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export function FramedProductWindow() {
  const [activeRole, setActiveRole] = useState<'manager' | 'employee' | 'hrbp' | 'leadership'>('manager');
  const { openAuthModal } = useAuth();

  const roleTabs = [
    { id: 'employee', label: 'Employee Sanctuary', icon: Heart },
    { id: 'manager', label: 'Manager Dashboard', icon: Users },
    { id: 'hrbp', label: 'HRBP Operations', icon: FileSpreadsheet },
    { id: 'leadership', label: 'Leadership Scorecard', icon: Shield },
  ];

  return (
    <div className="w-full rounded-panel bg-white dark:bg-[#0A2347] border border-[#E8E6E1] dark:border-[#1F3F6E] shadow-2xl overflow-hidden">
      {/* Product Window Header */}
      <div className="px-5 py-4 border-b border-[#E8E6E1] dark:border-[#1F3F6E] bg-[#F8F7F4] dark:bg-[#071936] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Traffic light window dots */}
          <div className="flex items-center gap-1.5" aria-hidden="true">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E8E6E1] dark:bg-[#1F3F6E]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#E8E6E1] dark:bg-[#1F3F6E]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#E8E6E1] dark:bg-[#1F3F6E]" />
          </div>
          <span className="text-xs font-mono font-semibold text-[#0B1B33] dark:text-[#EAF0F8]">
            Pulse Workspace Console &bull; <span className="text-[#1D6F9F] dark:text-[#4AA3D6]">Live Preview</span>
          </span>
          <span className="px-2 py-0.5 rounded-full bg-[#2E8EBF]/15 border border-[#2E8EBF]/30 text-[#1D6F9F] dark:text-[#4AA3D6] font-mono text-[10px] uppercase font-bold">
            Sample Data
          </span>
        </div>

        {/* Role Tab Switcher */}
        <div className="w-full sm:w-auto">
          <SegmentedControl
            items={roleTabs}
            activeId={activeRole}
            onChange={(id) => setActiveRole(id as any)}
            size="sm"
            aria-label="Product window role preview"
          />
        </div>
      </div>

      {/* Product Window Content Area */}
      <div className="p-6 sm:p-8 min-h-[380px] bg-white dark:bg-[#0A2347] transition-all">
        {/* ========================================================================= */}
        {/* TAB 1: MANAGER DASHBOARD */}
        {/* ========================================================================= */}
        {activeRole === 'manager' && (
          <div className="space-y-6 animate-in fade-in-50 duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E6E1] dark:border-[#1F3F6E]">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-semibold text-[#0B1B33] dark:text-[#EAF0F8]">
                    Payments Engineering Squad (12 Engineers)
                  </h4>
                  <span className="px-2 py-0.5 rounded-full bg-[#1F7A4F]/15 text-[#1F7A4F] dark:text-[#2DBE78] text-[11px] font-mono font-bold flex items-center gap-1">
                    <CheckCircle2 size={12} /> Healthy Baseline
                  </span>
                </div>
                <p className="text-xs text-[#5C6778] dark:text-[#9FB2CC] font-sans mt-0.5">
                  Aggregated diagnostic telemetry for Q3 sprint cycle. Minimum group protection active ($N \ge 5$).
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono">
                <div className="text-right">
                  <span className="text-[#5C6778] dark:text-[#9FB2CC] block text-[11px]">Participation:</span>
                  <span className="font-bold text-[#0B1B33] dark:text-[#EAF0F8] tabular-nums">12 / 12 (100%)</span>
                </div>
                <div className="text-right border-l border-[#E8E6E1] dark:border-[#1F3F6E] pl-4">
                  <span className="text-[#5C6778] dark:text-[#9FB2CC] block text-[11px]">Overall Score:</span>
                  <span className="text-base font-bold text-[#1D6F9F] dark:text-[#4AA3D6] tabular-nums">4.22 / 5.0</span>
                </div>
              </div>
            </div>

            {/* Diagnostic Bars */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
              <div className="p-4 rounded-control bg-[#F8F7F4] dark:bg-[#11305C] border border-[#E8E6E1] dark:border-[#1F3F6E] space-y-2">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-[#5C6778] dark:text-[#9FB2CC]">Work Purpose</span>
                  <span className="font-bold text-[#0B1B33] dark:text-[#EAF0F8] tabular-nums">4.30 / 5.0</span>
                </div>
                <div className="w-full h-2 bg-black/10 dark:bg-black/30 rounded-full overflow-hidden">
                  <div className="w-[86%] h-full bg-[#2E8EBF] rounded-full transition-all duration-700" />
                </div>
                <span className="text-[10px] text-[#5C6778] dark:text-[#9FB2CC] block">+0.15 vs last cycle</span>
              </div>

              <div className="p-4 rounded-control bg-[#F8F7F4] dark:bg-[#11305C] border border-[#E8E6E1] dark:border-[#1F3F6E] space-y-2">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-[#5C6778] dark:text-[#9FB2CC]">Psychological Safety</span>
                  <span className="font-bold text-[#0B1B33] dark:text-[#EAF0F8] tabular-nums">4.40 / 5.0</span>
                </div>
                <div className="w-full h-2 bg-black/10 dark:bg-black/30 rounded-full overflow-hidden">
                  <div className="w-[88%] h-full bg-[#2E8EBF] rounded-full transition-all duration-700" />
                </div>
                <span className="text-[10px] text-[#5C6778] dark:text-[#9FB2CC] block">+0.20 vs last cycle</span>
              </div>

              <div className="p-4 rounded-control bg-[#F8F7F4] dark:bg-[#11305C] border border-[#E8E6E1] dark:border-[#1F3F6E] space-y-2">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-[#9A5B00] dark:text-[#F5A623] font-bold">Workload Pacing (!)</span>
                  <span className="font-bold text-[#9A5B00] dark:text-[#F5A623] tabular-nums">3.95 / 5.0</span>
                </div>
                <div className="w-full h-2 bg-black/10 dark:bg-black/30 rounded-full overflow-hidden">
                  <div className="w-[79%] h-full bg-[#9A5B00] dark:bg-[#F5A623] rounded-full transition-all duration-700" />
                </div>
                <span className="text-[10px] text-[#9A5B00] dark:text-[#F5A623] block">Triggered 14-day Playbook</span>
              </div>
            </div>

            {/* 14-Day Action Commitment Card */}
            <div className="p-4 rounded-control bg-[#F8F7F4] dark:bg-[#071936] border border-[#E8E6E1] dark:border-[#1F3F6E] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#1D6F9F]/15 text-[#1D6F9F] dark:text-[#4AA3D6]">
                    Committed Process Reform
                  </span>
                  <span className="text-xs font-mono text-[#5C6778] dark:text-[#9FB2CC]">Due in 10 days</span>
                </div>
                <p className="text-xs text-[#0B1B33] dark:text-[#EAF0F8] font-sans leading-relaxed">
                  &ldquo;Automated Kafka dead-letter queue reprocessing to eliminate after-hours manual on-call paging.&rdquo;
                </p>
              </div>

              <button
                type="button"
                onClick={() => openAuthModal('demo')}
                className="btn-primary !h-9 !px-3.5 !text-xs whitespace-nowrap flex-shrink-0"
              >
                <span>Explore Full Manager View</span>
                <ArrowRight size={12} className="chevron-nudge" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: EMPLOYEE SANCTUARY */}
        {/* ========================================================================= */}
        {activeRole === 'employee' && (
          <div className="space-y-6 animate-in fade-in-50 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8E6E1] dark:border-[#1F3F6E]">
              <div>
                <h4 className="text-base font-semibold text-[#0B1B33] dark:text-[#EAF0F8]">
                  Personal Sanctuary &amp; Private Wellbeing Reflection
                </h4>
                <p className="text-xs text-[#5C6778] dark:text-[#9FB2CC] font-sans mt-0.5">
                  100% confidential to you. Never visible to your manager, peers, or senior leadership.
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-[#1F7A4F]/15 text-[#1F7A4F] dark:text-[#2DBE78] font-mono text-xs font-semibold flex items-center gap-1.5">
                <Lock size={12} /> Confidential
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-control bg-[#F8F7F4] dark:bg-[#11305C] border border-[#E8E6E1] dark:border-[#1F3F6E] space-y-2">
                <span className="text-xs font-mono text-[#1D6F9F] dark:text-[#4AA3D6] font-semibold block">
                  Confidential Survey Dispatch
                </span>
                <p className="text-xs text-[#5C6778] dark:text-[#9FB2CC] font-sans leading-relaxed">
                  Single-use cryptographic token. 6 skippable questions completed in under 4 minutes with zero corporate login tracking.
                </p>
              </div>

              <div className="p-4 rounded-control bg-[#F8F7F4] dark:bg-[#11305C] border border-[#E8E6E1] dark:border-[#1F3F6E] space-y-2">
                <span className="text-xs font-mono text-[#1D6F9F] dark:text-[#4AA3D6] font-semibold block">
                  Private Support Request Routing
                </span>
                <p className="text-xs text-[#5C6778] dark:text-[#9FB2CC] font-sans leading-relaxed">
                  Request counseling or workload rebalancing directly with HRBPs. Choose full anonymity or withdraw at any moment.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-control bg-[#F8F7F4] dark:bg-[#071936] border border-[#E8E6E1] dark:border-[#1F3F6E] flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Bot size={20} className="text-[#1D6F9F] dark:text-[#4AA3D6]" />
                <div>
                  <div className="text-xs font-semibold text-[#0B1B33] dark:text-[#EAF0F8]">
                    24/7 AI Wellbeing Companion
                  </div>
                  <div className="text-[11px] text-[#5C6778] dark:text-[#9FB2CC]">
                    Grounding, breathing exercises, and Tele-MANAS crisis safety (14416).
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => openAuthModal('demo')}
                className="btn-primary !h-9 !px-3.5 !text-xs whitespace-nowrap"
              >
                <span>Launch Sanctuary Demo</span>
                <ArrowRight size={12} className="chevron-nudge" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: HRBP OPERATIONS */}
        {/* ========================================================================= */}
        {activeRole === 'hrbp' && (
          <div className="space-y-6 animate-in fade-in-50 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8E6E1] dark:border-[#1F3F6E]">
              <div>
                <h4 className="text-base font-semibold text-[#0B1B33] dark:text-[#EAF0F8]">
                  HRBP Organizational Triage &amp; Inquiry Pipeline
                </h4>
                <p className="text-xs text-[#5C6778] dark:text-[#9FB2CC] font-sans mt-0.5">
                  Cross-squad distribution analysis with automated $N \ge 5$ suppression safeguarding small groups.
                </p>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#2E8EBF]/15 text-[#1D6F9F] dark:text-[#4AA3D6] font-mono text-xs font-semibold">
                3 Engineering Squads
              </span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 rounded-control bg-[#F8F7F4] dark:bg-[#11305C] border border-[#E8E6E1] dark:border-[#1F3F6E] flex items-center justify-between">
                <div>
                  <span className="font-semibold text-[#0B1B33] dark:text-[#EAF0F8]">Payments Engineering:</span>
                  <span className="text-[#5C6778] dark:text-[#9FB2CC] ml-2">Score 4.22 &bull; Action committed</span>
                </div>
                <span className="text-[#1F7A4F] dark:text-[#2DBE78] font-bold">Normal Pacing</span>
              </div>

              <div className="p-3 rounded-control bg-[#F8F7F4] dark:bg-[#11305C] border border-[#E8E6E1] dark:border-[#1F3F6E] flex items-center justify-between">
                <div>
                  <span className="font-semibold text-[#0B1B33] dark:text-[#EAF0F8]">Core Platform:</span>
                  <span className="text-[#5C6778] dark:text-[#9FB2CC] ml-2">Score 3.88 &bull; Workload warning flagged</span>
                </div>
                <span className="text-[#9A5B00] dark:text-[#F5A623] font-bold">Triage Active</span>
              </div>

              <div className="p-3 rounded-control bg-[#F8F7F4] dark:bg-[#11305C] border border-[#E8E6E1] dark:border-[#1F3F6E] flex items-center justify-between">
                <div>
                  <span className="font-semibold text-[#0B1B33] dark:text-[#EAF0F8]">Mobile Squad (3 Members):</span>
                  <span className="text-[#5C6778] dark:text-[#9FB2CC] ml-2">&lt; 5 respondents &bull; Results Suppressed</span>
                </div>
                <span className="text-[#5C6778] dark:text-[#9FB2CC] flex items-center gap-1 font-bold">
                  <Lock size={12} /> N &lt; 5 Shield
                </span>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => openAuthModal('demo')}
                className="btn-primary !h-9 !px-3.5 !text-xs"
              >
                <span>Open HRBP Dashboard Demo</span>
                <ArrowRight size={12} className="chevron-nudge" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: LEADERSHIP SCORECARD */}
        {/* ========================================================================= */}
        {activeRole === 'leadership' && (
          <div className="space-y-6 animate-in fade-in-50 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8E6E1] dark:border-[#1F3F6E]">
              <div>
                <h4 className="text-base font-semibold text-[#0B1B33] dark:text-[#EAF0F8]">
                  Executive Operational Health Scorecard
                </h4>
                <p className="text-xs text-[#5C6778] dark:text-[#9FB2CC] font-sans mt-0.5">
                  High-level aggregate trends without manager stack-ranking or gamification incentives.
                </p>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#1F7A4F]/15 text-[#1F7A4F] dark:text-[#2DBE78] font-mono text-xs font-semibold">
                Quarterly Overview
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center font-mono">
              <div className="p-3 rounded-control bg-[#F8F7F4] dark:bg-[#11305C] border border-[#E8E6E1] dark:border-[#1F3F6E]">
                <div className="text-2xl font-bold text-[#0B1B33] dark:text-[#EAF0F8] tabular-nums">4.18</div>
                <div className="text-[11px] text-[#5C6778] dark:text-[#9FB2CC] mt-1">Org Average Score</div>
              </div>
              <div className="p-3 rounded-control bg-[#F8F7F4] dark:bg-[#11305C] border border-[#E8E6E1] dark:border-[#1F3F6E]">
                <div className="text-2xl font-bold text-[#1F7A4F] dark:text-[#2DBE78] tabular-nums">94%</div>
                <div className="text-[11px] text-[#5C6778] dark:text-[#9FB2CC] mt-1">Response Rate</div>
              </div>
              <div className="p-3 rounded-control bg-[#F8F7F4] dark:bg-[#11305C] border border-[#E8E6E1] dark:border-[#1F3F6E]">
                <div className="text-2xl font-bold text-[#1D6F9F] dark:text-[#4AA3D6] tabular-nums">100%</div>
                <div className="text-[11px] text-[#5C6778] dark:text-[#9FB2CC] mt-1">14-Day Action Compliance</div>
              </div>
              <div className="p-3 rounded-control bg-[#F8F7F4] dark:bg-[#11305C] border border-[#E8E6E1] dark:border-[#1F3F6E]">
                <div className="text-2xl font-bold text-[#0B1B33] dark:text-[#EAF0F8] tabular-nums">0</div>
                <div className="text-[11px] text-[#5C6778] dark:text-[#9FB2CC] mt-1">Individual Rankings</div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => openAuthModal('demo')}
                className="btn-primary !h-9 !px-3.5 !text-xs"
              >
                <span>Open Leadership Scorecard Demo</span>
                <ArrowRight size={12} className="chevron-nudge" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
