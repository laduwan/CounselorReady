// routes/interactiveCourseRoutes.js
// Interactive course routes for CounselorReady
// Includes: Course viewing, Progress tracking, Assessment, Evaluation, Attestation, Certificate
// =============================================

import express from 'express';
import mongoose from 'mongoose';
import { Readable } from 'stream';
import { v2 as cloudinary } from 'cloudinary';
import { Course, CourseProgress, ContentInteraction } from '../models/InteractiveCourse.js';
import Certificate from '../models/Certificate.js';
import Evaluation from '../models/Evaluation.js';
import User from '../models/User.js';
import Partner from '../models/Partner.js';
import UserCredential from '../models/UserCredential.js';
import Gamification from '../models/Gamification.js';
import { protect, requireAdmin, optionalAuth } from '../middleware/auth.js';
import { generateCertificate, generateCertificateNumber, buildApprovalBlock } from '../utils/certificate.js';
import { logActivity, ACTIVITY_TYPES } from '../services/activityTrackingService.js';
import { checkAndSendFreeLimit } from '../services/freeCourseLimitEmail.js';
import twilio from 'twilio';
import { awardCourseCompletion, awardCertificate, awardCourseEvaluation } from '../services/rewardsService.js';

const twilioClient = process.env.TWILIO_ACCOUNT_SID
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null;

const router = express.Router();

// Helper: resolve course by ObjectId or slug
async function findCourseByIdOrSlug(param) {
  if (mongoose.Types.ObjectId.isValid(param)) {
    return Course.findById(param);
  }
  return Course.findOne({ slug: param });
}

// ── CONTENT GATING ──────────────────────────────────────────
const FREE_COURSES_PER_MONTH = 4;   // free plan: 4 courses/month
const FREE_MAX_COURSE_HOURS  = 1;   // free plan covers 1-CE-hour courses only
const TRIAL_COURSES_TOTAL    = 2;   // no-card trial: 2 one-CE courses, lifetime
const BASIC_MAX_COURSE_HOURS = 3;   // basic plan: unlimited courses up to 3 CE hours

/**
 * Strip sensitive content from course for preview/unauthenticated users.
 * Removes: assessment answers, deep section content (keeps titles + first block preview).
 */
function stripContent(courseObj) {
  const obj = courseObj.toObject ? courseObj.toObject() : { ...courseObj };

  // Strip assessment answers
  if (obj.assessment?.questions) {
    obj.assessment.questions = obj.assessment.questions.map(q => ({
      ...q,
      options: q.options?.map(o => ({ text: o.text })), // remove isCorrect
      explanation: undefined
    }));
  }

  // Strip section content — keep titles and first text block (truncated) for preview
  if (obj.sections) {
    obj.sections = obj.sections.map(s => {
      const firstText = s.contentBlocks?.find(b => b.type === 'text');
      const preview = firstText?.content?.substring(0, 300) || '';
      return {
        _id: s._id,
        title: s.title,
        contentBlocks: [{ type: 'text', content: preview + (preview.length >= 300 ? '…' : '') }],
        _stripped: true
      };
    });
  }

  obj._isPreview = true;
  return obj;
}

function currentMonthKey() { return new Date().toISOString().slice(0, 7); }

function effectiveFreeCoursesUsed(user) {
  if (!user) return 0;
  if (user.freeCoursesResetMonth !== currentMonthKey()) return 0; // month rolled over
  return user.freeCoursesUsedThisMonth ?? 0;
}

function hasCardOnFile(user) {
  return !!user?.subscription?.stripeCustomerId;
}

// Free-tier eligibility for a PAID course. Read-only (does NOT consume a slot).
function freeTierDecision(user, course) {
  const courseHours = course.ceHours || course.ceuHours || 1;
  if (courseHours > FREE_MAX_COURSE_HOURS) {
    return { allowed: false, code: 'OVER_FREE_HOUR_LIMIT',
      message: 'Free access covers 1 CE-hour courses only. Purchase this course or upgrade to enroll.' };
  }
  const status = user?.subscription?.status || 'free';
  // No-card trial: 2 one-CE courses, lifetime (tracked on trialCoursesUsed)
  if (status === 'trial' && !hasCardOnFile(user)) {
    if ((user.trialCoursesUsed ?? 0) >= TRIAL_COURSES_TOTAL) {
      return { allowed: false, code: 'TRIAL_LIMIT',
        message: `Your free trial includes ${TRIAL_COURSES_TOTAL} one-hour courses. Add a card for 4 free courses every month, or purchase this course.` };
    }
    return { allowed: true, code: 'TRIAL_OK' };
  }
  // free plan OR card-on-file: 4 one-CE courses per month
  if (effectiveFreeCoursesUsed(user) >= FREE_COURSES_PER_MONTH) {
    return { allowed: false, code: 'MONTHLY_LIMIT',
      message: `You've used your ${FREE_COURSES_PER_MONTH} free courses this month. Purchase this course or upgrade for unlimited access.` };
  }
  return { allowed: true, code: 'FREE_OK' };
}

// True if an active PAID plan covers THIS course. Accounts for the basic-tier
// hour cap: basic gets unlimited courses up to BASIC_MAX_COURSE_HOURS CE hours;
// all other paid plans (starter/professional/vip) are unlimited. free → false.
function planCoversCourse(plan, course) {
  if (plan === 'free') return false;
  if (plan === 'basic') {
    const hrs = course.ceHours || course.ceuHours || 1;
    return hrs <= BASIC_MAX_COURSE_HOURS;
  }
  return true;
}

// True if user already has paid/admin/free-course access (no slot needed).
function hasPaidOrFreeAccess(user, course) {
  if (!user) return false;
  if (user.role === 'admin') return true;
  if (course.accessType === 'free') return true;
  const purchased = user.purchasedCourses?.some(
    pc => pc.courseId?.toString() === course._id.toString());
  if (purchased) return true;
  const status = user.subscription?.status || 'free';
  const plan   = user.subscription?.plan   || 'free';
  // trial is NOT unlimited — it routes through freeTierDecision (2-course / 1-hr caps)
  return ['active','lifetime'].includes(status) && planCoversCourse(plan, course);
}

// Atomically persist consumption of one monthly free slot (month-aware).
async function consumeFreeSlot(user) {
  const status = user?.subscription?.status || 'free';
  // No-card trial consumes a lifetime trial slot, NOT a monthly slot
  if (status === 'trial' && !hasCardOnFile(user)) {
    return User.updateOne({ _id: user._id },
      { $inc: { trialCoursesUsed: 1 } });
  }
  const month = currentMonthKey();
  const sameMonth = user.freeCoursesResetMonth === month;
  const newCount = (sameMonth ? (user.freeCoursesUsedThisMonth ?? 0) : 0) + 1;
  return User.updateOne({ _id: user._id }, { $set: {
    freeCoursesResetMonth: month,
    freeCoursesUsedThisMonth: newCount,
    ...(sameMonth ? {} : { freeLimitEmailSentThisMonth: false })
  }});
}

/**
 * Gate course content based on user authentication, subscription, and enrollment.
 * Returns: full course, stripped preview, or course with metadata flags.
 */
