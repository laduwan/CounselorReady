/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ═══════════════════════════════════════════════
        // CounselorReady Unified Palette v1.0
        // ═══════════════════════════════════════════════

        burgundy: {
          50:  '#FDF5F7',
          100: '#FAE8EB',
          200: '#F5D0D6',
          300: '#E8A4B2',
          400: '#D4708A',
          500: '#C94D65',
          600: '#A83350',
          700: '#8B2542',
          800: '#6B1D34',
          900: '#4A1524',
        },

        navy: {
          50:  '#F0F4F7',
          100: '#D9E2EA',
          200: '#B3C5D4',
          300: '#7A98AE',
          400: '#4A6B82',
          500: '#284157',
          600: '#1F3345',
          700: '#172736',
          800: '#101C27',
        },

        hunter: {
          50:  '#F2F7F4',
          100: '#E4EBE6',
          200: '#C9D7CD',
          300: '#A3BDA9',
          400: '#7A9E84',
          500: '#4A7C59',
          600: '#3D6A4A',
          700: '#305538',
          800: '#234027',
        },

        honey: {
          50:  '#FDF9F0',
          100: '#F9F0DB',
          200: '#F3E0B5',
          300: '#EACD86',
          400: '#D4A855',
          500: '#C49545',
          600: '#A67936',
          700: '#865E2C',
          800: '#6B4A25',
        },

        eggshell: {
          50:  '#F5F5DC',
          100: '#EDEDD0',
          200: '#E2E2BE',
          300: '#D4D4A4',
        },

        // ═══════════════════════════════════════════════
        // ALIASES — old names pointing to new values
        // keeps existing @apply and class usage working
        // ═══════════════════════════════════════════════
        forest: {
          50:  '#F2F7F4',
          100: '#E4EBE6',
          200: '#C9D7CD',
          300: '#A3BDA9',
          400: '#7A9E84',
          500: '#4A7C59',
          600: '#3D6A4A',
          700: '#305538',
          800: '#234027',
        },
        moss: {
          50:  '#F2F7F4',
          100: '#E4EBE6',
          200: '#C9D7CD',
          300: '#A3BDA9',
          400: '#7A9E84',
          500: '#4A7C59',
          600: '#3D6A4A',
          700: '#305538',
          800: '#234027',
        },
        dustyrose: {
          50:  '#FDF5F7',
          100: '#FAE8EB',
          200: '#F5D0D6',
          300: '#E8A4B2',
          400: '#D4708A',
          500: '#C94D65',
          600: '#A83350',
          700: '#8B2542',
          800: '#6B1D34',
        },
        stone: {
          50:  '#FAFAF9',
          100: '#F5F5F4',
          200: '#E7E5E4',
          300: '#D6D3D1',
          400: '#A8A29E',
          500: '#78716C',
        },
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Lato', 'system-ui', 'sans-serif'],
        body: ['Lato', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
