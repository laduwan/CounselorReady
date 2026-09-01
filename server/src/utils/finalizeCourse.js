/**
 * finalizeCourse.js
 * GAITP LLC · NBCC ACEP #7760
 *
 * Root cause: most seed/patch scripts in server/src/scripts/ write via the
 * raw driver (db.collection('interactivecourses').updateOne/insertOne),
 * which bypasses the InteractiveCourse pre-save hook
 * (CourseSchema.pre('save') in ../models/InteractiveCourse.js) that
 * computes wordCount, sectionCount, moduleCount, totalContentBlocks,
 * totalQuizQuestions, and assessmentQuestionCount. The course content those
 * scripts write is fine — but the admin course-library list reads these
 * cached fields directly, so a raw write leaves it showing "0 sections" or
 * a stale/under-target word count regardless of the real content.
 *
 * finalizeCourse() reloads the document fresh from the DB and calls
 * .save() so the REAL pre-save hook computes the rollups — it does not
 * duplicate that computation. Per CLAUDE.md's "Database Backups — Snapshot
 * Before Every Course Write" rule, it snapshots the course first via
 * dbBackupService.snapshotCourse() (the same helper backupCourse.js uses)
 * before writing anything.
 *
 * Any script that just did a raw write to a course document should call
 * this afterward instead of hand-rolling its own recompute-and-save.
 */

import mongoose from 'mongoose';
import { Course } from '../models/InteractiveCourse.js';
import { countCourseWords } from './courseWordCount.js';
import { snapshotCourse } from '../services/dbBackupService.js';

function courseQuery(identifier) {
  if (mongoose.isValidObjectId(identifier) && String(identifier).length === 24) {
    return { _id: identifier };
  }
  return { $or: [{ courseCode: identifier }, { slug: identifier }] };
}

function currentRollups(doc) {
  return {
    wordCount: doc.wordCount,
    sectionCount: doc.sectionCount,
    moduleCount: doc.moduleCount,
    totalContentBlocks: doc.totalContentBlocks,
    totalQuizQuestions: doc.totalQuizQuestions,
    assessmentQuestionCount: doc.assessmentQuestionCount,
    totalEstimatedTime: doc.totalEstimatedTime,
  };
}

// Mirrors CourseSchema.pre('save') in ../models/InteractiveCourse.js so a
// --dry run can preview the outcome without writing anything. Word count
// itself is NOT reimplemented here — it's the same countCourseWords()
// import the real hook uses. If that pre-save hook's arithmetic ever
// changes, mirror the change here too.
function expectedRollups(doc) {
  const sections = doc.sections || [];
  return {
    wordCount: countCourseWords(doc),
    sectionCount: sections.length,
    moduleCount: sections.length,
    totalContentBlocks: sections.reduce((sum, s) => sum + (s.contentBlocks?.length || 0), 0),
    totalQuizQuestions: sections.reduce((sum, s) => sum + (s.quizQuestions?.length || 0), 0)
      + (doc.assessment?.questions?.length || 0),
    assessmentQuestionCount: doc.assessment?.questions?.length || 0,
    totalEstimatedTime: sections.reduce((sum, s) => sum + (s.estimatedTime || 15), 0),
  };
}

function diffRollups(before, after) {
  const changed = {};
  for (const key of Object.keys(after)) {
    if (before[key] !== after[key]) changed[key] = { from: before[key] ?? null, to: after[key] };
  }
  return changed;
}

/**
 * Reload a course fresh from the DB and save it so its cached rollup
 * fields are correct — exactly what a raw driver write skips.
 *
 * @param {string} identifier - _id, courseCode, or slug
 * @param {object} [opts]
 * @param {boolean} [opts.dryRun=false] - report the diff, write nothing, skip the backup
 * @param {string}  [opts.reason='rollup backfill'] - passed to the pre-write snapshot
 * @returns {Promise<{course: object|null, before: object|null, after: object|null, changed: object, backup: object|null, fallback: string|null}>}
 *   fallback is non-null when doc.save() failed full-document validation on
 *   something unrelated to rollups and a raw collection update was used
 *   instead — its value is that validation error's message.
 */
export async function finalizeCourse(identifier, opts = {}) {
  const { dryRun = false, reason = 'rollup backfill' } = opts;

  const doc = await Course.findOne(courseQuery(identifier));
  if (!doc) return { course: null, before: null, after: null, changed: {}, backup: null };

  const before = currentRollups(doc);

  if (dryRun) {
    const after = expectedRollups(doc);
    return { course: doc, before, after, changed: diffRollups(before, after), backup: null };
  }

  // snapshotCourse() EJSON-serializes its input; a live Mongoose document's
  // subdocument arrays (e.g. assessment.questions) carry an internal
  // __parentArray circular back-reference that breaks that serialization.
  // toObject() strips Mongoose's internal bookkeeping first.
  const backup = await snapshotCourse(doc.toObject(), { reason });

  let fallback = null;
  try {
    await doc.save(); // triggers the real pre-save hook — rollups are never recomputed here
  } catch (err) {
    // doc.save() runs full-document validation, not just the rollup fields —
    // a pre-existing, unrelated problem elsewhere in the document (e.g. a
    // contentBlocks[].order missing a value; see backfillBlockOrder.js) will
    // block the save even though the rollup fix itself is fine. Fall back to
    // a raw collection update of just the rollup fields (same values the
    // hook would have computed) so one course's other problems can't take
    // down a whole --all batch. The underlying validation error is
    // surfaced via `fallback` rather than silently swallowed.
    const expected = expectedRollups(doc);
    await mongoose.connection.db.collection('interactivecourses')
      .updateOne({ _id: doc._id }, { $set: expected });
    fallback = err.message;
    const after = expected;
    return { course: doc, before, after, changed: diffRollups(before, after), backup, fallback };
  }

  const after = currentRollups(doc);
  return { course: doc, before, after, changed: diffRollups(before, after), backup, fallback };
}
