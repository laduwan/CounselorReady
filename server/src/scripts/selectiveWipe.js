/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('No MONGODB_URI'); process.exit(1); }

// ═══════════════════════════════════════════════════════════════════════
// WIPE SCRIPT — Removes only courses that have seed scripts
// Leaves 8 orphan courses untouched
// ═══════════════════════════════════════════════════════════════════════

const ORPHAN_SLUGS = new Set([
  'existential-theory-in-clinical-practice-applications-and-interventions-mkheuark',
  'motivational-interviewing-in-first-sessions-empowering-clients-for-change-mkhedkoc',
  'mental-health-billing-essentials-for-licensed-professional-counselors-mkjas300',
  'ethical-uses-of-ai-in-mental-health-counseling-mkjbmj7a',
  'mindfulness-introduction',
  'therapeutic-rapport',
  'psychiatric-medications-basics',
  'cultural-humility-clinical-practice',
]);

async function main() {
  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection.db;

  const DRY_RUN = process.argv.includes('--dry-run');
  
  if (DRY_RUN) {
    console.log('🔍 DRY RUN — no changes will be made\n');
  } else {
    console.log('⚠️  LIVE RUN — courses will be deleted\n');
  }

  console.log('='.repeat(80));
  console.log('SELECTIVE COURSE WIPE');
  console.log('='.repeat(80) + '\n');

  // ── interactivecourses ──
  const allIC = await db.collection('interactivecourses').find({}, { projection: { slug: 1, title: 1, status: 1 } }).toArray();
  
  let keepCount = 0;
  let wipeCount = 0;
  const toWipe = [];
  const toKeep = [];

  for (const c of allIC) {
    if (ORPHAN_SLUGS.has(c.slug)) {
      toKeep.push(c);
      keepCount++;
    } else {
      toWipe.push(c);
      wipeCount++;
    }
  }

  console.log('INTERACTIVE COURSES:');
  console.log(`  Total: ${allIC.length}`);
  console.log(`  To wipe: ${wipeCount}`);
  console.log(`  To keep (orphans): ${keepCount}\n`);

  console.log('KEEPING (orphans):');
  toKeep.forEach(c => console.log(`  🔒 ${c.slug} → ${c.title} (${c.status})`));

  console.log('\nWIPING:');
  toWipe.forEach(c => console.log(`  🗑️  ${c.slug} → ${c.title} (${c.status})`));

  if (!DRY_RUN) {
    const slugsToDelete = toWipe.map(c => c.slug);
    const result = await db.collection('interactivecourses').deleteMany({ slug: { $in: slugsToDelete } });
    console.log(`\n✅ Deleted ${result.deletedCount} interactive courses`);
  }

  // ── legacy courses ──
  const allLegacy = await db.collection('courses').find({}, { projection: { slug: 1, title: 1 } }).toArray();
  const legacyToWipe = allLegacy.filter(c => !ORPHAN_SLUGS.has(c.slug));
  const legacyToKeep = allLegacy.filter(c => ORPHAN_SLUGS.has(c.slug));

  console.log(`\nLEGACY COURSES:`);
  console.log(`  Total: ${allLegacy.length}`);
  console.log(`  To wipe: ${legacyToWipe.length}`);
  console.log(`  To keep: ${legacyToKeep.length}`);

  if (!DRY_RUN) {
    const legacySlugs = legacyToWipe.map(c => c.slug);
    const legResult = await db.collection('courses').deleteMany({ slug: { $in: legacySlugs } });
    console.log(`✅ Deleted ${legResult.deletedCount} legacy courses`);
  }

  // ── Clean up progress for deleted courses ──
  if (!DRY_RUN) {
    const deletedIds = toWipe.map(c => c._id);
    
    // interactivecourseprogresses
    const progResult = await db.collection('interactivecourseprogresses').deleteMany({
      courseId: { $in: deletedIds.map(id => id.toString()) }
    });
    console.log(`\n🧹 Cleaned ${progResult.deletedCount} interactive course progress records`);

    // usercourseprogresses
    const ucpResult = await db.collection('usercourseprogresses').deleteMany({
      courseId: { $in: deletedIds.map(id => id.toString()) }
    });
    console.log(`🧹 Cleaned ${ucpResult.deletedCount} user course progress records`);
  }

  // ── Verification ──
  if (!DRY_RUN) {
    const remainingIC = await db.collection('interactivecourses').countDocuments();
    const remainingLeg = await db.collection('courses').countDocuments();
    console.log(`\nVERIFICATION:`);
    console.log(`  Interactive courses remaining: ${remainingIC}`);
    console.log(`  Legacy courses remaining: ${remainingLeg}`);
  }

  console.log('\n' + '='.repeat(80));
  if (DRY_RUN) {
    console.log('DRY RUN COMPLETE — run without --dry-run to execute');
  } else {
    console.log('WIPE COMPLETE');
    console.log('\nNow run seed scripts in this order:');
    console.log('  1. node src/scripts/seedInteractiveCourses.js');
    console.log('  2. node src/scripts/seedDBT6hr_clean.js');
    console.log('  3. node src/scripts/seedGoodWillHuntingCourse.js');
    console.log('  4. node src/scripts/seedMandatedReporter.js');
    console.log('  5. node src/scripts/seedMovieCourses.js');
    console.log('  6. node src/scripts/seedNarrativeTherapyCourse.js');
    console.log('  7. node src/scripts/seedNewCourses.js');
    console.log('  8. node src/scripts/seedNewCourses3.js');
    console.log('  9. node src/scripts/seedSuicideRiskInteractive.js');
    console.log('  10. node src/scripts/seedStandardCourses_batch1.js');
    console.log('  11. node src/scripts/seedStandardCourses_batch2.js');
    console.log('  12. node src/scripts/seedTeleMentalHealth.js');
    console.log('  13. node src/scripts/seedExpandedCourses.js');
  }
  console.log('='.repeat(80));

  await mongoose.disconnect();
}

main().catch(err => { console.error(err); process.exit(1); });
