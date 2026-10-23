'use client';

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Shield,
  FileSpreadsheet,
  Palette,
  BookOpen,
  Calendar,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Sparkles,
  Bot,
  Settings,
  Heart,
  LucideIcon,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../lib/auth-context';

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    title: 'Platform',
    items: [
      { id: 'home', label: 'Platform Overview', href: '/', icon: LayoutDashboard },
      { id: 'companion', label: 'Companion Bot Catalog', href: '/dashboard/companion', icon: Bot, badge: '6 Bots' },
      { id: 'survey-demo', label: 'Confidential Survey', href: '/survey/demo-token-payments', icon: ExternalLink, badge: 'N ≥ 5' },
    ],
  },
  {
    title: 'Role Workspaces',
    items: [
      { id: 'employee', label: 'Employee Sanctuary', href: '/dashboard/employee', icon: Heart, badge: 'Private' },
      { id: 'manager', label: 'Manager Dashboard', href: '/dashboard/manager', icon: Users },
      { id: 'hr', label: 'HRBP Operations & Triage', href: '/dashboard/hr', icon: FileSpreadsheet },
      { id: 'director', label: 'Leadership Scorecard', href: '/dashboard/director', icon: Shield },
      { id: 'admin', label: 'Company Admin & IAM', href: '/dashboard/admin', icon: Settings, badge: 'Key' },
    ],
  },
  {
    title: 'Governance & Library',
    items: [
      { id: 'stay', label: 'Stay Interview Toolkit', href: '/library/stay-interview', icon: MessageSquare },
      { id: 'conduct', label: 'Conduct & Non-Retaliation', href: '/library/conduct-guide', icon: BookOpen },
      { id: 'pilot', label: '90-Day Pilot Plan', href: '/library/pilot-plan', icon: Calendar },
    ],
  },
  {
    title: 'Design System',
    items: [
      { id: 'components', label: 'Enterprise Primitives', href: '/dev/components', icon: Palette, badge: '20' },
      { id: 'brand', label: 'Brand Identity & Spec', href: '/dev/brand', icon: Sparkles, badge: 'New' },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { profile, isDemo } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`relative flex-shrink-0 bg-[#03173B] text-white border-r border-[#0D2550] flex flex-col transition-all duration-200 select-none z-30 ${
        collapsed ? 'w-[60px]' : 'w-[245px]'
      }`}
    >
      {/* Brand Header */}
      <div className="h-12 border-b border-[#0D2550] flex items-center justify-between px-3 bg-[#03173B]">
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2.5 min-w-0 text-left focus-ring rounded-control p-1 hover:opacity-90 transition-opacity"
          aria-label="Pulse Home"
        >
          {collapsed ? (
            <img
              src="/brand/mark.svg"
              alt="Pulse Mark"
              className="w-7 h-7 object-contain"
            />
          ) : (
            <img
              src="/brand/horizontal.svg"
              alt="Pulse"
              className="h-6 w-auto object-contain"
            />
          )}
        </button>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-control text-[#9FB2CC] hover:text-white hover:bg-white/10 transition-colors focus-ring"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <ChevronRight size={14} strokeWidth={1.5} />
          ) : (
            <ChevronLeft size={14} strokeWidth={1.5} />
          )}
        </button>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
        {NAV_SECTIONS.map((section) => (
          <div key={section.title} className="space-y-1">
            {!collapsed && (
              <div className="px-2 py-1 text-[10px] font-mono uppercase tracking-[0.04em] text-[#6782A5]">
                {section.title}
              </div>
            )}

            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === '/'
                  ? pathname === '/'
                  : pathname?.startsWith(item.href);

              return (
                <button
                  key={item.id}
                  onClick={() => router.push(item.href)}
                  title={collapsed ? item.label : undefined}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-control text-xs font-medium transition-colors duration-100 group focus-ring relative ${
                    isActive
                      ? 'bg-[#2E8EBF]/20 text-[#4AA3D6] font-semibold'
                      : 'text-[#9FB2CC] hover:text-white hover:bg-white/5'
                  }`}
                >
                  {/* Active Indicator bar */}
                  {isActive && (
                    <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] bg-[#2E8EBF] rounded-r-xs" />
                  )}

                  <Icon
                    size={16}
                    strokeWidth={1.5}
                    className={`flex-shrink-0 ${
                      isActive ? 'text-[#4AA3D6]' : 'text-[#9FB2CC] group-hover:text-white'
                    }`}
                  />

                  {!collapsed && (
                    <span className="truncate flex-1 text-left">
                      {item.label}
                    </span>
                  )}

                  {!collapsed && item.badge && (
                    <span
                      className={`px-1.5 py-0.2 rounded-control text-[9px] font-mono tracking-wider uppercase ${
                        isActive
                          ? 'bg-[#2E8EBF] text-white'
                          : 'bg-[#0A2347] text-[#9FB2CC] border border-[#1F3F6E]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Privacy Guarantee Status in Footer */}
      <div className="p-3 border-t border-[#0D2550] bg-[#00142E]/50">
        {!collapsed ? (
          <div className="p-2 rounded-control bg-[#00142E] border border-[#162C4E] space-y-1 text-[10px] font-mono">
            <div className="flex items-center gap-1.5 text-[#2DBE78] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2DBE78] animate-live-dot" />
              <span>N ≥ 5 Aggregation Safe</span>
            </div>
            <div className="text-[#6782A5]">
              Differencing & suppression shield active.
            </div>
          </div>
        ) : (
          <div className="flex justify-center" title="N ≥ 5 Aggregation Safe">
            <span className="w-2 h-2 rounded-full bg-[#2DBE78] animate-live-dot" />
          </div>
        )}
      </div>
    </aside>
  );
}
