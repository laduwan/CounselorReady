/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import { Resend } from 'resend';
import User from '../models/User.js';

const resend = new Resend(process.env.RESEND_API_KEY);

// Email styling that matches CounselorReady brand
const emailStyles = `
  body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #f5f5f4; }
  .container { max-width: 600px; margin: 0 auto; padding: 20px; }
  .header { background: linear-gradient(135deg, #6b1d34, #34503d); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
  .header h1 { margin: 0; font-size: 24px; font-weight: 600; }
  .header p { margin: 10px 0 0 0; opacity: 0.9; font-size: 14px; }
  .content { background: #fff; padding: 30px; border: 1px solid #e5e5e5; border-top: none; }
  .content p { margin: 16px 0; }
  .highlight-box { background: #f8f9fa; border-left: 4px solid #34503d; padding: 20px; margin: 20px 0; border-radius: 0 8px 8px 0; }
  .highlight-box.warning { border-left-color: #ffc107; background: #fffbeb; }
  .highlight-box.urgent { border-left-color: #dc3545; background: #fef2f2; }
  .highlight-box.success { border-left-color: #28a745; background: #f0fdf4; }
  .big-number { font-size: 48px; font-weight: 700; color: #6b1d34; margin: 0; }
  .label { font-size: 14px; color: #666; margin-top: 5px; }
  .cta-button { display: inline-block; background: #6b1d34; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; margin-top: 20px; font-weight: 600; }
  .cta-button:hover { background: #4a1524; }
  .cta-button.secondary { background: #34503d; }
  .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; border-radius: 0 0 10px 10px; background: #fff; border: 1px solid #e5e5e5; border-top: none; }
  .urgent-banner { background: #dc3545; color: white; padding: 12px; text-align: center; font-weight: bold; font-size: 14px; }
  .loyalty-badge { display: inline-block; background: linear-gradient(135deg, #d4a012, #facc15); color: #713f12; padding: 8px 16px; border-radius: 20px; font-weight: 600; font-size: 14px; margin: 10px 0; }
`;

const emailFooter = `
  <div class="footer">
    <p>Questions? Reply to this email or contact <a href="mailto:support@counselorready.com">support@counselorready.com</a></p>
    <p style="margin-top: 15px;">© ${new Date().getFullYear()} CounselorReady by GA Integrated Therapeutic Perspectives LLC</p>
    <p style="font-size: 11px; color: #999;">NBCC Approved Provider | ACEP #7760</p>
  </div>
`;

/**
 * 1. PAYMENT FAILED - Sent when Stripe payment fails
 */
export async function sendPaymentFailedEmail(userId) {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    const graceDays = user.getGracePeriodDays ? user.getGracePeriodDays() : 7;
    const hasLoyaltyBonus = graceDays > 7;
    const firstName = user.profile?.firstName || 'there';

    await resend.emails.send({
      from: 'CounselorReady <billing@counselorready.com>',
      to: user.email,
      subject: `Action needed: Update your payment method`,
      html: `
        <!DOCTYPE html>
        <html>
        <head><style>${emailStyles}</style></head>
        <body>
          <div class="container">
            <div class="header">
              <h1>CounselorReady</h1>
              <p>Payment Update Required</p>
            </div>
            <div class="content">
              <p>Hi ${firstName},</p>
              
              <p>We weren't able to process your VIP membership payment. Don't worry — your account is still active, and you have time to fix this.</p>
              
              <div class="highlight-box warning">
                <p class="big-number">${graceDays}</p>
                <p class="label">days to update your payment method</p>
                ${hasLoyaltyBonus ? `
                <div class="loyalty-badge">🌟 Loyalty Bonus Applied</div>
                <p style="font-size: 14px; margin-top: 10px;">Your loyalty as a long-term member earned you extra time. We appreciate you!</p>
                ` : ''}
              </div>
              
              <p><strong>What happens next:</strong></p>
              <ul>
                <li>Your VIP access continues during this grace period</li>
                <li>Update your payment method to avoid any interruption</li>
                <li>After ${graceDays} days, your subscription will be paused</li>
              </ul>
              
              <center>
                <a href="https://counselorready.com/subscription.html" class="cta-button">Update Payment Method</a>
              </center>
              
              <p style="margin-top: 30px; font-size: 14px; color: #666;">If you're experiencing financial hardship, remember that VIP members can use their hardship pause benefit from the dashboard.</p>
            </div>
            ${emailFooter}
          </div>
        </body>
        </html>
      `
    });

    console.log(`Sent payment failed email to ${user.email} (${graceDays} day grace period)`);
  } catch (error) {
    console.error('Error sending payment failed email:', error);
  }
}

