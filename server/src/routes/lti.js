/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import express from 'express';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import Course from '../models/Course.js';
import User from '../models/User.js';
import UserCourseProgress from '../models/UserCourseProgress.js';
import LtiConsumer from '../models/LtiConsumer.js';
import { protect } from '../middleware/auth.js';
import { 
  verifyOAuthSignature, 
  parseLTILaunch, 
  isInstructor,
  sendGrade,
  getLTIConfig,
  generateLTICartridge
} from '../utils/lti.js';

const router = express.Router();

// Initialize default consumer from env (if not already in DB)
const initDefaultConsumer = async () => {
  if (process.env.LTI_CONSUMER_KEY && process.env.LTI_CONSUMER_SECRET) {
    try {
      await LtiConsumer.findOneAndUpdate(
        { key: process.env.LTI_CONSUMER_KEY },
        { 
          key: process.env.LTI_CONSUMER_KEY,
          secret: process.env.LTI_CONSUMER_SECRET,
          name: 'Default Consumer (from env)',
          active: true
        },
        { upsert: true, new: true }
      );
      console.log('✅ LTI default consumer initialized from environment');
    } catch (err) {
      console.error('Failed to init default LTI consumer:', err.message);
    }
  }
};

// Run on startup (after DB connection)
setTimeout(initDefaultConsumer, 5000);

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

    // Get consumer from database
    const consumer = await LtiConsumer.getByKey(ltiData.consumerKey);
    if (!consumer) {
      return res.status(401).send('Unknown consumer key');
    }

    // Verify OAuth signature
    const launchUrl = `${process.env.BASE_URL || 'https://api.counselorready.com'}/api/lti/launch${req.params.courseSlug ? '/' + req.params.courseSlug : ''}`;
    
    if (!verifyOAuthSignature(req.body, consumer.secret, launchUrl)) {
      return res.status(401).send('Invalid OAuth signature');
    }

    // Record the launch
    await consumer.recordLaunch();

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
      
      // Check if consumer is allowed to access this course
      if (course && consumer.allowedCourses && consumer.allowedCourses.length > 0) {
        const isAllowed = consumer.allowedCourses.some(id => id.toString() === course._id.toString());
        if (!isAllowed) {
          return res.status(403).send('Consumer not authorized for this course');
        }
      }
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

    const consumer = await LtiConsumer.getByKey(user.ltiSession.consumerKey);
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
  const baseUrl = process.env.BASE_URL || 'https://api.counselorready.com';
  const config = getLTIConfig(baseUrl, req.query.course);
  res.json(config);
});

