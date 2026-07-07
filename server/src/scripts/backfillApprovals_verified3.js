// Backfills approvals[] for the 3 courses verified safe by title-match
// cross-reference against seed files (CR-201, CR-403, CR-404).
//
// NOTE: source seed files used non-schema field names (`approvalStatus`
// instead of `status`, `hourBreakdown[].type` instead of `.label`) —
// corrected here to match server/src/models/InteractiveCourse.js.
//
// Uses updateOne/$set only — never touches other fields, never runs
// .save() on the full doc (per project convention: raw driver writes
// don't trigger contentBlocks[].order validation on legacy docs).
//
// Run from ~/project/src/server:
//   node src/scripts/backfillApprovals_verified3.js --dry     (preview only)
//   node src/scripts/backfillApprovals_verified3.js           (writes)

import mongoose from 'mongoose';

const DRY = process.argv.includes('--dry') || process.argv.includes('--dry-run');

const UPDATES = [
  {
    courseCode: 'CR-201',
    expectedTitle: 'Ethics and Professional Boundaries in Counseling Practice',
    approvals: [
      {
        body: 'NBCC',
        providerNumber: '7760',
        status: 'approved',
        hourBreakdown: [{ label: 'ethics', hours: 3 }],
      },
    ],
  },
  {
    courseCode: 'CR-403',
    expectedTitle: 'When It Rains, It Pours: Treating Clients with Multiple Stressors and Comorbidities',
    approvals: [
      {
        body: 'NBCC',
        providerNumber: '7760',
        status: 'approved',
        hourBreakdown: [{ label: 'core', hours: 3 }],
      },
    ],
  },
  {
    courseCode: 'CR-404',
    expectedTitle: 'It Takes a Village: Consultation, Referral, and Collaborative Care',
    approvals: [
      {
        body: 'NBCC',
        providerNumber: '7760',
        status: 'approved',
        hourBreakdown: [{ label: 'core', hours: 3 }],
      },
    ],
  },
];

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) { console.error('MONGODB_URI not set'); process.exit(1); }

  await mongoose.connect(uri);
  const C = mongoose.connection.collection('interactivecourses');

  for (const u of UPDATES) {
    const doc = await C.findOne({ courseCode: u.courseCode });

    if (!doc) {
      console.log(`  SKIP ${u.courseCode}: no course found with this code`);
      continue;
    }

    if (Array.isArray(doc.approvals) && doc.approvals.length > 0) {
      console.log(`  SKIP ${u.courseCode}: approvals[] already populated (${doc.approvals.length} entries) — not overwriting`);
      continue;
    }

    if (doc.title !== u.expectedTitle) {
      console.log(`  SKIP ${u.courseCode}: title mismatch — live="${doc.title}" expected="${u.expectedTitle}". Refusing to write (safety check failed).`);
      continue;
    }

    console.log(`  ${DRY ? '[DRY] ' : ''}WRITE ${u.courseCode}: "${doc.title}" -> approvals: ${JSON.stringify(u.approvals)}`);

    if (!DRY) {
      await C.updateOne({ _id: doc._id }, { $set: { approvals: u.approvals } });
    }
  }

  await mongoose.connection.close();
  console.log(DRY ? '\nDry run complete — no writes made.' : '\nDone.');
}

main().catch((err) => {
  console.error('Backfill failed:', err);
  process.exit(1);
});
