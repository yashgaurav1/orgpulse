'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth-context';
import { WaveLineArt } from '@/components/home/WaveLineArt';
import { FramedProductWindow } from '@/components/home/FramedProductWindow';
import { HowItWorksBento } from '@/components/home/HowItWorksBento';
import { RoleCarousel } from '@/components/home/RoleCarousel';
import { PrivacyGrid } from '@/components/home/PrivacyGrid';
import { StatsRow } from '@/components/home/StatsRow';
import { WellbeingCompanionPreview } from '@/components/home/WellbeingCompanionPreview';
import { FaqAccordion } from '@/components/home/FaqAccordion';
import {
  ChevronRight,
  ArrowRight,
  Sparkles,
  ShieldAlert,
  Clock,
  HeartCrack,
} from 'lucide-react';

export default function MarketingLandingPage() {
  const { openAuthModal } = useAuth();

  return (
    <div className="relative min-h-screen bg-white dark:bg-[#00142E] text-[#0B1B33] dark:text-[#EAF0F8] overflow-hidden selection:bg-[#2E8EBF]/20">
      {/* Background Margin Dot Grid (outer margins 4-6% opacity) */}
      <div className="absolute inset-0 margin-dot-grid pointer-events-none" aria-hidden="true" />

      {/* 1280px Centred Container with 1px Vertical Hairline Desktop Borders */}
      <div className="landing-frame-container relative z-10 px-6 space-y-24 sm:space-y-32 pb-24">

        {/* ========================================================================= */}
        {/* HERO SECTION: Left Aligned, Wave Line Art Right, Framed Product Window Below */}
        {/* ========================================================================= */}
        <section className="relative pt-12 sm:pt-16 lg:pt-20 space-y-12 sm:space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative">
            {/* Left Column (7 cols): Headline, Subline, CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.2, 0.7, 0.2, 1] }}
              className="lg:col-span-7 space-y-6 relative z-10"
            >
              {/* Display Headline */}
              <h1 className="font-display-hero text-[#0B1B33] dark:text-white">
                Understand employee wellbeing before it becomes attrition
              </h1>

              {/* Subline with Navy/Primary semibold keywords */}
              <p className="font-body-editorial max-w-xl">
                <strong className="font-semibold text-[#0B1B33] dark:text-white">Anonymous surveys</strong>,{' '}
                <strong className="font-semibold text-[#0B1B33] dark:text-white">firewalled human support</strong>, and a{' '}
                <strong className="font-semibold text-[#0B1B33] dark:text-white">private companion</strong> for engineering teams, built so managers see groups, never individuals.
              </p>

              {/* Primary & Secondary Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => openAuthModal('demo')}
                  className="btn-primary"
                >
                  <Sparkles size={14} className="text-[#2E8EBF] dark:text-[#03173B]" />
                  <span>Try the demo</span>
                  <ChevronRight size={15} className="chevron-nudge" />
                </button>

                <button
                  type="button"
                  onClick={() => openAuthModal('signin')}
                  className="btn-secondary"
                >
                  <span>Sign in</span>
                </button>
              </div>
            </motion.div>

            {/* Right Column (5 cols): Mathematical Wave Line Art Canvas */}
            <div className="lg:col-span-5 relative h-72 sm:h-96 lg:h-[460px] w-full">
              <WaveLineArt />
            </div>
          </div>

          {/* Framed Product Window Rising from Bottom Edge of Hero */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.2, 0.7, 0.2, 1] }}
            className="pt-2"
          >
            <FramedProductWindow />
          </motion.div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 01: THE PROBLEM */}
        {/* ========================================================================= */}
        <section id="problem" className="space-y-8 pt-8 border-t border-[#E8E6E1] dark:border-[#1F3F6E]">
          {/* Two-Tone Headline with Accent Tick & Right-Aligned Action */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="flex items-start gap-3 max-w-3xl">
              <span className="heading-tick" aria-hidden="true" />
              <div>
                <span className="text-xs font-sans uppercase tracking-wider text-[#1D6F9F] dark:text-[#4AA3D6] font-semibold block mb-1">
                  The Problem Space
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-[#0B1B33] dark:text-[#EAF0F8] tracking-[-0.03em] leading-snug">
                  Traditional feedback arrives when it is already too late.{' '}
                  <span className="text-[#5C6778] dark:text-[#9FB2CC] font-normal">
                    Engineers do not complain before leaving; they quietly detach.
                  </span>
                </h2>
              </div>
            </div>

            <button
              type="button"
              onClick={() => openAuthModal('demo')}
              className="btn-secondary !h-9 !px-3.5 !text-xs whitespace-nowrap self-start md:self-end"
            >
              <span>See Diagnostic Solution</span>
              <ChevronRight size={13} className="chevron-nudge" />
            </button>
          </div>

          {/* Three Hairline-Divided Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#E8E6E1] dark:divide-[#1F3F6E] rounded-panel bg-[#F8F7F4] dark:bg-[#071936] border border-[#E8E6E1] dark:border-[#1F3F6E]">
            <div className="p-6 sm:p-8 space-y-3">
              <div className="w-8 h-8 rounded-control bg-[#BF1111]/15 text-[#C01313] dark:text-[#FF7A7A] flex items-center justify-center">
                <ShieldAlert size={16} />
              </div>
              <h3 className="text-sm font-semibold text-[#0B1B33] dark:text-[#EAF0F8]">
                The Retaliation Fear
              </h3>
              <p className="text-xs text-[#5C6778] dark:text-[#9FB2CC] font-sans leading-relaxed">
                Employees withhold honest ratings because typical HR tools record corporate logins, store IP addresses, and present small team responses without mathematical suppression.
              </p>
            </div>

            <div className="p-6 sm:p-8 space-y-3 pt-6 md:pt-8">
              <div className="w-8 h-8 rounded-control bg-[#9A5B00]/15 text-[#9A5B00] dark:text-[#F5A623] flex items-center justify-center">
                <Clock size={16} />
              </div>
              <h3 className="text-sm font-semibold text-[#0B1B33] dark:text-[#EAF0F8]">
                Delayed Signal Lag
              </h3>
              <p className="text-xs text-[#5C6778] dark:text-[#9FB2CC] font-sans leading-relaxed">
                Annual and biannual review cycles provide retrospective post-mortems rather than active operational warnings during quarterly delivery sprints when intervention matters.
              </p>
            </div>

            <div className="p-6 sm:p-8 space-y-3 pt-6 md:pt-8">
              <div className="w-8 h-8 rounded-control bg-[#2E8EBF]/15 text-[#1D6F9F] dark:text-[#4AA3D6] flex items-center justify-center">
                <HeartCrack size={16} />
              </div>
              <h3 className="text-sm font-semibold text-[#0B1B33] dark:text-[#EAF0F8]">
                Punitive Blame Culture
              </h3>
              <p className="text-xs text-[#5C6778] dark:text-[#9FB2CC] font-sans leading-relaxed">
                When results are used for manager stack-ranking or performance appraisals, managers defend themselves instead of resolving sprint scope and tooling friction.
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 02: HOW IT WORKS IN THREE STEPS */}
        {/* ========================================================================= */}
        <section id="how-it-works" className="space-y-8 pt-8 border-t border-[#E8E6E1] dark:border-[#1F3F6E]">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="flex items-start gap-3 max-w-3xl">
              <span className="heading-tick" aria-hidden="true" />
              <div>
                <span className="text-xs font-sans uppercase tracking-wider text-[#1D6F9F] dark:text-[#4AA3D6] font-semibold block mb-1">
                  Diagnostic Architecture
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-[#0B1B33] dark:text-[#EAF0F8] tracking-[-0.03em] leading-snug">
                  Three steps: Survey, Insight, Action.{' '}
                  <span className="text-[#5C6778] dark:text-[#9FB2CC] font-normal">
                    Fixing engineering bottlenecks, not measuring personal feelings.
                  </span>
                </h2>
              </div>
            </div>

            <button
              type="button"
              onClick={() => openAuthModal('demo')}
              className="btn-secondary !h-9 !px-3.5 !text-xs whitespace-nowrap self-start md:self-end"
            >
              <span>Test Interactive Flow</span>
              <ChevronRight size={13} className="chevron-nudge" />
            </button>
          </div>

          <HowItWorksBento />
        </section>

        {/* ========================================================================= */}
        {/* SECTION 03: WHAT EACH ROLE SEES */}
        {/* ========================================================================= */}
        <section id="roles" className="space-y-8 pt-8 border-t border-[#E8E6E1] dark:border-[#1F3F6E]">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="flex items-start gap-3 max-w-3xl">
              <span className="heading-tick" aria-hidden="true" />
              <div>
                <span className="text-xs font-sans uppercase tracking-wider text-[#1D6F9F] dark:text-[#4AA3D6] font-semibold block mb-1">
                  Role-Based Experience
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-[#0B1B33] dark:text-[#EAF0F8] tracking-[-0.03em] leading-snug">
                  Specialized views for every organizational seat.{' '}
                  <span className="text-[#5C6778] dark:text-[#9FB2CC] font-normal">
                    Separated by strict database-level cryptographic firewalls.
                  </span>
                </h2>
              </div>
            </div>

            <button
              type="button"
              onClick={() => openAuthModal('demo')}
              className="btn-secondary !h-9 !px-3.5 !text-xs whitespace-nowrap self-start md:self-end"
            >
              <span>Open Role Switcher</span>
              <ChevronRight size={13} className="chevron-nudge" />
            </button>
          </div>

          <RoleCarousel />
        </section>

        {/* ========================================================================= */}
        {/* SECTION 04: PRIVACY GRID */}
        {/* ========================================================================= */}
        <section id="privacy" className="space-y-8 pt-8 border-t border-[#E8E6E1] dark:border-[#1F3F6E]">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="flex items-start gap-3 max-w-3xl">
              <span className="heading-tick" aria-hidden="true" />
              <div>
                <span className="text-xs font-sans uppercase tracking-wider text-[#1D6F9F] dark:text-[#4AA3D6] font-semibold block mb-1">
                  Mathematical Privacy
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-[#0B1B33] dark:text-[#EAF0F8] tracking-[-0.03em] leading-snug">
                  Privacy guarantees enforced by database rules.{' '}
                  <span className="text-[#5C6778] dark:text-[#9FB2CC] font-normal">
                    Not an interface disguise, backed by Cloud Firestore security invariants.
                  </span>
                </h2>
              </div>
            </div>

            <Link
              href="/privacy"
              className="btn-secondary !h-9 !px-3.5 !text-xs whitespace-nowrap self-start md:self-end"
            >
              <span>Read Full Privacy Notice</span>
              <ChevronRight size={13} className="chevron-nudge" />
            </Link>
          </div>

          <PrivacyGrid />
        </section>

        {/* ========================================================================= */}
        {/* SECTION 05: STATS ROW */}
        {/* ========================================================================= */}
        <section className="pt-8 border-t border-[#E8E6E1] dark:border-[#1F3F6E]">
          <StatsRow />
        </section>

        {/* ========================================================================= */}
        {/* SECTION 06: WELLBEING COMPANION */}
        {/* ========================================================================= */}
        <section id="wellbeing" className="space-y-8 pt-8 border-t border-[#E8E6E1] dark:border-[#1F3F6E]">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="flex items-start gap-3 max-w-3xl">
              <span className="heading-tick" aria-hidden="true" />
              <div>
                <span className="text-xs font-sans uppercase tracking-wider text-[#1D6F9F] dark:text-[#4AA3D6] font-semibold block mb-1">
                  Guided Support
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-[#0B1B33] dark:text-[#EAF0F8] tracking-[-0.03em] leading-snug">
                  Private wellbeing support and crisis safety.{' '}
                  <span className="text-[#5C6778] dark:text-[#9FB2CC] font-normal">
                    Human and AI assistance channels that protect employee dignity.
                  </span>
                </h2>
              </div>
            </div>

            <button
              type="button"
              onClick={() => openAuthModal('demo')}
              className="btn-secondary !h-9 !px-3.5 !text-xs whitespace-nowrap self-start md:self-end"
            >
              <span>Explore AI Companion</span>
              <ChevronRight size={13} className="chevron-nudge" />
            </button>
          </div>

          <WellbeingCompanionPreview />
        </section>

        {/* ========================================================================= */}
        {/* SECTION 07: FAQ ACCORDION */}
        {/* ========================================================================= */}
        <section id="faq" className="space-y-8 pt-8 border-t border-[#E8E6E1] dark:border-[#1F3F6E]">
          <div className="flex items-start gap-3 max-w-3xl">
            <span className="heading-tick" aria-hidden="true" />
            <div>
              <span className="text-xs font-sans uppercase tracking-wider text-[#1D6F9F] dark:text-[#4AA3D6] font-semibold block mb-1">
                Frequently Asked Questions
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-[#0B1B33] dark:text-[#EAF0F8] tracking-[-0.03em] leading-snug">
                Clear answers to architectural and privacy questions.{' '}
                <span className="text-[#5C6778] dark:text-[#9FB2CC] font-normal">
                  Everything you need to verify enterprise compliance.
                </span>
              </h2>
            </div>
          </div>

          <FaqAccordion />
        </section>

        {/* ========================================================================= */}
        {/* SECTION 08: CLOSING CALL TO ACTION */}
        {/* ========================================================================= */}
        <section className="p-8 sm:p-14 rounded-panel bg-[#F8F7F4] dark:bg-[#071936] border border-[#E8E6E1] dark:border-[#1F3F6E] text-center space-y-6">
          <div className="max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-[#2E8EBF]/15 text-[#1D6F9F] dark:text-[#4AA3D6] font-semibold uppercase">
              <span>Ready for Exploration</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-serif font-semibold text-[#0B1B33] dark:text-[#EAF0F8] tracking-[-0.03em] leading-tight">
              Experience how anonymous wellbeing diagnostics transform engineering retention.{' '}
              <span className="text-[#5C6778] dark:text-[#9FB2CC] font-normal">
                Explore 12 realistic corporate datasets in our sandbox.
              </span>
            </h2>
            <p className="text-sm font-sans text-[#5C6778] dark:text-[#9FB2CC] max-w-xl mx-auto leading-relaxed">
              No account creation or credit card required. Test individual, managerial, and executive workflows with pre-seeded sample data.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => openAuthModal('demo')}
              className="btn-primary"
            >
              <Sparkles size={14} className="text-[#2E8EBF] dark:text-[#03173B]" />
              <span>Try the demo</span>
              <ChevronRight size={15} className="chevron-nudge" />
            </button>

            <button
              type="button"
              onClick={() => openAuthModal('signin')}
              className="btn-secondary"
            >
              <span>Sign in to workspace</span>
            </button>
          </div>
        </section>

      </div>
    </div>
  );
}
