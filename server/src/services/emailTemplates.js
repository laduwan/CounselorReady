/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
// services/emailTemplates.js
// Email templates for course completion notifications
// ===================================================

const PLATFORM_URL = process.env.PLATFORM_URL || 'https://counselorready.com';

/**
 * Course completion congratulations email
 */
export function getCourseCompletionEmail({ firstName, courseTitle, ceHours, certificateNumber, pdfUrl, assessmentScore }) {
  return {
    subject: `🎓 Congratulations! You've completed ${courseTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            line-height: 1.6; 
            color: #1e293b; 
            margin: 0;
            padding: 0;
            background-color: #f8fafc;
          }
          .wrapper { padding: 20px; }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: white;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          }
          .header { 
            background: linear-gradient(135deg, #0D9488 0%, #059669 100%); 
            padding: 40px 30px; 
            text-align: center; 
          }
          .header-icon {
            width: 80px;
            height: 80px;
            background: rgba(255,255,255,0.2);
            border-radius: 50%;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 16px;
          }
          .header h1 { 
            color: white; 
            margin: 0; 
            font-size: 28px; 
            font-weight: 700;
          }
          .header p {
            color: rgba(255,255,255,0.9);
            margin: 8px 0 0;
            font-size: 16px;
          }
          .content { padding: 40px 30px; }
          .cert-card {
            background: linear-gradient(135deg, #f0fdfa 0%, #ecfdf5 100%);
            border: 2px solid #10B981;
            border-radius: 12px;
            padding: 24px;
            margin: 24px 0;
            text-align: center;
          }
          .cert-card h2 {
            color: #0D9488;
            margin: 0 0 8px;
            font-size: 20px;
          }
          .cert-number {
            color: #059669;
            font-family: monospace;
            font-size: 14px;
            background: white;
            padding: 6px 12px;
            border-radius: 6px;
            display: inline-block;
            margin-top: 8px;
          }
          .btn { 
            display: inline-block; 
            background: #0D9488; 
            color: white !important; 
            padding: 14px 32px; 
            border-radius: 8px; 
            text-decoration: none; 
            font-weight: 600; 
            font-size: 16px;
            margin: 8px;
          }
          .btn-secondary {
            background: white;
            color: #0D9488 !important;
            border: 2px solid #0D9488;
          }
          .next-steps {
            background: #f8fafc;
            border-radius: 8px;
            padding: 20px;
            margin: 24px 0;
          }
          .next-steps h3 { margin: 0 0 12px; color: #1e293b; font-size: 16px; }
          .next-steps ul { margin: 0; padding-left: 20px; color: #64748b; }
          .next-steps li { margin: 8px 0; }
          .footer { 
            text-align: center; 
            padding: 24px; 
            background: #f8fafc;
            color: #64748b; 
            font-size: 13px;
            border-top: 1px solid #e2e8f0;
          }
          .footer a { color: #0D9488; }
        </style>
      </head>
      <body>
        <div class="wrapper">
          <div class="container">
            <div class="header">
              <div class="header-icon">
                <span style="font-size: 40px;">🎓</span>
              </div>
              <h1>Congratulations, ${firstName}!</h1>
              <p>You've successfully completed your course</p>
            </div>
            
            <div class="content">
              <div class="cert-card">
                <h2>${courseTitle}</h2>
                <span class="cert-number">Certificate #${certificateNumber}</span>
              </div>
              
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 24px 0;">
                <tr>
                  <td width="50%" align="center" style="padding: 16px;">
                    <div style="font-size: 32px; font-weight: 700; color: #0D9488;">${ceHours}</div>
                    <div style="font-size: 12px; color: #64748b; text-transform: uppercase;">CE Hours Earned</div>
                  </td>
                  <td width="50%" align="center" style="padding: 16px;">
                    <div style="font-size: 32px; font-weight: 700; color: #0D9488;">${assessmentScore || 'N/A'}%</div>
                    <div style="font-size: 12px; color: #64748b; text-transform: uppercase;">Assessment Score</div>
                  </td>
                </tr>
              </table>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${pdfUrl}" class="btn">📄 Download Certificate</a>
                <a href="${PLATFORM_URL}/credentials" class="btn btn-secondary">📊 View CE Tracker</a>
              </div>
              
              <div class="next-steps">
                <h3>✅ What happens next?</h3>
                <ul>
                  <li>Your CE hours have been automatically added to your tracker</li>
                  <li>Your certificate is available for download anytime from your dashboard</li>
                  <li>You can share your verification link with licensing boards</li>
                </ul>
              </div>
            </div>
            
            <div class="footer">
              <p><strong>CounselorReady</strong> - Learn. License. Lead.</p>
              <p>NBCC Approved Continuing Education Provider #7760</p>
              <p><a href="${PLATFORM_URL}">counselorready.com</a></p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Congratulations, ${firstName}!

You've successfully completed: ${courseTitle}

Certificate #${certificateNumber}
CE Hours Earned: ${ceHours}
Assessment Score: ${assessmentScore || 'N/A'}%

Download your certificate: ${pdfUrl}
View your CE Tracker: ${PLATFORM_URL}/credentials

CounselorReady - Learn. License. Lead.
NBCC Approved Provider #7760
    `
  };
}

