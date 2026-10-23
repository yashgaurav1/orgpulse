'use client';

import React, { useState } from 'react';
import {
  MOTION_DURATIONS,
  MOTION_EASINGS,
  MOTION_DISTANCES,
  MOTION_STAGGER,
} from '@/lib/motion/tokens';
import {
  Reveal,
  Stagger,
  CountUp,
  BarFill,
  Sparkline,
  ViewTransition,
  SlidingIndicator,
  Expand,
  Skeleton,
  DrawCheck,
  LockDraw,
  ScrollProgress,
  Toast,
  Dialog,
  EngagementAttritionChart,
} from '@/components/motion';

export default function MotionDemoPage() {
  const [replayKey, setReplayKey] = useState(0);
  const [simulateReducedMotion, setSimulateReducedMotion] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [activePill, setActivePill] = useState('q1');
  const [accordionOpen, setAccordionOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [viewStep, setViewStep] = useState(1);
  const [viewDirection, setViewDirection] = useState<'forward' | 'backward'>('forward');

  const handleReplay = () => {
    setReplayKey((prev) => prev + 1);
  };

  const handleStepChange = (newStep: number) => {
    setViewDirection(newStep > viewStep ? 'forward' : 'backward');
    setViewStep(newStep);
  };

  return (
    <div
      key={replayKey}
      className={`min-h-screen bg-paper text-ink py-10 px-4 sm:px-6 max-w-5xl mx-auto space-y-12 ${
        simulateReducedMotion ? 'motion-reduce' : ''
      }`}
    >
      <ScrollProgress />

      {/* Top Banner & Control Deck */}
      <header className="border-b border-ink/10 pb-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs uppercase tracking-widest text-slate font-medium">
                PULSE MOTION SYSTEM SPECIFICATION
              </span>
              <span className="font-mono text-[10px] bg-terracotta text-paper px-1.5 py-0.2 rounded-xs uppercase">
                DEV MODE
              </span>
            </div>
            <h1 className="font-serif text-3xl font-semibold text-ink">
              Motion Tokens &amp; Component Gallery
            </h1>
            <p className="font-sans text-sm text-slate mt-1">
              Minimalist, purpose-driven motion: Every animation explains order, change, state, or hierarchy.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleReplay}
              className="font-mono text-xs bg-ink text-paper px-3 py-1.5 rounded-xs hover:bg-slate transition-colors"
            >
              &#8635; Replay All Animations
            </button>
            <label className="flex items-center gap-2 font-mono text-xs cursor-pointer border border-ink/15 px-3 py-1.5 rounded-xs bg-paper-sunken">
              <input
                type="checkbox"
                checked={simulateReducedMotion}
                onChange={(e) => setSimulateReducedMotion(e.target.checked)}
                className="accent-terracotta"
              />
              Simulate Reduced Motion
            </label>
          </div>
        </div>

        {/* Tokens Reference Card */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-paper-elevated border border-ink/10 rounded-xs font-mono text-xs">
          <div>
            <span className="text-slate block text-[10px] uppercase">Durations</span>
            <span className="text-ink font-semibold">
              {MOTION_DURATIONS.instant}ms / {MOTION_DURATIONS.fast}ms / {MOTION_DURATIONS.base}ms / {MOTION_DURATIONS.slow}ms
            </span>
          </div>
          <div>
            <span className="text-slate block text-[10px] uppercase">Standard Easing</span>
            <span className="text-ink font-semibold truncate block" title={MOTION_EASINGS.standard}>
              cubic-bezier(.2,.7,.2,1)
            </span>
          </div>
          <div>
            <span className="text-slate block text-[10px] uppercase">Distances</span>
            <span className="text-ink font-semibold">
              Reveal: {MOTION_DISTANCES.reveal}px &bull; Small: {MOTION_DISTANCES.small}px
            </span>
          </div>
          <div>
            <span className="text-slate block text-[10px] uppercase">Stagger Step</span>
            <span className="text-ink font-semibold">
              {MOTION_STAGGER.step}ms (Max {MOTION_STAGGER.maxItems} items)
            </span>
          </div>
        </div>
      </header>

      {/* 1. Reveal & Stagger */}
      <section className="space-y-4">
        <h2 className="font-serif text-xl font-semibold border-b border-ink/10 pb-2">
          1. &lt;Reveal&gt; and &lt;Stagger&gt;
        </h2>
        <p className="font-sans text-xs text-slate">
          Fade + 12px rise on first view. Staggers child items up to 8 items before releasing remaining elements together.
        </p>

        <Stagger className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((num) => (
            <div
              key={num}
              className="p-4 border border-ink/10 bg-paper-elevated rounded-xs space-y-1"
            >
              <span className="font-mono text-[10px] text-terracotta uppercase">Card 0{num}</span>
              <h3 className="font-serif text-base font-semibold">Squad Metric Item</h3>
              <p className="font-sans text-xs text-slate">Staggered entrance: {num * 60}ms delay.</p>
            </div>
          ))}
        </Stagger>
      </section>

      {/* 2. CountUp & BarFill (With Privacy Invariant Demonstration) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-ink/10 pb-2">
          <h2 className="font-serif text-xl font-semibold">
            2. &lt;CountUp&gt; and &lt;BarFill&gt; (Privacy Lockdown Enforced)
          </h2>
          <span className="font-mono text-[11px] text-slate">Tabular figures &bull; Zero layout shift</span>
        </div>
        <p className="font-sans text-xs text-slate">
          Bar grows left-to-right (transform scaleX), and numerical label fades in last. For suppressed groups (N &lt; 5), animations and numeric DOM elements are completely inhibited.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Active Squad */}
          <div className="p-4 border border-ink/10 bg-paper-elevated rounded-xs space-y-3">
            <div className="flex justify-between items-baseline">
              <span className="font-mono text-xs font-semibold">Squad A (FinTech): N = 8</span>
              <div className="font-mono text-lg font-bold text-ink">
                <CountUp value={4.15} prefix="Avg: " />
              </div>
            </div>
            <BarFill value={4.15} threshold={3.0} />
            <div className="flex justify-between font-mono text-[10px] text-slate">
              <span>Psychological Safety</span>
              <CountUp value={4.25} />
            </div>
            <BarFill value={4.25} threshold={3.0} />
          </div>

          {/* Privacy Hidden Squad */}
          <div className="p-4 border border-ink/10 bg-paper-elevated rounded-xs space-y-3">
            <div className="flex justify-between items-baseline">
              <span className="font-mono text-xs font-semibold text-slate">Squad E (Innovation): N = 3</span>
              <div className="flex items-center gap-1.5 text-slate">
                <LockDraw size={14} />
                <span className="font-mono text-xs font-medium">SUPPRESSED</span>
              </div>
            </div>
            {/* Must render static privacy panel: no bar fill, no number counting */}
            <BarFill value={null} hidden={true} />
            <div className="flex justify-between font-mono text-[10px] text-slate">
              <span>Psychological Safety</span>
              <CountUp value={null} hidden={true} />
            </div>
            <BarFill value={null} hidden={true} />
          </div>
        </div>
      </section>

      {/* 3. Sparkline Longitudinal Trend & Hero Motif */}
      <section className="space-y-4">
        <h2 className="font-serif text-xl font-semibold border-b border-ink/10 pb-2">
          3. &lt;Sparkline&gt; &amp; &lt;EngagementAttritionChart&gt;
        </h2>
        <p className="font-sans text-xs text-slate">
          SVG stroke-dashoffset drawing with zero layout shift. Used for longitudinal squad trends and the home hero problem statement.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div className="p-4 border border-ink/10 bg-paper-elevated rounded-xs space-y-3">
            <span className="font-mono text-xs font-semibold block">Quarterly Trend (Q1 25 &rarr; Q1 26)</span>
            <div className="flex items-center justify-between">
              <Sparkline data={[3.6, 3.8, 4.05, 4.15]} width={200} height={40} strokeColor="#1B1A17" />
              <span className="font-mono text-xs text-ink">+0.55 improvement</span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-ink/10">
              <Sparkline data={[4.2, 3.9, 3.2, 2.85]} width={200} height={40} strokeColor="#B5502D" />
              <span className="font-mono text-xs text-terracotta">-1.35 decline</span>
            </div>
          </div>

          <EngagementAttritionChart />
        </div>
      </section>

      {/* 4. SlidingIndicator & Directional ViewTransition */}
      <section className="space-y-4">
        <h2 className="font-serif text-xl font-semibold border-b border-ink/10 pb-2">
          4. &lt;SlidingIndicator&gt; and &lt;ViewTransition&gt;
        </h2>
        <p className="font-sans text-xs text-slate">
          Indicator translates using pure CSS transform. View transition slides 12px based on navigation direction (forward vs backward).
        </p>

        <div className="space-y-4 p-4 border border-ink/10 bg-paper-elevated rounded-xs">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <SlidingIndicator
              tabs={[
                { id: 'overview', label: 'Squad Overview' },
                { id: 'triggers', label: 'Rule-Based Flags', badge: 2 },
                { id: 'actions', label: '14-Day Actions', badge: 3 },
              ]}
              activeId={activeTab}
              onChange={setActiveTab}
              variant="underline"
            />

            <SlidingIndicator
              tabs={[
                { id: 'q1', label: 'Q1' },
                { id: 'q2', label: 'Q2' },
                { id: 'q3', label: 'Q3' },
              ]}
              activeId={activePill}
              onChange={setActivePill}
              variant="pill"
            />
          </div>

          {/* Directional Step Transition Demo */}
          <div className="pt-4 border-t border-ink/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-slate">Directional Slide: Step {viewStep} of 3</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={viewStep <= 1}
                  onClick={() => handleStepChange(viewStep - 1)}
                  className="font-mono text-xs border border-ink/15 px-2 py-1 rounded-xs disabled:opacity-30"
                >
                  &larr; Prev
                </button>
                <button
                  type="button"
                  disabled={viewStep >= 3}
                  onClick={() => handleStepChange(viewStep + 1)}
                  className="font-mono text-xs border border-ink/15 px-2 py-1 rounded-xs disabled:opacity-30"
                >
                  Next &rarr;
                </button>
              </div>
            </div>

            <ViewTransition direction={viewDirection} viewKey={viewStep} className="p-4 bg-paper-sunken border border-ink/10 rounded-xs">
              <div className="space-y-1">
                <h4 className="font-serif text-lg font-semibold text-ink">
                  {viewStep === 1 && 'Step 1: Diagnostic Squad Screening'}
                  {viewStep === 2 && 'Step 2: Rule-Based Warning Evaluation'}
                  {viewStep === 3 && 'Step 3: Manager Follow-Through Commitment'}
                </h4>
                <p className="font-sans text-xs text-slate">
                  Notice the 12px directional horizontal movement reflecting forward vs backward user progression.
                </p>
              </div>
            </ViewTransition>
          </div>
        </div>
      </section>

      {/* 5. Expand (CSS Grid Accordion) & Skeleton Shimmer */}
      <section className="space-y-4">
        <h2 className="font-serif text-xl font-semibold border-b border-ink/10 pb-2">
          5. &lt;Expand&gt; (CSS Grid) and &lt;Skeleton&gt; Shimmer
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Expand Accordion */}
          <div className="p-4 border border-ink/10 bg-paper-elevated rounded-xs space-y-3">
            <button
              type="button"
              onClick={() => setAccordionOpen(!accordionOpen)}
              className="w-full flex items-center justify-between font-serif text-base font-semibold text-left text-ink"
            >
              <span>Stay Interview Guidelines Accordion</span>
              <span className="font-mono text-xs text-slate">{accordionOpen ? '− Close' : '+ Open'}</span>
            </button>
            <Expand open={accordionOpen}>
              <div className="pt-2 text-xs font-sans text-slate space-y-2 border-t border-ink/10">
                <p>
                  1. Non-evaluative psychological contract review. Conducted within 14 days of a high-risk trigger.
                </p>
                <p>
                  2. Line managers strictly listen; responses are never entered into performance appraisals or compensation criteria.
                </p>
              </div>
            </Expand>
          </div>

          {/* Skeleton Shimmer */}
          <div className="p-4 border border-ink/10 bg-paper-elevated rounded-xs space-y-3">
            <span className="font-mono text-xs font-semibold block text-slate">Subtle Paper/Ink Skeleton</span>
            <div className="space-y-2">
              <Skeleton height="1.25rem" width="70%" />
              <Skeleton height="0.875rem" width="100%" />
              <Skeleton height="0.875rem" width="85%" />
            </div>
          </div>
        </div>
      </section>

      {/* 6. DrawCheck, Modal Dialog & Toast */}
      <section className="space-y-4">
        <h2 className="font-serif text-xl font-semibold border-b border-ink/10 pb-2">
          6. &lt;DrawCheck&gt;, &lt;Dialog&gt;, and &lt;Toast&gt;
        </h2>
        <div className="flex flex-wrap items-center gap-4 p-4 border border-ink/10 bg-paper-elevated rounded-xs">
          <div className="flex items-center gap-3">
            <DrawCheck size={36} color="#B5502D" />
            <span className="font-mono text-xs text-slate">Submission Checkmark</span>
          </div>

          <div className="h-6 w-[1px] bg-ink/10 mx-2 hidden sm:block" />

          <button
            type="button"
            onClick={() => setDialogOpen(true)}
            className="font-mono text-xs bg-paper border border-ink/20 px-3 py-1.5 rounded-xs hover:bg-paper-sunken"
          >
            Open Modal Dialog &rarr;
          </button>

          <button
            type="button"
            onClick={() => setToastOpen(true)}
            className="font-mono text-xs bg-paper border border-ink/20 px-3 py-1.5 rounded-xs hover:bg-paper-sunken"
          >
            Trigger Toast Notification &rarr;
          </button>
        </div>
      </section>

      {/* Dialog Instance */}
      <Dialog
        open={dialogOpen}
        title="Privacy Protocol Confirmation"
        onClose={() => setDialogOpen(false)}
      >
        <div className="space-y-4 text-xs font-sans text-slate">
          <p>
            This action plan will be recorded in the append-only audit log. No individual employee survey responses can be viewed or exported.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setDialogOpen(false)}
              className="font-mono text-xs bg-ink text-paper px-3 py-1.5 rounded-xs hover:bg-slate"
            >
              Acknowledge &amp; Close
            </button>
          </div>
        </div>
      </Dialog>

      {/* Toast Instance */}
      <Toast
        open={toastOpen}
        message="14-day action commitment saved to audit log."
        type="success"
        onClose={() => setToastOpen(false)}
      />
    </div>
  );
}
