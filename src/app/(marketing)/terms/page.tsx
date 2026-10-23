'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, BookOpen, AlertOctagon, CheckCircle2, ArrowLeft } from 'lucide-react';

export default function TermsOfServicePage() {
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
            Legal & Governance
          </span>
          <span className="text-theme-tertiary">&bull;</span>
          <span className="text-xs font-mono text-theme-tertiary">Version 2.1</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-theme-primary tracking-[-0.02em]">
          Terms of Service &amp; Code of Conduct
        </h1>
        <p className="text-sm sm:text-base text-theme-secondary font-sans leading-relaxed">
          Operational framework, non-retaliation commitments, and acceptable use policy for enterprise tenants.
        </p>
      </div>

      {/* Statutory Notice */}
      <div className="p-4 rounded-panel bg-theme-raised border hairline-border flex items-start gap-3">
        <Shield className="text-accent flex-shrink-0 mt-0.5" size={18} />
        <div className="text-xs font-sans text-theme-secondary space-y-1">
          <span className="font-semibold text-theme-primary block">
            Statutory &amp; Legal Notice
          </span>
          <p>
            Privacy notice shown before the survey. Legal review required before real use. All deploying organizations must ratify the Pulse Non-Retaliation Charter prior to dispatching survey cycles.
          </p>
        </div>
      </div>

      {/* Key Clauses */}
      <div className="space-y-8 font-sans">
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-theme-primary flex items-center gap-2">
            <AlertOctagon size={18} className="text-danger" />
            <span>1. Mandatory Non-Retaliation Rule</span>
          </h2>
          <p className="text-xs sm:text-sm text-theme-secondary leading-relaxed">
            Tenants explicitly agree that pulse diagnostics are strictly intended for process discovery, sprint pacing optimization, and organizational health diagnostics. Under no circumstances may survey results, flags, or comments be utilized for:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-theme-secondary">
            <li>Individual employee performance ratings or compensation adjustments</li>
            <li>Disciplinary action, dismissal proceedings, or punitive reallocations</li>
            <li>Managerial interrogations, retrospectives aimed at identifying respondent identity, or retaliatory harassment</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-theme-primary flex items-center gap-2">
            <CheckCircle2 size={18} className="text-success" />
            <span>2. Process-Oriented Action Commitments</span>
          </h2>
          <p className="text-xs sm:text-sm text-theme-secondary leading-relaxed">
            Delivery managers receive diagnostic telemetry solely to identify systemic sprint blockers (e.g., technical debt, after-hours page frequency, requirement churn). Managers are required to formulate a transparent 14-day operational action plan addressing process friction rather than personal behavior.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-theme-primary flex items-center gap-2">
            <BookOpen size={18} className="text-accent" />
            <span>3. Audit Trail &amp; Access Controls</span>
          </h2>
          <p className="text-xs sm:text-sm text-theme-secondary leading-relaxed">
            All administrative actions, including cycle creation, invite dispatch, role provisioning, and CSV aggregate exports, are logged in an immutable append-only audit trail visible to designated tenant security officers. Attempts to circumvent suppression rules or extract granular telemetry trigger security alerts.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-theme-primary flex items-center gap-2">
            <Shield size={18} className="text-accent" />
            <span>4. Disclaimer of Medical or Crisis Advice</span>
          </h2>
          <p className="text-xs sm:text-sm text-theme-secondary leading-relaxed">
            Pulse and its AI Companion are enterprise operational diagnostic instruments. They do not furnish clinical psychotherapy, psychiatric intervention, or medical diagnoses. Employees experiencing acute psychiatric emergencies are directed to national healthcare lifelines.
          </p>
        </section>
      </div>

      {/* Footer Navigation */}
      <div className="pt-6 border-t hairline-border flex items-center justify-between text-xs font-mono">
        <Link href="/privacy" className="text-accent hover:underline">
          View Privacy Architecture &rarr;
        </Link>
        <span className="text-theme-tertiary">Pulse Governance Council</span>
      </div>
    </div>
  );
}
