/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */

/**
 * adminOrgs — Staff troubleshooting surface for organizations.
 *
 * Mounted at /api/admin/orgs. Accessible to role 'admin' (platform owner) AND
 * role 'support' (support staff). Support staff get READ + FIX access to any
 * org's roster (view members, change seat roles/status, manage invites) but
 * NOT org settings/billing, and NOT the rest of the admin dashboard.
 *
 * Every mutation is audit-logged via logActivity with who did what to which
 * org, since this is an override path that bypasses org membership.
 *
 * Roster building is shared with the partner-facing /api/orgs routes via
 * services/orgRosterService.js — one implementation, two surfaces.
 */
import express from 'express';
import crypto from 'crypto';
import Organization from '../models/Organization.js';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';
import { buildOrgRoster } from '../services/orgRosterService.js';
import { logActivity } from '../services/activityTrackingService.js';

const router = express.Router();
router.use(protect);

// Staff = platform admin or support
const requireStaff = (req, res, next) => {
  if (req.user.role !== 'admin' && req.user.role !== 'support') {
    return res.status(403).json({ error: 'Staff access required' });
  }
  next();
};
router.use(requireStaff);

function staffName(user) {
  const p = user?.profile || {};
  return `${p.firstName || ''} ${p.lastName || ''}`.trim() || user?.email || 'Staff';
}

// ── List / search organizations ──────────────────────────────────────────────
// GET /api/admin/orgs?q=searchterm&page=1&limit=25
// Searches org name, slug, billing email, and seat emails.
router.get('/', async (req, res) => {
  try {
    const q = (req.query.q || '').trim();
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 25));

    const filter = q ? {
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { slug: { $regex: q, $options: 'i' } },
        { billingEmail: { $regex: q, $options: 'i' } },
        { 'seats.email': { $regex: q, $options: 'i' } }
      ]
    } : {};

    const [orgs, total] = await Promise.all([
      Organization.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .select('name slug type plan maxSeats billingEmail ownerId seats.status settings.segment createdAt')
        .lean(),
      Organization.countDocuments(filter)
    ]);

    const results = orgs.map(o => ({
      _id: o._id,
      name: o.name,
      slug: o.slug,
      type: o.type,
      plan: o.plan,
      segment: o.settings?.segment,
      billingEmail: o.billingEmail,
      maxSeats: o.maxSeats,
      activeSeats: (o.seats || []).filter(s => s.status === 'active' || s.status === 'invited').length,
      createdAt: o.createdAt
    }));

    res.json({ organizations: results, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    console.error('Staff org search error:', error);
    res.status(500).json({ error: 'Failed to search organizations' });
  }
});

// ── Org detail + full roster (read) ──────────────────────────────────────────
router.get('/:orgId', async (req, res) => {
  try {
    const org = await Organization.findById(req.params.orgId);
    if (!org) return res.status(404).json({ error: 'Organization not found' });

    const roster = await buildOrgRoster(org);
    // Include owner info + billing email for troubleshooting context (read-only)
    const owner = await User.findById(org.ownerId).select('email profile').lean();
    res.json({
      ...roster,
      organization: {
        ...roster.organization,
        type: org.type,
        plan: org.plan,
        billingEmail: org.billingEmail,
        createdAt: org.createdAt,
        owner: owner ? { _id: owner._id, email: owner.email, name: `${owner.profile?.firstName || ''} ${owner.profile?.lastName || ''}`.trim() } : null
      }
    });
  } catch (error) {
    console.error('Staff org detail error:', error);
    res.status(500).json({ error: 'Failed to load organization' });
  }
});

