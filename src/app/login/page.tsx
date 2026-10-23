'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Lock,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  Layers,
  Key,
  AlertCircle,
  Sparkles,
  UserCheck,
  Briefcase,
  Users,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { StatusBadge } from '@/components/enterprise/StatusBadge';
import { CopyId } from '@/components/enterprise/CopyId';
import { useAuth, UserRole } from '@/lib/auth-context';
import { INITIAL_DATABASE_USERS } from '@/lib/db-auth';

export default function LoginPage() {
  const router = useRouter();
  const { signIn, openAuthModal } = useAuth();
  const [email, setEmail] = useState('employee@pulse.io');
  const [password, setPassword] = useState('Password123!');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successRole, setSuccessRole] = useState<string | null>(null);

  const handleSignIn = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const res = await signIn(email, password);
      if (!res.success) {
        setErrorMessage(res.error || 'Authentication failed. Please verify credentials.');
        setIsLoading(false);
      } else {
        setSuccessRole('Authenticated');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred during sign in.');
      setIsLoading(false);
    }
  };

  const handleQuickFill = async (userEmail: string, roleLabel: string, autoSubmit: boolean = false) => {
    setEmail(userEmail);
    setPassword('Password123!');
    setErrorMessage(null);

    if (autoSubmit) {
      setIsLoading(true);
      const res = await signIn(userEmail, 'Password123!');
      if (!res.success) {
        setErrorMessage(res.error || 'Authentication failed.');
        setIsLoading(false);
      } else {
        setSuccessRole(roleLabel);
      }
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-theme-bg text-theme-primary">
      {/* Left Column: Restrained product-focused panel with dotted grid */}
      <div className="flex-1 relative hidden lg:flex flex-col justify-between p-12 bg-theme-surface border-r hairline-border overflow-hidden">
        {/* Subtle Dotted Grid Background */}
        <div
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle, var(--border) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />

        {/* Brand and Badge */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-control bg-accent flex items-center justify-center text-white font-mono font-bold text-sm shadow-sm">
              P
            </div>
            <span className="font-mono text-sm font-semibold tracking-[-0.02em] text-theme-primary">
              Pulse Enterprise
            </span>
          </div>

          <StatusBadge label="Operational Health Diagnostic" variant="accent" />
        </div>

        {/* One Hero Moment: Slow reveal of live dashboard preview */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.2, 0, 0, 1] }}
          className="relative z-10 my-auto max-w-lg w-full space-y-4"
        >
          {/* Live-looking Dashboard Fragment */}
          <div className="p-5 rounded-panel bg-theme-raised border hairline-border shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-theme-subtle">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-semibold text-theme-primary">
                  Squad A: Engineering Core
                </span>
                <StatusBadge label="Baseline Healthy" variant="success" live />
              </div>
              <CopyId id="sq-eng-01" prefix="SQUAD:" />
            </div>

            {/* KPI grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-theme-surface border hairline-border rounded-control space-y-1">
                <div className="text-[11px] font-mono uppercase tracking-[0.04em] text-theme-tertiary">
                  Engagement
                </div>
                <div className="text-xl font-bold font-mono text-theme-primary">
                  4.12 <span className="text-xs text-success font-normal">+0.28</span>
                </div>
                <div className="text-[10px] text-theme-tertiary font-mono">
                  Org Benchmark: 3.85
                </div>
              </div>

              <div className="p-3 bg-theme-surface border hairline-border rounded-control space-y-1">
                <div className="text-[11px] font-mono uppercase tracking-[0.04em] text-theme-tertiary">
                  Participation
                </div>
                <div className="text-xl font-bold font-mono text-theme-primary">
                  92% <span className="text-xs text-theme-secondary font-normal">(N=14)</span>
                </div>
                <div className="text-[10px] text-success font-mono">
                  N &ge; 5 Threshold Met
                </div>
              </div>
            </div>

            {/* 14-day Action Commitment Preview */}
            <div className="p-3 bg-theme-surface border hairline-border rounded-control flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-accent" />
                <span className="text-theme-secondary">14-Day Action:</span>
                <span className="text-theme-primary font-medium">On-call handoff overhaul</span>
              </div>
              <span className="text-[11px] text-theme-tertiary">Committed</span>
            </div>
          </div>

          <div className="text-xs font-mono text-theme-tertiary flex items-center gap-4">
            <span>Section 18 Mathematical Anonymity</span>
            <span>•</span>
            <span>Zero Token Joins</span>
          </div>
        </motion.div>

        {/* Trust elements footer on left panel */}
        <div className="relative z-10 flex items-center justify-between text-xs font-mono text-theme-tertiary pt-6 border-t border-theme-subtle">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-success animate-live-dot" />
            <a
              href="#"
              className="hover:text-theme-primary transition-colors flex items-center gap-1"
            >
              <span>System: All services operational</span>
              <ExternalLink size={11} />
            </a>
          </div>
          <span>SOC 2 Type II Certified</span>
        </div>
      </div>

      {/* Right Column: Clean Form and Database Credentials */}
      <div className="flex-1 flex flex-col justify-between p-6 sm:p-12 max-w-xl mx-auto w-full overflow-y-auto">
        {/* Header link */}
        <div className="flex items-center justify-between text-xs font-mono text-theme-tertiary">
          <button
            onClick={() => router.push('/')}
            className="hover:text-theme-primary transition-colors"
          >
            &larr; Back to Overview
          </button>
          <span>v2.4.0-enterprise</span>
        </div>

        {/* Login Form Container */}
        <div className="my-auto py-6 space-y-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-control bg-accent/10 border border-accent/20 text-accent font-mono text-[10px] uppercase font-semibold">
              <ShieldCheck size={11} />
              <span>Database Authentication Active</span>
            </div>
            <h1 className="text-2xl font-semibold tracking-[-0.02em] text-theme-primary">
              Sign in to Pulse Enterprise
            </h1>
            <p className="text-xs text-theme-secondary font-sans leading-relaxed">
              Authenticate with your verified database account or choose a pre-seeded enterprise role.
            </p>
          </div>

          {/* Quick Database Role Fill Chips */}
          <div className="p-3.5 bg-theme-surface border hairline-border rounded-panel space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-[0.04em] text-theme-tertiary">
                One-Click Database Logins (Click to Sign In):
              </span>
              <span className="text-[10px] font-mono text-success">Pre-seeded &amp; Verified</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => handleQuickFill('employee@pulse.io', 'Employee', true)}
                className="px-2.5 py-1.5 rounded-control bg-theme-raised hover:bg-theme-border border hairline-border text-left transition-colors focus-ring"
              >
                <div className="text-[11px] font-mono font-medium text-theme-primary">Employee</div>
                <div className="text-[9px] font-mono text-theme-tertiary truncate">Ananya Sharma</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('manager@pulse.io', 'Manager', true)}
                className="px-2.5 py-1.5 rounded-control bg-theme-raised hover:bg-theme-border border hairline-border text-left transition-colors focus-ring"
              >
                <div className="text-[11px] font-mono font-medium text-theme-primary">Manager</div>
                <div className="text-[9px] font-mono text-theme-tertiary truncate">Rajesh Nair</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('hr@pulse.io', 'HRBP', true)}
                className="px-2.5 py-1.5 rounded-control bg-theme-raised hover:bg-theme-border border hairline-border text-left transition-colors focus-ring"
              >
                <div className="text-[11px] font-mono font-medium text-theme-primary">HRBP</div>
                <div className="text-[9px] font-mono text-theme-tertiary truncate">Kavita Menon</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('leadership@pulse.io', 'Director', true)}
                className="px-2.5 py-1.5 rounded-control bg-theme-raised hover:bg-theme-border border hairline-border text-left transition-colors focus-ring"
              >
                <div className="text-[11px] font-mono font-medium text-theme-primary">Director</div>
                <div className="text-[9px] font-mono text-theme-tertiary truncate">Vikramaditya Rao</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('admin@pulse.io', 'Admin', true)}
                className="px-2.5 py-1.5 rounded-control bg-theme-raised hover:bg-theme-border border hairline-border text-left transition-colors focus-ring col-span-2 sm:col-span-1"
              >
                <div className="text-[11px] font-mono font-medium text-theme-primary">Admin</div>
                <div className="text-[9px] font-mono text-theme-tertiary truncate">Siddharth Varma</div>
              </button>
            </div>
          </div>

          {/* Error Message Alert */}
          {errorMessage && (
            <div className="p-3 bg-danger/10 border border-danger/30 rounded-control text-xs text-danger font-sans flex items-start gap-2">
              <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Success Banner */}
          {successRole && (
            <div className="p-3 bg-success/10 border border-success/30 rounded-control text-xs text-success font-sans flex items-start gap-2">
              <CheckCircle2 size={15} className="flex-shrink-0 mt-0.5" />
              <span>Authenticated as {successRole}. Entering workspace...</span>
            </div>
          )}

          {/* Direct credentials form */}
          <form onSubmit={handleSignIn} className="space-y-3.5">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-[0.04em] text-theme-tertiary mb-1">
                Database Corporate Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="employee@pulse.io"
                className="w-full h-10 px-3 bg-theme-raised border hairline-border rounded-control text-xs text-theme-primary placeholder-theme-tertiary focus-ring font-sans"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-mono uppercase tracking-[0.04em] text-theme-tertiary">
                  Password (Default: Password123!)
                </label>
                <button
                  type="button"
                  onClick={() => openAuthModal('signin')}
                  className="text-[11px] font-mono text-accent hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full h-10 px-3 bg-theme-raised border hairline-border rounded-control text-xs text-theme-primary placeholder-theme-tertiary focus-ring font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-10 mt-2 flex items-center justify-center gap-2 bg-accent hover:bg-accent-hover disabled:opacity-50 text-white text-xs font-mono font-medium rounded-control transition-colors focus-ring shadow-sm"
            >
              <span>{isLoading ? 'Verifying with Database...' : 'Sign In with Database Credentials'}</span>
              <ArrowRight size={14} strokeWidth={1.5} />
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-theme-subtle" />
            </div>
            <span className="relative px-3 bg-theme-bg text-[10px] font-mono uppercase tracking-[0.04em] text-theme-tertiary">
              Need a new organization workspace?
            </span>
          </div>

          <button
            type="button"
            onClick={() => openAuthModal('register')}
            className="w-full h-9 px-4 flex items-center justify-center gap-2 bg-theme-surface hover:bg-theme-raised border hairline-border rounded-control text-xs font-mono text-theme-secondary hover:text-theme-primary transition-colors focus-ring"
          >
            <span>Register New Company or Team Workspace</span>
          </button>
        </div>

        {/* Footer Security Note */}
        <div className="pt-6 border-t border-theme-subtle text-[11px] font-mono text-theme-tertiary flex items-center justify-between">
          <span>End-to-End Encrypted Session</span>
          <span>Zero individual telemetry tracking</span>
        </div>
      </div>
    </div>
  );
}
