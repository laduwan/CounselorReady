import express from 'express';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import Course from '../models/Course.js';
import User from '../models/User.js';
import UserCourseProgress from '../models/UserCourseProgress.js';
import { 
  verifyOAuthSignature, 
  parseLTILaunch, 
  isInstructor,
  sendGrade,
  getLTIConfig,
  generateLTICartridge
} from '../utils/lti.js';

const router = express.Router();

// Store LTI consumers (in production, use database)
const LTI_CONSUMERS = new Map();

// Initialize default consumer from env
if (process.env.LTI_CONSUMER_KEY && process.env.LTI_CONSUMER_SECRET) {
  LTI_CONSUMERS.set(process.env.LTI_CONSUMER_KEY, {
    secret: process.env.LTI_CONSUMER_SECRET,
    name: 'Default Consumer'
  });
}

// @route   POST /api/lti/launch
// @route   POST /api/lti/launch/:courseSlug
// @desc    LTI launch endpoint - receives launch from external LMS
// @access  Public (OAuth verified)
router.post('/launch/:courseSlug?', express.urlencoded({ extended: true }), async (req, res) => {
  try {
    const ltiData = parseLTILaunch(req.body);
    
    // Verify this is an LTI launch
    if (ltiData.ltiMessageType !== 'basic-lti-launch-request') {
      return res.status(400).send('Invalid LTI message type');
    }

    // Get consumer
    const consumer = LTI_CONSUMERS.get(ltiData.consumerKey);
    if (!consumer) {
      return res.status(401).send('Unknown consumer key');
    }

    // Verify OAuth signature
    const launchUrl = `${process.env.BASE_URL || 'https://counselorready-2.onrender.com'}/api/lti/launch${req.params.courseSlug ? '/' + req.params.courseSlug : ''}`;
    
    if (!verifyOAuthSignature(req.body, consumer.secret, launchUrl)) {
      return res.status(401).send('Invalid OAuth signature');
    }

    // Find or create user
    let user = await User.findOne({ email: ltiData.userEmail });
    
    if (!user) {
      // Create new user from LTI data
      user = await User.create({
        email: ltiData.userEmail,
        name: ltiData.userFullName || `${ltiData.userFirstName} ${ltiData.userLastName}`,
        password: crypto.randomBytes(32).toString('hex'), // Random password
        ltiUserId: ltiData.userId,
        ltiConsumer: ltiData.toolConsumerInstanceGuid
      });
    }

    // Get course
    const courseSlug = req.params.courseSlug || ltiData.customCourseSlug;
    let course = null;
    
    if (courseSlug) {
      course = await Course.findOne({ slug: courseSlug, status: 'published' });
    }

    // Generate session token
    const token = jwt.sign(
      { 
        userId: user._id,
        ltiSession: true,
        ltiData: {
          contextId: ltiData.contextId,
          resourceLinkId: ltiData.resourceLinkId,
          outcomeServiceUrl: ltiData.lisOutcomeServiceUrl,
          resultSourcedId: ltiData.lisResultSourcedId,
          returnUrl: ltiData.launchPresentationReturnUrl,
          consumerKey: ltiData.consumerKey
        }
      },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    // Store LTI session data for grade passback
    if (ltiData.lisOutcomeServiceUrl && ltiData.lisResultSourcedId) {
      await User.findByIdAndUpdate(user._id, {
        $set: {
          'ltiSession': {
            outcomeServiceUrl: ltiData.lisOutcomeServiceUrl,
            resultSourcedId: ltiData.lisResultSourcedId,
            consumerKey: ltiData.consumerKey,
            contextId: ltiData.contextId
          }
        }
      });
    }

    // Redirect to course or course selection
    const baseUrl = process.env.FRONTEND_URL || 'https://counselorready.com';
    
    if (course) {
      // Auto-enroll in course
      await UserCourseProgress.findOneAndUpdate(
        { userId: user._id, courseId: course._id },
        { 
          userId: user._id, 
          courseId: course._id,
          enrolledAt: new Date(),
          status: 'not_started'
        },
        { upsert: true }
      );
      
      // Redirect to course player with LTI token
      res.redirect(`${baseUrl}/course-player.html?slug=${course.slug}&lti_token=${token}`);
    } else {
      // Redirect to course selection
      res.redirect(`${baseUrl}/courses.html?lti_token=${token}`);
    }

  } catch (error) {
    console.error('LTI launch error:', error);
    res.status(500).send('LTI launch failed: ' + error.message);
  }
});

// @route   POST /api/lti/grade
// @desc    Send grade back to LMS
// @access  Private
router.post('/grade', async (req, res) => {
  try {
    const { userId, courseId, score } = req.body;

    const user = await User.findById(userId);
    if (!user || !user.ltiSession) {
      return res.status(400).json({ error: 'No LTI session found' });
    }

    const consumer = LTI_CONSUMERS.get(user.ltiSession.consumerKey);
    if (!consumer) {
      return res.status(400).json({ error: 'Consumer not found' });
    }

    // Normalize score to 0-1 range
    const normalizedScore = Math.min(1, Math.max(0, score / 100));

    const result = await sendGrade(
      user.ltiSession.outcomeServiceUrl,
      user.ltiSession.resultSourcedId,
      normalizedScore,
      user.ltiSession.consumerKey,
      consumer.secret
    );

    res.json(result);

  } catch (error) {
    console.error('LTI grade error:', error);
    res.status(500).json({ error: 'Failed to send grade' });
  }
});

// @route   GET /api/lti/config
// @desc    Get LTI configuration for tool consumers
// @access  Public
router.get('/config', (req, res) => {
  const baseUrl = process.env.BASE_URL || 'https://counselorready-2.onrender.com';
  const config = getLTIConfig(baseUrl, req.query.course);
  res.json(config);
});

// @route   GET /api/lti/cartridge
// @desc    Get LTI cartridge XML for easy installation
// @access  Public
router.get('/cartridge', (req, res) => {
  const baseUrl = process.env.BASE_URL || 'https://counselorready-2.onrender.com';
  const xml = generateLTICartridge(baseUrl);
  res.setHeader('Content-Type', 'application/xml');
  res.send(xml);
});

// @route   GET /api/lti/courses
// @desc    Get available courses for LTI deep linking
// @access  Public
router.get('/courses', async (req, res) => {
  try {
    const courses = await Course.find({ status: 'published' })
      .select('slug title subtitle description ceuHours ceuCategories thumbnail')
      .sort({ title: 1 });

    const baseUrl = process.env.BASE_URL || 'https://counselorready-2.onrender.com';
    
    const ltiCourses = courses.map(course => ({
      id: course._id,
      slug: course.slug,
      title: course.title,
      subtitle: course.subtitle,
      description: course.description,
      ceuHours: course.ceuHours,
      category: course.ceuCategories?.[0]?.category || 'General',
      launchUrl: `${baseUrl}/api/lti/launch/${course.slug}`,
      thumbnail: course.thumbnail
    }));

    res.json({ courses: ltiCourses });

  } catch (error) {
    console.error('LTI courses error:', error);
    res.status(500).json({ error: 'Failed to get courses' });
  }
});

// @route   POST /api/lti/consumers
// @desc    Register a new LTI consumer (admin only)
// @access  Private/Admin
router.post('/consumers', async (req, res) => {
  try {
    const { name, key, secret } = req.body;

    if (!name || !key || !secret) {
      return res.status(400).json({ error: 'Name, key, and secret required' });
    }

    LTI_CONSUMERS.set(key, { secret, name });

    res.json({ 
      message: 'Consumer registered',
      consumer: { name, key }
    });

  } catch (error) {
    console.error('LTI consumer registration error:', error);
    res.status(500).json({ error: 'Failed to register consumer' });
  }
});

// @route   GET /api/lti/consumers
// @desc    List LTI consumers (admin only)
// @access  Private/Admin
router.get('/consumers', (req, res) => {
  const consumers = [];
  LTI_CONSUMERS.forEach((value, key) => {
    consumers.push({ key, name: value.name });
  });
  res.json({ consumers });
});

export default router;
