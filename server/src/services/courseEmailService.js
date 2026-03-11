/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import { Resend } from 'resend';
import User from '../models/User.js';
import Course from '../models/Course.js';
import Certificate from '../models/Certificate.js';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = 'CounselorReady <noreply@counselorready.com>';

// Brand colors
const COLORS = {
  burgundy: '#6b1d34',
  forest: '#34503d',
  gold: '#d4a012',
  stone: '#f5f5f4'
};

// Email wrapper template
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
          <!-- Header -->
          <tr>
            <td style="background-color: ${COLORS.burgundy}; padding: 24px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">
                <span style="color: ${COLORS.gold};">Counselor</span>Ready
              </h1>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color: ${COLORS.stone}; padding: 24px; text-align: center; border-top: 1px solid #e5e5e5;">
              <img src="https://counselorready.com/images/nbcc-provider-badge.jpg" alt="NBCC Provider" style="height: 40px; margin-bottom: 12px;">
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

// ============================================
// COURSE COMPLETION EMAIL
// ============================================

export async function sendCourseCompletionEmail(userId, courseId, certificateId) {
  try {
    const user = await User.findById(userId);
    const course = await Course.findById(courseId);
    const certificate = await Certificate.findById(certificateId);
    
    if (!user || !course) {
      console.error('Course completion email: User or course not found');
      return;
    }
    
    const firstName = user.profile?.firstName || 'Counselor';
    const verificationCode = certificate?.verificationCode || 'N/A';
    const verificationUrl = certificate?.verificationUrl || 'https://counselorready.com/verify';
    
    const content = `
      <div style="text-align: center; margin-bottom: 32px;">
        <div style="width: 80px; height: 80px; background-color: #dcfce7; border-radius: 50%; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;">
          <span style="font-size: 40px;">🎉</span>
        </div>
        <h2 style="margin: 0 0 8px 0; color: ${COLORS.burgundy}; font-size: 28px;">
          Congratulations, ${firstName}!
        </h2>
        <p style="margin: 0; color: ${COLORS.forest}; font-size: 16px;">
          You've successfully completed your course
        </p>
      </div>
      
      <div style="background-color: ${COLORS.stone}; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
        <h3 style="margin: 0 0 4px 0; color: ${COLORS.burgundy}; font-size: 18px;">
          ${course.title}
        </h3>
        <p style="margin: 0 0 16px 0; color: ${COLORS.forest}; font-size: 14px;">
          Completed on ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
        
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <td style="padding: 8px 0; border-top: 1px solid #e5e5e5;">
              <span style="color: #666; font-size: 13px;">CE Hours Earned</span><br>
              <strong style="color: ${COLORS.forest}; font-size: 16px;">${course.ceuHours || 0} Hours</strong>
            </td>
            <td style="padding: 8px 0; border-top: 1px solid #e5e5e5; text-align: right;">
              <span style="color: #666; font-size: 13px;">Category</span><br>
              <strong style="color: ${COLORS.forest}; font-size: 16px;">${course.ceuCategories?.[0]?.category || 'General'}</strong>
            </td>
          </tr>
        </table>
      </div>
      
      <div style="text-align: center; margin-bottom: 24px;">
        <a href="https://counselorready.com/certificates.html" 
           style="display: inline-block; background-color: ${COLORS.burgundy}; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
          Download Your Certificate
        </a>
      </div>
      
      <div style="background-color: #fef9c3; border: 1px solid #fde047; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
        <p style="margin: 0 0 8px 0; color: #854d0e; font-size: 13px; font-weight: 600;">
          Certificate Verification Code
        </p>
        <p style="margin: 0; font-family: monospace; font-size: 18px; color: ${COLORS.burgundy}; letter-spacing: 2px;">
          ${verificationCode}
        </p>
        <p style="margin: 8px 0 0 0; color: #a16207; font-size: 12px;">
          Employers can verify at: <a href="${verificationUrl}" style="color: #a16207;">${verificationUrl}</a>
        </p>
      </div>
      
      <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 24px 0;">
      
      <h3 style="margin: 0 0 16px 0; color: ${COLORS.forest}; font-size: 16px;">
        What's Next?
      </h3>
      
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
        <tr>
          <td style="padding: 12px; background-color: ${COLORS.stone}; border-radius: 8px; margin-bottom: 8px;">
            <a href="https://counselorready.com/courses.html" style="color: ${COLORS.burgundy}; text-decoration: none; font-weight: 500;">
              📚 Browse more courses to continue your education
            </a>
          </td>
        </tr>
        <tr><td style="height: 8px;"></td></tr>
        <tr>
          <td style="padding: 12px; background-color: ${COLORS.stone}; border-radius: 8px; margin-bottom: 8px;">
            <a href="https://counselorready.com/certificates.html?action=transcript" style="color: ${COLORS.burgundy}; text-decoration: none; font-weight: 500;">
              📋 Download your complete CE transcript
            </a>
          </td>
        </tr>
        <tr><td style="height: 8px;"></td></tr>
        <tr>
          <td style="padding: 12px; background-color: ${COLORS.stone}; border-radius: 8px;">
            <a href="https://counselorready.com/credentials.html" style="color: ${COLORS.burgundy}; text-decoration: none; font-weight: 500;">
              🎯 Track your credentials and renewal dates
            </a>
          </td>
        </tr>
      </table>
      
      <p style="margin: 24px 0 0 0; color: #666; font-size: 14px; text-align: center;">
        Thank you for choosing CounselorReady for your continuing education!
      </p>
    `;
    
    await resend.emails.send({
      from: FROM_EMAIL,
      to: user.email,
      subject: `🎉 Congratulations! You've completed "${course.title}"`,
      html: emailWrapper(content, `You've earned ${course.ceuHours || 0} CE hours!`)
    });
    
    console.log(`Course completion email sent to ${user.email}`);
    return true;
  } catch (error) {
    console.error('Send course completion email error:', error);
    return false;
  }
}

