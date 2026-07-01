/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import express from 'express';
import mongoose from 'mongoose';
import { protect } from '../middleware/auth.js';
import Course from '../models/Course.js';
import Evaluation from '../models/Evaluation.js';
import { Course as InteractiveCourse } from '../models/InteractiveCourse.js';
import PlatformSurvey from '../models/PlatformSurvey.js';
import UserCourseProgress from '../models/UserCourseProgress.js';
import User from '../models/User.js';
import UserActivity from '../models/UserActivity.js';

const router = express.Router();

// ============================================
// COURSE ANALYTICS
// ============================================

// @route   POST /api/analytics/course/:id/view
// @desc    Track a course view
// @access  Public (but tracks user if logged in)
router.post('/course/:id/view', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    // Increment view count
    course.analytics.views = (course.analytics.views || 0) + 1;
    
    // Track unique views via cookie
    const viewKey = `viewed_${req.params.id}`;
    if (!req.cookies?.[viewKey]) {
      course.analytics.uniqueViews = (course.analytics.uniqueViews || 0) + 1;
    }

    await course.save();

    // Set cookie so this user isn't counted as unique again (30-day expiry)
    res.cookie(viewKey, '1', { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'lax' });
    res.json({ success: true, views: course.analytics.views });
  } catch (error) {
    console.error('Track view error:', error);
    res.status(500).json({ error: 'Failed to track view' });
  }
});

// @route   POST /api/analytics/course/:id/rate
// @desc    Rate a course (after completion)
// @access  Private
router.post('/course/:id/rate', protect, async (req, res) => {
  try {
    const { rating, wouldRecommend, comment } = req.body;
    
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }
    
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    // Check if user completed the course
    const progress = await UserCourseProgress.findOne({
      userId: req.user._id,
      courseId: req.params.id,
      status: 'completed'
    });
    
    if (!progress) {
      return res.status(400).json({ error: 'You must complete the course before rating' });
    }
    
    // Check if already rated
    const existingRating = course.ratings.find(
      r => r.userId.toString() === req.user._id.toString()
    );
    
    if (existingRating) {
      // Update existing rating
      existingRating.rating = rating;
      existingRating.wouldRecommend = wouldRecommend;
      existingRating.comment = comment;
      existingRating.createdAt = new Date();
    } else {
      // Add new rating
      course.ratings.push({
        userId: req.user._id,
        rating,
        wouldRecommend,
        comment
      });
    }
    
    // Recalculate averages
    const totalRatings = course.ratings.length;
    const sumRatings = course.ratings.reduce((sum, r) => sum + r.rating, 0);
    const recommendCount = course.ratings.filter(r => r.wouldRecommend).length;
    
    course.analytics.avgRating = Math.round((sumRatings / totalRatings) * 10) / 10;
    course.analytics.totalRatings = totalRatings;
    course.analytics.recommendRate = Math.round((recommendCount / totalRatings) * 100);
    
    await course.save();
    
    res.json({ 
      success: true, 
      avgRating: course.analytics.avgRating,
      totalRatings: course.analytics.totalRatings
    });
  } catch (error) {
    console.error('Rate course error:', error);
    res.status(500).json({ error: 'Failed to rate course' });
  }
});

// @route   GET /api/analytics/course/:id
// @desc    Get course analytics (admin)
// @access  Private (Admin)
router.get('/course/:id', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    // Get completion time stats
    const completedProgress = await UserCourseProgress.find({
      courseId: req.params.id,
      status: 'completed'
    });
    
    let avgTimeToComplete = 0;
    if (completedProgress.length > 0) {
      const totalHours = completedProgress.reduce((sum, p) => {
        const hours = (p.completedAt - p.enrolledAt) / (1000 * 60 * 60);
        return sum + hours;
      }, 0);
      avgTimeToComplete = Math.round((totalHours / completedProgress.length) * 10) / 10;
    }
    
    // Get recent ratings with user info
    const recentRatings = course.ratings
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 10);
    
    res.json({
      courseId: course._id,
      title: course.title,
      analytics: {
        ...course.analytics,
        avgTimeToComplete
      },
      recentRatings,
      enrollmentTrend: await getEnrollmentTrend(req.params.id)
    });
  } catch (error) {
    console.error('Get course analytics error:', error);
    res.status(500).json({ error: 'Failed to get analytics' });
  }
});

