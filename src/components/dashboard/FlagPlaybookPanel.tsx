'use client';

import React, { useState } from 'react';
import { ActiveTrigger } from '@/lib/flags';
import { Expand } from '@/components/motion';
import { AlertTriangle, ChevronDown } from 'lucide-react';

interface FlagPlaybookPanelProps {
  triggers: ActiveTrigger[];
  onLogAction?: (trigger: ActiveTrigger) => void;
}

export function FlagPlaybookPanel({
  triggers,
  onLogAction,
}: FlagPlaybookPanelProps) {
  const [showCalculationRules, setShowCalculationRules] = useState(false);

  return (
    <div className="space-y-4">
      {/* Principle Banner */}
      <div className="p-3 bg-accent/5 border border-accent/20 rounded-control text-xs leading-relaxed text-theme-secondary font-sans">
        <strong className="text-theme-primary font-mono text-[11px] block mb-0.5">
          Core Principle: Fix Processes, Not Attitudes
        </strong>
        Responses fix processes, not attitudes. For an unsustainable workload, delivery leadership renegotiates deadlines with client partners instead of demanding engineers work faster.
      </div>

      {/* Active Triggers & Playbook */}
      <div className="space-y-3">
        <div className="flex justify-between items-baseline">
          <h2 className="text-sm font-semibold tracking-[-0.02em] text-theme-primary font-mono uppercase">
            Active Warning Flags & Playbook ({triggers.length})
          </h2>
          <button
            type="button"
            onClick={() => setShowCalculationRules(!showCalculationRules)}
            className="text-xs font-mono text-accent hover:underline flex items-center gap-1 transition-colors"
          >
            <span>{showCalculationRules ? 'Hide Calculation Rules' : 'How flags are calculated'}</span>
            <ChevronDown size={11} className={showCalculationRules ? 'rotate-180' : ''} />
          </button>
        </div>

        {/* Collapsible 'How flags are calculated' panel using <Expand> */}
        <Expand open={showCalculationRules}>
          <div className="p-4 bg-theme-raised border hairline-border rounded-panel text-xs space-y-2 mb-2 font-mono">
            <h3 className="uppercase font-semibold text-theme-primary text-[10px] tracking-wider">
              Rule-Based Calibration Starting Points
            </h3>
            <p className="text-theme-secondary font-sans leading-relaxed text-[11px]">
              All flag thresholds are rule-based starting points for calibration in the 90-day pilot, not clinical cut-offs. AI is never used to flag or evaluate people.
            </p>
            <ul className="list-disc pl-4 space-y-1 text-theme-secondary text-[11px]">
              <li><strong className="text-theme-primary">Item 5 (Workload):</strong> Mean score below 3.0 triggers sprint review.</li>
              <li><strong className="text-theme-primary">Item 4 (Safety):</strong> Mean score below 3.2 triggers blameless retrospective & leadership coaching.</li>
              <li><strong className="text-theme-primary">Drop Threshold:</strong> Any item falling by 0.40 or more versus previous cycle (if previous cycle met N &ge; 5).</li>
              <li><strong className="text-theme-primary">Passive Indicators:</strong> Late updates (&gt; 35% in late window) or training drops (&gt; 30%).</li>
              <li><strong className="text-theme-primary">Risk Calculation:</strong> Low (0 flags &amp; avg &ge; 4.0), Moderate (0 flags &amp; avg &lt; 4.0), High (1-2 flags), Critical (3+ flags).</li>
            </ul>
          </div>
        </Expand>

        {triggers.length === 0 ? (
          <div className="p-6 text-center rounded-panel bg-theme-surface border hairline-border text-xs font-mono text-theme-tertiary">
            ✓ No active warning flags triggered for this squad cycle.
          </div>
        ) : (
          <div className="space-y-3">
            {triggers.map((trigger, idx) => (
              <div
                key={idx}
                className="p-4 rounded-panel bg-theme-surface border border-warning/30 space-y-2 text-xs font-mono"
              >
                <div className="flex items-center justify-between text-warning font-semibold">
                  <div className="flex items-center gap-2">
                    <AlertTriangle size={14} strokeWidth={1.5} />
                    <span>{trigger.itemName || `${trigger.item} (${trigger.domain})`}</span>
                  </div>
                  <span className="text-[10px] bg-warning/10 px-1.5 py-0.5 rounded-xs border border-warning/20">
                    Flagged
                  </span>
                </div>

                <p className="text-theme-secondary font-sans text-xs">
                  {trigger.reason || trigger.triggerCondition || trigger.likelyCause}
                </p>

                <div className="pt-2 border-t border-theme-subtle flex items-start justify-between gap-3">
                  <div className="text-[11px] font-sans text-theme-primary">
                    <strong className="font-mono text-accent">Recommended Action:</strong>{' '}
                    {trigger.recommendation || trigger.responsePlan}
                  </div>
                  {onLogAction && (
                    <button
                      type="button"
                      onClick={() => onLogAction(trigger)}
                      className="px-2.5 py-1 bg-accent hover:bg-accent-hover text-white rounded-control text-xs font-mono font-medium transition-colors focus-ring flex-shrink-0"
                    >
                      Log 14-Day Plan
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
