/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import express from 'express';
import Organization from '../models/Organization.js';
import User from '../models/User.js';
import UserCredential from '../models/UserCredential.js';
import UserCourseProgress from '../models/UserCourseProgress.js';
import Certificate from '../models/Certificate.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes require auth
router.use(protect);

// ── Create organization ──
router.post('/', async (req, res) => {
  try {
    const { name, type, address, phone, website, npiNumber, billingEmail } = req.body;

    const org = await Organization.create({
      name,
      type,
      address,
      phone,
      website,
      npiNumber,
      billingEmail: billingEmail || req.user.email,
      ownerId: req.user._id,
      seats: [{
        userId: req.user._id,
        email: req.user.email,
        role: 'owner',
        joinedAt: new Date(),
        status: 'active'
      }]
    });

    res.status(201).json(org);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Get my organizations ──
router.get('/mine', async (req, res) => {
  try {
    const orgs = await Organization.find({
      $or: [
        { ownerId: req.user._id },
        { 'seats.userId': req.user._id, 'seats.status': 'active' }
      ]
    });
    res.json(orgs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Get organization by ID ──
router.get('/:id', async (req, res) => {
  try {
    const org = await Organization.findById(req.params.id);
    if (!org) return res.status(404).json({ error: 'Organization not found' });

    // Check membership
    const isMember = org.ownerId.equals(req.user._id) ||
      org.seats.some(s => s.userId?.equals(req.user._id) && s.status === 'active');
    if (!isMember) return res.status(403).json({ error: 'Not a member of this organization' });

    res.json(org);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Update organization ──
router.put('/:id', async (req, res) => {
  try {
    const org = await Organization.findById(req.params.id);
    if (!org) return res.status(404).json({ error: 'Organization not found' });

    // Only owner/manager can update
    const seat = org.seats.find(s => s.userId?.equals(req.user._id));
    if (!org.ownerId.equals(req.user._id) && (!seat || seat.role === 'member')) {
      return res.status(403).json({ error: 'Only owners and managers can update the organization' });
    }

    const allowed = ['name', 'type', 'address', 'phone', 'website', 'npiNumber', 'billingEmail'];
    for (const key of allowed) {
      if (req.body[key] !== undefined) org[key] = req.body[key];
    }
    if (req.body.settings !== undefined) {
      org.settings = { ...(org.settings?.toObject?.() ?? org.settings ?? {}), ...req.body.settings };
    }
    await org.save();
    res.json(org);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Invite member ──
router.post('/:id/invite', async (req, res) => {
  try {
    const org = await Organization.findById(req.params.id);
    if (!org) return res.status(404).json({ error: 'Organization not found' });

    const seat = org.seats.find(s => s.userId?.equals(req.user._id));
    if (!org.ownerId.equals(req.user._id) && (!seat || seat.role === 'member')) {
      return res.status(403).json({ error: 'Only owners and managers can invite members' });
    }

    if (!org.canAddSeat()) {
      return res.status(400).json({ error: `Seat limit reached (${org.maxSeats}). Upgrade your plan to add more.` });
    }

    const { email, role } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    // Check if already invited
    const existing = org.seats.find(s => s.email === email.toLowerCase() && s.status !== 'removed');
    if (existing) return res.status(400).json({ error: 'This email is already a member or has been invited' });

    // Check if user exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });

    org.seats.push({
      userId: existingUser?._id || null,
      email: email.toLowerCase(),
      role: role || 'member',
      status: existingUser ? 'active' : 'invited'
    });

    await org.save();
    res.json({ message: 'Member invited successfully', org });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Remove member ──
router.delete('/:id/members/:seatId', async (req, res) => {
  try {
    const org = await Organization.findById(req.params.id);
    if (!org) return res.status(404).json({ error: 'Organization not found' });

    const mySeat = org.seats.find(s => s.userId?.equals(req.user._id));
    if (!org.ownerId.equals(req.user._id) && (!mySeat || mySeat.role === 'member')) {
      return res.status(403).json({ error: 'Only owners and managers can remove members' });
    }

    const seat = org.seats.id(req.params.seatId);
    if (!seat) return res.status(404).json({ error: 'Seat not found' });
    if (seat.role === 'owner') return res.status(400).json({ error: 'Cannot remove the owner' });

    seat.status = 'removed';
    await org.save();
    res.json({ message: 'Member removed', org });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Organization dashboard / compliance overview ──
router.get('/:id/dashboard', async (req, res) => {
  try {
    const org = await Organization.findById(req.params.id);
    if (!org) return res.status(404).json({ error: 'Organization not found' });

    const isMember = org.ownerId.equals(req.user._id) ||
      org.seats.some(s => s.userId?.equals(req.user._id) && s.status === 'active');
    if (!isMember) return res.status(403).json({ error: 'Not authorized' });

    // Get all active member user IDs
    const memberIds = org.seats
      .filter(s => s.status === 'active' && s.userId)
      .map(s => s.userId);

    // Fetch compliance data for all members
    const [credentials, progress, certificates, members] = await Promise.all([
      UserCredential.find({ userId: { $in: memberIds } }),
      UserCourseProgress.find({ userId: { $in: memberIds } }),
      Certificate.find({ userId: { $in: memberIds } }),
      User.find({ _id: { $in: memberIds } }).select('profile email subscription')
    ]);

    // Build per-member summary
    const memberSummaries = members.map(member => {
      const memberCreds = credentials.filter(c => c.userId.equals(member._id));
      const memberProgress = progress.filter(p => p.userId.equals(member._id));
      const memberCerts = certificates.filter(c => c.userId.equals(member._id));

      const expiringCreds = memberCreds.filter(c => {
        const days = c.daysUntilExpiration;
        return days !== null && days <= 90 && days > 0;
      });
      const expiredCreds = memberCreds.filter(c => {
        const days = c.daysUntilExpiration;
        return days !== null && days <= 0;
      });

      return {
        userId: member._id,
        name: `${member.profile.firstName} ${member.profile.lastName || ''}`.trim(),
        email: member.email,
        state: member.profile.state,
        totalCredentials: memberCreds.length,
        expiringCredentials: expiringCreds.length,
        expiredCredentials: expiredCreds.length,
        coursesCompleted: memberProgress.filter(p => p.completed).length,
        coursesInProgress: memberProgress.filter(p => !p.completed).length,
        totalCEHours: memberCerts.reduce((sum, c) => sum + (c.ceHours || 0), 0),
        complianceStatus: expiredCreds.length > 0 ? 'non_compliant' : expiringCreds.length > 0 ? 'at_risk' : 'compliant'
      };
    });

    // Aggregate stats
    const stats = {
      totalMembers: memberIds.length,
      compliant: memberSummaries.filter(m => m.complianceStatus === 'compliant').length,
      atRisk: memberSummaries.filter(m => m.complianceStatus === 'at_risk').length,
      nonCompliant: memberSummaries.filter(m => m.complianceStatus === 'non_compliant').length,
      totalCEHoursEarned: memberSummaries.reduce((sum, m) => sum + m.totalCEHours, 0),
      totalCoursesCompleted: memberSummaries.reduce((sum, m) => sum + m.coursesCompleted, 0)
    };

    res.json({ organization: org, stats, members: memberSummaries });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
