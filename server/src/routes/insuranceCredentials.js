/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import express from 'express';
import InsuranceCredential from '../models/InsuranceCredential.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.use(protect);

// ── Get all insurance credentials for current user ──
router.get('/', async (req, res) => {
  try {
    const credentials = await InsuranceCredential.find({ userId: req.user._id })
      .sort({ updatedAt: -1 });
    res.json(credentials);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Get single insurance credential ──
router.get('/:id', async (req, res) => {
  try {
    const cred = await InsuranceCredential.findOne({ _id: req.params.id, userId: req.user._id });
    if (!cred) return res.status(404).json({ error: 'Not found' });
    res.json(cred);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Create insurance credential ──
router.post('/', async (req, res) => {
  try {
    const data = {
      userId: req.user._id,
      ...req.body
    };

    // Add initial status history entry
    if (data.applicationStatus) {
      data.statusHistory = [{ status: data.applicationStatus, notes: 'Created' }];
    }

    const cred = await InsuranceCredential.create(data);
    res.status(201).json(cred);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Update insurance credential ──
router.put('/:id', async (req, res) => {
  try {
    const cred = await InsuranceCredential.findOne({ _id: req.params.id, userId: req.user._id });
    if (!cred) return res.status(404).json({ error: 'Not found' });

    const oldStatus = cred.applicationStatus;

    const allowed = [
      'insuranceCompany', 'panelType', 'applicationDate', 'applicationStatus',
      'providerNumber', 'effectiveDate', 'recredentialingDate', 'caqhId',
      'caqhAttestationDate', 'documentsChecklist', 'contactName', 'contactPhone',
      'contactEmail', 'portalUrl', 'nextFollowUpDate', 'notes'
    ];
    for (const key of allowed) {
      if (req.body[key] !== undefined) cred[key] = req.body[key];
    }

    // Track status changes
    if (req.body.applicationStatus && req.body.applicationStatus !== oldStatus) {
      cred.statusHistory.push({
        status: req.body.applicationStatus,
        notes: req.body.statusNote || ''
      });
    }

    await cred.save();
    res.json(cred);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Delete insurance credential ──
router.delete('/:id', async (req, res) => {
  try {
    const result = await InsuranceCredential.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!result) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Toggle checklist item ──
router.patch('/:id/checklist/:itemIndex', async (req, res) => {
  try {
    const cred = await InsuranceCredential.findOne({ _id: req.params.id, userId: req.user._id });
    if (!cred) return res.status(404).json({ error: 'Not found' });

    const idx = parseInt(req.params.itemIndex);
    if (idx < 0 || idx >= cred.documentsChecklist.length) {
      return res.status(400).json({ error: 'Invalid checklist item index' });
    }

    cred.documentsChecklist[idx].uploaded = !cred.documentsChecklist[idx].uploaded;
    cred.documentsChecklist[idx].uploadedAt = cred.documentsChecklist[idx].uploaded ? new Date() : null;
    await cred.save();
    res.json(cred);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Get summary stats ──
router.get('/summary/stats', async (req, res) => {
  try {
    const credentials = await InsuranceCredential.find({ userId: req.user._id });

    const stats = {
      total: credentials.length,
      approved: credentials.filter(c => c.applicationStatus === 'approved').length,
      pending: credentials.filter(c => ['submitted', 'under_review', 'gathering_docs'].includes(c.applicationStatus)).length,
      denied: credentials.filter(c => c.applicationStatus === 'denied').length,
      needsFollowUp: credentials.filter(c => c.nextFollowUpDate && c.nextFollowUpDate <= new Date()).length,
      recredentialingSoon: credentials.filter(c => {
        if (!c.recredentialingDate) return false;
        const days = Math.ceil((c.recredentialingDate - Date.now()) / (1000 * 60 * 60 * 24));
        return days > 0 && days <= 90;
      }).length
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
