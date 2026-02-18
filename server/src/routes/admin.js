import express from 'express';
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
      .select('title slug category ceuHours ceHours status enrollmentCount createdAt isExternal externalUrl importType source wordCount moduleCount price ceuCategories modules')
      .sort({ createdAt: -1 })
      .lean();

    // Helper: strip HTML and count words from a string
    const countWords = (str) => {
      if (!str) return 0;
      return str.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().split(' ').filter(Boolean).length;
    };

    // Helper: count words across all content blocks in a module
    const countBlockWords = (block) => {
      let w = 0;
      w += countWords(block.content);
      w += countWords(block.question);
      w += countWords(block.explanation);
      w += countWords(block.instructions);
      w += countWords(block.imageCaption);
      (block.options || []).forEach(o => { w += countWords(o.text); });
      (block.accordionItems || []).forEach(a => { w += countWords(a.title) + countWords(a.content); });
      (block.matchingPairs || []).forEach(p => { w += countWords(p.term) + countWords(p.definition); });
      (block.cards || []).forEach(c => { w += countWords(c.text); });
      (block.steps || []).forEach(s => { w += countWords(s.text); });
      (block.events || []).forEach(e => { w += countWords(e.text); });
      (block.hotspots || []).forEach(h => { w += countWords(h.label) + countWords(h.info); });
      (block.flashcards || []).forEach(f => { w += countWords(f.front) + countWords(f.back); });
      (block.markers || []).forEach(m => { w += countWords(m.label) + countWords(m.prompt); });
      if (block.nodes) {
        Object.values(block.nodes).forEach(n => {
          w += countWords(n.text);
          w += countWords(n.feedback?.message);
          (n.choices || []).forEach(c => { w += countWords(c.text); });
        });
      }
      // Also handle old-style lessons (non-interactive courses)
      w += countWords(block.lessonContent);
      return w;
    };

    const coursesWithWordCount = courses.map(course => {
      // Use cached wordCount if valid
      if (course.wordCount && course.wordCount > 0) {
        const { modules, ...rest } = course;
        return rest;
      }

      // Compute from modules content
      let computed = 0;
      (course.modules || []).forEach(mod => {
        // Interactive courses use contentBlocks
        (mod.contentBlocks || []).forEach(block => {
          computed += countBlockWords(block);
        });
        // Legacy courses use lessons
        (mod.lessons || []).forEach(lesson => {
          if (lesson.content) computed += countWords(lesson.content);
        });
      });

      const { modules, ...rest } = course;
      return { ...rest, wordCount: computed };
    });

    res.json({ courses: coursesWithWordCount });
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
      ceuEligible,
      ceuApprovalNumber,
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
      slug: providedSlug,
      // New pricing fields
      price,
      pricingTier,
      stateCompliance,
      applicableStates
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
      ceuEligible: ceuEligible || ceuHours > 0,
      ceuCategories: ceuCategories || [],
      ceuApprovalNumber: ceuApprovalNumber || '7760',
      isExternal: isExternal || false,
      externalUrl: externalUrl || '',
      importType: importType || 'native',
      source: source || 'native',
      status: status || 'draft',
      accessTier: accessTier || 'professional',
      modules: processedModules,
      objectives: objectives || [],
      instructor: instructor || 'GA Integrated Therapeutic Perspectives LLC',
      approvingBody: approvingBody || 'NBCC',
      approvalNumber: approvalNumber || '7760',
      createdBy: req.user._id,
      // New pricing fields
      price: price || null,
      pricingTier: pricingTier || 'standard',
      stateCompliance: stateCompliance || [],
      applicableStates: applicableStates || stateCompliance || []
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
    
    // NBCC requirement: 1 CE hour = 6,000 words for text-based home study
    const totalWordsRequired = ceHours * 6000;
    const wordsPerLesson = Math.ceil(totalWordsRequired / (ceHours * 2)); // Assuming ~2 lessons per CE hour
    
    let prompt = `You are an expert instructional designer creating comprehensive CE courses for licensed professional counselors.

Create a COMPLETE, DETAILED CE course based on the provided content.
- Category: ${catName}
- CE Hours: ${ceHours}
${keyPoints ? `- Emphasize: ${keyPoints}` : ''}

NBCC COMPLIANCE REQUIREMENTS:
- NBCC requires 6,000 words per CE credit hour for text-based courses
- This ${ceHours} CE hour course MUST contain at least ${totalWordsRequired.toLocaleString()} words total
- Each lesson should contain approximately ${wordsPerLesson.toLocaleString()} words minimum
- This is a STRICT requirement - courses with insufficient content do not qualify for CE credit

CRITICAL REQUIREMENTS:
1. Return ONLY valid JSON - no markdown, no code blocks, no explanations
2. Each lesson MUST meet the word count requirement with substantive educational content
3. Content must be educational - include detailed explanations, research, case studies, clinical applications
4. Format lesson content with proper HTML: <h2>, <h3>, <p>, <ul>, <li>, <strong>, <em>

Required JSON structure:
{
  "title": "Course title",
  "subtitle": "Brief subtitle",
  "description": "2-3 paragraph course description explaining what learners will gain",
  "ceuHours": ${ceHours},
  "ceuCategories": [{"category": "${category}", "hours": ${ceHours}}],
  "instructor": "GA Integrated Therapeutic Perspectives LLC",
  "accessTier": "professional",
  "status": "draft",
  ${generateObjectives ? '"objectives": ["Specific learning objective 1", "Specific learning objective 2", "Specific learning objective 3", "Specific learning objective 4"],' : ''}
  "modules": [
    {
      "title": "Module Title",
      "description": "Module description",
      "order": 1,
      "lessons": [
        {
          "title": "Lesson Title",
          "type": "text",
          "content": "<h2>Introduction</h2><p>Comprehensive opening that introduces the topic, its relevance to clinical practice, and learning objectives for this lesson. This section should thoroughly orient the reader to what they will learn...</p><h3>Theoretical Foundation</h3><p>Detailed explanation of the theoretical underpinnings, including historical context, key theorists and their contributions, and how these concepts evolved over time...</p><h3>Key Concepts and Definitions</h3><p>In-depth exploration of each key concept with clear definitions, examples, and clinical relevance. Each concept should be explained thoroughly with multiple examples...</p><h3>Clinical Applications</h3><p>Extensive discussion of how to apply these concepts in clinical practice, including specific techniques, interventions, and considerations for different client populations...</p><h3>Case Study</h3><p>Detailed case presentation that illustrates the concepts in action, including client background, presenting concerns, assessment, treatment planning, interventions used, and outcomes...</p><h3>Ethical Considerations</h3><p>Discussion of relevant ethical issues, ACA Code of Ethics references, and guidance for navigating ethical dilemmas related to this topic...</p><h3>Research and Evidence Base</h3><p>Summary of current research findings, evidence-based practices, and areas where more research is needed...</p><h3>Summary and Key Takeaways</h3><p>Comprehensive recap of all main points covered, with emphasis on practical applications and continued learning...</p>",
          "duration": 30,
          "order": 1
        }${generateQuizzes ? `,
        {
          "title": "Module Quiz",
          "type": "quiz",
          "duration": 15,
          "order": 2,
          "questions": [
            {"question": "Detailed scenario-based question that tests understanding of the material?", "type": "multiple_choice", "options": ["Option A with clinical detail", "Option B with clinical detail", "Option C with clinical detail", "Option D with clinical detail"], "correctAnswer": 0, "explanation": "Comprehensive explanation of why this answer is correct, referencing specific content from the lesson and explaining why other options are incorrect", "points": 1}
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

CONTENT STRUCTURE REQUIREMENTS:
- Create ${Math.max(Math.ceil(ceHours), 2)} modules minimum (approximately 1 module per CE hour)
- Each module should have 2-3 substantive text lessons plus a quiz (if requested)
- EVERY text lesson must contain ${wordsPerLesson.toLocaleString()}+ words of educational content
- Total course content must exceed ${totalWordsRequired.toLocaleString()} words to meet NBCC requirements

CONTENT QUALITY REQUIREMENTS:
- Write as if creating a professional textbook chapter
- Include: theoretical foundations, research citations, clinical examples, case studies, ethical considerations
- Each lesson should cover the topic thoroughly - not summarize it
- Use professional counseling terminology appropriately
- Reference the ACA Code of Ethics where relevant
- Include practical, actionable clinical guidance

${generateQuizzes ? `QUIZ REQUIREMENTS:
- 5-8 questions per module quiz
- Mix of knowledge-based and scenario-based questions
- Questions should assess comprehension and application, not just recall
- Provide detailed explanations for all answers` : ''}

Generate the complete course now. The content MUST meet NBCC word count requirements. Output ONLY the JSON object.`;

    let messages = [];
    if (fileData) {
      let mediaType = fileType || 'application/pdf';
      messages = [{ role: 'user', content: [{ type: 'document', source: { type: 'base64', media_type: mediaType, data: fileData } }, { type: 'text', text: prompt }] }];
    } else {
      messages = [{ role: 'user', content: `Content:\n${content}\n\n${prompt}` }];
    }
    
    // Set up SSE headers for streaming
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();
    
    // Send progress update helper
    const sendProgress = (message, percent) => {
      res.write(`data: ${JSON.stringify({ type: 'progress', message, percent })}\n\n`);
    };
    
    sendProgress('Starting AI generation...', 5);
    
    // Use streaming API
    let responseText = '';
    
    try {
      const stream = await anthropic.messages.stream({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 64000,
        messages
      });
      
      sendProgress('Claude is analyzing your content...', 10);
      
      let lastProgressUpdate = Date.now();
      let charCount = 0;
      
      for await (const event of stream) {
        if (event.type === 'content_block_delta' && event.delta?.text) {
          responseText += event.delta.text;
          charCount += event.delta.text.length;
          
          // Send progress updates every 500ms or 500 chars
          if (Date.now() - lastProgressUpdate > 500 || charCount > 500) {
            const estimatedPercent = Math.min(10 + Math.floor(responseText.length / 200), 85);
            
            // Detect what's being generated based on content
            let status = 'Generating course structure...';
            if (responseText.includes('"modules"')) status = 'Building modules...';
            if (responseText.includes('"lessons"')) status = 'Creating lessons...';
            if (responseText.includes('"content"')) status = 'Writing lesson content...';
            if (responseText.includes('"questions"')) status = 'Generating quiz questions...';
            if (responseText.includes('"objectives"')) status = 'Defining learning objectives...';
            
            sendProgress(status, estimatedPercent);
            lastProgressUpdate = Date.now();
            charCount = 0;
          }
        }
      }
      
      sendProgress('Parsing generated content...', 90);
      
    } catch (streamError) {
      console.error('Stream error:', streamError);
      res.write(`data: ${JSON.stringify({ type: 'error', error: 'AI generation failed: ' + streamError.message })}\n\n`);
      res.end();
      return;
    }
    
    console.log('AI Response length:', responseText.length);
    
    let course;
    try {
      // Try multiple parsing strategies
      let jsonText = responseText;
      
      // Strategy 1: Remove markdown code blocks
      jsonText = jsonText.replace(/```json\s*/gi, '').replace(/```\s*/g, '');
      
      // Strategy 2: Find JSON object boundaries
      const startIdx = jsonText.indexOf('{');
      const endIdx = jsonText.lastIndexOf('}');
      
      if (startIdx === -1 || endIdx === -1 || endIdx < startIdx) {
        console.error('No JSON object found in response');
        console.error('Response preview:', responseText.substring(0, 500));
        throw new Error('No JSON object found in AI response');
      }
      
      jsonText = jsonText.substring(startIdx, endIdx + 1);
      
      // Strategy 3: Fix common JSON issues
      // Remove trailing commas before } or ]
      jsonText = jsonText.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');
      
      // Parse the JSON
      course = JSON.parse(jsonText);
      
      sendProgress('Validating course structure...', 95);
      
    } catch (e) {
      console.error('Parse error:', e.message);
      console.error('Response length:', responseText.length);
      
      // SALVAGE: Extract whatever content we can from the broken JSON
      sendProgress('JSON parse failed — salvaging content...', 92);
      
      try {
        // Extract title
        const titleMatch = responseText.match(/"title"\s*:\s*"([^"]+)"/);
        const descMatch = responseText.match(/"description"\s*:\s*"((?:[^"\\]|\\.)*)"/);
        const objectivesMatches = [...responseText.matchAll(/"objectives"\s*:\s*\[([\s\S]*?)\]/g)];
        
        // Extract all HTML content blocks from the response
        const contentBlocks = [];
        const contentRegex = /"content"\s*:\s*"((?:[^"\\]|\\["\\\/bfnrt]|\\u[0-9a-fA-F]{4})*)"/g;
        let match;
        while ((match = contentRegex.exec(responseText)) !== null) {
          let content = match[1];
          // Unescape JSON string
          content = content.replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\\\/g, '\\');
          if (content.length > 100) {
            contentBlocks.push(content);
          }
        }
        
        // Extract module titles
        const moduleTitles = [];
        const titleRegex = /"title"\s*:\s*"([^"]+)"/g;
        let titleMatch2;
        while ((titleMatch2 = titleRegex.exec(responseText)) !== null) {
          const t = titleMatch2[1];
          if (t.length > 5 && t.length < 200 && !moduleTitles.includes(t)) {
            moduleTitles.push(t);
          }
        }
        
        // Extract any quiz questions we can find
        const questionMatches = [...responseText.matchAll(/"question"\s*:\s*"((?:[^"\\]|\\.)*)"/g)];
        
        if (contentBlocks.length > 0) {
          // Build a salvaged course from extracted content
          const salvaged = {
            title: titleMatch ? titleMatch[1] : 'Salvaged Course',
            description: descMatch ? descMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"') : 'Course content was partially generated. Some content may be incomplete.',
            modules: contentBlocks.map((content, i) => ({
              title: moduleTitles[i + 1] || `Module ${i + 1}`,
              description: '',
              order: i + 1,
              lessons: [{
                title: moduleTitles[i + 1] || `Module ${i + 1} Content`,
                type: 'text',
                content: content,
                duration: 30,
                order: 1
              }]
            }))
          };
          
          // Parse objectives if found
          if (objectivesMatches.length > 0) {
            const objText = objectivesMatches[0][1];
            const objs = [...objText.matchAll(/"((?:[^"\\]|\\.)*)"/g)].map(m => m[1].replace(/\\"/g, '"'));
            if (objs.length > 0) salvaged.objectives = objs;
          }
          
          const totalWords = contentBlocks.reduce((sum, c) => sum + c.replace(/<[^>]*>/g, '').split(/\s+/).length, 0);
          console.log(`SALVAGED: ${contentBlocks.length} content blocks, ~${totalWords} words from failed JSON parse`);
          
          sendProgress(`Salvaged ${contentBlocks.length} modules (~${totalWords.toLocaleString()} words) from partial response`, 100);
          res.write(`data: ${JSON.stringify({ type: 'complete', success: true, course: salvaged, partial: true })}\n\n`);
          res.end();
          return;
        }
        
        // Last resort: extract raw HTML tags
        const rawHtml = responseText.match(/<h[23]>[\s\S]+/);
        if (rawHtml && rawHtml[0].length > 500) {
          const salvaged = {
            title: titleMatch ? titleMatch[1] : 'Salvaged Course',
            description: 'Content was partially generated from raw output.',
            modules: [{
              title: 'Generated Content',
              order: 1,
              lessons: [{ title: 'Content', type: 'text', content: rawHtml[0].substring(0, 50000), duration: 30, order: 1 }]
            }]
          };
          
          sendProgress('Salvaged raw content from partial response', 100);
          res.write(`data: ${JSON.stringify({ type: 'complete', success: true, course: salvaged, partial: true })}\n\n`);
          res.end();
          return;
        }
      } catch (salvageError) {
        console.error('Salvage also failed:', salvageError.message);
      }
      
      // Only show total failure if salvage also failed
      res.write(`data: ${JSON.stringify({ type: 'error', error: 'Failed to parse AI response and could not salvage content.', responseLength: responseText.length })}\n\n`);
      res.end();
      return;
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
    
    sendProgress('Course generated successfully!', 100);
    
    // Send the final course data
    res.write(`data: ${JSON.stringify({ type: 'complete', success: true, course })}\n\n`);
    res.end();
    
  } catch (error) {
    console.error('Course generation error:', error);
    // Check if headers already sent (streaming started)
    if (res.headersSent) {
      res.write(`data: ${JSON.stringify({ type: 'error', error: 'Failed to generate course: ' + error.message })}\n\n`);
      res.end();
    } else {
      res.status(500).json({ error: 'Failed to generate course: ' + error.message });
    }
  }
});

// @route   POST /api/admin/courses/:courseId/lesson/regenerate
// @desc    Regenerate content for a single lesson using AI
// @access  Admin only
router.post('/courses/:courseId/lesson/regenerate', protect, adminOnly, async (req, res) => {
  try {
    if (!anthropic) {
      return res.status(500).json({ error: 'AI service not configured' });
    }
    
    const { courseId } = req.params;
    const { moduleIndex, lessonIndex, lessonTitle, moduleTitle, courseTitle, courseCategory, ceHours } = req.body;
    
    // Get the course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    // Validate indices
    if (!course.modules[moduleIndex] || !course.modules[moduleIndex].lessons[lessonIndex]) {
      return res.status(400).json({ error: 'Invalid module or lesson index' });
    }
    
    const lesson = course.modules[moduleIndex].lessons[lessonIndex];
    
    // Calculate target word count based on NBCC requirements
    // 6,000 words per CE hour, distributed across lessons
    const totalLessons = course.modules.reduce((sum, m) => sum + (m.lessons?.filter(l => l.type === 'text').length || 0), 0);
    const targetWords = Math.ceil((ceHours * 6000) / Math.max(totalLessons, 1));
    
    const catNames = { core: 'Core/General', ethics: 'Ethics', supervision: 'Supervision', telehealth: 'Telehealth', cultural: 'Cultural Diversity', trauma: 'Trauma', substance: 'Substance Abuse', crisis: 'Crisis/Suicide' };
    const catName = catNames[courseCategory] || 'Core/General';
    
    const prompt = `You are an expert instructional designer creating CE content for licensed professional counselors.

Generate COMPREHENSIVE lesson content for the following:
- Course: ${courseTitle}
- Module: ${moduleTitle}
- Lesson: ${lessonTitle}
- Category: ${catName}
- Course CE Hours: ${ceHours}

NBCC COMPLIANCE REQUIREMENT:
This lesson MUST contain at least ${targetWords.toLocaleString()} words of substantive educational content.
NBCC requires 6,000 words per CE credit hour for text-based courses.

Generate the lesson content in HTML format with the following structure:

<h2>${lessonTitle}</h2>

<h3>Introduction</h3>
<p>Comprehensive introduction explaining the importance of this topic in clinical practice, what learners will gain, and how it connects to the broader course content. (150-200 words)</p>

<h3>Theoretical Foundation</h3>
<p>Detailed explanation of the theoretical underpinnings, including historical context, key theorists and their contributions, and how these concepts have evolved. Include specific theories and models relevant to this topic. (300-400 words)</p>

<h3>Key Concepts and Definitions</h3>
<p>In-depth exploration of each key concept with clear definitions, clinical examples, and practical applications. Each concept should be thoroughly explained. (400-500 words)</p>

<h3>Clinical Applications</h3>
<p>Extensive discussion of how to apply these concepts in clinical practice. Include specific techniques, interventions, session examples, and considerations for different client populations and settings. (400-500 words)</p>

<h3>Case Study</h3>
<p>Present a detailed, realistic clinical case that illustrates the concepts. Include: client background and presenting concerns, assessment process, treatment planning, specific interventions used, therapeutic dialogue examples, and outcomes. (400-500 words)</p>

<h3>Ethical Considerations</h3>
<p>Discussion of relevant ethical issues related to this topic. Reference specific sections of the ACA Code of Ethics. Provide guidance for navigating common ethical dilemmas. (200-300 words)</p>

<h3>Evidence Base and Research</h3>
<p>Summary of current research findings supporting these practices. Mention key studies, outcomes data, and areas where more research is needed. (200-300 words)</p>

<h3>Practical Guidelines</h3>
<ul>
<li><strong>Guideline 1:</strong> Detailed explanation of first practical guideline with examples</li>
<li><strong>Guideline 2:</strong> Detailed explanation of second practical guideline with examples</li>
<li><strong>Guideline 3:</strong> Detailed explanation of third practical guideline with examples</li>
<li><strong>Guideline 4:</strong> Detailed explanation of fourth practical guideline with examples</li>
<li><strong>Guideline 5:</strong> Detailed explanation of fifth practical guideline with examples</li>
</ul>

<h3>Summary and Key Takeaways</h3>
<p>Comprehensive recap of all main points covered, emphasizing practical applications and encouraging continued professional development in this area. (150-200 words)</p>

IMPORTANT: 
- Write ${targetWords.toLocaleString()}+ words of actual educational content
- Do NOT write brief summaries - write full, detailed content as if for a professional textbook
- Use professional counseling terminology
- Include specific, actionable clinical guidance
- Return ONLY the HTML content, no markdown code blocks`;

    console.log(`Regenerating lesson: ${lessonTitle} (target: ${targetWords} words)`);
    
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8000,
      messages: [{ role: 'user', content: prompt }]
    });
    
    let content = response.content[0].text;
    
    // Clean up any markdown code blocks
    content = content.replace(/```html\s*/gi, '').replace(/```\s*/g, '').trim();
    
    // Update the lesson content in the database
    course.modules[moduleIndex].lessons[lessonIndex].content = content;
    await course.save();
    
    // Calculate actual word count
    const actualWords = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    console.log(`Generated ${actualWords} words for lesson: ${lessonTitle}`);
    
    res.json({ 
      success: true, 
      content,
      wordCount: actualWords,
      targetWords
    });
    
  } catch (error) {
    console.error('Lesson regeneration error:', error);
    res.status(500).json({ error: 'Failed to regenerate lesson: ' + error.message });
  }
});

// @route   POST /api/admin/module/generate
// @desc    Generate content for a SINGLE module (used by CourseBuilder module-by-module generation)
// @access  Admin only
router.post('/module/generate', protect, adminOnly, async (req, res) => {
  try {
    if (!anthropic) {
      return res.status(500).json({ error: 'AI service not configured. Set ANTHROPIC_API_KEY in environment.' });
    }

    const { 
      courseTitle, 
      moduleTitle, 
      moduleNumber, 
      totalModules, 
      ceHours, 
      category, 
      sourceContent, 
      additionalNotes,
      generateQuiz 
    } = req.body;

    if (!moduleTitle) {
      return res.status(400).json({ error: 'moduleTitle is required' });
    }

    const catNames = { core: 'Core/General', ethics: 'Ethics', supervision: 'Supervision', telehealth: 'Telehealth', cultural: 'Cultural Diversity', trauma: 'Trauma', substance: 'Substance Abuse', crisis: 'Crisis/Suicide' };
    const catName = catNames[category] || 'Core/General';

    // Calculate word target for this module
    const totalWords = (ceHours || 3) * 6000;
    const wordsForModule = Math.ceil(totalWords / (totalModules || 6));

    const prompt = `You are an expert instructional designer creating continuing education content for licensed professional counselors.

Generate COMPLETE, DETAILED content for ONE MODULE of a CE course.

COURSE: ${courseTitle || 'Mental Health Counseling CE Course'}
MODULE ${moduleNumber || 1} of ${totalModules || 6}: ${moduleTitle}
CATEGORY: ${catName}
TOTAL COURSE CE HOURS: ${ceHours || 3}

${sourceContent ? `SOURCE CONTENT TO EXPAND:\n${sourceContent.substring(0, 3000)}\n` : ''}
${additionalNotes ? `ADDITIONAL NOTES: ${additionalNotes}\n` : ''}

CRITICAL WORD COUNT REQUIREMENT:
This module MUST contain at least ${wordsForModule.toLocaleString()} words of educational content.
NBCC requires 6,000 words per CE credit hour. Do NOT write brief summaries - write FULL textbook-quality content.

Return ONLY valid JSON in this exact structure:
{
  "title": "${moduleTitle}",
  "description": "2-3 sentence module description",
  "content": "<h2>${moduleTitle}</h2><h3>Introduction</h3><p>Comprehensive opening (200+ words)...</p><h3>Theoretical Foundation</h3><p>Detailed theory section (400+ words)...</p><h3>Key Concepts</h3><p>In-depth concepts with definitions (500+ words)...</p><h3>Clinical Applications</h3><p>Practical techniques and interventions (500+ words)...</p><h3>Case Study</h3><p>Detailed clinical case illustration (400+ words)...</p><h3>Ethical Considerations</h3><p>ACA Code references and guidance (300+ words)...</p><h3>Evidence Base</h3><p>Research findings and citations (300+ words)...</p><h3>Summary</h3><p>Key takeaways (150+ words)...</p>"${generateQuiz !== false ? `,
  "questions": [
    {
      "question": "Detailed scenario-based question?",
      "type": "multiple_choice",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Why this is correct with content reference",
      "points": 1
    }
  ]` : ''}
}

CONTENT REQUIREMENTS:
- Write ${wordsForModule.toLocaleString()}+ words of actual educational content in the "content" field
- Use HTML formatting: <h2>, <h3>, <p>, <ul>, <li>, <strong>, <em>
- Write as if for a professional textbook chapter
- Include specific clinical examples, techniques, and interventions
- Reference the ACA Code of Ethics where relevant
- Include research citations in the text (author, year format)
${generateQuiz !== false ? `- Generate 3-5 quiz questions that test comprehension and application
- Mix question types: multiple_choice, multiple_select, true_false
- Include detailed explanations for all answers` : ''}

Return ONLY the JSON object, no markdown code blocks.`;

    console.log(`Generating module ${moduleNumber}/${totalModules}: ${moduleTitle} (target: ${wordsForModule} words)`);

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 16000,
      messages: [{ role: 'user', content: prompt }]
    });

    const responseText = response.content[0].text;

    let moduleData;
    try {
      let jsonText = responseText.replace(/```json\s*/gi, '').replace(/```\s*/g, '');
      const startIdx = jsonText.indexOf('{');
      const endIdx = jsonText.lastIndexOf('}');
      if (startIdx === -1 || endIdx === -1 || endIdx < startIdx) {
        throw new Error('No JSON found in response');
      }
      jsonText = jsonText.substring(startIdx, endIdx + 1);
      jsonText = jsonText.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');
      moduleData = JSON.parse(jsonText);
    } catch (parseError) {
      console.error('Module parse error:', parseError.message);
      console.error('Response length:', responseText.length);
      
      // AGGRESSIVE SALVAGE: Extract whatever we can
      // Strategy 1: Find the "content" field value even from broken JSON
      const contentFieldMatch = responseText.match(/"content"\s*:\s*"((?:[^"\\]|\\["\\\/bfnrt]|\\u[0-9a-fA-F]{4})*)/);
      if (contentFieldMatch && contentFieldMatch[1].length > 200) {
        let salvaged = contentFieldMatch[1];
        salvaged = salvaged.replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\\\/g, '\\').replace(/\\t/g, '\t');
        // Clean up any trailing broken JSON
        salvaged = salvaged.replace(/",?\s*"(questions|title|description)"[\s\S]*$/, '');
        
        // Extract questions if they exist before the break
        const questions = [];
        const qMatches = [...responseText.matchAll(/"question"\s*:\s*"((?:[^"\\]|\\.)*)"/g)];
        const oMatches = [...responseText.matchAll(/"options"\s*:\s*\[((?:[^\]]*?))\]/g)];
        const cMatches = [...responseText.matchAll(/"correctAnswer"\s*:\s*(\d+)/g)];
        const eMatches = [...responseText.matchAll(/"explanation"\s*:\s*"((?:[^"\\]|\\.)*)"/g)];
        
        for (let qi = 0; qi < qMatches.length; qi++) {
          const opts = oMatches[qi] ? [...oMatches[qi][1].matchAll(/"((?:[^"\\]|\\.)*)"/g)].map(m => m[1].replace(/\\"/g, '"')) : [];
          if (opts.length >= 2) {
            questions.push({
              question: qMatches[qi][1].replace(/\\"/g, '"'),
              type: 'multiple_choice',
              options: opts,
              correctAnswer: cMatches[qi] ? parseInt(cMatches[qi][1]) : 0,
              explanation: eMatches[qi] ? eMatches[qi][1].replace(/\\"/g, '"') : '',
              points: 1
            });
          }
        }
        
        console.log(`SALVAGED from broken JSON: ~${salvaged.replace(/<[^>]*>/g, '').split(/\s+/).length} words, ${questions.length} questions`);
        
        moduleData = {
          title: moduleTitle,
          description: 'Content salvaged from partial AI response',
          content: salvaged,
          questions
        };
      } else {
        // Strategy 2: Find raw HTML content
        const contentMatch = responseText.match(/<h[23]>[\s\S]+/);
        if (contentMatch) {
          moduleData = {
            title: moduleTitle,
            description: '',
            content: contentMatch[0].replace(/```\s*$/g, '').replace(/"[,\s]*$/, ''),
            questions: []
          };
        } else {
          // Strategy 3: Just use everything after the first <p> or <h tag
          const anyHtml = responseText.match(/<(?:p|h\d|ul|ol|div)[^>]*>[\s\S]{200,}/);
          if (anyHtml) {
            moduleData = {
              title: moduleTitle,
              description: '',
              content: anyHtml[0],
              questions: []
            };
          } else {
            return res.status(500).json({ 
              error: 'Failed to parse AI response for this module', 
              salvageAttempted: true,
              responseLength: responseText.length 
            });
          }
        }
      }
    }

    // Count actual words
    const actualWords = (moduleData.content || '').replace(/<[^>]*>/g, '').split(/\s+/).filter(w => w.length > 0).length;
    console.log(`Module ${moduleNumber} generated: ${actualWords} words, ${(moduleData.questions || []).length} questions`);

    res.json({
      success: true,
      module: {
        title: moduleData.title || moduleTitle,
        description: moduleData.description || '',
        content: moduleData.content || '',
        questions: moduleData.questions || [],
        wordCount: actualWords,
        targetWords: wordsForModule
      }
    });

  } catch (error) {
    console.error('Module generation error:', error);
    res.status(500).json({ error: 'Failed to generate module: ' + error.message });
  }
});

export default router;
