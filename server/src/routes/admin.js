<!DOCTYPE html>
<html lang="en">
<head>
  <link rel="icon" type="image/svg+xml" href="./favicon.svg">import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import User from '../models/User.js';
import Course from '../models/Course.js';
import Certificate from '../models/Certificate.js';
import CredentialTemplate from '../models/CredentialTemplate.js';
import Announcement from '../models/Announcement.js';
import UserCourseProgress from '../models/UserCourseProgress.js';
import UserCredential from '../models/UserCredential.js';
import Anthropic from '@anthropic-ai/sdk';
import { protect } from '../middleware/auth.js';
import { getRecentActivity } from '../services/activityTrackingService.js';

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Initialize Anthropic client
const anthropic = process.env.ANTHROPIC_API_KEY ? new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
}) : null;

// Admin middleware - check if user is admin
const adminOnly = async (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// @route   GET /api/admin/stats
// @desc    Get admin dashboard stats
// @access  Admin only
router.get('/stats', protect, adminOnly, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeSubscribers = await User.countDocuments({ 
      'subscription.status': 'active' 
    });
    const totalCourses = await Course.countDocuments({ status: 'published' });
    const totalCertificates = await Certificate.countDocuments();
    
    res.json({
      totalUsers,
      activeSubscribers,
      totalCourses,
      totalCertificates
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
    
    // Get course counts for each user
    const userIds = users.map(u => u._id);
    const courseCounts = await UserCourseProgress.aggregate([
      { $match: { userId: { $in: userIds } } },
      { $group: { _id: '$userId', count: { $sum: 1 } } }
    ]);
    
    const courseCountMap = {};
    courseCounts.forEach(c => {
      courseCountMap[c._id.toString()] = c.count;
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
    
    // Get course progress
    const enrollments = await UserCourseProgress.find({ userId })
      .populate('courseId', 'title slug category ceuHours modules')
      .sort({ lastAccessedAt: -1 });
    
    // Calculate stats
    const completedCourses = enrollments.filter(e => e.status === 'completed').length;
    const inProgressCourses = enrollments.filter(e => e.status === 'in_progress').length;
    
    // Calculate total CE hours earned
    let totalCEHoursEarned = 0;
    for (const enrollment of enrollments) {
      if (enrollment.status === 'completed' && enrollment.courseId?.ceuHours) {
        totalCEHoursEarned += enrollment.courseId.ceuHours;
      }
    }
    
    // Format course progress for display
    const courseProgress = enrollments.map(e => {
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
        adminNote: e.adminNote
      };
    });
    
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
        totalCourses: enrollments.length,
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
    
    // TODO: Track recovered payments via Stripe webhooks
    const recoveredPaymentsThisMonth = 0;
    
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

// ============================================
// CREDENTIAL TEMPLATE MONITORING ROUTES
// ============================================

// @route   GET /api/admin/credential-templates
// @desc    Get all credential templates with staleness info
// @access  Admin only
router.get('/credential-templates', protect, adminOnly, async (req, res) => {
  try {
    const { type, staleOnly, state } = req.query;
    
    // Build query
    const query = { isActive: true };
    if (type) query.type = type;
    if (state) query.state = state.toUpperCase();
    
    const templates = await CredentialTemplate.find(query)
      .sort({ type: 1, state: 1, code: 1 });
    
    // Calculate staleness (over 6 months = stale, over 12 months = critical)
    const now = new Date();
    const sixMonthsAgo = new Date(now.setMonth(now.getMonth() - 6));
    const twelveMonthsAgo = new Date(now.setMonth(now.getMonth() - 6));
    
    const templatesWithStatus = templates.map(t => {
      const lastVerified = t.lastVerified || t.createdAt;
      let status = 'current';
      let daysSinceVerified = Math.floor((new Date() - new Date(lastVerified)) / (1000 * 60 * 60 * 24));
      
      if (new Date(lastVerified) < twelveMonthsAgo) {
        status = 'critical';
      } else if (new Date(lastVerified) < sixMonthsAgo) {
        status = 'stale';
      }
      
      return {
        ...t.toObject(),
        verificationStatus: status,
        daysSinceVerified
      };
    });
    
    // Filter stale only if requested
    const filtered = staleOnly === 'true' 
      ? templatesWithStatus.filter(t => t.verificationStatus !== 'current')
      : templatesWithStatus;
    
    // Summary stats
    const stats = {
      total: templatesWithStatus.length,
      current: templatesWithStatus.filter(t => t.verificationStatus === 'current').length,
      stale: templatesWithStatus.filter(t => t.verificationStatus === 'stale').length,
      critical: templatesWithStatus.filter(t => t.verificationStatus === 'critical').length
    };
    
    res.json({ templates: filtered, stats });
    
  } catch (error) {
    console.error('Get credential templates error:', error);
    res.status(500).json({ error: 'Failed to get credential templates' });
  }
});

// @route   GET /api/admin/credential-templates/:id
// @desc    Get single credential template
// @access  Admin only
router.get('/credential-templates/:id', protect, adminOnly, async (req, res) => {
  try {
    const template = await CredentialTemplate.findById(req.params.id);
    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }
    res.json(template);
  } catch (error) {
    console.error('Get template error:', error);
    res.status(500).json({ error: 'Failed to get template' });
  }
});

// @route   PUT /api/admin/credential-templates/:id
// @desc    Update credential template
// @access  Admin only
router.put('/credential-templates/:id', protect, adminOnly, async (req, res) => {
  try {
    const { 
      renewalCycle, 
      totalCEUsRequired, 
      requirements, 
      notes,
      renewalUrl,
      renewalFee,
      markVerified 
    } = req.body;
    
    const updateData = {};
    if (renewalCycle !== undefined) updateData.renewalCycle = renewalCycle;
    if (totalCEUsRequired !== undefined) updateData.totalCEUsRequired = totalCEUsRequired;
    if (requirements !== undefined) updateData.requirements = requirements;
    if (notes !== undefined) updateData.notes = notes;
    if (renewalUrl !== undefined) updateData.renewalUrl = renewalUrl;
    if (renewalFee !== undefined) updateData.renewalFee = renewalFee;
    
    // Mark as verified if requested
    if (markVerified) {
      updateData.lastVerified = new Date();
    }
    
    const template = await CredentialTemplate.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    
    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }
    
    res.json({ message: 'Template updated', template });
    
  } catch (error) {
    console.error('Update template error:', error);
    res.status(500).json({ error: 'Failed to update template' });
  }
});

// @route   POST /api/admin/credential-templates/:id/verify
// @desc    Mark template as verified (no changes)
// @access  Admin only
router.post('/credential-templates/:id/verify', protect, adminOnly, async (req, res) => {
  try {
    const template = await CredentialTemplate.findByIdAndUpdate(
      req.params.id,
      { lastVerified: new Date() },
      { new: true }
    );
    
    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }
    
    res.json({ message: 'Template marked as verified', template });
    
  } catch (error) {
    console.error('Verify template error:', error);
    res.status(500).json({ error: 'Failed to verify template' });
  }
});

// @route   POST /api/admin/credential-templates/bulk-verify
// @desc    Mark multiple templates as verified
// @access  Admin only
router.post('/credential-templates/bulk-verify', protect, adminOnly, async (req, res) => {
  try {
    const { templateIds } = req.body;
    
    if (!templateIds || !Array.isArray(templateIds)) {
      return res.status(400).json({ error: 'templateIds array required' });
    }
    
    const result = await CredentialTemplate.updateMany(
      { _id: { $in: templateIds } },
      { lastVerified: new Date() }
    );
    
    res.json({ 
      message: `${result.modifiedCount} templates marked as verified`,
      modifiedCount: result.modifiedCount 
    });
    
  } catch (error) {
    console.error('Bulk verify error:', error);
    res.status(500).json({ error: 'Failed to bulk verify templates' });
  }
});

// @route   POST /api/admin/credential-templates/:id/ai-check
// @desc    Use AI to check state board website for current requirements
// @access  Admin only
router.post('/credential-templates/:id/ai-check', protect, adminOnly, async (req, res) => {
  try {
    if (!anthropic) {
      return res.status(500).json({ error: 'AI service not configured' });
    }
    
    const template = await CredentialTemplate.findById(req.params.id);
    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }
    
    // Build the prompt for AI verification
    const currentReqs = template.requirements.map(r => 
      `${r.category}: ${r.hoursRequired} hours`
    ).join(', ');
    
    const prompt = `You are verifying continuing education requirements for mental health professionals.

Current database entry:
- Credential: ${template.code} (${template.name})
- State: ${template.state || 'National'}
- Issuing Body: ${template.issuingBody}
- Renewal Cycle: ${template.renewalCycle} months
- Total CE Required: ${template.totalCEUsRequired} hours
- Requirements: ${currentReqs}
- Notes: ${template.notes || 'None'}

Please search for the current CE requirements for this credential from the official state licensing board or certifying body. 

Return your findings in this JSON format:
{
  "verified": true/false,
  "confidence": "high/medium/low",
  "currentRequirements": {
    "renewalCycle": number (months),
    "totalCEUsRequired": number,
    "requirements": [
      { "category": "Ethics", "hoursRequired": number },
      ...
    ],
    "notes": "any special requirements or changes"
  },
  "changes": [
    "List any differences from our current data"
  ],
  "sourceUrl": "URL of the official source",
  "lastUpdated": "When the requirements were last updated (if known)",
  "summary": "Brief summary of findings"
}

If you cannot verify the requirements, explain why in the summary.`;

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      messages: [{ role: 'user', content: prompt }]
    });
    
    const responseText = message.content[0].text;
    
    // Try to parse JSON from response
    let aiResult;
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        aiResult = JSON.parse(jsonMatch[0]);
      } else {
        aiResult = { 
          verified: false, 
          summary: responseText,
          confidence: 'low'
        };
      }
    } catch (parseError) {
      aiResult = { 
        verified: false, 
        summary: responseText,
        confidence: 'low'
      };
    }
    
    res.json({
      template: {
        id: template._id,
        code: template.code,
        state: template.state,
        name: template.name
      },
      aiVerification: aiResult
    });
    
  } catch (error) {
    console.error('AI check error:', error);
    res.status(500).json({ error: 'Failed to run AI verification' });
  }
});

// @route   GET /api/admin/credential-templates/review-schedule
// @desc    Get recommended review schedule based on state legislative sessions
// @access  Admin only
router.get('/credential-templates/review-schedule', protect, adminOnly, async (req, res) => {
  try {
    // State legislative session patterns (when rules typically change)
    const reviewSchedule = {
      // States with annual sessions - review quarterly
      quarterly: ['CA', 'NY', 'TX', 'FL', 'IL', 'PA', 'OH', 'GA', 'NC', 'MI', 
                  'NJ', 'VA', 'WA', 'AZ', 'MA', 'TN', 'IN', 'MO', 'MD', 'WI',
                  'CO', 'MN', 'SC', 'AL', 'LA', 'KY', 'OR', 'OK', 'CT', 'UT',
                  'IA', 'NV', 'AR', 'MS', 'KS', 'NM', 'NE', 'WV', 'ID', 'HI',
                  'NH', 'ME', 'RI', 'DE', 'SD', 'ND', 'AK', 'DC', 'VT', 'WY', 'MT'],
      // National certs - review semi-annually
      semiAnnual: ['NCC', 'BC-TMH', 'CCTP', 'RPT', 'ACS'],
      // Specialty certs - review annually
      annual: ['EMDR', 'DBT', 'CGP', 'CSAT']
    };
    
    // Get templates needing review this month
    const templates = await CredentialTemplate.find({ isActive: true });
    const now = new Date();
    
    const needsReviewThisMonth = templates.filter(t => {
      const lastVerified = new Date(t.lastVerified || t.createdAt);
      const monthsSince = (now - lastVerified) / (1000 * 60 * 60 * 24 * 30);
      
      // Check based on type
      if (t.type === 'state_license') {
        return monthsSince >= 3; // Quarterly
      } else if (t.type === 'national_cert') {
        return monthsSince >= 6; // Semi-annual
      } else {
        return monthsSince >= 12; // Annual
      }
    });
    
    // Group by priority
    const critical = needsReviewThisMonth.filter(t => {
      const lastVerified = new Date(t.lastVerified || t.createdAt);
      const monthsSince = (now - lastVerified) / (1000 * 60 * 60 * 24 * 30);
      return monthsSince >= 12;
    });
    
    const upcoming = needsReviewThisMonth.filter(t => {
      const lastVerified = new Date(t.lastVerified || t.createdAt);
      const monthsSince = (now - lastVerified) / (1000 * 60 * 60 * 24 * 30);
      return monthsSince >= 6 && monthsSince < 12;
    });
    
    res.json({
      reviewSchedule,
      thisMonth: {
        total: needsReviewThisMonth.length,
        critical: critical.map(t => ({
          id: t._id,
          code: t.code,
          state: t.state,
          name: t.name,
          lastVerified: t.lastVerified
        })),
        upcoming: upcoming.map(t => ({
          id: t._id,
          code: t.code,
          state: t.state,
          name: t.name,
          lastVerified: t.lastVerified
        }))
      },
      nextReviewDate: new Date(now.setMonth(now.getMonth() + 1)).toISOString().split('T')[0]
    });
    
  } catch (error) {
    console.error('Review schedule error:', error);
    res.status(500).json({ error: 'Failed to get review schedule' });
  }
});

// @route   POST /api/admin/credential-templates
// @desc    Create new credential template
// @access  Admin only
router.post('/credential-templates', protect, adminOnly, async (req, res) => {
  try {
    const { 
      type, code, name, state, issuingBody,
      renewalCycle, totalCEUsRequired, requirements,
      renewalFee, renewalUrl, notes
    } = req.body;
    
    // Check for duplicate
    const existing = await CredentialTemplate.findOne({ 
      code, 
      state: state?.toUpperCase() || null,
      type 
    });
    
    if (existing) {
      return res.status(400).json({ 
        error: `Template already exists for ${code}${state ? ` (${state})` : ''}` 
      });
    }
    
    const template = new CredentialTemplate({
      type,
      code,
      name,
      state: state?.toUpperCase(),
      issuingBody,
      renewalCycle,
      totalCEUsRequired,
      requirements: requirements || [],
      renewalFee,
      renewalUrl,
      notes,
      lastVerified: new Date(),
      isActive: true
    });
    
    await template.save();
    
    res.status(201).json({ message: 'Template created', template });
    
  } catch (error) {
    console.error('Create template error:', error);
    res.status(500).json({ error: 'Failed to create template' });
  }
});

// @route   GET /api/admin/credential-export
// @desc    Export all credential templates as CSV
// @access  Admin only
router.get('/credential-export', protect, adminOnly, async (req, res) => {
  try {
    const templates = await CredentialTemplate.find({ isActive: true })
      .sort({ type: 1, state: 1, code: 1 });
    
    const headers = [
      'Type',
      'Code',
      'Name',
      'State',
      'Issuing Body',
      'Renewal Cycle (months)',
      'Total CE Required',
      'Requirements',
      'Notes',
      'Last Verified',
      'Renewal URL'
    ];
    
    const rows = templates.map(t => [
      t.type,
      t.code,
      t.name,
      t.state || 'National',
      t.issuingBody,
      t.renewalCycle,
      t.totalCEUsRequired,
      t.requirements.map(r => `${r.category}:${r.hoursRequired}`).join('; '),
      t.notes || '',
      t.lastVerified?.toISOString().split('T')[0] || '',
      t.renewalUrl || ''
    ]);
    
    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n');
    
    const filename = `credential-templates-${new Date().toISOString().split('T')[0]}.csv`;
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(csv);
    
  } catch (error) {
    console.error('Credential export error:', error);
    res.status(500).json({ error: 'Failed to export credentials' });
  }
});

// ============================================
// BROADCAST / ANNOUNCEMENT ROUTES
// ============================================

// @route   POST /api/admin/broadcast
// @desc    Create a broadcast announcement
// @access  Admin only
router.post('/broadcast', protect, adminOnly, async (req, res) => {
  try {
    const {
      title,
      message,
      type,
      audience,
      targetStates,
      targetCredentials,
      isPinned,
      dismissible,
      sendEmail,
      endDate,
      ceChangeDetails
    } = req.body;
    
    // Set icon and color based on type
    const typeConfig = {
      info: { icon: 'fa-info-circle', color: 'blue' },
      update: { icon: 'fa-sync-alt', color: 'green' },
      maintenance: { icon: 'fa-tools', color: 'amber' },
      promotion: { icon: 'fa-gift', color: 'purple' },
      urgent: { icon: 'fa-exclamation-triangle', color: 'red' },
      ce_change: { icon: 'fa-certificate', color: 'teal' },
      new_course: { icon: 'fa-graduation-cap', color: 'indigo' }
    };
    
    const config = typeConfig[type] || typeConfig.info;
    
    const announcement = new Announcement({
      title,
      message,
      type: type || 'info',
      icon: config.icon,
      color: config.color,
      audience: audience || 'all',
      targetStates: targetStates || [],
      targetCredentials: targetCredentials || [],
      isPinned: isPinned || false,
      dismissible: dismissible !== false,
      sendEmail: sendEmail || false,
      endDate: endDate || null,
      ceChangeDetails: ceChangeDetails || null,
      createdBy: req.user._id,
      isActive: true
    });
    
    await announcement.save();
    
    // Count affected users
    let affectedCount = 0;
    if (audience === 'all') {
      affectedCount = await User.countDocuments();
    } else if (audience === 'by_credential' && (targetStates?.length || targetCredentials?.length)) {
      // This is a rough estimate
      const UserCredential = require('../models/UserCredential.js').default;
      const query = {};
      if (targetStates?.length) query.state = { $in: targetStates };
      if (targetCredentials?.length) query.credentialCode = { $in: targetCredentials };
      const creds = await UserCredential.find(query).distinct('userId');
      affectedCount = creds.length;
    }
    
    res.status(201).json({
      message: 'Broadcast created successfully',
      announcement,
      affectedUsers: affectedCount
    });
    
  } catch (error) {
    console.error('Create broadcast error:', error);
    res.status(500).json({ error: 'Failed to create broadcast' });
  }
});

