/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx,mdx}',
    './components/**/*.{js,jsx,ts,tsx,mdx}',
    './lib/**/*.{js,jsx,ts,tsx}',
  ],
  safelist: [
    // Opacity utilities used in Navbar & components
    'bg-white/4', 'bg-white/6', 'bg-white/8', 'bg-white/12',
    'border-white/6', 'border-white/8', 'border-white/12',
    'text-white/40', 'text-white/50', 'text-white/60', 'text-white/70', 'text-white/80',
  ],
  theme: {
    extend: {
      // ─────────────────────────────────────────────
      // Typography — Essentia Design Tokens
      // ─────────────────────────────────────────────
      fontFamily: {
        heading: ['var(--font-playfair)', 'serif'],
        body:    ['var(--font-inter)', 'sans-serif'],
      },

      // ─────────────────────────────────────────────
      // Color Design Tokens — Essentia
      // ─────────────────────────────────────────────
      colors: {
        base:    '#F5F3EF',
        text: {
          DEFAULT: '#1A1A1A',
          muted:   '#6A6A6A',
        },
        surface: {
          DEFAULT: '#F5F3EF',
          raised:  '#EFECE5',
          border:  'rgba(26, 26, 26, 0.1)',
        },
        pastel: {
          blue: '#E6EBEF',
          green: '#E8EFE6',
          yellow: '#EFECE6',
        }
      },

      // ─────────────────────────────────────────────
      // Fluid Type Scale
      // ─────────────────────────────────────────────
      fontSize: {
        'fluid-xs':   ['clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem)',   { lineHeight: '1.5' }],
        'fluid-sm':   ['clamp(0.875rem, 0.8rem + 0.375vw, 1rem)',     { lineHeight: '1.5' }],
        'fluid-base': ['clamp(1rem, 0.9rem + 0.5vw, 1.25rem)',        { lineHeight: '1.6' }],
        'fluid-lg':   ['clamp(1.25rem, 1.1rem + 0.75vw, 1.75rem)',    { lineHeight: '1.4' }],
        'fluid-xl':   ['clamp(1.75rem, 1.5rem + 1.25vw, 2.5rem)',     { lineHeight: '1.3' }],
        'fluid-2xl':  ['clamp(2.5rem, 2rem + 2.5vw, 4rem)',           { lineHeight: '1.15' }],
        'fluid-3xl':  ['clamp(3.5rem, 2.5rem + 5vw, 6rem)',           { lineHeight: '1.05' }],
        'fluid-4xl':  ['clamp(4.5rem, 3rem + 7.5vw, 9rem)',           { lineHeight: '1' }],
      },

      // ─────────────────────────────────────────────
      // Spacing extensions
      // ─────────────────────────────────────────────
      spacing: {
        '18':  '4.5rem',
        '22':  '5.5rem',
        '30':  '7.5rem',
        '34':  '8.5rem',
        '88':  '22rem',
        '104': '26rem',
        '128': '32rem',
      },

      // ─────────────────────────────────────────────
      // Container
      // ─────────────────────────────────────────────
      maxWidth: {
        'content': '1200px',
        'wide':    '1440px',
        'narrow':  '720px',
      },

      // ─────────────────────────────────────────────
      // Border radius
      // ─────────────────────────────────────────────
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },

      // ─────────────────────────────────────────────
      // Shadows — teal-tinted for Swishit
      // ─────────────────────────────────────────────
      boxShadow: {
        'elevation-1':   '0 1px 3px rgba(23,62,74,0.08), 0 1px 2px rgba(23,62,74,0.06)',
        'elevation-2':   '0 4px 8px rgba(23,62,74,0.1), 0 2px 4px rgba(23,62,74,0.08)',
        'elevation-3':   '0 8px 24px rgba(23,62,74,0.12), 0 4px 8px rgba(23,62,74,0.08)',
        'elevation-4':   '0 16px 48px rgba(23,62,74,0.15), 0 8px 16px rgba(23,62,74,0.1)',
        'glow-primary':  '0 0 40px rgba(29,126,158,0.35)',
        'glow-accent':   '0 0 40px rgba(90,184,214,0.35)',
        'glow-cta':      '0 0 40px rgba(240,169,59,0.4)',
        'glass':         '0 8px 32px rgba(23,62,74,0.1), inset 0 1px 0 rgba(255,255,255,0.5)',
      },

      // ─────────────────────────────────────────────
      // Backdrop blur
      // ─────────────────────────────────────────────
      backdropBlur: {
        'xs':     '4px',
        'glass':  '12px',
        'heavy':  '24px',
      },

      // ─────────────────────────────────────────────
      // Motion
      // ─────────────────────────────────────────────
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'snappy': 'cubic-bezier(0.2, 0, 0, 1)',
        'expo':   'cubic-bezier(0.87, 0, 0.13, 1)',
      },
      transitionDuration: {
        '250':  '250ms',
        '350':  '350ms',
        '400':  '400ms',
        '600':  '600ms',
        '800':  '800ms',
        '1200': '1200ms',
      },
      keyframes: {
        'fade-in': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%':   { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(29,126,158,0.3)' },
          '50%':      { boxShadow: '0 0 40px rgba(29,126,158,0.6)' },
        },
      },
      animation: {
        'fade-in':    'fade-in 0.6s ease forwards',
        'slide-up':   'slide-up 0.6s cubic-bezier(0.4,0,0.2,1) forwards',
        'scale-in':   'scale-in 0.4s cubic-bezier(0.4,0,0.2,1) forwards',
        'shimmer':    'shimmer 2s linear infinite',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
