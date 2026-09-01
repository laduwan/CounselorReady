/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
// Sends admin alert emails to the platform owner via Resend
// Drop into server/src/services/ — import wherever activity is tracked

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const ADMIN_EMAIL  = process.env.ADMIN_ALERT_EMAIL || 'ke@counselorready.com';
const FROM_EMAIL   = process.env.FROM_EMAIL        || 'CounselorReady <noreply@counselorready.com>';
const PLATFORM_URL = process.env.PLATFORM_URL      || 'https://counselorready.com';

const BURGUNDY = '#6B1D34';
const GREEN    = '#4A7C59';
const GOLD     = '#D4A855';
const NAVY     = '#284157';
const STONE    = '#F8F7F4';

const EVENT_CONFIG = {
  user_registered:       { emoji: '🎉', label: 'New Registration',       color: GREEN,     adminLink: '/admin-users.html'     },
  user_enrolled:         { emoji: '📚', label: 'New Enrollment',         color: NAVY,      adminLink: '/admin-users.html'     },
  course_completed:      { emoji: '✅', label: 'Course Completed',        color: GREEN,     adminLink: '/admin-analytics.html' },
  quiz_failed:           { emoji: '❌', label: 'Quiz Failed',             color: '#B91C1C', adminLink: '/admin-analytics.html' },
  subscription_started:  { emoji: '💳', label: 'New Subscription',       color: GOLD,      adminLink: '/admin-users.html'     },
  subscription_canceled: { emoji: '⚠️', label: 'Subscription Canceled',  color: '#B45309', adminLink: '/admin-users.html'     },
  certificate_generated: { emoji: '📜', label: 'Certificate Generated',  color: GREEN,     adminLink: '/admin-analytics.html' },
  tool_used:             { emoji: '🛠️', label: 'Free Tool Used',         color: NAVY,      adminLink: '/admin-tool-analytics.html' },
  db_backup:             { emoji: '🗄️', label: 'DB Backup Written',      color: GREEN,     adminLink: '/admin-migration.html' },
  db_backup_failed:      { emoji: '🚨', label: 'DB Backup FAILED',       color: '#B91C1C', adminLink: '/admin-migration.html' },
};

