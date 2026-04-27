/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
// adminUsers.js — Admin user management, stats, activity, hardship
import express from 'express';
import User from '../models/User.js';
import Course from '../models/Course.js';
import { Course as InteractiveCourse, CourseProgress } from '../models/InteractiveCourse.js';
import Certificate from '../models/Certificate.js';
import UserCourseProgress from '../models/UserCourseProgress.js';
import UserCredential from '../models/UserCredential.js';
import { protect } from '../middleware/auth.js';
import { getRecentActivity } from '../services/activityTrackingService.js';

const router = express.Router();

const adminOnly = async (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// @route   GET /api/admin/notification-prefs
// @desc    Get admin notification preferences
// @access  Admin only
router.get('/notification-prefs', protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('email adminNotifPrefs');
    if (!user) return res.status(404).json({ error: 'Admin user not found' });

    const defaults = {
      notifyRegistration:       true,
      notifyEnrollment:         true,
      notifyCompletion:         true,
      notifyQuizPass:           false,
      notifyQuizFail:           true,
      notifySubscriptionStart:  true,
      notifySubscriptionCancel: true,
      notifyPayment:            true,
      notifyPaymentFail:        true,
      notifyCertificate:        false,
    };

    const prefs = { ...defaults, ...(user.adminNotifPrefs?.toObject?.() || user.adminNotifPrefs || {}) };

    res.json({ prefs, adminEmail: user.email });
  } catch (err) {
    console.error('GET /admin/notification-prefs error:', err);
    res.status(500).json({ error: 'Failed to load notification preferences' });
  }
});

// @route   PUT /api/admin/notification-prefs
// @desc    Save admin notification preferences
// @access  Admin only
router.put('/notification-prefs', protect, adminOnly, async (req, res) => {
  try {
    const { prefs } = req.body;
    if (!prefs || typeof prefs !== 'object') {
      return res.status(400).json({ error: 'Invalid prefs payload' });
    }

    // Allowlist keys — never let the client write arbitrary fields
    const allowed = [
      'notifyRegistration', 'notifyEnrollment', 'notifyCompletion',
      'notifyQuizPass', 'notifyQuizFail', 'notifySubscriptionStart',
      'notifySubscriptionCancel', 'notifyPayment', 'notifyPaymentFail',
      'notifyCertificate',
    ];

    const sanitized = {};
    allowed.forEach(k => {
      if (typeof prefs[k] === 'boolean') sanitized[k] = prefs[k];
    });

    await User.findByIdAndUpdate(req.user.id, { $set: { adminNotifPrefs: sanitized } });

    res.json({ success: true, prefs: sanitized });
  } catch (err) {
    console.error('PUT /admin/notification-prefs error:', err);
    res.status(500).json({ error: 'Failed to save notification preferences' });
  }
});

// @route   GET /api/admin/stats
// @desc    Get admin dashboard stats
// @access  Admin only
router.get('/stats', protect, adminOnly, async (req, res) => {
  try {
    const [totalUsers, activeSubscribers, oldCourseCount, interactiveCourseCount, totalCertificates, oldEnrollments, oldCompletions, interactiveEnrollments, interactiveCompletions] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ 'subscription.status': 'active' }),
      Course.countDocuments({ status: 'published' }),
      InteractiveCourse.countDocuments({ status: 'published' }),
      Certificate.countDocuments(),
      UserCourseProgress.countDocuments(),
      UserCourseProgress.countDocuments({ status: 'completed' }),
      CourseProgress.countDocuments(),
      CourseProgress.countDocuments({ status: { $in: ['completed', 'certified'] } })
    ]);

    res.json({
      totalUsers,
      activeSubscribers,
      totalCourses: oldCourseCount + interactiveCourseCount,
      totalCertificates,
      totalEnrollments: oldEnrollments + interactiveEnrollments,
      totalCompletions: oldCompletions + interactiveCompletions
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ error: 'Failed to get stats' });
  }
});

// @route   GET /api/admin/activity
// @desc    Get recent user activity feed
// @access  Admin only
router.get('/activity', protect, adminOnly, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const type = req.query.type; // Optional filter by activity type
    
    // Get activity from admin's feed
    const admin = await User.findById(req.user._id).select('adminActivityFeed');
    let activities = admin?.adminActivityFeed || [];
    
    // Filter by type if specified
    if (type) {
      activities = activities.filter(a => a.type === type);
    }
    
    // Apply limit
    activities = activities.slice(0, limit);
    
    res.json({ 
      activities,
      total: admin?.adminActivityFeed?.length || 0
    });
  } catch (error) {
    console.error('Get activity error:', error);
    res.status(500).json({ error: 'Failed to get activity' });
  }
});

