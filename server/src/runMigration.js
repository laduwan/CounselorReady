/**
 * TalentLMS → CounselorReady Migration Script
 * 
 * USAGE:
 * 1. Put this file in: server/src/scripts/runMigration.js
 * 2. Put counselorready-migration-data.json in same folder
 * 3. Run: node src/scripts/runMigration.js
 * 
 * This will:
 * - Create all user accounts
 * - Record their completions
 * - Grant free course access
 * - Send activation emails to everyone
 */

import mongoose from 'mongoose';
import crypto from 'crypto';
import { Resend } from 'resend';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================
// CONFIG - UPDATE THESE
// ============================================
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/counselorready';
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://counselorready.com';

// Set to false for dry run (no emails sent)
const SEND_EMAILS = true;

// Course mapping - UPDATE WITH YOUR ACTUAL COURSE ID
const TELEMENTAL_HEALTH_COURSE_ID = null; // Put your MongoDB ObjectId here, e.g., '65abc123def456'

// ============================================
// SETUP
// ============================================
const resend = new Resend(RESEND_API_KEY);

const COLORS = {
  burgundy: '#6b1d34',
  forest: '#34503d',
  gold: '#d4a012',
  stone: '#f5f5f4'
};

// ============================================
// USER SCHEMA (inline to avoid import issues)
// ============================================
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String },
  role: { type: String, default: 'user' },
  status: { type: String, default: 'pending' },
  profile: {
    firstName: String,
    lastName: String,
    licenseNumber: String
  },
  activationToken: String,
  activationExpires: Date,
  migratedFrom: String,
  migrationData: {
    talentlmsId: Number,
    talentlmsLogin: String,
    importedAt: Date
  },
  courseCompletions: [{
    courseName: String,
    courseId: mongoose.Schema.Types.ObjectId,
    completedAt: Date,
    source: String
  }],
  grantedCourseAccess: [{
    courseId: mongoose.Schema.Types.ObjectId,
    grantedAt: Date,
    reason: String
  }]
}, { timestamps: true, strict: false });

