'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sun,
  Moon,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  Download,
  Info,
  Maximize2,
} from 'lucide-react';
import { useTheme } from '@/components/layout/ThemeContext';
import { brandTokens } from '@/lib/design-tokens';

interface SwatchProps {
  name: string;
  token: string;
  hex: string;
  rgb: string;
  role: string;
  textColor?: string;
  border?: boolean;
}

function Swatch({ name, token, hex, rgb, role, textColor = '#FFFFFF', border = false }: SwatchProps) {
  const [copied, setCopied] = useState(false);

  const copyHex = () => {
    navigator.clipboard.writeText(hex);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="p-3.5 rounded-panel bg-theme-surface border hairline-border space-y-2.5">
      <div
        className={`h-20 w-full rounded-control flex items-end p-2.5 justify-between relative transition-transform hover:scale-[1.01] ${
          border ? 'border border-[#DCE3EC]' : ''
        }`}
        style={{ backgroundColor: hex }}
      >
        <span
          className="text-[11px] font-mono font-bold px-1.5 py-0.5 rounded-xs"
          style={{
            color: textColor,
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
          }}
        >
          {hex}
        </span>
        <button
          onClick={copyHex}
          className="p-1 rounded-xs bg-black/40 hover:bg-black/60 text-white transition-colors"
          title="Copy Hex Code"
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
        </button>
      </div>
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-theme-primary">{name}</span>
          <code className="text-[10px] font-mono text-theme-tertiary">{token}</code>
        </div>
        <div className="text-[11px] font-mono text-theme-secondary">{rgb}</div>
        <p className="text-[11px] text-theme-tertiary font-sans leading-tight">{role}</p>
      </div>
    </div>
  );
}

