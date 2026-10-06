/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',

  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],

  theme: {
    extend: {
      colors: {
        /*
         * Theme-aware Slate palette.
         *
         * Existing classes such as:
         * bg-slate-950
         * bg-slate-900
         * bg-slate-800
         * text-slate-400
         * text-slate-300
         * border-slate-800
         *
         * will automatically follow the active theme.
         */
        slate: {
          50: 'var(--slate-50)',
          100: 'var(--slate-100)',
          200: 'var(--slate-200)',
          300: 'var(--slate-300)',
          400: 'var(--slate-400)',
          500: 'var(--slate-500)',
          600: 'var(--slate-600)',
          700: 'var(--slate-700)',
          800: 'var(--slate-800)',
          900: 'var(--slate-900)',
          950: 'var(--slate-950)',
        },

        brand: {
          50: '#f0f4ff',
          100: '#e0e8ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          glow: '#60a5fa',
        },

        cyber: {
          bg: '#090d16',
          card: '#0f172a',
          border: '#1e293b',
          accent: '#06b6d4',
          neon: '#10b981',
          gold: '#f59e0b',
        },
      },

      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },

      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-spin': 'spin 12s linear infinite',
      },
    },
  },

  plugins: [],
};
