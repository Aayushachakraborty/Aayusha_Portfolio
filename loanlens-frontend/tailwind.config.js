/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Surface palette — deep navy with cool undertone
        ink: {
          950: '#080D18',
          900: '#0B1220',
          800: '#131C2E',
          700: '#1A2438',
          600: '#1F2A40',
          500: '#2D3B5C',
          400: '#475569',
          300: '#64748B',
          200: '#94A3B8',
          100: '#CBD5E1',
          50: '#E5E7EB',
        },
        // Gold — primary accent, used sparingly
        gold: {
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B47408',
          800: '#92580A',
        },
        // Citation cyan — secondary accent
        sky: {
          400: '#38BDF8',
          500: '#0EA5E9',
        },
        // Semantic
        approve: '#10B981',
        reject: '#EF4444',
        review: '#F59E0B',
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '1rem' }],
      },
      letterSpacing: {
        tightest: '-0.025em',
      },
    },
  },
  plugins: [],
};
