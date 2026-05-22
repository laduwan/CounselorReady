/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
/**
 * populateCourseImages.js
 * ───────────────────────
 * Populates a hero banner image on the FIRST sectionDivider block of every
 * section in a course. Sources images from Unsplash, uploads to Cloudinary,
 * and writes bannerImage + bannerAlt onto each sectionDivider block in the
 * `interactivecourses` collection.
 *
 * Usage (run from /server):
 *   node src/scripts/populateCourseImages.js <COURSE_CODE> [--force] [--dry-run]
 *
 * Required env vars:
 *   MONGODB_URI
 *   CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
 *   UNSPLASH_ACCESS_KEY   (free Unsplash API access key)
 *
 * The viewer (PR #419) already renders block.bannerImage. ContentBlockSchema
 * is strict:false so bannerImage / bannerAlt persist without a schema change.
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const cloudinary = require('cloudinary').v2;

dotenv.config();

// ─── Args ───────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const COURSE_CODE = args.find(a => !a.startsWith('--'));
const FORCE = args.includes('--force');
const DRY_RUN = args.includes('--dry-run');

if (!COURSE_CODE) {
  console.error('Usage: node src/scripts/populateCourseImages.js <COURSE_CODE> [--force] [--dry-run]');
  process.exit(1);
}

// ─── Env check ──────────────────────────────────────────────────────────
function requireEnv(name) {
  if (!process.env[name]) {
    console.error(`❌ Missing env var: ${name}`);
    process.exit(1);
  }
}
requireEnv('MONGODB_URI');
requireEnv('CLOUDINARY_CLOUD_NAME');
requireEnv('CLOUDINARY_API_KEY');
requireEnv('CLOUDINARY_API_SECRET');
requireEnv('UNSPLASH_ACCESS_KEY');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ─── Query mapping ──────────────────────────────────────────────────────
// Map a section title to a calm, clinically-appropriate Unsplash query.
// Strategy: strip noise from the title, then pick a neutral concept based
// on keywords. Avoid faces / identifiable people / clinical-graphic imagery.
const SAFE_QUERIES = {
  office:   'calm therapy office',
  desk:     'notebook desk',
  texture:  'soft abstract texture',
  nature:   'quiet nature path',
};

const KEYWORD_MAP = [
  // wellness / self-care
  { match: /\b(self[-\s]?care|wellness|burnout|fatigue|resilience|mindful|grounding|breathing|recovery)\b/i, q: SAFE_QUERIES.nature },
  // ethics / law / compliance / consent / documentation
  { match: /\b(ethic|legal|law|regulation|rule|compliance|consent|policy|polic(y|ies)|documentation|record|hipaa|privacy|confidential)\b/i, q: SAFE_QUERIES.desk },
  // crisis / risk / safety
  { match: /\b(crisis|risk|suicid|safety|emergenc|harm|trauma)\b/i, q: SAFE_QUERIES.texture },
  // assessment / evaluation / screening / diagnosis
  { match: /\b(assess|evaluat|screen|diagnos|intake|measure|outcome)\b/i, q: SAFE_QUERIES.desk },
  // culture / diversity / identity
  { match: /\b(cultur|diversity|equity|inclusion|identity|multicultural|bias)\b/i, q: SAFE_QUERIES.texture },
  // technology / platform / telehealth modality
  { match: /\b(technolog|platform|telehealth|telemental|video|digital|software|hardware)\b/i, q: SAFE_QUERIES.desk },
  // session / practice / rapport / therapeutic
  { match: /\b(session|practice|rapport|therap|counsel|alliance|relation)\b/i, q: SAFE_QUERIES.office },
  // intro / overview / foundation / conclusion / wrap
  { match: /\b(intro|overview|foundation|background|conclusion|summary|wrap|closing)\b/i, q: SAFE_QUERIES.office },
];

function cleanTitle(raw) {
  if (!raw) return '';
  let t = String(raw);
  // Strip leading "Section N", "Module N", "Part N", roman numerals, numbers,
  // and surrounding punctuation. Examples: "Section 1: Foundations" → "Foundations"
  t = t.replace(/^\s*(section|module|part|chapter|unit)\s*[\divxlcDIVXLC]+\s*[:\-–—.)]?\s*/i, '');
  t = t.replace(/^\s*[\divxlcDIVXLC]+\s*[:\-–—.)]\s*/i, '');
  t = t.replace(/[^\w\s'-]/g, ' ');
  t = t.replace(/\s+/g, ' ').trim();
  return t;
}

function pickQuery(rawTitle) {
  const cleaned = cleanTitle(rawTitle);
  for (const rule of KEYWORD_MAP) {
    if (rule.match.test(cleaned)) return rule.q;
  }
  return SAFE_QUERIES.texture;
}

function pickAlt(rawTitle, query) {
  const cleaned = cleanTitle(rawTitle);
  const base = cleaned ? `Calm visual for "${cleaned}"` : 'Calm section banner';
  return `${base} — ${query}`;
}

// ─── Unsplash ────────────────────────────────────────────────────────────
async function fetchUnsplashImage(query) {
  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&orientation=landscape&content_filter=high&per_page=1`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
      'Accept-Version': 'v1',
    },
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    throw new Error(`Unsplash ${res.status}: ${txt.slice(0, 200)}`);
  }
  const data = await res.json();
  const first = data?.results?.[0];
  if (!first?.urls?.regular) return null;
  return {
    url: first.urls.regular,
    credit: first.user?.name || '',
    unsplashId: first.id,
  };
}

// ─── Cloudinary upload (by URL) ──────────────────────────────────────────
async function uploadToCloudinary(imageUrl, courseCode, sectionIndex) {
  const folder = `counselorready/course-resources/${courseCode}/banners`;
  const publicId = `${courseCode}-sec${sectionIndex + 1}`;
  const result = await cloudinary.uploader.upload(imageUrl, {
    folder,
    public_id: publicId,
    overwrite: true,
    resource_type: 'image',
    transformation: [
      { width: 1600, crop: 'limit', quality: 'auto', fetch_format: 'auto' },
    ],
    tags: ['course-banner', courseCode.toLowerCase()],
  });
  return result.secure_url;
}

// ─── Helpers ─────────────────────────────────────────────────────────────
function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function findSectionDividerIndex(blocks) {
  if (!Array.isArray(blocks)) return -1;
  return blocks.findIndex(b => b && b.type === 'sectionDivider');
}

// ─── Main ────────────────────────────────────────────────────────────────
async function main() {
  console.log('\n🖼️  CounselorReady — Populate Section Banners');
  console.log(`   Course code : ${COURSE_CODE}`);
  console.log(`   Mode        : ${DRY_RUN ? 'DRY RUN (no upload, no save)' : 'LIVE'}`);
  console.log(`   Force       : ${FORCE ? 'yes (overwrite existing bannerImage)' : 'no (skip blocks already set)'}\n`);

  await mongoose.connect(process.env.MONGODB_URI);
  const collection = mongoose.connection.db.collection('interactivecourses');

  const course = await collection.findOne({ courseCode: COURSE_CODE });
  if (!course) {
    console.error(`❌ Course not found in interactivecourses (courseCode="${COURSE_CODE}").`);
    await mongoose.disconnect();
    process.exit(1);
  }

  const sections = Array.isArray(course.sections) ? course.sections : [];
  console.log(`   Found: "${course.title}" — ${sections.length} sections\n`);

  const stats = { processed: 0, set: 0, skipped: 0, failed: 0 };
  const rows = []; // for the summary table

  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    const title = section?.title || `(section ${i + 1})`;
    stats.processed++;

    const blocks = section?.contentBlocks || [];
    const dividerIdx = findSectionDividerIndex(blocks);

    if (dividerIdx === -1) {
      console.log(`   [${i + 1}/${sections.length}] ${title}\n      → no sectionDivider block, skipping`);
      stats.skipped++;
      rows.push({ n: i + 1, title, status: 'skip (no divider)', detail: '' });
      continue;
    }

    const block = blocks[dividerIdx];
    const alreadySet = !!(block && block.bannerImage);

    if (alreadySet && !FORCE) {
      console.log(`   [${i + 1}/${sections.length}] ${title}\n      → skipped, already set (${block.bannerImage})`);
      stats.skipped++;
      rows.push({ n: i + 1, title, status: 'skip (already set)', detail: block.bannerImage });
      continue;
    }

    const query = pickQuery(title);
    const alt = pickAlt(title, query);
    console.log(`   [${i + 1}/${sections.length}] ${title}`);
    console.log(`      query : ${query}`);

    let imageUrl = null;
    try {
      const found = await fetchUnsplashImage(query);
      if (!found) {
        console.log(`      → no Unsplash result, skipping this section`);
        stats.skipped++;
        rows.push({ n: i + 1, title, status: 'skip (no result)', detail: query });
        await sleep(1200);
        continue;
      }
      imageUrl = found.url;
      console.log(`      unsplash: ${found.unsplashId} (by ${found.credit || 'unknown'})`);
    } catch (err) {
      console.log(`      ✖ Unsplash error: ${err.message}`);
      stats.failed++;
      rows.push({ n: i + 1, title, status: 'fail (unsplash)', detail: err.message });
      await sleep(1200);
      continue;
    }

    if (DRY_RUN) {
      console.log(`      [dry-run] would upload to Cloudinary and set bannerImage on sec${i + 1} divider`);
      stats.set++;
      rows.push({ n: i + 1, title, status: 'dry-run', detail: query });
      await sleep(1200);
      continue;
    }

    let secureUrl = null;
    try {
      secureUrl = await uploadToCloudinary(imageUrl, COURSE_CODE, i);
      console.log(`      cloudinary: ${secureUrl}`);
    } catch (err) {
      console.log(`      ✖ Cloudinary error: ${err.message}`);
      stats.failed++;
      rows.push({ n: i + 1, title, status: 'fail (cloudinary)', detail: err.message });
      await sleep(1200);
      continue;
    }

    try {
      const setKey = `sections.${i}.contentBlocks.${dividerIdx}`;
      const updateRes = await collection.updateOne(
        { _id: course._id },
        {
          $set: {
            [`${setKey}.bannerImage`]: secureUrl,
            [`${setKey}.bannerAlt`]: alt,
          },
        }
      );
      if (updateRes.matchedCount !== 1) {
        throw new Error(`updateOne matched ${updateRes.matchedCount} docs`);
      }
      console.log(`      ✅ saved bannerImage on sec${i + 1} divider`);
      stats.set++;
      rows.push({ n: i + 1, title, status: 'set', detail: secureUrl });
    } catch (err) {
      console.log(`      ✖ DB save error: ${err.message}`);
      stats.failed++;
      rows.push({ n: i + 1, title, status: 'fail (save)', detail: err.message });
    }

    await sleep(1200); // Unsplash demo tier ~50/hr; this keeps us well under
  }

  // ─── Summary ───────────────────────────────────────────────────────────
  console.log('\n   ───── Summary ─────');
  const pad = (s, n) => String(s).padEnd(n);
  console.log(`   ${pad('#', 4)}${pad('Status', 22)}${pad('Title', 50)}Detail`);
  console.log(`   ${'-'.repeat(110)}`);
  for (const r of rows) {
    const detail = (r.detail || '').toString().slice(0, 60);
    console.log(`   ${pad(r.n, 4)}${pad(r.status, 22)}${pad((r.title || '').slice(0, 48), 50)}${detail}`);
  }
  console.log('');
  console.log(`   Sections processed : ${stats.processed}`);
  console.log(`   Set                : ${stats.set}${DRY_RUN ? ' (dry-run, nothing written)' : ''}`);
  console.log(`   Skipped            : ${stats.skipped}`);
  console.log(`   Failed             : ${stats.failed}`);
  console.log('');

  await mongoose.disconnect();

  console.log('   ⚠️  Caveat:');
  console.log('   Banner URLs are now in the live DB. If this course is reseeded, the');
  console.log('   bannerImage values are lost — re-run this script or bake the URLs into');
  console.log('   the seed.\n');
}

main().catch(async (err) => {
  console.error('\nFatal:', err);
  try { await mongoose.disconnect(); } catch {}
  process.exit(1);
});
