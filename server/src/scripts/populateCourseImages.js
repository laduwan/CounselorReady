/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
/**
 * populateCourseImages.js
 * ───────────────────────
 * Populates a hero banner image on the FIRST sectionDivider block of every
 * section in a course. Sources images from Pexels, uploads to Cloudinary,
 * and writes bannerImage + bannerAlt onto each sectionDivider block in the
 * `interactivecourses` collection.
 *
 * Usage (run from /server):
 *   node src/scripts/populateCourseImages.js <COURSE_CODE> [--force] [--dry-run]
 *
 * Required env vars:
 *   MONGODB_URI
 *   CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
 *   PEXELS_API_KEY   (free Pexels API key)
 *
 * The viewer (PR #419) already renders block.bannerImage. ContentBlockSchema
 * is strict:false so bannerImage / bannerAlt persist without a schema change.
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cloudinary from 'cloudinary';

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
requireEnv('PEXELS_API_KEY');

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ─── Query mapping ──────────────────────────────────────────────────────
// Map a section title to a calm, clinically-appropriate Pexels query.
// Strategy: clean the title, then match against a curated keyword map
// keyed to counseling themes. Each entry returns a richer multi-word
// query so different sections don't collapse to the same generic photo.
// Avoids faces / identifiable people / clinical-graphic imagery.
const KEYWORD_MAP = [
  // HIPAA / privacy / data protection
  { match: /\b(hipaa|privacy|confidential|data\s*protect|encryption)\b/i, q: 'data privacy laptop' },
  // crisis / risk / safety
  { match: /\b(crisis|suicid|risk|safety|harm|emergenc)\b/i, q: 'calm supportive conversation' },
  // culture / diversity / identity
  { match: /\b(cultur|diversity|equity|inclusion|multicultural|bias|identity)\b/i, q: 'diverse people community' },
  // consent / documentation / forms
  { match: /\b(consent|documentation|record|form|note|chart|paperwork)\b/i, q: 'signing document desk' },
  // assessment / screening / outcomes
  { match: /\b(assess|evaluat|intake|screen|measure|outcome|diagnos)\b/i, q: 'clipboard notebook desk' },
  // telehealth modality
  { match: /\b(telehealth|telemental|virtual\s*session|remote\s*session|video\s*visit)\b/i, q: 'home office video call setup' },
  // technology / platform / infrastructure
  { match: /\b(technolog|platform|software|hardware|digital|infrastructure|device)\b/i, q: 'minimalist desk laptop' },
  // ethics / law / regulation / board
  { match: /\b(ethic|law|legal|regulation|rule|compliance|board\s*rule|statute)\b/i, q: 'open book wooden desk' },
  // self-care / wellness / burnout
  { match: /\b(self[-\s]?care|wellness|burnout|fatigue|resilience|recovery)\b/i, q: 'quiet nature path' },
  // mindfulness / grounding
  { match: /\b(mindful|grounding|breathing|meditation|relaxation)\b/i, q: 'still lake morning mist' },
  // trauma
  { match: /\b(trauma|ptsd|posttraumatic|post[-\s]?traumatic)\b/i, q: 'soft window light interior' },
  // substance use / addiction
  { match: /\b(substance|addiction|sober|alcohol|opioid)\b/i, q: 'morning forest path' },
  // mood / anxiety
  { match: /\b(depression|anxiety|mood|stress|panic)\b/i, q: 'soft natural light window' },
  // couples / family
  { match: /\b(famil|couple|marriage|partner|relational)\b/i, q: 'two empty armchairs' },
  // child / adolescent / play
  { match: /\b(child|adolescent|youth|teen|play\s*therapy|pediatric)\b/i, q: 'soft natural light playroom' },
  // group / peer
  { match: /\b(group\s*therap|peer\s*support|community\s*support)\b/i, q: 'warm cozy living room circle' },
  // supervision / training / professional development
  { match: /\b(supervis|consultation|training|professional\s*development|career)\b/i, q: 'warm bookshelf reading' },
  // billing / insurance
  { match: /\b(billing|insurance|cpt|reimburs|payment|fee\s*schedule)\b/i, q: 'calculator pen desk' },
  // mandated reporting / abuse / neglect
  { match: /\b(mandated|reporter|abuse|neglect|child\s*protect)\b/i, q: 'soft window light interior' },
  // existential / meaning / spiritual
  { match: /\b(existential|meaning|purpose|spiritual|values)\b/i, q: 'quiet horizon landscape' },
  // sexuality / intimacy
  { match: /\b(sex|sexuality|intimacy|sexual\s*health)\b/i, q: 'soft abstract texture neutral' },
  // neuroscience / biology
  { match: /\b(neuro|brain|biolog|nervous\s*system)\b/i, q: 'soft abstract pattern' },
  // boundaries / dual relationships
  { match: /\b(boundary|boundaries|dual\s*relationship)\b/i, q: 'open book wooden desk' },
  // session / rapport / therapeutic alliance
  { match: /\b(rapport|alliance|therap|counsel|session|practice)\b/i, q: 'two empty armchairs by window' },
  // intro / foundations
  { match: /\b(intro|overview|foundation|background|orientation)\b/i, q: 'calm therapy office morning light' },
  // conclusion / wrap-up
  { match: /\b(conclusion|summary|wrap|closing|future|next\s*step|integration)\b/i, q: 'open window soft morning light' },
  // jurisdiction / state law
  { match: /\b(georgia|jurisdiction|interstate|licens|portability)\b/i, q: 'state capitol architecture' },
];

const FALLBACK_QUERY = 'calm professional workspace';

// Clinical-graphic terms we never want surfacing in alt text or used as
// query material — strip them from the cleaned title.
const GRAPHIC_STRIP = /\b(needle|syringe|wound|blood|injury|scar|surgical|graphic|explicit)\b/gi;

function cleanTitle(raw) {
  if (!raw) return '';
  let t = String(raw);
  // Strip leading "Section N", "Module N", "Part N", roman numerals, numbers,
  // and surrounding punctuation. Examples: "Section 1: Foundations" → "Foundations"
  t = t.replace(/^\s*(section|module|part|chapter|unit)\s*[\divxlcDIVXLC]+\s*[:\-–—.)]?\s*/i, '');
  t = t.replace(/^\s*[\divxlcDIVXLC]+\s*[:\-–—.)]\s*/i, '');
  t = t.replace(GRAPHIC_STRIP, ' ');
  t = t.replace(/[^\w\s'-]/g, ' ');
  t = t.replace(/\s+/g, ' ').trim();
  return t;
}

function pickQuery(rawTitle) {
  const cleaned = cleanTitle(rawTitle);
  for (const rule of KEYWORD_MAP) {
    if (rule.match.test(cleaned)) return rule.q;
  }
  return FALLBACK_QUERY;
}

function pickAlt(rawTitle, query) {
  const cleaned = cleanTitle(rawTitle);
  const base = cleaned ? `Calm visual for "${cleaned}"` : 'Calm section banner';
  return `${base} — ${query}`;
}

// ─── Pexels ──────────────────────────────────────────────────────────────
// One raw call to the Pexels search API. Throws on network errors and on
// any non-2xx response; sets `__transient = true` on errors that should
// be retried (network errors, HTTP 5xx, HTTP 429).
async function pexelsSearchCall(query) {
  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&orientation=landscape&per_page=10`;
  let res;
  try {
    res = await fetch(url, {
      headers: { Authorization: process.env.PEXELS_API_KEY },
    });
  } catch (err) {
    const e = new Error(`Pexels network error: ${err.message}`);
    e.__transient = true;
    throw e;
  }
  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    const e = new Error(`Pexels ${res.status}: ${txt.slice(0, 200)}`);
    if (res.status >= 500 || res.status === 429) e.__transient = true;
    throw e;
  }
  return await res.json();
}

// Retry transient failures (network + HTTP 5xx + 429) up to `attempts`
// times with exponential backoff (1s, 2s, 4s). An empty `photos` array
// is NOT an error and is NOT retried — that's a clean "no result".
async function fetchPexelsResults(query, { attempts = 3, baseMs = 1000 } = {}) {
  let lastErr;
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      return await pexelsSearchCall(query);
    } catch (err) {
      lastErr = err;
      const transient = err.__transient === true;
      if (!transient || attempt === attempts) throw err;
      const wait = baseMs * Math.pow(2, attempt - 1); // 1s, 2s, 4s
      console.log(`      ⟳ pexels retry ${attempt}/${attempts - 1} in ${wait}ms: ${err.message}`);
      await sleep(wait);
    }
  }
  throw lastErr;
}

// Pick a photo from a Pexels response. Prefers a photo whose id is not
// already in `usedPhotoIds` (so two sections don't get the same image
// when avoidable). Falls back to `sectionIndex % photos.length` if every
// returned photo has already been used this run.
function pickPhotoFromResults(data, usedPhotoIds, sectionIndex) {
  const photos = Array.isArray(data?.photos) ? data.photos : [];
  if (photos.length === 0) return null;
  let chosen = photos.find(p => p && p.id && !usedPhotoIds.has(p.id));
  if (!chosen) chosen = photos[sectionIndex % photos.length];
  if (!chosen) return null;
  const imageUrl = chosen.src?.large2x || chosen.src?.large;
  if (!imageUrl) return null;
  return {
    url: imageUrl,
    credit: chosen.photographer || '',
    pexelsId: chosen.id,
  };
}

// ─── Cloudinary upload (by URL) ──────────────────────────────────────────
async function uploadToCloudinary(imageUrl, courseCode, sectionIndex) {
  const folder = `counselorready/course-resources/${courseCode}/banners`;
  const publicId = `${courseCode}-sec${sectionIndex + 1}`;
  const result = await cloudinary.v2.uploader.upload(imageUrl, {
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
  const usedPhotoIds = new Set(); // dedupe Pexels photos across sections

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
      const data = await fetchPexelsResults(query);
      const found = pickPhotoFromResults(data, usedPhotoIds, i);
      if (!found) {
        console.log(`      → no Pexels result, skipping this section`);
        stats.skipped++;
        rows.push({ n: i + 1, title, status: 'skip (no result)', detail: query });
        await sleep(1200);
        continue;
      }
      imageUrl = found.url;
      usedPhotoIds.add(found.pexelsId);
      console.log(`      pexels: ${found.pexelsId} (by ${found.credit || 'unknown'})`);
    } catch (err) {
      console.log(`      ✖ Pexels error: ${err.message}`);
      stats.failed++;
      rows.push({ n: i + 1, title, status: 'fail (pexels)', detail: err.message });
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

    await sleep(1200); // Pexels free tier ~200/hr; this keeps us well under
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
