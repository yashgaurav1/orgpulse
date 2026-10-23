'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Home } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-6">
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-control bg-accent/10 border border-accent/20 text-accent font-mono text-xs uppercase font-semibold">
        <span>Error 404 • Resource Not Found</span>
      </div>
      <h1 className="text-3xl sm:text-4xl font-serif font-bold text-theme-primary tracking-[-0.02em]">
        The diagnostic page you requested does not exist
      </h1>
      <p className="text-sm text-theme-secondary font-sans max-w-md mx-auto leading-relaxed">
        The route may have been archived, migrated to a new diagnostic cycle, or entered incorrectly.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3 pt-4 font-sans text-xs">
        <Link
          href="/"
          className="h-10 px-4 bg-accent hover:bg-accent-hover text-white rounded-control font-medium flex items-center gap-2 transition-colors focus-ring"
        >
          <Home size={14} />
          <span>Return Home</span>
        </Link>
        <Link
          href="/dashboard/manager"
          className="h-10 px-4 bg-theme-surface hover:bg-theme-raised border hairline-border text-theme-primary rounded-control font-medium flex items-center gap-2 transition-colors focus-ring"
        >
          <span>Open Manager Dashboard</span>
          <ArrowLeft size={14} className="rotate-180" />
        </Link>
      </div>
    </div>
  );
}