// @route   DELETE /api/admin/activity/clear
// @desc    Clear activity feed
// @access  Admin only
router.delete('/activity/clear', protect, adminOnly, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { adminActivityFeed: [] });
    res.json({ message: 'Activity feed cleared' });
  } catch (error) {
    console.error('Clear activity error:', error);
    res.status(500).json({ error: 'Failed to clear activity' });
  }
});

// @route   GET /api/admin/user-stats
// @desc    Get user statistics for admin dashboard
// @access  Admin only
router.get('/user-stats', protect, adminOnly, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ 'subscription.status': 'active' });
    const vipUsers = await User.countDocuments({ 'subscription.plan': 'vip' });
    
    // New users this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const newThisMonth = await User.countDocuments({ createdAt: { $gte: startOfMonth } });
    
    res.json({
      totalUsers,
      activeUsers,
      vipUsers,
      newThisMonth
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ error: 'Failed to get user stats' });
  }
});

// @route   GET /api/admin/users
// @desc    Get all users (paginated with search/filter/sort)
// @access  Admin only
router.get('/users', protect, adminOnly, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const { search, plan, status, sort } = req.query;
    
    // Build query
    const query = {};
    
    if (search) {
      query.$or = [
        { email: { $regex: search, $options: 'i' } },
        { 'profile.firstName': { $regex: search, $options: 'i' } },
        { 'profile.lastName': { $regex: search, $options: 'i' } }
      ];
    }
    
    if (plan) {
      query['subscription.plan'] = plan;
    }
    
    if (status) {
      query['subscription.status'] = status;
    }
    
    // Build sort
    let sortOption = { createdAt: -1 };
    if (sort === 'oldest') sortOption = { createdAt: 1 };
    else if (sort === 'name') sortOption = { 'profile.firstName': 1 };
    else if (sort === 'lastLogin') sortOption = { lastLoginAt: -1 };
    
    const users = await User.find(query)
      .select('-passwordHash -adminActivityFeed')
      .sort(sortOption)
      .skip(skip)
      .limit(limit);
    
    // Get course counts for each user (both old + interactive systems)
    const userIds = users.map(u => u._id);
    const [oldCounts, interactiveCounts] = await Promise.all([
      UserCourseProgress.aggregate([
        { $match: { userId: { $in: userIds } } },
        { $group: { _id: '$userId', count: { $sum: 1 } } }
      ]),
      CourseProgress.aggregate([
        { $match: { userId: { $in: userIds } } },
        { $group: { _id: '$userId', count: { $sum: 1 } } }
      ])
    ]);
    
    const courseCountMap = {};
    oldCounts.forEach(c => {
      courseCountMap[c._id.toString()] = (courseCountMap[c._id.toString()] || 0) + c.count;
    });
    interactiveCounts.forEach(c => {
      courseCountMap[c._id.toString()] = (courseCountMap[c._id.toString()] || 0) + c.count;
    });
    
    // Add course counts to users
    const usersWithCounts = users.map(u => ({
      ...u.toObject(),
      courseCount: courseCountMap[u._id.toString()] || 0
    }));
    
    const total = await User.countDocuments(query);
    
    res.json({
      users: usersWithCounts,
      page,
      pages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to get users' });
  }
});

// @route   POST /api/admin/users/create
// @desc    Create a new user account from admin panel
// @access  Admin only
router.post('/users/create', protect, adminOnly, async (req, res) => {
  try {
    const { firstName, lastName, email, password, role, plan, licenseType, state } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    // Check if user already exists
    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(400).json({ error: 'A user with that email already exists' });
    }

    // Hash password using same method as auth
    const bcrypt = (await import('bcryptjs')).default;
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user matching your User model schema
    const user = new User({
      email: email.toLowerCase().trim(),
      passwordHash,
      role: role || 'user',
      profile: {
        firstName: firstName || '',
        lastName: lastName || '',
        state: state ? state.toUpperCase() : '',
        licenseType: licenseType || ''
      },
      subscription: {
        plan: plan || 'free',
        status: (plan && plan !== 'free') ? 'active' : 'free',
        startDate: new Date()
      },
      createdByAdmin: true,
      createdAt: new Date()
    });

    await user.save();

    console.log(`Admin created user: ${email} | Plan: ${plan || 'free'} | Role: ${role || 'user'}`);

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: {
        _id: user._id,
        email: user.email,
        firstName: user.profile?.firstName,
        lastName: user.profile?.lastName,
        role: user.role,
        plan: user.subscription?.plan
      }
    });

  } catch (err) {
    console.error('Admin create user error:', err);
    res.status(500).json({ error: err.message || 'Failed to create user' });
  }
});

