'use client';

import React, { useEffect, useState } from 'react';
import { checkPrefersReducedMotion } from '@/lib/motion/tokens';

export interface ScrollProgressProps {
  colorClass?: string;
  className?: string;
}

/**
 * <ScrollProgress>
 * 2px accent progress bar fixed to the top edge for long reading pages.
 * Updates smoothly using transform: scaleX(...) without triggering reflows.
 */
export function ScrollProgress({
  colorClass = 'bg-terracotta',
  className = '',
}: ScrollProgressProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (checkPrefersReducedMotion()) {
      return;
    }

    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const windowHeight =
        document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (windowHeight > 0) {
        setProgress(Math.min(Math.max(totalScroll / windowHeight, 0), 1));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className={`fixed top-0 left-0 right-0 h-[2px] z-50 pointer-events-none bg-ink/5 ${className}`}
      aria-hidden="true"
    >
      <div
        className={`h-full w-full ${colorClass}`}
        style={{
          transform: `scaleX(${progress})`,
          transformOrigin: 'left',
          transition: 'transform 60ms linear',
        }}
      />
    </div>
  );
}
