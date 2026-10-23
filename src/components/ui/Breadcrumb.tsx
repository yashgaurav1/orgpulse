import React from 'react';
import NextLink from 'next/link';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={`font-mono text-xs ${className}`}>
      <ol className="flex items-center flex-wrap gap-1.5 text-slate">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex items-center gap-1.5">
              {item.href && !isLast ? (
                <NextLink
                  href={item.href}
                  className="hover:text-ink transition-colors underline-offset-2 hover:underline"
                >
                  {item.label}
                </NextLink>
              ) : (
                <span className={isLast ? 'text-ink font-medium' : ''} aria-current={isLast ? 'page' : undefined}>
                  {item.label}
                </span>
              )}

              {!isLast && (
                <span className="text-slate/40 select-none" aria-hidden="true">
                  /
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
