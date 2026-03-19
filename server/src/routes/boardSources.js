/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import express from 'express';
import BoardSource from '../models/BoardSource.js';
import BoardAlert from '../models/BoardAlert.js';
import { protect, requireAdmin } from '../middleware/auth.js';
import { runBoardMonitorCycle } from '../services/boardMonitorService.js';

const router = express.Router();

// All routes require admin
router.use(protect, requireAdmin);

// ── List all monitored sources ──
router.get('/', async (req, res) => {
  try {
    const sources = await BoardSource.find().sort({ state: 1, boardName: 1 });
    res.json(sources);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Add a new source to monitor ──
router.post('/', async (req, res) => {
  try {
    const source = await BoardSource.create({
      ...req.body,
      createdBy: req.user._id
    });
    res.status(201).json(source);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Update a source ──
router.put('/:id', async (req, res) => {
  try {
    const source = await BoardSource.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!source) return res.status(404).json({ error: 'Source not found' });
    res.json(source);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Delete a source ──
router.delete('/:id', async (req, res) => {
  try {
    await BoardSource.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Manually trigger a check for a specific source ──
router.post('/:id/check', async (req, res) => {
  try {
    const source = await BoardSource.findById(req.params.id);
    if (!source) return res.status(404).json({ error: 'Source not found' });

    // Import checkSource dynamically to avoid circular deps
    const { default: BoardSourceModel } = await import('../models/BoardSource.js');

    // Reset lastCheckedAt so the cycle picks it up immediately
    source.lastCheckedAt = null;
    await source.save();

    // Run the full cycle (will pick up this source since lastCheckedAt is null)
    await runBoardMonitorCycle();

    // Reload to get updated state
    const updated = await BoardSource.findById(req.params.id);
    res.json({ message: 'Check completed', source: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Trigger a full monitoring cycle ──
router.post('/check-all', async (req, res) => {
  try {
    // Reset all lastCheckedAt to force immediate check
    await BoardSource.updateMany({ isActive: true }, { $set: { lastCheckedAt: null } });
    await runBoardMonitorCycle();
    res.json({ message: 'Full monitoring cycle completed' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Get draft (unpublished) alerts for review ──
router.get('/drafts', async (req, res) => {
  try {
    const drafts = await BoardAlert.find({ isPublished: false }).sort({ createdAt: -1 });
    res.json(drafts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Publish a draft alert (approve it) ──
router.post('/drafts/:id/publish', async (req, res) => {
  try {
    const alert = await BoardAlert.findById(req.params.id);
    if (!alert) return res.status(404).json({ error: 'Alert not found' });

    // Allow admin to edit before publishing
    if (req.body.title) alert.title = req.body.title;
    if (req.body.summary) alert.summary = req.body.summary;
    if (req.body.details !== undefined) alert.details = req.body.details;
    if (req.body.category) alert.category = req.body.category;
    if (req.body.severity) alert.severity = req.body.severity;
    if (req.body.effectiveDate) alert.effectiveDate = req.body.effectiveDate;

    alert.isPublished = true;
    alert.createdBy = req.user._id;
    await alert.save();

    res.json(alert);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Discard a draft alert ──
router.delete('/drafts/:id', async (req, res) => {
  try {
    const alert = await BoardAlert.findOneAndDelete({ _id: req.params.id, isPublished: false });
    if (!alert) return res.status(404).json({ error: 'Draft not found' });
    res.json({ message: 'Draft discarded' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
