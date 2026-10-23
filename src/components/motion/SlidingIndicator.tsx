'use client';

import React, { useEffect, useRef, useState } from 'react';
import { MOTION_DURATIONS, MOTION_EASINGS, checkPrefersReducedMotion } from '@/lib/motion/tokens';

export interface TabItem {
  id: string;
  label: string;
  badge?: string | number;
}

export interface SlidingIndicatorProps {
  tabs: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
  variant?: 'underline' | 'pill';
  className?: string;
}

/**
 * <SlidingIndicator>
 * An underline or pill that slides smoothly between tabs and segmented controls.
 * Moves exclusively using CSS transform: translateX(...), avoiding layout re-flows.
 */
export function SlidingIndicator({
  tabs,
  activeId,
  onChange,
  variant = 'underline',
  className = '',
}: SlidingIndicatorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const [indicatorStyle, setIndicatorStyle] = useState<{ left: number; width: number }>({
    left: 0,
    width: 0,
  });
  const [hasPositioned, setHasPositioned] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (checkPrefersReducedMotion()) {
      setReducedMotion(true);
    }

    const activeButton = buttonRefs.current.get(activeId);
    const container = containerRef.current;

    if (activeButton && container) {
      const containerRect = container.getBoundingClientRect();
      const buttonRect = activeButton.getBoundingClientRect();

      setIndicatorStyle({
        left: buttonRect.left - containerRect.left,
        width: buttonRect.width,
      });
      setHasPositioned(true);
    }
  }, [activeId, tabs]);

  const durationMs = MOTION_DURATIONS.fast;
  const easing = MOTION_EASINGS.standard;

  return (
    <div
      ref={containerRef}
      className={`relative inline-flex items-center gap-1 ${
        variant === 'pill' ? 'bg-paper-sunken p-1 rounded-xs border border-ink/10' : 'border-b border-ink/10'
      } ${className}`}
      role="tablist"
    >
      {/* Sliding Marker */}
      {hasPositioned && (
        <div
          className={`absolute pointer-events-none ${
            variant === 'pill'
              ? 'bg-paper border border-ink/15 shadow-xs top-1 bottom-1 rounded-xs'
              : 'bottom-0 h-[2px] bg-ink'
          }`}
          style={{
            width: `${indicatorStyle.width}px`,
            transform: `translateX(${indicatorStyle.left}px)`,
            transition: reducedMotion
              ? 'none'
              : `transform ${durationMs}ms ${easing}, width ${durationMs}ms ${easing}`,
          }}
          aria-hidden="true"
        />
      )}

      {/* Buttons */}
      {tabs.map((tab) => {
        const isActive = tab.id === activeId;
        return (
          <button
            key={tab.id}
            ref={(el) => {
              if (el) buttonRefs.current.set(tab.id, el);
              else buttonRefs.current.delete(tab.id);
            }}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={`relative z-10 px-3 py-1.5 font-mono text-xs transition-colors duration-120 ${
              isActive
                ? 'text-ink font-semibold'
                : 'text-slate hover:text-ink'
            }`}
          >
            {tab.label}
            {tab.badge !== undefined && (
              <span
                className={`ml-1.5 text-[10px] px-1.5 py-0.2 rounded-xs ${
                  isActive ? 'bg-ink text-paper' : 'bg-ink/10 text-slate'
                }`}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
