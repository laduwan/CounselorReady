/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import express from 'express';
import rateLimit from 'express-rate-limit';
import GroupLicense from '../models/GroupLicense.js';
import User from '../models/User.js';
import UserCourseProgress from '../models/UserCourseProgress.js';
import { protect, requireAdmin } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

// Rate-limit invitations (20 per 15 min per IP)
const inviteLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many invite requests, please try again later' }
});

// ── Create a group license ──
router.post('/', protect, validate({
  body: { organizationName: 'string', totalSeats: 'number' }
}), async (req, res) => {
  try {
    const { organizationName, totalSeats, plan, billingCycle, contactEmail } = req.body;

    const license = await GroupLicense.create({
      organizationName,
      adminUserId: req.user._id,
      contactEmail: contactEmail || req.user.email,
      totalSeats: Math.max(5, totalSeats),
      plan: plan || 'team',
      billingCycle: billingCycle || 'annual'
    });

    res.status(201).json(license);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Admin: list all group licenses (with pagination) ──
router.get('/admin/all', protect, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 25, search } = req.query;
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(100, Math.max(1, Number(limit)));

    const query = {};
    if (search) {
      query.organizationName = { $regex: search, $options: 'i' };
    }

    const [licenses, total] = await Promise.all([
      GroupLicense.find(query)
        .populate('adminUserId', 'email profile.firstName profile.lastName')
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      GroupLicense.countDocuments(query)
    ]);

    res.json({ licenses, total, page: pageNum, totalPages: Math.ceil(total / limitNum) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Get my group license(s) ──
router.get('/my', protect, async (req, res) => {
  try {
    const licenses = await GroupLicense.find({ adminUserId: req.user._id })
      .populate('seats.userId', 'email profile.firstName profile.lastName')
      .populate('assignedCourses.courseId', 'title slug');
    res.json(licenses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Get a specific group license ──
router.get('/:id', protect, async (req, res) => {
  try {
    const license = await GroupLicense.findOne({
      _id: req.params.id,
      $or: [
        { adminUserId: req.user._id },
        { 'seats.userId': req.user._id }
      ]
    })
      .populate('seats.userId', 'email profile.firstName profile.lastName')
      .populate('assignedCourses.courseId', 'title slug ceHours');
    if (!license) return res.status(404).json({ error: 'License not found' });
    res.json(license);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Invite members (add seats) ──
router.post('/:id/invite', protect, inviteLimiter, validate({
  body: { emails: 'array' }
}), async (req, res) => {
  try {
    const license = await GroupLicense.findOne({ _id: req.params.id, adminUserId: req.user._id });
    if (!license) return res.status(404).json({ error: 'License not found' });

    const { emails } = req.body;
    if (emails.length === 0) {
      return res.status(400).json({ error: 'Provide at least one email' });
    }
    if (emails.length > 50) {
      return res.status(400).json({ error: 'Maximum 50 invitations at once' });
    }

    // Validate all emails
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const invalidEmails = emails.filter(e => !emailRegex.test(String(e).trim()));
    if (invalidEmails.length > 0) {
      return res.status(400).json({ error: `Invalid email(s): ${invalidEmails.join(', ')}` });
    }

    const available = license.totalSeats - license.seats.filter(s => s.status !== 'revoked').length;
    if (emails.length > available) {
      return res.status(400).json({ error: `Only ${available} seats available` });
    }

    const added = [];
    for (const email of emails) {
      const normalized = email.toLowerCase().trim();
      const existing = license.seats.find(s => s.email === normalized && s.status !== 'revoked');
      if (existing) continue;

      // Check if user already exists
      const existingUser = await User.findOne({ email: normalized });
      license.seats.push({
        email: normalized,
        userId: existingUser?._id,
        status: existingUser ? 'active' : 'invited'
      });
      added.push(normalized);
    }

    await license.save();
    res.json({ added, totalSeats: license.totalSeats, usedSeats: license.usedSeats });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Revoke a seat ──
router.delete('/:id/seats/:seatId', protect, async (req, res) => {
  try {
    const license = await GroupLicense.findOne({ _id: req.params.id, adminUserId: req.user._id });
    if (!license) return res.status(404).json({ error: 'License not found' });

    const seat = license.seats.id(req.params.seatId);
    if (!seat) return res.status(404).json({ error: 'Seat not found' });

    seat.status = 'revoked';
    await license.save();
    res.json({ message: 'Seat revoked', usedSeats: license.usedSeats });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Assign courses to the group ──
router.post('/:id/assign-courses', protect, validate({
  body: { courseIds: 'array' }
}), async (req, res) => {
  try {
    const license = await GroupLicense.findOne({ _id: req.params.id, adminUserId: req.user._id });
    if (!license) return res.status(404).json({ error: 'License not found' });

    const { courseIds, dueDate, mandatory } = req.body;
    if (courseIds.length === 0) {
      return res.status(400).json({ error: 'Provide at least one course ID' });
    }

    for (const courseId of courseIds) {
      const alreadyAssigned = license.assignedCourses.find(
        a => a.courseId.toString() === courseId
      );
      if (!alreadyAssigned) {
        license.assignedCourses.push({ courseId, dueDate, mandatory: mandatory || false });
      }
    }

    await license.save();
    res.json(license.assignedCourses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Compliance dashboard: track member progress on assigned courses ──
router.get('/:id/compliance', protect, async (req, res) => {
  try {
    const license = await GroupLicense.findOne({ _id: req.params.id, adminUserId: req.user._id })
      .populate('assignedCourses.courseId', 'title ceHours');
    if (!license) return res.status(404).json({ error: 'License not found' });

    const { search } = req.query;
    let activeMembers = license.seats.filter(s => s.status === 'active' && s.userId);

    if (search) {
      const s = search.toLowerCase();
      activeMembers = activeMembers.filter(m => m.email?.toLowerCase().includes(s));
    }

    const userIds = activeMembers.map(s => s.userId);
    const courseIds = license.assignedCourses.map(a => a.courseId?._id || a.courseId);

    const progress = await UserCourseProgress.find({
      userId: { $in: userIds },
      courseId: { $in: courseIds }
    });

    const report = activeMembers.map(member => {
      const memberProgress = courseIds.map(cid => {
        const p = progress.find(
          pr => pr.userId.equals(member.userId) && pr.courseId.equals(cid)
        );
        return {
          courseId: cid,
          completed: p?.completed || false,
          progressPercent: p?.progressPercent || 0,
          completedAt: p?.completedAt
        };
      });
      return {
        userId: member.userId,
        email: member.email,
        courses: memberProgress,
        overallCompliance: memberProgress.filter(c => c.completed).length / (courseIds.length || 1) * 100
      };
    });

    res.json({
      organizationName: license.organizationName,
      totalMembers: activeMembers.length,
      assignedCourses: license.assignedCourses,
      memberProgress: report
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
