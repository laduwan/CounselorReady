/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
// /server/src/routes/certificates.js
import { Router } from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import Certificate from '../models/Certificate.js';
import { protect } from '../middleware/auth.js';
import { generateCertificate, generateCertificateNumber } from '../utils/certificate.js';
import User from '../models/User.js';
import Course from '../models/Course.js';
import { Course as InteractiveCourse, CourseProgress } from '../models/InteractiveCourse.js';
import { logActivity, ACTIVITY_TYPES } from '../services/activityTrackingService.js';
import logger from '../utils/logger.js';

// Use native fetch (Node 18+) — no need for node-fetch

// Create router instance
const router = Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowed = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, JPG, and PNG files are allowed'), false);
    }
  }
});

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// ✅ FIXED: Certificate serving using Cloudinary private download API
// Bypasses "Restrict unsigned delivery" / "Strict transformations" settings
router.get('/:id/serve', protect, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }
    const userId = req.user._id;

    logger.info({ certificateId: id, userId, requestId: req.requestId }, 'Certificate serve request');

    const certificate = await Certificate.findById(id);
    
    if (!certificate) {
      return res.status(404).json({ error: 'Certificate not found' });
    }

    if (certificate.userId.toString() !== userId.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (!certificate.fileUrl) {
      return res.status(404).json({ error: 'Certificate file not available' });
    }

    logger.info({ certificateId: id, certificateNumber: certificate.certificateNumber, fileUrl: certificate.fileUrl, requestId: req.requestId }, 'Serving certificate');

    // Extract public_id from the Cloudinary URL
    const urlMatch = certificate.fileUrl.match(/\/upload\/(?:v\d+\/)?(.+)$/);
    
    if (!urlMatch) {
      logger.info({ certificateId: id, requestId: req.requestId }, 'Could not parse Cloudinary URL');
      return res.status(404).json({ error: 'Certificate file URL is malformed' });
    }

    const fullPath = urlMatch[1];
    const publicId = fullPath.replace(/\.[^.]+$/, '');
    const ext = fullPath.match(/\.([^.]+)$/)?.[1] || 'pdf';
    
    logger.info({ publicId, ext, requestId: req.requestId }, 'Extracted Cloudinary public_id');

    // Detect resource type from the Cloudinary URL path (most reliable)
    // Platform certs: /raw/upload/..., user-scanned certs: /image/upload/...
    const resType = certificate.fileUrl.includes('/raw/upload') ? 'raw' : 'image';
    const altResType = resType === 'raw' ? 'image' : 'raw';

    logger.info({ resType, fileUrl: certificate.fileUrl.substring(0, 80), requestId: req.requestId }, 'Detected Cloudinary resource type');

    // Strategy 0: Try the stored fileUrl directly (works when unsigned delivery is allowed)
    try {
      const directRes = await fetch(certificate.fileUrl);
      if (directRes.ok) {
        const arrayBuffer = await directRes.arrayBuffer();
        const fileBuffer = Buffer.from(arrayBuffer);
        logger.info({ size: fileBuffer.length, requestId: req.requestId }, 'Direct fileUrl fetch worked');
        return sendFile(res, fileBuffer, certificate, ext);
      }
      logger.info({ status: directRes.status, requestId: req.requestId }, 'Direct fileUrl fetch returned non-OK');
    } catch (directErr) {
      logger.info({ err: directErr, requestId: req.requestId }, 'Direct fileUrl fetch failed');
    }

    // Use Cloudinary's private_download_url API - this generates an authenticated
    // API-based download URL that bypasses CDN delivery restrictions
    try {
      const downloadUrl = cloudinary.utils.private_download_url(publicId, ext, {
        resource_type: resType,
        type: 'upload',
        expires_at: Math.floor(Date.now() / 1000) + 3600
      });
      
      logger.info({ downloadUrl: downloadUrl.substring(0, 80), requestId: req.requestId }, 'Generated private download URL');
      
      const response = await fetch(downloadUrl);
      
      if (response.ok) {
        const arrayBuffer = await response.arrayBuffer();
        const fileBuffer = Buffer.from(arrayBuffer);
        logger.info({ size: fileBuffer.length, requestId: req.requestId }, 'Private download worked');
        return sendFile(res, fileBuffer, certificate, ext);
      }
      
      logger.info({ status: response.status, body: await response.text(), requestId: req.requestId }, 'Private download returned non-OK');
    } catch (dlErr) {
      logger.info({ err: dlErr, requestId: req.requestId }, 'Private download URL failed');
    }

    // Strategy 2: Use Admin API to get raw content via explicit download
    try {
      logger.info({ requestId: req.requestId }, 'Trying Admin API download');
      // Generate a URL using the Cloudinary API endpoint directly
      const timestamp = Math.floor(Date.now() / 1000);
      const apiKey = process.env.CLOUDINARY_API_KEY;
      const apiSecret = process.env.CLOUDINARY_API_SECRET;
      const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
      
      // Create signature for the download
      const crypto = await import('crypto');
      const toSign = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
      const signature = crypto.createHash('sha1').update(toSign).digest('hex');
      
      const apiDownloadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/${resType}/download?` +
        `public_id=${encodeURIComponent(publicId)}&` +
        `timestamp=${timestamp}&` +
        `api_key=${apiKey}&` +
        `signature=${signature}&` +
        `format=${ext}`;
      
      logger.info({ requestId: req.requestId }, 'Trying API download endpoint');
      
      const apiResponse = await fetch(apiDownloadUrl);
      
      if (apiResponse.ok) {
        const arrayBuffer = await apiResponse.arrayBuffer();
        const fileBuffer = Buffer.from(arrayBuffer);
        logger.info({ size: fileBuffer.length, requestId: req.requestId }, 'API download worked');
        return sendFile(res, fileBuffer, certificate, ext);
      }
      
      logger.info({ status: apiResponse.status, requestId: req.requestId }, 'API download returned non-OK');
    } catch (apiErr) {
      logger.info({ err: apiErr, requestId: req.requestId }, 'API download failed');
    }

    // Strategy 3: Use cloudinary.url with auth token
    try {
      const signedUrl = cloudinary.url(publicId, {
        sign_url: true,
        resource_type: resType,
        format: ext,
        secure: true,
        type: 'upload'
      });
      logger.info({ signedUrl, requestId: req.requestId }, 'Trying signed URL');
      
      const signedResult = await fetch(signedUrl);
      if (signedResult.ok) {
        const arrayBuffer = await signedResult.arrayBuffer();
        const fileBuffer = Buffer.from(arrayBuffer);
        logger.info({ size: fileBuffer.length, requestId: req.requestId }, 'Signed URL worked');
        return sendFile(res, fileBuffer, certificate, ext);
      }
      logger.info({ status: signedResult.status, requestId: req.requestId }, 'Signed URL returned non-OK');
    } catch (signErr) {
      logger.info({ err: signErr, requestId: req.requestId }, 'Signed URL failed');
    }

    // Strategy 4: Retry with opposite resource type (handles legacy mismatches)
    try {
      logger.info({ altResType, requestId: req.requestId }, 'Retrying with alternate resource type');
      const altUrl = cloudinary.utils.private_download_url(publicId, ext, {
        resource_type: altResType,
        type: 'upload',
        expires_at: Math.floor(Date.now() / 1000) + 3600
      });
      const altRes = await fetch(altUrl);
      if (altRes.ok) {
        const arrayBuffer = await altRes.arrayBuffer();
        const fileBuffer = Buffer.from(arrayBuffer);
        logger.info({ size: fileBuffer.length, altResType, requestId: req.requestId }, 'Alternate resource type worked');
        return sendFile(res, fileBuffer, certificate, ext);
      }
      logger.info({ status: altRes.status, requestId: req.requestId }, 'Alternate resource type also failed');
    } catch (altErr) {
      logger.info({ err: altErr, requestId: req.requestId }, 'Alternate resource type error');
    }

    // All strategies exhausted
    logger.error({ certificateId: id, requestId: req.requestId }, 'All Cloudinary access methods failed. Check Cloudinary security settings.');
    logger.error({ certificateId: id, requestId: req.requestId }, 'Go to Cloudinary Dashboard → Settings → Security → Disable "Restrict unsigned delivery"');
    return res.status(503).json({ 
      error: 'Certificate file cannot be accessed. Cloudinary delivery is restricted.',
      hint: 'Admin: Check Cloudinary security settings'
    });

  } catch (error) {
    logger.error({ err: error, userId: req.user?._id, requestId: req.requestId }, 'Certificate serving error');
    res.status(500).json({ error: 'Failed to serve certificate' });
  }
});

// Helper: send file with proper headers
function sendFile(res, fileBuffer, certificate, ext) {
  const fileName = certificate.fileName || `certificate.${ext}`;
  const isImage = /^(jpg|jpeg|png)$/i.test(ext);
  const contentType = isImage 
    ? (ext === 'png' ? 'image/png' : 'image/jpeg')
    : 'application/pdf';

  res.set({
    'Content-Type': contentType,
    'Content-Disposition': `inline; filename="${fileName}"`,
    'Content-Length': fileBuffer.length,
    'Cache-Control': 'private, max-age=3600'
  });
  try {
    if (global.posthog) {
      global.posthog.capture({
        distinctId: (certificate.userId || certificate.user || 'unknown').toString(),
        event: 'certificate_downloaded',
        properties: {
          certificateId: certificate._id?.toString() || '',
          courseTitle: certificate.courseTitle || certificate.title || '',
          ceHours: certificate.ceHours || 0,
          fileType: contentType
        }
      });
    }
  } catch (phErr) { logger.error({ err: phErr, certificateId: certificate._id }, 'PostHog certificate_downloaded failed'); }
  return res.send(fileBuffer);
}

// GET /api/certificates/my - Get current user's certificates (used by dashboard)
router.get('/my', protect, async (req, res) => {
  try {
    const certificates = await Certificate.find({ userId: req.user._id, isRevoked: { $ne: true } })
      .sort({ completionDate: -1 })
      .lean();

    // Enrich certs with missing title/category from linked course
    const needsEnrich = certificates.filter(c => c.courseId && (!c.title || c.title === 'Certificate' || c.category === 'General'));
    if (needsEnrich.length) {
      const courseIds = [...new Set(needsEnrich.map(c => c.courseId.toString()))];
      const [legacyCourses, interactiveCourses] = await Promise.all([
        Course.find({ _id: { $in: courseIds } }).select('title categories ceHours acepNumber').lean(),
        InteractiveCourse.find({ _id: { $in: courseIds } }).select('title categories ceHours acepNumber').lean()
      ]);
      const courseMap = {};
      for (const c of [...legacyCourses, ...interactiveCourses]) {
        courseMap[c._id.toString()] = c;
      }
      for (const cert of certificates) {
        if (!cert.courseId) continue;
        const course = courseMap[cert.courseId.toString()];
        if (!course) continue;
        if (!cert.title || cert.title === 'Certificate') cert.title = course.title;
        if (cert.category === 'General' && course.categories?.[0]) cert.category = course.categories[0];
        if (!cert.nbccApproved && course.acepNumber) cert.nbccApproved = true;
        if (!cert.acepNumber && course.acepNumber) cert.acepNumber = course.acepNumber;
      }
    }

    res.json({ certificates });
  } catch (error) {
    logger.error({ err: error, userId: req.user?._id, requestId: req.requestId }, 'Get my certificates error');
    res.status(500).json({ error: 'Failed to fetch certificates' });
  }
});

// GET /api/certificates - Get all certificates for authenticated user
router.get('/', protect, async (req, res) => {
  try {
    const certificates = await Certificate.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .lean();

    // Enrich certs that have incomplete data by looking up the linked course
    const needsEnrich = certificates.filter(c => c.courseId && (!c.title || c.title === 'Certificate' || c.category === 'General'));
    if (needsEnrich.length) {
      const courseIds = [...new Set(needsEnrich.map(c => c.courseId.toString()))];
      const [legacyCourses, interactiveCourses] = await Promise.all([
        Course.find({ _id: { $in: courseIds } }).select('title categories ceHours acepNumber').lean(),
        InteractiveCourse.find({ _id: { $in: courseIds } }).select('title categories ceHours acepNumber').lean()
      ]);
      const courseMap = {};
      for (const c of [...legacyCourses, ...interactiveCourses]) {
        courseMap[c._id.toString()] = c;
      }
      for (const cert of certificates) {
        if (!cert.courseId) continue;
        const course = courseMap[cert.courseId.toString()];
        if (!course) continue;
        if (!cert.title || cert.title === 'Certificate') cert.title = course.title;
        if (cert.category === 'General' && course.categories?.[0]) cert.category = course.categories[0];
        if (!cert.nbccApproved && course.acepNumber) cert.nbccApproved = true;
        if (!cert.acepNumber && course.acepNumber) cert.acepNumber = course.acepNumber;
      }
    }
    
    logger.info({ userId: req.user._id, count: certificates.length, requestId: req.requestId }, 'Retrieved certificates');
    res.json({ certificates });
  } catch (error) {
    logger.error({ err: error, userId: req.user?._id, requestId: req.requestId }, 'Get certificates error');
    res.status(500).json({ error: 'Failed to fetch certificates' });
  }
});

// POST /api/certificates/upload - Upload new certificate
router.post('/upload', protect, upload.single('certificate'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const {
      title,
      provider,
      completionDate,
      ceHours,
      category = 'General',
      nbccApproved = false,
      approvingBody,
      approvalNumber,
      applicability,
      notes,
      credentials
    } = req.body;

    // Validate required fields
    if (!title || !provider || !completionDate || !ceHours) {
      return res.status(400).json({ 
        success: false,
        error: 'Missing required fields: title, provider, completionDate, ceHours' 
      });
    }

    logger.info({ userId: req.user._id, title, requestId: req.requestId }, 'Uploading certificate');

    // Generate certificate number
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
    const certificateNumber = `CR-${randomStr}-${timestamp.toString().slice(-4)}`;

    // Upload to Cloudinary
    const isPDF = req.file.mimetype === 'application/pdf';
    const fileExt = isPDF ? 'pdf' : (req.file.mimetype === 'image/png' ? 'png' : 'jpg');
    
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: `certificates/${req.user._id}`,
          public_id: `cert_${timestamp}`,
          resource_type: 'image',
          format: fileExt
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(req.file.buffer);
    });

    logger.info({ userId: req.user._id, secureUrl: uploadResult.secure_url, requestId: req.requestId }, 'File uploaded to Cloudinary');

    // Create certificate record
    const certificate = new Certificate({
      userId: req.user._id,
      title,
      provider,
      completionDate: new Date(completionDate),
      ceHours: parseFloat(ceHours),
      category,
      nbccApproved: nbccApproved === 'true' || nbccApproved === true,
      approvingBody,
      approvalNumber,
      applicability: applicability || null,
      notes,
      certificateNumber,
      fileUrl: uploadResult.secure_url,
      fileKey: uploadResult.public_id,
      fileName: req.file.originalname,
      fileType: req.file.mimetype,
      source: 'upload',
      credentials: credentials ? JSON.parse(credentials) : []
    });

    await certificate.save();
    logger.info({ userId: req.user._id, certificateId: certificate._id, requestId: req.requestId }, 'Certificate saved');

    res.status(201).json({
      success: true,
      message: 'Certificate uploaded successfully',
      certificate
    });

  } catch (error) {
    logger.error({ err: error, userId: req.user?._id, requestId: req.requestId }, 'Certificate upload error');
    res.status(500).json({ 
      success: false,
      error: 'Failed to upload certificate: ' + error.message 
    });
  }
});

// POST /api/certificates/generate/:courseId - Generate certificate for completed course
router.post('/generate/:courseId', protect, async (req, res) => {
  try {
    const { courseId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }
    const userId = req.user._id;

    logger.info({ courseId, userId, requestId: req.requestId }, 'Certificate generation request');

    // Check if certificate already exists
    const existingCert = await Certificate.findOne({
      userId,
      courseId,
      source: 'platform'
    });

    if (existingCert) {
      return res.status(400).json({
        success: false,
        error: 'Certificate already exists for this course',
        certificate: existingCert
      });
    }

    // Get course and verify completion (try both legacy and interactive models)
    let course = await Course.findById(courseId);
    if (!course) {
      course = await InteractiveCourse.findById(courseId);
    }
    if (!course) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }

    const progress = await CourseProgress.findOne({ userId, courseId });
    if (!progress) {
      return res.status(404).json({ success: false, error: 'Not enrolled in this course' });
    }

    // Verify eligibility
    const allSectionsCompleted = progress.sectionProgress.every(s => s.status === 'completed');
    const assessmentPassed = progress.assessmentPassed;
    if (!allSectionsCompleted || !assessmentPassed) {
      return res.status(400).json({
        success: false,
        error: 'Course not completed. All sections must be completed and assessment must be passed.'
      });
    }

    // Get user info
    const user = await User.findById(userId);
    const holderName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : 'Student';

    // Generate certificate number and verification code
    const certNumber = await generateCertificateNumber();
    const verificationCode = certNumber.replace('CR-', '').toLowerCase();

    // Build customization from course settings
    const customization = course.settings?.certificateCustomization || {};

    // Generate PDF
    const pdfBuffer = await generateCertificate({
      holderName,
      courseName: course.title,
      completionDate: progress.completedAt || new Date(),
      ceHours: course.ceHours || course.ceuHours || 0,
      certificateNumber: certNumber,
      instructorName: course.presenter?.name || 'CounselorReady',
      acepNumber: course.acepNumber || 'ACEP #7760',
      verificationCode,
      customization
    });

    // Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: `certificates/${userId}`,
          resource_type: 'raw',
          public_id: `cert_${certNumber.replace(/[^a-zA-Z0-9]/g, '_')}`,
          format: 'pdf'
        },
        (error, result) => error ? reject(error) : resolve(result)
      );
      stream.end(pdfBuffer);
    });

    // Create certificate record
    const certificate = await Certificate.create({
      userId,
      courseId,
      title: course.title,
      provider: 'CounselorReady',
      completionDate: progress.completedAt || new Date(),
      ceHours: course.ceHours || course.ceuHours || 0,
      category: course.categories?.[0] || 'General',
      nbccApproved: true,
      approvingBody: 'NBCC',
      approvalNumber: course.acepNumber || '7760',
      acepNumber: course.acepNumber || '7760',
      certificateNumber: certNumber,
      fileUrl: uploadResult.secure_url,
      fileKey: uploadResult.public_id,
      cloudinaryPublicId: uploadResult.public_id,
      source: 'platform',
      verificationCode,
      verificationUrl: `https://counselorready.com/verify/${verificationCode}`
    });

    // Update progress with certificate reference
    progress.certificateId = certificate._id;
    progress.certificateIssuedAt = new Date();
    progress.status = 'certified';
    await progress.save();

    // Notify admin of certificate generation
    logActivity(ACTIVITY_TYPES.CERTIFICATE_GENERATED, {
      courseName: course.title,
      certificateNumber: certNumber,
      ceHours: course.ceHours || course.ceuHours || 0
    }, {
      userId,
      userName: holderName,
      userEmail: user?.email || ''
    }).catch(() => {});

    res.json({
      success: true,
      certificate: {
        id: certificate._id,
        certificateNumber: certNumber,
        fileUrl: uploadResult.secure_url,
        verificationCode
      }
    });

  } catch (error) {
    logger.error({ err: error, userId: req.user?._id, requestId: req.requestId }, 'Certificate generation error');
    res.status(500).json({
      success: false,
      error: 'Failed to generate certificate'
    });
  }
});

