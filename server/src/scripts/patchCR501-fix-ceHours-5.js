/**
 * patchCR501-fix-ceHours-5.js
 * ─────────────────────────────────────────────────────────────
 * Fixes CR-501 (DBT) in the live interactivecourses collection:
 *   - ceHours: 6 → 5
 *   - ceuHours: 6 → 5  (if present)
 *   - subtitle: "6-Hour" → "5-Hour"
 *
 * Run from Render shell:
 *   node src/scripts/patchCR501-fix-ceHours-5.js
 *
 * Working dir must be ~/project/src/server
 * ─────────────────────────────────────────────────────────────
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('MONGODB_URI not set'); process.exit(1); }

await mongoose.connect(MONGODB_URI);
const db = mongoose.connection.db;
const col = db.collection('interactivecourses');

// ── 1. Find the live record ──────────────────────────────────
const before = await col.findOne({ courseCode: 'CR-501' }, {
  projection: { _id: 1, courseCode: 1, title: 1, ceHours: 1, ceuHours: 1, subtitle: 1 }
});

if (!before) {
  console.error('❌ CR-501 not found in interactivecourses');
  await mongoose.disconnect();
  process.exit(1);
}

console.log('Before:', JSON.stringify(before, null, 2));

// ── 2. Build $set payload ────────────────────────────────────
const $set = { ceHours: 5 };
if (before.ceuHours !== undefined) $set.ceuHours = 5;
if (before.subtitle && before.subtitle.includes('6-Hour')) {
  $set.subtitle = before.subtitle.replace('6-Hour', '5-Hour');
}

console.log('\nApplying $set:', $set);

// ── 3. Apply patch ───────────────────────────────────────────
const result = await col.updateOne({ _id: before._id }, { $set });
console.log('Updated:', result.modifiedCount, 'document(s)');

// ── 4. Verify ────────────────────────────────────────────────
const after = await col.findOne({ _id: before._id }, {
  projection: { _id: 1, courseCode: 1, ceHours: 1, ceuHours: 1, subtitle: 1 }
});
console.log('\nAfter:', JSON.stringify(after, null, 2));

if (after.ceHours === 5) {
  console.log('\n✅ CR-501 patched successfully — ceHours = 5');
} else {
  console.error('\n❌ Patch may not have applied — verify manually');
}

await mongoose.disconnect();
