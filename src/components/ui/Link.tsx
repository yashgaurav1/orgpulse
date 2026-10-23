import React from 'react';
import NextLink from 'next/link';

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  external?: boolean;
  variant?: 'inline' | 'standalone' | 'nav';
  children: React.ReactNode;
}

export function Link({
  href,
  external = false,
  variant = 'inline',
  className = '',
  children,
  ...props
}: LinkProps) {
  const baseStyles =
    'transition-colors duration-120 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink';

  const variantStyles = {
    inline:
      'font-sans text-ink underline underline-offset-4 decoration-ink/30 hover:decoration-terracotta hover:text-terracotta',
    standalone:
      'font-mono text-xs text-ink hover:text-terracotta inline-flex items-center gap-1 font-medium',
    nav: 'font-mono text-xs uppercase tracking-wider text-slate hover:text-ink',
  };

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseStyles} ${variantStyles[variant]} ${className}`}
        {...props}
      >
        <span>{children}</span>
        <span className="font-mono text-[10px] text-slate inline-block" aria-hidden="true">
          &nearr;
        </span>
      </a>
    );
  }

  return (
    <NextLink href={href} className={`${baseStyles} ${variantStyles[variant]} ${className}`} {...props}>
      {children}
    </NextLink>
  );
}
