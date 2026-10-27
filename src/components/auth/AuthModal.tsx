'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth, UserRole } from '@/lib/auth-context';
import { ENTERPRISE_SQUADS } from '@/lib/enterprise-data';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { INITIAL_DATABASE_USERS } from '@/lib/db-auth';
import {
  X,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User as UserIcon,
  Building,
  KeyRound,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
} from 'lucide-react';

interface AuthModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const {
    isAuthModalOpen,
    authModalTab,
    openAuthModal,
    closeAuthModal,
    signIn,
    signUp,
    signInWithGoogle,
    sendPasswordReset,
    enterDemo,
  } = useAuth();

  const open = isOpen !== undefined ? isOpen : isAuthModalOpen;
  const handleClose = onClose || closeAuthModal;

  const [activeTab, setActiveTab] = useState<'signin' | 'register' | 'demo'>(authModalTab);

  // Sync tab with context
  useEffect(() => {
    setActiveTab(authModalTab);
  }, [authModalTab]);

  // Sign In Form State
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [signInError, setSignInError] = useState<string | null>(null);
  const [forgotPasswordSent, setForgotPasswordSent] = useState(false);

  // Register Form State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [companyMode, setCompanyMode] = useState<'create' | 'join'>('create');
  const [companyNameOrCode, setCompanyNameOrCode] = useState('');
  const [requestedRole, setRequestedRole] = useState<UserRole>('employee');
  const [isRegistering, setIsRegistering] = useState(false);
  const [regError, setRegError] = useState<string | null>(null);
  const [regSuccess, setRegSuccess] = useState(false);

  // Demo Form State (12 datasets)
  const [demoRole, setDemoRole] = useState<UserRole>('employee');
  const [demoSquadId, setDemoSquadId] = useState('squad-01');

  // Password strength calculation
  const getPasswordStrength = (pass: string) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score; // 0-4
  };

  const passwordStrength = getPasswordStrength(regPassword);

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, handleClose]);

  if (!open) return null;

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignInError(null);
    setIsSigningIn(true);
    const res = await signIn(signInEmail, signInPassword);
    setIsSigningIn(false);
    if (!res.success) {
      setSignInError(res.error || 'Authentication failed. Please verify credentials.');
    }
  };

  const handleForgotPassword = async () => {
    if (!signInEmail) {
      setSignInError('Please enter your work email to receive password reset link.');
      return;
    }
    setSignInError(null);
    const res = await sendPasswordReset(signInEmail);
    if (res.success) {
      setForgotPasswordSent(true);
    } else {
      setSignInError(res.error || 'Failed to send reset email.');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);
    if (passwordStrength < 2) {
      setRegError('Please choose a stronger password (at least 8 chars, numbers, uppercase).');
      return;
    }
    setIsRegistering(true);
    const res = await signUp({
      name: regName,
      email: regEmail,
      pass: regPassword,
      companyMode,
      companyNameOrCode,
      requestedRole,
    });
    setIsRegistering(false);
    if (res.success) {
      setRegSuccess(true);
    } else {
      setRegError(res.error || 'Registration failed.');
    }
  };

  const handleEnterDemoSubmit = () => {
    enterDemo(demoRole, demoSquadId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs transition-opacity duration-200">
      {/* Click outside backdrop */}
      <div className="absolute inset-0" onClick={handleClose} />

      {/* Modal / Bottom Sheet Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        className="relative w-full max-w-lg bg-theme-surface border-t sm:border hairline-border rounded-t-[20px] sm:rounded-panel shadow-floating overflow-hidden z-10 transition-all max-h-[92vh] flex flex-col"
      >
        {/* Mobile Drag Handle */}
        <div className="sm:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-theme-subtle rounded-full" />
        </div>

        {/* Modal Brand Header Strip & Close */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-[#03173B] text-white border-b border-[#0D2550]">
          <div className="flex items-center gap-3">
            <img
              src="/brand/horizontal.svg"
              alt="Pulse"
              className="h-6 w-auto object-contain"
            />
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 text-[#9FB2CC] hover:text-white rounded-control transition-colors focus-ring"
            aria-label="Close modal"
          >
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>

        {/* Segmented Control with Shared Sliding Thumb Component */}
        <div className="px-6 pt-4 pb-2">
          <SegmentedControl
            items={[
              { id: 'signin', label: 'Sign In' },
              { id: 'register', label: 'Register' },
              { id: 'demo', label: 'Try Demo', icon: Sparkles },
            ]}
            activeId={activeTab}
            onChange={(id) => openAuthModal(id as any)}
            fullWidth
            size="md"
            aria-label="Authentication modes"
          />
        </div>

        {/* Tab Content with Smooth Transitions */}
        <div className="px-6 pt-3 pb-5 overflow-y-auto flex-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <AnimatePresence mode="wait">
            {/* 1. SIGN IN TAB */}
            {activeTab === 'signin' && (
              <motion.div
                key="signin"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div>
                  <h2 id="auth-modal-title" className="text-lg font-semibold text-theme-primary tracking-[-0.02em]">
                    Sign in to Haven
                  </h2>
                  <p className="text-xs text-theme-secondary font-sans mt-0.5">
                    Access your confidential wellbeing workspace or organizational analytics.
                  </p>
                </div>

                {signInError && (
                  <div className="p-3 bg-danger/10 border border-danger/30 rounded-control text-xs text-danger font-sans flex items-start gap-2">
                    <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />
                    <span>{signInError}</span>
                  </div>
                )}

                {forgotPasswordSent && (
                  <div className="p-3 bg-success/10 border border-success/30 rounded-control text-xs text-success font-sans flex items-start gap-2">
                    <CheckCircle2 size={15} className="flex-shrink-0 mt-0.5" />
                    <span>Password reset email dispatched. Please check your inbox.</span>
                  </div>
                )}

                {/* Database Account Quick-Fill Chips */}
                <div className="p-2.5 bg-theme-raised border hairline-border rounded-control space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] font-mono text-theme-tertiary">
                    <span>Database Quick Fill:</span>
                    <span className="text-success">5 Verified Accounts</span>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-1 text-[11px] font-mono">
                    <button
                      type="button"
                      onClick={() => {
                        setSignInEmail('employee@pulse.io');
                        setSignInPassword('Password123!');
                      }}
                      className="px-2 py-1 rounded-control bg-theme-surface hover:border-accent border hairline-border text-center text-theme-secondary hover:text-theme-primary transition-colors"
                    >
                      Employee
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSignInEmail('manager@pulse.io');
                        setSignInPassword('Password123!');
                      }}
                      className="px-2 py-1 rounded-control bg-theme-surface hover:border-accent border hairline-border text-center text-theme-secondary hover:text-theme-primary transition-colors"
                    >
                      Manager
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSignInEmail('hr@pulse.io');
                        setSignInPassword('Password123!');
                      }}
                      className="px-2 py-1 rounded-control bg-theme-surface hover:border-accent border hairline-border text-center text-theme-secondary hover:text-theme-primary transition-colors"
                    >
                      HRBP
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSignInEmail('leadership@pulse.io');
                        setSignInPassword('Password123!');
                      }}
                      className="px-2 py-1 rounded-control bg-theme-surface hover:border-accent border hairline-border text-center text-theme-secondary hover:text-theme-primary transition-colors"
                    >
                      Director
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSignInEmail('admin@pulse.io');
                        setSignInPassword('Password123!');
                      }}
                      className="px-2 py-1 rounded-control bg-theme-surface hover:border-accent border hairline-border text-center text-theme-secondary hover:text-theme-primary transition-colors"
                    >
                      Admin
                    </button>
                  </div>
                </div>

                <form onSubmit={handleSignInSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-mono text-theme-tertiary uppercase tracking-wider mb-1">
                      Work Email
                    </label>
                    <div className="relative">
                      <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-theme-tertiary" />
                      <input
                        type="email"
                        required
                        value={signInEmail}
                        onChange={(e) => setSignInEmail(e.target.value)}
                        placeholder="you@company.com"
                        className="w-full h-10 pl-9 pr-3 bg-theme-raised border hairline-border rounded-control text-xs text-theme-primary placeholder:text-theme-tertiary font-sans focus-ring"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-mono text-theme-tertiary uppercase tracking-wider">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={handleForgotPassword}
                        className="text-[11px] font-mono text-accent hover:underline"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-theme-tertiary" />
                      <input
                        type={showSignInPassword ? 'text' : 'password'}
                        required
                        value={signInPassword}
                        onChange={(e) => setSignInPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full h-10 pl-9 pr-9 bg-theme-raised border hairline-border rounded-control text-xs text-theme-primary placeholder:text-theme-tertiary font-mono focus-ring"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSignInPassword(!showSignInPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-theme-tertiary hover:text-theme-primary"
                      >
                        {showSignInPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-sans text-theme-secondary">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="accent-accent h-4 w-4 rounded-xs"
                      />
                      <span>Remember this browser</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isSigningIn}
                    className="w-full h-10 bg-accent hover:bg-accent-hover text-white rounded-control text-xs font-mono font-medium transition-colors focus-ring flex items-center justify-center gap-2 shadow-xs"
                  >
                    {isSigningIn ? 'Authenticating...' : 'Sign In with Password'}
                  </button>
                </form>

                <div className="relative py-2 flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-theme-subtle" />
                  </div>
                  <span className="relative px-3 bg-theme-surface text-[11px] font-mono text-theme-tertiary uppercase">
                    or
                  </span>
                </div>

                <button
                  type="button"
                  onClick={signInWithGoogle}
                  className="w-full h-10 bg-theme-raised hover:bg-theme-surface border hairline-border rounded-control text-xs font-mono text-theme-primary transition-colors focus-ring flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </button>
              </motion.div>
            )}

            {/* 2. REGISTER TAB */}
            {activeTab === 'register' && (
              <motion.div
                key="register"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div>
                  <h2 className="text-lg font-semibold text-theme-primary tracking-[-0.02em]">
                    Create your Haven Account
                  </h2>
                  <p className="text-xs text-theme-secondary font-sans mt-0.5">
                    Start a new company workspace or join with an existing team code.
                  </p>
                </div>

                {regError && (
                  <div className="p-3 bg-danger/10 border border-danger/30 rounded-control text-xs text-danger font-sans flex items-start gap-2">
                    <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />
                    <span>{regError}</span>
                  </div>
                )}

                {regSuccess ? (
                  <div className="p-4 bg-success/10 border border-success/30 rounded-control space-y-2 text-xs font-sans text-theme-primary">
                    <div className="flex items-center gap-2 text-success font-semibold">
                      <CheckCircle2 size={16} />
                      <span>Registration Complete</span>
                    </div>
                    <p className="text-theme-secondary">
                      Verification link dispatched to <strong>{regEmail}</strong>. Elevated roles (Manager, HRBP, Leadership) remain in pending status until approved by your corporate admin.
                    </p>
                    <button
                      type="button"
                      onClick={() => openAuthModal('signin')}
                      className="px-3 py-1.5 bg-accent text-white rounded-control font-mono text-xs mt-2"
                    >
                      Proceed to Sign In
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleRegisterSubmit} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-mono text-theme-tertiary uppercase tracking-wider mb-1">
                          Full Name
                        </label>
                        <div className="relative">
                          <UserIcon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-theme-tertiary" />
                          <input
                            type="text"
                            required
                            value={regName}
                            onChange={(e) => setRegName(e.target.value)}
                            placeholder="Ananya Sharma"
                            className="w-full h-10 pl-9 pr-3 bg-theme-raised border hairline-border rounded-control text-xs text-theme-primary font-sans focus-ring"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-theme-tertiary uppercase tracking-wider mb-1">
                          Work Email
                        </label>
                        <div className="relative">
                          <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-theme-tertiary" />
                          <input
                            type="email"
                            required
                            value={regEmail}
                            onChange={(e) => setRegEmail(e.target.value)}
                            placeholder="ananya@enterprise.com"
                            className="w-full h-10 pl-9 pr-3 bg-theme-raised border hairline-border rounded-control text-xs text-theme-primary font-sans focus-ring"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-theme-tertiary uppercase tracking-wider mb-1">
                        Password
                      </label>
                      <div className="relative">
                        <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-theme-tertiary" />
                        <input
                          type={showRegPassword ? 'text' : 'password'}
                          required
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          placeholder="Min 8 characters"
                          className="w-full h-10 pl-9 pr-9 bg-theme-raised border hairline-border rounded-control text-xs text-theme-primary font-mono focus-ring"
                        />
                        <button
                          type="button"
                          onClick={() => setShowRegPassword(!showRegPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-theme-tertiary hover:text-theme-primary"
                        >
                          {showRegPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>

                      {/* Password strength meter */}
                      <div className="flex items-center gap-1.5 mt-1.5">
                        {[1, 2, 3, 4].map((step) => (
                          <div
                            key={step}
                            className={`h-1 flex-1 rounded-full transition-colors ${
                              step <= passwordStrength
                                ? passwordStrength <= 2
                                  ? 'bg-warning'
                                  : 'bg-success'
                                : 'bg-theme-subtle'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Company Setup / Join Mode */}
                    <div className="p-3 bg-theme-raised border hairline-border rounded-control space-y-2.5">
                      <div className="flex items-center gap-4 text-xs font-mono">
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="radio"
                            name="companyMode"
                            checked={companyMode === 'create'}
                            onChange={() => setCompanyMode('create')}
                            className="accent-accent"
                          />
                          <span>Create Company (Admin)</span>
                        </label>
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="radio"
                            name="companyMode"
                            checked={companyMode === 'join'}
                            onChange={() => setCompanyMode('join')}
                            className="accent-accent"
                          />
                          <span>Join with Code</span>
                        </label>
                      </div>

                      <div>
                        <div className="relative">
                          {companyMode === 'create' ? (
                            <>
                              <Building size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-theme-tertiary" />
                              <input
                                type="text"
                                required
                                value={companyNameOrCode}
                                onChange={(e) => setCompanyNameOrCode(e.target.value)}
                                placeholder="Company Legal Name (e.g. Acme Corp)"
                                className="w-full h-9 pl-9 pr-3 bg-theme-surface border hairline-border rounded-control text-xs text-theme-primary font-sans focus-ring"
                              />
                            </>
                          ) : (
                            <>
                              <KeyRound size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-theme-tertiary" />
                              <input
                                type="text"
                                required
                                value={companyNameOrCode}
                                onChange={(e) => setCompanyNameOrCode(e.target.value.toUpperCase())}
                                placeholder="PULSE-XXXX-XXXX (Company Code)"
                                className="w-full h-9 pl-9 pr-3 bg-theme-surface border hairline-border rounded-control text-xs text-theme-primary font-mono uppercase focus-ring"
                              />
                            </>
                          )}
                        </div>
                      </div>

                      {companyMode === 'join' && (
                        <div>
                          <label className="block text-[11px] font-mono text-theme-tertiary uppercase mb-1">
                            Requested Role (Requires Admin Approval)
                          </label>
                          <select
                            value={requestedRole}
                            onChange={(e) => setRequestedRole(e.target.value as UserRole)}
                            className="w-full h-9 px-2.5 bg-theme-surface border hairline-border rounded-control text-xs font-mono text-theme-primary focus-ring"
                          >
                            <option value="employee">Employee (Default verified access)</option>
                            <option value="manager">Delivery Manager (Requires approval)</option>
                            <option value="hrbp">HR Business Partner (Requires approval)</option>
                            <option value="senior_leadership">Senior Leadership (Requires approval)</option>
                          </select>
                        </div>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isRegistering}
                      className="w-full h-10 bg-accent hover:bg-accent-hover text-white rounded-control text-xs font-mono font-medium transition-colors focus-ring flex items-center justify-center gap-2 shadow-xs"
                    >
                      {isRegistering ? 'Registering...' : 'Complete Registration'}
                    </button>
                  </form>
                )}
              </motion.div>
            )}

            {/* 3. DEMO TAB (12 Datasets One-Click Entry) */}
            {activeTab === 'demo' && (
              <motion.div
                key="demo"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-3.5 pt-1"
              >
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-control bg-accent/10 border border-accent/20 text-accent font-sans text-[11px] font-medium mb-1.5">
                    <Sparkles size={11} />
                    <span>Instant Local Sandbox • Zero Writes</span>
                  </div>
                  <h2 className="text-lg font-semibold text-theme-primary tracking-[-0.02em]">
                    Interactive Demo Sandbox
                  </h2>
                  <p className="text-xs text-theme-secondary font-sans mt-0.5">
                    Explore Pulse with 12 seeded corporate scenarios across all organizational roles.
                  </p>
                </div>

                <div className="space-y-2.5">
                  {/* Role Chooser */}
                  <div>
                    <label className="block text-xs font-sans text-theme-tertiary uppercase tracking-wider mb-1">
                      1. Select Role Perspective
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-sans">
                      {[
                        { id: 'employee', label: 'Employee' },
                        { id: 'manager', label: 'Manager' },
                        { id: 'hrbp', label: 'HRBP' },
                        { id: 'senior_leadership', label: 'Leadership' },
                      ].map((r) => (
                        <button
                          key={r.id}
                          type="button"
                          onClick={() => setDemoRole(r.id as UserRole)}
                          className={`py-2 px-2.5 rounded-control border text-center transition-all ${
                            demoRole === r.id
                              ? 'bg-accent/10 border-accent text-accent font-semibold shadow-xs'
                              : 'bg-theme-raised border-theme-border text-theme-secondary hover:text-theme-primary'
                          }`}
                        >
                          {r.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 12 Datasets Chooser */}
                  <div>
                    <label className="block text-xs font-sans text-theme-tertiary uppercase tracking-wider mb-1">
                      2. Select Corporate Scenario (12 Available)
                    </label>
                    <select
                      value={demoSquadId}
                      onChange={(e) => setDemoSquadId(e.target.value)}
                      className="w-full h-10 px-3 bg-theme-raised border hairline-border rounded-control text-xs font-mono text-theme-primary focus-ring cursor-pointer"
                    >
                      {ENTERPRISE_SQUADS.map((s) => (
                        <option key={s.id} value={s.id} className="bg-theme-surface text-theme-primary">
                          {s.name} • {s.businessUnit} {s.cycles['cycle-2026-q1'].respondents < 5 ? '(N < 5 Shield Demo)' : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Selected Scenario Preview */}
                  {(() => {
                    const activeSquad = ENTERPRISE_SQUADS.find((s) => s.id === demoSquadId) || ENTERPRISE_SQUADS[0];
                    const cycle = activeSquad.cycles['cycle-2026-q1'];
                    return (
                      <div className="p-3 bg-theme-raised/60 border hairline-border rounded-control text-xs space-y-1">
                        <div className="flex items-center justify-between font-mono">
                          <span className="text-theme-primary font-semibold">{activeSquad.name}</span>
                          <span
                            className={`text-[10px] px-1.5 py-0.5 rounded-xs uppercase font-mono ${
                              cycle.riskLevel === 'Low'
                                ? 'bg-success/10 text-success'
                                : cycle.riskLevel === 'Moderate'
                                ? 'bg-warning/10 text-warning'
                                : 'bg-danger/10 text-danger'
                            }`}
                          >
                            Risk: {cycle.riskLevel}
                          </span>
                        </div>
                        <p className="text-[11px] text-theme-secondary font-sans leading-relaxed">
                          {activeSquad.description}
                        </p>
                        <div className="pt-1 flex items-center justify-between text-[10px] font-mono text-theme-tertiary">
                          <span>Respondents: {cycle.respondents} / {cycle.headcount}</span>
                          {cycle.respondents < 5 && (
                            <span className="text-accent font-semibold">Section 18 Shield Triggered</span>
                          )}
                        </div>
                      </div>
                    );
                  })()}

                  <button
                    type="button"
                    onClick={handleEnterDemoSubmit}
                    className="w-full h-10 bg-accent hover:bg-accent-hover text-white rounded-control text-xs font-mono font-medium transition-colors focus-ring flex items-center justify-center gap-2 shadow-xs"
                  >
                    <span>Enter Demo Environment</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Modal Footer Note */}
        <div className="px-6 py-2.5 bg-theme-raised/50 border-t border-theme-subtle flex items-center justify-between text-[11px] font-mono text-theme-tertiary">
          <span>Privacy notice shown before the survey.</span>
          <span>Legal review required before real use.</span>
        </div>
      </div>
    </div>
  );
}
