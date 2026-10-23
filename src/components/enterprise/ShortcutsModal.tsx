'use client';

import React, { useEffect, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, Command } from 'lucide-react';

interface ShortcutGroup {
  category: string;
  items: { key: string; description: string }[];
}

const SHORTCUTS: ShortcutGroup[] = [
  {
    category: 'Navigation',
    items: [
      { key: '⌘ K / Ctrl K', description: 'Open command palette' },
      { key: 'G H', description: 'Go to Home / Overview' },
      { key: 'G M', description: 'Go to Manager Dashboard' },
      { key: 'G D', description: 'Go to Director Scorecard' },
      { key: 'G R', description: 'Go to HRBP Operations' },
      { key: 'G C', description: 'Go to Component Library' },
    ],
  },
  {
    category: 'Actions & Tools',
    items: [
      { key: 'T', description: 'Toggle Dark / Light Theme' },
      { key: 'F', description: 'Focus Filter Bar' },
      { key: 'E', description: 'Export current table to CSV' },
      { key: 'D', description: 'Cycle Table Density (Compact/Normal)' },
      { key: '?', description: 'Show keyboard shortcuts' },
      { key: 'Esc', description: 'Close modals & side panels' },
    ],
  },
  {
    category: 'Survey Ergonomics',
    items: [
      { key: '1 – 5', description: 'Select Likert score and advance' },
      { key: 'Enter', description: 'Proceed to next question' },
      { key: 'Backspace', description: 'Return to previous question' },
      { key: 'Esc', description: 'Skip current question' },
    ],
  },
];

export function ShortcutsModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input/textarea
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity duration-150" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-xl max-h-[85vh] overflow-y-auto bg-theme-surface border hairline-border rounded-panel p-6 shadow-2xl focus-ring">
          <div className="flex items-center justify-between pb-4 border-b border-theme-subtle">
            <div className="flex items-center gap-2">
              <Command size={16} strokeWidth={1.5} className="text-accent" />
              <Dialog.Title className="text-base font-semibold tracking-[-0.02em] text-theme-primary">
                Keyboard Shortcuts
              </Dialog.Title>
            </div>
            <Dialog.Close
              className="p-1 rounded-control text-theme-secondary hover:text-theme-primary hover:bg-theme-raised transition-colors focus-ring"
              aria-label="Close shortcuts modal"
            >
              <X size={16} strokeWidth={1.5} />
            </Dialog.Close>
          </div>

          <div className="mt-4 space-y-6">
            {SHORTCUTS.map((group) => (
              <div key={group.category} className="space-y-2">
                <div className="text-[11px] font-mono uppercase tracking-[0.04em] text-theme-tertiary">
                  {group.category}
                </div>
                <div className="divide-y divide-theme-subtle border border-theme-subtle rounded-control overflow-hidden">
                  {group.items.map((item) => (
                    <div
                      key={item.key}
                      className="flex items-center justify-between px-3 py-2 text-sm bg-theme-surface/50 hover:bg-theme-raised transition-colors"
                    >
                      <span className="text-theme-secondary text-[13px]">
                        {item.description}
                      </span>
                      <kbd className="px-2 py-0.5 bg-theme-raised border border-theme-border rounded-control font-mono text-[11px] text-theme-primary font-medium shadow-xs">
                        {item.key}
                      </kbd>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-theme-subtle flex items-center justify-between text-xs text-theme-tertiary">
            <span>Press <kbd className="px-1.5 py-0.5 bg-theme-raised border border-theme-border rounded-control font-mono text-[10px]">Esc</kbd> to exit</span>
            <span className="font-mono">Pulse v2.4.0-enterprise</span>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
