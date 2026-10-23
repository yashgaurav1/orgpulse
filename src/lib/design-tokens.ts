/**
 * Pulse Enterprise Design Tokens
 * Official Brand System (sampled from pixel assets) & Single Source of Truth
 */

export const brandTokens = {
  navy: '#03173B',
  blue: '#2E8EBF',
  red: '#BF1111',
  mark: '#E0E0E0',
  white: '#FFFFFF',
  blueDark: '#1D6F9F',
  blueDarkHover: '#185D86',
  blueLight: '#4AA3D6',
} as const;

export const enterpriseTokens = {
  brand: brandTokens,
  theme: {
    light: {
      background: '#FFFFFF',
      surface: '#FFFFFF',
      raisedSurface: '#F8F7F4',
      border: '#E8E6E1',
      subtleBorder: '#E8E6E1',
      textPrimary: '#0B1B33',
      textSecondary: '#5C6778',
      textTertiary: '#8A93A3',
      accent: '#2E8EBF',
      action: '#1D6F9F',
      actionHover: '#185D86',
      semantic: {
        success: '#1F7A4F',
        warning: '#9A5B00',
        danger: '#C01313',
        sage: '#2C8A66',
      },
      innerHighlight: '0 1px 2px rgba(11, 27, 51, 0.04)',
      shadowSoft: '0 1px 2px rgba(11, 27, 51, 0.04)',
    },
    dark: {
      background: '#00142E',
      surface: '#0A2347',
      raisedSurface: '#11305C',
      border: '#1F3F6E',
      subtleBorder: '#162C4E',
      textPrimary: '#EAF0F8',
      textSecondary: '#9FB2CC',
      textTertiary: '#6782A5',
      accent: '#2E8EBF',
      action: '#4AA3D6',
      actionHover: '#2E8EBF',
      semantic: {
        success: '#2DBE78',
        warning: '#F5A623',
        danger: '#FF7A7A',
        sage: '#68B39B',
      },
      innerHighlight: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.08)',
      shadowSoft: '0 1px 2px rgba(0, 0, 0, 0.2)',
    },
  },
  radius: {
    control: '12px',
    panel: '20px',
  },
  border: {
    hairline: '1px solid',
  },
  typography: {
    fontSerif: 'var(--font-serif), Georgia, Cambria, "Times New Roman", Times, serif',
    fontSans: 'var(--font-inter), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontMono: 'var(--font-mono), "IBM Plex Mono", Menlo, Consolas, monospace',
    baseSize: '13px',
    baseSizeDesktop: '14px',
    bodySize: '17px',
    bodyLineHeight: '1.55',
    navSize: '15px',
    displayHeadingTracking: '-0.035em',
    displayHeadingLineHeight: '1.03',
    labelTracking: '0.04em',
    headingTracking: '-0.035em',
  },
  motion: {
    durations: {
      instant: 120, // ms - hover, toggle, micro-interactions
      ui: 180,      // ms - dropdowns, buttons, tooltips
      fast: 220,    // ms - content reveal, tabs
      panel: 400,   // ms - side drawers, dialogs, sheets
      hero: 700,    // ms - hero load sequence
    },
    easing: [0.2, 0.7, 0.2, 1] as const, // standard cubic-bezier
    easingExit: [0.4, 0, 1, 1] as const, // exit cubic-bezier
    easingCss: 'cubic-bezier(0.2, 0.7, 0.2, 1)',
    easingExitCss: 'cubic-bezier(0.4, 0, 1, 1)',
    staggerStep: 0.06, // 60ms stagger
    staggerMax: 8,
    staggerRow: 0.02, // 20ms row stagger alias
    pressScale: 0.98,
    revealDistance: 12, // px
    shiftDistance: 8, // px
    shimmerDuration: 1.6, // s
  },
} as const;

export type EnterpriseTokens = typeof enterpriseTokens;
export type ThemeMode = 'dark' | 'light' | 'system';
