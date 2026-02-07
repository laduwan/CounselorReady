/**
 * admin-embed.js
 * Drop into: /client/public/admin-embed.js
 * 
 * Add to EVERY admin HTML page, just before </body>:
 *   <script src="admin-embed.js"></script>
 * 
 * When the page loads with ?embedded=1 (from AdminLayout iframe),
 * this script hides the page's own sidebar, header, and footer
 * so only the content area remains — no double navigation.
 */
(function() {
  if (!new URLSearchParams(window.location.search).has('embedded')) return;

  // Mark body so CSS can also target it
  document.body.classList.add('cr-embedded');

  // Inject styles to hide sidebar, header, footer and expand content
  var style = document.createElement('style');
  style.textContent = [
    // ── Hide by common selectors found across admin pages ──

    // Top navigation / header bar
    '.cr-embedded header,',
    '.cr-embedded nav:first-of-type,',
    '.cr-embedded [class*="navbar"],',
    '.cr-embedded [class*="top-bar"],',
    '.cr-embedded [class*="topbar"],',
    '.cr-embedded .admin-header,',
    // The CounselorReady ADMIN header bar (usually first direct child or sticky)
    '.cr-embedded > header,',
    '.cr-embedded > nav,',

    // Sidebar
    '.cr-embedded aside,',
    '.cr-embedded [class*="sidebar"],',
    '.cr-embedded [class*="side-nav"],',
    '.cr-embedded [class*="sidenav"],',
    '.cr-embedded .admin-sidebar,',

    // Footer
    '.cr-embedded footer,',
    '.cr-embedded [class*="footer"] {',
    '  display: none !important;',
    '}',

    // ── Expand main content to fill ──
    '.cr-embedded main,',
    '.cr-embedded [class*="main-content"],',
    '.cr-embedded [class*="content-area"],',
    '.cr-embedded [class*="page-content"],',
    '.cr-embedded .admin-content {',
    '  margin-left: 0 !important;',
    '  margin-top: 0 !important;',
    '  padding-top: 16px !important;',
    '  width: 100% !important;',
    '  max-width: 100% !important;',
    '}',

    // Body reset
    '.cr-embedded {',
    '  padding: 0 !important;',
    '  margin: 0 !important;',
    '  overflow-x: hidden;',
    '}',

    // Fix any fixed/sticky positioned navs
    '.cr-embedded [style*="position: fixed"],',
    '.cr-embedded [style*="position:fixed"],',
    '.cr-embedded [style*="position: sticky"],',
    '.cr-embedded [style*="position:sticky"] {',
    '  position: relative !important;',
    '}',
  ].join('\n');
  document.head.appendChild(style);

  // ── Aggressive cleanup for elements the CSS might miss ──
  // Wait for DOM to be fully loaded
  function cleanup() {
    // Strategy: find the sidebar by structure patterns
    // Most admin pages use: fixed left div with nav links, or aside element

    // 1. Find and hide any element that looks like a sidebar
    //    (fixed/absolute positioned, narrow, on the left)
    document.querySelectorAll('div, aside, nav').forEach(function(el) {
      var rect = el.getBoundingClientRect();
      var style = window.getComputedStyle(el);
      var pos = style.position;

      // Sidebar detection: fixed/absolute, narrow (< 300px), tall, on left side
      if ((pos === 'fixed' || pos === 'absolute' || pos === 'sticky') &&
          rect.width > 50 && rect.width < 300 && rect.height > 400 && rect.left < 10) {
        el.style.display = 'none';
      }

      // Header detection: fixed/sticky at top, full width, short
      if ((pos === 'fixed' || pos === 'sticky') &&
          rect.top < 5 && rect.width > 500 && rect.height < 120) {
        el.style.display = 'none';
      }
    });

    // 2. Find main content area and reset its margins
    var main = document.querySelector('main') ||
               document.querySelector('[class*="main-content"]') ||
               document.querySelector('[class*="content"]') ||
               document.querySelector('[role="main"]');
    if (main) {
      main.style.marginLeft = '0';
      main.style.marginTop = '0';
      main.style.paddingLeft = '16px';
      main.style.paddingRight = '16px';
      main.style.width = '100%';
      main.style.maxWidth = '100%';
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', cleanup);
  } else {
    cleanup();
  }

  // Run again after a short delay to catch dynamically rendered elements
  setTimeout(cleanup, 300);
  setTimeout(cleanup, 1000);
})();
