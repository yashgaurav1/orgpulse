'use client';

import React from 'react';

export interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
  className?: string;
}

/**
 * <Skeleton>
 * Loading placeholder with a slow, subtle shimmer (1.6s, one direction).
 * Strictly confined to the Paper and Ink palette.
 * 
 * Note: Never used to conceal or represent suppressed privacy groups.
 */
export function Skeleton({
  width = '100%',
  height = '1rem',
  borderRadius = '2px',
  className = '',
}: SkeletonProps) {
  const widthStyle = typeof width === 'number' ? `${width}px` : width;
  const heightStyle = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      className={`motion-skeleton rounded-xs border border-ink/5 ${className}`}
      style={{
        width: widthStyle,
        height: heightStyle,
        borderRadius,
      }}
      aria-hidden="true"
    />
  );
}
