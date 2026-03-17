/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // @lock-start: CounselorReady brand colors v2.0 — brand at 600
      colors: {
        // ═══════════════════════════════════════════════
        // CounselorReady Unified Palette v2.0
        // Brand colors anchored at 600 (Tailwind convention)
        // ═══════════════════════════════════════════════

        burgundy: {
          50:  '#FDF2F5',
          100: '#FADED6',
          200: '#F5B8C4',
          300: '#E88A9E',
          400: '#D0607A',
          500: '#A83350',
          600: '#6B1D34',   // ★ BRAND
          700: '#571828',
          800: '#43121E',
          900: '#2F0C15',
        },

        navy: {
          50:  '#F0F4F7',
          100: '#D8E4EE',
          200: '#B0C5D6',
          300: '#7D9AB2',
          400: '#5A7A94',
          500: '#3D5D73',
          600: '#284157',   // ★ BRAND
          700: '#1E3448',
          800: '#152536',
          900: '#0D1820',
        },

        hunter: {
          50:  '#F2F7F3',
          100: '#E0ECE3',
          200: '#C2D9C8',
          300: '#96BCA0',
          400: '#6B9E78',
          500: '#5A9469',
          600: '#4A7C59',   // ★ BRAND
          700: '#3B6347',
          800: '#2D4C37',
          900: '#1F3526',
        },

        honey: {
          50:  '#FFFDF5',
          100: '#FFF8E1',
          200: '#FFEDB3',
          300: '#FFDD7A',
          400: '#E8BF5E',
          500: '#D4A855',   // ★ BRAND
          600: '#C49A40',
          700: '#A67F2D',
          800: '#876520',
          900: '#5C4414',
        },

        eggshell: {
          50:  '#F5F5DC',
          100: '#EDEDD0',
          200: '#E2E2BE',
          300: '#D4D4A4',
        },

        // ═══════════════════════════════════════════════
        // ALIASES — keep existing class usage working
        // ═══════════════════════════════════════════════
        forest: {
          50:  '#F2F7F3',
          100: '#E0ECE3',
          200: '#C2D9C8',
          300: '#96BCA0',
          400: '#6B9E78',
          500: '#5A9469',
          600: '#4A7C59',
          700: '#3B6347',
          800: '#2D4C37',
          900: '#1F3526',
        },
        moss: {
          50:  '#F2F7F3',
          100: '#E0ECE3',
          200: '#C2D9C8',
          300: '#96BCA0',
          400: '#6B9E78',
          500: '#5A9469',
          600: '#4A7C59',
          700: '#3B6347',
          800: '#2D4C37',
          900: '#1F3526',
        },
        dustyrose: {
          50:  '#FDF2F5',
          100: '#FADED6',
          200: '#F5B8C4',
          300: '#E88A9E',
          400: '#D0607A',
          500: '#A83350',
          600: '#6B1D34',
          700: '#571828',
          800: '#43121E',
          900: '#2F0C15',
        },
        gold: {
          50:  '#FFFDF5',
          100: '#FFF8E1',
          200: '#FFEDB3',
          300: '#FFDD7A',
          400: '#E8BF5E',
          500: '#D4A855',
          600: '#C49A40',
          700: '#A67F2D',
          800: '#876520',
          900: '#5C4414',
        },
        stone: {
          50:  '#FAF9F6',
          100: '#F5F5F4',
          200: '#E7E5E4',
          300: '#D6D3D1',
          400: '#A8A29E',
          500: '#78716C',
          600: '#57534E',
          700: '#44403C',
          800: '#292524',
          900: '#1C1917',
        },
      },
      // @lock-end
      // @lock-start: Brand fonts
      fontFamily: {
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Lato', 'system-ui', 'sans-serif'],
        body: ['Lato', 'system-ui', 'sans-serif'],
      },
      // @lock-end
    },
  },
  plugins: [],
}
