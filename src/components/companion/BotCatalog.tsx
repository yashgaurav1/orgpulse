'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Filter,
  Play,
  Pause,
  Volume2,
  ShieldAlert,
  Sparkles,
  Heart,
  Activity,
  CheckCircle2,
  ArrowRight,
  X,
  Languages,
  BookOpen,
  Sliders,
  BarChart2,
  PhoneCall,
  UserCheck,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { COMPANION_BOTS, CompanionBot } from '../../lib/companion-bots-data';
import { useAuth } from '../../lib/auth-context';

export function BotCatalog() {
  const router = useRouter();
  const { profile } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('All');
  const [selectedFocus, setSelectedFocus] = useState<string>('All');
  const [activeDrawerBot, setActiveDrawerBot] = useState<CompanionBot | null>(null);
  const [drawerTab, setDrawerTab] = useState<'overview' | 'voice' | 'guardrails' | 'stats' | 'advanced'>('overview');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [selectedCompanionId, setSelectedCompanionId] = useState<string>('bot-manas');

  // Filter options
  const allLanguages = [
    'All',
    'English',
    'Hindi',
    'Tamil',
    'Telugu',
    'Kannada',
    'Bengali',
    'Marathi',
    'Gujarati',
    'Malayalam',
    'Punjabi',
  ];
  const allFocusAreas = [
    'All',
    'Tele-MANAS',
    'Burnout Prevention',
    'Workplace Dynamics',
    'Difficult Conversations',
    'On-Call Fatigue',
    'Acute Anxiety',
    'Somatic Relaxation',
  ];

  const filteredBots = COMPANION_BOTS.filter((bot) => {
    const matchesSearch =
      bot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bot.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bot.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bot.focusAreas.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesLang =
      selectedLanguage === 'All' || bot.languages.includes(selectedLanguage);

    const matchesFocus =
      selectedFocus === 'All' || bot.focusAreas.some((f) => f.includes(selectedFocus));

    return matchesSearch && matchesLang && matchesFocus;
  });

  const handleStartChat = (botId: string) => {
    setSelectedCompanionId(botId);
    router.push(`/dashboard/employee?tab=chat&botId=${botId}`);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 bg-theme-raised border hairline-border rounded-panel space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-control bg-accent/10 border border-accent/20 text-accent font-mono text-[10px] uppercase font-semibold">
              <Sparkles size={11} />
              <span>Confidential • 24/7 Available</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-semibold text-theme-primary tracking-[-0.02em]">
              Wellbeing Companion & Voice Bot Catalog
            </h1>
            <p className="text-xs sm:text-sm text-theme-secondary font-sans max-w-3xl">
              Select a specialized emotional wellness companion trained for distinct workplace situations. All conversations are private to your device and never accessible by your employer, manager, or HRBP.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleStartChat(selectedCompanionId)}
              className="px-4 py-2 bg-accent hover:bg-accent-hover text-white text-xs font-mono font-medium rounded-control transition-colors shadow-xs flex items-center gap-2 focus-ring"
            >
              <span>Launch Active Companion</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>

        {/* Crisis Notice Disclaimer */}
        <div className="flex items-center gap-2.5 px-3 py-2 bg-theme-surface border border-theme-subtle rounded-control text-[11px] font-mono text-theme-secondary">
          <PhoneCall size={13} className="text-accent flex-shrink-0" />
          <span>
            Immediate Crisis Protocol active: Toll-free 24/7 National Tele-MANAS helpline <strong className="text-theme-primary font-semibold">14416</strong> or <strong className="text-theme-primary font-semibold">1800-891-4416</strong>.
          </span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between bg-theme-surface p-3 border hairline-border rounded-panel">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-theme-tertiary" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by companion name, role, language, or focus area..."
            className="w-full h-9 pl-9 pr-3 bg-theme-raised border hairline-border rounded-control text-xs text-theme-primary placeholder:text-theme-tertiary focus-ring"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-theme-tertiary">
            <Languages size={13} />
            <span>Language:</span>
          </div>
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="h-9 px-2.5 bg-theme-raised border hairline-border rounded-control text-xs text-theme-primary focus-ring"
          >
            {allLanguages.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-1.5 text-theme-tertiary ml-2">
            <Filter size={13} />
            <span>Focus:</span>
          </div>
          <select
            value={selectedFocus}
            onChange={(e) => setSelectedFocus(e.target.value)}
            className="h-9 px-2.5 bg-theme-raised border hairline-border rounded-control text-xs text-theme-primary focus-ring"
          >
            {allFocusAreas.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Bot Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBots.map((bot) => {
          const isSelected = selectedCompanionId === bot.id;
          return (
            <div
              key={bot.id}
              className={`p-5 bg-theme-surface border rounded-panel flex flex-col justify-between transition-all relative ${
                isSelected
                  ? 'border-accent ring-1 ring-accent/30 shadow-sm'
                  : 'hairline-border hover:border-theme-border'
              }`}
            >
              {isSelected && (
                <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-accent/10 border border-accent/30 text-accent font-mono text-[9px] uppercase font-semibold flex items-center gap-1">
                  <CheckCircle2 size={10} />
                  <span>Active Companion</span>
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-panel bg-theme-raised border hairline-border flex items-center justify-center text-2xl flex-shrink-0 shadow-xs">
                    {bot.avatar}
                  </div>
                  <div className="min-w-0 pr-12">
                    <h3 className="text-base font-semibold text-theme-primary tracking-tight">
                      {bot.name}
                    </h3>
                    <p className="text-xs text-accent font-mono font-medium truncate">
                      {bot.role}
                    </p>
                    <p className="text-[11px] text-theme-tertiary font-mono">
                      {bot.primaryTone}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-theme-secondary font-sans leading-relaxed line-clamp-2">
                  {bot.bio}
                </p>

                {/* Focus areas tags */}
                <div className="flex flex-wrap gap-1">
                  {bot.focusAreas.slice(0, 3).map((f) => (
                    <span
                      key={f}
                      className="px-2 py-0.5 rounded-control bg-theme-raised text-theme-secondary border hairline-border text-[10px] font-mono"
                    >
                      {f}
                    </span>
                  ))}
                  {bot.focusAreas.length > 3 && (
                    <span className="px-1.5 py-0.5 rounded-control bg-theme-raised text-theme-tertiary text-[10px] font-mono">
                      +{bot.focusAreas.length - 3}
                    </span>
                  )}
                </div>

                {/* Languages & Metrics */}
                <div className="pt-2 border-t border-theme-subtle flex items-center justify-between text-[11px] font-mono text-theme-tertiary">
                  <div className="flex items-center gap-1">
                    <Languages size={11} />
                    <span>{bot.languages.join(', ')}</span>
                  </div>
                  <div className="flex items-center gap-1 text-success">
                    <Activity size={11} />
                    <span>{bot.usageStats.helpfulnessRating.toFixed(2)} / 5.0</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 mt-3 border-t border-theme-subtle flex items-center gap-2">
                <button
                  onClick={() => {
                    setActiveDrawerBot(bot);
                    setDrawerTab('overview');
                    setIsPlayingAudio(false);
                  }}
                  className="flex-1 h-8 px-2.5 bg-theme-raised hover:bg-theme-surface border hairline-border text-theme-primary rounded-control text-xs font-mono transition-colors focus-ring"
                >
                  Inspect Profile
                </button>
                <button
                  onClick={() => handleStartChat(bot.id)}
                  className="h-8 px-3.5 bg-accent hover:bg-accent-hover text-white rounded-control text-xs font-mono font-medium transition-colors focus-ring flex items-center gap-1.5 shadow-xs"
                >
                  <span>Chat</span>
                  <ArrowRight size={12} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Slide-over Detail Drawer */}
      <AnimatePresence>
        {activeDrawerBot && (
          <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs">
            <div
              className="absolute inset-0"
              onClick={() => setActiveDrawerBot(null)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative w-full max-w-xl h-full bg-theme-surface border-l hairline-border flex flex-col z-10 shadow-2xl overflow-hidden"
            >
              {/* Drawer Header */}
              <div className="p-5 border-b border-theme-subtle bg-theme-raised flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-panel bg-theme-surface border hairline-border flex items-center justify-center text-xl shadow-xs">
                    {activeDrawerBot.avatar}
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-theme-primary">
                      {activeDrawerBot.name}
                    </h2>
                    <p className="text-xs text-accent font-mono">
                      {activeDrawerBot.role}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveDrawerBot(null)}
                  className="p-1.5 rounded-control text-theme-tertiary hover:text-theme-primary hover:bg-theme-surface transition-colors focus-ring"
                  aria-label="Close drawer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Drawer Tabs Header */}
              <div className="flex border-b border-theme-subtle px-4 bg-theme-surface overflow-x-auto">
                {[
                  { id: 'overview', label: 'Overview', icon: BookOpen },
                  { id: 'voice', label: 'Voice & Language', icon: Volume2 },
                  { id: 'guardrails', label: 'Guardrails', icon: ShieldAlert },
                  { id: 'stats', label: 'Usage Metrics', icon: BarChart2 },
                  { id: 'advanced', label: 'Techniques', icon: Sliders },
                ].map((t) => {
                  const Icon = t.icon;
                  const isActive = drawerTab === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setDrawerTab(t.id as any)}
                      className={`flex items-center gap-1.5 py-3 px-3 text-xs font-mono whitespace-nowrap border-b-2 transition-all ${
                        isActive
                          ? 'border-accent text-accent font-semibold'
                          : 'border-transparent text-theme-secondary hover:text-theme-primary'
                      }`}
                    >
                      <Icon size={13} />
                      <span>{t.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {drawerTab === 'overview' && (
                  <div className="space-y-4 text-xs">
                    <div className="p-3.5 bg-theme-raised border hairline-border rounded-control space-y-1.5">
                      <span className="text-[10px] uppercase font-mono tracking-wider text-theme-tertiary">
                        Core Purpose & Bio
                      </span>
                      <p className="text-theme-secondary font-sans leading-relaxed">
                        {activeDrawerBot.bio}
                      </p>
                    </div>

                    <div className="p-3.5 bg-theme-raised border hairline-border rounded-control space-y-1.5">
                      <span className="text-[10px] uppercase font-mono tracking-wider text-theme-tertiary">
                        Sample Greeting
                      </span>
                      <p className="text-theme-primary font-sans italic border-l-2 border-accent pl-2.5">
                        &quot;{activeDrawerBot.greeting}&quot;
                      </p>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[10px] uppercase font-mono tracking-wider text-theme-tertiary">
                        Specialized Focus Areas
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        {activeDrawerBot.focusAreas.map((area) => (
                          <div
                            key={area}
                            className="p-2.5 bg-theme-raised border hairline-border rounded-control font-mono text-theme-secondary flex items-center gap-2"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                            <span>{area}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {drawerTab === 'voice' && (
                  <div className="space-y-4 text-xs font-mono">
                    <div className="p-4 bg-theme-raised border hairline-border rounded-control space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-theme-primary font-semibold">
                          Simulated Voice Sample ({activeDrawerBot.audioDurationSec}s)
                        </span>
                        <span className="text-[10px] text-theme-tertiary">
                          Inflection: Natural Human
                        </span>
                      </div>

                      {/* Animated Sound Wave Simulator */}
                      <div className="h-12 bg-theme-surface border hairline-border rounded-control flex items-center justify-center gap-1 px-4">
                        {[12, 28, 44, 20, 60, 36, 16, 48, 52, 24, 30, 42, 58, 22, 14, 38, 46, 26].map(
                          (h, idx) => (
                            <motion.span
                              key={idx}
                              animate={{
                                height: isPlayingAudio ? [h * 0.4, h, h * 0.3] : 8,
                              }}
                              transition={{
                                repeat: isPlayingAudio ? Infinity : 0,
                                duration: 0.6 + (idx % 4) * 0.15,
                                ease: 'easeInOut',
                              }}
                              className={`w-1 rounded-full ${
                                isPlayingAudio ? 'bg-accent' : 'bg-theme-subtle'
                              }`}
                            />
                          )
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                          className="px-3 py-1.5 bg-accent hover:bg-accent-hover text-white rounded-control text-xs font-mono flex items-center gap-1.5 transition-colors focus-ring"
                        >
                          {isPlayingAudio ? <Pause size={12} /> : <Play size={12} />}
                          <span>{isPlayingAudio ? 'Pause Voice' : 'Play Audio Preview'}</span>
                        </button>
                        <span className="text-[11px] text-theme-tertiary">
                          Languages: {activeDrawerBot.languages.join(' • ')}
                        </span>
                      </div>
                    </div>

                    <div className="p-3.5 bg-theme-raised border hairline-border rounded-control space-y-1.5">
                      <span className="text-[10px] uppercase font-mono tracking-wider text-theme-tertiary">
                        Voice Script Transcript
                      </span>
                      <p className="text-theme-secondary font-sans leading-relaxed text-xs">
                        &quot;{activeDrawerBot.sampleTranscript}&quot;
                      </p>
                    </div>
                  </div>
                )}

                {drawerTab === 'guardrails' && (
                  <div className="space-y-3 text-xs">
                    <div className="p-3.5 bg-danger/10 border border-danger/30 rounded-control space-y-2">
                      <div className="flex items-center gap-2 text-danger font-mono font-semibold">
                        <ShieldAlert size={14} />
                        <span>Crisis Protocol Intercept (Zero-Delay)</span>
                      </div>
                      <p className="text-theme-secondary font-sans">
                        {activeDrawerBot.guardrails.crisisEscalationProtocol}
                      </p>
                      <div className="pt-2 border-t border-danger/20 flex flex-wrap gap-2 text-[10px] font-mono text-theme-primary">
                        <span className="px-2 py-0.5 bg-theme-surface rounded-xs border hairline-border">
                          Govt Helpline: 14416
                        </span>
                        <span className="px-2 py-0.5 bg-theme-surface rounded-xs border hairline-border">
                          Toll-Free: 1800-891-4416
                        </span>
                      </div>
                    </div>

                    <div className="p-3.5 bg-theme-raised border hairline-border rounded-control space-y-1.5">
                      <span className="text-[10px] uppercase font-mono tracking-wider text-theme-tertiary">
                        Non-Clinical Legal Disclaimer
                      </span>
                      <p className="text-theme-secondary font-sans leading-relaxed text-[11px]">
                        {activeDrawerBot.guardrails.noClinicalDiagnosisDisclaimer}
                      </p>
                    </div>

                    <div className="p-3 bg-theme-raised border hairline-border rounded-control space-y-1 font-mono text-[11px]">
                      <div className="flex items-center justify-between text-success">
                        <span>PII Auto-Scrubbing</span>
                        <span className="font-semibold">Enabled</span>
                      </div>
                      <div className="flex items-center justify-between text-success">
                        <span>Non-Evaluative Framing</span>
                        <span className="font-semibold">Strict Standard</span>
                      </div>
                      <div className="flex items-center justify-between text-theme-tertiary">
                        <span>Manager Access Shield</span>
                        <span className="text-success font-semibold">Revoked (100% Private)</span>
                      </div>
                    </div>
                  </div>
                )}

                {drawerTab === 'stats' && (
                  <div className="space-y-3 font-mono text-xs">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-theme-raised border hairline-border rounded-control space-y-1">
                        <span className="text-[10px] text-theme-tertiary uppercase">Active Sessions</span>
                        <div className="text-lg font-bold text-theme-primary">
                          {activeDrawerBot.usageStats.activeSessionsCount}
                        </div>
                      </div>
                      <div className="p-3 bg-theme-raised border hairline-border rounded-control space-y-1">
                        <span className="text-[10px] text-theme-tertiary uppercase">Avg Duration</span>
                        <div className="text-lg font-bold text-theme-primary">
                          {activeDrawerBot.usageStats.avgSessionMins} mins
                        </div>
                      </div>
                      <div className="p-3 bg-theme-raised border hairline-border rounded-control space-y-1">
                        <span className="text-[10px] text-theme-tertiary uppercase">Helpfulness Rating</span>
                        <div className="text-lg font-bold text-success">
                          {activeDrawerBot.usageStats.helpfulnessRating} / 5.0
                        </div>
                      </div>
                      <div className="p-3 bg-theme-raised border hairline-border rounded-control space-y-1">
                        <span className="text-[10px] text-theme-tertiary uppercase">Exercises Completed</span>
                        <div className="text-lg font-bold text-accent">
                          {activeDrawerBot.usageStats.totalGroundingExercisesRun}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {drawerTab === 'advanced' && (
                  <div className="space-y-3 text-xs font-mono">
                    <div className="p-3.5 bg-theme-raised border hairline-border rounded-control space-y-2">
                      <span className="text-[10px] uppercase text-theme-tertiary">Grounding Strategy</span>
                      <select className="w-full h-9 px-2 bg-theme-surface border hairline-border rounded-control text-xs text-theme-primary">
                        <option>4-4-4-4 Box Breathing Pacer</option>
                        <option>5-4-3-2-1 Sensory Grounding</option>
                        <option>Progressive Muscle Relaxation</option>
                        <option>Cognitive Reframe Matrix</option>
                      </select>
                    </div>

                    <div className="p-3.5 bg-theme-raised border hairline-border rounded-control space-y-2">
                      <span className="text-[10px] uppercase text-theme-tertiary">Response Length Preference</span>
                      <div className="flex gap-2">
                        {['Concise & Gentle', 'Detailed Guidance', 'Interactive Step-by-Step'].map(
                          (len, idx) => (
                            <button
                              key={len}
                              className={`flex-1 py-1.5 px-2 rounded-control border text-[11px] text-center ${
                                idx === 0
                                  ? 'bg-accent/10 border-accent text-accent font-semibold'
                                  : 'bg-theme-surface border-theme-border text-theme-secondary'
                              }`}
                            >
                              {len}
                            </button>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Drawer Footer CTA */}
              <div className="p-4 border-t border-theme-subtle bg-theme-raised flex items-center justify-between gap-3">
                <button
                  onClick={() => {
                    setSelectedCompanionId(activeDrawerBot.id);
                  }}
                  className={`h-9 px-3 rounded-control text-xs font-mono border transition-all ${
                    selectedCompanionId === activeDrawerBot.id
                      ? 'bg-success/10 border-success text-success font-semibold'
                      : 'bg-theme-surface border-theme-border text-theme-primary hover:border-accent'
                  }`}
                >
                  {selectedCompanionId === activeDrawerBot.id
                    ? 'Default Companion Selected'
                    : 'Set as Default Companion'}
                </button>

                <button
                  onClick={() => handleStartChat(activeDrawerBot.id)}
                  className="h-9 px-4 bg-accent hover:bg-accent-hover text-white rounded-control text-xs font-mono font-medium transition-colors shadow-xs flex items-center gap-1.5 focus-ring"
                >
                  <span>Start Private Conversation</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
