/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 *
 * Pre-renders one standalone, crawlable page per published blog post into
 * client/public/blog/{slug}.html. Each page ships static <head> tags (title,
 * description, Open Graph, Twitter Card, canonical, Article + BreadcrumbList
 * JSON-LD) baked in at build time — the problem client-side injection on
 * blog-post.html cannot solve (Google's initial crawl of blog-post.html sees
 * a generic placeholder title and blank description, not the real post).
 *
 * Unlike prerender-courses.cjs (which renders a landing page linking out to
 * gated course content), this renders the FULL article body, since blog
 * content is freely readable and is exactly what should be indexed.
 *
 * These files are BUILD ARTIFACTS — regenerate, never hand-edit.
 *
 * Usage:  node tools/prerender-blog.cjs
 * Non-fatal: on API failure it warns and exits 0, leaving any committed pages intact.
 */
const fs = require('fs');
const path = require('path');

const SITE = (process.env.SITE || 'https://counselorready.com').replace(/\/$/, '');
const API_BASE = (process.env.API_BASE || 'https://api.counselorready.com').replace(/\/$/, '');
const OUT_DIR = path.join(__dirname, '..', 'client', 'public', 'blog');

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
function attr(s) { return esc(s).replace(/\n/g, ' '); }
function clip(s, n) { s = String(s || '').replace(/\s+/g, ' ').trim(); return s.length > n ? s.slice(0, n - 1).trim() + '…' : s; }

