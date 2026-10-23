import React from 'react';

export interface EmptyStateProps {
  title: string;
  description: string;
  badge?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  title,
  description,
  badge = 'No Results',
  action,
  className = '',
}: EmptyStateProps) {
  return (
    <div
      className={`border border-ink/10 bg-surface/50 p-8 sm:p-12 text-center max-w-xl mx-auto space-y-4 ${className}`}
    >
      <div className="flex justify-center">
        <span className="font-mono text-[10px] uppercase tracking-widest text-slate bg-ink/5 px-2 py-0.5 border border-ink/10">
          {badge}
        </span>
      </div>

      <div className="space-y-1.5">
        <h3 className="font-serif text-xl font-medium text-ink">{title}</h3>
        <p className="font-sans text-sm text-slate leading-relaxed max-w-md mx-auto">
          {description}
        </p>
      </div>

      {action && (
        <div className="pt-2">
          <button
            type="button"
            onClick={action.onClick}
            className="font-mono text-xs text-ink underline underline-offset-4 decoration-ink/30 hover:decoration-terracotta hover:text-terracotta"
          >
            {action.label} &rarr;
          </button>
        </div>
      )}
    </div>
  );
}
