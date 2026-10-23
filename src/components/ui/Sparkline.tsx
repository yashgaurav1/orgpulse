import React from 'react';
import { Sparkline as MotionSparkline } from '@/components/motion/Sparkline';

export interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  strokeColor?: string;
  suppressed?: boolean;
  className?: string;
}

export function Sparkline({
  data,
  width = 100,
  height = 28,
  strokeColor = '#1B1A17',
  suppressed = false,
  className = '',
}: SparklineProps) {
  if (suppressed) {
    return (
      <div className={`inline-flex items-center justify-center font-mono text-xs text-slate ${className}`} style={{ width, height }}>
        Hidden
      </div>
    );
  }

  return (
    <div className={`inline-block align-middle ${className}`}>
      <MotionSparkline
        data={data}
        width={width}
        height={height}
        strokeColor={strokeColor}
      />
    </div>
  );
}
