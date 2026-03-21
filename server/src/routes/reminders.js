/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import express from 'express';
import Notification from '../models/Notification.js';
import { protect } from '../middleware/auth.js';
import { sendTestReminder, checkAndSendReminders } from '../services/reminderService.js';

const router = express.Router();

// @route   GET /api/reminders/notifications
// @desc    Get user's notifications
// @access  Private
router.get('/notifications', protect, async (req, res) => {
  try {
    const { limit = 20, unreadOnly = false } = req.query;
    
    const query = { userId: req.user._id, dismissed: false };
    if (unreadOnly === 'true') {
      query.read = false;
    }
    
    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));
    
    const unreadCount = await Notification.getUnreadCount(req.user._id);
    
    res.json({ 
      notifications,
      unreadCount
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ error: 'Failed to get notifications' });
  }
});

// @route   GET /api/reminders/unread-count
// @desc    Get unread notification count
// @access  Private
router.get('/unread-count', protect, async (req, res) => {
  try {
    const count = await Notification.getUnreadCount(req.user._id);
    res.json({ count });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({ error: 'Failed to get unread count' });
  }
});

// @route   PUT /api/reminders/notifications/:id/read
// @desc    Mark notification as read
// @access  Private
router.put('/notifications/:id/read', protect, async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { read: true },
      { new: true }
    );
    
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    
    res.json({ notification });
  } catch (error) {
    console.error('Mark read error:', error);
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
});

// @route   PUT /api/reminders/mark-all-read
// @desc    Mark all notifications as read
// @access  Private
router.put('/mark-all-read', protect, async (req, res) => {
  try {
    await Notification.markAllRead(req.user._id);
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Mark all read error:', error);
    res.status(500).json({ error: 'Failed to mark all as read' });
  }
});

// @route   DELETE /api/reminders/notifications/:id
// @desc    Dismiss a notification
// @access  Private
router.delete('/notifications/:id', protect, async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { dismissed: true },
      { new: true }
    );
    
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    
    res.json({ message: 'Notification dismissed' });
  } catch (error) {
    console.error('Dismiss notification error:', error);
    res.status(500).json({ error: 'Failed to dismiss notification' });
  }
});

// @route   POST /api/reminders/test/:credentialId
// @desc    Send a test reminder for a credential
// @access  Private
router.post('/test/:credentialId', protect, async (req, res) => {
  try {
    const result = await sendTestReminder(req.user._id, req.params.credentialId);
    res.json(result);
  } catch (error) {
    console.error('Test reminder error:', error);
    res.status(500).json({ error: 'Failed to send test reminder' });
  }
});

// @route   POST /api/reminders/run-check
// @desc    Manually run the reminder check (admin only)
// @access  Private
router.post('/run-check', protect, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    
    await checkAndSendReminders();
    res.json({ message: 'Reminder check completed' });
  } catch (error) {
    console.error('Run check error:', error);
    res.status(500).json({ error: 'Failed to run reminder check' });
  }
});

// ============================================
// CALENDAR (ICS) ROUTES
// ============================================

import UserCredential from '../models/UserCredential.js';
import User from '../models/User.js';
import { generateCredentialICS, generateAllCredentialsICS, generateInsuranceICS } from '../services/calendarService.js';
import { sendTestSMS, sendSMSReminder } from '../services/calendarSmsService.js';

// @route   GET /api/reminders/calendar/insurance
// @desc    Download ICS calendar file for insurance renewal
// @access  Private
// NOTE: This route must be defined BEFORE /calendar/:credentialId to avoid "insurance" matching as a credentialId
router.get('/calendar/insurance', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user.liabilityInsurance || (!user.liabilityInsurance.expirationDate && !user.liabilityInsurance.renewalDate)) {
      return res.status(400).json({ error: 'No insurance renewal date set' });
    }

    const icsContent = generateInsuranceICS(user.liabilityInsurance, user);

    res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="insurance_renewal_reminder.ics"');
    res.send(icsContent);
  } catch (error) {
    console.error('Generate insurance calendar error:', error);
    res.status(500).json({ error: 'Failed to generate calendar file' });
  }
});

