'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CompanionChat } from '@/components/employee/CompanionChat';
import { SupportRequestModal } from '@/components/employee/SupportRequestModal';
import { useAuth } from '@/lib/auth-context';
import {
  MessageSquare,
  ShieldCheck,
  ClipboardCheck,
  Wind,
  Heart,
  Sparkles,
  BookOpen,
  ArrowRight,
  ExternalLink,
  Lock,
  PhoneCall,
  CheckCircle2,
  Calendar,
  Layers,
  Smile,
  Zap,
  Moon,
  BatteryCharging,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function EmployeeParamsHandler({
  onParams,
}: {
  onParams: (tab: string | null, botId: string | null) => void;
}) {
  const searchParams = useSearchParams();

  useEffect(() => {
    onParams(searchParams.get('tab'), searchParams.get('botId'));
  }, [searchParams, onParams]);

  return null;
}

export default function EmployeeWorkspacePage() {
  const router = useRouter();
  const { profile, isDemo } = useAuth();

  const [activeTab, setActiveTab] = useState<'overview' | 'chat' | 'breathing' | 'checkin'>('overview');
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [selectedBotId, setSelectedBotId] = useState('bot-manas');

  const handleParams = useCallback((tabParam: string | null, botParam: string | null) => {
    if (tabParam === 'chat' || tabParam === 'overview' || tabParam === 'breathing' || tabParam === 'checkin') {
      setActiveTab(tabParam);
    }
    if (botParam) {
      setSelectedBotId(botParam);
    }
  }, []);

  // Interactive Breathing State
  const [breathingPhase, setBreathingPhase] = useState<'Inhale (4s)' | 'Hold (7s)' | 'Exhale (8s)'>('Inhale (4s)');
  const [isBreathingActive, setIsBreathingActive] = useState(false);

  // Quick Check-in state
  const [checkinRatings, setCheckinRatings] = useState({
    mood: 4,
    stress: 2,
    sleep: 3,
    energy: 4,
  });
  const [checkinSaved, setCheckinSaved] = useState(false);

  const startBreathingExercise = () => {
    setIsBreathingActive(true);
    let step = 0;
    const interval = setInterval(() => {
      step = (step + 1) % 3;
      if (step === 0) setBreathingPhase('Inhale (4s)');
      else if (step === 1) setBreathingPhase('Hold (7s)');
      else setBreathingPhase('Exhale (8s)');
    }, 4500);

    return () => clearInterval(interval);
  };

  const handleSaveCheckin = () => {
    setCheckinSaved(true);
    setTimeout(() => setCheckinSaved(false), 3000);
  };

  return (
    <div className="max-w-[1200px] mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      <Suspense fallback={null}>
        <EmployeeParamsHandler onParams={handleParams} />
      </Suspense>

      {/* Header Banner */}
        <div className="p-6 bg-theme-raised border hairline-border rounded-panel space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-control bg-success/10 border border-success/20 text-success font-mono text-[10px] uppercase font-semibold">
                <Lock size={11} />
                <span>Confidential Employee Sanctuary</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-semibold text-theme-primary tracking-[-0.02em]">
                Your Wellbeing & Support Workspace
              </h1>
              <p className="text-xs sm:text-sm text-theme-secondary font-sans max-w-2xl">
                A private space to reflect, speak with an AI companion, complete confidential pulse surveys, and connect securely with dedicated HR support without manager visibility.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsSupportModalOpen(true)}
                className="px-3.5 py-2 bg-theme-surface hover:bg-theme-raised border hairline-border text-theme-primary text-xs font-mono rounded-control transition-colors focus-ring flex items-center gap-2"
              >
                <ShieldCheck size={14} className="text-accent" />
                <span>Confidential Support</span>
              </button>
              <button
                onClick={() => router.push('/survey/demo-token-payments')}
                className="px-4 py-2 bg-accent hover:bg-accent-hover text-white text-xs font-mono font-medium rounded-control transition-colors shadow-xs flex items-center gap-2 focus-ring"
              >
                <ClipboardCheck size={14} />
                <span>Take Pulse Survey</span>
              </button>
            </div>
          </div>

          {/* Privacy Notice Disclaimer */}
          <div className="pt-2 border-t border-theme-subtle flex flex-wrap items-center justify-between text-[11px] font-mono text-theme-tertiary">
            <div>
              Privacy notice shown before the survey. Legal review required before real use.
            </div>
            <div className="text-success font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-live-dot" />
              <span>N ≥ 5 Guaranteed Anonymity Shield</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-theme-subtle bg-theme-surface px-4 rounded-panel border hairline-border">
          {[
            { id: 'overview', label: 'Dashboard & Library', icon: BookOpen },
            { id: 'chat', label: '24/7 Companion Chat', icon: MessageSquare },
            { id: 'breathing', label: '4-7-8 Breathing Pacer', icon: Wind },
            { id: 'checkin', label: 'Daily Self Check-in', icon: Heart },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-3 px-4 text-xs font-mono border-b-2 transition-all ${
                  isActive
                    ? 'border-accent text-accent font-semibold'
                    : 'border-transparent text-theme-secondary hover:text-theme-primary'
                }`}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Contents */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* 3 Core Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Card 1: Confidential Survey */}
              <div className="p-5 bg-theme-surface border hairline-border rounded-panel flex flex-col justify-between space-y-4 hover:border-theme-border transition-colors">
                <div className="space-y-2.5">
                  <div className="w-9 h-9 rounded-control bg-accent/10 border border-accent/20 text-accent flex items-center justify-center">
                    <ClipboardCheck size={18} />
                  </div>
                  <h3 className="text-sm font-semibold text-theme-primary">
                    Q1 2026 Pulse Survey
                  </h3>
                  <p className="text-xs text-theme-secondary font-sans leading-relaxed">
                    6 key workplace dimensions (Purpose, Autonomy, Recognition, Safety, Workload, Long-term Health). Takes under 4 minutes.
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-theme-subtle">
                  <div className="flex items-center justify-between text-[11px] font-mono text-theme-tertiary">
                    <span>Est. Time: ~3 mins</span>
                    <span className="text-success">Zero PII Logged</span>
                  </div>
                  <button
                    onClick={() => router.push('/survey/demo-token-payments')}
                    className="w-full h-9 bg-theme-raised hover:bg-theme-surface border hairline-border text-theme-primary rounded-control text-xs font-mono transition-colors flex items-center justify-center gap-1.5 focus-ring"
                  >
                    <span>Start Anonymous Survey</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>

              {/* Card 2: 24/7 Companion */}
              <div className="p-5 bg-theme-surface border hairline-border rounded-panel flex flex-col justify-between space-y-4 hover:border-theme-border transition-colors">
                <div className="space-y-2.5">
                  <div className="w-9 h-9 rounded-control bg-accent/10 border border-accent/20 text-accent flex items-center justify-center">
                    <Sparkles size={18} />
                  </div>
                  <h3 className="text-sm font-semibold text-theme-primary">
                    Talk with Aarav or Maya
                  </h3>
                  <p className="text-xs text-theme-secondary font-sans leading-relaxed">
                    Specialized emotional support companions trained to de-escalate anxiety, navigate tough conversations, and build sustainable boundaries.
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-theme-subtle">
                  <div className="flex items-center justify-between text-[11px] font-mono text-theme-tertiary">
                    <span>5 Personas Available</span>
                    <span className="text-accent font-semibold">100% Private</span>
                  </div>
                  <button
                    onClick={() => setActiveTab('chat')}
                    className="w-full h-9 bg-accent hover:bg-accent-hover text-white rounded-control text-xs font-mono font-medium transition-colors flex items-center justify-center gap-1.5 focus-ring shadow-xs"
                  >
                    <span>Open Companion Chat</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>

              {/* Card 3: Confidential HRBP Route */}
              <div className="p-5 bg-theme-surface border hairline-border rounded-panel flex flex-col justify-between space-y-4 hover:border-theme-border transition-colors">
                <div className="space-y-2.5">
                  <div className="w-9 h-9 rounded-control bg-accent/10 border border-accent/20 text-accent flex items-center justify-center">
                    <ShieldCheck size={18} />
                  </div>
                  <h3 className="text-sm font-semibold text-theme-primary">
                    Firewalled Support
                  </h3>
                  <p className="text-xs text-theme-secondary font-sans leading-relaxed">
                    Submit a confidential support ticket directly to your assigned HR Business Partner. Firewalled from delivery managers and execs.
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-theme-subtle">
                  <div className="flex items-center justify-between text-[11px] font-mono text-theme-tertiary">
                    <span>Pseudonym Option</span>
                    <span className="text-success">Manager Blocked</span>
                  </div>
                  <button
                    onClick={() => setIsSupportModalOpen(true)}
                    className="w-full h-9 bg-theme-raised hover:bg-theme-surface border hairline-border text-theme-primary rounded-control text-xs font-mono transition-colors flex items-center justify-center gap-1.5 focus-ring"
                  >
                    <span>Request Confidential Help</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            </div>

            {/* Self-Help Guides & Library */}
            <div className="p-6 bg-theme-surface border hairline-border rounded-panel space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-theme-primary">
                    Self-Help & Psychological Safety Toolkits
                  </h3>
                  <p className="text-xs text-theme-secondary font-sans">
                    Practical, grounded guides to support your workday pacing and boundaries.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div
                  onClick={() => router.push('/library/stay-interview')}
                  className="p-3.5 bg-theme-raised hover:bg-theme-surface border hairline-border rounded-control cursor-pointer transition-colors space-y-1.5"
                >
                  <div className="font-semibold text-theme-primary">Stay Interview Framework</div>
                  <p className="text-theme-secondary font-sans line-clamp-2">
                    How psychological safety conversations are structured between you and leadership.
                  </p>
                  <span className="text-[10px] font-mono text-accent flex items-center gap-1 pt-1">
                    <span>Read Toolkit</span> →
                  </span>
                </div>

                <div
                  onClick={() => router.push('/library/conduct-guide')}
                  className="p-3.5 bg-theme-raised hover:bg-theme-surface border hairline-border rounded-control cursor-pointer transition-colors space-y-1.5"
                >
                  <div className="font-semibold text-theme-primary">Conduct & Non-Retaliation Policy</div>
                  <p className="text-theme-secondary font-sans line-clamp-2">
                    Formal company commitment guaranteeing protection for honest survey feedback.
                  </p>
                  <span className="text-[10px] font-mono text-accent flex items-center gap-1 pt-1">
                    <span>View Policy</span> →
                  </span>
                </div>

                <div
                  onClick={() => router.push('/dashboard/companion')}
                  className="p-3.5 bg-theme-raised hover:bg-theme-surface border hairline-border rounded-control cursor-pointer transition-colors space-y-1.5"
                >
                  <div className="font-semibold text-theme-primary">Companion Bot Catalog</div>
                  <p className="text-theme-secondary font-sans line-clamp-2">
                    Explore all 6 specialized wellbeing personas (including MANAS / Tele-MANAS coach), audio previews, and grounding techniques.
                  </p>
                  <span className="text-[10px] font-mono text-accent flex items-center gap-1 pt-1">
                    <span>Explore Bots</span> →
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Companion Chat */}
        {activeTab === 'chat' && (
          <CompanionChat
            initialBotId={selectedBotId}
            onOpenSupportModal={() => setIsSupportModalOpen(true)}
          />
        )}

        {/* Tab 3: Interactive 4-7-8 Breathing Pacer */}
        {activeTab === 'breathing' && (
          <div className="p-8 bg-theme-surface border hairline-border rounded-panel flex flex-col items-center justify-center text-center space-y-6">
            <div className="max-w-md space-y-2">
              <h2 className="text-lg font-semibold text-theme-primary">
                4-7-8 Somatic Relaxation Breath
              </h2>
              <p className="text-xs text-theme-secondary font-sans">
                Inhale quietly through your nose for 4 seconds, hold your breath for 7 seconds, and exhale completely through your mouth for 8 seconds.
              </p>
            </div>

            {/* Animated Pacer Visual */}
            <div className="relative w-64 h-64 flex items-center justify-center">
              <motion.div
                animate={{
                  scale: isBreathingActive
                    ? breathingPhase === 'Inhale (4s)'
                      ? 1.4
                      : breathingPhase === 'Hold (7s)'
                      ? 1.4
                      : 0.8
                    : 1,
                  opacity: isBreathingActive ? 0.9 : 0.6,
                }}
                transition={{
                  duration: breathingPhase === 'Inhale (4s)' ? 4 : breathingPhase === 'Hold (7s)' ? 7 : 8,
                  ease: 'easeInOut',
                }}
                className="w-44 h-44 rounded-full bg-accent/20 border-2 border-accent flex items-center justify-center shadow-lg"
              >
                <div className="text-center">
                  <Wind size={28} className="mx-auto text-accent mb-1" />
                  <div className="text-xs font-mono font-bold text-theme-primary">
                    {breathingPhase}
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="flex gap-3">
              {!isBreathingActive ? (
                <button
                  onClick={startBreathingExercise}
                  className="px-6 py-2.5 bg-accent hover:bg-accent-hover text-white text-xs font-mono font-medium rounded-control transition-colors shadow-xs focus-ring"
                >
                  Start Guided Breathing Cycle
                </button>
              ) : (
                <button
                  onClick={() => setIsBreathingActive(false)}
                  className="px-6 py-2.5 bg-theme-raised hover:bg-theme-surface border hairline-border text-theme-primary text-xs font-mono rounded-control transition-colors focus-ring"
                >
                  Pause Session
                </button>
              )}
            </div>
          </div>
        )}

        {/* Tab 4: Daily Self Check-in */}
        {activeTab === 'checkin' && (
          <div className="p-6 bg-theme-surface border hairline-border rounded-panel space-y-6 max-w-xl mx-auto">
            <div className="space-y-1">
              <h2 className="text-base font-semibold text-theme-primary">
                Daily Confidential Check-In
              </h2>
              <p className="text-xs text-theme-secondary font-sans">
                Track your personal energy, stress, and sleep patterns. Completely private to you.
              </p>
            </div>

            <div className="space-y-4 text-xs font-mono">
              {/* Mood */}
              <div className="p-3.5 bg-theme-raised border hairline-border rounded-control space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Smile size={15} className="text-accent" />
                    <span>General Mood Today</span>
                  </div>
                  <span className="font-bold text-theme-primary">{checkinRatings.mood} / 5</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={checkinRatings.mood}
                  onChange={(e) =>
                    setCheckinRatings({ ...checkinRatings, mood: parseInt(e.target.value) })
                  }
                  className="w-full accent-accent cursor-pointer"
                />
              </div>

              {/* Stress */}
              <div className="p-3.5 bg-theme-raised border hairline-border rounded-control space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap size={15} className="text-warning" />
                    <span>Workplace Friction & Stress</span>
                  </div>
                  <span className="font-bold text-theme-primary">{checkinRatings.stress} / 5</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={checkinRatings.stress}
                  onChange={(e) =>
                    setCheckinRatings({ ...checkinRatings, stress: parseInt(e.target.value) })
                  }
                  className="w-full accent-accent cursor-pointer"
                />
              </div>

              {/* Sleep */}
              <div className="p-3.5 bg-theme-raised border hairline-border rounded-control space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Moon size={15} className="text-accent" />
                    <span>Sleep Quality & Recovery</span>
                  </div>
                  <span className="font-bold text-theme-primary">{checkinRatings.sleep} / 5</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={checkinRatings.sleep}
                  onChange={(e) =>
                    setCheckinRatings({ ...checkinRatings, sleep: parseInt(e.target.value) })
                  }
                  className="w-full accent-accent cursor-pointer"
                />
              </div>

              {/* Energy */}
              <div className="p-3.5 bg-theme-raised border hairline-border rounded-control space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BatteryCharging size={15} className="text-success" />
                    <span>Sustained Energy Level</span>
                  </div>
                  <span className="font-bold text-theme-primary">{checkinRatings.energy} / 5</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={checkinRatings.energy}
                  onChange={(e) =>
                    setCheckinRatings({ ...checkinRatings, energy: parseInt(e.target.value) })
                  }
                  className="w-full accent-accent cursor-pointer"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              {checkinSaved ? (
                <span className="text-xs font-mono text-success flex items-center gap-1.5">
                  <CheckCircle2 size={13} />
                  <span>Check-in saved locally to your device!</span>
                </span>
              ) : (
                <span className="text-[11px] font-mono text-theme-tertiary">
                  Stored exclusively in browser local storage.
                </span>
              )}

              <button
                onClick={handleSaveCheckin}
                className="px-5 py-2 bg-accent hover:bg-accent-hover text-white text-xs font-mono font-medium rounded-control transition-colors shadow-xs focus-ring"
              >
                Save Daily Check-in
              </button>
            </div>
          </div>
        )}

        {/* Support Request Modal */}
        <SupportRequestModal
          isOpen={isSupportModalOpen}
          onClose={() => setIsSupportModalOpen(false)}
        />
      </div>
  );
}
