/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
// routes/courseRoutes.js
// Interactive course routes for CounselorReady
// =============================================

import express from 'express';
import mongoose from 'mongoose';
import { Course, CourseProgress, ContentInteraction } from '../models/InteractiveCourse.js';
import { protect } from '../middleware/auth.js';
import checkCourseAccess from '../middleware/checkCourseAccess.js';
import { logActivity, ACTIVITY_TYPES } from '../services/activityTrackingService.js';

const router = express.Router();

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
    // Allow status=all to return everything (needed by admin dashboard)
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (category) query.categories = category;
    if (tag) query.tags = tag;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const courses = await Course.find(query)
      .select('title slug description thumbnail ceHours ceuHours totalEstimatedTime categories tags status wordCount sectionCount price accessTier pricingTier publishedAt createdAt')
      .sort({ publishedAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Course.countDocuments(query);

    res.json({
      data: courses,
      // ← admin-courses.html reads d.data
      courses,             // ← backward compat for public catalog
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

/**
 * GET /api/interactive-courses/:param
 * Get full course details by slug OR ObjectId
 * - Slug lookups: published only (public catalog)
 * - ObjectId lookups: any status (admin preview)
 */
router.get('/:param', async (req, res) => {
  try {
    let course;
    if (mongoose.Types.ObjectId.isValid(req.params.param)) {
      // ObjectId lookup — admin preview needs drafts too
      course = await Course.findById(req.params.param);
    } else {
      // Slug lookup — public catalog, published only
      course = await Course.findOne({ 
        slug: req.params.param,
        status: 'published'
      });
    }

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json(course);
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ error: 'Failed to fetch course' });
  }
});

/**
 * GET /api/interactive-courses/:slug/outline
 * Get course outline (sections without full content)
 */
router.get('/:slug/outline', async (req, res) => {
  try {
    const course = await Course.findOne({ 
      slug: req.params.slug,
      status: 'published'
    }).select('title description ceHours sections.title sections.description sections.estimatedTime sections.hasQuiz totalEstimatedTime');

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json(course);
  } catch (error) {
    console.error('Error fetching course outline:', error);
    res.status(500).json({ error: 'Failed to fetch course outline' });
  }
});

// ============================================================================
// PROGRESS ROUTES (Protected)
// ============================================================================

/**
 * GET /api/interactive-courses/:slug/progress
 * Get user's progress for a specific course
 */
router.get('/:slug/progress', protect, checkCourseAccess, async (req, res) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug });
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
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

    res.json(progress);
  } catch (error) {
    console.error('Error fetching progress:', error);
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

/**
 * POST /api/interactive-courses/:slug/enroll
 * Enroll user in a course
 */
router.post('/:slug/enroll', protect, checkCourseAccess, async (req, res) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug, status: 'published' });
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Check if already enrolled
    let progress = await CourseProgress.findOne({
      userId: req.user._id,
      courseId: course._id
    });

    if (progress) {
      return res.json({ message: 'Already enrolled', progress });
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

    // =========================================================
    // ENROLLMENT WIRING — counter + analytics + PostHog
    // =========================================================

    // 1. Increment enrollment counter on course document
    try {
      await Course.findByIdAndUpdate(course._id, {
        $inc: { 'analytics.enrollments': 1 },
        $set: { 'analytics.lastEnrollmentAt': new Date() }
      });
    } catch (counterErr) {
      console.error('Failed to increment enrollment counter:', counterErr);
    }

    // 2. PostHog server-side event
    try {
      if (global.posthog) {
        global.posthog.capture({
          distinctId: req.user._id.toString(),
          event: 'course_enrolled',
          properties: {
            courseId: course._id.toString(),
            courseTitle: course.title,
            courseCode: course.courseCode || '',
            ceHours: course.ceHours || course.ceuHours || 0,
            slug: course.slug,
            source: 'web',
            $set: {
              email: req.user.email,
              lastEnrollmentDate: new Date().toISOString()
            }
          }
        });
      }
    } catch (phErr) {
      console.error('PostHog enrollment event failed:', phErr);
    }

    // 3. Console log for Render logs / activity tracking
    console.log('[ENROLLMENT]', JSON.stringify({
      type: 'enrollment',
      user: req.user.email || req.user._id,
      courseTitle: course.title,
      courseCode: course.courseCode || '',
      courseId: course._id,
      timestamp: new Date().toISOString()
    }));

    // 4. Activity log entry
    try {
      await logActivity(ACTIVITY_TYPES.USER_ENROLLED, {
        courseId: course._id.toString(),
        courseName: course.title,
        ceHours: course.ceHours || course.ceuHours || 0
      }, {
        userId: req.user._id,
        userName: `${req.user.profile?.firstName || ''} ${req.user.profile?.lastName || ''}`.trim() || req.user.email,
        userEmail: req.user.email
      });
    } catch (actErr) {
      console.error('Activity log for enrollment failed:', actErr);
    }

    // =========================================================

    res.status(201).json({ message: 'Enrolled successfully', progress });
  } catch (error) {
    console.error('Error enrolling in course:', error);
    res.status(500).json({ error: 'Failed to enroll in course' });
  }
});