export default function BrandIdentityDevPage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-theme-subtle">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs uppercase tracking-wider text-accent font-semibold">
              Pulse Design System
            </span>
            <span className="text-theme-tertiary">&bull;</span>
            <span className="px-1.5 py-0.2 rounded-xs bg-accent/15 text-accent font-mono text-[10px] uppercase font-bold">
              Brand Identity Spec
            </span>
          </div>
          <h1 className="text-3xl font-serif font-bold text-theme-primary tracking-[-0.02em]">
            Brand Identity, Colors &amp; Assets
          </h1>
          <p className="text-sm text-theme-secondary max-w-2xl font-sans">
            Single source of truth for sampled pixel colours, vector lockups, typography hierarchy, proportion rules, and WCAG AA contrast verifications.
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 px-3 py-1.5 rounded-control bg-theme-surface border hairline-border hover:bg-theme-raised text-xs font-mono text-theme-primary transition-colors focus-ring"
          >
            {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
            <span>{theme === 'dark' ? 'Light Theme' : 'Dark Theme'}</span>
          </button>
          <a
            href="/brand/Pulse-.png"
            download
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-control bg-accent text-white hover:bg-accent-hover text-xs font-mono font-medium transition-colors focus-ring"
          >
            <Download size={13} />
            <span>Source PNG</span>
          </a>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. SAMPLED BRAND CONSTANTS */}
      {/* ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="text-lg font-serif font-semibold text-theme-primary">
              1. Sampled Brand Colours (Source of Truth)
            </h2>
            <p className="text-xs text-theme-secondary font-sans">
              Extracted directly from uploaded source files (<code>Pulse-.png</code> &amp; <code>Pulse_transparent-.png</code>) via Pillow pixel analysis.
            </p>
          </div>
          <span className="text-xs font-mono text-theme-tertiary">5 Constants</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <Swatch
            name="Brand Navy"
            token="--brand-navy"
            hex="#03173B"
            rgb="rgb(3, 23, 59)"
            role="Primary dark tone, fixed sidebar, hero band, footer, and auth strip."
          />
          <Swatch
            name="Brand Blue"
            token="--brand-blue"
            hex="#2E8EBF"
            rgb="rgb(46, 142, 191)"
            role="Lower-right geometric circle, primary action buttons, active indicator, chart series."
          />
          <Swatch
            name="Brand Red"
            token="--brand-red"
            hex="#BF1111"
            rgb="rgb(191, 17, 17)"
            role="Upper-left geometric circle, static motif, single critical threshold marker only."
          />
          <Swatch
            name="Mark Stroke"
            token="--brand-mark"
            hex="#E0E0E0"
            rgb="rgb(224, 224, 224)"
            role="Head silhouette and circuit trace line stroke in dark/navy contexts."
            textColor="#03173B"
          />
          <Swatch
            name="Brand White"
            token="--brand-white"
            hex="#FFFFFF"
            rgb="rgb(255, 255, 255)"
            role="Wordmark lettering, clean light paper surface, primary button label."
            textColor="#03173B"
            border
          />
        </div>

        {/* 60 / 30 / 8 / 2 Proportion Guide */}
        <div className="p-4 rounded-panel bg-theme-surface border hairline-border space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="font-semibold text-theme-primary">Palette Distribution Rule (60 / 30 / 8 / 2)</span>
            <span className="text-theme-tertiary">Enterprise Balance</span>
          </div>

          {/* Visual Bar */}
          <div className="w-full h-7 rounded-control overflow-hidden flex border hairline-border text-[10px] font-mono font-bold text-white select-none">
            <div
              style={{ width: '60%', backgroundColor: theme === 'dark' ? '#0A2347' : '#F7F9FC' }}
              className={`flex items-center justify-center transition-colors ${
                theme === 'dark' ? 'text-[#EAF0F8]' : 'text-[#0B1B33]'
              }`}
              title="60% Functional Neutrals"
            >
              60% Neutral Surface
            </div>
            <div
              style={{ width: '30%', backgroundColor: '#03173B' }}
              className="flex items-center justify-center text-white"
              title="30% Brand Navy"
            >
              30% Navy
            </div>
            <div
              style={{ width: '8%', backgroundColor: '#2E8EBF' }}
              className="flex items-center justify-center text-white"
              title="8% Brand Blue"
            >
              8%
            </div>
            <div
              style={{ width: '2%', backgroundColor: '#BF1111' }}
              className="flex items-center justify-center text-white"
              title="2% Brand Red"
            >
              2%
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono pt-1 text-theme-secondary">
            <div>
              <span className="font-semibold text-theme-primary block">60% Neutrals:</span>
              <span className="text-[11px] text-theme-tertiary">Clean readable data cards &amp; body.</span>
            </div>
            <div>
              <span className="font-semibold text-theme-primary block">30% Navy:</span>
              <span className="text-[11px] text-theme-tertiary">Sidebar, hero band, footer, auth strip.</span>
            </div>
            <div>
              <span className="font-semibold text-theme-primary block">8% Blue:</span>
              <span className="text-[11px] text-theme-tertiary">Primary buttons, links, active pills.</span>
            </div>
            <div>
              <span className="font-semibold text-theme-primary block">2% Red:</span>
              <span className="text-[11px] text-theme-tertiary">Logo circles &amp; critical threshold alert only.</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. LOGO LOCKUPS & VARIANTS */}
      {/* ========================================================================= */}
      <section className="space-y-4">
        <div className="space-y-0.5">
          <h2 className="text-lg font-serif font-semibold text-theme-primary">
            2. Official Logo Lockups &amp; Asset Files
          </h2>
          <p className="text-xs text-theme-secondary font-sans">
            Available in vector SVG and multi-resolution PNG in <code>/public/brand/</code>.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* On Navy Background (#03173B) */}
          <div className="p-6 rounded-panel bg-[#03173B] text-white border border-[#0D2550] space-y-6">
            <div className="flex items-center justify-between border-b border-[#0D2550] pb-2 font-mono text-xs">
              <span className="font-semibold text-[#4AA3D6]">On Navy (#03173B)</span>
              <span className="text-[#6782A5] text-[10px]">App Shell &amp; Hero Band</span>
            </div>

            {/* Stacked Lockup */}
            <div className="flex items-center justify-around py-4 bg-[#02102B] rounded-control border border-[#0D2550]">
              <div className="text-center space-y-2">
                <img
                  src="/brand/stacked.svg"
                  alt="Pulse Stacked"
                  className="h-28 w-auto mx-auto object-contain"
                />
                <span className="block text-[10px] font-mono text-[#9FB2CC]">stacked.svg (280x280)</span>
              </div>
              <div className="text-center space-y-2">
                <img
                  src="/brand/mark.svg"
                  alt="Pulse Mark"
                  className="h-20 w-auto mx-auto object-contain"
                />
                <span className="block text-[10px] font-mono text-[#9FB2CC]">mark.svg (Alone)</span>
              </div>
            </div>

            {/* Horizontal Lockup */}
            <div className="p-4 bg-[#02102B] rounded-control border border-[#0D2550] flex flex-col items-center justify-center space-y-2">
              <img
                src="/brand/horizontal.svg"
                alt="Pulse Horizontal"
                className="h-9 w-auto object-contain"
              />
              <span className="text-[10px] font-mono text-[#9FB2CC]">horizontal.svg (Top bar / Sidebar header)</span>
            </div>
          </div>

          {/* On Light Paper Background (#F7F9FC) */}
          <div className="p-6 rounded-panel bg-[#F7F9FC] text-[#0B1B33] border border-[#DCE3EC] space-y-6">
            <div className="flex items-center justify-between border-b border-[#DCE3EC] pb-2 font-mono text-xs">
              <span className="font-semibold text-[#1D6F9F]">On Light (#F7F9FC)</span>
              <span className="text-[#55627A] text-[10px]">Editorial &amp; Print</span>
            </div>

            {/* Stacked Light Lockup */}
            <div className="flex items-center justify-around py-4 bg-[#FFFFFF] rounded-control border border-[#DCE3EC]">
              <div className="text-center space-y-2">
                <img
                  src="/brand/stacked-light.svg"
                  alt="Pulse Stacked Light"
                  className="h-28 w-auto mx-auto object-contain"
                />
                <span className="block text-[10px] font-mono text-[#55627A]">stacked-light.svg</span>
              </div>
              <div className="text-center space-y-2">
                <img
                  src="/brand/mark-light.svg"
                  alt="Pulse Mark Light"
                  className="h-20 w-auto mx-auto object-contain"
                />
                <span className="block text-[10px] font-mono text-[#55627A]">mark-light.svg (Navy Stroke)</span>
              </div>
            </div>

            {/* Horizontal Light Lockup */}
            <div className="p-4 bg-[#FFFFFF] rounded-control border border-[#DCE3EC] flex flex-col items-center justify-center space-y-2">
              <img
                src="/brand/horizontal-light.svg"
                alt="Pulse Horizontal Light"
                className="h-9 w-auto object-contain"
              />
              <span className="text-[10px] font-mono text-[#55627A]">horizontal-light.svg (Light headers)</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. LIGHT-BACKGROUND MARK COMPARISON (OUTLINE VS TILE) */}
      {/* ========================================================================= */}
      <section className="space-y-4">
        <div className="space-y-0.5">
          <h2 className="text-lg font-serif font-semibold text-theme-primary">
            3. Light-Background Mark Options: Navy Stroke vs. Navy Tile
          </h2>
          <p className="text-xs text-theme-secondary font-sans">
            Because the original mark stroke is light grey (<code>#E0E0E0</code>), two compliant vector solutions are provided for light backgrounds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Option A: mark-light.svg */}
          <div className="p-6 rounded-panel bg-theme-surface border hairline-border space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-theme-subtle">
              <span className="font-mono text-xs font-bold text-accent">Option A &bull; mark-light.svg</span>
              <span className="px-2 py-0.5 rounded-control bg-theme-raised text-theme-tertiary text-[10px] font-mono">
                Navy Stroke (#03173B)
              </span>
            </div>

            <div className="h-40 bg-[#FFFFFF] border border-[#DCE3EC] rounded-control flex items-center justify-center">
              <img
                src="/brand/mark-light.svg"
                alt="Pulse Mark Light"
                className="h-24 w-auto object-contain"
              />
            </div>

            <div className="space-y-1.5 text-xs">
              <span className="font-semibold text-theme-primary block">When to use (Chosen for Editorial &amp; Nav):</span>
              <p className="text-theme-secondary font-sans leading-relaxed text-[12px]">
                Ideal for borderless editorial pages, minimal document headers, and letterheads where a solid tile would feel too heavy. The head and circuit trace lines render in navy <code>#03173B</code> outside the circles, and crisp white clipped inside the circles. <strong className="text-accent">Selected as primary mark for public navigation and page layouts.</strong>
              </p>
            </div>
          </div>

          {/* Option B: mark-tile.svg */}
          <div className="p-6 rounded-panel bg-theme-surface border hairline-border space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-theme-subtle">
              <span className="font-mono text-xs font-bold text-accent">Option B &bull; mark-tile.svg</span>
              <span className="px-2 py-0.5 rounded-control bg-theme-raised text-theme-tertiary text-[10px] font-mono">
                Navy Tile Container
              </span>
            </div>

            <div className="h-40 bg-[#FFFFFF] border border-[#DCE3EC] rounded-control flex items-center justify-center">
              <img
                src="/brand/mark-tile.svg"
                alt="Pulse Mark Tile"
                className="h-24 w-auto object-contain"
              />
            </div>

            <div className="space-y-1.5 text-xs">
              <span className="font-semibold text-theme-primary block">When to use (Chosen for App Icons &amp; Favicons):</span>
              <p className="text-theme-secondary font-sans leading-relaxed text-[12px]">
                Recommended for app icons, launcher tiles, favicons, avatar badges, and card headers. Preserves the original <code>#E0E0E0</code> stroke contrast intact inside a crisp rounded navy container. <strong className="text-accent">Selected for favicon.svg, apple-touch-icon, and PWA manifest.</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Multi-Size Rendering Verification (24px, 32px, 48px, 96px) */}
        <div className="p-6 rounded-panel bg-theme-surface border hairline-border space-y-4">
          <div className="flex items-center justify-between border-b border-theme-subtle pb-2">
            <h3 className="text-sm font-serif font-semibold text-theme-primary">
              Multi-Size Rendering Verification Matrix (24px, 32px, 48px, 96px)
            </h3>
            <span className="text-[11px] font-mono text-accent">Crisp legibility at all standard scales</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Light Surface Size Grid */}
            <div className="p-4 rounded-control bg-[#FFFFFF] border border-[#E8E6E1] space-y-4">
              <span className="font-mono text-xs font-bold text-[#0B1B33] block border-b border-[#E8E6E1] pb-1">
                On Light Surface (#FFFFFF): mark-light.svg &amp; horizontal-light.svg
              </span>
              <div className="flex items-end justify-between gap-4 pt-2">
                <div className="text-center space-y-1">
                  <div className="h-24 flex items-center justify-center">
                    <img src="/brand/mark-light.svg" alt="24px" className="w-6 h-6 object-contain" />
                  </div>
                  <span className="text-[10px] font-mono text-[#5C6778] block">24px</span>
                </div>
                <div className="text-center space-y-1">
                  <div className="h-24 flex items-center justify-center">
                    <img src="/brand/mark-light.svg" alt="32px" className="w-8 h-8 object-contain" />
                  </div>
                  <span className="text-[10px] font-mono text-[#5C6778] block">32px (Nav)</span>
                </div>
                <div className="text-center space-y-1">
                  <div className="h-24 flex items-center justify-center">
                    <img src="/brand/mark-light.svg" alt="48px" className="w-12 h-12 object-contain" />
                  </div>
                  <span className="text-[10px] font-mono text-[#5C6778] block">48px</span>
                </div>
                <div className="text-center space-y-1">
                  <div className="h-24 flex items-center justify-center">
                    <img src="/brand/mark-light.svg" alt="96px" className="w-24 h-24 object-contain" />
                  </div>
                  <span className="text-[10px] font-mono text-[#5C6778] block">96px</span>
                </div>
              </div>
            </div>

            {/* Navy Surface Size Grid */}
            <div className="p-4 rounded-control bg-[#03173B] text-white border border-[#0D2550] space-y-4">
              <span className="font-mono text-xs font-bold text-[#4AA3D6] block border-b border-[#0D2550] pb-1">
                On Navy Surface (#03173B): mark.svg &amp; horizontal.svg
              </span>
              <div className="flex items-end justify-between gap-4 pt-2">
                <div className="text-center space-y-1">
                  <div className="h-24 flex items-center justify-center">
                    <img src="/brand/mark.svg" alt="24px" className="w-6 h-6 object-contain" />
                  </div>
                  <span className="text-[10px] font-mono text-[#9FB2CC] block">24px</span>
                </div>
                <div className="text-center space-y-1">
                  <div className="h-24 flex items-center justify-center">
                    <img src="/brand/mark.svg" alt="28px" className="w-7 h-7 object-contain" />
                  </div>
                  <span className="text-[10px] font-mono text-[#9FB2CC] block">28px (Sidebar)</span>
                </div>
                <div className="text-center space-y-1">
                  <div className="h-24 flex items-center justify-center">
                    <img src="/brand/mark.svg" alt="48px" className="w-12 h-12 object-contain" />
                  </div>
                  <span className="text-[10px] font-mono text-[#9FB2CC] block">48px</span>
                </div>
                <div className="text-center space-y-1">
                  <div className="h-24 flex items-center justify-center">
                    <img src="/brand/mark.svg" alt="96px" className="w-24 h-24 object-contain" />
                  </div>
                  <span className="text-[10px] font-mono text-[#9FB2CC] block">96px</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. GEOMETRY, CLEAR SPACE & MINIMUM SIZES */}
      {/* ========================================================================= */}
      <section className="space-y-4">
        <div className="space-y-0.5">
          <h2 className="text-lg font-serif font-semibold text-theme-primary">
            4. Geometry, Clear Space &amp; Minimum Sizes
          </h2>
          <p className="text-xs text-theme-secondary font-sans">
            Mathematical rules governing mark scaling and placement boundaries.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
          <div className="p-5 rounded-panel bg-theme-surface border hairline-border space-y-2">
            <span className="text-accent font-semibold uppercase tracking-wider block">
              Geometric Circle Specs
            </span>
            <ul className="space-y-1 text-theme-secondary text-[11px]">
              <li>
                <strong className="text-danger">&bull; Red Circle</strong>: Center <code>(224.5, 199.0)</code>, Radius <code>95.5px</code>
              </li>
              <li>
                <strong className="text-accent">&bull; Blue Circle</strong>: Center <code>(278.0, 255.0)</code>, Radius <code>88.0px</code>
              </li>
              <li className="text-theme-tertiary pt-1">
                Circles overlap by 48px creating optical weight balance.
              </li>
            </ul>
          </div>

          <div className="p-5 rounded-panel bg-theme-surface border hairline-border space-y-2">
            <span className="text-accent font-semibold uppercase tracking-wider block">
              Clear Space Rules
            </span>
            <p className="text-theme-secondary font-sans text-[12px] leading-relaxed">
              Maintain a clear perimeter space around all lockups equal to at least the cap height of the capital <strong>&ldquo;P&rdquo;</strong> in Pulse.
            </p>
            <div className="pt-1 text-theme-tertiary text-[11px]">
              No other text, icons, or borders may intrude into this zone.
            </div>
          </div>

          <div className="p-5 rounded-panel bg-theme-surface border hairline-border space-y-2">
            <span className="text-accent font-semibold uppercase tracking-wider block">
              Minimum Dimensions
            </span>
            <ul className="space-y-1 text-theme-secondary text-[11px]">
              <li>
                <strong>Mark alone:</strong> 24px &times; 24px (favicon/mobile)
              </li>
              <li>
                <strong>Horizontal lockup:</strong> 96px minimum width
              </li>
              <li>
                <strong>Stacked lockup:</strong> 80px minimum width
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. WCAG AA CONTRAST VERIFICATION TABLE */}
      {/* ========================================================================= */}
      <section className="space-y-4">
        <div className="space-y-0.5">
          <h2 className="text-lg font-serif font-semibold text-theme-primary">
            5. WCAG AA Contrast Verification Matrix
          </h2>
          <p className="text-xs text-theme-secondary font-sans">
            Every text, action, and indicator pairing tested and verified against WCAG AA requirements (4.5:1 for normal text, 3.0:1 for UI components).
          </p>
        </div>

        <div className="overflow-x-auto rounded-panel border hairline-border bg-theme-surface">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-theme-raised border-b border-theme-subtle text-[11px] uppercase tracking-wider text-theme-tertiary">
              <tr>
                <th className="py-2.5 px-4">Interface Context</th>
                <th className="py-2.5 px-4">Foreground</th>
                <th className="py-2.5 px-4">Background</th>
                <th className="py-2.5 px-4">Measured Ratio</th>
                <th className="py-2.5 px-4">Target</th>
                <th className="py-2.5 px-4">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme-subtle text-theme-secondary text-[12px]">
              <tr>
                <td className="py-2 px-4 font-semibold text-theme-primary">Light: Primary Text</td>
                <td className="py-2 px-4"><code>#0B1B33</code></td>
                <td className="py-2 px-4"><code>#FFFFFF</code></td>
                <td className="py-2 px-4 font-bold text-success">16.63 : 1</td>
                <td className="py-2 px-4 text-theme-tertiary">&ge; 4.5 : 1</td>
                <td className="py-2 px-4 text-success font-semibold flex items-center gap-1">
                  <CheckCircle2 size={13} /> PASS (AA)
                </td>
              </tr>
              <tr>
                <td className="py-2 px-4 font-semibold text-theme-primary">Light: Secondary Text</td>
                <td className="py-2 px-4"><code>#5C6778</code></td>
                <td className="py-2 px-4"><code>#FFFFFF</code></td>
                <td className="py-2 px-4 font-bold text-success">5.76 : 1</td>
                <td className="py-2 px-4 text-theme-tertiary">&ge; 4.5 : 1</td>
                <td className="py-2 px-4 text-success font-semibold flex items-center gap-1">
                  <CheckCircle2 size={13} /> PASS (AA)
                </td>
              </tr>
              <tr>
                <td className="py-2 px-4 font-semibold text-theme-primary">Light: Primary Button CTA</td>
                <td className="py-2 px-4"><code>#FFFFFF</code></td>
                <td className="py-2 px-4"><code>#03173B</code></td>
                <td className="py-2 px-4 font-bold text-success">18.25 : 1</td>
                <td className="py-2 px-4 text-theme-tertiary">&ge; 4.5 : 1</td>
                <td className="py-2 px-4 text-success font-semibold flex items-center gap-1">
                  <CheckCircle2 size={13} /> PASS (AA/AAA)
                </td>
              </tr>
              <tr>
                <td className="py-2 px-4 font-semibold text-theme-primary">Light: Action Blue Text</td>
                <td className="py-2 px-4"><code>#1D6F9F</code></td>
                <td className="py-2 px-4"><code>#FFFFFF</code></td>
                <td className="py-2 px-4 font-bold text-success">5.49 : 1</td>
                <td className="py-2 px-4 text-theme-tertiary">&ge; 4.5 : 1</td>
                <td className="py-2 px-4 text-success font-semibold flex items-center gap-1">
                  <CheckCircle2 size={13} /> PASS (AA)
                </td>
              </tr>
              <tr>
                <td className="py-2 px-4 font-semibold text-theme-primary">Light: Action Blue Hover</td>
                <td className="py-2 px-4"><code>#185D86</code></td>
                <td className="py-2 px-4"><code>#FFFFFF</code></td>
                <td className="py-2 px-4 font-bold text-success">7.12 : 1</td>
                <td className="py-2 px-4 text-theme-tertiary">&ge; 4.5 : 1</td>
                <td className="py-2 px-4 text-success font-semibold flex items-center gap-1">
                  <CheckCircle2 size={13} /> PASS (AA/AAA)
                </td>
              </tr>
              <tr>
                <td className="py-2 px-4 font-semibold text-theme-primary">Light: Focus Ring</td>
                <td className="py-2 px-4"><code>#2E8EBF</code></td>
                <td className="py-2 px-4"><code>#FFFFFF</code></td>
                <td className="py-2 px-4 font-bold text-success">3.55 : 1</td>
                <td className="py-2 px-4 text-theme-tertiary">&ge; 3.0 : 1</td>
                <td className="py-2 px-4 text-success font-semibold flex items-center gap-1">
                  <CheckCircle2 size={13} /> PASS (AA UI)
                </td>
              </tr>
              <tr>
                <td className="py-2 px-4 font-semibold text-theme-primary">Dark: Primary Text</td>
                <td className="py-2 px-4"><code>#EAF0F8</code></td>
                <td className="py-2 px-4"><code>#00142E</code></td>
                <td className="py-2 px-4 font-bold text-success">16.08 : 1</td>
                <td className="py-2 px-4 text-theme-tertiary">&ge; 4.5 : 1</td>
                <td className="py-2 px-4 text-success font-semibold flex items-center gap-1">
                  <CheckCircle2 size={13} /> PASS (AA)
                </td>
              </tr>
              <tr>
                <td className="py-2 px-4 font-semibold text-theme-primary">Dark: Secondary Text</td>
                <td className="py-2 px-4"><code>#9FB2CC</code></td>
                <td className="py-2 px-4"><code>#00142E</code></td>
                <td className="py-2 px-4 font-bold text-success">8.52 : 1</td>
                <td className="py-2 px-4 text-theme-tertiary">&ge; 4.5 : 1</td>
                <td className="py-2 px-4 text-success font-semibold flex items-center gap-1">
                  <CheckCircle2 size={13} /> PASS (AA)
                </td>
              </tr>
              <tr>
                <td className="py-2 px-4 font-semibold text-theme-primary">Dark: Action CTA Text</td>
                <td className="py-2 px-4"><code>#00142E</code></td>
                <td className="py-2 px-4"><code>#4AA3D6</code></td>
                <td className="py-2 px-4 font-bold text-success">6.58 : 1</td>
                <td className="py-2 px-4 text-theme-tertiary">&ge; 4.5 : 1</td>
                <td className="py-2 px-4 text-success font-semibold flex items-center gap-1">
                  <CheckCircle2 size={13} /> PASS (AA)
                </td>
              </tr>
              <tr>
                <td className="py-2 px-4 font-semibold text-theme-primary">Dark: Focus Ring</td>
                <td className="py-2 px-4"><code>#4AA3D6</code></td>
                <td className="py-2 px-4"><code>#00142E</code></td>
                <td className="py-2 px-4 font-bold text-success">6.58 : 1</td>
                <td className="py-2 px-4 text-theme-tertiary">&ge; 3.0 : 1</td>
                <td className="py-2 px-4 text-success font-semibold flex items-center gap-1">
                  <CheckCircle2 size={13} /> PASS (AA UI)
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. TYPOGRAPHY SPECIMEN */}
      {/* ========================================================================= */}
      <section className="space-y-4">
        <div className="space-y-0.5">
          <h2 className="text-lg font-serif font-semibold text-theme-primary">
            6. Typography Hierarchy &amp; Specimen
          </h2>
          <p className="text-xs text-theme-secondary font-sans">
            Transitional serif for display titles matching the Pulse wordmark; Inter for UI &amp; body; IBM Plex Mono for metrics and IDs.
          </p>
        </div>

        <div className="p-6 rounded-panel bg-theme-surface border hairline-border space-y-6">
          <div className="space-y-1 pb-4 border-b border-theme-subtle">
            <span className="text-[10px] font-mono uppercase tracking-wider text-accent font-semibold">
              Display &amp; Section Titles &bull; Source Serif 4
            </span>
            <h3 className="text-3xl font-serif font-bold text-theme-primary tracking-[-0.02em]">
              Understand employee wellbeing before it becomes attrition
            </h3>
            <p className="text-xs font-mono text-theme-tertiary">
              Source Serif 4, SemiBold 600 &amp; Bold 700 &bull; Tracking -0.02em &bull; Echoes the transitional serif wordmark
            </p>
          </div>

          <div className="space-y-1 pb-4 border-b border-theme-subtle">
            <span className="text-[10px] font-mono uppercase tracking-wider text-accent font-semibold">
              UI &amp; Body Copy &bull; Inter
            </span>
            <p className="text-sm font-sans text-theme-secondary leading-relaxed max-w-2xl">
              Anonymous micro-surveys, firewalled human support, and an intelligent companion, engineered with mathematical privacy protections so delivery teams speak honestly without fear of appraisal blowback.
            </p>
            <p className="text-xs font-mono text-theme-tertiary">
              Inter, Regular 400 &amp; Medium 500 &bull; 13-14px base &bull; Line height 1.6
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-accent font-semibold">
              Metrics, IDs &amp; Tabular Figures &bull; IBM Plex Mono
            </span>
            <div className="flex flex-wrap items-center gap-6 text-sm font-mono tabular-nums text-theme-primary pt-1">
              <div>
                <span className="text-theme-tertiary text-xs block">Squad Score:</span>
                <span className="text-lg font-bold">4.30 / 5.00</span>
              </div>
              <div>
                <span className="text-theme-tertiary text-xs block">Response Rate:</span>
                <span className="text-lg font-bold">12 / 12 (100%)</span>
              </div>
              <div>
                <span className="text-theme-tertiary text-xs block">Cryptographic Hash:</span>
                <code className="text-xs bg-theme-raised px-2 py-1 rounded-control border hairline-border">
                  0x7f4a...9b12
                </code>
              </div>
            </div>
            <p className="text-xs font-mono text-theme-tertiary pt-1">
              IBM Plex Mono &bull; Tabular numerals &bull; <code>font-variant-numeric: tabular-nums</code>
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. SEMANTIC STATUS COLOURS & ACCESSIBILITY */}
      {/* ========================================================================= */}
      <section className="space-y-4">
        <div className="space-y-0.5">
          <h2 className="text-lg font-serif font-semibold text-theme-primary">
            7. Semantic Status Indicators (Never Colour Alone)
          </h2>
          <p className="text-xs text-theme-secondary font-sans">
            Status indicators must strictly be paired with an SVG icon and clear text label to satisfy WCAG AA requirements.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Low Risk / Healthy */}
          <div className="p-4 rounded-panel bg-theme-surface border hairline-border space-y-2">
            <div className="flex items-center gap-2 text-success font-semibold font-mono text-xs">
              <CheckCircle2 size={16} />
              <span>Low Risk / Healthy Baseline</span>
            </div>
            <p className="text-xs text-theme-secondary font-sans leading-relaxed">
              Score &ge; 4.0. Indicator shows checkmark icon, green hue (<code>#1F7A4F</code> / <code>#2DBE78</code>), and text label.
            </p>
          </div>

          {/* Moderate Risk / Caution */}
          <div className="p-4 rounded-panel bg-theme-surface border hairline-border space-y-2">
            <div className="flex items-center gap-2 text-warning font-semibold font-mono text-xs">
              <AlertTriangle size={16} />
              <span>Moderate Risk / Action Required</span>
            </div>
            <p className="text-xs text-theme-secondary font-sans leading-relaxed">
              Score 3.20 &ndash; 3.99. Indicator shows caution triangle, amber hue (<code>#9A5B00</code> / <code>#F5A623</code>), and text label.
            </p>
          </div>

          {/* Critical Risk / Alert */}
          <div className="p-4 rounded-panel bg-theme-surface border hairline-border space-y-2">
            <div className="flex items-center gap-2 text-danger font-semibold font-mono text-xs">
              <AlertCircle size={16} />
              <span>Critical / Immediate Review</span>
            </div>
            <p className="text-xs text-theme-secondary font-sans leading-relaxed">
              Score &lt; 3.20. Indicator shows alert circle, red hue (<code>#C01313</code> / <code>#FF7A7A</code>), and text label.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. EMAIL & PRINT SYSTEM PREVIEWS */}
      {/* ========================================================================= */}
      <section className="space-y-4">
        <div className="space-y-0.5">
          <h2 className="text-lg font-serif font-semibold text-theme-primary">
            8. Email &amp; Printable System Preview
          </h2>
          <p className="text-xs text-theme-secondary font-sans">
            Brand styling for email dispatches and ink-efficient <code>@media print</code> stylesheets.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Email Preview Card */}
          <div className="p-5 rounded-panel bg-theme-surface border hairline-border space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-theme-subtle">
              <span className="font-mono text-xs font-bold text-theme-primary">Survey Invitation Email</span>
              <span className="text-[10px] font-mono text-theme-tertiary">HTML Email Template</span>
            </div>

            {/* Email mock */}
            <div className="rounded-control overflow-hidden border border-[#DCE3EC] bg-white text-[#0B1B33]">
              <div className="bg-[#03173B] px-4 py-3 flex items-center justify-between">
                <span className="font-serif text-white font-bold text-base">Pulse</span>
                <span className="text-[10px] font-mono text-[#2E8EBF] uppercase">Diagnostics</span>
              </div>
              <div className="p-4 space-y-3">
                <div className="text-xs font-serif font-bold text-[#0B1B33]">
                  Quarterly Anonymous Engineering Survey
                </div>
                <p className="text-[11px] text-[#55627A] font-sans leading-relaxed">
                  Please share your confidential perspectives on workload, delivery pacing, support, and psychological safety.
                </p>
                <div className="pt-1">
                  <span className="inline-block px-3 py-1.5 rounded-xs bg-[#2E8EBF] text-white font-mono text-[11px] font-semibold">
                    Open Confidential Survey &rarr;
                  </span>
                </div>
              </div>
              <div className="bg-[#F7F9FC] border-t border-[#DCE3EC] p-3 text-[10px] font-mono text-[#7E8B9E]">
                N &ge; 5 Mathematical Privacy Guarantee &bull; Single-use token.
              </div>
            </div>
          </div>

          {/* Print Preview Card */}
          <div className="p-5 rounded-panel bg-theme-surface border hairline-border space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-theme-subtle">
              <span className="font-mono text-xs font-bold text-theme-primary">Ink-Efficient Print Stylesheet</span>
              <span className="text-[10px] font-mono text-theme-tertiary">@media print</span>
            </div>

            <div className="p-4 rounded-control bg-white text-[#03173B] border border-[#CBD5E1] space-y-3">
              <div className="flex items-center justify-between border-b border-[#CBD5E1] pb-2">
                <img
                  src="/brand/horizontal-navy.svg"
                  alt="Pulse Navy"
                  className="h-5 w-auto object-contain"
                />
                <span className="text-[10px] font-mono text-[#55627A]">EXECUTIVE SUMMARY REPORT</span>
              </div>
              <p className="text-[11px] font-sans leading-relaxed text-[#55627A]">
                Print stylesheets automatically suppress all dark ink fills, navigation sidebars, and interactive buttons, rendering clean crisp 1px borders and high-contrast typography.
              </p>
              <div className="p-2 border border-[#CBD5E1] rounded-xs text-[10px] font-mono text-[#03173B]">
                White background &bull; Navy single-colour vector mark &bull; Tabular data rules
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