async function gateContent(courseObj, user) {
  // No user → preview only
  if (!user) return stripContent(courseObj);

  // Admin → always full
  if (user.role === 'admin') return courseObj;

  // Check enrollment
  const progress = await CourseProgress.findOne({ userId: user._id, courseId: courseObj._id });
  const isEnrolled = !!progress;

  // Free course → full content for anyone logged in
  if (courseObj.accessType === 'free') return courseObj;

  // Individual purchase → full content
  const hasPurchased = user.purchasedCourses?.some(
    pc => pc.courseId?.toString() === courseObj._id.toString()
  );
  if (hasPurchased) return courseObj;

  // Active subscription check
  const subPlan = user.subscription?.plan || 'free';
  const subStatus = user.subscription?.status || 'free';
  const isActiveSub = ['active', 'trial', 'lifetime'].includes(subStatus);

  if (isActiveSub && planCoversCourse(subPlan, courseObj)) return courseObj;

  // Free-tier user on a paid course: full content ONLY if already enrolled.
  // Enrollment (POST /enroll or first GET /progress) is the single chokepoint that
  // enforced the 1-hour cap and the monthly quota — so trust it here.
  if (isEnrolled) return courseObj;
  const stripped = stripContent(courseObj);
  stripped._requiresEnrollment = true;
  return stripped;
}

/**
 * Renewal-cycle "updated since your last completion" viewer feature.
 * Embeds the learner's most recent completedAt for THIS course (if any)
 * into the course payload the viewer already fetches — no second round
 * trip needed. The course's own `changeLog` needs no extra plumbing here:
 * gateContent() above returns the full course object (or a stripped
 * preview object), and Mongoose serializes every schema field —
 * changeLog included — by default.
 */
async function withUserCompletedAt(gated, user, courseId) {
  const obj = gated.toObject ? gated.toObject() : gated;
  if (user) {
    const progress = await CourseProgress.findOne({ userId: user._id, courseId }, 'completedAt');
    if (progress?.completedAt) obj.userCompletedAt = progress.completedAt;
  }
  return obj;
}

// Export for testing
export { gateContent as _gateContent, stripContent as _stripContent };

// Helper: record gamification activity (non-blocking)
async function recordGamification(userId, type, metadata = {}) {
  try {
    let profile = await Gamification.findOne({ userId });
    if (!profile) profile = await Gamification.create({ userId });
    
    profile.recordActivity();
    
    const XP = { course_complete: 100, quiz_pass: 25, daily_login: 5, streak_milestone: 50, certificate_earned: 75 };
    profile.xp += XP[type] || 5;
    profile.level = profile.calculateLevel();
    
    if (type === 'course_complete') {
      profile.totalCoursesCompleted += 1;
      if (metadata.ceHours) {
        profile.totalCEHoursEarned += metadata.ceHours;
        profile.weeklyHoursCompleted += metadata.ceHours;
      }
    } else if (type === 'quiz_pass') {
      profile.totalQuizzesPassed += 1;
    }
    
    // Check badges
    const BADGES = {
      first_course: { check: () => profile.totalCoursesCompleted >= 1, name: 'First Steps', description: 'Completed your first course', icon: 'trophy' },
      five_courses: { check: () => profile.totalCoursesCompleted >= 5, name: 'Dedicated Learner', description: 'Completed 5 courses', icon: 'star' },
      ten_courses: { check: () => profile.totalCoursesCompleted >= 10, name: 'CE Champion', description: 'Completed 10 courses', icon: 'crown' },
      twenty_five_courses: { check: () => profile.totalCoursesCompleted >= 25, name: 'Master Practitioner', description: 'Completed 25 courses', icon: 'gem' },
      streak_7: { check: () => profile.currentStreak >= 7, name: 'Week Warrior', description: '7-day learning streak', icon: 'flame' },
      streak_30: { check: () => profile.currentStreak >= 30, name: 'Monthly Maven', description: '30-day learning streak', icon: 'fire' },
      ten_hours: { check: () => profile.totalCEHoursEarned >= 10, name: '10 Hour Club', description: 'Earned 10+ CE hours', icon: 'clock' },
      fifty_hours: { check: () => profile.totalCEHoursEarned >= 50, name: 'Half Century', description: 'Earned 50+ CE hours', icon: 'zap' },
      quiz_ace: { check: () => profile.totalQuizzesPassed >= 10, name: 'Quiz Ace', description: 'Passed 10 quizzes', icon: 'check-circle' },
      first_cert: { check: () => type === 'certificate_earned', name: 'Certified', description: 'Earned your first certificate', icon: 'award' }
    };
    
    for (const [key, def] of Object.entries(BADGES)) {
      if (def.check() && !profile.badges.some(b => b.key === key)) {
        profile.badges.push({ key, name: def.name, description: def.description, icon: def.icon });
      }
    }
    
    await profile.save();
  } catch (err) {
    console.error('Gamification error (non-fatal):', err.message);
  }
}

// ============================================================================
// COURSE ROUTES
// ============================================================================

/**
 * GET /api/interactive-courses
 * List all published courses with optional filtering
 */
router.get('/', async (req, res) => {
  try {
    const { 
      category, 
      tag, 
      search, 
      status = 'published',
      page = 1, 
      limit = 10 
    } = req.query;

    const query = {};
    if (status && status !== 'all') query.status = status;
    
    if (category) query.categories = category;
    if (tag) query.tags = tag;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Marketplace scoping: the public catalog shows platform-owned courses plus partner
    // courses ONLY from partners who opted into the marketplace (syndication.listInMarketplace).
    // Non-listed partner courses are excluded so they never leak into the main catalog.
    const listedPartners = await Partner.find({ 'syndication.listInMarketplace': true, active: true })
      .select('name slug branding.companyName branding.primaryColor')
      .lean();
    const listedIds = listedPartners.map(p => p._id);
    const partnerMap = Object.fromEntries(listedPartners.map(p => [String(p._id), p]));
    query.$and = (query.$and || []).concat([{
      $or: [
        { partnerId: null },
        { partnerId: { $exists: false } },
        { partnerId: { $in: listedIds } }
      ]
    }]);
    query.visibility = { $ne: 'private' };

    const courses = await Course.find(query)
      .select('title slug status courseCode description thumbnail ceHours totalEstimatedTime categories tags wordCount sectionCount moduleCount assessmentQuestionCount ceuCategories accessType price pricingTier status ceuHours ceuApprovalNumber partnerId')
      .sort({ publishedAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .lean();

    const total = await Course.countDocuments(query);

    // Attach lightweight brand attribution to marketplace partner courses
    const data = courses.map(c => {
      if (c.partnerId && partnerMap[String(c.partnerId)]) {
        const p = partnerMap[String(c.partnerId)];
        c.marketplacePartner = {
          name: p.branding?.companyName || p.name,
          slug: p.slug,
          color: p.branding?.primaryColor || '#6B1D34'
        };
      }
      return c;
    });

    res.json({
      success: true,
      data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch courses' });
  }
});

/**
 * GET /api/interactive-courses/admin/all
 * Admin: list all courses (all statuses) for migration/management
 */
router.get('/admin/all', protect, requireAdmin, async (req, res) => {
  try {
    const courses = await Course.find({})
      .select('title slug description status ceHours categories tags wordCount createdAt updatedAt')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: courses, total: courses.length });
  } catch (error) {
    console.error('Error fetching all courses for admin:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch courses' });
  }
});

/**
 * GET /api/interactive-courses/slug/:slug
 * Get course details by slug — content gated by auth/subscription
 */
router.get('/slug/:slug', optionalAuth, async (req, res) => {
  try {
    const course = await Course.findOne({ 
      slug: req.params.slug,
      status: 'published'
    });

    if (!course) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }

    const gated = await gateContent(course, req.user);
    const responseData = await withUserCompletedAt(gated, req.user, course._id);
    res.json({ success: true, data: responseData });
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch course' });
  }
});

