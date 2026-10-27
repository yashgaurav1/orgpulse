'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth, getRoleDashboardPath } from '@/lib/auth-context';
import { useTheme } from '@/components/layout/ThemeContext';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import {
  ChevronDown,
  Sparkles,
  Menu,
  X,
  ArrowRight,
  Sun,
  Moon,
  Laptop,
  ShieldCheck,
  Lock,
  Calendar,
  FileText,
  Users,
  Heart,
  Bot,
  HelpCircle,
} from 'lucide-react';

export function LandingNav() {
  const { openAuthModal, user, profile, isDemo, resetDemo, signOutUser } = useAuth();
  const { theme, themeSetting, setTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 8);

      // Calculate scroll progress %
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        setScrollProgress(Math.min(100, Math.max(0, (scrollY / docHeight) * 100)));
      }

      // Active in-page section tracking
      const sections = ['problem', 'how-it-works', 'roles', 'privacy', 'wellbeing', 'faq'];
      const scrollPos = scrollY + 140;
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-200 ${
          isScrolled
            ? 'bg-white/90 dark:bg-[#00142E]/90 backdrop-blur-[20px] border-b border-[#E8E6E1] dark:border-[#1F3F6E] shadow-soft'
            : 'bg-white/70 dark:bg-[#00142E]/70 backdrop-blur-[12px] border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
          {/* Brand Horizontal Lockup (Mark >= 32px) */}
          <Link
            href="/"
            className="flex-shrink-0 flex items-center gap-2 group focus-ring rounded-control p-1"
            aria-label="Pulse Home"
          >
            <img
              src={theme === 'dark' ? '/brand/horizontal.svg' : '/brand/horizontal-light.svg'}
              alt="Pulse"
              className="h-8 w-auto object-contain transition-transform group-hover:scale-[1.01]"
            />
          </Link>

          {/* Desktop NavigationMenu using Radix Primitives */}
          <NavigationMenu.Root className="hidden md:flex relative z-50">
            <NavigationMenu.List className="flex items-center gap-1 font-sans text-[15px] font-medium text-[#5C6778] dark:text-[#9FB2CC] whitespace-nowrap">
              {/* Problem Direct Anchor */}
              <NavigationMenu.Item>
                <NavigationMenu.Link
                  href="#problem"
                  className={`px-3 py-2 rounded-control hover:text-[#0B1B33] dark:hover:text-white transition-colors relative ${
                    activeSection === 'problem' ? 'text-[#0B1B33] dark:text-white font-semibold' : ''
                  }`}
                >
                  The Problem
                  {activeSection === 'problem' && (
                    <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-[#2E8EBF] rounded-full" />
                  )}
                </NavigationMenu.Link>
              </NavigationMenu.Item>

              {/* Product Dropdown */}
              <NavigationMenu.Item>
                <NavigationMenu.Trigger className="group inline-flex items-center gap-1 px-3 py-2 rounded-control hover:text-[#0B1B33] dark:hover:text-white transition-colors focus-ring">
                  <span>Product</span>
                  <ChevronDown
                    size={14}
                    className="transition-transform duration-200 group-data-[state=open]:rotate-180"
                    aria-hidden="true"
                  />
                </NavigationMenu.Trigger>
                <NavigationMenu.Content className="absolute top-full left-0 mt-2 w-72 p-2 rounded-panel bg-white dark:bg-[#0A2347] border border-[#E8E6E1] dark:border-[#1F3F6E] shadow-xl animate-in fade-in-0 zoom-in-95 duration-150">
                  <div className="space-y-1">
                    <NavigationMenu.Link
                      href="#how-it-works"
                      className="flex items-start gap-3 p-2.5 rounded-control hover:bg-[#F8F7F4] dark:hover:bg-[#11305C] transition-colors"
                    >
                      <Sparkles size={16} className="text-[#1D6F9F] dark:text-[#4AA3D6] mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-xs font-semibold text-[#0B1B33] dark:text-white">How It Works</div>
                        <div className="text-[11px] text-[#5C6778] dark:text-[#9FB2CC]">3-step micro-survey and aggregate action loop.</div>
                      </div>
                    </NavigationMenu.Link>
                    <NavigationMenu.Link
                      href="#roles"
                      className="flex items-start gap-3 p-2.5 rounded-control hover:bg-[#F8F7F4] dark:hover:bg-[#11305C] transition-colors"
                    >
                      <Users size={16} className="text-[#1D6F9F] dark:text-[#4AA3D6] mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-xs font-semibold text-[#0B1B33] dark:text-white">Role Views</div>
                        <div className="text-[11px] text-[#5C6778] dark:text-[#9FB2CC]">Employee, Manager, HRBP, and Leadership views.</div>
                      </div>
                    </NavigationMenu.Link>
                    <NavigationMenu.Link
                      href="#wellbeing"
                      className="flex items-start gap-3 p-2.5 rounded-control hover:bg-[#F8F7F4] dark:hover:bg-[#11305C] transition-colors"
                    >
                      <Heart size={16} className="text-[#1D6F9F] dark:text-[#4AA3D6] mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-xs font-semibold text-[#0B1B33] dark:text-white">Wellbeing Companion</div>
                        <div className="text-[11px] text-[#5C6778] dark:text-[#9FB2CC]">Private grounding exercises & Tele-MANAS support.</div>
                      </div>
                    </NavigationMenu.Link>
                  </div>
                </NavigationMenu.Content>
              </NavigationMenu.Item>

              {/* Privacy Dropdown */}
              <NavigationMenu.Item>
                <NavigationMenu.Trigger className="group inline-flex items-center gap-1 px-3 py-2 rounded-control hover:text-[#0B1B33] dark:hover:text-white transition-colors focus-ring">
                  <span>Privacy</span>
                  <ChevronDown
                    size={14}
                    className="transition-transform duration-200 group-data-[state=open]:rotate-180"
                    aria-hidden="true"
                  />
                </NavigationMenu.Trigger>
                <NavigationMenu.Content className="absolute top-full left-0 mt-2 w-80 p-2 rounded-panel bg-white dark:bg-[#0A2347] border border-[#E8E6E1] dark:border-[#1F3F6E] shadow-xl animate-in fade-in-0 zoom-in-95 duration-150">
                  <div className="space-y-1">
                    <NavigationMenu.Link
                      href="#privacy"
                      className="flex items-start gap-3 p-2.5 rounded-control hover:bg-[#F8F7F4] dark:hover:bg-[#11305C] transition-colors"
                    >
                      <Lock size={16} className="text-[#1D6F9F] dark:text-[#4AA3D6] mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-xs font-semibold text-[#0B1B33] dark:text-white">Anonymity Invariants</div>
                        <div className="text-[11px] text-[#5C6778] dark:text-[#9FB2CC]">Zero email, IP, or user IDs joined to responses.</div>
                      </div>
                    </NavigationMenu.Link>
                    <NavigationMenu.Link
                      href="#privacy"
                      className="flex items-start gap-3 p-2.5 rounded-control hover:bg-[#F8F7F4] dark:hover:bg-[#11305C] transition-colors"
                    >
                      <ShieldCheck size={16} className="text-[#1D6F9F] dark:text-[#4AA3D6] mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-xs font-semibold text-[#0B1B33] dark:text-white">Minimum Group of 5</div>
                        <div className="text-[11px] text-[#5C6778] dark:text-[#9FB2CC]">Mathematical suppression shield on small groups.</div>
                      </div>
                    </NavigationMenu.Link>
                    <NavigationMenu.Link
                      href="#privacy"
                      className="flex items-start gap-3 p-2.5 rounded-control hover:bg-[#F8F7F4] dark:hover:bg-[#11305C] transition-colors"
                    >
                      <Calendar size={16} className="text-[#1D6F9F] dark:text-[#4AA3D6] mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-xs font-semibold text-[#0B1B33] dark:text-white">90-Day Raw Data Purge</div>
                        <div className="text-[11px] text-[#5C6778] dark:text-[#9FB2CC]">Scheduled deletion of micro-responses and text.</div>
                      </div>
                    </NavigationMenu.Link>
                    <div className="pt-2 border-t border-[#E8E6E1] dark:border-[#1F3F6E]">
                      <Link
                        href="/privacy"
                        className="flex items-center justify-between p-2 rounded-control text-xs font-semibold text-[#1D6F9F] dark:text-[#4AA3D6] hover:bg-[#F8F7F4] dark:hover:bg-[#11305C]"
                      >
                        <span>Full Privacy Policy &amp; Data Flow &rarr;</span>
                      </Link>
                    </div>
                  </div>
                </NavigationMenu.Content>
              </NavigationMenu.Item>

              {/* Resources Dropdown */}
              <NavigationMenu.Item>
                <NavigationMenu.Trigger className="group inline-flex items-center gap-1 px-3 py-2 rounded-control hover:text-[#0B1B33] dark:hover:text-white transition-colors focus-ring">
                  <span>Resources</span>
                  <ChevronDown
                    size={14}
                    className="transition-transform duration-200 group-data-[state=open]:rotate-180"
                    aria-hidden="true"
                  />
                </NavigationMenu.Trigger>
                <NavigationMenu.Content className="absolute top-full left-0 mt-2 w-72 p-2 rounded-panel bg-white dark:bg-[#0A2347] border border-[#E8E6E1] dark:border-[#1F3F6E] shadow-xl animate-in fade-in-0 zoom-in-95 duration-150">
                  <div className="space-y-1">
                    <NavigationMenu.Link
                      href="#faq"
                      className="flex items-start gap-3 p-2.5 rounded-control hover:bg-[#F8F7F4] dark:hover:bg-[#11305C] transition-colors"
                    >
                      <HelpCircle size={16} className="text-[#1D6F9F] dark:text-[#4AA3D6] mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-xs font-semibold text-[#0B1B33] dark:text-white">Frequently Asked Questions</div>
                        <div className="text-[11px] text-[#5C6778] dark:text-[#9FB2CC]">Answers to architecture & privacy queries.</div>
                      </div>
                    </NavigationMenu.Link>
                    <Link
                      href="/library/conduct-guide"
                      className="flex items-start gap-3 p-2.5 rounded-control hover:bg-[#F8F7F4] dark:hover:bg-[#11305C] transition-colors"
                    >
                      <FileText size={16} className="text-[#1D6F9F] dark:text-[#4AA3D6] mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-xs font-semibold text-[#0B1B33] dark:text-white">Conduct &amp; Non-Retaliation</div>
                        <div className="text-[11px] text-[#5C6778] dark:text-[#9FB2CC]">Protection charters and manager protocols.</div>
                      </div>
                    </Link>
                    <Link
                      href="/library/stay-interview"
                      className="flex items-start gap-3 p-2.5 rounded-control hover:bg-[#F8F7F4] dark:hover:bg-[#11305C] transition-colors"
                    >
                      <FileText size={16} className="text-[#1D6F9F] dark:text-[#4AA3D6] mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-xs font-semibold text-[#0B1B33] dark:text-white">Stay Interview Toolkit</div>
                        <div className="text-[11px] text-[#5C6778] dark:text-[#9FB2CC]">Structured conversation frameworks.</div>
                      </div>
                    </Link>
                    <Link
                      href="/library/pilot-plan"
                      className="flex items-start gap-3 p-2.5 rounded-control hover:bg-[#F8F7F4] dark:hover:bg-[#11305C] transition-colors"
                    >
                      <Calendar size={16} className="text-[#1D6F9F] dark:text-[#4AA3D6] mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-xs font-semibold text-[#0B1B33] dark:text-white">90-Day Pilot Plan</div>
                        <div className="text-[11px] text-[#5C6778] dark:text-[#9FB2CC]">Rollout cadence and milestones.</div>
                      </div>
                    </Link>
                  </div>
                </NavigationMenu.Content>
              </NavigationMenu.Item>
            </NavigationMenu.List>
          </NavigationMenu.Root>

          {/* Right Action Controls: Theme + Auth CTAs */}
          <div className="flex items-center gap-2.5 whitespace-nowrap">
            {/* Theme Toggle (Light / Dark / System) */}
            <div className="flex items-center p-0.5 rounded-control bg-[#F8F7F4] dark:bg-[#0A2347] border border-[#E8E6E1] dark:border-[#1F3F6E]">
              <button
                type="button"
                onClick={() => setTheme('light')}
                className={`p-1.5 rounded-[8px] transition-colors ${
                  themeSetting === 'light'
                    ? 'bg-white dark:bg-[#11305C] text-[#03173B] dark:text-white shadow-xs'
                    : 'text-[#5C6778] dark:text-[#9FB2CC] hover:text-[#0B1B33]'
                }`}
                title="Light Theme"
                aria-label="Light Theme"
              >
                <Sun size={14} />
              </button>
              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={`p-1.5 rounded-[8px] transition-colors ${
                  themeSetting === 'dark'
                    ? 'bg-white dark:bg-[#11305C] text-[#03173B] dark:text-white shadow-xs'
                    : 'text-[#5C6778] dark:text-[#9FB2CC] hover:text-[#0B1B33]'
                }`}
                title="Dark Theme"
                aria-label="Dark Theme"
              >
                <Moon size={14} />
              </button>
              <button
                type="button"
                onClick={() => setTheme('system')}
                className={`p-1.5 rounded-[8px] transition-colors ${
                  themeSetting === 'system'
                    ? 'bg-white dark:bg-[#11305C] text-[#03173B] dark:text-white shadow-xs'
                    : 'text-[#5C6778] dark:text-[#9FB2CC] hover:text-[#0B1B33]'
                }`}
                title="System Theme"
                aria-label="System Theme"
              >
                <Laptop size={14} />
              </button>
            </div>

            {/* Session Action Buttons */}
            {user || isDemo ? (
              <div className="flex items-center gap-2">
                <Link
                  href={getRoleDashboardPath(profile?.approvedRole)}
                  className="btn-primary !h-10 !px-4 !text-xs"
                >
                  <span>Open Workspace</span>
                  <ArrowRight size={13} className="chevron-nudge" />
                </Link>
                {isDemo ? (
                  <button
                    onClick={resetDemo}
                    className="text-xs text-[#5C6778] dark:text-[#9FB2CC] hover:text-[#C01313] transition-colors px-2 py-1.5 font-medium"
                    title="Exit demo session"
                  >
                    Exit Demo
                  </button>
                ) : (
                  <button
                    onClick={signOutUser}
                    className="text-xs text-[#5C6778] dark:text-[#9FB2CC] hover:text-[#0B1B33] dark:hover:text-white transition-colors px-2 py-1.5 font-medium"
                  >
                    Sign Out
                  </button>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => openAuthModal('signin')}
                  className="btn-secondary !h-10 !px-4 !text-xs"
                >
                  Sign in
                </button>
                <button
                  type="button"
                  onClick={() => openAuthModal('demo')}
                  className="btn-primary !h-10 !px-4 !text-xs"
                >
                  <span>Try demo</span>
                  <ArrowRight size={13} className="chevron-nudge" />
                </button>
              </div>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 md:hidden text-[#5C6778] dark:text-[#9FB2CC] hover:text-[#0B1B33] dark:hover:text-white rounded-control border border-[#E8E6E1] dark:border-[#1F3F6E]"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Scroll Progress Indicator Line */}
        <div
          className="absolute bottom-0 left-0 h-[2px] bg-[#2E8EBF] transition-all duration-75"
          style={{ width: `${scrollProgress}%` }}
          aria-hidden="true"
        />
      </header>

      {/* Mobile Slide-over Sheet */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 md:hidden bg-black/60 backdrop-blur-xs">
          <div className="absolute top-16 left-0 right-0 bg-white dark:bg-[#0A2347] border-b border-[#E8E6E1] dark:border-[#1F3F6E] p-6 space-y-4 shadow-2xl animate-in slide-in-from-top-2 duration-200">
            <nav className="flex flex-col gap-2 font-sans text-sm text-[#5C6778] dark:text-[#9FB2CC] font-medium">
              <a href="#problem" onClick={() => setMobileMenuOpen(false)} className="py-1.5 hover:text-[#0B1B33] dark:hover:text-white">
                The Problem
              </a>
              <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="py-1.5 hover:text-[#0B1B33] dark:hover:text-white">
                How It Works
              </a>
              <a href="#roles" onClick={() => setMobileMenuOpen(false)} className="py-1.5 hover:text-[#0B1B33] dark:hover:text-white">
                Role Views
              </a>
              <a href="#privacy" onClick={() => setMobileMenuOpen(false)} className="py-1.5 hover:text-[#0B1B33] dark:hover:text-white">
                Privacy Guarantees
              </a>
              <a href="#wellbeing" onClick={() => setMobileMenuOpen(false)} className="py-1.5 hover:text-[#0B1B33] dark:hover:text-white">
                Wellbeing &amp; AI Companion
              </a>
              <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="py-1.5 hover:text-[#0B1B33] dark:hover:text-white">
                FAQ
              </a>
            </nav>

            <div className="pt-4 border-t border-[#E8E6E1] dark:border-[#1F3F6E] flex flex-col gap-2.5 font-sans">
              {user || isDemo ? (
                <Link
                  href={getRoleDashboardPath(profile?.approvedRole)}
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-primary w-full justify-center !h-11"
                >
                  <span>Open Workspace ({profile?.approvedRole})</span>
                  <ArrowRight size={14} className="chevron-nudge" />
                </Link>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      openAuthModal('signin');
                    }}
                    className="btn-secondary w-full justify-center !h-11"
                  >
                    Sign in
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      openAuthModal('demo');
                    }}
                    className="btn-primary w-full justify-center !h-11"
                  >
                    <span>Try demo</span>
                    <ArrowRight size={14} className="chevron-nudge" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