// Helper: Get enrollment trend (last 30 days)
async function getEnrollmentTrend(courseId) {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const enrollments = await UserCourseProgress.aggregate([
    {
      $match: {
        courseId: new mongoose.Types.ObjectId(courseId),
        enrolledAt: { $gte: thirtyDaysAgo }
      }
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$enrolledAt' } },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);
  
  return enrollments;
}

// @route   GET /api/analytics/courses/popular
// @desc    Get most popular courses
// @access  Public
router.get('/courses/popular', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const sortBy = req.query.sortBy || 'enrollments'; // enrollments, rating, completions
    
    const sortField = {
      enrollments: 'analytics.enrollments',
      rating: 'analytics.avgRating',
      completions: 'analytics.completions',
      views: 'analytics.views'
    }[sortBy] || 'analytics.enrollments';
    
    const courses = await Course.find({ status: 'published' })
      .select('title slug thumbnail ceuHours analytics')
      .sort({ [sortField]: -1 })
      .limit(limit);
    
    res.json({ courses });
  } catch (error) {
    console.error('Get popular courses error:', error);
    res.status(500).json({ error: 'Failed to get popular courses' });
  }
});

// ============================================
// PLATFORM SURVEYS (NPS & SATISFACTION)
// ============================================

// @route   GET /api/analytics/survey/check
// @desc    Check if user should see a survey
// @access  Private
router.get('/survey/check', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    // Check last survey date
    const lastSurvey = await PlatformSurvey.findOne({ userId: req.user._id })
      .sort({ createdAt: -1 });
    
    const daysSinceLastSurvey = lastSurvey 
      ? Math.floor((Date.now() - lastSurvey.createdAt) / (1000 * 60 * 60 * 24))
      : 999;
    
    // Get user stats
    const coursesCompleted = await UserCourseProgress.countDocuments({
      userId: req.user._id,
      status: 'completed'
    });
    
    const accountAgeDays = Math.floor((Date.now() - user.createdAt) / (1000 * 60 * 60 * 24));
    
    // Determine if we should show a survey
    let showSurvey = false;
    let surveyType = null;
    let trigger = null;
    
    // Show NPS survey at milestones (and at least 30 days since last survey)
    if (daysSinceLastSurvey >= 30) {
      // First course completion
      if (coursesCompleted === 1 && !lastSurvey) {
        showSurvey = true;
        surveyType = 'nps';
        trigger = 'first_completion';
      }
      // Every 5 courses
      else if (coursesCompleted > 0 && coursesCompleted % 5 === 0) {
        showSurvey = true;
        surveyType = 'satisfaction';
        trigger = 'milestone_5_courses';
      }
      // 90 days active
      else if (accountAgeDays >= 90 && daysSinceLastSurvey >= 90) {
        showSurvey = true;
        surveyType = 'nps';
        trigger = '90_day_check';
      }
    }
    
    res.json({
      showSurvey,
      surveyType,
      trigger,
      context: {
        coursesCompleted,
        accountAgeDays,
        daysSinceLastSurvey
      }
    });
  } catch (error) {
    console.error('Survey check error:', error);
    res.status(500).json({ error: 'Failed to check survey status' });
  }
});

// @route   POST /api/analytics/survey/nps
// @desc    Submit NPS survey
// @access  Private
router.post('/survey/nps', protect, async (req, res) => {
  try {
    const { npsScore, whatDoYouLove, whatCouldImprove, trigger } = req.body;
    
    if (npsScore === undefined || npsScore < 0 || npsScore > 10) {
      return res.status(400).json({ error: 'NPS score must be between 0 and 10' });
    }
    
    const user = await User.findById(req.user._id);
    const coursesCompleted = await UserCourseProgress.countDocuments({
      userId: req.user._id,
      status: 'completed'
    });
    
    const survey = await PlatformSurvey.create({
      userId: req.user._id,
      surveyType: 'nps',
      npsScore,
      responses: {
        whatDoYouLove,
        whatCouldImprove
      },
      context: {
        subscriptionPlan: user.subscription?.plan || 'free',
        monthsSubscribed: user.subscription?.startDate 
          ? Math.floor((Date.now() - user.subscription.startDate) / (1000 * 60 * 60 * 24 * 30))
          : 0,
        coursesCompleted,
        trigger: trigger || 'manual'
      },
      ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      userAgent: req.headers['user-agent']
    });
    
    res.json({ success: true, surveyId: survey._id });
  } catch (error) {
    console.error('Submit NPS error:', error);
    res.status(500).json({ error: 'Failed to submit survey' });
  }
});

