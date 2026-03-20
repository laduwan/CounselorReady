/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
// routes/interactiveCourseRoutes.js
// Interactive course routes for CounselorReady
// Includes: Course viewing, Progress tracking, Assessment, Evaluation, Attestation, Certificate
// =============================================

import express from 'express';
import mongoose from 'mongoose';
import { Course, CourseProgress, ContentInteraction } from '../models/InteractiveCourse.js';
import Certificate from '../models/Certificate.js';
import Evaluation from '../models/Evaluation.js';
import User from '../models/User.js';
import { protect, optionalAuth } from '../middleware/auth.js';
import { attachTenantScope } from '../middleware/tenantScope.js';
import { logActivity, ACTIVITY_TYPES } from '../services/activityTrackingService.js';
import { sendEnrollmentSMS, sendCompletionSMS } from '../services/smsService.js';
import { generateCertificate, generateCertificateNumber } from '../utils/certificate.js';

const router = express.Router();

// Apply tenant scoping to all routes — populates req.tenantFilter
// Note: For unauthenticated routes this sets a default filter.
// For protected routes, we re-run attachTenantScope AFTER protect
// so that req.user.partnerId is available for proper partner isolation.
router.use(attachTenantScope);

// Combined middleware: authenticate first, then re-scope with user context
const protectAndScope = [protect, attachTenantScope];

/**
 * Helper: resolve course by ObjectId or slug, respecting tenant scope.
 * Partner users can see platform courses (no partnerId) + their own partner's courses.
 * Admins and non-partner users see all courses.
 * Falls back to the legacy "courses" collection when not found in interactivecourses.
 */
async function findCourseByIdOrSlug(param, tenantFilter = {}) {
  const partnerConditions = tenantFilter.partnerId
    ? [{ partnerId: { $exists: false } }, { partnerId: null }, { partnerId: tenantFilter.partnerId }]
    : null;

  let query;
  if (mongoose.Types.ObjectId.isValid(param)) {
    query = partnerConditions
      ? { $and: [{ _id: param }, { $or: partnerConditions }] }
      : { _id: param };
  } else {
    const slugConditions = [{ slug: param }, { courseCode: param }];
    query = partnerConditions
      ? { $and: [{ $or: slugConditions }, { $or: partnerConditions }] }
      : { $or: slugConditions };
  }

  return Course.findOne(query);
}

/**
 * Helper: strip learning content for unauthenticated or unenrolled users.
 * Returns full course for admins and enrolled users; metadata-only preview otherwise.
 */
async function gateContent(courseObj, user) {
  // No user — preview mode
  if (!user) return stripContent(courseObj);
  // Admins always get full content
  if (user.role === 'admin') return courseObj;
  // Check enrollment
  const progress = await CourseProgress.findOne({
    userId: user._id,
    courseId: courseObj._id
  });
  if (progress) {
    // Enrolled — check access tier
    const courseTier = courseObj.accessType || courseObj.pricingTier || 'free';
    if (courseTier === 'free') return courseObj;
    const userTier = user.subscription?.plan || 'free';
    const userStatus = user.subscription?.status;
    if (userStatus === 'active') {
      const tierLevels = { free: 0, starter: 1, professional: 2, vip: 3 };
      if ((tierLevels[userTier] || 0) >= (tierLevels[courseTier] || 0)) {
        return courseObj;
      }
    }
    // Check individual purchase
    if (progress.purchased) return courseObj;
  }
  // Not enrolled or insufficient tier — return preview
  return stripContent(courseObj);
}
/**
 * Strip contentBlocks and assessment questions for preview mode.
 * Keeps metadata, section titles, and sectionDivider blocks for nav rendering.
 */
function stripContent(courseObj) {
  if (courseObj.sections) {
    courseObj.sections = courseObj.sections.map(section => ({
      title: section.title,
      _id: section._id,
      order: section.order,
      contentBlocks: (section.contentBlocks || [])
        .filter(block => block.type === 'sectionDivider')
        .map(block => ({
          type: block.type,
          title: block.title,
          subtitle: block.subtitle,
          sectionNumber: block.sectionNumber
        }))
    }));
  }
  if (courseObj.assessment) {
    courseObj.assessment = {
      questionCount: courseObj.assessment.questions?.length || 0,
      passingScore: courseObj.assessment.passingScore,
      passThreshold: courseObj.assessment.passThreshold,
      maxAttempts: courseObj.assessment.maxAttempts || courseObj.assessment.attemptsAllowed,
      questions: []
    };
  }
  delete courseObj.rawMarkdown;
  courseObj._isPreview = true;
  return courseObj;
}

