/**
 * adminAudit.js — /api/admin/audit
 * Runs the 4 ACEP quality rules against live interactivecourses collection.
 * Results are cached in-memory for 1 hour to avoid hammering MongoDB.
 */
import express from 'express';
import mongoose from 'mongoose';
import { protect, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

const MIN_WPCE = Number(process.env.MIN_WPCE || 5820);
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

let cache = null;
let cacheAt = 0;

function auditCourse(course) {
  const sectionsLen = Array.isArray(course.sections) ? course.sections.length : 0;
  const modulesLen  = Array.isArray(course.modules)  ? course.modules.length  : 0;
  const wc  = Number(course.wordCount || 0);
  const ce  = Number(course.ceHours   || 0);
  const floor = Math.floor(ce * MIN_WPCE);

  const fails = [];
  if (!ce || ce <= 0)
    fails.push({ rule: 'R4-ceHours', detail: `ceHours=${course.ceHours}` });
  if (!wc || wc <= 0)
    fails.push({ rule: 'R1-wordCount-missing', detail: `wordCount=${course.wordCount}` });
  if (ce > 0 && wc > 0 && wc < floor)
    fails.push({ rule: 'R2-wordCount-below-floor', detail: `${wc} < ${ce}×${MIN_WPCE}=${floor}` });
  if (sectionsLen + modulesLen === 0)
    fails.push({ rule: 'R3-no-content', detail: 'sections=0 AND modules=0' });

  return {
    _id: course._id,
    slug: course.slug || `(no-slug:${course._id})`,
    title: course.title || '(untitled)',
    courseCode: course.courseCode || '',
    status: course.status || 'unknown',
    ceHours: ce,
    wordCount: wc,
    pass: fails.length === 0,
    fails
  };
}

// GET /api/admin/audit
router.get('/', protect, requireAdmin, async (req, res) => {
  const force = req.query.refresh === '1';

  // Return cache if fresh
  if (!force && cache && Date.now() - cacheAt < CACHE_TTL) {
    return res.json({ data: cache, cached: true, cachedAt: new Date(cacheAt).toISOString() });
  }

  try {
    const db = mongoose.connection.db;
    const courses = await db.collection('interactivecourses')
      .find({}, { projection: { slug: 1, title: 1, courseCode: 1, status: 1, ceHours: 1, wordCount: 1, sections: 1, modules: 1 } })
      .toArray();

    const results = courses.map(auditCourse);
    const failures = results.filter(r => !r.pass);
    const byRule = {};
    failures.forEach(r => r.fails.forEach(f => {
      byRule[f.rule] = (byRule[f.rule] || 0) + 1;
    }));

    const summary = {
      total: results.length,
      passing: results.filter(r => r.pass).length,
      failing: failures.length,
      byRule,
      minWpce: MIN_WPCE,
      runAt: new Date().toISOString()
    };

    cache = { summary, failures, passing: results.filter(r => r.pass) };
    cacheAt = Date.now();

    res.json({ data: cache, cached: false, cachedAt: new Date(cacheAt).toISOString() });
  } catch (error) {
    console.error('Audit error:', error);
    res.status(500).json({ error: 'Audit failed', detail: error.message });
  }
});

export default router;
