/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
// adminCourses.js — Admin course management, credentials, broadcasts, enrollments
import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import Anthropic from '@anthropic-ai/sdk';
import User from '../models/User.js';
import Course from '../models/Course.js';
import Certificate from '../models/Certificate.js';
import CredentialTemplate from '../models/CredentialTemplate.js';
import Announcement from '../models/Announcement.js';
import UserCourseProgress from '../models/UserCourseProgress.js';
import UserCredential from '../models/UserCredential.js';
import { Course as InteractiveCourse, CourseProgress as InteractiveCourseProgress } from '../models/InteractiveCourse.js';
import { protect } from '../middleware/auth.js';
import { triggerNewCourseAnnouncement } from '../services/notificationTriggerService.js';

const router = express.Router();

const adminOnly = async (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Initialize Anthropic client (for credential AI check)
const anthropic = process.env.ANTHROPIC_API_KEY ? new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
}) : null;

// ============================================
// CREDENTIAL TEMPLATE MONITORING ROUTES
// ============================================

// @route   GET /api/admin/credential-templates
// @desc    Get all credential templates with staleness info
// @access  Admin only
router.get('/credential-templates', protect, adminOnly, async (req, res) => {
  try {
    const { type, staleOnly, state } = req.query;
    
    // Build query
    const query = { isActive: true };
    if (type) query.type = type;
    if (state) query.state = state.toUpperCase();
    
    const templates = await CredentialTemplate.find(query)
      .sort({ type: 1, state: 1, code: 1 });
    
    // Calculate staleness (over 6 months = stale, over 12 months = critical)
    const now = new Date();
    const sixMonthsAgo = new Date(now.setMonth(now.getMonth() - 6));
    const twelveMonthsAgo = new Date(now.setMonth(now.getMonth() - 6));
    
    const templatesWithStatus = templates.map(t => {
      const lastVerified = t.lastVerified || t.createdAt;
      let status = 'current';
      let daysSinceVerified = Math.floor((new Date() - new Date(lastVerified)) / (1000 * 60 * 60 * 24));
      
      if (new Date(lastVerified) < twelveMonthsAgo) {
        status = 'critical';
      } else if (new Date(lastVerified) < sixMonthsAgo) {
        status = 'stale';
      }
      
      return {
        ...t.toObject(),
        verificationStatus: status,
        daysSinceVerified
      };
    });
    
    // Filter stale only if requested
    const filtered = staleOnly === 'true' 
      ? templatesWithStatus.filter(t => t.verificationStatus !== 'current')
      : templatesWithStatus;
    
    // Summary stats
    const stats = {
      total: templatesWithStatus.length,
      current: templatesWithStatus.filter(t => t.verificationStatus === 'current').length,
      stale: templatesWithStatus.filter(t => t.verificationStatus === 'stale').length,
      critical: templatesWithStatus.filter(t => t.verificationStatus === 'critical').length
    };
    
    res.json({ templates: filtered, stats });
    
  } catch (error) {
    console.error('Get credential templates error:', error);
    res.status(500).json({ error: 'Failed to get credential templates' });
  }
});

// @route   GET /api/admin/credential-templates/:id
// @desc    Get single credential template
// @access  Admin only
router.get('/credential-templates/:id', protect, adminOnly, async (req, res) => {
  try {
    const template = await CredentialTemplate.findById(req.params.id);
    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }
    res.json(template);
  } catch (error) {
    console.error('Get template error:', error);
    res.status(500).json({ error: 'Failed to get template' });
  }
});

// @route   PUT /api/admin/credential-templates/:id
// @desc    Update credential template
// @access  Admin only
router.put('/credential-templates/:id', protect, adminOnly, async (req, res) => {
  try {
    const { 
      renewalCycle, 
      totalCEUsRequired, 
      requirements, 
      notes,
      renewalUrl,
      renewalFee,
      markVerified 
    } = req.body;
    
    const updateData = {};
    if (renewalCycle !== undefined) updateData.renewalCycle = renewalCycle;
    if (totalCEUsRequired !== undefined) updateData.totalCEUsRequired = totalCEUsRequired;
    if (requirements !== undefined) updateData.requirements = requirements;
    if (notes !== undefined) updateData.notes = notes;
    if (renewalUrl !== undefined) updateData.renewalUrl = renewalUrl;
    if (renewalFee !== undefined) updateData.renewalFee = renewalFee;
    
    // Mark as verified if requested
    if (markVerified) {
      updateData.lastVerified = new Date();
    }
    
    const template = await CredentialTemplate.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    
    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }
    
    res.json({ message: 'Template updated', template });
    
  } catch (error) {
    console.error('Update template error:', error);
    res.status(500).json({ error: 'Failed to update template' });
  }
});

// @route   POST /api/admin/credential-templates/:id/verify
// @desc    Mark template as verified (no changes)
// @access  Admin only
router.post('/credential-templates/:id/verify', protect, adminOnly, async (req, res) => {
  try {
    const template = await CredentialTemplate.findByIdAndUpdate(
      req.params.id,
      { lastVerified: new Date() },
      { new: true }
    );
    
    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }
    
    res.json({ message: 'Template marked as verified', template });
    
  } catch (error) {
    console.error('Verify template error:', error);
    res.status(500).json({ error: 'Failed to verify template' });
  }
});

// @route   POST /api/admin/credential-templates/bulk-verify
// @desc    Mark multiple templates as verified
// @access  Admin only
router.post('/credential-templates/bulk-verify', protect, adminOnly, async (req, res) => {
  try {
    const { templateIds } = req.body;
    
    if (!templateIds || !Array.isArray(templateIds)) {
      return res.status(400).json({ error: 'templateIds array required' });
    }
    
    const result = await CredentialTemplate.updateMany(
      { _id: { $in: templateIds } },
      { lastVerified: new Date() }
    );
    
    res.json({ 
      message: `${result.modifiedCount} templates marked as verified`,
      modifiedCount: result.modifiedCount 
    });
    
  } catch (error) {
    console.error('Bulk verify error:', error);
    res.status(500).json({ error: 'Failed to bulk verify templates' });
  }
});

