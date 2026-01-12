import express from 'express';
import User from '../models/User.js';
import Course from '../models/Course.js';
import Certificate from '../models/Certificate.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

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

// @route   GET /api/admin/users
// @desc    Get all users (paginated)
// @access  Admin only
router.get('/users', protect, adminOnly, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await User.countDocuments();
    
    res.json({
      users,
      page,
      pages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to get users' });
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

export default router;
