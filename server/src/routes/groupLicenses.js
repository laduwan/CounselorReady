/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import express from 'express';
import GroupLicense from '../models/GroupLicense.js';
import User from '../models/User.js';
import UserCourseProgress from '../models/UserCourseProgress.js';
import { protect, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// ── Create a group license ──
router.post('/', protect, async (req, res) => {
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
router.post('/:id/invite', protect, async (req, res) => {
  try {
    const license = await GroupLicense.findOne({ _id: req.params.id, adminUserId: req.user._id });
    if (!license) return res.status(404).json({ error: 'License not found' });

    const { emails } = req.body; // array of email strings
    if (!Array.isArray(emails) || emails.length === 0) {
      return res.status(400).json({ error: 'Provide an array of emails' });
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
router.post('/:id/assign-courses', protect, async (req, res) => {
  try {
    const license = await GroupLicense.findOne({ _id: req.params.id, adminUserId: req.user._id });
    if (!license) return res.status(404).json({ error: 'License not found' });

    const { courseIds, dueDate, mandatory } = req.body;
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

    const activeMembers = license.seats.filter(s => s.status === 'active' && s.userId);
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

// ── Admin: list all group licenses ──
router.get('/admin/all', protect, requireAdmin, async (req, res) => {
  try {
    const licenses = await GroupLicense.find()
      .populate('adminUserId', 'email profile.firstName profile.lastName')
      .sort({ createdAt: -1 });
    res.json(licenses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
