import twilio from 'twilio';
import UserCredential from '../models/UserCredential.js';
import User from '../models/User.js';

// Initialize Twilio client
const twilioClient = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null;

const TWILIO_PHONE = process.env.TWILIO_PHONE_NUMBER;

/**
 * Generate ICS calendar file content for a credential expiration
 */
export function generateICSFile(credential, user) {
  const expirationDate = new Date(credential.expirationDate);
  
  // Create reminder 30 days before expiration
  const reminderDate = new Date(expirationDate);
  reminderDate.setDate(reminderDate.getDate() - 30);
  
  // Format dates for ICS (YYYYMMDD format)
  const formatICSDate = (date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };
  
  const formatICSDateOnly = (date) => {
    return date.toISOString().split('T')[0].replace(/-/g, '');
  };
  
  const uid = `credential-${credential._id}@counselorready.com`;
  const now = new Date();
  
  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//CounselorReady//Credential Reminder//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
UID:${uid}
DTSTAMP:${formatICSDate(now)}
DTSTART;VALUE=DATE:${formatICSDateOnly(expirationDate)}
DTEND;VALUE=DATE:${formatICSDateOnly(expirationDate)}
SUMMARY:${credential.name || 'Credential'} Expires${credential.state ? ` (${credential.state})` : ''}
DESCRIPTION:Your ${credential.name}${credential.state ? ` in ${credential.state}` : ''} expires on this date.\\n\\nLicense Number: ${credential.licenseNumber || 'N/A'}\\n\\nVisit CounselorReady to manage your credentials: https://counselorready.com/credentials.html
LOCATION:CounselorReady
STATUS:CONFIRMED
CATEGORIES:License Renewal,CounselorReady
BEGIN:VALARM
TRIGGER:-P30D
ACTION:DISPLAY
DESCRIPTION:${credential.name} expires in 30 days
END:VALARM
BEGIN:VALARM
TRIGGER:-P14D
ACTION:DISPLAY
DESCRIPTION:${credential.name} expires in 14 days - Action Required
END:VALARM
BEGIN:VALARM
TRIGGER:-P7D
ACTION:DISPLAY
DESCRIPTION:URGENT: ${credential.name} expires in 7 days
END:VALARM
END:VEVENT
END:VCALENDAR`;

  return icsContent;
}

/**
 * Generate ICS file for insurance expiration
 */
export function generateInsuranceICS(insurance, user) {
  const expirationDate = new Date(insurance.renewalDate);
  
  const formatICSDate = (date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };
  
  const formatICSDateOnly = (date) => {
    return date.toISOString().split('T')[0].replace(/-/g, '');
  };
  
  const uid = `insurance-${user._id}-${Date.now()}@counselorready.com`;
  const now = new Date();
  
  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//CounselorReady//Insurance Reminder//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
UID:${uid}
DTSTAMP:${formatICSDate(now)}
DTSTART;VALUE=DATE:${formatICSDateOnly(expirationDate)}
DTEND;VALUE=DATE:${formatICSDateOnly(expirationDate)}
SUMMARY:Malpractice Insurance Renewal - ${insurance.provider || 'Policy'}
DESCRIPTION:Your malpractice insurance policy${insurance.provider ? ` with ${insurance.provider}` : ''} is due for renewal.\\n\\nPolicy Number: ${insurance.policyNumber || 'N/A'}\\n\\nVisit CounselorReady to manage your insurance: https://counselorready.com/settings.html
LOCATION:CounselorReady
STATUS:CONFIRMED
CATEGORIES:Insurance Renewal,CounselorReady
BEGIN:VALARM
TRIGGER:-P30D
ACTION:DISPLAY
DESCRIPTION:Insurance renewal due in 30 days
END:VALARM
BEGIN:VALARM
TRIGGER:-P14D
ACTION:DISPLAY
DESCRIPTION:Insurance renewal due in 14 days
END:VALARM
END:VEVENT
END:VCALENDAR`;

  return icsContent;
}

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
  generateICSFile,
  generateInsuranceICS,
  sendSMSReminder,
  sendCredentialExpirationSMS,
  sendTestSMS,
  checkAndSendSMSReminders
};
