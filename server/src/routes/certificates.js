// routes/certificates.js
import express from 'express';
import Certificate from '../models/Certificate.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get user's certificates
router.get('/my-certificates', protect, async (req, res) => {
  try {
    const certificates = await Certificate.find({
      user: req.user._id,
      isRevoked: false
    })
    .populate('course', 'title code ceHours')
    .sort({ completionDate: -1 });

    res.json({
      success: true,
      certificates: certificates.map(cert => ({
        _id: cert._id,
        certificateNumber: cert.certificateNumber,
        courseName: cert.course?.title || 'Unknown Course',
        courseCode: cert.course?.code || 'N/A',
        ceHours: cert.ceHours,
        completionDate: cert.completionDate,
        pdfUrl: cert.pdfUrl,
        verificationCode: cert.verificationCode
      }))
    });
  } catch (error) {
    console.error('Error fetching certificates:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch certificates'
    });
  }
});

// Get single certificate
router.get('/:certificateId', protect, async (req, res) => {
  try {
    const certificate = await Certificate.findOne({
      _id: req.params.certificateId,
      user: req.user._id,
      isRevoked: false
    }).populate('course', 'title code ceHours');

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found'
      });
    }

    res.json({
      success: true,
      certificate: {
        _id: certificate._id,
        certificateNumber: certificate.certificateNumber,
        courseName: certificate.course?.title,
        courseCode: certificate.course?.code,
        ceHours: certificate.ceHours,
        completionDate: certificate.completionDate,
        pdfUrl: certificate.pdfUrl,
        verificationCode: certificate.verificationCode,
        nbccProgramNumber: certificate.nbccProgramNumber,
        providerNumber: certificate.providerNumber
      }
    });
  } catch (error) {
    console.error('Error fetching certificate:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch certificate'
    });
  }
});

// Download certificate PDF
router.get('/:certificateId/download', protect, async (req, res) => {
  try {
    const certificate = await Certificate.findOne({
      _id: req.params.certificateId,
      user: req.user._id,
      isRevoked: false
    });

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found'
      });
    }

    if (!certificate.pdfUrl) {
      return res.status(404).json({
        success: false,
        message: 'Certificate PDF not available'
      });
    }

    // Redirect to Cloudinary URL
    res.redirect(certificate.pdfUrl);
    
  } catch (error) {
    console.error('Error downloading certificate:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to download certificate'
    });
  }
});

// Verify certificate (public endpoint)
router.get('/verify/:verificationCode', async (req, res) => {
  try {
    const certificate = await Certificate.findOne({
      verificationCode: req.params.verificationCode,
      isRevoked: false
    }).populate('user', 'firstName lastName')
      .populate('course', 'title code ceHours');

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found or has been revoked'
      });
    }

    // Increment verification count
    certificate.verificationCount += 1;
    certificate.verifiedAt = new Date();
    await certificate.save();

    res.json({
      success: true,
      certificate: {
        certificateNumber: certificate.certificateNumber,
        recipientName: `${certificate.user.firstName} ${certificate.user.lastName}`,
        courseName: certificate.course.title,
        courseCode: certificate.course.code,
        ceHours: certificate.ceHours,
        completionDate: certificate.completionDate,
        providerNumber: certificate.providerNumber,
        verificationCount: certificate.verificationCount
      }
    });
  } catch (error) {
    console.error('Error verifying certificate:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify certificate'
    });
  }
});

export default router;
