/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
// admin.js — Admin route orchestrator
// Split into sub-files for maintainability:
//   adminUsers.js    — Stats, activity, user management, hardship
//   adminCourses.js  — Credentials, broadcasts, enrollments, course CRUD
//   adminAI.js       — AI quiz/course/module generation

import express from 'express';
import adminUsersRouter from './adminUsers.js';
import adminCoursesRouter from './adminCourses.js';
import adminAIRouter from './adminAI.js';
import adminStatsRouter from './adminStats.js';
import adminStripeRouter from './adminStripe.js';
import adminCouponsRouter from './adminCoupons.js';
import Certificate from '../models/Certificate.js';
import certificateService from '../services/certificateService.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// Extract Cloudinary public_id from a secure_url.
// Cloudinary URL shape: https://res.cloudinary.com/<cloud>/raw/upload/v<version>/<public_id>
function extractCloudinaryPublicId(url) {
  if (!url || typeof url !== 'string') return null;
  const m = url.match(/\/upload\/(?:v\d+\/)?(.+)$/);
  return m ? m[1] : null;
}

// @route   GET /api/admin/users/:userId/certificates
// @desc    List certificates issued to a user
// @access  Admin only
router.get('/users/:userId/certificates', protect, adminOnly, async (req, res) => {
  try {
    const { userId } = req.params;
    const certificates = await Certificate.find({
      userId,
      isRevoked: { $ne: true }
    })
      .populate('courseId', 'title ceHours slug courseCode')
      .sort({ completionDate: -1 });

    return res.json({ success: true, data: certificates });
  } catch (err) {
    console.error('List user certificates error:', err);
    return res.status(500).json({ success: false, error: 'Failed to list certificates' });
  }
});

// @route   POST /api/admin/users/:userId/certificates/:certId/regenerate
// @desc    Regenerate a user's certificate PDF (rebuilds with current user name)
// @access  Admin only
router.post('/users/:userId/certificates/:certId/regenerate', protect, adminOnly, async (req, res) => {
  try {
    const { userId, certId } = req.params;

    const cert = await Certificate.findOne({ _id: certId, userId })
      .populate('userId', 'firstName lastName email')
      .populate('courseId', 'title ceHours nbccProgramNumber slug');

    if (!cert) {
      return res.status(404).json({ success: false, error: 'Certificate not found for this user' });
    }

    const user = cert.userId || {};
    const course = cert.courseId || {};

    const userName =
      `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email || 'Unknown';
    const courseTitle = course.title || cert.title;

    const newUrl = await certificateService.generatePDF({
      certificateNumber: cert.certificateNumber,
      userName,
      courseTitle,
      completionDate: cert.completionDate,
      ceHours: cert.ceHours,
      nbccNumber: course.nbccProgramNumber || '',
      providerNumber: '7760'
    });

    const oldPublicId = cert.fileKey;

    cert.fileUrl = newUrl.includes('?') ? `${newUrl}&t=${Date.now()}` : `${newUrl}?t=${Date.now()}`;
    const newPublicId = extractCloudinaryPublicId(newUrl);
    if (newPublicId) cert.fileKey = newPublicId;
    await cert.save();

    if (oldPublicId && typeof certificateService.deletePDF === 'function') {
      try {
        await certificateService.deletePDF(oldPublicId);
      } catch (delErr) {
        console.warn('Failed to delete old certificate PDF:', delErr?.message || delErr);
      }
    }

    return res.json({
      success: true,
      data: {
        certificateId: cert._id,
        certificateNumber: cert.certificateNumber,
        pdfUrl: cert.fileUrl,
        regeneratedAt: new Date().toISOString()
      }
    });
  } catch (err) {
    console.error('Regenerate certificate error:', err);
    return res.status(500).json({ success: false, error: 'Failed to regenerate certificate' });
  }
});

// Mount all admin sub-routers
router.use('/stats', adminStatsRouter);
router.use('/stripe', adminStripeRouter);
router.use('/coupons', adminCouponsRouter);
router.use('/', adminUsersRouter);
router.use('/', adminCoursesRouter);
router.use('/', adminAIRouter);

export default router;