/**
 * GET /api/interactive-courses/code/:courseCode
 * Direct lookup by courseCode — works for public AND private courses.
 * This is the only way to reach a private course without knowing its slug/id.
 */
router.get('/code/:courseCode', optionalAuth, async (req, res) => {
  try {
    const escapedCode = req.params.courseCode.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const course = await Course.findOne({
      courseCode: new RegExp(`^${escapedCode}$`, 'i'),
      status: 'published'
    });
    if (!course) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }
    const gated = await gateContent(course, req.user);
    res.json({ success: true, data: gated });
  } catch (error) {
    console.error('Error fetching course by code:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch course' });
  }
});

/**
 * GET /api/interactive-courses/user/my-courses
 * Get all courses user is enrolled in with progress
 */
router.get('/user/my-courses', protect, async (req, res) => {
  try {
    const { status } = req.query;

    const query = { userId: req.user._id };
    if (status) query.status = status;

    const progressList = await CourseProgress.find(query)
      .populate('courseId', 'title slug description thumbnail ceHours totalEstimatedTime')
      .sort({ lastAccessedAt: -1 });

    const courses = progressList.map(p => ({
      course: p.courseId,
      progress: p.overallProgress,
      status: p.status,
      currentSection: p.currentSectionIndex,
      totalTimeSpent: p.totalTimeSpent,
      enrolledAt: p.enrolledAt,
      lastAccessedAt: p.lastAccessedAt,
      completedAt: p.completedAt,
      certificateId: p.certificateId
    }));

    res.json({ success: true, data: courses });
  } catch (error) {
    console.error('Error fetching user courses:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch courses' });
  }
});

/**
 * GET /api/interactive-courses/:id
 * Get course details by ID — content gated by auth/subscription
 */
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const course = await findCourseByIdOrSlug(req.params.id);

    if (!course) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }

    const gated = await gateContent(course, req.user);
    const responseData = await withUserCompletedAt(gated, req.user, course._id);
    res.json({ success: true, data: responseData });
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch course' });
  }
});

// ============================================================================
// PROGRESS ROUTES (Protected)
// ============================================================================

/**
 * GET /api/interactive-courses/:id/progress
 * Get user's progress for a specific course
 */
router.get('/:id/progress', protect, async (req, res) => {
  try {
    const course = await findCourseByIdOrSlug(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }

    let progress = await CourseProgress.findOne({
      userId: req.user._id,
      courseId: course._id
    });

    // If no progress exists, create initial progress
    if (!progress) {
      const paid = hasPaidOrFreeAccess(req.user, course);
      const freeDecision = paid ? { allowed: true } : freeTierDecision(req.user, course);
      if (!paid && !freeDecision.allowed) {
        return res.status(403).json({ success: false, error: 'Enrollment required',
          code: freeDecision.code, message: freeDecision.message });
      }
      progress = new CourseProgress({
        userId: req.user._id,
        courseId: course._id,
        sectionProgress: course.sections.map((section, index) => ({
          sectionId: section._id, sectionIndex: index,
          viewedBlocks: [], completedBlocks: [], quizAttempts: [], status: 'not_started'
        })),
        assessmentAttemptsRemaining: course.assessment?.attemptsAllowed || 3
      });
      await progress.save();
      if (!paid) consumeFreeSlot(req.user).catch(() => {}); // free-tier consumes 1 slot, once
    }

    res.json({ success: true, data: progress });
  } catch (error) {
    console.error('Error fetching progress:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch progress' });
  }
});

/**
 * POST /api/interactive-courses/:id/enroll
 * Enroll user in a course — enforces subscription/payment/free-hour limits
 */
router.post('/:id/enroll', protect, async (req, res) => {
  try {
    const course = await findCourseByIdOrSlug(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }

    // Check if already enrolled
    let progress = await CourseProgress.findOne({
      userId: req.user._id,
      courseId: course._id
    });

    if (progress) {
      return res.json({ success: true, message: 'Already enrolled', data: progress });
    }

    // ── ACCESS CHECK ──
    const user = req.user;
    const subPlan = user.subscription?.plan || 'free';
    const subStatus = user.subscription?.status || 'free';
    const isActiveSub = ['active', 'trial', 'lifetime'].includes(subStatus);
    const isAdmin = user.role === 'admin';
    const isFree = course.accessType === 'free';
    const hasPurchased = user.purchasedCourses?.some(
      pc => pc.courseId?.toString() === course._id.toString()
    );

    // ── New membership async-course cap ──
    // Only the Monthly plan and the single grandfathered Starter account are
    // hour-capped (≤4 CE). Every existing plan keeps its current access path
    // below (VIP/Annual are uncapped; purchased/admin/free bypass this).
    if (!isAdmin && !isFree && !hasPurchased && (user.isMonthly?.() || user.isGrandfatheredStarter?.())) {
      if (!user.canAccessAsyncCourse(course)) {
        const hrs = course.ceHours || course.ceuHours || 0;
        return res.status(403).json({
          success: false,
          error: hrs > 4
            ? `This course is ${hrs} CE hours. Monthly members access courses up to 4 CE hours. Upgrade to Annual for full catalog access.`
            : 'Active membership required.',
          upgradeRequired: true,
          upgradeUrl: '/subscription.html'
        });
      }
    }

    let accessGranted = false;
    let usedFreeHours = false;
    let freeDenial = null;

    if (isAdmin || isFree || hasPurchased) {
      accessGranted = true;
    } else if (isActiveSub && planCoversCourse(subPlan, course)) {
      accessGranted = true;
    } else {
      const decision = freeTierDecision(user, course);
      if (decision.allowed) { accessGranted = true; usedFreeHours = true; }
      else { freeDenial = decision; }
    }

    if (!accessGranted) {
      return res.status(403).json({
        success: false,
        error: freeDenial?.code === 'OVER_FREE_HOUR_LIMIT' ? 'Upgrade required' : 'Subscription required',
        code: freeDenial?.code || 'SUBSCRIPTION_REQUIRED',
        message: freeDenial?.message || `Subscribe for unlimited access.`,
        freeCoursesUsedThisMonth: effectiveFreeCoursesUsed(user),
        freeCoursesLimit: FREE_COURSES_PER_MONTH
      });
    }

    // Free-tier concurrent course limit: 1 active course at a time
    if (!isAdmin && (subPlan === 'free' || !isActiveSub)) {
      const activeCount = await CourseProgress.countDocuments({
        userId: req.user._id,
        status: { $in: ['not_started', 'in_progress'] }
      });
      if (activeCount >= 1) {
        return res.status(403).json({
          success: false,
          error: 'Free plan allows one active course at a time.',
          code: 'CONCURRENT_LIMIT',
          message: 'Complete your current course before starting a new one, or subscribe for unlimited access.'
        });
      }
    }

    // Create new enrollment
    progress = new CourseProgress({
      userId: req.user._id,
      courseId: course._id,
      sectionProgress: course.sections.map((section, index) => ({
        sectionId: section._id,
        sectionIndex: index,
        viewedBlocks: [],
        completedBlocks: [],
        quizAttempts: [],
        status: 'not_started'
      })),
      assessmentAttemptsRemaining: course.assessment?.attemptsAllowed || 3,
      enrolledAt: new Date()
    });

    await progress.save();

    if (usedFreeHours) { consumeFreeSlot(user).catch(() => {}); }

    // Log enrollment to admin activity feed (fire-and-forget)
    logActivity(ACTIVITY_TYPES.USER_ENROLLED, {
      courseId: course._id,
      courseName: course.title,
      ceHours: course.ceHours
    }, {
      userId: req.user._id,
      userName: req.user.profile?.firstName
        ? `${req.user.profile.firstName} ${req.user.profile.lastName || ''}`.trim()
        : req.user.email,
      userEmail: req.user.email
    }).catch(err => console.error('Activity log error:', err));

    // SMS notification (fire-and-forget)
    if (twilioClient && process.env.ADMIN_PHONE) {
      twilioClient.messages.create({
        body: `CounselorReady: New enrollment\n${req.user.email} enrolled in "${course.title}"`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: process.env.ADMIN_PHONE
      }).catch(e => console.error('SMS error:', e));
    }

    res.status(201).json({ success: true, message: 'Enrolled successfully', data: progress });
  } catch (error) {
    console.error('Error enrolling in course:', error);
    res.status(500).json({ success: false, error: 'Failed to enroll in course' });
  }
});

