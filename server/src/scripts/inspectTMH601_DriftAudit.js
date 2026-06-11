/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 */

/**
 * inspectTMH601_DriftAudit.js  —  READ-ONLY. Writes nothing.
 * ─────────────────────────────────────────────────────────
 * Dumps, for BOTH TMH601 records (clean + mkkycoyo), exactly the state needed
 * to fix the three viewer issues:
 *   1. Resources / References tab presence  (top-level arrays + in-section blocks)
 *   2. Per-section hero banner               (sectionDivider block + bannerImage)
 *   3. Heading hierarchy                      (every h1–h4 + its inline color)
 * Plus a content-hash compare so we know whether clean and mkkycoyo are in sync.
 *
 * RUN (Render shell):
 *   cd ~/project/src/server
 *   node src/scripts/inspectTMH601_DriftAudit.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import crypto from 'crypto';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('❌ MONGODB_URI not set'); process.exit(1); }

const SLUGS = {
  clean: 'mastering-telemental-health',
  mkkycoyo: 'mastering-telemental-health-an-essential-guide-to-a-compliant-virtual-healthcare-practice-in-georgia-mkkycoyo',
};

// Map an inline color to a brand role so drift is obvious at a glance.
function colorRole(hex) {
  if (!hex) return '(no color)';
  const h = hex.toUpperCase().replace(/\s/g, '');
  if (h.includes('6B1D34')) return 'BURGUNDY';
  if (h.includes('4A7C59')) return 'GREEN';
  if (h.includes('284157') || h.includes('34495E')) return 'NAVY';
  if (h.includes('D4A855')) return 'GOLD';
  return hex.slice(0, 18);
}

function headingsFrom(html) {
  const out = [];
  const re = /<(h[1-4])\b([^>]*)>([\s\S]*?)<\/\1>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const tag = m[1].toLowerCase();
    const attrs = m[2] || '';
    const colorMatch = attrs.match(/color\s*:\s*([^;"']+)/i);
    const text = m[3].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    out.push({ tag, color: colorRole(colorMatch ? colorMatch[1] : null), text: text.slice(0, 64) });
  }
  return out;
}

function contentHash(doc) {
  const c = { ...doc };
  ['_id', 'slug', 'updatedAt', 'createdAt', '__v', 'publishedAt', 'status', 'isPublished'].forEach(k => delete c[k]);
  return crypto.createHash('sha256').update(JSON.stringify(c)).digest('hex').slice(0, 16);
}

function auditRecord(label, c) {
  console.log('\n' + '═'.repeat(72));
  console.log(`  ${label}`);
  console.log('═'.repeat(72));
  if (!c) { console.log('  ❌ NOT FOUND'); return null; }

  console.log(`  _id=${c._id}  status=${c.status}  isPublished=${c.isPublished}`);
  console.log(`  ceHours=${c.ceHours}  sections=${(c.sections || []).length}`);
  console.log(`  TOP-LEVEL references[]: ${(c.references || []).length}`);
  console.log(`  TOP-LEVEL resources[] : ${(c.resources || []).length}`);

  let inSectionResourceBlocks = 0;
  (c.sections || []).forEach((s, i) => {
    const blocks = s.contentBlocks || [];
    const divider = blocks.find(b => b.type === 'sectionDivider');
    const resBlock = blocks.find(b => b.type === 'resources');
    if (resBlock) inSectionResourceBlocks += (resBlock.resources || []).length;

    const banner = divider
      ? (divider.bannerImage ? `bannerImage=SET (${String(divider.bannerImage).slice(0, 48)}…)` : 'bannerImage=‼️ EMPTY → pink fallback')
      : '‼️ NO sectionDivider block';

    console.log(`\n  ── §${i + 1}: ${(s.title || '').slice(0, 56)}`);
    console.log(`     blocks: [${blocks.map(b => b.type).join(', ')}]`);
    console.log(`     hero  : ${banner}`);

    // headings inside every text block of this section
    blocks.filter(b => b.type === 'text' && b.content).forEach(b => {
      headingsFrom(b.content).forEach(h => {
        const redundant = /^Section\s+\d+\s*:/i.test(h.text) ? '  ⚠️ redundant Section-N opener' : '';
        console.log(`       ${h.tag.toUpperCase()}  ${h.color.padEnd(9)}  ${h.text}${redundant}`);
      });
    });
  });

  console.log(`\n  in-section resources-block items: ${inSectionResourceBlocks}`);
  return contentHash(c);
}

async function main() {
  await mongoose.connect(MONGODB_URI);
  const col = mongoose.connection.db.collection('interactivecourses');
  const clean = await col.findOne({ slug: SLUGS.clean });
  const mkky  = await col.findOne({ slug: SLUGS.mkkycoyo });

  const hClean = auditRecord('CLEAN  (mastering-telemental-health)', clean);
  const hMkky  = auditRecord('LIVE   (…-mkkycoyo)  ← the ad URL', mkky);

  console.log('\n' + '═'.repeat(72));
  console.log('  SYNC STATUS');
  console.log('═'.repeat(72));
  if (hClean && hMkky) {
    console.log(`  clean hash=${hClean}   mkkycoyo hash=${hMkky}`);
    console.log(hClean === hMkky
      ? '  ✓ IN SYNC — both records identical. Fixes must be authored, not just synced.'
      : '  ≠ OUT OF SYNC — records differ. Whichever is correct can be synced onto the other.');
  }

  await mongoose.disconnect();
  console.log('\n✓ Done (read-only — nothing written).');
}

main().catch(e => { console.error('❌', e); process.exit(1); });