// ============================================================================
// COURSE ROUTES
// ============================================================================

/**
 * GET /api/interactive-courses
 * List all published courses with optional filtering
 */
router.get('/', optionalAuth, async (req, res) => {
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
    // Allow status=all to return everything (needed by admin dashboard)
    if (status && status !== 'all') {
      query.status = status;
    }

    if (category) query.categories = category;
    if (tag) query.tags = tag;

    const conditions = [];

    // Search filter
    if (search) {
      conditions.push({
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ]
      });
    }

    // Tenant scoping via middleware — partner users see platform + own courses
    if (req.tenantFilter?.partnerId) {
      conditions.push({
        $or: [
          { partnerId: { $exists: false } },
          { partnerId: null },
          { partnerId: req.tenantFilter.partnerId }
        ]
      });
    }

    if (conditions.length > 0) {
      query.$and = conditions;
    }

    const isAdmin = req.user?.role === 'admin';

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    const selectFields = 'title slug description thumbnail ceHours totalEstimatedTime categories tags wordCount totalContentBlocks totalQuizQuestions acepNumber accessType price pricingTier status courseCode';

    const [courses, total] = await Promise.all([
      Course.find(query)
        .select(selectFields)
        .sort({ publishedAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .lean(),
      Course.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: courses,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch courses' });
  }
});

/**
 * GET /api/interactive-courses/slug/:slug
 * Get full course details by slug
 */
router.get('/slug/:slug', optionalAuth, async (req, res) => {
  try {
    const course = await findCourseByIdOrSlug(req.params.slug, req.tenantFilter);

    if (!course) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }

    // Content gating: check if user has access to full content
    const courseObj = course.toObject ? course.toObject() : { ...course };
    const gatedResponse = await gateContent(courseObj, req.user);
    res.json({ success: true, data: gatedResponse });
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch course' });
  }
});

/**
 * GET /api/interactive-courses/user/my-courses
 * Get all courses user is enrolled in with progress
 * NOTE: Must be defined BEFORE /:id catch-all route
 */
router.get('/user/my-courses', ...protectAndScope, async (req, res) => {
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
 * Get full course details by ID
 */
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const course = await findCourseByIdOrSlug(req.params.id, req.tenantFilter);

    if (!course) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }

    // Content gating: check if user has access to full content
    const courseObj = course.toObject ? course.toObject() : { ...course };
    const gatedResponse = await gateContent(courseObj, req.user);
    res.json({ success: true, data: gatedResponse });
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch course' });
  }
});

/**
 * PUT /api/interactive-courses/:id
 * Update course fields (publish/unpublish, metadata, etc.)
 * Syncs status and isPublished to prevent dual-field desync
 */
router.put('/:id', ...protectAndScope, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, error: 'Invalid ID' });
    }
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }

    const updates = req.body;

    // Sync dual publish fields — if either is set, sync the other
    if (updates.status === 'published' || updates.isPublished === true) {
      updates.status = 'published';
      updates.isPublished = true;
      if (!course.publishedAt) updates.publishedAt = new Date();
    } else if (updates.status === 'draft' || updates.isPublished === false) {
      updates.status = 'draft';
      updates.isPublished = false;
    }

    updates.updatedAt = new Date();

    const updated = await Course.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    res.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({ success: false, error: 'Failed to update course' });
  }
});

// ============================================================================
// PROGRESS ROUTES (Protected)
// ============================================================================

/**
 * GET /api/interactive-courses/:id/progress
 * Get user's progress for a specific course
 */
