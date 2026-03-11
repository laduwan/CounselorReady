/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import { Resend } from 'resend';
import User from '../models/User.js';

const resend = new Resend(process.env.RESEND_API_KEY);

// Insurance providers for comparison suggestions
const topProviders = [
  { name: 'HPSO', url: 'https://www.hpso.com', avgPremium: 250 },
  { name: 'CPH & Associates', url: 'https://www.cphins.com', avgPremium: 190 },
  { name: 'Proliability', url: 'https://www.proliability.com', avgPremium: 290 },
  { name: 'American Professional', url: 'https://www.americanprofessional.com', avgPremium: 230 }
];

/**
 * Check for users with expiring insurance and send reminders
 */
export async function sendInsuranceReminders() {
  try {
    const now = new Date();
    
    // Find users with insurance reminders enabled
    const users = await User.find({
      'insuranceReminders.enabled': true,
      'liabilityInsurance.expirationDate': { $exists: true }
    });
    
    let sentCount = 0;
    
    for (const user of users) {
      const reminderDays = user.insuranceReminders?.reminderDays || 30;
      const lastSent = user.insuranceReminders?.lastReminderSent;
      const expDate = new Date(user.liabilityInsurance.expirationDate);
      
      // Calculate days until expiration
      const daysUntil = Math.ceil((expDate - now) / (1000 * 60 * 60 * 24));
      
      // Check if we should send reminder
      const shouldSend = (
        daysUntil > 0 && 
        daysUntil <= reminderDays &&
        (!lastSent || (now - new Date(lastSent)) > 7 * 24 * 60 * 60 * 1000) // Max once per week
      );
      
      if (shouldSend) {
        await sendInsuranceReminderEmail(user, daysUntil);
        
        // Update last sent
        user.insuranceReminders.lastReminderSent = now;
        await user.save();
        
        sentCount++;
      }
      
      // Also check for already expired policies
      if (daysUntil <= 0 && daysUntil > -7) { // Expired within last week
        const expiredLastSent = user.insuranceReminders?.lastReminderSent;
        const daysSinceReminder = expiredLastSent 
          ? Math.ceil((now - new Date(expiredLastSent)) / (1000 * 60 * 60 * 24))
          : 999;
        
        if (daysSinceReminder >= 3) { // Send expired reminder every 3 days
          await sendExpiredInsuranceEmail(user);
          user.insuranceReminders.lastReminderSent = now;
          await user.save();
          sentCount++;
        }
      }
    }
    
    console.log(`Insurance reminders: Sent ${sentCount} emails`);
    return sentCount;
    
  } catch (error) {
    console.error('Insurance reminder service error:', error);
    throw error;
  }
}

/**
 * Send insurance renewal reminder email
 */
