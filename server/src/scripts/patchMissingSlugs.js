#!/usr/bin/env node
/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
/**
 * patchMissingSlugs.js
 *
 * Finds interactivecourses documents missing the `slug` field and generates
 * slugs from the title (lowercase, hyphens, no special chars).
 *
 * Dry-run (default):  node src/scripts/patchMissingSlugs.js
 * Apply patches:      node src/scripts/patchMissingSlugs.js --write
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { Course as InteractiveCourse } from '../models/InteractiveCourse.js';

const WRITE = process.argv.includes('--write');

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 80);
}

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌ MONGODB_URI not set in .env');
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log('✅ Connected to MongoDB\n');

  // Find documents where slug is missing, null, or empty string
  const missing = await InteractiveCourse.find({
    $or: [
      { slug: { $exists: false } },
      { slug: null },
      { slug: '' }
    ]
  }).select('_id title slug').lean();

  if (missing.length === 0) {
    console.log('✅ All interactivecourses documents already have a slug. Nothing to patch.');
    await mongoose.disconnect();
    return;
  }

  console.log(`Found ${missing.length} document(s) missing a slug:\n`);

  // Collect existing slugs to avoid duplicates
  const existingSlugs = new Set(
    (await InteractiveCourse.find({ slug: { $exists: true, $ne: null, $ne: '' } })
      .select('slug').lean()
    ).map(d => d.slug)
  );

  const patches = [];

  for (const doc of missing) {
    let base = generateSlug(doc.title || 'untitled');
    let candidate = base;
    let suffix = 2;

    // Ensure uniqueness against existing slugs and other patches in this batch
    while (existingSlugs.has(candidate)) {
      candidate = `${base}-${suffix}`;
      suffix++;
    }

    existingSlugs.add(candidate);
    patches.push({ _id: doc._id, title: doc.title, slug: candidate });
  }

  // Display proposed patches
  console.log('─'.repeat(100));
  console.log(
    'ID'.padEnd(28) +
    'Title'.padEnd(52) +
    'Proposed Slug'
  );
  console.log('─'.repeat(100));

  for (const p of patches) {
    console.log(
      String(p._id).padEnd(28) +
      (p.title || '(no title)').substring(0, 50).padEnd(52) +
      p.slug
    );
  }
  console.log('─'.repeat(100));

  if (!WRITE) {
    console.log('\n🔍 DRY RUN — no changes written. Re-run with --write to apply patches.');
    await mongoose.disconnect();
    return;
  }

  // Apply patches
  console.log('\n✏️  Writing patches...');
  for (const p of patches) {
    const result = await InteractiveCourse.updateOne(
      { _id: p._id },
      { $set: { slug: p.slug } }
    );
    console.log(`  ${p.slug} → matched: ${result.matchedCount}, modified: ${result.modifiedCount}`);
  }

  console.log(`\n✅ Patched ${patches.length} document(s).`);
  await mongoose.disconnect();
}

main().catch(err => {
  console.error('❌ Error:', err);
  mongoose.disconnect();
  process.exit(1);
});
