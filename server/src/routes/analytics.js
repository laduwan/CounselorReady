import express from 'express';
import { protect } from '../middleware/auth.js';
import Course from '../models/Course.js';
import PlatformSurvey from '../models/PlatformSurvey.js';
import UserCourseProgress from '../models/UserCourseProgress.js';
import User from '../models/User.js';

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
    
    // Track unique views via session/cookie (simplified)
    const viewKey = `viewed_${req.params.id}`;
    if (!req.cookies?.[viewKey]) {
      course.analytics.uniqueViews = (course.analytics.uniqueViews || 0) + 1;
    }
    
    await course.save();
    
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
        courseId: courseId,
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
    
    // NPS Score
    const npsData = await PlatformSurvey.calculateNPS(startDate, endDate);
    
    // Satisfaction averages
    const satisfactionData = await PlatformSurvey.getSatisfactionAverages(startDate, endDate);
    
    // Course stats
    const courseStats = await Course.aggregate([
      { $match: { status: 'published' } },
      {
        $group: {
          _id: null,
          totalCourses: { $sum: 1 },
          totalEnrollments: { $sum: '$analytics.enrollments' },
          totalCompletions: { $sum: '$analytics.completions' },
          avgRating: { $avg: '$analytics.avgRating' },
          avgCompletionRate: { $avg: '$analytics.completionRate' }
        }
      }
    ]);
    
    // Top courses
    const topByEnrollment = await Course.find({ status: 'published' })
      .select('title analytics.enrollments analytics.avgRating')
      .sort({ 'analytics.enrollments': -1 })
      .limit(5);
    
    const topByRating = await Course.find({ 
      status: 'published',
      'analytics.totalRatings': { $gte: 5 } // At least 5 ratings
    })
      .select('title analytics.avgRating analytics.totalRatings')
      .sort({ 'analytics.avgRating': -1 })
      .limit(5);
    
    // Recent feedback
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
    
    res.json({
      nps: npsData,
      satisfaction: satisfactionData,
      courses: courseStats[0] || {},
      topCourses: {
        byEnrollment: topByEnrollment,
        byRating: topByRating
      },
      recentFeedback
    });
  } catch (error) {
    console.error('Admin overview error:', error);
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

export default router;
