/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import express from 'express';
import BoardAlert from '../models/BoardAlert.js';
import UserCredential from '../models/UserCredential.js';
import { protect, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// ── Get alerts relevant to current user (based on their state/credentials) ──
router.get('/', protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const userState = req.user.profile?.state;

    // Get user's credential types
    const credentials = await UserCredential.find({ userId }).select('state code credentialType');
    const userStates = [...new Set([userState, ...credentials.map(c => c.state)].filter(Boolean))];
    const userCredTypes = [...new Set(credentials.map(c => c.code).filter(Boolean))];

    // Find alerts for user's states
    const query = { isPublished: true };
    if (userStates.length > 0) {
      query.state = { $in: userStates };
    }

    const alerts = await BoardAlert.find(query).sort({ createdAt: -1 }).limit(50);

    // Mark which ones are acknowledged
    const enriched = alerts.map(a => ({
      ...a.toObject(),
      acknowledged: a.acknowledgedBy.some(id => id.equals(userId)),
      relevantToUser: userCredTypes.length === 0 || a.credentialTypes.length === 0 ||
        a.credentialTypes.some(ct => userCredTypes.includes(ct))
    }));

    res.json(enriched);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Acknowledge an alert ──
router.post('/:id/acknowledge', protect, async (req, res) => {
  try {
    const alert = await BoardAlert.findById(req.params.id);
    if (!alert) return res.status(404).json({ error: 'Alert not found' });

    if (!alert.acknowledgedBy.includes(req.user._id)) {
      alert.acknowledgedBy.push(req.user._id);
      await alert.save();
    }

    res.json({ message: 'Alert acknowledged' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Get unacknowledged alert count ──
router.get('/unread/count', protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const userState = req.user.profile?.state;

    const credentials = await UserCredential.find({ userId }).select('state');
    const userStates = [...new Set([userState, ...credentials.map(c => c.state)].filter(Boolean))];

    const query = { isPublished: true, acknowledgedBy: { $ne: userId } };
    if (userStates.length > 0) query.state = { $in: userStates };

    const count = await BoardAlert.countDocuments(query);
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ══════════════════════════════════════════
// ADMIN ROUTES
// ══════════════════════════════════════════

// ── Create alert (admin) ──
router.post('/', protect, requireAdmin, async (req, res) => {
  try {
    const alert = await BoardAlert.create({
      ...req.body,
      createdBy: req.user._id
    });
    res.status(201).json(alert);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Update alert (admin) — tracks changes for side-by-side comparison ──
router.put('/:id', protect, requireAdmin, async (req, res) => {
  try {
    const alert = await BoardAlert.findById(req.params.id);
    if (!alert) return res.status(404).json({ error: 'Alert not found' });

    // Fields we track for change history
    const trackedFields = ['title', 'summary', 'details', 'category', 'severity', 'effectiveDate', 'sourceUrl', 'credentialTypes'];
    const changedFields = {};
    let hasTrackedChange = false;

    for (const field of trackedFields) {
      if (req.body[field] !== undefined) {
        const oldVal = field === 'credentialTypes'
          ? JSON.stringify(alert[field])
          : String(alert[field] ?? '');
        const newVal = field === 'credentialTypes'
          ? JSON.stringify(req.body[field])
          : String(req.body[field] ?? '');
        if (oldVal !== newVal) {
          changedFields[field] = alert[field];
          hasTrackedChange = true;
        }
      }
    }

    // If tracked content changed, snapshot the previous values
    if (hasTrackedChange) {
      alert.changeHistory = alert.changeHistory || [];
      alert.changeHistory.push({
        amendedAt: new Date(),
        amendedBy: req.user._id,
        changeNote: req.body.changeNote || undefined,
        previousValues: changedFields
      });

      // Reset acknowledgements so users see the updated rule
      alert.acknowledgedBy = [];
    }

    // Apply the updates
    const { changeNote, ...updateFields } = req.body;
    Object.assign(alert, updateFields);
    await alert.save();

    res.json(alert);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Delete alert (admin) ──
router.delete('/:id', protect, requireAdmin, async (req, res) => {
  try {
    await BoardAlert.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Get all alerts (admin view, all states) ──
router.get('/admin/all', protect, requireAdmin, async (req, res) => {
  try {
    const alerts = await BoardAlert.find().sort({ createdAt: -1 });
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
