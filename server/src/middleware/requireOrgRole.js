/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */

/**
 * requireOrgRole(...roles) — Practice Compliance org-membership authorization.
 *
 * Layers ON TOP OF the existing `protect` auth middleware (which sets req.user).
 * It does NOT modify or replace any existing auth middleware. It loads the
 * Organization seat (membership) for (req.user, :orgId) and enforces role.
 *
 * Attaches:
 *   req.org        — the Organization document
 *   req.membership — the matching seat subdocument (the membership)
 *   req.orgRole    — the member's role string
 *
 * Usage:
 *   router.get('/:orgId/members', protect, requireOrgRole('owner','admin','manager'), handler)
 *   router.get('/:orgId',         protect, requireOrgRole(),                          handler) // any active member
 *
 * The org owner is always authorized regardless of the requested role list.
 */
import Organization from '../models/Organization.js';

// Roles that can administer an org (manage members, tracks, assignments, policies).
export const ORG_ADMIN_ROLES = ['owner', 'admin', 'manager'];

export function requireOrgRole(...roles) {
  return async (req, res, next) => {
    try {
      const orgId = req.params.orgId || req.params.id;
      if (!orgId) {
        return res.status(400).json({ error: 'Organization id required' });
      }
      if (!req.user) {
        return res.status(401).json({ error: 'Not authorized' });
      }

      const org = await Organization.findById(orgId);
      if (!org) {
        return res.status(404).json({ error: 'Organization not found' });
      }

      // Platform admins may access any org (parity with existing admin patterns).
      const isPlatformAdmin = req.user.role === 'admin';

      const seat = org.seats.find(
        s => s.userId && s.userId.equals(req.user._id) && s.status === 'active'
      );

      if (!seat && !isPlatformAdmin) {
        return res.status(403).json({ error: 'Not a member of this organization' });
      }

      const effectiveRole = seat ? seat.role : 'admin';
      const isOwner = org.ownerId.equals(req.user._id) || effectiveRole === 'owner';

      // No specific roles requested ⇒ any active member (or platform admin) passes.
      if (roles.length > 0 && !isOwner && !isPlatformAdmin && !roles.includes(effectiveRole)) {
        return res.status(403).json({
          error: 'Insufficient organization role for this action',
          required: roles
        });
      }

      req.org = org;
      req.membership = seat || null;
      req.orgRole = effectiveRole;
      next();
    } catch (error) {
      console.error('requireOrgRole error:', error);
      res.status(500).json({ error: error.message });
    }
  };
}

export default requireOrgRole;
