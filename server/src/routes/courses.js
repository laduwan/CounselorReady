/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import express from 'express';
import mongoose from 'mongoose';
import Course from '../models/Course.js';
import UserCourseProgress from '../models/UserCourseProgress.js';
import User from '../models/User.js';
import { protect, optionalAuth, requireSubscription, admin } from '../middleware/auth.js';
import { logActivity, ACTIVITY_TYPES } from '../services/activityTrackingService.js';

const router = express.Router();

// Helper: validate ObjectId params
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// ============================================
// ADMIN COURSE MANAGEMENT ENDPOINTS
// ============================================

// @route   GET /api/admin/courses
// @desc    Get all courses for admin (including drafts, unpublished)
// @access  Private/Admin
router.get('/admin/courses', protect, admin, async (req, res) => {
  try {
    const courses = await Course.find({})
      .sort({ createdAt: -1 });
    
    // Add enrollment counts
    const coursesWithStats = await Promise.all(
      courses.map(async (course) => {
        const enrollmentCount = await UserCourseProgress.countDocuments({ 
          courseId: course._id 
        });
        
        return {
          ...course.toJSON(),
          enrollmentCount
        };
      })
    );
    
    res.json({ courses: coursesWithStats });
  } catch (error) {
    console.error('Admin get courses error:', error);
    res.status(500).json({ error: 'Failed to get courses' });
  }
});

// @route   GET /api/admin/courses/:courseId
// @desc    Get single course by ID for editing (admin)
// @access  Private/Admin
router.get('/admin/courses/:courseId', protect, admin, async (req, res) => {
  try {
    if (!isValidId(req.params.courseId)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }
    const course = await Course.findById(req.params.courseId);
    
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    // Get enrollment stats
    const enrollmentCount = await UserCourseProgress.countDocuments({ 
      courseId: course._id 
    });
    
    const completionCount = await UserCourseProgress.countDocuments({ 
      courseId: course._id,
      status: 'completed'
    });
    
    res.json({
      ...course.toJSON(),
      stats: {
        enrollmentCount,
        completionCount,
        completionRate: enrollmentCount > 0 
          ? Math.round((completionCount / enrollmentCount) * 100) 
          : 0
      }
    });
  } catch (error) {
    console.error('Admin get course error:', error);
    res.status(500).json({ error: 'Failed to get course' });
  }
});

// @route   POST /api/admin/courses
// @desc    Create new course
// @access  Private/Admin
router.post('/admin/courses', protect, admin, async (req, res) => {
  try {
    const courseData = req.body;
    
    // Validate required fields
    if (!courseData.title) {
      return res.status(400).json({ error: 'Course title is required' });
    }
    
    // Generate slug if not provided
    if (!courseData.slug) {
      courseData.slug = courseData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
    }
    
    // Check if slug already exists
    const existingCourse = await Course.findOne({ slug: courseData.slug });
    if (existingCourse) {
      return res.status(400).json({ 
        error: 'A course with this slug already exists',
        suggestion: `${courseData.slug}-${Date.now()}`
      });
    }
    
    const course = await Course.create({
      ...courseData,
      createdBy: req.user._id,
      status: courseData.status || 'draft'
    });
    
    res.status(201).json({ 
      success: true,
      course,
      message: 'Course created successfully'
    });
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({ error: 'Failed to create course' });
  }
});

// @route   PUT /api/admin/courses/:courseId
// @desc    Update course
// @access  Private/Admin
router.put('/admin/courses/:courseId', protect, admin, async (req, res) => {
  try {
    if (!isValidId(req.params.courseId)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }
    const course = await Course.findById(req.params.courseId);
    
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    const updates = req.body;
    
    // If slug is being changed, check for conflicts
    if (updates.slug && updates.slug !== course.slug) {
      const existingCourse = await Course.findOne({ 
        slug: updates.slug,
        _id: { $ne: course._id }
      });
      
      if (existingCourse) {
        return res.status(400).json({ 
          error: 'A course with this slug already exists' 
        });
      }
    }
    
    // Update fields
    Object.keys(updates).forEach(key => {
      course[key] = updates[key];
    });
    
    course.updatedAt = new Date();
    await course.save();
    
    res.json({ 
      success: true,
      course,
      message: 'Course updated successfully'
    });
  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({ error: 'Failed to update course' });
  }
});

