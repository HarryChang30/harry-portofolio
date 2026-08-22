/** @type {import('tailwindcss').Config} */
// Colors are CSS vars (see app.css :root / .dark / .light) so theme is one class swap
const v = (name) => `rgb(var(${name}) / <alpha-value>)`;

export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        surface: {
          0: v('--surface-0'),
          1: v('--surface-1'),
          2: v('--surface-2'),
          3: v('--surface-3'),
        },
        ink: {
          50: v('--ink-50'),
          100: v('--ink-100'),
          200: v('--ink-200'),
          300: v('--ink-300'),
          400: v('--ink-400'),
        },
        accent: {
          200: v('--accent-200'),
          300: v('--accent-300'),
          400: v('--accent-400'),
        },
        line: v('--line'),
        'line-bright': v('--line-bright'),
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      fontSize: {
        'display-xl': ['clamp(3rem, 6vw + 1rem, 6rem)', { lineHeight: '1.0', letterSpacing: '-0.035em' }],
        'display-lg': ['clamp(2.25rem, 4vw + 1rem, 4rem)', { lineHeight: '1.05', letterSpacing: '-0.03em' }],
        'display': ['clamp(1.5rem, 2.5vw + 1rem, 2.25rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
      },
      maxWidth: {
        prose: '68ch',
        reading: '44rem',
      },
      transitionTimingFunction: {
        'soft': 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
        'signal': {
          '0%': { opacity: '0', transform: 'scale(0.8)' },
          '50%': { opacity: '1' },
          '100%': { opacity: '0', transform: 'scale(1.4)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'fade-in': 'fade-in 1s ease forwards',
        'pulse-soft': 'pulse-soft 4s ease-in-out infinite',
        'signal': 'signal 3s ease-out infinite',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
