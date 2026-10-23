'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import * as Dialog from '@radix-ui/react-dialog';
import {
  Search,
  LayoutDashboard,
  Users,
  Shield,
  FileText,
  Palette,
  Sun,
  Moon,
  Download,
  PlusCircle,
  HelpCircle,
  ArrowRight,
  ExternalLink,
  LucideIcon,
} from 'lucide-react';
import { useTheme } from '../layout/ThemeContext';

interface CommandItem {
  id: string;
  category: 'Navigation' | 'Actions' | 'Tools' | 'System';
  title: string;
  subtitle?: string;
  shortcut?: string;
  icon: LucideIcon;
  perform: () => void;
}

export function CommandPalette() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands: CommandItem[] = [
    {
      id: 'nav-home',
      category: 'Navigation',
      title: 'Overview & Problem Space',
      subtitle: 'System homepage and illustrative gap',
      shortcut: 'G H',
      icon: LayoutDashboard,
      perform: () => router.push('/'),
    },
    {
      id: 'nav-manager',
      category: 'Navigation',
      title: 'Delivery Manager Dashboard',
      subtitle: 'Squad health, 14-day actions, cycle toggle',
      shortcut: 'G M',
      icon: Users,
      perform: () => router.push('/dashboard/manager'),
    },
    {
      id: 'nav-director',
      category: 'Navigation',
      title: 'Director Scorecard',
      subtitle: 'Multi-squad overview and follow-through',
      shortcut: 'G D',
      icon: Shield,
      perform: () => router.push('/dashboard/director'),
    },
    {
      id: 'nav-hr',
      category: 'Navigation',
      title: 'HRBP Operations & BU Synthesis',
      subtitle: 'AI thematic summary, audit log, CSV export',
      shortcut: 'G R',
      icon: FileText,
      perform: () => router.push('/dashboard/hr'),
    },
    {
      id: 'nav-components',
      category: 'Navigation',
      title: 'Enterprise Component Gallery',
      subtitle: 'Living catalog of design tokens and primitives',
      shortcut: 'G C',
      icon: Palette,
      perform: () => router.push('/dev/components'),
    },
    {
      id: 'action-theme',
      category: 'Actions',
      title: `Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`,
      subtitle: 'Toggle active theme',
      shortcut: 'T',
      icon: theme === 'dark' ? Sun : Moon,
      perform: () => toggleTheme(),
    },
    {
      id: 'action-export',
      category: 'Actions',
      title: 'Export Active Squad Data',
      subtitle: 'Generate privacy-preserving team CSV',
      shortcut: 'E',
      icon: Download,
      perform: () => router.push('/dashboard/hr'),
    },
    {
      id: 'action-survey-sample',
      category: 'Tools',
      title: 'Open Survey Simulation',
      subtitle: 'Test 1-5 keyboard flow with sample token',
      shortcut: 'S',
      icon: ExternalLink,
      perform: () => router.push('/survey/demo-token-payments'),
    },
    {
      id: 'action-shortcuts',
      category: 'System',
      title: 'View Keyboard Shortcuts',
      subtitle: 'Comprehensive hotkey cheatsheet',
      shortcut: '?',
      icon: HelpCircle,
      perform: () => {
        window.dispatchEvent(
          new KeyboardEvent('keydown', { key: '?', shiftKey: true })
        );
      },
    },
  ];

  // Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filtered = commands.filter((cmd) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      cmd.title.toLowerCase().includes(q) ||
      cmd.category.toLowerCase().includes(q) ||
      (cmd.subtitle && cmd.subtitle.toLowerCase().includes(q))
    );
  });

  const handleKeyDownList = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % Math.max(1, filtered.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev <= 0 ? filtered.length - 1 : prev - 1
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[activeIndex]) {
        filtered[activeIndex].perform();
        setOpen(false);
      }
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity duration-150" />
        <Dialog.Content
          onKeyDown={handleKeyDownList}
          className="fixed top-1/4 left-1/2 -translate-x-1/2 z-50 w-full max-w-xl bg-theme-surface border hairline-border rounded-panel shadow-2xl overflow-hidden focus-ring"
        >
          {/* Search Input Bar */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-theme-subtle bg-theme-raised">
            <Search size={16} strokeWidth={1.5} className="text-theme-tertiary" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Type a command or search..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActiveIndex(0);
              }}
              className="flex-1 bg-transparent text-sm text-theme-primary placeholder-theme-tertiary outline-none font-sans"
              autoFocus
            />
            <kbd className="px-1.5 py-0.5 bg-theme-surface border border-theme-border rounded-control font-mono text-[10px] text-theme-secondary">
              ESC
            </kbd>
          </div>

          {/* Results List */}
          <div className="max-h-[340px] overflow-y-auto p-2 space-y-1">
            {filtered.length === 0 ? (
              <div className="py-8 text-center text-xs font-mono text-theme-tertiary">
                No matching actions or commands found.
              </div>
            ) : (
              filtered.map((item, idx) => {
                const Icon = item.icon;
                const isSelected = idx === activeIndex;

                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      item.perform();
                      setOpen(false);
                    }}
                    onMouseEnter={() => setActiveIndex(idx)}
                    className={`flex items-center justify-between px-3 py-2 rounded-control cursor-pointer transition-colors duration-75 select-none ${
                      isSelected
                        ? 'bg-accent/10 text-theme-primary'
                        : 'text-theme-secondary hover:bg-theme-raised'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`p-1.5 rounded-control ${
                          isSelected
                            ? 'bg-accent text-white'
                            : 'bg-theme-raised text-theme-secondary'
                        }`}
                      >
                        <Icon size={14} strokeWidth={1.5} />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[13px] font-medium text-theme-primary truncate">
                          {item.title}
                        </div>
                        {item.subtitle && (
                          <div className="text-[11px] text-theme-tertiary truncate">
                            {item.subtitle}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {item.shortcut && (
                        <kbd className="px-1.5 py-0.5 bg-theme-raised border border-theme-border rounded-control font-mono text-[10px] text-theme-tertiary font-medium">
                          {item.shortcut}
                        </kbd>
                      )}
                      {isSelected && (
                        <ArrowRight size={13} strokeWidth={2} className="text-accent" />
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Bar */}
          <div className="flex items-center justify-between px-4 py-2 border-t border-theme-subtle bg-theme-raised text-[11px] font-mono text-theme-tertiary">
            <div className="flex items-center gap-3">
              <span>
                <kbd className="px-1 bg-theme-surface border border-theme-border rounded-xs">↑</kbd>{' '}
                <kbd className="px-1 bg-theme-surface border border-theme-border rounded-xs">↓</kbd> navigate
              </span>
              <span>
                <kbd className="px-1.5 bg-theme-surface border border-theme-border rounded-xs">↵</kbd> select
              </span>
            </div>
            <span>Pulse Enterprise</span>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
