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
    
    // Create enrollment
    const progress = await UserCourseProgress.create({
      userId: req.user._id,
      courseId: course._id,
      unlockedModules: [course.modules[0]?._id] // Unlock first module
    });
    
    // Increment enrollment count and analytics
    course.enrollmentCount += 1;
    course.analytics = course.analytics || {};
    course.analytics.enrollments = (course.analytics.enrollments || 0) + 1;
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

// @route   POST /api/courses/:id/retake
// @desc    Reset course progress to retake (user-initiated)
// @access  Private
router.post('/:id/retake', protect, async (req, res) => {
  try {
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
    const { answers } = req.body; // Array of { questionIndex, selectedAnswer }
    
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
        
        const userAnswer = answers.find(a => a.questionIndex === idx);
        let isCorrect = false;
        
        if (userAnswer) {
          if (q.type === 'multiple_choice' || q.type === 'true_false') {
            // Single answer comparison
            isCorrect = userAnswer.selectedAnswer === q.correctAnswer;
          } else if (q.type === 'multiple_select') {
            // Array comparison - must match exactly
            const correct = Array.isArray(q.correctAnswer) ? q.correctAnswer.sort() : [];
            const selected = Array.isArray(userAnswer.selectedAnswer) ? userAnswer.selectedAnswer.sort() : [];
            isCorrect = JSON.stringify(correct) === JSON.stringify(selected);
          }
        }
        
        if (isCorrect) {
          earnedPoints += points;
        }
        
        gradedAnswers.push({
          questionIndex: idx,
          selectedAnswer: userAnswer?.selectedAnswer,
          correctAnswer: q.correctAnswer,
          correct: isCorrect,
          explanation: q.explanation
        });
      });
    } else {
      // No questions defined - treat as demo/placeholder quiz
      // This handles legacy courses without real quiz questions
      totalPoints = 1;
      earnedPoints = 1; // Auto-pass for demo
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
    
    // Mark lesson complete if passed (first time or any time)
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
        bestScore,
        isNewBest: score > previousBestScore,
        passingScore: course.settings.passingScore || 70,
        totalQuestions: questions.length,
        correctAnswers: gradedAnswers.filter(a => a.correct).length,
        // Only show detailed feedback if course allows it
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

// ============================================
// TIME TRACKING & PACING
// ============================================

// @route   POST /api/courses/:id/lessons/:lessonId/track-time
// @desc    Track time spent on a lesson
// @access  Private
router.post('/:id/lessons/:lessonId/track-time', protect, async (req, res) => {
  try {
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
