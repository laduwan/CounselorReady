// ============================================================================
// NEW FILE: server/src/services/notificationTriggerService.js
//
// Drop this file in as-is. Handles all notification email AND SMS triggers.
// Each function checks user preferences before sending.
//
// USAGE:
//   import { triggerCourseCompleted } from './notificationTriggerService.js';
//   await triggerCourseCompleted(userId, { courseTitle, ceHours, contentArea });
//
// DEPENDS ON:
//   - Your existing Resend email setup (emailService.js)
//   - Your existing Twilio setup (reminderService.js)
// ============================================================================

import User from '../models/User.js';
import Notification from '../models/Notification.js';
import { sendEmail } from './emailService.js';
import { sendSMSReminder } from './reminderService.js';

const FRONTEND_URL = process.env.FRONTEND_URL || 'https://counselorready.com';

// ── Helpers ──

function shouldSendEmail(user, preferenceKey) {
  if (!user.notifications) return true;
  if (user.notifications.unsubscribeAll) return false;
  const value = preferenceKey.split('.').reduce((obj, key) => obj?.[key], user.notifications);
  return value !== false;
}

function shouldSendSms(user, preferenceKey) {
  if (!user.notifications) return false;
  if (user.notifications.unsubscribeAll) return false;
  if (!user.notifications.sms?.enabled) return false;
  if (!user.phone) return false;
  const value = preferenceKey.split('.').reduce((obj, key) => obj?.[key], user.notifications);
  return value !== false;
}

async function createInAppNotification({ userId, type, title, message, urgency = 'info', courseId = null, credentialId = null, actionUrl = null, metadata = null }) {
  try {
    return await Notification.create({
      userId, type, title, message, urgency, courseId, credentialId, actionUrl, metadata
    });
  } catch (err) {
    console.error('Failed to create in-app notification:', err);
  }
}

const UNSUB_LINK = `<hr style="margin: 24px 0; border: none; border-top: 1px solid #ddd;" /><p style="font-size: 13px; color: #888;"><a href="${FRONTEND_URL}/settings.html#notifications">Update email preferences</a></p>`;

function emailWrap(content) {
  return `<div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto;">${content}${UNSUB_LINK}</div>`;
}


// ============================================================================
// COURSE ACTIVITY TRIGGERS
// ============================================================================

export async function triggerCourseCompleted(userId, { courseTitle, ceHours, contentArea }) {
  const user = await User.findById(userId);
  if (!user) return;

  await createInAppNotification({
    userId,
    type: 'course_completed',
    title: 'Course Completed!',
    message: `You completed "${courseTitle}" and earned ${ceHours} CE hours (${contentArea}).`,
    actionUrl: `${FRONTEND_URL}/certificates.html`
  });

  if (shouldSendEmail(user, 'email.courseCompleted')) {
    await sendEmail({
      to: user.email,
      subject: `✅ Course Completed: ${courseTitle}`,
      html: emailWrap(`
        <h2 style="color: #2D4A3E;">Congratulations, ${user.firstName}!</h2>
        <p>You've completed <strong>${courseTitle}</strong> and earned <strong>${ceHours} CE hours</strong> in <strong>${contentArea}</strong>.</p>
        <p>Your certificate is ready to download.</p>
        <a href="${FRONTEND_URL}/certificates.html" style="display: inline-block; background: #7A2E3A; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">View Certificate</a>
      `)
    });
  }

  if (shouldSendSms(user, 'sms.courseCompleted')) {
    await sendSMSReminder(user.phone,
      `CounselorReady: You completed "${courseTitle}" and earned ${ceHours} CE hours (${contentArea}). Certificate ready at counselorready.com/certificates.html`
    );
  }
}

export async function triggerCertificateReady(userId, { courseTitle, certificateId }) {
  const user = await User.findById(userId);
  if (!user) return;

  await createInAppNotification({
    userId,
    type: 'course_completed',
    title: 'Certificate Ready',
    message: `Your certificate for "${courseTitle}" is ready to download.`,
    actionUrl: `${FRONTEND_URL}/certificates.html`
  });

  if (shouldSendEmail(user, 'email.certificateReady')) {
    await sendEmail({
      to: user.email,
      subject: `📜 Your Certificate: ${courseTitle}`,
      html: emailWrap(`
        <h2 style="color: #2D4A3E;">Your Certificate is Ready</h2>
        <p>Hi ${user.firstName},</p>
        <p>Your CE certificate for <strong>${courseTitle}</strong> has been generated and is ready for download.</p>
        <a href="${FRONTEND_URL}/certificates.html" style="display: inline-block; background: #7A2E3A; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">Download Certificate</a>
      `)
    });
  }
}

