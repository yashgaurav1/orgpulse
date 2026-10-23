'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Users,
  ShieldCheck,
  TrendingUp,
  Lock,
  Sparkles,
  AlertTriangle,
  ArrowRight,
  Download,
  CheckCircle2,
  HeartHandshake,
  MessageSquare,
} from 'lucide-react';
import { UserRole } from '@/lib/auth-context';

export function RoleSwitcherPreview() {
  const [selectedRole, setSelectedRole] = useState<UserRole>('employee');

  const roles = [
    { id: 'employee' as UserRole, label: 'Employee', desc: 'Anonymous voice, private support & 24/7 AI companion' },
    { id: 'manager' as UserRole, label: 'Delivery Manager', desc: 'Squad friction signals, 14-day action plans, N < 5 shield' },
    { id: 'hrbp' as UserRole, label: 'Lead HRBP', desc: 'Org diagnostic scorecard, support inbox, role approvals' },
    { id: 'senior_leadership' as UserRole, label: 'Senior Leadership', desc: 'Company trends, driver analytics, non-league tables' },
  ];

  return (
    <div className="space-y-6">
      {/* Role Picker Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
        {roles.map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => setSelectedRole(r.id)}
            className={`p-3 text-left rounded-panel border transition-all ${
              selectedRole === r.id
                ? 'bg-theme-surface border-accent shadow-xs'
                : 'bg-theme-raised/60 border-theme-subtle hover:border-theme-border'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className={`text-xs font-sans font-semibold ${selectedRole === r.id ? 'text-accent' : 'text-theme-primary'}`}>
                {r.label}
              </span>
              {selectedRole === r.id && (
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              )}
            </div>
            <p className="text-[11px] text-theme-secondary font-sans leading-snug line-clamp-2">
              {r.desc}
            </p>
          </button>
        ))}
      </div>

      {/* Live Interactive Preview Box */}
      <div className="p-6 rounded-panel bg-theme-surface border hairline-border shadow-xs min-h-[380px] flex flex-col justify-between">
        <div className="flex items-center justify-between pb-3 border-b border-theme-subtle text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="text-accent font-semibold uppercase">Live Role Surface</span>
            <span className="text-theme-tertiary">/</span>
            <span className="text-theme-secondary capitalize">{selectedRole.replace('_', ' ')} Experience</span>
          </div>
          <span className="px-2 py-0.5 rounded-control bg-accent/10 border border-accent/20 text-accent text-[10px] uppercase font-bold">
            Sample Data
          </span>
        </div>

        <div className="py-4 flex-1 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {/* 1. EMPLOYEE SURFACE */}
            {selectedRole === 'employee' && (
              <motion.div
                key="employee-preview"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Micro-Survey Card */}
                  <div className="p-4 bg-theme-raised border hairline-border rounded-control space-y-3">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-accent font-semibold">Anonymous Pulse (Cycle Q1)</span>
                      <span className="text-theme-tertiary">Question 4 of 6</span>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full h-1 bg-theme-subtle rounded-full overflow-hidden">
                      <div className="w-2/3 h-full bg-accent rounded-full" />
                    </div>
                    <p className="text-xs font-sans text-theme-primary font-medium">
                      &ldquo;If I encounter an engineering roadblock or burnout strain, I can raise it without fear of negative consequences.&rdquo;
                    </p>
                    <div className="flex items-center justify-between gap-1 text-[11px] font-mono">
                      {[1, 2, 3, 4, 5].map((val) => (
                        <div
                          key={val}
                          className={`w-7 h-7 rounded-control flex items-center justify-center border text-xs ${
                            val === 4
                              ? 'bg-accent text-white font-bold border-accent shadow-xs'
                              : 'bg-theme-surface border-theme-border text-theme-secondary'
                          }`}
                        >
                          {val}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Private Support Request & Companion */}
                  <div className="space-y-3">
                    <div className="p-3.5 bg-theme-raised border hairline-border rounded-control space-y-1.5 text-xs font-mono">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-theme-primary flex items-center gap-1.5">
                          <HeartHandshake size={14} className="text-accent" />
                          <span>Confidential Support Request #2041</span>
                        </span>
                        <span className="px-1.5 py-0.5 rounded-xs bg-success/10 text-success text-[10px]">
                          Assigned to HRBP
                        </span>
                      </div>
                      <p className="text-[11px] text-theme-secondary font-sans">
                        Type: Workload Concern • Priority: High • <em>Private from your delivery manager.</em>
                      </p>
                    </div>

                    <div className="p-3.5 bg-accent/5 border border-accent/20 rounded-control space-y-1 text-xs">
                      <div className="flex items-center gap-2 font-mono text-accent font-semibold text-[11px]">
                        <MessageSquare size={13} />
                        <span>Aarav (Wellbeing Companion)</span>
                      </div>
                      <p className="text-[11px] text-theme-primary font-sans italic">
                        &ldquo;I hear you are carrying a lot this sprint. Would you like to do a 2-minute breath reset, or prepare speaking points for your 1:1?&rdquo;
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 2. MANAGER SURFACE */}
            {selectedRole === 'manager' && (
              <motion.div
                key="manager-preview"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  {/* Scores breakdown (7 cols) */}
                  <div className="md:col-span-7 p-4 bg-theme-raised border hairline-border rounded-control space-y-2.5">
                    <div className="flex items-center justify-between text-xs font-mono pb-1 border-b border-theme-subtle">
                      <span className="font-semibold text-theme-primary">Squad 03 Telemetry</span>
                      <span className="text-theme-tertiary">N=8 (Threshold Met)</span>
                    </div>
                    {[
                      { label: 'Work Purpose', val: 4.1, pct: '82%', color: 'bg-accent' },
                      { label: 'Psychological Safety', val: 3.8, pct: '76%', color: 'bg-accent' },
                      { label: 'Workload Sustainability', val: 2.85, pct: '57%', color: 'bg-warning', flag: true },
                      { label: 'Team Connection', val: 3.9, pct: '78%', color: 'bg-accent' },
                    ].map((item, idx) => (
                      <div key={idx} className="space-y-1 text-xs font-mono">
                        <div className="flex justify-between items-center text-[11px]">
                          <span className={item.flag ? 'text-warning font-semibold' : 'text-theme-secondary'}>
                            {item.label} {item.flag && '(!)'}
                          </span>
                          <span className="text-theme-primary font-bold tabular-nums">{item.val.toFixed(2)}</span>
                        </div>
                        <div className="w-full h-1.5 bg-theme-subtle rounded-full overflow-hidden">
                          <div className={`h-full ${item.color} rounded-full`} style={{ width: item.pct }} />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Flag & 14-day action (5 cols) */}
                  <div className="md:col-span-5 space-y-3">
                    <div className="p-3 bg-warning/10 border border-warning/30 rounded-control space-y-1 text-xs">
                      <div className="flex items-center gap-1.5 text-warning font-mono font-semibold text-[11px]">
                        <AlertTriangle size={13} />
                        <span>Workload Flag (Q5 = 2.85 &lt; 3.00)</span>
                      </div>
                      <p className="text-[11px] text-theme-secondary font-sans leading-relaxed">
                        Playbook: Audit sprint story points. Renegotiate release deadline with product partner; do not demand overtime.
                      </p>
                    </div>

                    <div className="p-3 bg-theme-raised border hairline-border rounded-control space-y-1 text-xs font-mono">
                      <span className="text-theme-tertiary text-[10px] uppercase font-semibold">14-Day Action Logged</span>
                      <p className="text-[11px] text-theme-primary font-sans">
                        &ldquo;Removed Friday evening releases; capped sprint velocity to 32 points.&rdquo;
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 3. HRBP SURFACE */}
            {selectedRole === 'hrbp' && (
              <motion.div
                key="hrbp-preview"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="space-y-3 font-mono text-xs"
              >
                <div className="flex items-center justify-between pb-1">
                  <span className="text-theme-secondary font-semibold">Multi-Squad Scorecard (Alphabetical Order)</span>
                  <div className="flex items-center gap-1.5 text-[11px] px-2 py-0.5 rounded-control bg-theme-raised border hairline-border text-theme-primary">
                    <Download size={11} />
                    <span>Export Safe CSV (N &ge; 5)</span>
                  </div>
                </div>

                <div className="divide-y divide-theme-subtle border hairline-border rounded-control overflow-hidden bg-theme-raised">
                  <div className="p-2.5 flex items-center justify-between text-theme-primary">
                    <span className="font-semibold">Squad 01 (Payments & Ledger)</span>
                    <span className="text-success font-semibold">Score: 4.22 • N=12</span>
                  </div>
                  <div className="p-2.5 flex items-center justify-between text-theme-primary">
                    <span className="font-semibold">Squad 03 (Order Fulfillment)</span>
                    <span className="text-warning font-semibold">Score: 3.12 • Workload Flag</span>
                  </div>
                  <div className="p-2.5 flex items-center justify-between bg-accent/5 text-theme-tertiary">
                    <span className="flex items-center gap-1.5">
                      <Lock size={12} className="text-accent" />
                      <span>Squad 05 (Analytics & Big Data)</span>
                    </span>
                    <span className="text-[11px] text-accent">Suppressed (N=3 &lt; 5) • Section 18 Shield</span>
                  </div>
                </div>

                <div className="p-3 bg-theme-raised border hairline-border rounded-control flex items-center justify-between">
                  <div className="text-[11px] font-sans text-theme-secondary">
                    Pending Role Approvals: <strong>2 requests</strong> (1 Manager, 1 HRBP)
                  </div>
                  <span className="text-accent text-[11px] font-mono hover:underline cursor-pointer">
                    Review Queue →
                  </span>
                </div>
              </motion.div>
            )}

            {/* 4. SENIOR LEADERSHIP SURFACE */}
            {selectedRole === 'senior_leadership' && (
              <motion.div
                key="leadership-preview"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 bg-theme-raised border hairline-border rounded-control space-y-1 font-mono">
                    <span className="text-[10px] text-theme-tertiary uppercase">Org Wellbeing Index</span>
                    <div className="text-2xl font-bold text-theme-primary">4.02 <span className="text-xs text-success font-normal">+0.14</span></div>
                    <span className="text-[10px] text-theme-secondary">10 Squads Monitored</span>
                  </div>
                  <div className="p-3.5 bg-theme-raised border hairline-border rounded-control space-y-1 font-mono">
                    <span className="text-[10px] text-theme-tertiary uppercase">14-Day Action Compliance</span>
                    <div className="text-2xl font-bold text-accent">91.6%</div>
                    <span className="text-[10px] text-theme-secondary">11 of 12 Squads Committed</span>
                  </div>
                  <div className="p-3.5 bg-theme-raised border hairline-border rounded-control space-y-1 font-mono">
                    <span className="text-[10px] text-theme-tertiary uppercase">Support Requests Volume</span>
                    <div className="text-2xl font-bold text-theme-primary">14 <span className="text-xs text-theme-tertiary font-normal">(Counts only)</span></div>
                    <span className="text-[10px] text-theme-secondary">Zero individual data exposed</span>
                  </div>
                </div>

                <div className="p-3 bg-theme-raised border hairline-border rounded-control flex items-center justify-between text-xs font-mono">
                  <span className="text-theme-secondary">
                    No league tables or manager stack-ranking. Group roll-ups only.
                  </span>
                  <button className="text-accent hover:underline flex items-center gap-1">
                    <span>Print Executive Summary</span>
                    <ArrowRight size={12} />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Disclaimer */}
        <div className="pt-3 border-t border-theme-subtle flex items-center justify-between text-[11px] font-mono text-theme-tertiary">
          <span>Non-evaluative psychological safety telemetry.</span>
          <span>Never used for appraisals, promotion, or pay.</span>
        </div>
      </div>
    </div>
  );
}
