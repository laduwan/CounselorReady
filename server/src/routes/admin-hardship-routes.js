// Add these routes to your admin.js routes file

import User from '../models/User.js';

// @route   GET /api/admin/hardship-metrics
// @desc    Get hardship pause metrics for admin dashboard
// @access  Admin only
router.get('/hardship-metrics', protect, adminOnly, async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    const startOfYear = new Date(currentYear, 0, 1);
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    
    // Get all VIP users
    const vipUsers = await User.find({
      'subscription.plan': { $in: ['vip', 'annual_vip', 'lifetime'] },
      'subscription.status': { $in: ['active', 'paused', 'lifetime'] }
    });
    
    const totalVipMembers = vipUsers.length;
    
    // Active pauses
    const activePauses = vipUsers.filter(u => u.hardshipPause?.isActive).length;
    
    // Pauses used this year
    let pausesUsedYTD = 0;
    let revenueImpact = 0;
    const VIP_MONTHLY_PRICE = 49.99;
    
    vipUsers.forEach(user => {
      const yearPauses = (user.hardshipPause?.history || []).filter(h => 
        new Date(h.usedDate) >= startOfYear
      );
      pausesUsedYTD += yearPauses.length;
    });
    
    revenueImpact = pausesUsedYTD * VIP_MONTHLY_PRICE;
    
    // Retention metrics - users who used a pause and are still active
    const usersWhoUsedPause = vipUsers.filter(u => 
      (u.hardshipPause?.usedTotal || 0) > 0
    );
    
    const retainedMembers = usersWhoUsedPause.filter(u => 
      u.subscription.status === 'active' || u.subscription.status === 'lifetime'
    ).length;
    
    const postPauseRetentionRate = usersWhoUsedPause.length > 0
      ? Math.round((retainedMembers / usersWhoUsedPause.length) * 100)
      : 100;
    
    // Estimated retained annual revenue
    const retainedAnnualRevenue = retainedMembers * VIP_MONTHLY_PRICE * 12;
    
    // Grace period stats
    const inGracePeriod = await User.countDocuments({
      'subscription.paymentFailedAt': { $ne: null },
      'subscription.status': 'past_due'
    });
    
    // Count recovered payments this month (users who had paymentFailedAt cleared)
    // This is a simplified version - you'd want to track this with actual payment events
    const recoveredPaymentsThisMonth = 0; // TODO: Track via webhook events
    
    // Average grace days based on banked months
    let totalGraceDays = 0;
    vipUsers.forEach(user => {
      totalGraceDays += user.getGracePeriodDays ? user.getGracePeriodDays() : 7;
    });
    const avgGraceDays = totalVipMembers > 0 
      ? Math.round(totalGraceDays / totalVipMembers)
      : 7;
    
    // Recent pauses (last 20)
    const recentPauses = [];
    
    for (const user of vipUsers) {
      const history = user.hardshipPause?.history || [];
      for (const pause of history) {
        recentPauses.push({
          usedDate: pause.usedDate,
          reason: pause.reason,
          userEmail: user.email,
          userInitials: getInitials(user.profile?.firstName, user.profile?.lastName),
          bankedAtTime: pause.yearBanked ? `${currentYear - pause.yearBanked}yr` : '0yr',
          stillActive: user.hardshipPause?.isActive,
          stillSubscribed: ['active', 'paused', 'lifetime'].includes(user.subscription.status)
        });
      }
    }
    
    // Sort by date, most recent first, limit to 20
    recentPauses.sort((a, b) => new Date(b.usedDate) - new Date(a.usedDate));
    const limitedRecentPauses = recentPauses.slice(0, 20);
    
    res.json({
      totalVipMembers,
      activePauses,
      pausesUsedYTD,
      revenueImpact: Math.round(revenueImpact),
      retainedMembers,
      postPauseRetentionRate,
      retainedAnnualRevenue: Math.round(retainedAnnualRevenue),
      inGracePeriod,
      recoveredPaymentsThisMonth,
      avgGraceDays,
      recentPauses: limitedRecentPauses
    });
    
  } catch (error) {
    console.error('Admin hardship metrics error:', error);
    res.status(500).json({ error: 'Failed to load hardship metrics' });
  }
});

// @route   GET /api/admin/hardship-export
// @desc    Export hardship pause data as CSV
// @access  Admin only
router.get('/hardship-export', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find({
      'subscription.plan': { $in: ['vip', 'annual_vip', 'lifetime'] }
    }).select('email profile subscription hardshipPause createdAt');
    
    // Build CSV
    const headers = [
      'Email',
      'Name',
      'Plan',
      'Status',
      'Member Since',
      'Available Months',
      'Banked Months',
      'Total Used',
      'Currently Paused',
      'Grace Period Days',
      'Last Pause Date',
      'Last Pause Reason'
    ];
    
    const rows = users.map(user => {
      const lastPause = user.hardshipPause?.history?.slice(-1)[0];
      return [
        user.email,
        `${user.profile?.firstName || ''} ${user.profile?.lastName || ''}`.trim(),
        user.subscription.plan,
        user.subscription.status,
        user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '',
        user.hardshipPause?.available || 0,
        user.hardshipPause?.banked || 0,
        user.hardshipPause?.usedTotal || 0,
        user.hardshipPause?.isActive ? 'Yes' : 'No',
        user.getGracePeriodDays ? user.getGracePeriodDays() : 7,
        lastPause?.usedDate ? new Date(lastPause.usedDate).toLocaleDateString() : '',
        lastPause?.reason || ''
      ];
    });
    
    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n');
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=hardship-pauses-${new Date().toISOString().split('T')[0]}.csv`);
    res.send(csv);
    
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ error: 'Failed to export data' });
  }
});

// Helper function
function getInitials(firstName, lastName) {
  const first = firstName ? firstName.charAt(0).toUpperCase() : '';
  const last = lastName ? lastName.charAt(0).toUpperCase() : '';
  return first + last || '?';
}

// Middleware to check admin role
function adminOnly(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}
