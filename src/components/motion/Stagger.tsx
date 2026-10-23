'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  MOTION_DISTANCES,
  MOTION_DURATIONS,
  MOTION_EASINGS,
  MOTION_STAGGER,
  MotionDistanceKey,
  checkPrefersReducedMotion,
  getStaggerDelay,
} from '@/lib/motion/tokens';

export interface StaggerProps {
  children: React.ReactNode;
  stepMs?: number;
  maxItems?: number;
  distance?: MotionDistanceKey;
  className?: string;
  as?: React.ElementType;
}

/**
 * <Stagger>
 * Staggers children entrance using token step (60ms), capped at max 8 items.
 * Subsequent items appear alongside the 8th item.
 * Respects prefers-reduced-motion.
 */
export function Stagger({
  children,
  stepMs = MOTION_STAGGER.step,
  maxItems = MOTION_STAGGER.maxItems,
  distance = 'reveal',
  className = '',
  as: Component = 'div',
}: StaggerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
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
      { threshold: 0.05 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const distancePx = MOTION_DISTANCES[distance];
  const durationMs = MOTION_DURATIONS.base;
  const easing = MOTION_EASINGS.standard;

  const childArray = React.Children.toArray(children);

  return (
    <Component ref={containerRef} className={className}>
      {childArray.map((child, index) => {
        const delay = getStaggerDelay(index, stepMs, maxItems);
        const style: React.CSSProperties = reducedMotion
          ? { opacity: 1, transform: 'none' }
          : {
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : `translateY(${distancePx}px)`,
              transition: `opacity ${durationMs}ms ${easing} ${delay}ms, transform ${durationMs}ms ${easing} ${delay}ms`,
            };

        return (
          <div key={index} style={style}>
            {child}
          </div>
        );
      })}
    </Component>
  );
}