async function sendInsuranceReminderEmail(user, daysUntil) {
  const firstName = user.profile?.firstName || 'there';
  const currentPremium = user.liabilityInsurance?.annualPremium;
  const currentProvider = user.liabilityInsurance?.provider || 'your current provider';
  
  // Build comparison section if we have current premium
  let comparisonSection = '';
  if (currentPremium) {
    const potentialSavings = topProviders
      .filter(p => p.avgPremium < currentPremium)
      .map(p => ({
        ...p,
        savings: currentPremium - p.avgPremium
      }))
      .sort((a, b) => b.savings - a.savings);
    
    if (potentialSavings.length > 0) {
      comparisonSection = `
        <div style="background: #f0fdf4; border: 1px solid #86efac; border-radius: 12px; padding: 20px; margin: 20px 0;">
          <h3 style="color: #166534; margin: 0 0 15px 0; font-size: 16px;">💰 Potential Savings Found</h3>
          <p style="color: #166534; margin: 0 0 15px 0; font-size: 14px;">
            Before you renew at $${currentPremium}/year, consider comparing rates:
          </p>
          <table style="width: 100%; border-collapse: collapse;">
            ${potentialSavings.slice(0, 3).map(p => `
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #dcfce7;">
                  <a href="${p.url}" style="color: #166534; text-decoration: none; font-weight: 600;">${p.name}</a>
                </td>
                <td style="padding: 8px 0; border-bottom: 1px solid #dcfce7; text-align: right; color: #166534;">
                  ~$${p.avgPremium}/yr <span style="color: #22c55e; font-weight: 600;">(Save $${p.savings})</span>
                </td>
              </tr>
            `).join('')}
          </table>
        </div>
      `;
    }
  }
  
  const urgencyColor = daysUntil <= 7 ? '#dc2626' : daysUntil <= 14 ? '#ea580c' : '#ca8a04';
  const urgencyBg = daysUntil <= 7 ? '#fef2f2' : daysUntil <= 14 ? '#fff7ed' : '#fefce8';
  
  await resend.emails.send({
    from: 'CounselorReady <reminders@counselorready.com>',
    to: user.email,
    subject: `🛡️ Your Liability Insurance Expires in ${daysUntil} Days`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #1f2937; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; }
          .header { background: linear-gradient(135deg, #6b1d34, #34503d); color: white; padding: 30px; text-align: center; }
          .content { background: #fff; padding: 30px; }
          .footer { background: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 12px; }
          .cta-button { display: inline-block; background: #0d9488; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; margin-top: 15px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 24px;">CounselorReady</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Insurance Renewal Reminder</p>
          </div>
          <div class="content">
            <div style="background: ${urgencyBg}; border-left: 4px solid ${urgencyColor}; padding: 15px 20px; border-radius: 0 8px 8px 0; margin-bottom: 20px;">
              <p style="margin: 0; color: ${urgencyColor}; font-weight: 600; font-size: 18px;">
                ⏰ ${daysUntil} Days Until Your Insurance Expires
              </p>
            </div>
            
            <p>Hi ${firstName},</p>
            
            <p>Your liability insurance policy${currentProvider !== 'your current provider' ? ` with <strong>${currentProvider}</strong>` : ''} expires soon. 
            Don't let your coverage lapse – practicing without malpractice insurance puts your career and personal assets at serious risk.</p>
            
            ${comparisonSection}
            
            <div style="background: #f8fafc; border-radius: 12px; padding: 20px; margin: 20px 0;">
              <h3 style="color: #334155; margin: 0 0 15px 0; font-size: 16px;">📋 Quick Renewal Checklist:</h3>
              <ul style="margin: 0; padding-left: 20px; color: #475569;">
                <li>Review your current coverage limits ($1M/$3M is standard)</li>
                <li>Compare quotes from 2-3 providers</li>
                <li>Check for professional association discounts</li>
                <li>Verify telehealth coverage is included</li>
                <li>Update your policy before expiration</li>
              </ul>
            </div>
            
            <center>
              <a href="https://counselorready.com/settings.html" class="cta-button">
                Compare Rates & Update Policy
              </a>
            </center>
            
            <p style="margin-top: 25px; color: #64748b; font-size: 14px;">
              Need help understanding your coverage options? Reply to this email and we'll help you navigate your choices.
            </p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} CounselorReady</p>
            <p>You're receiving this because you have insurance reminders enabled. 
            <a href="https://counselorready.com/settings.html" style="color: #6b7280;">Manage preferences</a></p>
          </div>
        </div>
      </body>
      </html>
    `
  });
  
  console.log(`Sent insurance reminder to ${user.email} (${daysUntil} days)`);
}

/**
 * Send expired insurance alert email
 */
async function sendExpiredInsuranceEmail(user) {
  const firstName = user.profile?.firstName || 'there';
  
  await resend.emails.send({
    from: 'CounselorReady <urgent@counselorready.com>',
    to: user.email,
    subject: '🚨 URGENT: Your Liability Insurance Has Expired',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #1f2937; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; }
          .header { background: #dc2626; color: white; padding: 30px; text-align: center; }
          .content { background: #fff; padding: 30px; }
          .footer { background: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 12px; }
          .cta-button { display: inline-block; background: #dc2626; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; margin-top: 15px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 24px;">⚠️ URGENT ACTION REQUIRED</h1>
          </div>
          <div class="content">
            <div style="background: #fef2f2; border: 2px solid #dc2626; border-radius: 12px; padding: 20px; margin-bottom: 20px; text-align: center;">
              <p style="margin: 0; color: #dc2626; font-weight: 700; font-size: 20px;">
                Your Liability Insurance Has Expired
              </p>
            </div>
            
            <p>Hi ${firstName},</p>
            
            <p><strong>Your professional liability insurance policy has expired.</strong> This means you are currently practicing without malpractice coverage.</p>
            
            <div style="background: #fef2f2; border-radius: 8px; padding: 15px; margin: 20px 0;">
              <p style="margin: 0; color: #991b1b; font-weight: 600;">⚠️ Practicing without insurance can result in:</p>
              <ul style="margin: 10px 0 0 0; padding-left: 20px; color: #991b1b;">
                <li>Personal liability for malpractice claims</li>
                <li>Loss of personal assets</li>
                <li>Potential license suspension in some states</li>
                <li>Inability to see clients at certain facilities</li>
              </ul>
            </div>
            
            <p><strong>Please renew your coverage immediately.</strong> Most providers can issue same-day coverage.</p>
            
            <center>
              <a href="https://counselorready.com/settings.html" class="cta-button">
                Renew Insurance Now
              </a>
            </center>
            
            <div style="margin-top: 25px; background: #f8fafc; border-radius: 8px; padding: 15px;">
              <p style="margin: 0 0 10px 0; font-weight: 600; color: #334155;">Quick Links to Get Covered:</p>
              ${topProviders.map(p => `
                <a href="${p.url}" style="display: block; color: #0d9488; margin: 5px 0; text-decoration: none;">→ ${p.name}</a>
              `).join('')}
            </div>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} CounselorReady</p>
          </div>
        </div>
      </body>
      </html>
    `
  });
  
  console.log(`Sent EXPIRED insurance alert to ${user.email}`);
}

export default { sendInsuranceReminders };
