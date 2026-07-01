/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
/**
 * copyright.js
 * CounselorReady — GAITP LLC
 * Shared copyright utility for React and vanilla JS pages.
 *
 * Usage (ES module / React):
 *   import { getCopyright, renderFooter } from './copyright.js';
 *
 * Usage (vanilla JS via <script>):
 *   <script src="/js/copyright.js"></script>
 *   CR.renderFooter('#footer-container');
 */

// ─── Config ────────────────────────────────────────────────────────────────

const BRAND = {
  legalName:  'GAITP LLC',
  fullName:   'GA Integrated Therapeutic Perspectives LLC',
  acep:       'NBCC ACEP Provider #7760',
  startYear:  2024,
  siteUrl:    'https://counselorready.com',
  tagline:    'Learn. License. Lead.',
};

// ─── Core utility ──────────────────────────────────────────────────────────

/**
 * Returns the formatted copyright string, auto-updating the end year.
 * @returns {string} e.g. "© 2024–2025 GAITP LLC. All rights reserved."
 */
export function getCopyright() {
  const currentYear = new Date().getFullYear();
  const yearRange =
    currentYear > BRAND.startYear
      ? `${BRAND.startYear}–${currentYear}`
      : `${BRAND.startYear}`;
  return `© ${yearRange} ${BRAND.legalName}. All rights reserved.`;
}

/**
 * Returns the full provider accreditation line.
 * @returns {string}
 */
export function getAccreditation() {
  return `${BRAND.fullName} | ${BRAND.acep}`;
}

/**
 * Returns all brand metadata — useful for document headers, PDFs, etc.
 */
export function getBrandMeta() {
  return { ...BRAND, copyright: getCopyright() };
}

// ─── React footer component (JSX-ready) ───────────────────────────────────

/**
 * Drop-in React footer component.
 *
 * Usage:
 *   import { CRFooter } from './copyright.js';
 *   <CRFooter />                        // standard
 *   <CRFooter variant="admin" />        // admin pages (no nav links)
 *   <CRFooter variant="course" />       // inside course player
 */
export function CRFooter({ variant = 'default' }) {
  const isAdmin  = variant === 'admin';
  const isCourse = variant === 'course';

  const footerStyle = {
    backgroundColor: isAdmin ? '#6B1D34' : '#284157',
    color: '#F5F5DC',
    fontFamily: "'Lato', sans-serif",
    fontSize: '0.8rem',
    padding: isCourse ? '12px 24px' : '20px 32px',
    textAlign: 'center',
    lineHeight: '1.6',
  };

  const linkStyle = {
    color: '#D4A855',
    textDecoration: 'none',
    margin: '0 8px',
  };

  const accentStyle = { color: '#D4A855' };

  return (
    <footer style={footerStyle}>
      {!isAdmin && !isCourse && (
        <nav style={{ marginBottom: '8px' }}>
          <a href="/privacy" style={linkStyle}>Privacy Policy</a>
          <a href="/terms" style={linkStyle}>Terms of Use</a>
          <a href="/contact" style={linkStyle}>Contact</a>
        </nav>
      )}
      <p style={{ margin: '0 0 4px' }}>
        <span style={accentStyle}>{BRAND.acep}</span>
      </p>
      <p style={{ margin: '0 0 2px' }}>{getCopyright()}</p>
      {!isCourse && (
        <p style={{ margin: 0, opacity: 0.75 }}>{BRAND.fullName}</p>
      )}
    </footer>
  );
}

// ─── Vanilla JS renderer ──────────────────────────────────────────────────

/**
 * Injects a footer into any selector on vanilla JS / admin pages.
 * Attaches to window.CR for global access when loaded via <script> tag.
 *
 * @param {string} selector  - CSS selector for the container element
 * @param {object} [options]
 * @param {boolean} options.admin  - Use admin styling (burgundy bg)
 * @param {boolean} options.minimal - Minimal one-line version
 */
export function renderFooter(selector, options = {}) {
  const container = document.querySelector(selector);
  if (!container) {
    console.warn(`[CounselorReady] renderFooter: no element found for "${selector}"`);
    return;
  }

  const { admin = false, minimal = false } = options;
  const bg    = admin   ? '#6B1D34' : '#284157';
  const links = minimal ? '' : `
    <nav style="margin-bottom:8px;">
      <a href="/privacy"  style="color:#D4A855;text-decoration:none;margin:0 8px;">Privacy Policy</a>
      <a href="/terms"    style="color:#D4A855;text-decoration:none;margin:0 8px;">Terms of Use</a>
      <a href="/contact"  style="color:#D4A855;text-decoration:none;margin:0 8px;">Contact</a>
    </nav>`;

  container.innerHTML = `
    <footer style="
      background-color:${bg};
      color:#F5F5DC;
      font-family:'Lato',sans-serif;
      font-size:0.8rem;
      padding:${minimal ? '10px 24px' : '20px 32px'};
      text-align:center;
      line-height:1.6;
    ">
      ${links}
      <p style="margin:0 0 4px;">
        <span style="color:#D4A855;">${BRAND.acep}</span>
      </p>
      <p style="margin:0 0 2px;">${getCopyright()}</p>
      ${minimal ? '' : `<p style="margin:0;opacity:0.75;">${BRAND.fullName}</p>`}
    </footer>`;
}

// ─── Global attach (vanilla JS / <script> tag usage) ──────────────────────

if (typeof window !== 'undefined') {
  window.CR = window.CR || {};
  window.CR.getCopyright    = getCopyright;
  window.CR.getAccreditation = getAccreditation;
  window.CR.getBrandMeta    = getBrandMeta;
  window.CR.renderFooter    = renderFooter;
}
