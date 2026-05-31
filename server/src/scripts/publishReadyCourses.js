/**
 * publishReadyCourses.js
 * ──────────────────────────────────────────────────────────────────
 * Audits every course in the `interactivecourses` collection and,
 * optionally, publishes draft courses that meet minimum readiness
 * criteria.
 *
 * Usage:
 *   node server/src/scripts/publishReadyCourses.js            # dry run (read-only)
 *   node server/src/scripts/publishReadyCourses.js --publish  # publish ready drafts
 *
 * Requires: MONGODB_URI environment variable.
 *
 * Publish criteria (a draft must meet ALL to be published):
 *   - at least 1 section
 *   - at least 1 content block (across all sections)
 *   - ceHours > 0
 *   - a non-empty title
 *
 * Drafts that fail any criterion are left as draft with a warning.
 * Published / archived courses are never modified.
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Course as InteractiveCourse } from '../models/InteractiveCourse.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
const DO_PUBLISH = process.argv.includes('--publish');

// Count total content blocks across all sections of a course.
function countContentBlocks(course) {
  return (course.sections || []).reduce(
    (sum, s) => sum + ((s.contentBlocks || []).length),
    0
  );
}

// Does the course have an assessment with at least one question?
function hasAssessmentQuestions(course) {
  return !!(course.assessment
    && Array.isArray(course.assessment.questions)
    && course.assessment.questions.length > 0);
}

// Returns an array of human-readable reasons the course is NOT ready,
// or an empty array if it meets all publish criteria.
function unmetCriteria(course) {
  const reasons = [];
  if (!course.title || !String(course.title).trim()) reasons.push('missing title');
  if (!(course.sections && course.sections.length >= 1)) reasons.push('no sections');
  if (countContentBlocks(course) < 1) reasons.push('no content blocks');
  if (!(typeof course.ceHours === 'number' && course.ceHours > 0)) reasons.push('ceHours not > 0');
  return reasons;
}

async function main() {
  if (!MONGODB_URI) {
    console.error('❌ No MONGODB_URI environment variable set');
    process.exit(1);
  }

  console.log(DO_PUBLISH
    ? '🚀 publishReadyCourses — PUBLISH MODE (will modify draft courses)\n'
    : '🔍 publishReadyCourses — DRY RUN (read-only; pass --publish to apply)\n');

  await mongoose.connect(MONGODB_URI);

  try {
    const courses = await InteractiveCourse.find({}).sort({ title: 1 });

    let published = 0, draft = 0, archived = 0;
    let newlyPublished = 0, skippedDrafts = 0;

    for (const course of courses) {
      const blocks = countContentBlocks(course);
      const sectionCount = (course.sections || []).length;
      const hasAssessment = hasAssessmentQuestions(course);
      const ceHours = (typeof course.ceHours === 'number') ? course.ceHours : 'n/a';
      const wordCount = (typeof course.wordCount === 'number') ? course.wordCount : 'n/a';

      console.log('────────────────────────────────────────────');
      console.log(`Title:          ${course.title || '(untitled)'}`);
      console.log(`Course code:    ${course.courseCode || '(none)'}`);
      console.log(`Status:         ${course.status}`);
      console.log(`CE hours:       ${ceHours}`);
      console.log(`Sections:       ${sectionCount}`);
      console.log(`Content blocks: ${blocks}`);
      console.log(`Assessment:     ${hasAssessment ? 'yes (has questions)' : 'no'}`);
      console.log(`Word count:     ${wordCount}`);

      // Tally current status
      if (course.status === 'published') published++;
      else if (course.status === 'archived') archived++;
      else if (course.status === 'draft') draft++;

      // Publish logic — only ever touches drafts
      if (course.status === 'draft') {
        const reasons = unmetCriteria(course);
        if (reasons.length === 0) {
          if (DO_PUBLISH) {
            course.status = 'published';
            await course.save();
            newlyPublished++;
            console.log('✅ PUBLISHED (met all criteria)');
          } else {
            console.log('✅ READY to publish (would publish with --publish)');
          }
        } else {
          skippedDrafts++;
          console.log(`⚠️  NOT ready — left as draft: ${reasons.join(', ')}`);
        }
      }
    }

    // ── Summary ──
    console.log('\n══════════════ SUMMARY ══════════════');
    console.log(`Total courses:    ${courses.length}`);
    console.log(`Published:        ${published}`);
    console.log(`Draft:            ${draft}`);
    console.log(`Archived:         ${archived}`);
    if (DO_PUBLISH) {
      console.log(`\nNewly published:  ${newlyPublished}`);
      console.log(`Drafts skipped:   ${skippedDrafts} (did not meet criteria)`);
    } else {
      const ready = courses.filter(c => c.status === 'draft' && unmetCriteria(c).length === 0).length;
      console.log(`\nDrafts READY to publish: ${ready}`);
      console.log(`Drafts NOT ready:        ${draft - ready}`);
      console.log('\n(Dry run — no changes made. Re-run with --publish to apply.)');
    }
    console.log('═════════════════════════════════════');
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 MongoDB connection closed.');
  }
}

main().catch(async (err) => {
  console.error('❌ Script error:', err);
  try { await mongoose.connection.close(); } catch { /* ignore */ }
  process.exit(1);
});
