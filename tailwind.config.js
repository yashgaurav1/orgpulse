/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Semantic Enterprise Theme Variables
        'theme-bg': 'var(--bg)',
        'theme-surface': 'var(--surface)',
        'theme-raised': 'var(--raised)',
        'theme-border': 'var(--border)',
        'theme-subtle': 'var(--border-subtle)',
        'theme-primary': 'var(--text-primary)',
        'theme-secondary': 'var(--text-secondary)',
        'theme-tertiary': 'var(--text-tertiary)',
        
        // Sampled Brand Kit Constants
        brand: {
          navy: '#03173B',
          blue: '#2E8EBF',
          red: '#BF1111',
          mark: '#E0E0E0',
          white: '#FFFFFF',
          'blue-light': '#4AA3D6',
          'blue-dark': '#1D6F9F',
          'blue-hover': '#185D86',
        },

        // Brand blue as accent
        accent: {
          DEFAULT: '#2E8EBF',
          hover: '#2577A1',
          subtle: 'rgba(46, 142, 191, 0.12)',
          action: '#1D6F9F',
          'action-hover': '#185D86',
        },
        success: {
          DEFAULT: '#1F7A4F',
          subtle: 'rgba(31, 122, 79, 0.12)',
        },
        warning: {
          DEFAULT: '#9A5B00',
          subtle: 'rgba(154, 91, 0, 0.12)',
        },
        danger: {
          DEFAULT: '#C01313',
          subtle: 'rgba(192, 19, 19, 0.12)',
        },
        sage: {
          DEFAULT: '#2C8A66',
          subtle: 'rgba(44, 138, 102, 0.15)',
        },

        // Backward compatibility
        paper: '#FFFFFF',
        ink: '#0B1B33',
        terracotta: '#2E8EBF',
      },
      borderRadius: {
        control: '12px',
        panel: '20px',
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Source Serif 4', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'Geist Sans', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['var(--font-mono)', 'IBM Plex Mono', 'Geist Mono', 'monospace'],
      },
      fontSize: {
        'xs': ['12px', { lineHeight: '16px', letterSpacing: '0.04em' }],
        'sm': ['13px', { lineHeight: '18px' }],
        'base': ['14px', { lineHeight: '20px' }],
        'body': ['17px', { lineHeight: '26px' }],
        'lg': ['16px', { lineHeight: '24px', letterSpacing: '-0.01em' }],
        'xl': ['18px', { lineHeight: '26px', letterSpacing: '-0.02em' }],
        '2xl': ['22px', { lineHeight: '28px', letterSpacing: '-0.02em' }],
      },
      boxShadow: {
        'inner-highlight-dark': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.08)',
        'inner-highlight-light': '0 1px 2px rgba(11, 27, 51, 0.04)',
        'soft': '0 1px 2px rgba(11, 27, 51, 0.04)',
      },
      spacing: {
        'header': '48px',
        'sidebar-expanded': '240px',
        'sidebar-collapsed': '60px',
      },
    },
  },
  plugins: [],
};
