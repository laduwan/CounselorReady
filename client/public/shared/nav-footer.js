/**
 * CounselorReady — Shared Navigation & Footer
 * Include on EVERY page: <script src="/shared/nav-footer.js"></script>
 * 
 * This file injects the consistent header nav and burgundy footer.
 * Edit HERE = every page updates automatically. No more drift.
 * 
 * Usage: Add these two elements where you want nav/footer to appear:
 *   <div id="cr-header"></div>   (top of <body>)
 *   <div id="cr-footer"></div>   (bottom, before </body>)
 * 
 * The script auto-detects which page is active from the URL.
 */

(function () {
  const path = location.pathname;

  // ── NAV TABS ──────────────────────────────────────────────
  // Add/remove tabs here — they update on every page instantly.
  const tabs = [
    { label: 'Dashboard', href: '/dashboard.html' },
    { label: 'Courses', href: '/courses.html' },
    { label: 'Books', href: '/books.html' },
    { label: 'Live Sessions', href: '/live-sessions.html' },
    { label: 'Credentials', href: '/credentials.html' },
    { label: 'CE Certificates', href: '/credentials.html#certifications' },
    { label: 'Blog', href: '/blog.html' },
    { label: 'Messages', href: '/messages.html' },
    { label: 'My Organization', href: '/organization.html' },
  ];

  // Secondary links shown in mobile menu below divider
  const secondaryLinks = [
    { label: 'Researched-N-Ready', href: '/research-ready.html' },
    { label: 'CE Planner', href: '/ce-planner.html' },
    { label: 'Achievements', href: '/achievements.html' },
    { label: 'Referrals', href: '/referrals.html' },
    { label: 'Partner Portal', href: '/partner-dashboard.html' },
    { label: 'Legacy Vault', href: '/legacy-vault.html' },
    { label: 'My Compliance', href: '/my-compliance.html' },
  ];

  // ── POLICY LINKS (footer) ────────────────────────────────
  const policyLinks = [
    { label: 'Become a Partner', href: '/partner' },
    { label: 'Privacy', href: '/privacy.html' },
    { label: 'Terms', href: '/terms.html' },
    { label: 'Refunds', href: '/refund-policy.html' },
    { label: 'ADA Accommodations', href: '/ada-accommodations.html' },
    { label: 'Non-Discrimination', href: '/non-discrimination.html' },
    { label: 'Complaints', href: '/complaint-resolution.html' },
  ];

  // ── DETECT ACTIVE TAB ─────────────────────────────────────
  function isActive(href) {
    if (href === '/dashboard.html' && (path === '/' || path === '/dashboard.html')) return true;
    return path === href || path.startsWith(href.replace('.html', ''));
  }

  // Also detect admin pages
  const isAdminPage = path.includes('admin');

  // ── BUILD DESKTOP NAV LINKS ───────────────────────────────
  function desktopTabs() {
    return tabs.map(t => {
      const active = isActive(t.href);
      return `<a href="${t.href}" class="nav-link${active ? ' active' : ''}">${t.label}</a>`;
    }).join('\n        ');
  }

  // ── BUILD MOBILE NAV LINKS ────────────────────────────────
  function mobileTabs() {
    const main = tabs.map(t => {
      const active = isActive(t.href);
      return `<a href="${t.href}" class="block px-4 py-2.5 rounded-lg text-sm${active ? ' font-semibold' : ''}" style="color:${active ? '#6B1D34' : '#57534e'};${active ? 'background:#FDF5F7' : ''}">${t.label}</a>`;
    }).join('\n      ');

    const secondary = secondaryLinks.map(l =>
      `<a href="${l.href}" class="block px-4 py-2 rounded-lg text-sm" style="color:#78716c">${l.label}</a>`
    ).join('\n        ');

    return `${main}
      <div style="border-top:1px solid #F1EFE9;margin:6px 0;padding-top:6px">
        ${secondary}
      </div>
      <a href="/team-compliance.html" id="teamCompMob" class="hidden px-4 py-2.5 rounded-lg text-sm font-semibold" style="color:#6B1D34;background:#FDF5F7">Team Compliance</a>
      <a href="/admin.html" id="adminMob" class="hidden px-4 py-2.5 rounded-lg text-sm font-semibold" style="color:#6B1D34;background:#FDF5F7">Admin Panel</a>`;
  }

  // ── HEADER HTML ───────────────────────────────────────────
  const headerHTML = `
  <header style="background:#fff;border-bottom:1px solid #e7e5e4;position:sticky;top:0;z-index:50;box-shadow:0 1px 3px rgba(107,29,52,.08)">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
      <a href="/dashboard.html" class="flex items-center gap-3 flex-shrink-0" style="text-decoration:none">
        <div style="width:42px;height:42px;border-radius:.75rem;background:#6B1D34;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(107,29,52,.25)">
          <span style="position:relative;display:inline-block;width:24px;height:24px">
            <span class="font-display" style="color:#D4A855;position:absolute;top:-3px;left:0;font-weight:700;font-size:19px">C</span>
            <span class="font-display" style="color:#7A9E84;position:absolute;top:4px;left:6px;font-weight:700;font-size:16px">R</span>
          </span>
        </div>
        <span class="font-display hidden sm:inline" style="font-weight:700;font-size:1.5rem;letter-spacing:.015em">
          <span style="color:#6B1D34">Counselor</span><span style="color:#3D6A4A">Ready</span>
        </span>
      </a>
      <nav class="hidden lg:flex items-center gap-1">
        ${desktopTabs()}
      </nav>
      <div class="flex items-center gap-2">
        <a href="/admin.html" id="adminBadge" class="hidden items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full" style="color:#6B1D34;background:#FDF5F7;border:1px solid #6B1D34;text-decoration:none">
          <svg width="14" height="14" class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
          Admin
        </a>
        <a href="/team-compliance.html" id="teamCompBadge" class="hidden items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full" style="color:#6B1D34;background:#FDF5F7;border:1px solid #6B1D34;text-decoration:none">
          <svg width="14" height="14" class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          Team
        </a>
        <div class="relative">
          <button onclick="toggleCRDropdown('notif')" class="p-2 rounded-lg hover:bg-stone-100 transition-colors relative">
            <svg width="20" height="20" class="w-5 h-5" style="color:#78716c" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
            <span id="notifDot" class="hidden absolute top-1 right-1 w-2.5 h-2.5 bg-burgundy-800 rounded-full border-2 border-white"></span>
          </button>
          <div class="ov" id="notifOv" onclick="closeCRDropdown('notif')"></div>
          <div class="dd" id="notifDd" style="width:300px;right:0;padding:0">
            <div style="padding:10px 16px;border-bottom:1px solid #F1EFE9;display:flex;justify-content:space-between;align-items:center"><span style="font-weight:600;font-size:13px;color:#6B1D34">Notifications</span><button onclick="markAllRead()" style="font-size:11px;color:#4A7C59;font-weight:600;background:none;border:none;cursor:pointer">Mark all read</button></div>
            <div id="notifList" style="max-height:280px;overflow-y:auto;padding:4px 0"><div style="padding:20px 16px;text-align:center;color:#7A98AE;font-size:12px">No notifications yet</div></div>
          </div>
        </div>
        <div class="relative">
          <button onclick="toggleCRDropdown('user')" class="flex items-center gap-2 p-1 rounded-lg hover:bg-stone-100 transition-colors">
            <div style="width:32px;height:32px;border-radius:50%;background:#6B1D34;display:flex;align-items:center;justify-content:center;color:#fff;font-size:12px;font-weight:600" id="avatarInit">U</div>
            <span class="hidden md:block text-sm font-medium truncate" style="color:#57534e;max-width:120px" id="avatarName"></span>
            <svg width="14" height="14" class="w-3.5 h-3.5 hidden md:block" style="color:#a8a29e" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
          </button>
          <div class="ov" id="userOv" onclick="closeCRDropdown('user')"></div>
          <div class="dd" id="userDd" style="width:210px;right:0">
            <div style="padding:10px 16px;border-bottom:1px solid #F1EFE9"><p style="font-size:13px;font-weight:600;color:#44403c;margin:0" id="menuName">User</p><p style="font-size:11px;color:#78716c;margin:2px 0 0" id="menuEmail"></p><span id="menuPlan" style="display:inline-block;margin-top:4px;font-size:10px;padding:2px 8px;border-radius:10px;font-weight:600;background:#FDF5F7;color:#6B1D34"></span></div>
            <a href="/admin.html" id="menuAdminLink" style="display:none;color:#6B1D34"><svg width="16" height="16" class="w-4 h-4" style="color:#6B1D34" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg> Admin Panel</a>
            <a href="/team-compliance.html" id="menuTeamCompLink" style="display:none;color:#6B1D34"><svg width="16" height="16" class="w-4 h-4" style="color:#6B1D34" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg> Team Compliance</a>
            <a href="/settings.html"><svg width="16" height="16" class="w-4 h-4" style="color:#7A98AE" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><circle cx="12" cy="12" r="3"/></svg> Settings</a>
            <a href="/messages.html"><svg width="16" height="16" class="w-4 h-4" style="color:#7A98AE" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg> Messages</a>
            <a href="/my-books.html"><svg width="16" height="16" class="w-4 h-4" style="color:#7A98AE" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg> My Books</a>
            <div style="border-top:1px solid #F1EFE9;margin-top:4px;padding-top:4px"><a href="#" onclick="crLogout();return false" style="color:#DC2626"><svg width="16" height="16" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg> Sign out</a></div>
          </div>
        </div>
        <button onclick="toggleCRMobile()" class="lg:hidden p-2 rounded-lg hover:bg-stone-100" style="color:#78716c">
          <svg id="hamOpen" width="20" height="20" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
          <svg id="hamClose" width="20" height="20" class="w-5 h-5 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>
    </div>
    <div id="mobileNav" class="hidden lg:hidden border-t border-stone-200 bg-white px-4 py-3 space-y-1">
      ${mobileTabs()}
    </div>
  </header>`;

  // ── FOOTER HTML ───────────────────────────────────────────
  const policyItems = policyLinks.map(l =>
    `<a href="${l.href}" style="font-size:11px;color:rgba(255,255,255,0.6);text-decoration:none;transition:color .15s" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='rgba(255,255,255,0.6)'">${l.label}</a>`
  ).join('\n            <span style="color:rgba(255,255,255,0.2)">&middot;</span>\n            ');

  const footerHTML = `
  <footer style="background:#3B0F1D;margin-top:2rem">
    <div style="max-width:900px;margin:0 auto;padding:40px 24px 28px;font-family:'Lato',Calibri,sans-serif">
      <div style="display:flex;flex-wrap:wrap;gap:32px;align-items:flex-start;margin-bottom:28px">
        <div style="flex:1;min-width:220px">
          <div class="font-display" style="font-size:24px;font-weight:700;margin-bottom:8px">
            <span style="color:#D0768A">Counselor</span><span style="color:#4A7C59">Ready</span>&trade;
          </div>
          <div class="font-display" style="font-size:13px;color:#D4A855;letter-spacing:0.15em;font-weight:500;margin-bottom:12px">LEARN. LICENSE. LEAD.&trade;</div>
          <p style="font-size:12px;line-height:1.7;color:rgba(255,255,255,0.75);max-width:280px;margin:0">The continuing education platform built by a counselor, for counselors. Track credentials, complete courses, stay audit-ready.</p>
        </div>
        <div style="display:flex;align-items:center;gap:16px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:10px;padding:16px 20px;min-width:260px">
          <div style="width:64px;height:64px;background:#fff;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0;overflow:hidden">
            <img src="/images/logo/nbcc-acep-logo.jpg" alt="NBCC Approved Continuing Education Provider" style="width:56px;height:56px;object-fit:contain" onerror="this.onerror=null;this.src='/images/nbcc-provider-badge.jpg'">
          </div>
          <div>
            <div style="font-size:13px;font-weight:600;color:#fff;line-height:1.4">NBCC Approved Provider</div>
            <div style="font-size:11px;color:rgba(255,255,255,0.6);margin-top:2px">ACEP #7760 &middot; GAITP LLC</div>
          </div>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:24px;flex:1;min-width:200px;justify-content:flex-end">
          <div>
            <h4 style="font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#D4A855;margin:0 0 10px">Platform</h4>
            <a href="/courses.html" style="display:block;font-size:12px;color:rgba(255,255,255,0.75);text-decoration:none;padding:3px 0;transition:color .15s" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='rgba(255,255,255,0.75)'">Browse courses</a>
            <a href="/books.html" style="display:block;font-size:12px;color:rgba(255,255,255,0.75);text-decoration:none;padding:3px 0;transition:color .15s" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='rgba(255,255,255,0.75)'">Books</a>
            <a href="/research-ready.html" style="display:block;font-size:12px;color:rgba(255,255,255,0.75);text-decoration:none;padding:3px 0;transition:color .15s" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='rgba(255,255,255,0.75)'">Researched-N-Ready</a>
            <a href="/credentials.html" style="display:block;font-size:12px;color:rgba(255,255,255,0.75);text-decoration:none;padding:3px 0;transition:color .15s" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='rgba(255,255,255,0.75)'">Credentials</a>
            <a href="/credentials.html#certifications" style="display:block;font-size:12px;color:rgba(255,255,255,0.75);text-decoration:none;padding:3px 0;transition:color .15s" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='rgba(255,255,255,0.75)'">CE certificates</a>
          </div>
          <div>
            <h4 style="font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#D4A855;margin:0 0 10px">Support</h4>
            <a href="/help.html" style="display:block;font-size:12px;color:rgba(255,255,255,0.75);text-decoration:none;padding:3px 0;transition:color .15s" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='rgba(255,255,255,0.75)'">Help center</a>
            <a href="/blog.html" style="display:block;font-size:12px;color:rgba(255,255,255,0.75);text-decoration:none;padding:3px 0;transition:color .15s" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='rgba(255,255,255,0.75)'">Blog</a>
            <a href="mailto:support@counselorready.com" style="display:block;font-size:12px;color:rgba(255,255,255,0.75);text-decoration:none;padding:3px 0;transition:color .15s" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='rgba(255,255,255,0.75)'">Contact us</a>
            <a href="/about.html" style="display:block;font-size:12px;color:rgba(255,255,255,0.75);text-decoration:none;padding:3px 0;transition:color .15s" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='rgba(255,255,255,0.75)'">About</a>
          </div>
        </div>
      </div>
      <div style="height:1px;background:linear-gradient(to right,transparent,rgba(255,255,255,0.1),transparent);margin-bottom:20px"></div>
      <p style="font-size:10.5px;line-height:1.7;color:rgba(255,255,255,0.45);text-align:center;max-width:720px;margin:0 auto 20px">
        CounselorReady is operated by GA Integrated Therapeutic Perspectives LLC, an NBCC Approved Continuing Education Provider (ACEP #7760). Programs that do not qualify for NBCC credit are clearly identified. GA Integrated Therapeutic Perspectives LLC is solely responsible for all aspects of the programs. NCMHCE&reg; is a registered trademark of the National Board for Certified Counselors, Inc. (NBCC). CounselorReady is not affiliated with, endorsed by, or sponsored by NBCC.
      </p>
      <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:12px">
        <p style="font-size:11px;color:rgba(255,255,255,0.45);margin:0">&copy; ${new Date().getFullYear()} GA Integrated Therapeutic Perspectives LLC. CounselorReady&trade; is a trademark of GAITP LLC. All rights reserved.</p>
        <div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center">
          ${policyItems}
        </div>
      </div>
    </div>
  </footer>`;

  // ── INJECT ────────────────────────────────────────────────
  // Inject immediately if divs already exist; otherwise defer until DOM is
  // parsed. This makes the script tag's position in the page irrelevant —
  // <head>, top of <body>, or before the divs in <body> all work.
  function crInject() {
    const headerEl = document.getElementById('cr-header');
    const footerEl = document.getElementById('cr-footer');
    if (headerEl) headerEl.innerHTML = headerHTML;
    if (footerEl) footerEl.innerHTML = footerHTML;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', crInject);
  } else {
    crInject();
  }

  // ── SHARED FUNCTIONS (global) ─────────────────────────────
  window.toggleCRDropdown = function (id) {
    document.getElementById(id + 'Dd').classList.toggle('open');
    document.getElementById(id + 'Ov').classList.toggle('open');
  };
  window.closeCRDropdown = function (id) {
    document.getElementById(id + 'Dd').classList.remove('open');
    document.getElementById(id + 'Ov').classList.remove('open');
  };
  window.toggleCRMobile = function () {
    document.getElementById('mobileNav').classList.toggle('hidden');
    document.getElementById('hamOpen').classList.toggle('hidden');
    document.getElementById('hamClose').classList.toggle('hidden');
  };
  window.crLogout = function () {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    location.href = '/login.html';
  };

  // ── LOAD USER (populates avatar, admin badge, name) ──────
  const API = location.hostname === 'localhost' ? 'http://localhost:5000' : 'https://api.counselorready.com';
  const T = localStorage.getItem('token');

  // Fetch feature flags for partner gating
  let featureFlags = null;
  if (T) {
    fetch(`${API}/api/auth/features`, { headers: { Authorization: `Bearer ${T}` } })
      .then(r => { if (r.ok) return r.json(); })
      .then(d => {
        if (d && d.features) {
          featureFlags = d.features;
          window.crFeatureFlags = featureFlags;
          // Hide nav links based on partner feature flags
          if (featureFlags.isPartnerUser) {
            if (!featureFlags.certTracking) {
              document.querySelectorAll('a[href="/credentials.html#certifications"]').forEach(el => el.style.display = 'none');
            }
            if (!featureFlags.credentialManagement) {
              document.querySelectorAll('a[href="/credentials.html"]').forEach(el => el.style.display = 'none');
            }
            if (!featureFlags.complianceTracking) {
              document.querySelectorAll('a[href="/my-compliance.html"], a[href="/team-compliance.html"]').forEach(el => el.style.display = 'none');
              const tcb = document.getElementById('teamCompBadge');
              if (tcb) tcb.style.display = 'none';
              const tcm = document.getElementById('teamCompMob');
              if (tcm) tcm.style.display = 'none';
              const tcl = document.getElementById('menuTeamCompLink');
              if (tcl) tcl.style.display = 'none';
            }
            if (!featureFlags.clinicalTools) {
              document.querySelectorAll('a[href^="/tools/"]').forEach(el => el.style.display = 'none');
            }
          }
        }
      })
      .catch(() => {});
  }

  if (T) {
    fetch(`${API}/api/auth/me`, { headers: { Authorization: `Bearer ${T}` } })
      .then(r => {
        if (r.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          const pub = ['/', '/landing.html', '/courses.html', '/course-details.html', '/login.html', '/register.html', '/verify-email.html', '/reset-password.html', '/forgot-password.html', '/blog.html'];
          if (!pub.includes(location.pathname)) {
            location.href = '/login.html?redirect=' + encodeURIComponent(location.pathname + location.search);
          }
          throw 0;
        }
        if (!r.ok) throw 0;
        return r.json();
      })
      .then(d => {
        const u = d.user || d;
        const f = u.profile?.firstName || u.firstName || '';
        const l = u.profile?.lastName || u.lastName || '';
        const initEl = document.getElementById('avatarInit');
        const nameEl = document.getElementById('avatarName');
        const menuNameEl = document.getElementById('menuName');
        const menuEmailEl = document.getElementById('menuEmail');
        const menuPlanEl = document.getElementById('menuPlan');

        if (initEl) initEl.textContent = `${f.charAt(0)}${l.charAt(0)}`.toUpperCase() || 'U';
        if (nameEl) nameEl.textContent = f || u.email?.split('@')[0] || '';
        if (menuNameEl) menuNameEl.textContent = `${f} ${l}`.trim() || 'User';
        if (menuEmailEl) menuEmailEl.textContent = u.email || '';
        if (menuPlanEl) {
          const p = u.subscription?.plan || 'free';
          menuPlanEl.textContent = p.charAt(0).toUpperCase() + p.slice(1) + ' plan';
        }

        if (u.role === 'admin' || u.isAdmin) {
          document.getElementById('adminBadge')?.classList.remove('hidden');
          document.getElementById('adminBadge')?.classList.add('flex');
          document.getElementById('adminMob')?.classList.remove('hidden');
          const ml = document.getElementById('menuAdminLink');
          if (ml) ml.style.display = 'flex';
        }

        // Team Compliance: reveal for org owners/admins (same display:none + role-check pattern)
        const userEmail = u.email || '';
        fetch(`${API}/api/organizations/mine`, { headers: { Authorization: `Bearer ${T}` } })
          .then(r => r.ok ? r.json() : [])
          .then(orgs => {
            const isOrgAdmin = orgs.some(o =>
              (o.seats || []).some(s => s.email === userEmail && ['owner', 'admin'].includes(s.role))
            );
            if (isOrgAdmin) {
              document.getElementById('teamCompBadge')?.classList.remove('hidden');
              document.getElementById('teamCompBadge')?.classList.add('flex');
              document.getElementById('teamCompMob')?.classList.remove('hidden');
              const tl = document.getElementById('menuTeamCompLink');
              if (tl) tl.style.display = 'flex';
            }
          })
          .catch(() => {});

        localStorage.setItem('user', JSON.stringify(u));
      })
      .catch(() => {});

    // Load notifications
    fetch(`${API}/api/notifications?limit=8`, { headers: { Authorization: `Bearer ${T}` } })
      .then(r => { if (!r.ok) throw 0; return r.json(); })
      .then(d => {
        const n = d.notifications || [], u = d.unreadCount || 0;
        if (u > 0) document.getElementById('notifDot')?.classList.remove('hidden');
        if (n.length) {
          const el = document.getElementById('notifList');
          if (el) el.innerHTML = n.map(x => `<div style="padding:10px 16px;border-bottom:1px solid #F1EFE9;${x.read ? '' : 'background:#FDF5F7;'}" class="hover:bg-stone-50 cursor-pointer"><p style="font-size:13px;font-weight:500;color:#44403c;margin:0">${x.title || ''}</p><p style="font-size:11px;color:#78716c;margin:2px 0 0">${x.message || ''}</p></div>`).join('');
        }
      })
      .catch(() => {});
  }

  window.markAllRead = function () {
    if (!T) return;
    fetch(`${API}/api/notifications/read-all`, { method: 'PATCH', headers: { Authorization: `Bearer ${T}` } })
      .then(() => document.getElementById('notifDot')?.classList.add('hidden'))
      .catch(() => {});
  };

  // ── GOOGLE ADS CONVERSION TRACKING ────────────────────────
  if (!window.gtag) {
    const gtagScript = document.createElement('script');
    gtagScript.async = true;
    gtagScript.src = 'https://www.googletagmanager.com/gtag/js?id=AW-16681104079';
    document.head.appendChild(gtagScript);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', 'AW-16681104079');
  }


  // ── PARTNER PORTAL CORNER POPUP ──────────────────────────────
  (function injectPartnerPopup() {
    const DISMISS_KEY = 'cr_partner_popup_dismissed';
    const path = window.location.pathname;
    if (!path.includes('live-room') && !path.includes('live-evaluation')) return;
    const dismissed = localStorage.getItem(DISMISS_KEY);
    if (dismissed && Date.now() - parseInt(dismissed) < 7 * 24 * 60 * 60 * 1000) return;

    const el = document.createElement('div');
    el.id = 'cr-partner-popup';
    el.innerHTML = `
      <button id="cr-pp-close" aria-label="Dismiss">✕</button>
      <div class="cr-pp-eyebrow">Are you an educator?</div>
      <div class="cr-pp-body">Did you enjoy the flow of today's webinar? Join the CounselorReady Partner Portal and let us host your CE content.</div>
      <a href="/partner-onboarding.html" class="cr-pp-cta">Learn about partnering →</a>
    `;

    const style = document.createElement('style');
    style.textContent = `
      #cr-partner-popup {
        position: fixed; bottom: 24px; right: 24px; z-index: 9000;
        width: 300px; background: linear-gradient(135deg, #3D1120 0%, #6B1D34 55%, #284157 100%);
        border-radius: 14px; padding: 22px 22px 18px;
        box-shadow: 0 8px 32px rgba(0,0,0,.28), 0 0 0 1px rgba(212,168,85,.25);
        font-family: 'Lato', system-ui, sans-serif;
        animation: cr-pp-slide 0.35s cubic-bezier(.16,1,.3,1);
      }
      @keyframes cr-pp-slide {
        from { opacity:0; transform: translateY(20px) scale(.96); }
        to   { opacity:1; transform: translateY(0) scale(1); }
      }
      #cr-pp-close {
        position: absolute; top: 10px; right: 12px;
        background: none; border: none; color: rgba(255,255,255,.45);
        font-size: 14px; cursor: pointer; line-height: 1; padding: 2px 4px;
      }
      #cr-pp-close:hover { color: #fff; }
      .cr-pp-eyebrow {
        font-size: 10.5px; letter-spacing: .2em; text-transform: uppercase;
        color: #D4A855; font-weight: 700; margin-bottom: 7px;
      }
      .cr-pp-body {
        font-size: 13.5px; line-height: 1.5; color: rgba(255,255,255,.88);
        margin-bottom: 14px;
      }
      .cr-pp-cta {
        display: inline-block; background: #D4A855; color: #3D1120;
        font-size: 12.5px; font-weight: 700; padding: 8px 16px;
        border-radius: 7px; text-decoration: none; letter-spacing: .04em;
        transition: background .15s;
      }
      .cr-pp-cta:hover { background: #c49840; }
    `;
    document.head.appendChild(style);

    document.addEventListener('DOMContentLoaded', function() {
      document.body.appendChild(el);
      document.getElementById('cr-pp-close').addEventListener('click', function() {
        el.style.opacity = '0';
        el.style.transform = 'translateY(10px)';
        el.style.transition = 'opacity .2s, transform .2s';
        setTimeout(() => el.remove(), 220);
        localStorage.setItem(DISMISS_KEY, String(Date.now()));
      });
    });
  })();

  window.gtag_report_conversion = function (transactionId, value) {
    window.gtag('event', 'conversion', {
      'send_to': 'AW-16681104079/301FCOXuxp8cEM_llZI-',
      'transaction_id': transactionId || '',
      'value': value || 0,
      'currency': 'USD'
    });
  };
})();