// @route   PUT /api/admin/users/:userId/subscription
// @desc    Update user subscription (admin override)
// @access  Admin only
router.put('/users/:userId/subscription', protect, adminOnly, async (req, res) => {
  try {
    const { plan, status } = req.body;
    
    const updates = {};
    if (plan) updates['subscription.plan'] = plan;
    if (status) updates['subscription.status'] = status;
    
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { $set: updates },
      { new: true }
    ).select('-passwordHash');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ message: 'Subscription updated', user });
  } catch (error) {
    console.error('Update subscription error:', error);
    res.status(500).json({ error: 'Failed to update subscription' });
  }
});

// @route   POST /api/admin/users/:userId/extend-trial
// @desc    Extend free trial by 3 days. If expired, reactivates from today.
// @access  Admin only
router.post('/users/:userId/extend-trial', protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const currentEnd = user.subscription?.trialEndsAt
      ? new Date(user.subscription.trialEndsAt)
      : new Date();
    // If trial already expired, extend from today; otherwise extend from current end date
    const base = currentEnd < new Date() ? new Date() : currentEnd;
    const newEnd = new Date(base);
    newEnd.setDate(newEnd.getDate() + 3);
    await User.findByIdAndUpdate(req.params.userId, {
      $set: {
        'subscription.trialEndsAt': newEnd,
        'subscription.status': 'trial'
      }
    });
    console.log(`Trial extended for user ${req.params.userId} → new end: ${newEnd.toISOString()}`);
    res.json({
      message: 'Trial extended by 3 days',
      newTrialEndsAt: newEnd
    });
  } catch (err) {
    console.error('Extend trial error:', err);
    res.status(500).json({ error: 'Failed to extend trial' });
  }
});

// @route   POST /api/admin/users/:userId/reset-password
// @desc    Send password reset email to user
// @access  Admin only
router.post('/users/:userId/reset-password', protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Generate reset token
    const crypto = await import('crypto');
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 3600000); // 1 hour
    
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetExpires;
    await user.save();
    
    // Send email (using Resend if available)
    const { Resend } = await import('resend');
    const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
    
    if (resend) {
      const resetUrl = `${process.env.CLIENT_URL || 'https://counselorready.com'}/reset-password.html?token=${resetToken}`;
      
      await resend.emails.send({
        from: 'CounselorReady <no-reply@counselorready.com>',
        to: user.email,
        subject: 'Password Reset Request',
        html: `
          <p>Hi ${user.profile?.firstName || 'there'},</p>
          <p>An admin has requested a password reset for your account.</p>
          <p><a href="${resetUrl}">Click here to reset your password</a></p>
          <p>This link expires in 1 hour.</p>
          <p>If you didn't request this, you can ignore this email.</p>
        `
      });
    }
    
    res.json({ message: 'Password reset email sent' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Failed to send reset email' });
  }
});

// @route   PUT /api/admin/users/:userId/disable
// @desc    Disable user account
// @access  Admin only
router.put('/users/:userId/disable', protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { $set: { disabled: true, disabledAt: new Date(), disabledBy: req.user._id } },
      { new: true }
    ).select('-passwordHash');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ message: 'Account disabled', user });
  } catch (error) {
    console.error('Disable user error:', error);
    res.status(500).json({ error: 'Failed to disable account' });
  }
});

// @route   PUT /api/admin/users/:userId/enable
// @desc    Enable user account
// @access  Admin only
router.put('/users/:userId/enable', protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { $set: { disabled: false }, $unset: { disabledAt: 1, disabledBy: 1 } },
      { new: true }
    ).select('-passwordHash');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ message: 'Account enabled', user });
  } catch (error) {
    console.error('Enable user error:', error);
    res.status(500).json({ error: 'Failed to enable account' });
  }
});

