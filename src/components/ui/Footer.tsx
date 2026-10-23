import React from 'react';
import NextLink from 'next/link';

export interface FooterProps {
  className?: string;
}

export function Footer({ className = '' }: FooterProps) {
  return (
    <footer
      className={`border-t border-ink/10 pt-8 pb-12 mt-16 text-slate font-sans text-xs space-y-6 ${className}`}
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-ink text-sm tracking-tight">Pulse</span>
            <span className="font-mono text-[10px] uppercase tracking-wider text-slate bg-ink/5 px-1.5 py-0.5 border border-ink/10">
              Annual Report Edition
            </span>
          </div>
          <p className="text-slate/80 text-[11px] leading-relaxed max-w-md">
            Anonymous quarterly engineering engagement diagnostic platform for IT delivery squads.
          </p>
        </div>

        <nav aria-label="Footer Navigation" className="flex flex-wrap gap-4 font-mono text-[11px]">
          <NextLink href="/" className="hover:text-ink transition-colors">
            Home
          </NextLink>
          <NextLink href="/dashboard/manager" className="hover:text-ink transition-colors">
            Manager View
          </NextLink>
          <NextLink href="/dashboard/hr" className="hover:text-ink transition-colors">
            HR View
          </NextLink>
          <NextLink href="/dev/components" className="hover:text-ink transition-colors text-terracotta">
            Component System &rarr;
          </NextLink>
        </nav>
      </div>

      <div className="pt-4 border-t border-ink/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px] text-slate/70">
        <p>
          Privacy notice shown before the survey. Legal review required before real use.
        </p>
        <p className="font-mono text-[10px]">
          SAMPLE DATA &bull; ZERO PII PERSISTENCE
        </p>
      </div>
    </footer>
  );
}
