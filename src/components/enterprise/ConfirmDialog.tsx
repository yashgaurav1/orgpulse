'use client';

import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'primary';
  onConfirm: () => void;
  isLoading?: boolean;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Confirm Action',
  cancelLabel = 'Cancel',
  variant = 'danger',
  onConfirm,
  isLoading = false,
}: ConfirmDialogProps) {
  const isDanger = variant === 'danger';

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity duration-150" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-theme-surface border hairline-border rounded-panel p-6 shadow-2xl focus-ring">
          <div className="flex items-start gap-3">
            <div
              className={`p-2 rounded-control flex-shrink-0 ${
                isDanger
                  ? 'bg-danger/10 text-danger border border-danger/20'
                  : 'bg-warning/10 text-warning border border-warning/20'
              }`}
            >
              <AlertTriangle size={18} strokeWidth={1.5} />
            </div>

            <div className="flex-1 min-w-0">
              <Dialog.Title className="text-base font-semibold tracking-[-0.02em] text-theme-primary">
                {title}
              </Dialog.Title>
              <Dialog.Description className="mt-1 text-xs text-theme-secondary font-sans leading-relaxed">
                {description}
              </Dialog.Description>
            </div>

            <Dialog.Close
              className="p-1 rounded-control text-theme-secondary hover:text-theme-primary hover:bg-theme-raised transition-colors focus-ring"
              aria-label="Close dialog"
            >
              <X size={14} strokeWidth={1.5} />
            </Dialog.Close>
          </div>

          <div className="mt-6 flex items-center justify-end gap-2 text-xs font-mono">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="px-3 py-1.5 rounded-control text-theme-secondary hover:text-theme-primary bg-theme-raised border hairline-border transition-colors focus-ring"
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              onClick={() => {
                onConfirm();
                onOpenChange(false);
              }}
              disabled={isLoading}
              className={`px-3 py-1.5 rounded-control font-medium text-white transition-colors focus-ring ${
                isDanger
                  ? 'bg-danger hover:bg-danger/90'
                  : 'bg-accent hover:bg-accent-hover'
              }`}
            >
              {isLoading ? 'Processing...' : confirmLabel}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
