/**
 * fixCRTHEO604ResourceType.js
 * GAITP LLC · NBCC ACEP #7760
 *
 * Fixes one invalid enum value found while running
 * patchACEPCompliance_CR-THEO-604.js: Section 2's "resources" content block
 * ("Professional Resources for SFBT Practice") carries a nested resource
 * item — "Solution-Focused Therapy Treatment Manual for Working with
 * Individuals (SFBTA, 2nd ed.)" — with `type: 'document'`. The
 * ContentBlockSchema resources[].type enum in InteractiveCourse.js
 * (server/src/models/InteractiveCourse.js) does not include 'document':
 *
 *   ['pdf', 'video', 'link', 'article', 'website', 'book', 'xlsx', 'xls',
 *    'csv', 'docx', 'doc', 'pptx', 'ppt', 'zip', 'worksheet', 'toolkit',
 *    'template', 'guide', 'guidelines', 'research', 'organization',
 *    'standards']
 *
 * This pre-existing bad value is why patchACEPCompliance_CR-THEO-604.js's
 * validateSync() failed and it had to fall back to a raw collection update
 * instead of a full model save. This script corrects the single field
 * ('document' -> 'guide', the closest valid value — the resource is
 * described as providing "session-by-session guidance") so the document
 * validates cleanly end to end.
 *
 * Nothing else on the document is touched.
 *
 * DRY RUN by default:
 *   node src/scripts/fixCRTHEO604ResourceType.js
 * Write:
 *   node src/scripts/fixCRTHEO604ResourceType.js --execute
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { pathToFileURL } from 'url';
import { Course } from '../models/InteractiveCourse.js';

dotenv.config();

const EXECUTE = process.argv.includes('--execute');

const SLUG_CANDIDATES = ['cr-theo-604-solution-focused-brief-therapy'];
const CODE_CANDIDATES = ['CR-THEO-604'];

const BAD_TITLE = 'Solution-Focused Therapy Treatment Manual for Working with Individuals (SFBTA, 2nd ed.)';
const BAD_TYPE = 'document';
const GOOD_TYPE = 'guide';

async function findCourse() {
  for (const slug of SLUG_CANDIDATES) {
    const doc = await Course.findOne({ slug });
    if (doc) return doc;
  }
  for (const courseCode of CODE_CANDIDATES) {
    const doc = await Course.findOne({ courseCode });
    if (doc) return doc;
  }
  return null;
}

async function main() {
  if (!process.env.MONGODB_URI) { console.error('MONGODB_URI not set'); process.exit(1); }
  await mongoose.connect(process.env.MONGODB_URI);

  console.log('\n==============================================================================');
  console.log(`fixCRTHEO604ResourceType — ${EXECUTE ? 'EXECUTING WRITE' : 'DRY RUN (pass --execute to write)'}`);
  console.log('==============================================================================');

  const course = await findCourse();
  if (!course) {
    console.log('Course not found by slug or courseCode candidates. Nothing to do.');
    await mongoose.disconnect();
    process.exit(1);
  }

  console.log(`matched: "${course.title}" (${course.courseCode}) · slug=${course.slug}`);

  let found = null;
  for (const section of course.sections || []) {
    for (const block of section.contentBlocks || []) {
      if (block.type !== 'resources' || !Array.isArray(block.resources)) continue;
      for (const item of block.resources) {
        if (item.title === BAD_TITLE && item.type === BAD_TYPE) {
          found = item;
        }
      }
    }
  }

  if (!found) {
    console.log(`No resource item titled "${BAD_TITLE}" with type "${BAD_TYPE}" found — already fixed or content changed. SKIP.`);
    await mongoose.disconnect();
    process.exit(0);
  }

  console.log(`  resource "${BAD_TITLE}": type "${BAD_TYPE}" -> "${GOOD_TYPE}"`);

  if (EXECUTE) {
    found.type = GOOD_TYPE;
    course.markModified('sections');
    const verr = course.validateSync();
    if (verr) {
      console.log('validateSync() still fails after the fix:');
      console.log(verr.message);
      console.log('Not saving. Investigate further before re-running.');
      await mongoose.disconnect();
      process.exit(1);
    }
    await course.save();
    console.log('SAVED via model — validateSync() clean.');
  } else {
    console.log('(dry run — nothing written)');
  }

  console.log('==============================================================================\n');
  await mongoose.disconnect();
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch(e => { console.error('ERROR:', e.message); process.exit(2); });
}
