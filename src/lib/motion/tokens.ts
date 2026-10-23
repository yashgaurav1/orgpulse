/**
 * Pulse Motion System: Single Source of Truth
 * 
 * Rules:
 * 1. Durations: instant 120ms, fast 220ms, base 400ms, slow 700ms.
 * 2. Easings: standard cubic-bezier(.2,.7,.2,1); exit cubic-bezier(.4,0,1,1).
 * 3. Distances: 12px rise for reveals, 8px for small elements.
 * 4. Stagger: step 60ms, max 8 items staggered, rest appear together.
 * 5. Respects prefers-reduced-motion everywhere.
 */

export const MOTION_DURATIONS = {
  instant: 120, // ms - micro-interactions, scale, tooltips
  fast: 220,    // ms - dialog enter, toasts enter, tab shifts
  base: 400,    // ms - card reveals, accordions, bar fills
  slow: 700,    // ms - sparkline path draw, hero motifs
} as const;

export type MotionDurationKey = keyof typeof MOTION_DURATIONS;

export const MOTION_EASINGS = {
  standard: 'cubic-bezier(0.2, 0.7, 0.2, 1)',
  exit: 'cubic-bezier(0.4, 0, 1, 1)',
  linear: 'linear',
} as const;

export type MotionEasingKey = keyof typeof MOTION_EASINGS;

export const MOTION_DISTANCES = {
  reveal: 12, // px - card and section reveals
  small: 8,   // px - tags, flags, badges, dropdowns
} as const;

export type MotionDistanceKey = keyof typeof MOTION_DISTANCES;

export const MOTION_STAGGER = {
  step: 60,   // ms between consecutive items
  maxItems: 8, // items 0..7 staggered, >=8 grouped together
} as const;

/**
 * Calculates stagger delay for index capped at maxItems
 */
export function getStaggerDelay(
  index: number,
  step: number = MOTION_STAGGER.step,
  max: number = MOTION_STAGGER.maxItems
): number {
  const cappedIndex = Math.min(Math.max(0, index), max - 1);
  return cappedIndex * step;
}

export const MOTION_TOKENS = {
  durations: MOTION_DURATIONS,
  easings: MOTION_EASINGS,
  distances: MOTION_DISTANCES,
  stagger: MOTION_STAGGER,
} as const;

/**
 * Checks whether user prefers reduced motion in browser
 */
export function checkPrefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Generates transition style string using motion tokens
 */
export function createTransition(
  properties: string | string[],
  durationKey: MotionDurationKey = 'base',
  easingKey: MotionEasingKey = 'standard',
  delayMs = 0
): string {
  const duration = MOTION_DURATIONS[durationKey];
  const easing = MOTION_EASINGS[easingKey];
  const props = Array.isArray(properties) ? properties : [properties];
  return props
    .map((p) => `${p} ${duration}ms ${easing} ${delayMs}ms`)
    .join(', ');
}
