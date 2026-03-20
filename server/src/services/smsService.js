/**
 * smsService.js
 * Twilio SMS — enrollment, completion, and CE renewal reminders
 * Place at: server/src/services/smsService.js
 */

import twilio from 'twilio';

const client = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null;

const FROM = process.env.TWILIO_PHONE_NUMBER;
const BASE_URL = process.env.CLIENT_URL || 'https://counselorready.com';

// ─── Core sender ────────────────────────────────────────────────────────────

async function sendSMS(to, body) {
  if (!client) {
    console.warn('[SMS] Twilio not configured — skipping send.');
    return null;
  }
  if (!to) {
    console.warn('[SMS] No phone number — skipping send.');
    return null;
  }

  // Normalize number
  const phone = to.startsWith('+') ? to : `+1${to.replace(/\D/g, '')}`;

  try {
    const msg = await client.messages.create({ from: FROM, to: phone, body });
    console.log(`[SMS] Sent to ${phone} — SID: ${msg.sid}`);
    return msg;
  } catch (err) {
    console.error(`[SMS] Failed to send to ${phone}:`, err.message);
    return null;
  }
}

// ─── Templates ──────────────────────────────────────────────────────────────

/**
 * Sent when a user enrolls in a course.
 * @param {Object} user  - { phone, firstName }
 * @param {Object} course - { title, slug }
 */
export async function sendEnrollmentSMS(user, course) {
  if (!user?.smsOptIn) return;
  const body =
    `Hi ${user.firstName || 'there'}! You're enrolled in "${course.title}" on CounselorReady. ` +
    `Start learning: ${BASE_URL}/courses/${course.slug}`;
  return sendSMS(user.phone, body);
}

/**
 * Sent when a learner earns their certificate.
 * @param {Object} user      - { phone, firstName, smsOptIn }
 * @param {Object} course    - { title, ceHours }
 * @param {Object} certificate - { _id }
 */
export async function sendCompletionSMS(user, course, certificate) {
  if (!user?.smsOptIn) return;
  const body =
    `Congrats, ${user.firstName || 'Counselor'}! 🎉 You completed "${course.title}" ` +
    `(${course.ceHours} CE hrs). Download your certificate: ` +
    `${BASE_URL}/certificates/${certificate._id}`;
  return sendSMS(user.phone, body);
}

/**
 * Sent by the renewal cron job.
 * @param {Object} user       - { phone, firstName, smsOptIn }
 * @param {Object} credential - { licenseType, state, expiresAt }
 * @param {number} daysLeft   - 90 | 30 | 7
 */
export async function sendRenewalReminderSMS(user, credential, daysLeft) {
  if (!user?.smsOptIn) return;
  const exp = new Date(credential.expiresAt).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  });
  const body =
    `Hi ${user.firstName || 'there'}, your ${credential.licenseType} (${credential.state}) ` +
    `expires in ${daysLeft} days (${exp}). Stay compliant: ${BASE_URL}/credentials`;
  return sendSMS(user.phone, body);
}

export default { sendEnrollmentSMS, sendCompletionSMS, sendRenewalReminderSMS };
