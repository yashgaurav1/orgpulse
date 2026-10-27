'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { ShieldCheck, HelpCircle, ArrowUpRight, ChevronRight } from 'lucide-react';

export function LandingFooter() {
  const { openAuthModal } = useAuth();
  const [hideFaqPill, setHideFaqPill] = useState(false);

  useEffect(() => {
    const faqEl = document.getElementById('faq');
    const footerEl = document.querySelector('footer');

    if (!faqEl && !footerEl) return;

    let faqIntersecting = false;
    let footerIntersecting = false;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === faqEl) {
            faqIntersecting = entry.isIntersecting;
          }
          if (entry.target === footerEl) {
            footerIntersecting = entry.isIntersecting;
          }
        });
        setHideFaqPill(faqIntersecting || footerIntersecting);
      },
      { threshold: 0.05 }
    );

    if (faqEl) observer.observe(faqEl);
    if (footerEl) observer.observe(footerEl);

    return () => observer.disconnect();
  }, []);

  const scrollToFaq = () => {
    const el = document.getElementById('faq');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <footer className="relative bg-[#03173B] text-[#9FB2CC] border-t border-[#0D2550] pt-16 pb-12 text-xs font-sans">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          {/* Top Row: Brand & Quick Demo Sandbox CTA */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-[#0D2550]">
            <div className="space-y-2">
              <Link href="/" className="inline-block" aria-label="Pulse Home">
                <img
                  src="/brand/horizontal.svg"
                  alt="Pulse"
                  className="h-7 w-auto object-contain"
                />
              </Link>
              <p className="text-[12px] text-[#6782A5] max-w-sm leading-relaxed">
                Engineering engagement and wellbeing diagnostics. Privacy is enforced at the database layer: responses from groups under 5 are automatically suppressed.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs font-medium">
              <span className="px-2.5 py-1 rounded-full bg-white/10 text-[#EAF0F8] font-mono text-[11px] border border-white/10">
                Sample data in demo
              </span>
              <button
                type="button"
                onClick={() => openAuthModal('demo')}
                className="btn-primary !h-10 !px-4 !text-xs !bg-[#2E8EBF] !text-[#03173B] hover:!bg-[#389ECE] font-semibold flex items-center gap-1.5"
              >
                <span>Launch Demo Sandbox</span>
                <ArrowUpRight size={13} />
              </button>
            </div>
          </div>

          {/* 5 Link Columns (Product, Roles, Privacy, Resources, Legal) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 text-[12px]">
            {/* 1. Product */}
            <div className="space-y-2.5">
              <div className="font-mono text-[11px] uppercase tracking-wider text-white font-semibold">
                Product
              </div>
              <ul className="space-y-2 text-[#9FB2CC]">
                <li>
                  <a href="#how-it-works" className="hover:text-white transition-colors">
                    3-Step Diagnostic
                  </a>
                </li>
                <li>
                  <a href="#problem" className="hover:text-white transition-colors">
                    The Problem Space
                  </a>
                </li>
                <li>
                  <a href="#wellbeing" className="hover:text-white transition-colors">
                    AI Companion
                  </a>
                </li>
                <li>
                  <a href="#roles" className="hover:text-white transition-colors">
                    Interactive Console
                  </a>
                </li>
              </ul>
            </div>

            {/* 2. Roles */}
            <div className="space-y-2.5">
              <div className="font-mono text-[11px] uppercase tracking-wider text-white font-semibold">
                Roles
              </div>
              <ul className="space-y-2 text-[#9FB2CC]">
                <li>
                  <a href="#roles" className="hover:text-white transition-colors">
                    Employee Sanctuary
                  </a>
                </li>
                <li>
                  <a href="#roles" className="hover:text-white transition-colors">
                    Manager Dashboard
                  </a>
                </li>
                <li>
                  <a href="#roles" className="hover:text-white transition-colors">
                    HRBP Operations
                  </a>
                </li>
                <li>
                  <a href="#roles" className="hover:text-white transition-colors">
                    Leadership Scorecard
                  </a>
                </li>
              </ul>
            </div>

            {/* 3. Privacy */}
            <div className="space-y-2.5">
              <div className="font-mono text-[11px] uppercase tracking-wider text-white font-semibold">
                Privacy
              </div>
              <ul className="space-y-2 text-[#9FB2CC]">
                <li>
                  <a href="#privacy" className="hover:text-white transition-colors">
                    Anonymity Invariants
                  </a>
                </li>
                <li>
                  <a href="#privacy-threshold" className="hover:text-white transition-colors">
                    N &ge; 5 Suppression
                  </a>
                </li>
                <li>
                  <a href="#privacy-retention" className="hover:text-white transition-colors">
                    90-Day Raw Purge
                  </a>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>

            {/* 4. Resources */}
            <div className="space-y-2.5">
              <div className="font-mono text-[11px] uppercase tracking-wider text-white font-semibold">
                Resources
              </div>
              <ul className="space-y-2 text-[#9FB2CC]">
                <li>
                  <a href="#faq" className="hover:text-white transition-colors">
                    Frequently Asked
                  </a>
                </li>
                <li>
                  <Link href="/library/conduct-guide" className="hover:text-white transition-colors">
                    Conduct Guide
                  </Link>
                </li>
                <li>
                  <Link href="/library/stay-interview" className="hover:text-white transition-colors">
                    Stay Interview Guide
                  </Link>
                </li>
                <li>
                  <Link href="/library/pilot-plan" className="hover:text-white transition-colors">
                    90-Day Pilot Plan
                  </Link>
                </li>
              </ul>
            </div>

            {/* 5. Legal & Governance */}
            <div className="space-y-2.5">
              <div className="font-mono text-[11px] uppercase tracking-wider text-white font-semibold">
                Legal
              </div>
              <ul className="space-y-2 text-[#9FB2CC]">
                <li>
                  <Link href="/terms" className="hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/dev/brand" className="hover:text-white transition-colors">
                    Brand Spec &amp; Tokens
                  </Link>
                </li>
                <li>
                  <Link href="/dev/components" className="hover:text-white transition-colors">
                    Component Catalog
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-white transition-colors">
                    About Pulse
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Legal Disclaimers & Required Notice */}
          <div className="pt-8 border-t border-[#0D2550] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-[11px] text-[#6782A5]">
            <p className="leading-relaxed">
              &copy; {new Date().getFullYear()} Pulse Diagnostics Ltd. Privacy notice shown before the survey. Legal review required before real use.
            </p>
            <div className="flex items-center gap-4 text-[#9FB2CC]">
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privacy Notice
              </Link>
              <span>&bull;</span>
              <Link href="/terms" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Pill: 'Questions? Read the FAQ' */}
      <div
        role="complementary"
        aria-label="Quick Help"
        className={`fixed bottom-5 right-5 z-40 transition-all duration-300 ${
          hideFaqPill ? 'opacity-0 pointer-events-none translate-y-2' : 'opacity-100 translate-y-0'
        }`}
      >
        <button
          type="button"
          onClick={scrollToFaq}
          className="group flex items-center gap-2 px-3.5 py-2 rounded-full bg-white dark:bg-[#0A2347] border border-[#E8E6E1] dark:border-[#1F3F6E] text-[#0B1B33] dark:text-[#EAF0F8] shadow-lg hover:border-[#2E8EBF] transition-all text-xs font-sans font-medium"
        >
          <HelpCircle size={15} className="text-[#1D6F9F] dark:text-[#4AA3D6]" />
          <span>Questions? Read the FAQ</span>
          <ChevronRight size={13} className="chevron-nudge text-[#5C6778] dark:text-[#9FB2CC] transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </>
  );
}
