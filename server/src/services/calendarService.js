/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */

/**
 * Consolidated Calendar Service
 * Generates ICS calendar files and Google Calendar URLs for credential/insurance reminders.
 * Uses the ical-generator package for robust ICS generation.
 */
import ical from 'ical-generator';

/**
 * Format a Date as YYYYMMDD for Google Calendar URLs
 */
function formatDateYMD(date) {
  const d = new Date(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}${m}${day}`;
}

/**
 * Get reminder days from user preferences or use defaults
 */
function getReminderDays(user) {
  if (user?.notifications?.timing?.reminderDays?.length) {
    return user.notifications.timing.reminderDays;
  }
  return [90, 30, 14, 7];
}

/**
 * Generate ICS content for a single credential
 * @param {Object} credential - The credential object (from UserCredential model)
 * @param {Object} user - The user object
 * @returns {string} ICS file content
 */
export function generateCredentialICS(credential, user) {
  const timezone = user?.profile?.timezone || 'America/New_York';
  const reminderDays = getReminderDays(user);

  const calendar = ical({
    name: 'CounselorReady - Credential Renewal',
    prodId: { company: 'CounselorReady', product: 'Credential Reminder' },
    timezone
  });

  addCredentialEvent(calendar, credential, user, timezone, reminderDays);

  return calendar.toString();
}

/**
 * Generate ICS content for ALL user credentials
 * @param {Object} user - The user object
 * @param {Array} credentials - Array of credential objects
 * @returns {string} ICS file content
 */
export function generateAllCredentialsICS(user, credentials) {
  const timezone = user?.profile?.timezone || 'America/New_York';
  const reminderDays = getReminderDays(user);

  const calendar = ical({
    name: 'CounselorReady - All Renewals',
    prodId: { company: 'CounselorReady', product: 'Credential Reminder' },
    timezone
  });

  // Add each credential with an expiration date
  for (const credential of credentials) {
    if (credential.expirationDate) {
      addCredentialEvent(calendar, credential, user, timezone, reminderDays);
    }
  }

  // Add insurance if available
  if (user?.liabilityInsurance?.expirationDate) {
    addInsuranceEvent(calendar, user.liabilityInsurance, user, timezone, reminderDays);
  }

  return calendar.toString();
}

/**
 * Generate ICS content for insurance expiration
 * @param {Object} insurance - The insurance object (user.liabilityInsurance)
 * @param {Object} user - The user object
 * @returns {string} ICS file content
 */
export function generateInsuranceICS(insurance, user) {
  const timezone = user?.profile?.timezone || 'America/New_York';
  const reminderDays = user?.notifications?.timing?.insuranceReminderDays?.length
    ? user.notifications.timing.insuranceReminderDays
    : getReminderDays(user);

  const calendar = ical({
    name: 'CounselorReady - Insurance Renewal',
    prodId: { company: 'CounselorReady', product: 'Insurance Reminder' },
    timezone
  });

  addInsuranceEvent(calendar, insurance, user, timezone, reminderDays);

  return calendar.toString();
}

/**
 * Build a Google Calendar "Add Event" URL (no OAuth needed)
 * Opens Google Calendar in the browser with the event pre-filled.
 * @param {Object} options
 * @param {string} options.title - Event title
 * @param {string} options.description - Event description
 * @param {Date|string} options.date - Event date
 * @param {string} [options.location] - Event location
 * @returns {string} Google Calendar URL
 */
export function buildGoogleCalendarURL({ title, description, date, location = 'CounselorReady' }) {
  const eventDate = new Date(date);
  const startDate = formatDateYMD(eventDate);
  // All-day event: end date is the next day
  const nextDay = new Date(eventDate);
  nextDay.setDate(nextDay.getDate() + 1);
  const endDate = formatDateYMD(nextDay);

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${startDate}/${endDate}`,
    details: description,
    location
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

// ── Internal helpers ──

/**
 * Add a credential event to an ical calendar
 */
function addCredentialEvent(calendar, credential, user, timezone, reminderDays) {
  const expirationDate = new Date(credential.expirationDate);
  const name = credential.name || credential.code || 'Credential';
  const stateInfo = credential.state ? ` (${credential.state})` : '';
  const ceCompleted = credential.totalCEUsCompleted || 0;
  const ceRequired = credential.totalCEUsRequired || 0;
  const ceProgress = ceRequired > 0 ? `${ceCompleted}/${ceRequired} CE hours completed` : '';

  const descriptionLines = [
    `Your ${name}${stateInfo} expires on this date.`,
    '',
    `License Number: ${credential.licenseNumber || 'N/A'}`,
    ceProgress,
    '',
    'Visit CounselorReady to manage your credentials:',
    'https://counselorready.com/credentials.html'
  ].filter(Boolean);

  const event = calendar.createEvent({
    start: expirationDate,
    end: expirationDate,
    allDay: true,
    summary: `${name} Expires${stateInfo}`,
    description: descriptionLines.join('\n'),
    location: 'CounselorReady',
    url: 'https://counselorready.com/credentials.html',
    uid: `credential-${credential._id}@counselorready.com`,
    categories: [{ name: 'License Renewal' }, { name: 'CounselorReady' }],
    status: 'CONFIRMED',
    timezone
  });

  // Add VALARM reminders
  for (const days of reminderDays) {
    let desc;
    if (days >= 30) {
      desc = `${name} expires in ${days} days`;
    } else if (days >= 14) {
      desc = `${name} expires in ${days} days - Action Required`;
    } else {
      desc = `URGENT: ${name} expires in ${days} days`;
    }
    event.createAlarm({
      type: 'display',
      trigger: days * 24 * 60 * 60, // seconds before
      description: desc
    });
  }
}

/**
 * Add an insurance event to an ical calendar
 */
function addInsuranceEvent(calendar, insurance, user, timezone, reminderDays) {
  // Support both expirationDate and renewalDate fields
  const expirationDate = new Date(insurance.expirationDate || insurance.renewalDate);
  const provider = insurance.provider || 'Policy';

  const descriptionLines = [
    `Your malpractice insurance policy${insurance.provider ? ` with ${insurance.provider}` : ''} is due for renewal.`,
    '',
    `Policy Number: ${insurance.policyNumber || 'N/A'}`,
    insurance.coverageAmount ? `Coverage: $${insurance.coverageAmount.toLocaleString()}` : '',
    '',
    'Visit CounselorReady to manage your insurance:',
    'https://counselorready.com/settings.html'
  ].filter(Boolean);

  const event = calendar.createEvent({
    start: expirationDate,
    end: expirationDate,
    allDay: true,
    summary: `Malpractice Insurance Renewal - ${provider}`,
    description: descriptionLines.join('\n'),
    location: 'CounselorReady',
    url: 'https://counselorready.com/settings.html',
    uid: `insurance-${user._id}@counselorready.com`,
    categories: [{ name: 'Insurance Renewal' }, { name: 'CounselorReady' }],
    status: 'CONFIRMED',
    timezone
  });

  for (const days of reminderDays) {
    event.createAlarm({
      type: 'display',
      trigger: days * 24 * 60 * 60,
      description: days >= 14
        ? `Insurance renewal due in ${days} days`
        : `URGENT: Insurance renewal due in ${days} days`
    });
  }
}

export default {
  generateCredentialICS,
  generateAllCredentialsICS,
  generateInsuranceICS,
  buildGoogleCalendarURL
};
