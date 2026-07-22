/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import { Resend } from 'resend';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import { sendSMSReminder } from './calendarSmsService.js';
import { sendRealtimeNotification } from '../routes/notifications.js';

const resend = new Resend(process.env.RESEND_API_KEY);
const BASE_URL = process.env.CLIENT_URL || 'https://counselorready.com';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getNestedPref(obj, path) {
  return path.split('.').reduce((o, k) => (o && o[k] !== undefined ? o[k] : undefined), obj);
}

export function shouldSendEmail(user, prefPath) {
  if (user.notifications?.unsubscribeAll) return false;
  const val = getNestedPref(user.notifications, prefPath);
  return val !== false; // default true for most prefs
}

export function shouldSendSms(user, prefPath) {
  if (user.notifications?.unsubscribeAll) return false;
  if (!user.notifications?.sms?.enabled) return false;
  if (!user.phone && !user.profile?.phone) return false;
  const val = getNestedPref(user.notifications, prefPath);
  return val === true;
}

function getUserPhone(user) {
  return user.phone || user.profile?.phone || null;
}

function getUserName(user) {
  return user.profile?.firstName || 'there';
}

// ─── Email sender ────────────────────────────────────────────────────────────

async function sendNotificationEmail(to, subject, bodyHtml) {
  try {
    await resend.emails.send({
      from: 'CounselorReady <notifications@counselorready.com>',
      to,
      subject,
      html: wrapEmailTemplate(bodyHtml)
    });
  } catch (err) {
    console.error(`[NotifTrigger] Email failed to ${to}:`, err.message);
  }
}

function wrapEmailTemplate(bodyContent) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f5f5f4;">
<div style="max-width:600px;margin:0 auto;font-family:Georgia,'Times New Roman',serif;">
  <div style="background:linear-gradient(135deg,#2D4A3E,#6b1d34);padding:28px;text-align:center;">
    <h1 style="color:#D4A855;margin:0;font-size:22px;">CounselorReady</h1>
    <p style="color:#fff;margin:4px 0 0;font-size:11px;letter-spacing:2px;">LEARN. LICENSE. LEAD.</p>
  </div>
  <div style="background:#fff;padding:28px 24px;border:1px solid #e5e5e5;border-top:none;">
    ${bodyContent}
  </div>
  <div style="padding:18px;text-align:center;font-size:11px;color:#888;">
    <p style="margin:0 0 6px;">Ga Integrated Therapeutic Perspectives LLC | NBCC ACEP #7760</p>
    <p style="margin:0;"><a href="${BASE_URL}/settings.html#notifications" style="color:#6b1d34;text-decoration:underline;">Manage notification preferences</a> | <a href="${BASE_URL}/settings.html#notifications" style="color:#6b1d34;text-decoration:underline;">Unsubscribe</a></p>
  </div>
