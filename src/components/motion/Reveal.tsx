'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  MOTION_DISTANCES,
  MOTION_DURATIONS,
  MOTION_EASINGS,
  MotionDistanceKey,
  MotionDurationKey,
  checkPrefersReducedMotion,
} from '@/lib/motion/tokens';

export interface RevealProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  distance?: MotionDistanceKey;
  duration?: MotionDurationKey;
  delayMs?: number;
  className?: string;
  as?: React.ElementType;
}

/**
 * <Reveal>
 * Subtle fade + 12px (or 8px) rise on first view, triggered once via IntersectionObserver.
 * Respects prefers-reduced-motion (instant opacity, no transform).
 */
export function Reveal({
  children,
  distance = 'reveal',
  duration = 'base',
  delayMs = 0,
  className = '',
  as: Component = 'div',
  ...rest
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (checkPrefersReducedMotion()) {
      setReducedMotion(true);
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const distancePx = MOTION_DISTANCES[distance];
  const durationMs = MOTION_DURATIONS[duration];
  const easing = MOTION_EASINGS.standard;

  const style: React.CSSProperties = reducedMotion
    ? { opacity: 1, transform: 'none' }
    : {
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : `translateY(${distancePx}px)`,
        transition: `opacity ${durationMs}ms ${easing} ${delayMs}ms, transform ${durationMs}ms ${easing} ${delayMs}ms`,
        willChange: isVisible ? 'auto' : 'opacity, transform',
      };

  return (
    <Component ref={ref} style={style} className={className} {...rest}>
      {children}
    </Component>
  );
}
