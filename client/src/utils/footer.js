/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
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
    fullName:  'GA Integrated Therapeutic Perspectives LLC',
    acep:      'NBCC ACEP Provider #7760',
    startYear: 2024,
  };

  function getCopyright() {
    const y = new Date().getFullYear();
    const range = y > BRAND.startYear ? `${BRAND.startYear}–${y}` : `${BRAND.startYear}`;
    return `© ${range} ${BRAND.legalName}. All rights reserved.`;
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

    const bg      = admin ? '#6B1D34' : '#284157';
    const padding = course ? '10px 24px' : '20px 32px';

    const links = (!admin && !course) ? `
      <nav style="margin-bottom:8px;">
        <a href="/privacy"  style="color:#D4A855;text-decoration:none;margin:0 10px;font-size:0.8rem;">Privacy Policy</a>
        <a href="/terms"    style="color:#D4A855;text-decoration:none;margin:0 10px;font-size:0.8rem;">Terms of Use</a>
        <a href="/contact"  style="color:#D4A855;text-decoration:none;margin:0 10px;font-size:0.8rem;">Contact</a>
      </nav>` : '';

    const legalLine = !course
      ? `<p style="margin:2px 0;opacity:0.7;font-size:0.75rem;">${BRAND.fullName}</p>`
      : '';

    const footer = document.createElement('footer');
    footer.id = 'cr-footer';
    footer.innerHTML = `
      <div style="
        background-color:${bg};
        color:#F5F5DC;
        font-family:'Lato',sans-serif;
        font-size:0.8rem;
        padding:${padding};
        text-align:center;
        line-height:1.7;
        margin-top:auto;
      ">
        ${links}
        <p style="margin:2px 0;">
          <span style="color:#D4A855;font-weight:600;">${BRAND.acep}</span>
        </p>
        <p style="margin:2px 0;">${getCopyright()}</p>
        ${legalLine}
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
