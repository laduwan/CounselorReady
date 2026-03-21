/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import twilio from 'twilio';
import UserCredential from '../models/UserCredential.js';
import User from '../models/User.js';

// Initialize Twilio client
const twilioClient = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null;

const TWILIO_PHONE = process.env.TWILIO_PHONE_NUMBER;

// ICS calendar generation has been consolidated into calendarService.js
// Re-export for backward compatibility
export { generateCredentialICS as generateICSFile, generateInsuranceICS } from './calendarService.js';

/**
 * Send SMS reminder
 */
export async function sendSMSReminder(phoneNumber, message) {
  if (!twilioClient) {
    console.log('Twilio not configured - SMS not sent');
    return { success: false, error: 'Twilio not configured' };
  }
  
  if (!phoneNumber) {
    return { success: false, error: 'No phone number provided' };
  }
  
  // Format phone number (ensure E.164 format)
  let formattedPhone = phoneNumber.replace(/\D/g, '');
  if (formattedPhone.length === 10) {
    formattedPhone = '1' + formattedPhone; // Add US country code
  }
  if (!formattedPhone.startsWith('+')) {
    formattedPhone = '+' + formattedPhone;
  }
  
  try {
    const result = await twilioClient.messages.create({
      body: message,
      from: TWILIO_PHONE,
      to: formattedPhone
    });
    
    console.log(`SMS sent to ${formattedPhone}: ${result.sid}`);
    return { success: true, sid: result.sid };
  } catch (error) {
    console.error('SMS send error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Send credential expiration SMS
 */
export async function sendCredentialExpirationSMS(userId, credentialId) {
  try {
    const user = await User.findById(userId);
    const credential = await UserCredential.findById(credentialId);
    
    if (!user || !credential) {
      return { success: false, error: 'User or credential not found' };
    }
    
    if (!user.phone || !user.smsRemindersEnabled) {
      return { success: false, error: 'SMS reminders not enabled or no phone' };
    }
    
    const daysOut = Math.ceil((new Date(credential.expirationDate) - new Date()) / (1000 * 60 * 60 * 24));
    
    const message = `CounselorReady Reminder: Your ${credential.name}${credential.state ? ` (${credential.state})` : ''} expires in ${daysOut} days on ${new Date(credential.expirationDate).toLocaleDateString()}. Log in to check your CE progress.`;
    
    return await sendSMSReminder(user.phone, message);
  } catch (error) {
    console.error('Send credential SMS error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Send test SMS to verify phone number
 */
export async function sendTestSMS(phoneNumber) {
  const message = 'CounselorReady: Your phone number has been verified for SMS reminders. You will receive credential expiration reminders at this number.';
  return await sendSMSReminder(phoneNumber, message);
}

/**
 * Check and send SMS reminders for expiring credentials (VIP only)
 */
export async function checkAndSendSMSReminders() {
  console.log('Running SMS reminder check for VIP users...');
  
  // SMS only for VIP subscribers
  const vipUsers = await User.find({
    'subscription.plan': 'vip',
    'subscription.status': 'active',
    smsRemindersEnabled: true,
    phone: { $exists: true, $ne: '' }
  });
  
  console.log(`Found ${vipUsers.length} VIP users with SMS enabled`);
  
  const REMINDER_DAYS = [30, 14, 7];
  const now = new Date();
  
  for (const user of vipUsers) {
    const credentials = await UserCredential.find({
      userId: user._id,
      remindersEnabled: { $ne: false }
    });
    
    for (const credential of credentials) {
      if (!credential.expirationDate) continue;
      
      const daysOut = Math.ceil((new Date(credential.expirationDate) - now) / (1000 * 60 * 60 * 24));
      
      // Only send on exact threshold days to avoid spam
      if (REMINDER_DAYS.includes(daysOut)) {
        await sendCredentialExpirationSMS(user._id, credential._id);
      }
    }
  }
  
  console.log('SMS reminder check complete');
}

export default {
  sendSMSReminder,
  sendCredentialExpirationSMS,
  sendTestSMS,
  checkAndSendSMSReminders
};