// DELETE /api/certificates/:id - Delete certificate
router.delete('/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }
    const userId = req.user._id;

    const certificate = await Certificate.findOneAndDelete({
      _id: id,
      userId: userId
    });

    if (!certificate) {
      return res.status(404).json({ error: 'Certificate not found' });
    }

    logger.info({ certificateId: id, certificateNumber: certificate.certificateNumber, userId, requestId: req.requestId }, 'Deleted certificate');

    // Optionally delete from Cloudinary
    if (certificate.fileKey) {
      try {
        const delResType = certificate.source === 'platform' ? 'raw' : 'image';
        await cloudinary.uploader.destroy(certificate.fileKey, { resource_type: delResType });
        logger.info({ fileKey: certificate.fileKey, requestId: req.requestId }, 'Deleted file from Cloudinary');
      } catch (cloudinaryError) {
        logger.error({ err: cloudinaryError, fileKey: certificate.fileKey, requestId: req.requestId }, 'Failed to delete from Cloudinary');
      }
    }

    res.json({ message: 'Certificate deleted successfully' });
  } catch (error) {
    logger.error({ err: error, userId: req.user?._id, requestId: req.requestId }, 'Delete certificate error');
    res.status(500).json({ error: 'Failed to delete certificate' });
  }
});

// GET /api/certificates/download-all - Download all certificates as ZIP
router.get('/download-all', protect, async (req, res) => {
  try {
    const certificates = await Certificate.find({ userId: req.user._id, isRevoked: { $ne: true } });
    if (!certificates.length) {
      return res.status(404).json({ error: 'No certificates found' });
    }

    const AdmZip = (await import('adm-zip')).default;
    const zip = new AdmZip();

    // Fetch each certificate file and add to ZIP
    let addedCount = 0;
    for (const cert of certificates) {
      try {
        // Try to get the certificate PDF from Cloudinary
        if (cert.cloudinaryPublicId) {
          const url = cloudinary.url(cert.cloudinaryPublicId, {
            resource_type: 'raw',
            secure: true,
            sign_url: true,
            type: 'authenticated'
          });
          const response = await fetch(url);
          if (response.ok) {
            const buffer = Buffer.from(await response.arrayBuffer());
            const filename = `${(cert.title || 'certificate').replace(/[^a-zA-Z0-9]/g, '_')}_${cert.certificateNumber || addedCount}.pdf`;
            zip.addFile(filename, buffer);
            addedCount++;
            continue;
          }
        }
        // Fallback: generate certificate PDF on the fly
        if (cert.fileUrl) {
          const response = await fetch(cert.fileUrl);
          if (response.ok) {
            const buffer = Buffer.from(await response.arrayBuffer());
            const filename = `${(cert.title || 'certificate').replace(/[^a-zA-Z0-9]/g, '_')}_${cert.certificateNumber || addedCount}.pdf`;
            zip.addFile(filename, buffer);
            addedCount++;
          }
        }
      } catch (fetchErr) {
        logger.error({ err: fetchErr, certificateId: cert._id, requestId: req.requestId }, 'Failed to fetch certificate for bulk download');
      }
    }

    if (addedCount === 0) {
      return res.status(404).json({ error: 'No downloadable certificates found' });
    }

    const zipBuffer = zip.toBuffer();
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename="CounselorReady_Certificates.zip"');
    res.setHeader('Content-Length', zipBuffer.length);
    res.send(zipBuffer);
  } catch (error) {
    logger.error({ err: error, userId: req.user?._id, requestId: req.requestId }, 'Bulk certificate download error');
    res.status(500).json({ error: 'Failed to create certificate bundle' });
  }
});

