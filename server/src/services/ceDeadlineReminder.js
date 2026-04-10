/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import { Resend } from 'resend';
import UserCredential from '../models/UserCredential.js';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = 'CounselorReady <notifications@counselorready.com>';

const COLORS = {
  burgundy: '#6b1d34',
  forest: '#34503d',
  gold: '#d4a012',
  stone: '#f5f5f4'
};

const THRESHOLDS = [
  { days: 90, field: 'reminderSent_90d' },
  { days: 60, field: 'reminderSent_60d' },
  { days: 30, field: 'reminderSent_30d' }
];

const emailWrapper = (content, preheader = '') => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CounselorReady</title>
</head>
<body style="margin: 0; padding: 0; background-color: ${COLORS.stone}; font-family: 'Helvetica Neue', Arial, sans-serif;">
  ${preheader ? `<div style="display: none; max-height: 0; overflow: hidden;">${preheader}</div>` : ''}
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: ${COLORS.stone};">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
          <tr>
            <td style="background-color: ${COLORS.burgundy}; padding: 24px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">
                <span style="color: ${COLORS.gold};">Counselor</span>Ready
              </h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              ${content}
            </td>
          </tr>
          <tr>
            <td style="background-color: ${COLORS.stone}; padding: 24px; text-align: center; border-top: 1px solid #e5e5e5;">
              <img src="https://counselorready.com/images/nbcc-provider-badge.jpg" alt="NBCC Provider" style="height: 40px; margin-bottom: 12px;">
              <p style="margin: 0 0 8px 0; color: ${COLORS.forest}; font-size: 12px;">
                NBCC Approved Continuing Education Provider (ACEP #7760)
              </p>
              <p style="margin: 0; color: #999999; font-size: 11px;">
                &copy; ${new Date().getFullYear()} GA Integrated Therapeutic Perspectives LLC
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

function getUrgencyColor(days) {
  if (days <= 30) return '#dc2626';
  if (days <= 60) return '#f59e0b';
  return COLORS.forest;
}

/**
 * Run daily CE deadline reminders.
 * Checks UserCredential expiration dates and sends emails at 90, 60, 30 day thresholds.
 */
export async function runDeadlineReminders() {
  console.log('Running CE deadline reminder check...');
  const now = new Date();
  let totalSent = 0;

  for (const { days, field } of THRESHOLDS) {
    try {
      const targetDate = new Date(now);
      targetDate.setDate(targetDate.getDate() + days);

      const startOfDay = new Date(targetDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(targetDate);
      endOfDay.setHours(23, 59, 59, 999);

      const credentials = await UserCredential.find({
        expirationDate: { $gte: startOfDay, $lte: endOfDay },
        remindersEnabled: { $ne: false },
        [field]: { $ne: true }
      }).populate('userId', 'email profile notifications');

      console.log(`  Found ${credentials.length} credentials expiring in ${days} days`);

      for (const credential of credentials) {
        if (!credential.userId || !credential.userId.email) continue;

        const user = credential.userId;

        // Respect user notification preferences
        if (user.notifications?.email?.credentialExpiring === false) continue;

        const firstName = user.profile?.firstName || 'there';
        const credentialName = credential.name || credential.type || 'credential';
        const expirationStr = credential.expirationDate.toLocaleDateString('en-US', {
          month: 'long', day: 'numeric', year: 'numeric'
        });
        const urgencyColor = getUrgencyColor(days);

        const content = `
          <h2 style="margin: 0 0 16px 0; color: ${COLORS.burgundy}; font-size: 22px;">
            Credential Renewal Reminder
          </h2>
          <p style="margin: 0 0 16px 0; color: #333333; font-size: 16px; line-height: 1.6;">
            Hi ${firstName}, your <strong>${credentialName}</strong> expires in <span style="color: ${urgencyColor}; font-weight: 700;">${days} days</span> (${expirationStr}).
          </p>
          <div style="background-color: ${COLORS.stone}; border-left: 4px solid ${urgencyColor}; padding: 16px; border-radius: 4px; margin: 16px 0;">
            <p style="margin: 0; color: #333333; font-size: 14px;">
              <strong>CE Progress:</strong> ${credential.totalCEUsCompleted || 0} / ${credential.totalCEUsRequired || 0} hours completed
            </p>
          </div>
          <p style="margin: 16px 0; color: #333333; font-size: 16px; line-height: 1.6;">
            Make sure you have enough CE hours before your renewal deadline. Log in to track your progress and find courses.
          </p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="https://app.counselorready.com/credentials"
               style="display: inline-block; padding: 14px 32px; background-color: ${COLORS.burgundy}; color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: 600;">
              View My Credentials
            </a>
          </div>
        `;

        try {
          await resend.emails.send({
            from: FROM_EMAIL,
            to: user.email,
            subject: `Your ${credentialName} expires in ${days} days`,
            html: emailWrapper(content, `${credentialName} expires ${expirationStr}`)
          });

          credential[field] = true;
          await credential.save();
          totalSent++;
        } catch (emailErr) {
          console.error(`  Failed to send reminder to ${user.email}:`, emailErr.message);
        }

        // Small delay to avoid rate limiting
        await new Promise(r => setTimeout(r, 100));
      }
    } catch (error) {
      console.error(`  Error processing ${days}-day reminders:`, error.message);
    }
  }

  console.log(`CE deadline reminder check complete. Sent ${totalSent} emails.`);
}
