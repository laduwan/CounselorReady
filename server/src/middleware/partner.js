/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import Partner from '../models/Partner.js';

/**
 * Attach partner info to the request if available.
 * Detection order:
 *   1. X-Partner-Slug header (set by partner-hosted frontends)
 *   2. ?partner=<slug> query parameter
 *   3. User's partnerId (from DB, if authenticated)
 *
 * Result: req.partner = Partner doc | null
 */
export async function detectPartner(req, res, next) {
  try {
    const slug = req.headers['x-partner-slug'] || req.query.partner;

    if (slug) {
      const partner = await Partner.findOne({ slug: slug.toLowerCase(), active: true })
        .select('-createdBy -__v')
        .lean();
      req.partner = partner || null;
    } else if (req.user?.partnerId) {
      const partner = await Partner.findOne({ _id: req.user.partnerId, active: true })
        .select('-createdBy -__v')
        .lean();
      req.partner = partner || null;
    } else {
      req.partner = null;
    }
  } catch {
    req.partner = null;
  }

  next();
}
