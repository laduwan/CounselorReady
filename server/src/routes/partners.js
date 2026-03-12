/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import express from 'express';
import mongoose from 'mongoose';
import Partner from '../models/Partner.js';
import User from '../models/User.js';
import { protect, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// ── Public: look up partner by slug ──
router.get('/slug/:slug', async (req, res) => {
  try {
    const partner = await Partner.findOne({
      slug: req.params.slug.toLowerCase(),
      active: true
    }).select('-createdBy -__v');

    if (!partner) {
      return res.status(404).json({ error: 'Partner not found' });
    }

    res.json({ partner });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Admin: list all partners ──
router.get('/', protect, requireAdmin, async (req, res) => {
  try {
    const partners = await Partner.find()
      .sort({ createdAt: -1 })
      .populate('createdBy', 'email profile.firstName profile.lastName');

    const counts = await User.aggregate([
      { $match: { partnerId: { $exists: true, $ne: null } } },
      { $group: { _id: '$partnerId', count: { $sum: 1 } } }
    ]);
    const countMap = Object.fromEntries(counts.map(c => [c._id.toString(), c.count]));

    const results = partners.map(p => ({
      ...p.toObject(),
      userCount: countMap[p._id.toString()] || 0
    }));

    res.json({ partners: results });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Admin: get single partner ──
router.get('/:id', protect, requireAdmin, async (req, res) => {
  try {
    const partner = await Partner.findById(req.params.id)
      .populate('createdBy', 'email profile.firstName profile.lastName');

    if (!partner) {
      return res.status(404).json({ error: 'Partner not found' });
    }

    const userCount = await User.countDocuments({ partnerId: partner._id });
    res.json({ partner: { ...partner.toObject(), userCount } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Admin: create partner ──
router.post('/', protect, requireAdmin, async (req, res) => {
  try {
    const { name, slug, branding, contact, defaultPlan } = req.body;

    if (!name || !slug) {
      return res.status(400).json({ error: 'Name and slug are required' });
    }

    const existing = await Partner.findOne({ slug: slug.toLowerCase() });
    if (existing) {
      return res.status(400).json({ error: 'A partner with this slug already exists' });
    }

    const partner = await Partner.create({
      name,
      slug: slug.toLowerCase(),
      branding: branding || {},
      contact: contact || {},
      defaultPlan: defaultPlan || 'free',
      createdBy: req.user._id
    });

    res.status(201).json({ partner });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Admin: update partner ──
router.put('/:id', protect, requireAdmin, async (req, res) => {
  try {
    const { name, slug, branding, contact, defaultPlan, active } = req.body;

    const partner = await Partner.findById(req.params.id);
    if (!partner) {
      return res.status(404).json({ error: 'Partner not found' });
    }

    // Check slug uniqueness if changing
    if (slug && slug.toLowerCase() !== partner.slug) {
      const existing = await Partner.findOne({ slug: slug.toLowerCase() });
      if (existing) {
        return res.status(400).json({ error: 'A partner with this slug already exists' });
      }
    }

    if (name !== undefined) partner.name = name;
    if (slug !== undefined) partner.slug = slug.toLowerCase();
    if (branding !== undefined) partner.branding = { ...partner.branding.toObject?.() || partner.branding, ...branding };
    if (contact !== undefined) partner.contact = { ...partner.contact.toObject?.() || partner.contact, ...contact };
    if (defaultPlan !== undefined) partner.defaultPlan = defaultPlan;
    if (active !== undefined) partner.active = active;

    await partner.save();
    res.json({ partner });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Admin: list users for a partner ──
router.get('/:id/users', protect, requireAdmin, async (req, res) => {
  try {
    const users = await User.find({ partnerId: req.params.id })
      .select('email profile.firstName profile.lastName subscription.plan subscription.status createdAt')
      .sort({ createdAt: -1 })
      .lean();

    res.json({ users, total: users.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Admin: partner-scoped analytics ──
router.get('/:id/stats', protect, requireAdmin, async (req, res) => {
  try {
    const partnerId = new mongoose.Types.ObjectId(req.params.id);
    const db = mongoose.connection.db;

    // Get all user IDs for this partner
    const partnerUsers = await User.find({ partnerId }).select('_id').lean();
    const userIds = partnerUsers.map(u => u._id);

    const totalUsers = userIds.length;

    // Active users (logged in within last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const activeUsers = await User.countDocuments({
      partnerId,
      lastLoginAt: { $gte: thirtyDaysAgo }
    });

    // Course completions from both progress collections
    let coursesCompleted = 0;
    let ceHoursEarned = 0;

    if (userIds.length > 0) {
      const [regularCompletions, interactiveCompletions] = await Promise.all([
        db.collection('usercourseprogresses').aggregate([
          { $match: { userId: { $in: userIds }, completed: true } },
          { $group: { _id: null, count: { $sum: 1 }, hours: { $sum: { $ifNull: ['$ceHours', 0] } } } }
        ]).toArray(),
        db.collection('interactivecourseprogresses').aggregate([
          { $match: { userId: { $in: userIds }, completed: true } },
          { $group: { _id: null, count: { $sum: 1 }, hours: { $sum: { $ifNull: ['$ceHours', 0] } } } }
        ]).toArray()
      ]);

      coursesCompleted = (regularCompletions[0]?.count || 0) + (interactiveCompletions[0]?.count || 0);
      ceHoursEarned = (regularCompletions[0]?.hours || 0) + (interactiveCompletions[0]?.hours || 0);
    }

    res.json({ totalUsers, activeUsers, coursesCompleted, ceHoursEarned });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Admin: delete partner ──
router.delete('/:id', protect, requireAdmin, async (req, res) => {
  try {
    const partner = await Partner.findById(req.params.id);
    if (!partner) {
      return res.status(404).json({ error: 'Partner not found' });
    }

    // Unlink users from this partner
    await User.updateMany({ partnerId: partner._id }, { $unset: { partnerId: 1 } });
    await partner.deleteOne();

    res.json({ message: 'Partner deleted and users unlinked' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