// @route   GET /api/reminders/calendar/all
// @desc    Download ICS calendar file with ALL credential renewals + insurance
// @access  Private
router.get('/calendar/all', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const credentials = await UserCredential.find({ userId: req.user._id });

    const credentialsWithDates = credentials.filter(c => c.expirationDate);
    if (!credentialsWithDates.length && !user.liabilityInsurance?.expirationDate) {
      return res.status(400).json({ error: 'No credentials or insurance with expiration dates found' });
    }

    const icsContent = generateAllCredentialsICS(user, credentials);

    res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="counselorready_all_renewals.ics"');
    res.send(icsContent);
  } catch (error) {
    console.error('Generate all calendars error:', error);
    res.status(500).json({ error: 'Failed to generate calendar file' });
  }
});

// @route   GET /api/reminders/calendar/:credentialId
// @desc    Download ICS calendar file for credential expiration
// @access  Private
router.get('/calendar/:credentialId', protect, async (req, res) => {
  try {
    const credential = await UserCredential.findOne({
      _id: req.params.credentialId,
      userId: req.user._id
    });

    if (!credential) {
      return res.status(404).json({ error: 'Credential not found' });
    }

    if (!credential.expirationDate) {
      return res.status(400).json({ error: 'No expiration date set for this credential' });
    }

    const icsContent = generateCredentialICS(credential, req.user);

    res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${credential.name.replace(/[^a-zA-Z0-9]/g, '_')}_reminder.ics"`);
    res.send(icsContent);
  } catch (error) {
    console.error('Generate calendar error:', error);
    res.status(500).json({ error: 'Failed to generate calendar file' });
  }
});

// ============================================
// SMS REMINDER ROUTES (VIP ONLY)
// ============================================

// @route   POST /api/reminders/sms/enable
// @desc    Enable/disable SMS reminders
// @access  Private (VIP only)
router.post('/sms/enable', protect, async (req, res) => {
  try {
    const { enabled, phone } = req.body;
    
    // Check if user is VIP
    if (req.user.subscription?.plan !== 'vip') {
      return res.status(403).json({ 
        error: 'SMS reminders are a VIP feature',
        upgradeRequired: true
      });
    }
    
    const updates = { smsReminders: enabled };
    if (phone) {
      updates.phone = phone;
    }
    
    // If enabling without phone, check if phone exists
    if (enabled && !phone && !req.user.phone) {
      return res.status(400).json({ error: 'Phone number required to enable SMS reminders' });
    }
    
    await User.findByIdAndUpdate(req.user._id, updates);
    
    res.json({ 
      message: enabled ? 'SMS reminders enabled' : 'SMS reminders disabled',
      smsReminders: enabled
    });
  } catch (error) {
    console.error('Enable SMS error:', error);
    res.status(500).json({ error: 'Failed to update SMS settings' });
  }
});

// @route   POST /api/reminders/sms/test
// @desc    Send a test SMS to verify phone number
// @access  Private (VIP only)
router.post('/sms/test', protect, async (req, res) => {
  try {
    const { phone } = req.body;
    
    // Check if user is VIP
    if (req.user.subscription?.plan !== 'vip') {
      return res.status(403).json({ 
        error: 'SMS reminders are a VIP feature',
        upgradeRequired: true
      });
    }
    
    if (!phone) {
      return res.status(400).json({ error: 'Phone number required' });
    }
    
    const result = await sendTestSMS(phone);
    
    if (result.success) {
      // Save phone number if test successful
      await User.findByIdAndUpdate(req.user._id, { phone });
      res.json({ message: 'Test SMS sent successfully' });
    } else {
      res.status(400).json({ error: result.error || 'Failed to send test SMS' });
    }
  } catch (error) {
    console.error('Test SMS error:', error);
    res.status(500).json({ error: 'Failed to send test SMS' });
  }
});

// @route   PUT /api/reminders/phone
// @desc    Update phone number
// @access  Private
router.put('/phone', protect, async (req, res) => {
  try {
    const { phone } = req.body;
    
    await User.findByIdAndUpdate(req.user._id, { phone: phone || null });
    
    res.json({ message: 'Phone number updated' });
  } catch (error) {
    console.error('Update phone error:', error);
    res.status(500).json({ error: 'Failed to update phone number' });
  }
});

export default router;