</div>
</body></html>`;
}

// ─── In-app notification helper ──────────────────────────────────────────────

async function createInAppNotification(userId, { type, title, message, urgency, link, metadata }) {
  try {
    const notif = await Notification.create({
      userId,
      type: type || 'info',
      title,
      message,
      urgency: urgency || 'info',
      link,
      metadata
    });
    sendRealtimeNotification(userId, notif);
    return notif;
  } catch (err) {
    console.error('[NotifTrigger] In-app notification failed:', err.message);
  }
}

// ─── Trigger Functions ───────────────────────────────────────────────────────

export async function triggerCourseCompleted(userId, { courseTitle, ceHours, contentArea }) {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    const name = getUserName(user);

    // In-app
    await createInAppNotification(userId, {
      type: 'course_completed',
      title: 'Course Completed!',
      message: `You completed "${courseTitle}" and earned ${ceHours || 0} CE hours.`,
      urgency: 'info',
      link: '/credentials.html'
    });

    // Email
    if (shouldSendEmail(user, 'email.courseCompleted')) {
      await sendNotificationEmail(user.email, `You completed "${courseTitle}"!`, `
        <h2 style="color:#2D4A3E;margin-top:0;">Congratulations, ${name}!</h2>
        <p>You've successfully completed <strong>${courseTitle}</strong>${contentArea ? ` (${contentArea})` : ''}.</p>
        <p style="font-size:18px;color:#6b1d34;font-weight:bold;">${ceHours || 0} CE hours earned</p>
        <p>Your CE hours have been automatically applied to your credentials.</p>
        <div style="text-align:center;margin:24px 0;">
          <a href="${BASE_URL}/credentials.html" style="background:#6b1d34;color:#fff;padding:12px 24px;text-decoration:none;border-radius:6px;font-weight:bold;">View Your Credentials</a>
        </div>
      `);
    }

    // SMS
    if (shouldSendSms(user, 'sms.courseCompleted')) {
      await sendSMSReminder(getUserPhone(user),
        `CounselorReady: Congrats ${name}! You completed "${courseTitle}" (${ceHours || 0} CE hrs). View credentials: ${BASE_URL}/credentials.html`
      );
    }
  } catch (err) {
    console.error('[NotifTrigger] triggerCourseCompleted error:', err.message);
  }
}

export async function triggerCertificateReady(userId, { courseTitle, certificateId }) {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    const name = getUserName(user);

    // In-app
    await createInAppNotification(userId, {
      type: 'course_completed',
      title: 'Certificate Ready!',
      message: `Your certificate for "${courseTitle}" is ready to download.`,
      urgency: 'info',
      link: `/certificates/${certificateId}`
    });

    // Email
    if (shouldSendEmail(user, 'email.certificateReady')) {
      await sendNotificationEmail(user.email, `Your certificate for "${courseTitle}" is ready`, `
        <h2 style="color:#2D4A3E;margin-top:0;">Certificate Ready, ${name}!</h2>
        <p>Your certificate for <strong>${courseTitle}</strong> has been generated and is ready to download.</p>
        <div style="text-align:center;margin:24px 0;">
          <a href="${BASE_URL}/certificates/${certificateId}" style="background:#6b1d34;color:#fff;padding:12px 24px;text-decoration:none;border-radius:6px;font-weight:bold;">Download Certificate</a>
        </div>
      `);
    }
  } catch (err) {
    console.error('[NotifTrigger] triggerCertificateReady error:', err.message);
  }
}

export async function triggerCourseReminder(userId, { courseTitle, courseSlug, percentComplete }) {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    if (!shouldSendEmail(user, 'email.courseReminder')) return;

    const name = getUserName(user);

    await sendNotificationEmail(user.email, `Continue "${courseTitle}" - ${percentComplete || 0}% complete`, `
      <h2 style="color:#2D4A3E;margin-top:0;">Keep Going, ${name}!</h2>
      <p>You're <strong>${percentComplete || 0}%</strong> through <strong>${courseTitle}</strong>. Pick up where you left off!</p>
      <div style="background:#e9ecef;border-radius:8px;height:16px;margin:16px 0;overflow:hidden;">
        <div style="background:linear-gradient(90deg,#2D4A3E,#4A7C59);height:100%;width:${percentComplete || 0}%;border-radius:8px;"></div>
      </div>
      <div style="text-align:center;margin:24px 0;">
        <a href="${BASE_URL}/courses/${courseSlug}" style="background:#6b1d34;color:#fff;padding:12px 24px;text-decoration:none;border-radius:6px;font-weight:bold;">Continue Course</a>
      </div>
    `);
  } catch (err) {
    console.error('[NotifTrigger] triggerCourseReminder error:', err.message);
  }
}

export async function triggerCeRenewalReminder(userId, { credentialType, state, renewalDate, daysRemaining, hoursCompleted, hoursRequired }) {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    // Only fire if daysRemaining is in user's timing.reminderDays
    const reminderDays = user.notifications?.timing?.reminderDays || [90, 30, 7];
    if (!reminderDays.includes(daysRemaining)) return;

    const name = getUserName(user);
    const urgency = daysRemaining <= 14 ? 'urgent' : daysRemaining <= 30 ? 'warning' : 'info';
    const dateStr = new Date(renewalDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    // In-app
    await createInAppNotification(userId, {
      type: 'ce_reminder',
      title: `${credentialType} Renewal: ${daysRemaining} days`,
      message: `Your ${credentialType}${state ? ` (${state})` : ''} renews ${dateStr}. ${hoursCompleted || 0}/${hoursRequired || 0} CE hours completed.`,
      urgency,
      link: '/credentials.html'
    });

    // Email
    if (shouldSendEmail(user, 'email.ceRenewalReminders')) {
      await sendNotificationEmail(user.email, `${credentialType} renewal in ${daysRemaining} days`, `
        <h2 style="color:#2D4A3E;margin-top:0;">CE Renewal Reminder</h2>
        <p>Hi ${name}, your <strong>${credentialType}</strong>${state ? ` (${state})` : ''} renews on <strong>${dateStr}</strong> — <strong>${daysRemaining} days</strong> away.</p>
        <div style="background:#f8f9fa;border-left:4px solid ${daysRemaining <= 14 ? '#dc3545' : daysRemaining <= 30 ? '#ffc107' : '#2D4A3E'};padding:16px;margin:16px 0;border-radius:0 6px 6px 0;">
          <p style="margin:0 0 8px;font-weight:bold;">CE Progress: ${hoursCompleted || 0} / ${hoursRequired || 0} hours</p>
          <div style="background:#e9ecef;border-radius:8px;height:14px;overflow:hidden;">
            <div style="background:linear-gradient(90deg,#2D4A3E,#4A7C59);height:100%;width:${hoursRequired ? Math.min(100, Math.round((hoursCompleted / hoursRequired) * 100)) : 0}%;border-radius:8px;"></div>
          </div>
        </div>
        <div style="text-align:center;margin:24px 0;">
          <a href="${BASE_URL}/credentials.html" style="background:#6b1d34;color:#fff;padding:12px 24px;text-decoration:none;border-radius:6px;font-weight:bold;">View Credentials</a>
        </div>
      `);
    }

    // SMS
    if (shouldSendSms(user, 'sms.ceRenewalReminders')) {
      await sendSMSReminder(getUserPhone(user),
        `CounselorReady: Your ${credentialType}${state ? ` (${state})` : ''} renews in ${daysRemaining} days. ${hoursCompleted || 0}/${hoursRequired || 0} CE hrs done. ${BASE_URL}/credentials.html`
      );
    }
  } catch (err) {
    console.error('[NotifTrigger] triggerCeRenewalReminder error:', err.message);
  }
}

export async function triggerCeMilestone(userId, { totalHours, requiredHours, credentialType }) {
  try {
    if (!requiredHours || requiredHours <= 0) return;
    const percent = Math.round((totalHours / requiredHours) * 100);

    // Only fire at 25%, 50%, 75%, 100% thresholds
    const milestones = [25, 50, 75, 100];
    const milestone = milestones.find(m => percent >= m && percent < m + 5);
    if (!milestone) return;

    const user = await User.findById(userId);
    if (!user) return;

    const name = getUserName(user);

    // Email
    if (shouldSendEmail(user, 'email.ceMilestones')) {
      await sendNotificationEmail(user.email, `CE Milestone: ${milestone}% complete for ${credentialType}!`, `
        <h2 style="color:#2D4A3E;margin-top:0;">Milestone Reached!</h2>
        <p>Congratulations ${name}! You've reached <strong>${milestone}%</strong> of your CE requirements for <strong>${credentialType}</strong>.</p>
        <p style="font-size:18px;color:#6b1d34;font-weight:bold;">${totalHours} / ${requiredHours} CE hours</p>
        ${milestone === 100 ? '<p style="color:#2D4A3E;font-weight:bold;">You\'ve completed all required CE hours!</p>' : `<p>Keep going — only ${requiredHours - totalHours} hours to go!</p>`}
        <div style="text-align:center;margin:24px 0;">
          <a href="${BASE_URL}/credentials.html" style="background:#6b1d34;color:#fff;padding:12px 24px;text-decoration:none;border-radius:6px;font-weight:bold;">View Progress</a>
        </div>
      `);
    }

    // SMS
    if (shouldSendSms(user, 'sms.ceMilestones')) {
      await sendSMSReminder(getUserPhone(user),
        `CounselorReady: Milestone! You've completed ${milestone}% of CE requirements for ${credentialType} (${totalHours}/${requiredHours} hrs). ${BASE_URL}/credentials.html`
      );
    }
  } catch (err) {
    console.error('[NotifTrigger] triggerCeMilestone error:', err.message);
  }
}

