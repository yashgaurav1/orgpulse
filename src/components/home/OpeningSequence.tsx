'use client';

import React, { useEffect, useState, useRef } from 'react';
import { checkPrefersReducedMotion } from '@/lib/motion/tokens';

export function OpeningSequence({ onComplete }: { onComplete?: () => void }) {
  const [stage, setStage] = useState<'drawing' | 'text' | 'lifting' | 'completed'>('drawing');
  const [hasCheckedSession, setHasCheckedSession] = useState(false);
  const skipButtonRef = useRef<HTMLButtonElement>(null);

  const handleSkip = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('pulse_intro_seen', 'true');
    }
    setStage('completed');
    onComplete?.();
  };

  useEffect(() => {
    // Check reduced motion or previous session play
    if (typeof window !== 'undefined') {
      const reducedMotion = checkPrefersReducedMotion();
      const alreadySeen = sessionStorage.getItem('pulse_intro_seen');

      if (reducedMotion || alreadySeen) {
        setStage('completed');
        setHasCheckedSession(true);
        onComplete?.();
        return;
      }

      setHasCheckedSession(true);
      skipButtonRef.current?.focus();
    }

    // Sequence timing
    // 0.0s: Initial lines start drawing
    // 1.4s: Wordmark & thesis fade in
    const t1 = setTimeout(() => {
      setStage('text');
    }, 1400);

    // 2.2s: Overlay lifts upward
    const t2 = setTimeout(() => {
      setStage('lifting');
    }, 2200);

    // 2.8s: Sequence completed and dismissed
    const t3 = setTimeout(() => {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('pulse_intro_seen', 'true');
      }
      setStage('completed');
      onComplete?.();
    }, 2800);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleSkip();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  if (!hasCheckedSession || stage === 'completed') {
    return null;
  }

  const isLifting = stage === 'lifting';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Pulse Opening Introduction"
      onClick={handleSkip}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-theme-bg text-theme-primary transition-transform duration-600 ease-[cubic-bezier(0.2,0,0,1)] select-none cursor-pointer"
      style={{
        transform: isLifting ? 'translateY(-100%)' : 'translateY(0)',
        pointerEvents: isLifting ? 'none' : 'auto',
      }}
    >
      {/* Skip Button */}
      <button
        ref={skipButtonRef}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          handleSkip();
        }}
        className="absolute top-6 right-6 font-mono text-xs uppercase tracking-wider text-theme-secondary hover:text-theme-primary px-3 py-1.5 border hairline-border bg-theme-surface rounded-control focus-ring z-10"
      >
        Skip &rarr;
      </button>

      <div className="max-w-md w-full px-6 flex flex-col items-center text-center space-y-6">
        {/* Animated Motif: Attrition vs Engagement Curves & Hairline Bracket */}
        <div className="w-64 h-32 relative">
          <svg
            viewBox="0 0 256 128"
            className="w-full h-full overflow-visible"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Center origin line */}
            <line
              x1="32"
              y1="64"
              x2="72"
              y2="64"
              stroke="#3D7BFF"
              strokeWidth="1.5"
              strokeDasharray="40"
              strokeDashoffset="0"
            />

            {/* Engagement curve */}
            <path
              d="M 72 64 Q 130 64 220 28"
              stroke="var(--text-secondary)"
              strokeWidth="1.5"
              strokeDasharray="180"
              strokeDashoffset="0"
              style={{
                animation: 'dashDraw 1.2s cubic-bezier(0.2, 0, 0, 1) forwards',
              }}
            />

            {/* Attrition curve */}
            <path
              d="M 72 64 Q 130 64 220 100"
              stroke="#3D7BFF"
              strokeWidth="1.5"
              strokeDasharray="180"
              strokeDashoffset="0"
              style={{
                animation: 'dashDraw 1.2s cubic-bezier(0.2, 0, 0, 1) forwards',
              }}
            />

            {/* Hairline bracket connecting the curves */}
            <path
              d="M 224 28 C 232 28, 232 60, 238 64 C 232 68, 232 100, 224 100"
              stroke="var(--text-tertiary)"
              strokeWidth="1"
              fill="none"
              strokeOpacity="0.6"
            />
          </svg>
        </div>

        {/* Wordmark and Thesis Reveal */}
        <div
          className={`space-y-2 transition-all duration-400 ease-[cubic-bezier(0.2,0,0,1)] ${
            stage === 'text' || stage === 'lifting'
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-3'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent" />
            <span className="text-2xl font-bold tracking-[-0.02em] font-mono text-theme-primary">
              Pulse Enterprise
            </span>
          </div>

          <p className="text-xs text-theme-secondary font-sans max-w-xs mx-auto leading-relaxed">
            Spot delivery friction before senior engineers quietly resign. Anonymous by design.
          </p>

          <div className="pt-2">
            <span className="inline-block px-2 py-0.5 rounded-control font-mono text-[10px] uppercase tracking-wider bg-accent/10 text-accent border border-accent/20">
              Section 18 Mathematical Shield
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
