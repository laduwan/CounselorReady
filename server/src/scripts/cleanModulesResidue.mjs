/**
 * cleanModulesResidue.mjs
 * Removes leftover modules[] arrays from interactivecourses documents
 * that have already been migrated to sections[].contentBlocks[] schema.
 *
 * Safe: course viewer reads only sections[]. modules[] is dead data.
 * Dry-run by default. Pass --execute to write.
 *
 * Run from ~/project/src/server:
 *   node src/scripts/cleanModulesResidue.mjs          # dry run
 *   node src/scripts/cleanModulesResidue.mjs --execute # live
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

if (!process.env.MONGODB_URI) {
  console.error('❌ MONGODB_URI not set');
  process.exit(1);
}

const EXECUTE = process.argv.includes('--execute');

await mongoose.connect(process.env.MONGODB_URI);
const col = mongoose.connection.db.collection('interactivecourses');

// Find all docs with a non-empty modules array
const affected = await col.find(
  { modules: { $exists: true, $not: { $size: 0 } } },
  { projection: { courseCode: 1, title: 1, modules: 1, sections: 1 } }
).toArray();

console.log(`\n${EXECUTE ? '🚀 EXECUTE MODE' : '🔍 DRY RUN (pass --execute to write)'}\n`);
console.log(`Found ${affected.length} courses with modules[] residue:\n`);
console.log('courseCode'.padEnd(16) + 'modules'.padEnd(10) + 'sections'.padEnd(10) + 'title');
console.log('─'.repeat(80));

for (const doc of affected) {
  const moduleCount = doc.modules?.length ?? 0;
  const sectionCount = doc.sections?.length ?? 0;
  console.log(
    (doc.courseCode || '(none)').padEnd(16) +
    String(moduleCount).padEnd(10) +
    String(sectionCount).padEnd(10) +
    (doc.title || '').substring(0, 50)
  );
}

console.log('─'.repeat(80));

if (affected.length === 0) {
  console.log('✅ Nothing to clean.');
  await mongoose.disconnect();
  process.exit(0);
}

if (!EXECUTE) {
  console.log(`\n⚠️  Dry run complete. ${affected.length} courses would have modules[] removed.`);
  console.log('Run with --execute to apply.\n');
  await mongoose.disconnect();
  process.exit(0);
}

// Execute: $unset modules on all affected docs
const ids = affected.map(d => d._id);
const result = await col.updateMany(
  { _id: { $in: ids } },
  { $unset: { modules: '' } }
);

console.log(`\n✅ Done. modules[] removed from ${result.modifiedCount} courses.`);
await mongoose.disconnect();
