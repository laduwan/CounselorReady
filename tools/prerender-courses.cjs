/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 *
 * Pre-renders one standalone, crawlable SEO landing page per published course into
 * client/public/courses/{slug}.html. Each page ships static <head> tags (title,
 * description, Open Graph, Twitter Card, canonical, Course + BreadcrumbList JSON-LD)
 * so non-JS social scrapers (Facebook/LinkedIn/X) and crawlers get correct previews —
 * the problem client-side injection on course-details.html cannot solve.
 *
 * The Enroll CTA hands off to the existing, untouched /course-details.html?slug= flow
 * for auth/enrollment/payment. These files are BUILD ARTIFACTS — regenerate, never hand-edit.
 *
 * Usage:  node tools/prerender-courses.cjs
 * Non-fatal: on API failure it warns and exits 0, leaving any committed pages intact.
 */
const fs = require('fs');
const path = require('path');

const SITE = (process.env.SITE || 'https://counselorready.com').replace(/\/$/, '');
const API_BASE = (process.env.API_BASE || 'https://api.counselorready.com').replace(/\/$/, '');
const OUT_DIR = path.join(__dirname, '..', 'client', 'public', 'courses');

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
function attr(s) { return esc(s).replace(/\n/g, ' '); }
function clip(s, n) { s = String(s || '').replace(/\s+/g, ' ').trim(); return s.length > n ? s.slice(0, n - 1).trim() + '…' : s; }

