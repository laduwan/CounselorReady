// Read-only diagnostic: reports nbccContentAreas[], description, and
// targetAudience coverage across all live courses. These are the fields
// the in-viewer CE title page (buildTitlePageOverview, interactive-course.html
// ~L8140) reads — courses missing any of them simply skip that section,
// which is why some courses look "simplified" compared to others.
//
// Does NOT write anything. Safe to run anytime.
//
// Run from ~/project/src/server:
//   node src/scripts/diagnoseContentAreasGaps.js
//   node src/scripts/diagnoseContentAreasGaps.js --json > content-areas-report.json

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
        nbccContentAreas: 1,
        objectives: 1,
        description: 1,
        targetAudience: 1,
        isPublished: 1,
      },
    }
  ).toArray();

  const report = courses.map((c) => {
    const areas = Array.isArray(c.nbccContentAreas) ? c.nbccContentAreas : [];
    const objectives = Array.isArray(c.objectives) ? c.objectives : [];
    const targetAudience = Array.isArray(c.targetAudience) ? c.targetAudience : [];
    const hasDescription = !!(c.description && c.description.trim());
    return {
      _id: String(c._id),
      courseCode: c.courseCode || null,
      title: c.title || null,
      ceHours: c.ceHours ?? null,
      isPublished: !!c.isPublished,
      contentAreasCount: areas.length,
      contentAreas: areas,
      objectivesCount: objectives.length,
      hasDescription,
      targetAudienceCount: targetAudience.length,
      targetAudience,
      isEmpty: areas.length === 0,
      overviewGaps: [
        !hasDescription ? 'description' : null,
        targetAudience.length === 0 ? 'targetAudience' : null,
        objectives.length === 0 ? 'objectives' : null,
        areas.length === 0 ? 'nbccContentAreas' : null,
      ].filter(Boolean),
    };
  });

  const empty = report.filter((r) => r.isEmpty);
  const populated = report.filter((r) => !r.isEmpty);

  const anyGaps = report.filter((r) => r.overviewGaps.length > 0);
  const noGaps = report.filter((r) => r.overviewGaps.length === 0);
  const missingDescription = report.filter((r) => !r.hasDescription);

  if (AS_JSON) {
    console.log(JSON.stringify({ totalCourses: report.length, emptyContentAreas: empty.length, populatedContentAreas: populated.length, missingDescription: missingDescription.length, coursesWithAnyGap: anyGaps.length, courses: report }, null, 2));
  } else {
    console.log(`\nTotal courses: ${report.length}`);
    console.log(`Empty nbccContentAreas[]: ${empty.length}`);
    console.log(`Populated nbccContentAreas[]: ${populated.length}`);
    console.log(`Missing description (required field!): ${missingDescription.length}`);
    console.log(`Courses with at least one overview gap: ${anyGaps.length}`);
    console.log(`Courses with a fully populated overview: ${noGaps.length}\n`);

    if (missingDescription.length) {
      console.log('--- ⚠️  COURSES MISSING description (schema marks this required — investigate) ---');
      for (const r of missingDescription) {
        console.log(`  [${r.courseCode || 'NO-CODE'}] ${r.title}`);
      }
      console.log('');
    }

    console.log('--- COURSES WITH ANY OVERVIEW GAP ---');
    for (const r of anyGaps) {
      console.log(`  [${r.courseCode || 'NO-CODE'}] ${r.title}  missing: ${r.overviewGaps.join(', ')}  (published=${r.isPublished})`);
    }

    console.log('\n--- COURSES WITH FULLY POPULATED OVERVIEW ---');
    for (const r of noGaps) {
      console.log(`  [${r.courseCode || 'NO-CODE'}] ${r.title}`);
    }
  }

  await mongoose.connection.close();
}

main().catch((err) => {
  console.error('Diagnostic failed:', err);
  process.exit(1);
});
