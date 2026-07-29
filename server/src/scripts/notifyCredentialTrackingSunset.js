/**
 * notifyCredentialTrackingSunset.js
 * ──────────────────────────────────
 * Sends a one-time email to Free-tier users (no active subscription) who
 * have at least one tracked credential, explaining that credential
 * tracking is no longer included in the Free tier and their existing
 * entries will no longer generate renewal reminders.
 *
 * Targets: users where hasActiveSubscription() is false (status not in
 * 'active' | 'trial' | 'lifetime' | 'paused') AND who own at least one
 * UserCredential document. Paying and actively-trialing users are never
 * touched by this script.
 *
 * Usage (from Render shell, inside server/):
 *   node src/scripts/notifyCredentialTrackingSunset.js              # dry-run
 *   APPLY=1 node src/scripts/notifyCredentialTrackingSunset.js      # send emails
 *   APPLY=1 EMAIL=jane@example.com node src/scripts/notifyCredentialTrackingSunset.js  # single user
 *
 * Requires: MONGODB_URI, RESEND_API_KEY environment variables
 */

import mongoose from 'mongoose';
import { Resend } from 'resend';
import User from '../models/User.js';
import UserCredential from '../models/UserCredential.js';

const MONGODB_URI = process.env.MONGODB_URI;
const RESEND_API_KEY = process.env.RESEND_API_KEY;

if (!MONGODB_URI) { console.error('MONGODB_URI not set'); process.exit(1); }
if (!RESEND_API_KEY && process.env.APPLY === '1') {
  console.error('RESEND_API_KEY not set (required in APPLY mode)');
  process.exit(1);
}

const DRY_RUN = process.env.APPLY !== '1';
const SINGLE_EMAIL = process.env.EMAIL?.toLowerCase() || null;
const CLIENT_URL = process.env.CLIENT_URL || 'https://counselorready.com';
const SEND_DELAY_MS = 1500; // 1.5s between sends to avoid Resend rate limits

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;
const FROM_EMAIL = 'CounselorReady <noreply@counselorready.com>';
const ACTIVE_STATUSES = ['active', 'trial', 'lifetime', 'paused'];

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function buildEmail(firstName) {
  const subject = 'A change to credential tracking on your Free plan';
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Lato', Arial, sans-serif; line-height: 1.6; color: #2A2620; max-width: 600px; margin: 0 auto; padding: 24px; background: #F8F7F4; }
        .container { background: #FFFFFF; border-radius: 14px; padding: 32px; }
        .header { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 24px; color: #6B1D34; margin: 0 0 16px; }
        .summary { background: rgba(74, 124, 89, 0.06); border-left: 3px solid #4A7C59; padding: 16px 20px; border-radius: 4px; margin: 16px 0; }
        .cta { display: inline-block; margin: 20px 0; padding: 12px 28px; background: #D4A855; color: #4A2E10; font-weight: bold; text-decoration: none; border-radius: 8px; }
        .footer { color: #284157; font-size: 13px; margin-top: 24px; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1 class="header">A change to credential tracking</h1>
        <p>Hi ${firstName},</p>
        <p>Thanks for being part of CounselorReady — we're glad the Free plan has been useful for getting your CE hours organized.</p>
        <p>As we keep building the platform, we're updating what's included at each plan level. One change to know about: credential tracking (renewal dates, expiration reminders, and related notifications) will no longer be part of the Free plan.</p>
        <div class="summary">
          <p style="margin: 0;">Any credentials you've already entered are still saved on your account — you can still view them any time. Going forward, though, we won't be able to add new credentials, sync updates, or send you renewal reminders for them on the Free plan.</p>
        </div>
        <p>If you'd like to keep that peace of mind, Monthly ($35/mo) and Annual ($249/yr) plans both include full credential tracking with no state limit, plus renewal reminders so nothing slips through the cracks.</p>
        <a href="${CLIENT_URL}/subscription.html" class="cta">View plans</a>
        <div class="footer">
          <p>— The CounselorReady Team</p>
        </div>
      </div>
    </body>
    </html>
  `;
  return { subject, html };
}

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log(DRY_RUN ? 'DRY RUN — no emails will be sent' : 'APPLY MODE — emails will be sent');

  const credentialUserIds = await UserCredential.distinct('userId');
  console.log(`Users with at least one tracked credential: ${credentialUserIds.length}`);

  const query = {
    _id: { $in: credentialUserIds },
    'subscription.status': { $nin: ACTIVE_STATUSES },
    'subscription.credentialSunsetNoticeSentAt': { $exists: false }
  };
  if (SINGLE_EMAIL) query.email = SINGLE_EMAIL;

  const users = await User.find(query);
  console.log(`Affected users to notify: ${users.length}`);

  let sent = 0, failed = 0;
  for (const user of users) {
    const firstName = user.profile?.firstName || 'there';
    const { subject, html } = buildEmail(firstName);

    if (DRY_RUN) {
      console.log(`[DRY RUN] Would email ${user.email} (status: ${user.subscription.status})`);
      continue;
    }

    try {
      const { error } = await resend.emails.send({ from: FROM_EMAIL, to: user.email, subject, html });
      if (error) {
        console.error(`Failed to send to ${user.email}:`, error);
        failed++;
        continue;
      }
      user.subscription.credentialSunsetNoticeSentAt = new Date();
      await user.save();
      sent++;
      console.log(`Sent to ${user.email}`);
    } catch (err) {
      console.error(`Error sending to ${user.email}:`, err.message);
      failed++;
    }
    await sleep(SEND_DELAY_MS);
  }

  console.log(DRY_RUN ? 'Dry run complete.' : `Done. Sent: ${sent}, Failed: ${failed}`);
  await mongoose.disconnect();
}

run().catch(err => {
  console.error('Script error:', err);
  process.exit(1);
});
