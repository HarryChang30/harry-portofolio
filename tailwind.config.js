/** @type {import('tailwindcss').Config} */
// ponytail: colors are CSS vars (see app.css) so dark mode is one .dark class, no dark: variants anywhere
const v = (name) => `rgb(var(${name}) / <alpha-value>)`;

export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Light/Dark Blue palette — values live in app.css :root / .dark
        frost: {
          50: v('--frost-50'),
          100: v('--frost-100'),
          200: v('--frost-200'),
          300: v('--frost-300'),
          400: v('--frost-400'),
        },
        ink: {
          50: v('--ink-50'),
          100: v('--ink-100'),
          200: v('--ink-200'),
          300: v('--ink-300'),
          400: v('--ink-400'),
        },
        azure: {
          50: v('--azure-50'),
          100: v('--azure-100'),
          200: v('--azure-200'),
          300: v('--azure-300'),
          400: v('--azure-400'),
          500: v('--azure-500'),
        },
        line: v('--line'),
      },
      fontFamily: {
        serif: ['Fraunces', 'ui-serif', 'Georgia', 'serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      fontSize: {
        'display-xl': ['clamp(3rem, 6vw + 1rem, 5.5rem)', { lineHeight: '1.02', letterSpacing: '-0.025em' }],
        'display-lg': ['clamp(2.25rem, 4vw + 1rem, 3.75rem)', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'display': ['clamp(1.75rem, 2.5vw + 1rem, 2.5rem)', { lineHeight: '1.1', letterSpacing: '-0.015em' }],
      },
      maxWidth: {
        prose: '68ch',
        reading: '44rem',
      },
      transitionTimingFunction: {
        'soft': 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