/**
 * 2. GRACE PERIOD WARNING - Sent 3 days before grace period expires
 */
export async function sendGracePeriodWarningEmail(userId) {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    const daysRemaining = user.getGracePeriodRemaining ? user.getGracePeriodRemaining() : 3;
    const firstName = user.profile?.firstName || 'there';
    const bankedMonths = user.hardshipPause?.banked || 0;

    await resend.emails.send({
      from: 'CounselorReady <billing@counselorready.com>',
      to: user.email,
      subject: `⚠️ ${daysRemaining} days left to update your payment`,
      html: `
        <!DOCTYPE html>
        <html>
        <head><style>${emailStyles}</style></head>
        <body>
          <div class="container">
            <div class="urgent-banner">⚠️ Action Required - Grace Period Ending Soon</div>
            <div class="header">
              <h1>CounselorReady</h1>
              <p>Urgent: Payment Update Needed</p>
            </div>
            <div class="content">
              <p>Hi ${firstName},</p>
              
              <p>Your grace period is almost over. Please update your payment method to keep your VIP membership active.</p>
              
              <div class="highlight-box urgent">
                <p class="big-number">${daysRemaining}</p>
                <p class="label">days remaining</p>
              </div>
              
              <p><strong>What you'll lose if your subscription expires:</strong></p>
              <ul>
                <li>Multi-state CE tracking</li>
                <li>SMS & calendar reminders</li>
                <li>Quarterly 1:1 consultations</li>
                <li>Early access to webinars</li>
                ${bankedMonths > 0 ? `<li><strong>Your ${bankedMonths} banked hardship month${bankedMonths > 1 ? 's' : ''}</strong> (these will reset!)</li>` : ''}
              </ul>
              
              <center>
                <a href="https://counselorready.com/subscription.html" class="cta-button">Update Payment Now</a>
              </center>
              
              <p style="margin-top: 30px; font-size: 14px; color: #666;">Need help? Just reply to this email and we'll assist you.</p>
            </div>
            ${emailFooter}
          </div>
        </body>
        </html>
      `
    });

    console.log(`Sent grace period warning email to ${user.email} (${daysRemaining} days left)`);
  } catch (error) {
    console.error('Error sending grace period warning email:', error);
  }
}

/**
 * 3. GRACE PERIOD EXPIRED - Sent when grace period ends
 */
export async function sendGracePeriodExpiredEmail(userId) {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    const firstName = user.profile?.firstName || 'there';

    await resend.emails.send({
      from: 'CounselorReady <billing@counselorready.com>',
      to: user.email,
      subject: `Your VIP membership has been paused`,
      html: `
        <!DOCTYPE html>
        <html>
        <head><style>${emailStyles}</style></head>
        <body>
          <div class="container">
            <div class="header">
              <h1>CounselorReady</h1>
              <p>Membership Paused</p>
            </div>
            <div class="content">
              <p>Hi ${firstName},</p>
              
              <p>Your VIP membership has been paused because we couldn't process your payment and the grace period has ended.</p>
              
              <div class="highlight-box">
                <p><strong>What this means:</strong></p>
                <ul style="margin: 10px 0 0 0; padding-left: 20px;">
                  <li>You've been moved to our free tier</li>
                  <li>Your CE tracking data is still safe</li>
                  <li>Your certificates and credentials are preserved</li>
                  <li>You can reactivate VIP anytime</li>
                </ul>
              </div>
              
              <p>We'd love to have you back! When you're ready, you can reactivate your VIP membership with just a few clicks.</p>
              
              <center>
                <a href="https://counselorready.com/subscription.html" class="cta-button">Reactivate VIP Membership</a>
              </center>
              
              <p style="margin-top: 30px; font-size: 14px; color: #666;">Your data is safe and waiting for you. Take the time you need.</p>
            </div>
            ${emailFooter}
          </div>
        </body>
        </html>
      `
    });

    console.log(`Sent grace period expired email to ${user.email}`);
  } catch (error) {
    console.error('Error sending grace period expired email:', error);
  }
}