// ============================================
// EMAIL TEMPLATE
// ============================================
const emailWrapper = (content, preheader = '') => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
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
              <p style="margin: 0 0 8px 0; color: ${COLORS.forest}; font-size: 12px;">
                NBCC Approved Continuing Education Provider (ACEP #7760)
              </p>
              <p style="margin: 0; color: #999999; font-size: 11px;">
                © ${new Date().getFullYear()} GA Integrated Therapeutic Perspectives LLC
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

function getMigrationEmailContent(firstName, activationLink, hasFreeCourse) {
  return `
    <h2 style="margin: 0 0 16px 0; color: ${COLORS.burgundy}; font-size: 24px;">
      Hi ${firstName},
    </h2>
    
    <p style="margin: 0 0 16px 0; color: ${COLORS.forest}; font-size: 16px; line-height: 1.6;">
      <strong>GA ITP Academy has evolved into CounselorReady</strong> — a brand new CE platform built for mental health professionals like you.
    </p>
    
    <div style="background-color: ${COLORS.stone}; border-radius: 12px; padding: 20px; margin: 24px 0;">
      <p style="margin: 0 0 12px 0; color: ${COLORS.forest}; font-size: 15px;">
        ✓ <strong>Your CE credits transferred</strong>
      </p>
      <p style="margin: 0 0 12px 0; color: ${COLORS.forest}; font-size: 15px;">
        ✓ <strong>Same NBCC approval</strong> (ACEP #7760)
      </p>
      ${hasFreeCourse ? `
      <p style="margin: 0; color: ${COLORS.burgundy}; font-size: 15px; font-weight: 600;">
        ✓ <strong>FREE: Updated Telemental Health course</strong>
      </p>
      ` : ''}
    </div>
    
    <div style="text-align: center; margin: 32px 0;">
      <a href="${activationLink}" 
         style="display: inline-block; background-color: ${COLORS.burgundy}; color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: 600; font-size: 16px;">
        Activate Your Account
      </a>
    </div>
    
    <p style="margin: 0 0 24px 0; color: #666; font-size: 13px; text-align: center;">
      This link expires in 14 days
    </p>
    
    <p style="margin: 0; color: ${COLORS.burgundy}; font-size: 15px;">
      <strong>Kejuiana Johnson, LPC</strong><br>
      <span style="color: ${COLORS.forest};">Founder, CounselorReady</span>
    </p>
  `;
}

// ============================================
// MAIN MIGRATION FUNCTION
// ============================================
async function runMigration() {
  console.log('');
  console.log('='.repeat(50));
  console.log('  TalentLMS → CounselorReady Migration');
  console.log('='.repeat(50));
  console.log('');

  // Connect to MongoDB
  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGO_URI);
  console.log('✓ Connected\n');

  const User = mongoose.model('User', userSchema);

  // Load migration data
  const dataPath = path.join(__dirname, 'counselorready-migration-data.json');
  if (!fs.existsSync(dataPath)) {
    console.error('ERROR: counselorready-migration-data.json not found!');
    console.error('Put it in the same folder as this script.');
    process.exit(1);
  }

  const migrationData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  console.log(`Loaded: ${migrationData.users.length} users, ${migrationData.completions.length} completions\n`);

  // Build completions lookup by email
  const completionsByEmail = {};
  for (const completion of migrationData.completions || []) {
    const user = migrationData.users.find(u => u.login === completion.userLogin);
    if (user?.email) {
      const email = user.email.toLowerCase();
      if (!completionsByEmail[email]) {
        completionsByEmail[email] = [];
      }
      completionsByEmail[email].push(completion);
    }
  }

  // Results tracking
  const results = {
    created: 0,
    skipped: 0,
    emailsSent: 0,
    emailsFailed: 0,
    errors: []
  };

  // Process each user
  console.log('Processing users...\n');

  for (const userData of migrationData.users) {
    if (!userData.email) {
      results.skipped++;
      continue;
    }

    const email = userData.email.toLowerCase();
    
    try {
      // Check if exists
      const existing = await User.findOne({ email });
      if (existing) {
        console.log(`  SKIP: ${email} (already exists)`);
        results.skipped++;
        continue;
      }

      // Generate activation token
      const activationToken = crypto.randomBytes(32).toString('hex');
      const activationExpires = new Date();
      activationExpires.setDate(activationExpires.getDate() + 14);

      // Check if user completed Telemental Health course
      const userCompletions = completionsByEmail[email] || [];
      const completedTelemental = userCompletions.some(c => 
        c.courseName.includes('TeleMental Health') || 
        c.courseName.includes('Telemental Health')
      );

      // Build user object
      const newUserData = {
        email,
        password: crypto.randomBytes(32).toString('hex'),
        role: 'user',
        status: 'pending',
        profile: {
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          licenseNumber: userData.licenseNumber || ''
        },
        activationToken,
        activationExpires,
        migratedFrom: 'talentlms',
        migrationData: {
          talentlmsId: userData.talentlmsId,
          talentlmsLogin: userData.login,
          importedAt: new Date()
        },
        courseCompletions: userCompletions.map(c => ({
          courseName: c.courseName,
          completedAt: c.completedDate ? new Date(c.completedDate) : new Date(),
          source: 'talentlms'
        }))
      };

      // Grant free access if they completed Telemental Health
      if (completedTelemental && TELEMENTAL_HEALTH_COURSE_ID) {
        newUserData.grantedCourseAccess = [{
          courseId: new mongoose.Types.ObjectId(TELEMENTAL_HEALTH_COURSE_ID),
          grantedAt: new Date(),
          reason: 'migration_bonus'
        }];
      }

      // Create user
      const newUser = await User.create(newUserData);
      results.created++;

      const firstName = userData.firstName || 'there';
      const activationLink = `${FRONTEND_URL}/activate?token=${activationToken}`;

      // Send email
      if (SEND_EMAILS && RESEND_API_KEY) {
        try {
          await resend.emails.send({
            from: 'CounselorReady <noreply@counselorready.com>',
            to: email,
            replyTo: 'support@counselorready.com',
            subject: "Your CounselorReady account is ready — action required",
            html: emailWrapper(
              getMigrationEmailContent(firstName, activationLink, completedTelemental),
              'Your CE credits have been transferred to CounselorReady'
            )
          });
          results.emailsSent++;
          console.log(`  ✓ ${email} - created + email sent`);
        } catch (emailErr) {
          results.emailsFailed++;
          console.log(`  ✓ ${email} - created (email failed: ${emailErr.message})`);
        }
      } else {
        console.log(`  ✓ ${email} - created (email skipped)`);
      }

      // Small delay to avoid rate limiting
      await new Promise(r => setTimeout(r, 100));

    } catch (err) {
      console.log(`  ✗ ${email} - ERROR: ${err.message}`);
      results.errors.push({ email, error: err.message });
    }
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('  MIGRATION COMPLETE');
  console.log('='.repeat(50));
  console.log(`  Users created:  ${results.created}`);
  console.log(`  Users skipped:  ${results.skipped}`);
  console.log(`  Emails sent:    ${results.emailsSent}`);
  console.log(`  Emails failed:  ${results.emailsFailed}`);
  console.log(`  Errors:         ${results.errors.length}`);
  console.log('='.repeat(50));
  console.log('');

  if (results.errors.length > 0) {
    console.log('Errors:');
    results.errors.forEach(e => console.log(`  - ${e.email}: ${e.error}`));
    console.log('');
  }

  await mongoose.disconnect();
  console.log('Done!\n');
}

// Run it
runMigration().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
