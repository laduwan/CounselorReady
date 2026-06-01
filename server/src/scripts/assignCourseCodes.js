// assignCourseCodes.js
// Assigns courseCode fields to interactivecourses documents by title prefix match.
// DRY RUN by default — pass --execute to write changes.
// Run: node assignCourseCodes.js [--execute]
// Requires: MONGODB_URI environment variable

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const EXECUTE = process.argv.includes('--execute');

const assignments = [
  { title: 'Crisis Intervention and Suicide Prevention', code: 'CR-102' },
  { title: 'Suicide Assessment and Safety Planning', code: 'CR-103' },
  { title: 'Suicide Risk Assessment: Evidence-Based', code: 'CR-104' },
  { title: 'See Something? Say Something', code: 'CR-203' },
  { title: 'Beyond the Surface: Multicultural', code: 'CR-308' },
  { title: 'Cultural Humility in Clinical Practice', code: 'CR-309' },
  { title: 'Beyond the Uniform: Culturally Responsive', code: 'CR-310' },
  { title: 'Small Warriors, Big Battles', code: 'CR-311' },
  { title: 'Active Listening: The Foundation', code: 'CR-406' },
  { title: 'Building Therapeutic Rapport', code: 'CR-407' },
  { title: 'Psychopharmacology for Counselors', code: 'CR-408' },
  { title: 'Psychiatric Medications: What Non-Prescribers', code: 'CR-409' },
  { title: 'DBT Skills in Action', code: 'CR-502' },
  { title: 'Plot Twist: Narrative Therapy', code: 'CR-503' },
  { title: 'The Neurobiology of Trauma', code: 'CR-602' },
  { title: 'Trauma-Informed Care: Foundations for Clinical', code: 'CR-603' },
  { title: 'Foundations of Trauma-Informed Care: Assessment', code: 'CR-604' },
  { title: 'Introduction to Mindfulness', code: 'CR-605' },
  { title: 'Good Will Hunting', code: 'CR-801' },
  { title: 'Black Swan: Perfectionism', code: 'CR-802' },
  { title: 'Ordinary People: Family Systems', code: 'CR-803' },
  { title: 'The Sixth Sense: Clinical Intuition', code: 'CR-804' },
];

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  const col = mongoose.connection.collection('interactivecourses');

  console.log(`\nMode: ${EXECUTE ? 'EXECUTE' : 'DRY RUN (pass --execute to write)'}\n`);

  let assigned = 0;
  let notFound = 0;

  for (const { title, code } of assignments) {
    const prefix = title.slice(0, 30);
    const doc = await col.findOne({
      title: { $regex: `^${prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, $options: 'i' },
      courseCode: { $in: [null, undefined, ''] },
    });

    if (!doc) {
      console.log(`  NOT FOUND:  ${title}`);
      notFound++;
      continue;
    }

    if (EXECUTE) {
      await col.updateOne({ _id: doc._id }, { $set: { courseCode: code } });
      console.log(`  SET:        ${doc.title.slice(0, 65)} → ${code}`);
    } else {
      console.log(`  WOULD SET:  ${doc.title.slice(0, 65)} → ${code}`);
    }
    assigned++;
  }

  console.log(`\n── Summary ─────────────────────────────────────────`);
  console.log(`  ${EXECUTE ? 'Assigned' : 'Would assign'} : ${assigned}`);
  console.log(`  Not found    : ${notFound}`);

  await mongoose.disconnect();
}

run().catch(e => { console.error(e); process.exit(1); });