// @route   DELETE /api/admin/courses/:courseId
// @desc    Delete course (and optionally all related data)
// @access  Private/Admin
router.delete('/admin/courses/:courseId', protect, admin, async (req, res) => {
  try {
    if (!isValidId(req.params.courseId)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }
    const { deleteCertificates } = req.query;

    const course = await Course.findById(req.params.courseId);
    
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    // Count what we're about to delete
    const progressCount = await UserCourseProgress.countDocuments({ 
      courseId: course._id 
    });
    
    console.log('Deleting course:', {
      courseId: course._id,
      title: course.title,
      userProgressRecords: progressCount
    });
    
    // Delete all user progress for this course
    const progressResult = await UserCourseProgress.deleteMany({ 
      courseId: course._id 
    });
    
    console.log(`Deleted ${progressResult.deletedCount} progress records`);
    
    // Delete the course itself
    await Course.findByIdAndDelete(course._id);
    console.log('Course deleted successfully');
    
    res.json({
      success: true,
      message: 'Course deleted successfully',
      deleted: {
        course: course.title,
        userProgress: progressResult.deletedCount
      }
    });
    
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({ 
      error: 'Failed to delete course',
      details: error.message 
    });
  }
});

// @route   PATCH /api/admin/courses/:courseId/publish
// @desc    Publish or unpublish a course
// @access  Private/Admin
router.patch('/admin/courses/:courseId/publish', protect, admin, async (req, res) => {
  try {
    if (!isValidId(req.params.courseId)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }
    const { publish } = req.body; // true or false

    const course = await Course.findById(req.params.courseId);
    
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    course.status = publish ? 'published' : 'draft';
    course.publishedAt = publish ? new Date() : null;
    await course.save();
    
    res.json({ 
      success: true,
      course,
      message: publish ? 'Course published' : 'Course unpublished'
    });
  } catch (error) {
    console.error('Publish course error:', error);
    res.status(500).json({ error: 'Failed to update course status' });
  }
});

// ============================================
// PUBLIC ROUTES
// ============================================

// @route   GET /api/courses
// @desc    Get all published courses
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const courses = await Course.find({ status: 'published' })
      .select('-modules.lessons.content') // Don't send full content in list
      .sort({ createdAt: -1 });
    
    // If user is logged in, add enrollment status and access info
    if (req.user) {
      const progress = await UserCourseProgress.find({ userId: req.user._id });
      const progressMap = {};
      progress.forEach(p => {
        progressMap[p.courseId.toString()] = {
          enrolled: true,
          status: p.status,
          percentComplete: p.percentComplete
        };
      });
      
      const coursesWithProgress = courses.map(course => ({
        ...course.toJSON(),
        enrollment: progressMap[course._id.toString()] || { enrolled: false },
        canAccess: req.user.canAccessCourse(course),
        requiredTier: course.accessTier || 'free'
      }));
      
      return res.json({ courses: coursesWithProgress });
    }
    
    // For non-logged in users, show access tier info
    const coursesWithTier = courses.map(course => ({
      ...course.toJSON(),
      requiredTier: course.accessTier || 'free'
    }));
    
    res.json({ courses: coursesWithTier });
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ error: 'Failed to get courses' });
  }
});