export async function triggerLowHoursAlert(userId, { credentialType, state, renewalDate, daysRemaining, hoursCompleted, hoursRequired }) {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    const threshold = user.notifications?.timing?.lowHoursThreshold || 60;
    if (daysRemaining > threshold) return;

    const hoursNeeded = (hoursRequired || 0) - (hoursCompleted || 0);
    if (hoursNeeded <= 0) return;

    const name = getUserName(user);
    const dateStr = new Date(renewalDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    // Email
    if (shouldSendEmail(user, 'email.lowHoursAlert')) {
      await sendNotificationEmail(user.email, `Low CE hours alert: ${credentialType}`, `
        <h2 style="color:#dc3545;margin-top:0;">Low CE Hours Alert</h2>
        <p>Hi ${name}, you need <strong>${hoursNeeded} more CE hours</strong> for your <strong>${credentialType}</strong>${state ? ` (${state})` : ''} and only have <strong>${daysRemaining} days</strong> until renewal on ${dateStr}.</p>
        <p>That's about <strong>${(hoursNeeded / Math.max(1, Math.ceil(daysRemaining / 7))).toFixed(1)} hours per week</strong> to stay on track.</p>
        <div style="text-align:center;margin:24px 0;">
          <a href="${BASE_URL}/courses" style="background:#6b1d34;color:#fff;padding:12px 24px;text-decoration:none;border-radius:6px;font-weight:bold;">Browse CE Courses</a>
        </div>
      `);
    }

    // SMS
    if (shouldSendSms(user, 'sms.lowHoursAlert')) {
      await sendSMSReminder(getUserPhone(user),
        `CounselorReady: Alert - You need ${hoursNeeded} more CE hrs for ${credentialType} in ${daysRemaining} days. Browse courses: ${BASE_URL}/courses`
      );
    }
  } catch (err) {
    console.error('[NotifTrigger] triggerLowHoursAlert error:', err.message);
  }
}

