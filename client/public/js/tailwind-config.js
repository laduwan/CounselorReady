/* ============================================================
   CounselorReady — Shared Tailwind CDN Config
   --------------------------------------------------------------
   This file is the SINGLE SOURCE OF TRUTH for the Tailwind palette
   used across all 41 static HTML pages in client/public/.
   It replaces the inline `tailwind.config = {...}` block that
   currently drifts page-to-page (some pages still ship with the
   deprecated #34495E navy and #d4a012 gold).

   USAGE (in every static HTML page <head>, in this exact order):

     <link rel="stylesheet" href="/css/design-tokens.css">
     <link rel="stylesheet" href="/css/typography.css">
     <script src="/js/tailwind-config.js"></script>
     <script src="https://cdn.tailwindcss.com/3.4.17"></script>

   The Tailwind CDN URL is pinned to 3.4.17. Do NOT use bare
   https://cdn.tailwindcss.com — version drift breaks the palette.
   ============================================================ */

window.tailwind = window.tailwind || {};
window.tailwind.config = {
  theme: {
    extend: {
      colors: {
        /* ---------- BURGUNDY (logo, CTAs, alerts) -------- */
        burgundy: {
          50:  '#FDF5F6',
          100: '#FAE8EB',
          200: '#F5D0D6',
          300: '#EBA9B5',
          400: '#DD768A',   /* "Counselor" on burgundy bg */
          500: '#C94D65',
          600: '#A83350',
          700: '#8B2542',   /* hover / pressed CTA */
          800: '#6B1D34',   /* PRIMARY brand */
          900: '#4A1524',
          950: '#2D0A14',
        },

        /* ---------- HUNTER GREEN (buttons, nav) ---------- */
        hunter: {
          50:  '#F3F6F4',
          100: '#E3EBE5',
          200: '#C8D7CC',
          300: '#A1BBA8',
          400: '#759A7F',
          500: '#547C5F',
          600: '#3D6A4A',
          700: '#4A7C59',   /* PRIMARY brand */
          800: '#3D6A4A',   /* hover */
          900: '#2B4133',
        },

        /* ---------- HONEY / GOLD (accents, badges) ------- */
        honey: {
          50:  '#FDF9F0',
          100: '#F9F0DB',
          200: '#F3E0B5',
          300: '#EACD86',
          400: '#D4A855',   /* PRIMARY brand */
          500: '#C49545',
          600: '#A67936',
          700: '#D4A855',   /* alias to 400 for legacy refs */
          800: '#B8903A',   /* hover */
          900: '#6B4A25',
        },

        /* ---------- NAVY (H2, footer, secondary) --------- */
        navy: {
          50:  '#F0F4F7',
          100: '#DCE5EC',
          200: '#B8CBD9',
          300: '#93B0C5',
          400: '#5C82A0',
          500: '#284157',   /* PRIMARY brand */
          600: '#1F344A',
          700: '#182838',
          800: '#111D29',
          900: '#0A121A',
        },

        /* ---------- EGGSHELL (course canvas ONLY) -------- */
        eggshell: {
          50:  '#F5F5DC',
          100: '#EDEDD0',
          200: '#E2E2BE',
          300: '#D4D4A4',
        },

        /* ---------- STONE (platform pages) --------------- */
        stone: {
          50:  '#F8F7F4',
          100: '#F0EFEA',
          200: '#E5E3DC',
        },

        /* ---------- LEGACY ALIASES ----------------------- */
        /* Old code references `forest-*` and `gold-*`. Map them
           to the canonical palette so nothing renders broken
           while the codebase is being migrated. Remove once
           grep returns zero matches for these prefixes.       */
        forest: {
          50:  '#F3F6F4', 100: '#E3EBE5', 200: '#C8D7CC',
          300: '#A1BBA8', 400: '#759A7F', 500: '#4A7C59',
          600: '#3D6A4A', 700: '#4A7C59', 800: '#2B4133', 900: '#1F3025',
        },
        gold: {
          50:  '#FDF9F0', 100: '#F9F0DB', 200: '#F3E0B5',
          300: '#EACD86', 400: '#D4A855', 500: '#D4A855',
          600: '#A67936', 700: '#865E2C',
        },
      },

      fontFamily: {
        display: ['Cormorant Garamond', 'Georgia', 'Times New Roman', 'serif'],
        body:    ['Lato', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
        sans:    ['Lato', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
        serif:   ['Cormorant Garamond', 'Georgia', 'serif'],
        mono:    ['ui-monospace', 'SF Mono', 'Monaco', 'Consolas', 'monospace'],
      },

      fontSize: {
        'cr-h1':    ['2.5rem',   { lineHeight: '1.15', letterSpacing: '-0.015em', fontWeight: '700' }],
        'cr-h2':    ['1.75rem',  { lineHeight: '1.25', letterSpacing: '-0.01em',  fontWeight: '600' }],
        'cr-h3':    ['1.25rem',  { lineHeight: '1.35', fontWeight: '700' }],
        'cr-h4':    ['1.1rem',   { lineHeight: '1.4',  fontWeight: '600' }],
        'cr-body':  ['1rem',     { lineHeight: '1.65', fontWeight: '400' }],
        'cr-small': ['0.875rem', { lineHeight: '1.5',  fontWeight: '400' }],
        'cr-label': ['0.75rem',  { lineHeight: '1.4',  fontWeight: '600', letterSpacing: '0.06em' }],
      },

      boxShadow: {
        'cr-sm':  '0 1px 2px rgba(40, 65, 87, 0.06)',
        'cr':     '0 1px 4px rgba(40, 65, 87, 0.08), 0 1px 2px rgba(40, 65, 87, 0.04)',
        'cr-md':  '0 4px 12px rgba(40, 65, 87, 0.10), 0 2px 4px rgba(40, 65, 87, 0.05)',
        'cr-lg':  '0 10px 30px rgba(40, 65, 87, 0.12), 0 4px 8px rgba(40, 65, 87, 0.06)',
      },

      borderRadius: {
        'cr-sm': '6px',
        'cr':    '10px',
        'cr-md': '12px',
        'cr-lg': '16px',
      },

      backgroundImage: {
        'cr-hero':       'linear-gradient(135deg, #6B1D34 0%, #284157 100%)',
        'cr-hero-soft':  'linear-gradient(135deg, #8B2542 0%, #284157 100%)',
        'cr-honey':      'linear-gradient(135deg, #D4A855 0%, #B8903A 100%)',
        'cr-cta':        'linear-gradient(135deg, #6B1D34 0%, #8B2542 100%)',
      },
    },
  },
};
