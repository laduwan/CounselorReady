/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */

/**
 * cr-retrieval-popup.js
 * ─────────────────────
 * Stage 5f MVP — Random-timed retrieval check overlay.
 *
 * When a learner has scrolled past ~5 content blocks in a section without yet
 * encountering this session's pop-up for that section, a modal interrupts with
 * a random multipleChoice question pulled from that same section. Answering
 * or skipping dismisses the modal. The pop-up fires at most once per section
 * per session.
 *
 * MVP scope:
 *   ✓ Scroll-trigger via lightweight polling (1Hz)
 *   ✓ Modal overlay with ARIA dialog role + Escape-key + backdrop dismiss
 *   ✓ multipleChoice only (other question types are passed over)
 *   ✓ Brand-styled card (burgundy / navy / Cormorant Garamond)
 *   ✓ Mobile responsive (full-screen modal under 640px)
 *
 * Cut from MVP (parking-doc Stage 5f future work):
 *   ✗ Course author–curated popupPool field
 *   ✗ Analytics events (popup_shown / popup_correct / popup_skipped)
 *   ✗ User preference toggle in account settings
 *   ✗ Per-course density configuration
 *   ✗ multiSelect / fillInBlank / matching / sequencing / cardSort support
 *
 * Dependencies:
 *   • window.__crCurrentCourse        — set by loadCourse() in interactive-course.html
 *   • window.__crCurrentSectionIndex  — set by goToSection() in interactive-course.html
 */