// @route   GET /api/courses/:slug
// @desc    Get single course by slug
// @access  Public (limited) / Private (full)
router.get('/:slug', optionalAuth, async (req, res) => {
  try {
    const course = await Course.findOne({
      slug: req.params.slug,
      status: 'published'
    });
    
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    let enrollment = null;
    let canAccessContent = false;
    
    // Check if user is enrolled
    if (req.user) {
      const progress = await UserCourseProgress.findOne({
        userId: req.user._id,
        courseId: course._id
      });
      
      if (progress) {
        enrollment = {
          enrolled: true,
          status: progress.status,
          percentComplete: progress.percentComplete,
          lessonsCompleted: progress.lessonsCompleted.map(l => l.lessonId),
          currentModuleIndex: progress.currentModuleIndex,
          currentLessonIndex: progress.currentLessonIndex
        };
        
        // Can access if enrolled and has active subscription (or course is free)
        canAccessContent = course.accessType === 'free' || req.user.hasActiveSubscription();
      }
    }
    
    // Filter content based on access
    const courseData = course.toJSON();
    
    if (!canAccessContent) {
      // Only show free preview lessons
      courseData.modules = courseData.modules.map(module => ({
        ...module,
        lessons: module.lessons.map(lesson => ({
          ...lesson,
          content: lesson.isFree ? lesson.content : null,
          videoUrl: lesson.isFree ? lesson.videoUrl : null,
          locked: !lesson.isFree
        }))
      }));
    }
    
    res.json({
      course: courseData,
      enrollment
    });
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({ error: 'Failed to get course' });
  }
});

// @route   POST /api/courses/:id/enroll
// @desc    Enroll in a course
// @access  Private
router.post('/:id/enroll', protect, async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    // Check if already enrolled
    const existingProgress = await UserCourseProgress.findOne({
      userId: req.user._id,
      courseId: course._id
    });
    
    if (existingProgress) {
      return res.status(400).json({ error: 'Already enrolled in this course' });
    }
    
    // Enrollment cap — staggered by subscription tier:
    //   free    → 1 active course at a time
    //   trial   → 1 active course at a time
    //   active / lifetime → unlimited
    const subStatus = req.user.subscription?.status;
    const enrollCap = subStatus === 'active' || subStatus === 'lifetime'
      ? Infinity
      : 1;  // free and trial = 1 active course at a time

    if (enrollCap !== Infinity) {
      const activeEnrollments = await UserCourseProgress.countDocuments({
        userId: req.user._id,
        status: { $in: ['not_started', 'in_progress'] }
      });
      if (activeEnrollments >= enrollCap) {
        const capMsg = enrollCap === 1
          ? 'Free accounts can only have 1 course in progress at a time. Finish it before enrolling in another.'
          : `You have ${enrollCap} courses in progress. Finish one before enrolling in another.`;
        return res.status(403).json({
          error: capMsg,
          code: 'ENROLLMENT_LIMIT_REACHED',
          activeEnrollments,
          cap: enrollCap
        });
      }
    }

    // Check access requirements based on subscription tier
    if (!req.user.canAccessCourse(course)) {
      // Determine what tier is needed
      const tierNames = { 'professional': 'Professional', 'vip': 'VIP' };
      const requiredTier = tierNames[course.accessTier] || 'Professional';
      
      return res.status(403).json({
        error: `${requiredTier} subscription required to access this course`,
        code: 'SUBSCRIPTION_REQUIRED',
        requiredTier: course.accessTier,
        courseHours: course.ceuHours
      });
    }
    
    // Create enrollment — auto-delete progress after 60 min for smoke-test courses
    const enrollData = {
      userId: req.user._id,
      courseId: course._id,
      unlockedModules: [course.modules[0]?._id] // Unlock first module
    };
    if (course.slug === 'qa-smoke-test-course') {
      enrollData.autoDeleteAt = new Date(Date.now() + 60 * 60 * 1000);
    }
    const progress = await UserCourseProgress.create(enrollData);
    
    // Increment enrollment count and analytics
    course.enrollmentCount += 1;
    course.analytics = course.analytics || {};
    course.analytics.enrollments = (course.analytics.enrollments || 0) + 1;
    await course.save();
    
    // Log activity for admin notification
    const user = await User.findById(req.user._id);
    await logActivity(ACTIVITY_TYPES.USER_ENROLLED, {
      courseId: course._id,
      courseName: course.title,
      ceHours: course.ceuHours
    }, {
      userId: req.user._id,
      userName: `${user?.profile?.firstName || ''} ${user?.profile?.lastName || ''}`.trim() || user?.email,
      userEmail: user?.email
    });
    
    res.status(201).json({
      message: 'Enrolled successfully',
      enrollment: {
        enrolled: true,
        status: progress.status,
        percentComplete: progress.percentComplete
      }
    });
  } catch (error) {
    console.error('Enroll error:', error);
    res.status(500).json({ error: 'Failed to enroll' });
  }
});

