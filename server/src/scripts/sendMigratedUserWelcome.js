/**
 * sendMigratedUserWelcome.js
 * ──────────────────────────
 * Sends branded welcome/onboarding emails with password-reset links to all
 * TalentLMS-migrated users who haven't received one yet.
 *
 * PREREQUISITE: Run fixMigratedUserFields.js FIRST so profile.firstName exists
 *               and user.save() won't fail on Mongoose validation.
 *
 * What it does for each user:
 *   1. Generates a password reset token (same crypto as forgot-password)
 *   2. Stores token hash + 7-day expiry on the user document
 *   3. Sends branded welcome email via Resend
 *   4. Sets migration.welcomeEmailSent = true
 *
 * Usage (from Render shell, inside server/):
 *   node src/scripts/sendMigratedUserWelcome.js              # dry-run
 *   APPLY=1 node src/scripts/sendMigratedUserWelcome.js      # send emails
 *   APPLY=1 EMAIL=jane@example.com node src/scripts/sendMigratedUserWelcome.js  # single user
 *
 * Requires: MONGODB_URI, RESEND_API_KEY environment variables
 */

import mongoose from 'mongoose';
import crypto from 'crypto';
import { Resend } from 'resend';

const MONGODB_URI = process.env.MONGODB_URI;
const RESEND_API_KEY = process.env.RESEND_API_KEY;

if (!MONGODB_URI) { console.error('❌  MONGODB_URI not set'); process.exit(1); }
if (!RESEND_API_KEY && process.env.APPLY === '1') {
  console.error('❌  RESEND_API_KEY not set (required in APPLY mode)');
  process.exit(1);
}

