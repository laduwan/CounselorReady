import mongoose from 'mongoose';
import { canAccessCourse } from '../utils/pricingRules.js';

export default async function checkCourseAccess(req, res, next) {
  try {
    const InteractiveCourse = mongoose.models.InteractiveCourse ||
      mongoose.model('InteractiveCourse', new mongoose.Schema({}, { strict: false }));

    // Support both :id and :slug route params
    const paramValue = req.params.id || req.params.slug || req.params.param;
    let course;
    if (mongoose.Types.ObjectId.isValid(paramValue)) {
      course = await InteractiveCourse.findById(paramValue).lean();
    } else {
      course = await InteractiveCourse.findOne({ slug: paramValue }).lean();
    }

    if (!course) return res.status(404).json({ error: 'Course not found' });

    req.course = course;

    if (req.user?.role === 'admin') {
      req.userHasAccess = true;
      return next();
    }

    const userPlan     = req.user?.subscription?.plan ?? 'free';
    const courseTier   = course.pricingTier ?? course.accessTier ?? 'free';
    const purchasedIds = (req.user?.purchasedCourses ?? []).map(String);
    const hasPurchased = purchasedIds.includes(String(course._id));

    const result = canAccessCourse(userPlan, courseTier, hasPurchased);
    req.userHasAccess = result.allowed;

    if (!result.allowed) {
      return res.status(403).json({
        error: 'Access denied',
        reason: result.reason,
        ...(result.requiredPlan    && { requiredPlan: result.requiredPlan }),
        ...(result.individualPrice && { individualPrice: result.individualPrice }),
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
