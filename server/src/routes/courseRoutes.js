const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { Course, CourseProgress, ContentInteraction } = require('../models/InteractiveCourse');
const { Certificate } = require('../models/Certificate');
const { authenticateToken } = require('../middleware/auth');
const { generateCertificate } = require('../services/certificateService');

// ============================================================================
// COURSE ROUTES
// ============================================================================

/**
 * GET /api/courses
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

    const query = { status };
    
    if (category) query.categories = category;
    if (tag) query.tags = tag;
    if (search) {
      query.$text = { $search: search };
    }

    const courses = await Course.find(query)
      .select('title slug description thumbnail ceHours totalEstimatedTime categories tags')
      .sort({ publishedAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Course.countDocuments(query);

    res.json({
      courses,
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
 * GET /api/courses/:slug
 * Get full course details by slug
 */
router.get('/:slug', async (req, res) => {
  try {
    const course = await Course.findOne({ 
      slug: req.params.slug,
      status: 'published'
    });

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
 * GET /api/courses/:slug/outline
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
 * GET /api/courses/:slug/progress
 * Get user's progress for a specific course
 */
router.get('/:slug/progress', authenticateToken, async (req, res) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug });
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    let progress = await CourseProgress.findOne({
      userId: req.user.id,
      courseId: course._id
    });

    // If no progress exists, create initial progress
    if (!progress) {
      progress = new CourseProgress({
        userId: req.user.id,
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
 * POST /api/courses/:slug/enroll
 * Enroll user in a course
 */
router.post('/:slug/enroll', authenticateToken, async (req, res) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug, status: 'published' });
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Check if already enrolled
    let progress = await CourseProgress.findOne({
      userId: req.user.id,
      courseId: course._id
    });

    if (progress) {
      return res.json({ message: 'Already enrolled', progress });
    }

    // Create new enrollment
    progress = new CourseProgress({
      userId: req.user.id,
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
    res.status(201).json({ message: 'Enrolled successfully', progress });
  } catch (error) {
    console.error('Error enrolling in course:', error);
    res.status(500).json({ error: 'Failed to enroll in course' });
  }
});

/**
 * PUT /api/courses/:slug/progress/section/:sectionIndex
 * Update section progress
 */
router.put('/:slug/progress/section/:sectionIndex', authenticateToken, async (req, res) => {
  try {
    const { sectionIndex } = req.params;
    const { viewedBlocks, completedBlocks, timeSpent } = req.body;

    const course = await Course.findOne({ slug: req.params.slug });
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const progress = await CourseProgress.findOne({
      userId: req.user.id,
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
    const totalBlocks = section.contentBlocks.length;
    const interactiveBlocks = section.contentBlocks
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
    progress.overallProgress = progress.calculateOverallProgress();

    await progress.save();
    res.json(progress);
  } catch (error) {
    console.error('Error updating section progress:', error);
    res.status(500).json({ error: 'Failed to update progress' });
  }
});

/**
 * POST /api/courses/:slug/progress/section/:sectionIndex/quiz
 * Submit section quiz attempt
 */
router.post('/:slug/progress/section/:sectionIndex/quiz', authenticateToken, async (req, res) => {
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
      userId: req.user.id,
      courseId: course._id
    });

    if (!progress) {
      return res.status(404).json({ error: 'Not enrolled in this course' });
    }

    // Calculate score
    let correctCount = 0;
    section.quizQuestions.forEach((q, i) => {
      const selectedOption = answers[i];
      if (selectedOption !== undefined) {
        if (q.type === 'multiSelect') {
          // For multi-select, check if all correct options are selected and no incorrect
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
    const totalBlocks = section.contentBlocks.length;
    const interactiveBlocks = section.contentBlocks
      .map((b, i) => ['matching', 'multipleChoice', 'multiSelect'].includes(b.type) ? i : -1)
      .filter(i => i >= 0);
    
    const allBlocksViewed = sectionProgress.viewedBlocks.length >= totalBlocks;
    const allInteractiveComplete = interactiveBlocks.every(i => sectionProgress.completedBlocks.includes(i));

    if (allBlocksViewed && allInteractiveComplete && sectionProgress.quizPassed) {
      sectionProgress.status = 'completed';
      sectionProgress.completedAt = new Date();
    }

    progress.overallProgress = progress.calculateOverallProgress();
    await progress.save();

    res.json({
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
    res.status(500).json({ error: 'Failed to submit quiz' });
  }
});

/**
 * POST /api/courses/:slug/progress/assessment
 * Submit final assessment attempt
 */
router.post('/:slug/progress/assessment', authenticateToken, async (req, res) => {
  try {
    const { answers, timeUsed, questionOrder } = req.body;

    const course = await Course.findOne({ slug: req.params.slug });
    if (!course || !course.assessment) {
      return res.status(404).json({ error: 'Assessment not found' });
    }

    const progress = await CourseProgress.findOne({
      userId: req.user.id,
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
        if (question.type === 'multiSelect') {
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
    }

    // Update best score
    if (!progress.bestAssessmentScore || correctCount > progress.bestAssessmentScore) {
      progress.bestAssessmentScore = correctCount;
    }

    // Check if course is complete
    progress.overallProgress = progress.calculateOverallProgress();
    
    if (progress.isEligibleForCertificate() && !progress.certificateId) {
      progress.status = 'completed';
      progress.completedAt = new Date();
      
      // Generate certificate
      try {
        const certificate = await generateCertificate({
          userId: req.user.id,
          courseId: course._id,
          courseTitle: course.title,
          ceHours: course.ceHours,
          ceProvider: course.ceProvider,
          acepNumber: course.acepNumber,
          completedAt: progress.completedAt,
          assessmentScore: Math.round(percentage * 100)
        });
        
        progress.certificateId = certificate._id;
        progress.certificateIssuedAt = new Date();
        progress.status = 'certified';
      } catch (certError) {
        console.error('Error generating certificate:', certError);
        // Continue without certificate - can be generated later
      }
    }

    await progress.save();

    res.json({
      score: correctCount,
      totalQuestions,
      percentage: Math.round(percentage * 100),
      passed,
      attemptsRemaining: progress.assessmentAttemptsRemaining,
      bestScore: progress.bestAssessmentScore,
      courseCompleted: progress.status === 'completed' || progress.status === 'certified',
      certificateId: progress.certificateId
    });
  } catch (error) {
    console.error('Error submitting assessment:', error);
    res.status(500).json({ error: 'Failed to submit assessment' });
  }
});

/**
 * POST /api/courses/:slug/progress/interaction
 * Log content interaction for analytics
 */
router.post('/:slug/progress/interaction', authenticateToken, async (req, res) => {
  try {
    const { sectionIndex, blockIndex, blockType, action, isCorrect, selectedOptions, score, timeSpent } = req.body;

    const course = await Course.findOne({ slug: req.params.slug });
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Get attempt number for this block
    const existingAttempts = await ContentInteraction.countDocuments({
      userId: req.user.id,
      courseId: course._id,
      sectionIndex,
      blockIndex,
      action: 'answer'
    });

    const interaction = new ContentInteraction({
      userId: req.user.id,
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
 * GET /api/courses/:slug/progress/certificate
 * Get certificate for completed course
 */
router.get('/:slug/progress/certificate', authenticateToken, async (req, res) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug });
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const progress = await CourseProgress.findOne({
      userId: req.user.id,
      courseId: course._id
    }).populate('certificateId');

    if (!progress || !progress.certificateId) {
      return res.status(404).json({ error: 'Certificate not found' });
    }

    res.json(progress.certificateId);
  } catch (error) {
    console.error('Error fetching certificate:', error);
    res.status(500).json({ error: 'Failed to fetch certificate' });
  }
});

// ============================================================================
// USER'S COURSES DASHBOARD
// ============================================================================

/**
 * GET /api/my-courses
 * Get all courses user is enrolled in with progress
 */
router.get('/my-courses', authenticateToken, async (req, res) => {
  try {
    const { status } = req.query;

    const query = { userId: req.user.id };
    if (status) query.status = status;

    const progress = await CourseProgress.find(query)
      .populate('courseId', 'title slug description thumbnail ceHours totalEstimatedTime')
      .sort({ lastAccessedAt: -1 });

    const courses = progress.map(p => ({
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

module.exports = router;
