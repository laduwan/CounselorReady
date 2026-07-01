/**
 * footer.js — CounselorReady
 * Self-injecting footer for all vanilla JS / HTML pages.
 * Auto-detects admin vs. public pages by URL.
 *
 * Usage: Add ONE line before </body> on any HTML page:
 *   <script src="/js/footer.js"></script>
 */
(function () {
  const BRAND = {
    legalName: 'GAITP LLC',
    fullName:  'Ga Integrated Therapeutic Perspectives LLC',
    acep:      'NBCC ACEP #7760',
    startYear: 2024,
  };
  function getCopyright() {
    const y = new Date().getFullYear();
    const range = y > BRAND.startYear ? `${BRAND.startYear}\u2013${y}` : `${BRAND.startYear}`;
    return `\u00A9 ${range} CounselorReady. All rights reserved.`;
  }
  function isAdminPage() {
    return window.location.pathname.includes('/admin') ||
           document.body.dataset.page === 'admin';
  }
  function isCoursePlayer() {
    return window.location.pathname.includes('interactive-course') ||
           document.body.dataset.page === 'course';
  }
  function inject() {
    // Don't double-inject
    if (document.getElementById('cr-footer')) return;
    const admin  = isAdminPage();
    const course = isCoursePlayer();

    // Admin pages keep the dark burgundy footer
    if (admin) {
      const footer = document.createElement('footer');
      footer.id = 'cr-footer';
      footer.innerHTML = `
        <div style="
          background-color:#6B1D34;
          color:#F5F5DC;
          font-family:'Lato',sans-serif;
          font-size:0.8rem;
          padding:20px 32px;
          text-align:center;
          line-height:1.7;
          margin-top:auto;
        ">
          <p style="margin:2px 0;">
            <span style="color:#D4A855;font-weight:600;">${BRAND.fullName} | ${BRAND.acep}</span>
          </p>
          <p style="margin:2px 0;">${getCopyright()}</p>
        </div>`;
      document.body.appendChild(footer);
      return;
    }

    // Course player: minimal footer
    if (course) {
      const footer = document.createElement('footer');
      footer.id = 'cr-footer';
      footer.innerHTML = `
        <div style="
          background-color:#ffffff;
          border-top:1px solid #fae8eb;
          font-family:'Lato',sans-serif;
          font-size:0.75rem;
          padding:10px 24px;
          text-align:center;
          color:#547c5f;
          margin-top:auto;
        ">
          <p style="margin:0;">${getCopyright()}</p>
        </div>`;
      document.body.appendChild(footer);
      return;
    }

    // Public pages: white footer matching dashboard pattern
    const footer = document.createElement('footer');
    footer.id = 'cr-footer';
    footer.style.cssText = 'margin-top:3rem;padding:1.5rem 1rem;background:#fff;border-top:1px solid #fae8eb;font-family:"Lato",sans-serif;';
    footer.innerHTML = `
      <div style="max-width:80rem;margin:0 auto;display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:1rem;">
        <p style="color:#547c5f;font-size:0.875rem;margin:0;">${getCopyright()}</p>
        <div style="display:flex;align-items:center;gap:1rem;flex-wrap:wrap;">
          <a href="/help.html" style="color:#547c5f;font-size:0.875rem;text-decoration:none;">Help</a>
          <span style="color:#a1bba8;">|</span>
          <p style="color:#759a7f;font-size:0.75rem;margin:0;">${BRAND.fullName} | ${BRAND.acep}</p>
        </div>
      </div>`;
    document.body.appendChild(footer);
  }
  // Run after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();
