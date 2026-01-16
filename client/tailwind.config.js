/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./public/**/*.html",
  ],
  theme: {
    extend: {
      colors: {
        // CounselorReady Brand Colors
        moss: {
          50: '#f4f6f4',
          100: '#e4e9e4',
          200: '#c9d3c9',
          300: '#a3b3a3',
          400: '#7a8f7a',
          500: '#5a725a',
          600: '#4B5D4B', // Primary - Deep Moss
          700: '#3d4b3d',
          800: '#333f33',
          900: '#2b342b',
          950: '#161c16',
        },
        dustyrose: {
          50: '#fdf5f6',
          100: '#fbeaec',
          200: '#f7d5da',
          300: '#f0b3bc',
          400: '#e58594',
          500: '#d45d72',
          600: '#7D4E57', // Accent - Dusty Rose/Burgundy
          700: '#6b3d47',
          800: '#5a3540',
          900: '#4d303a',
          950: '#2a171d',
        },
        navy: {
          50: '#f4f6f7',
          100: '#e3e7ea',
          200: '#c9d1d8',
          300: '#a4b1bd',
          400: '#778a9a',
          500: '#5c6f7f',
          600: '#4e5d6b',
          700: '#444f5a',
          800: '#3c454d',
          900: '#34495E', // Secondary - Navy
          950: '#21282f',
        },
        // Additional colors for public HTML files
        burgundy: {
          50: '#fdf5f6',
          100: '#fae8eb',
          200: '#f5d0d6',
          300: '#eba9b5',
          400: '#dd768a',
          500: '#c94d65',
          600: '#a83350',
          700: '#8b2542',
          800: '#6b1d34',
          900: '#4a1524',
          950: '#2d0a14'
        },
        forest: {
          50: '#f3f6f4',
          100: '#e3ebe5',
          200: '#c8d7cc',
          300: '#a1bba8',
          400: '#759a7f',
          500: '#547c5f',
          600: '#40634a',
          700: '#34503d',
          800: '#2b4133',
          900: '#1f3025',
          950: '#121c16'
        },
        gold: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#d4a012'
        }
      },
      fontFamily: {
        sans: ['"Lato"', 'system-ui', 'sans-serif'],
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
      }
    },
  },
  plugins: [],
}
