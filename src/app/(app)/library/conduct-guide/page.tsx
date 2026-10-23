'use client';

import React, { useState } from 'react';
import { ShieldCheck, BookOpen, ChevronDown, CheckCircle2 } from 'lucide-react';
import { ScrollProgress, Expand } from '@/components/motion';
import { StatusBadge } from '@/components/enterprise/StatusBadge';

export default function ManagerConductGuidePage() {
  const [prohibitionsOpen, setProhibitionsOpen] = useState(true);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16 text-theme-primary">
      <ScrollProgress />

      {/* Header */}
      <header className="border-b border-theme-subtle pb-6 space-y-2">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs uppercase tracking-wider text-accent font-semibold">
            Governance & Operational Protocol
          </span>
          <StatusBadge label="Section 17 Guidance" variant="accent" size="sm" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-[-0.02em] text-theme-primary leading-tight">
          Manager Conversation Conduct Guide
        </h1>
        <p className="font-mono text-xs text-theme-secondary">
          Guiding Principles for Engineering Leads During Survey Follow-Up Dialogues
        </p>
      </header>

      {/* Purpose Banner */}
      <div className="p-4 rounded-panel bg-theme-raised border hairline-border space-y-2 text-xs leading-relaxed">
        <p className="font-semibold text-theme-primary flex items-center gap-2">
          <BookOpen size={14} className="text-accent" />
          <span>Core Purpose: Operational Discovery, NOT Appraisal.</span>
        </p>
        <p className="text-theme-secondary font-sans leading-relaxed text-[13px]">
          Do NOT review past performance, audit billable hours, inspect pull requests, or discuss compensation. This conversation exists to diagnose systemic delivery obstacles and remove friction from the squad&apos;s daily engineering output.
        </p>
      </div>

      {/* Phased Conversation Journey */}
      <div className="space-y-6 text-xs leading-relaxed divide-y divide-theme-subtle">
        {/* Phase 1: Preparation */}
        <div className="pt-4 space-y-2">
          <h2 className="font-mono uppercase font-bold text-accent text-[11px] tracking-wider">
            1. Preparation
          </h2>
          <p className="text-theme-secondary font-sans text-[13px] leading-relaxed">
            Review squad-level aggregate trends and active warning flags only. Do NOT inspect an individual&apos;s commit history, overtime hours, or ticket closures prior to the meeting. Pick one primary process roadblock to focus on.
          </p>
        </div>

        {/* Phase 2: Opening Script */}
        <div className="pt-4 space-y-2">
          <h2 className="font-mono uppercase font-bold text-accent text-[11px] tracking-wider">
            2. The Opening Script
          </h2>
          <p className="text-theme-secondary font-sans text-[13px]">
            Open the meeting with the standardized transparency script:
          </p>
          <blockquote className="p-4 bg-theme-raised border hairline-border rounded-control font-sans italic text-sm text-theme-primary leading-relaxed">
            &ldquo;The goal of our conversation is to understand what is working well on the project, what delivery obstacles are slowing you down, and how we can make your daily work more engaging. Nothing said today impacts your appraisal or compensation.&rdquo;
          </blockquote>
        </div>

        {/* Phase 3: Prohibitions (Strict Don'ts) */}
        <div className="pt-4 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-mono uppercase font-bold text-danger text-[11px] tracking-wider flex items-center gap-1.5">
              <span>3. Strict Prohibitions (Zero Tolerance)</span>
            </h2>
            <button
              onClick={() => setProhibitionsOpen(!prohibitionsOpen)}
              className="text-xs font-mono text-accent hover:underline flex items-center gap-1"
            >
              <span>{prohibitionsOpen ? 'Collapse' : 'Expand'}</span>
              <ChevronDown size={12} className={prohibitionsOpen ? 'rotate-180' : ''} />
            </button>
          </div>

          <Expand open={prohibitionsOpen}>
            <div className="p-4 bg-danger/5 border border-danger/20 rounded-panel text-xs space-y-2">
              <ul className="list-disc pl-4 space-y-1.5 text-theme-primary font-sans">
                <li>Never ask: &ldquo;Did you fill out the survey?&rdquo; or &ldquo;How did you rate Item 4?&rdquo;</li>
                <li>Never guess or deduce which team member gave a specific score or wrote a qualitative comment.</li>
                <li>Never attempt to cross-reference survey completion times with Slack activity or code pushes.</li>
                <li>Never use survey results to defend your own management style or argue with squad feedback.</li>
              </ul>
            </div>
          </Expand>
        </div>

        {/* Phase 4: Follow-Through */}
        <div className="pt-4 space-y-2">
          <h2 className="font-mono uppercase font-bold text-accent text-[11px] tracking-wider">
            4. 14-Day Action Commitment
          </h2>
          <p className="text-theme-secondary font-sans text-[13px] leading-relaxed">
            Close the dialogue by documenting one concrete process improvement in the Manager Dashboard. Share the committed action openly with the squad during the next sprint planning session.
          </p>
        </div>
      </div>
    </div>
  );
}
