// ============================================================================
// DROP-IN: Replace these two routes in server/src/routes/auth.js
//
// 1. Replace the existing PUT /update-notifications route
// 2. Add the GET /notification-preferences route if it doesn't exist
// ============================================================================

// PUT /api/auth/update-notifications - Update notification preferences
router.put('/update-notifications', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { email, sms, timing, inApp, unsubscribeAll } = req.body;

    // ── Email preferences ──
    if (email && typeof email === 'object') {
      const allowedEmailKeys = [
        'courseCompleted', 'certificateReady', 'courseReminder',
        'ceRenewalReminders', 'ceMilestones', 'lowHoursAlert',
        'credentialExpiring', 'insuranceExpiring',
        'newCourseAnnouncements', 'promotions', 'platformUpdates', 'weeklyDigest'
      ];

      for (const key of allowedEmailKeys) {
        if (key in email && typeof email[key] === 'boolean') {
          user.notifications.email[key] = email[key];
        }
      }
    }

    // ── SMS preferences ──
    if (sms && typeof sms === 'object') {
      if (typeof sms.enabled === 'boolean') {
        user.notifications.sms.enabled = sms.enabled;
      }

      const allowedSmsKeys = [
        'ceRenewalReminders', 'lowHoursAlert', 'credentialExpiring',
        'insuranceExpiring', 'courseCompleted', 'ceMilestones'
      ];

      for (const key of allowedSmsKeys) {
        if (key in sms && typeof sms[key] === 'boolean') {
          user.notifications.sms[key] = sms[key];
        }
      }
    }

    // ── Timing preferences ──
    if (timing && typeof timing === 'object') {
      if (Array.isArray(timing.reminderDays)) {
        const validDays = [7, 14, 30, 60, 90];
        user.notifications.timing.reminderDays = timing.reminderDays.filter(d => validDays.includes(d));
      }
      if (typeof timing.lowHoursThreshold === 'number' && timing.lowHoursThreshold >= 14 && timing.lowHoursThreshold <= 180) {
        user.notifications.timing.lowHoursThreshold = timing.lowHoursThreshold;
      }
      if (Array.isArray(timing.insuranceReminderDays)) {
        const validDays = [7, 14, 30, 60];
        user.notifications.timing.insuranceReminderDays = timing.insuranceReminderDays.filter(d => validDays.includes(d));
      }
      if (timing.quietHoursStart !== undefined) {
        user.notifications.timing.quietHoursStart = timing.quietHoursStart;
      }
      if (timing.quietHoursEnd !== undefined) {
        user.notifications.timing.quietHoursEnd = timing.quietHoursEnd;
      }
    }

    // ── In-app preferences ──
    if (inApp && typeof inApp === 'object') {
      const allowedInAppKeys = ['showBannerAnnouncements', 'showCourseProgress', 'showCeTracker'];
      for (const key of allowedInAppKeys) {
        if (key in inApp && typeof inApp[key] === 'boolean') {
          user.notifications.inApp[key] = inApp[key];
        }
      }
    }

    // ── Global unsubscribe ──
    if (typeof unsubscribeAll === 'boolean') {
      user.notifications.unsubscribeAll = unsubscribeAll;
    }

    // Timestamp
    user.notifications.lastUpdated = new Date();

    // KEY FIX: Mongoose doesn't auto-detect nested object changes
    user.markModified('notifications');

    await user.save();

    res.json({
      message: 'Notification preferences updated',
      notifications: user.notifications
    });
  } catch (error) {
    console.error('Update notifications error:', error);
    res.status(500).json({ message: 'Failed to update notification preferences' });
  }
});

// GET /api/auth/notification-preferences - Fetch current preferences
router.get('/notification-preferences', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('notifications phone');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ notifications: user.notifications, phone: user.phone || '' });
  } catch (error) {
    console.error('Get notification preferences error:', error);
    res.status(500).json({ message: 'Failed to fetch notification preferences' });
  }
});
