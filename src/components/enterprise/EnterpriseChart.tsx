'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';

export interface ChartDataPoint {
  label: string; // e.g. "Q1 '25" or "Squad A"
  value: number; // Primary series (e.g. Engagement)
  baseline?: number; // Secondary comparison series (e.g. Org Benchmark)
}

interface EnterpriseChartProps {
  title?: string;
  data: ChartDataPoint[];
  yMin?: number;
  yMax?: number;
  height?: number;
  valueFormatter?: (val: number) => string;
  seriesName?: string;
  baselineName?: string;
  className?: string;
}

export function EnterpriseChart({
  title,
  data,
  yMin = 1,
  yMax = 5,
  height = 200,
  valueFormatter = (val) => val.toFixed(2),
  seriesName = 'Score',
  baselineName = 'Benchmark',
  className = '',
}: EnterpriseChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const paddingLeft = 36;
  const paddingRight = 24;
  const paddingTop = 20;
  const paddingBottom = 30;
  const chartWidth = 600;
  const chartHeight = height;

  const innerWidth = chartWidth - paddingLeft - paddingRight;
  const innerHeight = chartHeight - paddingTop - paddingBottom;

  const getY = (val: number) => {
    const clamped = Math.max(yMin, Math.min(yMax, val));
    const ratio = (clamped - yMin) / (yMax - yMin);
    return paddingTop + innerHeight - ratio * innerHeight;
  };

  const getX = (idx: number) => {
    if (data.length <= 1) return paddingLeft + innerWidth / 2;
    return paddingLeft + (idx / (data.length - 1)) * innerWidth;
  };

  // Generate path data
  const linePoints = data.map((d, i) => `${getX(i)},${getY(d.value)}`).join(' ');
  const baselinePoints = data
    .filter((d) => d.baseline !== undefined)
    .map((d, i) => `${getX(i)},${getY(d.baseline!)}`)
    .join(' ');

  // Grid tick values
  const yTicks = [yMin, (yMin + yMax) / 2, yMax];

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const svgX = (clientX / rect.width) * chartWidth;

    // Find nearest point
    let closestIdx = 0;
    let minDistance = Infinity;

    data.forEach((_, i) => {
      const px = getX(i);
      const dist = Math.abs(px - svgX);
      if (dist < minDistance) {
        minDistance = dist;
        closestIdx = i;
      }
    });

    setHoverIndex(closestIdx);
  };

  const activePoint = hoverIndex !== null ? data[hoverIndex] : null;

  return (
    <div
      ref={containerRef}
      className={`relative p-4 rounded-panel bg-theme-surface border hairline-border ${className}`}
    >
      {title && (
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-theme-subtle">
          <span className="text-[12px] font-mono uppercase tracking-[0.04em] text-theme-tertiary">
            {title}
          </span>
          <div className="flex items-center gap-4 text-[11px] font-mono text-theme-secondary">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-0.5 bg-accent" />
              <span>{seriesName}</span>
            </span>
            {data.some((d) => d.baseline !== undefined) && (
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-0.5 bg-theme-tertiary border-t border-dashed border-theme-tertiary" />
                <span>{baselineName}</span>
              </span>
            )}
          </div>
        </div>
      )}

      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-auto block select-none overflow-visible"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoverIndex(null)}
        >
          {/* Minimal Gridlines */}
          {yTicks.map((tick) => {
            const y = getY(tick);
            return (
              <g key={tick}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={chartWidth - paddingRight}
                  y2={y}
                  stroke="var(--border-subtle)"
                  strokeWidth="1"
                  strokeDasharray={tick === yMin ? undefined : '3 3'}
                />
                <text
                  x={paddingLeft - 8}
                  y={y + 3}
                  textAnchor="end"
                  className="fill-theme-tertiary text-[10px] font-mono tabular-nums select-none"
                >
                  {tick.toFixed(1)}
                </text>
              </g>
            );
          })}

          {/* X Axis labels */}
          {data.map((d, i) => (
            <text
              key={d.label}
              x={getX(i)}
              y={chartHeight - 8}
              textAnchor="middle"
              className="fill-theme-tertiary text-[10px] font-mono select-none"
            >
              {d.label}
            </text>
          ))}

          {/* Baseline path if provided */}
          {baselinePoints && (
            <polyline
              fill="none"
              stroke="var(--text-tertiary)"
              strokeWidth="1.25"
              strokeDasharray="4 4"
              strokeOpacity="0.6"
              points={baselinePoints}
            />
          )}

          {/* Primary Trend Line with stroke draw-in */}
          <motion.polyline
            fill="none"
            stroke="#2E8EBF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={linePoints}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.2, 0, 0, 1] }}
          />

          {/* Interactive Crosshair & Tooltip */}
          {hoverIndex !== null && activePoint && (
            <g className="transition-all duration-75">
              {/* Vertical Crosshair Line */}
              <line
                x1={getX(hoverIndex)}
                y1={paddingTop}
                x2={getX(hoverIndex)}
                y2={chartHeight - paddingBottom}
                stroke="#2E8EBF"
                strokeWidth="1"
                strokeDasharray="2 2"
                strokeOpacity="0.8"
              />

              {/* Data Point Dot */}
              <circle
                cx={getX(hoverIndex)}
                cy={getY(activePoint.value)}
                r="4.5"
                fill="#2E8EBF"
                stroke="var(--surface)"
                strokeWidth="2"
              />

              {/* Baseline Dot if available */}
              {activePoint.baseline !== undefined && (
                <circle
                  cx={getX(hoverIndex)}
                  cy={getY(activePoint.baseline)}
                  r="3.5"
                  fill="var(--text-tertiary)"
                  stroke="var(--surface)"
                  strokeWidth="1.5"
                />
              )}
            </g>
          )}
        </svg>

        {/* Floating HTML Tooltip on Crosshair */}
        {hoverIndex !== null && activePoint && (
          <div
            className="absolute z-20 pointer-events-none px-2.5 py-1.5 rounded-control bg-theme-raised border hairline-border shadow-lg font-mono text-[11px] tabular-nums"
            style={{
              left: `${(getX(hoverIndex) / chartWidth) * 100}%`,
              top: `${(getY(activePoint.value) / chartHeight) * 100}%`,
              transform: 'translate(-50%, -125%)',
            }}
          >
            <div className="text-theme-secondary font-sans text-[10px] mb-0.5">
              {activePoint.label}
            </div>
            <div className="flex items-center gap-2 text-theme-primary font-semibold">
              <span className="text-accent">{seriesName}:</span>
              <span>{valueFormatter(activePoint.value)}</span>
            </div>
            {activePoint.baseline !== undefined && (
              <div className="flex items-center gap-2 text-theme-tertiary text-[10px]">
                <span>{baselineName}:</span>
                <span>{valueFormatter(activePoint.baseline)}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