// @route   POST /api/analytics/survey/satisfaction
// @desc    Submit satisfaction survey
// @access  Private
router.post('/survey/satisfaction', protect, async (req, res) => {
  try {
    const { 
      satisfactionScore, 
      ratings, 
      whatDoYouLove, 
      whatCouldImprove, 
      featureRequests,
      trigger 
    } = req.body;
    
    const user = await User.findById(req.user._id);
    const coursesCompleted = await UserCourseProgress.countDocuments({
      userId: req.user._id,
      status: 'completed'
    });
    
    const survey = await PlatformSurvey.create({
      userId: req.user._id,
      surveyType: 'satisfaction',
      satisfactionScore,
      ratings: {
        courseQuality: ratings?.courseQuality,
        easeOfUse: ratings?.easeOfUse,
        valueForMoney: ratings?.valueForMoney,
        customerSupport: ratings?.customerSupport,
        ceTracking: ratings?.ceTracking,
        certificateProcess: ratings?.certificateProcess
      },
      responses: {
        whatDoYouLove,
        whatCouldImprove,
        featureRequests
      },
      context: {
        subscriptionPlan: user.subscription?.plan || 'free',
        monthsSubscribed: user.subscription?.startDate 
          ? Math.floor((Date.now() - user.subscription.startDate) / (1000 * 60 * 60 * 24 * 30))
          : 0,
        coursesCompleted,
        trigger: trigger || 'manual'
      },
      ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      userAgent: req.headers['user-agent']
    });
    
    res.json({ success: true, surveyId: survey._id });
  } catch (error) {
    console.error('Submit satisfaction error:', error);
    res.status(500).json({ error: 'Failed to submit survey' });
  }
});

// @route   POST /api/analytics/survey/post-course
// @desc    Submit post-course survey (your custom questions)
// @access  Private
router.post('/survey/post-course', protect, async (req, res) => {
  try {
    const { courseId, responses, npsScore } = req.body;
    
    const user = await User.findById(req.user._id);
    
    const survey = await PlatformSurvey.create({
      userId: req.user._id,
      surveyType: 'post_course',
      npsScore,
      responses: {
        additionalComments: JSON.stringify(responses) // Store custom responses as JSON
      },
      context: {
        courseId,
        subscriptionPlan: user.subscription?.plan || 'free',
        trigger: 'post_course'
      },
      ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      userAgent: req.headers['user-agent']
    });
    
    res.json({ success: true, surveyId: survey._id });
  } catch (error) {
    console.error('Submit post-course survey error:', error);
    res.status(500).json({ error: 'Failed to submit survey' });
  }
});

// ============================================
// ADMIN ANALYTICS DASHBOARD
// ============================================