// @route   POST /api/admin/broadcast/ce-change
// @desc    Create a CE requirement change broadcast
// @access  Admin only
router.post('/broadcast/ce-change', protect, adminOnly, async (req, res) => {
  try {
    const {
      credentialCode,
      state,
      previousRequirements,
      newRequirements,
      effectiveDate,
      sourceUrl,
      sendEmail
    } = req.body;
    
    const title = `CE Requirements Updated: ${credentialCode}${state ? ` (${state})` : ''}`;
    const message = `
      <p>The continuing education requirements for <strong>${credentialCode}${state ? ` (${state})` : ''}</strong> have been updated.</p>
      <div style="background: #f8f9fa; padding: 12px; border-radius: 8px; margin: 12px 0;">
        <p style="margin: 0 0 8px 0;"><strong>Previous:</strong> ${previousRequirements}</p>
        <p style="margin: 0;"><strong>New:</strong> ${newRequirements}</p>
      </div>
      ${effectiveDate ? `<p><strong>Effective:</strong> ${new Date(effectiveDate).toLocaleDateString()}</p>` : ''}
      ${sourceUrl ? `<p><a href="${sourceUrl}" target="_blank" style="color: #8B2635;">View Official Source →</a></p>` : ''}
    `;
    
    const announcement = new Announcement({
      title,
      message,
      type: 'ce_change',
      icon: 'fa-certificate',
      color: 'teal',
      audience: 'by_credential',
      targetStates: state ? [state] : [],
      targetCredentials: credentialCode ? [credentialCode] : [],
      isPinned: true,
      dismissible: true,
      sendEmail: sendEmail || false,
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      ceChangeDetails: {
        credentialCode,
        state,
        previousRequirements,
        newRequirements,
        effectiveDate,
        sourceUrl
      },
      createdBy: req.user._id,
      isActive: true
    });
    
    await announcement.save();
    
    res.status(201).json({
      message: 'CE change broadcast created',
      announcement
    });
    
  } catch (error) {
    console.error('CE change broadcast error:', error);
    res.status(500).json({ error: 'Failed to create CE change broadcast' });
  }
});

// @route   GET /api/admin/broadcasts
// @desc    Get all broadcasts (admin view)
// @access  Admin only
router.get('/broadcasts', protect, adminOnly, async (req, res) => {
  try {
    const broadcasts = await Announcement.find()
      .sort({ createdAt: -1 })
      .limit(50)
      .populate('createdBy', 'email profile.firstName profile.lastName');
    
    res.json({ broadcasts });
  } catch (error) {
    console.error('Get broadcasts error:', error);
    res.status(500).json({ error: 'Failed to get broadcasts' });
  }
});

// @route   DELETE /api/admin/broadcasts/:id
// @desc    Delete a broadcast
// @access  Admin only
router.delete('/broadcasts/:id', protect, adminOnly, async (req, res) => {
  try {
    await Announcement.findByIdAndDelete(req.params.id);
    res.json({ message: 'Broadcast deleted' });
  } catch (error) {
    console.error('Delete broadcast error:', error);
    res.status(500).json({ error: 'Failed to delete broadcast' });
  }
});

// @route   PUT /api/admin/broadcasts/:id/deactivate
// @desc    Deactivate a broadcast (soft delete)
// @access  Admin only
router.put('/broadcasts/:id/deactivate', protect, adminOnly, async (req, res) => {
  try {
    await Announcement.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ message: 'Broadcast deactivated' });
  } catch (error) {
    console.error('Deactivate broadcast error:', error);
    res.status(500).json({ error: 'Failed to deactivate broadcast' });
  }
});

// ============================================
// LEARNER MANAGEMENT ROUTES
// ============================================

// @route   GET /api/admin/users/:userId/enrollments
// @desc    Get all course enrollments for a user
// @access  Admin only
router.get('/users/:userId/enrollments', protect, adminOnly, async (req, res) => {
  try {
    const enrollments = await UserCourseProgress.find({ userId: req.params.userId })
      .populate('courseId', 'title slug ceuHours ceuEligible thumbnail')
      .sort({ enrolledAt: -1 });
    
    // Get all courses for the "enroll in" dropdown
    const allCourses = await Course.find({ status: 'published' })
      .select('title slug ceuHours category')
      .sort({ title: 1 });
    
    // Filter out already enrolled courses
    const enrolledCourseIds = enrollments.map(e => e.courseId?._id?.toString());
    const availableCourses = allCourses.filter(c => !enrolledCourseIds.includes(c._id.toString()));
    
    res.json({ 
      enrollments,
      availableCourses
    });
  } catch (error) {
    console.error('Get user enrollments error:', error);
    res.status(500).json({ error: 'Failed to get enrollments' });
  }
});

// @route   POST /api/admin/users/:userId/enroll
// @desc    Manually enroll a user in a course
// @access  Admin only
router.post('/users/:userId/enroll', protect, adminOnly, async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.params.userId;
    
    // Check user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Check course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    // Check if already enrolled
    const existing = await UserCourseProgress.findOne({ userId, courseId });
    if (existing) {
      return res.status(400).json({ error: 'User is already enrolled in this course' });
    }
    
    // Create enrollment
    const enrollment = new UserCourseProgress({
      userId,
      courseId,
      enrolled: true,
      enrolledAt: new Date(),
      status: 'not_started',
      completedLessons: [],
      quizAttempts: [],
      currentModule: 0,
      currentLesson: 0,
      progressPercent: 0
    });
    
    await enrollment.save();
    
    // Populate course info for response
    await enrollment.populate('courseId', 'title slug ceuHours');
    
    res.json({ 
      message: `Successfully enrolled ${user.firstName} in ${course.title}`,
      enrollment
    });
  } catch (error) {
    console.error('Admin enroll error:', error);
    res.status(500).json({ error: 'Failed to enroll user' });
  }
});

// @route   DELETE /api/admin/users/:userId/enrollments/:courseId
// @desc    Unenroll a user from a course
// @access  Admin only
router.delete('/users/:userId/enrollments/:courseId', protect, adminOnly, async (req, res) => {
  try {
    const { userId, courseId } = req.params;
    
    const enrollment = await UserCourseProgress.findOne({ userId, courseId });
    if (!enrollment) {
      return res.status(404).json({ error: 'Enrollment not found' });
    }
    
    await UserCourseProgress.deleteOne({ userId, courseId });
    
    res.json({ message: 'User unenrolled successfully' });
  } catch (error) {
    console.error('Admin unenroll error:', error);
    res.status(500).json({ error: 'Failed to unenroll user' });
  }
});

// @route   POST /api/admin/users/:userId/enrollments/:courseId/reset
// @desc    Reset a user's course progress (keep enrolled)
// @access  Admin only
router.post('/users/:userId/enrollments/:courseId/reset', protect, adminOnly, async (req, res) => {
  try {
    const { userId, courseId } = req.params;
    
    const enrollment = await UserCourseProgress.findOne({ userId, courseId });
    if (!enrollment) {
      return res.status(404).json({ error: 'Enrollment not found' });
    }
    
    // Reset progress but keep enrollment
    enrollment.completedLessons = [];
    enrollment.quizAttempts = [];
    enrollment.currentModule = 0;
    enrollment.currentLesson = 0;
    enrollment.status = 'not_started';
    enrollment.completed = false;
    enrollment.completedAt = null;
    enrollment.progressPercent = 0;
    
    await enrollment.save();
    
    res.json({ 
      message: 'Course progress reset successfully',
      enrollment
    });
  } catch (error) {
    console.error('Admin reset progress error:', error);
    res.status(500).json({ error: 'Failed to reset progress' });
  }
});

// @route   POST /api/admin/users/:userId/enrollments/:courseId/complete
// @desc    Mark a course as complete for a user (manual completion)
// @access  Admin only
router.post('/users/:userId/enrollments/:courseId/complete', protect, adminOnly, async (req, res) => {
  try {
    const { userId, courseId } = req.params;
    const { note } = req.body; // Optional admin note
    
    const user = await User.findById(userId);
    const course = await Course.findById(courseId);
    
    if (!user || !course) {
      return res.status(404).json({ error: 'User or course not found' });
    }
    
    // Find or create enrollment
    let enrollment = await UserCourseProgress.findOne({ userId, courseId });
    
    if (!enrollment) {
      enrollment = new UserCourseProgress({
        userId,
        courseId,
        enrolled: true,
        enrolledAt: new Date()
      });
    }
    
    // Mark as complete
    enrollment.status = 'completed';
    enrollment.completed = true;
    enrollment.completedAt = new Date();
    enrollment.progressPercent = 100;
    enrollment.adminCompleted = true;
    enrollment.adminNote = note || 'Manually completed by admin';
    enrollment.adminCompletedBy = req.user._id;
    enrollment.adminCompletedAt = new Date();
    
    await enrollment.save();
    
    res.json({ 
      message: `Course marked complete for ${user.firstName} ${user.lastName}`,
      enrollment
    });
  } catch (error) {
    console.error('Admin complete course error:', error);
    res.status(500).json({ error: 'Failed to complete course' });
  }
});

// @route   GET /api/admin/enrollments/search
// @desc    Search enrollments across all users
// @access  Admin only
router.get('/enrollments/search', protect, adminOnly, async (req, res) => {
  try {
    const { courseId, status, page = 1, limit = 20 } = req.query;
    
    const query = {};
    if (courseId) query.courseId = courseId;
    if (status) query.status = status;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const enrollments = await UserCourseProgress.find(query)
      .populate('userId', 'firstName lastName email')
      .populate('courseId', 'title slug ceuHours')
      .sort({ enrolledAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await UserCourseProgress.countDocuments(query);
    
    res.json({
      enrollments,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Search enrollments error:', error);
    res.status(500).json({ error: 'Failed to search enrollments' });
  }
});

// ============================================
// ADMIN COURSE MANAGEMENT
// ============================================

// @route   GET /api/admin/courses
// @desc    Get all courses for admin
// @access  Admin only
router.get('/courses', protect, adminOnly, async (req, res) => {
  try {
    const courses = await Course.find()
      .select('title slug category ceuHours status enrollmentCount createdAt isExternal externalUrl importType source')
      .sort({ createdAt: -1 });
    
    res.json({ courses });
  } catch (error) {
    console.error('Get admin courses error:', error);
    res.status(500).json({ error: 'Failed to get courses' });
  }
});

// @route   POST /api/admin/courses
// @desc    Create a new course (supports AI-generated courses with modules)
// @access  Admin only
router.post('/courses', protect, adminOnly, async (req, res) => {
  try {
    const {
      title,
      subtitle,
      description,
      category,
      ceuHours,
      ceuCategories,
      isExternal,
      externalUrl,
      importType,
      source,
      status,
      accessTier,
      modules,
      objectives,
      instructor,
      settings,
      approvingBody,
      approvalNumber,
      slug: providedSlug
    } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Course title is required' });
    }
    
    // Generate slug from title or use provided slug
    const slug = providedSlug || (title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') + '-' + Date.now().toString(36));
    
    // Process modules if provided (from AI Course Builder)
    let processedModules = [];
    if (modules && Array.isArray(modules)) {
      processedModules = modules.map((mod, moduleIndex) => ({
        title: mod.title || `Module ${moduleIndex + 1}`,
        description: mod.description || '',
        order: mod.order || moduleIndex + 1,
        objectives: mod.objectives || [],
        lessons: (mod.lessons || []).map((lesson, lessonIndex) => ({
          title: lesson.title || `Lesson ${lessonIndex + 1}`,
          type: lesson.type || 'text',
          content: lesson.content || '',
          videoUrl: lesson.videoUrl || '',
          duration: lesson.duration || 10,
          order: lesson.order || lessonIndex + 1,
          isFree: lesson.isFree || false,
          resources: lesson.resources || [],
          transcript: lesson.transcript || '',
          // Quiz-specific fields
          questions: lesson.type === 'quiz' ? (lesson.questions || []).map(q => ({
            question: q.question || '',
            type: q.type || 'multiple_choice',
            options: q.options || [],
            correctAnswer: q.correctAnswer,
            explanation: q.explanation || '',
            points: q.points || 1
          })) : [],
          shuffleQuestions: lesson.shuffleQuestions || false,
          shuffleOptions: lesson.shuffleOptions || false,
          showExplanations: lesson.showExplanations !== false,
          timeLimit: lesson.timeLimit || null
        }))
      }));
    }
    
    // Build course data object
    const courseData = {
      title,
      slug,
      description: description || '',
      subtitle: subtitle || '',
      category: category || 'general',
      ceuHours: ceuHours || 0,
      ceuEligible: ceuHours > 0,
      ceuCategories: ceuCategories || [],
      isExternal: isExternal || false,
      externalUrl: externalUrl || '',
      importType: importType || 'native',
      source: source || 'native',
      status: status || 'draft',
      accessTier: accessTier || 'professional',
      modules: processedModules,
      objectives: objectives || [],
      instructor: instructor || 'CounselorReady',
      approvingBody: approvingBody || 'NBCC',
      approvalNumber: approvalNumber || '',
      createdBy: req.user._id
    };
    
    // Merge settings if provided
    if (settings && typeof settings === 'object') {
      courseData.settings = {
        linearProgression: settings.linearProgression !== false,
        enforceMinTime: settings.enforceMinTime || false,
        minTimePercent: settings.minTimePercent || 80,
        passingScore: settings.passingScore || 70,
        requireEvaluation: settings.requireEvaluation !== false,
        requireAttestation: settings.requireAttestation !== false,
        certificateEnabled: settings.certificateEnabled !== false,
        allowRetakes: settings.allowRetakes !== false,
        retakePolicy: settings.retakePolicy || 'unlimited',
        maxRetakes: settings.maxRetakes || 3
      };
    }
    
    const course = await Course.create(courseData);
    
    console.log(`Course created: "${course.title}" with ${course.modules.length} modules`);
    
    res.status(201).json({ message: 'Course created', course });
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({ error: 'Failed to create course: ' + error.message });
  }
});

// @route   DELETE /api/admin/courses/:courseId
// @desc    Delete a course and all related data
// @access  Admin only
// @route   GET /api/admin/courses/:courseId
// @desc    Get single course by ID for editing
// @access  Admin only
router.get('/courses/:courseId', protect, adminOnly, async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    // Get enrollment stats
    const enrollmentCount = await UserCourseProgress.countDocuments({ 
      courseId: course._id 
    });
    
    const completionCount = await UserCourseProgress.countDocuments({ 
      courseId: course._id,
      status: 'completed'
    });
    
    res.json({
      ...course.toJSON(),
      stats: {
        enrollmentCount,
        completionCount,
        completionRate: enrollmentCount > 0 
          ? Math.round((completionCount / enrollmentCount) * 100) 
          : 0
      }
    });
  } catch (error) {
    console.error('Admin get course error:', error);
    res.status(500).json({ error: 'Failed to get course' });
  }
});

// @route   PUT /api/admin/courses/:courseId
// @desc    Update course
// @access  Admin only
router.put('/courses/:courseId', protect, adminOnly, async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    const updates = req.body;
    
    // If slug is being changed, check for conflicts
    if (updates.slug && updates.slug !== course.slug) {
      const existingCourse = await Course.findOne({ 
        slug: updates.slug,
        _id: { $ne: course._id }
      });
      
      if (existingCourse) {
        return res.status(400).json({ 
          error: 'A course with this slug already exists' 
        });
      }
    }
    
    // Update fields
    Object.keys(updates).forEach(key => {
      course[key] = updates[key];
    });
    
    course.updatedAt = new Date();
    await course.save();
    
    res.json({ 
      success: true,
      course,
      message: 'Course updated successfully'
    });
  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({ error: 'Failed to update course' });
  }
});

// @route   PATCH /api/admin/courses/:courseId/publish
// @desc    Publish or unpublish a course
// @access  Admin only
router.patch('/courses/:courseId/publish', protect, adminOnly, async (req, res) => {
  try {
    const { publish } = req.body;
    
    const course = await Course.findById(req.params.courseId);
    
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    course.status = publish ? 'published' : 'draft';
    course.publishedAt = publish ? new Date() : null;
    await course.save();
    
    res.json({ 
      success: true,
      course,
      message: publish ? 'Course published' : 'Course unpublished'
    });
  } catch (error) {
    console.error('Publish course error:', error);
    res.status(500).json({ error: 'Failed to update course status' });
  }
});

// @route   POST /api/admin/courses/:courseId/thumbnail
// @desc    Upload course thumbnail image
// @access  Admin only
router.post('/courses/:courseId/thumbnail', protect, adminOnly, upload.single('thumbnail'), async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }
    
    // Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'counselorready/course-thumbnails',
          public_id: `course-${course._id}-${Date.now()}`,
          transformation: [
            { width: 800, height: 450, crop: 'fill', gravity: 'auto' },
            { quality: 'auto', fetch_format: 'auto' }
          ]
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(req.file.buffer);
    });
    
    // Update course with new thumbnail URL
    course.thumbnail = uploadResult.secure_url;
    course.updatedAt = new Date();
    await course.save();
    
    res.json({
      success: true,
      thumbnailUrl: uploadResult.secure_url,
      message: 'Thumbnail uploaded successfully'
    });
  } catch (error) {
    console.error('Thumbnail upload error:', error);
    res.status(500).json({ error: 'Failed to upload thumbnail' });
  }
});

router.delete('/courses/:courseId', protect, adminOnly, async (req, res) => {
  try {
    const courseId = req.params.courseId;
    
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    // Delete related enrollments
    await UserCourseProgress.deleteMany({ courseId });
    
    // Delete related certificates
    await Certificate.deleteMany({ courseId });
    
    // Delete the course
    await Course.findByIdAndDelete(courseId);
    
    res.json({ message: 'Course and all related data deleted' });
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({ error: 'Failed to delete course' });
  }
});

// ===========================================
// MODULE MANAGEMENT ROUTES
// ===========================================

// @route   POST /api/admin/courses/:courseId/module
// @desc    Add a new module to a course
// @access  Admin only
router.post('/courses/:courseId/module', protect, adminOnly, async (req, res) => {
  try {
    const { title, description } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Module title is required' });
    }
    
    const course = await Course.findById(req.params.courseId);
    
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    // Initialize modules array if it doesn't exist
    if (!course.modules) {
      course.modules = [];
    }
    
    // Add new module
    const newModule = {
      title,
      description: description || '',
      lessons: [],
      order: course.modules.length
    };
    
    course.modules.push(newModule);
    course.updatedAt = new Date();
    await course.save();
    
    res.status(201).json({
      success: true,
      course,
      module: course.modules[course.modules.length - 1],
      message: 'Module added successfully'
    });
  } catch (error) {
    console.error('Add module error:', error);
    res.status(500).json({ error: 'Failed to add module' });
  }
});

// @route   PUT /api/admin/courses/:courseId/module/:moduleIndex
// @desc    Update a module
// @access  Admin only
router.put('/courses/:courseId/module/:moduleIndex', protect, adminOnly, async (req, res) => {
  try {
    const { title, description } = req.body;
    const moduleIndex = parseInt(req.params.moduleIndex);
    
    const course = await Course.findById(req.params.courseId);
    
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    if (!course.modules || moduleIndex >= course.modules.length || moduleIndex < 0) {
      return res.status(404).json({ error: 'Module not found' });
    }
    
    // Update module fields
    if (title) course.modules[moduleIndex].title = title;
    if (description !== undefined) course.modules[moduleIndex].description = description;
    
    course.updatedAt = new Date();
    await course.save();
    
    res.json({
      success: true,
      course,
      module: course.modules[moduleIndex],
      message: 'Module updated successfully'
    });
  } catch (error) {
    console.error('Update module error:', error);
    res.status(500).json({ error: 'Failed to update module' });
  }
});

