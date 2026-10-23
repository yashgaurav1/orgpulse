'use client';

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import {
  Search,
  Sun,
  Moon,
  ChevronRight,
  Shield,
  Layers,
  User,
  LogOut,
  Settings,
  HelpCircle,
  Check,
  Sparkles,
  RotateCcw,
  Building,
} from 'lucide-react';
import { useTheme } from './ThemeContext';
import { NotificationCenter } from '../enterprise/NotificationCenter';
import { useAuth } from '../../lib/auth-context';

export function TopBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const { profile, isDemo, resetDemo, openAuthModal, signOutUser } = useAuth();
  const [environment, setEnvironment] = useState<'Production' | 'Staging'>('Production');

  // Breadcrumbs generator
  const getBreadcrumbs = () => {
    if (!pathname || pathname === '/') return [{ label: 'Pulse', href: '/' }];

    const segments = pathname.split('/').filter(Boolean);
    const crumbs = [{ label: 'Pulse', href: '/' }];

    let acc = '';
    segments.forEach((seg) => {
      acc += `/${seg}`;
      const title =
        seg === 'dashboard'
          ? 'Dashboard'
          : seg === 'employee'
          ? 'Employee Sanctuary'
          : seg === 'manager'
          ? 'Delivery Manager'
          : seg === 'director'
          ? 'Director'
          : seg === 'hr'
          ? 'HRBP Operations'
          : seg === 'admin'
          ? 'Company Admin'
          : seg === 'companion'
          ? 'Companion Bots'
          : seg === 'dev'
          ? 'Dev'
          : seg === 'brand'
          ? 'Brand Identity'
          : seg === 'components'
          ? 'Components'
          : seg === 'library'
          ? 'Governance Library'
          : seg === 'survey'
          ? 'Survey Flow'
          : seg;
      crumbs.push({ label: title, href: acc });
    });

    return crumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  const getRoleBadge = (role?: string) => {
    switch (role) {
      case 'employee':
        return 'Employee';
      case 'manager':
        return 'Manager';
      case 'hrbp':
        return 'HRBP';
      case 'senior_leadership':
        return 'Leadership';
      case 'company_admin':
        return 'Admin';
      default:
        return 'Member';
    }
  };

  return (
    <header className="h-12 border-b border-theme-subtle bg-theme-surface flex items-center justify-between px-4 z-20 select-none">
      {/* Left: Dynamic Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs font-sans min-w-0">
        {breadcrumbs.map((crumb, idx) => {
          const isLast = idx === breadcrumbs.length - 1;
          return (
            <React.Fragment key={crumb.href}>
              {idx > 0 && (
                <ChevronRight size={12} strokeWidth={1.5} className="text-theme-tertiary flex-shrink-0" />
              )}
              {isLast ? (
                <span className="text-theme-primary font-semibold truncate max-w-[200px]">
                  {crumb.label}
                </span>
              ) : (
                <button
                  onClick={() => router.push(crumb.href)}
                  className="text-theme-secondary hover:text-theme-primary transition-colors truncate focus-ring"
                >
                  {crumb.label}
                </button>
              )}
            </React.Fragment>
          );
        })}
      </nav>

      {/* Right: Demo Badge, Global Search, Theme, User */}
      <div className="flex items-center gap-2">
        {/* Prominent Demo Badge if in Demo Mode */}
        {isDemo && (
          <div className="flex items-center gap-1.5 pl-2 pr-1 py-0.5 rounded-control bg-accent/10 border border-accent/30 text-accent font-mono text-[11px]">
            <Sparkles size={12} />
            <span className="font-semibold uppercase tracking-wider hidden sm:inline">Demo Data</span>
            <button
              onClick={() => openAuthModal('demo')}
              className="ml-1 px-1.5 py-0.5 rounded-xs bg-accent text-white hover:bg-accent-hover text-[10px] uppercase font-bold transition-colors"
              title="Switch demo role or dataset"
            >
              Switch
            </button>
            <button
              onClick={resetDemo}
              className="p-1 hover:text-danger transition-colors"
              title="Reset demo session"
            >
              <RotateCcw size={11} />
            </button>
          </div>
        )}

        {/* Global Search Trigger (Command Palette) */}
        <button
          onClick={() => {
            window.dispatchEvent(
              new KeyboardEvent('keydown', { key: 'k', metaKey: true })
            );
          }}
          className="flex items-center gap-2 px-2.5 py-1 text-xs font-sans text-theme-secondary hover:text-theme-primary bg-theme-raised border hairline-border rounded-control transition-colors duration-100 focus-ring"
          title="Search actions and pages (⌘K)"
        >
          <Search size={13} strokeWidth={1.5} className="text-theme-tertiary" />
          <span className="hidden sm:inline">Search...</span>
          <kbd className="px-1.5 py-0.2 bg-theme-surface border border-theme-border rounded-control font-mono text-[10px] text-theme-tertiary font-medium">
            ⌘K
          </kbd>
        </button>

        {/* Notifications Popover */}
        <NotificationCenter />

        {/* Theme Toggle (Dark / Light) */}
        <button
          onClick={toggleTheme}
          className="p-1.5 rounded-control text-theme-secondary hover:text-theme-primary hover:bg-theme-raised transition-colors focus-ring"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode (T)`}
          aria-label="Toggle dark/light theme"
        >
          {theme === 'dark' ? (
            <Sun size={16} strokeWidth={1.5} />
          ) : (
            <Moon size={16} strokeWidth={1.5} />
          )}
        </button>

        {/* User Profile Menu */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button
              className="flex items-center gap-2 pl-2 pr-1.5 py-1 rounded-control bg-theme-raised border hairline-border hover:bg-theme-border transition-colors focus-ring"
              aria-label="User profile menu"
            >
              <div className="w-5 h-5 rounded-full bg-accent/20 border border-accent/40 text-accent font-mono text-[10px] font-bold flex items-center justify-center">
                {profile?.displayName
                  ? profile.displayName.split(' ').map((n) => n[0]).join('').slice(0, 2)
                  : 'EM'}
              </div>
              <span className="text-xs font-sans font-medium text-theme-primary hidden md:inline truncate max-w-[140px]">
                {profile?.displayName || (isDemo ? 'Demo User' : 'Sign in')}
              </span>
              <span className="px-1.5 py-0.2 rounded-xs bg-theme-surface border hairline-border text-[9px] font-mono text-accent uppercase font-bold hidden lg:inline">
                {getRoleBadge(profile?.approvedRole)}
              </span>
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              align="end"
              className="z-50 min-w-[220px] p-1.5 bg-theme-raised border hairline-border rounded-panel shadow-2xl text-xs font-sans"
            >
              <div className="px-3 py-2 border-b border-theme-subtle">
                <div className="font-semibold text-theme-primary truncate">
                  {profile?.displayName || (isDemo ? 'Guest Demo Session' : 'Workspace Session')}
                </div>
                <div className="text-[10px] font-mono text-theme-tertiary truncate">
                  {profile?.email || (isDemo ? 'demo@sample.internal' : '')}
                </div>
                <div className="text-[10px] text-accent mt-0.5 truncate">
                  {profile?.companyName || 'Nexus Global'} • {profile?.teamName || 'Engineering'}
                </div>
              </div>

              <div className="py-1">
                <DropdownMenu.Item
                  onClick={() => router.push('/dashboard/employee')}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-control cursor-pointer select-none text-theme-secondary hover:text-theme-primary hover:bg-theme-surface transition-colors"
                >
                  <User size={13} strokeWidth={1.5} />
                  <span>Employee Sanctuary</span>
                </DropdownMenu.Item>

                <DropdownMenu.Item
                  onClick={() => router.push('/dashboard/manager')}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-control cursor-pointer select-none text-theme-secondary hover:text-theme-primary hover:bg-theme-surface transition-colors"
                >
                  <User size={13} strokeWidth={1.5} />
                  <span>Delivery Manager View</span>
                </DropdownMenu.Item>

                <DropdownMenu.Item
                  onClick={() => router.push('/dashboard/hr')}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-control cursor-pointer select-none text-theme-secondary hover:text-theme-primary hover:bg-theme-surface transition-colors"
                >
                  <Building size={13} strokeWidth={1.5} />
                  <span>HRBP Operations</span>
                </DropdownMenu.Item>

                <DropdownMenu.Item
                  onClick={() => router.push('/dashboard/director')}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-control cursor-pointer select-none text-theme-secondary hover:text-theme-primary hover:bg-theme-surface transition-colors"
                >
                  <Shield size={13} strokeWidth={1.5} />
                  <span>Leadership Scorecard</span>
                </DropdownMenu.Item>

                <DropdownMenu.Item
                  onClick={() => router.push('/dashboard/admin')}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-control cursor-pointer select-none text-theme-secondary hover:text-theme-primary hover:bg-theme-surface transition-colors"
                >
                  <Settings size={13} strokeWidth={1.5} />
                  <span>Company Admin & IAM</span>
                </DropdownMenu.Item>
              </div>

              <div className="pt-1 border-t border-theme-subtle">
                {isDemo ? (
                  <DropdownMenu.Item
                    onClick={resetDemo}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-control cursor-pointer select-none text-danger hover:bg-danger/10 transition-colors"
                  >
                    <RotateCcw size={13} strokeWidth={1.5} />
                    <span>Reset & Exit Demo</span>
                  </DropdownMenu.Item>
                ) : (
                  <DropdownMenu.Item
                    onClick={signOutUser}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-control cursor-pointer select-none text-danger hover:bg-danger/10 transition-colors"
                  >
                    <LogOut size={13} strokeWidth={1.5} />
                    <span>Sign Out</span>
                  </DropdownMenu.Item>
                )}
              </div>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </header>
  );
}
