import React from 'react';
import { Button } from './Button';

export interface ErrorStateProps {
  title?: string;
  message: string;
  code?: string;
  remediation?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = 'Operational Diagnostic Notice',
  message,
  code,
  remediation,
  onRetry,
  className = '',
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={`border-l-2 border-l-terracotta bg-surface border border-ink/10 p-6 space-y-4 max-w-xl ${className}`}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="font-mono text-xs font-semibold uppercase tracking-wider text-terracotta">
          {title}
        </span>
        {code && (
          <span className="font-mono text-[10px] text-slate bg-ink/5 px-1.5 py-0.5">
            ERR: {code}
          </span>
        )}
      </div>

      <p className="font-sans text-sm text-ink leading-relaxed">{message}</p>

      {remediation && (
        <div className="p-3 bg-paper border border-ink/10 text-xs font-sans text-slate space-y-1">
          <p className="font-mono text-[10px] uppercase tracking-wider text-ink font-semibold">
            Suggested Remediation:
          </p>
          <p className="leading-relaxed">{remediation}</p>
        </div>
      )}

      {onRetry && (
        <div className="pt-1">
          <Button variant="secondary" size="sm" onClick={onRetry}>
            Retry Request
          </Button>
        </div>
      )}
    </div>
  );
}