// ── Update a seat (role / status / title) — audit-logged ─────────────────────
router.patch('/:orgId/members/:seatId', async (req, res) => {
  try {
    const org = await Organization.findById(req.params.orgId);
    if (!org) return res.status(404).json({ error: 'Organization not found' });

    const seat = org.seats.id(req.params.seatId);
    if (!seat) return res.status(404).json({ error: 'Member not found' });
    if (seat.role === 'owner' && req.body.role && req.body.role !== 'owner') {
      return res.status(400).json({ error: 'Cannot change the owner role' });
    }

    const before = { role: seat.role, status: seat.status, title: seat.title };
    const { role, status, title } = req.body;
    if (role) seat.role = role;
    if (title !== undefined) seat.title = title;
    if (status) {
      seat.status = status;
      if (status === 'offboarded') seat.offboardedAt = new Date();
    }
    await org.save();

    await logActivity('staff.org_member_updated', {
      orgId: org._id,
      orgName: org.name,
      seatId: seat._id,
      memberEmail: seat.email,
      before,
      after: { role: seat.role, status: seat.status, title: seat.title },
      staffRole: req.user.role
    }, { userId: req.user._id, userName: staffName(req.user), userEmail: req.user.email, notifyAdmin: req.user.role === 'support' });

    res.json({ message: 'Member updated', member: seat });
  } catch (error) {
    console.error('Staff member update error:', error);
    res.status(500).json({ error: 'Failed to update member' });
  }
});

// ── Create an invite on behalf of the org — audit-logged ─────────────────────
router.post('/:orgId/invites', async (req, res) => {
  try {
    const org = await Organization.findById(req.params.orgId);
    if (!org) return res.status(404).json({ error: 'Organization not found' });

    const { email, role, title } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });
    if (!org.canAddSeat()) {
      return res.status(400).json({ error: `Seat limit reached (${org.maxSeats}).` });
    }

    const lower = email.toLowerCase();
    const existing = org.seats.find(s => s.email === lower && !['removed', 'offboarded'].includes(s.status));
    if (existing) return res.status(400).json({ error: 'This email is already a member or has a pending invite' });

    const existingUser = await User.findOne({ email: lower });
    const inviteToken = crypto.randomBytes(24).toString('hex');
    org.seats.push({
      userId: existingUser?._id || null,
      email: lower,
      role: role || 'member',
      title: title || '',
      status: 'invited',
      inviteToken,
      hireDate: new Date()
    });
    await org.save();

    await logActivity('staff.org_member_invited', {
      orgId: org._id,
      orgName: org.name,
      email: lower,
      role: role || 'member',
      staffRole: req.user.role
    }, { userId: req.user._id, userName: staffName(req.user), userEmail: req.user.email, notifyAdmin: req.user.role === 'support' });

    res.status(201).json({ message: 'Invite created', inviteToken });
  } catch (error) {
    console.error('Staff invite error:', error);
    res.status(500).json({ error: 'Failed to create invite' });
  }
});

// ── Regenerate an invite token (resend flow) — audit-logged ──────────────────
router.post('/:orgId/invites/:seatId/regenerate', async (req, res) => {
  try {
    const org = await Organization.findById(req.params.orgId);
    if (!org) return res.status(404).json({ error: 'Organization not found' });

    const seat = org.seats.id(req.params.seatId);
    if (!seat) return res.status(404).json({ error: 'Member not found' });
    if (seat.status !== 'invited') {
      return res.status(400).json({ error: 'This member is not in an invited state' });
    }

    seat.inviteToken = crypto.randomBytes(24).toString('hex');
    seat.invitedAt = new Date();
    await org.save();

    await logActivity('staff.org_invite_regenerated', {
      orgId: org._id,
      orgName: org.name,
      email: seat.email,
      staffRole: req.user.role
    }, { userId: req.user._id, userName: staffName(req.user), userEmail: req.user.email, notifyAdmin: req.user.role === 'support' });

    res.json({ message: 'Invite token regenerated', inviteToken: seat.inviteToken });
  } catch (error) {
    console.error('Staff invite regenerate error:', error);
    res.status(500).json({ error: 'Failed to regenerate invite' });
  }
});

export default router;
