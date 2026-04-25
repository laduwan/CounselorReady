// server/src/routes/remediation.js
// =========================================================================
// Adaptive Remediation — HTTP endpoints
// =========================================================================
// POST /api/remediation/infer/:courseId      → run AI inference on one course
// POST /api/remediation/infer-by-slug/:slug  → same, looked up by slug
// GET  /api/remediation/preview/:courseId    → dry-run (preview without save)
//
// All endpoints require admin authentication.
// =========================================================================

import express from 'express';
import {
  inferRemediationForCourse,
  inferRemediationBySlug,
} from '../services/remediationInference.js';

const router = express.Router();

// ──────────────────────────────────────────────────────────────────────────
// Auth middleware — adjust imports to match your existing middleware paths
// ──────────────────────────────────────────────────────────────────────────
// If your auth middleware lives elsewhere, update these two imports.
import { protect as requireAuth } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/auth.js';

// ──────────────────────────────────────────────────────────────────────────
// POST /api/remediation/infer/:courseId
// Body: { overwriteAI?: boolean, dryRun?: boolean }
// ──────────────────────────────────────────────────────────────────────────
router.post('/infer/:courseId', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { courseId } = req.params;
    const { overwriteAI = false, dryRun = false } = req.body || {};

    const result = await inferRemediationForCourse(courseId, {
      overwriteAI: !!overwriteAI,
      dryRun: !!dryRun,
      verbose: false,
    });

    res.json({ success: true, ...result });
  } catch (err) {
    console.error('[remediation] infer failed:', err);
    const status = /not found/i.test(err.message) ? 404
      : /ANTHROPIC_API_KEY/.test(err.message) ? 500
      : 500;
    res.status(status).json({ success: false, error: err.message });
  }
});

// ──────────────────────────────────────────────────────────────────────────
// POST /api/remediation/infer-by-slug/:slug
// Body: { overwriteAI?: boolean, dryRun?: boolean }
// ──────────────────────────────────────────────────────────────────────────
router.post('/infer-by-slug/:slug', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { slug } = req.params;
    const { overwriteAI = false, dryRun = false } = req.body || {};

    const result = await inferRemediationBySlug(slug, {
      overwriteAI: !!overwriteAI,
      dryRun: !!dryRun,
      verbose: false,
    });

    res.json({ success: true, ...result });
  } catch (err) {
    console.error('[remediation] infer-by-slug failed:', err);
    const status = /not found/i.test(err.message) ? 404 : 500;
    res.status(status).json({ success: false, error: err.message });
  }
});

// ──────────────────────────────────────────────────────────────────────────
// GET /api/remediation/preview/:courseId
// Convenience dry-run: shows what WOULD change without writing.
// ──────────────────────────────────────────────────────────────────────────
router.get('/preview/:courseId', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { courseId } = req.params;
    const overwriteAI = req.query.overwriteAI === 'true';

    const result = await inferRemediationForCourse(courseId, {
      overwriteAI,
      dryRun: true,
      verbose: false,
    });

    res.json({ success: true, ...result });
  } catch (err) {
    console.error('[remediation] preview failed:', err);
    const status = /not found/i.test(err.message) ? 404 : 500;
    res.status(status).json({ success: false, error: err.message });
  }
});

export default router;