// ============================================
// CERTIFICATE READY EMAIL (separate trigger)
// ============================================

export async function sendCertificateReadyEmail(userId, certificateId) {
  try {
    const user = await User.findById(userId);
    const certificate = await Certificate.findById(certificateId).populate('courseId');
    
    if (!user || !certificate) {
      console.error('Certificate ready email: User or certificate not found');
      return;
    }
    
    const firstName = user.profile?.firstName || 'Counselor';
    
    const content = `
      <h2 style="margin: 0 0 16px 0; color: ${COLORS.burgundy}; font-size: 24px;">
        Your Certificate is Ready! 📜
      </h2>
      
      <p style="margin: 0 0 24px 0; color: ${COLORS.forest}; font-size: 16px; line-height: 1.6;">
        Hi ${firstName}, your certificate for <strong>${certificate.title}</strong> is now available for download.
      </p>
      
      <div style="background-color: ${COLORS.stone}; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <td>
              <p style="margin: 0 0 4px 0; color: #666; font-size: 12px;">Course</p>
              <p style="margin: 0; color: ${COLORS.burgundy}; font-size: 16px; font-weight: 600;">${certificate.title}</p>
            </td>
          </tr>
          <tr>
            <td style="padding-top: 12px;">
              <p style="margin: 0 0 4px 0; color: #666; font-size: 12px;">CE Hours</p>
              <p style="margin: 0; color: ${COLORS.forest}; font-size: 16px;">${certificate.ceHours} Hours</p>
            </td>
          </tr>
          <tr>
            <td style="padding-top: 12px;">
              <p style="margin: 0 0 4px 0; color: #666; font-size: 12px;">Verification Code</p>
              <p style="margin: 0; font-family: monospace; color: ${COLORS.burgundy}; font-size: 16px;">${certificate.verificationCode || 'N/A'}</p>
            </td>
          </tr>
        </table>
      </div>
      
      <div style="text-align: center;">
        <a href="https://counselorready.com/certificates.html" 
           style="display: inline-block; background-color: ${COLORS.burgundy}; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600;">
          Download Certificate
        </a>
      </div>
    `;
    
    await resend.emails.send({
      from: FROM_EMAIL,
      to: user.email,
      subject: `Your CE Certificate is Ready - ${certificate.title}`,
      html: emailWrapper(content, `Download your certificate for ${certificate.ceHours} CE hours`)
    });
    
    console.log(`Certificate ready email sent to ${user.email}`);
    return true;
  } catch (error) {
    console.error('Send certificate ready email error:', error);
    return false;
  }
}

// ============================================
// COURSE REMINDER EMAIL
// ============================================

export async function sendCourseReminderEmail(userId, courseId, daysInactive) {
  try {
    const user = await User.findById(userId);
    const course = await Course.findById(courseId);
    
    if (!user || !course) return;
    
    const firstName = user.profile?.firstName || 'Counselor';
    
    const content = `
      <h2 style="margin: 0 0 16px 0; color: ${COLORS.burgundy}; font-size: 24px;">
        We miss you! 👋
      </h2>
      
      <p style="margin: 0 0 24px 0; color: ${COLORS.forest}; font-size: 16px; line-height: 1.6;">
        Hi ${firstName}, you started <strong>${course.title}</strong> but haven't been back in ${daysInactive} days. 
        Your progress is saved and waiting for you!
      </p>
      
      <div style="text-align: center; margin-bottom: 24px;">
        <a href="https://counselorready.com/course/${course.slug}" 
           style="display: inline-block; background-color: ${COLORS.burgundy}; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600;">
          Continue Learning →
        </a>
      </div>
      
      <p style="margin: 0; color: #666; font-size: 14px; text-align: center;">
        Just a few more lessons to go! You've got this.
      </p>
    `;
    
    await resend.emails.send({
      from: FROM_EMAIL,
      to: user.email,
      subject: `Continue your course: ${course.title}`,
      html: emailWrapper(content, `Your progress is waiting for you!`)
    });
    
    console.log(`Course reminder email sent to ${user.email}`);
    return true;
  } catch (error) {
    console.error('Send course reminder email error:', error);
    return false;
  }
}
