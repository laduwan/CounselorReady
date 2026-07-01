/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of GA Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 *
 * routes/videoAudit.js
 *
 * Admin endpoints for the video link audit system.
 *
 * POST /api/admin/video-audit/run
 *   Triggers a full audit immediately. Returns results as JSON.
 *   Admin auth required. Runs in the background if ?background=true.
 *
 * GET  /api/admin/video-audit/history
 *   Returns the last N audit run summaries from videoauditlog.
 *   Query param: ?limit=10 (default 10, max 50)
 */

import express from 'express';
import mongoose from 'mongoose';
import { protect, requireAdmin } from '../middleware/auth.js';
import { runVideoLinkAudit } from '../jobs/videoLinkAuditJob.js';

const router = express.Router();
const adminOnly = [protect, requireAdmin];

// Track if an audit is already running to prevent overlapping runs
let auditRunning = false;

/**
 * POST /api/admin/video-audit/run
 * Trigger a full video link audit now.
 * ?background=true  → respond immediately, run in background
 */
router.post('/run', ...adminOnly, async (req, res) => {
  if (auditRunning) {
    return res.status(409).json({
      success: false,
      message: 'An audit is already in progress. Check /history for results when complete.'
    });
  }

  const background = req.query.background === 'true';

  if (background) {
    res.json({ success: true, message: 'Video audit started in background. Check /history for results.' });
    auditRunning = true;
    runVideoLinkAudit({ writeResults: true, verbose: true })
      .catch(e => console.error('[VideoAudit] Background run error:', e.message))
      .finally(() => { auditRunning = false; });
    return;
  }

  // Foreground — wait for results
  auditRunning = true;
  try {
    const results = await runVideoLinkAudit({ writeResults: true, verbose: false });
    res.json({ success: true, ...results });
  } catch (e) {
    console.error('[VideoAudit] Run error:', e.message);
    res.status(500).json({ success: false, message: e.message });
  } finally {
    auditRunning = false;
  }
});

/**
 * GET /api/admin/video-audit/history
 * Last N audit run summaries. ?limit=10
 */
router.get('/history', ...adminOnly, async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);
    const logs  = await mongoose.connection.db
      .collection('videoauditlog')
      .find({})
      .sort({ ranAt: -1 })
      .limit(limit)
      .toArray();
    res.json({ success: true, logs });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

/**
 * GET /api/admin/video-audit/status
 * Quick status — is an audit currently running?
 */
router.get('/status', ...adminOnly, (req, res) => {
  res.json({ success: true, running: auditRunning });
});

export default router;
