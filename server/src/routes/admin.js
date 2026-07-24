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
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import adminUsersRouter from './adminUsers.js';
import adminCoursesRouter from './adminCourses.js';
import adminAIRouter from './adminAI.js';
import adminStatsRouter from './adminStats.js';
import adminStripeRouter from './adminStripe.js';
import adminCouponsRouter from './adminCoupons.js';
import Certificate from '../models/Certificate.js';
import certificateService from '../services/certificateService.js';
import { generateCertificate } from '../utils/certificate.js';
import { protect } from '../middleware/auth.js';
import { runDailyNotificationCheck } from '../jobs/dailyNotificationCheck.js';

const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

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
      .populate('userId', 'profile.firstName profile.lastName profile.certificateName email')
      .populate('courseId', 'title ceHours nbccProgramNumber slug learningObjectives objectives ceCategory contentArea categories');

    if (!cert) {
      return res.status(404).json({ success: false, error: 'Certificate not found for this user' });
    }

    const user = cert.userId || {};
    const course = cert.courseId || {};

    const userName =
      (user.profile?.certificateName?.trim()) ||
      `${user.profile?.firstName || ''} ${user.profile?.lastName || ''}`.trim() ||
      user.email ||
      'Unknown';
    const courseTitle = course.title || cert.title;

    const pdfBuffer = await generateCertificate({
      holderName: userName,
      courseName: courseTitle,
      completionDate: cert.completionDate,
      ceHours: cert.ceHours,
      certificateNumber: cert.certificateNumber,
      verificationCode: cert.verificationCode || cert.certificateNumber,
      acepNumber: cert.acepNumber || 'ACEP #7760',
      ceCategory: course.ceCategory || course.contentArea || course.categories?.[0] || 'Counseling Theory/Practice and the Counseling Relationship',
      objectives: course.learningObjectives || course.objectives || [],
      approvingBody: 'NBCC'
    });

    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'raw',
          folder: 'certificates',
          public_id: `cert_${cert.certificateNumber}_${Date.now()}.pdf`
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      const readable = new Readable();
      readable.push(pdfBuffer);
      readable.push(null);
      readable.pipe(uploadStream);
    });

    const newUrl = uploadResult.secure_url;

    const oldPublicId = cert.fileKey;

    cert.fileUrl = newUrl;
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

// ── CONTENT MANIFEST (live-session content) ──────────────────────
// The manifest is a static JSON file in client/public, not a DB doc.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTENT_MANIFEST_PATH = path.resolve(
  __dirname,
  '../../../client/public/content-manifest.json'
);

// Recursive deep-merge: source values win, but nested objects merge instead
// of clobbering. Arrays are replaced wholesale (a slide/handout list is
// authored as a unit, not merged element-by-element).
function deepMerge(target, source) {
  if (Array.isArray(source) || typeof source !== 'object' || source === null) {
    return source;
  }
  const out = (target && typeof target === 'object' && !Array.isArray(target)) ? { ...target } : {};
  for (const key of Object.keys(source)) {
    out[key] = deepMerge(out[key], source[key]);
  }
  return out;
}

// @route   PATCH /api/admin/content-manifest
// @desc    Deep-merge a session entry into content-manifest.json (static file)
// @access  Admin only
router.patch('/content-manifest', protect, adminOnly, async (req, res) => {
  try {
    const { slug, entry } = req.body || {};
    if (!slug || typeof slug !== 'string') {
      return res.status(400).json({ error: 'slug (string) is required' });
    }
    if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
      return res.status(400).json({ error: 'entry (object) is required' });
    }

    let manifest;
    try {
      manifest = JSON.parse(fs.readFileSync(CONTENT_MANIFEST_PATH, 'utf8'));
    } catch (readErr) {
      console.error('Read content-manifest.json error:', readErr?.message || readErr);
      return res.status(500).json({ error: 'Failed to read content-manifest.json' });
    }

    if (!manifest.sessions || typeof manifest.sessions !== 'object') {
      manifest.sessions = {};
    }
    manifest.sessions[slug] = deepMerge(manifest.sessions[slug], entry);

    // Write atomically: write to a temp file, then rename over the original.
    const tmpPath = CONTENT_MANIFEST_PATH + '.tmp';
    fs.writeFileSync(tmpPath, JSON.stringify(manifest, null, 2) + '\n');
    fs.renameSync(tmpPath, CONTENT_MANIFEST_PATH);

    return res.json({ ok: true, slug });
  } catch (err) {
    console.error('PATCH content-manifest error:', err?.message || err);
    return res.status(500).json({ error: 'Failed to update content-manifest.json' });
  }
});

// Mount all admin sub-routers
router.use('/stats', adminStatsRouter);
router.use('/stripe', adminStripeRouter);
router.use('/coupons', adminCouponsRouter);
router.use('/', adminUsersRouter);
router.use('/', adminCoursesRouter);
router.use('/', adminAIRouter);

// ── MANUAL NOTIFICATION TRIGGER (admin only, for testing) ────────
router.post('/trigger-daily-check', protect, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  const { userId } = req.query;

  try {
    console.log(`[Admin] Manual daily check triggered by ${req.user.email}${userId ? ` for userId=${userId}` : ' (all users)'}`);

    if (userId) {
      // Run for a single user — useful for targeted trial email testing
      // Temporarily override the User.find to return just this one user
      // by passing userId context into the function via a wrapper
      const User = (await import('../models/User.js')).default;
      const user = await User.findById(userId).select('_id notifications liabilityInsurance subscription email profile createdAt');
      if (!user) return res.status(404).json({ error: 'User not found' });

      // Run the full check but only for this user by monkey-patching temporarily
      // Simpler: just call the triggers directly based on their trial state
      const { triggerTrialEndingSoon, triggerTrialEndingTomorrow, triggerTrialEnded, triggerNonPaidCheckIn } = await import('../services/notificationTriggerService.js');

      const now = new Date();
      const results = [];

      if (user.subscription?.status === 'trial' && user.subscription?.trialEndsAt) {
        const trialEnd = new Date(user.subscription.trialEndsAt);
        const daysRemaining = Math.ceil((trialEnd - now) / (1000 * 60 * 60 * 24));
        results.push({ field: 'daysRemaining', value: daysRemaining });

        if (daysRemaining === 2) {
          await triggerTrialEndingSoon(userId, { trialEndsAt: trialEnd, daysRemaining });
          results.push({ trigger: 'triggerTrialEndingSoon', fired: true });
        } else if (daysRemaining === 1) {
          await triggerTrialEndingTomorrow(userId, { trialEndsAt: trialEnd });
          results.push({ trigger: 'triggerTrialEndingTomorrow', fired: true });
        } else if (daysRemaining <= 0) {
          await triggerTrialEnded(userId);
          results.push({ trigger: 'triggerTrialEnded', fired: true });
        } else {
          results.push({ trigger: 'none', reason: `daysRemaining=${daysRemaining} — no trigger fires at this value (triggers fire at 2, 1, ≤0)` });
        }
      } else {
        results.push({ status: user.subscription?.status, reason: 'User is not in trial status or has no trialEndsAt' });
      }

      return res.json({ success: true, userId, results });
    }

    // Run for all users
    const stats = await runDailyNotificationCheck();
    return res.json({ success: true, scope: 'all users', stats });

  } catch (err) {
    console.error('[Admin] trigger-daily-check error:', err.message);
    return res.status(500).json({ error: err.message });
  }
});

export default router;
