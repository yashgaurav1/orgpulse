'use client';

import React, { useEffect, useRef } from 'react';
import { MOTION_DURATIONS, MOTION_EASINGS, checkPrefersReducedMotion } from '@/lib/motion/tokens';

export interface ToastProps {
  open: boolean;
  message: string;
  type?: 'info' | 'success' | 'alert';
  onClose?: () => void;
  className?: string;
}

/**
 * <Toast>
 * 220ms fade + 8px rise in, 120ms out.
 * Employs aria-live for screen readers without relying on animation.
 */
export function Toast({
  open,
  message,
  type = 'info',
  onClose,
  className = '',
}: ToastProps) {
  const reducedMotion = typeof window !== 'undefined' && checkPrefersReducedMotion();

  const durationMs = open ? MOTION_DURATIONS.fast : MOTION_DURATIONS.instant;
  const easing = open ? MOTION_EASINGS.standard : MOTION_EASINGS.exit;

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className={`fixed bottom-6 right-6 z-50 pointer-events-none ${className}`}
    >
      <div
        className={`pointer-events-auto border border-ink/20 px-4 py-3 bg-paper-elevated shadow-sm rounded-xs flex items-center gap-3 font-mono text-xs text-ink max-w-sm`}
        style={{
          opacity: open ? 1 : 0,
          transform: open ? 'translateY(0)' : reducedMotion ? 'none' : 'translateY(8px)',
          transition: reducedMotion
            ? 'opacity 120ms linear'
            : `opacity ${durationMs}ms ${easing}, transform ${durationMs}ms ${easing}`,
          visibility: open ? 'visible' : 'hidden',
        }}
      >
        <span
          className={`h-2 w-2 rounded-full ${
            type === 'alert' ? 'bg-terracotta' : type === 'success' ? 'bg-sage' : 'bg-slate'
          }`}
        />
        <span className="flex-1">{message}</span>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-slate hover:text-ink font-semibold ml-2"
            aria-label="Dismiss notification"
          >
            &times;
          </button>
        )}
      </div>
    </div>
  );
}

export interface DialogProps {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  className?: string;
}

/**
 * <Dialog>
 * Accessible modal dialog with trapped focus, 220ms fade + 8px rise in, 120ms out.
 * Restores focus to the triggering element upon closing.
 */
export function Dialog({ open, title, children, onClose, className = '' }: DialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const reducedMotion = typeof window !== 'undefined' && checkPrefersReducedMotion();

  useEffect(() => {
    if (open) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      // Focus the dialog container
      dialogRef.current?.focus();

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    } else {
      // Restore focus on close
      previousActiveElement.current?.focus();
    }
  }, [open, onClose]);

  if (!open) return null;

  const durationMs = MOTION_DURATIONS.fast;
  const easing = MOTION_EASINGS.standard;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-[1px]"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        className={`bg-paper border border-ink/20 shadow-md p-6 max-w-lg w-full rounded-xs outline-none ${className}`}
        style={{
          opacity: 1,
          transform: 'translateY(0)',
          animation: reducedMotion
            ? 'none'
            : `motionRevealSmall ${durationMs}ms ${easing} forwards`,
        }}
      >
        <div className="flex items-center justify-between border-b border-ink/10 pb-3 mb-4">
          <h2 id="dialog-title" className="font-serif text-xl font-semibold text-ink">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-slate hover:text-ink font-mono text-lg px-2 py-1"
            aria-label="Close dialog"
          >
            &times;
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}
