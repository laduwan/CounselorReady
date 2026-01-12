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

// Import models for dashboard
import Certificate from '../models/Certificate.js';
import UserCredential from '../models/UserCredential.js';
import UserCourseProgress from '../models/UserCourseProgress.js';
import Course from '../models/Course.js';

// @route   GET /api/users/dashboard
// @desc    Get dashboard stats and data
// @access  Private
router.get('/dashboard', protect, async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Get certificates
    const certificates = await Certificate.find({ userId });
    const certificatesCount = certificates.length;
    const totalHours = certificates.reduce((sum, c) => sum + (c.ceHours || 0), 0);
    
    // Get credentials
    const credentials = await UserCredential.find({ userId });
    const credentialsCount = credentials.length;
    
    // Get course progress
    const courseProgress = await UserCourseProgress.find({ userId })
      .populate('courseId', 'title slug thumbnail ceHours');
    const coursesCompleted = courseProgress.filter(p => p.completed).length;
    const inProgressCourses = courseProgress.filter(p => !p.completed && p.status === 'in_progress');
    
    // CE Progress per credential
    const ceProgress = credentials.map(cred => ({
      id: cred._id,
      name: cred.name,
      state: cred.state,
      completed: cred.totalCEUsCompleted || 0,
      required: cred.totalCEUsRequired || 0,
      percent: cred.totalCEUsRequired > 0 
        ? Math.min(100, Math.round((cred.totalCEUsCompleted || 0) / cred.totalCEUsRequired * 100))
        : 0,
      expirationDate: cred.expirationDate
    }));
    
    // Upcoming renewals (within 90 days)
    const now = new Date();
    const ninetyDaysFromNow = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);
    const upcomingRenewals = credentials
      .filter(c => c.expirationDate && new Date(c.expirationDate) <= ninetyDaysFromNow && new Date(c.expirationDate) > now)
      .map(c => ({
        id: c._id,
        name: c.name,
        state: c.state,
        expirationDate: c.expirationDate,
        daysLeft: Math.ceil((new Date(c.expirationDate) - now) / (1000 * 60 * 60 * 24))
      }))
      .sort((a, b) => a.daysLeft - b.daysLeft);
    
    // Recent activity (last 10 items)
    const recentCertificates = certificates
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
      .map(c => ({
        type: 'certificate',
        title: c.title,
        date: c.createdAt,
        ceHours: c.ceHours
      }));
    
    const recentCourseActivity = courseProgress
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, 5)
      .map(p => ({
        type: p.completed ? 'course_complete' : 'course_progress',
        title: p.courseId?.title || 'Unknown Course',
        date: p.updatedAt,
        progress: p.progressPercent || 0
      }));
    
    const recentActivity = [...recentCertificates, ...recentCourseActivity]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10);
    
    res.json({
      totalHours,
      certificatesCount,
      credentialsCount,
      coursesCompleted,
      inProgressCourses: inProgressCourses.map(p => ({
        courseId: p.courseId?._id,
        title: p.courseId?.title,
        slug: p.courseId?.slug,
        thumbnail: p.courseId?.thumbnail,
        progress: p.progressPercent || 0
      })),
      ceProgress,
      upcomingRenewals,
      recentActivity
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Failed to load dashboard data' });
  }
});

// ============================================
// HARDSHIP PAUSE ROUTES
// ============================================

import { sendHardshipPauseActivatedEmail, sendPauseEndedEmail } from '../services/hardshipEmailService.js';

// Helper: Check and perform annual rollover if needed
async function checkAndRollover(user) {
  const currentYear = new Date().getFullYear();
  
  // Skip if already rolled over this year
  if (user.hardshipPause?.lastRolloverYear === currentYear) {
    return false;
  }
  
  // Skip if user is new this year (no previous year to rollover from)
  const memberYear = new Date(user.memberSince || user.createdAt).getFullYear();
  if (memberYear === currentYear && !user.hardshipPause?.lastRolloverYear) {
    if (!user.hardshipPause) user.hardshipPause = {};
    user.hardshipPause.lastRolloverYear = currentYear;
    await user.save();
    return false;
  }
  
  // Perform rollover if method exists
  if (user.rolloverHardshipMonth) {
    await user.rolloverHardshipMonth();
    return true;
  }
  return false;
}

// @route   GET /api/users/hardship-status
// @desc    Get hardship pause status for dashboard
// @access  Private (VIP only)
router.get('/hardship-status', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    // Check if VIP
    const isVip = user.isVip ? user.isVip() : user.subscription?.plan === 'vip';
    
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
    
    const totalMonths = user.getTotalHardshipMonths ? user.getTotalHardshipMonths() : 
      (user.hardshipPause?.available || 0) + (user.hardshipPause?.banked || 0);
    const gracePeriodDays = user.getGracePeriodDays ? user.getGracePeriodDays() : 7;
    
    res.json({
      isVip: true,
      totalMonths,
      available: user.hardshipPause?.available || 0,
      banked: user.hardshipPause?.banked || 0,
      usedTotal: user.hardshipPause?.usedTotal || 0,
      history: user.hardshipPause?.history || [],
      isActive: user.hardshipPause?.isActive || false,
      pauseStartDate: user.hardshipPause?.pauseStartDate,
      pauseEndDate: user.hardshipPause?.pauseEndDate,
      gracePeriodDays,
      paymentFailed: !!user.subscription?.paymentFailedAt,
      graceDaysRemaining: user.getGracePeriodRemaining ? user.getGracePeriodRemaining() : 0,
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
    if (user.canUseHardshipPause) {
      const canUse = user.canUseHardshipPause();
      if (!canUse.allowed) {
        return res.status(400).json({ 
          error: canUse.reason,
          monthsAvailable: user.getTotalHardshipMonths ? user.getTotalHardshipMonths() : 0
        });
      }
    }
    
    // Activate pause
    if (user.useHardshipPause) {
      await user.useHardshipPause(reason);
    } else {
      // Manual fallback
      if (!user.hardshipPause) user.hardshipPause = {};
      user.hardshipPause.isActive = true;
      user.hardshipPause.pauseStartDate = new Date();
      user.hardshipPause.pauseEndDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      await user.save();
    }
    
    // TODO: Pause Stripe subscription
    // await pauseStripeSubscription(user.subscription.stripeSubscriptionId);
    
    // Send confirmation email
    await sendHardshipPauseActivatedEmail(user._id);
    
    res.json({
      success: true,
      message: 'Hardship pause activated',
      pauseEndDate: user.hardshipPause.pauseEndDate,
      monthsRemaining: user.getTotalHardshipMonths ? user.getTotalHardshipMonths() : 0
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
    
    if (!user.hardshipPause?.isActive) {
      return res.status(400).json({ error: 'No active hardship pause' });
    }
    
    if (user.endHardshipPause) {
      await user.endHardshipPause();
    } else {
      user.hardshipPause.isActive = false;
      user.hardshipPause.pauseStartDate = null;
      user.hardshipPause.pauseEndDate = null;
      await user.save();
    }
    
    // TODO: Resume Stripe subscription
    // await resumeStripeSubscription(user.subscription.stripeSubscriptionId);
    
    // Send confirmation email
    await sendPauseEndedEmail(user._id);
    
    res.json({
      success: true,
      message: 'Hardship pause ended'
    });
    
  } catch (error) {
    console.error('End hardship pause error:', error);
    res.status(500).json({ error: 'Failed to end hardship pause' });
  }
});

export default router;
