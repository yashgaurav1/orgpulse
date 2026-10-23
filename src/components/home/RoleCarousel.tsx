'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Heart, Users, FileSpreadsheet, Shield, ArrowRight, Lock, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export function RoleCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { openAuthModal } = useAuth();

  const slides = [
    {
      id: 'employee',
      roleTitle: 'Employee Sanctuary',
      roleBadge: 'Individual Contributor',
      headline: 'A private space for honest reflection without fear of appraisal blowback',
      description:
        'Employees complete lightweight quarterly check-ins using single-use cryptographic links. Responses contain zero corporate emails, IP addresses, or user IDs. Personal mood logs and AI companion chats remain strictly on the employee’s local device.',
      demoRole: 'employee',
      icon: Heart,
      fragment: (
        <div className="p-4 rounded-control bg-white dark:bg-[#0A2347] border border-[#E8E6E1] dark:border-[#1F3F6E] space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between text-[11px] text-[#5C6778] dark:text-[#9FB2CC]">
            <span>Personal Check-In</span>
            <span className="text-[#1F7A4F] dark:text-[#2DBE78] font-bold flex items-center gap-1">
              <Lock size={11} /> 100% Private
            </span>
          </div>
          <div className="p-2.5 rounded-control bg-[#F8F7F4] dark:bg-[#11305C] border border-[#E8E6E1] dark:border-[#1F3F6E] space-y-1">
            <span className="text-[10px] text-[#1D6F9F] dark:text-[#4AA3D6] uppercase font-bold block">
              Recent Reflection
            </span>
            <p className="text-xs font-sans text-[#0B1B33] dark:text-[#EAF0F8]">
              &ldquo;Sprint tempo felt sustainable, but on-call interruptions during sleep hours caused fatigue.&rdquo;
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'manager',
      roleTitle: 'Manager Dashboard',
      roleBadge: 'Delivery Lead / Manager',
      headline: 'Process health diagnostics paired directly with 14-day action commitments',
      description:
        'Managers see aggregated team signals across six core wellbeing dimensions. If fewer than 5 members respond, results are mathematically suppressed. Instead of defending scores, managers commit to one tangible operational improvement every quarter.',
      demoRole: 'manager',
      icon: Users,
      fragment: (
        <div className="p-4 rounded-control bg-white dark:bg-[#0A2347] border border-[#E8E6E1] dark:border-[#1F3F6E] space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-[#0B1B33] dark:text-[#EAF0F8] font-semibold">Delivery Squad Telemetry</span>
            <span className="text-[#1F7A4F] dark:text-[#2DBE78] font-bold">12 / 12 Responded</span>
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between text-[10px] text-[#5C6778] dark:text-[#9FB2CC]">
              <span>Team Psychological Safety</span>
              <span className="font-bold tabular-nums">4.40 / 5.0</span>
            </div>
            <div className="w-full h-1.5 bg-black/10 dark:bg-black/30 rounded-full overflow-hidden">
              <div className="w-[88%] h-full bg-[#2E8EBF] rounded-full" />
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'hrbp',
      roleTitle: 'HRBP Operations & Triage',
      roleBadge: 'People Partner',
      headline: 'Cross-functional triage and confidential assistance pathways',
      description:
        'People partners monitor department distribution curves, identify systemic friction points across squads, and receive confidential assistance requests from engineers without managerial visibility.',
      demoRole: 'hrbp',
      icon: FileSpreadsheet,
      fragment: (
        <div className="p-4 rounded-control bg-white dark:bg-[#0A2347] border border-[#E8E6E1] dark:border-[#1F3F6E] space-y-2.5 font-mono text-xs">
          <div className="flex items-center justify-between text-[11px] text-[#5C6778] dark:text-[#9FB2CC]">
            <span>Active Triage Pipeline</span>
            <span className="text-[#1D6F9F] dark:text-[#4AA3D6] font-bold">3 Engineering Units</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="p-2 rounded-control bg-[#F8F7F4] dark:bg-[#11305C] border border-[#E8E6E1] dark:border-[#1F3F6E]">
              <span className="text-[#5C6778] dark:text-[#9FB2CC] block text-[10px]">Follow-through Rate</span>
              <span className="font-bold text-[#1F7A4F] dark:text-[#2DBE78] text-sm tabular-nums">92%</span>
            </div>
            <div className="p-2 rounded-control bg-[#F8F7F4] dark:bg-[#11305C] border border-[#E8E6E1] dark:border-[#1F3F6E]">
              <span className="text-[#5C6778] dark:text-[#9FB2CC] block text-[10px]">Confidential Inquiries</span>
              <span className="font-bold text-[#1D6F9F] dark:text-[#4AA3D6] text-sm tabular-nums">2 Active</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'leadership',
      roleTitle: 'Leadership Scorecard',
      roleBadge: 'VP / Executive',
      headline: 'Organization-wide health indicators free of perverse gamification',
      description:
        'Executives monitor macro operational wellbeing trends across the organization. Stack-ranking, individual tracking, and punitive metrics are excluded by design to preserve psychological safety and truthful reporting.',
      demoRole: 'director',
      icon: Shield,
      fragment: (
        <div className="p-4 rounded-control bg-white dark:bg-[#0A2347] border border-[#E8E6E1] dark:border-[#1F3F6E] space-y-2.5 font-mono text-xs">
          <div className="flex items-center justify-between text-[11px] text-[#5C6778] dark:text-[#9FB2CC]">
            <span>Quarterly Scorecard</span>
            <span className="text-[#1F7A4F] dark:text-[#2DBE78] font-bold">Q3 Benchmark</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
            <div className="p-1.5 rounded-control bg-[#F8F7F4] dark:bg-[#11305C]">
              <span className="text-[10px] text-[#5C6778] dark:text-[#9FB2CC] block">Org Score</span>
              <span className="font-bold text-sm tabular-nums text-[#0B1B33] dark:text-[#EAF0F8]">4.18</span>
            </div>
            <div className="p-1.5 rounded-control bg-[#F8F7F4] dark:bg-[#11305C]">
              <span className="text-[10px] text-[#5C6778] dark:text-[#9FB2CC] block">Response</span>
              <span className="font-bold text-sm tabular-nums text-[#1F7A4F] dark:text-[#2DBE78]">94%</span>
            </div>
            <div className="p-1.5 rounded-control bg-[#F8F7F4] dark:bg-[#11305C]">
              <span className="text-[10px] text-[#5C6778] dark:text-[#9FB2CC] block">Compliance</span>
              <span className="font-bold text-sm tabular-nums text-[#1D6F9F] dark:text-[#4AA3D6]">100%</span>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const slide = slides[currentSlide];
  const Icon = slide.icon;

  return (
    <div className="space-y-4">
      {/* Carousel Container */}
      <div className="relative overflow-hidden rounded-panel bg-[#F8F7F4] dark:bg-[#071936] border border-[#E8E6E1] dark:border-[#1F3F6E] p-6 sm:p-10 transition-colors">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Description Column */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-[#2E8EBF]/15 text-[#1D6F9F] dark:text-[#4AA3D6] uppercase tracking-wider">
                {slide.roleBadge}
              </span>
              <span className="text-xs font-mono text-[#5C6778] dark:text-[#9FB2CC]">
                Slide {currentSlide + 1} of {slides.length}
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-serif font-semibold text-[#0B1B33] dark:text-[#EAF0F8] tracking-[-0.02em]">
              {slide.roleTitle}: {slide.headline}
            </h3>

            <p className="text-sm font-sans text-[#5C6778] dark:text-[#9FB2CC] leading-relaxed">
              {slide.description}
            </p>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => openAuthModal('demo')}
                className="btn-primary !h-10 !px-4 !text-xs inline-flex items-center gap-2"
              >
                <span>Launch {slide.roleTitle} in Demo</span>
                <ArrowRight size={13} className="chevron-nudge" />
              </button>
            </div>
          </div>

          {/* Right UI Fragment Column */}
          <div className="lg:col-span-5 space-y-4">
            {slide.fragment}
          </div>
        </div>

        {/* Carousel Navigation Buttons (No autoplay) */}
        <div className="flex items-center justify-between pt-6 mt-6 border-t border-[#E8E6E1] dark:border-[#1F3F6E]">
          <div className="flex items-center gap-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === currentSlide
                    ? 'w-6 bg-[#2E8EBF]'
                    : 'w-2 bg-[#E8E6E1] dark:bg-[#1F3F6E] hover:bg-[#5C6778]'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={prevSlide}
              className="p-2 rounded-control bg-white dark:bg-[#0A2347] border border-[#E8E6E1] dark:border-[#1F3F6E] text-[#0B1B33] dark:text-white hover:bg-[#F8F7F4] dark:hover:bg-[#11305C] transition-colors focus-ring"
              aria-label="Previous slide"
              title="Previous slide"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              onClick={nextSlide}
              className="p-2 rounded-control bg-white dark:bg-[#0A2347] border border-[#E8E6E1] dark:border-[#1F3F6E] text-[#0B1B33] dark:text-white hover:bg-[#F8F7F4] dark:hover:bg-[#11305C] transition-colors focus-ring"
              aria-label="Next slide"
              title="Next slide"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
