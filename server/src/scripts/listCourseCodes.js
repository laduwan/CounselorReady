// listCourseCodes.js
// Lists all interactivecourses grouped by whether they have a slug (course code).
// Run: node listCourseCodes.js
// Requires: MONGODB_URI environment variable

import mongoose from 'mongoose';
import InteractiveCourse from '../models/InteractiveCourse.js';

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('❌ No MONGODB_URI environment variable set');
  process.exit(1);
}

function fmt(course) {
  const status = (course.status || 'draft').padEnd(10);
  const ce = `${(course.ceHours ?? 0).toFixed(1)} CE`.padEnd(8);
  const wc = `${course.wordCount ?? 0}w`.padEnd(8);
  const title = (course.title || '(untitled)').slice(0, 60);
  return { status, ce, wc, title };
}

async function run() {
  await mongoose.connect(MONGODB_URI);

  const courses = await InteractiveCourse
    .find({})
    .sort({ title: 1 })
    .lean();

  const withSlug = courses.filter(c => c.slug);
  const withoutSlug = courses.filter(c => !c.slug);

  console.log('\n══ COURSES WITHOUT CODES ══════════════════════════════════════════════════\n');
  if (withoutSlug.length === 0) {
    console.log('  (none)');
  } else {
    for (const c of withoutSlug) {
      const { status, ce, wc, title } = fmt(c);
      console.log(`  ${status} | ${ce} | ${wc} | ${title}`);
    }
  }

  console.log('\n══ COURSES WITH CODES ═════════════════════════════════════════════════════\n');
  if (withSlug.length === 0) {
    console.log('  (none)');
  } else {
    for (const c of withSlug) {
      const { status, ce, wc, title } = fmt(c);
      const slug = (c.slug || '').padEnd(35).slice(0, 35);
      console.log(`  ${slug} | ${status} | ${ce} | ${wc} | ${title}`);
    }
  }

  console.log(`\n  Total: ${courses.length} (${withSlug.length} with code, ${withoutSlug.length} without)\n`);

  await mongoose.disconnect();
}

run().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