// @route   GET /api/courses/:id/progress
// @desc    Get user's progress in a course
// @access  Private
router.get('/:id/progress', protect, async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }
    const progress = await UserCourseProgress.findOne({
      userId: req.user._id,
      courseId: req.params.id
    });
    
    if (!progress) {
      return res.status(404).json({ error: 'Not enrolled in this course' });
    }
    
    res.json({ progress });
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({ error: 'Failed to get progress' });
  }
});

// @route   POST /api/courses/:id/retake
// @desc    Reset course progress to retake (user-initiated)
// @access  Private
router.post('/:id/retake', protect, async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }
    const progress = await UserCourseProgress.findOne({
      userId: req.user._id,
      courseId: req.params.id
    });
    
    if (!progress) {
      return res.status(404).json({ error: 'Not enrolled in this course' });
    }
    
    // Reset progress but keep enrollment
    progress.completedLessons = [];
    progress.quizAttempts = [];
    progress.currentModule = 0;
    progress.currentLesson = 0;
    progress.status = 'in_progress';
    progress.completed = false;
    progress.completedAt = null;
    progress.progressPercent = 0;
    
    await progress.save();
    
    res.json({ 
      message: 'Course reset successfully. You can now retake the course.',
      progress 
    });
  } catch (error) {
    console.error('Retake course error:', error);
    res.status(500).json({ error: 'Failed to reset course' });
  }
});

// @route   POST /api/courses/:id/lessons/:lessonId/complete
// @desc    Mark a lesson as complete
// @access  Private
router.post('/:id/lessons/:lessonId/complete', protect, async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    let progress = await UserCourseProgress.findOne({
      userId: req.user._id,
      courseId: course._id
    });
    
    if (!progress) {
      return res.status(404).json({ error: 'Not enrolled in this course' });
    }
    
    const prevStatus = progress.status;

    // Mark lesson complete
    await progress.completeLesson(req.params.lessonId, course);

    // Log course_started when user begins their first lesson
    if (prevStatus === 'not_started' && progress.status === 'in_progress') {
      logActivity(ACTIVITY_TYPES.COURSE_STARTED, {
        courseId: course._id,
        courseName: course.title
      }, {
        notifyAdmin: false,
        userId: req.user._id,
        userName: req.user.profile?.firstName || '',
        userEmail: req.user.email
      }).catch(() => {});
    }

    res.json({
      message: 'Lesson marked complete',
      progress: {
        status: progress.status,
        percentComplete: progress.percentComplete,
        lessonsCompleted: progress.lessonsCompleted.length
      }
    });
  } catch (error) {
    console.error('Complete lesson error:', error);
    res.status(500).json({ error: 'Failed to complete lesson' });
  }
});