/**
 * PUT /api/interactive-courses/:slug/progress/section/:sectionIndex
 * Update section progress
 */
router.put('/:slug/progress/section/:sectionIndex', protect, checkCourseAccess, async (req, res) => {
  try {
    const { sectionIndex } = req.params;
    const { viewedBlocks, completedBlocks, timeSpent } = req.body;

    const course = await Course.findOne({ slug: req.params.slug });
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const progress = await CourseProgress.findOne({
      userId: req.user._id,
      courseId: course._id
    });

    if (!progress) {
      return res.status(404).json({ error: 'Not enrolled in this course' });
    }

    const sectionProgress = progress.sectionProgress[sectionIndex];
    if (!sectionProgress) {
      return res.status(404).json({ error: 'Section not found' });
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

    // Check if section is complete
    const section = course.sections[sectionIndex];
    const totalBlocks = section.contentBlocks?.length || 0;
    const interactiveBlocks = (section.contentBlocks || [])
      .map((b, i) => ['matching', 'multipleChoice', 'multiSelect'].includes(b.type) ? i : -1)
      .filter(i => i >= 0);
    
    const allBlocksViewed = sectionProgress.viewedBlocks.length >= totalBlocks;
    const allInteractiveComplete = interactiveBlocks.every(i => sectionProgress.completedBlocks.includes(i));
    const quizPassed = !section.hasQuiz || sectionProgress.quizPassed;

    if (allBlocksViewed && allInteractiveComplete && quizPassed) {
      sectionProgress.status = 'completed';
      sectionProgress.completedAt = new Date();
    }

    // Update current section
    progress.currentSectionIndex = parseInt(sectionIndex);
    progress.lastAccessedAt = new Date();

    // Calculate overall progress
    if (progress.calculateOverallProgress) {
      progress.overallProgress = progress.calculateOverallProgress();
    }

    await progress.save();
    res.json(progress);
  } catch (error) {
    console.error('Error updating section progress:', error);
    res.status(500).json({ error: 'Failed to update progress' });
  }
});

/**
 * POST /api/interactive-courses/:slug/progress/section/:sectionIndex/quiz
 * Submit section quiz attempt
 */
router.post('/:slug/progress/section/:sectionIndex/quiz', protect, checkCourseAccess, async (req, res) => {
  try {
    const { sectionIndex } = req.params;
    const { answers, timeSpent } = req.body;

    const course = await Course.findOne({ slug: req.params.slug });
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const section = course.sections[sectionIndex];
    if (!section || !section.hasQuiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    const progress = await CourseProgress.findOne({
      userId: req.user._id,
      courseId: course._id
    });

    if (!progress) {
      return res.status(404).json({ error: 'Not enrolled in this course' });
    }

    // Enforce retake policy
    const sectionProg = progress.sectionProgress[sectionIndex];
    const settings = course.settings || {};
    if (sectionProg?.quizPassed) {
      // Already passed — only allow retakes if policy permits
      if (settings.retakePolicy === 'first_final') {
        return res.status(400).json({ error: 'Quiz already passed. Retakes are not allowed under this policy.' });
      }
    }
    if (settings.retakePolicy === 'limited' && sectionProg?.quizAttempts?.length >= (settings.maxRetakes || 3)) {
      return res.status(400).json({
        error: `Maximum retakes reached (${settings.maxRetakes || 3}). No more attempts allowed.`,
        attemptsUsed: sectionProg.quizAttempts.length,
        maxRetakes: settings.maxRetakes || 3
      });
    }
    // Enforce retake cooldown (minutes)
    if (settings.retakeCooldown > 0 && sectionProg?.quizAttempts?.length > 0) {
      const lastAttempt = sectionProg.quizAttempts[sectionProg.quizAttempts.length - 1];
      const cooldownMs = settings.retakeCooldown * 60 * 1000;
      const timeSince = Date.now() - new Date(lastAttempt.attemptedAt).getTime();
      if (timeSince < cooldownMs) {
        const remainingMin = Math.ceil((cooldownMs - timeSince) / 60000);
        return res.status(400).json({
          error: `Please wait ${remainingMin} minute(s) before retaking this quiz.`,
          cooldownRemaining: remainingMin
        });
      }
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

    // Update best score based on scorePolicy
    const scorePolicy = settings.scorePolicy || 'highest';
    if (scorePolicy === 'highest') {
      if (!sectionProgress.bestQuizScore || correctCount > sectionProgress.bestQuizScore) {
        sectionProgress.bestQuizScore = correctCount;
      }
    } else if (scorePolicy === 'latest') {
      sectionProgress.bestQuizScore = correctCount;
    } else if (scorePolicy === 'first') {
      if (sectionProgress.quizAttempts.length === 1) {
        sectionProgress.bestQuizScore = correctCount;
      }
    } else if (scorePolicy === 'average') {
      const totalScore = sectionProgress.quizAttempts.reduce((sum, a) => sum + a.score, 0);
      sectionProgress.bestQuizScore = Math.round(totalScore / sectionProgress.quizAttempts.length);
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

    // PostHog: quiz attempt
    try {
      if (global.posthog) {
        global.posthog.capture({
          distinctId: req.user._id.toString(),
          event: 'quiz_submitted',
          properties: {
            courseId: course._id.toString(),
            courseTitle: course.title,
            sectionIndex: parseInt(sectionIndex),
            score: correctCount,
            totalQuestions,
            percentage: Math.round(score * 100),
            passed,
            attemptNumber: sectionProgress.quizAttempts.length
          }
        });
      }
    } catch (phErr) {
      console.error('PostHog quiz event failed:', phErr);
    }

    // Check adaptive learning rules
    let adaptiveAction = null;
    if (settings.adaptiveEnabled && settings.adaptiveRules?.length > 0) {
      const secIdx = parseInt(sectionIndex);
      const matchingRule = settings.adaptiveRules.find(rule => {
        if (rule.sectionIndex !== secIdx) return false;
        if (rule.condition === 'score_below' && score < rule.threshold) return true;
        if (rule.condition === 'score_above' && score >= rule.threshold) return true;
        if (rule.condition === 'failed' && !passed) return true;
        return false;
      });
      if (matchingRule) {
        adaptiveAction = {
          action: matchingRule.action,
          targetSectionIndex: matchingRule.targetSectionIndex,
          message: matchingRule.message || '',
          condition: matchingRule.condition,
          threshold: matchingRule.threshold
        };
        // Mark target section as adaptively unlocked
        if (matchingRule.action === 'redirect' || matchingRule.action === 'skip_ahead') {
          const targetProg = progress.sectionProgress[matchingRule.targetSectionIndex];
          if (targetProg && !targetProg.adaptivelyUnlocked) {
            targetProg.adaptivelyUnlocked = true;
          }
        }
        await progress.save();
      }
    }

    const response = {
      score: correctCount,
      totalQuestions,
      percentage: Math.round(score * 100),
      passed,
      attemptsCount: sectionProgress.quizAttempts.length,
      bestScore: sectionProgress.bestQuizScore,
      sectionCompleted: sectionProgress.status === 'completed'
    };
    if (adaptiveAction) response.adaptiveAction = adaptiveAction;

    // Include retake info
    if (settings.retakePolicy === 'limited') {
      response.attemptsRemaining = (settings.maxRetakes || 3) - sectionProgress.quizAttempts.length;
    }

    res.json(response);
  } catch (error) {
    console.error('Error submitting quiz:', error);
    res.status(500).json({ error: 'Failed to submit quiz' });
  }
});

/**
 * POST /api/interactive-courses/:slug/progress/assessment
 * Submit final assessment attempt
 */
router.post('/:slug/progress/assessment', protect, checkCourseAccess, async (req, res) => {
  try {
    const { answers, timeUsed, questionOrder } = req.body;

    const course = await Course.findOne({ slug: req.params.slug });
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Normalize: if course.assessment is null, look for an exam block in sections
    if (!course.assessment || !course.assessment.questions?.length) {
      for (const section of (course.sections || [])) {
        for (const block of (section.contentBlocks || [])) {
          if (block.isExam && block.questions?.length) {
            course.assessment = {
              questions: block.questions,
              passThreshold: block.passThreshold || 0.8,
              attemptsAllowed: block.attemptsAllowed || 3,
              timeLimit: block.timeLimit || null
            };
            break;
          }
        }
        if (course.assessment?.questions?.length) break;
      }
    }

    if (!course.assessment || !course.assessment.questions?.length) {
      return res.status(404).json({ error: 'Assessment not found' });
    }

    const progress = await CourseProgress.findOne({
      userId: req.user._id,
      courseId: course._id
    });

    if (!progress) {
      return res.status(404).json({ error: 'Not enrolled in this course' });
    }

    // Check attempts remaining
    if (progress.assessmentAttemptsRemaining <= 0) {
      return res.status(400).json({ error: 'No attempts remaining' });
    }

    // Calculate score
    let correctCount = 0;
    const questions = course.assessment.questions;
    
    Object.entries(answers).forEach(([qIndex, selectedOption]) => {
      const actualIndex = questionOrder ? questionOrder[qIndex] : parseInt(qIndex);
      const question = questions[actualIndex];
      
      if (question) {
        if (question.type === 'multiSelect' || question.type === 'multiple_select') {
          const correctIndices = question.options.map((o, idx) => o.isCorrect ? idx : -1).filter(x => x >= 0);
          const selectedIndices = Array.isArray(selectedOption) ? selectedOption : [selectedOption];
          const isCorrect = correctIndices.length === selectedIndices.length &&
            correctIndices.every(idx => selectedIndices.includes(idx));
          if (isCorrect) correctCount++;
        } else {
          if (question.options[selectedOption]?.isCorrect) correctCount++;
        }
      }
    });

    const totalQuestions = questions.length;
    const percentage = correctCount / totalQuestions;
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
      progress.status = 'completed';
      progress.completedAt = new Date();
    }

    // Update best score
    if (!progress.bestAssessmentScore || correctCount > progress.bestAssessmentScore) {
      progress.bestAssessmentScore = correctCount;
    }

    // Calculate overall progress
    if (progress.calculateOverallProgress) {
      progress.overallProgress = progress.calculateOverallProgress();
    }

    await progress.save();

    // =========================================================
    // PostHog: assessment attempt + course completion
    // =========================================================
    try {
      if (global.posthog) {
        global.posthog.capture({
          distinctId: req.user._id.toString(),
          event: 'assessment_submitted',
          properties: {
            courseId: course._id.toString(),
            courseTitle: course.title,
            courseCode: course.courseCode || '',
            ceHours: course.ceHours || course.ceuHours || 0,
            score: correctCount,
            totalQuestions,
            percentage: Math.round(percentage * 100),
            passed,
            attemptsRemaining: progress.assessmentAttemptsRemaining,
            attemptNumber: progress.assessmentAttempts.length
          }
        });

        if (passed) {
          global.posthog.capture({
            distinctId: req.user._id.toString(),
            event: 'course_completed',
            properties: {
              courseId: course._id.toString(),
              courseTitle: course.title,
              courseCode: course.courseCode || '',
              ceHours: course.ceHours || course.ceuHours || 0,
              slug: course.slug,
              totalTimeSpent: progress.totalTimeSpent || 0,
              assessmentScore: Math.round(percentage * 100),
              $set: {
                email: req.user.email,
                lastCompletionDate: new Date().toISOString()
              }
            }
          });
        }
      }
    } catch (phErr) {
      console.error('PostHog assessment event failed:', phErr);
    }

    if (passed) {
      console.log('[COMPLETION]', JSON.stringify({
        user: req.user.email || req.user._id,
        courseTitle: course.title,
        courseCode: course.courseCode || '',
        score: Math.round(percentage * 100) + '%',
        timestamp: new Date().toISOString()
      }));
    }
    // =========================================================

    res.json({
      score: correctCount,
      totalQuestions,
      percentage: Math.round(percentage * 100),
      passed,
      attemptsRemaining: progress.assessmentAttemptsRemaining,
      bestScore: progress.bestAssessmentScore,
      courseCompleted: progress.status === 'completed',
      certificateId: progress.certificateId
    });
  } catch (error) {
    console.error('Error submitting assessment:', error);
    res.status(500).json({ error: 'Failed to submit assessment' });
  }
});

/**
 * POST /api/interactive-courses/:slug/progress/interaction
 * Log content interaction for analytics
 */
router.post('/:slug/progress/interaction', protect, async (req, res) => {
  try {
    const { sectionIndex, blockIndex, blockType, action, isCorrect, selectedOptions, score, timeSpent } = req.body;

    const course = await Course.findOne({ slug: req.params.slug });
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
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
    res.status(500).json({ error: 'Failed to log interaction' });
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

    res.json(courses);
  } catch (error) {
    console.error('Error fetching user courses:', error);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

export default router;