// @route   GET /api/analytics/admin/overview
// @desc    Get platform analytics overview
// @access  Private (Admin)
router.get('/admin/overview', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    
    // Get date range
    const startDate = req.query.startDate ? new Date(req.query.startDate) : null;
    const endDate = req.query.endDate ? new Date(req.query.endDate) : null;
    
    // Build date filter
    const dateFilter = {};
    if (startDate) dateFilter.$gte = startDate;
    if (endDate) dateFilter.$lte = endDate;
    
const round1 = (v) => (v ? Math.round(v * 10) / 10 : 0);

    // ── Metrics derived from the `evaluations` collection (real rating data) ──
    const evalMatch = {
      isDeleted: { $ne: true },
      status: { $in: ['submitted', 'completed', 'reviewed'] }
    };
    if (startDate || endDate) {
      evalMatch.createdAt = {};
      if (startDate) evalMatch.createdAt.$gte = startDate;
      if (endDate) evalMatch.createdAt.$lte = endDate;
    }

    const evalGlobalAgg = await Evaluation.aggregate([
      { $match: evalMatch },
      { $group: {
        _id: null,
        count: { $sum: 1 },
        avgOverall: { $avg: '$overallRating' },
        avgContentQuality: { $avg: '$ratings.contentQuality' },
        avgRelevance: { $avg: '$ratings.relevance' },
        avgPresentation: { $avg: '$ratings.presentation' },
        avgEngagement: { $avg: '$ratings.engagement' },
        avgLearningObjectives: { $avg: '$ratings.learningObjectives' },
        promoters: { $sum: { $cond: [{ $gte: ['$overallRating', 4] }, 1, 0] } },
        passives: { $sum: { $cond: [{ $eq: ['$overallRating', 3] }, 1, 0] } },
        detractors: { $sum: { $cond: [{ $and: [{ $gte: ['$overallRating', 1] }, { $lte: ['$overallRating', 2] }] }, 1, 0] } }
      } }
    ]);
    const g = evalGlobalAgg[0] || {};

    // NPS approximated from the 1-5 overall rating (>=4 promoter, 3 passive, <=2 detractor)
    const npsTotal = (g.promoters || 0) + (g.passives || 0) + (g.detractors || 0);
    const npsValue = npsTotal > 0
      ? Math.round((((g.promoters || 0) - (g.detractors || 0)) / npsTotal) * 100)
      : 0;
    const npsData = {
      nps: npsValue,
      score: npsValue,
      promoters: g.promoters || 0,
      passives: g.passives || 0,
      detractors: g.detractors || 0,
      total: npsTotal
    };

    const satisfactionData = {
      avgSatisfaction: round1(g.avgOverall),
      avgContentQuality: round1(g.avgContentQuality),
      avgRelevance: round1(g.avgRelevance),
      avgPresentation: round1(g.avgPresentation),
      avgEngagement: round1(g.avgEngagement),
      avgLearningObjectives: round1(g.avgLearningObjectives),
      count: g.count || 0
    };

    // Per-course average rating, for the Top Courses table
    const evalByCourseAgg = await Evaluation.aggregate([
      { $match: evalMatch },
      { $group: { _id: '$course', avg: { $avg: '$overallRating' }, count: { $sum: 1 } } }
    ]);
    const ratingByCourse = new Map(
      evalByCourseAgg.map(r => [String(r._id), { avg: round1(r.avg), count: r.count }])
    );
    
    
    // Date window applied per-metric via $cond — NOT as a top-level $match.
    // Ensures in-progress enrollments still count toward totalEnrollments
    // when a window is active, and that completions without completedAt
    // stamped (older rows, interactive `certified` rows) aren't silently dropped.
    const hasWindow = !!(startDate || endDate);
    const inWindow = (field) => {
      const conds = [{ $ne: [`$${field}`, null] }];
      if (startDate) conds.push({ $gte: [`$${field}`, startDate] });
      if (endDate)   conds.push({ $lte: [`$${field}`, endDate] });
      return { $and: conds };
    };

    const buildGroup = (completedStatuses, hasEvalSubmittedAt) => ({
      _id: null,
      totalEnrollments: { $sum: 1 },
      totalCompletions: {
        $sum: {
          $cond: [
            hasWindow
              ? { $and: [{ $in: ['$status', completedStatuses] }, inWindow('completedAt')] }
              : { $in: ['$status', completedStatuses] },
            1, 0
          ]
        }
      },
      totalEvaluations: {
        $sum: {
          $cond: [
            hasWindow && hasEvalSubmittedAt
              ? { $and: [{ $eq: ['$evaluationCompleted', true] }, inWindow('evaluationCompletedAt')] }
              : { $eq: ['$evaluationCompleted', true] },
            1, 0
          ]
        }
      }
    });

    // UserCourseProgress has evaluationCompletedAt but no evaluationSubmittedAt,
    // so evaluations are counted unconditionally across the whole collection.
    const legacyHasEvalAt = false;

    const progressStats = await UserCourseProgress.aggregate([
      { $group: buildGroup(['completed'], legacyHasEvalAt) }
    ]);

    const interactiveProgressStats = await mongoose.connection.db
      .collection('interactivecourseprogresses')
      .aggregate([{ $group: buildGroup(['completed', 'certified'], false) }])
      .toArray();

    // Get total courses count
    const totalCourses = await Course.countDocuments({ status: 'published' });
    
    // Combine course stats (legacy + interactive)
    const combinedEnrollments = (progressStats[0]?.totalEnrollments || 0) + (interactiveProgressStats[0]?.totalEnrollments || 0);
    const combinedCompletions = (progressStats[0]?.totalCompletions || 0) + (interactiveProgressStats[0]?.totalCompletions || 0);
    const combinedEvaluations = (progressStats[0]?.totalEvaluations || 0) + (interactiveProgressStats[0]?.totalEvaluations || 0);

    const courseStats = {
      totalCourses,
      totalEnrollments: combinedEnrollments,
      totalCompletions: combinedCompletions,
      totalEvaluations: combinedEvaluations,
      avgRating: round1(g.avgOverall),
      totalRatings: g.count || 0,
      avgCompletionRate: combinedEnrollments > 0
        ? Math.round((combinedCompletions / combinedEnrollments) * 100)
        : 0
    };
    
    // Top courses by enrollment (from UserCourseProgress)
    const topByEnrollment = await UserCourseProgress.aggregate([
      {
        $group: {
          _id: '$courseId',
          enrollments: { $sum: 1 }
        }
      },
      { $sort: { enrollments: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'courses',
          localField: '_id',
          foreignField: '_id',
          as: 'course'
        }
      },
      { $unwind: '$course' },
      {
        $project: {
          _id: '$course._id',
          title: '$course.title',
          analytics: {
            enrollments: '$enrollments',
            avgRating: '$course.analytics.avgRating'
          }
        }
      }
    ]);

    const topByEnrollmentInteractive = await mongoose.connection.db
      .collection('interactivecourseprogresses')
      .aggregate([
        { $group: { _id: '$courseId', enrollments: { $sum: 1 } } },
        { $sort: { enrollments: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: 'interactivecourses',
            localField: '_id',
            foreignField: '_id',
            as: 'course'
          }
        },
        { $unwind: '$course' },
        {
          $project: {
            _id: '$course._id',
            title: '$course.title',
            analytics: { enrollments: '$enrollments' }
          }
        }
      ]).toArray();

    const allTopByEnrollment = [...topByEnrollment, ...topByEnrollmentInteractive]
      .sort((a, b) => b.analytics.enrollments - a.analytics.enrollments)
      .slice(0, 5)
      .map(c => {
        const r = ratingByCourse.get(String(c._id));
        return { ...c, analytics: { ...c.analytics, avgRating: r ? r.avg : 0, totalRatings: r ? r.count : 0 } };
      });

    // Top courses by rating (from evaluations; titles from both course collections)
    const topByRatingRaw = await Evaluation.aggregate([
      { $match: evalMatch },
      { $group: { _id: '$course', avgRating: { $avg: '$overallRating' }, totalRatings: { $sum: 1 } } },
      { $sort: { avgRating: -1 } },
      { $limit: 5 },
      { $lookup: { from: 'interactivecourses', localField: '_id', foreignField: '_id', as: 'ic' } },
      { $lookup: { from: 'courses', localField: '_id', foreignField: '_id', as: 'lc' } }
    ]);
    const topByRating = topByRatingRaw.map(r => ({
      _id: r._id,
      title: (r.ic[0] && r.ic[0].title) || (r.lc[0] && r.lc[0].title) || 'Unknown',
      analytics: { avgRating: round1(r.avgRating), totalRatings: r.totalRatings }
    }));
    
    // Recent feedback from platform surveys
    const recentFeedback = await PlatformSurvey.find({
      $or: [
        { 'responses.whatDoYouLove': { $exists: true, $ne: '' } },
        { 'responses.whatCouldImprove': { $exists: true, $ne: '' } },
        { 'responses.featureRequests': { $exists: true, $ne: '' } }
      ]
    })
      .populate('userId', 'email profile.firstName')
      .sort({ createdAt: -1 })
      .limit(10);
    
    // Recent course evaluations — populate user from users, but courses live in TWO collections
    // (`courses` legacy + `interactivecourses` primary), so do a manual two-collection lookup.
    const recentEvaluationsRaw = await Evaluation.find({ isDeleted: false })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('user', 'email profile')
      .lean();

    const courseIds = [...new Set(
      recentEvaluationsRaw
        .map(ev => ev.course)
        .filter(id => id && mongoose.Types.ObjectId.isValid(id))
        .map(id => String(id))
    )];
    const [legacyCourses, interactiveCourses] = await Promise.all([
      Course.find({ _id: { $in: courseIds } }).select('title courseCode').lean(),
      InteractiveCourse.find({ _id: { $in: courseIds } }).select('title courseCode').lean(),
    ]);
    const courseMap = new Map();
    [...legacyCourses, ...interactiveCourses].forEach(c => courseMap.set(String(c._id), c));

    // Rename user → userId and course → courseId to match frontend contract
    const recentEvaluations = recentEvaluationsRaw.map(ev => ({
      ...ev,
      userId: ev.user,
      courseId: courseMap.get(String(ev.course)) || null,
    }));
    
    res.json({
      nps: npsData,
      satisfaction: satisfactionData,
      courses: courseStats,
      topCourses: {
        byEnrollment: allTopByEnrollment,
        byRating: topByRating
      },
      recentFeedback,
      recentEvaluations
    });
  } catch (error) {
    console.error('Admin overview error:', error?.stack || error);
    res.status(500).json({ error: 'Failed to get analytics overview' });
  }
});

