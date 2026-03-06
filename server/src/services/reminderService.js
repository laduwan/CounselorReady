/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import { Resend } from 'resend';
import UserCredential from '../models/UserCredential.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';

const resend = new Resend(process.env.RESEND_API_KEY);

// Reminder thresholds in days
const REMINDER_THRESHOLDS = [90, 60, 30, 14, 7];

/**
 * Check all credentials and send reminders for those expiring soon
 */
export async function checkAndSendReminders() {
  console.log('Running credential expiration check...');
  
  try {
    const now = new Date();
    
    for (const daysOut of REMINDER_THRESHOLDS) {
      const targetDate = new Date(now);
      targetDate.setDate(targetDate.getDate() + daysOut);
      
      // Find credentials expiring on this exact day (to avoid duplicate reminders)
      const startOfDay = new Date(targetDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(targetDate);
      endOfDay.setHours(23, 59, 59, 999);
      
      const expiringCredentials = await UserCredential.find({
        expirationDate: { $gte: startOfDay, $lte: endOfDay },
        remindersEnabled: { $ne: false }
      }).populate('userId');
      
      console.log(`Found ${expiringCredentials.length} credentials expiring in ${daysOut} days`);
      
      for (const credential of expiringCredentials) {
        if (!credential.userId || !credential.userId.email) continue;
        
        const user = credential.userId;
        
        // Create in-app notification
        await createNotification(user._id, credential, daysOut);
        
        // Send email reminder
        await sendReminderEmail(user, credential, daysOut);
      }
    }
    
    console.log('Credential expiration check complete');
  } catch (error) {
    console.error('Error in reminder check:', error);
  }
}

/**
 * Create an in-app notification
 */
async function createNotification(userId, credential, daysOut) {
  try {
    const urgency = daysOut <= 14 ? 'urgent' : daysOut <= 30 ? 'warning' : 'info';
    
    await Notification.create({
      userId,
      type: 'credential_expiring',
      title: `${credential.name} Expiring Soon`,
      message: `Your ${credential.name}${credential.state ? ` (${credential.state})` : ''} expires in ${daysOut} days on ${credential.expirationDate.toLocaleDateString()}.`,
      urgency,
      credentialId: credential._id,
      metadata: {
        daysUntilExpiration: daysOut,
        credentialName: credential.name,
        expirationDate: credential.expirationDate
      }
    });
    
    console.log(`Created notification for user ${userId} - ${credential.name} expiring in ${daysOut} days`);
  } catch (error) {
    console.error('Error creating notification:', error);
  }
}

/**
 * Send email reminder
 */
async function sendReminderEmail(user, credential, daysOut) {
  try {
    const urgencyText = daysOut <= 14 ? '⚠️ URGENT: ' : daysOut <= 30 ? '⏰ Reminder: ' : '';
    const ceProgress = credential.totalCEUsRequired > 0 
      ? `${credential.totalCEUsCompleted || 0} / ${credential.totalCEUsRequired} CE hours completed`
      : 'No CE requirements tracked';
    
    await resend.emails.send({
      from: 'CounselorReady <notifications@counselorready.com>',
      to: user.email,
      subject: `${urgencyText}Your ${credential.name} expires in ${daysOut} days`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #6b1d34, #34503d); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .header h1 { margin: 0; font-size: 24px; }
            .content { background: #fff; padding: 30px; border: 1px solid #e5e5e5; border-top: none; }
            .credential-box { background: #f8f9fa; border-left: 4px solid ${daysOut <= 14 ? '#dc3545' : daysOut <= 30 ? '#ffc107' : '#28a745'}; padding: 20px; margin: 20px 0; border-radius: 0 8px 8px 0; }
            .credential-name { font-size: 20px; font-weight: bold; color: #6b1d34; margin-bottom: 10px; }
            .detail { margin: 8px 0; }
            .detail-label { color: #666; font-size: 14px; }
            .detail-value { font-weight: 600; }
            .progress-bar { background: #e9ecef; border-radius: 10px; height: 20px; margin-top: 15px; overflow: hidden; }
            .progress-fill { background: linear-gradient(90deg, #34503d, #547c5f); height: 100%; border-radius: 10px; transition: width 0.3s; }
            .cta-button { display: inline-block; background: #6b1d34; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; margin-top: 20px; font-weight: 600; }
            .cta-button:hover { background: #4a1524; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            .urgent-banner { background: #dc3545; color: white; padding: 10px; text-align: center; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            ${daysOut <= 14 ? '<div class="urgent-banner">⚠️ URGENT: Action Required</div>' : ''}
            <div class="header">
              <h1>CounselorReady</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Credential Expiration Reminder</p>
            </div>
            <div class="content">
              <p>Hi ${user.name || 'there'},</p>
              
              <p>This is a reminder that one of your credentials is expiring soon:</p>
              
              <div class="credential-box">
                <div class="credential-name">${credential.name}${credential.state ? ` (${credential.state})` : ''}</div>
                <div class="detail">
                  <span class="detail-label">License Number:</span>
                  <span class="detail-value">${credential.licenseNumber || 'N/A'}</span>
                </div>
                <div class="detail">
                  <span class="detail-label">Expiration Date:</span>
                  <span class="detail-value">${credential.expirationDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div class="detail">
                  <span class="detail-label">Days Remaining:</span>
                  <span class="detail-value" style="color: ${daysOut <= 14 ? '#dc3545' : daysOut <= 30 ? '#ffc107' : '#28a745'}">${daysOut} days</span>
                </div>
                <div class="detail">
                  <span class="detail-label">CE Progress:</span>
                  <span class="detail-value">${ceProgress}</span>
                </div>
                ${credential.totalCEUsRequired > 0 ? `
                <div class="progress-bar">
                  <div class="progress-fill" style="width: ${Math.min(100, (credential.totalCEUsCompleted / credential.totalCEUsRequired) * 100)}%"></div>
                </div>
                ` : ''}
              </div>
              
              ${daysOut <= 30 ? `
              <p><strong>Action needed:</strong> Make sure you have completed all required CE hours and submit your renewal application to avoid any lapse in your license.</p>
              ` : `
              <p>You still have time, but we recommend staying on track with your CE requirements to avoid last-minute stress.</p>
              `}
              
              <center>
                <a href="https://counselorready.com/credentials.html" class="cta-button">View Your Credentials</a>
              </center>
            </div>
            <div class="footer">
              <p>You're receiving this because you have credential reminders enabled on CounselorReady.</p>
              <p>© ${new Date().getFullYear()} CounselorReady by GA Integrated Therapeutic Perspectives LLC</p>
            </div>
          </div>
        </body>
        </html>
      `
    });
    
    console.log(`Sent reminder email to ${user.email} for ${credential.name}`);
  } catch (error) {
    console.error('Error sending reminder email:', error);
  }
}

/**
 * Send immediate test reminder
 */
export async function sendTestReminder(userId, credentialId) {
  try {
    const credential = await UserCredential.findOne({ _id: credentialId, userId });
    const user = await User.findById(userId);
    
    if (!credential || !user) {
      throw new Error('Credential or user not found');
    }
    
    const daysOut = Math.ceil((credential.expirationDate - new Date()) / (1000 * 60 * 60 * 24));
    
    await createNotification(userId, credential, daysOut);
    await sendReminderEmail(user, credential, daysOut);
    
    return { success: true, message: 'Test reminder sent' };
  } catch (error) {
    console.error('Error sending test reminder:', error);
    throw error;
  }
}

export default { checkAndSendReminders, sendTestReminder };
