import React from 'react';

export interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'rule' | 'accent' | 'sunken' | 'bordered';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function Panel({
  variant = 'rule',
  padding = 'md',
  className = '',
  children,
  ...props
}: PanelProps) {
  const paddingStyles = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-6',
    lg: 'p-8',
  };

  const variantStyles = {
    rule: 'border-y border-ink/10 bg-transparent',
    accent: 'border-l-2 border-l-terracotta border-y-0 border-r-0 bg-transparent pl-4',
    sunken: 'bg-surface border border-ink/10',
    bordered: 'border border-ink/15 bg-paper',
  };

  return (
    <section className={`max-w-full overflow-hidden ${variantStyles[variant]} ${paddingStyles[padding]} ${className}`} {...props}>
      {children}
    </section>
  );
}