// @route   POST /api/admin/users/:userId/impersonate
// @desc    Get login token to impersonate user
// @access  Admin only
router.post('/users/:userId/impersonate', protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-passwordHash');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Import token generation
    const { generateToken } = await import('../middleware/auth.js');
    const token = generateToken(user._id);
    
    res.json({ 
      token, 
      user: user.toJSON(),
      message: 'Impersonation token generated'
    });
  } catch (error) {
    console.error('Impersonate user error:', error);
    res.status(500).json({ error: 'Failed to impersonate user' });
  }
});

// @route   DELETE /api/admin/users/:userId
// @desc    Delete user account and all related data
// @access  Admin only
router.delete('/users/:userId', protect, adminOnly, async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // Don't allow deleting yourself
    if (userId === req.user._id.toString()) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Delete related data
    await UserCourseProgress.deleteMany({ userId });
    await UserCredential.deleteMany({ userId });
    await Certificate.deleteMany({ userId });
    
    // Delete user
    await User.findByIdAndDelete(userId);
    
    res.json({ message: 'User and all related data deleted' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// @route   GET /api/admin/users/export
// @desc    Export all users as CSV
// @access  Admin only
router.get('/users/export', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find()
      .select('email profile subscription createdAt lastLoginAt')
      .sort({ createdAt: -1 });
    
    // Build CSV
    const headers = ['Email', 'First Name', 'Last Name', 'State', 'Plan', 'Status', 'Joined', 'Last Login'];
    const rows = users.map(u => [
      u.email,
      u.profile?.firstName || '',
      u.profile?.lastName || '',
      u.profile?.state || '',
      u.subscription?.plan || 'free',
      u.subscription?.status || 'free',
      u.createdAt ? new Date(u.createdAt).toISOString() : '',
      u.lastLoginAt ? new Date(u.lastLoginAt).toISOString() : ''
    ]);
    
    const csv = [headers.join(','), ...rows.map(r => r.map(c => `"${c}"`).join(','))].join('\n');
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=users-export-${new Date().toISOString().split('T')[0]}.csv`);
    res.send(csv);
  } catch (error) {
    console.error('Export users error:', error);
    res.status(500).json({ error: 'Failed to export users' });
  }
});

// @route   GET /api/admin/users/:userId/progress
// @desc    Get detailed user info for admin view
// @access  Admin only
router.get('/users/:userId/progress', protect, adminOnly, async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // Get user
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Get credentials
    const credentials = await UserCredential.find({ userId })
      .populate('credentialId', 'name state')
      .sort({ isPrimary: -1, createdAt: -1 });
    
    // Get course progress from BOTH systems
    const [oldEnrollments, interactiveEnrollments] = await Promise.all([
      UserCourseProgress.find({ userId })
        .populate('courseId', 'title slug category ceuHours modules')
        .sort({ lastAccessedAt: -1 }),
      CourseProgress.find({ userId })
        .populate('courseId', 'title slug categories ceHours ceuHours sections')
        .sort({ lastAccessedAt: -1 })
    ]);
    
    // Combine and calculate stats
    const allCompleted = [
      ...oldEnrollments.filter(e => e.status === 'completed'),
      ...interactiveEnrollments.filter(e => e.status === 'completed' || e.status === 'certified')
    ];
    const allInProgress = [
      ...oldEnrollments.filter(e => e.status === 'in_progress'),
      ...interactiveEnrollments.filter(e => e.status === 'in_progress')
    ];
    const totalEnrollments = oldEnrollments.length + interactiveEnrollments.length;
    const completedCourses = allCompleted.length;
    const inProgressCourses = allInProgress.length;
    
    // Calculate total CE hours earned from both systems
    let totalCEHoursEarned = 0;
    for (const enrollment of oldEnrollments) {
      if (enrollment.status === 'completed' && enrollment.courseId?.ceuHours) {
        totalCEHoursEarned += enrollment.courseId.ceuHours;
      }
    }
    for (const enrollment of interactiveEnrollments) {
      if ((enrollment.status === 'completed' || enrollment.status === 'certified') && (enrollment.courseId?.ceHours || enrollment.courseId?.ceuHours)) {
        totalCEHoursEarned += enrollment.courseId.ceHours || enrollment.courseId.ceuHours;
      }
    }
    
    // Format course progress for display — old system
    const oldCourseProgress = oldEnrollments.map(e => {
      const course = e.courseId;
      const totalLessons = course?.modules?.reduce((sum, m) => sum + (m.lessons?.length || 0), 0) || 0;
      
      return {
        enrollmentId: e._id,
        courseId: course?._id,
        title: course?.title || 'Unknown Course',
        category: course?.category || 'General',
        ceHours: course?.ceuHours || 0,
        progress: e.percentComplete || 0,
        status: e.status,
        completed: e.status === 'completed',
        completedAt: e.completedAt,
        enrolledAt: e.enrolledAt,
        lastAccessed: e.lastAccessedAt,
        completedLessonsCount: e.lessonsCompleted?.length || 0,
        totalLessons,
        adminCompleted: e.adminCompleted,
        adminNote: e.adminNote,
        system: 'legacy'
      };
    });

    // Format course progress for display — interactive system
    const interactiveCourseProgress = interactiveEnrollments.map(e => {
      const course = e.courseId;
      const totalSections = course?.sections?.length || 0;
      const completedSections = e.sectionProgress?.filter(s => s.status === 'completed').length || 0;
      
      return {
        enrollmentId: e._id,
        courseId: course?._id,
        title: course?.title || 'Unknown Course',
        category: course?.categories?.[0] || 'General',
        ceHours: course?.ceHours || course?.ceuHours || 0,
        progress: e.overallProgress || (totalSections > 0 ? Math.round((completedSections / totalSections) * 100) : 0),
        status: e.status,
        completed: e.status === 'completed' || e.status === 'certified',
        completedAt: e.completedAt,
        enrolledAt: e.createdAt,
        lastAccessed: e.lastAccessedAt,
        completedLessonsCount: completedSections,
        totalLessons: totalSections,
        assessmentPassed: e.assessmentPassed,
        certificateId: e.certificateId,
        system: 'interactive'
      };
    });

    const courseProgress = [...interactiveCourseProgress, ...oldCourseProgress];
    
    // Format credentials
    const formattedCredentials = credentials.map(c => ({
      id: c._id,
      name: c.credentialId?.name || c.customName || 'Unknown',
      state: c.credentialId?.state || c.state || '-',
      licenseNumber: c.licenseNumber,
      expirationDate: c.expirationDate,
      totalCEUsRequired: c.totalCEUsRequired,
      totalCEUsCompleted: c.totalCEUsCompleted,
      isPrimary: c.isPrimary
    }));
    
    res.json({
      user: {
        id: user._id,
        name: `${user.profile?.firstName || ''} ${user.profile?.lastName || ''}`.trim() || user.email,
        firstName: user.profile?.firstName,
        lastName: user.profile?.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        registeredAt: user.createdAt,
        lastLoginAt: user.lastLoginAt,
        subscription: user.subscription,
        primaryState: user.profile?.state || credentials.find(c => c.isPrimary)?.state || '-',
        disabled: user.disabled || false,
        disabledAt: user.disabledAt
      },
      stats: {
        totalCourses: totalEnrollments,
        completedCourses,
        inProgressCourses,
        totalCredentials: credentials.length,
        totalCEHoursEarned
      },
      credentials: formattedCredentials,
      courseProgress
    });
  } catch (error) {
    console.error('Get user progress error:', error);
    res.status(500).json({ error: 'Failed to get user progress' });
  }
});

// ============================================
// HARDSHIP PAUSE ADMIN ROUTES
// ============================================

// @route   GET /api/admin/hardship-metrics
// @desc    Get hardship pause metrics for admin dashboard
// @access  Admin only
router.get('/hardship-metrics', protect, adminOnly, async (req, res) => {
  try {
    // Get all VIP users
    const vipUsers = await User.find({ 'subscription.plan': 'vip' });
    const totalVipMembers = vipUsers.length;
    
    // Active pauses
    const activePauses = vipUsers.filter(u => u.hardshipPause?.isActive).length;
    
    // Pauses used this year
    const currentYear = new Date().getFullYear();
    let pausesUsedYTD = 0;
    let retainedMembers = 0;
    const recentPauses = [];
    
    for (const user of vipUsers) {
      const history = user.hardshipPause?.history || [];
      
      // Count pauses this year
      const yearPauses = history.filter(h => 
        new Date(h.usedDate).getFullYear() === currentYear
      );
      pausesUsedYTD += yearPauses.length;
      
      // Check if they used a pause and are still subscribed
      if (history.length > 0 && user.subscription?.status === 'active') {
        retainedMembers++;
      }
      
      // Collect recent pauses for table
      history.forEach(h => {
        recentPauses.push({
          usedDate: h.usedDate,
          reason: h.reason,
          bankedAtTime: h.yearBanked ? `${currentYear - h.yearBanked}yr` : '0yr',
          userEmail: user.email,
          userInitials: `${user.profile?.firstName?.charAt(0) || ''}${user.profile?.lastName?.charAt(0) || ''}`.toUpperCase() || user.email.charAt(0).toUpperCase(),
          stillActive: user.hardshipPause?.isActive || false,
          stillSubscribed: user.subscription?.status === 'active'
        });
      });
    }
    
    // Sort and limit recent pauses
    recentPauses.sort((a, b) => new Date(b.usedDate) - new Date(a.usedDate));
    const last20Pauses = recentPauses.slice(0, 20);
    
    // Revenue calculations
    const VIP_MONTHLY_PRICE = 49.99;
    const revenueImpact = activePauses * VIP_MONTHLY_PRICE;
    
    const usersWhoUsedPause = vipUsers.filter(u => (u.hardshipPause?.history?.length || 0) > 0);
    const postPauseRetentionRate = usersWhoUsedPause.length > 0
      ? Math.round((retainedMembers / usersWhoUsedPause.length) * 100)
      : 0;
    const retainedAnnualRevenue = retainedMembers * VIP_MONTHLY_PRICE * 12;
    
    // Grace period stats
    const inGracePeriod = vipUsers.filter(u => 
      u.subscription?.paymentFailedAt && u.subscription?.status === 'past_due'
    ).length;
    
    // Calculate average grace days based on loyalty
    let totalGraceDays = 0;
    let graceDaysCount = 0;
    for (const user of vipUsers) {
      if (user.getGracePeriodDays) {
        totalGraceDays += user.getGracePeriodDays();
        graceDaysCount++;
      } else {
        // Fallback calculation
        const banked = user.hardshipPause?.banked || 0;
        const days = banked >= 3 ? 30 : banked >= 1 ? 14 : 7;
        totalGraceDays += days;
        graceDaysCount++;
      }
    }
    const avgGraceDays = graceDaysCount > 0 ? Math.round(totalGraceDays / graceDaysCount) : 7;
    
    // Count recovered payments this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const recoveredPaymentsThisMonth = await User.countDocuments({
      'subscription.paymentRecoveredAt': { $gte: startOfMonth }
    });
    
    res.json({
      totalVipMembers,
      activePauses,
      pausesUsedYTD,
      revenueImpact: Math.round(revenueImpact * 100) / 100,
      retainedMembers,
      postPauseRetentionRate,
      retainedAnnualRevenue: Math.round(retainedAnnualRevenue),
      inGracePeriod,
      recoveredPaymentsThisMonth,
      avgGraceDays,
      recentPauses: last20Pauses
    });
    
  } catch (error) {
    console.error('Hardship metrics error:', error);
    res.status(500).json({ error: 'Failed to get hardship metrics' });
  }
});

// @route   GET /api/admin/hardship-export
// @desc    Export hardship data as CSV
// @access  Admin only
router.get('/hardship-export', protect, adminOnly, async (req, res) => {
  try {
    const vipUsers = await User.find({ 'subscription.plan': 'vip' });
    
    // Build CSV
    const headers = [
      'Email',
      'Name',
      'Plan',
      'Status',
      'Member Since',
      'Available Months',
      'Banked Months',
      'Used Total',
      'Pause Active',
      'Grace Period Days',
      'Last Pause Date',
      'Last Pause Reason'
    ];
    
    const rows = vipUsers.map(user => {
      const lastPause = user.hardshipPause?.history?.slice(-1)[0];
      const graceDays = user.getGracePeriodDays ? user.getGracePeriodDays() : 
        (user.hardshipPause?.banked >= 3 ? 30 : user.hardshipPause?.banked >= 1 ? 14 : 7);
      
      return [
        user.email,
        `${user.profile?.firstName || ''} ${user.profile?.lastName || ''}`.trim(),
        user.subscription?.plan || 'free',
        user.subscription?.status || 'inactive',
        user.memberSince || user.createdAt,
        user.hardshipPause?.available || 0,
        user.hardshipPause?.banked || 0,
        user.hardshipPause?.usedTotal || 0,
        user.hardshipPause?.isActive ? 'Yes' : 'No',
        graceDays,
        lastPause?.usedDate || '',
        lastPause?.reason || ''
      ];
    });
    
    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    const filename = `hardship-pauses-${new Date().toISOString().split('T')[0]}.csv`;
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(csv);
    
  } catch (error) {
    console.error('Hardship export error:', error);
    res.status(500).json({ error: 'Failed to export hardship data' });
  }
});


export default router;
