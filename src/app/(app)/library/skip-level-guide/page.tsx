import React from 'react';

export default function SkipLevelGuidePage() {
  return (
    <div className="min-h-screen bg-paper text-ink py-10 px-4 sm:px-6 max-w-editorial mx-auto space-y-8">
      {/* Header */}
      <header className="border-b border-ink/10 pb-6 space-y-2">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs uppercase tracking-widest text-terracotta">
            LEADERSHIP PROTOCOL
          </span>
          <span className="font-mono text-xs text-slate">&bull; Section 17</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-ink leading-tight">
          Skip-Level Dialogue Guide
        </h1>
        <p className="font-mono text-xs text-slate">
          Format: Twice a year &bull; 30 minutes &bull; Delivery Director / AVP with Delivery Engineers
        </p>
      </header>

      {/* Purpose & Safeguards */}
      <section className="p-4 bg-ink/5 border-l-2 border-slate text-xs space-y-2 leading-relaxed">
        <p className="font-semibold text-ink">
          Primary Objective: Surface Systemic Delivery Obstacles &amp; Lead Friction.
        </p>
        <p className="text-slate">
          Conducted without the immediate delivery manager present to provide an uninhibited channel for engineers to highlight cross-squad architecture blockers, client handoff failures, or leadership coaching needs.
        </p>
      </section>

      {/* Protocol Pillars */}
      <div className="space-y-6 text-xs leading-relaxed divide-y divide-ink/10">
        <div className="pt-4 space-y-2">
          <h2 className="font-mono uppercase font-bold text-slate text-[11px] tracking-wider">
            1. Anonymity &amp; Theme-Level Recording
          </h2>
          <p className="text-ink/90">
            Directors must never record personal names, employee IDs, or verbatim quotes in the skip-level log. All observations are recorded exclusively at the <strong>thematic level</strong> (e.g., &ldquo;AWS permission delays causing 5-day onboarding stall&rdquo;).
          </p>
        </div>

        <div className="pt-4 space-y-2">
          <h2 className="font-mono uppercase font-bold text-slate text-[11px] tracking-wider">
            2. Minimum Reporting Threshold (N &ge; 5)
          </h2>
          <p className="text-ink/90">
            If fewer than 5 engineers participate in a skip-level cohort, themes cannot be attributed directly to a specific delivery squad. They must be merged into the broader Business Unit thematic summary before being shared with delivery leads.
          </p>
        </div>

        <div className="pt-4 space-y-2">
          <h2 className="font-mono uppercase font-bold text-slate text-[11px] tracking-wider">
            3. Recommended Dialogue Prompts
          </h2>
          <ul className="list-disc pl-4 space-y-1.5 text-ink/90">
            <li>&ldquo;Where are sprint handoffs breaking down between our squad and the client offshore team?&rdquo;</li>
            <li>&ldquo;What tooling or environmental blockers have persisted for more than two sprints without resolution?&rdquo;</li>
            <li>&ldquo;Do you feel comfortable raising engineering roadblocks to your lead, or does the team hesitate out of concern over blame?&rdquo;</li>
            <li>&ldquo;What is one organizational policy that is actively getting in the way of high-quality software delivery?&rdquo;</li>
          </ul>
        </div>

        <div className="pt-4 space-y-2">
          <h2 className="font-mono uppercase font-bold text-slate text-[11px] tracking-wider">
            4. Closing &amp; Lead Coaching
          </h2>
          <p className="text-ink/90">
            Themes are synthesized into constructive coaching feedback for delivery managers. If psychological safety is flagged, the Delivery Director and HRBP partner with the manager on leadership communication rather than reprimand.
          </p>
        </div>
      </div>
    </div>
  );
}
