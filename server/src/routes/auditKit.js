/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import express from 'express';
import UserCredential from '../models/UserCredential.js';
import Certificate from '../models/Certificate.js';
import UserCourseProgress from '../models/UserCourseProgress.js';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.use(protect);

// ── Generate audit preparation package (JSON manifest) ──
router.get('/prepare', async (req, res) => {
  try {
    const userId = req.user._id;
    const { credentialId, startDate, endDate } = req.query;

    // Get user profile
    const user = await User.findById(userId).select('profile email');

    // Date range filter
    const dateFilter = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);

    // Get credential(s)
    const credQuery = { userId };
    if (credentialId) credQuery._id = credentialId;
    const credentials = await UserCredential.find(credQuery);

    // Get all certificates in date range
    const certQuery = { userId };
    if (startDate || endDate) certQuery.completionDate = dateFilter;
    const certificates = await Certificate.find(certQuery).sort({ completionDate: -1 });

    // Get completed courses
    const progressQuery = { userId, completed: true };
    const completedCourses = await UserCourseProgress.find(progressQuery)
      .populate('courseId', 'title ceHours category');

    // Build the audit package
    const auditPackage = {
      generatedAt: new Date().toISOString(),
      generatedFor: {
        name: `${user.profile.firstName} ${user.profile.lastName || ''}`.trim(),
        email: user.email,
        state: user.profile.state
      },
      dateRange: {
        from: startDate || 'All time',
        to: endDate || 'Present'
      },

      // Credential summary
      credentials: credentials.map(cred => ({
        name: cred.name,
        type: cred.credentialType,
        licenseNumber: cred.licenseNumber,
        issuingBody: cred.issuingBody,
        state: cred.state,
        issueDate: cred.issueDate,
        expirationDate: cred.expirationDate,
        totalCEUsRequired: cred.totalCEUsRequired,
        totalCEUsCompleted: cred.totalCEUsCompleted,
        percentComplete: cred.percentComplete,
        requirements: cred.getRemainingHours(),
        ceuLog: cred.ceuLogs.map(log => ({
          date: log.date,
          hours: log.hours,
          category: log.category,
          source: log.source,
          description: log.description,
          provider: log.provider
        }))
      })),

      // Certificate inventory
      certificates: certificates.map(cert => ({
        title: cert.title,
        provider: cert.provider,
        completionDate: cert.completionDate,
        ceHours: cert.ceHours,
        category: cert.category,
        certificateNumber: cert.certificateNumber,
        verificationCode: cert.verificationCode,
        verificationUrl: cert.verificationUrl,
        nbccApproved: cert.nbccApproved,
        approvingBody: cert.approvingBody,
        approvalNumber: cert.approvalNumber,
        fileUrl: cert.fileUrl,
        fileName: cert.fileName
      })),

      // Course completion records
      completedCourses: completedCourses.map(p => ({
        courseTitle: p.courseId?.title || 'Unknown',
        ceHours: p.courseId?.ceHours || 0,
        category: p.courseId?.category || 'General',
        completedAt: p.completedAt || p.updatedAt
      })),

      // Totals
      summary: {
        totalCertificates: certificates.length,
        totalCEHoursDocumented: certificates.reduce((sum, c) => sum + (c.ceHours || 0), 0),
        totalCoursesCompleted: completedCourses.length,
        credentialCount: credentials.length
      },

      // Checklist for the counselor
      auditChecklist: [
        { item: 'CE certificates collected', done: certificates.length > 0 },
        { item: 'License numbers documented', done: credentials.some(c => c.licenseNumber) },
        { item: 'All CE categories met', done: credentials.every(c => c.percentComplete >= 100) },
        { item: 'Verification codes available', done: certificates.some(c => c.verificationCode) },
        { item: 'Supervision hours documented (if applicable)', done: false, note: 'Verify manually' }
      ]
    };

    res.json(auditPackage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Get list of certificate files for download ──
router.get('/files', async (req, res) => {
  try {
    const certificates = await Certificate.find({
      userId: req.user._id,
      fileUrl: { $exists: true, $ne: null }
    }).select('title fileUrl fileName completionDate ceHours category');

    res.json(certificates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
