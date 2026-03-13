/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
/**
 * CounselorReady — Bulk Seed Runner
 * Sexual Health CE Series: CR-303 through CR-307
 * 5 courses × 3 CE hours = 15 CE hours total
 * NBCC ACEP Provider #7760 — GA Integrated Therapeutic Perspectives LLC
 *
 * Usage:
 *   MONGODB_URI=<uri> node bulkSeedCR303-307-SexualHealth.js
 *   MONGODB_URI=<uri> node bulkSeedCR303-307-SexualHealth.js --dry-run
 *
 * Place this file in the same directory as the 5 individual seed scripts.
 * All courses saved as status:"draft", isPublished:false.
 * Review each in the admin panel before publishing.
 */

import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DRY_RUN  = process.argv.includes('--dry-run');
const URI      = process.env.MONGODB_URI;

if (!URI) {
  console.error('❌  MONGODB_URI not set');
  process.exit(1);
}

const SEEDS = [
  'seedCR303-Sexual_Health_Across_the_Lifespan-18006words.js',
  'seedCR304-Sexuality_Identity_Mental_Health-18030words.js',
  'seedCR305-Sexual_Trauma_Assessment_Treatment-20176words.js',
  'seedCR306-Sex_Therapy_Foundations-18275words.js',
  'seedCR307-Compulsive_Sexual_Behavior_Intimacy_Disorders-18238words.js',
];

console.log('\n' + '═'.repeat(65));
console.log('  CounselorReady — Bulk Seed: Sexual Health CE Series');
console.log('  CR-303 · CR-304 · CR-305 · CR-306 · CR-307');
console.log('  NBCC ACEP #7760 — GA Integrated Therapeutic Perspectives LLC');
if (DRY_RUN) console.log('  ⚠️   DRY RUN — listing scripts only, no DB changes');
console.log('═'.repeat(65) + '\n');

let passed = 0;
let failed = 0;

for (const seed of SEEDS) {
  const seedPath = path.join(__dirname, seed);
  console.log(`▶  Running: ${seed}`);

  if (DRY_RUN) {
    console.log('   [DRY RUN] would execute with MONGODB_URI');
    passed++;
    continue;
  }

  try {
    const output = execSync(
      `node --experimental-vm-modules "${seedPath}"`,
      { env: { ...process.env, MONGODB_URI: URI }, timeout: 60000 }
    ).toString();
    // Print only the summary lines
    output.split('\n')
      .filter(l => l.trim() && !l.includes('══') && !l.includes('──'))
      .forEach(l => console.log('   ' + l.trim()));
    passed++;
  } catch (err) {
    console.error(`   ❌  FAILED: ${err.message.split('\n')[0]}`);
    failed++;
  }
  console.log();
}

console.log('═'.repeat(65));
console.log(`  ✅  Passed : ${passed}`);
if (failed) console.log(`  ❌  Failed : ${failed}`);
console.log(`  Total CE  : ${passed * 3} hours seeded`);
console.log('  All courses → status:"draft" — review before publishing');
console.log('═'.repeat(65) + '\n');

if (failed) process.exit(1);