// @route   POST /api/admin/credential-templates/:id/ai-check
// @desc    Use AI to check state board website for current requirements
// @access  Admin only
router.post('/credential-templates/:id/ai-check', protect, adminOnly, async (req, res) => {
  try {
    if (!anthropic) {
      return res.status(500).json({ error: 'AI service not configured' });
    }
    
    const template = await CredentialTemplate.findById(req.params.id);
    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }
    
    // Build the prompt for AI verification
    const currentReqs = template.requirements.map(r => 
      `${r.category}: ${r.hoursRequired} hours`
    ).join(', ');
    
    const prompt = `You are verifying continuing education requirements for mental health professionals.

Current database entry:
- Credential: ${template.code} (${template.name})
- State: ${template.state || 'National'}
- Issuing Body: ${template.issuingBody}
- Renewal Cycle: ${template.renewalCycle} months
- Total CE Required: ${template.totalCEUsRequired} hours
- Requirements: ${currentReqs}
- Notes: ${template.notes || 'None'}

Please search for the current CE requirements for this credential from the official state licensing board or certifying body. 

Return your findings in this JSON format:
{
  "verified": true/false,
  "confidence": "high/medium/low",
  "currentRequirements": {
    "renewalCycle": number (months),
    "totalCEUsRequired": number,
    "requirements": [
      { "category": "Ethics", "hoursRequired": number },
      ...
    ],
    "notes": "any special requirements or changes"
  },
  "changes": [
    "List any differences from our current data"
  ],
  "sourceUrl": "URL of the official source",
  "lastUpdated": "When the requirements were last updated (if known)",
  "summary": "Brief summary of findings"
}

If you cannot verify the requirements, explain why in the summary.`;

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      messages: [{ role: 'user', content: prompt }]
    });
    
    const responseText = message.content[0].text;
    
    // Try to parse JSON from response
    let aiResult;
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        aiResult = JSON.parse(jsonMatch[0]);
      } else {
        aiResult = { 
          verified: false, 
          summary: responseText,
          confidence: 'low'
        };
      }
    } catch (parseError) {
      aiResult = { 
        verified: false, 
        summary: responseText,
        confidence: 'low'
      };
    }
    
    res.json({
      template: {
        id: template._id,
        code: template.code,
        state: template.state,
        name: template.name
      },
      aiVerification: aiResult
    });
    
  } catch (error) {
    console.error('AI check error:', error);
    res.status(500).json({ error: 'Failed to run AI verification' });
  }
});

// @route   GET /api/admin/credential-templates/review-schedule
// @desc    Get recommended review schedule based on state legislative sessions
// @access  Admin only
router.get('/credential-templates/review-schedule', protect, adminOnly, async (req, res) => {
  try {
    // State legislative session patterns (when rules typically change)
    const reviewSchedule = {
      // States with annual sessions - review quarterly
      quarterly: ['CA', 'NY', 'TX', 'FL', 'IL', 'PA', 'OH', 'GA', 'NC', 'MI', 
                  'NJ', 'VA', 'WA', 'AZ', 'MA', 'TN', 'IN', 'MO', 'MD', 'WI',
                  'CO', 'MN', 'SC', 'AL', 'LA', 'KY', 'OR', 'OK', 'CT', 'UT',
                  'IA', 'NV', 'AR', 'MS', 'KS', 'NM', 'NE', 'WV', 'ID', 'HI',
                  'NH', 'ME', 'RI', 'DE', 'SD', 'ND', 'AK', 'DC', 'VT', 'WY', 'MT'],
      // National certs - review semi-annually
      semiAnnual: ['NCC', 'BC-TMH', 'CCTP', 'RPT', 'ACS'],
      // Specialty certs - review annually
      annual: ['EMDR', 'DBT', 'CGP', 'CSAT']
    };
    
    // Get templates needing review this month
    const templates = await CredentialTemplate.find({ isActive: true });
    const now = new Date();
    
    const needsReviewThisMonth = templates.filter(t => {
      const lastVerified = new Date(t.lastVerified || t.createdAt);
      const monthsSince = (now - lastVerified) / (1000 * 60 * 60 * 24 * 30);
      
      // Check based on type
      if (t.type === 'state_license') {
        return monthsSince >= 3; // Quarterly
      } else if (t.type === 'national_cert') {
        return monthsSince >= 6; // Semi-annual
      } else {
        return monthsSince >= 12; // Annual
      }
    });
    
    // Group by priority
    const critical = needsReviewThisMonth.filter(t => {
      const lastVerified = new Date(t.lastVerified || t.createdAt);
      const monthsSince = (now - lastVerified) / (1000 * 60 * 60 * 24 * 30);
      return monthsSince >= 12;
    });
    
    const upcoming = needsReviewThisMonth.filter(t => {
      const lastVerified = new Date(t.lastVerified || t.createdAt);
      const monthsSince = (now - lastVerified) / (1000 * 60 * 60 * 24 * 30);
      return monthsSince >= 6 && monthsSince < 12;
    });
    
    res.json({
      reviewSchedule,
      thisMonth: {
        total: needsReviewThisMonth.length,
        critical: critical.map(t => ({
          id: t._id,
          code: t.code,
          state: t.state,
          name: t.name,
          lastVerified: t.lastVerified
        })),
        upcoming: upcoming.map(t => ({
          id: t._id,
          code: t.code,
          state: t.state,
          name: t.name,
          lastVerified: t.lastVerified
        }))
      },
      nextReviewDate: new Date(now.setMonth(now.getMonth() + 1)).toISOString().split('T')[0]
    });
    
  } catch (error) {
    console.error('Review schedule error:', error);
    res.status(500).json({ error: 'Failed to get review schedule' });
  }
});

// @route   POST /api/admin/credential-templates
// @desc    Create new credential template
// @access  Admin only
router.post('/credential-templates', protect, adminOnly, async (req, res) => {
  try {
    const { 
      type, code, name, state, issuingBody,
      renewalCycle, totalCEUsRequired, requirements,
      renewalFee, renewalUrl, notes
    } = req.body;
    
    // Check for duplicate
    const existing = await CredentialTemplate.findOne({ 
      code, 
      state: state?.toUpperCase() || null,
      type 
    });
    
    if (existing) {
      return res.status(400).json({ 
        error: `Template already exists for ${code}${state ? ` (${state})` : ''}` 
      });
    }
    
    const template = new CredentialTemplate({
      type,
      code,
      name,
      state: state?.toUpperCase(),
      issuingBody,
      renewalCycle,
      totalCEUsRequired,
      requirements: requirements || [],
      renewalFee,
      renewalUrl,
      notes,
      lastVerified: new Date(),
      isActive: true
    });
    
    await template.save();
    
    res.status(201).json({ message: 'Template created', template });
    
  } catch (error) {
    console.error('Create template error:', error);
    res.status(500).json({ error: 'Failed to create template' });
  }
});

