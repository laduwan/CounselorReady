/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */

/**
 * orgRoutes — Practice Compliance: org, roster, invites, tracks, assignments.
 *
 * NEW additive route file, mounted at /api/orgs. Does NOT replace the existing
 * /api/organizations routes (those remain untouched). Layers requireOrgRole on
 * top of the existing `protect` auth middleware.
 */
import express from 'express';
import crypto from 'crypto';
import Organization from '../models/Organization.js';
import User from '../models/User.js';
import TrainingTrack from '../models/TrainingTrack.js';
import Assignment from '../models/Assignment.js';
import OrgCredential from '../models/OrgCredential.js';
import { protect } from '../middleware/auth.js';
import { requireOrgRole, ORG_ADMIN_ROLES } from '../middleware/requireOrgRole.js';
import { buildAssignmentsForTrack } from '../services/complianceService.js';
import { suggestForStates } from '../data/stateMandates.js';
import { logActivity } from '../services/activityTrackingService.js';
import { buildOrgRoster } from '../services/orgRosterService.js';

const router = express.Router();
router.use(protect);

function displayName(user) {
  const p = user?.profile || {};
  return `${p.firstName || ''} ${p.lastName || ''}`.trim() || user?.email || 'Member';
}

// ── Create practice (creator becomes owner) ──────────────────────────────────
router.post('/', async (req, res) => {
  try {
    const { name, segment, statesOfOperation, timezone, alertEmails } = req.body;
    if (!name) return res.status(400).json({ error: 'Organization name is required' });

    const org = await Organization.create({
      name,
      ownerId: req.user._id,
      billingEmail: req.user.email,
      settings: {
        segment: segment === 'dbhdd_agency' ? 'dbhdd_agency' : 'private_practice',
        statesOfOperation: Array.isArray(statesOfOperation) ? statesOfOperation : [],
        timezone: timezone || 'America/New_York',
        alertEmails: Array.isArray(alertEmails) ? alertEmails : []
      },
      seats: [{
        userId: req.user._id,
        email: req.user.email,
        role: 'owner',
        status: 'active',
        joinedAt: new Date(),
        directContactCleared: true
      }]
    });

    await logActivity('org.created', { orgId: org._id, name: org.name, segment: org.settings.segment },
      { userId: req.user._id, userName: displayName(req.user), userEmail: req.user.email, notifyAdmin: true });

    res.status(201).json(org);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Org detail (any active member) ───────────────────────────────────────────
router.get('/:orgId', requireOrgRole(), async (req, res) => {
  res.json(req.org);
});

// ── Settings (owner / admin / manager) ───────────────────────────────────────
router.patch('/:orgId', requireOrgRole(...ORG_ADMIN_ROLES), async (req, res) => {
  try {
    const org = req.org;
    const { name } = req.body;
    if (name) org.name = name;
    const s = req.body.settings || {};
    if (s.segment) org.settings.segment = s.segment === 'dbhdd_agency' ? 'dbhdd_agency' : 'private_practice';
    if (Array.isArray(s.statesOfOperation)) org.settings.statesOfOperation = s.statesOfOperation;
    if (s.timezone) org.settings.timezone = s.timezone;
    if (Array.isArray(s.alertEmails)) org.settings.alertEmails = s.alertEmails;
    await org.save();
    res.json(org);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Invite a member by email (owner / admin / manager) ───────────────────────
router.post('/:orgId/invites', requireOrgRole(...ORG_ADMIN_ROLES), async (req, res) => {
  try {
    const org = req.org;
    const { email, role, employmentType, title } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });
    if (!org.canAddSeat()) {
      return res.status(400).json({ error: `Seat limit reached (${org.maxSeats}). Upgrade your plan to add seats.` });
    }
    const lower = email.toLowerCase();
    const existing = org.seats.find(s => s.email === lower && !['removed', 'offboarded'].includes(s.status));
    if (existing) return res.status(400).json({ error: 'This email is already a member or has a pending invite' });

    const existingUser = await User.findOne({ email: lower });
    const inviteToken = crypto.randomBytes(24).toString('hex');
    org.seats.push({
      userId: existingUser?._id || null,
      email: lower,
      role: role || 'clinician',
      employmentType: employmentType || null,
      title: title || '',
      status: 'invited',
      inviteToken,
      hireDate: new Date()
    });
    await org.save();

    await logActivity('org.member_invited', { orgId: org._id, email: lower, role: role || 'clinician' },
      { userId: req.user._id, userName: displayName(req.user), userEmail: req.user.email, notifyAdmin: false });

    res.status(201).json({ message: 'Invite created', inviteToken, org });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Accept an invite (any authenticated user) ────────────────────────────────
router.post('/invites/accept', async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ error: 'Invite token is required' });
    const org = await Organization.findOne({ 'seats.inviteToken': token });
    if (!org) return res.status(404).json({ error: 'Invite not found or already used' });
    const seat = org.seats.find(s => s.inviteToken === token);
    if (!seat) return res.status(404).json({ error: 'Invite not found' });

    seat.userId = req.user._id;
    seat.email = req.user.email.toLowerCase();
    seat.status = 'active';
    seat.joinedAt = new Date();
    seat.inviteToken = undefined;
    await org.save();
    res.json({ message: 'Invite accepted', org: { _id: org._id, name: org.name } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Roster + compliance rollup (any active member) ───────────────────────────
router.get('/:orgId/members', requireOrgRole(), async (req, res) => {
  try {
    const payload = await buildOrgRoster(req.org);
    res.json(payload);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Update a member (role / status / offboard) ───────────────────────────────
router.patch('/:orgId/members/:membershipId', requireOrgRole(...ORG_ADMIN_ROLES), async (req, res) => {
  try {
    const org = req.org;
    const seat = org.seats.id(req.params.membershipId);
    if (!seat) return res.status(404).json({ error: 'Member not found' });
    if (seat.role === 'owner' && req.body.role && req.body.role !== 'owner') {
      return res.status(400).json({ error: 'Cannot change the owner role' });
    }
    const { role, status, employmentType, title, directContactCleared } = req.body;
    if (role) seat.role = role;
    if (employmentType !== undefined) seat.employmentType = employmentType;
    if (title !== undefined) seat.title = title;
    if (typeof directContactCleared === 'boolean') seat.directContactCleared = directContactCleared;
    if (status) {
      seat.status = status;
      if (status === 'offboarded') seat.offboardedAt = new Date();
    }
    await org.save();
    res.json({ message: 'Member updated', member: seat });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Tracks: list (org tracks + applicable global templates) ──────────────────
router.get('/:orgId/tracks', requireOrgRole(), async (req, res) => {
  try {
    const segment = req.org.settings?.segment || 'private_practice';
    const tracks = await TrainingTrack.find({
      $or: [{ orgId: req.org._id }, { orgId: null, segment }]
    }).sort({ orgId: 1, name: 1 }).lean();
    res.json(tracks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Tracks: create (owner / admin / manager) ─────────────────────────────────
router.post('/:orgId/tracks', requireOrgRole(...ORG_ADMIN_ROLES), async (req, res) => {
  try {
    const { name, appliesToRoles, items, segment, manualVersion, annualHoursTarget, strHoursTarget } = req.body;
    if (!name) return res.status(400).json({ error: 'Track name is required' });
    const track = await TrainingTrack.create({
      orgId: req.org._id,
      name,
      segment: segment || req.org.settings?.segment || 'private_practice',
      appliesToRoles: appliesToRoles || [],
      items: items || [],
      manualVersion: manualVersion || null,
      annualHoursTarget: annualHoursTarget || 0,
      strHoursTarget: strHoursTarget || 0
    });
    res.status(201).json(track);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Tracks: update (owner / admin / manager) ─────────────────────────────────
router.patch('/:orgId/tracks/:trackId', requireOrgRole(...ORG_ADMIN_ROLES), async (req, res) => {
  try {
    const track = await TrainingTrack.findOne({ _id: req.params.trackId, orgId: req.org._id });
    if (!track) return res.status(404).json({ error: 'Track not found (global templates are read-only)' });
    const allowed = ['name', 'appliesToRoles', 'items', 'active', 'manualVersion', 'annualHoursTarget', 'strHoursTarget'];
    for (const k of allowed) if (req.body[k] !== undefined) track[k] = req.body[k];
    await track.save();
    res.json(track);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Bulk-assign a track to memberships (owner / admin / manager) ─────────────
router.post('/:orgId/tracks/:trackId/assign', requireOrgRole(...ORG_ADMIN_ROLES), async (req, res) => {
  try {
    const org = req.org;
    const track = await TrainingTrack.findOne({
      _id: req.params.trackId,
      $or: [{ orgId: org._id }, { orgId: null }]
    }).lean();
    if (!track) return res.status(404).json({ error: 'Track not found' });

    const { seatIds, roles } = req.body;
    let seats = org.seats.filter(s => s.status === 'active' && s.userId);
    if (Array.isArray(seatIds) && seatIds.length) {
      const set = new Set(seatIds.map(String));
      seats = seats.filter(s => set.has(String(s._id)));
    } else if (Array.isArray(roles) && roles.length) {
      seats = seats.filter(s => roles.includes(s.role));
    } else if (Array.isArray(track.appliesToRoles) && track.appliesToRoles.length && !track.appliesToRoles.includes('all')) {
      seats = seats.filter(s => track.appliesToRoles.includes(s.role));
    }
    if (!seats.length) return res.status(400).json({ error: 'No matching active members to assign' });

    const payloads = buildAssignmentsForTrack(org, track, seats);
    // Skip duplicates: an open assignment already exists for the same user + course code.
    const created = [];
    for (const p of payloads) {
      const dup = await Assignment.exists({
        orgId: org._id, userId: p.userId, courseCode: p.courseCode,
        status: { $in: ['assigned', 'in_progress', 'overdue'] }
      });
      if (dup) continue;
      created.push(await Assignment.create(p));
    }

    await logActivity('compliance.track_assigned', { orgId: org._id, trackId: track._id, trackName: track.name, count: created.length },
      { userId: req.user._id, userName: displayName(req.user), userEmail: req.user.email, notifyAdmin: false });

    res.status(201).json({ message: `Assigned ${created.length} item(s)`, created: created.length, skipped: payloads.length - created.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Assignments: filterable matrix feed ──────────────────────────────────────
router.get('/:orgId/assignments', requireOrgRole(), async (req, res) => {
  try {
    const filter = { orgId: req.org._id };
    if (req.query.status) filter.status = req.query.status;
    if (req.query.seatId) filter.seatId = req.query.seatId;
    // Non-admins only see their own assignments.
    if (!ORG_ADMIN_ROLES.includes(req.orgRole) && req.user.role !== 'admin') {
      filter.userId = req.user._id;
    } else if (req.query.userId) {
      filter.userId = req.query.userId;
    }
    const assignments = await Assignment.find(filter).sort({ dueDate: 1 }).lean();
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Assignments: waive / change due date (owner / admin / manager) ───────────
router.patch('/:orgId/assignments/:id', requireOrgRole(...ORG_ADMIN_ROLES), async (req, res) => {
  try {
    const a = await Assignment.findOne({ _id: req.params.id, orgId: req.org._id });
    if (!a) return res.status(404).json({ error: 'Assignment not found' });
    if (req.body.dueDate) a.dueDate = new Date(req.body.dueDate);
    if (req.body.waive === true) {
      a.status = 'waived';
      a.waivedBy = req.user._id;
      a.waivedReason = req.body.waivedReason || '';
      a.recoupmentRisk = false;
    }
    if (req.body.status && ['assigned', 'in_progress', 'completed', 'overdue', 'waived'].includes(req.body.status)) {
      a.status = req.body.status;
    }
    await a.save();
    res.json(a);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── State-mandate suggestions (§3.9) ─────────────────────────────────────────
router.get('/:orgId/suggestions', requireOrgRole(), async (req, res) => {
  try {
    const states = req.org.settings?.statesOfOperation || [];
    res.json(suggestForStates(states));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
