/**
 * checkCourseAccess.js
 * CounselorReady — Middleware to gate course enrollment and content access
 * Drop in: server/src/middleware/checkCourseAccess.js
 *
 * Usage in courseRoutes.js:
 *   import checkCourseAccess from '../middleware/checkCourseAccess.js';
 *   router.post('/:id/enroll', protect, checkCourseAccess, enrollHandler);
 *   router.get('/:id/progress', protect, checkCourseAccess, progressHandler);
 */

import mongoose from 'mongoose';
import { canAccessCourse } from '../utils/pricingRules.js';

// Lazy-load models to avoid circular imports
const getModels = () => {
  const InteractiveCourse = mongoose.models.InteractiveCourse ||
    mongoose.model('InteractiveCourse', new mongoose.Schema({
      pricingTier: String,
      accessTier:  String,
    }, { strict: false }));

  const User = mongoose.models.User ||
    mongoose.model('User', new mongoose.Schema({}, { strict: false }));

  return { InteractiveCourse, User };
};

/**
 * checkCourseAccess
 * Expects: req.user (from protect middleware), req.params.id (course _id)
 * Attaches: req.course, req.userHasAccess
 */
export default async function checkCourseAccess(req, res, next) {
  try {
    const { InteractiveCourse } = getModels();

    const course = await InteractiveCourse.findById(req.params.id).lean();
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    req.course = course;

    // Admins always pass through
    if (req.user?.role === 'admin') {
      req.userHasAccess = true;
      return next();
    }

    const userPlan     = req.user?.subscription?.plan ?? 'free';
    const courseTier   = course.pricingTier ?? course.accessTier ?? 'free';

    // Check one-time purchase — stored as array of courseId strings on user
    const purchasedIds = (req.user?.purchasedCourses ?? []).map(String);
    const hasPurchased = purchasedIds.includes(String(course._id));

    const { allowed, reason, requiredPlan, individualPrice } = canAccessCourse(
      userPlan,
      courseTier,
      hasPurchased,
    );

    req.userHasAccess = allowed;

    if (!allowed) {
      return res.status(403).json({
        error: 'Access denied',
        reason,
        ...(requiredPlan    && { requiredPlan }),
        ...(individualPrice && { individualPrice }),
        courseTitle: course.title,
        courseTier,
      });
    }

    next();
  } catch (err) {
    console.error('[checkCourseAccess]', err.message);
    res.status(500).json({ error: 'Access check failed', detail: err.message });
  }
}