// @route   GET /api/admin/credential-export
// @desc    Export all credential templates as CSV
// @access  Admin only
router.get('/credential-export', protect, adminOnly, async (req, res) => {
  try {
    const templates = await CredentialTemplate.find({ isActive: true })
      .sort({ type: 1, state: 1, code: 1 });
    
    const headers = [
      'Type',
      'Code',
      'Name',
      'State',
      'Issuing Body',
      'Renewal Cycle (months)',
      'Total CE Required',
      'Requirements',
      'Notes',
      'Last Verified',
      'Renewal URL'
    ];
    
    const rows = templates.map(t => [
      t.type,
      t.code,
      t.name,
      t.state || 'National',
      t.issuingBody,
      t.renewalCycle,
      t.totalCEUsRequired,
      t.requirements.map(r => `${r.category}:${r.hoursRequired}`).join('; '),
      t.notes || '',
      t.lastVerified?.toISOString().split('T')[0] || '',
      t.renewalUrl || ''
    ]);
    
    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n');
    
    const filename = `credential-templates-${new Date().toISOString().split('T')[0]}.csv`;
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(csv);
    
  } catch (error) {
    console.error('Credential export error:', error);
    res.status(500).json({ error: 'Failed to export credentials' });
  }
});

// ============================================
// BROADCAST / ANNOUNCEMENT ROUTES
// ============================================

// @route   POST /api/admin/broadcast
// @desc    Create a broadcast announcement
// @access  Admin only
router.post('/broadcast', protect, adminOnly, async (req, res) => {
  try {
    const {
      title,
      message,
      type,
      audience,
      targetStates,
      targetCredentials,
      isPinned,
      dismissible,
      sendEmail,
      endDate,
      ceChangeDetails
    } = req.body;
    
    // Set icon and color based on type
    const typeConfig = {
      info: { icon: 'fa-info-circle', color: 'blue' },
      update: { icon: 'fa-sync-alt', color: 'green' },
      maintenance: { icon: 'fa-tools', color: 'amber' },
      promotion: { icon: 'fa-gift', color: 'purple' },
      urgent: { icon: 'fa-exclamation-triangle', color: 'red' },
      ce_change: { icon: 'fa-certificate', color: 'teal' },
      new_course: { icon: 'fa-graduation-cap', color: 'indigo' }
    };
    
    const config = typeConfig[type] || typeConfig.info;
    
    const announcement = new Announcement({
      title,
      message,
      type: type || 'info',
      icon: config.icon,
      color: config.color,
      audience: audience || 'all',
      targetStates: targetStates || [],
      targetCredentials: targetCredentials || [],
      isPinned: isPinned || false,
      dismissible: dismissible !== false,
      sendEmail: sendEmail || false,
      endDate: endDate || null,
      ceChangeDetails: ceChangeDetails || null,
      createdBy: req.user._id,
      isActive: true
    });
    
    await announcement.save();
    
    // Count affected users
    let affectedCount = 0;
    if (audience === 'all') {
      affectedCount = await User.countDocuments();
    } else if (audience === 'by_credential' && (targetStates?.length || targetCredentials?.length)) {
      // This is a rough estimate
      const UserCredential = (await import('../models/UserCredential.js')).default;
      const query = {};
      if (targetStates?.length) query.state = { $in: targetStates };
      if (targetCredentials?.length) query.credentialCode = { $in: targetCredentials };
      const creds = await UserCredential.find(query).distinct('userId');
      affectedCount = creds.length;
    }
    
    res.status(201).json({
      message: 'Broadcast created successfully',
      announcement,
      affectedUsers: affectedCount
    });
    
  } catch (error) {
    console.error('Create broadcast error:', error);
    res.status(500).json({ error: 'Failed to create broadcast' });
  }
});

// @route   POST /api/admin/broadcast/ce-change
// @desc    Create a CE requirement change broadcast
// @access  Admin only
router.post('/broadcast/ce-change', protect, adminOnly, async (req, res) => {
  try {
    const {
      credentialCode,
      state,
      previousRequirements,
      newRequirements,
      effectiveDate,
      sourceUrl,
      sendEmail
    } = req.body;
    
    const title = `CE Requirements Updated: ${credentialCode}${state ? ` (${state})` : ''}`;
    const message = `
      <p>The continuing education requirements for <strong>${credentialCode}${state ? ` (${state})` : ''}</strong> have been updated.</p>
      <div style="background: #f8f9fa; padding: 12px; border-radius: 8px; margin: 12px 0;">
        <p style="margin: 0 0 8px 0;"><strong>Previous:</strong> ${previousRequirements}</p>
        <p style="margin: 0;"><strong>New:</strong> ${newRequirements}</p>
      </div>
      ${effectiveDate ? `<p><strong>Effective:</strong> ${new Date(effectiveDate).toLocaleDateString()}</p>` : ''}
      ${sourceUrl ? `<p><a href="${sourceUrl}" target="_blank" style="color: #8B2635;">View Official Source →</a></p>` : ''}
    `;
    
    const announcement = new Announcement({
      title,
      message,
      type: 'ce_change',
      icon: 'fa-certificate',
      color: 'teal',
      audience: 'by_credential',
      targetStates: state ? [state] : [],
      targetCredentials: credentialCode ? [credentialCode] : [],
      isPinned: true,
      dismissible: true,
      sendEmail: sendEmail || false,
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      ceChangeDetails: {
        credentialCode,
        state,
        previousRequirements,
        newRequirements,
        effectiveDate,
        sourceUrl
      },
      createdBy: req.user._id,
      isActive: true
    });
    
    await announcement.save();
    
    res.status(201).json({
      message: 'CE change broadcast created',
      announcement
    });
    
  } catch (error) {
    console.error('CE change broadcast error:', error);
    res.status(500).json({ error: 'Failed to create CE change broadcast' });
  }
});

// @route   GET /api/admin/broadcasts
// @desc    Get all broadcasts (admin view)
// @access  Admin only
router.get('/broadcasts', protect, adminOnly, async (req, res) => {
  try {
    const broadcasts = await Announcement.find()
      .sort({ createdAt: -1 })
      .limit(50)
      .populate('createdBy', 'email profile.firstName profile.lastName');
    
    res.json({ broadcasts });
  } catch (error) {
    console.error('Get broadcasts error:', error);
    res.status(500).json({ error: 'Failed to get broadcasts' });
  }
});

// @route   DELETE /api/admin/broadcasts/:id
// @desc    Delete a broadcast
// @access  Admin only
router.delete('/broadcasts/:id', protect, adminOnly, async (req, res) => {
  try {
    await Announcement.findByIdAndDelete(req.params.id);
    res.json({ message: 'Broadcast deleted' });
  } catch (error) {
    console.error('Delete broadcast error:', error);
    res.status(500).json({ error: 'Failed to delete broadcast' });
  }
});

// @route   PUT /api/admin/broadcasts/:id/deactivate
// @desc    Deactivate a broadcast (soft delete)
// @access  Admin only
router.put('/broadcasts/:id/deactivate', protect, adminOnly, async (req, res) => {
  try {
    await Announcement.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ message: 'Broadcast deactivated' });
  } catch (error) {
    console.error('Deactivate broadcast error:', error);
    res.status(500).json({ error: 'Failed to deactivate broadcast' });
  }
});

