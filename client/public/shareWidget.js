/**
 * shareWidget.js — Drop-in share component for CReady Viewer
 * 
 * HOW TO ADD TO interactive-course.html / cready-viewer.html:
 * 
 * 1. Add this <div> wherever you want the share button (e.g. course header or sidebar):
 * 
 *    <div id="cr-share-widget"></div>
 * 
 * 2. Include this script at the bottom of your HTML (before </body>):
 * 
 *    <script src="shareWidget.js"></script>
 * 
 * 3. Call initShareWidget() after course data loads:
 * 
 *    initShareWidget({
 *      title: course.title,
 *      slug: course.slug,
 *      ceHours: course.ceHours || 0,
 *      courseCode: course.courseCode || ''
 *    });
 * 
 * The widget auto-detects the site URL and builds share links.
 * Styled to match CounselorReady brand (burgundy/hunter/honey).
 */

(function () {
  'use strict';

  const SITE_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:5173'
    : 'https://counselorready.com';

  const STYLES = `
    .cr-share-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      border: 1px solid #4A7C59;
      background: #f0f5f1;
      color: #4A7C59;
      transition: background 0.15s;
      font-family: 'Lato', system-ui, sans-serif;
    }
    .cr-share-btn:hover { background: #dce8de; }
    .cr-share-btn svg { width: 14px; height: 14px; }

    .cr-share-popup {
      display: none;
      position: absolute;
      right: 0;
      top: calc(100% + 6px);
      background: #fff;
      border: 1px solid #e5e2dc;
      border-radius: 12px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.12);
      padding: 8px 0;
      min-width: 220px;
      z-index: 9999;
      font-family: 'Lato', system-ui, sans-serif;
    }
    .cr-share-popup.open { display: block; }

    .cr-share-popup button {
      display: flex;
      align-items: center;
      gap: 10px;
      width: 100%;
      padding: 8px 16px;
      border: none;
      background: none;
      cursor: pointer;
      font-size: 13px;
      color: #333;
      text-align: left;
      transition: background 0.1s;
    }
    .cr-share-popup button:hover { background: #f8f7f4; }
    .cr-share-popup button svg { width: 16px; height: 16px; flex-shrink: 0; }

    .cr-share-popup hr {
      margin: 4px 12px;
      border: none;
      border-top: 1px solid #e5e2dc;
    }

    .cr-share-toast {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #4A7C59;
      color: #fff;
      padding: 10px 18px;
      border-radius: 10px;
      font-size: 13px;
      font-weight: 500;
      opacity: 0;
      transform: translateY(16px);
      transition: opacity 0.25s, transform 0.25s;
      z-index: 99999;
      font-family: 'Lato', system-ui, sans-serif;
      pointer-events: none;
    }
    .cr-share-toast.show {
      opacity: 1;
      transform: translateY(0);
    }

    .cr-share-wrapper { position: relative; display: inline-block; }
  `;

  let config = {};
  let toastEl = null;

  function getCourseURL() {
    return `${SITE_URL}/interactive-course.html?slug=${config.slug}`;
  }

  function getShareText() {
    const hours = config.ceHours ? ` (${config.ceHours} CE)` : '';
    return `${config.title}${hours} — CounselorReady CE Course`;
  }

  function showToast(msg) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'cr-share-toast';
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    setTimeout(() => toastEl.classList.remove('show'), 2200);
  }

  function copyLink() {
    navigator.clipboard.writeText(getCourseURL()).then(() => showToast('Course link copied!'));
    closePopup();
  }

  function emailShare() {
    const subject = encodeURIComponent(`Check out: ${config.title}`);
    const body = encodeURIComponent(
      `I thought you'd be interested in this CE course:\n\n${config.title}` +
      (config.ceHours ? ` — ${config.ceHours} CE hours` : '') +
      `\n\n${getCourseURL()}\n\nApproved by NBCC (ACEP Provider #7760) via CounselorReady.`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`);
    closePopup();
  }

  function linkedInShare() {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(getCourseURL())}`, '_blank');
    closePopup();
  }

  function facebookShare() {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getCourseURL())}`, '_blank');
    closePopup();
  }

  function twitterShare() {
    const text = encodeURIComponent(getShareText());
    window.open(`https://x.com/intent/tweet?text=${text}&url=${encodeURIComponent(getCourseURL())}`, '_blank');
    closePopup();
  }

  function nativeShare() {
    if (navigator.share) {
      navigator.share({
        title: config.title,
        text: getShareText(),
        url: getCourseURL()
      }).catch(() => {});
    }
    closePopup();
  }

  let popup = null;
  function togglePopup() {
    if (popup) popup.classList.toggle('open');
  }
  function closePopup() {
    if (popup) popup.classList.remove('open');
  }

  window.initShareWidget = function (opts) {
    config = opts || {};
    const container = document.getElementById('cr-share-widget');
    if (!container) return;

    // Inject styles
    if (!document.getElementById('cr-share-styles')) {
      const style = document.createElement('style');
      style.id = 'cr-share-styles';
      style.textContent = STYLES;
      document.head.appendChild(style);
    }

    const hasNativeShare = !!navigator.share;

    container.innerHTML = `
      <div class="cr-share-wrapper">
        <button class="cr-share-btn" id="cr-share-trigger">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>
          Share Course
        </button>
        <div class="cr-share-popup" id="cr-share-popup">
          <button onclick="window._crCopyLink()">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.172 13.828a4 4 0 005.656 0l4-4a4 4 0 10-5.656-5.656l-1.102 1.101"/></svg>
            Copy link
          </button>
          <button onclick="window._crEmailShare()">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
            Send via email
          </button>
          <hr>
          <button onclick="window._crLinkedIn()">
            <svg viewBox="0 0 24 24" fill="#0A66C2"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            Share on LinkedIn
          </button>
          <button onclick="window._crFacebook()">
            <svg viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            Share on Facebook
          </button>
          <button onclick="window._crTwitter()">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            Share on X
          </button>
          ${hasNativeShare ? `
            <hr>
            <button onclick="window._crNativeShare()">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
              More sharing options...
            </button>
          ` : ''}
        </div>
      </div>
    `;

    popup = document.getElementById('cr-share-popup');
    document.getElementById('cr-share-trigger').addEventListener('click', (e) => {
      e.stopPropagation();
      togglePopup();
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.cr-share-wrapper')) closePopup();
    });

    // Expose handlers to inline onclick
    window._crCopyLink = copyLink;
    window._crEmailShare = emailShare;
    window._crLinkedIn = linkedInShare;
    window._crFacebook = facebookShare;
    window._crTwitter = twitterShare;
    window._crNativeShare = nativeShare;
  };
})();