const DRY_RUN = process.env.APPLY !== '1';
const SINGLE_EMAIL = process.env.EMAIL?.toLowerCase() || null;
const CLIENT_URL = process.env.CLIENT_URL || 'https://counselorready.com';
const RESET_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 days for onboarding
const SEND_DELAY_MS = 1500; // 1.5s between sends to avoid Resend rate limits

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function buildWelcomeEmail(firstName, resetUrl) {
  return `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e8e6e3; border-radius: 12px; overflow: hidden;">
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #4A7C59, #6B1D34); padding: 36px 30px; text-align: center;">
        <h1 style="color: #D4A855; margin: 0; font-size: 28px; letter-spacing: 1px;">CounselorReady</h1>
        <p style="color: rgba(255,255,255,0.85); margin: 6px 0 0 0; font-size: 11px; letter-spacing: 3px; text-transform: uppercase;">Learn. License. Lead.</p>
      </div>

      <!-- Body -->
      <div style="padding: 36px 30px; background: #fff;">
        <h2 style="color: #6B1D34; margin: 0 0 20px 0; font-size: 22px;">Welcome to Your New CE Home</h2>

        <p style="color: #333; line-height: 1.7; margin: 0 0 16px 0;">
          Hi ${firstName},
        </p>

        <p style="color: #333; line-height: 1.7; margin: 0 0 16px 0;">
          Your continuing education account has been upgraded to the new CounselorReady platform — 
          bringing you interactive courses, real-time progress tracking, NBCC-approved certificates, 
          and clinical tools all in one place.
        </p>

        <p style="color: #333; line-height: 1.7; margin: 0 0 24px 0;">
          To get started, set your password by clicking the button below:
        </p>

        <div style="text-align: center; margin: 32px 0;">
          <a href="${resetUrl}" style="background: linear-gradient(135deg, #6B1D34, #8B2542); color: #fff; padding: 16px 36px; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 12px rgba(107,29,52,0.3);">
            Set My Password
          </a>
        </div>

        <p style="color: #888; font-size: 13px; margin: 24px 0 8px 0; text-align: center;">
          This link is valid for 7 days. After that you can use 
          <a href="${CLIENT_URL}/forgot-password.html" style="color: #6B1D34;">Forgot Password</a> anytime.
        </p>

        <!-- What's new -->
        <div style="background: #F8F7F4; border-radius: 10px; padding: 20px 24px; margin: 28px 0 0 0;">
          <p style="color: #4A7C59; font-weight: bold; margin: 0 0 12px 0; font-size: 14px;">What's new on CounselorReady:</p>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 4px 8px 4px 0; color: #D4A855; font-size: 16px; vertical-align: top;">&#9679;</td>
              <td style="padding: 4px 0; color: #555; font-size: 14px; line-height: 1.5;">60+ interactive CE courses with built-in knowledge checks</td>
            </tr>
            <tr>
              <td style="padding: 4px 8px 4px 0; color: #D4A855; font-size: 16px; vertical-align: top;">&#9679;</td>
              <td style="padding: 4px 0; color: #555; font-size: 14px; line-height: 1.5;">Instant NBCC-approved certificates upon completion</td>
            </tr>
            <tr>
              <td style="padding: 4px 8px 4px 0; color: #D4A855; font-size: 16px; vertical-align: top;">&#9679;</td>
              <td style="padding: 4px 0; color: #555; font-size: 14px; line-height: 1.5;">CE Planner, Self-Care Rewards, and clinical tools</td>
            </tr>
            <tr>
              <td style="padding: 4px 8px 4px 0; color: #D4A855; font-size: 16px; vertical-align: top;">&#9679;</td>
              <td style="padding: 4px 0; color: #555; font-size: 14px; line-height: 1.5;">Your past course completions are already transferred</td>
            </tr>
          </table>
        </div>
      </div>

      <!-- Footer -->
      <div style="background: #F8F7F4; padding: 20px 30px; text-align: center; border-top: 1px solid #e8e6e3;">
        <p style="margin: 0 0 4px 0; color: #888; font-size: 12px;">
          GA Integrated Therapeutic Perspectives LLC | NBCC Approved Continuing Education Provider (ACEP #7760)
        </p>
        <p style="margin: 0; color: #aaa; font-size: 11px;">
          Questions? Reply to this email or visit 
          <a href="${CLIENT_URL}" style="color: #6B1D34; text-decoration: none;">counselorready.com</a>
        </p>
      </div>
    </div>
  `;
}

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log('✅  Connected to MongoDB');
  console.log(DRY_RUN ? '🔍  DRY RUN — no emails sent\n' : '📧  APPLY MODE — sending emails\n');
  if (SINGLE_EMAIL) console.log(`🎯  Single-user mode: ${SINGLE_EMAIL}\n`);

  const db = mongoose.connection.db;
  const usersCol = db.collection('users');

  // Build query
  const query = { 'migration.source': 'talentlms' };
  if (SINGLE_EMAIL) {
    query.email = SINGLE_EMAIL;
  } else {
    // Only users who haven't received a welcome email
    query['migration.welcomeEmailSent'] = { $ne: true };
  }

  const users = await usersCol.find(query).toArray();
  console.log(`Found ${users.length} migrated user(s) to email\n`);

  if (users.length === 0) {
    console.log('Nothing to send.');
    await mongoose.disconnect();
    return;
  }

  // Pre-flight: verify profile.firstName exists (fix script must have run)
  const unfixed = users.filter(u => !u.profile?.firstName);
  if (unfixed.length > 0) {
    console.error('❌  These users are missing profile.firstName — run fixMigratedUserFields.js first:');
    unfixed.forEach(u => console.error(`     ${u.email}`));
    await mongoose.disconnect();
    process.exit(1);
  }

  let sent = 0;
  let skipped = 0;
  let errors = 0;

  for (const user of users) {
    const email = user.email;
    const firstName = user.profile?.firstName || 'there';

    // Generate reset token (same pattern as auth.js forgot-password)
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
    const resetUrl = `${CLIENT_URL}/reset-password.html?token=${resetToken}`;

    console.log(`  📨  ${email} (${firstName})`);

    if (!DRY_RUN) {
      try {
        // Store token + 7-day expiry
        await usersCol.updateOne(
          { _id: user._id },
          {
            $set: {
              passwordResetToken: resetTokenHash,
              passwordResetExpires: new Date(Date.now() + RESET_EXPIRY_MS),
              'migration.welcomeEmailSent': true,
              'migration.welcomeEmailSentAt': new Date()
            }
          }
        );

        // Send email
        const { error } = await resend.emails.send({
          from: 'CounselorReady <noreply@counselorready.com>',
          to: email,
          subject: 'Welcome to CounselorReady — Set Your Password',
          html: buildWelcomeEmail(firstName, resetUrl)
        });

        if (error) {
          console.error(`      ❌ Resend error: ${error.message}`);
          // Roll back welcomeEmailSent so we can retry
          await usersCol.updateOne(
            { _id: user._id },
            { $set: { 'migration.welcomeEmailSent': false } }
          );
          errors++;
        } else {
          console.log(`      ✅ sent`);
          sent++;
        }

        // Rate-limit delay
        await sleep(SEND_DELAY_MS);

      } catch (err) {
        console.error(`      ❌ error: ${err.message}`);
        errors++;
      }
    } else {
      console.log(`      → would send welcome email`);
      console.log(`      → reset link: ${resetUrl}`);
      sent++;
    }
  }

  console.log(`\n── Summary ──`);
  console.log(`  Total eligible:  ${users.length}`);
  console.log(`  ${DRY_RUN ? 'Would send' : 'Sent'}:       ${sent}`);
  if (skipped) console.log(`  Skipped:         ${skipped}`);
  if (errors) console.log(`  Errors:          ${errors}`);

  if (DRY_RUN && sent > 0) {
    console.log(`\n⚡ Run with APPLY=1 to send emails.`);
    console.log(`   Or target one user: APPLY=1 EMAIL=user@example.com`);
  }

  await mongoose.disconnect();
}

run().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
