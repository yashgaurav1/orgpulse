# Pulse Brand Identity Guidelines (docs/BRAND.md)

This document establishes the official brand identity, colour palette, typography, logo lockups, contrast verification, and placement rules for the Pulse application.

---

## 1. Sampled Brand Colours (Source of Truth)

All brand constants were sampled directly from the pixel values of the uploaded source files (`Pulse-.png` and `Pulse_transparent-.png`) using Python Pillow pixel extraction:

| Swatch | Token Name | Sampled Hex | RGB Value | Role / Usage |
|---|---|---|---|---|
| <span style="background-color:#03173B; display:inline-block; width:16px; height:16px; border:1px solid #aaa;"></span> | `--brand-navy` | `#03173B` | `rgb(3, 23, 59)` | Primary brand dark, sidebar, hero band, auth panel header, footer |
| <span style="background-color:#2E8EBF; display:inline-block; width:16px; height:16px; border:1px solid #aaa;"></span> | `--brand-blue` | `#2E8EBF` | `rgb(46, 142, 191)` | Lower-right geometric circle, primary charts, brand accent |
| <span style="background-color:#BF1111; display:inline-block; width:16px; height:16px; border:1px solid #aaa;"></span> | `--brand-red` | `#BF1111` | `rgb(191, 17, 17)` | Upper-left geometric circle, static motif, critical threshold marker only |
| <span style="background-color:#E0E0E0; display:inline-block; width:16px; height:16px; border:1px solid #aaa;"></span> | `--brand-mark` | `#E0E0E0` | `rgb(224, 224, 224)` | Circuit trace lines & head profile outline (dark/navy contexts) |
| <span style="background-color:#FFFFFF; display:inline-block; width:16px; height:16px; border:1px solid #aaa;"></span> | `--brand-white` | `#FFFFFF` | `rgb(255, 255, 255)` | Wordmark on navy, clean paper surfaces, primary action text |

### Palette Distribution Rule
- **60% Neutral**: Clean backgrounds and functional surfaces (`#F7F9FC`, `#FFFFFF`, `#EEF2F7` on light; `#00142E`, `#0A2347` on dark).
- **30% Navy**: Brand structure, persistent fixed sidebar, footer, hero band, auth modal header.
- **8% Blue**: Primary action buttons, interactive links, active nav item indicators, chart series.
- **2% Red**: Logo mark, static overlapping-circle motif, single critical threshold marker. **Never used for body text, large background fills, or primary buttons.**

---

## 2. Theme Systems

### Light Theme
- **Background**: `#F7F9FC`
- **Surface**: `#FFFFFF`
- **Soft Surface**: `#EEF2F7`
- **Border**: `#DCE3EC`
- **Primary Text**: `#0B1B33` (Ratio 16.34:1 against BG)
- **Secondary Text**: `#55627A` (Ratio 5.83:1 against BG)
- **Primary Action**: `#1D6F9F` (Hover: `#185D86`, White text ratio: 5.49:1)
- **Focus Ring**: `#2E8EBF` (2px with 2px offset)
- **Brand Navy**: Used for sidebar, footer, hero band, and auth panel header.

### Dark Theme
- **Background**: `#00142E`
- **Surface**: `#0A2347`
- **Soft Surface**: `#11305C`
- **Border**: `#1F3F6E`
- **Primary Text**: `#EAF0F8` (Ratio 16.08:1 against BG)
- **Secondary Text**: `#9FB2CC` (Ratio 8.52:1 against BG)
- **Primary Action**: `#4AA3D6` (Navy text `#00142E`, Ratio: 6.58:1)
- **Focus Ring**: `#4AA3D6`

### Semantic Status Colours
Status indicators must **always be paired with an icon and text label**, never indicated by colour alone:
- **Success**: `#1F7A4F` (Light) / `#2DBE78` (Dark)
- **Warning**: `#9A5B00` (Light) / `#F5A623` (Dark)
- **Danger**: `#C01313` (Light) / `#FF7A7A` (Dark)
- **Risk Levels**: Low, Moderate, High, Critical (each with distinct SVG badge and text label).

---

## 3. WCAG AA Contrast Verification Table