// ============================================================================
// ASSESSMENT ROUTE
// ============================================================================

/**
 * POST /api/interactive-courses/:id/assessment
 * Submit final assessment attempt
 */
router.post('/:id/assessment', protect, async (req, res) => {
  try {
    const { answers, score, passed, attempt, timeSpent } = req.body;

    const course = await findCourseByIdOrSlug(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }

    // Normalize assessment — prefer top-level, fall back to inline isExam block
    if (!course.assessment || !course.assessment.questions?.length) {
      const inlineExam = course.sections
        ?.flatMap(s => s.contentBlocks || [])
        .find(b => b.type === 'quiz' && b.isExam === true);
      if (inlineExam) {
        course.assessment = inlineExam;
      } else {
        return res.status(404).json({ success: false, error: 'Assessment not found' });
      }
    }

    let progress = await CourseProgress.findOne({
      userId: req.user._id,
      courseId: course._id
    });

    if (!progress) {
      return res.status(403).json({ success: false, code: 'NOT_ENROLLED',
        error: 'You must enroll in this course before taking the assessment.' });
    }

    // Check attempts remaining
    if (progress.assessmentAttemptsRemaining <= 0) {
      return res.status(400).json({ success: false, error: 'No attempts remaining' });
    }

    // Calculate score from answers if not provided
    let calculatedScore = score;
    let calculatedPassed = passed;
    
    if (answers && Array.isArray(answers)) {
      let correctCount = 0;
      const questions = course.assessment.questions;
      
      answers.forEach((answer, index) => {
        const question = questions[answer.questionIndex] || questions[index];
        if (!question) return;
        
        if (question.type === 'multiSelect') {
          const correctIndices = question.options
            .map((o, idx) => o.isCorrect ? idx : -1)
            .filter(x => x >= 0);
          const selectedIndices = answer.selectedOptions || [];
          const isCorrect = correctIndices.length === selectedIndices.length &&
            correctIndices.every(idx => selectedIndices.includes(idx));
          if (isCorrect) correctCount++;
        } else {
          // multipleChoice
          const correctIndex = question.options.findIndex(o => o.isCorrect);
          if (answer.selectedOption === correctIndex) correctCount++;
        }
      });

      calculatedScore = correctCount / questions.length;
      const threshold = course.assessment.passThreshold ?? (course.assessment.passingScore != null ? course.assessment.passingScore / 100 : 0.75);
      calculatedPassed = calculatedScore >= threshold;
    }

    // Record attempt
    progress.assessmentAttempts.push({
      attemptedAt: new Date(),
      answers,
      score: Math.round(calculatedScore * 100),
      totalQuestions: course.assessment.questions.length,
      percentage: Math.round(calculatedScore * 100),
      passed: calculatedPassed,
      timeUsed: timeSpent
    });

    progress.assessmentAttemptsRemaining--;

    if (calculatedPassed) {
      progress.assessmentPassed = true;
      // Don't mark as fully completed yet - need evaluation + attestation
      recordGamification(req.user._id, 'quiz_pass');

      // Log assessment passed
      logActivity(ACTIVITY_TYPES.QUIZ_PASSED, {
        courseId: course._id,
        courseName: course.title,
        score: Math.round(calculatedScore * 100),
        passingScore: Math.round((course.assessment.passThreshold ?? 0.75) * 100),
        isAssessment: true
      }, {
        userId: req.user._id,
        userName: req.user.profile?.firstName ? `${req.user.profile.firstName} ${req.user.profile.lastName || ''}`.trim() : req.user.email,
        userEmail: req.user.email
      }).catch(() => {});
    } else {
      // Log assessment failed
      logActivity(ACTIVITY_TYPES.QUIZ_FAILED, {
        courseId: course._id,
        courseName: course.title,
        score: Math.round(calculatedScore * 100),
        passingScore: Math.round((course.assessment.passThreshold ?? 0.75) * 100),
        isAssessment: true,
        attemptsRemaining: progress.assessmentAttemptsRemaining - 1
      }, {
        userId: req.user._id,
        userName: req.user.profile?.firstName ? `${req.user.profile.firstName} ${req.user.profile.lastName || ''}`.trim() : req.user.email,
        userEmail: req.user.email
      }).catch(() => {});
    }

    // Update best score
    const currentScore = Math.round(calculatedScore * course.assessment.questions.length);
    if (!progress.bestAssessmentScore || currentScore > progress.bestAssessmentScore) {
      progress.bestAssessmentScore = currentScore;
    }

    await progress.save();

    // [REWARDS] Course completion — fire-and-forget, tiered points (25/50/75/100)
    // Service handles tier calc internally based on user.subscription/purchasedCourses
    if (calculatedPassed) {
      awardCourseCompletion(req.user._id, course, req.user)
        .then(r => {
          if (r.earned) {
            console.log(`[REWARDS] +${r.points} for course completion (${r.tier} tier) — ${course.title}`);
          }
        })
        .catch(err => console.error('[REWARDS] course completion failed:', err.message));
    }

    res.json({
      success: true,
      data: {
        score: Math.round(calculatedScore * 100),
        totalQuestions: course.assessment.questions.length,
        passed: calculatedPassed,
        attemptsRemaining: progress.assessmentAttemptsRemaining,
        bestScore: progress.bestAssessmentScore
      }
    });
  } catch (error) {
    console.error('Error submitting assessment:', error);
    res.status(500).json({ success: false, error: 'Failed to submit assessment' });
  }
});

