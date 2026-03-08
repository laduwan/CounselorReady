/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import { Resend } from 'resend';
import User from '../models/User.js';
import UserActivity from '../models/UserActivity.js';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Admin email(s) to receive notifications
const ADMIN_EMAILS = process.env.ADMIN_NOTIFICATION_EMAILS?.split(',') || ['admin@counselorready.com'];

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
  if (notifyAdmin && resend) {
    await sendAdminNotification(type, data, { userName, userEmail });
  }
  
  return activity;
}

/**
 * Send email notification to admin
 */
async function sendAdminNotification(type, data, userInfo) {
  const { userName, userEmail } = userInfo;
  
  const notifications = {
    [ACTIVITY_TYPES.USER_REGISTERED]: {
      subject: `🎉 New User Registration: ${userName || userEmail}`,
      emoji: '🎉',
      title: 'New User Registered',
      message: `<strong>${userName || 'A new user'}</strong> (${userEmail}) just created an account.`
    },
    [ACTIVITY_TYPES.USER_ENROLLED]: {
      subject: `📚 Course Enrollment: ${userName || userEmail}`,
      emoji: '📚',
      title: 'Course Enrollment',
      message: `<strong>${userName}</strong> enrolled in <strong>${data.courseName}</strong>.`
    },
    [ACTIVITY_TYPES.COURSE_COMPLETED]: {
      subject: `✅ Course Completed: ${userName || userEmail}`,
      emoji: '✅',
      title: 'Course Completed',
      message: `<strong>${userName}</strong> completed <strong>${data.courseName}</strong> (${data.ceHours || 0} CE hours).`
    },
    [ACTIVITY_TYPES.QUIZ_PASSED]: {
      subject: `🎯 Quiz Passed: ${userName || userEmail}`,
      emoji: '🎯',
      title: 'Quiz Passed',
      message: `<strong>${userName}</strong> passed the quiz in <strong>${data.courseName}</strong> with a score of <strong>${data.score}%</strong>.`
    },
    [ACTIVITY_TYPES.QUIZ_FAILED]: {
      subject: `❌ Quiz Failed: ${userName || userEmail}`,
      emoji: '❌',
      title: 'Quiz Failed',
      message: `<strong>${userName}</strong> did not pass the quiz in <strong>${data.courseName}</strong>. Score: <strong>${data.score}%</strong> (needed ${data.passingScore}%).`
    },
    [ACTIVITY_TYPES.SUBSCRIPTION_STARTED]: {
      subject: `💳 New Subscription: ${userName || userEmail}`,
      emoji: '💳',
      title: 'New Subscription',
      message: `<strong>${userName}</strong> subscribed to the <strong>${data.plan?.toUpperCase()}</strong> plan.`
    },
    [ACTIVITY_TYPES.SUBSCRIPTION_CANCELED]: {
      subject: `⚠️ Subscription Canceled: ${userName || userEmail}`,
      emoji: '⚠️',
      title: 'Subscription Canceled',
      message: `<strong>${userName}</strong> canceled their <strong>${data.plan?.toUpperCase()}</strong> subscription.`
    },
    [ACTIVITY_TYPES.CERTIFICATE_GENERATED]: {
      subject: `📜 Certificate Generated: ${userName || userEmail}`,
      emoji: '📜',
      title: 'Certificate Generated',
      message: `<strong>${userName}</strong> generated a certificate for <strong>${data.courseName}</strong>.`
    }
  };
  
  const notification = notifications[type];
  if (!notification) return;
  
  try {
    await resend.emails.send({
      from: 'CounselorReady <notifications@counselorready.com>',
      to: ADMIN_EMAILS,
      subject: notification.subject,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 500px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #4A7C59, #34503d); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #fff; padding: 25px; border: 1px solid #e5e5e5; border-top: none; border-radius: 0 0 10px 10px; }
            .activity-box { background: #f8f9fa; border-left: 4px solid #4A7C59; padding: 15px; margin: 15px 0; border-radius: 0 8px 8px 0; }
            .emoji { font-size: 32px; margin-bottom: 10px; }
            .timestamp { color: #888; font-size: 12px; margin-top: 15px; }
            .cta-button { display: inline-block; background: #8b2542; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 15px; font-weight: 600; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="emoji">${notification.emoji}</div>
              <h2 style="margin: 0;">${notification.title}</h2>
            </div>
            <div class="content">
              <div class="activity-box">
                <p style="margin: 0;">${notification.message}</p>
              </div>
              ${data.details ? `<p style="color: #666; font-size: 14px;">${data.details}</p>` : ''}
              <center>
                <a href="https://counselorready.com/admin-analytics.html" class="cta-button">View Dashboard</a>
              </center>
              <p class="timestamp">📅 ${new Date().toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}</p>
            </div>
          </div>
        </body>
        </html>
      `
    });
    
    console.log(`Admin notification sent: ${type}`);
  } catch (error) {
    console.error('Failed to send admin notification:', error);
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
