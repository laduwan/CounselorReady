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

export default router;
