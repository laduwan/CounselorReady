/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 */

/**
 * patchTMH601_BannerHeadingResource.js
 * ────────────────────────────────────
 * Fixes 3 confirmed drift issues on CR-TMH601 (both slugs), all idempotent:
 *
 *   1. BANNERS — §4–§8 sectionDivider blocks have empty bannerImage (pink
 *      fallback). Self-heals by reusing a thematically-matched banner that is
 *      ALREADY on this record (no external URLs needed). Override per section
 *      via BANNER_OVERRIDES if you want specific art.
 *
 *   2. HEADINGS — promote 2 orphan <h3> → <h2> that sit among H2 peers:
 *        §2  "State Licensing Board Regulation of Telehealth…"
 *        §3  "Conducting a Practice Security Risk Analysis…"
 *
 *   3. RESOURCES — top-level resources[] is empty, but §13 has a `resources`
 *      block. The viewer drawer shows the Resources tab off the top-level array
 *      first, so we lift the §13 block's items up to course.resources[].
 *
 * SAFETY
 *   • DRY RUN by default. APPLY=1 to write.
 *   • Backs up each record to `interactivecourses_backups` before writing.
 *   • Never deletes. Uses updateOne/$set only (no insertOne).
 *   • Re-runnable: skips anything already correct.
 *
 * RUN (Render shell)
 *   cd ~/project/src/server
 *   node src/scripts/patchTMH601_BannerHeadingResource.js            # dry run
 *   APPLY=1 node src/scripts/patchTMH601_BannerHeadingResource.js    # write + backup
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const APPLY = process.env.APPLY === '1';
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('❌ MONGODB_URI not set'); process.exit(1); }

const SLUGS = [
  'mastering-telemental-health',
  'mastering-telemental-health-an-essential-guide-to-a-compliant-virtual-healthcare-practice-in-georgia-mkkycoyo',
];

// Sections (1-based) missing a banner → the section whose banner to reuse.
// Chosen for thematic closeness; override below if you have dedicated art.
const BANNER_REUSE = { 4: 3, 5: 2, 6: 1, 7: 9, 8: 10 };
// Paste a Cloudinary URL here to use specific art instead of reuse, e.g. { 4: 'https://res.cloudinary.com/dzfscjhdx/...' }
const BANNER_OVERRIDES = { 4: '', 5: '', 6: '', 7: '', 8: '' };

// Orphan H3 headings to promote to H2 (matched by stable text prefix).
const PROMOTE_H3_TO_H2 = [
  'State Licensing Board Regulation of Telehealth',
  'Conducting a Practice Security Risk Analysis',
];

function findDivider(section) {
  return (section.contentBlocks || []).find(b => b.type === 'sectionDivider');
}

function promoteHeadings(html) {
  let out = html, n = 0;
  for (const text of PROMOTE_H3_TO_H2) {
    const safe = text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp('<h3([^>]*)>(' + safe + '[^<]*)</h3>', 'gi');
    out = out.replace(re, (_m, attrs, inner) => { n++; return `<h2${attrs}>${inner}</h2>`; });
  }
  return { html: out, count: n };
}

async function patchRecord(courses, slug) {
  const c = await courses.findOne({ slug });
  if (!c) { console.log(`\n❌ ${slug.slice(0, 60)} — not found`); return; }
  console.log(`\n${'─'.repeat(64)}\n  ${slug.slice(0, 60)}  (_id=${c._id})`);

  const secs = c.sections || [];
  const bannerOf = {}; // 1-based section number → its current bannerImage
  secs.forEach((s, i) => { const d = findDivider(s); if (d?.bannerImage) bannerOf[i + 1] = d.bannerImage; });

  let changed = false;

  // ── 1. BANNERS ──
  console.log('\n  [1] Banners (§4–§8):');
  for (const numStr of Object.keys(BANNER_REUSE)) {
    const num = Number(numStr);
    const sec = secs[num - 1];
    const div = sec && findDivider(sec);
    if (!div) { console.log(`     §${num}: ‼️ no sectionDivider block — skipped`); continue; }
    if (div.bannerImage) { console.log(`     §${num}: already set — skip`); continue; }
    const override = BANNER_OVERRIDES[num];
    const reuse = bannerOf[BANNER_REUSE[num]];
    const url = override || reuse;
    if (!url) { console.log(`     §${num}: ‼️ no source banner available (§${BANNER_REUSE[num]} also empty) — skipped`); continue; }
    div.bannerImage = url;
    if (!div.bannerAlt) div.bannerAlt = sec.title || '';
    changed = true;
    console.log(`     §${num}: SET ← ${override ? 'override' : '§' + BANNER_REUSE[num] + ' reuse'}  ${url.slice(0, 54)}…`);
  }

  // ── 2. HEADINGS ──
  console.log('\n  [2] Heading promotions (h3→h2):');
  let promoted = 0;
  secs.forEach((s, i) => {
    (s.contentBlocks || []).forEach(b => {
      if (b.type === 'text' && typeof b.content === 'string') {
        const r = promoteHeadings(b.content);
        if (r.count > 0) { b.content = r.html; promoted += r.count; changed = true; console.log(`     §${i + 1}: promoted ${r.count}`); }
      }
    });
  });
  if (promoted === 0) console.log('     none needed (already h2 or absent)');

  // ── 3. RESOURCES ──
  console.log('\n  [3] Resources lift (§13 block → top-level):');
  const topRes = c.resources || [];
  if (topRes.length > 0) {
    console.log(`     top-level already has ${topRes.length} — skip`);
  } else {
    let lifted = [];
    secs.forEach(s => {
      const rb = (s.contentBlocks || []).find(b => b.type === 'resources');
      if (rb && Array.isArray(rb.resources)) lifted = lifted.concat(rb.resources.filter(r => r && (r.title || r.url)));
    });
    if (lifted.length > 0) { c.resources = lifted; changed = true; console.log(`     lifted ${lifted.length} item(s) to course.resources[]`); }
    else console.log('     ‼️ no resource-block items found anywhere — Resources still needs content');
  }

  if (!changed) { console.log('\n  ✓ nothing to change on this record.'); return; }
  if (!APPLY) { console.log('\n  (dry run — no write)'); return; }

  // backup
  const db = courses.s.db;
  await db.collection('interactivecourses_backups').insertOne({
    backupAt: new Date(), backupReason: 'pre-banner-heading-resource-patch',
    originalSlug: slug, originalId: c._id, document: await courses.findOne({ slug }),
  });
  const res = await courses.updateOne({ slug }, { $set: { sections: c.sections, resources: c.resources || [], updatedAt: new Date() } });
  console.log(`\n  ✓ written. matched=${res.matchedCount} modified=${res.modifiedCount} (backup saved)`);
}

async function main() {
  console.log('═'.repeat(64));
  console.log('  CR-TMH601 — banner + heading + resource patch');
  console.log('  Mode:', APPLY ? 'APPLY (writes + backup)' : 'DRY RUN');
  console.log('═'.repeat(64));
  await mongoose.connect(MONGODB_URI);
  const courses = mongoose.connection.db.collection('interactivecourses');
  for (const slug of SLUGS) await patchRecord(courses, slug);
  await mongoose.disconnect();
  console.log('\n✓ Done.');
}

main().catch(e => { console.error('❌', e); process.exit(1); });
