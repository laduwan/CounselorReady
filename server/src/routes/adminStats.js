// routes/adminStats.js
// Admin dashboard statistics and overview

import express from 'express';
import mongoose from 'mongoose';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Admin check middleware (defined here since auth.js may not export it)
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ success: false, error: { message: 'Admin access required' } });
  }
};

/**
 * GET /api/admin/stats/overview
 */
router.get('/overview', protect, adminOnly, async (req, res) => {
  try {
    const db = mongoose.connection.db;
    
    const [
      totalUsers,
      activeUsers,
      totalCourses,
      interactiveCourses,
      publishedCourses,
      totalCompletions,
      totalCertificates,
      totalCEHours,
      recentCompletions,
      evaluationStats
    ] = await Promise.all([
      db.collection('users').countDocuments({ isDeleted: { $ne: true } }),
      db.collection('users').countDocuments({ 
        isDeleted: { $ne: true },
        lastLogin: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
      }),
      db.collection('courses').countDocuments({ isDeleted: { $ne: true } }),
      db.collection('interactivecourses').countDocuments({ status: 'published' }),
      db.collection('courses').countDocuments({ status: 'published', isDeleted: { $ne: true } }),
      db.collection('celogs').countDocuments({ status: 'completed' }),
      db.collection('certificates').countDocuments({}),
      db.collection('celogs').aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$ceHours' } } }
      ]).toArray(),
      db.collection('celogs').countDocuments({
        status: 'completed',
        completionDate: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      }),
      db.collection('evaluations').aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]).toArray()
    ]);
    
    const evaluations = { total: 0, completed: 0, pending: 0 };
    evaluationStats.forEach(stat => {
      evaluations.total += stat.count;
      if (stat._id === 'completed' || stat._id === 'submitted') {
        evaluations.completed += stat.count;
      } else {
        evaluations.pending += stat.count;
      }
    });
    
    res.json({
      success: true,
      data: {
        users: { total: totalUsers, active: activeUsers, newThisMonth: 0 },
        courses: {
          total: totalCourses,
          interactive: interactiveCourses,
          published: publishedCourses,
          draft: totalCourses - publishedCourses
        },
        completions: {
          total: totalCompletions,
          recentWeek: recentCompletions,
          certificates: totalCertificates
        },
        ceHours: { total: totalCEHours[0]?.total || 0 },
        evaluations
      }
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ success: false, error: { message: 'Failed to load admin statistics' } });
  }
});

/**
 * GET /api/admin/stats/courses
 */
router.get('/courses', protect, adminOnly, async (req, res) => {
  try {
    const db = mongoose.connection.db;
    
    const courses = await db.collection('courses').aggregate([
      { $match: { isDeleted: { $ne: true } } },
      {
        $lookup: {
          from: 'celogs',
          localField: '_id',
          foreignField: 'course',
          as: 'completions'
        }
      },
      {
        $project: {
          title: 1, slug: 1, ceHours: 1, status: 1, categories: 1, createdAt: 1,
          completionCount: { $size: '$completions' }
        }
      },
      { $sort: { completionCount: -1 } }
    ]).toArray();
    
    const interactiveCourses = await db.collection('interactivecourses').find({
      status: 'published'
    }).project({ title: 1, slug: 1, ceHours: 1, status: 1, createdAt: 1 }).toArray();
    
    res.json({
      success: true,
      data: {
        courses,
        interactiveCourses,
        summary: {
          totalCourses: courses.length,
          totalInteractive: interactiveCourses.length,
          totalCompletions: courses.reduce((sum, c) => sum + c.completionCount, 0)
        }
      }
    });
  } catch (error) {
    console.error('Course stats error:', error);
    res.status(500).json({ success: false, error: { message: 'Failed to load course statistics' } });
  }
});

/**
 * GET /api/admin/stats/evaluations
 */
router.get('/evaluations', protect, adminOnly, async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const { status, courseId, page = 1, limit = 50 } = req.query;
    
    const query = {};
    if (status) query.status = status;
    if (courseId) query.course = new mongoose.Types.ObjectId(courseId);
    
    const [evaluations, total] = await Promise.all([
      db.collection('evaluations').find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(parseInt(limit)).toArray(),
      db.collection('evaluations').countDocuments(query)
    ]);
    
    const statusSummary = await db.collection('evaluations').aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]).toArray();
    
    res.json({
      success: true,
      data: {
        evaluations,
        pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) },
        summary: statusSummary.reduce((acc, s) => { acc[s._id || 'unknown'] = s.count; return acc; }, {})
      }
    });
  } catch (error) {
    console.error('Evaluation stats error:', error);
    res.status(500).json({ success: false, error: { message: 'Failed to load evaluation statistics' } });
  }
});

export default router;