// @route   GET /api/analytics/admin/feedback
// @desc    Get all feedback with filters
// @access  Private (Admin)
router.get('/admin/feedback', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    
    const { type, minScore, maxScore, page = 1, limit = 20 } = req.query;
    
    const filter = {};
    if (type) filter.surveyType = type;
    if (minScore) filter.npsScore = { $gte: parseInt(minScore) };
    if (maxScore) {
      filter.npsScore = filter.npsScore || {};
      filter.npsScore.$lte = parseInt(maxScore);
    }
    
    const surveys = await PlatformSurvey.find(filter)
      .populate('userId', 'email profile.firstName profile.lastName')
      .populate('context.courseId', 'title')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    
    const total = await PlatformSurvey.countDocuments(filter);
    
    res.json({
      surveys,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get feedback error:', error);
    res.status(500).json({ error: 'Failed to get feedback' });
  }
});

// @route   GET /api/analytics/admin/export
// @desc    Export analytics data as CSV
// @access  Private (Admin)
router.get('/admin/export', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    
    const { type = 'all' } = req.query;
    
    let surveys;
    if (type === 'all') {
      surveys = await PlatformSurvey.find()
        .populate('userId', 'email')
        .populate('context.courseId', 'title')
        .sort({ createdAt: -1 });
    } else {
      surveys = await PlatformSurvey.find({ surveyType: type })
        .populate('userId', 'email')
        .populate('context.courseId', 'title')
        .sort({ createdAt: -1 });
    }
    
    // Build CSV
    const headers = [
      'Date', 'Email', 'Survey Type', 'NPS Score', 'Satisfaction', 
      'Course Quality', 'Ease of Use', 'Value for Money', 'Support',
      'What They Love', 'What Could Improve', 'Feature Requests', 'Course', 'Plan'
    ];
    
    const rows = surveys.map(s => [
      s.createdAt.toISOString().split('T')[0],
      s.userId?.email || 'N/A',
      s.surveyType,
      s.npsScore ?? '',
      s.satisfactionScore ?? '',
      s.ratings?.courseQuality ?? '',
      s.ratings?.easeOfUse ?? '',
      s.ratings?.valueForMoney ?? '',
      s.ratings?.customerSupport ?? '',
      (s.responses?.whatDoYouLove || '').replace(/,/g, ';'),
      (s.responses?.whatCouldImprove || '').replace(/,/g, ';'),
      (s.responses?.featureRequests || '').replace(/,/g, ';'),
      s.context?.courseId?.title || '',
      s.context?.subscriptionPlan || ''
    ]);
    
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=survey_data_${Date.now()}.csv`);
    res.send(csv);
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ error: 'Failed to export data' });
  }
});

// ============================================
// CONVERSION FUNNEL
// ============================================

// @route   GET /api/analytics/admin/funnel
// @desc    Get conversion funnel data (registration → enrollment → payment → course start → completion)
// @access  Private (Admin)
router.get('/admin/funnel', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const days = parseInt(req.query.days) || 90;
    const since = new Date();
    since.setDate(since.getDate() - days);

    // Stage 1: Registered users
    const registeredCount = await User.countDocuments({
      createdAt: { $gte: since }
    });

    // Stage 2: Users who enrolled in at least one course (legacy + interactive)
    const [legacyEnrolled, interactiveEnrolled] = await Promise.all([
      UserCourseProgress.distinct('userId', { enrolledAt: { $gte: since } }),
      mongoose.connection.db.collection('interactivecourseprogresses')
        .distinct('userId', { enrolledAt: { $gte: since } })
    ]);
    const enrolledCount = new Set([...legacyEnrolled.map(String), ...interactiveEnrolled.map(String)]).size;

    // Stage 3: Users who made a payment during this period (from UserActivity — timestamp-accurate)
    const paidUsers = await UserActivity.distinct('userId', {
      type: { $in: ['payment_succeeded', 'subscription_started'] },
      timestamp: { $gte: since }
    });
    const paidCount = paidUsers.length;

    // Stage 4: Users who started a course (legacy + interactive)
    const [legacyStarted, interactiveStarted] = await Promise.all([
      UserCourseProgress.distinct('userId', {
        enrolledAt: { $gte: since },
        status: { $in: ['in_progress', 'completed'] }
      }),
      mongoose.connection.db.collection('interactivecourseprogresses')
        .distinct('userId', {
          enrolledAt: { $gte: since },
          status: { $in: ['in_progress', 'completed'] }
        })
    ]);
    const startedCount = new Set([...legacyStarted.map(String), ...interactiveStarted.map(String)]).size;

    // Stage 5: Users who completed at least one course (legacy + interactive)
    const [legacyCompleted, interactiveCompleted] = await Promise.all([
      UserCourseProgress.distinct('userId', { completedAt: { $gte: since }, status: 'completed' }),
      mongoose.connection.db.collection('interactivecourseprogresses')
        .distinct('userId', { completedAt: { $gte: since }, status: 'completed' })
    ]);
    const completedCount = new Set([...legacyCompleted.map(String), ...interactiveCompleted.map(String)]).size;

    // Build funnel stages with conversion rates
    const stages = [
      { stage: 'Signed Up', count: registeredCount, rate: 100 },
      { stage: 'Enrolled', count: enrolledCount, rate: registeredCount > 0 ? Math.round((enrolledCount / registeredCount) * 100) : 0 },
      { stage: 'Made Payment', count: paidCount, rate: registeredCount > 0 ? Math.round((paidCount / registeredCount) * 100) : 0 },
      { stage: 'Began Course', count: startedCount, rate: registeredCount > 0 ? Math.round((startedCount / registeredCount) * 100) : 0 },
      { stage: 'Completed Course', count: completedCount, rate: registeredCount > 0 ? Math.round((completedCount / registeredCount) * 100) : 0 }
    ];

    // Step-to-step drop-off
    const dropoffs = [];
    for (let i = 1; i < stages.length; i++) {
      const prev = stages[i - 1].count;
      const curr = stages[i].count;
      dropoffs.push({
        from: stages[i - 1].stage,
        to: stages[i].stage,
        dropped: prev - curr,
        stepRate: prev > 0 ? Math.round((curr / prev) * 100) : 0
      });
    }

    // Average time between funnel stages
    const avgTimes = await getAverageFunnelTimes(since);

    res.json({ stages, dropoffs, avgTimes, period: { days, since } });
  } catch (error) {
    console.error('Funnel analytics error:', error);
    res.status(500).json({ error: 'Failed to get funnel data' });
  }
});

// Helper: calculate average time between funnel stages
async function getAverageFunnelTimes(since) {
  try {
    const result = await UserCourseProgress.aggregate([
      { $match: { enrolledAt: { $gte: since } } },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $group: {
          _id: null,
          avgRegistrationToEnrollment: {
            $avg: { $subtract: ['$enrolledAt', '$user.createdAt'] }
          },
          avgEnrollmentToStart: {
            $avg: {
              $cond: [
                { $ne: ['$status', 'not_started'] },
                { $subtract: [
                  { $ifNull: [{ $min: '$lessonsCompleted.completedAt' }, '$enrolledAt'] },
                  '$enrolledAt'
                ]},
                null
              ]
            }
          },
          avgStartToCompletion: {
            $avg: {
              $cond: [
                { $eq: ['$status', 'completed'] },
                { $subtract: [
                  '$completedAt',
                  { $ifNull: [{ $min: '$lessonsCompleted.completedAt' }, '$enrolledAt'] }
                ]},
                null
              ]
            }
          }
        }
      }
    ]);

    if (!result.length) return {};

    const ms = result[0];
    const toHours = (val) => val ? Math.round((val / (1000 * 60 * 60)) * 10) / 10 : null;

    return {
      registrationToEnrollment: toHours(ms.avgRegistrationToEnrollment),
      enrollmentToStart: toHours(ms.avgEnrollmentToStart),
      startToCompletion: toHours(ms.avgStartToCompletion)
    };
  } catch {
    return {};
  }
}

// @route   GET /api/analytics/admin/funnel/trend
// @desc    Get funnel stage counts over time (for chart)
// @access  Private (Admin)
router.get('/admin/funnel/trend', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const days = parseInt(req.query.days) || 90;
    const since = new Date();
    since.setDate(since.getDate() - days);

    // Group by week
    const registrations = await User.aggregate([
      { $match: { createdAt: { $gte: since } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%U', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const weeklyAgg = (field, matchExtra = {}) => [
      { $match: { [field]: { $gte: since }, ...matchExtra } },
      { $group: { _id: { $dateToString: { format: '%Y-%U', date: `$${field}` } }, uniqueUsers: { $addToSet: '$userId' } } },
      { $project: { _id: 1, uniqueUsers: { $size: '$uniqueUsers' } } },
      { $sort: { _id: 1 } }
    ];

    const mergeWeekly = (a, b) => {
      const map = {};
      for (const row of a) map[row._id] = (map[row._id] || 0) + row.uniqueUsers;
      for (const row of b) map[row._id] = (map[row._id] || 0) + row.uniqueUsers;
      return Object.entries(map).map(([_id, uniqueUsers]) => ({ _id, uniqueUsers })).sort((x, y) => x._id < y._id ? -1 : 1);
    };

    const db = mongoose.connection.db;
    const [legacyEnrollTrend, interactiveEnrollTrend, legacyCompleteTrend, interactiveCompleteTrend] = await Promise.all([
      UserCourseProgress.aggregate(weeklyAgg('enrolledAt')),
      db.collection('interactivecourseprogresses').aggregate(weeklyAgg('enrolledAt')).toArray(),
      UserCourseProgress.aggregate(weeklyAgg('completedAt', { status: 'completed' })),
      db.collection('interactivecourseprogresses').aggregate(weeklyAgg('completedAt', { status: 'completed' })).toArray()
    ]);

    const enrollments = mergeWeekly(legacyEnrollTrend, interactiveEnrollTrend);
    const completions = mergeWeekly(legacyCompleteTrend, interactiveCompleteTrend);

    res.json({ registrations, enrollments, completions });
  } catch (error) {
    console.error('Funnel trend error:', error);
    res.status(500).json({ error: 'Failed to get funnel trend' });
  }
});

// ============================================
// CURRENT USER ACTIVITY
// ============================================

// @route   GET /api/analytics/my-activity
// @desc    Get recent activity for the logged-in user
// @access  Private
router.get('/my-activity', protect, async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 20, 50);

    const activities = await UserActivity.find({ userId: req.user._id })
      .sort({ timestamp: -1 })
      .limit(limit)
      .populate('courseId', 'title slug');

    res.json({ activities });
  } catch (error) {
    console.error('My activity error:', error);
    res.status(500).json({ error: 'Failed to get activity' });
  }
});

// ============================================
// USER ACTIVITY TIMELINE
// ============================================

// @route   GET /api/analytics/admin/user/:userId/timeline
// @desc    Get full activity timeline for a specific user
// @access  Private (Admin)
router.get('/admin/user/:userId/timeline', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { userId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const type = req.query.type;

    const filter = { userId };
    if (type) filter.type = type;

    const [activities, total, user] = await Promise.all([
      UserActivity.find(filter)
        .sort({ timestamp: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('courseId', 'title slug'),
      UserActivity.countDocuments(filter),
      User.findById(userId).select('email profile.firstName profile.lastName createdAt subscription lastLoginAt')
    ]);

    res.json({
      user: user ? {
        _id: user._id,
        email: user.email,
        name: `${user.profile?.firstName || ''} ${user.profile?.lastName || ''}`.trim(),
        memberSince: user.createdAt,
        lastLogin: user.lastLoginAt,
        subscription: user.subscription?.status
      } : null,
      activities,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    console.error('User timeline error:', error);
    res.status(500).json({ error: 'Failed to get user timeline' });
  }
});

// @route   GET /api/analytics/admin/activity/search
// @desc    Search activities across all users (from UserActivity collection)
// @access  Private (Admin)
router.get('/admin/activity/search', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { type, email, days, page = 1, limit = 50 } = req.query;
    const filter = {};

    if (type) filter.type = type;
    if (days) {
      const since = new Date();
      since.setDate(since.getDate() - parseInt(days));
      filter.timestamp = { $gte: since };
    }
    if (email) filter.userEmail = { $regex: email, $options: 'i' };

    const [activities, total] = await Promise.all([
      UserActivity.find(filter)
        .sort({ timestamp: -1 })
        .skip((parseInt(page) - 1) * parseInt(limit))
        .limit(parseInt(limit)),
      UserActivity.countDocuments(filter)
    ]);

    res.json({
      activities,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Activity search error:', error);
    res.status(500).json({ error: 'Failed to search activities' });
  }
});

export default router;