function buildEmailHtml({ emoji, label, color, rows, adminLink }) {
  const rowsHtml = rows
    .map(([k, v]) => `
      <tr>
        <td style="padding:6px 16px;color:#64748b;font-size:13px;white-space:nowrap;border-bottom:1px solid #f1f5f9;">${k}</td>
        <td style="padding:6px 16px;color:#1e293b;font-size:13px;font-weight:600;border-bottom:1px solid #f1f5f9;">${v || '—'}</td>
      </tr>`)
    .join('');

  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:${STONE};font-family:'Segoe UI',sans-serif;">
  <div style="max-width:540px;margin:32px auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0;">
    <div style="background:${BURGUNDY};padding:22px 24px;">
      <div style="font-size:26px;margin-bottom:4px;">${emoji}</div>
      <div style="color:#fff;font-size:17px;font-weight:700;">${label}</div>
      <div style="font-size:12px;margin-top:3px;">
        <span style="color:rgba(255,255,255,0.85);font-weight:600;">Counselor</span><span style="color:${GOLD};font-weight:600;">Ready</span><span style="color:rgba(255,255,255,0.6);">™ Admin Alert</span>
      </div>
    </div>
    <table style="width:100%;border-collapse:collapse;"><tbody>${rowsHtml}</tbody></table>
    <div style="padding:8px 16px;background:${STONE};font-size:11px;color:#94a3b8;">
      ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York', dateStyle: 'full', timeStyle: 'short' })} ET
    </div>
    <div style="padding:18px 24px;">
      <a href="${PLATFORM_URL}${adminLink}"
         style="display:inline-block;background:${color};color:#fff;padding:9px 20px;border-radius:8px;text-decoration:none;font-size:13px;font-weight:600;">
        View in Admin Panel →
      </a>
    </div>
    <div style="padding:14px 24px;border-top:1px solid #f1f5f9;font-size:11px;color:#94a3b8;text-align:center;">
      CounselorReady™ · NBCC ACEP Provider #7760 · GAITP LLC
    </div>
  </div>
</body></html>`;
}

/**
 * Send an admin alert email for a platform event.
 *
 * Usage — add to activityTrackingService.js after recording each event:
 *
 *   import { sendAdminAlert } from './adminNotificationService.js';
 *   await sendAdminAlert('user_registered', { userName, userEmail, plan, state });
 *
 * Add ADMIN_ALERT_EMAIL to your Render env vars (defaults to ke@counselorready.com).
 */
export async function sendAdminAlert(eventType, data = {}) {
  const cfg = EVENT_CONFIG[eventType];
  if (!cfg) return;

  let rows = [];
  let subject = `${cfg.emoji} ${cfg.label}`;

  switch (eventType) {
    case 'user_registered':
      subject += ` — ${data.userName || data.userEmail}`;
      rows = [
        ['Name',  data.userName  || ''],
        ['Email', data.userEmail || ''],
        ['Plan',  data.plan      || 'Free'],
        ['State', data.state     || 'Not set'],
      ];
      break;
    case 'user_enrolled':
      subject += ` — ${data.courseName}`;
      rows = [
        ['User',   data.userName   || data.userEmail || ''],
        ['Course', data.courseName || ''],
        ['Code',   data.courseCode || ''],
        ['CE Hrs', data.ceHours ? `${data.ceHours} hrs` : ''],
      ];
      break;
    case 'course_completed':
      subject += ` — ${data.courseName}`;
      rows = [
        ['User',   data.userName   || data.userEmail || ''],
        ['Course', data.courseName || ''],
        ['Score',  data.score ? `${data.score}%` : ''],
        ['CE Hrs', data.ceHours ? `${data.ceHours} hrs` : ''],
      ];
      break;
    case 'quiz_failed':
      subject += ` — ${data.userName || data.userEmail}`;
      rows = [
        ['User',     data.userName   || data.userEmail || ''],
        ['Course',   data.courseName || ''],
        ['Score',    data.score ? `${data.score}%` : ''],
        ['Attempts', data.attempts ? `${data.attempts} / 3` : ''],
      ];
      break;
    case 'subscription_started':
      subject += ` — ${(data.plan || '').toUpperCase()} plan`;
      rows = [
        ['User', data.userName || data.userEmail || ''],
        ['Plan', data.plan || ''],
        ['MRR',  data.amount ? `$${(data.amount / 100).toFixed(2)}/mo` : ''],
      ];
      break;
    case 'subscription_canceled':
      subject += ` — ${data.userName || data.userEmail}`;
      rows = [
        ['User',   data.userName  || data.userEmail || ''],
        ['Plan',   data.plan      || ''],
        ['Reason', data.reason    || 'Not provided'],
      ];
      break;
    case 'certificate_generated':
      subject += ` — ${data.courseName}`;
      rows = [
        ['User',   data.userName   || data.userEmail || ''],
        ['Course', data.courseName || ''],
        ['Cert #', data.certNumber || ''],
        ['CE Hrs', data.ceHours ? `${data.ceHours} hrs` : ''],
      ];
      break;
    case 'tool_used':
      subject += ` — ${data.toolName || data.tool || 'tool'}`;
      rows = [
        ['Tool',  data.toolName || data.tool || ''],
        ['Event', data.event || 'used'],
        ['User',  data.userName || data.userEmail || 'Anonymous'],
        ['State', data.state || ''],
      ];
      break;
    case 'db_backup':
    case 'db_backup_failed':
      // Operational notice — data is already a flat label→value map built by dbBackupService.
      subject += ` — ${data.Date || data.Courses || data.Job || ''}`.replace(/ — $/, '');
      rows = Object.entries(data).map(([k, v]) => [k, String(v)]);
      break;
    default:
      rows = Object.entries(data).map(([k, v]) => [k, String(v)]);
  }

  const html = buildEmailHtml({ ...cfg, rows });

  try {
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject,
      html,
    });
    if (error) {
      console.error(`[adminNotifications] Resend error (${eventType}):`, error);
    } else {
      console.log(`[adminNotifications] ✅ Alert sent: ${subject}`);
    }
  } catch (err) {
    // Never throw — a failed alert must not break the request
    console.error(`[adminNotifications] Failed (${eventType}):`, err.message);
  }
}

/**
 * Conditional send — checks admin prefs object before firing.
 * prefs shape: { user_registered: true, quiz_failed: false, ... }
 * All events default ON if prefs key is absent.
 */
export async function sendAdminAlertIfEnabled(prefs = {}, eventType, data) {
  if (prefs[eventType] === false) return;
  return sendAdminAlert(eventType, data);
}