// ============================================
// LEARNER MANAGEMENT ROUTES
// ============================================

// @route   GET /api/admin/users/:userId/enrollments
// @desc    Get all course enrollments for a user
// @access  Admin only
router.get('/users/:userId/enrollments', protect, adminOnly, async (req, res) => {
  try {
    // Query both legacy and interactive course progress
    const [legacyEnrollments, interactiveEnrollments] = await Promise.all([
      UserCourseProgress.find({ userId: req.params.userId })
        .populate('courseId', 'title slug ceuHours ceuEligible thumbnail')
        .sort({ enrolledAt: -1 }),
      InteractiveCourseProgress.find({ userId: req.params.userId })
        .populate('courseId', 'title slug ceHours ceuHours thumbnail')
        .sort({ enrolledAt: -1 })
    ]);

    // Normalize interactive enrollments to match legacy shape
    const normalizedInteractive = interactiveEnrollments.map(e => {
      const obj = e.toObject();
      obj._source = 'interactive';
      return obj;
    });

    const enrollments = [
      ...legacyEnrollments.map(e => { const obj = e.toObject(); obj._source = 'legacy'; return obj; }),
      ...normalizedInteractive
    ].sort((a, b) => new Date(b.enrolledAt || b.createdAt || 0) - new Date(a.enrolledAt || a.createdAt || 0));

    // Get all courses for the "enroll in" dropdown (both legacy + interactive)
    const [allLegacyCourses, allInteractiveCourses] = await Promise.all([
      Course.find({ status: 'published' })
        .select('title slug ceuHours category')
        .sort({ title: 1 }),
      InteractiveCourse.find({ status: 'published' })
        .select('title slug ceHours categories')
        .sort({ title: 1 })
    ]);

    // Filter out already enrolled courses
    const enrolledCourseIds = enrollments.map(e => e.courseId?._id?.toString()).filter(Boolean);
    const availableCourses = [
      ...allLegacyCourses.filter(c => !enrolledCourseIds.includes(c._id.toString())),
      ...allInteractiveCourses.filter(c => !enrolledCourseIds.includes(c._id.toString()))
    ];

    res.json({
      enrollments,
      availableCourses
    });
  } catch (error) {
    console.error('Get user enrollments error:', error);
    res.status(500).json({ error: 'Failed to get enrollments' });
  }
});

// @route   POST /api/admin/users/:userId/enroll
// @desc    Manually enroll a user in a course
// @access  Admin only
router.post('/users/:userId/enroll', protect, adminOnly, async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.params.userId;
    
    // Check user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Check course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    // Check if already enrolled
    const existing = await UserCourseProgress.findOne({ userId, courseId });
    if (existing) {
      return res.status(400).json({ error: 'User is already enrolled in this course' });
    }
    
    // Create enrollment
    const enrollment = new UserCourseProgress({
      userId,
      courseId,
      enrolled: true,
      enrolledAt: new Date(),
      status: 'not_started',
      completedLessons: [],
      quizAttempts: [],
      currentModule: 0,
      currentLesson: 0,
      progressPercent: 0
    });
    
    await enrollment.save();
    
    // Populate course info for response
    await enrollment.populate('courseId', 'title slug ceuHours');
    
    res.json({ 
      message: `Successfully enrolled ${user.firstName} in ${course.title}`,
      enrollment
    });
  } catch (error) {
    console.error('Admin enroll error:', error);
    res.status(500).json({ error: 'Failed to enroll user' });
  }
});

// @route   DELETE /api/admin/users/:userId/enrollments/:courseId
// @desc    Unenroll a user from a course
// @access  Admin only
router.delete('/users/:userId/enrollments/:courseId', protect, adminOnly, async (req, res) => {
  try {
    const { userId, courseId } = req.params;

    const legacyResult = await UserCourseProgress.deleteOne({ userId, courseId });
    const interactiveResult = await InteractiveCourseProgress.deleteOne({ userId, courseId });

    if ((legacyResult.deletedCount || 0) === 0 && (interactiveResult.deletedCount || 0) === 0) {
      return res.status(404).json({ error: 'Enrollment not found' });
    }

    res.json({ message: 'User unenrolled successfully' });
  } catch (error) {
    console.error('Admin unenroll error:', error);
    res.status(500).json({ error: 'Failed to unenroll user' });
  }
});

// @route   POST /api/admin/users/:userId/enrollments/:courseId/reset
// @desc    Reset a user's course progress (keep enrolled)
// @access  Admin only
router.post('/users/:userId/enrollments/:courseId/reset', protect, adminOnly, async (req, res) => {
  try {
    const { userId, courseId } = req.params;

    const enrollment = await UserCourseProgress.findOne({ userId, courseId });
    if (enrollment) {
      // Reset progress but keep enrollment
      enrollment.completedLessons = [];
      enrollment.quizAttempts = [];
      enrollment.currentModule = 0;
      enrollment.currentLesson = 0;
      enrollment.status = 'not_started';
      enrollment.completed = false;
      enrollment.completedAt = null;
      enrollment.progressPercent = 0;

      await enrollment.save();

      return res.json({
        message: 'Course progress reset successfully',
        enrollment
      });
    }

    const interactiveEnrollment = await InteractiveCourseProgress.findOne({ userId: userId, courseId: courseId });
    if (interactiveEnrollment) {
      // Reset progress but keep enrollment (interactive course fields)
      if (Array.isArray(interactiveEnrollment.sectionProgress)) {
        interactiveEnrollment.sectionProgress.forEach((section) => {
          section.viewedBlocks = [];
          section.completedBlocks = [];
          section.quizAttempts = [];
          section.quizPassed = false;
          section.bestQuizScore = undefined;
          section.startedAt = undefined;
          section.completedAt = undefined;
          section.timeSpent = 0;
          section.status = 'not_started';
        });
      }
      interactiveEnrollment.currentSectionIndex = 0;
      interactiveEnrollment.assessmentAttempts = [];
      interactiveEnrollment.assessmentPassed = false;
      interactiveEnrollment.bestAssessmentScore = undefined;
      interactiveEnrollment.evaluationSubmitted = false;
      interactiveEnrollment.evaluationSubmittedAt = undefined;
      interactiveEnrollment.evaluationId = undefined;
      interactiveEnrollment.attestationAgreed = false;
      interactiveEnrollment.attestationAgreedAt = undefined;
      interactiveEnrollment.overallProgress = 0;
      interactiveEnrollment.status = 'not_started';
      interactiveEnrollment.startedAt = undefined;
      interactiveEnrollment.completedAt = undefined;
      interactiveEnrollment.totalTimeSpent = 0;
      interactiveEnrollment.certificateId = undefined;
      interactiveEnrollment.certificateIssuedAt = undefined;

      await interactiveEnrollment.save();

      return res.json({
        message: 'Course progress reset successfully',
        enrollment: interactiveEnrollment
      });
    }

    return res.status(404).json({ error: 'Enrollment not found' });
  } catch (error) {
    console.error('Admin reset progress error:', error);
    res.status(500).json({ error: 'Failed to reset progress' });
  }
});

