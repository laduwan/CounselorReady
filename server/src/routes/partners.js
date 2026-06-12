/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import express from 'express';
import mongoose from 'mongoose';
import crypto from 'crypto';
import dns from 'dns/promises';
import Stripe from 'stripe';
import { Resend } from 'resend';
import Partner from '../models/Partner.js';
import CommissionLedger from '../models/CommissionLedger.js';
import { MARKETPLACE_AGREEMENT } from '../config/marketplaceAgreement.js';
import { sendPartnerAgreementCopy } from '../services/partnerAgreementEmail.js';
import User from '../models/User.js';
import { Course as InteractiveCourse } from '../models/InteractiveCourse.js';
import { protect, requireAdmin, requirePartnerAdmin } from '../middleware/auth.js';
import { enforceCourseQuota, enforceUserQuota, enforceCustomDomainFeature, enforceBulkUploadFeature, getPartnerUsage } from '../middleware/quotaEnforcement.js';
import { PARTNER_PLANS, getPlanLimits } from '../utils/planLimits.js';

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;
const resend = new Resend(process.env.RESEND_API_KEY);

const router = express.Router();

// ── Public: look up partner by slug ──
router.get('/slug/:slug', async (req, res) => {
  try {
    const partner = await Partner.findOne({
      slug: req.params.slug.toLowerCase(),
      active: true
    }).select('-createdBy -__v');

    if (!partner) {
      return res.status(404).json({ error: 'Partner not found' });
    }

    res.json({ partner });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Admin: list all partners ──
router.get('/', protect, requireAdmin, async (req, res) => {
  try {
    const partners = await Partner.find()
      .sort({ createdAt: -1 })
      .populate('createdBy', 'email profile.firstName profile.lastName');

    const counts = await User.aggregate([
      { $match: { partnerId: { $exists: true, $ne: null } } },
      { $group: { _id: '$partnerId', count: { $sum: 1 } } }
    ]);
    const countMap = Object.fromEntries(counts.map(c => [c._id.toString(), c.count]));

    const results = partners.map(p => ({
      ...p.toObject(),
      userCount: countMap[p._id.toString()] || 0
    }));

    res.json({ partners: results });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Admin: cross-partner analytics dashboard ──
router.get('/admin/analytics', protect, requireAdmin, async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const allPartners = await Partner.find()
      .select('name slug active billing branding.companyName createdAt')
      .lean();

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Partner user counts + active users
    const [userCounts, activeUserCounts] = await Promise.all([
      User.aggregate([
        { $match: { partnerId: { $exists: true, $ne: null } } },
        { $group: { _id: '$partnerId', total: { $sum: 1 } } }
      ]),
      User.aggregate([
        { $match: { partnerId: { $exists: true, $ne: null }, lastLoginAt: { $gte: thirtyDaysAgo } } },
        { $group: { _id: '$partnerId', active: { $sum: 1 } } }
      ])
    ]);

    const userCountMap = Object.fromEntries(userCounts.map(u => [u._id.toString(), u.total]));
    const activeMap = Object.fromEntries(activeUserCounts.map(u => [u._id.toString(), u.active]));

    // Partner-owned courses with status breakdown
    const partnerCourses = await InteractiveCourse.find({ partnerId: { $exists: true, $ne: null } })
      .select('partnerId status ceHours title')
      .lean();

    const coursesByPartner = {};
    const publishedByPartner = {};
    const ceOfferedByPartner = {};
    const courseIdsByPartner = {};
    for (const c of partnerCourses) {
      const pid = c.partnerId.toString();
      coursesByPartner[pid] = (coursesByPartner[pid] || 0) + 1;
      if (c.status === 'published') {
        publishedByPartner[pid] = (publishedByPartner[pid] || 0) + 1;
        ceOfferedByPartner[pid] = (ceOfferedByPartner[pid] || 0) + (c.ceHours || 0);
      }
      if (!courseIdsByPartner[pid]) courseIdsByPartner[pid] = [];
      courseIdsByPartner[pid].push(c._id);
    }

    // Enrollments & completions on partner-owned courses (by ANY user, not just partner users)
    const allPartnerCourseIds = partnerCourses.map(c => c._id);
    const enrollmentsByPartner = {};
    const completionsByPartner = {};
    const ceEarnedByPartner = {};

    if (allPartnerCourseIds.length > 0) {
      const [enrollments, completions] = await Promise.all([
        db.collection('interactivecourseprogresses').aggregate([
          { $match: { courseId: { $in: allPartnerCourseIds } } },
          { $group: { _id: '$courseId', count: { $sum: 1 } } }
        ]).toArray(),
        db.collection('interactivecourseprogresses').aggregate([
          { $match: { courseId: { $in: allPartnerCourseIds }, status: 'completed' } },
          { $group: { _id: '$courseId', count: { $sum: 1 }, hours: { $sum: { $ifNull: ['$ceHours', 0] } } } }
        ]).toArray()
      ]);

      // Map course enrollments/completions back to owning partner
      const courseToPartner = Object.fromEntries(
        partnerCourses.map(c => [c._id.toString(), c.partnerId.toString()])
      );
      for (const e of enrollments) {
        const pid = courseToPartner[e._id.toString()];
        if (pid) enrollmentsByPartner[pid] = (enrollmentsByPartner[pid] || 0) + e.count;
      }
      for (const c of completions) {
        const pid = courseToPartner[c._id.toString()];
        if (pid) {
          completionsByPartner[pid] = (completionsByPartner[pid] || 0) + c.count;
          ceEarnedByPartner[pid] = (ceEarnedByPartner[pid] || 0) + c.hours;
        }
      }
    }

    // Build per-partner response
    const partners = allPartners.map(p => {
      const pid = p._id.toString();
      const totalCourses = coursesByPartner[pid] || 0;
      const published = publishedByPartner[pid] || 0;
      const enrollments = enrollmentsByPartner[pid] || 0;
      const completions = completionsByPartner[pid] || 0;
      return {
        _id: p._id,
        name: p.name,
        companyName: p.branding?.companyName || p.name,
        slug: p.slug,
        active: p.active,
        plan: p.billing?.plan || 'free',
        billingStatus: p.billing?.status || 'none',
        createdAt: p.createdAt,
        totalUsers: userCountMap[pid] || 0,
        activeUsers: activeMap[pid] || 0,
        coursesCreated: totalCourses,
        coursesPublished: published,
        coursesDraft: totalCourses - published,
        ceHoursOffered: Math.round((ceOfferedByPartner[pid] || 0) * 10) / 10,
        enrollments,
        completions,
        ceHoursEarned: Math.round((ceEarnedByPartner[pid] || 0) * 10) / 10,
        completionRate: enrollments > 0 ? Math.round((completions / enrollments) * 100) : 0
      };
    });

    partners.sort((a, b) => b.enrollments - a.enrollments);

    // Platform course count (shared courses without partnerId)
    const platformCourseCount = await InteractiveCourse.countDocuments({
      $or: [{ partnerId: { $exists: false } }, { partnerId: null }],
      status: 'published'
    });

    const summary = {
      totalPartners: allPartners.length,
      activePartners: allPartners.filter(p => p.active).length,
      totalPartnerUsers: Object.values(userCountMap).reduce((a, b) => a + b, 0),
      totalActiveUsers: Object.values(activeMap).reduce((a, b) => a + b, 0),
      totalCoursesCreated: Object.values(coursesByPartner).reduce((a, b) => a + b, 0),
      totalCoursesPublished: Object.values(publishedByPartner).reduce((a, b) => a + b, 0),
      totalEnrollments: Object.values(enrollmentsByPartner).reduce((a, b) => a + b, 0),
      totalCompletions: Object.values(completionsByPartner).reduce((a, b) => a + b, 0),
      totalCEHoursEarned: Math.round(Object.values(ceEarnedByPartner).reduce((a, b) => a + b, 0) * 10) / 10,
      platformCoursesShared: platformCourseCount
    };

    res.json({ partners, summary });
  } catch (error) {
    console.error('Partner analytics error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ══════════════════════════════════════════════
// ADMIN: COMMISSION RECONCILIATION & PAYOUTS
// ══════════════════════════════════════════════

// ── Admin: commission summary grouped by partner (amounts owed) ──
router.get('/admin/commissions', protect, requireAdmin, async (req, res) => {
  try {
    const status = req.query.status || 'pending';
    const match = status === 'all' ? {} : { status };

    const entries = await CommissionLedger.find(match).sort({ createdAt: -1 }).lean();

    // Total advertising expense (the 15% we pay partners to sell our courses)
    const advertisingTotal = entries
      .filter(e => e.accountingCategory === 'advertising')
      .reduce((s, e) => s + (e.distributorAmount || 0), 0);
    // Total content cost (the 85% we pass to partners for their courses)
    const cogsTotal = entries
      .filter(e => e.accountingCategory === 'cogs')
      .reduce((s, e) => s + (e.ownerAmount || 0), 0);

    // Amount owed to each partner = their distributor cut + their owner cut
    const byPartner = {};
    for (const e of entries) {
      const add = (pid, amount) => {
        if (!pid) return;
        const k = String(pid);
        byPartner[k] = byPartner[k] || { partnerId: k, owed: 0, pending: 0, paid: 0, entries: 0 };
        byPartner[k].owed += amount;
        byPartner[k][e.status === 'paid' ? 'paid' : 'pending'] += amount;
        byPartner[k].entries += 1;
      };
      add(e.distributorPartnerId, e.distributorAmount || 0);
      add(e.ownerPartnerId, e.ownerAmount || 0);
    }

    const ids = Object.keys(byPartner);
    const partners = await Partner.find({ _id: { $in: ids } }).select('name slug billing.stripeCustomerId').lean();
    const pmap = Object.fromEntries(partners.map(p => [String(p._id), p]));
    const rows = Object.values(byPartner).map(r => ({
      ...r,
      owed: Math.round(r.owed * 100) / 100,
      pending: Math.round(r.pending * 100) / 100,
      paid: Math.round(r.paid * 100) / 100,
      name: pmap[r.partnerId]?.name || '(unknown)',
      slug: pmap[r.partnerId]?.slug || '',
      hasStripeCustomer: !!pmap[r.partnerId]?.billing?.stripeCustomerId
    })).sort((a, b) => b.pending - a.pending);

    // Clawbacks: entries refunded/disputed after they were already paid to a partner.
    // (Partial refunds stay 'paid' with a partial clawbackAmount; full refunds become 'void'.)
    const clawbackEntries = await CommissionLedger.find({ clawbackRequired: true, clawbackAmount: { $gt: 0 } }).lean();
    const clawbackOwed = clawbackEntries.reduce((s, e) => s + (e.clawbackAmount || 0), 0);

    res.json({
      status,
      totals: {
        advertisingExpense: Math.round(advertisingTotal * 100) / 100,
        contentCost: Math.round(cogsTotal * 100) / 100,
        totalPendingOwed: Math.round(rows.reduce((s, r) => s + r.pending, 0) * 100) / 100,
        clawbackOwed: Math.round(clawbackOwed * 100) / 100,
        clawbackCount: clawbackEntries.length
      },
      partners: rows
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Admin: settle a partner's pending commissions ──
router.post('/admin/commissions/settle', protect, requireAdmin, async (req, res) => {
  try {
    const { partnerId, method = 'external', reference } = req.body;
    if (!partnerId) return res.status(400).json({ error: 'partnerId is required' });
    if (!['credit', 'cash', 'external', 'connect'].includes(method)) {
      return res.status(400).json({ error: 'Invalid settlement method' });
    }

    const pending = await CommissionLedger.find({
      status: 'pending',
      $or: [{ distributorPartnerId: partnerId }, { ownerPartnerId: partnerId }]
    });
    if (!pending.length) return res.status(400).json({ error: 'No pending commissions for this partner' });

    const owed = pending.reduce((s, e) =>
      s + (String(e.distributorPartnerId) === String(partnerId) ? e.distributorAmount : e.ownerAmount), 0);
    const owedRounded = Math.round(owed * 100) / 100;

    // Deterministic idempotency key for THIS exact batch of entries. A retry (e.g. Stripe
    // succeeded but the DB write failed) recomputes the same pending set → same key → Stripe
    // returns the original credit instead of issuing a second one. Concurrent settles for the
    // same partner read the same set → same key → still one credit.
    const batchIds = pending.map(e => String(e._id)).sort();
    const batchHash = crypto.createHash('sha256').update(batchIds.join(',')).digest('hex').slice(0, 32);
    const idemKey = `settle_${partnerId}_${batchHash}`;

    let payoutRef = reference || null;

    // Cheapest path: apply as account credit against their CounselorReady partner invoice
    if (method === 'credit') {
      const partner = await Partner.findById(partnerId);
      const customerId = partner?.billing?.stripeCustomerId;
      if (stripe && customerId) {
        // Negative balance transaction = credit toward the customer's next invoice.
        // The idempotency key makes this safe to retry without double-crediting.
        const bt = await stripe.customers.createBalanceTransaction(customerId, {
          amount: -Math.round(owedRounded * 100),
          currency: 'usd',
          description: `Marketplace earnings credit (${pending.length} sale${pending.length !== 1 ? 's' : ''})`
        }, { idempotencyKey: idemKey });
        payoutRef = bt.id;
      } else {
        payoutRef = payoutRef || 'manual-credit';
      }
    }

    // Only flip entries that are STILL pending, so a concurrent/retried settle can't re-process
    // entries another call already settled. modifiedCount reflects what this call actually claimed.
    const upd = await CommissionLedger.updateMany(
      { _id: { $in: pending.map(e => e._id) }, status: 'pending' },
      { $set: { status: 'paid', paidAt: new Date(), settlementMethod: method, payoutRef } }
    );

    res.json({ message: `Settled $${owedRounded.toFixed(2)} across ${upd.modifiedCount} entr${upd.modifiedCount !== 1 ? 'ies' : 'y'}`, settled: owedRounded, count: upd.modifiedCount, method, payoutRef });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Partner admin: update own branding ──
router.put('/my-branding', protect, requirePartnerAdmin, async (req, res) => {
  try {
    const partnerId = req.partnerId || req.user.partnerId;
    if (!partnerId) {
      return res.status(400).json({ error: 'No partner association found' });
    }

    const partner = await Partner.findById(partnerId);
    if (!partner) {
      return res.status(404).json({ error: 'Partner not found' });
    }

    const { logoUrl, primaryColor, companyName, tagline, colorScheme, accentColor, customDomain } = req.body;
    if (logoUrl !== undefined) partner.branding.logoUrl = logoUrl;
    if (primaryColor !== undefined) partner.branding.primaryColor = primaryColor;
    if (companyName !== undefined) partner.branding.companyName = companyName;
    if (tagline !== undefined) partner.branding.tagline = tagline;
    if (colorScheme !== undefined) partner.branding.colorScheme = colorScheme;
    if (accentColor !== undefined) partner.branding.accentColor = accentColor;
    if (customDomain !== undefined) {
      partner.branding.customDomain = customDomain;
      // Reset domain verification when domain changes
      if (partner.domainVerification?.verified && partner.branding.customDomain !== customDomain) {
        partner.domainVerification.verified = false;
        partner.domainVerification.verifiedAt = null;
      }
    }

    await partner.save();
    res.json({ partner });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PRIMARY_DOMAIN = process.env.PRIMARY_DOMAIN || 'counselorready.com';
const RESERVED_SUBDOMAINS = new Set([
  'www', 'api', 'app', 'admin', 'mail', 'email', 'smtp', 'ftp', 'ns1', 'ns2', 'mx',
  'static', 'cdn', 'assets', 'img', 'images', 'media', 'status', 'support', 'help',
  'blog', 'docs', 'dashboard', 'partner', 'partners', 'course', 'courses', 'login',
  'logout', 'signup', 'register', 'account', 'accounts', 'billing', 'pay', 'payments',
  'checkout', 'store', 'shop', 'legal', 'about', 'contact', 'go', 'link', 'links',
  'my', 'portal', 'secure', 'dev', 'staging', 'test', 'beta', 'demo', 'm', 'mobile'
]);

/**
 * PUT /my/subdomain — set the partner's personalized address (vanity subdomain) on the
 * primary domain, e.g. acme -> acme.counselorready.com. Available on every plan. Send an empty
 * value to clear it (reverts to the slug-based address).
 */
router.put('/my/subdomain', protect, requirePartnerAdmin, async (req, res) => {
  try {
    const partnerId = req.partnerId || req.user.partnerId;
    const partner = await Partner.findById(partnerId);
    if (!partner) return res.status(404).json({ error: 'Partner not found' });

    let sub = (req.body.subdomain || '').toString().trim().toLowerCase();

    // Clearing the vanity subdomain reverts to the slug-based address.
    if (sub === '') {
      if (!partner.branding) partner.branding = {};
      partner.branding.subdomain = undefined;
      await partner.save();
      return res.json({ subdomain: null, address: `${partner.slug}.${PRIMARY_DOMAIN}` });
    }

    if (!/^[a-z0-9-]+$/.test(sub) || sub.length < 3 || sub.length > 40 || sub.startsWith('-') || sub.endsWith('-')) {
      return res.status(400).json({ error: 'Use 3\u201340 characters: lowercase letters, numbers, and hyphens (not starting or ending with a hyphen).' });
    }
    if (RESERVED_SUBDOMAINS.has(sub)) {
      return res.status(400).json({ error: `"${sub}" is reserved. Please choose another.` });
    }

    // Must not collide with any other partner's slug or vanity subdomain (both resolve as hosts).
    const clash = await Partner.findOne({
      _id: { $ne: partner._id },
      $or: [{ slug: sub }, { 'branding.subdomain': sub }]
    }).select('_id').lean();
    if (clash) return res.status(409).json({ error: `"${sub}" is already taken.` });

    if (!partner.branding) partner.branding = {};
    partner.branding.subdomain = sub;
    await partner.save();
    res.json({ subdomain: sub, address: `${sub}.${PRIMARY_DOMAIN}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Partner admin: get own partner record ──
router.get('/my', protect, requirePartnerAdmin, async (req, res) => {
  try {
    const partnerId = req.partnerId || req.user.partnerId;
    if (!partnerId) {
      return res.status(400).json({ error: 'No partner association found' });
    }

    const partner = await Partner.findById(partnerId).select('-createdBy -__v');
    if (!partner) {
      return res.status(404).json({ error: 'Partner not found' });
    }

    const userCount = await User.countDocuments({ partnerId: partner._id });
    res.json({ partner: { ...partner.toObject(), userCount } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Partner admin: list own courses ──
router.get('/my/courses', protect, requirePartnerAdmin, async (req, res) => {
  try {
    const partnerId = req.partnerId || req.user.partnerId;
    const courses = await InteractiveCourse.find({ partnerId })
      .select('title slug ceHours status publishedAt totalEstimatedTime description')
      .sort({ createdAt: -1 })
      .lean();

    const db = mongoose.connection.db;
    const courseIds = courses.map(c => c._id);

    let enrollMap = {};
    let completeMap = {};
    if (courseIds.length > 0) {
      const [enrollments, completions] = await Promise.all([
        db.collection('interactivecourseprogresses').aggregate([
          { $match: { courseId: { $in: courseIds } } },
          { $group: { _id: '$courseId', count: { $sum: 1 } } }
        ]).toArray(),
        db.collection('interactivecourseprogresses').aggregate([
          { $match: { courseId: { $in: courseIds }, status: 'completed' } },
          { $group: { _id: '$courseId', count: { $sum: 1 } } }
        ]).toArray()
      ]);
      enrollMap = Object.fromEntries(enrollments.map(e => [e._id.toString(), e.count]));
      completeMap = Object.fromEntries(completions.map(c => [c._id.toString(), c.count]));
    }

    const results = courses.map(c => ({
      ...c,
      enrollments: enrollMap[c._id.toString()] || 0,
      completions: completeMap[c._id.toString()] || 0
    }));

    res.json({ courses: results });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ══════════════════════════════════════════════
// COURSE SYNDICATION / MARKETPLACE ("marketing additive")
// ══════════════════════════════════════════════

// ── Partner admin: get syndication opt-in state + opportunity counts ──
router.get('/my/syndication', protect, requirePartnerAdmin, async (req, res) => {
  try {
    const partnerId = req.partnerId || req.user.partnerId;
    const partner = await Partner.findById(partnerId).lean();
    if (!partner) return res.status(404).json({ error: 'Partner not found' });

    const syn = partner.syndication || {};
    const rate = syn.distributorRate ?? 0.15;
    const anyOn = !!(syn.importPlatformCourses || syn.listInMarketplace);
    const accepted = syn.agreedVersion === MARKETPLACE_AGREEMENT.version;

    const [platformCount, myPublished] = await Promise.all([
      InteractiveCourse.countDocuments({ $or: [{ partnerId: null }, { partnerId: { $exists: false } }], status: 'published' }),
      InteractiveCourse.countDocuments({ partnerId, status: 'published' })
    ]);

    res.json({
      syndication: {
        importPlatformCourses: !!syn.importPlatformCourses,
        listInMarketplace: !!syn.listInMarketplace,
        distributorRate: rate,
        agreedAt: syn.agreedAt || null,
        agreedVersion: syn.agreedVersion || null
      },
      agreement: {
        currentVersion: MARKETPLACE_AGREEMENT.version,
        effectiveDate: MARKETPLACE_AGREEMENT.effectiveDate,
        url: MARKETPLACE_AGREEMENT.url,
        accepted,                                   // accepted the current version?
        acceptedVersion: syn.agreedVersion || null,
        acceptedAt: syn.agreedAt || null,
        // terms changed since they accepted AND they still have a program enabled
        reacceptanceRequired: anyOn && !accepted
      },
      distributorPercent: Math.round(rate * 100),
      ownerPercent: Math.round((1 - rate) * 100),
      opportunities: {
        platformCoursesAvailable: platformCount, // CR courses they could add to their library
        myPublishedCourses: myPublished          // their courses that could be listed in the CR marketplace
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Partner admin: set syndication opt-in ──
router.put('/my/syndication', protect, requirePartnerAdmin, async (req, res) => {
  try {
    const partnerId = req.partnerId || req.user.partnerId;
    const partner = await Partner.findById(partnerId);
    if (!partner) return res.status(404).json({ error: 'Partner not found' });

    const { importPlatformCourses, listInMarketplace, acceptedVersion } = req.body;
    if (!partner.syndication) partner.syndication = {};

    // Resulting program state after applying this request
    const willImport = importPlatformCourses !== undefined ? !!importPlatformCourses : !!partner.syndication.importPlatformCourses;
    const willList = listInMarketplace !== undefined ? !!listInMarketplace : !!partner.syndication.listInMarketplace;
    const willBeOn = willImport || willList;
    const alreadyAcceptedCurrent = partner.syndication.agreedVersion === MARKETPLACE_AGREEMENT.version;

    // Enabling (or keeping on) a program requires acceptance of the CURRENT agreement version.
    // The server only honors acceptance of its own current version — never a client-supplied older one.
    if (willBeOn && !alreadyAcceptedCurrent) {
      if (acceptedVersion !== MARKETPLACE_AGREEMENT.version) {
        return res.status(409).json({
          error: 'Agreement acceptance required',
          code: 'AGREEMENT_ACCEPTANCE_REQUIRED',
          currentVersion: MARKETPLACE_AGREEMENT.version,
          agreementUrl: MARKETPLACE_AGREEMENT.url
        });
      }
    }

    if (importPlatformCourses !== undefined) partner.syndication.importPlatformCourses = !!importPlatformCourses;
    if (listInMarketplace !== undefined) partner.syndication.listInMarketplace = !!listInMarketplace;
    if (partner.syndication.distributorRate == null) partner.syndication.distributorRate = 0.15;

    // Record acceptance (clickwrap audit trail) when a valid current-version acceptance was supplied
    // and it advances the recorded version.
    let newAcceptance = null;
    if (willBeOn && acceptedVersion === MARKETPLACE_AGREEMENT.version && !alreadyAcceptedCurrent) {
      const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.ip || null;
      partner.syndication.agreedAt = new Date();
      partner.syndication.agreedByUserId = req.user._id;
      partner.syndication.agreedVersion = MARKETPLACE_AGREEMENT.version;
      if (!Array.isArray(partner.syndication.acceptances)) partner.syndication.acceptances = [];
      newAcceptance = {
        version: MARKETPLACE_AGREEMENT.version,
        at: new Date(),
        byUserId: req.user._id,
        byEmail: req.user.email,
        ip,
        userAgent: req.headers['user-agent'] || null,
        programs: { importPlatformCourses: partner.syndication.importPlatformCourses, listInMarketplace: partner.syndication.listInMarketplace }
      };
      partner.syndication.acceptances.push(newAcceptance);
    }

    partner.markModified('syndication');
    await partner.save();

    // Email the partner a copy of the agreement they just accepted (fire-and-forget).
    if (newAcceptance) {
      sendPartnerAgreementCopy({
        to: req.user.email,
        name: req.user.profile?.firstName || null,
        partnerName: partner.name,
        acceptance: newAcceptance,
        archive: true
      }).catch(err => console.error('[partners] agreement copy email failed:', err.message));
    }

    res.json({
      message: 'Syndication preferences saved',
      syndication: partner.syndication,
      agreement: { currentVersion: MARKETPLACE_AGREEMENT.version, acceptedVersion: partner.syndication.agreedVersion || null }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /my/agreement/resend — re-send the partner a copy of the agreement they accepted.
 */
router.post('/my/agreement/resend', protect, requirePartnerAdmin, async (req, res) => {
  try {
    const partnerId = req.partnerId || req.user.partnerId;
    const partner = await Partner.findById(partnerId).lean();
    if (!partner) return res.status(404).json({ error: 'Partner not found' });
    const accs = partner.syndication?.acceptances || [];
    if (!accs.length) return res.status(400).json({ error: 'No accepted agreement on file' });
    const latest = accs[accs.length - 1];
    const result = await sendPartnerAgreementCopy({
      to: req.user.email,
      name: req.user.profile?.firstName || null,
      partnerName: partner.name,
      acceptance: latest
    });
    if (!result.sent) return res.status(502).json({ error: 'Could not send the copy', reason: result.reason });
    res.json({ message: `A copy was sent to ${req.user.email}`, version: latest.version });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Partner admin: library = own courses + (if opted in) syndicated CR catalog ──
router.get('/my/library', protect, requirePartnerAdmin, async (req, res) => {
  try {
    const partnerId = req.partnerId || req.user.partnerId;
    const partner = await Partner.findById(partnerId).lean();
    if (!partner) return res.status(404).json({ error: 'Partner not found' });

    const rate = partner.syndication?.distributorRate ?? 0.15;
    const own = await InteractiveCourse.find({ partnerId })
      .select('title slug ceHours status price accessType pricingTier description')
      .sort({ createdAt: -1 }).lean();

    let syndicated = [];
    if (partner.syndication?.importPlatformCourses) {
      syndicated = await InteractiveCourse.find({
        $or: [{ partnerId: null }, { partnerId: { $exists: false } }],
        status: 'published'
      }).select('title slug ceHours price accessType pricingTier description').sort({ title: 1 }).lean();
    }

    res.json({
      own: own.map(c => ({ ...c, source: 'own' })),
      syndicated: syndicated.map(c => ({
        ...c,
        source: 'platform',
        // partner is the distributor on CR courses → they keep `rate`
        yourCutPercent: Math.round(rate * 100),
        yourCutPerSale: c.price ? Math.round(c.price * rate * 100) / 100 : 0
      })),
      distributorPercent: Math.round(rate * 100)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Partner admin: marketplace earnings (from CommissionLedger) ──
router.get('/my/earnings', protect, requirePartnerAdmin, async (req, res) => {
  try {
    const partnerId = req.partnerId || req.user.partnerId;

    // A partner is owed money two ways:
    //  - as distributor of our courses → their 15% (distributorAmount, distributorPartnerId = me)
    //  - as owner of their courses we sold → their 85% (ownerAmount, ownerPartnerId = me)
    const entries = await CommissionLedger.find({
      $or: [{ distributorPartnerId: partnerId }, { ownerPartnerId: partnerId }]
    }).sort({ createdAt: -1 }).limit(500).lean();

    const owedFor = (e) => String(e.distributorPartnerId) === String(partnerId) ? e.distributorAmount : e.ownerAmount;
    const roleFor = (e) => String(e.distributorPartnerId) === String(partnerId)
      ? 'Resold a CounselorReady course' : 'Your course sold via marketplace';

    let pending = 0, lifetime = 0;
    const rows = entries.map(e => {
      const amount = owedFor(e);
      lifetime += amount;
      if (e.status === 'pending') pending += amount;
      return {
        date: e.createdAt, courseTitle: e.courseTitle, grossAmount: e.grossAmount,
        yourShare: Math.round(amount * 100) / 100, status: e.status,
        role: roleFor(e), paidAt: e.paidAt || null
      };
    });

    res.json({
      balancePending: Math.round(pending * 100) / 100,
      lifetimeEarned: Math.round(lifetime * 100) / 100,
      count: rows.length,
      entries: rows
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Partner admin: create course ──
router.post('/my/courses', protect, requirePartnerAdmin, enforceCourseQuota, async (req, res) => {
  try {
    const partnerId = req.partnerId || req.user.partnerId;
    const { title, description, ceHours, slug, sections, assessment, objectives, presenter, references, targetAudience, categories, tags } = req.body;

    if (!title || !description || !ceHours) {
      return res.status(400).json({ error: 'Title, description, and CE hours are required' });
    }

    const courseSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const existing = await InteractiveCourse.findOne({ slug: courseSlug });
    if (existing) {
      return res.status(400).json({ error: 'A course with this slug already exists' });
    }

    const course = await InteractiveCourse.create({
      title,
      slug: courseSlug,
      description,
      ceHours,
      partnerId,
      sections: sections || [],
      assessment: assessment || {},
      objectives: objectives || [],
      presenter: presenter || {},
      references: references || [],
      targetAudience: targetAudience || [],
      categories: categories || [],
      tags: tags || [],
      author: req.user.profile?.firstName ? `${req.user.profile.firstName} ${req.user.profile.lastName || ''}`.trim() : req.user.email,
      status: 'draft'
    });

    res.status(201).json({ course });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Partner admin: update own course ──
router.put('/my/courses/:courseId', protect, requirePartnerAdmin, async (req, res) => {
  try {
    const partnerId = req.partnerId || req.user.partnerId;
    const course = await InteractiveCourse.findOne({
      _id: req.params.courseId,
      partnerId
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found or not owned by your partner' });
    }

    const allowed = ['title', 'description', 'ceHours', 'status', 'sections', 'assessment', 'objectives', 'presenter', 'references', 'targetAudience', 'categories', 'tags', 'thumbnail'];
    for (const key of allowed) {
      if (req.body[key] !== undefined) {
        course[key] = req.body[key];
      }
    }

    await course.save();
    res.json({ course });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Partner admin: delete own course ──
router.delete('/my/courses/:courseId', protect, requirePartnerAdmin, async (req, res) => {
  try {
    const partnerId = req.partnerId || req.user.partnerId;
    const course = await InteractiveCourse.findOne({
      _id: req.params.courseId,
      partnerId
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found or not owned by your partner' });
    }

    await course.deleteOne();
    res.json({ message: 'Course deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ══════════════════════════════════════════════
// BULK COURSE UPLOAD
// ══════════════════════════════════════════════

// ── Partner admin: bulk upload courses via JSON ──
router.post('/my/courses/bulk', protect, requirePartnerAdmin, enforceBulkUploadFeature, enforceCourseQuota, async (req, res) => {
  try {
    const partnerId = req.partnerId || req.user.partnerId;
    const { courses } = req.body;

    if (!Array.isArray(courses) || courses.length === 0) {
      return res.status(400).json({ error: 'courses array is required' });
    }
    if (courses.length > 50) {
      return res.status(400).json({ error: 'Maximum 50 courses per upload' });
    }

    const results = { created: [], errors: [] };

    for (let i = 0; i < courses.length; i++) {
      const c = courses[i];
      try {
        if (!c.title || !c.description || !c.ceHours) {
          results.errors.push({ index: i, title: c.title || `Row ${i + 1}`, error: 'Title, description, and CE hours are required' });
          continue;
        }

        const slug = c.slug || c.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        const existing = await InteractiveCourse.findOne({ slug });
        if (existing) {
          results.errors.push({ index: i, title: c.title, error: `Slug "${slug}" already exists` });
          continue;
        }

        const course = await InteractiveCourse.create({
          title: c.title,
          slug,
          description: c.description,
          ceHours: c.ceHours,
          partnerId,
          objectives: c.objectives || [],
          categories: c.categories || [],
          tags: c.tags || [],
          presenter: c.presenter || {},
          targetAudience: c.targetAudience || [],
          sections: c.sections || [],
          assessment: c.assessment || {},
          references: c.references || [],
          author: c.author || req.user.email,
          status: c.status === 'published' ? 'published' : 'draft'
        });

        results.created.push({ _id: course._id, title: course.title, slug: course.slug });
      } catch (err) {
        results.errors.push({ index: i, title: c.title || `Row ${i + 1}`, error: err.message });
      }
    }

    res.status(201).json({
      message: `${results.created.length} created, ${results.errors.length} failed`,
      ...results
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ══════════════════════════════════════════════
// DOMAIN VERIFICATION
// ══════════════════════════════════════════════

// ── Partner admin: initiate domain verification ──
router.post('/my/domain/verify-init', protect, requirePartnerAdmin, enforceCustomDomainFeature, async (req, res) => {
  try {
    const partnerId = req.partnerId || req.user.partnerId;
    const partner = await Partner.findById(partnerId);
    if (!partner) return res.status(404).json({ error: 'Partner not found' });

    const domain = partner.branding?.customDomain;
    if (!domain) {
      return res.status(400).json({ error: 'Set a custom domain in branding settings first' });
    }

    // Generate verification token
    const token = crypto.randomBytes(16).toString('hex');
    partner.domainVerification = {
      verificationToken: token,
      verified: false,
      verifiedAt: null,
      lastCheckAt: null
    };
    await partner.save();

    res.json({
      domain,
      verificationType: 'TXT',
      recordName: `_cr-verify.${domain}`,
      recordValue: `cr-verify=${token}`,
      instructions: `Add a TXT record to your DNS:\n  Name: _cr-verify.${domain}\n  Value: cr-verify=${token}\n\nThen click "Check Verification" once DNS has propagated (usually 5-60 minutes).`
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Partner admin: check domain verification ──
router.post('/my/domain/verify-check', protect, requirePartnerAdmin, async (req, res) => {
  try {
    const partnerId = req.partnerId || req.user.partnerId;
    const partner = await Partner.findById(partnerId);
    if (!partner) return res.status(404).json({ error: 'Partner not found' });

    const domain = partner.branding?.customDomain;
    const token = partner.domainVerification?.verificationToken;
    if (!domain || !token) {
      return res.status(400).json({ error: 'Domain verification not initiated' });
    }

    partner.domainVerification.lastCheckAt = new Date();

    try {
      const records = await dns.resolveTxt(`_cr-verify.${domain}`);
      const found = records.flat().some(r => r.includes(`cr-verify=${token}`));

      if (found) {
        partner.domainVerification.verified = true;
        partner.domainVerification.verifiedAt = new Date();
        await partner.save();
        return res.json({ verified: true, domain, message: 'Domain verified successfully!' });
      }

      await partner.save();
      return res.json({
        verified: false,
        domain,
        message: 'TXT record not found. DNS changes can take up to 48 hours to propagate.'
      });
    } catch (dnsErr) {
      await partner.save();
      return res.json({
        verified: false,
        domain,
        message: 'Could not resolve DNS records. Make sure the TXT record is added and try again later.'
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ══════════════════════════════════════════════
// PARTNER BILLING
// ══════════════════════════════════════════════

// ── Partner admin: get billing info ──
router.get('/my/billing', protect, requirePartnerAdmin, async (req, res) => {
  try {
    const partnerId = req.partnerId || req.user.partnerId;
    const partner = await Partner.findById(partnerId);
    if (!partner) return res.status(404).json({ error: 'Partner not found' });

    const courseCount = await InteractiveCourse.countDocuments({ partnerId });
    const userCount = await User.countDocuments({ partnerId });
    const currentPlan = partner.billing?.plan || 'free';

    res.json({
      billing: partner.billing || { plan: 'free', status: 'trial' },
      plans: PARTNER_PLANS,
      usage: {
        courses: courseCount,
        maxCourses: PARTNER_PLANS[currentPlan].maxCourses,
        users: userCount,
        maxUsers: PARTNER_PLANS[currentPlan].maxUsers
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Partner admin: create checkout session for plan upgrade ──
router.post('/my/billing/checkout', protect, requirePartnerAdmin, async (req, res) => {
  try {
    if (!stripe) return res.status(503).json({ error: 'Payment service unavailable' });

    const partnerId = req.partnerId || req.user.partnerId;
    const partner = await Partner.findById(partnerId);
    if (!partner) return res.status(404).json({ error: 'Partner not found' });

    const { plan } = req.body;
    if (!plan || !PARTNER_PLANS[plan] || plan === 'free') {
      return res.status(400).json({ error: 'Invalid plan selected' });
    }

    // Create or retrieve Stripe customer
    let customerId = partner.billing?.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: partner.contact?.email || req.user.email,
        name: partner.name,
        metadata: { partnerId: partnerId.toString() }
      });
      customerId = customer.id;
      if (!partner.billing) partner.billing = {};
      partner.billing.stripeCustomerId = customerId;
      await partner.save();
    }

    const planDetails = PARTNER_PLANS[plan];
    const isNewPartner = !partner.billing?.stripeSubscriptionId;
    const hasIntro = isNewPartner && planDetails.introPrice && planDetails.introMonths;

    // Build subscription with optional intro pricing phase
    const sessionConfig = {
      customer: customerId,
      mode: 'subscription',
      metadata: { partnerId: partnerId.toString(), plan },
      success_url: `${process.env.CLIENT_URL || 'https://counselorready.com'}/partner/billing?success=true`,
      cancel_url: `${process.env.CLIENT_URL || 'https://counselorready.com'}/partner/billing?canceled=true`
    };

    if (hasIntro) {
      // Use subscription_data with trial-like intro via phases isn't available in checkout,
      // so we use a coupon for the intro period discount
      const couponAmount = (planDetails.price - planDetails.introPrice) * 100;
      const coupon = await stripe.coupons.create({
        amount_off: couponAmount,
        currency: 'usd',
        duration: 'repeating',
        duration_in_months: planDetails.introMonths,
        name: `${planDetails.name} Intro - $${planDetails.introPrice}/mo for ${planDetails.introMonths} months`
      });

      sessionConfig.line_items = [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: `CounselorReady Partner - ${planDetails.name}`,
            description: `Up to ${planDetails.maxCourses === -1 ? 'unlimited' : planDetails.maxCourses} courses, ${planDetails.maxUsers === -1 ? 'unlimited' : planDetails.maxUsers} users`
          },
          unit_amount: planDetails.price * 100,
          recurring: { interval: 'month' }
        },
        quantity: 1
      }];
      sessionConfig.discounts = [{ coupon: coupon.id }];
    } else {
      sessionConfig.line_items = [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: `CounselorReady Partner - ${planDetails.name}`,
            description: `Up to ${planDetails.maxCourses === -1 ? 'unlimited' : planDetails.maxCourses} courses, ${planDetails.maxUsers === -1 ? 'unlimited' : planDetails.maxUsers} users`
          },
          unit_amount: planDetails.price * 100,
          recurring: { interval: 'month' }
        },
        quantity: 1
      }];
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Partner admin: open Stripe billing portal ──
router.post('/my/billing/portal', protect, requirePartnerAdmin, async (req, res) => {
  try {
    if (!stripe) return res.status(503).json({ error: 'Payment service unavailable' });

    const partnerId = req.partnerId || req.user.partnerId;
    const partner = await Partner.findById(partnerId);
    if (!partner?.billing?.stripeCustomerId) {
      return res.status(400).json({ error: 'No billing account found. Subscribe to a plan first.' });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: partner.billing.stripeCustomerId,
      return_url: `${process.env.CLIENT_URL || 'https://counselorready.com'}/partner/billing`
    });

    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ══════════════════════════════════════════════
// PARTNER WELCOME EMAIL
// ══════════════════════════════════════════════

// Helper: build partner-branded email HTML
function buildPartnerEmail({ brandColor, companyName, logoUrl, tagline, heading, body, buttonText, buttonUrl, footerText }) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: ${brandColor}; padding: 30px; text-align: center;">
        ${logoUrl ? `<img src="${logoUrl}" alt="${companyName}" style="height: 48px; margin-bottom: 8px;">` : ''}
        <h1 style="color: #fff; margin: 0; font-size: 24px;">${companyName}</h1>
        ${tagline ? `<p style="color: rgba(255,255,255,0.8); margin: 8px 0 0 0; font-size: 14px;">${tagline}</p>` : ''}
      </div>
      <div style="padding: 30px; background: #fff;">
        <h2 style="color: ${brandColor};">${heading}</h2>
        <p style="color: #333; line-height: 1.6;">${body}</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${buttonUrl}" style="background: ${brandColor}; color: #fff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
            ${buttonText}
          </a>
        </div>
        <p style="color: #666; font-size: 14px;">${footerText}</p>
      </div>
      <div style="background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666;">
        <p style="margin: 0 0 4px 0;">Powered by <a href="https://counselorready.com" style="color: #6B1D34; text-decoration: none; font-weight: 600;">CounselorReady</a></p>
        <p style="margin: 0;">NBCC ACEP #7760 | © ${new Date().getFullYear()} GA Integrated Therapeutic Perspectives LLC</p>
      </div>
    </div>
  `;
}

// Apply template variable substitution
function applyTemplateVars(str, vars) {
  let result = str;
  for (const [key, value] of Object.entries(vars)) {
    result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value);
  }
  return result;
}

// Send welcome email to newly registered partner user
async function sendPartnerWelcomeEmail(user, partner) {
  try {
    const brandColor = partner.branding?.primaryColor || '#6B1D34';
    const companyName = partner.branding?.companyName || partner.name;
    const loginUrl = `${process.env.CLIENT_URL || 'https://counselorready.com'}/login?partner=${partner.slug}`;
    const firstName = user.profile?.firstName || 'there';

    const vars = { firstName, companyName };
    const tpl = partner.emailTemplates?.welcome || {};

    await resend.emails.send({
      from: 'CounselorReady <noreply@counselorready.com>',
      to: user.email,
      subject: applyTemplateVars(tpl.subject || `Welcome to ${companyName}!`, vars),
      html: buildPartnerEmail({
        brandColor,
        companyName,
        logoUrl: partner.branding?.logoUrl,
        tagline: partner.branding?.tagline,
        heading: applyTemplateVars(tpl.heading || `Welcome, ${firstName}!`, vars),
        body: applyTemplateVars(tpl.body || `Your account has been created on ${companyName}'s learning platform. You're all set to start exploring courses and earning CE credits.`, vars),
        buttonText: tpl.buttonText || 'Start Learning',
        buttonUrl: loginUrl,
        footerText: applyTemplateVars(tpl.footerText || 'If you need help, contact your administrator or reach out to us.', vars)
      })
    });
  } catch (err) {
    console.error('Partner welcome email failed (non-blocking):', err.message);
  }
}

// ══════════════════════════════════════════════
// PARTNER USER MANAGEMENT
// ══════════════════════════════════════════════

// ── Partner admin: list users in their organization ──
router.get('/my/users', protect, requirePartnerAdmin, async (req, res) => {
  try {
    const partnerId = req.partnerId || req.user.partnerId;
    const { search, page = 1, limit = 50, sort = '-createdAt' } = req.query;

    const query = { partnerId };
    if (search) {
      query.$or = [
        { email: { $regex: search, $options: 'i' } },
        { 'profile.firstName': { $regex: search, $options: 'i' } },
        { 'profile.lastName': { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('email profile.firstName profile.lastName role subscription.plan subscription.status lastLoginAt emailVerified createdAt')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .lean();

    const total = await User.countDocuments(query);

    res.json({
      users,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Partner admin: invite users via email ──
router.post('/my/users/invite', protect, requirePartnerAdmin, enforceUserQuota, async (req, res) => {
  try {
    const partnerId = req.partnerId || req.user.partnerId;
    const partner = await Partner.findById(partnerId);
    if (!partner) return res.status(404).json({ error: 'Partner not found' });

    const { emails } = req.body;
    if (!Array.isArray(emails) || emails.length === 0) {
      return res.status(400).json({ error: 'emails array is required' });
    }
    if (emails.length > 50) {
      return res.status(400).json({ error: 'Maximum 50 invitations per request' });
    }

    const brandColor = partner.branding?.primaryColor || '#6B1D34';
    const companyName = partner.branding?.companyName || partner.name;
    const registerUrl = `${process.env.CLIENT_URL || 'https://counselorready.com'}/register?partner=${partner.slug}`;
    const inviterName = req.user.profile?.firstName || 'Your administrator';
    const invTpl = partner.emailTemplates?.invitation || {};

    const results = { sent: [], errors: [] };

    for (const email of emails) {
      try {
        const trimmed = email.trim().toLowerCase();
        if (!trimmed || !trimmed.includes('@')) {
          results.errors.push({ email, error: 'Invalid email address' });
          continue;
        }

        // Check if user already exists
        const existing = await User.findOne({ email: trimmed });
        if (existing) {
          if (existing.partnerId?.toString() === partnerId.toString()) {
            results.errors.push({ email: trimmed, error: 'Already a member' });
          } else {
            results.errors.push({ email: trimmed, error: 'Account exists with different organization' });
          }
          continue;
        }

        const vars = { inviterName, companyName };
        await resend.emails.send({
          from: 'CounselorReady <noreply@counselorready.com>',
          to: trimmed,
          subject: applyTemplateVars(invTpl.subject || `You're invited to ${companyName}`, vars),
          html: buildPartnerEmail({
            brandColor,
            companyName,
            logoUrl: partner.branding?.logoUrl,
            tagline: partner.branding?.tagline,
            heading: applyTemplateVars(invTpl.heading || `You're Invited!`, vars),
            body: applyTemplateVars(invTpl.body || `${inviterName} has invited you to join ${companyName} on CounselorReady, where you can access continuing education courses and earn CE credits.`, vars),
            buttonText: invTpl.buttonText || 'Create Your Account',
            buttonUrl: registerUrl,
            footerText: applyTemplateVars(invTpl.footerText || `This invitation was sent from ${companyName}. If you don't recognize this, you can safely ignore this email.`, vars)
          })
        });

        results.sent.push(trimmed);
      } catch (err) {
        results.errors.push({ email, error: 'Failed to send invitation' });
      }
    }

    res.json({
      message: `${results.sent.length} invitation(s) sent, ${results.errors.length} failed`,
      ...results
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Partner admin: remove user from organization ──
router.delete('/my/users/:userId', protect, requirePartnerAdmin, async (req, res) => {
  try {
    const partnerId = req.partnerId || req.user.partnerId;
    const targetUser = await User.findOne({ _id: req.params.userId, partnerId });
    if (!targetUser) {
      return res.status(404).json({ error: 'User not found in your organization' });
    }

    // Don't allow removing yourself
    if (targetUser._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ error: 'Cannot remove yourself' });
    }

    targetUser.partnerId = undefined;
    await targetUser.save();

    res.json({ message: 'User removed from organization' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Partner admin: get own stats (same as admin /:id/stats but scoped) ──
router.get('/my/stats', protect, requirePartnerAdmin, async (req, res) => {
  try {
    const partnerId = req.partnerId || req.user.partnerId;
    const db = mongoose.connection.db;

    const partnerUsers = await User.find({ partnerId }).select('_id').lean();
    const userIds = partnerUsers.map(u => u._id);
    const totalUsers = userIds.length;

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const activeUsers = await User.countDocuments({
      partnerId,
      lastLoginAt: { $gte: thirtyDaysAgo }
    });

    let coursesCompleted = 0;
    let ceHoursEarned = 0;

    if (userIds.length > 0) {
      const [regularCompletions, interactiveCompletions] = await Promise.all([
        db.collection('usercourseprogresses').aggregate([
          { $match: { userId: { $in: userIds }, status: 'completed' } },
          { $group: { _id: null, count: { $sum: 1 }, hours: { $sum: { $ifNull: ['$ceHours', 0] } } } }
        ]).toArray(),
        db.collection('interactivecourseprogresses').aggregate([
          { $match: { userId: { $in: userIds }, status: 'completed' } },
          { $group: { _id: null, count: { $sum: 1 }, hours: { $sum: { $ifNull: ['$ceHours', 0] } } } }
        ]).toArray()
      ]);

      coursesCompleted = (regularCompletions[0]?.count || 0) + (interactiveCompletions[0]?.count || 0);
      ceHoursEarned = (regularCompletions[0]?.hours || 0) + (interactiveCompletions[0]?.hours || 0);
    }

    const partnerCourses = await InteractiveCourse.find({ partnerId })
      .select('title slug ceHours status')
      .lean();

    let courseBreakdown = [];
    if (partnerCourses.length > 0) {
      const courseIds = partnerCourses.map(c => c._id);
      const [courseEnrollments, courseCompletions] = await Promise.all([
        db.collection('interactivecourseprogresses').aggregate([
          { $match: { courseId: { $in: courseIds } } },
          { $group: { _id: '$courseId', count: { $sum: 1 } } }
        ]).toArray(),
        db.collection('interactivecourseprogresses').aggregate([
          { $match: { courseId: { $in: courseIds }, status: 'completed' } },
          { $group: { _id: '$courseId', count: { $sum: 1 } } }
        ]).toArray()
      ]);

      const enrollMap = Object.fromEntries(courseEnrollments.map(e => [e._id.toString(), e.count]));
      const completeMap = Object.fromEntries(courseCompletions.map(c => [c._id.toString(), c.count]));

      courseBreakdown = partnerCourses.map(c => ({
        courseId: c._id,
        title: c.title,
        enrollments: enrollMap[c._id.toString()] || 0,
        completions: completeMap[c._id.toString()] || 0,
        completionRate: (enrollMap[c._id.toString()] || 0) > 0
          ? Math.round(((completeMap[c._id.toString()] || 0) / enrollMap[c._id.toString()]) * 100)
          : 0
      }));
    }

    // Recent enrollments (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentEnrollments = userIds.length > 0
      ? await db.collection('interactivecourseprogresses').countDocuments({
          userId: { $in: userIds },
          enrolledAt: { $gte: sevenDaysAgo }
        })
      : 0;

    res.json({ totalUsers, activeUsers, coursesCompleted, ceHoursEarned, courseBreakdown, recentEnrollments });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ══════════════════════════════════════════════
// QUOTA STATUS
// ══════════════════════════════════════════════

// ── Partner admin: get quota/usage status ──
router.get('/my/quota', protect, requirePartnerAdmin, async (req, res) => {
  try {
    const partnerId = req.partnerId || req.user.partnerId;
    const partner = await Partner.findById(partnerId).lean();
    if (!partner) return res.status(404).json({ error: 'Partner not found' });

    const plan = partner.billing?.plan || 'free';
    const limits = getPlanLimits(plan);
    const usage = await getPartnerUsage(partnerId);

    res.json({
      plan,
      limits,
      usage,
      courseQuota: {
        used: usage.courses,
        limit: limits.maxCourses,
        remaining: limits.maxCourses === -1 ? Infinity : Math.max(0, limits.maxCourses - usage.courses),
        percentage: limits.maxCourses === -1 ? 0 : Math.round((usage.courses / limits.maxCourses) * 100)
      },
      userQuota: {
        used: usage.users,
        limit: limits.maxUsers,
        remaining: limits.maxUsers === -1 ? Infinity : Math.max(0, limits.maxUsers - usage.users),
        percentage: limits.maxUsers === -1 ? 0 : Math.round((usage.users / limits.maxUsers) * 100)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ══════════════════════════════════════════════
// PARTNER ONBOARDING
// ══════════════════════════════════════════════

// ── Partner admin: get onboarding checklist status ──
router.get('/my/onboarding', protect, requirePartnerAdmin, async (req, res) => {
  try {
    const partnerId = req.partnerId || req.user.partnerId;
    const partner = await Partner.findById(partnerId).lean();
    if (!partner) return res.status(404).json({ error: 'Partner not found' });

    const [courseCount, userCount] = await Promise.all([
      InteractiveCourse.countDocuments({ partnerId }),
      User.countDocuments({ partnerId })
    ]);

    const steps = [
      {
        id: 'branding',
        title: 'Customize branding',
        description: 'Add your logo, colors, and company info',
        completed: !!(partner.branding?.logoUrl || partner.branding?.companyName),
        link: '/partner/branding'
      },
      {
        id: 'course',
        title: 'Add your first course',
        description: 'Create or upload a continuing education course',
        completed: courseCount > 0,
        link: '/partner/courses'
      },
      {
        id: 'users',
        title: 'Invite team members',
        description: 'Send invitations to your staff or learners',
        completed: userCount > 1, // >1 because the admin counts as 1
        link: '/partner/users'
      },
      {
        id: 'billing',
        title: 'Set up billing',
        description: 'Choose a plan that fits your organization',
        completed: !!(partner.billing?.stripeSubscriptionId) || partner.billing?.plan !== 'free',
        link: '/partner/billing'
      },
      {
        id: 'domain',
        title: 'Configure custom domain (optional)',
        description: 'Use your own domain for a fully branded experience',
        completed: !!partner.domainVerification?.verified,
        link: '/partner/domain',
        optional: true
      }
    ];

    const completedCount = steps.filter(s => s.completed).length;
    const requiredSteps = steps.filter(s => !s.optional);
    const requiredCompleted = requiredSteps.filter(s => s.completed).length;

    res.json({
      steps,
      progress: {
        completed: completedCount,
        total: steps.length,
        requiredCompleted,
        requiredTotal: requiredSteps.length,
        percentage: Math.round((requiredCompleted / requiredSteps.length) * 100),
        allRequiredDone: requiredCompleted === requiredSteps.length
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ══════════════════════════════════════════════
// EMAIL TEMPLATE CUSTOMIZATION
// ══════════════════════════════════════════════

// ── Partner admin: get/update email templates ──
router.get('/my/email-templates', protect, requirePartnerAdmin, async (req, res) => {
  try {
    const partnerId = req.partnerId || req.user.partnerId;
    const partner = await Partner.findById(partnerId).lean();
    if (!partner) return res.status(404).json({ error: 'Partner not found' });

    const templates = partner.emailTemplates || {};
    const brandColor = partner.branding?.primaryColor || '#6B1D34';
    const companyName = partner.branding?.companyName || partner.name;

    res.json({
      templates: {
        welcome: {
          subject: templates.welcome?.subject || `Welcome to ${companyName}!`,
          heading: templates.welcome?.heading || `Welcome, {{firstName}}!`,
          body: templates.welcome?.body || `Your account has been created on ${companyName}'s learning platform. You're all set to start exploring courses and earning CE credits.`,
          buttonText: templates.welcome?.buttonText || 'Start Learning',
          footerText: templates.welcome?.footerText || 'If you need help, contact your administrator or reach out to us.'
        },
        invitation: {
          subject: templates.invitation?.subject || `You're invited to ${companyName}`,
          heading: templates.invitation?.heading || `You're Invited!`,
          body: templates.invitation?.body || `{{inviterName}} has invited you to join ${companyName} on CounselorReady, where you can access continuing education courses and earn CE credits.`,
          buttonText: templates.invitation?.buttonText || 'Create Your Account',
          footerText: templates.invitation?.footerText || `This invitation was sent from ${companyName}. If you don't recognize this, you can safely ignore this email.`
        }
      },
      brandColor,
      companyName
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/my/email-templates', protect, requirePartnerAdmin, async (req, res) => {
  try {
    const partnerId = req.partnerId || req.user.partnerId;
    const partner = await Partner.findById(partnerId);
    if (!partner) return res.status(404).json({ error: 'Partner not found' });

    const { welcome, invitation } = req.body;

    if (!partner.emailTemplates) partner.emailTemplates = {};

    if (welcome) {
      partner.emailTemplates.welcome = {
        subject: (welcome.subject || '').slice(0, 200),
        heading: (welcome.heading || '').slice(0, 200),
        body: (welcome.body || '').slice(0, 1000),
        buttonText: (welcome.buttonText || '').slice(0, 50),
        footerText: (welcome.footerText || '').slice(0, 500)
      };
    }

    if (invitation) {
      partner.emailTemplates.invitation = {
        subject: (invitation.subject || '').slice(0, 200),
        heading: (invitation.heading || '').slice(0, 200),
        body: (invitation.body || '').slice(0, 1000),
        buttonText: (invitation.buttonText || '').slice(0, 50),
        footerText: (invitation.footerText || '').slice(0, 500)
      };
    }

    partner.markModified('emailTemplates');
    await partner.save();

    res.json({ message: 'Email templates updated', templates: partner.emailTemplates });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ══════════════════════════════════════════════
// EXPORTABLE REPORTS
// ══════════════════════════════════════════════

// ── Partner admin: export user report as CSV ──
router.get('/my/reports/users', protect, requirePartnerAdmin, async (req, res) => {
  try {
    const partnerId = req.partnerId || req.user.partnerId;
    const format = req.query.format || 'csv';

    const users = await User.find({ partnerId })
      .select('email profile.firstName profile.lastName role subscription.plan subscription.status lastLoginAt emailVerified createdAt')
      .sort({ createdAt: -1 })
      .lean();

    if (format === 'csv') {
      const headers = ['Email', 'First Name', 'Last Name', 'Role', 'Plan', 'Status', 'Email Verified', 'Last Login', 'Joined'];
      const rows = users.map(u => [
        u.email,
        u.profile?.firstName || '',
        u.profile?.lastName || '',
        u.role || 'user',
        u.subscription?.plan || 'free',
        u.subscription?.status || 'unknown',
        u.emailVerified ? 'Yes' : 'No',
        u.lastLoginAt ? new Date(u.lastLoginAt).toISOString().split('T')[0] : 'Never',
        new Date(u.createdAt).toISOString().split('T')[0]
      ]);

      const csv = [headers.join(','), ...rows.map(r => r.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))].join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="users-report-${new Date().toISOString().split('T')[0]}.csv"`);
      return res.send(csv);
    }

    // JSON fallback
    res.json({ users, total: users.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Partner admin: export course performance report ──
router.get('/my/reports/courses', protect, requirePartnerAdmin, async (req, res) => {
  try {
    const partnerId = req.partnerId || req.user.partnerId;
    const format = req.query.format || 'csv';
    const db = mongoose.connection.db;

    const courses = await InteractiveCourse.find({ partnerId })
      .select('title slug ceHours status publishedAt totalEstimatedTime')
      .sort({ createdAt: -1 })
      .lean();

    const courseIds = courses.map(c => c._id);
    let enrollMap = {};
    let completeMap = {};

    if (courseIds.length > 0) {
      const [enrollments, completions] = await Promise.all([
        db.collection('interactivecourseprogresses').aggregate([
          { $match: { courseId: { $in: courseIds } } },
          { $group: { _id: '$courseId', count: { $sum: 1 } } }
        ]).toArray(),
        db.collection('interactivecourseprogresses').aggregate([
          { $match: { courseId: { $in: courseIds }, status: 'completed' } },
          { $group: { _id: '$courseId', count: { $sum: 1 } } }
        ]).toArray()
      ]);
      enrollMap = Object.fromEntries(enrollments.map(e => [e._id.toString(), e.count]));
      completeMap = Object.fromEntries(completions.map(c => [c._id.toString(), c.count]));
    }

    const reportData = courses.map(c => ({
      title: c.title,
      slug: c.slug,
      ceHours: c.ceHours,
      status: c.status || 'draft',
      enrollments: enrollMap[c._id.toString()] || 0,
      completions: completeMap[c._id.toString()] || 0,
      completionRate: (enrollMap[c._id.toString()] || 0) > 0
        ? Math.round(((completeMap[c._id.toString()] || 0) / enrollMap[c._id.toString()]) * 100)
        : 0,
      publishedAt: c.publishedAt ? new Date(c.publishedAt).toISOString().split('T')[0] : 'Not published'
    }));

    if (format === 'csv') {
      const headers = ['Course Title', 'Slug', 'CE Hours', 'Status', 'Enrollments', 'Completions', 'Completion Rate (%)', 'Published Date'];
      const rows = reportData.map(c => [
        c.title, c.slug, c.ceHours, c.status, c.enrollments, c.completions, c.completionRate, c.publishedAt
      ]);

      const csv = [headers.join(','), ...rows.map(r => r.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))].join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="courses-report-${new Date().toISOString().split('T')[0]}.csv"`);
      return res.send(csv);
    }

    res.json({ courses: reportData, total: reportData.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Partner admin: export CE hours / completion report ──
router.get('/my/reports/completions', protect, requirePartnerAdmin, async (req, res) => {
  try {
    const partnerId = req.partnerId || req.user.partnerId;
    const format = req.query.format || 'csv';
    const db = mongoose.connection.db;

    // Get partner users
    const users = await User.find({ partnerId })
      .select('email profile.firstName profile.lastName')
      .lean();
    const userIds = users.map(u => u._id);
    const userMap = Object.fromEntries(users.map(u => [u._id.toString(), u]));

    // Get partner courses
    const courses = await InteractiveCourse.find({ partnerId })
      .select('title ceHours')
      .lean();
    const courseMap = Object.fromEntries(courses.map(c => [c._id.toString(), c]));

    // Get all progress records for these users on these courses
    let progressRecords = [];
    if (userIds.length > 0) {
      progressRecords = await db.collection('interactivecourseprogresses').find({
        userId: { $in: userIds },
        courseId: { $in: courses.map(c => c._id) }
      }).toArray();
    }

    const reportData = progressRecords.map(p => {
      const user = userMap[p.userId?.toString()];
      const course = courseMap[p.courseId?.toString()];
      return {
        email: user?.email || 'Unknown',
        firstName: user?.profile?.firstName || '',
        lastName: user?.profile?.lastName || '',
        courseTitle: course?.title || 'Unknown',
        ceHours: course?.ceHours || 0,
        completed: p.completed ? 'Yes' : 'No',
        progressPercent: p.progressPercent || 0,
        completedAt: p.completedAt ? new Date(p.completedAt).toISOString().split('T')[0] : '',
        enrolledAt: p.enrolledAt ? new Date(p.enrolledAt).toISOString().split('T')[0] : ''
      };
    });

    if (format === 'csv') {
      const headers = ['Email', 'First Name', 'Last Name', 'Course', 'CE Hours', 'Completed', 'Progress %', 'Completed Date', 'Enrolled Date'];
      const rows = reportData.map(r => [
        r.email, r.firstName, r.lastName, r.courseTitle, r.ceHours,
        r.completed, r.progressPercent, r.completedAt, r.enrolledAt
      ]);

      const csv = [headers.join(','), ...rows.map(r => r.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))].join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="completions-report-${new Date().toISOString().split('T')[0]}.csv"`);
      return res.send(csv);
    }

    res.json({ completions: reportData, total: reportData.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Admin: get single partner ──
router.get('/:id', protect, requireAdmin, async (req, res) => {
  try {
    const partner = await Partner.findById(req.params.id)
      .populate('createdBy', 'email profile.firstName profile.lastName');

    if (!partner) {
      return res.status(404).json({ error: 'Partner not found' });
    }

    const userCount = await User.countDocuments({ partnerId: partner._id });
    res.json({ partner: { ...partner.toObject(), userCount } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Admin: create partner ──
router.post('/', protect, requireAdmin, async (req, res) => {
  try {
    const { name, slug, branding, contact, defaultPlan } = req.body;

    if (!name || !slug) {
      return res.status(400).json({ error: 'Name and slug are required' });
    }

    const existing = await Partner.findOne({ slug: slug.toLowerCase() });
    if (existing) {
      return res.status(400).json({ error: 'A partner with this slug already exists' });
    }

    const partner = await Partner.create({
      name,
      slug: slug.toLowerCase(),
      branding: branding || {},
      contact: contact || {},
      defaultPlan: defaultPlan || 'free',
      createdBy: req.user._id
    });

    res.status(201).json({ partner });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Admin: update partner ──
router.put('/:id', protect, requireAdmin, async (req, res) => {
  try {
    const { name, slug, branding, contact, defaultPlan, active } = req.body;

    const partner = await Partner.findById(req.params.id);
    if (!partner) {
      return res.status(404).json({ error: 'Partner not found' });
    }

    // Check slug uniqueness if changing
    if (slug && slug.toLowerCase() !== partner.slug) {
      const existing = await Partner.findOne({ slug: slug.toLowerCase() });
      if (existing) {
        return res.status(400).json({ error: 'A partner with this slug already exists' });
      }
    }

    if (name !== undefined) partner.name = name;
    if (slug !== undefined) partner.slug = slug.toLowerCase();
    if (branding !== undefined) partner.branding = { ...partner.branding.toObject?.() || partner.branding, ...branding };
    if (contact !== undefined) partner.contact = { ...partner.contact.toObject?.() || partner.contact, ...contact };
    if (defaultPlan !== undefined) partner.defaultPlan = defaultPlan;
    if (active !== undefined) partner.active = active;

    await partner.save();
    res.json({ partner });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Admin: list users for a partner ──
router.get('/:id/users', protect, requireAdmin, async (req, res) => {
  try {
    const users = await User.find({ partnerId: req.params.id })
      .select('email profile.firstName profile.lastName subscription.plan subscription.status createdAt')
      .sort({ createdAt: -1 })
      .lean();

    res.json({ users, total: users.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Admin: partner-scoped analytics ──
router.get('/:id/stats', protect, requireAdmin, async (req, res) => {
  try {
    const partnerId = new mongoose.Types.ObjectId(req.params.id);
    const db = mongoose.connection.db;

    // Get all user IDs for this partner
    const partnerUsers = await User.find({ partnerId }).select('_id').lean();
    const userIds = partnerUsers.map(u => u._id);

    const totalUsers = userIds.length;

    // Active users (logged in within last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const activeUsers = await User.countDocuments({
      partnerId,
      lastLoginAt: { $gte: thirtyDaysAgo }
    });

    // Course completions from both progress collections
    let coursesCompleted = 0;
    let ceHoursEarned = 0;

    if (userIds.length > 0) {
      const [regularCompletions, interactiveCompletions] = await Promise.all([
        db.collection('usercourseprogresses').aggregate([
          { $match: { userId: { $in: userIds }, status: 'completed' } },
          { $group: { _id: null, count: { $sum: 1 }, hours: { $sum: { $ifNull: ['$ceHours', 0] } } } }
        ]).toArray(),
        db.collection('interactivecourseprogresses').aggregate([
          { $match: { userId: { $in: userIds }, status: 'completed' } },
          { $group: { _id: null, count: { $sum: 1 }, hours: { $sum: { $ifNull: ['$ceHours', 0] } } } }
        ]).toArray()
      ]);

      coursesCompleted = (regularCompletions[0]?.count || 0) + (interactiveCompletions[0]?.count || 0);
      ceHoursEarned = (regularCompletions[0]?.hours || 0) + (interactiveCompletions[0]?.hours || 0);
    }

    // Per-course breakdown for partner-owned courses
    const partnerCourses = await InteractiveCourse.find({ partnerId })
      .select('title slug ceHours status')
      .lean();

    let courseBreakdown = [];
    if (partnerCourses.length > 0) {
      const courseIds = partnerCourses.map(c => c._id);
      const [courseEnrollments, courseCompletions] = await Promise.all([
        db.collection('interactivecourseprogresses').aggregate([
          { $match: { courseId: { $in: courseIds } } },
          { $group: { _id: '$courseId', count: { $sum: 1 } } }
        ]).toArray(),
        db.collection('interactivecourseprogresses').aggregate([
          { $match: { courseId: { $in: courseIds }, status: 'completed' } },
          { $group: { _id: '$courseId', count: { $sum: 1 } } }
        ]).toArray()
      ]);

      const enrollMap = Object.fromEntries(courseEnrollments.map(e => [e._id.toString(), e.count]));
      const completeMap = Object.fromEntries(courseCompletions.map(c => [c._id.toString(), c.count]));

      courseBreakdown = partnerCourses.map(c => ({
        courseId: c._id,
        title: c.title,
        enrollments: enrollMap[c._id.toString()] || 0,
        completions: completeMap[c._id.toString()] || 0,
        completionRate: (enrollMap[c._id.toString()] || 0) > 0
          ? Math.round(((completeMap[c._id.toString()] || 0) / enrollMap[c._id.toString()]) * 100)
          : 0
      }));
    }

    res.json({ totalUsers, activeUsers, coursesCompleted, ceHoursEarned, courseBreakdown });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Admin: delete partner ──
router.delete('/:id', protect, requireAdmin, async (req, res) => {
  try {
    const partner = await Partner.findById(req.params.id);
    if (!partner) {
      return res.status(404).json({ error: 'Partner not found' });
    }

    // Unlink users from this partner
    await User.updateMany({ partnerId: partner._id }, { $unset: { partnerId: 1 } });
    await partner.deleteOne();

    res.json({ message: 'Partner deleted and users unlinked' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Admin: promote user to partner_admin ──
router.post('/:id/set-admin', protect, requireAdmin, async (req, res) => {
  try {
    const partner = await Partner.findById(req.params.id);
    if (!partner) {
      return res.status(404).json({ error: 'Partner not found' });
    }

    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ error: 'User not found with that email' });
    }

    user.role = 'partner_admin';
    user.partnerId = partner._id;
    await user.save();

    res.json({ message: `${email} promoted to partner admin for ${partner.name}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Admin: view partner courses ──
router.get('/:id/courses', protect, requireAdmin, async (req, res) => {
  try {
    const courses = await InteractiveCourse.find({ partnerId: req.params.id })
      .select('title slug ceHours status publishedAt totalEstimatedTime')
      .sort({ createdAt: -1 })
      .lean();

    // Attach enrollment/completion counts
    const db = mongoose.connection.db;
    const courseIds = courses.map(c => c._id);

    const [enrollments, completions] = await Promise.all([
      db.collection('interactivecourseprogresses').aggregate([
        { $match: { courseId: { $in: courseIds } } },
        { $group: { _id: '$courseId', count: { $sum: 1 } } }
      ]).toArray(),
      db.collection('interactivecourseprogresses').aggregate([
        { $match: { courseId: { $in: courseIds }, status: 'completed' } },
        { $group: { _id: '$courseId', count: { $sum: 1 } } }
      ]).toArray()
    ]);

    const enrollMap = Object.fromEntries(enrollments.map(e => [e._id.toString(), e.count]));
    const completeMap = Object.fromEntries(completions.map(c => [c._id.toString(), c.count]));

    const results = courses.map(c => ({
      ...c,
      enrollments: enrollMap[c._id.toString()] || 0,
      completions: completeMap[c._id.toString()] || 0
    }));

    res.json({ courses: results });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Admin: view partner course analytics ──
router.get('/:id/courses/:courseId/analytics', protect, requireAdmin, async (req, res) => {
  try {
    const course = await InteractiveCourse.findOne({
      _id: req.params.courseId,
      partnerId: req.params.id
    }).lean();

    if (!course) {
      return res.status(404).json({ error: 'Course not found for this partner' });
    }

    const db = mongoose.connection.db;
    const courseId = new mongoose.Types.ObjectId(req.params.courseId);

    const [enrollments, completions, avgProgress] = await Promise.all([
      db.collection('interactivecourseprogresses').countDocuments({ courseId }),
      db.collection('interactivecourseprogresses').countDocuments({ courseId, status: 'completed' }),
      db.collection('interactivecourseprogresses').aggregate([
        { $match: { courseId } },
        { $group: { _id: null, avg: { $avg: { $ifNull: ['$progressPercent', 0] } } } }
      ]).toArray()
    ]);

    res.json({
      course: { _id: course._id, title: course.title, slug: course.slug },
      enrollments,
      completions,
      completionRate: enrollments > 0 ? Math.round((completions / enrollments) * 100) : 0,
      avgProgress: Math.round(avgProgress[0]?.avg || 0)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ══════════════════════════════════════════════
// PARTNER COURSE CATALOG (public for partner users)
// ══════════════════════════════════════════════

// ── Public: list published courses for a partner ──
router.get('/slug/:slug/courses', async (req, res) => {
  try {
    const partner = await Partner.findOne({
      slug: req.params.slug.toLowerCase(),
      active: true
    });
    if (!partner) {
      return res.status(404).json({ error: 'Partner not found' });
    }

    const { search, category, page = 1, limit = 50 } = req.query;
    const query = { partnerId: partner._id, status: 'published' };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    if (category) query.categories = category;

    const courses = await InteractiveCourse.find(query)
      .select('title slug description thumbnail ceHours totalEstimatedTime categories tags status')
      .sort({ publishedAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .lean();

    const total = await InteractiveCourse.countDocuments(query);

    res.json({
      partner: {
        name: partner.name,
        branding: partner.branding
      },
      courses,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ══════════════════════════════════════════════════════════════
// ── Admin Support Endpoints (audit, health, notes, quick-fix)
// ══════════════════════════════════════════════════════════════
import PartnerAuditLog from '../models/PartnerAuditLog.js';
import Notification from '../models/Notification.js';

// Helper: log a partner action
async function logPartnerAction(partnerId, action, performedBy, performedByRole, details, metadata) {
  try {
    await PartnerAuditLog.create({ partnerId, action, performedBy, performedByRole, details, metadata });
  } catch (e) {
    console.error('Audit log error:', e.message);
  }
}

// ── Admin: get audit log for a partner ──
router.get('/:id/audit-log', protect, requireAdmin, async (req, res) => {
  try {
    const logs = await PartnerAuditLog.find({ partnerId: req.params.id })
      .sort({ createdAt: -1 })
      .limit(100)
      .populate('performedBy', 'email profile.firstName profile.lastName')
      .lean();
    res.json({ logs });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Admin: get partner health overview ──
router.get('/:id/health', protect, requireAdmin, async (req, res) => {
  try {
    const partner = await Partner.findById(req.params.id).lean();
    if (!partner) return res.status(404).json({ error: 'Partner not found' });

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [totalUsers, activeUsers, courses, publishedCourses] = await Promise.all([
      User.countDocuments({ partnerId: partner._id }),
      User.countDocuments({ partnerId: partner._id, lastLoginAt: { $gte: thirtyDaysAgo } }),
      InteractiveCourse.countDocuments({ partnerId: partner._id }),
      InteractiveCourse.countDocuments({ partnerId: partner._id, status: 'published' })
    ]);

    // Compute health signals
    const signals = [];

    // Billing health
    const billingStatus = partner.billing?.status || 'trial';
    if (['active', 'trial'].includes(billingStatus)) {
      signals.push({ key: 'billing', label: 'Billing', status: 'green', detail: billingStatus });
    } else if (billingStatus === 'past_due') {
      signals.push({ key: 'billing', label: 'Billing', status: 'yellow', detail: 'Past due' });
    } else {
      signals.push({ key: 'billing', label: 'Billing', status: 'red', detail: billingStatus });
    }

    // Domain health
    if (partner.branding?.customDomain) {
      signals.push({
        key: 'domain',
        label: 'Custom Domain',
        status: partner.domainVerification?.verified ? 'green' : 'yellow',
        detail: partner.domainVerification?.verified
          ? `Verified (${partner.branding.customDomain})`
          : `Not verified (${partner.branding.customDomain})`
      });
    } else {
      signals.push({ key: 'domain', label: 'Custom Domain', status: 'gray', detail: 'Not configured' });
    }

    // Course health
    if (publishedCourses > 0) {
      signals.push({ key: 'courses', label: 'Courses', status: 'green', detail: `${publishedCourses} published / ${courses} total` });
    } else if (courses > 0) {
      signals.push({ key: 'courses', label: 'Courses', status: 'yellow', detail: `${courses} created, none published` });
    } else {
      signals.push({ key: 'courses', label: 'Courses', status: 'red', detail: 'No courses' });
    }

    // User engagement
    if (totalUsers === 0) {
      signals.push({ key: 'users', label: 'User Activity', status: 'red', detail: 'No users' });
    } else {
      const activeRate = Math.round((activeUsers / totalUsers) * 100);
      signals.push({
        key: 'users',
        label: 'User Activity',
        status: activeRate >= 30 ? 'green' : activeRate >= 10 ? 'yellow' : 'red',
        detail: `${activeUsers}/${totalUsers} active (${activeRate}% in 30d)`
      });
    }

    // Partner active status
    signals.push({
      key: 'status',
      label: 'Partner Status',
      status: partner.active ? 'green' : 'red',
      detail: partner.active ? 'Active' : 'Inactive'
    });

    res.json({
      partner: { _id: partner._id, name: partner.name, slug: partner.slug, createdAt: partner.createdAt },
      signals,
      stats: { totalUsers, activeUsers, courses, publishedCourses }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Admin: get partner notes ──
router.get('/:id/notes', protect, requireAdmin, async (req, res) => {
  try {
    const partner = await Partner.findById(req.params.id)
      .select('adminNotes')
      .populate('adminNotes.createdBy', 'email profile.firstName profile.lastName')
      .lean();
    if (!partner) return res.status(404).json({ error: 'Partner not found' });
    res.json({ notes: partner.adminNotes || [] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Admin: add a note to a partner ──
router.post('/:id/notes', protect, requireAdmin, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text?.trim()) return res.status(400).json({ error: 'Note text required' });

    const partner = await Partner.findById(req.params.id);
    if (!partner) return res.status(404).json({ error: 'Partner not found' });

    partner.adminNotes.push({ text: text.trim(), createdBy: req.user._id });
    await partner.save();

    await logPartnerAction(partner._id, 'admin_note_added', req.user._id, 'admin', text.trim().substring(0, 100));

    // Re-fetch with populated data
    const updated = await Partner.findById(req.params.id)
      .select('adminNotes')
      .populate('adminNotes.createdBy', 'email profile.firstName profile.lastName')
      .lean();

    res.json({ notes: updated.adminNotes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Admin: delete a note ──
router.delete('/:id/notes/:noteId', protect, requireAdmin, async (req, res) => {
  try {
    const partner = await Partner.findById(req.params.id);
    if (!partner) return res.status(404).json({ error: 'Partner not found' });

    partner.adminNotes = partner.adminNotes.filter(n => n._id.toString() !== req.params.noteId);
    await partner.save();

    res.json({ message: 'Note deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Admin: send notification to all partner users ──
router.post('/:id/notify', protect, requireAdmin, async (req, res) => {
  try {
    const { title, message } = req.body;
    if (!title || !message) return res.status(400).json({ error: 'Title and message required' });

    const partner = await Partner.findById(req.params.id);
    if (!partner) return res.status(404).json({ error: 'Partner not found' });

    const partnerUsers = await User.find({ partnerId: partner._id }).select('_id');
    if (partnerUsers.length === 0) return res.status(400).json({ error: 'No users to notify' });

    const notifications = partnerUsers.map(u => ({
      userId: u._id,
      type: 'system',
      title,
      message,
      urgency: 'info'
    }));

    await Notification.insertMany(notifications);

    await logPartnerAction(partner._id, 'notification_sent', req.user._id, 'admin',
      `Sent "${title}" to ${partnerUsers.length} users`);

    res.json({ message: `Notification sent to ${partnerUsers.length} users` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Admin: quick-fix — reset domain verification ──
router.post('/:id/quick-fix/reset-domain', protect, requireAdmin, async (req, res) => {
  try {
    const partner = await Partner.findById(req.params.id);
    if (!partner) return res.status(404).json({ error: 'Partner not found' });

    partner.domainVerification = {
      verificationToken: null,
      verified: false,
      verifiedAt: null,
      lastCheckAt: null
    };
    await partner.save();

    await logPartnerAction(partner._id, 'domain_reset', req.user._id, 'admin', 'Domain verification reset by admin');

    res.json({ message: 'Domain verification has been reset' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Admin: quick-fix — resend welcome email to a partner user ──
router.post('/:id/quick-fix/resend-welcome', protect, requireAdmin, async (req, res) => {
  try {
    const { userId } = req.body;
    const partner = await Partner.findById(req.params.id);
    if (!partner) return res.status(404).json({ error: 'Partner not found' });

    const targetUser = userId
      ? await User.findOne({ _id: userId, partnerId: partner._id })
      : await User.findOne({ partnerId: partner._id, role: 'partner_admin' });

    if (!targetUser) return res.status(404).json({ error: 'User not found' });

    await sendPartnerWelcomeEmail(targetUser, partner);

    await logPartnerAction(partner._id, 'welcome_email_resent', req.user._id, 'admin',
      `Welcome email resent to ${targetUser.email}`);

    res.json({ message: `Welcome email resent to ${targetUser.email}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Admin: quick-fix — update billing status ──
router.post('/:id/quick-fix/billing-status', protect, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const valid = ['active', 'trial', 'past_due', 'canceled', 'inactive'];
    if (!valid.includes(status)) return res.status(400).json({ error: `Status must be one of: ${valid.join(', ')}` });

    const partner = await Partner.findById(req.params.id);
    if (!partner) return res.status(404).json({ error: 'Partner not found' });

    const oldStatus = partner.billing?.status || 'trial';
    if (!partner.billing) partner.billing = {};
    partner.billing.status = status;
    await partner.save();

    await logPartnerAction(partner._id, 'billing_status_changed', req.user._id, 'admin',
      `Billing status changed from ${oldStatus} to ${status}`);

    res.json({ message: `Billing status updated to ${status}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Export for use in auth.js
export { sendPartnerWelcomeEmail, logPartnerAction };

export default router;
