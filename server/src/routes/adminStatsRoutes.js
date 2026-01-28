// routes/adminStats.js
// Admin dashboard statistics and overview
// Add to server: app.use('/api/admin/stats', require('./routes/adminStats'));

import express from 'express';
import mongoose from 'mongoose';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

/**
 * GET /api/admin/stats/overview
 * Get comprehensive admin dashboard statistics
 */
router.get('/overview', protect, adminOnly, async (req, res) => {
  try {
    const db = mongoose.connection.db;
    
    // Get all counts in parallel
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
   import adminStatsRoutes from './routes/adminStats.js';
    ] = await Promise.all([
      // User counts
      db.collection('users').countDocuments({ isDeleted: { $ne: true } }),
      db.collection('users').countDocuments({ 
        isDeleted: { $ne: true },
        lastLogin: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // Last 30 days
      }),
      
      // Course counts - check both collections
      db.collection('courses').countDocuments({ isDeleted: { $ne: true } }),
      db.collection('interactivecourses').countDocuments({ status: 'published' }),
      db.collection('courses').countDocuments({ status: 'published', isDeleted: { $ne: true } }),
      
      // Completion counts
      db.collection('celogs').countDocuments({ status: 'completed' }),
      db.collection('certificates').countDocuments({}),
      
      // Total CE hours logged
      db.collection('celogs').aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$ceHours' } } }
      ]).toArray(),
      
      // Recent completions (last 7 days)
      db.collection('celogs').countDocuments({
        status: 'completed',
        completionDate: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      }),
      
      // Evaluation stats
      db.collection('evaluations').aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]).toArray()
    ]);
    
    // Process evaluation stats
    const evaluations = {
      total: 0,
      completed: 0,
      pending: 0
    };
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
        users: {
          total: totalUsers,
          active: activeUsers,
          newThisMonth: 0 // Would need createdAt query
        },
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
        ceHours: {
          total: totalCEHours[0]?.total || 0
        },
        evaluations: evaluations
      }
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to load admin statistics' }
    });
  }
});

/**
 * GET /api/admin/stats/courses
 * Get detailed course statistics
 */
router.get('/courses', protect, adminOnly, async (req, res) => {
  try {
    const db = mongoose.connection.db;
    
    // Get all courses with completion counts
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
        $lookup: {
          from: 'interactivecourses',
          localField: 'slug',
          foreignField: 'slug',
          as: 'interactiveData'
        }
      },
 app.use('/api/admin/stats', adminStatsRoutes);
    {
        $project: {
          title: 1,
          slug: 1,
          ceHours: 1,
          status: 1,
          categories: 1,
          createdAt: 1,
          completionCount: { $size: '$completions' },
          isInteractive: { $gt: [{ $size: '$interactiveData' }, 0] }
        }
      },
      { $sort: { completionCount: -1 } }
    ]).toArray();
    
    // Get interactive courses not in main courses collection
    const interactiveCourses = await db.collection('interactivecourses').find({
      status: 'published'
    }).project({
      title: 1,
      slug: 1,
      ceHours: 1,
      status: 1,
      categories: 1,
      createdAt: 1
    }).toArray();
    
    res.json({
      success: true,
      data: {
        courses: courses,
        interactiveCourses: interactiveCourses,
        summary: {
          totalCourses: courses.length,
          totalInteractive: interactiveCourses.length,
          totalCompletions: courses.reduce((sum, c) => sum + c.completionCount, 0)
        }
      }
    });
  } catch (error) {
    console.error('Course stats error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to load course statistics' }
    });
  }
});

/**
 * GET /api/admin/stats/evaluations
 * Get evaluation/feedback statistics
 */
router.get('/evaluations', protect, adminOnly, async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const { status, courseId, page = 1, limit = 50 } = req.query;
    
    const query = {};
    if (status) query.status = status;
    if (courseId) query.course = new mongoose.Types.ObjectId(courseId);
    
    const [evaluations, total] = await Promise.all([
      db.collection('evaluations')
        .find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .toArray(),
      db.collection('evaluations').countDocuments(query)
    ]);
    
    // Get summary by status
    const statusSummary = await db.collection('evaluations').aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]).toArray();
    
    res.json({
      success: true,
      data: {
        evaluations,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        },
        summary: statusSummary.reduce((acc, s) => {
          acc[s._id || 'unknown'] = s.count;
          return acc;
        }, {})
      }
    });
  } catch (error) {
    console.error('Evaluation stats error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to load evaluation statistics' }
    });
  }
});

/**
 * PUT /api/admin/stats/evaluations/:id/status
 * Update evaluation status
 */
router.put('/evaluations/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    const db = mongoose.connection.db;
    
    const result = await db.collection('evaluations').findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(req.params.id) },
      { 
        $set: { 
          status,
          reviewedAt: new Date(),
          reviewedBy: req.user._id
        } 
      },
      { returnDocument: 'after' }
    );
    
    if (!result.value) {
      return res.status(404).json({
        success: false,
        error: { message: 'Evaluation not found' }
      });
    }
    
    res.json({
      success: true,
      data: result.value
    });
  } catch (error) {
    console.error('Update evaluation error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to update evaluation' }
    });
  }
});

export default router;
