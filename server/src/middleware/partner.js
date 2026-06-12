/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import Partner from '../models/Partner.js';

// Main domain — requests from this host are NOT partner-branded
const PRIMARY_DOMAIN = process.env.PRIMARY_DOMAIN || 'counselorready.com';

/**
 * Attach partner info to the request if available.
 * Detection order:
 *   1. X-Partner-Slug header (set by partner-hosted frontends)
 *   2. ?partner=<slug> query parameter
 *   3. Subdomain detection (e.g. therapy-solutions.counselorready.com → slug "therapy-solutions")
 *   4. Custom domain lookup (partner sets CNAME to your app; matched via branding.customDomain)
 *   5. User's partnerId (from DB, if authenticated)
 *
 * Result: req.partner = Partner doc | null
 */
export async function detectPartner(req, res, next) {
  try {
    // 1 & 2: Explicit header or query param
    let slug = req.headers['x-partner-slug'] || req.query.partner;

    // 3 & 4: Host-based detection (subdomain or custom domain)
    if (!slug) {
      const host = (req.headers['x-forwarded-host'] || req.headers.host || '').split(':')[0].toLowerCase();

      if (host && host !== PRIMARY_DOMAIN && host !== `www.${PRIMARY_DOMAIN}`) {
        // Check if it's a subdomain of the primary domain
        if (host.endsWith(`.${PRIMARY_DOMAIN}`)) {
          const sub = host.replace(`.${PRIMARY_DOMAIN}`, '');
          // Match the personalized vanity subdomain first, then fall back to the slug.
          const partner = await Partner.findOne({
            active: true,
            $or: [{ 'branding.subdomain': sub }, { slug: sub }]
          }).select('-createdBy -__v').lean();
          if (partner) { req.partner = partner; return next(); }
          slug = sub;
        } else {
          // Custom domain — look up partner by domain field
          const partner = await Partner.findOne({
            'branding.customDomain': host,
            active: true
          }).select('-createdBy -__v').lean();

          if (partner) {
            req.partner = partner;
            return next();
          }
        }
      }
    }

    // Resolve slug → partner
    if (slug) {
      const partner = await Partner.findOne({ slug: slug.toLowerCase(), active: true })
        .select('-createdBy -__v')
        .lean();
      req.partner = partner || null;
    } else if (req.user?.partnerId) {
      // 5: Fall back to authenticated user's partner association
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
