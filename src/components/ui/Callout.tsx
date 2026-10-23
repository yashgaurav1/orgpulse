import React from 'react';

export interface CalloutProps {
  label?: string;
  variant?: 'terracotta' | 'sage' | 'slate' | 'amber';
  children: React.ReactNode;
  className?: string;
}

export function Callout({
  label,
  variant = 'terracotta',
  children,
  className = '',
}: CalloutProps) {
  const borderStyles = {
    terracotta: 'border-l-2 border-l-terracotta',
    sage: 'border-l-2 border-l-sage',
    slate: 'border-l-2 border-l-slate',
    amber: 'border-l-2 border-l-amber',
  };

  const badgeStyles = {
    terracotta: 'text-terracotta',
    sage: 'text-sage',
    slate: 'text-slate',
    amber: 'text-amber',
  };

  return (
    <aside
      className={`bg-surface border border-ink/10 ${borderStyles[variant]} p-4 sm:p-5 space-y-1.5 ${className}`}
    >
      {label && (
        <span
          className={`block font-mono text-[11px] uppercase tracking-wider font-semibold ${badgeStyles[variant]}`}
        >
          {label}
        </span>
      )}
      <div className="font-sans text-sm text-ink leading-relaxed space-y-2">
        {children}
      </div>
    </aside>
  );
}
