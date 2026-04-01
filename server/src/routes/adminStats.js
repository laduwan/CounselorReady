/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
// routes/adminStats.js
// Admin dashboard statistics and overview

import express from 'express';
import mongoose from 'mongoose';
import { protect, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

const adminOnly = requireAdmin;

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
      db.collection('usercourseprogresses').countDocuments({ status: 'completed' }),
      db.collection('interactivecourseprogresses').countDocuments({ status: 'completed' })
    ]);
    
    // Get recent completions (last 7 days) from both collections
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const [recentRegular, recentInteractive] = await Promise.all([
      db.collection('usercourseprogresses').countDocuments({
        status: 'completed',
        $or: [{ completedAt: { $gte: sevenDaysAgo } }, { updatedAt: { $gte: sevenDaysAgo } }]
      }),
      db.collection('interactivecourseprogresses').countDocuments({
        status: 'completed',
        $or: [{ completedAt: { $gte: sevenDaysAgo } }, { updatedAt: { $gte: sevenDaysAgo } }]
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
                { $eq: ['$status', 'completed'] },
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
                { $eq: ['$status', 'completed'] },
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
        { $match: { status: 'completed' } },
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
        { $match: { status: 'completed' } },
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

/**
 * GET /api/admin/stats/course-health
 * Course health panel — word count, exam status, question count per course
 */
router.get('/course-health', protect, adminOnly, async (req, res) => {
  try {
    const db = mongoose.connection.db;

    const courses = await db.collection('interactivecourses').find(
      {},
      { projection: { title: 1, slug: 1, ceHours: 1, status: 1, sections: 1, assessment: 1, modules: 1 } }
    ).toArray();

    const WORDS_PER_CE_HOUR = 6000;

    const health = courses.map(course => {
      // Calculate total word count
      let totalWords = 0;
      const sections = course.sections || [];
      const modules = course.modules || [];

      // Count words in sections (interactive course format)
      sections.forEach(section => {
        (section.contentBlocks || []).forEach(block => {
          const text = [block.content, block.question, block.explanation, block.instructions, block.imageCaption].filter(Boolean).join(' ');
          totalWords += text.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(Boolean).length;
          (block.options || []).forEach(o => { totalWords += (o.text || '').split(/\s+/).filter(Boolean).length; });
          (block.accordionItems || []).forEach(a => { totalWords += ((a.title || '') + ' ' + (a.content || '')).replace(/<[^>]*>/g, ' ').split(/\s+/).filter(Boolean).length; });
        });
      });

      // Count words in modules (legacy format)
      modules.forEach(mod => {
        (mod.lessons || []).forEach(lesson => {
          totalWords += (lesson.content || '').replace(/<[^>]*>/g, ' ').split(/\s+/).filter(Boolean).length;
        });
      });

      // Quiz question counts
      let quizQuestions = 0;
      sections.forEach(s => { quizQuestions += (s.quizQuestions || []).length; });

      // Assessment info
      const assessmentQuestions = course.assessment?.questions?.length || 0;
      const hasAssessment = assessmentQuestions > 0;
      const passThreshold = course.assessment?.passThreshold || 0.8;

      // Health scores
      const requiredWords = (course.ceHours || 1) * WORDS_PER_CE_HOUR;
      const wordPercent = Math.round((totalWords / requiredWords) * 100);
      const sectionCount = sections.length || modules.length;
      const minQuizPerSection = 2;
      const quizCoverage = sectionCount > 0 ? Math.round((quizQuestions / (sectionCount * minQuizPerSection)) * 100) : 0;

      const issues = [];
      if (wordPercent < 80) issues.push(`Word count ${wordPercent}% of target (${totalWords}/${requiredWords})`);
      if (!hasAssessment) issues.push('No final assessment');
      if (assessmentQuestions < 15 && hasAssessment) issues.push(`Only ${assessmentQuestions} exam questions (need 15+)`);
      if (quizQuestions === 0 && sectionCount > 0) issues.push('No section quizzes');
      if (sectionCount === 0) issues.push('No content sections');

      return {
        _id: course._id,
        title: course.title,
        slug: course.slug,
        ceHours: course.ceHours,
        status: course.status || 'draft',
        totalWords,
        requiredWords,
        wordPercent: Math.min(wordPercent, 100),
        sectionCount,
        quizQuestions,
        assessmentQuestions,
        hasAssessment,
        passThreshold,
        quizCoverage: Math.min(quizCoverage, 100),
        healthScore: Math.round(
          (Math.min(wordPercent, 100) * 0.4) +
          (hasAssessment ? 25 : 0) +
          (Math.min(quizCoverage, 100) * 0.2) +
          (assessmentQuestions >= 15 ? 15 : (assessmentQuestions / 15) * 15)
        ),
        issues
      };
    });

    // Sort by health score ascending (worst first)
    health.sort((a, b) => a.healthScore - b.healthScore);

    res.json({
      success: true,
      data: {
        courses: health,
        summary: {
          totalCourses: health.length,
          healthy: health.filter(c => c.healthScore >= 80).length,
          needsWork: health.filter(c => c.healthScore >= 50 && c.healthScore < 80).length,
          critical: health.filter(c => c.healthScore < 50).length,
          avgHealthScore: health.length > 0 ? Math.round(health.reduce((s, c) => s + c.healthScore, 0) / health.length) : 0
        }
      }
    });
  } catch (error) {
    console.error('Course health error:', error);
    res.status(500).json({ success: false, error: { message: 'Failed to load course health data' } });
  }
});

/**
 * GET /api/admin/stats/learner-journey
 * Learner journey analytics — dropoff points, high-failure questions, completion funnel
 */
router.get('/learner-journey', protect, adminOnly, async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const courseId = req.query.courseId;

    // Build match filter
    const match = {};
    if (courseId) match.courseId = new mongoose.Types.ObjectId(courseId);

    // Section completion funnel
    const progressDocs = await db.collection('interactivecourseprogresses').find(match).toArray();

    // Aggregate dropoff data
    const sectionDropoff = {};
    let totalEnrolled = progressDocs.length;
    let completedAll = 0;
    let assessmentAttempted = 0;
    let assessmentPassed = 0;

    progressDocs.forEach(prog => {
      const sections = prog.sectionProgress || [];
      let lastCompleted = -1;
      sections.forEach((sp, i) => {
        if (!sectionDropoff[i]) sectionDropoff[i] = { started: 0, completed: 0, quizFailed: 0, quizPassed: 0 };
        if (sp.status === 'in_progress' || sp.status === 'completed') sectionDropoff[i].started++;
        if (sp.status === 'completed') {
          sectionDropoff[i].completed++;
          lastCompleted = i;
        }
        if (sp.quizAttempts?.length > 0) {
          const anyPassed = sp.quizAttempts.some(a => a.passed);
          if (anyPassed) sectionDropoff[i].quizPassed++;
          else sectionDropoff[i].quizFailed++;
        }
      });
      if (lastCompleted === sections.length - 1) completedAll++;
      if (prog.assessmentAttempts?.length > 0) assessmentAttempted++;
      if (prog.assessmentPassed) assessmentPassed++;
    });

    // High-failure quiz questions (aggregate from interactive courses)
    const interactiveCourses = await db.collection('interactivecourses').find(
      courseId ? { _id: new mongoose.Types.ObjectId(courseId) } : {},
      { projection: { title: 1, slug: 1, 'assessment.questions': 1 } }
    ).toArray();

    // Quiz failure analysis from progress docs
    const questionFailures = {};
    progressDocs.forEach(prog => {
      (prog.assessmentAttempts || []).forEach(attempt => {
        if (attempt.passed) return; // Only analyze failed attempts
        const answers = attempt.answers || [];
        const courseData = interactiveCourses.find(c => c._id.toString() === (prog.courseId?.toString() || ''));
        if (!courseData?.assessment?.questions) return;
        courseData.assessment.questions.forEach((q, i) => {
          const key = `${prog.courseId}_q${i}`;
          if (!questionFailures[key]) questionFailures[key] = { courseTitle: courseData.title, questionIndex: i, question: q.question?.substring(0, 80), totalAttempts: 0, incorrect: 0 };
          questionFailures[key].totalAttempts++;
          const userAnswer = answers[i];
          if (userAnswer !== undefined) {
            const isCorrect = q.options?.[userAnswer]?.isCorrect;
            if (!isCorrect) questionFailures[key].incorrect++;
          }
        });
      });
    });

    // Sort by failure rate
    const highFailureQuestions = Object.values(questionFailures)
      .map(q => ({ ...q, failureRate: q.totalAttempts > 0 ? Math.round((q.incorrect / q.totalAttempts) * 100) : 0 }))
      .filter(q => q.totalAttempts >= 3) // Only show with enough data
      .sort((a, b) => b.failureRate - a.failureRate)
      .slice(0, 20);

    // Time-based analytics
    const avgTimePerSection = {};
    progressDocs.forEach(prog => {
      (prog.sectionProgress || []).forEach((sp, i) => {
        if (sp.timeSpent > 0) {
          if (!avgTimePerSection[i]) avgTimePerSection[i] = { total: 0, count: 0 };
          avgTimePerSection[i].total += sp.timeSpent;
          avgTimePerSection[i].count++;
        }
      });
    });

    res.json({
      success: true,
      data: {
        funnel: {
          enrolled: totalEnrolled,
          completedAllSections: completedAll,
          assessmentAttempted,
          assessmentPassed,
          completionRate: totalEnrolled > 0 ? Math.round((completedAll / totalEnrolled) * 100) : 0,
          passRate: assessmentAttempted > 0 ? Math.round((assessmentPassed / assessmentAttempted) * 100) : 0
        },
        sectionDropoff: Object.entries(sectionDropoff).map(([idx, data]) => ({
          sectionIndex: parseInt(idx),
          ...data,
          dropoffRate: data.started > 0 ? Math.round(((data.started - data.completed) / data.started) * 100) : 0
        })),
        highFailureQuestions,
        avgTimePerSection: Object.entries(avgTimePerSection).map(([idx, data]) => ({
          sectionIndex: parseInt(idx),
          avgMinutes: Math.round(data.total / data.count / 60)
        }))
      }
    });
  } catch (error) {
    console.error('Learner journey error:', error);
    res.status(500).json({ success: false, error: { message: 'Failed to load learner journey data' } });
  }
});

export default router;