export async function triggerCourseReminder(userId, { courseTitle, courseSlug, percentComplete, lastAccessedAt }) {
  const user = await User.findById(userId);
  if (!user) return;

  if (shouldSendEmail(user, 'email.courseReminder')) {
    await sendEmail({
      to: user.email,
      subject: `📖 Pick up where you left off: ${courseTitle}`,
      html: emailWrap(`
        <h2 style="color: #2D4A3E;">You're ${percentComplete}% through!</h2>
        <p>Hi ${user.firstName},</p>
        <p>You left off on <strong>${courseTitle}</strong>. You're <strong>${percentComplete}%</strong> done — keep going!</p>
        <a href="${FRONTEND_URL}/course/${courseSlug}" style="display: inline-block; background: #7A2E3A; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">Continue Course</a>
      `)
    });
  }
}


// ============================================================================
// CE TRACKING TRIGGERS
// ============================================================================

export async function triggerCeRenewalReminder(userId, { credentialType, state, renewalDate, daysRemaining, hoursCompleted, hoursRequired }) {
  const user = await User.findById(userId);
  if (!user) return;

  const reminderDays = user.notifications?.timing?.reminderDays || [90, 30, 7];
  if (!reminderDays.includes(daysRemaining)) return;

  const urgency = daysRemaining <= 7 ? 'urgent' : daysRemaining <= 30 ? 'warning' : 'info';
  const hoursLeft = Math.max(0, hoursRequired - hoursCompleted);

  await createInAppNotification({
    userId,
    type: 'ce_reminder',
    title: `${credentialType} Renewal in ${daysRemaining} Days`,
    message: `Your ${state} ${credentialType} renews on ${new Date(renewalDate).toLocaleDateString()}. You have ${hoursCompleted} of ${hoursRequired} CE hours.`,
    urgency,
    actionUrl: `${FRONTEND_URL}/credentials.html`
  });

  if (shouldSendEmail(user, 'email.ceRenewalReminders')) {
    await sendEmail({
      to: user.email,
      subject: `⏰ ${credentialType} Renewal: ${daysRemaining} Days Left`,
      html: emailWrap(`
        <h2 style="color: ${urgency === 'urgent' ? '#B91C1C' : '#2D4A3E'};">${daysRemaining} Days Until ${credentialType} Renewal</h2>
        <p>Hi ${user.firstName},</p>
        <p>Your <strong>${state} ${credentialType}</strong> renews on <strong>${new Date(renewalDate).toLocaleDateString()}</strong>.</p>
        <div style="background: #F5F1EB; border-radius: 8px; padding: 16px; margin: 16px 0;">
          <p style="margin: 0 0 8px 0;"><strong>CE Progress:</strong></p>
          <p style="margin: 0;">✅ Completed: ${hoursCompleted} hours</p>
          <p style="margin: 0;">📋 Required: ${hoursRequired} hours</p>
          ${hoursLeft > 0
            ? `<p style="margin: 8px 0 0 0; color: #B91C1C; font-weight: bold;">⚠️ Still need: ${hoursLeft} hours</p>`
            : `<p style="margin: 8px 0 0 0; color: #15803D; font-weight: bold;">✅ You've met your CE requirement!</p>`
          }
        </div>
        ${hoursLeft > 0
          ? `<a href="${FRONTEND_URL}/courses.html" style="display: inline-block; background: #7A2E3A; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">Browse Courses</a>`
          : `<a href="${FRONTEND_URL}/credentials.html" style="display: inline-block; background: #2D4A3E; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">View Renewal Checklist</a>`
        }
      `)
    });
  }

  if (shouldSendSms(user, 'sms.ceRenewalReminders')) {
    await sendSMSReminder(user.phone,
      `CounselorReady: Your ${state} ${credentialType} renews in ${daysRemaining} days. ${hoursLeft > 0 ? `You still need ${hoursLeft} CE hours.` : 'CE hours are complete!'} Details: counselorready.com/credentials.html`
    );
  }
}

export async function triggerCeMilestone(userId, { totalHours, requiredHours, credentialType }) {
  const user = await User.findById(userId);
  if (!user) return;

  const percentComplete = Math.round((totalHours / requiredHours) * 100);
  const milestones = [25, 50, 75, 100];
  const hitMilestone = milestones.find(m => {
    const prevHours = totalHours - 1;
    const prevPercent = Math.round((prevHours / requiredHours) * 100);
    return prevPercent < m && percentComplete >= m;
  });

  if (!hitMilestone) return;

  const isComplete = hitMilestone === 100;

  if (shouldSendEmail(user, 'email.ceMilestones')) {
    await sendEmail({
      to: user.email,
      subject: isComplete
        ? `🎉 CE Requirement Met for ${credentialType}!`
        : `📊 ${hitMilestone}% CE Progress: ${totalHours} of ${requiredHours} Hours`,
      html: emailWrap(`
        <h2 style="color: #2D4A3E;">${isComplete ? '🎉 You Did It!' : `${hitMilestone}% Complete!`}</h2>
        <p>Hi ${user.firstName},</p>
        <p>${isComplete
          ? `You've completed all <strong>${requiredHours} required CE hours</strong> for your ${credentialType}. You're all set for renewal!`
          : `You've earned <strong>${totalHours} of ${requiredHours}</strong> CE hours for your ${credentialType}. Keep it up!`
        }</p>
        <a href="${FRONTEND_URL}/credentials.html" style="display: inline-block; background: #2D4A3E; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">View CE Progress</a>
      `)
    });
  }

  if (shouldSendSms(user, 'sms.ceMilestones')) {
    await sendSMSReminder(user.phone,
      isComplete
        ? `CounselorReady: You've completed all ${requiredHours} CE hours for ${credentialType}! You're set for renewal.`
        : `CounselorReady: ${hitMilestone}% done! ${totalHours} of ${requiredHours} CE hours earned for ${credentialType}. Keep going!`
    );
  }
}

export async function triggerLowHoursAlert(userId, { credentialType, state, renewalDate, daysRemaining, hoursCompleted, hoursRequired }) {
  const user = await User.findById(userId);
  if (!user) return;

  const threshold = user.notifications?.timing?.lowHoursThreshold || 60;
  if (daysRemaining > threshold) return;

  const hoursLeft = hoursRequired - hoursCompleted;
  if (hoursLeft <= 0) return;

  if (shouldSendEmail(user, 'email.lowHoursAlert')) {
    await sendEmail({
      to: user.email,
      subject: `⚠️ ${hoursLeft} CE Hours Needed — ${daysRemaining} Days Left`,
      html: emailWrap(`
        <h2 style="color: #B91C1C;">CE Hours Running Low</h2>
        <p>Hi ${user.firstName},</p>
        <p>Your <strong>${state} ${credentialType}</strong> renews in <strong>${daysRemaining} days</strong> and you still need <strong>${hoursLeft} CE hours</strong>.</p>
        <p>Browse our catalog to find courses that fit your schedule.</p>
        <a href="${FRONTEND_URL}/courses.html" style="display: inline-block; background: #7A2E3A; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">Find Courses Now</a>
      `)
    });
  }

  if (shouldSendSms(user, 'sms.lowHoursAlert')) {
    await sendSMSReminder(user.phone,
      `CounselorReady Alert: ${hoursLeft} CE hours needed before your ${credentialType} renewal in ${daysRemaining} days. Browse courses: counselorready.com/courses.html`
    );
  }
}


// ============================================================================
// CREDENTIAL & INSURANCE TRIGGERS
// ============================================================================

export async function triggerCredentialExpiring(userId, { credentialType, state, expirationDate, daysRemaining }) {
  const user = await User.findById(userId);
  if (!user) return;

  const urgency = daysRemaining <= 7 ? 'urgent' : daysRemaining <= 30 ? 'warning' : 'info';

  await createInAppNotification({
    userId,
    type: 'credential_expiring',
    title: `${credentialType} Expiring in ${daysRemaining} Days`,
    message: `Your ${state} ${credentialType} expires on ${new Date(expirationDate).toLocaleDateString()}.`,
    urgency,
    actionUrl: `${FRONTEND_URL}/credentials.html`
  });

  if (shouldSendEmail(user, 'email.credentialExpiring')) {
    await sendEmail({
      to: user.email,
      subject: `${urgency === 'urgent' ? '🚨' : '⏰'} ${credentialType} Expires in ${daysRemaining} Days`,
      html: emailWrap(`
        <h2 style="color: ${urgency === 'urgent' ? '#B91C1C' : '#2D4A3E'};">${credentialType} Renewal Needed</h2>
        <p>Hi ${user.firstName},</p>
        <p>Your <strong>${state} ${credentialType}</strong> expires on <strong>${new Date(expirationDate).toLocaleDateString()}</strong>.</p>
        <a href="${FRONTEND_URL}/credentials.html" style="display: inline-block; background: #7A2E3A; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">View Renewal Steps</a>
      `)
    });
  }

  if (shouldSendSms(user, 'sms.credentialExpiring')) {
    await sendSMSReminder(user.phone,
      `CounselorReady: Your ${state} ${credentialType} expires in ${daysRemaining} days (${new Date(expirationDate).toLocaleDateString()}). Renewal steps: counselorready.com/credentials.html`
    );
  }
}

export async function triggerInsuranceExpiring(userId, { provider, expirationDate, daysRemaining }) {
  const user = await User.findById(userId);
  if (!user) return;

  const reminderDays = user.notifications?.timing?.insuranceReminderDays || [30, 14];
  if (!reminderDays.includes(daysRemaining) && daysRemaining !== 0) return;

  const isExpired = daysRemaining <= 0;

  if (shouldSendEmail(user, 'email.insuranceExpiring')) {
    await sendEmail({
      to: user.email,
      subject: isExpired
        ? `🚨 Your Liability Insurance Has Expired`
        : `⏰ Insurance Renewal: ${daysRemaining} Days Left`,
      html: emailWrap(`
        <h2 style="color: ${isExpired ? '#B91C1C' : '#2D4A3E'};">${isExpired ? 'Insurance Expired!' : 'Insurance Renewal Reminder'}</h2>
        <p>Hi ${user.firstName},</p>
        <p>Your liability insurance with <strong>${provider}</strong> ${isExpired ? 'has expired' : `expires on <strong>${new Date(expirationDate).toLocaleDateString()}</strong>`}.</p>
        <p>Practicing without active liability coverage puts you at significant risk.</p>
        <a href="${FRONTEND_URL}/settings.html#insurance" style="display: inline-block; background: #7A2E3A; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">Compare Rates & Renew</a>
      `)
    });
  }

  if (shouldSendSms(user, 'sms.insuranceExpiring')) {
    await sendSMSReminder(user.phone,
      isExpired
        ? `CounselorReady URGENT: Your liability insurance with ${provider} has expired. Compare rates: counselorready.com/settings.html#insurance`
        : `CounselorReady: Your insurance with ${provider} expires in ${daysRemaining} days. Review & renew: counselorready.com/settings.html#insurance`
    );
  }
}


// ============================================================================
// PLATFORM TRIGGERS
// ============================================================================

export async function triggerNewCourseAnnouncement({ courseTitle, courseSlug, ceHours, contentArea, description }) {
  const users = await User.find({
    'notifications.unsubscribeAll': { $ne: true },
    'notifications.email.newCourseAnnouncements': { $ne: false }
  }).select('email firstName notifications');

  let sent = 0;
  for (const user of users) {
    try {
      await sendEmail({
        to: user.email,
        subject: `🆕 New Course: ${courseTitle}`,
        html: emailWrap(`
          <h2 style="color: #2D4A3E;">New Course Available!</h2>
          <p>Hi ${user.firstName},</p>
          <h3 style="color: #7A2E3A;">${courseTitle}</h3>
          <p>${description || ''}</p>
          <p><strong>${ceHours} CE Hours</strong> · ${contentArea}</p>
          <a href="${FRONTEND_URL}/course/${courseSlug}" style="display: inline-block; background: #7A2E3A; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">View Course</a>
        `)
      });
      sent++;
    } catch (err) {
      console.error(`Failed to send new course email to ${user.email}:`, err);
    }
  }

  return { sent, total: users.length };
}


// ============================================================================
// WEEKLY DIGEST
// ============================================================================

export async function triggerWeeklyDigest(userId, { credentials, recentCompletions, upcomingRenewals }) {
  const user = await User.findById(userId);
  if (!user) return;

  if (!shouldSendEmail(user, 'email.weeklyDigest')) return;

  const credentialRows = credentials.map(c => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">${c.state} ${c.type}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">${c.hoursCompleted} / ${c.hoursRequired}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">${c.daysUntilRenewal} days</td>
    </tr>
  `).join('');

  const completionList = recentCompletions.length > 0
    ? recentCompletions.map(c => `<li>${c.courseTitle} — ${c.ceHours} hrs</li>`).join('')
    : '<li>No courses completed this week</li>';

  await sendEmail({
    to: user.email,
    subject: `📊 Your Weekly CE Summary`,
    html: emailWrap(`
      <h2 style="color: #2D4A3E;">Weekly CE Summary</h2>
      <p>Hi ${user.firstName}, here's your CE progress this week:</p>
      <h3 style="color: #7A2E3A;">This Week's Completions</h3>
      <ul>${completionList}</ul>
      <h3 style="color: #7A2E3A;">CE Progress by Credential</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr style="background: #F5F1EB;">
          <th style="padding: 8px; text-align: left;">Credential</th>
          <th style="padding: 8px; text-align: left;">Hours</th>
          <th style="padding: 8px; text-align: left;">Renewal</th>
        </tr>
        ${credentialRows}
      </table>
      <a href="${FRONTEND_URL}/credentials.html" style="display: inline-block; margin-top: 16px; background: #2D4A3E; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">View Full Dashboard</a>
    `)
  });
}