export async function triggerCredentialExpiring(userId, { credentialType, state, expirationDate, daysRemaining }) {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    const name = getUserName(user);
    const urgency = daysRemaining <= 7 ? 'urgent' : daysRemaining <= 30 ? 'warning' : 'info';
    const dateStr = new Date(expirationDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    // In-app
    await createInAppNotification(userId, {
      type: 'credential_expiring',
      title: `${credentialType} expires in ${daysRemaining} days`,
      message: `Your ${credentialType}${state ? ` (${state})` : ''} expires on ${dateStr}.`,
      urgency,
      link: '/credentials.html'
    });

    // Email
    if (shouldSendEmail(user, 'email.credentialExpiring')) {
      await sendNotificationEmail(user.email, `${daysRemaining <= 7 ? 'URGENT: ' : ''}${credentialType} expires in ${daysRemaining} days`, `
        <h2 style="color:${daysRemaining <= 7 ? '#dc3545' : '#2D4A3E'};margin-top:0;">${daysRemaining <= 7 ? 'Urgent: ' : ''}Credential Expiring</h2>
        <p>Hi ${name}, your <strong>${credentialType}</strong>${state ? ` (${state})` : ''} expires on <strong>${dateStr}</strong> — <strong>${daysRemaining} days</strong> remaining.</p>
        <p>Please ensure you've submitted your renewal application to your licensing board.</p>
        <div style="text-align:center;margin:24px 0;">
          <a href="${BASE_URL}/credentials.html" style="background:#6b1d34;color:#fff;padding:12px 24px;text-decoration:none;border-radius:6px;font-weight:bold;">View Credentials</a>
        </div>
      `);
    }

    // SMS
    if (shouldSendSms(user, 'sms.credentialExpiring')) {
      await sendSMSReminder(getUserPhone(user),
        `CounselorReady: Your ${credentialType}${state ? ` (${state})` : ''} expires in ${daysRemaining} days (${dateStr}). Renew now: ${BASE_URL}/credentials.html`
      );
    }
  } catch (err) {
    console.error('[NotifTrigger] triggerCredentialExpiring error:', err.message);
  }
}

