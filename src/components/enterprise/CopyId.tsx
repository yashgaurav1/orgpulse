'use client';

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyIdProps {
  id: string;
  prefix?: string;
  truncate?: boolean;
  className?: string;
}

export function CopyId({
  id,
  prefix,
  truncate = false,
  className = '',
}: CopyIdProps) {
  const [copied, setCopied] = useState(false);

  const displayId = truncate && id.length > 12 ? `${id.slice(0, 6)}...${id.slice(-4)}` : id;

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(id);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Fallback
    }
  };

  return (
    <button
      onClick={handleCopy}
      title="Click to copy ID"
      aria-label={`Copy ID ${id}`}
      className={`inline-flex items-center gap-1.5 font-mono text-[11px] tabular-nums text-theme-secondary hover:text-theme-primary px-1.5 py-0.5 rounded-control transition-colors duration-100 hover:bg-theme-surface focus-ring ${className}`}
    >
      {prefix && <span className="text-theme-tertiary">{prefix}</span>}
      <span>{displayId}</span>
      {copied ? (
        <span className="inline-flex items-center gap-0.5 text-success">
          <Check size={12} strokeWidth={2} />
          <span className="text-[10px] uppercase font-sans">Copied</span>
        </span>
      ) : (
        <Copy size={12} strokeWidth={1.5} className="opacity-40 hover:opacity-100" />
      )}
    </button>
  );
}