// ============================================================================
// EVALUATION ROUTE
// ============================================================================

/**
 * POST /api/interactive-courses/:id/evaluation
 * Submit course evaluation (required for NBCC compliance)
 */
router.post('/:id/evaluation', protect, async (req, res) => {
  try {
    const { responses } = req.body;
    
    const course = await findCourseByIdOrSlug(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }

    // Check if user passed assessment
    const progress = await CourseProgress.findOne({
      userId: req.user._id,
      courseId: course._id
    });

    if (!progress || !progress.assessmentPassed) {
      return res.status(400).json({ 
        success: false, 
        error: 'You must pass the assessment before submitting evaluation' 
      });
    }

    // Check if evaluation already submitted
    let evaluation = await Evaluation.findOne({
      user: req.user._id,
      course: course._id
    });

    if (evaluation && evaluation.status === 'submitted') {
      return res.json({ 
        success: true, 
        message: 'Evaluation already submitted',
        data: { alreadySubmitted: true }
      });
    }

    // Create or update evaluation
    if (!evaluation) {
      evaluation = new Evaluation({
        user: req.user._id,
        course: course._id
      });
    }

    // Map responses to evaluation fields
    if (responses.contentQuality) {
      evaluation.ratings = evaluation.ratings || {};
      evaluation.ratings.contentQuality = parseInt(responses.contentQuality);
    }
    if (responses.relevance) {
      evaluation.ratings = evaluation.ratings || {};
      evaluation.ratings.relevance = parseInt(responses.relevance);
    }
    if (responses.presentation) {
      evaluation.ratings = evaluation.ratings || {};
      evaluation.ratings.presentation = parseInt(responses.presentation);
    }
    if (responses.engagement) {
      evaluation.ratings = evaluation.ratings || {};
      evaluation.ratings.engagement = parseInt(responses.engagement);
    }
    if (responses.learningObjectives) {
      evaluation.ratings = evaluation.ratings || {};
      evaluation.ratings.learningObjectives = parseInt(responses.learningObjectives);
    }

    // Calculate overall rating
    const ratingValues = Object.values(evaluation.ratings || {}).filter(v => v);
    if (ratingValues.length > 0) {
      evaluation.overallRating = Math.round(ratingValues.reduce((a, b) => a + b, 0) / ratingValues.length);
    }

    // Boolean fields
    if (responses.wouldRecommend !== undefined) {
      evaluation.wouldRecommend = responses.wouldRecommend === 'yes' || responses.wouldRecommend === true;
    }

    // Text feedback
    evaluation.feedback = evaluation.feedback || {};
    if (responses.whatWorkedWell) {
      evaluation.feedback.whatWorkedWell = responses.whatWorkedWell;
    }
    if (responses.suggestions) {
      evaluation.feedback.suggestions = responses.suggestions;
    }
    if (responses.additionalComments) {
      evaluation.feedback.additionalComments = responses.additionalComments;
    }

    evaluation.status = 'submitted';
    evaluation.submittedAt = new Date();

    await evaluation.save();

    // Update progress
    progress.evaluationSubmitted = true;
    progress.evaluationSubmittedAt = new Date();
    await progress.save();

    // [REWARDS] Course evaluation submitted — fire-and-forget, 5pt token (mandatory NBCC eval)
    awardCourseEvaluation(req.user._id, course._id, course.title)
      .then(r => {
        if (r.earned) {
          console.log(`[REWARDS] +${r.points} for evaluation submitted — ${course.title}`);
        }
      })
      .catch(err => console.error('[REWARDS] evaluation award failed:', err.message));

    res.json({
      success: true,
      message: 'Evaluation submitted successfully',
      data: { evaluationId: evaluation._id }
    });
  } catch (error) {
    console.error('Error submitting evaluation:', error);
    res.status(500).json({ success: false, error: 'Failed to submit evaluation' });
  }
});

// ============================================================================
// ATTESTATION ROUTE
// ============================================================================

/**
 * POST /api/interactive-courses/:id/attestation
 * Submit attestation statement (required before certificate)
 */
router.post('/:id/attestation', protect, async (req, res) => {
  try {
    const { agreed } = req.body;
    
    if (!agreed) {
      return res.status(400).json({ 
        success: false, 
        error: 'You must agree to the attestation statement' 
      });
    }

    const course = await findCourseByIdOrSlug(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }

    // Check progress
    const progress = await CourseProgress.findOne({
      userId: req.user._id,
      courseId: course._id
    });

    if (!progress) {
      return res.status(400).json({ 
        success: false, 
        error: 'Course progress not found' 
      });
    }

    if (!progress.assessmentPassed) {
      return res.status(400).json({ 
        success: false, 
        error: 'You must pass the assessment first' 
      });
    }

    // Check evaluation (optional but recommended)
    const evaluation = await Evaluation.findOne({
      user: req.user._id,
      course: course._id,
      status: 'submitted'
    });

    if (!evaluation) {
      return res.status(400).json({ 
        success: false, 
        error: 'You must complete the course evaluation first' 
      });
    }

    // Record attestation
    progress.attestationAgreed = true;
    progress.attestationAgreedAt = new Date();
    progress.status = 'completed';
    progress.completedAt = new Date();
    
    await progress.save();

    // Log course completed
    logActivity(ACTIVITY_TYPES.COURSE_COMPLETED, {
      courseId: course._id,
      courseName: course.title,
      ceHours: course.ceHours || course.ceuHours,
      completedAt: progress.completedAt
    }, {
      userId: req.user._id,
      userName: req.user.profile?.firstName ? `${req.user.profile.firstName} ${req.user.profile.lastName || ''}`.trim() : req.user.email,
      userEmail: req.user.email
    }).catch(() => {});

    // Gamification
    recordGamification(req.user._id, 'course_complete');

    res.json({
      success: true,
      message: 'Attestation recorded successfully',
      data: { 
        attestationAgreed: true,
        completedAt: progress.completedAt
      }
    });
  } catch (error) {
    console.error('Error submitting attestation:', error);
    res.status(500).json({ success: false, error: 'Failed to submit attestation' });
  }
});

// ============================================================================
// CERTIFICATE ROUTE
// ============================================================================

/**
 * POST /api/interactive-courses/:id/certificate
 * Generate and return certificate PDF
 */