// @route   DELETE /api/admin/courses/:courseId/module/:moduleIndex
// @desc    Delete a module from a course
// @access  Admin only
router.delete('/courses/:courseId/module/:moduleIndex', protect, adminOnly, async (req, res) => {
  try {
    const moduleIndex = parseInt(req.params.moduleIndex);
    
    const course = await Course.findById(req.params.courseId);
    
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    if (!course.modules || moduleIndex >= course.modules.length || moduleIndex < 0) {
      return res.status(404).json({ error: 'Module not found' });
    }
    
    // Remove the module
    course.modules.splice(moduleIndex, 1);
    
    // Reorder remaining modules
    course.modules.forEach((mod, idx) => {
      mod.order = idx;
    });
    
    course.updatedAt = new Date();
    await course.save();
    
    res.json({
      success: true,
      course,
      message: 'Module deleted successfully'
    });
  } catch (error) {
    console.error('Delete module error:', error);
    res.status(500).json({ error: 'Failed to delete module' });
  }
});

// ===========================================
// LESSON MANAGEMENT ROUTES
// ===========================================

// @route   POST /api/admin/courses/:courseId/module/:moduleIndex/lesson
// @desc    Add a new lesson to a module
// @access  Admin only
router.post('/courses/:courseId/module/:moduleIndex/lesson', protect, adminOnly, async (req, res) => {
  try {
    const { title, type, content, videoUrl, duration, isFree, quizQuestions } = req.body;
    const moduleIndex = parseInt(req.params.moduleIndex);
    
    const course = await Course.findById(req.params.courseId);
    
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    if (!course.modules || moduleIndex >= course.modules.length || moduleIndex < 0) {
      return res.status(404).json({ error: 'Module not found' });
    }
    
    // Initialize lessons array if needed
    if (!course.modules[moduleIndex].lessons) {
      course.modules[moduleIndex].lessons = [];
    }
    
    // Create new lesson
    const newLesson = {
      title: title || 'New Lesson',
      type: type || 'text',
      content: content || '',
      videoUrl: videoUrl || '',
      duration: duration || 0,
      isFree: isFree || false,
      quizQuestions: quizQuestions || [],
      order: course.modules[moduleIndex].lessons.length
    };
    
    course.modules[moduleIndex].lessons.push(newLesson);
    course.updatedAt = new Date();
    await course.save();
    
    const addedLesson = course.modules[moduleIndex].lessons[course.modules[moduleIndex].lessons.length - 1];
    
    res.status(201).json({
      success: true,
      course,
      lesson: addedLesson,
      message: 'Lesson added successfully'
    });
  } catch (error) {
    console.error('Add lesson error:', error);
    res.status(500).json({ error: 'Failed to add lesson' });
  }
});

// @route   PUT /api/admin/courses/:courseId/lesson
// @desc    Update a lesson (by lesson ID or by module/lesson index)
// @access  Admin only
router.put('/courses/:courseId/lesson', protect, adminOnly, async (req, res) => {
  try {
    const { moduleIndex, lessonIndex, lessonId, title, type, content, videoUrl, duration, isFree, quizQuestions } = req.body;
    
    const course = await Course.findById(req.params.courseId);
    
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    let lesson;
    let mIdx, lIdx;
    
    // Find lesson by ID or by indices
    if (lessonId) {
      // Find by lesson ID
      for (let mi = 0; mi < course.modules.length; mi++) {
        const module = course.modules[mi];
        if (module.lessons) {
          for (let li = 0; li < module.lessons.length; li++) {
            if (module.lessons[li]._id.toString() === lessonId) {
              lesson = module.lessons[li];
              mIdx = mi;
              lIdx = li;
              break;
            }
          }
        }
        if (lesson) break;
      }
    } else if (moduleIndex !== undefined && lessonIndex !== undefined) {
      // Find by indices
      mIdx = parseInt(moduleIndex);
      lIdx = parseInt(lessonIndex);
      
      if (course.modules[mIdx] && course.modules[mIdx].lessons && course.modules[mIdx].lessons[lIdx]) {
        lesson = course.modules[mIdx].lessons[lIdx];
      }
    }
    
    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }
    
    // Update lesson fields
    if (title !== undefined) lesson.title = title;
    if (type !== undefined) lesson.type = type;
    if (content !== undefined) lesson.content = content;
    if (videoUrl !== undefined) lesson.videoUrl = videoUrl;
    if (duration !== undefined) lesson.duration = duration;
    if (isFree !== undefined) lesson.isFree = isFree;
    if (quizQuestions !== undefined) lesson.quizQuestions = quizQuestions;
    
    course.updatedAt = new Date();
    await course.save();
    
    res.json({
      success: true,
      course,
      lesson: course.modules[mIdx].lessons[lIdx],
      message: 'Lesson updated successfully'
    });
  } catch (error) {
    console.error('Update lesson error:', error);
    res.status(500).json({ error: 'Failed to update lesson' });
  }
});

// @route   DELETE /api/admin/courses/:courseId/module/:moduleIndex/lesson/:lessonIndex
// @desc    Delete a lesson from a module
// @access  Admin only
router.delete('/courses/:courseId/module/:moduleIndex/lesson/:lessonIndex', protect, adminOnly, async (req, res) => {
  try {
    const moduleIndex = parseInt(req.params.moduleIndex);
    const lessonIndex = parseInt(req.params.lessonIndex);
    
    const course = await Course.findById(req.params.courseId);
    
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    if (!course.modules || moduleIndex >= course.modules.length || moduleIndex < 0) {
      return res.status(404).json({ error: 'Module not found' });
    }
    
    const module = course.modules[moduleIndex];
    
    if (!module.lessons || lessonIndex >= module.lessons.length || lessonIndex < 0) {
      return res.status(404).json({ error: 'Lesson not found' });
    }
    
    // Remove the lesson
    module.lessons.splice(lessonIndex, 1);
    
    // Reorder remaining lessons
    module.lessons.forEach((les, idx) => {
      les.order = idx;
    });
    
    course.updatedAt = new Date();
    await course.save();
    
    res.json({
      success: true,
      course,
      message: 'Lesson deleted successfully'
    });
  } catch (error) {
    console.error('Delete lesson error:', error);
    res.status(500).json({ error: 'Failed to delete lesson' });
  }
});

// @route   PUT /api/admin/courses/:courseId/reorder-modules
// @desc    Reorder modules in a course
// @access  Admin only
router.put('/courses/:courseId/reorder-modules', protect, adminOnly, async (req, res) => {
  try {
    const { moduleOrder } = req.body; // Array of module indices in new order
    
    const course = await Course.findById(req.params.courseId);
    
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    if (!Array.isArray(moduleOrder) || moduleOrder.length !== course.modules.length) {
      return res.status(400).json({ error: 'Invalid module order' });
    }
    
    // Reorder modules
    const newModules = moduleOrder.map((oldIndex, newIndex) => {
      const module = course.modules[oldIndex];
      module.order = newIndex;
      return module;
    });
    
    course.modules = newModules;
    course.updatedAt = new Date();
    await course.save();
    
    res.json({
      success: true,
      course,
      message: 'Modules reordered successfully'
    });
  } catch (error) {
    console.error('Reorder modules error:', error);
    res.status(500).json({ error: 'Failed to reorder modules' });
  }
});

// @route   PUT /api/admin/courses/:courseId/module/:moduleIndex/reorder-lessons
// @desc    Reorder lessons in a module
// @access  Admin only
router.put('/courses/:courseId/module/:moduleIndex/reorder-lessons', protect, adminOnly, async (req, res) => {
  try {
    const { lessonOrder } = req.body; // Array of lesson indices in new order
    const moduleIndex = parseInt(req.params.moduleIndex);
    
    const course = await Course.findById(req.params.courseId);
    
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    if (!course.modules || moduleIndex >= course.modules.length || moduleIndex < 0) {
      return res.status(404).json({ error: 'Module not found' });
    }
    
    const module = course.modules[moduleIndex];
    
    if (!Array.isArray(lessonOrder) || lessonOrder.length !== module.lessons.length) {
      return res.status(400).json({ error: 'Invalid lesson order' });
    }
    
    // Reorder lessons
    const newLessons = lessonOrder.map((oldIndex, newIndex) => {
      const lesson = module.lessons[oldIndex];
      lesson.order = newIndex;
      return lesson;
    });
    
    course.modules[moduleIndex].lessons = newLessons;
    course.updatedAt = new Date();
    await course.save();
    
    res.json({
      success: true,
      course,
      message: 'Lessons reordered successfully'
    });
  } catch (error) {
    console.error('Reorder lessons error:', error);
    res.status(500).json({ error: 'Failed to reorder lessons' });
  }
});

// @route   POST /api/admin/quiz/generate
// @desc    Generate quiz questions using AI from PDF, outline, or content
// @access  Admin only
router.post('/quiz/generate', protect, adminOnly, async (req, res) => {
  try {
    if (!anthropic) {
      return res.status(500).json({ error: 'AI service not configured. Set ANTHROPIC_API_KEY in environment.' });
    }
    
    const { mode, pdfData, fileName, outline, content, moduleTitle, questionCount = 5 } = req.body;
    
    let prompt = '';
    let messages = [];
    
    if (mode === 'pdf') {
      if (!pdfData) {
        return res.status(400).json({ error: 'No PDF data provided' });
      }
      
      prompt = `You are an expert at extracting quiz questions from educational documents for continuing education courses for mental health counselors.

Analyze the provided PDF document and extract all quiz questions you can find. If the document contains a quiz or test, extract the questions, options, correct answers, and any explanations provided.

If the document doesn't contain explicit quiz questions but contains educational content, generate appropriate quiz questions based on the key concepts.

Return the questions in this exact JSON format:
{
  "questions": [
    {
      "question": "The question text",
      "type": "multiple_choice",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Why this is the correct answer",
      "points": 1
    }
  ]
}

For question types:
- "multiple_choice" - single correct answer, correctAnswer is the index (0-based)
- "multiple_select" - multiple correct answers, correctAnswer is an array of indices
- "true_false" - correctAnswer is true or false

Important:
- Generate clinically relevant questions appropriate for licensed professional counselors
- Include explanations that reinforce learning
- Ensure questions test understanding, not just memorization
- Cover key ethical considerations where relevant

Return ONLY valid JSON, no other text.`;

      messages = [{
        role: 'user',
        content: [
          {
            type: 'document',
            source: {
              type: 'base64',
              media_type: 'application/pdf',
              data: pdfData
            }
          },
          { type: 'text', text: prompt }
        ]
      }];
      
    } else if (mode === 'outline') {
      if (!outline) {
        return res.status(400).json({ error: 'No outline provided' });
      }
      
      prompt = `You are an expert quiz creator for continuing education courses for mental health counselors.

Based on the following outline or notes, generate comprehensive quiz questions:

${outline}

Create questions that:
1. Test understanding of key concepts
2. Are appropriate for licensed professional counselors
3. Include ethical considerations where relevant
4. Have clear, unambiguous correct answers
5. Include helpful explanations

Return the questions in this exact JSON format:
{
  "questions": [
    {
      "question": "The question text",
      "type": "multiple_choice",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Why this is the correct answer",
      "points": 1
    }
  ]
}

For question types:
- "multiple_choice" - single correct answer, correctAnswer is the index (0-based)
- "multiple_select" - multiple correct answers, correctAnswer is an array of indices
- "true_false" - correctAnswer is true or false

Return ONLY valid JSON, no other text.`;

      messages = [{ role: 'user', content: prompt }];
      
    } else if (mode === 'content') {
      if (!content) {
        return res.status(400).json({ error: 'No content provided' });
      }
      
      const contextInfo = moduleTitle ? `Module: ${moduleTitle}\n\n` : '';
      
      prompt = `You are an expert quiz creator for continuing education courses for mental health counselors.

Based on the following course content, generate exactly ${questionCount} quiz questions:

${contextInfo}${content}

Create questions that:
1. Test understanding of the key learning points
2. Are appropriate for licensed professional counselors  
3. Include ethical considerations where relevant
4. Cover the most important concepts from the content
5. Have clear, unambiguous correct answers
6. Include helpful explanations that reinforce learning

Vary the question types (multiple choice, true/false, multiple select) for engagement.

Return the questions in this exact JSON format:
{
  "questions": [
    {
      "question": "The question text",
      "type": "multiple_choice",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Why this is the correct answer",
      "points": 1
    }
  ]
}

For question types:
- "multiple_choice" - single correct answer, correctAnswer is the index (0-based)
- "multiple_select" - multiple correct answers, correctAnswer is an array of indices  
- "true_false" - correctAnswer is true or false

Return ONLY valid JSON, no other text.`;

      messages = [{ role: 'user', content: prompt }];
    } else {
      return res.status(400).json({ error: 'Invalid mode. Use: pdf, outline, or content' });
    }
    
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      messages: messages
    });
    
    const responseText = response.content[0].text;
    
    let result;
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      return res.status(500).json({ error: 'Failed to parse AI response' });
    }
    
    if (!result.questions || !Array.isArray(result.questions)) {
      return res.status(500).json({ error: 'Invalid response structure from AI' });
    }
    
    // Validate questions
    const validatedQuestions = result.questions.map((q, idx) => {
      if (!q.question) q.question = `Question ${idx + 1}`;
      if (!['multiple_choice', 'multiple_select', 'true_false'].includes(q.type)) q.type = 'multiple_choice';
      
      if (q.type !== 'true_false' && (!q.options || q.options.length < 2)) {
        q.options = ['Option A', 'Option B', 'Option C', 'Option D'];
        q.correctAnswer = 0;
      }
      
      if (q.type === 'true_false') {
        q.correctAnswer = q.correctAnswer === true || q.correctAnswer === 'true';
        q.options = null;
      } else if (q.type === 'multiple_select') {
        if (!Array.isArray(q.correctAnswer)) q.correctAnswer = [0];
      } else {
        if (typeof q.correctAnswer !== 'number') q.correctAnswer = 0;
      }
      
      q.points = q.points || 1;
      
      return {
        question: q.question,
        type: q.type,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation || '',
        points: q.points
      };
    });
    
    res.json({
      success: true,
      questions: validatedQuestions,
      count: validatedQuestions.length,
      mode: mode
    });
    
  } catch (error) {
    console.error('Quiz generation error:', error);
    res.status(500).json({ error: 'Failed to generate quiz: ' + error.message });
  }
});

// @route   POST /api/admin/course/generate
// @desc    Generate a complete course using AI
// @access  Admin only
router.post('/course/generate', protect, adminOnly, async (req, res) => {
  try {
    if (!anthropic) {
      return res.status(500).json({ error: 'AI service not configured' });
    }
    
    const { fileData, fileName, fileType, content, category, ceHours, generateQuizzes, generateObjectives, keyPoints } = req.body;
    
    if (!fileData && !content) {
      return res.status(400).json({ error: 'Provide file or content' });
    }
    
    const catNames = { core: 'Core/General', ethics: 'Ethics', supervision: 'Supervision', telehealth: 'Telehealth', cultural: 'Cultural Diversity', trauma: 'Trauma', substance: 'Substance Abuse', crisis: 'Crisis/Suicide' };
    const catName = catNames[category] || 'Core/General';
    
    let prompt = `You are an expert instructional designer creating CE courses for licensed professional counselors.

Create a complete CE course based on the provided content.
- Category: ${catName}
- CE Hours: ${ceHours}
${keyPoints ? `- Emphasize: ${keyPoints}` : ''}

Return ONLY valid JSON:
{
  "title": "Course title",
  "subtitle": "Brief subtitle",
  "description": "2-3 paragraph description",
  "ceuHours": ${ceHours},
  "ceuCategories": [{"category": "${catName}", "hours": ${ceHours}}],
  "instructor": "GA Integrated Therapeutic Perspectives LLC",
  "accessTier": "professional",
  "status": "draft",
  ${generateObjectives ? '"objectives": ["Objective 1", "Objective 2", "Objective 3"],' : ''}
  "modules": [
    {
      "title": "Module Title",
      "description": "Module description",
      "order": 1,
      "lessons": [
        {
          "title": "Lesson Title",
          "type": "text",
          "content": "<h2>Title</h2><p>Full HTML content (500+ words per lesson)</p>",
          "duration": 15,
          "order": 1
        }${generateQuizzes ? `,
        {
          "title": "Quiz",
          "type": "quiz",
          "duration": 10,
          "order": 2,
          "questions": [
            {"question": "Question?", "type": "multiple_choice", "options": ["A","B","C","D"], "correctAnswer": 0, "explanation": "Why", "points": 1}
          ],
          "shuffleQuestions": true,
          "showExplanations": true
        }` : ''}
      ]
    }
  ],
  "settings": {"linearProgression": true, "enforceMinTime": true, "minTimePercent": 80, "passingScore": 70, "requireEvaluation": true, "requireAttestation": true, "certificateEnabled": true},
  "approvingBody": "NBCC",
  "approvalNumber": "7760"
}

Create enough modules/lessons to justify ${ceHours} CE hours. Each text lesson needs substantial content. Include quizzes at end of each module if requested.
Return ONLY JSON, no markdown.`;

    let messages = [];
    if (fileData) {
      let mediaType = fileType || 'application/pdf';
      messages = [{ role: 'user', content: [{ type: 'document', source: { type: 'base64', media_type: mediaType, data: fileData } }, { type: 'text', text: prompt }] }];
    } else {
      messages = [{ role: 'user', content: `Content:\n${content}\n\n${prompt}` }];
    }
    
    const response = await anthropic.messages.create({ model: 'claude-sonnet-4-20250514', max_tokens: 16000, messages });
    const responseText = response.content[0].text;
    
    let course;
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) course = JSON.parse(jsonMatch[0]);
      else throw new Error('No JSON found');
    } catch (e) {
      console.error('Parse error:', e);
      return res.status(500).json({ error: 'Failed to parse AI response' });
    }
    
    // Validate structure
    if (!course.title) course.title = 'Untitled Course';
    if (!course.modules) course.modules = [];
    course.modules = course.modules.map((m, mi) => {
      m.order = mi + 1;
      m.lessons = (m.lessons || []).map((l, li) => {
        l.order = li + 1;
        if (!l.type) l.type = 'text';
        if (!l.duration) l.duration = 10;
        if (l.type === 'quiz' && l.questions) {
          l.questions = l.questions.map(q => {
            if (!q.type) q.type = 'multiple_choice';
            if (!q.points) q.points = 1;
            return q;
          });
        }
        return l;
      });
      return m;
    });
    
    res.json({ success: true, course });
  } catch (error) {
    console.error('Course generation error:', error);
    res.status(500).json({ error: 'Failed to generate course: ' + error.message });
  }
});