// @route   POST /api/courses/:id/lessons/:lessonId/quiz
// @desc    Submit a quiz attempt
// @access  Private
router.post('/:id/lessons/:lessonId/quiz', protect, async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }
    const { answers } = req.body; // Array of answers in order

    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    // Find the lesson with the quiz
    let quizLesson = null;
    for (const module of course.modules) {
      const lesson = module.lessons.find(l => l._id.toString() === req.params.lessonId);
      if (lesson && lesson.type === 'quiz') {
        quizLesson = lesson;
        break;
      }
    }
    
    if (!quizLesson) {
      return res.status(404).json({ error: 'Quiz not found' });
    }
    
    let progress = await UserCourseProgress.findOne({
      userId: req.user._id,
      courseId: course._id
    });
    
    if (!progress) {
      return res.status(404).json({ error: 'Not enrolled in this course' });
    }
    
    // Get previous attempts for this quiz
    const previousAttempts = progress.quizAttempts.filter(
      a => a.lessonId.toString() === req.params.lessonId
    );
    const attemptNumber = previousAttempts.length + 1;
    
    // Get previous best score
    const previousBestScore = previousAttempts.length > 0 
      ? Math.max(...previousAttempts.map(a => a.score))
      : 0;
    
    // Grade the quiz
    const questions = quizLesson.questions || [];
    let totalPoints = 0;
    let earnedPoints = 0;
    const gradedAnswers = [];
    
    if (questions.length > 0 && answers && answers.length > 0) {
      questions.forEach((q, idx) => {
        const points = q.points || 1;
        totalPoints += points;
        
        // Get user's answer - support both old and new formats
        const userAnswerObj = answers[idx];
        let userAnswer = null;
        let isCorrect = false;
        
        if (userAnswerObj !== null && userAnswerObj !== undefined) {
          // New format: { selectedAnswer: number } or { selectedAnswers: number[] }
          if (typeof userAnswerObj === 'object') {
            if ('selectedAnswers' in userAnswerObj) {
              userAnswer = userAnswerObj.selectedAnswers;
            } else if ('selectedAnswer' in userAnswerObj) {
              userAnswer = userAnswerObj.selectedAnswer;
            }
          } else {
            // Old format: just a number
            userAnswer = userAnswerObj;
          }
        }
        
        // Determine if answer is correct
        const isMultipleAnswer = q.type === 'multipleAnswer' || Array.isArray(q.correctAnswer);
        
        if (isMultipleAnswer) {
          // Multiple correct answers - must match exactly
          const correct = Array.isArray(q.correctAnswer) ? [...q.correctAnswer].sort() : [];
          const selected = Array.isArray(userAnswer) ? [...userAnswer].sort() : [];
          isCorrect = JSON.stringify(correct) === JSON.stringify(selected);
        } else {
          // Single answer
          isCorrect = userAnswer === q.correctAnswer;
        }
        
        if (isCorrect) {
          earnedPoints += points;
        }
        
        gradedAnswers.push({
          questionIndex: idx,
          question: q.question,
          userAnswer: userAnswer,
          correctAnswer: q.correctAnswer,
          correct: isCorrect,
          explanation: q.explanation
        });
      });
    } else {
      // No questions defined - treat as demo/placeholder quiz
      totalPoints = 1;
      earnedPoints = 1;
    }
    
    // Calculate percentage score
    const score = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 100;
    const passed = score >= (course.settings.passingScore || 70);
    const bestScore = Math.max(score, previousBestScore);
    
    progress.quizAttempts.push({
      lessonId: req.params.lessonId,
      attemptNumber,
      score,
      passed,
      completedAt: new Date(),
      answers: gradedAnswers
    });
    
    // Mark lesson complete if passed
    if (passed) {
      const wasCompleted = progress.status === 'completed';
      await progress.completeLesson(req.params.lessonId, course);
      
      const updatedProgress = await UserCourseProgress.findById(progress._id);
      
      // Log quiz passed activity
      const user = await User.findById(req.user._id);
      await logActivity(ACTIVITY_TYPES.QUIZ_PASSED, {
        courseId: course._id,
        courseName: course.title,
        score,
        passingScore: course.settings.passingScore || 70,
        attemptNumber
      }, {
        userId: req.user._id,
        userName: `${user?.profile?.firstName || ''} ${user?.profile?.lastName || ''}`.trim() || user?.email,
        userEmail: user?.email
      });
      
      // If course just became completed, log that too
      if (!wasCompleted && updatedProgress.status === 'completed') {
        await logActivity(ACTIVITY_TYPES.COURSE_COMPLETED, {
          courseId: course._id,
          courseName: course.title,
          ceHours: course.ceuHours
        }, {
          userId: req.user._id,
          userName: `${user?.profile?.firstName || ''} ${user?.profile?.lastName || ''}`.trim() || user?.email,
          userEmail: user?.email
        });
      }
    } else {
      await progress.save();
      
      // Log quiz failed activity
      const user = await User.findById(req.user._id);
      await logActivity(ACTIVITY_TYPES.QUIZ_FAILED, {
        courseId: course._id,
        courseName: course.title,
        score,
        passingScore: course.settings.passingScore || 70,
        attemptNumber
      }, {
        userId: req.user._id,
        userName: `${user?.profile?.firstName || ''} ${user?.profile?.lastName || ''}`.trim() || user?.email,
        userEmail: user?.email
      });
    }
    
    res.json({
      message: 'Quiz submitted',
      result: {
        score,
        passed,
        attemptNumber,
        bestScore,
        isNewBest: score > previousBestScore,
        passingScore: course.settings.passingScore || 70,
        totalQuestions: questions.length,
        correctAnswers: gradedAnswers.filter(a => a.correct).length,
        feedback: quizLesson.showExplanations !== false ? gradedAnswers : undefined
      }
    });
  } catch (error) {
    console.error('Submit quiz error:', error);
    res.status(500).json({ error: 'Failed to submit quiz' });
  }
});