router.post('/:id/certificate', protect, async (req, res) => {
  try {
    const course = await findCourseByIdOrSlug(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }

    // Check progress
    const progress = await CourseProgress.findOne({
      userId: req.user._id,
      courseId: course._id
    });

    if (!progress) {
      return res.status(400).json({ 
        success: false, 
        error: 'Course progress not found' 
      });
    }

    // Verify all requirements met
    if (!progress.assessmentPassed) {
      return res.status(400).json({ 
        success: false, 
        error: 'Assessment required',
        message: 'You must pass the assessment to receive a certificate'
      });
    }

    // Check evaluation
    const evaluation = await Evaluation.findOne({
      user: req.user._id,
      course: course._id,
      status: 'submitted'
    });

    if (!evaluation) {
      return res.status(400).json({ 
        success: false, 
        error: 'Evaluation required',
        message: 'You must complete the course evaluation to receive a certificate'
      });
    }

    if (!progress.attestationAgreed) {
      return res.status(400).json({ 
        success: false, 
        error: 'Attestation required',
        message: 'You must agree to the attestation statement to receive a certificate'
      });
    }

    // Get user info
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    // Check if certificate already exists
    let certificate = await Certificate.findOne({
      userId: req.user._id,
      courseId: course._id,
      source: 'platform'
    });

    // Generate certificate number if needed
    const certificateNumber = certificate?.certificateNumber ||
      await generateCertificateNumber(course._id, req.user._id);

    // Resolve which approval body this certificate is issued under.
    // Read from user's profile preference; falls back to 'NBCC'.
    const selectedApprovalBody = user.profile?.preferredApprovalBody || 'NBCC';
    const approvalBlock = buildApprovalBlock(course.approvals, selectedApprovalBody, course.ceHours || 1);
    const selectedApprovalEntry = Array.isArray(course.approvals)
      ? course.approvals.find(a => a.body === selectedApprovalBody)
      : null;
    const approvalProviderNumber = selectedApprovalEntry?.providerNumber || '#7760';
    const creditedHourTypes = Array.isArray(selectedApprovalEntry?.hourBreakdown) && selectedApprovalEntry.hourBreakdown.length
      ? selectedApprovalEntry.hourBreakdown.map(({ label, hours }) => ({ label, hours }))
      : [{ label: 'core', hours: course.ceHours || 1 }];

    // Generate certificate PDF buffer via ../utils/certificate.js
    const userName =
      (user.profile?.certificateName?.trim()) ||
      `${(user.profile?.firstName || '')} ${(user.profile?.lastName || '')}`.trim() ||
      user.email;
    const pdfBuffer = await generateCertificate({
      holderName: userName,
      courseName: course.title,
      completionDate: progress.completedAt || new Date(),
      ceHours: course.ceHours || 1,
      certificateNumber,
      acepNumber: 'ACEP #7760',
      ceCategory: course.ceCategory || course.contentArea || course.categories?.[0] || 'Counseling Theory/Practice and the Counseling Relationship',
      objectives: course.learningObjectives || course.objectives || [],
      approvals: approvalBlock
    });

    // Upload PDF buffer to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'raw',
          folder: 'certificates',
          public_id: `cert_${certificateNumber}_${Date.now()}`,
          format: 'pdf'
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      const readable = new Readable();
      readable.push(pdfBuffer);
      readable.push(null);
      readable.pipe(uploadStream);
    });
    const pdfUrl = uploadResult.secure_url;

    // Save certificate record if new
    if (!certificate) {
      certificate = new Certificate({
        userId: req.user._id,
        courseId: course._id,
        title: course.title,
        provider: 'Ga Integrated Therapeutic Perspectives, LLC',
        completionDate: progress.completedAt || new Date(),
        ceHours: course.ceHours || 1,
        category: course.categories?.[0] || 'Core',
        nbccApproved: true,
        acepNumber: course.acepNumber || '7760',
        approvingBody: selectedApprovalBody,
        approvalNumber: approvalProviderNumber,
        selectedApprovalBody,
        approvalProviderNumber,
        creditedHourTypes,
        certificateNumber,
        source: 'platform',
        fileUrl: pdfUrl
      });
      await certificate.save();

      // Update progress with certificate reference
      progress.certificateId = certificate._id;
      if (course.bonusResource?.unlockedOnCompletion && course.bonusResource?.type === 'reference_guide') {
        const toolKey = course.bonusResource.toolKey || course.slug + '-tool';
        const toolUser = await User.findById(req.user._id);
        if (toolUser) {
          const alreadyUnlocked = (toolUser.unlockedTools || []).some(t => t.toolKey === toolKey);
          if (!alreadyUnlocked) {
            await User.findByIdAndUpdate(req.user._id, {
              $push: { unlockedTools: {
                toolKey,
                unlockedAt: new Date(),
                courseId: course._id,
                expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
              }}
            });
            console.log(`[ToolUnlock] User ${req.user._id} unlocked tool: ${toolKey}`);
          }
        }
      }
      progress.certificateIssuedAt = new Date();
      progress.status = 'certified';
      await progress.save();

      // Log certificate generated
      logActivity(ACTIVITY_TYPES.CERTIFICATE_GENERATED, {
        courseId: course._id,
        courseName: course.title,
        ceHours: course.ceHours || course.ceuHours,
        certificateNumber
      }, {
        userId: req.user._id,
        userName: user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user.email,
        userEmail: user.email
      }).catch(() => {});

      // Auto-allocate CE hours to user's credentials
      try {
        const userCredentials = await UserCredential.find({ userId: req.user._id });
        for (const cred of userCredentials) {
          const alreadyLogged = cred.ceuLogs.some(log =>
            log.certificateId && log.certificateId.toString() === certificate._id.toString()
          );
          if (alreadyLogged) continue;

          cred.ceuLogs.push({
            date: certificate.completionDate || new Date(),
            hours: certificate.ceHours || 0,
            category: certificate.category || 'General',
            source: 'internal',
            certificateId: certificate._id,
            courseId: course._id,
            description: certificate.title,
            provider: 'CounselorReady'
          });

          // Recalculate totals
          cred.totalCEUsCompleted = cred.ceuLogs.reduce((sum, log) => sum + (log.hours || 0), 0);
          for (const req of cred.requirements) {
            const catLogs = cred.ceuLogs.filter(log =>
              log.category?.toLowerCase() === req.category?.toLowerCase()
            );
            req.hoursCompleted = Math.min(
              req.hoursRequired,
              catLogs.reduce((sum, log) => sum + (log.hours || 0), 0)
            );
          }
          await cred.save();
        }
      } catch (syncErr) {
        console.error('CE auto-allocation error (non-fatal):', syncErr.message);
      }

      // Record gamification: course complete + certificate earned
      recordGamification(req.user._id, 'course_complete', { ceHours: course.ceHours || 1 });
      recordGamification(req.user._id, 'certificate_earned');

      // [REWARDS] Certificate earned — fire-and-forget, 25pt, dedup'd per user×course
      awardCertificate(req.user._id, course._id, course.title)
        .then(r => {
          if (r.earned) {
            console.log(`[REWARDS] +${r.points} for certificate earned — ${course.title}`);
          }
        })
        .catch(err => console.error('[REWARDS] certificate award failed:', err.message));

      // Check and send free-tier limit email
      checkAndSendFreeLimit(req.user._id).catch(err =>
        console.error('Free limit email check error (non-fatal):', err.message)
      );
    } else {
      // Existing certificate — update fileUrl and approval fields
      certificate.fileUrl = pdfUrl;
      certificate.selectedApprovalBody = selectedApprovalBody;
      certificate.approvalProviderNumber = approvalProviderNumber;
      certificate.creditedHourTypes = creditedHourTypes;
      await certificate.save();
    }

    // Return JSON (PDF is served via GET /certificates/:id/serve)
    res.json({
      success: true,
      certificateId: certificate._id,
      fileUrl: certificate.fileUrl,
      message: 'Certificate generated successfully'
    });

  } catch (error) {
    console.error('Error generating certificate:', error);
    res.status(500).json({ success: false, error: 'Failed to generate certificate' });
  }
});