export async function triggerInsuranceExpiring(userId, { provider, expirationDate, daysRemaining }) {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    // Only fire if daysRemaining is in user's insuranceReminderDays or is 0
    const insuranceDays = user.notifications?.timing?.insuranceReminderDays || [30, 14];
    if (daysRemaining !== 0 && !insuranceDays.includes(daysRemaining)) return;

    const name = getUserName(user);
    const dateStr = new Date(expirationDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    // Email
    if (shouldSendEmail(user, 'email.insuranceExpiring')) {
      await sendNotificationEmail(user.email, `${daysRemaining === 0 ? 'TODAY: ' : ''}Liability insurance ${daysRemaining === 0 ? 'expires today' : `expires in ${daysRemaining} days`}`, `
        <h2 style="color:${daysRemaining <= 7 ? '#dc3545' : '#2D4A3E'};margin-top:0;">Insurance Expiration ${daysRemaining === 0 ? 'Today' : 'Reminder'}</h2>
        <p>Hi ${name}, your liability insurance${provider ? ` with <strong>${provider}</strong>` : ''} ${daysRemaining === 0 ? 'expires <strong>today</strong>' : `expires on <strong>${dateStr}</strong> (${daysRemaining} days)`}.</p>
        <p>Practicing without liability insurance puts you at significant risk. Please renew as soon as possible.</p>
        <div style="text-align:center;margin:24px 0;">
          <a href="${BASE_URL}/settings.html" style="background:#6b1d34;color:#fff;padding:12px 24px;text-decoration:none;border-radius:6px;font-weight:bold;">View Insurance Details</a>
        </div>
      `);
    }

    // SMS
    if (shouldSendSms(user, 'sms.insuranceExpiring')) {
      await sendSMSReminder(getUserPhone(user),
        `CounselorReady: Your liability insurance${provider ? ` (${provider})` : ''} ${daysRemaining === 0 ? 'expires today!' : `expires in ${daysRemaining} days.`} Renew ASAP. ${BASE_URL}/settings.html`
      );
    }
  } catch (err) {
    console.error('[NotifTrigger] triggerInsuranceExpiring error:', err.message);
  }
}

export async function triggerNewCourseAnnouncement({ courseTitle, courseSlug, ceHours, contentArea, description }) {
  try {
    // Bulk send to all users who want announcements
    const users = await User.find({
      'notifications.unsubscribeAll': { $ne: true },
      'notifications.email.newCourseAnnouncements': { $ne: false }
    }).select('email profile notifications');

    let sentCount = 0;
    for (const user of users) {
      try {
        const name = getUserName(user);
        await sendNotificationEmail(user.email, `New Course: ${courseTitle}`, `
          <h2 style="color:#2D4A3E;margin-top:0;">New Course Available!</h2>
          <p>Hi ${name}, a new course has been published on CounselorReady:</p>
          <div style="background:#f8f9fa;border-left:4px solid #2D4A3E;padding:16px;margin:16px 0;border-radius:0 6px 6px 0;">
            <p style="margin:0 0 6px;font-size:18px;font-weight:bold;color:#6b1d34;">${courseTitle}</p>
            ${contentArea ? `<p style="margin:0 0 4px;color:#666;">${contentArea}</p>` : ''}
            ${ceHours ? `<p style="margin:0 0 4px;font-weight:bold;">${ceHours} CE Hours</p>` : ''}
            ${description ? `<p style="margin:6px 0 0;color:#444;">${description}</p>` : ''}
          </div>
          <div style="text-align:center;margin:24px 0;">
            <a href="${BASE_URL}/courses/${courseSlug}" style="background:#6b1d34;color:#fff;padding:12px 24px;text-decoration:none;border-radius:6px;font-weight:bold;">View Course</a>
          </div>
        `);
        sentCount++;
      } catch (emailErr) {
        // Continue on individual failures
      }
    }
    console.log(`[NotifTrigger] New course announcement sent to ${sentCount} users`);
  } catch (err) {
    console.error('[NotifTrigger] triggerNewCourseAnnouncement error:', err.message);
  }
}

