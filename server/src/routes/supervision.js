/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import express from 'express';
import SupervisionLog from '../models/SupervisionLog.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

// ── Create a new supervision log ──
router.post('/', protect, validate({
  body: {
    'supervisor.name': 'string',
    licenseType: 'string',
    state: 'string',
    totalHoursRequired: 'number',
    startDate: 'date'
  }
}), async (req, res) => {
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

// ── Get all supervision logs for current user (with pagination & search) ──
router.get('/', protect, async (req, res) => {
  try {
    const { page = 1, limit = 20, status, state, search } = req.query;
    const query = { userId: req.user._id };

    if (status && ['in_progress', 'completed', 'on_hold'].includes(status)) {
      query.status = status;
    }
    if (state) {
      query.state = state.toUpperCase();
    }
    if (search) {
      query['supervisor.name'] = { $regex: search, $options: 'i' };
    }

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(50, Math.max(1, Number(limit)));

    const [logs, total] = await Promise.all([
      SupervisionLog.find(query)
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      SupervisionLog.countDocuments(query)
    ]);

    res.json({ logs, total, page: pageNum, totalPages: Math.ceil(total / limitNum) });
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
router.post('/:id/sessions', protect, validate({
  body: { date: 'date', hours: 'number', type: 'string' }
}), async (req, res) => {
  try {
    const log = await SupervisionLog.findOne({ _id: req.params.id, userId: req.user._id });
    if (!log) return res.status(404).json({ error: 'Supervision log not found' });

    const { hours, type } = req.body;
    if (hours < 0.25 || hours > 8) {
      return res.status(400).json({ error: 'Hours must be between 0.25 and 8' });
    }
    const validTypes = ['individual', 'group', 'live_observation', 'review_of_recordings', 'triadic'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ error: `Type must be one of: ${validTypes.join(', ')}` });
    }

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
