// Admin Course Presentation routes
// ----------------------------------
// Lets admins set/clear the presentation layer of a course from the browser:
//   - course-level header (hero) image + alt + title + subtitle
//   - per-section banner image + alt, and section header title/subtitle
//
// Courses are identified by Mongo _id (the codebase convention; falls back to
// slug). Writes use collection('interactivecourses').updateOne $set/$unset on
// exact paths. Course-level header fields are declared on CourseSchema so they
// read cleanly via the model.
//
// Mounted at /api/admin/course-presentation (BEFORE the /api/admin catch-all).
// Endpoints:
//   PATCH /:id/header
//   PATCH /:id/section/:sectionIndex

import express from 'express';
import mongoose from 'mongoose';
import { protect, requireAdmin } from '../middleware/auth.js';

const router = express.Router();
const COLLECTION = 'interactivecourses';

const isClear = (v) => v === null || v === '';

// Resolve a course by _id (preferred) or slug. Returns { query, course } or null.
async function resolveCourse(col, id) {
  let course = null;
  let query = null;
  if (mongoose.Types.ObjectId.isValid(id)) {
    query = { _id: new mongoose.Types.ObjectId(id) };
    course = await col.findOne(query);
  }
  if (!course) {
    query = { slug: id };
    course = await col.findOne(query);
  }
  return course ? { query, course } : null;
}

// ─── Course-level header (hero) ────────────────────────────────────────────
// PATCH /api/admin/course-presentation/:id/header
// Body (any subset): { headerImage, headerImageAlt, headerTitle, headerSubtitle }
router.patch('/:id/header', protect, requireAdmin, async (req, res) => {
  try {
    const col = mongoose.connection.db.collection(COLLECTION);
    const found = await resolveCourse(col, req.params.id);
    if (!found) return res.status(404).json({ success: false, error: `Course not found (id="${req.params.id}").` });

    const FIELDS = ['headerImage', 'headerImageAlt', 'headerTitle', 'headerSubtitle'];
    const $set = {}, $unset = {};
    for (const f of FIELDS) {
      if (!(f in req.body)) continue;
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

    const result = await col.updateOne(found.query, update);
    if (!result.matchedCount) return res.status(404).json({ success: false, error: 'Course matched 0 documents on update.' });

    const updated = await col.findOne(found.query, { projection: { headerImage: 1, headerImageAlt: 1, headerTitle: 1, headerSubtitle: 1 } });
    return res.json({
      success: true,
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
// PATCH /api/admin/course-presentation/:id/section/:sectionIndex   (0-based)
// Body (any subset): { bannerImage, bannerAlt, title, subtitle }
//   bannerImage null/"" → clears bannerImage + bannerAlt
router.patch('/:id/section/:sectionIndex', protect, requireAdmin, async (req, res) => {
  try {
    const sectionIndex = Number(req.params.sectionIndex);
    if (!Number.isInteger(sectionIndex) || sectionIndex < 0) {
      return res.status(400).json({ success: false, error: 'sectionIndex must be a non-negative integer (0-based).' });
    }

    const col = mongoose.connection.db.collection(COLLECTION);
    const found = await resolveCourse(col, req.params.id);
    if (!found) return res.status(404).json({ success: false, error: `Course not found (id="${req.params.id}").` });
    const course = found.course;

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
    const $set = {}, $unset = {};

    if ('bannerImage' in req.body) {
      if (isClear(req.body.bannerImage)) {
        $unset[`${base}.bannerImage`] = '';
        $unset[`${base}.bannerAlt`] = '';
      } else {
        $set[`${base}.bannerImage`] = String(req.body.bannerImage);
        if ('bannerAlt' in req.body && !isClear(req.body.bannerAlt)) $set[`${base}.bannerAlt`] = String(req.body.bannerAlt);
      }
    } else if ('bannerAlt' in req.body && !isClear(req.body.bannerAlt)) {
      $set[`${base}.bannerAlt`] = String(req.body.bannerAlt);
    }

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

    const result = await col.updateOne(found.query, update);
    if (!result.matchedCount) return res.status(404).json({ success: false, error: 'Course matched 0 documents on update.' });

    const fresh = await col.findOne(found.query, { projection: { sections: 1 } });
    const d = fresh.sections?.[sectionIndex]?.contentBlocks?.[dividerIdx] || {};
    return res.json({
      success: true,
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

// ─── Publish / unpublish an interactive course ──────────────────────────────
// PATCH /api/admin/course-presentation/:id/status   body: { publish: true|false }
// Sets status to 'published' or 'draft' (interactive courses have no isPublished
// field — status is the source of truth, enum: draft|published|archived).
router.patch('/:id/status', protect, requireAdmin, async (req, res) => {
  try {
    const publish = req.body && req.body.publish === true;
    const col = mongoose.connection.db.collection(COLLECTION);
    const found = await resolveCourse(col, req.params.id);
    if (!found) return res.status(404).json({ success: false, error: `Course not found (id="${req.params.id}").` });

    const update = {
      $set: {
        status: publish ? 'published' : 'draft',
        publishedAt: publish ? new Date() : null,
        updatedAt: new Date(),
      },
    };
    const result = await col.updateOne(found.query, update);
    if (!result.matchedCount) return res.status(404).json({ success: false, error: 'Course matched 0 documents on update.' });

    const updated = await col.findOne(found.query, { projection: { title: 1, slug: 1, status: 1, publishedAt: 1 } });
    return res.json({
      success: true,
      status: updated.status,
      publishedAt: updated.publishedAt || null,
      message: publish ? 'Course published' : 'Course unpublished',
    });
  } catch (err) {
    console.error('[course-presentation] status error:', err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
