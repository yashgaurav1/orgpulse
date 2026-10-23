# Pulse Engineering Log: Brand Kit Rollout, Layout Refactoring & Mintlify Restyle

This document records the architectural audit, defect remediation, design system upgrades, and Mintlify-aligned redesign implemented for the Pulse application.

---

## 1. Executive Summary

| Scope Area | Prior Defective State | Remediated State |
| :--- | :--- | :--- |
| **App Layout Chrome** | `AppShell` wrapped every route indiscriminately in root layout; double-nested in `employee` and `admin`. | Separated into Next.js Route Groups: `app/(marketing)/` (public nav & footer only), `app/(app)/` (exactly one `AppShell`), `app/dev/` (dev layout). |
| **Demo Session Landing** | Landing defaulted to broken `"Demo User / MEMBER"` ghost persona; auth listener wiped sessions on reload. | 4-mode clean state machine (`loading`, `signed-out`, `real`, `demo`), synchronous state commit, single clean `router.push`, Firebase Auth listener guard. |
| **Brand Vector Assets** | `mark.svg` had tiny blurred "Pulse" wordmark baked in; `stacked.svg` had a stray 500x500 navy square. | Contour analysis separated mark from wordmark at $y \le 316$; two-tone stroke `<clipPath>` for light mode; transparent backgrounds throughout. |
| **Typography Hierarchy** | Pervasive `font-mono` on regular UI buttons, table rows, and labels, creating a terminal appearance. | Inter (`font-sans`) for body/UI; Source Serif 4 (`font-serif`) for headlines; IBM Plex Mono (`font-mono`) strictly for numbers, IDs, and eyebrow tags. |
| **Colour & Contrast** | Raw Brand Blue (`#2E8EBF`) on light surfaces failed WCAG AA (3.55:1). | Maintained sampled constants; derived Action Blue (`#1D6F9F`, 5.49:1 AA) for interactive controls on light backgrounds. |
| **Landing Page Redesign** | Cluttered, non-truthful content enclosed inside fixed overflow-hidden app container. | Upgraded truthful landing page matching Mintlify structure with centered 1200px frame, two-tone headlines with accent ticks, wave lines canvas, and 8 ordered sections. |
| **Calm Animation System** | Inconsistent animation durations, hardcoded springs, looping animations. | Centralized motion tokens (`tokens.ts`, `globals.css`), 30fps capped wave line art canvas with static SVG fallback and main thread CPU throttling guards. |

---

## 2. Root Cause Analysis & Fix Details

### A. Layout Nesting & Chrome Isolation
- **Root Cause:** In `src/app/layout.tsx`, `<AppShell>{children}</AppShell>` wrapped every single route. Furthermore, `AppShell.tsx` only had an ad-hoc check for `/login` and `/survey/`, meaning the public homepage `/` rendered inside the fixed 245px sidebar and 48px top bar. In addition, `dashboard/employee/page.tsx` and `dashboard/admin/page.tsx` explicitly wrapped their return JSX in `<AppShell>`, causing a shell-inside-a-shell defect with duplicate sidebars and top bars.
- **Remediation:**
  1. `src/app/layout.tsx` was stripped of all layout chrome. It now renders only root HTML, font variables (`--font-inter`, `--font-mono`, `--font-serif`), `ThemeProvider`, `AuthProvider`, `ToastProvider`, `AuthModal`, and skip link.
  2. Created Next.js route group `src/app/(marketing)` with layout `src/app/(marketing)/layout.tsx` containing `AnnouncementBar`, `LandingNav`, `{children}`, and `LandingFooter` with native document-level scrolling (`overflow-y: auto` at body level).
  3. Created Next.js route group `src/app/(app)` with layout `src/app/(app)/layout.tsx` wrapping dashboard and library routes in **exactly one** `<AppShell>`.
  4. Removed `<AppShell>` tags and imports from `dashboard/employee/page.tsx` and `dashboard/admin/page.tsx`.
  5. Created `src/app/dev/layout.tsx` with a clean, minimal developer header without double-nesting.

