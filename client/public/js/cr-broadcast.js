/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
/**
 * cr-broadcast.js — admin broadcast popup for the static pages.
 *
 * The React BroadcastPopup (client/src/components/BroadcastPopup.jsx) only mounts
 * inside <Layout>, and the shared nav sends learners to the .html pages instead, so
 * broadcasts never reached them. This is the same popup for the static side.
 *
 * Deliberate difference from the React version: this one closes ONLY on an explicit
 * click of Close / Got it / the X. No backdrop click, no Escape key — a broadcast has
 * to be acknowledged.
 */
(function () {
  var API = location.hostname === 'localhost' ? 'http://localhost:5000' : 'https://api.counselorready.com';
  var token = localStorage.getItem('token');
  if (!token) return;

  // The course player runs its own timing and engagement tracking; do not interrupt it.
  if (/\/interactive-course(-legacy)?\.html/.test(location.pathname)) return;

  // Brand burgundy for every type, matching the admin broadcast modal header and
  // the --cr-burgundy token ("H1, logo, CTAs, alerts"). The type is carried by the
  // label text, not by a per-type color: the platform palette is burgundy/forest/
  // stone and no other palette belongs on these pages.
  //
  // No FontAwesome classes here on purpose either: only 23 of the 76 pages that load
  // the shared nav also load FontAwesome, and an <i class="fas ..."> on the rest
  // renders as nothing — which would make the close X an invisible button.
  var ACCENT = '#6B1D34';  // --cr-burgundy-800, PRIMARY brand
  var BODY_BG = '#FFFFFF';

  var TYPE_LABELS = {
    urgent:      'Urgent Notice',
    maintenance: 'Maintenance',
    info:        'Announcement',
    update:      'Update',
    promotion:   'Promotion',
    ce_change:   'CE Requirement Change',
    new_course:  'New Course'
  };

  var queue = [];
  var index = 0;
  var busy = false;
  var root = null;
  var lastFocus = null;

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function dismissedLocally() {
    try {
      return JSON.parse(sessionStorage.getItem('cr_dismissed_broadcasts') || '[]');
    } catch (e) {
      return [];
    }
  }

  function rememberLocally(id) {
    try {
      var list = dismissedLocally();
      list.push(id);
      sessionStorage.setItem('cr_dismissed_broadcasts', JSON.stringify(list));
    } catch (e) { /* private mode — the server-side dismiss still holds */ }
  }

  function buildRoot() {
    root = document.createElement('div');
    root.id = 'crBroadcastRoot';
    root.style.cssText =
      'position:fixed;inset:0;z-index:9999;display:flex;align-items:center;' +
      'justify-content:center;padding:16px;background:rgba(0,0,0,0.5)';
    // No backdrop-click handler on purpose: the popup must be closed deliberately.
    document.body.appendChild(root);
  }

  function render() {
    var a = queue[index];
    if (!a) return;
    var label = TYPE_LABELS[a.type] || TYPE_LABELS.info;
    var multiple = queue.length > 1;
    var isLast = index >= queue.length - 1;

    root.innerHTML =
      '<div role="dialog" aria-modal="true" aria-labelledby="crBcTitle" tabindex="-1" ' +
        'style="width:100%;max-width:32rem;background:#fff;border-radius:12px;outline:none;' +
        'box-shadow:0 25px 50px -12px rgba(0,0,0,.25);overflow:hidden">' +
        '<div style="padding:16px 24px;display:flex;align-items:center;gap:12px;' +
          'background:' + ACCENT + ';color:#fff">' +
          '<div style="flex:1;min-width:0">' +
            '<p style="margin:0;font-size:13px;opacity:.9">' + esc(label) + '</p>' +
            '<h2 id="crBcTitle" style="margin:0;font-size:18px;font-weight:700;' +
              'font-family:\'Cormorant Garamond\',Georgia,serif;overflow:hidden;' +
              'text-overflow:ellipsis;white-space:nowrap">' + esc(a.title) + '</h2>' +
          '</div>' +
          '<button type="button" data-cr-close aria-label="Close announcement" ' +
            'style="flex-shrink:0;background:none;border:0;color:#fff;cursor:pointer;' +
            'padding:0 6px;border-radius:999px;font-size:24px;line-height:1">&times;</button>' +
        '</div>' +
        '<div style="padding:20px 24px;background:' + BODY_BG + '">' +
          '<div style="margin:0;color:#374151;line-height:1.6;font-family:\'Lato\',sans-serif;' +
            'max-height:50vh;overflow-y:auto">' + (a.message || '') + '</div>' +
        '</div>' +
        '<div style="padding:12px 24px;display:flex;align-items:center;justify-content:space-between;' +
          'border-top:1px solid #f3f4f6">' +
          '<span style="font-size:13px;color:#6b7280">' +
            (multiple ? (index + 1) + ' of ' + queue.length : '') + '</span>' +
          '<button type="button" data-cr-close ' +
            'style="padding:6px 16px;font-size:14px;font-weight:600;border:0;border-radius:8px;' +
            'cursor:pointer;color:#fff;background:' + ACCENT + '">' +
            (isLast ? 'Got it' : 'Next') + '</button>' +
        '</div>' +
      '</div>';

    var dialog = root.firstChild;
    var buttons = root.querySelectorAll('[data-cr-close]');
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].addEventListener('click', advance);
    }
    // Keep focus inside the dialog; Escape is intentionally not wired to close.
    dialog.focus();
  }

  function advance() {
    if (busy) return;
    busy = true;

    var a = queue[index];
    rememberLocally(a._id);
    fetch(API + '/api/announcements/' + a._id + '/dismiss', {
      method: 'PUT',
      headers: { Authorization: 'Bearer ' + token }
    }).catch(function () { /* local dismissal already recorded */ });

    index++;
    busy = false;

    if (index >= queue.length) {
      close();
    } else {
      render();
    }
  }

  function close() {
    if (root && root.parentNode) root.parentNode.removeChild(root);
    root = null;
    document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function start(items) {
    if (!items.length) return;
    queue = items;
    index = 0;
    lastFocus = document.activeElement;
    buildRoot();
    document.body.style.overflow = 'hidden';
    render();
  }

  function load() {
    var controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    var timer = setTimeout(function () { if (controller) controller.abort(); }, 10000);

    fetch(API + '/api/announcements', {
      headers: { Authorization: 'Bearer ' + token },
      signal: controller ? controller.signal : undefined
    })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (data) {
        clearTimeout(timer);
        if (!data) return;
        var skip = dismissedLocally();
        var items = (data.announcements || []).filter(function (a) {
          return !a.isRead && skip.indexOf(a._id) === -1;
        });
        start(items);
      })
      .catch(function () { clearTimeout(timer); /* never block the page */ });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', load);
  } else {
    load();
  }
})();
