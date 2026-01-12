// Add these routes to your users.js routes file

// @route   GET /api/users/hardship-status
// @desc    Get hardship pause status for dashboard
// @access  Private (VIP only)
router.get('/hardship-status', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    // Check if VIP
    const isVip = user.isVip();
    
    if (!isVip) {
      return res.json({
        isVip: false,
        totalMonths: 0,
        available: 0,
        banked: 0
      });
    }
    
    // Check for annual rollover
    await checkAndRollover(user);
    
    const totalMonths = user.getTotalHardshipMonths();
    const gracePeriodDays = user.getGracePeriodDays();
    
    res.json({
      isVip: true,
      totalMonths,
      available: user.hardshipPause.available || 0,
      banked: user.hardshipPause.banked || 0,
      usedTotal: user.hardshipPause.usedTotal || 0,
      history: user.hardshipPause.history || [],
      isActive: user.hardshipPause.isActive || false,
      pauseStartDate: user.hardshipPause.pauseStartDate,
      pauseEndDate: user.hardshipPause.pauseEndDate,
      gracePeriodDays,
      paymentFailed: !!user.subscription.paymentFailedAt,
      graceDaysRemaining: user.getGracePeriodRemaining(),
      memberSince: user.memberSince || user.createdAt
    });
    
  } catch (error) {
    console.error('Hardship status error:', error);
    res.status(500).json({ error: 'Failed to get hardship status' });
  }
});

// @route   POST /api/users/hardship-pause
// @desc    Activate a hardship pause
// @access  Private (VIP only)
router.post('/hardship-pause', protect, async (req, res) => {
  try {
    const { reason } = req.body;
    const user = await User.findById(req.user._id);
    
    // Validate eligibility
    const canUse = user.canUseHardshipPause();
    if (!canUse.allowed) {
      return res.status(400).json({ 
        error: canUse.reason,
        monthsAvailable: user.getTotalHardshipMonths()
      });
    }
    
    // Activate pause
    await user.useHardshipPause(reason);
    
    // TODO: Pause Stripe subscription
    // await pauseStripeSubscription(user.subscription.stripeSubscriptionId);
    
    res.json({
      success: true,
      message: 'Hardship pause activated',
      pauseEndDate: user.hardshipPause.pauseEndDate,
      monthsRemaining: user.getTotalHardshipMonths()
    });
    
  } catch (error) {
    console.error('Hardship pause error:', error);
    res.status(500).json({ error: error.message || 'Failed to activate hardship pause' });
  }
});

// @route   POST /api/users/end-hardship-pause
// @desc    End a hardship pause early (optional)
// @access  Private
router.post('/end-hardship-pause', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user.hardshipPause.isActive) {
      return res.status(400).json({ error: 'No active hardship pause' });
    }
    
    await user.endHardshipPause();
    
    // TODO: Resume Stripe subscription
    // await resumeStripeSubscription(user.subscription.stripeSubscriptionId);
    
    res.json({
      success: true,
      message: 'Hardship pause ended'
    });
    
  } catch (error) {
    console.error('End hardship pause error:', error);
    res.status(500).json({ error: 'Failed to end hardship pause' });
  }
});

// Helper: Check and perform annual rollover if needed
async function checkAndRollover(user) {
  const currentYear = new Date().getFullYear();
  
  // Skip if already rolled over this year
  if (user.hardshipPause.lastRolloverYear === currentYear) {
    return false;
  }
  
  // Skip if user is new this year (no previous year to rollover from)
  const memberYear = new Date(user.memberSince || user.createdAt).getFullYear();
  if (memberYear === currentYear && !user.hardshipPause.lastRolloverYear) {
    user.hardshipPause.lastRolloverYear = currentYear;
    await user.save();
    return false;
  }
  
  // Perform rollover
  await user.rolloverHardshipMonth();
  return true;
}

// ============================================
// WEBHOOK HANDLERS (for Stripe integration)
// ============================================

// Call this when Stripe payment fails
async function handleStripePaymentFailed(stripeCustomerId) {
  try {
    const user = await User.findOne({ 'subscription.stripeCustomerId': stripeCustomerId });
    if (!user) return;
    
    await user.handlePaymentFailure();
    
    // Send email notification with grace period info
    const graceDays = user.getGracePeriodDays();
    console.log(`Payment failed for ${user.email}. Grace period: ${graceDays} days.`);
    
    // TODO: Send email
    // await sendPaymentFailedEmail(user.email, graceDays);
    
  } catch (error) {
    console.error('Handle payment failed error:', error);
  }
}

// Call this when Stripe payment succeeds after failure
async function handleStripePaymentRecovered(stripeCustomerId) {
  try {
    const user = await User.findOne({ 'subscription.stripeCustomerId': stripeCustomerId });
    if (!user) return;
    
    if (user.subscription.paymentFailedAt) {
      await user.handlePaymentRecovered();
      console.log(`Payment recovered for ${user.email}. Banked months preserved!`);
      
      // TODO: Send success email
      // await sendPaymentRecoveredEmail(user.email);
    }
    
  } catch (error) {
    console.error('Handle payment recovered error:', error);
  }
}

// Call this via cron job to check grace period expirations
async function checkGracePeriodExpirations() {
  try {
    const usersWithFailedPayments = await User.find({
      'subscription.paymentFailedAt': { $ne: null },
      'subscription.status': 'past_due'
    });
    
    for (const user of usersWithFailedPayments) {
      if (!user.isWithinGracePeriod()) {
        console.log(`Grace period expired for ${user.email}. Resetting banked months.`);
        await user.handleGracePeriodExpired();
        
        // TODO: Send expiration email
        // await sendGracePeriodExpiredEmail(user.email);
      }
    }
    
  } catch (error) {
    console.error('Check grace period expirations error:', error);
  }
}

// Call this via cron job to check and end expired hardship pauses
async function checkHardshipPauseExpirations() {
  try {
    const usersWithActivePause = await User.find({
      'hardshipPause.isActive': true,
      'hardshipPause.pauseEndDate': { $lte: new Date() }
    });
    
    for (const user of usersWithActivePause) {
      console.log(`Hardship pause ended for ${user.email}`);
      await user.endHardshipPause();
      
      // TODO: Resume Stripe subscription
      // await resumeStripeSubscription(user.subscription.stripeSubscriptionId);
      
      // TODO: Send email
      // await sendPauseEndedEmail(user.email);
    }
    
  } catch (error) {
    console.error('Check hardship pause expirations error:', error);
  }
}

// Export helper functions for use in webhooks/crons
export {
  handleStripePaymentFailed,
  handleStripePaymentRecovered,
  checkGracePeriodExpirations,
  checkHardshipPauseExpirations
};