/**
 * 4. HARDSHIP PAUSE ACTIVATED - Sent when user activates hardship pause
 */
export async function sendHardshipPauseActivatedEmail(userId) {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    const firstName = user.profile?.firstName || 'there';
    const pauseEndDate = user.hardshipPause?.pauseEndDate;
    const formattedEndDate = pauseEndDate 
      ? new Date(pauseEndDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
      : '30 days from now';
    const monthsRemaining = user.getTotalHardshipMonths ? user.getTotalHardshipMonths() : 0;

    await resend.emails.send({
      from: 'CounselorReady <support@counselorready.com>',
      to: user.email,
      subject: `Your subscription is paused - we're here for you`,
      html: `
        <!DOCTYPE html>
        <html>
        <head><style>${emailStyles}</style></head>
        <body>
          <div class="container">
            <div class="header">
              <h1>CounselorReady</h1>
              <p>Hardship Pause Activated</p>
            </div>
            <div class="content">
              <p>Hi ${firstName},</p>
              
              <p>We've activated your hardship pause. Life can be challenging sometimes, and we want you to know that we're here to support you.</p>
              
              <div class="highlight-box success">
                <p><strong>Your pause details:</strong></p>
                <ul style="margin: 10px 0 0 0; padding-left: 20px;">
                  <li><strong>Pause ends:</strong> ${formattedEndDate}</li>
                  <li><strong>Remaining pause months:</strong> ${monthsRemaining}</li>
                  <li><strong>Access:</strong> Full VIP access continues</li>
                  <li><strong>Billing:</strong> Paused for 30 days</li>
                </ul>
              </div>
              
              <p>During your pause, you still have complete access to all VIP features:</p>
              <ul>
                <li>✓ Multi-state CE tracking</li>
                <li>✓ All courses and content</li>
                <li>✓ Certificate storage</li>
                <li>✓ Audit report generator</li>
              </ul>
              
              <p>Your subscription will automatically resume on ${formattedEndDate}. If you need to end the pause early, you can do so from your dashboard.</p>
              
              <center>
                <a href="https://counselorready.com/dashboard.html" class="cta-button secondary">Go to Dashboard</a>
              </center>
              
              <p style="margin-top: 30px; font-size: 14px; color: #666;">Take care of yourself. We'll be here when you're ready. 💚</p>
            </div>
            ${emailFooter}
          </div>
        </body>
        </html>
      `
    });

    console.log(`Sent hardship pause activated email to ${user.email}`);
  } catch (error) {
    console.error('Error sending hardship pause activated email:', error);
  }
}

/**
 * 5. PAUSE ENDING SOON - Sent 3 days before hardship pause ends
 */
export async function sendPauseEndingSoonEmail(userId) {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    const firstName = user.profile?.firstName || 'there';
    const pauseEndDate = user.hardshipPause?.pauseEndDate;
    const formattedEndDate = pauseEndDate 
      ? new Date(pauseEndDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
      : 'in 3 days';

    await resend.emails.send({
      from: 'CounselorReady <support@counselorready.com>',
      to: user.email,
      subject: `Your subscription resumes in 3 days`,
      html: `
        <!DOCTYPE html>
        <html>
        <head><style>${emailStyles}</style></head>
        <body>
          <div class="container">
            <div class="header">
              <h1>CounselorReady</h1>
              <p>Pause Ending Soon</p>
            </div>
            <div class="content">
              <p>Hi ${firstName},</p>
              
              <p>Just a heads up — your hardship pause is ending soon and your VIP subscription will resume.</p>
              
              <div class="highlight-box">
                <p class="big-number">3</p>
                <p class="label">days until your subscription resumes</p>
                <p style="margin-top: 15px;"><strong>Resume date:</strong> ${formattedEndDate}</p>
              </div>
              
              <p><strong>What happens next:</strong></p>
              <ul>
                <li>Your normal billing will resume on ${formattedEndDate}</li>
                <li>Your payment method on file will be charged $49.99</li>
                <li>All your VIP benefits continue uninterrupted</li>
              </ul>
              
              <p>If you need to update your payment method before billing resumes, you can do so from your subscription settings.</p>
              
              <center>
                <a href="https://counselorready.com/subscription.html" class="cta-button">Review Subscription</a>
              </center>
              
              <p style="margin-top: 30px; font-size: 14px; color: #666;">Welcome back! We hope things are looking up. 🌟</p>
            </div>
            ${emailFooter}
          </div>
        </body>
        </html>
      `
    });

    console.log(`Sent pause ending soon email to ${user.email}`);
  } catch (error) {
    console.error('Error sending pause ending soon email:', error);
  }
}