// @route   GET /api/courses/enrolled
// @desc    Get user's enrolled courses
// @access  Private
router.get('/user/enrolled', protect, async (req, res) => {
  try {
    const progress = await UserCourseProgress.find({ userId: req.user._id })
      .populate('courseId', 'title slug thumbnail totalLessons')
      .sort({ lastAccessedAt: -1 });
    
    // Filter out enrollments where course no longer exists (null populate)
    const enrolledCourses = progress
      .filter(p => p.courseId != null)
      .map(p => ({
        course: p.courseId,
        status: p.status,
        percentComplete: p.percentComplete,
        lastAccessedAt: p.lastAccessedAt,
        enrolledAt: p.enrolledAt
      }));
    
    res.json({ enrolledCourses });
  } catch (error) {
    console.error('Get enrolled courses error:', error);
    res.status(500).json({ error: 'Failed to get enrolled courses' });
  }
});

// ============================================
// TIME TRACKING & PACING
// ============================================

// @route   POST /api/courses/:id/lessons/:lessonId/track-time
// @desc    Track time spent on a lesson
// @access  Private
router.post('/:id/lessons/:lessonId/track-time', protect, async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }
    const { seconds } = req.body;

    let progress = await UserCourseProgress.findOne({
      userId: req.user._id,
      courseId: req.params.id
    });
    
    if (!progress) {
      return res.status(404).json({ error: 'Not enrolled in this course' });
    }
    
    // Find or create lesson time tracking
    let lessonTime = progress.lessonTimeTracking.find(
      lt => lt.lessonId.toString() === req.params.lessonId
    );
    
    if (!lessonTime) {
      progress.lessonTimeTracking.push({
        lessonId: req.params.lessonId,
        totalSeconds: seconds,
        sessions: [{ startedAt: new Date(), endedAt: new Date(), seconds }]
      });
    } else {
      lessonTime.totalSeconds += seconds;
      lessonTime.sessions.push({
        startedAt: new Date(Date.now() - seconds * 1000),
        endedAt: new Date(),
        seconds
      });
    }
    
    progress.lastAccessedAt = new Date();
    await progress.save();
    
    res.json({ 
      success: true,
      totalSeconds: lessonTime?.totalSeconds || seconds
    });
  } catch (error) {
    console.error('Track time error:', error);
    res.status(500).json({ error: 'Failed to track time' });
  }
});

