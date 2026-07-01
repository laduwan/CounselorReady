/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import User from '../models/User.js';
import UserActivity from '../models/UserActivity.js';
import { sendAdminAlert } from './adminNotificationService.js';

/**
 * Activity types for tracking
 */
export const ACTIVITY_TYPES = {
  USER_REGISTERED: 'user_registered',
  USER_LOGIN: 'user_login',
  USER_ENROLLED: 'user_enrolled',
  PAYMENT_SUCCEEDED: 'payment_succeeded',
  PAYMENT_FAILED: 'payment_failed',
  COURSE_STARTED: 'course_started',
  COURSE_COMPLETED: 'course_completed',
  COURSE_FAILED: 'course_failed',
  QUIZ_PASSED: 'quiz_passed',
  QUIZ_FAILED: 'quiz_failed',
  SUBSCRIPTION_STARTED: 'subscription_started',
  SUBSCRIPTION_CANCELED: 'subscription_canceled',
  CERTIFICATE_GENERATED: 'certificate_generated',
  LESSON_COMPLETED: 'lesson_completed',
  TOOL_USED: 'tool_used'
};

/**
 * Log activity to database and optionally notify admin
 */
export async function logActivity(type, data, options = {}) {
  const { notifyAdmin = true, userId, userName, userEmail } = options;

  const activity = {
    type,
    data,
    userId: userId || undefined,  // null → undefined; prevents ObjectId cast failure on adminActivityFeed push
    userName,
    userEmail,
    timestamp: new Date()
  };

  // Persist to dedicated UserActivity collection (scalable, queryable)
  try {
    await UserActivity.create({
      userId: userId || undefined,
      type,
      userName,
      userEmail,
      courseId: data.courseId || undefined,
      courseName: data.courseName || undefined,
      data,
      timestamp: activity.timestamp
    });
  } catch (error) {
    console.error('Failed to log to UserActivity collection:', error);
  }

  // Also store in admin's activity feed (for backward compatibility)
  try {
    await User.updateMany(
      { role: 'admin' },
      {
        $push: {
          adminActivityFeed: {
            $each: [activity],
            $position: 0,
            $slice: 500 // Keep last 500 activities
          }
        }
      }
    );
  } catch (error) {
    console.error('Failed to log to admin feed:', error);
  }

  // Send branded admin alert — gated by admin's notification preferences
  if (notifyAdmin) {
    // Maps event types to adminNotifPrefs field names
    const PREFS_MAP = {
      user_registered:       'notifyRegistration',
      user_enrolled:         'notifyEnrollment',
      course_completed:      'notifyCompletion',
      quiz_passed:           'notifyQuizPass',
      quiz_failed:           'notifyQuizFail',
      subscription_started:  'notifySubscriptionStart',
      subscription_canceled: 'notifySubscriptionCancel',
      payment_succeeded:     'notifyPayment',
      payment_failed:        'notifyPaymentFail',
      certificate_generated: 'notifyCertificate',
    };
    User.findOne({ role: 'admin' }, 'adminNotifPrefs').lean()
      .then(admin => {
        const raw = admin?.adminNotifPrefs || {};
        const prefs = {};
        for (const [eventType, prefKey] of Object.entries(PREFS_MAP)) {
          prefs[eventType] = raw[prefKey] !== false; // default true if key absent
        }
        sendAdminAlertIfEnabled(prefs, type, { userName, userEmail, ...data });
      })
      .catch(() => {}); // swallow DB error — do not send ungated alert
  }

  return activity;
}

/**
 * Get recent activity for admin dashboard
 */
export async function getRecentActivity(limit = 50) {
  try {
    const admin = await User.findOne({ role: 'admin' }).select('adminActivityFeed');
    return admin?.adminActivityFeed?.slice(0, limit) || [];
  } catch (error) {
    console.error('Failed to get recent activity:', error);
    return [];
  }
}

export default {
  ACTIVITY_TYPES,
  logActivity,
  getRecentActivity
};
