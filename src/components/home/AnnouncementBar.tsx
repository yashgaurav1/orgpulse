'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, X } from 'lucide-react';

export function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    const isDismissed = localStorage.getItem('pulse_announcement_dismissed');
    if (!isDismissed) {
      setDismissed(false);
    }
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem('pulse_announcement_dismissed', 'true');
  };

  if (dismissed) return null;

  return (
    <div
      role="region"
      aria-label="Announcement"
      className="relative z-50 bg-[#F8F7F4] text-[#0B1B33] border-b border-[#E8E6E1] dark:bg-[#0A2347] dark:text-[#EAF0F8] dark:border-[#1F3F6E] transition-colors py-2 px-4"
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3 text-xs font-sans">
        <div className="flex-1 flex items-center justify-center gap-2.5 text-center min-w-0">
          <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#2E8EBF]/15 text-[#1D6F9F] dark:text-[#4AA3D6] uppercase tracking-wider">
            New
          </span>
          <a
            href="#privacy"
            className="group inline-flex items-center gap-1 font-medium hover:text-[#1D6F9F] dark:hover:text-[#4AA3D6] transition-colors truncate"
          >
            <span>Anonymous by design: minimum group of 5</span>
            <ChevronRight
              size={13}
              className="chevron-nudge transition-transform group-hover:translate-x-0.5"
            />
          </a>
        </div>

        <button
          onClick={handleDismiss}
          className="p-1 rounded-control text-[#5C6778] hover:text-[#0B1B33] dark:text-[#9FB2CC] dark:hover:text-white transition-colors focus-ring"
          aria-label="Dismiss announcement"
          title="Dismiss announcement"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