// @route   GET /api/courses/:id/lessons/:lessonId/time-status
// @desc    Check if minimum time requirement is met for a lesson
// @access  Private
router.get('/:id/lessons/:lessonId/time-status', protect, async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    const progress = await UserCourseProgress.findOne({
      userId: req.user._id,
      courseId: req.params.id
    });
    
    if (!progress) {
      return res.status(404).json({ error: 'Not enrolled in this course' });
    }
    
    // Find the lesson
    let lesson = null;
    for (const module of course.modules) {
      lesson = module.lessons.find(l => l._id.toString() === req.params.lessonId);
      if (lesson) break;
    }
    
    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }
    
    // Calculate required time
    const enforceMinTime = course.settings?.enforceMinTime || false;
    const minTimePercent = course.settings?.minTimePercent || 80;
    const lessonDurationSec = (lesson.duration || 5) * 60; // Default 5 min
    const requiredSeconds = Math.floor(lessonDurationSec * (minTimePercent / 100));
    
    // Get time spent
    const lessonTime = progress.lessonTimeTracking.find(
      lt => lt.lessonId.toString() === req.params.lessonId
    );
    const timeSpent = lessonTime?.totalSeconds || 0;
    
    res.json({
      enforceMinTime,
      requiredSeconds,
      timeSpent,
      isMet: !enforceMinTime || timeSpent >= requiredSeconds,
      remainingSeconds: Math.max(0, requiredSeconds - timeSpent)
    });
  } catch (error) {
    console.error('Time status error:', error);
    res.status(500).json({ error: 'Failed to get time status' });
  }
});

// ============================================
// COURSE EVALUATION
// ============================================

// @route   GET /api/courses/:id/evaluation
// @desc    Get evaluation questions for a course
// @access  Private
router.get('/:id/evaluation', protect, async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    // CounselorReady standard evaluation questions
    const defaultQuestions = [
      { question: 'Quality of course content', type: 'rating', required: true },
      { question: 'Clarity of instruction', type: 'rating', required: true },
      { question: 'Overall course satisfaction', type: 'rating', required: true },
      { question: 'Usefulness of course materials', type: 'rating', required: true },
      { question: 'Ease of access to course materials', type: 'rating', required: true },
      { question: 'Overall Course Rating', type: 'rating', required: true },
      { question: 'Level of interactivity in the course', type: 'rating', required: true },
      { question: 'Relevance to professional practice', type: 'rating', required: true },
      { question: 'The Presenter was timely in addressing questions or issues', type: 'rating', required: true },
      { question: 'Satisfaction with the online platform', type: 'rating', required: true },
      { question: 'Timeliness of the information provided', type: 'rating', required: true },
      { question: 'The cost of the course was affordable compared to others providing similar credit hours', type: 'rating', required: true },
      { question: 'Was the course engaging?', type: 'yes_no', required: true },
      { question: 'Would you recommend this course to others?', type: 'yes_no', required: true },
      { question: 'Additional comments or suggestions (optional)', type: 'text', required: false }
    ];
    
    const questions = course.evaluationQuestions?.length > 0 
      ? course.evaluationQuestions 
      : defaultQuestions;
    
    // Check if already completed
    const progress = await UserCourseProgress.findOne({
      userId: req.user._id,
      courseId: req.params.id
    });
    
    // Auto-fill course info
    const courseInfo = {
      courseName: course.title,
      dateCompleted: progress?.completedAt || new Date(),
      instructorName: course.instructor || 'CounselorReady'
    };
    
    res.json({
      required: course.settings?.requireEvaluation !== false,
      completed: progress?.evaluationCompleted || false,
      courseInfo,
      questions
    });
  } catch (error) {
    console.error('Get evaluation error:', error);
    res.status(500).json({ error: 'Failed to get evaluation' });
  }
});

// @route   POST /api/courses/:id/evaluation
// @desc    Submit course evaluation
// @access  Private
router.post('/:id/evaluation', protect, async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }
    const { responses } = req.body; // Array of { questionIndex, response }

    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    let progress = await UserCourseProgress.findOne({
      userId: req.user._id,
      courseId: req.params.id
    });
    
    if (!progress) {
      return res.status(404).json({ error: 'Not enrolled in this course' });
    }
    
    // Validate required questions are answered
    const questions = course.evaluationQuestions?.length > 0 
      ? course.evaluationQuestions 
      : [
          { required: true }, { required: true }, { required: true }, 
          { required: true }, { required: true }, { required: false }
        ];
    
    for (let i = 0; i < questions.length; i++) {
      if (questions[i].required) {
        const response = responses.find(r => r.questionIndex === i);
        if (!response || response.response === null || response.response === '') {
          return res.status(400).json({ error: `Question ${i + 1} is required` });
        }
      }
    }
    
    progress.evaluationResponses = responses;
    progress.evaluationCompleted = true;
    progress.evaluationCompletedAt = new Date();
    await progress.save();
    
    res.json({ success: true, message: 'Evaluation submitted' });
  } catch (error) {
    console.error('Submit evaluation error:', error);
    res.status(500).json({ error: 'Failed to submit evaluation' });
  }
});