export default router;

  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Course Admin - CounselorReady</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            burgundy: {
              50: '#fdf5f6', 100: '#fae8eb', 200: '#f5d0d6', 300: '#eba9b5',
              400: '#dd768a', 500: '#c94d65', 600: '#a83350', 700: '#8b2542',
              800: '#6b1d34', 900: '#4a1524', 950: '#2d0a14'
            },
            forest: {
              50: '#f3f6f4', 100: '#e3ebe5', 200: '#c8d7cc', 300: '#a1bba8',
              400: '#759a7f', 500: '#547c5f', 600: '#40634a', 700: '#34503d',
              800: '#2b4133', 900: '#1f3025', 950: '#121c16'
            },
            gold: { 50: '#fefce8', 100: '#fef9c3', 200: '#fef08a', 300: '#fde047', 400: '#facc15', 500: '#d4a012' }
          }
        }
      }
    }
  </script>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Lato:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Lato', system-ui, sans-serif; }
    .font-display { font-family: 'Cormorant Garamond', Georgia, serif; }
    .admin-nav-link { @apply flex items-center gap-3 px-4 py-2.5 rounded-lg text-forest-600 hover:bg-forest-50 hover:text-burgundy-700 transition-colors; }
    .admin-nav-link.active { @apply bg-burgundy-50 text-burgundy-800 font-medium; }
  </style>
