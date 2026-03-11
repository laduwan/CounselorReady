/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import express from 'express';
import { protect } from '../middleware/auth.js';
import Course from '../models/Course.js';
import User from '../models/User.js';
import UserCourseProgress from '../models/UserCourseProgress.js';
import {
  xAPIClient,
  buildStatement,
  VERBS,
  ACTIVITY_TYPES,
  createCourseLaunchStatement,
  createLessonCompleteStatement,
  createQuizAttemptStatement,
  createCourseCompleteStatement,
  createCEEarnedStatement
} from '../utils/xapi.js';

const router = express.Router();

// Get xAPI client if configured
function getXAPIClient() {
  if (process.env.XAPI_ENDPOINT && process.env.XAPI_USERNAME && process.env.XAPI_PASSWORD) {
    return new xAPIClient(
      process.env.XAPI_ENDPOINT,
      process.env.XAPI_USERNAME,
      process.env.XAPI_PASSWORD
    );
  }
  return null;
}

// @route   POST /api/xapi/statements
// @desc    Send xAPI statement
// @access  Private
router.post('/statements', protect, async (req, res) => {
  try {
    const client = getXAPIClient();
    
    if (!client) {
      // Store locally if no LRS configured
      console.log('xAPI Statement (no LRS):', JSON.stringify(req.body, null, 2));
      return res.json({ 
        stored: true, 
        local: true,
        message: 'Statement logged locally - configure XAPI_ENDPOINT for LRS' 
      });
    }

    const result = await client.sendStatement(req.body);
    res.json({ stored: true, result });

  } catch (error) {
    console.error('xAPI statement error:', error);
    res.status(500).json({ error: 'Failed to send statement' });
  }
});

// @route   POST /api/xapi/course/launch
// @desc    Record course launch
// @access  Private
router.post('/course/launch', protect, async (req, res) => {
  try {
    const { courseId } = req.body;
    const user = await User.findById(req.user._id);
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const baseUrl = process.env.BASE_URL || 'https://counselorready.com';
    const statement = createCourseLaunchStatement(user, course, baseUrl);

    const client = getXAPIClient();
    if (client) {
      await client.sendStatement(statement);
    }

    // Log locally
    console.log('xAPI: Course launched', { userId: user._id, courseId: course._id });

    res.json({ success: true, statement });

  } catch (error) {
    console.error('xAPI course launch error:', error);
    res.status(500).json({ error: 'Failed to record launch' });
  }
});

// @route   POST /api/xapi/lesson/complete
// @desc    Record lesson completion
// @access  Private
router.post('/lesson/complete', protect, async (req, res) => {
  try {
    const { courseId, lessonId, duration } = req.body;
    const user = await User.findById(req.user._id);
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Find lesson
    let lesson = null;
    for (const module of course.modules) {
      const found = module.lessons.find(l => l._id.toString() === lessonId);
      if (found) {
        lesson = found;
        break;
      }
    }

    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    const baseUrl = process.env.BASE_URL || 'https://counselorready.com';
    const statement = createLessonCompleteStatement(user, course, lesson, baseUrl, duration);

    const client = getXAPIClient();
    if (client) {
      await client.sendStatement(statement);
    }

    console.log('xAPI: Lesson completed', { userId: user._id, lessonId });

    res.json({ success: true, statement });

  } catch (error) {
    console.error('xAPI lesson complete error:', error);
    res.status(500).json({ error: 'Failed to record completion' });
  }
});

// @route   POST /api/xapi/quiz/attempt
// @desc    Record quiz attempt
// @access  Private
router.post('/quiz/attempt', protect, async (req, res) => {
  try {
    const { courseId, quizId, score, passed } = req.body;
    const user = await User.findById(req.user._id);
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const quiz = { _id: quizId, title: 'Quiz' }; // Simplified
    const baseUrl = process.env.BASE_URL || 'https://counselorready.com';
    const statement = createQuizAttemptStatement(user, course, quiz, score, passed, baseUrl);

    const client = getXAPIClient();
    if (client) {
      await client.sendStatement(statement);
    }

    console.log('xAPI: Quiz attempted', { userId: user._id, quizId, score, passed });

    res.json({ success: true, statement });

  } catch (error) {
    console.error('xAPI quiz attempt error:', error);
    res.status(500).json({ error: 'Failed to record attempt' });
  }
});

// @route   POST /api/xapi/course/complete
// @desc    Record course completion
// @access  Private
router.post('/course/complete', protect, async (req, res) => {
  try {
    const { courseId } = req.body;
    const user = await User.findById(req.user._id);
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const baseUrl = process.env.BASE_URL || 'https://counselorready.com';
    const statements = [
      createCourseCompleteStatement(user, course, baseUrl, course.ceuHours)
    ];

    // Add CE earned statement if CEU eligible
    if (course.ceuEligible && course.ceuHours > 0) {
      statements.push(createCEEarnedStatement(user, course, course.ceuHours, baseUrl));
    }

    const client = getXAPIClient();
    if (client) {
      await client.sendStatements(statements);
    }

    console.log('xAPI: Course completed', { userId: user._id, courseId: course._id, ceuHours: course.ceuHours });

    res.json({ success: true, statements });

  } catch (error) {
    console.error('xAPI course complete error:', error);
    res.status(500).json({ error: 'Failed to record completion' });
  }
});

// @route   GET /api/xapi/statements
// @desc    Get xAPI statements for user
// @access  Private
router.get('/statements', protect, async (req, res) => {
  try {
    const client = getXAPIClient();
    
    if (!client) {
      return res.json({ 
        statements: [],
        message: 'No LRS configured - statements stored locally only'
      });
    }

    const user = await User.findById(req.user._id);
    const statements = await client.getStatements({
      agent: JSON.stringify({ mbox: `mailto:${user.email}` }),
      limit: req.query.limit || 50
    });

    res.json(statements);

  } catch (error) {
    console.error('xAPI get statements error:', error);
    res.status(500).json({ error: 'Failed to get statements' });
  }
});

// @route   GET /api/xapi/config
// @desc    Get xAPI configuration status
// @access  Private
router.get('/config', protect, (req, res) => {
  const configured = !!(process.env.XAPI_ENDPOINT && process.env.XAPI_USERNAME);
  
  res.json({
    configured,
    endpoint: configured ? process.env.XAPI_ENDPOINT : null,
    version: '1.0.3',
    features: ['statements', 'state', 'activities']
  });
});

export default router;
