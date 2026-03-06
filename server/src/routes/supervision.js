/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import express from 'express';
import SupervisionLog from '../models/SupervisionLog.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// ── Create a new supervision log ──
router.post('/', protect, async (req, res) => {
  try {
    const log = await SupervisionLog.create({
      userId: req.user._id,
      ...req.body
    });
    res.status(201).json(log);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Get all supervision logs for current user ──
router.get('/', protect, async (req, res) => {
  try {
    const logs = await SupervisionLog.find({ userId: req.user._id })
      .sort({ createdAt: -1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Get a specific log ──
router.get('/:id', protect, async (req, res) => {
  try {
    const log = await SupervisionLog.findOne({ _id: req.params.id, userId: req.user._id });
    if (!log) return res.status(404).json({ error: 'Supervision log not found' });
    res.json(log);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Update supervisor info or plan details ──
router.put('/:id', protect, async (req, res) => {
  try {
    const log = await SupervisionLog.findOne({ _id: req.params.id, userId: req.user._id });
    if (!log) return res.status(404).json({ error: 'Supervision log not found' });

    const allowed = ['supervisor', 'licenseType', 'state', 'totalHoursRequired', 'targetCompletionDate', 'requirements', 'status'];
    for (const key of allowed) {
      if (req.body[key] !== undefined) log[key] = req.body[key];
    }

    if (req.body.status === 'completed') {
      log.completedAt = new Date();
    }

    await log.save();
    res.json(log);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Add a supervision session ──
router.post('/:id/sessions', protect, async (req, res) => {
  try {
    const log = await SupervisionLog.findOne({ _id: req.params.id, userId: req.user._id });
    if (!log) return res.status(404).json({ error: 'Supervision log not found' });

    log.sessions.push(req.body);
    await log.save();

    res.status(201).json(log);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Update a session ──
router.put('/:id/sessions/:sessionId', protect, async (req, res) => {
  try {
    const log = await SupervisionLog.findOne({ _id: req.params.id, userId: req.user._id });
    if (!log) return res.status(404).json({ error: 'Supervision log not found' });

    const session = log.sessions.id(req.params.sessionId);
    if (!session) return res.status(404).json({ error: 'Session not found' });

    Object.assign(session, req.body);
    await log.save();
    res.json(log);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Delete a session ──
router.delete('/:id/sessions/:sessionId', protect, async (req, res) => {
  try {
    const log = await SupervisionLog.findOne({ _id: req.params.id, userId: req.user._id });
    if (!log) return res.status(404).json({ error: 'Supervision log not found' });

    log.sessions.pull({ _id: req.params.sessionId });
    await log.save();
    res.json(log);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Get progress summary ──
router.get('/:id/summary', protect, async (req, res) => {
  try {
    const log = await SupervisionLog.findOne({ _id: req.params.id, userId: req.user._id });
    if (!log) return res.status(404).json({ error: 'Supervision log not found' });

    const totalHours = log.totalLoggedHours;
    const individualHours = log.individualHours;
    const groupHours = log.groupHours;

    res.json({
      supervisor: log.supervisor.name,
      licenseType: log.licenseType,
      state: log.state,
      totalRequired: log.totalHoursRequired,
      totalLogged: totalHours,
      remaining: Math.max(0, log.totalHoursRequired - totalHours),
      progressPercent: log.progressPercent,
      breakdown: {
        individual: individualHours,
        group: groupHours,
        other: totalHours - individualHours - groupHours
      },
      sessionCount: log.sessions.length,
      status: log.status
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Delete a supervision log ──
router.delete('/:id', protect, async (req, res) => {
  try {
    const log = await SupervisionLog.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!log) return res.status(404).json({ error: 'Supervision log not found' });
    res.json({ message: 'Supervision log deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