router.get('/:id/progress', ...protectAndScope, async (req, res) => {
  try {
    const course = await findCourseByIdOrSlug(req.params.id, req.tenantFilter);
    if (!course) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }

    let progress = await CourseProgress.findOne({
      userId: req.user._id,
      courseId: course._id
    });

    // If no progress exists, create initial progress
    if (!progress) {
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
        assessmentAttemptsRemaining: course.assessment?.attemptsAllowed || 3
      });
      await progress.save();
    }

    res.json({ success: true, data: progress });
  } catch (error) {
    console.error('Error fetching progress:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch progress' });
  }
});

/**
 * POST /api/interactive-courses/:id/enroll
 * Enroll user in a course
 */
router.post('/:id/enroll', ...protectAndScope, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, error: 'Invalid ID' });
    }
    const course = await Course.findOne({ _id: req.params.id, status: 'published' });
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

    // Create new enrollment (include partnerId from course or user for analytics scoping)
    progress = new CourseProgress({
      userId: req.user._id,
      courseId: course._id,
      partnerId: course.partnerId || req.user.partnerId || undefined,
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
    sendEnrollmentSMS(req.user, course).catch(e => console.error('[SMS]', e.message));

    logActivity(ACTIVITY_TYPES.USER_ENROLLED, {
      courseName: course.title,
      courseId: course._id,
      ceHours: course.ceHours
    }, {
      userId: req.user._id,
      userName: `${req.user.profile?.firstName || ''} ${req.user.profile?.lastName || ''}`.trim(),
      userEmail: req.user.email,
      notifyAdmin: true
    }).catch(() => {});

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
 * POST /api/interactive-courses/:id/progress/assessment
 * POST /api/interactive-courses/:id/assessment  (alias — legacy client path)
 * Submit final assessment attempt
 */
router.post(['/:id/progress/assessment', '/:id/assessment'], ...protectAndScope, async (req, res) => {
  try {
    const { answers, timeUsed, questionOrder } = req.body;

    const course = await findCourseByIdOrSlug(req.params.id, req.tenantFilter);
    if (!course) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }
    // Normalize: extract assessment from inline isExam content blocks if top-level is empty
    if (!course.assessment || !course.assessment.questions || course.assessment.questions.length === 0) {
      const inlineQuestions = [];
      let inlineSettings = {};
      const sections = course.sections || course.modules || [];
      for (const section of sections) {
        const blocks = section.contentBlocks || section.blocks || section.lessons || [];
        for (const block of blocks) {
          if (block.isExam === true) {
            if (block.questions) inlineQuestions.push(...block.questions);
            if (block.passingScore) inlineSettings.passingScore = block.passingScore;
            if (block.passThreshold) inlineSettings.passThreshold = block.passThreshold;
            if (block.maxAttempts) inlineSettings.maxAttempts = block.maxAttempts;
          }
        }
      }
      if (inlineQuestions.length > 0) {
        console.warn(`[Assessment Fallback] Course "${course.title || course._id}" has no top-level assessment. Extracted ${inlineQuestions.length} questions from inline isExam blocks.`);
        course.assessment = {
          questions: inlineQuestions,
          passingScore: inlineSettings.passingScore || course.assessment?.passingScore || 80,
          passThreshold: inlineSettings.passThreshold || course.assessment?.passThreshold || 0.8,
          maxAttempts: inlineSettings.maxAttempts || course.assessment?.maxAttempts || 3,
          attemptsAllowed: inlineSettings.maxAttempts || course.assessment?.attemptsAllowed || 3,
          isExam: true
        };
      }
    }
    if (!course.assessment || !course.assessment.questions || course.assessment.questions.length === 0) {
      return res.status(404).json({ success: false, error: 'Assessment not found' });
    }

    let progress = await CourseProgress.findOne({
      userId: req.user._id,
      courseId: course._id
    });

    if (!progress) {
      // Auto-create progress if not exists
      progress = new CourseProgress({
        userId: req.user._id,
        courseId: course._id,
        sectionProgress: course.sections.map((section, index) => ({
          sectionId: section._id,
          sectionIndex: index,
          viewedBlocks: [],
          completedBlocks: [],
          quizAttempts: [],
          status: 'completed'
        })),
        assessmentAttemptsRemaining: course.assessment?.attemptsAllowed || 3
      });
    }

    // Check attempts remaining
    if (progress.assessmentAttemptsRemaining <= 0) {
      return res.status(400).json({ success: false, error: 'No attempts remaining' });
    }

    // Calculate score — answers is always an object { "0": optIdx, "1": optIdx }
    let correctCount = 0;
    const questions = course.assessment.questions;

    if (answers && typeof answers === 'object') {
      const entries = Array.isArray(answers)
        ? answers.map((a, i) => [String(a.questionIndex ?? i), a.selectedOption ?? a])
        : Object.entries(answers);

      for (const [qIdx, selectedOpt] of entries) {
        const actualIndex = questionOrder ? questionOrder[qIdx] : parseInt(qIdx);
        const question = questions[actualIndex];
        if (!question) continue;

        if (question.type === 'multiSelect' || question.type === 'multiple_select') {
          const correctIndices = question.options.map((o, idx) => o.isCorrect ? idx : -1).filter(x => x >= 0);
          const selectedIndices = Array.isArray(selectedOpt) ? selectedOpt : [selectedOpt];
          const isCorrect = correctIndices.length === selectedIndices.length &&
            correctIndices.every(idx => selectedIndices.includes(idx));
          if (isCorrect) correctCount++;
        } else {
          // multipleChoice / trueFalse — check by index
          if (question.options[selectedOpt]?.isCorrect) correctCount++;
        }
      }
    }

    const totalQuestions = questions.length;
    const percentage = totalQuestions > 0 ? correctCount / totalQuestions : 0;
    const passed = percentage >= (course.assessment.passThreshold || 0.8);

    // Record attempt
    progress.assessmentAttempts.push({
      attemptedAt: new Date(),
      answers,
      score: correctCount,
      totalQuestions,
      percentage: Math.round(percentage * 100),
      passed,
      timeUsed,
      questionOrder
    });

    progress.assessmentAttemptsRemaining--;

    if (passed) {
      progress.assessmentPassed = true;
    }

    // Update best score
    if (!progress.bestAssessmentScore || correctCount > progress.bestAssessmentScore) {
      progress.bestAssessmentScore = correctCount;
    }

    // Recalculate overall progress
    if (progress.calculateOverallProgress) {
      progress.overallProgress = progress.calculateOverallProgress();
    }

    await progress.save();

    logActivity(passed ? ACTIVITY_TYPES.QUIZ_PASSED : ACTIVITY_TYPES.QUIZ_FAILED, {
      courseName: course.title,
      courseId: course._id,
      score: Math.round(percentage * 100),
      passingScore: Math.round((course.assessment.passThreshold || 0.8) * 100)
    }, {
      userId: req.user._id,
      userName: `${req.user.profile?.firstName || ''} ${req.user.profile?.lastName || ''}`.trim(),
      userEmail: req.user.email,
      notifyAdmin: passed
    }).catch(() => {});

    res.json({
      success: true,
      data: {
        score: correctCount,
        percentage: Math.round(percentage * 100),
        totalQuestions,
        passed,
        attemptsRemaining: progress.assessmentAttemptsRemaining,
        bestScore: progress.bestAssessmentScore
      }
    });
  } catch (error) {
    console.error('Error submitting assessment:', error.message, error.stack);
    res.status(500).json({ success: false, error: 'Failed to submit assessment', debug: error.message });
  }
});

// ============================================================================
// EVALUATION ROUTE
// ============================================================================

/**
 * POST /api/interactive-courses/:id/evaluation
 * Submit course evaluation (required for NBCC compliance)
 */
router.post('/:id/evaluation', ...protectAndScope, async (req, res) => {
  try {
    const { responses } = req.body;
    
    const course = await findCourseByIdOrSlug(req.params.id, req.tenantFilter);
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
router.post('/:id/attestation', ...protectAndScope, async (req, res) => {
  try {
    const { agreed } = req.body;
    
    if (!agreed) {
      return res.status(400).json({ 
        success: false, 
        error: 'You must agree to the attestation statement' 
      });
    }

    const course = await findCourseByIdOrSlug(req.params.id, req.tenantFilter);
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
router.post('/:id/certificate', ...protectAndScope, async (req, res) => {
  try {
    const course = await findCourseByIdOrSlug(req.params.id, req.tenantFilter);
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
      generateCertificateNumber(course._id, req.user._id);

    // Generate PDF
    const pdfBuffer = await generateCertificate({
      studentName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email,
      courseTitle: course.title,
      ceHours: course.ceHours || 1,
      ceCategory: course.categories?.[0] || 'Core',
      completionDate: progress.completedAt || new Date(),
      certificateNumber,
      objectives: course.objectives || [],
      approvingBody: 'NBCC',
      approvalNumber: course.acepNumber || '#7760',
      verificationCode: certificate?.verificationCode
    });

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
        approvingBody: 'NBCC',
        approvalNumber: course.acepNumber || '#7760',
        certificateNumber,
        source: 'platform'
      });
      await certificate.save();

      // Update progress with certificate reference
      progress.certificateId = certificate._id;
      progress.certificateIssuedAt = new Date();
      progress.status = 'certified';
      await progress.save();

      // Send completion SMS
      sendCompletionSMS(req.user, course, certificate).catch(e => console.error('[SMS]', e.message));

      // ── AUTO-APPLY CE HOURS TO USER'S CREDENTIALS ──
      try {
        const UserCredential = (await import('../models/UserCredential.js')).default;
        const userCredentials = await UserCredential.find({
          userId: req.user._id,
          status: { $in: ['active', 'expiring_soon'] }
        });

        for (const credential of userCredentials) {
          try {
            await credential.addCEU({
              certificateId: certificate._id,
              courseId: course._id,
              hours: course.ceHours || 1,
              category: course.categories?.[0] || 'General',
              description: `${course.title} - CounselorReady Course`,
              provider: 'CounselorReady',
              date: progress.completedAt || new Date(),
              source: 'internal'
            });
            console.log(`Applied ${course.ceHours || 1} CE hours to credential: ${credential.name || credential._id}`);
          } catch (credError) {
            console.error(`Error applying CEUs to credential ${credential._id}:`, credError.message);
          }
        }
      } catch (credentialError) {
        console.error('Error auto-applying CE hours:', credentialError.message);
        // Non-fatal — certificate was already generated successfully
      }

      // Notify admin of certificate generation
      const certUser = await User.findById(req.user._id).select('email profile.firstName profile.lastName');
      logActivity(ACTIVITY_TYPES.CERTIFICATE_GENERATED, {
        courseName: course.title,
        certificateNumber,
        ceHours: course.ceHours || 1
      }, {
        userId: req.user._id,
        userName: `${certUser?.profile?.firstName || ''} ${certUser?.profile?.lastName || ''}`.trim() || certUser?.email,
        userEmail: certUser?.email || ''
      }).catch(() => {});
    }

    // Send PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${course.slug || course._id}_certificate.pdf"`);
    res.send(pdfBuffer);

  } catch (error) {
    console.error('Error generating certificate:', error);
    res.status(500).json({ success: false, error: 'Failed to generate certificate' });
  }
});

/**
 * GET /api/interactive-courses/:id/certificate/check
 * Check certificate eligibility status
 */
router.get('/:id/certificate/check', ...protectAndScope, async (req, res) => {
  try {
    const course = await findCourseByIdOrSlug(req.params.id, req.tenantFilter);
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
router.put('/:id/progress/section/:sectionIndex', ...protectAndScope, async (req, res) => {
  try {
    const { sectionIndex } = req.params;
    const { viewedBlocks, completedBlocks, timeSpent } = req.body;

    const course = await findCourseByIdOrSlug(req.params.id, req.tenantFilter);
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
      progress.startedAt = progress.startedAt || new Date();
      progress.status = 'in_progress';
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
router.post('/:id/progress/section/:sectionIndex/quiz', ...protectAndScope, async (req, res) => {
  try {
    const { sectionIndex } = req.params;
    const { answers, timeSpent } = req.body;

    const course = await findCourseByIdOrSlug(req.params.id, req.tenantFilter);
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
router.post('/:id/progress/interaction', ...protectAndScope, async (req, res) => {
  try {
    const { sectionIndex, blockIndex, blockType, action, isCorrect, selectedOptions, score, timeSpent } = req.body;

    const course = await findCourseByIdOrSlug(req.params.id, req.tenantFilter);
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

export default router;

// Test-only exports
export { gateContent as _gateContent, stripContent as _stripContent };
