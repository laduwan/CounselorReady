/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */

/**
 * syncTMH601_CleanToMkkycoyo.js
 * ─────────────────────────────
 * Copies the entire content of the clean slug into mkkycoyo. The mkkycoyo
 * document retains its `_id` (mongo-enforced via $set), its `slug` (so the ad
 * URL keeps working), and its `title` (the longer SEO-aligned ad-copy title).
 * Everything else is overwritten by clean's values.
 *
 * Ke's instruction (June 2026): preserve slug + title; the rest can change.
 * Test progress records and test certificates may be scrambled by the
 * structural change in `sections`; that is accepted.
 *
 * SAFETY
 * ──────
 *   • Default mode is dry-run. APPLY=1 to write.
 *   • Before writing, the current mkkycoyo doc is backed up to the
 *     `interactivecourses_backups` collection with a timestamp. Restore is
 *     possible if needed.
 *   • Status fields. After sync, mkkycoyo inherits clean's `status` /
 *     `isPublished` values. Clean is currently `draft` / `false`. The script
 *     therefore FORCES `status='published'` and `isPublished=true` post-copy
 *     so the public ad URL does not 404. Override with NO_FORCE_PUBLISH=1 to
 *     leave them at clean's values.
 *   • Idempotency: if mkkycoyo's content (sections, assessment, etc.) already
 *     matches clean's, the script no-ops.
 *
 * RUN
 * ───
 *   cd ~/project/src/server
 *   node src/scripts/syncTMH601_CleanToMkkycoyo.js                # dry run
 *   APPLY=1 node src/scripts/syncTMH601_CleanToMkkycoyo.js        # write + backup
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import crypto from 'crypto';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not found in env');
  process.exit(1);
}
const APPLY = process.env.APPLY === '1';
const NO_FORCE_PUBLISH = process.env.NO_FORCE_PUBLISH === '1';

const MKKYCOYO_SLUG = 'mastering-telemental-health-an-essential-guide-to-a-compliant-virtual-healthcare-practice-in-georgia-mkkycoyo';
const CLEAN_SLUG = 'mastering-telemental-health';

// Fields that mkkycoyo KEEPS (never copied from clean). Note: `_id` is
// preserved automatically by updateOne — $set cannot change _id. The longer
// mkkycoyo title is SEO-aligned with the ad copy and stays.
const PRESERVE_ON_MKKYCOYO = new Set(['_id', 'slug', 'title']);

function contentHash(doc) {
  // Hash everything except identity & timestamps so we can detect "already in sync"
  const clone = { ...doc };
  delete clone._id;
  delete clone.slug;
  delete clone.updatedAt;
  delete clone.createdAt;
  delete clone.__v;
  delete clone.publishedAt;
  delete clone.status;
  delete clone.isPublished;
  return crypto.createHash('sha256').update(JSON.stringify(clone)).digest('hex').slice(0, 16);
}

async function main() {
  console.log('═'.repeat(64));
  console.log('  CR-TMH601 SYNC — clean slug → mkkycoyo');
  console.log('  Preserves: _id (mongo-enforced), slug, title');
  console.log('  Mode:', APPLY ? 'APPLY (writes + backup)' : 'DRY RUN');
  if (NO_FORCE_PUBLISH) console.log('  NO_FORCE_PUBLISH=1 — leaving status/isPublished as clean\'s values');
  console.log('═'.repeat(64));

  await mongoose.connect(MONGODB_URI);
  console.log('✓ Connected to MongoDB');
  const db = mongoose.connection.db;
  const courses = db.collection('interactivecourses');

  const mkky = await courses.findOne({ slug: MKKYCOYO_SLUG });
  const clean = await courses.findOne({ slug: CLEAN_SLUG });

  if (!mkky) { console.log('❌ mkkycoyo slug not found.'); await mongoose.disconnect(); return; }
  if (!clean) { console.log('❌ clean slug not found.'); await mongoose.disconnect(); return; }

  console.log(`\n  mkkycoyo (target):  _id=${mkky._id}  ${mkky.sections?.length || 0} sections, ${mkky.assessment?.questions?.length || 0} Qs`);
  console.log(`  clean (source):     _id=${clean._id}  ${clean.sections?.length || 0} sections, ${clean.assessment?.questions?.length || 0} Qs`);

  // Idempotency check
  const mkkyHash = contentHash(mkky);
  const cleanHash = contentHash(clean);
  console.log(`\n  Content hashes (excl. identity & status): mkkycoyo=${mkkyHash}  clean=${cleanHash}`);
  if (mkkyHash === cleanHash) {
    console.log('  ✓ Content already in sync. Nothing to do.');
    await mongoose.disconnect();
    return;
  }

  // Build the field-set for $set: everything from clean except _id and slug
  const updateDoc = {};
  for (const [key, value] of Object.entries(clean)) {
    if (PRESERVE_ON_MKKYCOYO.has(key)) continue;
    updateDoc[key] = value;
  }
  // Force-publish unless overridden
  if (!NO_FORCE_PUBLISH) {
    updateDoc.status = 'published';
    updateDoc.isPublished = true;
    if (!updateDoc.publishedAt) updateDoc.publishedAt = mkky.publishedAt || new Date();
  }
  updateDoc.updatedAt = new Date();

  // Report what will change
  console.log('\n  Fields to overwrite on mkkycoyo:');
  const reportedKeys = Object.keys(updateDoc).sort();
  reportedKeys.forEach(k => {
    const oldVal = mkky[k];
    const newVal = updateDoc[k];
    let oldPreview = JSON.stringify(oldVal);
    let newPreview = JSON.stringify(newVal);
    if (oldPreview && oldPreview.length > 70) oldPreview = oldPreview.slice(0, 70) + '…';
    if (newPreview && newPreview.length > 70) newPreview = newPreview.slice(0, 70) + '…';
    const same = oldPreview === newPreview;
    console.log(`    ${same ? ' ' : '≠'} ${k.padEnd(28)} mkky:${oldPreview}   →   clean:${newPreview}`);
  });

  console.log('\n  Fields PRESERVED on mkkycoyo:');
  PRESERVE_ON_MKKYCOYO.forEach(k => {
    console.log(`    • ${k.padEnd(28)} = ${JSON.stringify(mkky[k]).slice(0, 80)}`);
  });

  // Side-effect summary
  console.log('\n  Side effects of sync:');
  console.log(`    • mkkycoyo's existing progress records will reference sections whose _ids no longer exist (test data — per Ke\'s instruction)`);
  console.log(`    • mkkycoyo's 2 issued certificates remain valid (PDFs are immutable)`);
  console.log(`    • mkkycoyo's analytics object (enrollments / lastEnrollmentAt) and discountPrice / discountExpires will be ${clean.analytics ? 'overwritten' : 'removed'} unless present on clean`);
  console.log(`    • Title preserved: "${mkky.title}"`);

  if (!APPLY) {
    console.log('\n  (dry run — no writes performed)');
    await mongoose.disconnect();
    return;
  }

  // ── BACKUP ──
  console.log('\n  Writing pre-sync backup of mkkycoyo document …');
  const backupCol = db.collection('interactivecourses_backups');
  const backupDoc = {
    backupAt: new Date(),
    backupReason: 'pre-sync-clean-to-mkkycoyo',
    originalSlug: mkky.slug,
    originalId: mkky._id,
    document: mkky,
  };
  const backupResult = await backupCol.insertOne(backupDoc);
  console.log(`  ✓ Backup written. backup _id=${backupResult.insertedId}`);
  console.log(`    To restore later:`);
  console.log(`      const b = await db.collection('interactivecourses_backups').findOne({_id: ObjectId("${backupResult.insertedId}")});`);
  console.log(`      await db.collection('interactivecourses').replaceOne({_id: b.originalId}, b.document);`);

  // ── WRITE ──
  console.log('\n  Applying sync …');
  const result = await courses.updateOne(
    { slug: MKKYCOYO_SLUG },
    { $set: updateDoc }
  );
  console.log(`  ✓ Written. matched=${result.matchedCount} modified=${result.modifiedCount}`);

  // ── VERIFY ──
  const verify = await courses.findOne({ slug: MKKYCOYO_SLUG });
  const verifyHash = contentHash(verify);
  console.log(`\n  Verification:`);
  console.log(`    mkkycoyo._id preserved:        ${String(verify._id) === String(mkky._id) ? '✓' : '✗ MISMATCH'}`);
  console.log(`    mkkycoyo.slug preserved:       ${verify.slug === MKKYCOYO_SLUG ? '✓' : '✗ MISMATCH'}`);
  console.log(`    content hash now matches clean: ${verifyHash === cleanHash ? '✓' : '✗ ' + verifyHash + ' vs ' + cleanHash}`);
  console.log(`    sections:                       ${verify.sections?.length || 0}  (was ${mkky.sections?.length || 0}, clean ${clean.sections?.length || 0})`);
  console.log(`    assessment Qs:                  ${verify.assessment?.questions?.length || 0}  (was ${mkky.assessment?.questions?.length || 0}, clean ${clean.assessment?.questions?.length || 0})`);
  console.log(`    status:                         ${verify.status}  (mkky was ${mkky.status}, clean is ${clean.status})`);
  console.log(`    isPublished:                    ${verify.isPublished}`);
  console.log(`    title:                          "${verify.title}"`);

  await mongoose.disconnect();
  console.log('\n✓ Done.');
}

main().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
