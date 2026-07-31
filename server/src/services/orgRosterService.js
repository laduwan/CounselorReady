/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */

/**
 * orgRosterService — single source of truth for building an org's member
 * roster + compliance rollup. Extracted from orgRoutes.js GET /:orgId/members
 * so the partner-facing routes (/api/orgs) and the staff troubleshooting
 * routes (/api/admin/orgs) share ONE implementation. Logic is unchanged.
 */
import Assignment from '../models/Assignment.js';
import OrgCredential from '../models/OrgCredential.js';
import User from '../models/User.js';

/**
 * Build the roster + rollup for an Organization document.
 * Returns { organization, rollup, members } — the exact shape previously
 * returned inline by GET /api/orgs/:orgId/members.
 */
export async function buildOrgRoster(org) {
  const seats = org.seats.filter(s => !['removed', 'offboarded'].includes(s.status));
  const userIds = seats.filter(s => s.userId).map(s => s.userId);

  const [assignments, credentials, users] = await Promise.all([
    Assignment.find({ orgId: org._id }).lean(),
    OrgCredential.find({ orgId: org._id }).lean(),
    User.find({ _id: { $in: userIds } }).select('profile email').lean()
  ]);
  const userById = new Map(users.map(u => [String(u._id), u]));

  const members = seats.map(seat => {
    const uid = seat.userId ? String(seat.userId) : null;
    const u = uid ? userById.get(uid) : null;
    const aRows = assignments.filter(a => uid && String(a.userId) === uid);
    const cRows = credentials.filter(c => String(c.seatId) === String(seat._id) || (uid && String(c.userId) === uid));
    const overdue = aRows.filter(a => a.status === 'overdue').length;
    const completed = aRows.filter(a => a.status === 'completed' || a.status === 'waived').length;
    const recoupmentRisk = aRows.some(a => a.recoupmentRisk);
    const expiredCreds = cRows.filter(c => c.expiresAt && new Date(c.expiresAt) < new Date()).length;
    const expiringCreds = cRows.filter(c => {
      if (!c.expiresAt) return false;
      const days = Math.ceil((new Date(c.expiresAt) - Date.now()) / 86400000);
      return days > 0 && days <= 30;
    }).length;
    const annualHours = aRows.filter(a => a.status === 'completed').reduce((s, a) => s + (a.creditedHours || a.hours || 0), 0);
    const status = (overdue > 0 || expiredCreds > 0) ? 'non_compliant'
      : (aRows.length > completed || expiringCreds > 0) ? 'at_risk' : 'compliant';
    return {
      seatId: seat._id,
      userId: seat.userId || null,
      name: u ? `${u.profile.firstName} ${u.profile.lastName || ''}`.trim() : seat.email,
      email: seat.email,
      role: seat.role,
      employmentType: seat.employmentType,
      title: seat.title,
      seatStatus: seat.status,
      directContactCleared: seat.directContactCleared,
      totalAssignments: aRows.length,
      completed,
      overdue,
      credentials: cRows.length,
      expiringCredentials: expiringCreds,
      expiredCredentials: expiredCreds,
      annualHours,
      recoupmentRisk,
      status
    };
  });

  const rollup = {
    totalMembers: members.length,
    compliant: members.filter(m => m.status === 'compliant').length,
    atRisk: members.filter(m => m.status === 'at_risk').length,
    nonCompliant: members.filter(m => m.status === 'non_compliant').length,
    recoupmentExposure: members.filter(m => m.recoupmentRisk).length
  };

  return {
    organization: { _id: org._id, name: org.name, settings: org.settings, maxSeats: org.maxSeats },
    rollup,
    members
  };
}

export default buildOrgRoster;
