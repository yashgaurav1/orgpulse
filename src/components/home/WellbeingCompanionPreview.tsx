'use client';

import React from 'react';
import { Bot, Lock, ShieldCheck, ArrowRight, HeartHandshake, PhoneCall } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export function WellbeingCompanionPreview() {
  const { openAuthModal } = useAuth();

  return (
    <div className="p-8 sm:p-10 rounded-panel bg-[#F8F7F4] dark:bg-[#071936] border border-[#E8E6E1] dark:border-[#1F3F6E] space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-[#2E8EBF]/15 text-[#1D6F9F] dark:text-[#4AA3D6] uppercase tracking-wider">
          Confidential AI Companion
        </span>
        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-[#1F7A4F]/15 text-[#1F7A4F] dark:text-[#2DBE78] uppercase tracking-wider flex items-center gap-1">
          <Lock size={11} /> 100% Private
        </span>
        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-black/5 dark:bg-white/10 text-[#5C6778] dark:text-[#9FB2CC] uppercase tracking-wider">
          Never Visible to Employer
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 space-y-4">
          <h3 className="text-xl sm:text-2xl font-serif font-semibold text-[#0B1B33] dark:text-[#EAF0F8] tracking-[-0.02em]">
            Immediate grounding, reflection prompts, and verified crisis interception
          </h3>
          <p className="text-sm text-[#5C6778] dark:text-[#9FB2CC] font-sans leading-relaxed">
            The companion provides confidential grounding techniques, structured reflection exercises, and work-life balance advice. It does not evaluate job performance or offer medical diagnoses. All conversations exist only on the employee’s local device and can be wiped instantly with one click.
          </p>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => openAuthModal('demo')}
              className="btn-primary !h-10 !px-4 !text-xs"
            >
              <span>Try Companion in Demo</span>
              <ArrowRight size={13} className="chevron-nudge" />
            </button>
          </div>
        </div>

        {/* Right UI Fragment: Pill-shaped input preview */}
        <div className="lg:col-span-5 space-y-3">
          <div className="p-5 rounded-control bg-white dark:bg-[#0A2347] border border-[#E8E6E1] dark:border-[#1F3F6E] shadow-soft space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-[#E8E6E1] dark:border-[#1F3F6E]">
              <div className="w-7 h-7 rounded-full bg-[#2E8EBF]/15 text-[#1D6F9F] dark:text-[#4AA3D6] flex items-center justify-center">
                <Bot size={15} />
              </div>
              <div>
                <span className="text-xs font-semibold text-[#0B1B33] dark:text-[#EAF0F8] block">
                  Pulse Companion &bull; Safe Reflection
                </span>
                <span className="text-[10px] font-mono text-[#5C6778] dark:text-[#9FB2CC]">Local Session Only</span>
              </div>
            </div>

            <div className="p-3 rounded-control bg-[#F8F7F4] dark:bg-[#11305C] text-xs text-[#0B1B33] dark:text-[#EAF0F8] leading-relaxed">
              &ldquo;I’m here to help you unpack workday fatigue or sprint pressure. What would you like to reflect on today?&rdquo;
            </div>

            {/* Pill-shaped input fragment */}
            <div
              onClick={() => openAuthModal('demo')}
              className="w-full h-11 px-4 rounded-full bg-[#F8F7F4] dark:bg-[#071936] border border-[#E8E6E1] dark:border-[#1F3F6E] flex items-center justify-between text-xs text-[#5C6778] dark:text-[#9FB2CC] cursor-pointer hover:border-[#2E8EBF] transition-colors"
            >
              <span>Talk to the companion... (Click to test demo)</span>
              <Bot size={15} className="text-[#1D6F9F] dark:text-[#4AA3D6]" />
            </div>

            {/* Crisis Interception Safety Notice */}
            <div className="pt-1 flex items-center justify-between text-[11px] font-mono text-[#5C6778] dark:text-[#9FB2CC]">
              <span className="flex items-center gap-1">
                <PhoneCall size={11} className="text-[#C01313] dark:text-[#FF7A7A]" />
                Tele-MANAS Crisis Helpline:
              </span>
              <span className="font-bold text-[#1D6F9F] dark:text-[#4AA3D6]">14416 (24/7 Free)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
