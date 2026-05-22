// Admin Course Presentation routes
// ----------------------------------
// Lets admins set/clear the presentation layer of a course from the browser:
//   - course-level header (hero) image + alt + title + subtitle
//   - per-section banner image + alt, and section header title/subtitle
//
// Writes go through mongoose.connection.db.collection('interactivecourses') with
// updateOne $set/$unset on exact paths (reliable for nested arrays; avoids any
// strict-schema edge cases). The course-level header fields are also declared on
// CourseSchema so they read cleanly via the model.
//
// Mounted at /api/admin/course-presentation (BEFORE the /api/admin catch-all).

import express from 'express';
import mongoose from 'mongoose';
import { protect, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

const COLLECTION = 'interactivecourses';

// Helper: is a value an explicit "clear" request (null or empty string)?
const isClear = (v) => v === null || v === '';

// ─── Course-level header (hero) ────────────────────────────────────────────
// PATCH /api/admin/course-presentation/:courseCode/header
// Body (any subset): { headerImage, headerImageAlt, headerTitle, headerSubtitle }
router.patch('/:courseCode/header', protect, requireAdmin, async (req, res) => {
  try {
    const { courseCode } = req.params;
    const col = mongoose.connection.db.collection(COLLECTION);
    const course = await col.findOne({ courseCode });
    if (!course) {
      return res.status(404).json({ success: false, error: `Course not found (courseCode="${courseCode}").` });
    }

    const FIELDS = ['headerImage', 'headerImageAlt', 'headerTitle', 'headerSubtitle'];
    const $set = {};
    const $unset = {};
    for (const f of FIELDS) {
      if (!(f in req.body)) continue;          // not provided → leave as-is
      const v = req.body[f];
      if (isClear(v)) $unset[f] = '';
      else $set[f] = String(v);
    }

    if (!Object.keys($set).length && !Object.keys($unset).length) {
      return res.status(400).json({ success: false, error: 'No header fields provided.' });
    }

    const update = {};
    if (Object.keys($set).length) update.$set = $set;
    if (Object.keys($unset).length) update.$unset = $unset;

    const result = await col.updateOne({ courseCode }, update);
    if (!result.matchedCount) {
      return res.status(404).json({ success: false, error: 'Course matched 0 documents on update.' });
    }

    const updated = await col.findOne(
      { courseCode },
      { projection: { headerImage: 1, headerImageAlt: 1, headerTitle: 1, headerSubtitle: 1 } }
    );
    return res.json({
      success: true,
      courseCode,
      header: {
        headerImage: updated.headerImage || null,
        headerImageAlt: updated.headerImageAlt || null,
        headerTitle: updated.headerTitle || null,
        headerSubtitle: updated.headerSubtitle || null,
      },
    });
  } catch (err) {
    console.error('[course-presentation] header error:', err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ─── Per-section divider (banner + header text) ─────────────────────────────
// PATCH /api/admin/course-presentation/:courseCode/section/:sectionIndex
// sectionIndex is 0-based.
// Body (any subset): { bannerImage, bannerAlt, title, subtitle }
//   - bannerImage explicitly null/"" → clears bannerImage + bannerAlt
router.patch('/:courseCode/section/:sectionIndex', protect, requireAdmin, async (req, res) => {
  try {
    const { courseCode } = req.params;
    const sectionIndex = Number(req.params.sectionIndex);
    if (!Number.isInteger(sectionIndex) || sectionIndex < 0) {
      return res.status(400).json({ success: false, error: 'sectionIndex must be a non-negative integer (0-based).' });
    }

    const col = mongoose.connection.db.collection(COLLECTION);
    const course = await col.findOne({ courseCode });
    if (!course) {
      return res.status(404).json({ success: false, error: `Course not found (courseCode="${courseCode}").` });
    }

    const sections = Array.isArray(course.sections) ? course.sections : [];
    if (sectionIndex >= sections.length) {
      return res.status(404).json({ success: false, error: `sectionIndex ${sectionIndex} out of range (course has ${sections.length} sections).` });
    }

    const blocks = Array.isArray(sections[sectionIndex].contentBlocks) ? sections[sectionIndex].contentBlocks : [];
    const dividerIdx = blocks.findIndex((b) => b && b.type === 'sectionDivider');
    if (dividerIdx === -1) {
      return res.status(404).json({ success: false, error: `Section ${sectionIndex} has no sectionDivider block.` });
    }

    const base = `sections.${sectionIndex}.contentBlocks.${dividerIdx}`;
    const $set = {};
    const $unset = {};

    // bannerImage / bannerAlt
    if ('bannerImage' in req.body) {
      if (isClear(req.body.bannerImage)) {
        $unset[`${base}.bannerImage`] = '';
        $unset[`${base}.bannerAlt`] = '';
      } else {
        $set[`${base}.bannerImage`] = String(req.body.bannerImage);
        if ('bannerAlt' in req.body && !isClear(req.body.bannerAlt)) {
          $set[`${base}.bannerAlt`] = String(req.body.bannerAlt);
        }
      }
    } else if ('bannerAlt' in req.body && !isClear(req.body.bannerAlt)) {
      $set[`${base}.bannerAlt`] = String(req.body.bannerAlt);
    }

    // header text: title / subtitle
    for (const f of ['title', 'subtitle']) {
      if (!(f in req.body)) continue;
      const v = req.body[f];
      if (isClear(v)) $unset[`${base}.${f}`] = '';
      else $set[`${base}.${f}`] = String(v);
    }

    if (!Object.keys($set).length && !Object.keys($unset).length) {
      return res.status(400).json({ success: false, error: 'No editable fields provided (bannerImage, bannerAlt, title, subtitle).' });
    }

    const update = {};
    if (Object.keys($set).length) update.$set = $set;
    if (Object.keys($unset).length) update.$unset = $unset;

    const result = await col.updateOne({ courseCode }, update);
    if (!result.matchedCount) {
      return res.status(404).json({ success: false, error: 'Course matched 0 documents on update.' });
    }

    const fresh = await col.findOne({ courseCode }, { projection: { sections: 1 } });
    const d = fresh.sections?.[sectionIndex]?.contentBlocks?.[dividerIdx] || {};
    return res.json({
      success: true,
      courseCode,
      sectionIndex,
      divider: {
        bannerImage: d.bannerImage || null,
        bannerAlt: d.bannerAlt || null,
        title: d.title || null,
        subtitle: d.subtitle || null,
      },
    });
  } catch (err) {
    console.error('[course-presentation] section error:', err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
