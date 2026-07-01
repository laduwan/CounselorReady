/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 */

/**
 * patchTMH601_StripBrokenImageText.js
 * ───────────────────────────────────
 * The §1/§3/§4/§5/§8 imageText blocks carry a dead `image` URL. The viewer
 * renders that image at 40% width beside the text; when it fails to load the
 * browser prints the alt/description in its place — the gray "two-paragraphs
 * side-by-side" box. Blanking `image` makes renderImageText skip the <img>
 * entirely, so the block collapses to a clean full-width text column.
 *
 * It REPORTS every imageText block's current image value first so we can verify
 * none are real/working before blanking. Re-runnable.
 *
 * SAFETY
 *   • DRY RUN by default. APPLY=1 to write.
 *   • Backs up each record before writing. updateOne/$set only. Never deletes blocks.
 *
 * RUN (Render shell)
 *   cd ~/project/src/server
 *   node src/scripts/patchTMH601_StripBrokenImageText.js            # dry run (report)
 *   APPLY=1 node src/scripts/patchTMH601_StripBrokenImageText.js    # write + backup
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

async function patchRecord(courses, slug) {
  const c = await courses.findOne({ slug });
  if (!c) { console.log(`\n❌ ${slug.slice(0, 60)} — not found`); return; }
  console.log(`\n${'─'.repeat(64)}\n  ${slug.slice(0, 60)}  (_id=${c._id})`);

  let blanked = 0, totalImageText = 0;
  (c.sections || []).forEach((s, i) => {
    (s.contentBlocks || []).forEach(b => {
      if (b.type !== 'imageText') return;
      totalImageText++;
      const cur = b.image || '';
      console.log(`     §${i + 1}  image=${cur ? cur.slice(0, 56) + (cur.length > 56 ? '…' : '') : '(empty)'}`);
      if (cur) { b.image = ''; blanked++; }
    });
  });

  console.log(`\n  imageText blocks: ${totalImageText}   would blank: ${blanked}`);
  if (blanked === 0) { console.log('  ✓ nothing to change.'); return; }
  if (!APPLY) { console.log('  (dry run — no write)'); return; }

  const db = courses.s.db;
  await db.collection('interactivecourses_backups').insertOne({
    backupAt: new Date(), backupReason: 'pre-strip-broken-imagetext',
    originalSlug: slug, originalId: c._id, document: await courses.findOne({ slug }),
  });
  const res = await courses.updateOne({ slug }, { $set: { sections: c.sections, updatedAt: new Date() } });
  console.log(`  ✓ written. matched=${res.matchedCount} modified=${res.modifiedCount} (backup saved)`);
}

async function main() {
  console.log('═'.repeat(64));
  console.log('  CR-TMH601 — strip dead imageText image URLs');
  console.log('  Mode:', APPLY ? 'APPLY (writes + backup)' : 'DRY RUN');
  console.log('═'.repeat(64));
  await mongoose.connect(MONGODB_URI);
  const courses = mongoose.connection.db.collection('interactivecourses');
  for (const slug of SLUGS) await patchRecord(courses, slug);
  await mongoose.disconnect();
  console.log('\n✓ Done.');
}

main().catch(e => { console.error('❌', e); process.exit(1); });
