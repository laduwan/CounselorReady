/**
 * CounselorReady — Partner Admin Portal Navigation
 * Include on partner admin pages: <script src="/shared/partner-nav.js"></script>
 *
 * Injects into id="cr-header" and id="cr-footer".
 * Does NOT load nav-footer.js — this is a standalone partner portal nav.
 * Auth: redirects to counselorready.com/login.html if no token found.
 */

(function () {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = 'https://counselorready.com/login.html';
    return;
  }

  // Load partner company name from stored user object
  let companyName = 'Partner Portal';
  let avatarInitials = 'P';
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.partnerName) companyName = user.partnerName;
    else if (user.name) companyName = user.name;
    avatarInitials = companyName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  } catch (e) {}

  const path = location.pathname;

  const navLinks = [
    { label: 'Dashboard',  href: '/partner-dashboard.html' },
    { label: 'Courses',    href: '/partner-courses.html' },
    { label: 'Users',      href: '/partner-users.html' },
    { label: 'Billing',    href: '/partner-billing.html' },
    { label: 'Earnings',   href: '/partner-earnings.html' },
    { label: 'Reports',    href: '/partner-reports.html' },
  ];

  const dropdownLinks = [
    { label: 'Branding',         href: '/partner-branding.html' },
    { label: 'Email Templates',  href: '/partner/email-templates' },
    { label: 'Custom Domain',    href: '/partner/domain' },
    { label: 'Payouts',          href: '/partner/connect' },
    { label: 'Add-ons',          href: '/partner-billing.html#addons' },
    { label: 'Marketplace',      href: '/partner-marketplace.html' },
  ];

  function isActive(href) {
    const hrefPath = href.split('#')[0];
    return path === hrefPath || path.startsWith(hrefPath.replace('.html', ''));
  }

  const navLinksHtml = navLinks.map(l => {
    const active = isActive(l.href);
    return `<a href="${l.href}" class="text-sm font-medium px-1 py-4 border-b-2 transition-colors ${
      active
        ? 'border-burgundy-700 text-burgundy-800'
        : 'border-transparent text-stone-500 hover:text-stone-800 hover:border-stone-300'
    }" style="${active ? 'color:#6B1D34;border-bottom-color:#6B1D34' : ''}">${l.label}</a>`;
  }).join('');

  const mobileNavLinksHtml = [...navLinks, ...dropdownLinks].map(l => {
    const active = isActive(l.href);
    return `<a href="${l.href}" class="block px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
      active ? 'text-burgundy-800 bg-stone-100' : 'text-stone-700 hover:bg-stone-50'
    }" style="${active ? 'color:#6B1D34' : ''}">${l.label}</a>`;
  }).join('');

  const dropdownLinksHtml = dropdownLinks.map(l =>
    `<a href="${l.href}" class="block px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 hover:text-stone-900 transition-colors">${l.label}</a>`
  ).join('');

  const headerHtml = `
<header style="background:#F8F7F4;border-bottom:1px solid #e7e5e4;" class="sticky top-0 z-40">
  <div class="max-w-7xl mx-auto px-4 sm:px-6">
    <div class="flex items-center justify-between h-14">

      <!-- Wordmark -->
      <a href="/partner-dashboard.html" class="flex items-center gap-2 flex-shrink-0">
        <span class="font-bold text-lg leading-none" style="font-family:'Cormorant Garamond',Georgia,serif">
          <span style="color:#6B1D34">Counselor</span><span style="color:#4A7C59">Ready</span>™
        </span>
        <span class="hidden sm:inline text-xs text-stone-400 font-medium border-l border-stone-300 pl-2 ml-1">Partner Portal</span>
      </a>

      <!-- Desktop nav links -->
      <nav class="hidden md:flex items-center gap-5 h-full">
        ${navLinksHtml}
      </nav>

      <!-- Right side: company name + avatar + dropdown -->
      <div class="flex items-center gap-3">
        <span class="hidden sm:block text-xs text-stone-500 max-w-[140px] truncate">${companyName}</span>
        <div class="relative" id="pnav-dropdown-wrap">
          <button id="pnav-avatar-btn" onclick="document.getElementById('pnav-dropdown-wrap').classList.toggle('pnav-open')"
            class="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold cursor-pointer select-none"
            style="background:#6B1D34">
            ${avatarInitials}
          </button>
          <div id="pnav-dropdown" class="absolute right-0 mt-1 w-52 bg-white rounded-xl border border-stone-200 shadow-lg py-1 hidden z-50">
            <div class="px-4 py-2 border-b border-stone-100">
              <p class="text-xs font-semibold text-stone-700 truncate">${companyName}</p>
            </div>
            ${dropdownLinksHtml}
            <div class="border-t border-stone-100 mt-1 pt-1">
              <button onclick="pnavSignOut()" class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">Sign out</button>
            </div>
          </div>
        </div>

        <!-- Mobile hamburger -->
        <button id="pnav-mobile-btn" onclick="document.getElementById('pnav-mobile-menu').classList.toggle('hidden')"
          class="md:hidden p-1.5 rounded-lg text-stone-500 hover:bg-stone-100 transition-colors">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
        </button>
      </div>
    </div>
  </div>

  <!-- Mobile menu -->
  <div id="pnav-mobile-menu" class="hidden md:hidden border-t border-stone-200 bg-white px-4 py-3 space-y-1">
    ${mobileNavLinksHtml}
    <div class="border-t border-stone-100 mt-2 pt-2">
      <button onclick="pnavSignOut()" class="w-full text-left px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors">Sign out</button>
    </div>
  </div>
</header>`;

  const footerHtml = `
<footer class="mt-16 border-t border-stone-200 py-6 text-center text-xs text-stone-400" style="background:#F8F7F4">
  &copy; 2026 CounselorReady&trade; &middot; Powered by GAITP LLC &middot;
  <a href="/privacy.html" class="hover:text-stone-600 transition-colors">Privacy</a> &middot;
  <a href="/terms.html" class="hover:text-stone-600 transition-colors">Terms</a>
</footer>`;

  // Inject header
  const headerEl = document.getElementById('cr-header');
  if (headerEl) headerEl.outerHTML = headerHtml;

  // Inject footer
  const footerEl = document.getElementById('cr-footer');
  if (footerEl) footerEl.outerHTML = footerHtml;

  // Dropdown toggle: close when clicking outside
  document.addEventListener('click', function (e) {
    const wrap = document.getElementById('pnav-dropdown-wrap');
    if (!wrap) return;
    if (!wrap.contains(e.target)) {
      wrap.classList.remove('pnav-open');
    }
  });

  // Toggle dropdown visibility based on pnav-open class
  const style = document.createElement('style');
  style.textContent = '.pnav-open #pnav-dropdown { display:block !important; }';
  document.head.appendChild(style);
})();

function pnavSignOut() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = 'https://counselorready.com/login.html';
}
