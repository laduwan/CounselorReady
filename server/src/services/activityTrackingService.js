/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import { Resend } from 'resend';
import User from '../models/User.js';
import UserActivity from '../models/UserActivity.js';
import { sendAdminAlert } from './adminNotificationService.js';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

if (!resend) {
  console.warn('[ActivityTracking] RESEND_API_KEY not set — admin email notifications are disabled');
}

// Admin email to receive notifications
const ADMIN_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL || 'admin@counselorready.com';

if (!process.env.ADMIN_NOTIFICATION_EMAIL) {
  console.warn(`[ActivityTracking] ADMIN_NOTIFICATION_EMAIL not set — defaulting to ${ADMIN_EMAIL}`);
}

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
  LESSON_COMPLETED: 'lesson_completed'
};

/**
 * Log activity to database and optionally notify admin
 */
export async function logActivity(type, data, options = {}) {
  const { notifyAdmin = true, userId, userName, userEmail } = options;
  
  const activity = {
    type,
    data,
    userId,
    userName,
    userEmail,
    timestamp: new Date()
  };
  
  // Persist to dedicated UserActivity collection (scalable, queryable)
  try {
    await UserActivity.create({
      userId,
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
  
  // Send email notification if enabled
  if (notifyAdmin) {
    if (resend) {
      await sendAdminNotification(type, data, { userName, userEmail });
    } else {
      console.warn(`[ActivityTracking] Skipping admin notification for ${type} — Resend not configured`);
    }

    // Fire branded admin alert (non-blocking, never throws)
    sendAdminAlert(type, { userName, userEmail, ...data });
  }

  return activity;
}

/**
 * Build subject line for admin notification (only for key event types)
 */
function getNotificationSubject(type, data, userInfo) {
  const { userEmail } = userInfo;
  switch (type) {
    case ACTIVITY_TYPES.USER_REGISTERED:
      return `New Registration: ${userEmail}`;
    case ACTIVITY_TYPES.USER_ENROLLED:
      return `New Enrollment: ${userEmail} enrolled in ${data.courseName || 'a course'}`;
    case ACTIVITY_TYPES.COURSE_COMPLETED:
      return `Course Completed: ${userEmail} completed ${data.courseName || 'a course'}`;
    case ACTIVITY_TYPES.CERTIFICATE_GENERATED:
      return `Certificate Earned: ${userEmail} - ${data.courseName || 'a course'}`;
    case ACTIVITY_TYPES.SUBSCRIPTION_STARTED:
      return `New Subscription: ${userEmail} - ${data.plan || 'unknown plan'}`;
    case ACTIVITY_TYPES.SUBSCRIPTION_CANCELED:
      return `Subscription Canceled: ${userEmail}`;
    default:
      return null;
  }
}

/**
 * Send plain email notification to admin for key activity events
 */
async function sendAdminNotification(type, data, userInfo) {
  const subject = getNotificationSubject(type, data, userInfo);
  if (!subject) return; // Not a notifiable event type

  try {
    const timestamp = new Date().toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' });
    await resend.emails.send({
      from: 'CounselorReady <noreply@counselorready.com>',
      to: ADMIN_EMAIL,
      subject,
      html: `<p>${subject}</p><p>Time: ${timestamp}</p><p><a href="https://counselorready.com/admin-analytics.html">View Admin Dashboard</a></p>`
    });

    console.log(`Admin notification sent: ${type}`);
  } catch (error) {
    console.error(`[ActivityTracking] Failed to send admin notification for ${type}:`, error.message || error);
  }
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
