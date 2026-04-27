/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import { Resend } from 'resend';
import User from '../models/User.js';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = 'CounselorReady <noreply@counselorready.com>';

const COLORS = {
  burgundy: '#6b1d34',
  forest: '#34503d',
  gold: '#d4a012',
  stone: '#f5f5f4'
};

const FREE_COURSE_LIMIT = 4;

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

/**
 * Check if a free-tier user has hit their monthly course limit and send an email.
 * Called after certificate generation in the course completion flow.
 */
export async function checkAndSendFreeLimit(userId) {
  const user = await User.findById(userId);
  if (!user) return;

  // Only applies to free-plan users
  const plan = user.subscription?.plan || 'free';
  if (plan !== 'free') return;

  // Reset monthly counters if month has changed
  const currentMonth = new Date().toISOString().slice(0, 7); // "YYYY-MM"
  if (user.freeCoursesResetMonth !== currentMonth) {
    user.freeCoursesUsedThisMonth = 0;
    user.freeLimitEmailSentThisMonth = false;
    user.freeCoursesResetMonth = currentMonth;
  }

  // Increment usage
  user.freeCoursesUsedThisMonth += 1;

  // Check if limit reached and email not yet sent
  if (user.freeCoursesUsedThisMonth >= FREE_COURSE_LIMIT && !user.freeLimitEmailSentThisMonth) {
    const firstName = user.profile?.firstName || 'there';

    const content = `
      <h2 style="margin: 0 0 16px 0; color: ${COLORS.burgundy}; font-size: 22px;">
        Great job completing your courses, ${firstName}!
      </h2>
      <p style="margin: 0 0 16px 0; color: #333333; font-size: 16px; line-height: 1.6;">
        You've completed <strong>${user.freeCoursesUsedThisMonth} courses</strong> this month and reached your free plan limit of ${FREE_COURSE_LIMIT} courses per month.
      </p>
      <p style="margin: 0 0 24px 0; color: #333333; font-size: 16px; line-height: 1.6;">
        To continue earning CE credits without interruption, upgrade to a paid plan and unlock unlimited courses, CE tracking, credential management, and more.
      </p>
      <div style="text-align: center; margin: 32px 0;">
        <a href="https://app.counselorready.com/settings?tab=billing"
           style="display: inline-block; padding: 14px 32px; background-color: ${COLORS.burgundy}; color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: 600;">
          Upgrade Your Plan
        </a>
      </div>
      <p style="margin: 24px 0 0 0; color: #666666; font-size: 14px; line-height: 1.5;">
        Your free courses will reset next month. In the meantime, you can still access your certificates and track your CE progress.
      </p>
    `;

    await resend.emails.send({
      from: FROM_EMAIL,
      to: user.email,
      subject: "You've reached your free monthly course limit",
      html: emailWrapper(content, 'Upgrade to unlock unlimited CE courses')
    });

    user.freeLimitEmailSentThisMonth = true;
    console.log(`Free limit email sent to ${user.email}`);
  }

  await user.save();
}