// ============================================
// ATTESTATION
// ============================================

// @route   GET /api/courses/:id/attestation
// @desc    Get attestation requirements for a course
// @access  Private
router.get('/:id/attestation', protect, async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    const progress = await UserCourseProgress.findOne({
      userId: req.user._id,
      courseId: req.params.id
    });
    
    const defaultText = 'I attest that I personally completed this entire course, including all required activities and assessments, and that I did not receive unauthorized assistance.';
    
    res.json({
      required: course.settings?.requireAttestation !== false,
      completed: progress?.attestationCompleted || false,
      attestationText: course.settings?.attestationText || defaultText
    });
  } catch (error) {
    console.error('Get attestation error:', error);
    res.status(500).json({ error: 'Failed to get attestation' });
  }
});

// @route   POST /api/courses/:id/attestation
// @desc    Submit attestation
// @access  Private
router.post('/:id/attestation', protect, async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }
    const { agreed } = req.body;

    if (!agreed) {
      return res.status(400).json({ error: 'You must agree to the attestation statement' });
    }

    let progress = await UserCourseProgress.findOne({
      userId: req.user._id,
      courseId: req.params.id
    });
    
    if (!progress) {
      return res.status(404).json({ error: 'Not enrolled in this course' });
    }
    
    // Get IP for audit trail
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
    
    progress.attestationCompleted = true;
    progress.attestationCompletedAt = new Date();
    progress.attestationIP = ip;
    await progress.save();
    
    res.json({ success: true, message: 'Attestation recorded' });
  } catch (error) {
    console.error('Submit attestation error:', error);
    res.status(500).json({ error: 'Failed to submit attestation' });
  }
});

// ============================================
// DRIP CONTENT
// ============================================

// @route   GET /api/courses/:id/drip-status
// @desc    Check which modules are unlocked for drip content
// @access  Private
router.get('/:id/drip-status', protect, async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    const progress = await UserCourseProgress.findOne({
      userId: req.user._id,
      courseId: req.params.id
    });
    
    if (!progress) {
      return res.status(404).json({ error: 'Not enrolled in this course' });
    }
    
    if (!course.settings?.dripEnabled) {
      // All modules unlocked
      return res.json({
        dripEnabled: false,
        modules: course.modules.map((m, i) => ({
          moduleIndex: i,
          moduleId: m._id,
          title: m.title,
          unlocked: true,
          unlocksAt: null
        }))
      });
    }
    
    // Calculate unlock dates based on enrollment
    const enrolledAt = progress.enrolledAt;
    const moduleStatus = course.modules.map((module, index) => {
      const schedule = course.settings.dripSchedule?.find(
        s => s.moduleId?.toString() === module._id?.toString()
      );
      
      // First module always unlocked, or if no schedule
      if (index === 0 || !schedule) {
        return {
          moduleIndex: index,
          moduleId: module._id,
          title: module.title,
          unlocked: true,
          unlocksAt: null
        };
      }
      
      const unlocksAt = new Date(enrolledAt);
      unlocksAt.setDate(unlocksAt.getDate() + schedule.daysAfterEnrollment);
      
      return {
        moduleIndex: index,
        moduleId: module._id,
        title: module.title,
        unlocked: new Date() >= unlocksAt,
        unlocksAt: unlocksAt
      };
    });
    
    res.json({
      dripEnabled: true,
      enrolledAt,
      modules: moduleStatus
    });
  } catch (error) {
    console.error('Drip status error:', error);
    res.status(500).json({ error: 'Failed to get drip status' });
  }
});

export default router;
