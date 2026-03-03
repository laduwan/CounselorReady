/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ═══════════════════════════════════════════════
        // CounselorReady Unified Palette v1.0
        // Reference: CounselorReady_Color_Spec_v1.docx
        // ═══════════════════════════════════════════════

        // PRIMARY: H1, logo, CTAs, alerts, accents
        burgundy: {
          50:  '#FDF5F7',
          100: '#FAE8EB',
          200: '#F5D0D6',
          300: '#E8A4B2',
          400: '#D4708A',
          500: '#C94D65',
          600: '#A83350',
          700: '#8B2542',
          800: '#6B1D34', // ★ Primary
          900: '#4A1524',
        },

        // PRIMARY: H2, footer, body emphasis, secondary text
        navy: {
          50:  '#F0F4F7',
          100: '#D9E2EA',
          200: '#B3C5D4',
          300: '#7A98AE',
          400: '#4A6B82',
          500: '#284157', // ★ Primary
          600: '#1F3345',
          700: '#172736',
          800: '#101C27',
        },

        // PRIMARY: Buttons, nav, success, intervention
        hunter: {
          50:  '#F2F7F4',
          100: '#E4EBE6',
          200: '#C9D7CD',
          300: '#A3BDA9',
          400: '#7A9E84',
          500: '#4A7C59', // ★ Primary
          600: '#3D6A4A',
          700: '#305538',
          800: '#234027',
        },

        // PRIMARY: Highlights, badges, awards, progress
        honey: {
          50:  '#FDF9F0',
          100: '#F9F0DB',
          200: '#F3E0B5',
          300: '#EACD86',
          400: '#D4A855', // ★ Primary
          500: '#C49545',
          600: '#A67936',
          700: '#865E2C',
          800: '#6B4A25',
        },

        // PRIMARY: Page backgrounds, content canvas
        eggshell: {
          50:  '#F5F5DC', // ★ Primary
          100: '#EDEDD0',
          200: '#E2E2BE',
          300: '#D4D4A4',
        },

        // ═══════════════════════════════════════════════
        // DEPRECATED — kept for transition, remove later
        // forest-* → use hunter-*
        // moss-* → use hunter-*
        // dustyrose-* → use burgundy-*
        // stone-* → use eggshell-*
        // ═══════════════════════════════════════════════
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Lato', 'system-ui', 'sans-serif'],
        body: ['Lato', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['4rem', { lineHeight: '1.1', fontWeight: '600' }],
        'display-lg': ['3rem', { lineHeight: '1.2', fontWeight: '600' }],
        'display-md': ['2.5rem', { lineHeight: '1.2', fontWeight: '500' }],
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
    },
  },
  plugins: [],
}
