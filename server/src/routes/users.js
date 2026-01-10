import express from 'express';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
  try {
    res.json({ user: req.user.toJSON() });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
  try {
    const { firstName, lastName, state, timezone, phone } = req.body;
    
    const user = await User.findById(req.user._id);
    
    if (firstName) user.profile.firstName = firstName;
    if (lastName !== undefined) user.profile.lastName = lastName;
    if (state) user.profile.state = state.toUpperCase();
    if (timezone) user.profile.timezone = timezone;
    if (phone !== undefined) user.profile.phone = phone;
    
    await user.save();
    
    res.json({
      message: 'Profile updated',
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// @route   PUT /api/users/notifications
// @desc    Update notification preferences
// @access  Private
router.put('/notifications', protect, async (req, res) => {
  try {
    const { emailReminders, calendarSync, marketingEmails, reminderFrequency } = req.body;
    
    const user = await User.findById(req.user._id);
    
    if (emailReminders !== undefined) user.notifications.emailReminders = emailReminders;
    if (calendarSync !== undefined) user.notifications.calendarSync = calendarSync;
    if (marketingEmails !== undefined) user.notifications.marketingEmails = marketingEmails;
    if (reminderFrequency) user.notifications.reminderFrequency = reminderFrequency;
    
    await user.save();
    
    res.json({
      message: 'Notification preferences updated',
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Update notifications error:', error);
    res.status(500).json({ error: 'Failed to update notifications' });
  }
});

// @route   DELETE /api/users/account
// @desc    Delete user account
// @access  Private
router.delete('/account', protect, async (req, res) => {
  try {
    const { confirmEmail } = req.body;
    
    // Require email confirmation to delete
    if (confirmEmail !== req.user.email) {
      return res.status(400).json({ error: 'Please confirm your email to delete account' });
    }
    
    // TODO: Cancel Stripe subscription if active
    // TODO: Delete related data (credentials, certificates, progress)
    
    await User.findByIdAndDelete(req.user._id);
    
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ error: 'Failed to delete account' });
  }
});

// @route   GET /api/users/dashboard
// @desc    Get dashboard stats
// @access  Private
router.get('/dashboard', protect, async (req, res) => {
  try {
    // Import models dynamically to avoid circular dependencies
    const Certificate = (await import('../models/Certificate.js')).default;
    const UserCredential = (await import('../models/UserCredential.js')).default;
    
    // Get user's certificates
    const certificates = await Certificate.find({ userId: req.user._id });
    const totalHours = certificates.reduce((sum, c) => sum + (c.ceHours || 0), 0);
    
    // Get user's credentials
    const credentials = await UserCredential.find({ userId: req.user._id });
    
    res.json({
      totalHours: totalHours.toFixed(1),
      coursesCompleted: certificates.filter(c => c.courseId).length,
      certificatesCount: certificates.length,
      credentialsCount: credentials.length,
      user: req.user.toJSON()
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Failed to get dashboard data' });
  }
});

// @route   POST /api/users/promo
// @desc    Apply promo code
// @access  Private
router.post('/promo', protect, async (req, res) => {
  try {
    const { code } = req.body;
    
    if (!code) {
      return res.status(400).json({ error: 'Promo code is required' });
    }
    
    const promoCode = code.toUpperCase().trim();
    
    // Define valid promo codes
    const promoCodes = {
      'CRFREE2026': { plan: 'lifetime', status: 'lifetime', message: 'Lifetime VIP access activated!' },
      'BETATESTER': { plan: 'lifetime', status: 'lifetime', message: 'Thank you for beta testing! Lifetime access activated.' },
      'CRLAUNCH': { plan: 'annual_vip', status: 'active', months: 12, message: '1 year VIP access activated!' },
      'VIPTRIAL': { plan: 'vip', status: 'trial', days: 30, message: '30-day VIP trial activated!' },
      'COUNSELOR2026': { plan: 'vip', status: 'active', months: 6, message: '6 months VIP access activated!' }
    };
    
    const promo = promoCodes[promoCode];
    
    if (!promo) {
      return res.status(400).json({ error: 'Invalid promo code' });
    }
    
    // Check if user already used this code
    if (req.user.subscription.promoCode === promoCode) {
      return res.status(400).json({ error: 'You have already used this promo code' });
    }
    
    // Apply promo
    req.user.subscription.plan = promo.plan;
    req.user.subscription.status = promo.status;
    req.user.subscription.promoCode = promoCode;
    req.user.subscription.promoAppliedAt = new Date();
    
    // Set period dates if applicable
    if (promo.months) {
      req.user.subscription.currentPeriodStart = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + promo.months);
      req.user.subscription.currentPeriodEnd = endDate;
    } else if (promo.days) {
      req.user.subscription.currentPeriodStart = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + promo.days);
      req.user.subscription.trialEndsAt = endDate;
    }
    
    await req.user.save();
    
    res.json({
      message: promo.message,
      subscription: {
        plan: req.user.subscription.plan,
        status: req.user.subscription.status
      }
    });
  } catch (error) {
    console.error('Promo code error:', error);
    res.status(500).json({ error: 'Failed to apply promo code' });
  }
});

export default router;
