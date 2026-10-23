'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export function RouteLoadingBar() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Trigger quick loading bar on route change
    setLoading(true);
    setProgress(35);

    const timer1 = setTimeout(() => {
      setProgress(85);
    }, 80);

    const timer2 = setTimeout(() => {
      setProgress(100);
      setTimeout(() => {
        setLoading(false);
        setProgress(0);
      }, 150);
    }, 220);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [pathname]);

  if (!loading && progress === 0) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 h-[2px] bg-transparent pointer-events-none"
      role="progressbar"
      aria-label="Page loading"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full bg-accent transition-all duration-150 ease-out shadow-[0_0_8px_rgba(61,123,255,0.8)]"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
