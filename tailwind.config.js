/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#7C3AED',
          dark: '#5B21B6',
        },
        secondary: '#EC4899',
        accent: {
          gold: '#F59E0B',
        },
        success: '#22C55E',
        warning: '#F59E0B',
        error: '#EF4444',
        background: '#F8F6FC',
        surface: '#FFFFFF',
        foreground: {
          DEFAULT: '#111827',
          secondary: '#6B7280',
          muted: '#9CA3AF',
        },
        border: '#E5E7EB',
        hero: {
          from: '#7C3AED',
          to: '#5B21B6',
        },
        pastel: {
          lavender: '#EDE9FE',
          peach: '#FFEDD5',
          mint: '#D1FAE5',
          pink: '#FCE7F3',
        },
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        '2xl': '32px',
      },
      spacing: {
        4.5: '18px',
        5.5: '22px',
      },
      fontSize: {
        display: ['28px', { lineHeight: '34px', fontWeight: '700' }],
        heading: ['22px', { lineHeight: '28px', fontWeight: '700' }],
        title: ['18px', { lineHeight: '24px', fontWeight: '600' }],
        body: ['15px', { lineHeight: '22px', fontWeight: '400' }],
        caption: ['12px', { lineHeight: '16px', fontWeight: '500' }],
      },
      boxShadow: {
        sm: '0 1px 2px rgba(17, 24, 39, 0.06)',
        md: '0 4px 12px rgba(17, 24, 39, 0.08)',
        lg: '0 8px 24px rgba(124, 58, 237, 0.18)',
        card: '0 4px 16px rgba(17, 24, 39, 0.06)',
      },
    },
  },
  plugins: [],
};