export async function triggerNewLiveSessionAnnouncement({
  sessionTitle, sessionSlug, accessCode, scheduledStart, ceuHours, category, description, price
}) {
  try {
    const users = await User.find({
      'notifications.unsubscribeAll': { $ne: true },
      'notifications.email.newCourseAnnouncements': { $ne: false }
    }).select('email profile notifications');

    const dateStr = scheduledStart ? new Date(scheduledStart).toLocaleString('en-US', {
      weekday: 'long', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit', timeZoneName: 'short'
    }) : '';

    // Prefer the accessCode deep link if one exists (works for public sessions
    // too, and is a stable specific link) — otherwise fall back to the general catalog.
    const registerUrl = accessCode
      ? `${BASE_URL}/live-sessions.html?code=${encodeURIComponent(accessCode)}`
      : `${BASE_URL}/live-sessions.html`;

    let sentCount = 0;
    for (const user of users) {
      try {
        const name = getUserName(user);
        await sendNotificationEmail(user.email, `New Live Session: ${sessionTitle}`, `
          <h2 style="color:#2D4A3E;margin-top:0;">New Live Session Available!</h2>
          <p>Hi ${name}, a new live CE session just opened for registration on CounselorReady:</p>
          <div style="background:#f8f9fa;border-left:4px solid #2D4A3E;padding:16px;margin:16px 0;border-radius:0 6px 6px 0;">
            <p style="margin:0 0 6px;font-size:18px;font-weight:bold;color:#6b1d34;">${sessionTitle}</p>
            ${dateStr ? `<p style="margin:0 0 4px;color:#666;">${dateStr}</p>` : ''}
            ${category ? `<p style="margin:0 0 4px;color:#666;">${category}</p>` : ''}
            ${ceuHours ? `<p style="margin:0 0 4px;font-weight:bold;">${ceuHours} CE Hours</p>` : ''}
            ${!price ? '<p style="margin:0 0 4px;color:#2D6A4F;font-weight:bold;">Included with VIP subscription</p>' : `<p style="margin:0 0 4px;color:#666;">$${price}</p>`}
            ${description ? `<p style="margin:6px 0 0;color:#444;">${description}</p>` : ''}
          </div>
          <div style="text-align:center;margin:24px 0;">
            <a href="${registerUrl}" style="background:#6b1d34;color:#fff;padding:12px 24px;text-decoration:none;border-radius:6px;font-weight:bold;">Register Now</a>
          </div>
        `);
        sentCount++;
      } catch (emailErr) {
        // Continue on individual failures
      }
    }
    console.log(`[NotifTrigger] New live session announcement sent to ${sentCount} users`);
  } catch (err) {
    console.error('[NotifTrigger] triggerNewLiveSessionAnnouncement error:', err.message);
  }
}

export async function triggerWeeklyDigest(userId, { credentials, recentCompletions, upcomingRenewals }) {
  try {
    const user = await User.findById(userId);
    if (!user) return;
    if (!shouldSendEmail(user, 'email.weeklyDigest')) return;

    const name = getUserName(user);

    let completionsHtml = '';
    if (recentCompletions && recentCompletions.length > 0) {
      completionsHtml = `<h3 style="color:#2D4A3E;">Recent Completions</h3><ul style="padding-left:20px;">` +
        recentCompletions.map(c => `<li>${c.title} — ${c.ceHours || 0} CE hrs</li>`).join('') +
        '</ul>';
    }

    let renewalsHtml = '';
    if (upcomingRenewals && upcomingRenewals.length > 0) {
      renewalsHtml = `<h3 style="color:#6b1d34;">Upcoming Renewals</h3><ul style="padding-left:20px;">` +
        upcomingRenewals.map(r => `<li>${r.name}${r.state ? ` (${r.state})` : ''} — ${r.daysLeft} days remaining</li>`).join('') +
        '</ul>';
    }

    let credentialsHtml = '';
    if (credentials && credentials.length > 0) {
      credentialsHtml = `<h3 style="color:#2D4A3E;">CE Progress</h3>` +
        credentials.map(c => `
          <div style="margin-bottom:12px;">
            <p style="margin:0 0 4px;font-weight:bold;">${c.name}${c.state ? ` (${c.state})` : ''}: ${c.completed || 0}/${c.required || 0} hrs</p>
            <div style="background:#e9ecef;border-radius:8px;height:12px;overflow:hidden;">
              <div style="background:linear-gradient(90deg,#2D4A3E,#4A7C59);height:100%;width:${c.required ? Math.min(100, Math.round((c.completed / c.required) * 100)) : 0}%;border-radius:8px;"></div>
            </div>
          </div>
        `).join('');
    }

    await sendNotificationEmail(user.email, 'Your Weekly CE Digest - CounselorReady', `
      <h2 style="color:#2D4A3E;margin-top:0;">Weekly Digest</h2>
      <p>Hi ${name}, here's your weekly CE progress summary:</p>
      ${credentialsHtml}
      ${completionsHtml}
      ${renewalsHtml}
      ${!credentialsHtml && !completionsHtml && !renewalsHtml ? '<p>No activity this week. <a href="' + BASE_URL + '/courses" style="color:#6b1d34;">Browse courses</a> to get started!</p>' : ''}
      <div style="text-align:center;margin:24px 0;">
        <a href="${BASE_URL}/dashboard" style="background:#6b1d34;color:#fff;padding:12px 24px;text-decoration:none;border-radius:6px;font-weight:bold;">View Dashboard</a>
      </div>
    `);
  } catch (err) {
    console.error('[NotifTrigger] triggerWeeklyDigest error:', err.message);
  }
}