/**
 * 6. PAUSE ENDED - Sent when hardship pause ends
 */
export async function sendPauseEndedEmail(userId) {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    const firstName = user.profile?.firstName || 'there';

    await resend.emails.send({
      from: 'CounselorReady <support@counselorready.com>',
      to: user.email,
      subject: `Welcome back! Your subscription has resumed`,
      html: `
        <!DOCTYPE html>
        <html>
        <head><style>${emailStyles}</style></head>
        <body>
          <div class="container">
            <div class="header">
              <h1>CounselorReady</h1>
              <p>Welcome Back!</p>
            </div>
            <div class="content">
              <p>Hi ${firstName},</p>
              
              <p>Your hardship pause has ended and your VIP subscription is now active again. We're glad to have you back!</p>
              
              <div class="highlight-box success">
                <p><strong>Your subscription is active</strong></p>
                <p style="margin-top: 10px;">Your payment method has been charged $49.99 for this billing period.</p>
              </div>
              
              <p><strong>Here's what's waiting for you:</strong></p>
              <ul>
                <li>📚 New courses added while you were away</li>
                <li>📊 Your CE tracking dashboard</li>
                <li>💬 Quarterly 1:1 consultation (if available)</li>
                <li>📅 SMS & calendar reminders</li>
              </ul>
              
              <center>
                <a href="https://counselorready.com/dashboard.html" class="cta-button">Go to Dashboard</a>
              </center>
              
              <p style="margin-top: 30px; font-size: 14px; color: #666;">Thank you for being part of the CounselorReady community. We're here to help you thrive! 💚</p>
            </div>
            ${emailFooter}
          </div>
        </body>
        </html>
      `
    });

    console.log(`Sent pause ended email to ${user.email}`);
  } catch (error) {
    console.error('Error sending pause ended email:', error);
  }
}

/**
 * 7. PAYMENT RECOVERED - Sent when payment succeeds after a failure
 */
export async function sendPaymentRecoveredEmail(userId) {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    const firstName = user.profile?.firstName || 'there';
    const bankedMonths = user.hardshipPause?.banked || 0;

    await resend.emails.send({
      from: 'CounselorReady <billing@counselorready.com>',
      to: user.email,
      subject: `✓ Payment successful - You're all set!`,
      html: `
        <!DOCTYPE html>
        <html>
        <head><style>${emailStyles}</style></head>
        <body>
          <div class="container">
            <div class="header">
              <h1>CounselorReady</h1>
              <p>Payment Confirmed</p>
            </div>
            <div class="content">
              <p>Hi ${firstName},</p>
              
              <p>Great news! Your payment has been processed successfully and your VIP membership continues without interruption.</p>
              
              <div class="highlight-box success">
                <p style="font-size: 24px; margin: 0;">✓ Payment Successful</p>
                <p style="margin-top: 10px;">Your VIP membership is active and all benefits are restored.</p>
                ${bankedMonths > 0 ? `
                <div class="loyalty-badge" style="margin-top: 15px;">🌟 ${bankedMonths} banked hardship month${bankedMonths > 1 ? 's' : ''} preserved!</div>
                ` : ''}
              </div>
              
              <p>Thank you for staying with us. Your continued support helps us build better tools for counselors everywhere.</p>
              
              <center>
                <a href="https://counselorready.com/dashboard.html" class="cta-button secondary">Go to Dashboard</a>
              </center>
            </div>
            ${emailFooter}
          </div>
        </body>
        </html>
      `
    });

    console.log(`Sent payment recovered email to ${user.email}`);
  } catch (error) {
    console.error('Error sending payment recovered email:', error);
  }
}

export default {
  sendPaymentFailedEmail,
  sendGracePeriodWarningEmail,
  sendGracePeriodExpiredEmail,
  sendHardshipPauseActivatedEmail,
  sendPauseEndingSoonEmail,
  sendPauseEndedEmail,
  sendPaymentRecoveredEmail
};
