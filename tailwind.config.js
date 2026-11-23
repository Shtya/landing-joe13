/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  // Only folders the live routes render. Scanning every components/ folder
  // (old landings, 3d, ui…) put ~140 KB of unused utilities into the CSS the
  // home page loads before it can paint; the redesign uses its own j13-* CSS.
  content: [
    './app/**/*.{js,jsx}',
    './components/redesign/**/*.{js,jsx}',
    './components/landing-2/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--color-background)',
        surface: 'var(--color-surface)',
        primary: 'var(--color-primary)',
        accent: 'var(--color-accent)',
        'text-main': 'var(--color-text)',
        muted: 'var(--color-muted)',
        border: 'var(--color-border)',
        highlight: 'var(--color-highlight)',
        card: 'var(--color-card)',
        overlay: 'var(--color-overlay)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'sans-serif'],
        arabic: ['var(--font-arabic)', 'sans-serif'],
      },
      animation: {
        shimmer: 'shimmer 2.5s linear infinite',
        float: 'float 6s ease-in-out infinite',
        'bounce-slow': 'bounce 2s infinite',
        marquee: 'marquee 30s linear infinite',
        'marquee-partners': 'marquee 52s linear infinite',
        'marquee-reverse': 'marquee-reverse 30s linear infinite',
        'partners-shine': 'partners-shine 6s ease-in-out infinite',
        'count-up': 'countUp 0.5s ease-out forwards',
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'l2-pulse': 'l2Pulse 2.4s ease-in-out infinite',
        'l2-typing-caret': 'l2TypingCaret 0.9s step-end infinite',
      },
      keyframes: {
        l2Pulse: {
          '0%, 100%': { opacity: '0.7', transform: 'scale(0.92)' },
          '50%': { opacity: '1', transform: 'scale(1.12)' },
        },
        l2TypingCaret: {
          '0%, 45%': { opacity: '1' },
          '46%, 100%': { opacity: '0' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'marquee-reverse': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'partners-shine': {
          '0%, 100%': { opacity: '0.35', transform: 'translateX(-30%)' },
          '50%': { opacity: '0.85', transform: 'translateX(30%)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px var(--color-primary)' },
          '50%': { boxShadow: '0 0 40px var(--color-primary), 0 0 80px var(--color-primary)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