// GET /api/certificates/transcript - Generate CE transcript PDF
router.get('/transcript', protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const { credential, startDate, endDate } = req.query;
    
    // Get user info
    const User = (await import('../models/User.js')).default;
    const user = await User.findById(userId).lean();
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Build query
    let query = { userId };
    if (startDate && endDate) {
      query.completionDate = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    
    let certificates = await Certificate.find(query).sort({ completionDate: -1 }).lean();
    
    if (credential && credential !== 'all') {
      certificates = certificates.filter(c => 
        c.credentials && c.credentials.some(cred => cred.toString() === credential)
      );
    }

    // Import PDFKit
    const PDFDocument = (await import('pdfkit')).default;
    
    const doc = new PDFDocument({ 
      size: 'LETTER', 
      margin: 50,
      info: {
        Title: 'CE Transcript - CounselorReady',
        Author: 'CounselorReady - NBCC ACEP #7760'
      }
    });
    
    const chunks = [];
    doc.on('data', chunk => chunks.push(chunk));
    doc.on('end', () => {
      const pdfBuffer = Buffer.concat(chunks);
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="CE_Transcript_${new Date().toISOString().slice(0,10)}.pdf"`,
        'Content-Length': pdfBuffer.length
      });
      res.send(pdfBuffer);
    });

    // === COLORS ===
    const burgundy = '#6B1D34';
    const forest = '#4A7C59';
    const navy = '#284157';
    const gold = '#D4A855';
    const lightGray = '#f5f5f5';

    // === HEADER ===
    doc.fontSize(20).fillColor(burgundy).font('Helvetica-Bold')
       .text('COUNSELOR', 50, 50, { continued: true })
       .fillColor(forest).text('READY');
    
    doc.fontSize(9).fillColor(navy).font('Helvetica')
       .text('NBCC Approved Continuing Education Provider #7760', 50, 75);
    doc.text('Ga Integrated Therapeutic Perspectives LLC', 50, 87);
    
    // Divider
    doc.moveTo(50, 105).lineTo(562, 105).lineWidth(2).strokeColor(burgundy).stroke();

    // === TITLE ===
    doc.fontSize(16).fillColor(burgundy).font('Helvetica-Bold')
       .text('Continuing Education Transcript', 50, 118, { align: 'center' });
    
    // === USER INFO ===
    const userName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email;
    doc.fontSize(11).fillColor(navy).font('Helvetica')
       .text(`Name: ${userName}`, 50, 145);
    doc.text(`Email: ${user.email}`, 50, 160);
    doc.text(`Generated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, 50, 175);
    
    if (startDate && endDate) {
      doc.text(`Period: ${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}`, 50, 190);
    }

    // === SUMMARY STATS ===
    const totalHours = certificates.reduce((sum, c) => sum + (c.ceHours || 0), 0);
    const ethicsHours = certificates.filter(c => 
      c.category && (c.category.toLowerCase().includes('ethics'))
    ).reduce((sum, c) => sum + (c.ceHours || 0), 0);
    const nbccCount = certificates.filter(c => c.nbccApproved).length;
    
    let statsY = startDate ? 210 : 195;
    
    // Stats boxes
    doc.roundedRect(50, statsY, 155, 45, 5).fillAndStroke(lightGray, '#ddd');
    doc.roundedRect(220, statsY, 155, 45, 5).fillAndStroke(lightGray, '#ddd');
    doc.roundedRect(390, statsY, 172, 45, 5).fillAndStroke(lightGray, '#ddd');
    
    doc.fontSize(18).fillColor(burgundy).font('Helvetica-Bold');
    doc.text(String(certificates.length), 55, statsY + 5, { width: 145, align: 'center' });
    doc.text(String(totalHours), 225, statsY + 5, { width: 145, align: 'center' });
    doc.text(String(ethicsHours), 395, statsY + 5, { width: 162, align: 'center' });
    
    doc.fontSize(8).fillColor(navy).font('Helvetica');
    doc.text('Certificates', 55, statsY + 30, { width: 145, align: 'center' });
    doc.text('Total CE Hours', 225, statsY + 30, { width: 145, align: 'center' });
    doc.text('Ethics Hours', 395, statsY + 30, { width: 162, align: 'center' });

    // === CERTIFICATE TABLE ===
    let tableY = statsY + 60;
    
    // Table header
    doc.roundedRect(50, tableY, 512, 22, 3).fill(burgundy);
    doc.fontSize(9).fillColor('#fff').font('Helvetica-Bold');
    doc.text('Date', 55, tableY + 6, { width: 65 });
    doc.text('Certificate Title', 125, tableY + 6, { width: 200 });
    doc.text('Provider', 330, tableY + 6, { width: 105 });
    doc.text('Hours', 440, tableY + 6, { width: 35, align: 'center' });
    doc.text('Category', 480, tableY + 6, { width: 80 });
    
    tableY += 25;

    // Table rows
    certificates.forEach((cert, i) => {
      // Check for page break
      if (tableY > 700) {
        doc.addPage();
        tableY = 50;
        
        // Repeat header
        doc.roundedRect(50, tableY, 512, 22, 3).fill(burgundy);
        doc.fontSize(9).fillColor('#fff').font('Helvetica-Bold');
        doc.text('Date', 55, tableY + 6, { width: 65 });
        doc.text('Certificate Title', 125, tableY + 6, { width: 200 });
        doc.text('Provider', 330, tableY + 6, { width: 105 });
        doc.text('Hours', 440, tableY + 6, { width: 35, align: 'center' });
        doc.text('Category', 480, tableY + 6, { width: 80 });
        tableY += 25;
      }
      
      // Alternating row colors
      if (i % 2 === 0) {
        doc.rect(50, tableY - 2, 512, 20).fill('#fafafa');
      }
      
      const dateStr = cert.completionDate 
        ? new Date(cert.completionDate).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })
        : 'N/A';
      
      let category = (cert.category || 'General')
        .replace('cultural-diversity', 'Cultural Div.')
        .replace('substance-abuse', 'Subst. Abuse')
        .replace('professional-development', 'Prof. Dev.');
      
      // Add NBCC marker to category
      if (cert.nbccApproved) {
        category = category.substring(0, 10) + ' ✦';
      }
      
      doc.fontSize(8.5).fillColor(navy).font('Helvetica');
      doc.text(dateStr, 55, tableY + 2, { width: 65 });
      doc.text((cert.title || 'Untitled').substring(0, 45), 125, tableY + 2, { width: 200 });
      doc.text((cert.provider || 'Unknown').substring(0, 23), 330, tableY + 2, { width: 105 });
      doc.fontSize(9).font('Helvetica-Bold').fillColor(forest);
      doc.text(String(cert.ceHours || 0), 440, tableY + 2, { width: 35, align: 'center' });
      doc.fontSize(7.5).fillColor(navy).font('Helvetica');
      doc.text(category.substring(0, 16), 480, tableY + 2, { width: 80 });
      
      tableY += 20;
    });

    // Total row
    tableY += 5;
    doc.moveTo(50, tableY).lineTo(562, tableY).lineWidth(1).strokeColor(burgundy).stroke();
    tableY += 8;
    doc.fontSize(10).fillColor(burgundy).font('Helvetica-Bold');
    doc.text(`Total: ${certificates.length} certificates, ${totalHours} CE hours`, 55, tableY);
    if (ethicsHours > 0) {
      doc.fontSize(9).fillColor(forest)
         .text(`(including ${ethicsHours} ethics hours)`, 300, tableY);
    }

    // === FOOTER (on current page) ===
    let footerY = tableY + 30;
    if (footerY > 720) {
      doc.addPage();
      footerY = 50;
    }
    doc.moveTo(50, footerY).lineTo(562, footerY).lineWidth(0.5).strokeColor('#ccc').stroke();
    doc.fontSize(7).fillColor('#999').font('Helvetica');
    doc.text('This transcript was generated by CounselorReady (counselorready.com)', 50, footerY + 8, { width: 512, align: 'center' });
    doc.text('NBCC Approved Continuing Education Provider #7760 | GAITP LLC', 50, footerY + 18, { width: 512, align: 'center' });
    doc.text('This document is for informational purposes. Verify individual certificates at counselorready.com/verify', 50, footerY + 28, { width: 512, align: 'center' });
    
    if (certificates.some(c => c.nbccApproved)) {
      doc.text('✦ = NBCC Approved', 50, footerY + 42, { width: 512, align: 'center' });
    }
    
    doc.end();
    
  } catch (error) {
    logger.error({ err: error, userId: req.user?._id, requestId: req.requestId }, 'Transcript generation error');
    res.status(500).json({ error: 'Failed to generate transcript' });
  }
});

// Export the router
export default router;
