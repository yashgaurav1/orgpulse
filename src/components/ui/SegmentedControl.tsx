'use client';

import React, { useRef, useEffect, useState } from 'react';
import { LucideIcon } from 'lucide-react';

export interface SegmentedControlItem {
  id: string;
  label: string;
  icon?: LucideIcon;
  badge?: string;
}

interface SegmentedControlProps {
  items: SegmentedControlItem[];
  activeId: string;
  onChange: (id: string) => void;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
  'aria-label'?: string;
}

export function SegmentedControl({
  items,
  activeId,
  onChange,
  size = 'md',
  fullWidth = false,
  className = '',
  'aria-label': ariaLabel = 'Segmented options',
}: SegmentedControlProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [thumbStyle, setThumbStyle] = useState<{ width: number; transform: string }>({
    width: 0,
    transform: 'translateX(0px)',
  });

  // Calculate sliding thumb geometry
  useEffect(() => {
    if (!containerRef.current) return;
    const activeIndex = items.findIndex((item) => item.id === activeId);
    if (activeIndex === -1) return;

    const buttons = containerRef.current.querySelectorAll<HTMLButtonElement>('button[role="tab"]');
    const activeButton = buttons[activeIndex];

    if (activeButton) {
      setThumbStyle({
        width: activeButton.offsetWidth,
        transform: `translateX(${activeButton.offsetLeft}px)`,
      });
    }
  }, [activeId, items]);

  // Arrow key keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = (index + 1) % items.length;
      onChange(items[nextIndex].id);
      const buttons = containerRef.current?.querySelectorAll<HTMLButtonElement>('button[role="tab"]');
      buttons?.[nextIndex]?.focus();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = (index - 1 + items.length) % items.length;
      onChange(items[prevIndex].id);
      const buttons = containerRef.current?.querySelectorAll<HTMLButtonElement>('button[role="tab"]');
      buttons?.[prevIndex]?.focus();
    }
  };

  const heightClass = size === 'sm' ? 'h-9 text-xs' : size === 'lg' ? 'h-12 text-sm' : 'h-11 text-xs';

  return (
    <div
      ref={containerRef}
      role="tablist"
      aria-label={ariaLabel}
      className={`relative inline-flex items-center p-1 rounded-control bg-[#F8F7F4] dark:bg-[#0A2347] border border-[#E8E6E1] dark:border-[#1F3F6E] select-none ${
        fullWidth ? 'w-full' : ''
      } ${className}`}
    >
      {/* Sliding Thumb (CSS transform only) */}
      <div
        className="absolute top-1 bottom-1 rounded-[10px] bg-white dark:bg-[#11305C] shadow-xs border border-[#E8E6E1] dark:border-[#1F3F6E] transition-all duration-200 ease-[cubic-bezier(0.2,0.7,0.2,1)] pointer-events-none"
        style={{
          width: thumbStyle.width ? `${thumbStyle.width}px` : 'auto',
          transform: thumbStyle.transform,
        }}
        aria-hidden="true"
      />

      {items.map((item, index) => {
        const isActive = item.id === activeId;
        const Icon = item.icon;

        return (
          <button
            key={item.id}
            role="tab"
            type="button"
            aria-selected={isActive}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(item.id)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={`relative z-10 flex-1 inline-flex items-center justify-center gap-2 px-3.5 font-sans font-medium transition-colors focus-ring rounded-[10px] whitespace-nowrap ${heightClass} ${
              isActive
                ? 'text-[#03173B] dark:text-white font-semibold'
                : 'text-[#5C6778] dark:text-[#9FB2CC] hover:text-[#0B1B33] dark:hover:text-white'
            }`}
          >
            {Icon && <Icon size={14} className={isActive ? 'text-[#1D6F9F] dark:text-[#4AA3D6]' : ''} />}
            <span>{item.label}</span>
            {item.badge && (
              <span
                className={`ml-1 px-1.5 py-0.2 rounded-full font-mono text-[10px] font-bold ${
                  isActive
                    ? 'bg-[#2E8EBF]/15 text-[#1D6F9F] dark:text-[#4AA3D6]'
                    : 'bg-black/5 dark:bg-white/10 text-[#5C6778] dark:text-[#9FB2CC]'
                }`}
              >
                {item.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
