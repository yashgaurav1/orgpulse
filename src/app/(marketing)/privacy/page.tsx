'use client';

import React from 'react';
import Link from 'next/link';
import { Lock, ShieldCheck, EyeOff, Calendar, AlertTriangle, ArrowLeft } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      {/* Header */}
      <div className="space-y-3 pb-6 border-b hairline-border">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-accent hover:underline mb-2"
        >
          <ArrowLeft size={13} />
          <span>Back to Overview</span>
        </Link>
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs uppercase tracking-wider text-accent font-semibold">
            Governance & Compliance
          </span>
          <span className="text-theme-tertiary">&bull;</span>
          <span className="text-xs font-mono text-theme-tertiary">Version 2.4</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-theme-primary tracking-[-0.02em]">
          Privacy Architecture &amp; Data Flow Policy
        </h1>
        <p className="text-sm sm:text-base text-theme-secondary font-sans leading-relaxed">
          How Pulse provides mathematical privacy guarantees, structural database isolation, and automated retention controls.
        </p>
      </div>

      {/* Legal Notice Callout */}
      <div className="p-4 rounded-panel bg-theme-raised border hairline-border flex items-start gap-3">
        <Lock className="text-accent flex-shrink-0 mt-0.5" size={18} />
        <div className="text-xs font-sans text-theme-secondary space-y-1">
          <span className="font-semibold text-theme-primary block">
            Statutory &amp; Legal Notice
          </span>
          <p>
            Privacy notice shown before the survey. Legal review required before real use. Pulse is engineered to conform with rigorous global standards for employee anonymous surveys.
          </p>
        </div>
      </div>

      {/* Core Privacy Pillars */}
      <div className="space-y-8 font-sans">
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-theme-primary flex items-center gap-2">
            <Lock size={18} className="text-accent" />
            <span>1. Single-Use Tokens &amp; Zero Foreign Keys</span>
          </h2>
          <p className="text-xs sm:text-sm text-theme-secondary leading-relaxed">
            During diagnostic cycle dispatch, a unique cryptographic single-use token (32-byte hexadecimal hash) is generated per eligible team member. Once the survey is completed, the token status is flipped to &ldquo;used&rdquo; in the invite record. The actual survey response payload contains only <code>companyId</code>, <code>teamId</code>, and <code>cycleId</code>. No user ID, employee email, IP address, user-agent string, or high-precision timestamp is ever recorded with the response.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-theme-primary flex items-center gap-2">
            <ShieldCheck size={18} className="text-accent" />
            <span>2. Strict Minimum Group Suppression (N &ge; 5)</span>
          </h2>
          <p className="text-xs sm:text-sm text-theme-secondary leading-relaxed">
            Individual survey responses are never surfaced to delivery managers, directors, or administrators. Cloud Functions calculate aggregate mean ratings only when a squad has at least five respondents (N &ge; 5). If a team has four or fewer submissions, all numerical scores, trend lines, and feedback comments are mathematically suppressed.
          </p>
          <div className="p-3 bg-theme-raised border hairline-border rounded-control text-xs font-mono text-theme-secondary">
            Invariant: if (squad_respondents &lt; 5) return {`{ status: "SUPPRESSED", scores: null, comments: [] }`}
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-theme-primary flex items-center gap-2">
            <EyeOff size={18} className="text-accent" />
            <span>3. Differencing Protection &amp; Complementary Pooling</span>
          </h2>
          <p className="text-xs sm:text-sm text-theme-secondary leading-relaxed">
            To prevent calculating a small squad&apos;s scores by subtracting visible squads from department totals, Pulse enforces complementary suppression. If a single squad in a department is hidden, the adjacent squad is pooled or the entire division aggregate is masked until statistical privacy thresholds are satisfied.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-theme-primary flex items-center gap-2">
            <Calendar size={18} className="text-accent" />
            <span>4. 90-Day Automated Raw Data Purge</span>
          </h2>
          <p className="text-xs sm:text-sm text-theme-secondary leading-relaxed">
            Raw survey responses and verbatim qualitative text comments are retained only for the duration of the quarterly review cycle. Scheduled automated Cloud Functions permanently destroy all raw responses 90 days after cycle closure. Only de-identified, rounded team aggregates are retained for longitudinal trend tracking.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-theme-primary flex items-center gap-2">
            <AlertTriangle size={18} className="text-accent" />
            <span>5. Employee Sanctuary &amp; AI Safety Guardrails</span>
          </h2>
          <p className="text-xs sm:text-sm text-theme-secondary leading-relaxed">
            The Employee Sanctuary and AI Companion sessions run locally with client-side conversation state. Transcripts are never shared with employers, managers, or peer reviewers. In the event of severe emotional distress or self-harm keywords, the AI Companion immediately suspends conversation and surfaces verified national crisis intervention hotlines (Tele-MANAS: 14416 / 1800-891-4416).
          </p>
        </section>
      </div>

      {/* Footer Navigation */}
      <div className="pt-6 border-t hairline-border flex items-center justify-between text-xs font-mono">
        <Link href="/terms" className="text-accent hover:underline">
          View Terms of Service &rarr;
        </Link>
        <span className="text-theme-tertiary">Pulse Privacy Operations</span>
      </div>
    </div>
  );
}
