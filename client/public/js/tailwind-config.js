/* CounselorReady — Shared Tailwind CDN Config
 * Loads AFTER the Tailwind Play CDN script. The CDN installs window.tailwind
 * as a Proxy whose setter triggers config re-processing. Assigning
 * tailwind.config here is what registers our palette.
 *
 * REQUIRED ORDER in every page <head>:
 *   <script src="https://cdn.tailwindcss.com/3.4.17"></script>
 *   <script src="/js/tailwind-config.js"></script>
 */

tailwind.config = {
  theme: {
    extend: {
      colors: {
        burgundy: {
          50:'#FDF5F6',100:'#FAE8EB',200:'#F5D0D6',300:'#EBA9B5',400:'#DD768A',
          500:'#C94D65',600:'#A83350',700:'#8B2542',800:'#6B1D34',900:'#4A1524',950:'#2D0A14'
        },
        hunter: {
          50:'#F3F6F4',100:'#E3EBE5',200:'#C8D7CC',300:'#A1BBA8',400:'#759A7F',
          500:'#547C5F',600:'#3D6A4A',700:'#4A7C59',800:'#3D6A4A',900:'#2B4133'
        },
        honey: {
          50:'#FDF9F0',100:'#F9F0DB',200:'#F3E0B5',300:'#EACD86',400:'#D4A855',
          500:'#C49545',600:'#A67936',700:'#D4A855',800:'#B8903A',900:'#6B4A25'
        },
        navy: {
          50:'#F0F4F7',100:'#DCE5EC',200:'#B8CBD9',300:'#93B0C5',400:'#5C82A0',
          500:'#284157',600:'#1F344A',700:'#182838',800:'#111D29',900:'#0A121A'
        },
        eggshell: {
          50:'#F5F5DC',100:'#EDEDD0',200:'#E2E2BE',300:'#D4D4A4'
        },
        stone: {
          50:'#F8F7F4',100:'#F0EFEA',200:'#E5E3DC'
        },
        forest: {
          50:'#F3F6F4',100:'#E3EBE5',200:'#C8D7CC',300:'#A1BBA8',400:'#759A7F',
          500:'#4A7C59',600:'#3D6A4A',700:'#4A7C59',800:'#2B4133',900:'#1F3025'
        },
        gold: {
          50:'#FDF9F0',100:'#F9F0DB',200:'#F3E0B5',300:'#EACD86',400:'#D4A855',
          500:'#D4A855',600:'#A67936',700:'#865E2C'
        }
      },
      fontFamily: {
        display: ['Cormorant Garamond','Georgia','Times New Roman','serif'],
        body:    ['Lato','-apple-system','BlinkMacSystemFont','system-ui','sans-serif'],
        sans:    ['Lato','-apple-system','BlinkMacSystemFont','system-ui','sans-serif'],
        serif:   ['Cormorant Garamond','Georgia','serif'],
        mono:    ['ui-monospace','SF Mono','Monaco','Consolas','monospace']
      },
      backgroundImage: {
        'cr-hero':      'linear-gradient(135deg, #6B1D34 0%, #284157 100%)',
        'cr-hero-soft': 'linear-gradient(135deg, #8B2542 0%, #284157 100%)',
        'cr-honey':     'linear-gradient(135deg, #D4A855 0%, #B8903A 100%)',
        'cr-cta':       'linear-gradient(135deg, #6B1D34 0%, #8B2542 100%)'
      },
      boxShadow: {
        'cr-sm': '0 1px 2px rgba(40,65,87,0.06)',
        'cr':    '0 1px 4px rgba(40,65,87,0.08), 0 1px 2px rgba(40,65,87,0.04)',
        'cr-md': '0 4px 12px rgba(40,65,87,0.10), 0 2px 4px rgba(40,65,87,0.05)',
        'cr-lg': '0 10px 30px rgba(40,65,87,0.12), 0 4px 8px rgba(40,65,87,0.06)'
      }
    }
  }
};