(function () {
  'use strict';

  if (window.__crRetrievalInit) return;
  window.__crRetrievalInit = true;

  // ──────────────────────────────────────────────────────────────────────
  // Config
  // ──────────────────────────────────────────────────────────────────────
  const CONFIG = {
    // After this many .cr-block elements have scrolled past viewport midpoint,
    // a pop-up will fire for the current section (once per session).
    triggerThresholdBlocks: 5,
    // Question types eligible for the pop-up pool.
    candidateTypes: ['multipleChoice'],
    // Polling interval in ms.
    pollIntervalMs: 1000,
  };

  const STATE = {
    shownInSection: new Set(), // section indices already shown
    lastSectionIdx: null,
    pollTimer: null,
  };

  // ──────────────────────────────────────────────────────────────────────
  // Helpers
  // ──────────────────────────────────────────────────────────────────────
  function waitForCourse(callback, retries) {
    if (window.__crCurrentCourse) { callback(); return; }
    if (retries <= 0) return;
    setTimeout(function () { waitForCourse(callback, retries - 1); }, 200);
  }

  function escHtml(s) {
    const d = document.createElement('div');
    d.textContent = s == null ? '' : String(s);
    return d.innerHTML;
  }

  function getCurrentSection() {
    const course = window.__crCurrentCourse;
    const idx = window.__crCurrentSectionIndex;
    if (!course || typeof idx !== 'number') return null;
    return (course.sections || [])[idx] || null;
  }

  function findCandidates(section) {
    if (!section || !section.contentBlocks) return [];
    return section.contentBlocks.filter(function (b) {
      if (!CONFIG.candidateTypes.includes(b.type)) return false;
      // Must have a question and a viable options array
      if (!b.question) return false;
      if (!Array.isArray(b.options) || b.options.length < 2) return false;
      // At least one option must be correct
      const hasCorrect =
        (typeof b.correctAnswer === 'number' && b.options[b.correctAnswer]) ||
        b.options.some(function (o) { return o && o.isCorrect; });
      return hasCorrect;
    });
  }

  function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function isOptionCorrect(block, optIndex) {
    if (typeof block.correctAnswer === 'number') return optIndex === block.correctAnswer;
    const opt = block.options[optIndex];
    return !!(opt && opt.isCorrect);
  }

  // ──────────────────────────────────────────────────────────────────────
  // Scroll-trigger polling
  // ──────────────────────────────────────────────────────────────────────
  function startPolling() {
    if (STATE.pollTimer) return;
    STATE.pollTimer = setInterval(function () {
      const idx = window.__crCurrentSectionIndex;
      if (idx !== STATE.lastSectionIdx) STATE.lastSectionIdx = idx;

      if (typeof idx !== 'number') return;
      if (STATE.shownInSection.has(idx)) return;

      // Count blocks whose midpoint is above viewport midpoint
      const blocks = document.querySelectorAll('.cr-block');
      const vhMid = window.innerHeight / 2;
      let count = 0;
      blocks.forEach(function (b) {
        const rect = b.getBoundingClientRect();
        if (rect.top + rect.height / 2 < vhMid) count++;
      });

      if (count >= CONFIG.triggerThresholdBlocks) {
        STATE.shownInSection.add(idx);
        const section = getCurrentSection();
        const candidates = findCandidates(section);
        if (candidates.length === 0) return; // no eligible question — silently skip
        showRetrievalModal(pickRandom(candidates));
      }
    }, CONFIG.pollIntervalMs);
  }

  // ──────────────────────────────────────────────────────────────────────
  // Modal
  // ──────────────────────────────────────────────────────────────────────
  function showRetrievalModal(block) {
    const overlay = document.createElement('div');
    overlay.className = 'cr-retrieval-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'cr-retrieval-question');

    const options = block.options || [];

    overlay.innerHTML =
      '<div class="cr-retrieval-card" role="document">' +
        '<button class="cr-retrieval-close" type="button" aria-label="Close retrieval check">×</button>' +
        '<div class="cr-retrieval-eyebrow">⚡ Quick retrieval check</div>' +
        '<p class="cr-retrieval-subtle">Without scrolling up — test what you remember.</p>' +
        '<h3 class="cr-retrieval-question" id="cr-retrieval-question"></h3>' +
        '<ul class="cr-retrieval-options" role="list">' +
          options.map(function (opt, i) {
            return (
              '<li>' +
                '<button class="cr-retrieval-option" type="button" data-idx="' + i + '">' +
                  escHtml(opt && opt.text) +
                '</button>' +
              '</li>'
            );
          }).join('') +
        '</ul>' +
        '<div class="cr-retrieval-feedback" hidden></div>' +
        '<div class="cr-retrieval-footer">' +
          '<button class="cr-retrieval-skip" type="button">Skip for now</button>' +
          '<button class="cr-retrieval-continue" type="button" hidden>Continue reading →</button>' +
        '</div>' +
      '</div>';

    overlay.querySelector('#cr-retrieval-question').textContent = block.question;
    document.body.appendChild(overlay);

    // Lock background scroll while modal is open
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Focus management
    const focusables = overlay.querySelectorAll('button:not([hidden])');
    if (focusables.length) setTimeout(function () { focusables[0].focus(); }, 80);

    // Close handler
    function close() {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', keyHandler);
      overlay.remove();
    }
    function keyHandler(e) {
      if (e.key === 'Escape') close();
      // Simple focus trap: keep Tab inside the modal
      if (e.key === 'Tab') {
        const fs = overlay.querySelectorAll(
          'button:not([disabled]):not([hidden]), [tabindex]:not([tabindex="-1"])'
        );
        if (!fs.length) return;
        const first = fs[0], last = fs[fs.length - 1];
        if (e.shiftKey && document.activeElement === first) { last.focus(); e.preventDefault(); }
        else if (!e.shiftKey && document.activeElement === last) { first.focus(); e.preventDefault(); }
      }
    }
    document.addEventListener('keydown', keyHandler);

    overlay.querySelector('.cr-retrieval-close').addEventListener('click', close);
    overlay.querySelector('.cr-retrieval-skip').addEventListener('click', close);
    overlay.querySelector('.cr-retrieval-continue').addEventListener('click', close);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });

    // Option handler — grade + feedback
    overlay.querySelectorAll('.cr-retrieval-option').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const idx = parseInt(btn.dataset.idx, 10);
        const correct = isOptionCorrect(block, idx);

        overlay.querySelectorAll('.cr-retrieval-option').forEach(function (b, i) {
          b.disabled = true;
          if (isOptionCorrect(block, i)) b.classList.add('cr-retrieval-correct');
          else if (b === btn) b.classList.add('cr-retrieval-wrong');
        });

        const fb = overlay.querySelector('.cr-retrieval-feedback');
        fb.hidden = false;
        fb.className = 'cr-retrieval-feedback ' +
          (correct ? 'cr-retrieval-fb-correct' : 'cr-retrieval-fb-wrong');
        fb.innerHTML =
          '<strong>' + (correct ? '✓ Right.' : '✗ Not quite.') + '</strong>' +
          (block.explanation ? '<p>' + escHtml(block.explanation) + '</p>' : '');

        overlay.querySelector('.cr-retrieval-continue').hidden = false;
        overlay.querySelector('.cr-retrieval-skip').hidden = true;
      });
    });
  }

  // ──────────────────────────────────────────────────────────────────────
  // Styles
  // ──────────────────────────────────────────────────────────────────────
  function injectStyles() {
    if (document.getElementById('cr-retrieval-styles')) return;
    const style = document.createElement('style');
    style.id = 'cr-retrieval-styles';
    style.textContent =
      ".cr-retrieval-overlay{position:fixed;inset:0;background:rgba(0,0,0,.55);" +
      "display:flex;align-items:center;justify-content:center;z-index:99999;" +
      "animation:cr-retrieval-fade .2s ease-out;padding:16px}" +
      "@keyframes cr-retrieval-fade{from{opacity:0}to{opacity:1}}" +
      ".cr-retrieval-card{background:#FAF5EC;border:1px solid #DDD9D3;border-radius:12px;" +
      "max-width:600px;width:100%;max-height:calc(100vh - 32px);overflow-y:auto;" +
      "padding:1.75em 1.5em 1.25em;position:relative;box-shadow:0 16px 48px rgba(0,0,0,.3);" +
      "font-family:Lato,system-ui,sans-serif}" +
      ".cr-retrieval-close{position:absolute;top:12px;right:12px;background:transparent;" +
      "border:none;font-size:28px;line-height:1;cursor:pointer;color:#6B1D34;" +
      "padding:4px 10px;border-radius:4px}" +
      ".cr-retrieval-close:hover{background:rgba(0,0,0,.05)}" +
      ".cr-retrieval-eyebrow{font-family:'Cormorant Garamond',Georgia,serif;font-size:.95em;" +
      "text-transform:uppercase;letter-spacing:.15em;color:#6B1D34;font-weight:600}" +
      ".cr-retrieval-subtle{color:#555;margin:.35em 0 1em;font-size:.95em}" +
      ".cr-retrieval-question{font-family:'Cormorant Garamond',Georgia,serif;font-size:1.35em;" +
      "color:#284157;line-height:1.4;margin:0 0 .85em}" +
      ".cr-retrieval-options{list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:.5em}" +
      ".cr-retrieval-option{width:100%;text-align:left;background:#FDF8EE;" +
      "border:1px solid #DDD9D3;border-radius:8px;padding:.85em 1em;font-family:inherit;" +
      "font-size:1em;color:#284157;cursor:pointer;transition:all .15s ease;line-height:1.4}" +
      ".cr-retrieval-option:hover:not(:disabled){border-color:#6B1D34;background:#FAF5EC}" +
      ".cr-retrieval-option:disabled{cursor:default}" +
      ".cr-retrieval-correct{background:#E8F5E8 !important;border-color:#4A7C59 !important;color:#2D5A3D !important}" +
      ".cr-retrieval-correct::before{content:'✓ ';font-weight:bold}" +
      ".cr-retrieval-wrong{background:#FCE8E8 !important;border-color:#B33A3A !important;color:#7B2D2D !important}" +
      ".cr-retrieval-wrong::before{content:'✗ ';font-weight:bold}" +
      ".cr-retrieval-feedback{margin:1em 0;padding:.85em 1em;border-radius:8px;font-size:.95em;line-height:1.5}" +
      ".cr-retrieval-feedback p{margin:.4em 0 0}" +
      ".cr-retrieval-fb-correct{background:#E8F5E8;border-left:4px solid #4A7C59;color:#2D5A3D}" +
      ".cr-retrieval-fb-wrong{background:#FCE8E8;border-left:4px solid #B33A3A;color:#7B2D2D}" +
      ".cr-retrieval-footer{display:flex;justify-content:flex-end;gap:.5em;margin-top:1em;" +
      "padding-top:.85em;border-top:1px solid #DDD9D3}" +
      ".cr-retrieval-skip,.cr-retrieval-continue{background:transparent;border:1px solid #DDD9D3;" +
      "border-radius:6px;padding:.55em 1em;font-size:.9em;cursor:pointer;color:#555;font-family:inherit}" +
      ".cr-retrieval-skip:hover{background:rgba(0,0,0,.04);border-color:#6B1D34;color:#6B1D34}" +
      ".cr-retrieval-continue{background:#6B1D34;color:#FAF5EC;border-color:#6B1D34}" +
      ".cr-retrieval-continue:hover{background:#581629}" +
      "@media (max-width:640px){.cr-retrieval-overlay{padding:0;align-items:stretch}" +
      ".cr-retrieval-card{width:100%;max-width:100%;height:100vh;max-height:100vh;" +
      "border-radius:0;border:none;padding:1.5em 1em 1em}}";
    document.head.appendChild(style);
  }

  // ──────────────────────────────────────────────────────────────────────
  // Init
  // ──────────────────────────────────────────────────────────────────────
  function init() {
    injectStyles();
    waitForCourse(function () {
      startPolling();
      // eslint-disable-next-line no-console
      console.log('[CR Retrieval Popup] initialized — Stage 5f MVP');
    }, 60); // ~12 seconds max wait
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