// @route   POST /api/admin/users/:userId/enrollments/:courseId/complete
// @desc    Mark a course as complete for a user (manual completion)
// @access  Admin only
router.post('/users/:userId/enrollments/:courseId/complete', protect, adminOnly, async (req, res) => {
  try {
    const { userId, courseId } = req.params;
    const { note } = req.body; // Optional admin note

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Try legacy course first, then interactive course
    const legacyCourse = await Course.findById(courseId);
    const interactiveCourse = legacyCourse ? null : await InteractiveCourse.findById(courseId);

    if (!legacyCourse && !interactiveCourse) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Prefer an existing enrollment on whichever model already has it
    let enrollment = await UserCourseProgress.findOne({ userId, courseId });

    if (enrollment) {
      enrollment.status = 'completed';
      enrollment.completed = true;
      enrollment.completedAt = new Date();
      enrollment.progressPercent = 100;
      enrollment.adminCompleted = true;
      enrollment.adminNote = note || 'Manually completed by admin';
      enrollment.adminCompletedBy = req.user._id;
      enrollment.adminCompletedAt = new Date();

      await enrollment.save();

      return res.json({
        message: `Course marked complete for ${user.firstName} ${user.lastName}`,
        enrollment
      });
    }

    let interactiveEnrollment = await InteractiveCourseProgress.findOne({ userId: userId, courseId: courseId });

    if (interactiveEnrollment || interactiveCourse) {
      if (!interactiveEnrollment) {
        interactiveEnrollment = new InteractiveCourseProgress({
          userId,
          courseId,
          enrolledAt: new Date()
        });
      }

      interactiveEnrollment.status = 'completed';
      interactiveEnrollment.completedAt = new Date();
      interactiveEnrollment.overallProgress = 100;
      interactiveEnrollment.assessmentPassed = true;
      interactiveEnrollment.evaluationSubmitted = true;
      interactiveEnrollment.evaluationSubmittedAt = interactiveEnrollment.evaluationSubmittedAt || new Date();
      interactiveEnrollment.attestationAgreed = true;
      interactiveEnrollment.attestationAgreedAt = interactiveEnrollment.attestationAgreedAt || new Date();
      interactiveEnrollment.adminCompleted = true;
      interactiveEnrollment.adminNote = note || 'Manually completed by admin';
      interactiveEnrollment.adminCompletedBy = req.user._id;
      interactiveEnrollment.adminCompletedAt = new Date();

      await interactiveEnrollment.save();

      return res.json({
        message: `Course marked complete for ${user.firstName} ${user.lastName}`,
        enrollment: interactiveEnrollment
      });
    }

    // No existing enrollment and the course is a legacy course — create a new legacy enrollment
    enrollment = new UserCourseProgress({
      userId,
      courseId,
      enrolled: true,
      enrolledAt: new Date()
    });

    enrollment.status = 'completed';
    enrollment.completed = true;
    enrollment.completedAt = new Date();
    enrollment.progressPercent = 100;
    enrollment.adminCompleted = true;
    enrollment.adminNote = note || 'Manually completed by admin';
    enrollment.adminCompletedBy = req.user._id;
    enrollment.adminCompletedAt = new Date();

    await enrollment.save();

    res.json({
      message: `Course marked complete for ${user.firstName} ${user.lastName}`,
      enrollment
    });
  } catch (error) {
    console.error('Admin complete course error:', error);
    res.status(500).json({ error: 'Failed to complete course' });
  }
});