### B. Demo Session Landing Architecture
- **Root Cause:** The authentication context previously initialized with a ghost persona `"Demo User / MEMBER"`, causing unauthenticated visitors to land in a corrupted half-demo state. Furthermore, the Firebase Auth `onAuthStateChanged` listener would fire on initial load and overwrite `localStorage` demo credentials.
- **Remediation:**
  1. Established a 4-state session mode union: `'loading' | 'signed-out' | 'real' | 'demo'`.
  2. Public visitors initialize cleanly in `'signed-out'` mode with zero injected ghost credentials.
  3. Clicking "Try Demo" opens `AuthModal` in demo mode, allowing the user to select one of 5 enterprise roles and 12 seeded corporate datasets.
  4. `enterDemo` creates a typed `demoProfile`, writes synchronously to React state and `localStorage` under `pulse_demo_session`, closes the modal, and performs a single `router.push(getRoleDashboardPath(role))`.
  5. Added an active demo guard in the `onAuthStateChanged` callback: if `localStorage.getItem('pulse_demo_session')` exists, the Firebase listener never overwrites or resets the demo session.
  6. Added a prominent "Demo Data" badge with single-click role/dataset switching and an "Exit Demo" action that cleanly purges state and redirects to `/`.

### C. Logo Separation & Vector Refinement
- **Root Cause:** The original vector export used a bounding box spanning $y \in [90, 386]$, accidentally capturing the white "Pulse" wordmark text beneath the circuit-trace head stroke. When scaled to small sizes (28-32px), this baked-in text blurred into an illegible grey smear. In addition, `stacked.svg` contained a hardcoded 500x500 navy background rectangle.
- **Remediation:**
  1. Executed Pillow contour analysis script `generate_clean_brand_assets.py`. Identified that the head circuit stroke terminates at $y = 314$ and the wordmark begins at $y = 331$.
  2. Sliced the stroke mask strictly at $y \le 316$, extracting a 100% pure head mark with zero letter remnants.
  3. Exported `mark.svg` with viewBox `115 95 260 255` containing only the Red circle ($cx=224.5, cy=199.0, r=95.5$), Blue circle ($cx=278.0, cy=255.0, r=88.0$), and `#E0E0E0` head stroke.
  4. Created two-tone stroke vector `mark-light.svg` for light surfaces: renders navy `#03173B` base stroke, overlaid with `#FFFFFF` white stroke clipped to `<clipPath id="circle-union">`. This ensures crisp contrast both on light paper and across dark circles.
  5. Selected Option A (`mark-light.svg`) as the primary mark for public navigation and editorial documents, while reserving Option B (`mark-tile.svg`) for app icons, favicons, and touch icons.
  6. Exported clean SVGs with navy wordmarks for light backgrounds (`horizontal-light.svg`, `stacked-light.svg`) and white wordmarks for navy/dark backgrounds (`horizontal.svg`, `stacked.svg`).
  7. Verified mark rendering at 24px, 28px (sidebar), 32px (nav), 48px, and 96px across both light and navy themes.

### D. Tokens, Typography & Accessible Color System
- **Design Tokens (`src/lib/design-tokens.ts`, `src/app/globals.css`):**
  - **Light Theme (Default on public pages):** Page `#FFFFFF`, soft surface `#F8F7F4`, hairline border `#E8E6E1`, primary text `#0B1B33`, secondary text `#5C6778`, muted text `#8A93A3`.
  - **Dark Theme:** Background `#00142E`, surface `#0A2347`, soft surface `#11305C`, hairline border `#1F3F6E`, primary text `#EAF0F8`, secondary text `#9FB2CC`.
  - **Radius:** 12px controls, 20px cards (`control: '12px'`, `panel: '20px'`).
  - **Buttons:**
    - Primary Button (`.btn-primary`): Solid navy `#03173B` with white text `#FFFFFF` (brand blue on dark), 12px radius, 48px height (`h-12 px-6`), chevron that nudges 2px right on hover.
    - Secondary Button (`.btn-secondary`): Pure white `#FFFFFF` with 1px hairline `#E8E6E1` and navy text `#03173B`.
    - Action Blue (`#1D6F9F`, hover `#185D86`): Derived for blue text on white surfaces, yielding WCAG AA 5.49:1.
    - Brand Blue (`#2E8EBF`): Reserved for heading ticks, live figures, active tab underlines, wave lines, and focus rings.
