import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#0a0e1a',
        'background-alt': '#0d1321',
        surface: '#131b2e',
        'surface-elevated': '#0f1626',
        border: '#2a3655',
        primary: {
          DEFAULT: '#4f7cff',
          hover: '#3b69e6',
        },
        secondary: {
          DEFAULT: '#60a5fa',
          hover: '#3b82f6',
        },
        'text-primary': '#e2e8f0',
        'text-secondary': '#8b9bc1',
        error: '#f87171',
      },
      boxShadow: {
        'glow-primary': '0 0 15px -2px rgba(79, 124, 255, 0.35)',
        'glow-primary-lg': '0 0 25px -3px rgba(79, 124, 255, 0.45)',
        'glow-secondary': '0 0 15px -2px rgba(96, 165, 250, 0.35)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      keyframes: {
        formFadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'form-fade-in': 'formFadeIn 220ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
    },
  },
  plugins: [],
} satisfies Config;