// @route   GET /api/lti/cartridge
// @desc    Get LTI cartridge XML for easy installation
// @access  Public
router.get('/cartridge', (req, res) => {
  const baseUrl = process.env.BASE_URL || 'https://api.counselorready.com';
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

    const baseUrl = process.env.BASE_URL || 'https://api.counselorready.com';
    
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

// ============================================
// ADMIN ROUTES - Manage LTI Consumers
// ============================================

// Admin middleware
const adminOnly = async (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// @route   POST /api/lti/consumers
// @desc    Register a new LTI consumer
// @access  Admin only
router.post('/consumers', protect, adminOnly, async (req, res) => {
  try {
    const { name, key, secret, description, contactEmail, allowedCourses } = req.body;

    if (!name || !key || !secret) {
      return res.status(400).json({ error: 'Name, key, and secret required' });
    }

    // Check for duplicate key
    const existing = await LtiConsumer.findOne({ key });
    if (existing) {
      return res.status(400).json({ error: 'Consumer with this key already exists' });
    }

    const consumer = await LtiConsumer.create({
      name,
      key,
      secret,
      description: description || '',
      contactEmail: contactEmail || '',
      allowedCourses: allowedCourses || [],
      createdBy: req.user._id,
      active: true
    });

    res.json({ 
      message: 'Consumer registered',
      consumer: { 
        id: consumer._id,
        name: consumer.name, 
        key: consumer.key,
        active: consumer.active,
        createdAt: consumer.createdAt
      }
    });

  } catch (error) {
    console.error('LTI consumer registration error:', error);
    res.status(500).json({ error: 'Failed to register consumer' });
  }
});

// @route   GET /api/lti/consumers
// @desc    List all LTI consumers
// @access  Admin only
router.get('/consumers', protect, adminOnly, async (req, res) => {
  try {
    const consumers = await LtiConsumer.find()
      .select('-secret') // Don't expose secrets in list
      .populate('allowedCourses', 'title slug')
      .populate('createdBy', 'email profile.firstName profile.lastName')
      .sort({ createdAt: -1 });

    res.json({ consumers });

  } catch (error) {
    console.error('List consumers error:', error);
    res.status(500).json({ error: 'Failed to list consumers' });
  }
});

// @route   GET /api/lti/consumers/:id
// @desc    Get single consumer (includes secret)
// @access  Admin only
router.get('/consumers/:id', protect, adminOnly, async (req, res) => {
  try {
    const consumer = await LtiConsumer.findById(req.params.id)
      .populate('allowedCourses', 'title slug')
      .populate('createdBy', 'email profile.firstName profile.lastName');

    if (!consumer) {
      return res.status(404).json({ error: 'Consumer not found' });
    }

    res.json({ consumer });

  } catch (error) {
    console.error('Get consumer error:', error);
    res.status(500).json({ error: 'Failed to get consumer' });
  }
});

// @route   PUT /api/lti/consumers/:id
// @desc    Update an LTI consumer
// @access  Admin only
router.put('/consumers/:id', protect, adminOnly, async (req, res) => {
  try {
    const { name, secret, description, contactEmail, allowedCourses, active } = req.body;

    const consumer = await LtiConsumer.findById(req.params.id);
    if (!consumer) {
      return res.status(404).json({ error: 'Consumer not found' });
    }

    // Update fields
    if (name) consumer.name = name;
    if (secret) consumer.secret = secret;
    if (description !== undefined) consumer.description = description;
    if (contactEmail !== undefined) consumer.contactEmail = contactEmail;
    if (allowedCourses !== undefined) consumer.allowedCourses = allowedCourses;
    if (active !== undefined) consumer.active = active;

    await consumer.save();

    res.json({ 
      message: 'Consumer updated',
      consumer: {
        id: consumer._id,
        name: consumer.name,
        key: consumer.key,
        active: consumer.active
      }
    });

  } catch (error) {
    console.error('Update consumer error:', error);
    res.status(500).json({ error: 'Failed to update consumer' });
  }
});

// @route   DELETE /api/lti/consumers/:id
// @desc    Delete an LTI consumer
// @access  Admin only
router.delete('/consumers/:id', protect, adminOnly, async (req, res) => {
  try {
    const consumer = await LtiConsumer.findByIdAndDelete(req.params.id);
    
    if (!consumer) {
      return res.status(404).json({ error: 'Consumer not found' });
    }

    res.json({ message: 'Consumer deleted', key: consumer.key });

  } catch (error) {
    console.error('Delete consumer error:', error);
    res.status(500).json({ error: 'Failed to delete consumer' });
  }
});

// @route   POST /api/lti/consumers/:id/regenerate-secret
// @desc    Generate a new secret for a consumer
// @access  Admin only
router.post('/consumers/:id/regenerate-secret', protect, adminOnly, async (req, res) => {
  try {
    const consumer = await LtiConsumer.findById(req.params.id);
    
    if (!consumer) {
      return res.status(404).json({ error: 'Consumer not found' });
    }

    // Generate new secret
    const newSecret = crypto.randomBytes(32).toString('hex');
    consumer.secret = newSecret;
    await consumer.save();

    res.json({ 
      message: 'Secret regenerated',
      secret: newSecret // Return once so admin can copy it
    });

  } catch (error) {
    console.error('Regenerate secret error:', error);
    res.status(500).json({ error: 'Failed to regenerate secret' });
  }
});

// @route   GET /api/lti/consumers/:id/stats
// @desc    Get usage stats for a consumer
// @access  Admin only
router.get('/consumers/:id/stats', protect, adminOnly, async (req, res) => {
  try {
    const consumer = await LtiConsumer.findById(req.params.id);
    
    if (!consumer) {
      return res.status(404).json({ error: 'Consumer not found' });
    }

    // Count users created via this consumer
    const usersCount = await User.countDocuments({ 
      ltiConsumer: { $regex: consumer.key, $options: 'i' } 
    });

    res.json({
      key: consumer.key,
      name: consumer.name,
      launchCount: consumer.launchCount,
      lastLaunchAt: consumer.lastLaunchAt,
      usersCreated: usersCount,
      createdAt: consumer.createdAt
    });

  } catch (error) {
    console.error('Consumer stats error:', error);
    res.status(500).json({ error: 'Failed to get stats' });
  }
});

export default router;