// ─── Trial Conversion Triggers ───────────────────────────────────────────────

export async function triggerTrialEndingSoon(userId, { trialEndsAt, daysRemaining }) {
  try {
    const user = await User.findById(userId);
    if (!user) return;
    if (user.subscription?.trialEmailsSent?.includes('ending_soon')) return;

    const name = getUserName(user);
    const friendlyDate = new Date(trialEndsAt).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

    await createInAppNotification(userId, {
      type: 'trial',
      title: `Your trial ends in ${daysRemaining} days`,
      message: `Pick a plan to keep your CE tracking, courses, and credential management active after ${friendlyDate}.`,
      urgency: 'warning',
      link: '/subscription.html'
    });

    if (shouldSendEmail(user, 'email.trial')) {
      await sendNotificationEmail(user.email, `Your CounselorReady trial ends ${friendlyDate}`, `
        <h2 style="color:#2D4A3E;margin-top:0;">Your trial ends in ${daysRemaining} days, ${name}</h2>
        <p>Your 7-day free trial of CounselorReady ends on <strong>${friendlyDate}</strong>. Pick a plan now to keep your courses, credential tracking, and CE certificate library active without interruption.</p>
        <table style="width:100%;border-collapse:collapse;margin:20px 0;">
          <tr>
            <td style="padding:14px;background:#FBF7F0;border-radius:8px;">
              <strong style="color:#6b1d34;">Starter — $19.99/mo</strong><br/>
              <span style="color:#666;font-size:14px;">CE tracking + course library</span>
            </td>
          </tr>
          <tr><td style="height:8px;"></td></tr>
          <tr>
            <td style="padding:14px;background:#FBF7F0;border-radius:8px;border:2px solid #4A7C59;">
              <strong style="color:#6b1d34;">Professional — $29.99/mo</strong> <span style="color:#4A7C59;font-size:12px;font-weight:bold;">MOST POPULAR</span><br/>
              <span style="color:#666;font-size:14px;">Everything in Starter + Researched-N-Ready CE</span>
            </td>
          </tr>
          <tr><td style="height:8px;"></td></tr>
          <tr>
            <td style="padding:14px;background:#FBF7F0;border-radius:8px;">
              <strong style="color:#6b1d34;">VIP — $49.99/mo</strong><br/>
              <span style="color:#666;font-size:14px;">Everything + multi-state tracking + hardship pause</span>
            </td>
          </tr>
        </table>
        <div style="text-align:center;margin:24px 0;">
          <a href="${BASE_URL}/subscription.html" style="background:#6b1d34;color:#fff;padding:14px 28px;text-decoration:none;border-radius:6px;font-weight:bold;">Choose Your Plan</a>
        </div>
        <p style="font-size:13px;color:#666;text-align:center;">Questions? Reply to this email — we read every one.</p>
      `);
    }

    user.subscription.trialEmailsSent = [...(user.subscription.trialEmailsSent || []), 'ending_soon'];
    await user.save();
  } catch (err) {
    console.error('[NotifTrigger] triggerTrialEndingSoon error:', err.message);
  }
}

export async function triggerTrialEndingTomorrow(userId, { trialEndsAt }) {
  try {
    const user = await User.findById(userId);
    if (!user) return;
    if (user.subscription?.trialEmailsSent?.includes('ending_tomorrow')) return;

    const name = getUserName(user);

    await createInAppNotification(userId, {
      type: 'trial',
      title: 'Your trial ends tomorrow',
      message: 'Pick a plan today to avoid losing access to your courses and credential tracking.',
      urgency: 'urgent',
      link: '/subscription.html'
    });

    if (shouldSendEmail(user, 'email.trial')) {
      await sendNotificationEmail(user.email, 'Your CounselorReady trial ends tomorrow', `
        <h2 style="color:#6b1d34;margin-top:0;">${name}, your trial ends tomorrow</h2>
        <p>Tomorrow your CounselorReady free trial ends. After that, you'll lose access to:</p>
        <ul style="line-height:1.8;color:#444;">
          <li>Your CE course progress and certificates</li>
          <li>Credential tracking for your license</li>
          <li>Researched-N-Ready CE library</li>
          <li>State board renewal monitoring</li>
        </ul>
        <p>Pick any plan and keep everything you've built so far.</p>
        <div style="text-align:center;margin:24px 0;">
          <a href="${BASE_URL}/subscription.html" style="background:#6b1d34;color:#fff;padding:14px 28px;text-decoration:none;border-radius:6px;font-weight:bold;">Choose Your Plan</a>
        </div>
      `);
    }

    user.subscription.trialEmailsSent = [...(user.subscription.trialEmailsSent || []), 'ending_tomorrow'];
    await user.save();
  } catch (err) {
    console.error('[NotifTrigger] triggerTrialEndingTomorrow error:', err.message);
  }
}

