/**
 * Backfill the cached rollup fields (wordCount, sectionCount, moduleCount,
 * totalContentBlocks, totalQuizQuestions, assessmentQuestionCount,
 * totalEstimatedTime) on courses written via the raw driver, which bypasses
 * the InteractiveCourse pre-save hook that computes them.
 *
 * Root cause: most seed/patch scripts write via
 * db.collection('interactivecourses').updateOne/insertOne instead of
 * course.save(). The course content those scripts write is correct; only
 * the cached rollup fields the admin course-library list reads directly go
 * stale or missing ("0 sections", under-target word count, etc.).
 *
 * Safety net for everything written before utils/finalizeCourse.js existed
 * (or before a given script started calling it). Follows the conventions of
 * backfillBlockOrder.js: same CLI shape, --dry by default behavior spelled
 * out explicitly, one course or --all, read-only unless --dry is absent.
 *
 * Per CLAUDE.md's "Database Backups — Snapshot Before Every Course Write"
 * rule, every real write here is preceded by a pre-write snapshot (via
 * finalizeCourse() -> dbBackupService.snapshotCourse()), same as
 * backupCourse.js.
 *
 * Run on the Render shell (working dir ~/project/src/server):
 *     node src/scripts/backfillCourseRollups.js CR-501          # one course by code
 *     node src/scripts/backfillCourseRollups.js <mongoId>       # one course by _id
 *     node src/scripts/backfillCourseRollups.js --all           # every course
 *     node src/scripts/backfillCourseRollups.js --all --dry     # report only, no writes, no backups
 */
import mongoose from 'mongoose';
import { finalizeCourse } from '../utils/finalizeCourse.js';

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('❌ No MONGODB_URI environment variable set'); process.exit(1); }

const args = process.argv.slice(2);
const DRY = args.includes('--dry');
const ALL = args.includes('--all');
const target = args.find(a => !a.startsWith('--'));

function fmtChange(changed) {
  const keys = Object.keys(changed);
  if (!keys.length) return null;
  return keys.map(k => `${k}: ${changed[k].from} -> ${changed[k].to}`).join(', ');
}

(async () => {
  await mongoose.connect(MONGODB_URI);
  console.log(DRY ? 'Connected (DRY RUN — no writes, no backups).\n' : 'Connected.\n');

  let identifiers;
  if (target) {
    identifiers = [target];
  } else if (ALL) {
    const col = mongoose.connection.db.collection('interactivecourses');
    const docs = await col.find({}, { projection: { courseCode: 1, slug: 1 } }).sort({ courseCode: 1 }).toArray();
    identifiers = docs.map(d => d.courseCode || d.slug);
  } else {
    console.error('Specify a course code/_id, or --all.');
    await mongoose.disconnect();
    process.exit(1);
  }

  let touched = 0, alreadyCorrect = 0, notFound = 0;

  for (const id of identifiers) {
    const { course, before, after, changed } = await finalizeCourse(id, {
      dryRun: DRY,
      reason: 'backfillCourseRollups.js — stale rollup fields from a raw-driver write',
    });

    if (!course) {
      console.log(`✗ NOT FOUND: ${id}`);
      notFound++;
      continue;
    }

    const label = `${course.courseCode || '(no code)'} — "${(course.title || '').slice(0, 60)}" [${course._id}]`;
    const diff = fmtChange(changed);

    if (!diff) {
      console.log(`✓ ${label} — rollups already correct, nothing to do`);
      alreadyCorrect++;
      continue;
    }

    console.log(`• ${label}`);
    console.log(`    ${diff}`);
    console.log(DRY ? `    (dry run) would save` : `    ✓ saved`);
    touched++;
  }

  console.log('\n────────────────────────────────────────');
  console.log(`${identifiers.length} checked · ${touched} ${DRY ? 'would be fixed' : 'fixed'} · ${alreadyCorrect} already correct · ${notFound} not found`);
  await mongoose.disconnect();
})().catch(async (e) => { console.error('Fatal:', e); try { await mongoose.disconnect(); } catch {} process.exit(1); });