/**
 * GET /api/interactive-courses/:id/certificate/check
 * Check certificate eligibility status
 */
router.get('/:id/certificate/check', protect, async (req, res) => {
  try {
    const course = await findCourseByIdOrSlug(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }

    const progress = await CourseProgress.findOne({
      userId: req.user._id,
      courseId: course._id
    });

    const evaluation = await Evaluation.findOne({
      user: req.user._id,
      course: course._id
    });

    const certificate = await Certificate.findOne({
      userId: req.user._id,
      courseId: course._id,
      source: 'platform'
    });

    res.json({
      success: true,
      data: {
        eligible: progress?.attestationAgreed && progress?.assessmentPassed && evaluation?.status === 'submitted',
        requirements: {
          sectionsCompleted: progress?.sectionProgress?.every(s => s.status === 'completed') || false,
          assessmentPassed: progress?.assessmentPassed || false,
          evaluationCompleted: evaluation?.status === 'submitted',
          attestationAgreed: progress?.attestationAgreed || false
        },
        certificate: certificate ? {
          certificateNumber: certificate.certificateNumber,
          verificationCode: certificate.verificationCode,
          issuedAt: certificate.createdAt
        } : null
      }
    });
  } catch (error) {
    console.error('Error checking certificate eligibility:', error);
    res.status(500).json({ success: false, error: 'Failed to check eligibility' });
  }
});

// ============================================================================
// ADDITIONAL PROGRESS ROUTES
// ============================================================================

/**
 * PUT /api/interactive-courses/:id/progress/section/:sectionIndex
 * Update section progress
 */
router.put('/:id/progress/section/:sectionIndex', protect, async (req, res) => {
  try {
    const { sectionIndex } = req.params;
    const { viewedBlocks, completedBlocks, timeSpent } = req.body;

    const course = await findCourseByIdOrSlug(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }

    const progress = await CourseProgress.findOne({
      userId: req.user._id,
      courseId: course._id
    });

    if (!progress) {
      return res.status(404).json({ success: false, error: 'Not enrolled in this course' });
    }

    const sectionProgress = progress.sectionProgress[sectionIndex];
    if (!sectionProgress) {
      return res.status(404).json({ success: false, error: 'Section not found' });
    }

    // Update viewed blocks (merge with existing)
    if (viewedBlocks) {
      sectionProgress.viewedBlocks = [...new Set([...sectionProgress.viewedBlocks, ...viewedBlocks])];
    }

    // Update completed blocks (merge with existing)
    if (completedBlocks) {
      sectionProgress.completedBlocks = [...new Set([...sectionProgress.completedBlocks, ...completedBlocks])];
    }

    // Update time spent
    if (timeSpent) {
      sectionProgress.timeSpent = (sectionProgress.timeSpent || 0) + timeSpent;
      progress.totalTimeSpent = (progress.totalTimeSpent || 0) + timeSpent;
    }

    // Update status
    if (!sectionProgress.startedAt) {
      sectionProgress.startedAt = new Date();
      const isFirstStart = !progress.startedAt;
      progress.startedAt = progress.startedAt || new Date();
      progress.status = 'in_progress';

      // Log course started on very first section access
      if (isFirstStart) {
        logActivity(ACTIVITY_TYPES.COURSE_STARTED, {
          courseId: course._id,
          courseName: course.title,
          ceHours: course.ceHours || course.ceuHours
        }, {
          userId: req.user._id,
          userName: req.user.profile?.firstName ? `${req.user.profile.firstName} ${req.user.profile.lastName || ''}`.trim() : req.user.email,
          userEmail: req.user.email
        }).catch(() => {});
      }
    }
    sectionProgress.status = 'in_progress';

    // Check if section is complete - either all blocks viewed OR explicit completion sent
    const section = course.sections[sectionIndex];
    const totalBlocks = section.contentBlocks?.length || 0;
    const allBlocksViewed = sectionProgress.viewedBlocks.length >= totalBlocks;
    const explicitComplete = req.body.status === 'completed';

    if (allBlocksViewed || explicitComplete) {
      sectionProgress.status = 'completed';
      sectionProgress.completedAt = sectionProgress.completedAt || new Date();

      try {
        if (global.posthog) {
          global.posthog.capture({
            distinctId: req.user._id.toString(),
            event: 'section_completed',
            properties: {
              courseId: course._id.toString(),
              courseTitle: course.title,
              sectionIndex: parseInt(sectionIndex),
              sectionTitle: section.title || `Section ${parseInt(sectionIndex) + 1}`,
              timeSpentSeconds: sectionProgress.timeSpent || 0
            }
          });
        }
      } catch (phErr) { console.error('PostHog section_completed failed:', phErr); }
      // Log section completion (fire-and-forget)
      logActivity(ACTIVITY_TYPES.LESSON_COMPLETED, {
        courseId: course._id,
        courseName: course.title,
        lessonName: section.title || `Section ${parseInt(sectionIndex) + 1}`,
        sectionIndex: parseInt(sectionIndex)
      }, {
        notifyAdmin: false,
        userId: req.user._id,
        userName: req.user.profile?.firstName ? `${req.user.profile.firstName} ${req.user.profile.lastName || ''}`.trim() : req.user.email,
        userEmail: req.user.email
      }).catch(() => {});
    }

    progress.lastAccessedAt = new Date();
    progress.currentSectionIndex = parseInt(sectionIndex);
    
    if (progress.calculateOverallProgress) {
      progress.overallProgress = progress.calculateOverallProgress();
    }
    
    await progress.save();

    res.json({ success: true, data: progress });
  } catch (error) {
    console.error('Error updating section progress:', error);
    res.status(500).json({ success: false, error: 'Failed to update progress' });
  }
});

// ============================================================================
// SECTION QUIZ ROUTE
// ============================================================================

/**
 * POST /api/interactive-courses/:id/progress/section/:sectionIndex/quiz
 * Submit section quiz attempt
 */
