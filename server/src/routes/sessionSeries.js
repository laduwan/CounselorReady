/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 */

import express from 'express';
import SessionSeries from '../models/SessionSeries.js';
import LiveSession from '../models/LiveSession.js';
import { protect, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

/* ═════════════════ ADMIN CRUD ═════════════════ */

// GET /api/session-series — list all (admin)
router.get('/', protect, requireAdmin, async (req, res) => {
  try {
    const series = await SessionSeries.find({}).sort({ createdAt: -1 });
    res.json({ series });
  } catch (err) {
    console.error('[series] list:', err.message);
    res.status(500).json({ error: 'Failed to load series' });
  }
});

// GET /api/session-series/public/upcoming — series with ≥1 upcoming required session
router.get('/public/upcoming', async (req, res) => {
  try {
    const now = new Date();
    const list = await SessionSeries.find({
      isPublished: true,
      visibility: { $ne: 'private' }
    }).sort({ createdAt: -1 });

    // Attach member session summary so the catalog card can show dates
    const enriched = await Promise.all(list.map(async series => {
      const members = await LiveSession.find({ seriesId: series._id, isPublished: true })
        .sort({ 'seriesMembership.order': 1 })
        .select('_id title scheduledStart scheduledEnd seriesMembership status');
      const hasUpcoming = members.some(m => m.scheduledStart > now && m.status !== 'cancelled');
      return { series, members, hasUpcoming };
    }));

    res.json({
      series: enriched.filter(e => e.hasUpcoming).map(e => ({ ...e.series.toObject(), members: e.members }))
    });
  } catch (err) {
    console.error('[series] public upcoming:', err.message);
    res.status(500).json({ error: 'Failed to load series' });
  }
});

// GET /api/session-series/:id — one series with its member sessions (admin)
router.get('/:id', protect, requireAdmin, async (req, res) => {
  try {
    const series = await SessionSeries.findById(req.params.id);
    if (!series) return res.status(404).json({ error: 'Series not found' });

    const members = await LiveSession.find({ seriesId: series._id })
      .sort({ 'seriesMembership.order': 1 })
      .select('_id title status scheduledStart scheduledEnd ceuHours seriesMembership isPublished');

    res.json({ series, members });
  } catch (err) {
    console.error('[series] get:', err.message);
    res.status(500).json({ error: 'Failed to load series' });
  }
});

// POST /api/session-series — create (admin)
router.post('/', protect, requireAdmin, async (req, res) => {
  try {
    const series = await SessionSeries.create(req.body);
    res.json({ series });
  } catch (err) {
    console.error('[series] create:', err.message);
    res.status(400).json({ error: err.message });
  }
});

// PATCH /api/session-series/:id — edit (admin)
router.patch('/:id', protect, requireAdmin, async (req, res) => {
  try {
    const series = await SessionSeries.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!series) return res.status(404).json({ error: 'Series not found' });
    res.json({ series });
  } catch (err) {
    console.error('[series] update:', err.message);
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/session-series/:id — remove (admin). Unlinks member sessions
// (sets their seriesId to null) rather than deleting them, since they may
// still have real registrants / attendance history.
router.delete('/:id', protect, requireAdmin, async (req, res) => {
  try {
    const series = await SessionSeries.findById(req.params.id);
    if (!series) return res.status(404).json({ error: 'Series not found' });

    await LiveSession.updateMany(
      { seriesId: series._id },
      { $set: { seriesId: null } }
    );
    await series.deleteOne();
    res.json({ ok: true });
  } catch (err) {
    console.error('[series] delete:', err.message);
    res.status(500).json({ error: 'Failed to delete series' });
  }
});

/* ═════════════════ PUBLIC / ATTENDEE ═════════════════ */

// POST /api/session-series/:id/register — auto-enroll in member sessions
router.post('/:id/register', protect, async (req, res) => {
  try {
    const series = await SessionSeries.findById(req.params.id);
    if (!series) return res.status(404).json({ error: 'Series not found' });
    if (!series.isPublished) return res.status(404).json({ error: 'Series not found' });

    let candidateSessions;
    if (series.autoEnroll === 'all') {
      candidateSessions = await LiveSession.find({ seriesId: series._id });
    } else if (series.autoEnroll === 'all-required') {
      candidateSessions = await LiveSession.find({
        seriesId: series._id,
        'seriesMembership.required': { $ne: false }
      });
    } else {
      // 'manual' — attendees pick individually via the normal /live-sessions/:id/register
      return res.status(400).json({
        error: 'This series requires per-session registration.',
        autoEnroll: 'manual'
      });
    }

    const enrolled = [];
    const failed = [];
    for (const sess of candidateSessions) {
      try {
        const already = sess.registrants.some(
          r => r.user && r.user.toString() === req.user._id.toString()
        );
        if (already) {
          enrolled.push({ sessionId: sess._id, status: 'already-registered' });
          continue;
        }
        // Simplified: no capacity check here (the per-session /register does
        // the full check, we defer complex Stripe-checkout flows to that path).
        // Series members are expected to be $0 VIP-inclusive; per-session
        // pricing on a series member is an unusual configuration.
        sess.registrants.push({ user: req.user._id, registeredAt: new Date() });
        await sess.save();
        enrolled.push({ sessionId: sess._id, status: 'registered' });
      } catch (err) {
        failed.push({ sessionId: sess._id, error: err.message });
      }
    }

    res.json({ enrolled, failed, seriesTitle: series.title });
  } catch (err) {
    console.error('[series] register:', err.message);
    res.status(500).json({ error: 'Failed to register for series' });
  }
});

export default router;
