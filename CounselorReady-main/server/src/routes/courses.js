import express from 'express';
import Course from '../models/Course.js';
import UserCourseProgress from '../models/UserCourseProgress.js';
import { protect, optionalAuth, requireSubscription } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/courses
// @desc    Get all published courses
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const courses = await Course.find({ status: 'published' })
      .select('-modules.lessons.content') // Don't send full content in list
      .sort({ createdAt: -1 });
    
    // If user is logged in, add enrollment status
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
        enrollment: progressMap[course._id.toString()] || { enrolled: false }
      }));
      
      return res.json({ courses: coursesWithProgress });
    }
    
    res.json({ courses });
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
    
    // Check access requirements
    if (course.accessType === 'paid' && !req.user.hasActiveSubscription()) {
      return res.status(403).json({
        error: 'Subscription required to enroll',
        code: 'SUBSCRIPTION_REQUIRED'
      });
    }
    
    // Create enrollment
    const progress = await UserCourseProgress.create({
      userId: req.user._id,
      courseId: course._id,
      unlockedModules: [course.modules[0]?._id] // Unlock first module
    });
    
    // Increment enrollment count
    course.enrollmentCount += 1;
    await course.save();
    
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

// @route   POST /api/courses/:id/lessons/:lessonId/complete
// @desc    Mark a lesson as complete
// @access  Private
router.post('/:id/lessons/:lessonId/complete', protect, async (req, res) => {
  try {
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
    
    // Mark lesson complete
    await progress.completeLesson(req.params.lessonId, course);
    
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
    const { answers } = req.body; // Array of { questionId, selectedAnswer }
    
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
    
    // Calculate score (this is simplified - real implementation would grade each question)
    // For now, just record the attempt
    const attemptNumber = progress.quizAttempts.filter(
      a => a.lessonId.toString() === req.params.lessonId
    ).length + 1;
    
    // TODO: Implement actual quiz grading
    const score = 85; // Placeholder
    const passed = score >= (course.settings.passingScore || 70);
    
    progress.quizAttempts.push({
      lessonId: req.params.lessonId,
      attemptNumber,
      score,
      passed,
      completedAt: new Date(),
      answers: answers || []
    });
    
    // Mark lesson complete if passed
    if (passed) {
      await progress.completeLesson(req.params.lessonId, course);
    } else {
      await progress.save();
    }
    
    res.json({
      message: 'Quiz submitted',
      result: {
        score,
        passed,
        attemptNumber,
        passingScore: course.settings.passingScore || 70
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
    
    const enrolledCourses = progress.map(p => ({
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

export default router;
