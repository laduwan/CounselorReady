// routes/audit.js - SIMPLIFIED VERSION WITHOUT AUTH MIDDLEWARE
import express from 'express';
import CELog from '../models/CELog.js';
import Certificate from '../models/Certificate.js';

const router = express.Router();

// Simple auth check
const requireAuth = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Not authenticated' });
  }
  next();
};

// Simple admin check
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Admin access required' });
  }
  next();
};

// Generate audit report for current user
router.get('/report', requireAuth, async (req, res) => {
  try {
    const { startDate, endDate, format = 'json' } = req.query;
    
    // Build query
    const query = {
      user: req.user._id,
      completed: true
    };
    
    if (startDate) {
      query.completedAt = { $gte: new Date(startDate) };
    }
    if (endDate) {
      query.completedAt = {
        ...query.completedAt,
        $lte: new Date(endDate)
      };
    }
    
    // Get CE logs
    const ceLogs = await CELog.find(query)
      .populate('course', 'title code ceHours category')
      .sort({ completedAt: -1 });
    
    // Get certificates
    const certificates = await Certificate.find({
      user: req.user._id,
      isRevoked: false
    }).populate('course', 'title code');
    
    // Calculate totals
    const totalHours = ceLogs.reduce((sum, log) => sum + (log.ceHours || 0), 0);
    const totalCourses = ceLogs.length;
    
    // Group by category
    const byCategory = {};
    ceLogs.forEach(log => {
      const category = log.course?.category || 'Other';
      if (!byCategory[category]) {
        byCategory[category] = {
          count: 0,
          hours: 0,
          courses: []
        };
      }
      byCategory[category].count++;
      byCategory[category].hours += log.ceHours || 0;
      byCategory[category].courses.push({
        title: log.course?.title,
        code: log.course?.code,
        hours: log.ceHours,
        completedAt: log.completedAt
      });
    });
    
    const report = {
      user: {
        name: `${req.user.firstName} ${req.user.lastName}`,
        email: req.user.email,
        licenseNumber: req.user.licenseNumber,
        licenseState: req.user.licenseState
      },
      summary: {
        totalCourses,
        totalHours,
        reportPeriod: {
          start: startDate || 'All time',
          end: endDate || 'Present'
        },
        generatedAt: new Date()
      },
      byCategory,
      completions: ceLogs.map(log => ({
        courseCode: log.course?.code,
        courseTitle: log.course?.title,
        ceHours: log.ceHours,
        completedAt: log.completedAt,
        certificateNumber: log.certificateNumber,
        hasCertificate: certificates.some(cert => 
          cert.course?.toString() === log.course?._id.toString()
        )
      })),
      certificates: certificates.map(cert => ({
        certificateNumber: cert.certificateNumber,
        courseCode: cert.course?.code,
        courseTitle: cert.course?.title,
        ceHours: cert.ceHours,
        completionDate: cert.completionDate,
        verificationCode: cert.verificationCode,
        pdfUrl: cert.pdfUrl
      }))
    };
    
    res.json({
      success: true,
      report
    });
    
  } catch (error) {
    console.error('Error generating audit report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate audit report',
      error: error.message
    });
  }
});

// Admin: Get all audit data
router.get('/admin', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { startDate, endDate, userId, limit = 1000 } = req.query;
    
    const query = { completed: true };
    
    if (userId) {
      query.user = userId;
    }
    if (startDate) {
      query.completedAt = { $gte: new Date(startDate) };
    }
    if (endDate) {
      query.completedAt = {
        ...query.completedAt,
        $lte: new Date(endDate)
      };
    }
    
    const ceLogs = await CELog.find(query)
      .populate('user', 'firstName lastName email licenseNumber licenseState')
      .populate('course', 'title code ceHours category')
      .sort({ completedAt: -1 })
      .limit(parseInt(limit));
    
    res.json({
      success: true,
      count: ceLogs.length,
      totalHours: ceLogs.reduce((sum, log) => sum + (log.ceHours || 0), 0),
      logs: ceLogs
    });
    
  } catch (error) {
    console.error('Error generating admin audit report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate audit report',
      error: error.message
    });
  }
});

export default router;
