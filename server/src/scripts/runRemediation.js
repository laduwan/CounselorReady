// server/src/scripts/runRemediation.js
// =========================================================================
// Standalone CLI: Run AI remediation inference from Render shell
// =========================================================================
// Usage in Render Node REPL:
//   cd server
//   node
//   > const { run } = await import('./src/scripts/runRemediation.js');
//   > await run({ slug: 'your-course-slug', dryRun: true });     // preview
//   > await run({ slug: 'your-course-slug' });                    // apply
//   > await run({ all: true, dryRun: true });                     // all courses, preview
//   > await run({ all: true, overwriteAI: true });                // force re-run on every course
//
// Or as a one-liner from bash:
//   node -e "import('./src/scripts/runRemediation.js').then(m => m.run({ slug: 'x' }))"
// =========================================================================

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import {
  inferRemediationForCourse,
  inferRemediationBySlug,
} from '../services/remediationInference.js';
import { Course } from '../models/InteractiveCourse.js';

dotenv.config();

function formatStats(s) {
  return [
    `  Course:            ${s.courseTitle} (${s.courseId})`,
    `  Sections processed: ${s.sectionsProcessed}`,
    `  Total KCs:          ${s.totalKCs}`,
    `  ├─ High confidence: ${s.inferredHigh}`,
    `  ├─ Medium:          ${s.inferredMedium}`,
    `  ├─ Low:             ${s.inferredLow}`,
    `  ├─ No match:        ${s.noMatch}`,
    `  ├─ Manual (kept):   ${s.manualSkipped}`,
    `  ├─ AI (skipped):    ${s.aiSkipped}`,
    `  └─ Errors:          ${s.errors}`,
    `  Block IDs added:    ${s.blocksTaggedWithIds}`,
    `  Duration:           ${(s.durationMs / 1000).toFixed(1)}s`,
  ].join('\n');
}

async function ensureConnected() {
  if (mongoose.connection.readyState === 1) return;
  const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGO_URI not set');
  await mongoose.connect(uri);
}

/**
 * Main entry point.
 *
 * @param {object} opts
 * @param {string} [opts.slug]        - single course by slug
 * @param {string} [opts.courseId]    - single course by _id
 * @param {boolean} [opts.all]        - run against every published course
 * @param {boolean} [opts.dryRun]     - preview without saving
 * @param {boolean} [opts.overwriteAI] - re-infer KCs already marked source:'ai'
 * @param {boolean} [opts.verbose=true] - console.log per-KC progress (default true for CLI)
 */
export async function run(opts = {}) {
  const {
    slug, courseId,
    all = false,
    dryRun = false,
    overwriteAI = false,
    verbose = true,
  } = opts;

  await ensureConnected();

  const inferOpts = { dryRun, overwriteAI, verbose };

  if (all) {
    console.log(`\n${dryRun ? '🔍 DRY RUN' : '⚡ APPLYING'} — all courses\n${'═'.repeat(70)}`);
    const courses = await Course.find({}, '_id title slug').lean();
    console.log(`Found ${courses.length} courses\n`);

    const aggregate = {
      coursesProcessed: 0, totalKCs: 0,
      inferredHigh: 0, inferredMedium: 0, inferredLow: 0,
      noMatch: 0, manualSkipped: 0, aiSkipped: 0,
      errors: 0, blocksTaggedWithIds: 0,
    };

    for (const c of courses) {
      console.log(`\n▸ ${c.title} [${c.slug}]`);
      try {
        const { stats } = await inferRemediationForCourse(c._id, inferOpts);
        console.log(formatStats(stats));
        aggregate.coursesProcessed++;
        aggregate.totalKCs += stats.totalKCs;
        aggregate.inferredHigh += stats.inferredHigh;
        aggregate.inferredMedium += stats.inferredMedium;
        aggregate.inferredLow += stats.inferredLow;
        aggregate.noMatch += stats.noMatch;
        aggregate.manualSkipped += stats.manualSkipped;
        aggregate.aiSkipped += stats.aiSkipped;
        aggregate.errors += stats.errors;
        aggregate.blocksTaggedWithIds += stats.blocksTaggedWithIds;
      } catch (err) {
        console.error(`  ✗ FAILED: ${err.message}`);
      }
    }

    console.log(`\n${'═'.repeat(70)}\nAGGREGATE (${aggregate.coursesProcessed}/${courses.length} courses)`);
    console.log(`  Total KCs processed:  ${aggregate.totalKCs}`);
    console.log(`  ├─ High confidence:   ${aggregate.inferredHigh}`);
    console.log(`  ├─ Medium:            ${aggregate.inferredMedium}`);
    console.log(`  ├─ Low:               ${aggregate.inferredLow}`);
    console.log(`  ├─ No match:          ${aggregate.noMatch}`);
    console.log(`  ├─ Manual (kept):     ${aggregate.manualSkipped}`);
    console.log(`  ├─ AI (skipped):      ${aggregate.aiSkipped}`);
    console.log(`  └─ Errors:            ${aggregate.errors}`);
    console.log(`  Block IDs added:      ${aggregate.blocksTaggedWithIds}`);
    console.log(`${'═'.repeat(70)}\n`);

    return aggregate;
  }

  if (!slug && !courseId) {
    throw new Error('Must provide opts.slug, opts.courseId, or opts.all=true');
  }

  console.log(`\n${dryRun ? '🔍 DRY RUN' : '⚡ APPLYING'} — ${slug || courseId}\n${'═'.repeat(70)}`);

  const result = courseId
    ? await inferRemediationForCourse(courseId, inferOpts)
    : await inferRemediationBySlug(slug, inferOpts);

  console.log(`\n${'─'.repeat(70)}`);
  console.log(formatStats(result.stats));
  console.log(`${'═'.repeat(70)}\n`);

  if (result.errorLog.length > 0) {
    console.log('Errors:');
    result.errorLog.forEach(e => console.log(`  ✗ section ${e.sectionIndex} / ${e.kcId}: ${e.error || e.reason}`));
    console.log('');
  }

  return result;
}

// Allow direct execution: `node src/scripts/runRemediation.js <slug>`
if (import.meta.url === `file://${process.argv[1]}`) {
  const slug = process.argv[2];
  const dryRun = process.argv.includes('--dry-run');
  const overwriteAI = process.argv.includes('--overwrite-ai');
  const all = process.argv.includes('--all');

  if (!slug && !all) {
    console.log('Usage: node runRemediation.js <slug> [--dry-run] [--overwrite-ai]');
    console.log('       node runRemediation.js --all [--dry-run] [--overwrite-ai]');
    process.exit(1);
  }

  run({ slug: all ? undefined : slug, all, dryRun, overwriteAI })
    .then(() => mongoose.disconnect())
    .then(() => process.exit(0))
    .catch(err => {
      console.error('FATAL:', err);
      mongoose.disconnect().finally(() => process.exit(1));
    });
}