- **Typography:**
  - Default body and UI in Inter (`font-sans`), weight 400/500, body size 17px at 1.55 line height, nav size 15px medium.
  - Section display headings in weight 500-600, tracking `-0.035em`, line height `1.03`.
  - Monospace (`font-mono` / IBM Plex Mono) strictly restricted to numerical metrics with `tabular-nums`, cryptographic hashes, IDs, and uppercase eyebrow tags.
  - Zero monospace on regular UI buttons or tables.

### E. Mintlify-Structured Truthful Public Landing Page
Implemented `src/app/(marketing)/page.tsx` within a centered 1200px frame bounded by 1px vertical hairline borders and a subtle 5% margin dot grid:
1. **Announcement Bar:** Warm off-white `#F8F7F4`, small "New" chip, linking to `#privacy`, dismissible with remembered `localStorage` state.
2. **Sticky Navigation:** 20px backdrop blur, Radix NavigationMenu dropdowns (Product, Privacy, Resources), scroll-progress indicator line, Light/Dark/System theme switcher.
3. **Hero Section:**
   - Left: Above headline, hairline chip with blue mono counter built from sample data ("Sample group responses 12 / 12 >" with visible "Sample data" tag, counting up once).
   - Headline: "Understand employee wellbeing before it becomes attrition".
   - Subline: Grey body with navy semibold keywords.
   - Action buttons: `.btn-primary` ("Try the demo >") and `.btn-secondary` ("Sign in").
   - Right: Wave line art canvas (`WaveLineArt.tsx`).
   - Below: Framed product window (`FramedProductWindow.tsx`) rising from bottom edge of hero, with real squad components and interactive role tabs.
4. **Sections in Exact Order (Each with two-tone headline and 3px blue vertical tick):**
   - a. **The Problem:** 3 hairline-divided columns (Retaliation Fear, Delayed Signal Lag, Punitive Blame Culture).
   - b. **How It Works:** Bento of 2 unequal off-white cards (Survey Question pill with 1-5 selector; resolving skeleton bar to aggregate score with $N \ge 5$ threshold).
   - c. **What Each Role Sees:** Role carousel with Prev/Next buttons (no autoplay) across Employee, Manager, HRBP, Leadership, linking to demo dashboards.
   - d. **Privacy Grid:** 4x2 off-white tiles with line icons and hover chevrons, plus interactive 4 vs 5 group suppression diagram.
   - e. **Stats Row:** 4 large numbers counting up once (5 min group, 6 dimensions, 90 days retention, 4 role views).
   - f. **Wellbeing Companion:** Interactive card with pill-shaped input preview ("Talk to the companion..."), privacy labels, and Tele-MANAS crisis helplines (`14416` / `1800-891-4416`).
   - g. **FAQ Accordion:** 2-column desktop accordion with smooth height animation (`grid-template-rows`).
   - h. **Closing CTA:** Two-tone headline with primary and secondary action buttons.
5. **Footer:** Navy `#03173B`, white horizontal logo, 5 link columns, legal notice ("Privacy notice shown before the survey. Legal review required before real use."), neutral "Sample data in demo" pill, and floating "Questions? Read the FAQ" pill.
6. **Shared Segmented Control:** Component `SegmentedControl.tsx` using CSS transform sliding thumb, arrow-key navigation, ARIA tablist for AuthModal, role switcher, and simulators.