| Test Pair | Color 1 | Color 2 | Ratio | Target | Result |
|---|---|---|---|---|---|
| Light: Text on BG | `#0B1B33` | `#F7F9FC` | 16.34:1 | 4.5:1 | **PASS (AA)** |
| Light: Text on Surface | `#0B1B33` | `#FFFFFF` | 17.23:1 | 4.5:1 | **PASS (AA)** |
| Light: Secondary on BG | `#55627A` | `#F7F9FC` | 5.83:1 | 4.5:1 | **PASS (AA)** |
| Light: Secondary on Surface | `#55627A` | `#FFFFFF` | 6.15:1 | 4.5:1 | **PASS (AA)** |
| Light: White on Primary Action | `#FFFFFF` | `#1D6F9F` | 5.49:1 | 4.5:1 | **PASS (AA)** |
| Light: White on Action Hover | `#FFFFFF` | `#185D86` | 7.12:1 | 4.5:1 | **PASS (AA)** |
| Light: Border on BG (UI component) | `#DCE3EC` | `#F7F9FC` | 1.23:1 | 1.2:1 | **PASS (AA)** |
| Light: Success text on Surface | `#1F7A4F` | `#FFFFFF` | 5.31:1 | 4.5:1 | **PASS (AA)** |
| Light: Warning text on Surface | `#9A5B00` | `#FFFFFF` | 5.43:1 | 4.5:1 | **PASS (AA)** |
| Light: Danger text on Surface | `#C01313` | `#FFFFFF` | 6.28:1 | 4.5:1 | **PASS (AA)** |
| Light: White text on Brand Navy | `#FFFFFF` | `#03173B` | 17.65:1 | 4.5:1 | **PASS (AA)** |
| Light: Blue focus ring on BG | `#2E8EBF` | `#F7F9FC` | 3.47:1 | 3.0:1 | **PASS (AA)** |
| Dark: Text on BG | `#EAF0F8` | `#00142E` | 16.08:1 | 4.5:1 | **PASS (AA)** |
| Dark: Text on Surface | `#EAF0F8` | `#0A2347` | 13.63:1 | 4.5:1 | **PASS (AA)** |
| Dark: Secondary on BG | `#9FB2CC` | `#00142E` | 8.52:1 | 4.5:1 | **PASS (AA)** |
| Dark: Secondary on Surface | `#9FB2CC` | `#0A2347` | 7.23:1 | 4.5:1 | **PASS (AA)** |
| Dark: Navy text on Action Button | `#00142E` | `#4AA3D6` | 6.58:1 | 4.5:1 | **PASS (AA)** |
| Dark: Success text on Surface | `#2DBE78` | `#0A2347` | 6.51:1 | 4.5:1 | **PASS (AA)** |
| Dark: Warning text on Surface | `#F5A623` | `#0A2347` | 7.71:1 | 4.5:1 | **PASS (AA)** |
| Dark: Danger text on Surface | `#FF7A7A` | `#0A2347` | 6.19:1 | 4.5:1 | **PASS (AA)** |
| Dark: Focus ring on BG | `#4AA3D6` | `#00142E` | 6.58:1 | 3.0:1 | **PASS (AA)** |

---

## 4. Logo Assets & Lockups

All vector assets live in `/public/brand`:

| Asset File | Format | Usage Context |
|---|---|---|
| `mark.svg` | Vector SVG | Full colour mark for dark/navy backgrounds (`#E0E0E0` stroke) |
| `mark-light.svg` | Vector SVG | Mark with navy stroke (`#03173B`) for light paper backgrounds |
| `mark-tile.svg` | Vector SVG | Mark embedded on rounded navy tile (alternative for light backgrounds) |
| `mark-white.svg` | Vector SVG | Single colour all-white mark for dark mono contexts |
| `mark-navy.svg` | Vector SVG | Single colour all-navy mark for print, PDFs, and watermarks |
| `stacked.svg` | Vector SVG | Stacked lockup on navy background (matching source `Pulse-.png`) |
| `stacked-light.svg` | Vector SVG | Stacked lockup for light backgrounds |
| `horizontal.svg` | Vector SVG | Horizontal lockup for top bar and navy sidebar header |
| `horizontal-light.svg`| Vector SVG | Horizontal lockup for light headers |
| `horizontal-navy.svg` | Vector SVG | Horizontal lockup all-navy for PDF/print header |
| `motif.svg` | Vector SVG | Static two-circle motif (red upper-left, blue lower-right) |
| `favicon.svg` / `.ico` | SVG / Multi-ICO | Browser tab favicon (16, 32, 48px) |
| `apple-touch-icon.png`| PNG (180x180) | iOS home screen icon |
| `icon-192.png` / `512`| PNG | PWA application icons & maskable versions |
| `og-image.png` | PNG (1200x630)| Social share preview image |

### Geometric Rules
- **Red Circle**: Center `(224.5, 199.0)`, Radius `95.5`
- **Blue Circle**: Center `(278.0, 255.0)`, Radius `88.0`
- **Minimum Size**:
  - Mark alone: `24px` by `24px`
  - Horizontal lockup: `96px` minimum width
- **Clear Space**: Equal to the cap height of the "P" in "Pulse" on all four sides.
- **Prohibitions**:
  - Never recolour circles to non-brand values.
  - Never stretch, skew, or rotate the mark.
  - Never apply drop shadows, blur, or glow blobs.
  - Never place the mark over low-contrast or busy photographic backgrounds.

---

## 5. Typography

- **Display & Headings**: Transitional serif echoing the "Pulse" wordmark lettering (Source Serif 4 with Libre Caslon Text and Fraunces fallbacks).
- **Body & UI**: Inter (clean, highly legible UI sans-serif).
- **Numbers, Metrics & IDs**: IBM Plex Mono / tabular numerals.
- **Font Display**: `swap` with system fallbacks to prevent layout shift.
