import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'terracotta' | 'sage' | 'slate' | 'amber' | 'paper';
  children?: React.ReactNode;
}

export function Badge({ variant = 'slate', className = '', children, ...props }: BadgeProps) {
  const variantStyles = {
    terracotta: 'bg-terracotta text-paper border-transparent',
    sage: 'bg-sage/40 text-ink border-sage/60',
    slate: 'bg-slate/15 text-slate border-slate/25',
    amber: 'bg-amber/15 text-amber border-amber/35',
    paper: 'bg-paper text-ink border-ink/20',
  };

  return (
    <span
      className={`inline-flex items-center font-mono text-[11px] uppercase tracking-wider font-medium px-2 py-0.5 rounded-none border ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