### F. Motion System & Hero Wave Line Art
- **Motion Tokens (`src/lib/motion/tokens.ts`, `globals.css`):**
  - Instant (120ms), fast/content (220ms), base/panel (400ms), slow/hero (700ms).
  - Easings: Standard `cubic-bezier(0.2, 0.7, 0.2, 1)`, Exit `cubic-bezier(0.4, 0, 1, 1)`.
  - Reveal distance: 12px; Stagger step: 60ms capped at 8 items.
- **Wave Line Art Canvas (`WaveLineArt.tsx`):**
  - 36 thin 1px curves generated mathematically: $y = \text{baseline} + A_1\sin(k_1 x + \phi + i\cdot\delta) + A_2\sin(k_2 x - 0.6\phi + 1.4i\cdot\delta)$.
  - Tapering envelope $T(x) = \sin(\pi x / W)$ pinches lines into a fan at left and right boundaries.
  - Ramp from `#2E8EBF` to `#BFE0F0` (opacity 0.35 to 0.9) with 3 travelling bright segments.
  - Rendered on single `<canvas>` with `devicePixelRatio` capped at 2.
  - Pre-allocated Float32Array coordinate buffers: zero array allocations inside render loop.
  - Instant static SVG fallback rendered first for 0ms LCP hit.
  - 30fps cap; automatic pausing when tab is hidden (`visibilitychange`), offscreen (`IntersectionObserver`), or when `prefers-reduced-motion` is active.
  - Main thread protection: automatic freeze to static frame if frame compute time $> 12$ms for 30 consecutive frames or hardware concurrency $\le 4$.

---

## 3. Verification & Test Evidence

### Vitest Test Suite Execution
- **Command:** `npm test`
- **Result:** **66 passed out of 66 tests** (26.5s) across 9 test suites:
  - `tests/haven-governance-verification.test.ts` (11 tests passed)
  - `tests/motion/motion-system.test.ts` (19 tests passed)
  - `tests/route-groups-and-layout.test.ts` (7 tests passed)
  - `tests/privacy/phase1-privacy.test.ts` (6 tests passed)
  - `tests/privacy/phase2-survey-flow.test.ts` (6 tests passed)
  - `tests/privacy/phase3-dashboards-and-flags.test.ts` (5 tests passed)
  - `tests/privacy/phase4-actions-and-indicators.test.ts` (4 tests passed)
  - `tests/privacy/phase5-gemini-summary.test.ts` (6 tests passed)
  - `tests/privacy/phase6-retention-and-seed.test.ts` (2 tests passed)

### Playwright End-to-End Suite Execution
- **Command:** `npx playwright test`
- **Result:** **11 passed out of 11 tests** across 2 comprehensive spec files:
  - `tests/e2e/demo-and-navigation.spec.ts` (4/4 passed):
    - `ok 1: Public Landing Page renders ZERO AppShells and scrolls at document level`
    - `ok 2: Public Governance Pages (/privacy, /terms) render without AppShell`
    - `ok 3: App Dashboards render EXACTLY ONE AppShell and ONE Sidebar (never two)`
    - `ok 4: Demo Entry Flow: Pick each role and dataset, enter demo, assert URL, single shell, and demo badge`
  - `tests/e2e/mintlify-redesign-and-motion.spec.ts` (7/7 passed):
    - `ok 1: Nav Dropdowns Open by Keyboard & Mouse`
    - `ok 2: Every CTA Opens the Right Auth Tab in Modal`
    - `ok 3: Theme Choice Persists (Light / Dark / System)`
    - `ok 4: Role Carousel Prev / Next Controls Advance Slides`
    - `ok 5: Wave Line Art Canvas Present & Configured Safely`
    - `ok 6: 404 Page Renders Cleanly without AppShell`
    - `ok 7: Visual Proof Screenshots at 1440px and 390px (Light & Dark)`

### TypeScript & Production Build Verification
- **Command:** `npx tsc --noEmit` & `npm run build`
- **Result:** Compiled all 23 routes statically and dynamically with 0 type errors, 0 hydration warnings, and optimized production bundles.
