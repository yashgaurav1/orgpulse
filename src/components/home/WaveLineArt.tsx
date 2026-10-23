'use client';

import React, { useRef, useEffect, useState } from 'react';

const NUM_LINES = 36;
const NUM_POINTS = 160;
const CYCLE_DURATION_MS = 20000; // 20s full phase cycle
const TARGET_FRAME_MS = 1000 / 30; // 30 fps cap (~33.3ms)

// Color ramp pre-computation from #2E8EBF (rgb: 46, 142, 191) to #BFE0F0 (rgb: 191, 224, 240)
const LINE_COLORS: string[] = [];
for (let i = 0; i < NUM_LINES; i++) {
  const t = i / (NUM_LINES - 1);
  const r = Math.round(46 + (191 - 46) * t);
  const g = Math.round(142 + (224 - 142) * t);
  const b = Math.round(191 + (240 - 191) * t);
  const alpha = (0.35 + (0.9 - 0.35) * t).toFixed(3);
  LINE_COLORS.push(`rgba(${r}, ${g}, ${b}, ${alpha})`);
}

// 3 travelling bright segment configurations
const TRAVELLERS = [
  { lineIndex: 8, speed: 0.00015, color: 'rgba(255, 255, 255, 0.95)', len: 0.06 },
  { lineIndex: 18, speed: 0.00022, color: 'rgba(255, 255, 255, 0.95)', len: 0.06 },
  { lineIndex: 28, speed: 0.00012, color: 'rgba(255, 255, 255, 0.95)', len: 0.06 },
];

export function WaveLineArt() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animId: number | null = null;
    let isVisible = true;
    let isPaused = false;
    let width = 0;
    let height = 0;
    let dpr = 1;

    // Check reduced motion
    const prefersReducedMotion =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Check low-end device
    const isLowPower =
      typeof navigator !== 'undefined' &&
      navigator.hardwareConcurrency !== undefined &&
      navigator.hardwareConcurrency <= 4;

    // Pre-allocate point coordinate buffers to avoid per-frame GC allocations
    const xCoords = new Float32Array(NUM_POINTS);
    const yCoords = new Float32Array(NUM_POINTS);

    const updateDimensions = () => {
      if (!container || !canvas) return;
      const rect = container.getBoundingClientRect();
      width = Math.max(100, Math.floor(rect.width));
      height = Math.max(100, Math.floor(rect.height));
      dpr = Math.min(2, window.devicePixelRatio || 1);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      // Pre-fill X coordinates across line width
      for (let p = 0; p < NUM_POINTS; p++) {
        xCoords[p] = (p / (NUM_POINTS - 1)) * width;
      }
    };

    updateDimensions();

    let lastFrameTime = performance.now();
    let slowFrameStreak = 0;

    // Single static render frame function
    const renderFrame = (phase: number, timeMs: number) => {
      ctx.clearRect(0, 0, width, height);

      const baseline = height * 0.52;
      const baseAmp1 = height * 0.16;
      const baseAmp2 = height * 0.10;
      const k1 = 0.0042;
      const k2 = 0.0078;
      const offset = 0.075;

      for (let i = 0; i < NUM_LINES; i++) {
        const lineOffset = i * offset;
        const color = LINE_COLORS[i];

        ctx.beginPath();
        for (let p = 0; p < NUM_POINTS; p++) {
          const x = xCoords[p];
          // Taper amplitude at left and right margins to pinch into a fan
          const normX = x / width;
          const taper = Math.sin(Math.PI * Math.max(0, Math.min(1, normX)));

          const y =
            baseline +
            taper *
              (baseAmp1 * Math.sin(k1 * x + phase + lineOffset) +
                baseAmp2 * Math.sin(k2 * x - phase * 0.6 + lineOffset * 1.4));

          yCoords[p] = y;

          if (p === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Draw travelling bright segments if any match this curve
        for (let tIdx = 0; tIdx < TRAVELLERS.length; tIdx++) {
          const tr = TRAVELLERS[tIdx];
          if (tr.lineIndex === i) {
            const headPos = (timeMs * tr.speed) % 1.0;
            const startP = Math.floor(headPos * (NUM_POINTS - 1));
            const segCount = Math.floor(tr.len * NUM_POINTS);

            ctx.beginPath();
            let first = true;
            for (let s = 0; s < segCount; s++) {
              const pIdx = (startP + s) % NUM_POINTS;
              const sx = xCoords[pIdx];
              const sy = yCoords[pIdx];
              if (first) {
                ctx.moveTo(sx, sy);
                first = false;
              } else {
                ctx.lineTo(sx, sy);
              }
            }
            ctx.strokeStyle = tr.color;
            ctx.lineWidth = 1.8;
            ctx.stroke();
          }
        }
      }
    };

    // If reduced motion or low-power device, render one frame and halt
    if (prefersReducedMotion || isLowPower) {
      renderFrame(1.2, 0);
      return;
    }

    // Animation loop with 30fps cap
    const animate = (currentTime: number) => {
      if (isPaused || !isVisible) {
        animId = requestAnimationFrame(animate);
        return;
      }

      const elapsed = currentTime - lastFrameTime;
      if (elapsed >= TARGET_FRAME_MS) {
        const startCompute = performance.now();
        lastFrameTime = currentTime - (elapsed % TARGET_FRAME_MS);

        const phase = (currentTime / CYCLE_DURATION_MS) * (2 * Math.PI);
        renderFrame(phase, currentTime);

        const frameDuration = performance.now() - startCompute;
        if (frameDuration > 12) {
          slowFrameStreak++;
          if (slowFrameStreak >= 30) {
            // Main thread protection: stop loop and hold static frame
            isPaused = true;
            return;
          }
        } else {
          slowFrameStreak = Math.max(0, slowFrameStreak - 1);
        }
      }

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    // Pause when document tab is hidden
    const handleVisibilityChange = () => {
      isVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Pause when canvas is scrolled off-screen
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        isVisible = entry ? entry.isIntersecting : true;
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);

    // Debounced ResizeObserver
    let resizeTimer: NodeJS.Timeout | null = null;
    const resizeObserver = new ResizeObserver(() => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        updateDimensions();
        renderFrame((performance.now() / CYCLE_DURATION_MS) * (2 * Math.PI), performance.now());
      }, 100);
    });
    resizeObserver.observe(container);

    return () => {
      if (animId) cancelAnimationFrame(animId);
      if (resizeTimer) clearTimeout(resizeTimer);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      observer.disconnect();
      resizeObserver.disconnect();
    };
  }, [mounted]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none select-none overflow-hidden z-0"
      aria-hidden="true"
    >
      {/* Static SVG Fallback rendered initially for instantaneous 0-delay LCP */}
      {!mounted && (
        <svg
          className="w-full h-full opacity-70"
          viewBox="0 0 800 450"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {Array.from({ length: 18 }).map((_, i) => {
            const yOffset = (i - 9) * 8;
            return (
              <path
                key={i}
                d={`M 0,225 C 200,${160 + yOffset} 400,${280 - yOffset} 800,225`}
                fill="none"
                stroke="#2E8EBF"
                strokeWidth="1"
                strokeOpacity={0.25 + i * 0.03}
              />
            );
          })}
        </svg>
      )}

      {/* Primary Hardware-Accelerated Animation Canvas */}
      <canvas
        ref={canvasRef}
        className={`w-full h-full block transition-opacity duration-500 ${
          mounted ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
}