/**
 * Course progress reminder email
 */
export function getCourseProgressReminderEmail({ firstName, courseTitle, progressPercent, lastAccessedDays, resumeUrl }) {
  return {
    subject: `Continue your course: ${courseTitle} (${progressPercent}% complete)`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1e293b; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #f8fafc; padding: 30px; text-align: center; border-radius: 12px 12px 0 0; }
          .content { padding: 30px; background: white; border-radius: 0 0 12px 12px; }
          .progress-bar { background: #e2e8f0; border-radius: 100px; height: 12px; margin: 20px 0; }
          .progress-fill { background: linear-gradient(90deg, #0D9488, #059669); height: 100%; border-radius: 100px; }
          .btn { display: inline-block; background: #0D9488; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; }
          .footer { text-align: center; padding: 20px; color: #64748b; font-size: 13px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2 style="margin: 0;">📚 Don't lose your progress!</h2>
          </div>
          <div class="content">
            <p>Hi ${firstName},</p>
            <p>You're <strong>${progressPercent}%</strong> of the way through <strong>${courseTitle}</strong>. It's been ${lastAccessedDays} days since your last session.</p>
            
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${progressPercent}%;"></div>
            </div>
            
            <p>Pick up right where you left off and earn your CE credits!</p>
            
            <p style="text-align: center; margin: 30px 0;">
              <a href="${resumeUrl}" class="btn">Continue Learning →</a>
            </p>
          </div>
          <div class="footer">
            <p>CounselorReady - Learn. License. Lead.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Hi ${firstName},

You're ${progressPercent}% of the way through ${courseTitle}. It's been ${lastAccessedDays} days since your last session.

Continue your course: ${resumeUrl}

CounselorReady - Learn. License. Lead.
    `
  };
}

/**
 * Assessment retry encouragement email
 */
export function getAssessmentRetryEmail({ firstName, courseTitle, score, passThreshold, attemptsRemaining, reviewUrl }) {
  return {
    subject: `You're so close! Retry your ${courseTitle} assessment`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1e293b; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #fef3c7; padding: 30px; text-align: center; border-radius: 12px 12px 0 0; }
          .content { padding: 30px; background: white; border-radius: 0 0 12px 12px; }
          .score-box { background: #f8fafc; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; }
          .btn { display: inline-block; background: #f59e0b; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; }
          .tips { background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #64748b; font-size: 13px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2 style="margin: 0;">💪 Almost there, ${firstName}!</h2>
          </div>
          <div class="content">
            <p>You scored <strong>${score}%</strong> on the ${courseTitle} assessment. You need <strong>${passThreshold}%</strong> to pass.</p>
            
            <div class="score-box">
              <div style="font-size: 48px; font-weight: bold; color: #f59e0b;">${score}%</div>
              <div style="color: #64748b;">Your Score</div>
              <div style="margin-top: 10px; color: #64748b;">
                <strong>${attemptsRemaining}</strong> attempt${attemptsRemaining !== 1 ? 's' : ''} remaining
              </div>
            </div>
            
            <div class="tips">
              <h3 style="margin-top: 0;">📝 Tips for your next attempt:</h3>
              <ul>
                <li>Review sections where you felt less confident</li>
                <li>Pay special attention to the accordion content and key terms</li>
                <li>Take notes on concepts you want to remember</li>
              </ul>
            </div>
            
            <p style="text-align: center; margin: 30px 0;">
              <a href="${reviewUrl}" class="btn">Review & Retry →</a>
            </p>
          </div>
          <div class="footer">
            <p>CounselorReady - Learn. License. Lead.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Almost there, ${firstName}!

You scored ${score}% on the ${courseTitle} assessment. You need ${passThreshold}% to pass.
${attemptsRemaining} attempt${attemptsRemaining !== 1 ? 's' : ''} remaining.

Review and retry: ${reviewUrl}

CounselorReady - Learn. License. Lead.
    `
  };
}

/**
 * CE hours milestone email
 */
export function getCEMilestoneEmail({ firstName, totalHours, milestone, nextMilestone }) {
  return {
    subject: `🏆 Milestone reached: ${milestone} CE hours completed!`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1e293b; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #8B5CF6, #06B6D4); padding: 40px; text-align: center; border-radius: 12px 12px 0 0; }
          .trophy { font-size: 64px; margin-bottom: 16px; }
          .content { padding: 30px; background: white; border-radius: 0 0 12px 12px; }
          .milestone-box { background: linear-gradient(135deg, #f5f3ff, #ecfeff); padding: 24px; border-radius: 12px; text-align: center; margin: 20px 0; }
          .btn { display: inline-block; background: #8B5CF6; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; }
          .footer { text-align: center; padding: 20px; color: #64748b; font-size: 13px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="trophy">🏆</div>
            <h1 style="color: white; margin: 0;">Milestone Achieved!</h1>
          </div>
          <div class="content">
            <p>Hi ${firstName},</p>
            <p>Congratulations! You've reached an incredible milestone in your professional development journey.</p>
            
            <div class="milestone-box">
              <div style="font-size: 56px; font-weight: bold; color: #8B5CF6;">${milestone}</div>
              <div style="color: #64748b; font-size: 18px;">CE Hours Completed</div>
            </div>
            
            ${nextMilestone ? `
            <p style="background: #f8fafc; padding: 16px; border-radius: 8px; text-align: center;">
              <strong>Next milestone:</strong> ${nextMilestone} CE hours<br>
              <span style="color: #64748b;">Only ${nextMilestone - totalHours} hours to go!</span>
            </p>
            ` : ''}
            
            <p style="text-align: center; margin: 30px 0;">
              <a href="${PLATFORM_URL}/courses" class="btn">Keep Learning →</a>
            </p>
          </div>
          <div class="footer">
            <p>CounselorReady - Learn. License. Lead.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Milestone Achieved, ${firstName}!

Congratulations! You've completed ${milestone} CE hours.

${nextMilestone ? `Next milestone: ${nextMilestone} CE hours (only ${nextMilestone - totalHours} hours to go!)` : ''}

Keep learning: ${PLATFORM_URL}/courses

CounselorReady - Learn. License. Lead.
    `
  };
}

/**
 * Incomplete course reminder email for users who enrolled/paid but haven't completed.
 * Addresses migrated TalentLMS / GaITP Learning users with context about the platform move.
 */
export function getIncompleteCourseReminderEmail({ firstName, courses, dashboardUrl }) {
  const courseListHtml = courses.map(c => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">
        <div style="font-weight: 600; color: #1e293b; font-size: 14px;">${c.title}</div>
        <div style="margin-top: 4px;">
          <div style="background: #e2e8f0; border-radius: 100px; height: 8px; width: 100%; margin-top: 6px;">
            <div style="background: linear-gradient(90deg, #6b1d34, #8B2542); height: 100%; border-radius: 100px; width: ${c.percentComplete}%;"></div>
          </div>
          <div style="color: #64748b; font-size: 12px; margin-top: 4px;">${c.percentComplete}% complete · ${c.ceHours || 0} CE hours available</div>
        </div>
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; text-align: center; vertical-align: middle;">
        <a href="${c.resumeUrl}" style="display: inline-block; background: #6b1d34; color: white; padding: 8px 16px; border-radius: 6px; text-decoration: none; font-size: 13px; font-weight: 600;">Resume</a>
      </td>
    </tr>
  `).join('');

  const courseListText = courses.map(c =>
    `- ${c.title} (${c.percentComplete}% complete, ${c.ceHours || 0} CE hours available)\n  Resume: ${c.resumeUrl}`
  ).join('\n');

  return {
    subject: `We've moved! Your ${courses.length} course${courses.length > 1 ? 's are' : ' is'} waiting at CounselorReady`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1e293b; margin: 0; padding: 0; background-color: #f8fafc; }
          .wrapper { padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
          .header { background: linear-gradient(135deg, #6b1d34 0%, #8B2542 100%); padding: 36px 30px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 24px; font-weight: 700; }
          .header p { color: rgba(255,255,255,0.85); margin: 8px 0 0; font-size: 15px; }
          .content { padding: 36px 30px; }
          .migration-banner { background: linear-gradient(135deg, #f0fdf4, #ecfdf5); border: 1px solid #86efac; border-radius: 10px; padding: 20px; margin-bottom: 24px; }
          .migration-banner h3 { margin: 0 0 8px 0; color: #166534; font-size: 16px; }
          .migration-banner p { margin: 0; color: #15803d; font-size: 14px; line-height: 1.5; }
          .btn-primary { display: inline-block; background: #6b1d34; color: white !important; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px; }
          .footer { text-align: center; padding: 24px; background: #f8fafc; color: #64748b; font-size: 13px; border-top: 1px solid #e2e8f0; }
          .footer a { color: #6b1d34; }
        </style>
      </head>
      <body>
        <div class="wrapper">
          <div class="container">
            <div class="header">
              <h1>We have a new home!</h1>
              <p>GaITP Learning on TalentLMS is now <strong>CounselorReady</strong></p>
            </div>
            <div class="content">
              <p>Hi ${firstName},</p>

              <div class="migration-banner">
                <h3>GaITP Learning has become CounselorReady</h3>
                <p>
                  You originally registered with us as a learner on GaITP Learning through TalentLMS. We've upgraded to a brand-new platform — <strong>CounselorReady</strong> — with a better experience, the same NBCC-approved CE courses, and all of your previous credits and certificates already migrated to your account.
                </p>
              </div>

              <p>You have ${courses.length === 1 ? 'a course that hasn\'t been completed yet' : `${courses.length} courses that haven't been completed yet`}. Your progress has been preserved and your CE credits are just a few steps away!</p>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 24px 0; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
                <tr style="background: #f8fafc;">
                  <th style="padding: 10px 12px; text-align: left; font-size: 13px; color: #64748b; font-weight: 600;">Course</th>
                  <th style="padding: 10px 12px; text-align: center; font-size: 13px; color: #64748b; font-weight: 600;">Action</th>
                </tr>
                ${courseListHtml}
              </table>

              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 24px 0;">
                <p style="margin: 0 0 10px 0; color: #1e293b; font-size: 14px; font-weight: 600;">What's new on CounselorReady:</p>
                <ul style="margin: 0; padding-left: 20px; color: #475569; font-size: 13px;">
                  <li style="margin: 4px 0;">Your previously earned CE credits &amp; certificates have been migrated</li>
                  <li style="margin: 4px 0;">Credential tracker to manage licenses and renewal deadlines</li>
                  <li style="margin: 4px 0;">Automatic CE hour logging when you complete courses</li>
                  <li style="margin: 4px 0;">Downloadable certificates and audit-ready transcripts</li>
                </ul>
              </div>

              <div style="background: #fef9c3; border: 1px solid #fde047; border-radius: 8px; padding: 16px; margin: 24px 0;">
                <p style="margin: 0; color: #854d0e; font-size: 13px;">
                  <strong>Remember:</strong> Completing your courses earns CE credits that count toward your license renewal. The sooner you finish, the sooner your credits are logged!
                </p>
              </div>

              <div style="text-align: center; margin: 30px 0;">
                <a href="${dashboardUrl}" class="btn-primary">Go to My Dashboard</a>
              </div>

              <p style="margin: 24px 0 0 0; color: #64748b; font-size: 13px; text-align: center;">
                Log in with the same email you used on GaITP Learning / TalentLMS.<br>
                If you need to reset your password, use the "Forgot Password" link on the login page.
              </p>
            </div>
            <div class="footer">
              <p><strong>CounselorReady</strong> — Learn. License. Lead.</p>
              <p>NBCC Approved Continuing Education Provider #7760</p>
              <p>Formerly GaITP Learning on TalentLMS</p>
              <p><a href="${PLATFORM_URL}">counselorready.com</a></p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Hi ${firstName},

IMPORTANT: GaITP Learning on TalentLMS has moved to CounselorReady!

You originally registered with us as a learner on GaITP Learning through TalentLMS. We've upgraded to a brand-new platform — CounselorReady — with a better experience, the same NBCC-approved CE courses, and all of your previous credits and certificates already migrated to your account.

You have ${courses.length} course${courses.length > 1 ? 's' : ''} waiting to be completed:

${courseListText}

What's new on CounselorReady:
- Your previously earned CE credits & certificates have been migrated
- Credential tracker to manage licenses and renewal deadlines
- Automatic CE hour logging when you complete courses
- Downloadable certificates and audit-ready transcripts

Complete your courses to earn your CE credits toward license renewal.

Go to your dashboard: ${dashboardUrl}

Log in with the same email you used on GaITP Learning / TalentLMS.
If you need to reset your password, use the "Forgot Password" link on the login page.

CounselorReady — Learn. License. Lead.
NBCC Approved Provider #7760
Formerly GaITP Learning on TalentLMS
    `
  };
}

export default {
  getCourseCompletionEmail,
  getCourseProgressReminderEmail,
  getAssessmentRetryEmail,
  getCEMilestoneEmail,
  getIncompleteCourseReminderEmail
};
