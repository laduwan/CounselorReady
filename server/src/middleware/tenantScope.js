/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */

/**
 * Tenant-scoping middleware for partner data isolation.
 *
 * When a partner context exists (req.partner or req.user.partnerId),
 * this middleware attaches a `req.tenantFilter` object that route handlers
 * can merge into their queries to ensure results are scoped to the partner.
 *
 * Usage in route handlers:
 *   const courses = await InteractiveCourse.find({ ...req.tenantFilter, status: 'published' });
 *
 * For platform admins (role === 'admin'), tenantFilter is empty (no restriction).
 */
export function attachTenantScope(req, res, next) {
  // Platform admins see everything
  if (req.user?.role === 'admin') {
    req.tenantFilter = {};
    req.tenantUserFilter = {};
    req.tenantPartnerId = null;
    return next();
  }

  // Determine partner context
  const partnerId = req.partnerId || req.user?.partnerId || req.partner?._id;

  if (partnerId) {
    req.tenantFilter = { partnerId };
    req.tenantUserFilter = { partnerId };
    req.tenantPartnerId = partnerId;
  } else {
    // No partner context — platform-level courses (partnerId is null/undefined)
    req.tenantFilter = {};
    req.tenantUserFilter = {};
    req.tenantPartnerId = null;
  }

  next();
}

/**
 * Strict tenant enforcement — blocks access if no partner context found.
 * Use for endpoints that MUST be partner-scoped.
 */
export function requireTenantScope(req, res, next) {
  // Platform admins bypass
  if (req.user?.role === 'admin') return next();

  const partnerId = req.partnerId || req.user?.partnerId || req.partner?._id;
  if (!partnerId) {
    return res.status(403).json({
      error: 'Partner context required',
      code: 'TENANT_REQUIRED',
      detail: 'This endpoint requires a partner context. Ensure you are associated with a partner organization.'
    });
  }

  next();
}