// @route   GET /api/admin/enrollments/search
// @desc    Search enrollments across all users
// @access  Admin only
router.get('/enrollments/search', protect, adminOnly, async (req, res) => {
  try {
    const { courseId, status, page = 1, limit = 20 } = req.query;
    
    const query = {};
    if (courseId) query.courseId = courseId;
    if (status) query.status = status;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const enrollments = await UserCourseProgress.find(query)
      .populate('userId', 'firstName lastName email')
      .populate('courseId', 'title slug ceuHours')
      .sort({ enrolledAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await UserCourseProgress.countDocuments(query);
    
    res.json({
      enrollments,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Search enrollments error:', error);
    res.status(500).json({ error: 'Failed to search enrollments' });
  }
});

// ============================================
// ADMIN COURSE MANAGEMENT
// ============================================

// @route   GET /api/admin/courses
// @desc    Get all courses for admin
// @access  Admin only
router.get('/courses', protect, adminOnly, async (req, res) => {
  try {
    const [legacyCourses, interactiveCourses] = await Promise.all([
      Course.find()
        .select('title slug category ceuHours ceHours status enrollmentCount createdAt isExternal externalUrl importType source wordCount moduleCount price ceuCategories courseCode')
        .sort({ createdAt: -1 })
        .lean(),
      InteractiveCourse.find()
        .select('title slug ceHours status enrollmentCount createdAt wordCount courseCode isPublished')
        .sort({ createdAt: -1 })
        .lean()
    ]);

    const legacy = legacyCourses.map(c => ({ ...c, _collection: 'courses', wordCount: c.wordCount || 0 }));
    const interactive = interactiveCourses.map(c => ({ ...c, _collection: 'interactivecourses', wordCount: c.wordCount || 0 }));

    const all = [...interactive, ...legacy];

    res.json({ courses: all });
  } catch (error) {
    console.error('Get admin courses error:', error);
    res.status(500).json({ error: 'Failed to get courses' });
  }
});

// @route   POST /api/admin/courses
// @desc    Create a new course (supports AI-generated courses with modules)
// @access  Admin only
router.post('/courses', protect, adminOnly, async (req, res) => {
  try {
    const {
      title,
      subtitle,
      description,
      category,
      ceuHours,
      ceuCategories,
      ceuEligible,
      ceuApprovalNumber,
      isExternal,
      externalUrl,
      importType,
      source,
      status,
      accessTier,
      modules,
      objectives,
      instructor,
      settings,
      approvingBody,
      approvalNumber,
      slug: providedSlug,
      // New pricing fields
      price,
      pricingTier,
      stateCompliance,
      applicableStates
    } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Course title is required' });
    }
    
    // Generate slug from title or use provided slug
    const slug = providedSlug || (title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') + '-' + Date.now().toString(36));
    
    // Process modules if provided (from AI Course Builder)
    let processedModules = [];
    if (modules && Array.isArray(modules)) {
      processedModules = modules.map((mod, moduleIndex) => ({
        title: mod.title || `Module ${moduleIndex + 1}`,
        description: mod.description || '',
        order: mod.order || moduleIndex + 1,
        objectives: mod.objectives || [],
        lessons: (mod.lessons || []).map((lesson, lessonIndex) => ({
          title: lesson.title || `Lesson ${lessonIndex + 1}`,
          type: lesson.type || 'text',
          content: lesson.content || '',
          videoUrl: lesson.videoUrl || '',
          duration: lesson.duration || 10,
          order: lesson.order || lessonIndex + 1,
          isFree: lesson.isFree || false,
          resources: lesson.resources || [],
          transcript: lesson.transcript || '',
          // Quiz-specific fields
          questions: lesson.type === 'quiz' ? (lesson.questions || []).map(q => ({
            question: q.question || '',
            type: q.type || 'multiple_choice',
            options: q.options || [],
            correctAnswer: q.correctAnswer,
            explanation: q.explanation || '',
            points: q.points || 1
          })) : [],
          shuffleQuestions: lesson.shuffleQuestions || false,
          shuffleOptions: lesson.shuffleOptions || false,
          showExplanations: lesson.showExplanations !== false,
          timeLimit: lesson.timeLimit || null
        }))
      }));
    }
    
    // Build course data object
    const courseData = {
      title,
      slug,
      description: description || '',
      subtitle: subtitle || '',
      category: category || 'general',
      ceuHours: ceuHours || 0,
      ceuEligible: ceuEligible || ceuHours > 0,
      ceuCategories: ceuCategories || [],
      ceuApprovalNumber: ceuApprovalNumber || '7760',
      isExternal: isExternal || false,
      externalUrl: externalUrl || '',
      importType: importType || 'native',
      source: source || 'native',
      status: status || 'draft',
      accessTier: accessTier || 'professional',
      modules: processedModules,
      objectives: objectives || [],
      instructor: instructor || 'GA Integrated Therapeutic Perspectives LLC',
      approvingBody: approvingBody || 'NBCC',
      approvalNumber: approvalNumber || '7760',
      createdBy: req.user._id,
      // New pricing fields
      price: price || null,
      pricingTier: pricingTier || 'standard',
      stateCompliance: stateCompliance || [],
      applicableStates: applicableStates || stateCompliance || []
    };
    
    // Merge settings if provided
    if (settings && typeof settings === 'object') {
      courseData.settings = {
        linearProgression: settings.linearProgression !== false,
        enforceMinTime: settings.enforceMinTime || false,
        minTimePercent: settings.minTimePercent || 80,
        passingScore: settings.passingScore || 70,
        requireEvaluation: settings.requireEvaluation !== false,
        requireAttestation: settings.requireAttestation !== false,
        certificateEnabled: settings.certificateEnabled !== false,
        allowRetakes: settings.allowRetakes !== false,
        retakePolicy: settings.retakePolicy || 'unlimited',
        maxRetakes: settings.maxRetakes || 3
      };
    }
    
    const course = await Course.create(courseData);
    
    console.log(`Course created: "${course.title}" with ${course.modules.length} modules`);
    
    res.status(201).json({ message: 'Course created', course });
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({ error: 'Failed to create course: ' + error.message });
  }
});

// @route   DELETE /api/admin/courses/:courseId
// @desc    Delete a course and all related data
// @access  Admin only
// @route   GET /api/admin/courses/:courseId
// @desc    Get single course by ID for editing
// @access  Admin only
router.get('/courses/:courseId', protect, adminOnly, async (req, res) => {
  try {
    const course = await InteractiveCourse.findById(req.params.courseId);

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Get enrollment stats
    const enrollmentCount = await InteractiveCourseProgress.countDocuments({
      courseId: course._id
    });

    const completionCount = await InteractiveCourseProgress.countDocuments({
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

// @route   PUT /api/admin/courses/:courseId
// @desc    Update course
// @access  Admin only
router.put('/courses/:courseId', protect, adminOnly, async (req, res) => {
  try {
    const course = await InteractiveCourse.findById(req.params.courseId);

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const updates = req.body;

    // If slug is being changed, check for conflicts
    if (updates.slug && updates.slug !== course.slug) {
      const existingCourse = await InteractiveCourse.findOne({
        slug: updates.slug,
        _id: { $ne: course._id }
      });
      
      if (existingCourse) {
        return res.status(400).json({ 
          error: 'A course with this slug already exists' 
        });
      }
    }
    
    // Strip nbccContentAreas to prevent saving mismatched enum values from stale data
    delete updates.nbccContentAreas;

    // Update fields
    Object.keys(updates).forEach(key => {
      course[key] = updates[key];
    });
    
    course.updatedAt = new Date();

    // Validate the whole document BEFORE saving. course.save() validates the
    // entire course; a single drifted legacy field (e.g. a stale enum on an
    // assessment question type, an approval body, a content-block calloutType)
    // would otherwise surface as a generic 500 with no clue which field failed.
    // Returning the precise offending paths turns "save failed" into something
    // an admin can actually act on.
    const validationError = course.validateSync();
    if (validationError) {
      const fields = Object.entries(validationError.errors || {}).map(([path, e]) => ({
        path,
        kind: e.kind,
        value: e.value,
        message: e.message,
      }));
      console.error('Update course validation failed:', JSON.stringify(fields, null, 2));
      return res.status(400).json({
        error: 'Course has fields that fail validation',
        fields,
      });
    }

    await course.save();
    
    res.json({ 
      success: true,
      course,
      message: 'Course updated successfully'
    });
  } catch (error) {
    console.error('Update course error:', error);
    // Surface real detail (validation/cast) instead of a blind 500.
    res.status(500).json({
      error: 'Failed to update course',
      detail: error.message,
      ...(error.errors ? { fields: Object.keys(error.errors) } : {}),
    });
  }
});

// @route   PATCH /api/admin/courses/:courseId/publish
// @desc    Publish or unpublish a course (handles both Course and InteractiveCourse)
// @access  Admin only
router.patch('/courses/:courseId/publish', protect, adminOnly, async (req, res) => {
  try {
    const { publish } = req.body;
    const courseId = req.params.courseId;
    const newStatus = publish ? 'published' : 'draft';
    const newPublishedAt = publish ? new Date() : null;

    // Try legacy Course collection first
    let course = await Course.findById(courseId).lean();
    let collection = 'courses';

    if (course) {
      // Use updateOne to avoid full-document validation on save (protects against
      // nested subdoc required-field errors in old lesson data)
      await Course.updateOne(
        { _id: courseId },
        { $set: { status: newStatus, publishedAt: newPublishedAt } }
      );
    } else {
      // Fall back to InteractiveCourse (Architecture A) collection
      course = await InteractiveCourse.findById(courseId).lean();
      if (!course) {
        return res.status(404).json({ error: 'Course not found' });
      }
      await InteractiveCourse.updateOne(
        { _id: courseId },
        { $set: { status: newStatus, publishedAt: newPublishedAt } }
      );
      collection = 'interactivecourses';
    }

    // Return refreshed doc
    const updated = collection === 'interactivecourses'
      ? await InteractiveCourse.findById(courseId).lean()
      : await Course.findById(courseId).lean();

    // Send new course announcement when publishing
    if (publish) {
      triggerNewCourseAnnouncement({
        courseTitle: course.title,
        courseSlug: course.slug,
        ceHours: course.ceuHours || course.ceHours,
        contentArea: course.category || course.contentArea,
        description: course.description
      }).catch(err => console.error('triggerNewCourseAnnouncement failed:', err));
    }

    res.json({
      success: true,
      course: updated,
      message: publish ? 'Course published' : 'Course unpublished'
    });
  } catch (error) {
    console.error('Publish course error:', error);
    res.status(500).json({ error: 'Failed to update course status' });
  }
});

// @route   POST /api/admin/courses/:courseId/thumbnail
// @desc    Upload course thumbnail image
// @access  Admin only
router.post('/courses/:courseId/thumbnail', protect, adminOnly, upload.single('thumbnail'), async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }
    
    // Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'counselorready/course-thumbnails',
          public_id: `course-${course._id}-${Date.now()}`,
          transformation: [
            { width: 800, height: 450, crop: 'fill', gravity: 'auto' },
            { quality: 'auto', fetch_format: 'auto' }
          ]
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(req.file.buffer);
    });
    
    // Update course with new thumbnail URL
    course.thumbnail = uploadResult.secure_url;
    course.updatedAt = new Date();
    await course.save();
    
    res.json({
      success: true,
      thumbnailUrl: uploadResult.secure_url,
      message: 'Thumbnail uploaded successfully'
    });
  } catch (error) {
    console.error('Thumbnail upload error:', error);
    res.status(500).json({ error: 'Failed to upload thumbnail' });
  }
});

router.delete('/courses/:courseId', protect, adminOnly, async (req, res) => {
  try {
    const courseId = req.params.courseId;
    
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    // Delete related enrollments
    await UserCourseProgress.deleteMany({ courseId });
    
    // Delete related certificates
    await Certificate.deleteMany({ courseId });
    
    // Delete the course
    await Course.findByIdAndDelete(courseId);
    
    res.json({ message: 'Course and all related data deleted' });
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({ error: 'Failed to delete course' });
  }
});

// ===========================================
// MODULE MANAGEMENT ROUTES
// ===========================================

// @route   POST /api/admin/courses/:courseId/module
// @desc    Add a new module to a course
// @access  Admin only
router.post('/courses/:courseId/module', protect, adminOnly, async (req, res) => {
  try {
    const { title, description } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Module title is required' });
    }
    
    const course = await Course.findById(req.params.courseId);
    
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    // Initialize modules array if it doesn't exist
    if (!course.modules) {
      course.modules = [];
    }
    
    // Add new module
    const newModule = {
      title,
      description: description || '',
      lessons: [],
      order: course.modules.length
    };
    
    course.modules.push(newModule);
    course.updatedAt = new Date();
    await course.save();
    
    res.status(201).json({
      success: true,
      course,
      module: course.modules[course.modules.length - 1],
      message: 'Module added successfully'
    });
  } catch (error) {
    console.error('Add module error:', error);
    res.status(500).json({ error: 'Failed to add module' });
  }
});

// @route   PUT /api/admin/courses/:courseId/module/:moduleIndex
// @desc    Update a module
// @access  Admin only
router.put('/courses/:courseId/module/:moduleIndex', protect, adminOnly, async (req, res) => {
  try {
    const { title, description } = req.body;
    const moduleIndex = parseInt(req.params.moduleIndex);
    
    const course = await Course.findById(req.params.courseId);
    
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    if (!course.modules || moduleIndex >= course.modules.length || moduleIndex < 0) {
      return res.status(404).json({ error: 'Module not found' });
    }
    
    // Update module fields
    if (title) course.modules[moduleIndex].title = title;
    if (description !== undefined) course.modules[moduleIndex].description = description;
    
    course.updatedAt = new Date();
    await course.save();
    
    res.json({
      success: true,
      course,
      module: course.modules[moduleIndex],
      message: 'Module updated successfully'
    });
  } catch (error) {
    console.error('Update module error:', error);
    res.status(500).json({ error: 'Failed to update module' });
  }
});

// @route   DELETE /api/admin/courses/:courseId/module/:moduleIndex
// @desc    Delete a module from a course
// @access  Admin only
router.delete('/courses/:courseId/module/:moduleIndex', protect, adminOnly, async (req, res) => {
  try {
    const moduleIndex = parseInt(req.params.moduleIndex);
    
    const course = await Course.findById(req.params.courseId);
    
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    if (!course.modules || moduleIndex >= course.modules.length || moduleIndex < 0) {
      return res.status(404).json({ error: 'Module not found' });
    }
    
    // Remove the module
    course.modules.splice(moduleIndex, 1);
    
    // Reorder remaining modules
    course.modules.forEach((mod, idx) => {
      mod.order = idx;
    });
    
    course.updatedAt = new Date();
    await course.save();
    
    res.json({
      success: true,
      course,
      message: 'Module deleted successfully'
    });
  } catch (error) {
    console.error('Delete module error:', error);
    res.status(500).json({ error: 'Failed to delete module' });
  }
});

// ===========================================
// LESSON MANAGEMENT ROUTES
// ===========================================

// @route   POST /api/admin/courses/:courseId/module/:moduleIndex/lesson
// @desc    Add a new lesson to a module
// @access  Admin only
router.post('/courses/:courseId/module/:moduleIndex/lesson', protect, adminOnly, async (req, res) => {
  try {
    const { title, type, content, videoUrl, duration, isFree, quizQuestions } = req.body;
    const moduleIndex = parseInt(req.params.moduleIndex);
    
    const course = await Course.findById(req.params.courseId);
    
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    if (!course.modules || moduleIndex >= course.modules.length || moduleIndex < 0) {
      return res.status(404).json({ error: 'Module not found' });
    }
    
    // Initialize lessons array if needed
    if (!course.modules[moduleIndex].lessons) {
      course.modules[moduleIndex].lessons = [];
    }
    
    // Create new lesson
    const newLesson = {
      title: title || 'New Lesson',
      type: type || 'text',
      content: content || '',
      videoUrl: videoUrl || '',
      duration: duration || 0,
      isFree: isFree || false,
      quizQuestions: quizQuestions || [],
      order: course.modules[moduleIndex].lessons.length
    };
    
    course.modules[moduleIndex].lessons.push(newLesson);
    course.updatedAt = new Date();
    await course.save();
    
    const addedLesson = course.modules[moduleIndex].lessons[course.modules[moduleIndex].lessons.length - 1];
    
    res.status(201).json({
      success: true,
      course,
      lesson: addedLesson,
      message: 'Lesson added successfully'
    });
  } catch (error) {
    console.error('Add lesson error:', error);
    res.status(500).json({ error: 'Failed to add lesson' });
  }
});

// @route   PUT /api/admin/courses/:courseId/lesson
// @desc    Update a lesson (by lesson ID or by module/lesson index)
// @access  Admin only
router.put('/courses/:courseId/lesson', protect, adminOnly, async (req, res) => {
  try {
    const { moduleIndex, lessonIndex, lessonId, title, type, content, videoUrl, duration, isFree, quizQuestions } = req.body;
    
    const course = await Course.findById(req.params.courseId);
    
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    let lesson;
    let mIdx, lIdx;
    
    // Find lesson by ID or by indices
    if (lessonId) {
      // Find by lesson ID
      for (let mi = 0; mi < course.modules.length; mi++) {
        const module = course.modules[mi];
        if (module.lessons) {
          for (let li = 0; li < module.lessons.length; li++) {
            if (module.lessons[li]._id.toString() === lessonId) {
              lesson = module.lessons[li];
              mIdx = mi;
              lIdx = li;
              break;
            }
          }
        }
        if (lesson) break;
      }
    } else if (moduleIndex !== undefined && lessonIndex !== undefined) {
      // Find by indices
      mIdx = parseInt(moduleIndex);
      lIdx = parseInt(lessonIndex);
      
      if (course.modules[mIdx] && course.modules[mIdx].lessons && course.modules[mIdx].lessons[lIdx]) {
        lesson = course.modules[mIdx].lessons[lIdx];
      }
    }
    
    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }
    
    // Update lesson fields
    if (title !== undefined) lesson.title = title;
    if (type !== undefined) lesson.type = type;
    if (content !== undefined) lesson.content = content;
    if (videoUrl !== undefined) lesson.videoUrl = videoUrl;
    if (duration !== undefined) lesson.duration = duration;
    if (isFree !== undefined) lesson.isFree = isFree;
    if (quizQuestions !== undefined) lesson.quizQuestions = quizQuestions;
    
    course.updatedAt = new Date();
    await course.save();
    
    res.json({
      success: true,
      course,
      lesson: course.modules[mIdx].lessons[lIdx],
      message: 'Lesson updated successfully'
    });
  } catch (error) {
    console.error('Update lesson error:', error);
    res.status(500).json({ error: 'Failed to update lesson' });
  }
});

// @route   DELETE /api/admin/courses/:courseId/module/:moduleIndex/lesson/:lessonIndex
// @desc    Delete a lesson from a module
// @access  Admin only
router.delete('/courses/:courseId/module/:moduleIndex/lesson/:lessonIndex', protect, adminOnly, async (req, res) => {
  try {
    const moduleIndex = parseInt(req.params.moduleIndex);
    const lessonIndex = parseInt(req.params.lessonIndex);
    
    const course = await Course.findById(req.params.courseId);
    
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    if (!course.modules || moduleIndex >= course.modules.length || moduleIndex < 0) {
      return res.status(404).json({ error: 'Module not found' });
    }
    
    const module = course.modules[moduleIndex];
    
    if (!module.lessons || lessonIndex >= module.lessons.length || lessonIndex < 0) {
      return res.status(404).json({ error: 'Lesson not found' });
    }
    
    // Remove the lesson
    module.lessons.splice(lessonIndex, 1);
    
    // Reorder remaining lessons
    module.lessons.forEach((les, idx) => {
      les.order = idx;
    });
    
    course.updatedAt = new Date();
    await course.save();
    
    res.json({
      success: true,
      course,
      message: 'Lesson deleted successfully'
    });
  } catch (error) {
    console.error('Delete lesson error:', error);
    res.status(500).json({ error: 'Failed to delete lesson' });
  }
});

// @route   PUT /api/admin/courses/:courseId/reorder-modules
// @desc    Reorder modules in a course
// @access  Admin only
router.put('/courses/:courseId/reorder-modules', protect, adminOnly, async (req, res) => {
  try {
    const { moduleOrder } = req.body; // Array of module indices in new order
    
    const course = await Course.findById(req.params.courseId);
    
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    if (!Array.isArray(moduleOrder) || moduleOrder.length !== course.modules.length) {
      return res.status(400).json({ error: 'Invalid module order' });
    }
    
    // Reorder modules
    const newModules = moduleOrder.map((oldIndex, newIndex) => {
      const module = course.modules[oldIndex];
      module.order = newIndex;
      return module;
    });
    
    course.modules = newModules;
    course.updatedAt = new Date();
    await course.save();
    
    res.json({
      success: true,
      course,
      message: 'Modules reordered successfully'
    });
  } catch (error) {
    console.error('Reorder modules error:', error);
    res.status(500).json({ error: 'Failed to reorder modules' });
  }
});

// @route   PUT /api/admin/courses/:courseId/module/:moduleIndex/reorder-lessons
// @desc    Reorder lessons in a module
// @access  Admin only
router.put('/courses/:courseId/module/:moduleIndex/reorder-lessons', protect, adminOnly, async (req, res) => {
  try {
    const { lessonOrder } = req.body; // Array of lesson indices in new order
    const moduleIndex = parseInt(req.params.moduleIndex);
    
    const course = await Course.findById(req.params.courseId);
    
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    if (!course.modules || moduleIndex >= course.modules.length || moduleIndex < 0) {
      return res.status(404).json({ error: 'Module not found' });
    }
    
    const module = course.modules[moduleIndex];
    
    if (!Array.isArray(lessonOrder) || lessonOrder.length !== module.lessons.length) {
      return res.status(400).json({ error: 'Invalid lesson order' });
    }
    
    // Reorder lessons
    const newLessons = lessonOrder.map((oldIndex, newIndex) => {
      const lesson = module.lessons[oldIndex];
      lesson.order = newIndex;
      return lesson;
    });
    
    course.modules[moduleIndex].lessons = newLessons;
    course.updatedAt = new Date();
    await course.save();
    
    res.json({
      success: true,
      course,
      message: 'Lessons reordered successfully'
    });
  } catch (error) {
    console.error('Reorder lessons error:', error);
    res.status(500).json({ error: 'Failed to reorder lessons' });
  }
});

// @route   POST /api/admin/quiz/generate
// @desc    Generate quiz questions using AI from PDF, outline, or content
// @access  Admin only

export default router;
