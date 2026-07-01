/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import Partner from '../models/Partner.js';
import User from '../models/User.js';
import { Course as InteractiveCourse } from '../models/InteractiveCourse.js';
import { PLAN_LIMITS } from '../utils/planLimits.js';

/**
 * Helper: resolve partner from request
 */
async function resolvePartner(req) {
  const partnerId = req.partnerId || req.user?.partnerId;
  if (!partnerId) return null;
  return Partner.findById(partnerId).lean();
}

/**
 * Get current usage for a partner
 */
export async function getPartnerUsage(partnerId) {
  const [courseCount, userCount] = await Promise.all([
    InteractiveCourse.countDocuments({ partnerId }),
    User.countDocuments({ partnerId })
  ]);
  return { courses: courseCount, users: userCount };
}

/**
 * Get plan limits for a partner
 */
export { getPlanLimits } from '../utils/planLimits.js';

/**
 * Middleware: enforce course creation quota
 * Use before POST /my/courses and POST /my/courses/bulk
 */
export function enforceCourseQuota(req, res, next) {
  const original = next;
  const wrappedNext = async () => {
    try {
      const partner = await resolvePartner(req);
      if (!partner) return original();

      const plan = partner.billing?.plan || 'free';
      const limits = PLAN_LIMITS[plan];
      if (!limits) return original();

      // Unlimited plan
      if (limits.maxCourses === -1) return original();

      const currentCourses = await InteractiveCourse.countDocuments({
        partnerId: partner._id
      });

      // For bulk uploads, account for the batch size
      const batchSize = Array.isArray(req.body?.courses) ? req.body.courses.length : 1;

      if (currentCourses + batchSize > limits.maxCourses) {
        return res.status(403).json({
          error: 'Course limit reached',
          code: 'QUOTA_EXCEEDED',
          detail: `Your ${plan} plan allows up to ${limits.maxCourses} courses. You currently have ${currentCourses}.`,
          usage: { current: currentCourses, limit: limits.maxCourses, requested: batchSize },
          upgrade: 'Upgrade your plan to add more courses.'
        });
      }

      original();
    } catch (err) {
      original();
    }
  };
  wrappedNext();
}

/**
 * Middleware: enforce user invitation quota
 * Use before POST /my/users/invite
 */
export function enforceUserQuota(req, res, next) {
  const original = next;
  const wrappedNext = async () => {
    try {
      const partner = await resolvePartner(req);
      if (!partner) return original();

      const plan = partner.billing?.plan || 'free';
      const limits = PLAN_LIMITS[plan];
      if (!limits) return original();

      // Unlimited plan
      if (limits.maxUsers === -1) return original();

      const currentUsers = await User.countDocuments({ partnerId: partner._id });
      const batchSize = Array.isArray(req.body?.emails) ? req.body.emails.length : 1;

      if (currentUsers + batchSize > limits.maxUsers) {
        return res.status(403).json({
          error: 'User limit reached',
          code: 'QUOTA_EXCEEDED',
          detail: `Your ${plan} plan allows up to ${limits.maxUsers} users. You currently have ${currentUsers}.`,
          usage: { current: currentUsers, limit: limits.maxUsers, requested: batchSize },
          upgrade: 'Upgrade your plan to add more users.'
        });
      }

      original();
    } catch (err) {
      original();
    }
  };
  wrappedNext();
}

/**
 * Middleware: enforce custom domain feature gate
 * Use before domain verification endpoints
 */
export function enforceCustomDomainFeature(req, res, next) {
  const original = next;
  const wrappedNext = async () => {
    try {
      const partner = await resolvePartner(req);
      if (!partner) return original();

      const plan = partner.billing?.plan || 'free';
      const limits = PLAN_LIMITS[plan];

      if (!limits?.customDomain) {
        return res.status(403).json({
          error: 'Custom domains not available',
          code: 'FEATURE_NOT_AVAILABLE',
          detail: `Custom domains require a Professional or Enterprise plan. You are on the ${plan} plan.`,
          upgrade: 'Upgrade to Professional or Enterprise to use custom domains.'
        });
      }

      original();
    } catch (err) {
      original();
    }
  };
  wrappedNext();
}

/**
 * Middleware: enforce bulk upload feature gate
 * Use before POST /my/courses/bulk
 */
export function enforceBulkUploadFeature(req, res, next) {
  const original = next;
  const wrappedNext = async () => {
    try {
      const partner = await resolvePartner(req);
      if (!partner) return original();

      const plan = partner.billing?.plan || 'free';
      const limits = PLAN_LIMITS[plan];

      if (!limits?.bulkUpload) {
        return res.status(403).json({
          error: 'Bulk upload not available',
          code: 'FEATURE_NOT_AVAILABLE',
          detail: `Bulk upload requires a Growth plan or higher. You are on the ${plan} plan.`,
          upgrade: 'Upgrade to Growth or higher to use bulk upload.'
        });
      }

      original();
    } catch (err) {
      original();
    }
  };
  wrappedNext();
}
