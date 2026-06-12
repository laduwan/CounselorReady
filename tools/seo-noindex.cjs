/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 *
 * Adds <meta name="robots" content="noindex,nofollow"> to gated app, admin, partner,
 * and auth-utility pages so they stay out of search results. Idempotent — safe to re-run
 * after adding new gated pages. Public marketing/legal pages and /register are left indexable.
 *
 * Usage: node tools/seo-noindex.cjs
 */
const fs = require('fs');
const path = require('path');

const PUB = path.join(__dirname, '..', 'client', 'public');
const META = '  <meta name="robots" content="noindex,nofollow">';

const APP_PAGES = [
  'dashboard', 'settings', 'credentials', 'certificates', 'messages', 'board-alerts', 'ce-planner',
  'supervision', 'insurance-tracker', 'achievements', 'legacy-vault', 'referrals', 'organization',
  'group-licenses', 'recommendations', 'research-ready', 'audit', 'welcome', 'interactive-course',
  'partner-dashboard', 'partner-users', 'partner-branding', 'partner-reports', 'partner-billing',
  'partner-marketplace', 'partner-earnings',
  'login', 'forgot-password', 'reset-password', 'verify', 'verify-email',
];

const targets = new Set(APP_PAGES);
for (const f of fs.readdirSync(PUB)) {
  if (/^admin.*\.html$/.test(f)) targets.add(f.replace(/\.html$/, ''));
}

const vpRe = /<meta[^>]*name=["']viewport["'][^>]*>/i;
const added = [], already = [], skipped = [];

for (const name of [...targets].sort()) {
  const p = path.join(PUB, name + '.html');
  if (!fs.existsSync(p)) { skipped.push(name + ' (missing)'); continue; }
  let html = fs.readFileSync(p, 'utf8');
  if (/name=["']robots["']/i.test(html)) { already.push(name); continue; }
  const m = html.match(vpRe);
  if (!m) { skipped.push(name + ' (no viewport)'); continue; }
  const idx = m.index + m[0].length;
  html = html.slice(0, idx) + '\n' + META + html.slice(idx);
  fs.writeFileSync(p, html, 'utf8');
  added.push(name);
}

console.log(`ADDED   (${added.length}): ${added.join(', ')}`);
console.log(`ALREADY (${already.length}): ${already.join(', ')}`);
console.log(`SKIPPED (${skipped.length}): ${skipped.join(', ')}`);