function pageHtml(c) {
  const slug = c.slug;
  const url = `${SITE}/courses/${slug}`;
  const ce = c.ceHours ?? c.ceuHours ?? '';
  const title = c.title || 'Continuing Education Course';
  const desc = clip(c.description || `${ce} CE hour${ce !== 1 ? 's' : ''} of NBCC-approved continuing education for licensed counselors.`, 158);
  const img = c.thumbnail || `${SITE}/og-default.png`;
  const cats = Array.isArray(c.categories) ? c.categories : [];
  const objectives = Array.isArray(c.learningObjectives) ? c.learningObjectives
    : Array.isArray(c.objectives) ? c.objectives : [];
  const audience = Array.isArray(c.targetAudience) ? c.targetAudience.join(', ') : (c.targetAudience || '');
  const acep = c.acepNumber || c.approvalNumber || '7760';
  const priceNum = Number(c.price);
  const priceLabel = isNaN(priceNum) ? '' : (priceNum === 0 ? 'Free' : `$${priceNum}`);

  const courseLd = {
    '@context': 'https://schema.org', '@type': 'Course',
    name: title, description: desc, url,
    provider: { '@type': 'EducationalOrganization', name: 'CounselorReady', url: SITE },
    hasCourseInstance: { '@type': 'CourseInstance', courseMode: 'online', ...(ce ? { courseWorkload: `PT${ce}H` } : {}) },
    ...(c.courseCode ? { courseCode: c.courseCode } : {}),
    ...(c.thumbnail ? { image: c.thumbnail } : {}),
    ...(ce ? { educationalCredentialAwarded: `${ce} NBCC-approved CE hour${ce !== 1 ? 's' : ''} (ACEP Provider #${acep})` } : {}),
    ...(cats.length ? { about: cats } : {}),
    ...(!isNaN(priceNum) ? { offers: { '@type': 'Offer', price: priceNum, priceCurrency: 'USD', availability: 'https://schema.org/InStock', category: priceNum === 0 ? 'Free' : 'Paid', url } } : {})
  };
  const breadcrumbLd = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE },
      { '@type': 'ListItem', position: 2, name: 'Courses', item: `${SITE}/courses` },
      { '@type': 'ListItem', position: 3, name: title, item: url }
    ]
  };

  const objHtml = objectives.length
    ? `<section class="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 class="font-display text-xl font-semibold text-burgundy-900 mb-4">What you'll learn</h2>
        <ul class="space-y-2.5">
          ${objectives.map(o => `<li class="flex gap-3 text-sm text-stone-700"><i class="fas fa-check mt-1 text-hunter-500"></i><span>${esc(o)}</span></li>`).join('')}
        </ul>
      </section>` : '';

  const audHtml = audience
    ? `<section class="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 class="font-display text-xl font-semibold text-burgundy-900 mb-2">Who it's for</h2>
        <p class="text-sm text-stone-700">${esc(audience)}</p>
      </section>` : '';

  const facts = [
    ce ? [`${ce}`, 'CE Hours'] : null,
    c.sectionCount ? [`${c.sectionCount}`, 'Modules'] : null,
    c.assessmentQuestionCount ? [`${c.assessmentQuestionCount}`, 'Quiz Questions'] : null,
    c.totalEstimatedTime ? [`${Math.round((c.totalEstimatedTime || 0) / 60) || c.totalEstimatedTime}`, 'Est. Minutes'] : null,
  ].filter(Boolean);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="index,follow">
  <title>${attr(title)} — ${ce ? ce + ' CE Hours | ' : ''}CounselorReady</title>
  <meta name="description" content="${attr(desc)}">
  <link rel="canonical" href="${attr(url)}">

  <meta property="og:type" content="article">
  <meta property="og:site_name" content="CounselorReady">
  <meta property="og:title" content="${attr(title)} — CounselorReady CE Course">
  <meta property="og:description" content="${attr(desc)}">
  <meta property="og:url" content="${attr(url)}">
  <meta property="og:image" content="${attr(img)}">

  <meta name="twitter:card" content="${c.thumbnail ? 'summary_large_image' : 'summary'}">
  <meta name="twitter:title" content="${attr(title)} — CounselorReady CE Course">
  <meta name="twitter:description" content="${attr(desc)}">
  <meta name="twitter:image" content="${attr(img)}">

  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <link rel="stylesheet" href="/css/design-tokens.css">
  <link rel="stylesheet" href="/css/typography.css">
  <script src="https://cdn.tailwindcss.com/3.4.17"></script>
  <script src="/js/tailwind-config.js"></script>
  <script type="application/ld+json">${JSON.stringify(courseLd)}</script>
  <script type="application/ld+json">${JSON.stringify(breadcrumbLd)}</script>
  <style>body{background:#F8F7F4;font-family:'Lato',system-ui,sans-serif}.font-display{font-family:'Cormorant Garamond',Georgia,serif}</style>
  <script src="/js/cr-gtag.js"></script>
</head>
<body class="bg-stone-50 min-h-screen">
  <div id="cr-header"></div>
  <script src="/shared/nav-footer.js"></script>

  <main class="max-w-4xl mx-auto px-6 py-8">
    <nav class="text-xs text-stone-500 mb-4" aria-label="Breadcrumb">
      <a href="/" class="hover:text-burgundy-700">Home</a> ›
      <a href="/courses" class="hover:text-burgundy-700">Courses</a> ›
      <span class="text-stone-700">${esc(title)}</span>
    </nav>

    <header class="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
      <div class="flex flex-wrap items-center gap-2 mb-3">
        ${ce ? `<span class="text-xs font-semibold px-2.5 py-1 rounded-full" style="background:#fdf2f5;color:#6B1D34">${ce} CE Hours</span>` : ''}
        ${cats.map(cat => `<span class="text-xs font-medium px-2.5 py-1 rounded-full bg-stone-100 text-stone-600">${esc(cat)}</span>`).join('')}
      </div>
      <h1 class="font-display text-3xl font-bold text-burgundy-900">${esc(title)}</h1>
      <p class="text-stone-600 mt-3 leading-relaxed">${esc(c.description || '')}</p>
      <div class="flex flex-wrap items-center gap-3 mt-5">
        <a href="/course-details.html?slug=${encodeURIComponent(slug)}" class="bg-burgundy-800 hover:bg-burgundy-900 text-white px-5 py-2.5 rounded-lg font-medium transition-colors">
          ${priceLabel ? `Enroll${priceLabel === 'Free' ? ' Free' : ' — ' + priceLabel}` : 'Enroll Now'}
        </a>
        <a href="/course-details.html?slug=${encodeURIComponent(slug)}" class="text-sm text-burgundy-700 hover:underline font-medium">View full details</a>
      </div>
    </header>

    ${facts.length ? `<div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
      ${facts.map(([v, l]) => `<div class="bg-white rounded-xl border border-gray-200 p-4 text-center">
        <p class="text-2xl font-bold text-stone-900">${esc(v)}</p>
        <p class="text-xs text-stone-500 mt-0.5">${esc(l)}</p>
      </div>`).join('')}
    </div>` : ''}

    <div class="space-y-6">
      ${objHtml}
      ${audHtml}
      <section class="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 class="font-display text-xl font-semibold text-burgundy-900 mb-2">Approval &amp; credit</h2>
        <p class="text-sm text-stone-700">CounselorReady is an NBCC-Approved Continuing Education Provider (ACEP&nbsp;#${esc(acep)}). This course awards ${ce ? `${ce} ` : ''}NBCC-approved CE hour${ce !== 1 ? 's' : ''}; a certificate is issued on completion. Programs that do not qualify for NBCC credit are clearly identified. CounselorReady is solely responsible for all aspects of the program.</p>
      </section>
    </div>

    <div class="mt-8 text-center">
      <a href="/course-details.html?slug=${encodeURIComponent(slug)}" class="inline-block bg-hunter-700 hover:bg-hunter-800 text-white px-6 py-3 rounded-lg font-medium transition-colors">Enroll in this course</a>
    </div>
  </main>

  <script src="/js/cr-icons.js"></script>
  <div id="cr-footer"></div>
</body>
</html>
`;
}

async function fetchJson(url) {
  const res = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`);
  return res.json();
}

async function main() {
  let list;
  try {
    const cat = await fetchJson(`${API_BASE}/api/interactive-courses?limit=500`);
    list = (Array.isArray(cat) ? cat : (cat.data || cat.courses || [])).filter(c => c && c.slug && (c.status ? c.status === 'published' : true));
  } catch (err) {
    console.error(`WARNING: catalog fetch failed (${err.message}). Leaving existing prerendered pages intact.`);
    process.exit(0);
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });
  let ok = 0, fail = 0;
  for (const stub of list) {
    try {
      let course = stub;
      try {
        const d = await fetchJson(`${API_BASE}/api/interactive-courses/slug/${stub.slug}`);
        course = d.data || d.course || d || stub;
      } catch (e) { /* fall back to catalog stub */ }
      fs.writeFileSync(path.join(OUT_DIR, `${stub.slug}.html`), pageHtml(course), 'utf8');
      ok++;
    } catch (e) {
      fail++; console.error(`  ✗ ${stub.slug}: ${e.message}`);
    }
  }
  console.log(`Prerendered ${ok} course page(s)${fail ? `, ${fail} failed` : ''} → client/public/courses/`);
}

main().catch(err => { console.error(err); process.exit(0); });