</head>
<body class="bg-stone-50 min-h-screen">
  
  <!-- Admin Header -->
  <header class="bg-burgundy-900 text-white sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
      <div class="flex items-center gap-4">
        <div class="w-9 h-9 bg-forest-700 rounded-lg flex items-center justify-center">
          <span class="text-gold-400 font-display font-bold">CR</span>
        </div>
        <div>
          <span class="font-display font-semibold text-lg text-burgundy-800">CounselorReady</span>
          <span class="ml-2 text-xs bg-gold-500 text-burgundy-900 px-2 py-0.5 rounded-full font-semibold">ADMIN</span>
        </div>
      </div>
      <div class="flex items-center gap-4">
        <span class="text-burgundy-200 text-sm" id="adminEmail">Admin</span>
        <a href="/dashboard.html" class="text-burgundy-200 hover:text-white text-sm flex items-center gap-1">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
          Exit Admin
        </a>
      </div>
    </div>
  </header>

  <div class="flex">
    <!-- Sidebar -->
    <aside class="w-64 bg-white border-r border-burgundy-100 min-h-[calc(100vh-52px)] sticky top-[52px] p-4">
      <nav class="space-y-1">
        <a href="/admin-courses.html" class="admin-nav-link active">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
          Courses
        </a>
        <a href="/admin-users.html" class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-forest-600 hover:bg-forest-50 hover:text-burgundy-700 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/></svg>
          Users
        </a>
        <a href="/admin-migration.html" class="admin-nav-link">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
          Migration
        </a>
        <a href="/admin-messages.html" class="admin-nav-link">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
          Messages
        </a>
        <a href="/admin-hardship.html" class="admin-nav-link">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
          Hardship Requests
        </a>
        <a href="/admin-analytics.html" class="admin-nav-link">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
          Analytics
        </a>
        <a href="/admin-integrations.html" class="admin-nav-link">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"/></svg>
          Integrations
        </a>
      <a href="/admin-help.html" class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-burgundy-200 hover:bg-burgundy-700 hover:text-white transition-colors">
          <i class="fas fa-question-circle w-5"></i>
          Help Center
        </a>
      </nav>
      
      <div class="mt-8 pt-4 border-t border-forest-100">
        <p class="text-xs text-forest-400 px-4">Quick Links</p>
        <div class="mt-2 space-y-1">
          <a href="/audit.html" class="admin-nav-link text-sm">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
            Audit Reports
          </a>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 p-8">
    
    <!-- Course List View -->
    <div id="courseListView">
      <div class="flex justify-between items-center mb-6">
        <h1 class="font-display text-3xl font-semibold text-burgundy-900">Manage Courses</h1>
        <div class="flex gap-2">
          <a href="/admin-users.html" class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-forest-600 hover:bg-forest-50 hover:text-burgundy-700 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/></svg>
          Users
        </a>
        <a href="/admin-migration.html" class="bg-gold-100 hover:bg-gold-200 text-gold-800 font-medium px-4 py-2 rounded-xl flex items-center gap-1">
            🔄 Migration
          </a>
          <button onclick="showScormImport()" class="bg-forest-100 hover:bg-forest-200 text-forest-800 font-medium px-4 py-2 rounded-xl">
            📦 Import SCORM
          </button>
          <button onclick="showAICourseBuilder()" class="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold px-4 py-2 rounded-xl flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            Create with AI
          </button>
          <button onclick="showNewCourseForm()" class="bg-burgundy-800 hover:bg-burgundy-900 text-white font-semibold px-4 py-2 rounded-xl">
            + New Course
          </button>
        </div>
      </div>
      
      <!-- SCORM Import Modal -->
      <div id="scormImportModal" class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="font-display text-2xl font-semibold text-burgundy-900">Import SCORM Package</h3>
            <button onclick="closeScormImport()" class="text-forest-500 hover:text-burgundy-700 text-2xl">&times;</button>
          </div>
          <div class="mb-4">
            <p class="text-forest-600 mb-4">Upload a SCORM 1.2 or 2004 package (.zip file)</p>
            <input type="file" id="scormFile" accept=".zip" class="w-full px-4 py-2 border border-forest-200 rounded-lg">
          </div>
          <div id="scormImportStatus" class="mb-4 hidden">
            <div class="flex items-center gap-2 text-forest-600">
              <div class="w-5 h-5 border-2 border-forest-300 border-t-forest-700 rounded-full animate-spin"></div>
              <span>Importing...</span>
            </div>
          </div>
          <div class="flex justify-end gap-4">
            <button onclick="closeScormImport()" class="px-6 py-2 text-hunter-600 hover:text-hunter-700">Cancel</button>
            <button onclick="importScorm()" class="bg-burgundy-800 hover:bg-burgundy-900 text-white font-semibold px-6 py-2 rounded-lg">Import</button>
          </div>
        </div>
      </div>
      
      <!-- AI Course Builder Modal -->
      <div id="aiCourseBuilderModal" class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
          
          <!-- Header -->
          <div class="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white">
            <div class="flex justify-between items-center">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                  <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                  </svg>
                </div>
                <div>
                  <h2 class="text-2xl font-bold">AI Course Builder</h2>
                  <p class="text-purple-200 text-sm">Upload your content, Claude builds the course</p>
                </div>
              </div>
              <button onclick="closeAICourseBuilder()" class="text-white hover:text-purple-200 text-3xl leading-none">&times;</button>
            </div>
          </div>
          
          <!-- Step Indicator -->
          <div class="bg-purple-50 px-6 py-3 border-b border-purple-100">
            <div class="flex items-center justify-center gap-4">
              <div id="step1Indicator" class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-sm">1</div>
                <span class="text-sm font-medium text-purple-900">Upload</span>
              </div>
              <div class="w-8 h-0.5 bg-purple-200"></div>
              <div id="step2Indicator" class="flex items-center gap-2 opacity-50">
                <div class="w-8 h-8 rounded-full bg-purple-200 text-purple-600 flex items-center justify-center font-bold text-sm">2</div>
                <span class="text-sm font-medium text-purple-400">Review</span>
              </div>
              <div class="w-8 h-0.5 bg-purple-200"></div>
              <div id="step3Indicator" class="flex items-center gap-2 opacity-50">
                <div class="w-8 h-8 rounded-full bg-purple-200 text-purple-600 flex items-center justify-center font-bold text-sm">3</div>
                <span class="text-sm font-medium text-purple-400">Save</span>
              </div>
            </div>
          </div>
          
          <!-- Content Area -->
          <div class="flex-1 overflow-y-auto p-6">
            
            <!-- Step 1: Upload Content -->
            <div id="aiBuilderStep1" class="space-y-5">
              
              <!-- File Upload -->
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Upload Your Course Material</label>
                <div id="aiFileDropZone" 
                     class="border-2 border-dashed border-purple-300 rounded-xl p-6 text-center hover:border-purple-500 hover:bg-purple-50 transition cursor-pointer"
                     onclick="document.getElementById('aiCourseFileInput').click()"
                     ondrop="handleAICourseFileDrop(event)" 
                     ondragover="event.preventDefault(); this.classList.add('border-purple-500', 'bg-purple-50')"
                     ondragleave="this.classList.remove('border-purple-500', 'bg-purple-50')">
                  <input type="file" id="aiCourseFileInput" accept=".pdf,.doc,.docx,.txt" class="hidden" onchange="handleAICourseFileSelect(event)">
                  <svg class="w-10 h-10 text-purple-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                  </svg>
                  <p class="font-medium text-gray-700">Drop your file here or click to browse</p>
                  <p class="text-sm text-gray-500 mt-1">PDF, Word, or text files</p>
                </div>
                <p id="aiSelectedFileName" class="text-sm text-purple-600 mt-2 hidden"></p>
              </div>
              
              <!-- OR Divider -->
              <div class="flex items-center gap-4">
                <div class="flex-1 h-px bg-gray-200"></div>
                <span class="text-sm text-gray-500">OR</span>
                <div class="flex-1 h-px bg-gray-200"></div>
              </div>
              
              <!-- Paste Content -->
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Paste Your Content / Outline</label>
                <textarea id="aiCourseContentInput" rows="5" 
                          placeholder="Paste your course content, outline, or notes here..."
                          class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"></textarea>
              </div>
              
              <!-- Key Points -->
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">
                  Key Points to Emphasize <span class="font-normal text-gray-400">(optional)</span>
                </label>
                <textarea id="aiKeyPointsInput" rows="2" 
                          placeholder="Specific points or concepts you want emphasized..."
                          class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"></textarea>
              </div>
              
              <!-- Settings -->
              <div class="bg-gray-50 rounded-xl p-4 space-y-4">
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm text-gray-600 mb-1">CE Category</label>
                    <select id="aiCourseCategory" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                      <option value="core">Core / General</option>
                      <option value="ethics">Ethics</option>
                      <option value="supervision">Supervision</option>
                      <option value="telehealth">Telehealth</option>
                      <option value="cultural">Cultural Diversity</option>
                      <option value="trauma">Trauma</option>
                      <option value="substance">Substance Abuse</option>
                      <option value="crisis">Crisis / Suicide</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm text-gray-600 mb-1">Target CE Hours</label>
                    <input type="number" id="aiCourseCEHours" value="3" min="0.5" max="40" step="0.5"
                           class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                  </div>
                </div>
                <div class="flex flex-wrap gap-4">
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" id="aiGenerateQuizzes" checked class="w-4 h-4 text-purple-600 rounded">
                    <span class="text-sm text-gray-700">Generate quizzes</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" id="aiGenerateObjectives" checked class="w-4 h-4 text-purple-600 rounded">
                    <span class="text-sm text-gray-700">Generate learning objectives</span>
                  </label>
                </div>
              </div>
            </div>
            
            <!-- Step 2: Review -->
            <div id="aiBuilderStep2" class="hidden space-y-5">
              <div class="bg-white border border-gray-200 rounded-xl p-4">
                <h3 class="font-semibold text-gray-800 mb-3">Course Overview</h3>
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="block text-xs text-gray-500 mb-1">Title</label>
                    <input type="text" id="aiGenTitle" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                  </div>
                  <div>
                    <label class="block text-xs text-gray-500 mb-1">CE Hours</label>
                    <input type="number" id="aiGenCEHours" step="0.5" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                  </div>
                </div>
                <div class="mt-3">
                  <label class="block text-xs text-gray-500 mb-1">Description</label>
                  <textarea id="aiGenDescription" rows="2" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"></textarea>
                </div>
                <div class="mt-3">
                  <label class="block text-xs text-gray-500 mb-1">Learning Objectives</label>
                  <div id="aiGenObjectives" class="space-y-1"></div>
                </div>
              </div>
              
              <div class="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div class="bg-gray-50 px-4 py-2 border-b border-gray-200">
                  <h3 class="font-semibold text-gray-800 text-sm">Course Structure</h3>
                </div>
                <div id="aiGenModules" class="divide-y divide-gray-100 max-h-[250px] overflow-y-auto"></div>
              </div>
              
              <div id="aiGenQuizSection" class="hidden bg-white border border-purple-200 rounded-xl overflow-hidden">
                <div class="bg-purple-50 px-4 py-2 border-b border-purple-100 flex justify-between items-center">
                  <h3 class="font-semibold text-purple-800 text-sm">Generated Quizzes</h3>
                  <span id="aiGenQuizCount" class="text-xs text-purple-600">0 questions</span>
                </div>
                <div id="aiGenQuizzes" class="p-3 max-h-[200px] overflow-y-auto text-sm"></div>
              </div>
            </div>
            
            <!-- Step 3: Saving -->
            <div id="aiBuilderStep3" class="hidden text-center py-12">
              <div class="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
              <h3 class="text-xl font-semibold text-gray-800 mb-2">Creating Your Course...</h3>
              <p class="text-gray-500">This may take a moment</p>
            </div>
            
            <!-- Generating State -->
            <div id="aiGeneratingState" class="hidden text-center py-12">
              <div class="w-20 h-20 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-6"></div>
              <h3 class="text-xl font-semibold text-gray-800 mb-2">Claude is building your course...</h3>
              <p class="text-gray-500 mb-4">Analyzing content and generating structure</p>
              <div id="aiGenerationStatus" class="text-sm text-purple-600">Extracting content...</div>
            </div>
          </div>
          
          <!-- Footer -->
          <div class="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-between items-center">
            <button id="aiBuilderBackBtn" onclick="aiBuilderBack()" class="hidden px-4 py-2 text-gray-600 hover:text-gray-800 flex items-center gap-1">
              ← Back
            </button>
            <div class="flex-1"></div>
            <div class="flex gap-3">
              <button id="aiRegenerateBtn" onclick="confirmRegenerate()" class="hidden px-4 py-2 text-purple-600 hover:text-purple-800 border border-purple-300 hover:border-purple-400 rounded-xl flex items-center gap-1">
                🔄 Regenerate
              </button>
              <button onclick="closeAICourseBuilder()" class="px-5 py-2 text-gray-600 hover:text-gray-800">Cancel</button>
              <button id="aiBuilderNextBtn" onclick="aiBuilderNext()" class="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-5 py-2 rounded-xl flex items-center gap-2">
                Generate Course ⚡
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Regenerate Confirmation Modal -->
      <div id="regenerateConfirmModal" class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
        <div class="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
          <div class="text-center mb-4">
            <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span class="text-2xl">🔄</span>
            </div>
            <h3 class="text-xl font-semibold text-gray-800">Regenerate Course?</h3>
          </div>
          <p class="text-gray-600 text-center mb-4">
            Each regeneration uses AI credits. You can also manually edit the generated content above instead.
          </p>
          <div id="dontShowAgainContainer" class="hidden mb-4">
            <label class="flex items-center justify-center gap-2 cursor-pointer text-sm text-gray-500">
              <input type="checkbox" id="dontShowAgainCheckbox" class="w-4 h-4 text-purple-600 rounded">
              <span>Don't show this warning again</span>
            </label>
          </div>
          <div class="flex gap-3 justify-center">
            <button onclick="closeRegenerateModal()" class="px-5 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-xl">
              Cancel
            </button>
            <button onclick="executeRegenerate()" class="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-5 py-2 rounded-xl">
              Regenerate Anyway
            </button>
          </div>
        </div>
      </div>
      
      <div id="courseList" class="space-y-4">
        <div class="text-center py-12">
          <div class="inline-block w-8 h-8 border-4 border-burgundy-200 border-t-burgundy-700 rounded-full animate-spin"></div>
          <p class="text-forest-500 mt-4">Loading courses...</p>
        </div>
      </div>
    </div>

    <!-- Course Editor View -->
    <div id="courseEditorView" class="hidden">
      <div class="flex justify-between items-center mb-6">
        <h1 class="font-display text-3xl font-semibold text-burgundy-900">
          <span id="editorTitle">Edit Course</span>
        </h1>
        <div class="flex gap-4">
          <button onclick="exportScorm()" class="bg-forest-100 hover:bg-forest-200 text-forest-800 font-medium px-4 py-2 rounded-lg">
            📦 Export SCORM
          </button>
          <button onclick="backToList()" class="text-hunter-600 hover:text-hunter-700">← Back to Courses</button>
        </div>
      </div>
      
      <!-- Course Details -->
      <div class="bg-white rounded-xl border border-burgundy-100 shadow-sm p-6 mb-6">
        <h2 class="font-semibold text-burgundy-900 mb-4">Course Details</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-forest-700 mb-1">Title</label>
            <input type="text" id="courseTitle" class="w-full px-4 py-2 border border-forest-200 rounded-lg focus:ring-2 focus:ring-burgundy-500 outline-none">
          </div>
          <div>
            <label class="block text-sm font-medium text-forest-700 mb-1">Slug (URL)</label>
            <input type="text" id="courseSlug" class="w-full px-4 py-2 border border-forest-200 rounded-lg focus:ring-2 focus:ring-burgundy-500 outline-none">
          </div>
          <div>
            <label class="block text-sm font-medium text-forest-700 mb-1">Subtitle</label>
            <input type="text" id="courseSubtitle" class="w-full px-4 py-2 border border-forest-200 rounded-lg focus:ring-2 focus:ring-burgundy-500 outline-none">
          </div>
          <div>
            <label class="block text-sm font-medium text-forest-700 mb-1">Instructor</label>
            <input type="text" id="courseInstructor" class="w-full px-4 py-2 border border-forest-200 rounded-lg focus:ring-2 focus:ring-burgundy-500 outline-none" value="GA Integrated Therapeutic Perspectives LLC">
          </div>
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-forest-700 mb-1">Description</label>
            <textarea id="courseDescription" rows="3" class="w-full px-4 py-2 border border-forest-200 rounded-lg focus:ring-2 focus:ring-burgundy-500 outline-none"></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-forest-700 mb-1">CE Hours</label>
            <input type="number" id="courseCeuHours" class="w-full px-4 py-2 border border-forest-200 rounded-lg focus:ring-2 focus:ring-burgundy-500 outline-none">
          </div>
          <div>
            <label class="block text-sm font-medium text-forest-700 mb-1">CE Category</label>
            <select id="courseCeuCategory" class="w-full px-4 py-2 border border-forest-200 rounded-lg focus:ring-2 focus:ring-burgundy-500 outline-none">
              <option value="ethics">Ethics</option>
              <option value="core">Core</option>
              <option value="related">Related</option>
              <option value="supervision">Supervision</option>
              <option value="telehealth">Telehealth</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-forest-700 mb-1">Access Tier</label>
            <select id="courseAccessTier" class="w-full px-4 py-2 border border-forest-200 rounded-lg focus:ring-2 focus:ring-burgundy-500 outline-none">
              <option value="free">Free (All Users)</option>
              <option value="professional">Professional ($19/mo) - Up to 6 hrs</option>
              <option value="vip">VIP ($49/mo) - 7+ hrs / Specialty</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-forest-700 mb-1">Status</label>
            <select id="courseStatus" class="w-full px-4 py-2 border border-forest-200 rounded-lg focus:ring-2 focus:ring-burgundy-500 outline-none">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          
          <!-- Course Thumbnail -->
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-forest-700 mb-1">Course Thumbnail</label>
            <div class="flex items-start gap-4">
              <div id="thumbnailPreview" class="w-48 h-32 bg-forest-100 rounded-lg flex items-center justify-center overflow-hidden border-2 border-dashed border-forest-300">
                <span class="text-forest-400 text-sm">No image</span>
              </div>
              <div class="flex-1">
                <input type="file" id="courseThumbnail" accept="image/*" onchange="previewThumbnail(event)" class="w-full px-4 py-2 border border-forest-200 rounded-lg focus:ring-2 focus:ring-burgundy-500 outline-none">
                <p class="text-xs text-forest-500 mt-1">Upload JPG, PNG, or WebP. Recommended: 800x450px</p>
                <div class="mt-2 flex gap-2">
                  <button type="button" onclick="uploadThumbnail()" class="bg-burgundy-100 hover:bg-burgundy-200 text-burgundy-800 font-medium px-4 py-1.5 rounded-lg text-sm">
                    📤 Upload Image
                  </button>
                  <button type="button" onclick="removeThumbnail()" class="bg-red-100 hover:bg-red-200 text-red-700 font-medium px-4 py-1.5 rounded-lg text-sm">
                    🗑️ Remove
                  </button>
                </div>
                <div id="uploadStatus" class="mt-2 text-sm hidden"></div>
              </div>
            </div>
            <input type="hidden" id="courseThumbnailUrl">
          </div>
        </div>
        <div class="mt-4">
          <button onclick="saveCourseDetails()" class="bg-forest-700 hover:bg-forest-800 text-white font-semibold px-6 py-2 rounded-lg">
            Save Course Details
          </button>
        </div>
      </div>

      <!-- Course Settings -->
      <div class="bg-white rounded-xl border border-burgundy-100 shadow-sm p-6 mb-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="font-semibold text-burgundy-900">Course Settings</h2>
          <button type="button" onclick="toggleSettingsPanel()" class="text-sm text-forest-600 hover:text-burgundy-700">
            <span id="settingsToggleText">▼ Expand</span>
          </button>
        </div>
        
        <div id="settingsPanel" class="hidden">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            <!-- Progression Settings -->
            <div class="bg-forest-50 rounded-lg p-4">
              <h3 class="text-sm font-semibold text-forest-800 uppercase tracking-wide mb-4">📚 Progression</h3>
              
              <div class="space-y-3">
                <label class="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" id="settingLinearProgression" class="w-5 h-5 mt-0.5 text-burgundy-600 rounded">
                  <div>
                    <span class="font-medium text-forest-800">Linear Progression</span>
                    <p class="text-xs text-forest-500">Must complete lessons in order</p>
                  </div>
                </label>
                
                <label class="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" id="settingEnforceMinTime" onchange="toggleMinTimeSettings()" class="w-5 h-5 mt-0.5 text-burgundy-600 rounded">
                  <div>
                    <span class="font-medium text-forest-800">Enforce Minimum Time</span>
                    <p class="text-xs text-forest-500">Prevent speed-clicking</p>
                  </div>
                </label>
                
                <div id="minTimeSettings" class="ml-8 hidden">
                  <label class="text-sm text-forest-700">Required % of duration</label>
                  <div class="flex items-center gap-2 mt-1">
                    <input type="number" id="settingMinTimePercent" value="80" min="50" max="100" class="w-20 px-2 py-1 border border-forest-200 rounded text-sm">
                    <span class="text-sm text-forest-500">%</span>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Quiz/Test Settings -->
            <div class="bg-burgundy-50 rounded-lg p-4">
              <h3 class="text-sm font-semibold text-burgundy-800 uppercase tracking-wide mb-4">📝 Quiz Settings</h3>
              
              <div class="space-y-3">
                <div>
                  <label class="text-sm font-medium text-forest-700">Passing Score</label>
                  <div class="flex items-center gap-2 mt-1">
                    <input type="number" id="settingPassingScore" value="70" min="0" max="100" class="w-20 px-2 py-1 border border-forest-200 rounded text-sm">
                    <span class="text-sm text-forest-500">%</span>
                  </div>
                </div>
                
                <div>
                  <label class="text-sm font-medium text-forest-700">Retake Policy</label>
                  <select id="settingRetakePolicy" onchange="toggleRetakeSettings()" class="w-full mt-1 px-3 py-1.5 border border-forest-200 rounded text-sm">
                    <option value="unlimited">Unlimited Retakes</option>
                    <option value="limited">Limited Retakes</option>
                    <option value="first_final">First Score is Final</option>
                  </select>
                </div>
                
                <div id="retakeLimitSettings" class="hidden">
                  <label class="text-sm text-forest-700">Max Attempts</label>
                  <input type="number" id="settingMaxRetakes" value="3" min="1" max="10" class="w-20 px-2 py-1 border border-forest-200 rounded text-sm mt-1">
                </div>
                
                <div id="retakeCooldownSettings" class="hidden">
                  <label class="text-sm text-forest-700">Cooldown Between Retakes</label>
                  <div class="flex items-center gap-2 mt-1">
                    <input type="number" id="settingRetakeCooldown" value="0" min="0" class="w-20 px-2 py-1 border border-forest-200 rounded text-sm">
                    <span class="text-sm text-forest-500">hours</span>
                  </div>
                </div>
                
                <div>
                  <label class="text-sm font-medium text-forest-700">Score Policy</label>
                  <select id="settingScorePolicy" class="w-full mt-1 px-3 py-1.5 border border-forest-200 rounded text-sm">
                    <option value="highest">Use Highest Score</option>
                    <option value="latest">Use Latest Score</option>
                    <option value="first">Use First Score</option>
                    <option value="average">Use Average Score</option>
                  </select>
                  <p class="text-xs text-forest-500 mt-1">Which score counts for certificate</p>
                </div>
              </div>
            </div>
            
            <!-- Drip Content Settings -->
            <div class="bg-gold-50 rounded-lg p-4">
              <h3 class="text-sm font-semibold text-gold-800 uppercase tracking-wide mb-4">📅 Drip Content</h3>
              
              <div class="space-y-3">
                <label class="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" id="settingDripEnabled" onchange="toggleDripSettings()" class="w-5 h-5 mt-0.5 text-burgundy-600 rounded">
                  <div>
                    <span class="font-medium text-forest-800">Enable Drip Schedule</span>
                    <p class="text-xs text-forest-500">Release modules over time</p>
                  </div>
                </label>
                
                <div id="dripScheduleSettings" class="hidden space-y-2">
                  <p class="text-xs text-forest-600">Set days after enrollment for each module:</p>
                  <div id="dripScheduleContainer">
                    <!-- Populated when course loads -->
                    <p class="text-xs text-forest-400 italic">Save course with modules first</p>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Narration Settings -->
            <div class="bg-purple-50 rounded-lg p-4">
              <h3 class="text-sm font-semibold text-purple-800 uppercase tracking-wide mb-4">🎙️ Narration</h3>
              
              <div class="space-y-3">
                <label class="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" id="settingNarrationEnabled" onchange="toggleNarrationSettings()" class="w-5 h-5 mt-0.5 text-burgundy-600 rounded">
                  <div>
                    <span class="font-medium text-forest-800">Enable Narration</span>
                    <p class="text-xs text-forest-500">AI reads lesson content aloud</p>
                  </div>
                </label>
                
                <div id="narrationSettings" class="hidden space-y-3">
                  <div>
                    <label class="text-sm font-medium text-forest-700">Voice</label>
                    <select id="settingNarrationVoice" class="w-full mt-1 px-3 py-1.5 border border-forest-200 rounded text-sm">
                      <option value="browser">Browser Default (Free)</option>
                      <optgroup label="OpenAI Voices (Requires API Key)">
                        <option value="nova">Nova (Female, warm)</option>
                        <option value="alloy">Alloy (Neutral)</option>
                        <option value="echo">Echo (Male)</option>
                        <option value="fable">Fable (British)</option>
                        <option value="onyx">Onyx (Male, deep)</option>
                        <option value="shimmer">Shimmer (Female, bright)</option>
                      </optgroup>
                    </select>
                  </div>
                  
                  <div>
                    <label class="text-sm font-medium text-forest-700">Speed</label>
                    <div class="flex items-center gap-2 mt-1">
                      <input type="range" id="settingNarrationSpeed" min="0.5" max="2" step="0.1" value="1" class="flex-1">
                      <span id="speedDisplay" class="text-sm text-forest-600 w-12">1.0x</span>
                    </div>
                  </div>
                  
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" id="settingAutoPlayNarration" class="w-4 h-4 text-burgundy-600 rounded">
                    <span class="text-sm text-forest-700">Auto-play when lesson loads</span>
                  </label>
                </div>
              </div>
            </div>
            
            <!-- CE Compliance Settings -->
            <div class="bg-blue-50 rounded-lg p-4">
              <h3 class="text-sm font-semibold text-blue-800 uppercase tracking-wide mb-4">🎓 CE Compliance</h3>
              
              <div class="space-y-3">
                <label class="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" id="settingRequireEvaluation" checked class="w-5 h-5 mt-0.5 text-burgundy-600 rounded">
                  <div>
                    <span class="font-medium text-forest-800">Require Evaluation</span>
                    <p class="text-xs text-forest-500">Course survey before certificate</p>
                  </div>
                </label>
                
                <label class="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" id="settingRequireAttestation" checked class="w-5 h-5 mt-0.5 text-burgundy-600 rounded">
                  <div>
                    <span class="font-medium text-forest-800">Require Attestation</span>
                    <p class="text-xs text-forest-500">Learner confirms completion</p>
                  </div>
                </label>
                
                <label class="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" id="settingCertificateEnabled" checked class="w-5 h-5 mt-0.5 text-burgundy-600 rounded">
                  <div>
                    <span class="font-medium text-forest-800">Generate Certificate</span>
                    <p class="text-xs text-forest-500">Issue CE certificate on completion</p>
                  </div>
                </label>
              </div>
            </div>
            
            <!-- Approving Body -->
            <div class="bg-stone-100 rounded-lg p-4">
              <h3 class="text-sm font-semibold text-stone-700 uppercase tracking-wide mb-4">🏛️ Approval</h3>
              
              <div class="space-y-3">
                <div>
                  <label class="text-sm font-medium text-forest-700">Approving Body</label>
                  <select id="settingApprovingBody" class="w-full mt-1 px-3 py-1.5 border border-forest-200 rounded text-sm">
                    <option value="NBCC">NBCC</option>
                    <option value="ACA">ACA</option>
                    <option value="NASW">NASW</option>
                    <option value="APA">APA</option>
                    <option value="ASWB">ASWB</option>
                    <option value="AAMFT">AAMFT</option>
                    <option value="State Board">State Board</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label class="text-sm font-medium text-forest-700">Approval Number</label>
                  <input type="text" id="settingApprovalNumber" placeholder="ACEP #7760" class="w-full mt-1 px-3 py-1.5 border border-forest-200 rounded text-sm">
                </div>
              </div>
            </div>
            
          </div>
          
          <div class="mt-4 pt-4 border-t border-forest-200">
            <button onclick="saveCourseSettings()" class="bg-burgundy-700 hover:bg-burgundy-800 text-white font-semibold px-6 py-2 rounded-lg">
              💾 Save All Settings
            </button>
          </div>
        </div>
      </div>

      <!-- Modules & Lessons -->
      <div class="bg-white rounded-xl border border-burgundy-100 shadow-sm p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="font-semibold text-burgundy-900">Modules & Lessons</h2>
          <button onclick="addModule()" class="bg-burgundy-100 hover:bg-burgundy-200 text-burgundy-800 font-medium px-4 py-2 rounded-lg text-sm">
            + Add Module
          </button>
        </div>
        
        <div id="modulesContainer" class="space-y-4">
          <!-- Modules loaded here -->
        </div>
      </div>
    </div>

    <!-- Lesson Editor Modal -->
    <div id="lessonModal" class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-hunter-100">
          <div class="flex justify-between items-center">
            <h3 class="font-display text-2xl font-semibold text-burgundy-900">Edit Lesson</h3>
            <button onclick="closeLessonModal()" class="text-forest-500 hover:text-burgundy-700 text-2xl">&times;</button>
          </div>
        </div>
        <div class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-forest-700 mb-1">Lesson Title</label>
            <input type="text" id="lessonTitle" class="w-full px-4 py-2 border border-forest-200 rounded-lg focus:ring-2 focus:ring-burgundy-500 outline-none">
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-forest-700 mb-1">Type</label>
              <select id="lessonType" onchange="toggleContentType()" class="w-full px-4 py-2 border border-forest-200 rounded-lg focus:ring-2 focus:ring-burgundy-500 outline-none">
                <option value="text">Text</option>
                <option value="video">Video</option>
                <option value="quiz">Quiz</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-forest-700 mb-1">Duration (minutes)</label>
              <input type="number" id="lessonDuration" class="w-full px-4 py-2 border border-forest-200 rounded-lg focus:ring-2 focus:ring-burgundy-500 outline-none">
            </div>
          </div>
          <div>
            <label class="flex items-center gap-2">
              <input type="checkbox" id="lessonIsFree" class="w-4 h-4 text-burgundy-600 rounded">
              <span class="text-sm text-forest-700">Free Preview (visible to non-enrolled users)</span>
            </label>
          </div>
          <div id="textContentArea">
            <label class="block text-sm font-medium text-forest-700 mb-1">Content (HTML supported)</label>
            <textarea id="lessonContent" rows="15" class="w-full px-4 py-2 border border-forest-200 rounded-lg focus:ring-2 focus:ring-burgundy-500 outline-none font-mono text-sm"></textarea>
            <p class="text-xs text-forest-500 mt-1">Use HTML tags: &lt;h2&gt;, &lt;h3&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;strong&gt;</p>
          </div>
          <div id="videoContentArea" class="hidden">
            <label class="block text-sm font-medium text-forest-700 mb-1">Video URL (YouTube or Vimeo)</label>
            <input type="text" id="lessonVideoUrl" placeholder="https://youtube.com/watch?v=..." class="w-full px-4 py-2 border border-forest-200 rounded-lg focus:ring-2 focus:ring-burgundy-500 outline-none">
          </div>
          
          <!-- Quiz Builder Area -->
          <div id="quizContentArea" class="hidden space-y-4">
            
            <!-- AI Import Panel -->
            <div class="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-4 border border-purple-200">
              <div class="flex items-center gap-2 mb-3">
                <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
                <h4 class="font-semibold text-purple-900">AI Quiz Generator</h4>
                <span class="text-xs bg-purple-200 text-purple-700 px-2 py-0.5 rounded-full ml-auto">Powered by Claude</span>
              </div>
              
              <!-- Tab Buttons -->
              <div class="flex gap-2 mb-3">
                <button onclick="setAIMode('pdf')" id="aiModePdf" class="ai-mode-btn px-3 py-1.5 text-sm rounded-lg bg-purple-600 text-white">
                  📄 From PDF
                </button>
                <button onclick="setAIMode('outline')" id="aiModeOutline" class="ai-mode-btn px-3 py-1.5 text-sm rounded-lg bg-white text-purple-700 border border-purple-300">
                  📝 From Outline
                </button>
                <button onclick="setAIMode('content')" id="aiModeContent" class="ai-mode-btn px-3 py-1.5 text-sm rounded-lg bg-white text-purple-700 border border-purple-300">
                  📚 From Course Content
                </button>
              </div>
              
              <!-- PDF Upload Mode -->
              <div id="aiPdfMode" class="ai-mode-content">
                <div class="border-2 border-dashed border-purple-300 rounded-lg p-4 text-center hover:border-purple-500 hover:bg-purple-50 transition cursor-pointer" 
                     onclick="document.getElementById('quizPdfUpload').click()"
                     ondrop="handleQuizPdfDrop(event)" ondragover="event.preventDefault()">
                  <input type="file" id="quizPdfUpload" accept=".pdf" class="hidden" onchange="handleQuizPdfSelect(event)">
                  <svg class="w-8 h-8 text-purple-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                  </svg>
                  <p class="text-sm text-purple-700">Drop PDF with quiz questions or click to browse</p>
                  <p class="text-xs text-purple-500 mt-1">AI will extract questions, options, and answers</p>
                </div>
                <p id="quizPdfFileName" class="text-sm text-purple-600 mt-2 hidden"></p>
              </div>
              
              <!-- Outline Mode -->
              <div id="aiOutlineMode" class="ai-mode-content hidden">
                <textarea id="quizOutlineInput" rows="4" 
                          placeholder="Paste your quiz outline or notes here...&#10;&#10;Example:&#10;- 3 questions on informed consent&#10;- 2 true/false on confidentiality exceptions&#10;- Multiple choice: HIPAA requirements"
                          class="w-full px-3 py-2 border border-purple-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"></textarea>
              </div>
              
              <!-- From Course Content Mode -->
              <div id="aiContentMode" class="ai-mode-content hidden">
                <div class="bg-white rounded-lg p-3 border border-purple-200">
                  <p class="text-sm text-purple-700 mb-2">Generate questions from this lesson's content or the entire module.</p>
                  <div class="flex gap-4">
                    <label class="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="contentScope" value="lesson" checked class="text-purple-600">
                      <span class="text-sm">This lesson only</span>
                    </label>
                    <label class="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="contentScope" value="module" class="text-purple-600">
                      <span class="text-sm">Entire module</span>
                    </label>
                  </div>
                </div>
                <div class="mt-2 flex items-center gap-2">
                  <label class="text-sm text-purple-700">Number of questions:</label>
                  <input type="number" id="aiQuestionCount" value="5" min="1" max="20" 
                         class="w-20 px-2 py-1 border border-purple-300 rounded text-sm">
                </div>
              </div>
              
              <!-- Generate Button -->
              <div class="mt-3 flex items-center gap-3">
                <button onclick="generateQuizWithAI()" id="aiGenerateBtn" 
                        class="bg-purple-600 hover:bg-purple-700 text-white font-medium px-4 py-2 rounded-lg text-sm flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                  </svg>
                  Generate Questions
                </button>
                <span id="aiGenerateStatus" class="text-sm text-purple-600 hidden">
                  <span class="inline-block w-4 h-4 border-2 border-purple-300 border-t-purple-600 rounded-full animate-spin mr-2"></span>
                  Generating...
                </span>
              </div>
            </div>
            
            <!-- Quiz Settings -->
            <div class="bg-stone-50 rounded-lg p-4 border border-stone-200">
              <h4 class="font-medium text-forest-800 mb-3">Quiz Settings</h4>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" id="quizShuffleQuestions" class="w-4 h-4 text-burgundy-600 rounded">
                  <span class="text-sm text-forest-700">Shuffle Questions</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" id="quizShuffleOptions" class="w-4 h-4 text-burgundy-600 rounded">
                  <span class="text-sm text-forest-700">Shuffle Options</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" id="quizShowExplanations" checked class="w-4 h-4 text-burgundy-600 rounded">
                  <span class="text-sm text-forest-700">Show Explanations</span>
                </label>
                <div class="flex items-center gap-2">
                  <label class="text-sm text-forest-700">Time Limit:</label>
                  <input type="number" id="quizTimeLimit" placeholder="∞" min="0" 
                         class="w-16 px-2 py-1 border border-forest-200 rounded text-sm">
                  <span class="text-xs text-forest-500">min</span>
                </div>
              </div>
            </div>
            
            <!-- Questions List -->
            <div class="border border-forest-200 rounded-lg">
              <div class="bg-forest-50 px-4 py-3 border-b border-forest-200 flex justify-between items-center">
                <h4 class="font-medium text-forest-800">Questions (<span id="questionCount">0</span>)</h4>
                <button onclick="addQuestion()" class="bg-burgundy-100 hover:bg-burgundy-200 text-burgundy-800 font-medium px-3 py-1.5 rounded-lg text-sm">
                  + Add Question
                </button>
              </div>
              
              <div id="questionsContainer" class="divide-y divide-forest-100 max-h-[400px] overflow-y-auto">
                <div class="p-6 text-center text-forest-500">
                  <p>No questions yet. Add manually or use AI to generate.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="p-6 border-t border-burgundy-100 flex justify-end gap-4">
          <button onclick="closeLessonModal()" class="px-6 py-2 text-hunter-600 hover:text-hunter-700">Cancel</button>
          <button onclick="saveLesson()" class="bg-burgundy-800 hover:bg-burgundy-900 text-white font-semibold px-6 py-2 rounded-lg">Save Lesson</button>
        </div>
      </div>
    </div>

    <!-- Question Editor Modal -->
    <div id="questionModal" class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
      <div class="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-4 border-b border-forest-100 flex justify-between items-center bg-forest-50">
          <h3 class="font-semibold text-forest-900" id="questionModalTitle">Add Question</h3>
          <button onclick="closeQuestionModal()" class="text-forest-500 hover:text-burgundy-700 text-xl">&times;</button>
        </div>
        
        <div class="p-6 space-y-4">
          <!-- Question Type -->
          <div>
            <label class="block text-sm font-medium text-forest-700 mb-1">Question Type</label>
            <select id="questionType" onchange="toggleQuestionType()" 
                    class="w-full px-3 py-2 border border-forest-200 rounded-lg focus:ring-2 focus:ring-burgundy-500">
              <option value="multiple_choice">Multiple Choice (single answer)</option>
              <option value="multiple_select">Multiple Select (multiple answers)</option>
              <option value="true_false">True / False</option>
            </select>
          </div>
          
          <!-- Question Text -->
          <div>
            <label class="block text-sm font-medium text-forest-700 mb-1">Question</label>
            <textarea id="questionText" rows="3" 
                      class="w-full px-3 py-2 border border-forest-200 rounded-lg focus:ring-2 focus:ring-burgundy-500"
                      placeholder="Enter your question..."></textarea>
          </div>
          
          <!-- Options (for MC/MS) -->
          <div id="optionsArea">
            <label class="block text-sm font-medium text-forest-700 mb-2">Answer Options <span class="text-xs text-forest-500">(select correct answer)</span></label>
            <div id="optionsList" class="space-y-2">
              <!-- Options rendered here -->
            </div>
            <button onclick="addOption()" class="mt-2 text-sm text-burgundy-600 hover:text-burgundy-800 flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
              Add Option
            </button>
          </div>
          
          <!-- True/False Selection -->
          <div id="trueFalseArea" class="hidden">
            <label class="block text-sm font-medium text-forest-700 mb-2">Correct Answer</label>
            <div class="flex gap-4">
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="tfAnswer" value="true" class="w-4 h-4 text-burgundy-600">
                <span class="text-forest-700">True</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="tfAnswer" value="false" class="w-4 h-4 text-burgundy-600">
                <span class="text-forest-700">False</span>
              </label>
            </div>
          </div>
          
          <!-- Explanation -->
          <div>
            <label class="block text-sm font-medium text-forest-700 mb-1">Explanation <span class="text-xs text-forest-500">(shown after answering)</span></label>
            <textarea id="questionExplanation" rows="2" 
                      class="w-full px-3 py-2 border border-forest-200 rounded-lg focus:ring-2 focus:ring-burgundy-500"
                      placeholder="Explain why this is the correct answer..."></textarea>
          </div>
          
          <!-- Points -->
          <div>
            <label class="block text-sm font-medium text-forest-700 mb-1">Points</label>
            <input type="number" id="questionPoints" value="1" min="1" 
                   class="w-24 px-3 py-2 border border-forest-200 rounded-lg focus:ring-2 focus:ring-burgundy-500">
          </div>
        </div>
        
        <div class="p-4 border-t border-forest-100 flex justify-end gap-3 bg-stone-50">
          <button onclick="closeQuestionModal()" class="px-4 py-2 text-forest-600 hover:text-forest-800">Cancel</button>
          <button onclick="saveQuestion()" class="bg-burgundy-700 hover:bg-burgundy-800 text-white font-medium px-6 py-2 rounded-lg">
            Save Question
          </button>
        </div>
      </div>
    </div>

  </main>

  <script>
    const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:5000' : 'https://api.counselorready.com';
    let courses = [];
    let currentCourse = null;
    let currentLessonEdit = null;
    
    // Quiz builder state
    let currentQuestions = [];
    let editingQuestionIndex = null;
    let currentAIMode = 'pdf';
    let currentOptions = ['', '', '', ''];
    let currentCorrectAnswer = null;

    // Load all courses
    async function loadCourses() {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in first');
        window.location.href = '/login.html';
        return;
      }

      try {
        const response = await fetch(`${API_URL}/api/admin/courses`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        courses = data.courses || [];
        renderCourseList();
      } catch (error) {
        console.error('Load courses error:', error);
        document.getElementById('courseList').innerHTML = '<p class="text-burgundy-600">Failed to load courses</p>';
      }
    }

    // Render course list
    function renderCourseList() {
      const container = document.getElementById('courseList');
      
      if (courses.length === 0) {
        container.innerHTML = '<p class="text-forest-600">No courses yet. Create your first course!</p>';
        return;
      }

      container.innerHTML = courses.map(course => `
        <div class="bg-white rounded-xl border border-burgundy-100 shadow-sm p-4 flex items-center justify-between">
          <div>
            <h3 class="font-semibold text-burgundy-900">${course.title}</h3>
            <p class="text-sm text-forest-600">
              ${course.modules?.length || 0} modules • 
              ${course.ceuHours || 0} CE hours • 
              <span class="px-2 py-0.5 rounded-full text-xs ${course.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}">${course.status}</span>
            </p>
          </div>
          <div class="flex gap-2">
            <button onclick="duplicateCourse('${course._id}')" class="bg-gold-100 hover:bg-gold-200 text-gold-800 font-medium px-3 py-2 rounded-lg text-sm" title="Duplicate">
              📋
            </button>
            <button onclick="editCourse('${course._id}')" class="bg-forest-100 hover:bg-forest-200 text-forest-800 font-medium px-4 py-2 rounded-lg text-sm">
              Edit
            </button>
            <button onclick="deleteCourse('${course._id}')" class="bg-burgundy-100 hover:bg-burgundy-200 text-burgundy-800 font-medium px-4 py-2 rounded-lg text-sm">
              Delete
            </button>
          </div>
        </div>
      `).join('');
    }

    // Edit course
    async function editCourse(courseId) {
      const token = localStorage.getItem('token');
      
      try {
        const response = await fetch(`${API_URL}/api/admin/courses/${courseId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // ✅ FIXED: Handle both response formats (data.course or data directly)
        currentCourse = data.course || data;
        
        // Verify we have a valid course object
        if (!currentCourse || !currentCourse.title) {
          console.error('Invalid course data:', data);
          throw new Error('Invalid course data received');
        }
        
        console.log('Loaded course:', currentCourse);
        
        // Populate form
        document.getElementById('courseTitle').value = currentCourse.title || '';
        document.getElementById('courseSlug').value = currentCourse.slug || '';
        document.getElementById('courseSubtitle').value = currentCourse.subtitle || '';
        document.getElementById('courseDescription').value = currentCourse.description || '';
        document.getElementById('courseInstructor').value = currentCourse.instructor || 'GA Integrated Therapeutic Perspectives LLC';
        document.getElementById('courseCeuHours').value = currentCourse.ceuHours || currentCourse.ceHours || 0;
        document.getElementById('courseCeuCategory').value = currentCourse.ceuCategories?.[0]?.category?.toLowerCase() || currentCourse.category?.toLowerCase() || 'core';
        document.getElementById('courseAccessTier').value = currentCourse.accessTier || 'free';
        document.getElementById('courseStatus').value = currentCourse.status || 'draft';
        
        // Load thumbnail if exists
        document.getElementById('courseThumbnailUrl').value = currentCourse.thumbnail || '';
        updateThumbnailPreview(currentCourse.thumbnail);
        
        document.getElementById('editorTitle').textContent = 'Edit Course';
        renderModules();
        showEditor();
      } catch (error) {
        console.error('Load course error:', error);
        alert('Failed to load course: ' + error.message);
      }
    }

    // Render modules
    function renderModules() {
      const container = document.getElementById('modulesContainer');
      
      if (!currentCourse.modules || currentCourse.modules.length === 0) {
        container.innerHTML = '<p class="text-forest-500">No modules yet. Add your first module!</p>';
        return;
      }

      container.innerHTML = currentCourse.modules.map((module, mIndex) => `
        <div class="border border-forest-200 rounded-lg overflow-hidden">
          <div class="bg-forest-50 px-4 py-3 flex items-center justify-between">
            <div>
              <span class="text-xs text-forest-500">Module ${mIndex + 1}</span>
              <h4 class="font-semibold text-forest-800">${module.title}</h4>
            </div>
            <button onclick="addLesson(${mIndex})" class="text-sm text-burgundy-700 hover:text-burgundy-900">+ Add Lesson</button>
          </div>
          <div class="divide-y divide-forest-100">
            ${module.lessons?.map((lesson, lIndex) => `
              <div class="px-4 py-3 flex items-center justify-between hover:bg-forest-50">
                <div class="flex items-center gap-3">
                  <span class="w-6 h-6 rounded-full bg-forest-200 text-forest-700 text-xs flex items-center justify-center">${lIndex + 1}</span>
                  <div>
                    <p class="font-medium text-forest-800">${lesson.title}</p>
                    <p class="text-xs text-forest-500">
                      ${lesson.type} • ${lesson.duration || 0}min
                      ${lesson.isFree ? ' • <span class="text-green-600">Free</span>' : ''}
                    </p>
                  </div>
                </div>
                <button onclick="editLesson(${mIndex}, ${lIndex})" class="text-sm text-burgundy-700 hover:text-burgundy-900">Edit</button>
              </div>
            `).join('') || '<p class="px-4 py-3 text-forest-500 text-sm">No lessons yet</p>'}
          </div>
        </div>
      `).join('');
    }

    // Save course details
    async function saveCourseDetails() {
      const token = localStorage.getItem('token');
      
      const updates = {
        title: document.getElementById('courseTitle').value,
        slug: document.getElementById('courseSlug').value,
        subtitle: document.getElementById('courseSubtitle').value,
        description: document.getElementById('courseDescription').value,
        instructor: document.getElementById('courseInstructor').value,
        ceuHours: parseInt(document.getElementById('courseCeuHours').value) || 0,
        ceuCategories: [{
          category: document.getElementById('courseCeuCategory').value,
          hours: parseInt(document.getElementById('courseCeuHours').value) || 0
        }],
        ceuEligible: parseInt(document.getElementById('courseCeuHours').value) > 0,
        accessTier: document.getElementById('courseAccessTier').value,
        status: document.getElementById('courseStatus').value,
        ceuApprovalNumber: '7760'
      };

      try {
        const response = await fetch(`${API_URL}/api/admin/courses/${currentCourse._id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updates)
        });

        if (response.ok) {
          const data = await response.json();
          currentCourse = data.course;
          alert('Course saved!');
        } else {
          alert('Failed to save course');
        }
      } catch (error) {
        console.error('Save error:', error);
        alert('Failed to save course');
      }
    }

    // Add module
    async function addModule() {
      const title = prompt('Module title:');
      if (!title) return;

      const token = localStorage.getItem('token');

      try {
        const response = await fetch(`${API_URL}/api/admin/courses/${currentCourse._id}/module`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ title })
        });

        if (response.ok) {
          const data = await response.json();
          currentCourse = data.course;
          renderModules();
        }
      } catch (error) {
        console.error('Add module error:', error);
      }
    }

    // Add lesson
    async function addLesson(moduleIndex) {
      const token = localStorage.getItem('token');

      try {
        const response = await fetch(`${API_URL}/api/admin/courses/${currentCourse._id}/module/${moduleIndex}/lesson`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ title: 'New Lesson' })
        });

        if (response.ok) {
          const data = await response.json();
          currentCourse = data.course;
          renderModules();
          // Open editor for new lesson
          const newLessonIndex = currentCourse.modules[moduleIndex].lessons.length - 1;
          editLesson(moduleIndex, newLessonIndex);
        }
      } catch (error) {
        console.error('Add lesson error:', error);
      }
    }

    // Edit lesson
    function editLesson(moduleIndex, lessonIndex) {
      const lesson = currentCourse.modules[moduleIndex].lessons[lessonIndex];
      currentLessonEdit = { moduleIndex, lessonIndex };

      document.getElementById('lessonTitle').value = lesson.title || '';
      document.getElementById('lessonType').value = lesson.type || 'text';
      document.getElementById('lessonDuration').value = lesson.duration || 10;
      document.getElementById('lessonIsFree').checked = lesson.isFree || false;
      document.getElementById('lessonContent').value = lesson.content || '';
      document.getElementById('lessonVideoUrl').value = lesson.videoUrl || '';
      
      // Load quiz data if quiz type
      if (lesson.type === 'quiz') {
        currentQuestions = lesson.questions ? JSON.parse(JSON.stringify(lesson.questions)) : [];
        document.getElementById('quizShuffleQuestions').checked = lesson.shuffleQuestions || false;
        document.getElementById('quizShuffleOptions').checked = lesson.shuffleOptions || false;
        document.getElementById('quizShowExplanations').checked = lesson.showExplanations !== false;
        document.getElementById('quizTimeLimit').value = lesson.timeLimit || '';
      } else {
        currentQuestions = [];
      }

      toggleContentType();
      
      if (lesson.type === 'quiz') {
        renderQuestions();
      }
      
      document.getElementById('lessonModal').classList.remove('hidden');
    }

    // Toggle content type
    function toggleContentType() {
      const type = document.getElementById('lessonType').value;
      document.getElementById('textContentArea').classList.toggle('hidden', type !== 'text');
      document.getElementById('videoContentArea').classList.toggle('hidden', type !== 'video');
      document.getElementById('quizContentArea').classList.toggle('hidden', type !== 'quiz');
      
      // If switching to quiz, load existing questions
      if (type === 'quiz' && currentLessonEdit) {
        const lesson = currentCourse.modules[currentLessonEdit.moduleIndex].lessons[currentLessonEdit.lessonIndex];
        currentQuestions = lesson.questions ? [...lesson.questions] : [];
        renderQuestions();
      }
    }

    // Save lesson
    async function saveLesson() {
      const token = localStorage.getItem('token');
      const type = document.getElementById('lessonType').value;

      const lesson = {
        title: document.getElementById('lessonTitle').value,
        type: type,
        duration: parseInt(document.getElementById('lessonDuration').value) || 10,
        isFree: document.getElementById('lessonIsFree').checked,
        content: document.getElementById('lessonContent').value,
        videoUrl: document.getElementById('lessonVideoUrl').value
      };
      
      // Add quiz-specific fields
      if (type === 'quiz') {
        lesson.questions = currentQuestions;
        lesson.shuffleQuestions = document.getElementById('quizShuffleQuestions').checked;
        lesson.shuffleOptions = document.getElementById('quizShuffleOptions').checked;
        lesson.showExplanations = document.getElementById('quizShowExplanations').checked;
        lesson.timeLimit = parseInt(document.getElementById('quizTimeLimit').value) || null;
      }

      try {
        const response = await fetch(`${API_URL}/api/admin/courses/${currentCourse._id}/lesson`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            moduleIndex: currentLessonEdit.moduleIndex,
            lessonIndex: currentLessonEdit.lessonIndex,
            lesson
          })
        });

        if (response.ok) {
          const data = await response.json();
          currentCourse = data.course;
          renderModules();
          closeLessonModal();
          alert('Lesson saved!');
        } else {
          alert('Failed to save lesson');
        }
      } catch (error) {
        console.error('Save lesson error:', error);
        alert('Failed to save lesson');
      }
    }

    // Close lesson modal
    function closeLessonModal() {
      document.getElementById('lessonModal').classList.add('hidden');
      currentLessonEdit = null;
    }

    // New course
    function showNewCourseForm() {
      currentCourse = {
        title: '',
        slug: '',
        subtitle: '',
        description: '',
        instructor: 'GA Integrated Therapeutic Perspectives LLC',
        ceuHours: 0,
        ceuCategories: [],
        accessTier: 'free',
        status: 'draft',
        modules: []
      };
      
      document.getElementById('courseTitle').value = '';
      document.getElementById('courseSlug').value = '';
      document.getElementById('courseSubtitle').value = '';
      document.getElementById('courseDescription').value = '';
      document.getElementById('courseInstructor').value = 'GA Integrated Therapeutic Perspectives LLC';
      document.getElementById('courseCeuHours').value = '';
      document.getElementById('courseCeuCategory').value = 'core';
      document.getElementById('courseAccessTier').value = 'free';
      document.getElementById('courseStatus').value = 'draft';
      
      document.getElementById('editorTitle').textContent = 'New Course';
      document.getElementById('modulesContainer').innerHTML = '<p class="text-forest-500">Save course details first, then add modules.</p>';
      showEditor();
    }

    // Delete course
    async function deleteCourse(courseId) {
      if (!confirm('Are you sure you want to delete this course?')) return;

      const token = localStorage.getItem('token');

      try {
        await fetch(`${API_URL}/api/admin/courses/${courseId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        await loadCourses();
      } catch (error) {
        console.error('Delete error:', error);
      }
    }

    // Duplicate course
    async function duplicateCourse(courseId) {
      if (!confirm('Create a copy of this course?')) return;

      const token = localStorage.getItem('token');

      try {
        const response = await fetch(`${API_URL}/api/migration/duplicate/${courseId}`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const data = await response.json();
        
        if (response.ok) {
          alert(`Course duplicated: "${data.course.title}"`);
          await loadCourses();
          // Optionally open the duplicated course for editing
          if (confirm('Edit the duplicated course now?')) {
            editCourse(data.course.id);
          }
        } else {
          alert('Duplication failed: ' + (data.error || 'Unknown error'));
        }
      } catch (error) {
        console.error('Duplicate error:', error);
        alert('Failed to duplicate course');
      }
    }

    // View toggles
    function showEditor() {
      document.getElementById('courseListView').classList.add('hidden');
      document.getElementById('courseEditorView').classList.remove('hidden');
    }

    function backToList() {
      document.getElementById('courseEditorView').classList.add('hidden');
      document.getElementById('courseListView').classList.remove('hidden');
      loadCourses();
    }

    // SCORM Import/Export Functions
    function showScormImport() {
      document.getElementById('scormImportModal').classList.remove('hidden');
    }

    function closeScormImport() {
      document.getElementById('scormImportModal').classList.add('hidden');
      document.getElementById('scormFile').value = '';
      document.getElementById('scormImportStatus').classList.add('hidden');
    }

    async function importScorm() {
      const fileInput = document.getElementById('scormFile');
      const file = fileInput.files[0];
      
      if (!file) {
        alert('Please select a SCORM package (.zip file)');
        return;
      }

      if (!file.name.endsWith('.zip')) {
        alert('Please select a .zip file');
        return;
      }

      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('scormPackage', file);

      document.getElementById('scormImportStatus').classList.remove('hidden');

      try {
        const response = await fetch(`${API_URL}/api/scorm/import`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });

        const data = await response.json();

        if (response.ok) {
          alert('SCORM package imported successfully! The course has been created as a draft.');
          closeScormImport();
          loadCourses();
          // Open the new course for editing
          if (data.course && data.course._id) {
            editCourse(data.course._id);
          }
        } else {
          alert('Import failed: ' + (data.error || 'Unknown error'));
        }
      } catch (error) {
        console.error('SCORM import error:', error);
        alert('Failed to import SCORM package');
      }

      document.getElementById('scormImportStatus').classList.add('hidden');
    }

    async function exportScorm() {
      if (!currentCourse || !currentCourse._id) {
        alert('Please save the course first');
        return;
      }

      const token = localStorage.getItem('token');

      try {
        const response = await fetch(`${API_URL}/api/scorm/export/${currentCourse._id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          // Download the zip file
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${currentCourse.slug || 'course'}_scorm.zip`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
          alert('SCORM package exported successfully!');
        } else {
          const data = await response.json();
          alert('Export failed: ' + (data.error || 'Unknown error'));
        }
      } catch (error) {
        console.error('SCORM export error:', error);
        alert('Failed to export SCORM package');
      }
    }

    // ==========================================
    // THUMBNAIL UPLOAD FUNCTIONS
    // ==========================================
    
    // Preview selected thumbnail before upload
    function previewThumbnail(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
          const preview = document.getElementById('thumbnailPreview');
          preview.innerHTML = `<img src="${e.target.result}" class="w-full h-full object-cover">`;
        };
        reader.readAsDataURL(file);
      }
    }
    
    // Update thumbnail preview from URL
    function updateThumbnailPreview(url) {
      const preview = document.getElementById('thumbnailPreview');
      if (url) {
        preview.innerHTML = `<img src="${url}" class="w-full h-full object-cover">`;
      } else {
        preview.innerHTML = '<span class="text-forest-400 text-sm">No image</span>';
      }
    }
    
    // Upload thumbnail to server
    async function uploadThumbnail() {
      const fileInput = document.getElementById('courseThumbnail');
      const file = fileInput.files[0];
      
      if (!file) {
        alert('Please select an image first');
        return;
      }
      
      if (!currentCourse || !currentCourse._id) {
        alert('Please save the course first before uploading an image');
        return;
      }
      
      const statusEl = document.getElementById('uploadStatus');
      statusEl.classList.remove('hidden');
      statusEl.className = 'mt-2 text-sm text-forest-600';
      statusEl.innerHTML = '⏳ Uploading...';
      
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('thumbnail', file);
      
      try {
        const response = await fetch(`${API_URL}/api/admin/courses/${currentCourse._id}/thumbnail`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });
        
        const data = await response.json();
        
        if (response.ok) {
          document.getElementById('courseThumbnailUrl').value = data.thumbnailUrl;
          currentCourse.thumbnail = data.thumbnailUrl;
          statusEl.className = 'mt-2 text-sm text-green-600';
          statusEl.innerHTML = '✅ Image uploaded successfully!';
          setTimeout(() => statusEl.classList.add('hidden'), 3000);
        } else {
          statusEl.className = 'mt-2 text-sm text-red-600';
          statusEl.innerHTML = '❌ Upload failed: ' + (data.error || 'Unknown error');
        }
      } catch (error) {
        console.error('Upload error:', error);
        statusEl.className = 'mt-2 text-sm text-red-600';
        statusEl.innerHTML = '❌ Upload failed: ' + error.message;
      }
    }
    
    // Remove thumbnail
    async function removeThumbnail() {
      if (!currentCourse || !currentCourse._id) return;
      
      if (!confirm('Remove the course thumbnail?')) return;
      
      const token = localStorage.getItem('token');
      
      try {
        const response = await fetch(`${API_URL}/api/admin/courses/${currentCourse._id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ thumbnail: '' })
        });
        
        if (response.ok) {
          document.getElementById('courseThumbnailUrl').value = '';
          document.getElementById('courseThumbnail').value = '';
          currentCourse.thumbnail = '';
          updateThumbnailPreview(null);
          alert('Thumbnail removed');
        }
      } catch (error) {
        console.error('Remove thumbnail error:', error);
        alert('Failed to remove thumbnail');
      }
    }

    // ==========================================
    // COURSE SETTINGS FUNCTIONS
    // ==========================================
    
    function toggleSettingsPanel() {
      const panel = document.getElementById('settingsPanel');
      const toggleText = document.getElementById('settingsToggleText');
      
      if (panel.classList.contains('hidden')) {
        panel.classList.remove('hidden');
        toggleText.textContent = '▲ Collapse';
        loadSettingsIntoForm();
      } else {
        panel.classList.add('hidden');
        toggleText.textContent = '▼ Expand';
      }
    }
    
    function toggleMinTimeSettings() {
      const enabled = document.getElementById('settingEnforceMinTime').checked;
      document.getElementById('minTimeSettings').classList.toggle('hidden', !enabled);
    }
    
    function toggleRetakeSettings() {
      const policy = document.getElementById('settingRetakePolicy').value;
      document.getElementById('retakeLimitSettings').classList.toggle('hidden', policy !== 'limited');
      document.getElementById('retakeCooldownSettings').classList.toggle('hidden', policy === 'first_final');
    }
    
    function toggleDripSettings() {
      const enabled = document.getElementById('settingDripEnabled').checked;
      document.getElementById('dripScheduleSettings').classList.toggle('hidden', !enabled);
      if (enabled) {
        renderDripSchedule();
      }
    }
    
    function toggleNarrationSettings() {
      const enabled = document.getElementById('settingNarrationEnabled').checked;
      document.getElementById('narrationSettings').classList.toggle('hidden', !enabled);
    }
    
    // Update speed display
    document.addEventListener('DOMContentLoaded', () => {
      const speedSlider = document.getElementById('settingNarrationSpeed');
      if (speedSlider) {
        speedSlider.addEventListener('input', (e) => {
          document.getElementById('speedDisplay').textContent = e.target.value + 'x';
        });
      }
    });
    
    function renderDripSchedule() {
      const container = document.getElementById('dripScheduleContainer');
      
      if (!currentCourse || !currentCourse.modules || currentCourse.modules.length === 0) {
        container.innerHTML = '<p class="text-xs text-forest-400 italic">Add modules first, then configure drip schedule</p>';
        return;
      }
      
      const dripSchedule = currentCourse.settings?.dripSchedule || [];
      
      container.innerHTML = currentCourse.modules.map((module, idx) => {
        const existing = dripSchedule.find(d => d.moduleId === module._id);
        const days = existing?.daysAfterEnrollment || (idx * 7); // Default: 7 days apart
        
        return `
          <div class="flex items-center gap-2 mb-2">
            <span class="text-xs text-forest-600 flex-1">Module ${idx + 1}: ${module.title.substring(0, 20)}...</span>
            <input type="number" data-module-id="${module._id}" data-module-index="${idx}" 
                   value="${days}" min="0" 
                   class="drip-day-input w-16 px-2 py-1 border border-forest-200 rounded text-sm text-center">
            <span class="text-xs text-forest-500">days</span>
          </div>
        `;
      }).join('');
    }
    
    function loadSettingsIntoForm() {
      if (!currentCourse) return;
      
      const s = currentCourse.settings || {};
      
      // Progression
      document.getElementById('settingLinearProgression').checked = s.linearProgression || false;
      document.getElementById('settingEnforceMinTime').checked = s.enforceMinTime || false;
      document.getElementById('settingMinTimePercent').value = s.minTimePercent || 80;
      toggleMinTimeSettings();
      
      // Quiz settings
      document.getElementById('settingPassingScore').value = s.passingScore || 70;
      document.getElementById('settingRetakePolicy').value = s.retakePolicy || 'unlimited';
      document.getElementById('settingMaxRetakes').value = s.maxRetakes || 3;
      document.getElementById('settingRetakeCooldown').value = s.retakeCooldown || 0;
      document.getElementById('settingScorePolicy').value = s.scorePolicy || 'highest';
      toggleRetakeSettings();
      
      // Drip
      document.getElementById('settingDripEnabled').checked = s.dripEnabled || false;
      toggleDripSettings();
      
      // Narration
      document.getElementById('settingNarrationEnabled').checked = s.narrationEnabled || false;
      document.getElementById('settingNarrationVoice').value = s.narrationVoice || 'browser';
      document.getElementById('settingNarrationSpeed').value = s.narrationSpeed || 1.0;
      document.getElementById('speedDisplay').textContent = (s.narrationSpeed || 1.0) + 'x';
      document.getElementById('settingAutoPlayNarration').checked = s.autoPlayNarration || false;
      toggleNarrationSettings();
      
      // CE Compliance
      document.getElementById('settingRequireEvaluation').checked = s.requireEvaluation !== false;
      document.getElementById('settingRequireAttestation').checked = s.requireAttestation !== false;
      document.getElementById('settingCertificateEnabled').checked = s.certificateEnabled !== false;
      
      // Approving body
      document.getElementById('settingApprovingBody').value = currentCourse.approvingBody || 'NBCC';
      document.getElementById('settingApprovalNumber').value = currentCourse.approvalNumber || currentCourse.ceuApprovalNumber || '';
    }
    
    async function saveCourseSettings() {
      if (!currentCourse || !currentCourse._id) {
        alert('Please save the course first');
        return;
      }
      
      const token = localStorage.getItem('token');
      
      // Gather drip schedule
      const dripSchedule = [];
      document.querySelectorAll('.drip-day-input').forEach(input => {
        dripSchedule.push({
          moduleId: input.dataset.moduleId,
          daysAfterEnrollment: parseInt(input.value) || 0
        });
      });
      
      const settings = {
        linearProgression: document.getElementById('settingLinearProgression').checked,
        enforceMinTime: document.getElementById('settingEnforceMinTime').checked,
        minTimePercent: parseInt(document.getElementById('settingMinTimePercent').value) || 80,
        
        passingScore: parseInt(document.getElementById('settingPassingScore').value) || 70,
        retakePolicy: document.getElementById('settingRetakePolicy').value,
        allowRetakes: document.getElementById('settingRetakePolicy').value !== 'first_final',
        maxRetakes: parseInt(document.getElementById('settingMaxRetakes').value) || 3,
        retakeCooldown: parseInt(document.getElementById('settingRetakeCooldown').value) || 0,
        scorePolicy: document.getElementById('settingScorePolicy').value,
        
        dripEnabled: document.getElementById('settingDripEnabled').checked,
        dripSchedule: dripSchedule,
        
        narrationEnabled: document.getElementById('settingNarrationEnabled').checked,
        narrationVoice: document.getElementById('settingNarrationVoice').value,
        narrationSpeed: parseFloat(document.getElementById('settingNarrationSpeed').value) || 1.0,
        autoPlayNarration: document.getElementById('settingAutoPlayNarration').checked,
        
        requireEvaluation: document.getElementById('settingRequireEvaluation').checked,
        requireAttestation: document.getElementById('settingRequireAttestation').checked,
        certificateEnabled: document.getElementById('settingCertificateEnabled').checked
      };
      
      const updates = {
        settings,
        approvingBody: document.getElementById('settingApprovingBody').value,
        approvalNumber: document.getElementById('settingApprovalNumber').value
      };
      
      try {
        const response = await fetch(`${API_URL}/api/admin/courses/${currentCourse._id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updates)
        });
        
        if (response.ok) {
          const data = await response.json();
          currentCourse = data.course;
          alert('✅ Settings saved!');
        } else {
          alert('Failed to save settings');
        }
      } catch (error) {
        console.error('Save settings error:', error);
        alert('Failed to save settings');
      }
    }

    // Initialize
    document.addEventListener('DOMContentLoaded', loadCourses);
    
    // Load admin email
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.email) {
      document.getElementById('adminEmail').textContent = user.email;
    }
    
    // ============================================
    // QUIZ BUILDER FUNCTIONS
    // ============================================
    
    function setAIMode(mode) {
      currentAIMode = mode;
      document.querySelectorAll('.ai-mode-btn').forEach(btn => {
        btn.classList.remove('bg-purple-600', 'text-white');
        btn.classList.add('bg-white', 'text-purple-700', 'border', 'border-purple-300');
      });
      const activeBtn = document.getElementById('aiMode' + mode.charAt(0).toUpperCase() + mode.slice(1));
      if (activeBtn) {
        activeBtn.classList.remove('bg-white', 'text-purple-700', 'border', 'border-purple-300');
        activeBtn.classList.add('bg-purple-600', 'text-white');
      }
      document.querySelectorAll('.ai-mode-content').forEach(el => el.classList.add('hidden'));
      const modeEl = document.getElementById('ai' + mode.charAt(0).toUpperCase() + mode.slice(1) + 'Mode');
      if (modeEl) modeEl.classList.remove('hidden');
    }
    
    function handleQuizPdfSelect(event) {
      const file = event.target.files[0];
      if (file) {
        document.getElementById('quizPdfFileName').textContent = '📄 ' + file.name;
        document.getElementById('quizPdfFileName').classList.remove('hidden');
      }
    }
    
    function handleQuizPdfDrop(event) {
      event.preventDefault();
      const file = event.dataTransfer.files[0];
      if (file && file.type === 'application/pdf') {
        document.getElementById('quizPdfUpload').files = event.dataTransfer.files;
        document.getElementById('quizPdfFileName').textContent = '📄 ' + file.name;
        document.getElementById('quizPdfFileName').classList.remove('hidden');
      }
    }
    
    function fileToBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = error => reject(error);
      });
    }
    
    async function generateQuizWithAI() {
      const token = localStorage.getItem('token');
      const statusEl = document.getElementById('aiGenerateStatus');
      const btnEl = document.getElementById('aiGenerateBtn');
      statusEl.classList.remove('hidden');
      btnEl.disabled = true;
      
      try {
        let requestBody = { mode: currentAIMode };
        
        if (currentAIMode === 'pdf') {
          const fileInput = document.getElementById('quizPdfUpload');
          if (!fileInput.files[0]) { alert('Please select a PDF file'); statusEl.classList.add('hidden'); btnEl.disabled = false; return; }
          const file = fileInput.files[0];
          requestBody.pdfData = await fileToBase64(file);
          requestBody.fileName = file.name;
        } else if (currentAIMode === 'outline') {
          const outline = document.getElementById('quizOutlineInput').value.trim();
          if (!outline) { alert('Please enter an outline'); statusEl.classList.add('hidden'); btnEl.disabled = false; return; }
          requestBody.outline = outline;
        } else if (currentAIMode === 'content') {
          const scope = document.querySelector('input[name="contentScope"]:checked').value;
          const questionCount = parseInt(document.getElementById('aiQuestionCount').value) || 5;
          if (scope === 'lesson') {
            const content = document.getElementById('lessonContent').value;
            if (!content) { alert('No lesson content'); statusEl.classList.add('hidden'); btnEl.disabled = false; return; }
            requestBody.content = content;
          } else {
            const module = currentCourse.modules[currentLessonEdit.moduleIndex];
            requestBody.content = module.lessons.map(l => l.content || '').join('\n\n');
            requestBody.moduleTitle = module.title;
          }
          requestBody.questionCount = questionCount;
        }
        
        const response = await fetch(`${API_URL}/api/admin/quiz/generate`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody)
        });
        const data = await response.json();
        
        if (response.ok && data.questions) {
          currentQuestions = [...currentQuestions, ...data.questions];
          renderQuestions();
          alert(`✅ Generated ${data.questions.length} questions!`);
          document.getElementById('quizPdfUpload').value = '';
          document.getElementById('quizPdfFileName').classList.add('hidden');
          document.getElementById('quizOutlineInput').value = '';
        } else {
          alert('Failed: ' + (data.error || 'Unknown error'));
        }
      } catch (error) {
        console.error('AI error:', error);
        alert('Failed to generate questions');
      } finally {
        statusEl.classList.add('hidden');
        btnEl.disabled = false;
      }
    }
    
    function renderQuestions() {
      const container = document.getElementById('questionsContainer');
      document.getElementById('questionCount').textContent = currentQuestions.length;
      if (currentQuestions.length === 0) {
        container.innerHTML = '<div class="p-6 text-center text-forest-500"><p>No questions yet. Add manually or use AI to generate.</p></div>';
        return;
      }
      container.innerHTML = currentQuestions.map((q, idx) => {
        const typeLabel = { 'multiple_choice': 'MC', 'multiple_select': 'MS', 'true_false': 'T/F' }[q.type] || 'MC';
        const typeColor = { 'multiple_choice': 'bg-blue-100 text-blue-700', 'multiple_select': 'bg-purple-100 text-purple-700', 'true_false': 'bg-green-100 text-green-700' }[q.type] || 'bg-gray-100';
        let optHtml = '';
        if (q.type !== 'true_false' && q.options) {
          optHtml = '<div class="mt-2 space-y-1">' + q.options.map((opt, oi) => {
            const isC = q.type === 'multiple_select' ? (Array.isArray(q.correctAnswer) && q.correctAnswer.includes(oi)) : q.correctAnswer === oi;
            return `<div class="text-sm ${isC ? 'text-green-700 font-medium' : 'text-forest-600'}">${isC ? '✓' : '○'} ${escapeHtml(opt)}</div>`;
          }).join('') + '</div>';
        } else if (q.type === 'true_false') {
          optHtml = `<p class="mt-1 text-sm text-green-700 font-medium">Answer: ${q.correctAnswer ? 'True' : 'False'}</p>`;
        }
        return `<div class="p-4 hover:bg-forest-50"><div class="flex items-start justify-between gap-4"><div class="flex-1"><div class="flex items-center gap-2 mb-1"><span class="text-xs font-medium px-2 py-0.5 rounded ${typeColor}">${typeLabel}</span><span class="text-xs text-forest-500">${q.points||1} pt</span></div><p class="text-forest-800 font-medium">${idx+1}. ${escapeHtml(q.question)}</p>${optHtml}${q.explanation ? `<p class="mt-2 text-xs text-forest-500 italic">💡 ${escapeHtml(q.explanation)}</p>` : ''}</div><div class="flex gap-2"><button onclick="editQuestion(${idx})" class="text-burgundy-600 hover:text-burgundy-800 text-sm">Edit</button><button onclick="deleteQuestion(${idx})" class="text-red-600 hover:text-red-800 text-sm">Delete</button></div></div></div>`;
      }).join('');
    }
    
    function escapeHtml(text) { if (!text) return ''; const d = document.createElement('div'); d.textContent = text; return d.innerHTML; }
    
    function addQuestion() {
      editingQuestionIndex = null;
      document.getElementById('questionModalTitle').textContent = 'Add Question';
      document.getElementById('questionType').value = 'multiple_choice';
      document.getElementById('questionText').value = '';
      document.getElementById('questionExplanation').value = '';
      document.getElementById('questionPoints').value = '1';
      currentOptions = ['', '', '', ''];
      currentCorrectAnswer = null;
      toggleQuestionType();
      document.getElementById('questionModal').classList.remove('hidden');
    }
    
    function editQuestion(index) {
      editingQuestionIndex = index;
      const q = currentQuestions[index];
      document.getElementById('questionModalTitle').textContent = 'Edit Question';
      document.getElementById('questionType').value = q.type || 'multiple_choice';
      document.getElementById('questionText').value = q.question || '';
      document.getElementById('questionExplanation').value = q.explanation || '';
      document.getElementById('questionPoints').value = q.points || 1;
      if (q.type === 'true_false') {
        const r = document.querySelector(`input[name="tfAnswer"][value="${q.correctAnswer}"]`);
        if (r) r.checked = true;
        currentOptions = ['', '', '', ''];
        currentCorrectAnswer = null;
      } else {
        currentOptions = q.options ? [...q.options] : ['', '', '', ''];
        currentCorrectAnswer = q.correctAnswer;
      }
      toggleQuestionType();
      document.getElementById('questionModal').classList.remove('hidden');
    }
    
    function deleteQuestion(index) { if (confirm('Delete this question?')) { currentQuestions.splice(index, 1); renderQuestions(); } }
    
    function toggleQuestionType() {
      const type = document.getElementById('questionType').value;
      document.getElementById('optionsArea').classList.toggle('hidden', type === 'true_false');
      document.getElementById('trueFalseArea').classList.toggle('hidden', type !== 'true_false');
      if (type !== 'true_false') renderOptions();
    }
    
    function renderOptions() {
      const type = document.getElementById('questionType').value;
      const isMS = type === 'multiple_select';
      document.getElementById('optionsList').innerHTML = currentOptions.map((opt, idx) => {
        const isC = isMS ? (Array.isArray(currentCorrectAnswer) && currentCorrectAnswer.includes(idx)) : currentCorrectAnswer === idx;
        return `<div class="flex items-center gap-2"><input type="${isMS ? 'checkbox' : 'radio'}" name="correctOption" ${isC ? 'checked' : ''} onchange="setCorrectAnswer(${idx}, this.checked)" class="w-4 h-4 text-burgundy-600"><input type="text" value="${escapeHtml(opt)}" onchange="updateOption(${idx}, this.value)" placeholder="Option ${idx+1}" class="flex-1 px-3 py-1.5 border border-forest-200 rounded text-sm">${currentOptions.length > 2 ? `<button onclick="removeOption(${idx})" class="text-red-500 hover:text-red-700"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg></button>` : ''}</div>`;
      }).join('');
    }
    
    function updateOption(index, value) { currentOptions[index] = value; }
    function addOption() { if (currentOptions.length < 8) { currentOptions.push(''); renderOptions(); } }
    function removeOption(index) {
      if (currentOptions.length > 2) {
        currentOptions.splice(index, 1);
        const type = document.getElementById('questionType').value;
        if (type === 'multiple_select' && Array.isArray(currentCorrectAnswer)) {
          currentCorrectAnswer = currentCorrectAnswer.filter(i => i !== index).map(i => i > index ? i - 1 : i);
        } else if (currentCorrectAnswer === index) { currentCorrectAnswer = null; }
        else if (currentCorrectAnswer > index) { currentCorrectAnswer--; }
        renderOptions();
      }
    }
    function setCorrectAnswer(index, isChecked) {
      const type = document.getElementById('questionType').value;
      if (type === 'multiple_select') {
        if (!Array.isArray(currentCorrectAnswer)) currentCorrectAnswer = [];
        if (isChecked) { if (!currentCorrectAnswer.includes(index)) currentCorrectAnswer.push(index); }
        else { currentCorrectAnswer = currentCorrectAnswer.filter(i => i !== index); }
      } else { currentCorrectAnswer = index; }
    }
    
    function saveQuestion() {
      const type = document.getElementById('questionType').value;
      const questionText = document.getElementById('questionText').value.trim();
      if (!questionText) { alert('Please enter a question'); return; }
      let correctAnswer, options = null;
      if (type === 'true_false') {
        const tf = document.querySelector('input[name="tfAnswer"]:checked');
        if (!tf) { alert('Please select True or False'); return; }
        correctAnswer = tf.value === 'true';
      } else {
        options = currentOptions.filter(o => o.trim());
        if (options.length < 2) { alert('Add at least 2 options'); return; }
        if (type === 'multiple_select') {
          if (!Array.isArray(currentCorrectAnswer) || currentCorrectAnswer.length === 0) { alert('Select at least one correct answer'); return; }
          correctAnswer = currentCorrectAnswer;
        } else {
          if (currentCorrectAnswer === null) { alert('Select the correct answer'); return; }
          correctAnswer = currentCorrectAnswer;
        }
      }
      const question = { question: questionText, type, options, correctAnswer, explanation: document.getElementById('questionExplanation').value.trim(), points: parseInt(document.getElementById('questionPoints').value) || 1 };
      if (editingQuestionIndex !== null) { currentQuestions[editingQuestionIndex] = question; }
      else { currentQuestions.push(question); }
      renderQuestions();
      closeQuestionModal();
    }
    
    function closeQuestionModal() { document.getElementById('questionModal').classList.add('hidden'); editingQuestionIndex = null; }
    
    // ============================================
    // AI COURSE BUILDER FUNCTIONS
    // ============================================
    
    let aiBuilderStep = 1;
    let aiGeneratedCourse = null;
    let aiUploadedFile = null;
    
    function showAICourseBuilder() {
      aiBuilderStep = 1;
      aiGeneratedCourse = null;
      aiUploadedFile = null;
      document.getElementById('aiCourseFileInput').value = '';
      document.getElementById('aiSelectedFileName').classList.add('hidden');
      document.getElementById('aiCourseContentInput').value = '';
      document.getElementById('aiKeyPointsInput').value = '';
      document.getElementById('aiCourseCEHours').value = '3';
      document.getElementById('aiGenerateQuizzes').checked = true;
      document.getElementById('aiGenerateObjectives').checked = true;
      updateAIBuilderUI();
      document.getElementById('aiCourseBuilderModal').classList.remove('hidden');
    }
    
    function closeAICourseBuilder() {
      document.getElementById('aiCourseBuilderModal').classList.add('hidden');
    }
    
    function handleAICourseFileSelect(event) {
      const file = event.target.files[0];
      if (file) {
        aiUploadedFile = file;
        document.getElementById('aiSelectedFileName').textContent = '📄 ' + file.name;
        document.getElementById('aiSelectedFileName').classList.remove('hidden');
      }
    }
    
    function handleAICourseFileDrop(event) {
      event.preventDefault();
      event.target.classList.remove('border-purple-500', 'bg-purple-50');
      const file = event.dataTransfer.files[0];
      if (file) {
        aiUploadedFile = file;
        document.getElementById('aiCourseFileInput').files = event.dataTransfer.files;
        document.getElementById('aiSelectedFileName').textContent = '📄 ' + file.name;
        document.getElementById('aiSelectedFileName').classList.remove('hidden');
      }
    }
    
    function updateAIBuilderUI() {
      document.getElementById('aiBuilderStep1').classList.add('hidden');
      document.getElementById('aiBuilderStep2').classList.add('hidden');
      document.getElementById('aiBuilderStep3').classList.add('hidden');
      document.getElementById('aiGeneratingState').classList.add('hidden');
      
      ['step1Indicator', 'step2Indicator', 'step3Indicator'].forEach((id, idx) => {
        const el = document.getElementById(id);
        const stepNum = idx + 1;
        if (stepNum <= aiBuilderStep) {
          el.classList.remove('opacity-50');
          el.querySelector('div').classList.remove('bg-purple-200', 'text-purple-600');
          el.querySelector('div').classList.add('bg-purple-600', 'text-white');
        } else {
          el.classList.add('opacity-50');
          el.querySelector('div').classList.add('bg-purple-200', 'text-purple-600');
          el.querySelector('div').classList.remove('bg-purple-600', 'text-white');
        }
      });
      
      document.getElementById('aiBuilderStep' + aiBuilderStep).classList.remove('hidden');
      
      const backBtn = document.getElementById('aiBuilderBackBtn');
      const nextBtn = document.getElementById('aiBuilderNextBtn');
      
      if (aiBuilderStep === 1) {
        backBtn.classList.add('hidden');
        nextBtn.innerHTML = 'Generate Course ⚡';
        document.getElementById('aiRegenerateBtn').classList.add('hidden');
      } else if (aiBuilderStep === 2) {
        backBtn.classList.remove('hidden');
        nextBtn.innerHTML = 'Create Course ✓';
        document.getElementById('aiRegenerateBtn').classList.remove('hidden');
      }
    }
    
    function aiBuilderBack() {
      if (aiBuilderStep > 1) { aiBuilderStep--; updateAIBuilderUI(); }
    }
    
    // Regenerate confirmation logic
    function confirmRegenerate() {
      const skipWarning = localStorage.getItem('aiRegenSkipWarning') === 'true';
      if (skipWarning) {
        executeRegenerate();
        return;
      }
      
      // Track how many times we've shown the warning
      let warningCount = parseInt(localStorage.getItem('aiRegenWarningCount') || '0');
      warningCount++;
      localStorage.setItem('aiRegenWarningCount', warningCount.toString());
      
      // Show "don't show again" checkbox after 3 times
      if (warningCount >= 3) {
        document.getElementById('dontShowAgainContainer').classList.remove('hidden');
      } else {
        document.getElementById('dontShowAgainContainer').classList.add('hidden');
      }
      
      document.getElementById('regenerateConfirmModal').classList.remove('hidden');
    }
    
    function closeRegenerateModal() {
      document.getElementById('regenerateConfirmModal').classList.add('hidden');
    }
    
    function executeRegenerate() {
      // Check if "don't show again" was checked
      if (document.getElementById('dontShowAgainCheckbox').checked) {
        localStorage.setItem('aiRegenSkipWarning', 'true');
      }
      
      closeRegenerateModal();
      
      // Go back to step 1 but keep the uploaded file
      aiBuilderStep = 1;
      aiGeneratedCourse = null;
      // Note: aiUploadedFile is preserved so they don't have to re-upload
      updateAIBuilderUI();
    }
    
    async function aiBuilderNext() {
      if (aiBuilderStep === 1) await generateCourseWithAI();
      else if (aiBuilderStep === 2) await saveGeneratedCourse();
    }
    
    async function generateCourseWithAI() {
      const content = document.getElementById('aiCourseContentInput').value.trim();
      const keyPoints = document.getElementById('aiKeyPointsInput').value.trim();
      const category = document.getElementById('aiCourseCategory').value;
      const ceHours = parseFloat(document.getElementById('aiCourseCEHours').value) || 3;
      const generateQuizzes = document.getElementById('aiGenerateQuizzes').checked;
      const generateObjectives = document.getElementById('aiGenerateObjectives').checked;
      
      if (!aiUploadedFile && !content) {
        alert('Please upload a file or paste your course content');
        return;
      }
      
      document.getElementById('aiBuilderStep1').classList.add('hidden');
      document.getElementById('aiGeneratingState').classList.remove('hidden');
      
      const token = localStorage.getItem('token');
      
      try {
        let requestBody = { category, ceHours, generateQuizzes, generateObjectives, keyPoints };
        
        if (aiUploadedFile) {
          const base64 = await fileToBase64(aiUploadedFile);
          requestBody.fileData = base64;
          requestBody.fileName = aiUploadedFile.name;
          requestBody.fileType = aiUploadedFile.type;
          document.getElementById('aiGenerationStatus').textContent = 'Reading document...';
        }
        
        if (content) requestBody.content = content;
        
        document.getElementById('aiGenerationStatus').textContent = 'Claude is analyzing your content...';
        
        const response = await fetch(`${API_URL}/api/admin/course/generate`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody)
        });
        
        const data = await response.json();
        
        if (response.ok && data.course) {
          aiGeneratedCourse = data.course;
          renderGeneratedCourse();
          aiBuilderStep = 2;
          updateAIBuilderUI();
        } else {
          throw new Error(data.error || 'Failed to generate course');
        }
      } catch (error) {
        console.error('Course generation error:', error);
        alert('Failed to generate course: ' + error.message);
        document.getElementById('aiGeneratingState').classList.add('hidden');
        document.getElementById('aiBuilderStep1').classList.remove('hidden');
      }
    }
    
    function renderGeneratedCourse() {
      if (!aiGeneratedCourse) return;
      const c = aiGeneratedCourse;
      
      document.getElementById('aiGenTitle').value = c.title || '';
      document.getElementById('aiGenCEHours').value = c.ceuHours || 3;
      document.getElementById('aiGenDescription').value = c.description || '';
      
      const objEl = document.getElementById('aiGenObjectives');
      objEl.innerHTML = (c.objectives || []).map((obj, i) => `
        <div class="flex items-center gap-2">
          <span class="text-green-500 text-xs">✓</span>
          <input type="text" value="${escapeHtml(obj)}" onchange="aiGeneratedCourse.objectives[${i}]=this.value" class="flex-1 px-2 py-1 border border-gray-200 rounded text-xs">
        </div>
      `).join('') || '<p class="text-gray-400 text-xs">No objectives</p>';
      
      const modEl = document.getElementById('aiGenModules');
      modEl.innerHTML = (c.modules || []).map((m, mi) => `
        <div class="p-3">
          <div class="flex items-center gap-2 mb-2">
            <span class="bg-purple-100 text-purple-700 text-xs font-medium px-2 py-0.5 rounded">M${mi+1}</span>
            <input type="text" value="${escapeHtml(m.title)}" onchange="aiGeneratedCourse.modules[${mi}].title=this.value" class="flex-1 font-medium px-2 py-1 border border-gray-200 rounded text-sm">
          </div>
          <div class="ml-6 space-y-1">
            ${(m.lessons||[]).map((l, li) => `
              <div class="flex items-center gap-2 text-xs">
                <span class="w-5 h-5 rounded-full ${l.type==='quiz'?'bg-green-100 text-green-600':l.type==='video'?'bg-blue-100 text-blue-600':'bg-gray-100 text-gray-500'} flex items-center justify-center">${l.type==='quiz'?'?':l.type==='video'?'▶':'📄'}</span>
                <input type="text" value="${escapeHtml(l.title)}" onchange="aiGeneratedCourse.modules[${mi}].lessons[${li}].title=this.value" class="flex-1 px-2 py-1 border border-gray-200 rounded">
                <span class="text-gray-400">${l.duration||10}m</span>
              </div>
            `).join('')}
          </div>
        </div>
      `).join('') || '<p class="p-3 text-gray-400">No modules</p>';
      
      let totalQ = 0;
      (c.modules||[]).forEach(m => (m.lessons||[]).forEach(l => { if(l.type==='quiz' && l.questions) totalQ += l.questions.length; }));
      
      document.getElementById('aiGenQuizCount').textContent = totalQ + ' questions';
      document.getElementById('aiGenQuizSection').classList.toggle('hidden', totalQ === 0);
      
      if (totalQ > 0) {
        let qHtml = '';
        c.modules.forEach(m => m.lessons.forEach(l => {
          if (l.type === 'quiz' && l.questions && l.questions.length) {
            qHtml += `<div class="mb-3"><p class="font-medium text-purple-700 text-xs mb-1">${escapeHtml(l.title)}</p>`;
            qHtml += l.questions.map((q,qi) => `<div class="ml-3 text-xs text-gray-600">${qi+1}. ${escapeHtml(q.question).substring(0,60)}...</div>`).join('');
            qHtml += '</div>';
          }
        }));
        document.getElementById('aiGenQuizzes').innerHTML = qHtml;
      }
    }
    
    async function saveGeneratedCourse() {
      if (!aiGeneratedCourse) return;
      
      aiGeneratedCourse.title = document.getElementById('aiGenTitle').value;
      aiGeneratedCourse.ceuHours = parseFloat(document.getElementById('aiGenCEHours').value) || 3;
      aiGeneratedCourse.description = document.getElementById('aiGenDescription').value;
      aiGeneratedCourse.slug = aiGeneratedCourse.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + Date.now().toString(36);
      
      aiBuilderStep = 3;
      updateAIBuilderUI();
      
      const token = localStorage.getItem('token');
      
      try {
        const response = await fetch(`${API_URL}/api/admin/courses`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify(aiGeneratedCourse)
        });
        
        const data = await response.json();
        
        if (response.ok && data.course) {
          alert('✅ Course created successfully!');
          closeAICourseBuilder();
          loadCourses();
          setTimeout(() => editCourse(data.course._id), 500);
        } else {
          throw new Error(data.error || 'Failed to save course');
        }
      } catch (error) {
        console.error('Save error:', error);
        alert('Failed to save: ' + error.message);
        aiBuilderStep = 2;
        updateAIBuilderUI();
      }
    }
  </script>

    </main>
  </div>
</body>
</html>