// Minimal markdown → HTML. Covers headings, bold/italic, links, and bullet
// lists — the actual range used by these posts. Not a general-purpose
// parser; escape first, then apply inline patterns, then block patterns.
function mdToHtml(md) {
  const lines = String(md || '').replace(/\r\n/g, '\n').split('\n');
  const out = [];
  let inList = false;

  function inline(s) {
    s = esc(s);
    s = s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    s = s.replace(/\*(.+?)\*/g, '<em>$1</em>');
    s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
    return s;
  }

  for (const raw of lines) {
    const line = raw.trim();
    const h = line.match(/^(#{1,3})\s+(.*)$/);
    const li = line.match(/^[-*]\s+(.*)$/);

    if (li) {
      if (!inList) { out.push('<ul>'); inList = true; }
      out.push(`<li>${inline(li[1])}</li>`);
      continue;
    }
    if (inList) { out.push('</ul>'); inList = false; }

    if (h) {
      const level = h[1].length + 1; // h1 reserved for post title; content starts at h2
      out.push(`<h${level}>${inline(h[2])}</h${level}>`);
    } else if (line) {
      out.push(`<p>${inline(line)}</p>`);
    }
  }
  if (inList) out.push('</ul>');
  return out.join('\n');
}

function pageHtml(post) {
  const slug = post.slug;
  const url = `${SITE}/blog/${slug}`;
  const title = post.metaTitle || post.title || 'CounselorReady Blog';
  const desc = clip(post.metaDescription || post.excerpt || '', 158);
  const img = post.featuredImage || `${SITE}/og-default.png`;
  const author = post.author || 'Kejuiana Johnson, LPC, NCC, CPCS, BC-TMH';
  const tags = Array.isArray(post.tags) ? post.tags : [];
  const catLabels = { 'state-guide': 'State Guide', 'problem-solution': 'How-To', 'authority': 'Insights', 'clinical': 'Clinical', 'news': 'News' };
  const catLabel = catLabels[post.category] || post.category || '';
  const dateStr = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : '';

  const articleLd = {
    '@context': 'https://schema.org', '@type': 'Article',
    headline: post.title, description: post.excerpt, url,
    datePublished: post.publishedAt, dateModified: post.updatedAt || post.publishedAt,
    author: { '@type': 'Person', name: author },
    publisher: { '@type': 'Organization', name: 'CounselorReady' },
    ...(post.wordCount ? { wordCount: post.wordCount } : {}),
    ...(post.featuredImage ? { image: post.featuredImage } : {})
  };
  const breadcrumbLd = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE}/blog` },
      { '@type': 'ListItem', position: 3, name: post.title, item: url }
    ]
  };

  const tagsHtml = tags.length
    ? `<div class="mt-8 flex flex-wrap gap-2">${tags.map(t => `<a href="/blog.html?tag=${encodeURIComponent(t)}" class="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-600 hover:bg-burgundy/10 hover:text-burgundy transition-colors">#${esc(t)}</a>`).join('')}</div>`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="index,follow">
  <title>${attr(title)} | CounselorReady</title>
  <meta name="description" content="${attr(desc)}">
  <link rel="canonical" href="${attr(url)}">

  <meta property="og:type" content="article">
  <meta property="og:site_name" content="CounselorReady">
  <meta property="og:title" content="${attr(title)}">
  <meta property="og:description" content="${attr(desc)}">
  <meta property="og:url" content="${attr(url)}">
  <meta property="og:image" content="${attr(img)}">

  <meta name="twitter:card" content="${post.featuredImage ? 'summary_large_image' : 'summary'}">
  <meta name="twitter:title" content="${attr(title)}">
  <meta name="twitter:description" content="${attr(desc)}">
  <meta name="twitter:image" content="${attr(img)}">

  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <link rel="stylesheet" href="/css/design-tokens.css">
  <link rel="stylesheet" href="/css/typography.css">
  <script src="https://cdn.tailwindcss.com/3.4.17"></script>
  <script src="/js/tailwind-config.js"></script>
  <script type="application/ld+json">${JSON.stringify(articleLd)}</script>
  <script type="application/ld+json">${JSON.stringify(breadcrumbLd)}</script>
  <style>body{background:#F8F7F4;font-family:'Lato',system-ui,sans-serif}.font-display{font-family:'Cormorant Garamond',Georgia,serif}
  article h2{font-family:'Cormorant Garamond',Georgia,serif;color:#284157;font-size:1.5rem;font-weight:700;margin:1.75rem 0 .75rem}
  article h3{font-family:'Cormorant Garamond',Georgia,serif;color:#D4A855;font-size:1.2rem;font-weight:700;margin:1.5rem 0 .5rem}
  article p{margin:0 0 1rem;line-height:1.7;color:#374151}
  article ul{margin:0 0 1rem 1.25rem;list-style:disc;color:#374151}
  article a{color:#6B1D34;text-decoration:underline}</style>
  <script src="/js/cr-gtag.js"></script>
</head>
<body class="bg-stone-50 min-h-screen">
  <div id="cr-header"></div>
  <script src="/shared/nav-footer.js"></script>

  <main class="max-w-3xl mx-auto px-6 py-8">
    <nav class="text-xs text-stone-500 mb-4" aria-label="Breadcrumb">
      <a href="/" class="hover:text-burgundy-700">Home</a> ›
      <a href="/blog.html" class="hover:text-burgundy-700">Blog</a> ›
      <span class="text-stone-700">${esc(post.title)}</span>
    </nav>

    <article class="bg-white rounded-2xl border border-gray-200 p-6 md:p-10">
      <div class="flex items-center gap-2 mb-3">
        ${catLabel ? `<span class="text-xs px-2 py-0.5 rounded-full font-medium bg-stone-100 text-stone-600">${esc(catLabel)}</span>` : ''}
        <span class="text-xs text-stone-500">${post.readingTime || 1} min read</span>
      </div>
      <h1 class="font-display text-2xl md:text-3xl font-bold text-burgundy leading-tight mb-3" style="color:#6B1D34">${esc(post.title)}</h1>
      <div class="text-sm text-stone-500 mb-6">${esc(author)}${dateStr ? ` · ${dateStr}` : ''}</div>
      ${mdToHtml(post.content)}
      ${tagsHtml}
    </article>

    <div class="mt-8 text-center">
      <a href="/blog.html" class="text-sm text-burgundy-700 hover:underline font-medium">← Back to all posts</a>
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
    const cat = await fetchJson(`${API_BASE}/api/blog?limit=500`);
    list = Array.isArray(cat) ? cat : (cat.posts || cat.data || []);
  } catch (err) {
    console.error(`WARNING: blog list fetch failed (${err.message}). Leaving existing prerendered pages intact.`);
    process.exit(0);
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });
  let ok = 0, fail = 0;
  for (const stub of list) {
    if (!stub || !stub.slug) continue;
    try {
      let post = stub;
      try {
        const d = await fetchJson(`${API_BASE}/api/blog/${stub.slug}`);
        post = d.post || d || stub;
      } catch (e) { /* fall back to list stub */ }
      fs.writeFileSync(path.join(OUT_DIR, `${stub.slug}.html`), pageHtml(post), 'utf8');
      ok++;
    } catch (e) {
      fail++; console.error(`  ✗ ${stub.slug}: ${e.message}`);
    }
  }
  console.log(`Prerendered ${ok} blog page(s)${fail ? `, ${fail} failed` : ''} → client/public/blog/`);
}

main().catch(err => { console.error(err); process.exit(0); });
