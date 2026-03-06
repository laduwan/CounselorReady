/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
// routes/adminStats.js
// Admin dashboard statistics and overview

import express from 'express';
import mongoose from 'mongoose';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Admin check middleware
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
    
    // Get user stats
    const [totalUsers, activeUsers, newThisMonth] = await Promise.all([
      db.collection('users').countDocuments({ isDeleted: { $ne: true } }),
      db.collection('users').countDocuments({ 
        isDeleted: { $ne: true },
        lastLogin: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
      }),
      db.collection('users').countDocuments({
        isDeleted: { $ne: true },
        createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) }
      })
    ]);
    
    // Get course stats
    const [totalCourses, interactiveCourses, publishedCourses] = await Promise.all([
      db.collection('courses').countDocuments({ isDeleted: { $ne: true } }),
      db.collection('interactivecourses').countDocuments({ status: 'published' }),
      db.collection('courses').countDocuments({ status: 'published', isDeleted: { $ne: true } })
    ]);
    
    // Get completions from BOTH progress collections
    const [regularCompletions, interactiveCompletions] = await Promise.all([
      db.collection('usercourseprogresses').countDocuments({ 
        $or: [
          { status: 'completed' },
          { completed: true },
          { progress: 100 }
        ]
      }),
      db.collection('interactivecourseprogresses').countDocuments({ 
        $or: [
          { status: 'completed' },
          { completed: true },
          { progress: 100 }
        ]
      })
    ]);
    
    // Get recent completions (last 7 days) from both collections
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const [recentRegular, recentInteractive] = await Promise.all([
      db.collection('usercourseprogresses').countDocuments({
        $or: [{ status: 'completed' }, { completed: true }, { progress: 100 }],
        $or: [
          { completedAt: { $gte: sevenDaysAgo } },
          { updatedAt: { $gte: sevenDaysAgo } }
        ]
      }),
      db.collection('interactivecourseprogresses').countDocuments({
        $or: [{ status: 'completed' }, { completed: true }, { progress: 100 }],
        $or: [
          { completedAt: { $gte: sevenDaysAgo } },
          { updatedAt: { $gte: sevenDaysAgo } }
        ]
      })
    ]);
    
    // Get certificates
    const totalCertificates = await db.collection('certificates').countDocuments({});
    
    // Get evaluations from BOTH progress collections
    const [regularEvalStats, interactiveEvalStats] = await Promise.all([
      db.collection('usercourseprogresses').aggregate([
        {
          $group: {
            _id: null,
            completed: { $sum: { $cond: [{ $eq: ['$evaluationCompleted', true] }, 1, 0] } },
            pending: { $sum: { $cond: [
              { $and: [
                { $or: [{ $eq: ['$status', 'completed'] }, { $eq: ['$completed', true] }, { $eq: ['$progress', 100] }] },
                { $ne: ['$evaluationCompleted', true] }
              ]}, 1, 0
            ]}}
          }
        }
      ]).toArray(),
      db.collection('interactivecourseprogresses').aggregate([
        {
          $group: {
            _id: null,
            completed: { $sum: { $cond: [{ $eq: ['$evaluationCompleted', true] }, 1, 0] } },
            pending: { $sum: { $cond: [
              { $and: [
                { $or: [{ $eq: ['$status', 'completed'] }, { $eq: ['$completed', true] }, { $eq: ['$progress', 100] }] },
                { $ne: ['$evaluationCompleted', true] }
              ]}, 1, 0
            ]}}
          }
        }
      ]).toArray()
    ]);
    
    // Calculate CE hours from completed courses (join progress with courses)
    const [regularCEHours, interactiveCEHours] = await Promise.all([
      db.collection('usercourseprogresses').aggregate([
        { $match: { $or: [{ status: 'completed' }, { completed: true }, { progress: 100 }] } },
        {
          $lookup: {
            from: 'courses',
            localField: 'courseId',
            foreignField: '_id',
            as: 'course'
          }
        },
        { $unwind: { path: '$course', preserveNullAndEmptyArrays: true } },
        { $group: { _id: null, total: { $sum: { $ifNull: ['$course.ceHours', 0] } } } }
      ]).toArray(),
      db.collection('interactivecourseprogresses').aggregate([
        { $match: { $or: [{ status: 'completed' }, { completed: true }, { progress: 100 }] } },
        {
          $lookup: {
            from: 'interactivecourses',
            localField: 'courseId',
            foreignField: '_id',
            as: 'course'
          }
        },
        { $unwind: { path: '$course', preserveNullAndEmptyArrays: true } },
        { $group: { _id: null, total: { $sum: { $ifNull: ['$course.ceHours', 0] } } } }
      ]).toArray()
    ]);
    
    // Combine stats from both collections
    const totalCompletions = regularCompletions + interactiveCompletions;
    const recentCompletions = recentRegular + recentInteractive;
    const totalCEHours = (regularCEHours[0]?.total || 0) + (interactiveCEHours[0]?.total || 0);
    
    const evaluations = {
      total: (regularEvalStats[0]?.completed || 0) + (regularEvalStats[0]?.pending || 0) +
             (interactiveEvalStats[0]?.completed || 0) + (interactiveEvalStats[0]?.pending || 0),
      completed: (regularEvalStats[0]?.completed || 0) + (interactiveEvalStats[0]?.completed || 0),
      pending: (regularEvalStats[0]?.pending || 0) + (interactiveEvalStats[0]?.pending || 0)
    };
    
    res.json({
      success: true,
      data: {
        users: { 
          total: totalUsers, 
          active: activeUsers, 
          newThisMonth 
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
          total: totalCEHours 
        },
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
    
    // Regular courses with completion counts
    const courses = await db.collection('courses').aggregate([
      { $match: { isDeleted: { $ne: true } } },
      {
        $lookup: {
          from: 'usercourseprogresses',
          localField: '_id',
          foreignField: 'courseId',
          as: 'progress'
        }
      },
      {
        $project: {
          title: 1, slug: 1, ceHours: 1, status: 1, categories: 1, createdAt: 1,
          completionCount: {
            $size: {
              $filter: {
                input: '$progress',
                cond: { $or: [
                  { $eq: ['$$this.status', 'completed'] },
                  { $eq: ['$$this.completed', true] },
                  { $eq: ['$$this.progress', 100] }
                ]}
              }
            }
          }
        }
      },
      { $sort: { completionCount: -1 } }
    ]).toArray();
    
    // Interactive courses with completion counts
    const interactiveCourses = await db.collection('interactivecourses').aggregate([
      { $match: { status: 'published' } },
      {
        $lookup: {
          from: 'interactivecourseprogresses',
          localField: '_id',
          foreignField: 'courseId',
          as: 'progress'
        }
      },
      {
        $project: {
          title: 1, slug: 1, ceHours: 1, status: 1, createdAt: 1,
          completionCount: {
            $size: {
              $filter: {
                input: '$progress',
                cond: { $or: [
                  { $eq: ['$$this.status', 'completed'] },
                  { $eq: ['$$this.completed', true] },
                  { $eq: ['$$this.progress', 100] }
                ]}
              }
            }
          }
        }
      },
      { $sort: { completionCount: -1 } }
    ]).toArray();
    
    res.json({
      success: true,
      data: {
        courses,
        interactiveCourses,
        summary: {
          totalCourses: courses.length,
          totalInteractive: interactiveCourses.length,
          totalCompletions: courses.reduce((sum, c) => sum + c.completionCount, 0) +
                           interactiveCourses.reduce((sum, c) => sum + c.completionCount, 0)
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
    const { page = 1, limit = 50 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const lim = parseInt(limit);
    
    // Get evaluations from both collections
    const [regularEvals, interactiveEvals] = await Promise.all([
      db.collection('usercourseprogresses').aggregate([
        { $match: { evaluationCompleted: true } },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'user'
          }
        },
        {
          $lookup: {
            from: 'courses',
            localField: 'courseId',
            foreignField: '_id',
            as: 'course'
          }
        },
        { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
        { $unwind: { path: '$course', preserveNullAndEmptyArrays: true } },
        {
          $project: {
            _id: 1,
            type: { $literal: 'regular' },
            evaluationResponses: 1,
            evaluationCompletedAt: 1,
            'user.email': 1,
            'user.profile.firstName': 1,
            'course.title': 1
          }
        }
      ]).toArray(),
      db.collection('interactivecourseprogresses').aggregate([
        { $match: { evaluationCompleted: true } },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'user'
          }
        },
        {
          $lookup: {
            from: 'interactivecourses',
            localField: 'courseId',
            foreignField: '_id',
            as: 'course'
          }
        },
        { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
        { $unwind: { path: '$course', preserveNullAndEmptyArrays: true } },
        {
          $project: {
            _id: 1,
            type: { $literal: 'interactive' },
            evaluationResponses: 1,
            evaluationCompletedAt: 1,
            'user.email': 1,
            'user.profile.firstName': 1,
            'course.title': 1
          }
        }
      ]).toArray()
    ]);
    
    // Combine, sort, and paginate
    const allEvaluations = [...regularEvals, ...interactiveEvals]
      .sort((a, b) => new Date(b.evaluationCompletedAt) - new Date(a.evaluationCompletedAt))
      .slice(skip, skip + lim);
    
    const total = regularEvals.length + interactiveEvals.length;
    
    // Get summary from both collections
    const [regularSummary, interactiveSummary] = await Promise.all([
      db.collection('usercourseprogresses').aggregate([
        {
          $group: {
            _id: null,
            completed: { $sum: { $cond: [{ $eq: ['$evaluationCompleted', true] }, 1, 0] } },
            pending: { $sum: { $cond: [
              { $and: [
                { $or: [{ $eq: ['$status', 'completed'] }, { $eq: ['$completed', true] }] },
                { $ne: ['$evaluationCompleted', true] }
              ]}, 1, 0
            ]}}
          }
        }
      ]).toArray(),
      db.collection('interactivecourseprogresses').aggregate([
        {
          $group: {
            _id: null,
            completed: { $sum: { $cond: [{ $eq: ['$evaluationCompleted', true] }, 1, 0] } },
            pending: { $sum: { $cond: [
              { $and: [
                { $or: [{ $eq: ['$status', 'completed'] }, { $eq: ['$completed', true] }] },
                { $ne: ['$evaluationCompleted', true] }
              ]}, 1, 0
            ]}}
          }
        }
      ]).toArray()
    ]);
    
    res.json({
      success: true,
      data: {
        evaluations: allEvaluations,
        pagination: { 
          page: parseInt(page), 
          limit: lim, 
          total, 
          pages: Math.ceil(total / lim) 
        },
        summary: { 
          completed: (regularSummary[0]?.completed || 0) + (interactiveSummary[0]?.completed || 0),
          pending: (regularSummary[0]?.pending || 0) + (interactiveSummary[0]?.pending || 0)
        }
      }
    });
  } catch (error) {
    console.error('Evaluation stats error:', error);
    res.status(500).json({ success: false, error: { message: 'Failed to load evaluation statistics' } });
  }
});

export default router;