export async function triggerTrialEnded(userId) {
  try {
    const user = await User.findById(userId);
    if (!user) return;
    if (user.subscription?.trialEmailsSent?.includes('ended')) return;

    const name = getUserName(user);

    await createInAppNotification(userId, {
      type: 'trial',
      title: 'Your trial has ended',
      message: 'Pick a plan to restore access to your courses and credential tracking.',
      urgency: 'warning',
      link: '/subscription.html'
    });

    if (shouldSendEmail(user, 'email.trial')) {
      await sendNotificationEmail(user.email, 'Your CounselorReady trial has ended', `
        <h2 style="color:#2D4A3E;margin-top:0;">Trial ended — your account is on hold, ${name}</h2>
        <p>Your 7-day free trial has ended. Your account is preserved, but premium features are paused until you pick a plan.</p>
        <p><strong>Your data is safe.</strong> Course progress, completed CE hours, and credential records are all still here.</p>
        <p>Pick a plan whenever you're ready — your account picks right back up where you left off.</p>
        <div style="text-align:center;margin:24px 0;">
          <a href="${BASE_URL}/subscription.html" style="background:#6b1d34;color:#fff;padding:14px 28px;text-decoration:none;border-radius:6px;font-weight:bold;">Restore Access</a>
        </div>
        <p style="font-size:13px;color:#666;text-align:center;">Have feedback about your trial? Reply to this email — we'd love to hear what worked and what didn't.</p>
      `);
    }

    user.subscription.trialEmailsSent = [...(user.subscription.trialEmailsSent || []), 'ended'];
    await user.save();
  } catch (err) {
    console.error('[NotifTrigger] triggerTrialEnded error:', err.message);
  }
}

export async function triggerNonPaidCheckIn(userId, { daysSinceRegistration }) {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    const name = getUserName(user);

    await createInAppNotification(userId, {
      type: 'info',
      title: 'How are your CE hours looking?',
      message: 'Your renewal is coming. Take a quick look at where your hours stand and what you still need.',
      urgency: 'info',
      link: '/credentials.html'
    });

    if (shouldSendEmail(user, 'email.checkIn')) {
      await sendNotificationEmail(user.email, 'Renewal coming up — where do your CE hours stand?', `
        <h2 style="color:#2D4A3E;margin-top:0;">Quick check-in, ${name}</h2>
        <p>It's been a while since we last connected. Your license renewal is coming up sooner than you think — here's a 30-second prompt to make sure you're on track.</p>
        <p><strong>Three things worth doing today:</strong></p>
        <ul style="line-height:1.8;color:#444;">
          <li>Open your CounselorReady dashboard and confirm your renewal date is correct.</li>
          <li>Check how many CE hours you've earned vs. how many your state requires.</li>
          <li>Pick one course for this month — even one hour now beats scrambling at renewal time.</li>
        </ul>
        <div style="text-align:center;margin:24px 0;">
          <a href="${BASE_URL}/dashboard.html" style="background:#6b1d34;color:#fff;padding:14px 28px;text-decoration:none;border-radius:6px;font-weight:bold;">Check My Status</a>
        </div>
        <p style="font-size:13px;color:#666;text-align:center;">Not ready to commit to a paid plan? That's fine — your free account will always be here when you need it.</p>
      `);
    }
  } catch (err) {
    console.error('[NotifTrigger] triggerNonPaidCheckIn error:', err.message);
  }
}

export default {
  shouldSendEmail,
  shouldSendSms,
  triggerCourseCompleted,
  triggerCertificateReady,
  triggerCourseReminder,
  triggerCeRenewalReminder,
  triggerCeMilestone,
  triggerLowHoursAlert,
  triggerCredentialExpiring,
  triggerInsuranceExpiring,
  triggerNewCourseAnnouncement,
  triggerNewLiveSessionAnnouncement,
  triggerWeeklyDigest,
  triggerTrialEndingSoon,
  triggerTrialEndingTomorrow,
  triggerTrialEnded,
  triggerNonPaidCheckIn
};
