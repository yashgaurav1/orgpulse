'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { RouteLoadingBar } from '../enterprise/RouteLoadingBar';
import { CommandPalette } from '../enterprise/CommandPalette';
import { ShortcutsModal } from '../enterprise/ShortcutsModal';
import { useAuth } from '@/lib/auth-context';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { sessionMode } = useAuth();
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    if (sessionMode === 'loading') {
      const timer = setTimeout(() => setShowLoading(true), 100);
      return () => clearTimeout(timer);
    } else {
      setShowLoading(false);
    }
  }, [sessionMode]);

  if (sessionMode === 'loading' && showLoading) {
    return (
      <div
        data-testid="branded-loading-state"
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#03173B] text-white select-none"
      >
        <div className="relative w-16 h-16 mb-4 animate-pulse">
          <img src="/brand/mark.svg" alt="Pulse" className="w-full h-full object-contain" />
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-[#9FB2CC]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#4AA3D6] animate-ping" />
          <span>Initializing secure workspace...</span>
        </div>
      </div>
    );
  }

  return (
    <div
      data-testid="app-shell"
      className="flex h-screen w-full overflow-hidden bg-theme-bg text-theme-primary"
    >
      <RouteLoadingBar />
      <CommandPalette />
      <ShortcutsModal />

      {/* Fixed Left Sidebar */}
      <Sidebar />

      {/* Main Application Column */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Navigation Bar */}
        <TopBar />

        {/* Scrollable Content Viewport */}
        <main
          id="main-content"
          className="flex-1 overflow-y-auto bg-theme-bg p-4 md:p-6"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
