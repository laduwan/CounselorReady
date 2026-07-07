// Read-only diagnostic: reports approvals[] state across all live courses.
// Does NOT write anything. Safe to run anytime.
//
// Run from ~/project/src/server:
//   node src/scripts/diagnoseApprovalsGaps.js
//   node src/scripts/diagnoseApprovalsGaps.js --json > approvals-report.json

import mongoose from 'mongoose';

const AS_JSON = process.argv.includes('--json');

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) { console.error('MONGODB_URI not set'); process.exit(1); }

  await mongoose.connect(uri);
  const C = mongoose.connection.collection('interactivecourses');

  const courses = await C.find(
    {},
    {
      projection: {
        title: 1,
        courseCode: 1,
        ceHours: 1,
        approvals: 1,
        isPublished: 1,
        status: 1,
      },
    }
  ).toArray();

  const report = courses.map((c) => {
    const approvals = Array.isArray(c.approvals) ? c.approvals : [];
    return {
      _id: String(c._id),
      courseCode: c.courseCode || null,
      title: c.title || null,
      ceHours: c.ceHours ?? null,
      status: c.status || null,
      isPublished: !!c.isPublished,
      approvalsCount: approvals.length,
      approvalBodies: approvals.map((a) => a && a.body).filter(Boolean),
      isEmpty: approvals.length === 0,
    };
  });

  const empty = report.filter((r) => r.isEmpty);
  const populated = report.filter((r) => !r.isEmpty);

  if (AS_JSON) {
    console.log(JSON.stringify({ totalCourses: report.length, emptyCount: empty.length, populatedCount: populated.length, courses: report }, null, 2));
  } else {
    console.log(`\nTotal courses: ${report.length}`);
    console.log(`Empty approvals[]: ${empty.length}`);
    console.log(`Populated approvals[]: ${populated.length}\n`);

    console.log('--- COURSES WITH EMPTY approvals[] ---');
    for (const r of empty) {
      console.log(`  [${r.courseCode || 'NO-CODE'}] ${r.title}  (ceHours=${r.ceHours}, published=${r.isPublished})`);
    }

    console.log('\n--- COURSES WITH POPULATED approvals[] ---');
    for (const r of populated) {
      console.log(`  [${r.courseCode || 'NO-CODE'}] ${r.title}  -> ${r.approvalBodies.join(', ')}`);
    }
  }

  await mongoose.connection.close();
}

main().catch((err) => {
  console.error('Diagnostic failed:', err);
  process.exit(1);
});
