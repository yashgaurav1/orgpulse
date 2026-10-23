'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/components/layout/ThemeContext';
import { Sparkles, Palette, Activity, ArrowLeft, Sun, Moon } from 'lucide-react';

export default function DevLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  const links = [
    { href: '/dev/brand', label: 'Brand Spec', icon: Sparkles },
    { href: '/dev/components', label: 'Components', icon: Palette },
    { href: '/dev/motion', label: 'Motion Tokens', icon: Activity },
  ];

  return (
    <div className="min-h-screen bg-theme-bg text-theme-primary flex flex-col">
      {/* Minimal Dev Navigation Bar */}
      <header className="h-12 border-b hairline-border bg-theme-surface sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-mono text-theme-secondary hover:text-theme-primary transition-colors"
          >
            <ArrowLeft size={13} />
            <span>Home</span>
          </Link>
          <span className="text-theme-tertiary">|</span>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-semibold text-accent uppercase tracking-wider">
              Pulse Design Lab
            </span>
          </div>
        </div>

        <nav className="flex items-center gap-2 sm:gap-3 text-xs font-mono">
          {links.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-control transition-colors ${
                  isActive
                    ? 'bg-accent/15 text-accent font-semibold border border-accent/30'
                    : 'text-theme-secondary hover:text-theme-primary hover:bg-theme-raised'
                }`}
              >
                <Icon size={12} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-control text-theme-secondary hover:text-theme-primary hover:bg-theme-raised transition-colors focus-ring"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>
          <Link
            href="/dashboard/manager"
            className="text-xs font-mono px-2.5 py-1 rounded-control bg-theme-raised border hairline-border text-theme-primary hover:bg-theme-border transition-colors hidden sm:inline-block"
          >
            Open App &rarr;
          </Link>
        </div>
      </header>

      {/* Main Content with standard document scrolling */}
      <main id="main-content" className="flex-1 p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
