/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import express from 'express';
import { protect } from '../middleware/auth.js';
import Certificate from '../models/Certificate.js';
import UserCredential from '../models/UserCredential.js';
import UserCourseProgress from '../models/UserCourseProgress.js';

const router = express.Router();

// @route   GET /api/dashboard/stats
// @desc    Get dashboard statistics for current user
// @access  Private
router.get('/stats', protect, async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Get certificates
    const certificates = await Certificate.find({ userId });
    const certificatesCount = certificates.length;
    const ceHours = certificates.reduce((sum, c) => sum + (c.ceHours || 0), 0);
    
    // Get credentials
    const credentials = await UserCredential.find({ userId });
    const credentialsCount = credentials.length;
    
    // Get course progress
    const courseProgress = await UserCourseProgress.find({ userId });
    const coursesCompleted = courseProgress.filter(p => p.status === 'completed').length;
    
    res.json({
      ceHours,
      certificates: certificatesCount,
      credentials: credentialsCount,
      coursesCompleted
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to load dashboard stats' });
  }
});

export default router;