router.post('/:id/progress/section/:sectionIndex/quiz', protect, async (req, res) => {
  try {
    const { sectionIndex } = req.params;
    const { answers, timeSpent } = req.body;

    const course = await findCourseByIdOrSlug(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }

    const section = course.sections[sectionIndex];
    if (!section || !section.hasQuiz) {
      return res.status(404).json({ success: false, error: 'Quiz not found' });
    }

    const progress = await CourseProgress.findOne({
      userId: req.user._id,
      courseId: course._id
    });

    if (!progress) {
      return res.status(404).json({ success: false, error: 'Not enrolled in this course' });
    }

    // Calculate score
    let correctCount = 0;
    section.quizQuestions.forEach((q, i) => {
      const selectedOption = answers[i];
      if (selectedOption !== undefined) {
        if (q.type === 'multiSelect' || q.type === 'multiple_select') {
          const correctIndices = q.options.map((o, idx) => o.isCorrect ? idx : -1).filter(x => x >= 0);
          const selectedIndices = Array.isArray(selectedOption) ? selectedOption : [selectedOption];
          const isCorrect = correctIndices.length === selectedIndices.length &&
            correctIndices.every(idx => selectedIndices.includes(idx));
          if (isCorrect) correctCount++;
        } else {
          if (q.options[selectedOption]?.isCorrect) correctCount++;
        }
      }
    });

    const totalQuestions = section.quizQuestions.length;
    const score = correctCount / totalQuestions;
    const passed = score >= (section.quizPassThreshold || 0.8);

    // Record attempt
    const sectionProgress = progress.sectionProgress[sectionIndex];
    sectionProgress.quizAttempts.push({
      attemptedAt: new Date(),
      answers,
      score: correctCount,
      totalQuestions,
      passed,
      timeSpent
    });

    if (passed) {
      sectionProgress.quizPassed = true;
      recordGamification(req.user._id, 'quiz_pass');

      // Log quiz passed
      logActivity(ACTIVITY_TYPES.QUIZ_PASSED, {
        courseId: course._id,
        courseName: course.title,
        sectionName: section.title || `Section ${parseInt(sectionIndex) + 1}`,
        score: Math.round(score * 100),
        passingScore: Math.round((section.quizPassThreshold || 0.8) * 100)
      }, {
        userId: req.user._id,
        userName: req.user.profile?.firstName ? `${req.user.profile.firstName} ${req.user.profile.lastName || ''}`.trim() : req.user.email,
        userEmail: req.user.email
      }).catch(() => {});
    } else {
      // Log quiz failed
      logActivity(ACTIVITY_TYPES.QUIZ_FAILED, {
        courseId: course._id,
        courseName: course.title,
        sectionName: section.title || `Section ${parseInt(sectionIndex) + 1}`,
        score: Math.round(score * 100),
        passingScore: Math.round((section.quizPassThreshold || 0.8) * 100)
      }, {
        userId: req.user._id,
        userName: req.user.profile?.firstName ? `${req.user.profile.firstName} ${req.user.profile.lastName || ''}`.trim() : req.user.email,
        userEmail: req.user.email
      }).catch(() => {});
    }

    // Update best score
    if (!sectionProgress.bestQuizScore || correctCount > sectionProgress.bestQuizScore) {
      sectionProgress.bestQuizScore = correctCount;
    }

    // Check if section is now complete
    const totalBlocks = section.contentBlocks?.length || 0;
    const interactiveBlocks = (section.contentBlocks || [])
      .map((b, i) => ['matching', 'multipleChoice', 'multiSelect'].includes(b.type) ? i : -1)
      .filter(i => i >= 0);
    
    const allBlocksViewed = sectionProgress.viewedBlocks.length >= totalBlocks;
    const allInteractiveComplete = interactiveBlocks.every(i => sectionProgress.completedBlocks.includes(i));

    if (allBlocksViewed && allInteractiveComplete && sectionProgress.quizPassed) {
      sectionProgress.status = 'completed';
      sectionProgress.completedAt = new Date();
    }

    if (progress.calculateOverallProgress) {
      progress.overallProgress = progress.calculateOverallProgress();
    }
    await progress.save();

    res.json({
      success: true,
      score: correctCount,
      totalQuestions,
      percentage: Math.round(score * 100),
      passed,
      attemptsCount: sectionProgress.quizAttempts.length,
      bestScore: sectionProgress.bestQuizScore,
      sectionCompleted: sectionProgress.status === 'completed'
    });
  } catch (error) {
    console.error('Error submitting quiz:', error);
    res.status(500).json({ success: false, error: 'Failed to submit quiz' });
  }
});

// ============================================================================
// INTERACTION LOGGING ROUTE
// ============================================================================

/**
 * POST /api/interactive-courses/:id/progress/interaction
 * Log content interaction for analytics
 */
router.post('/:id/progress/interaction', protect, async (req, res) => {
  try {
    const { sectionIndex, blockIndex, blockType, action, isCorrect, selectedOptions, score, timeSpent } = req.body;

    const course = await findCourseByIdOrSlug(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }

    // Get attempt number for this block
    const existingAttempts = await ContentInteraction.countDocuments({
      userId: req.user._id,
      courseId: course._id,
      sectionIndex,
      blockIndex,
      action: 'answer'
    });

    const interaction = new ContentInteraction({
      userId: req.user._id,
      courseId: course._id,
      sectionIndex,
      blockIndex,
      blockType,
      action,
      isCorrect,
      selectedOptions,
      score,
      attemptNumber: action === 'answer' ? existingAttempts + 1 : undefined,
      timeSpent
    });

    await interaction.save();
    res.status(201).json({ success: true });
  } catch (error) {
    console.error('Error logging interaction:', error);
    res.status(500).json({ success: false, error: 'Failed to log interaction' });
  }
});

// ============================================================================
// ADMIN: Update course metadata (delivery format, content areas, access type)
// ============================================================================
router.patch('/:id/metadata', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Admin access required' });
    }

    const allowedFields = [
      'deliveryFormat', 'nbccContentAreas', 'accessType', 
      'approvalBody', 'price', 'level', 'targetAudience'
    ];
    const updates = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ success: false, error: 'No valid fields to update' });
    }

    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!course) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }

    res.json({ success: true, data: course });
  } catch (error) {
    console.error('Error updating course metadata:', error);
    res.status(500).json({ success: false, error: 'Failed to update course metadata' });
  }
});

// Admin-only middleware
const adminOnly = async (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// Duplicate a course (admin only)
router.post('/:id/duplicate', protect, adminOnly, async (req, res) => {
  try {
    const original = await Course.findById(req.params.id).lean();
    if (!original) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const { _id, __v, createdAt, updatedAt, slug, enrollmentCount, ...courseData } = original;

    let baseSlug = (original.slug || original.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')) + '-copy';
    let newSlug = baseSlug;
    let counter = 1;
    while (await Course.exists({ slug: newSlug })) {
      counter++;
      newSlug = `${baseSlug}-${counter}`;
    }

    const duplicate = await Course.create({
      ...courseData,
      title: `${original.title} (Copy)`,
      slug: newSlug,
      status: 'draft',
      isPublished: false,
      enrollmentCount: 0,
    });

    res.status(201).json({
      success: true,
      data: duplicate,
      message: `Duplicated as "${duplicate.title}"`
    });
  } catch (error) {
    console.error('Duplicate course error:', error);
    res.status(500).json({ error: 'Failed to duplicate course', details: error.message });
  }
});

export default router;
