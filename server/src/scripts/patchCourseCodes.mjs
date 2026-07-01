/**
 * patchCourseCodes.mjs
 * Bulk-patches courseCode field on interactivecourses collection.
 * Dry-run by default. Pass --execute to write.
 *
 * Run from ~/project/src/server:
 *   node src/scripts/patchCourseCodes.mjs          # dry run
 *   node src/scripts/patchCourseCodes.mjs --execute # live
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

if (!process.env.MONGODB_URI) {
  console.error('❌ MONGODB_URI not set');
  process.exit(1);
}

const EXECUTE = process.argv.includes('--execute');

// ─── PATCH MAP ────────────────────────────────────────────────────────────────
// Format: [currentCode, newCode, titleSnippet (for verification only)]
const PATCHES = [
  // 100s — Crisis & Safety
  ['CR-SP-204',  'CR-105',  'Involuntary Psychiatric Holds'],

  // 200s — Ethics & Professional Responsibility
  ['CR-201',     'CR-201',  'Ethics & Professional Boundaries'],          // no change, already correct
  ['CR-203',     'CR-202',  'Mandated Reporter'],
  ['CR-C4',      'CR-203',  'Clinician Burnout'],
  ['CR-BIL-101', 'CR-204',  'Mental Health Billing'],

  // 300s — Social & Cultural Foundations
  ['CR-303',     'CR-301',  'Lost in Translation'],
  ['CR-308',     'CR-302',  'Beyond the Surface'],
  ['CR-309',     'CR-303',  'Cultural Humility'],
  ['CR-310',     'CR-304',  'Beyond the Uniform'],
  ['CR-311',     'CR-305',  'Small Warriors'],
  ['CR-C2',      'CR-306',  'Racial Trauma'],
  ['CR-601',     'CR-307',  'Foundations of Cultural Competence'],

  // 400s — Counseling Theory, Relationship & Clinical Skills
  ['CR-301',     'CR-401',  '28 Days Later'],
  ['CR-302',     'CR-402',  'Motivational Interviewing: From Ambivalence'],
  ['CR-401',     'CR-403',  'Elephant in the Room'],
  ['CR-402',     'CR-404',  'Walking on Eggshells'],
  ['CR-403',     'CR-405',  'When It Rains'],
  ['CR-404',     'CR-406',  'It Takes a Village'],
  ['CR-406',     'CR-407',  'Active Listening'],
  ['CR-407',     'CR-408',  'Building Therapeutic Rapport'],
  ['CR-501',     'CR-409',  'Dialectical Behavior Therapy'],
  ['CR-502',     'CR-410',  'DBT Skills in Action'],
  ['CR-503',     'CR-411',  'Plot Twist'],
  ['CR-CBT-201', 'CR-412',  'CBT Toolbox'],
  ['CR-MI-101',  'CR-413',  'Motivational Interviewing in First Sessions'],
  ['CR-EX-201',  'CR-414',  'Existential Theory'],
  ['CR-DC-301',  'CR-415',  'Elephant in the Room: Navigating Difficult Conversations in Therapy'],
  ['CR-C5',      'CR-416',  'Neurodivergent'],
  ['CR-C1',      'CR-417',  'Moral Injury'],
  ['CR-602',     'CR-418',  'Neurobiology of Trauma'],
  ['CR-603',     'CR-419',  'Trauma-Informed Care: Foundations for Clinical Practice'],
  ['CR-604',     'CR-420',  'Foundations of Trauma-Informed Care: Assessment'],
  ['CR-TIC',     'CR-421',  'Trauma-Informed Care and PTSD'],
  ['CR-NEU',     'CR-422',  'Inside Out'],
  ['CR-605',     'CR-423',  'Introduction to Mindfulness'],
  ['CR-610',     'CR-424',  'Unretiring the Self'],
  ['CR-611',     'CR-425',  'The Long Goodbye'],
  ['CR-612',     'CR-426',  'Still Standing'],
  ['CR-613',     'CR-427',  'Seasoned and Struggling'],
  ['CR-614',     'CR-428',  'The Final Chapter'],
  ['CR-630',     'CR-429',  'Sexual Health Across the Lifespan'],
  ['CR-631',     'CR-430',  'Sexuality, Identity'],
  ['CR-632',     'CR-431',  'Sexual Trauma'],
  ['CR-633',     'CR-432',  'Sex Therapy Foundations'],
  ['CR-634',     'CR-433',  'Compulsive Sexual Behavior'],
  ['CR-801',     'CR-434',  'Good Will Hunting'],
  ['CR-802',     'CR-435',  'Black Swan'],
  ['CR-803',     'CR-436',  'Ordinary People'],
  ['CR-804',     'CR-437',  'The Sixth Sense'],
  ['CR-FILM-101','CR-438',  'A Beautiful Mind'],
  ['CR-PHY',     'CR-439',  'Pursuit of Happyness'],

  // 500s — Evaluation, Assessment & Interpretation
  ['CR-408',     'CR-501',  'Psychopharmacology for Counselors'],
  ['CR-409',     'CR-502',  'Psychiatric Medications'],

  // 600s — Supervision, Training & Teaching
  ['CR-TMH602',  'CR-601',  'TeleMental Health Supervision'],

  // 800s — Distance Counseling, Technology & Social Media
  ['CR-C3',      'CR-801',  'AI Ethics'],

  // Blank code — Georgia TMH version
  ['',           'CR-TMH601-GA', 'Mastering TeleMental Health: Compliant Virtual Practice in Georgia'],

  // KEEP AS-IS (no patch needed — listed for audit trail):
  // CR-101 CR-102 CR-103 CR-104 → already correct 100s
  // CR-201 → already correct 200s (no-op above)
  // CR-TMH601 → branded, keep
];
// ─────────────────────────────────────────────────────────────────────────────

await mongoose.connect(process.env.MONGODB_URI);
const db = mongoose.connection.db;
const col = db.collection('interactivecourses');

console.log(`\n${ EXECUTE ? '🚀 EXECUTE MODE' : '🔍 DRY RUN (pass --execute to write)'}\n`);
console.log('old code'.padEnd(16) + 'new code'.padEnd(16) + 'status'.padEnd(12) + 'title');
console.log('─'.repeat(90));

let matched = 0, skipped = 0, noMatch = 0;

for (const [oldCode, newCode, titleHint] of PATCHES) {
  if (oldCode === newCode) {
    console.log(oldCode.padEnd(16) + newCode.padEnd(16) + 'NO-OP'.padEnd(12) + titleHint);
    skipped++;
    continue;
  }

  // Find by courseCode (use empty string query for blank codes)
  const query = oldCode === '' ? { courseCode: { $in: ['', null] } } : { courseCode: oldCode };
  const doc = await col.findOne(query, { projection: { title: 1, courseCode: 1 } });

  if (!doc) {
    console.log(oldCode.padEnd(16) + newCode.padEnd(16) + '❌ NOT FOUND'.padEnd(12) + titleHint);
    noMatch++;
    continue;
  }

  // Verify title hint loosely matches
  const titleMatch = doc.title?.toLowerCase().includes(titleHint.toLowerCase().split(' ')[0]);
  const status = EXECUTE ? 'PATCHED' : 'WOULD PATCH';

  console.log(
    oldCode.padEnd(16) +
    newCode.padEnd(16) +
    status.padEnd(12) +
    doc.title.substring(0, 50)
  );

  if (EXECUTE) {
    await col.updateOne({ _id: doc._id }, { $set: { courseCode: newCode } });
  }
  matched++;
}

console.log('\n─'.repeat(90));
console.log(`Total: ${matched} ${EXECUTE ? 'patched' : 'would patch'} | ${skipped} no-op | ${noMatch} not found`);

if (!EXECUTE) {
  console.log('\n⚠️  Dry run complete. Run with --execute to apply changes.');
}

await mongoose.disconnect();
