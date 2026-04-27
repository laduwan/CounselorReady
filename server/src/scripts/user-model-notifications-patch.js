// ============================================================================
// DROP-IN: Replace the `notifications` field in server/src/models/User.js
// 
// Find the existing `notifications: { ... }` block and replace it entirely
// with everything below (from `notifications: {` to the closing `}`).
//
// Also ensure these fields exist on the User schema (add if missing):
//   phone: String,
//   smsVerified: { type: Boolean, default: false },
//   smsRemindersEnabled: { type: Boolean, default: false },
// ============================================================================

notifications: {
  // ── Email Notification Preferences ──
  email: {
    // Course activity
    courseCompleted: { type: Boolean, default: true },
    certificateReady: { type: Boolean, default: true },
    courseReminder: { type: Boolean, default: true },

    // CE tracking
    ceRenewalReminders: { type: Boolean, default: true },
    ceMilestones: { type: Boolean, default: true },
    lowHoursAlert: { type: Boolean, default: true },

    // Credential-specific
    credentialExpiring: { type: Boolean, default: true },
    insuranceExpiring: { type: Boolean, default: true },

    // Platform
    newCourseAnnouncements: { type: Boolean, default: true },
    promotions: { type: Boolean, default: false },
    platformUpdates: { type: Boolean, default: false },
    weeklyDigest: { type: Boolean, default: false },
  },

  // ── SMS Notification Preferences ──
  sms: {
    enabled: { type: Boolean, default: false },
    ceRenewalReminders: { type: Boolean, default: true },
    lowHoursAlert: { type: Boolean, default: true },
    credentialExpiring: { type: Boolean, default: true },
    insuranceExpiring: { type: Boolean, default: true },
    courseCompleted: { type: Boolean, default: false },
    ceMilestones: { type: Boolean, default: false },
  },

  // ── Timing Preferences ──
  timing: {
    reminderDays: {
      type: [Number],
      default: [90, 30, 7]
    },
    lowHoursThreshold: {
      type: Number,
      default: 60
    },
    insuranceReminderDays: {
      type: [Number],
      default: [30, 14]
    },
    quietHoursStart: { type: String, default: null },
    quietHoursEnd: { type: String, default: null },
  },

  // ── In-App Preferences ──
  inApp: {
    showBannerAnnouncements: { type: Boolean, default: true },
    showCourseProgress: { type: Boolean, default: true },
    showCeTracker: { type: Boolean, default: true },
  },

  // ── Global ──
  unsubscribeAll: { type: Boolean, default: false },
  lastUpdated: { type: Date, default: Date.now }
}
