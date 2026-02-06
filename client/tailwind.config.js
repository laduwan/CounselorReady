/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Brand Colors
        burgundy: {
          100: '#FAE8EB',
          200: '#F5D0D6',
          500: '#C94D65',
          700: '#8B2542',
          800: '#6B1D34', // Primary burgundy
          900: '#4A1524',
        },
        forest: {
          100: '#E3EBE5',
          200: '#C8D7CC',
          400: '#759A7F',
          500: '#547C5F',
          600: '#40634A', // Primary forest green
          700: '#34503D',
        },
        honey: {
          400: '#D4A855', // Primary honey/gold
          500: '#C69840',
          600: '#B8872C',
        },
        stone: {
          50: '#FAFAF9',
          100: '#F5F5F4',
          200: '#E7E5E4',
        },
        // Alternative color scales (for React components)
        moss: {
          100: '#E8EDE8',
          200: '#D1DBD1',
          400: '#8FA78F',
          500: '#6A856A',
          600: '#4B5D4B', // Primary moss
          700: '#3A4A3A',
        },
        dustyrose: {
          100: '#F4ECEE',
          200: '#E9D9DD',
          400: '#B8969D',
          500: '#9A7A82',
          600: '#7D4E57', // Primary dusty rose
          700: '#5E3A42',
        },
        hunter: {
          100: '#E4EBE6',
          200: '#C9D7CD',
          400: '#7F9E87',
          500: '#5F8268',
          600: '#4A7C59', // Alternative green
          700: '#395F45',
        },
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Lato', 'system-ui', 'sans-serif'],
        body: ['Lato', 'system-ui', 'sans-serif'],
        inter: ['Inter', 'system-ui', 'sans-serif'],
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
