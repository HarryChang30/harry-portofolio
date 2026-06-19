/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        // Fable 5 warm editorial palette
        cream: {
          50: '#FDFBF7',
          100: '#FAF7F2',
          200: '#F5EFE4',
          300: '#EDE3D0',
          400: '#E0D2B7',
        },
        ink: {
          50: '#7A6E5F',
          100: '#5A4F42',
          200: '#3A3128',
          300: '#26201A',
          400: '#1A1612',
        },
        sienna: {
          50: '#FCF1E8',
          100: '#F8DCC4',
          200: '#EBA678',
          300: '#D77E4A',
          400: '#B85A28',
          500: '#8E3F12',
        },
        moss: {
          50: '#EEF1E8',
          100: '#D4DBBE',
          200: '#9DAA7B',
          300: '#6B7A47',
          400: '#4A5732',
        },
        line: '#E8DCC8',
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
