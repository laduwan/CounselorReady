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

export default router;
