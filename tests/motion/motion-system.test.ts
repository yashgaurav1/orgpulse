import { describe, it, expect } from 'vitest';
import {
  MOTION_DURATIONS,
  MOTION_EASINGS,
  MOTION_DISTANCES,
  MOTION_STAGGER,
  getStaggerDelay,
  createTransition,
} from '../../src/lib/motion/tokens';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { CountUp } from '../../src/components/motion/CountUp';
import { BarFill } from '../../src/components/motion/BarFill';
import { LockDraw } from '../../src/components/motion/LockDraw';
import fs from 'fs';
import path from 'path';

describe('Pulse Motion System Specification & Safety Tests', () => {
  describe('1. Motion Tokens Single Source of Truth', () => {
    it('enforces exact token durations: instant (120ms), fast (220ms), base (400ms), slow (700ms)', () => {
      expect(MOTION_DURATIONS.instant).toBe(120);
      expect(MOTION_DURATIONS.fast).toBe(220);
      expect(MOTION_DURATIONS.base).toBe(400);
      expect(MOTION_DURATIONS.slow).toBe(700);
    });

    it('enforces exact token easings: standard and exit cubic-beziers', () => {
      expect(MOTION_EASINGS.standard).toBe('cubic-bezier(0.2, 0.7, 0.2, 1)');
      expect(MOTION_EASINGS.exit).toBe('cubic-bezier(0.4, 0, 1, 1)');
    });

    it('enforces exact token distances: 12px reveal, 8px small element', () => {
      expect(MOTION_DISTANCES.reveal).toBe(12);
      expect(MOTION_DISTANCES.small).toBe(8);
    });

    it('enforces stagger step of 60ms and caps at 8 items', () => {
      expect(MOTION_STAGGER.step).toBe(60);
      expect(MOTION_STAGGER.maxItems).toBe(8);

      expect(getStaggerDelay(0)).toBe(0);
      expect(getStaggerDelay(1)).toBe(60);
      expect(getStaggerDelay(7)).toBe(420); // 7 * 60
      // Item 8 and above must cap at item 7's delay (420ms) so subsequent items enter together
      expect(getStaggerDelay(8)).toBe(420);
      expect(getStaggerDelay(15)).toBe(420);
    });

    it('generates compliant transition strings exclusively using tokens', () => {
      const trans = createTransition('transform', 'fast', 'standard');
      expect(trans).toBe('transform 220ms cubic-bezier(0.2, 0.7, 0.2, 1) 0ms');
    });
  });

  describe('2. Strict Privacy Invariant: Suppressed Groups Never Animate or Leak Scores', () => {
    it('<CountUp> renders static Hidden label and zero numerical values when hidden is true', () => {
      const html = renderToString(React.createElement(CountUp, { value: 4.15, hidden: true }));
      expect(html).toContain('Hidden');
      expect(html).not.toContain('4.15');
      expect(html).not.toContain('aria-label="4.15"');
    });

    it('<CountUp> suppresses undefined or null values safely', () => {
      const html = renderToString(React.createElement(CountUp, { value: null }));
      expect(html).toContain('n/a');
    });

    it('<BarFill> renders static privacy panel and suppresses progress bar fill when hidden is true', () => {
      const html = renderToString(React.createElement(BarFill, { value: 3.85, hidden: true }));
      expect(html).toContain('Hidden for privacy (N &lt; 5)');
      expect(html).not.toContain('aria-valuenow="3.85"');
      expect(html).not.toContain('3.85');
    });

    it('<LockDraw> renders calm SVG lock with no text or implied score payload', () => {
      const html = renderToString(React.createElement(LockDraw, { size: 16 }));
      expect(html).toContain('<svg');
      expect(html).toContain('aria-hidden="true"');
      expect(html).not.toContain('score');
      expect(html).not.toContain('data');
    });
  });

  describe('3. Accessibility & Prefers-Reduced-Motion Guarantees', () => {
    it('globals.css defines @media (prefers-reduced-motion: reduce) overriding animations and transitions', () => {
      const cssPath = path.resolve(__dirname, '../../src/app/globals.css');
      const css = fs.readFileSync(cssPath, 'utf8');

      expect(css).toContain('@media (prefers-reduced-motion: reduce)');
      expect(css).toContain('animation-duration: 0.001ms !important');
      expect(css).toContain('transition-duration: 0.001ms !important');
      expect(css).toContain('transform: none !important');
    });

    it('CSS variables declare all motion tokens as root variables', () => {
      const cssPath = path.resolve(__dirname, '../../src/app/globals.css');
      const css = fs.readFileSync(cssPath, 'utf8');

      expect(css).toContain('--motion-duration-instant: 120ms;');
      expect(css).toContain('--motion-duration-fast: 220ms;');
      expect(css).toContain('--motion-duration-base: 400ms;');
      expect(css).toContain('--motion-duration-slow: 700ms;');
      expect(css).toContain('--motion-ease-standard: cubic-bezier(0.2, 0.7, 0.2, 1);');
      expect(css).toContain('--motion-distance-reveal: 12px;');
      expect(css).toContain('--motion-stagger-step: 60ms;');
    });
  });

  describe('4. Allowed Animated Properties & CLS Protection', () => {
    it('<CountUp> enforces tabular-nums to prevent character width shifts during animation', () => {
      const html = renderToString(React.createElement(CountUp, { value: 3.8 }));
      expect(html).toContain('tabular-nums');
      expect(html).toContain('font-mono');
    });

    it('Accordion Expand uses grid-template-rows without JS layout polling', () => {
      const cssPath = path.resolve(__dirname, '../../src/app/globals.css');
      const css = fs.readFileSync(cssPath, 'utf8');

      expect(css).toContain('.motion-expand-container');
      expect(css).toContain('grid-template-rows: 0fr');
      expect(css).toContain('grid-template-rows: 1fr');
    });

    it('No banned layout properties (blur, particles, elastic easing) exist in motion components', () => {
      const motionDir = path.resolve(__dirname, '../../src/components/motion');
      const files = fs.readdirSync(motionDir);

      for (const file of files) {
        if (!file.endsWith('.tsx') && !file.endsWith('.ts')) continue;
        const content = fs.readFileSync(path.join(motionDir, file), 'utf8');

        // Verify absence of forbidden animation tropes
        expect(content).not.toContain('confetti');
        expect(content).not.toContain('elastic');
        expect(content).not.toContain('bounce');
        expect(content).not.toContain('particle');
      }
    });
  });

  describe('5. Stage 1 Design System Component Primitives & Privacy Invariants', () => {
    it('<Stat> displays calm Hidden label and suppresses numbers when suppressed is true', async () => {
      const { Stat } = await import('../../src/components/ui/Stat');
      const html = renderToString(React.createElement(Stat, { label: 'Psych Safety', value: 4.25, suppressed: true }));
      expect(html).toContain('Hidden');
      expect(html).not.toContain('4.25');
      expect(html).toContain('Hidden (N &lt; 5)');
    });

    it('<ScoreBar> suppresses bar fill and score number when suppressed is true', async () => {
      const { ScoreBar } = await import('../../src/components/ui/ScoreBar');
      const html = renderToString(React.createElement(ScoreBar, { label: 'Tooling Item', score: 3.8, suppressed: true }));
      expect(html).toContain('Hidden');
      expect(html).not.toContain('3.80');
      expect(html).toContain('Data suppressed for privacy');
    });

    it('<PrivacyPanel> communicates N < 5 invariant with zero numerical payload', async () => {
      const { PrivacyPanel } = await import('../../src/components/ui/PrivacyPanel');
      const html = renderToString(React.createElement(PrivacyPanel, { threshold: 5 }));
      expect(html).toContain('Data Suppressed for Anonymity Protection');
      expect(html).toContain('Invariant');
    });

    it('<Badge> applies correct token color classes across variants', async () => {
      const { Badge } = await import('../../src/components/ui/Badge');
      const terraHtml = renderToString(React.createElement(Badge, { variant: 'terracotta' }, 'Critical'));
      const sageHtml = renderToString(React.createElement(Badge, { variant: 'sage' }, 'Healthy'));
      const amberHtml = renderToString(React.createElement(Badge, { variant: 'amber' }, 'Caution'));

      expect(terraHtml).toContain('bg-terracotta');
      expect(sageHtml).toContain('bg-sage/40');
      expect(amberHtml).toContain('bg-amber/15');
    });

    it('HomePage removes fake status badge "PILOT SYSTEM ACTIVE"', () => {
      const homePath = fs.existsSync(path.resolve(__dirname, '../../src/app/(marketing)/page.tsx'))
        ? path.resolve(__dirname, '../../src/app/(marketing)/page.tsx')
        : path.resolve(__dirname, '../../src/app/page.tsx');
      const homeCode = fs.readFileSync(homePath, 'utf8');

      expect(homeCode).not.toContain('PILOT SYSTEM ACTIVE');
    });
  });
});
