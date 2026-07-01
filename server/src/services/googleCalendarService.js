/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */

/**
 * Google Calendar Service
 * Handles OAuth flow and calendar event sync for credential/insurance reminders.
 *
 * Required environment variables:
 *   GOOGLE_CLIENT_ID
 *   GOOGLE_CLIENT_SECRET
 *   GOOGLE_REDIRECT_URI  (e.g. https://counselorready.com/api/auth/google/callback)
 */
import { google } from 'googleapis';

const SCOPES = [
  'https://www.googleapis.com/auth/calendar.events',
  'https://www.googleapis.com/auth/userinfo.email',
  'openid'
];

/**
 * Create an OAuth2 client
 */
function getOAuth2Client() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
}

/**
 * Get the Google OAuth consent URL
 * @param {string} userId - Encoded in the state parameter for the callback
 * @returns {string} Google OAuth consent URL
 */
export function getAuthURL(userId) {
  const oauth2Client = getOAuth2Client();
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent',
    state: userId.toString()
  });
}

/**
 * Exchange authorization code for tokens and save to user
 * @param {string} code - Authorization code from Google
 * @param {Object} user - Mongoose User document
 */
export async function handleCallback(code, user) {
  const oauth2Client = getOAuth2Client();
  const { tokens } = await oauth2Client.getToken(code);

  oauth2Client.setCredentials(tokens);

  // Fetch the connected Google account email. Non-blocking — connection still succeeds if this fails.
  let googleEmail = user.googleCalendar?.email || null;
  try {
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    const { data: profile } = await oauth2.userinfo.get();
    if (profile?.email) googleEmail = profile.email;
  } catch (err) {
    console.error('Google Calendar: failed to fetch account email (non-fatal):', err.message);
  }

  user.googleCalendar = {
    connected: true,
    email: googleEmail,
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token || user.googleCalendar?.refreshToken,
    tokenExpiry: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
    calendarId: 'primary',
    syncEnabled: true,
    lastSyncAt: null,
    eventIds: user.googleCalendar?.eventIds || []
  };

  await user.save();
}

/**
 * Refresh the access token if expired
 * @param {Object} user - Mongoose User document
 * @returns {google.auth.OAuth2} Authenticated client
 */
export async function getAuthenticatedClient(user) {
  if (!user.googleCalendar?.connected || !user.googleCalendar?.refreshToken) {
    throw new Error('Google Calendar not connected');
  }

  const oauth2Client = getOAuth2Client();
  oauth2Client.setCredentials({
    access_token: user.googleCalendar.accessToken,
    refresh_token: user.googleCalendar.refreshToken,
    expiry_date: user.googleCalendar.tokenExpiry ? user.googleCalendar.tokenExpiry.getTime() : null
  });

  // Check if token needs refresh
  const now = Date.now();
  const expiry = user.googleCalendar.tokenExpiry ? user.googleCalendar.tokenExpiry.getTime() : 0;
  if (now >= expiry - 60000) {
    try {
      const { credentials } = await oauth2Client.refreshAccessToken();
      user.googleCalendar.accessToken = credentials.access_token;
      user.googleCalendar.tokenExpiry = credentials.expiry_date ? new Date(credentials.expiry_date) : null;
      if (credentials.refresh_token) {
        user.googleCalendar.refreshToken = credentials.refresh_token;
      }
      await user.save();
      oauth2Client.setCredentials(credentials);
    } catch (err) {
      // Token refresh failed — mark as disconnected
      user.googleCalendar.connected = false;
      user.googleCalendar.accessToken = null;
      user.googleCalendar.tokenExpiry = null;
      await user.save();
      throw new Error('Google Calendar token expired. Please reconnect.');
    }
  }

  return oauth2Client;
}

/**
 * Build a Google Calendar event body for a credential
 */
function buildCredentialEventBody(credential) {
  const name = credential.name || credential.code || 'Credential';
  const stateInfo = credential.state ? ` (${credential.state})` : '';
  const ceCompleted = credential.totalCEUsCompleted || 0;
  const ceRequired = credential.totalCEUsRequired || 0;
  const ceProgress = ceRequired > 0 ? `\n${ceCompleted}/${ceRequired} CE hours completed` : '';

  const expirationDate = new Date(credential.expirationDate);
  const dateStr = expirationDate.toISOString().split('T')[0]; // YYYY-MM-DD

  return {
    summary: `${name} Expires${stateInfo}`,
    description: [
      `Your ${name}${stateInfo} expires on this date.`,
      `License Number: ${credential.licenseNumber || 'N/A'}`,
      ceProgress,
      '',
      'Visit CounselorReady to manage your credentials:',
      'https://counselorready.com/credentials.html'
    ].filter(l => l !== undefined).join('\n'),
    start: { date: dateStr },
    end: { date: dateStr },
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'popup', minutes: 90 * 24 * 60 },
        { method: 'popup', minutes: 30 * 24 * 60 },
        { method: 'popup', minutes: 14 * 24 * 60 },
        { method: 'popup', minutes: 7 * 24 * 60 }
      ]
    },
    source: {
      title: 'CounselorReady',
      url: 'https://counselorready.com/credentials.html'
    }
  };
}

/**
 * Build a Google Calendar event body for insurance
 */
function buildInsuranceEventBody(insurance) {
  const provider = insurance.provider || 'Policy';
  const expirationDate = new Date(insurance.expirationDate || insurance.renewalDate);
  const dateStr = expirationDate.toISOString().split('T')[0];

  return {
    summary: `Malpractice Insurance Renewal - ${provider}`,
    description: [
      `Your malpractice insurance policy${insurance.provider ? ` with ${insurance.provider}` : ''} is due for renewal.`,
      `Policy Number: ${insurance.policyNumber || 'N/A'}`,
      insurance.coverageAmount ? `Coverage: $${insurance.coverageAmount.toLocaleString()}` : '',
      '',
      'Visit CounselorReady to manage your insurance:',
      'https://counselorready.com/settings.html'
    ].filter(Boolean).join('\n'),
    start: { date: dateStr },
    end: { date: dateStr },
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'popup', minutes: 30 * 24 * 60 },
        { method: 'popup', minutes: 14 * 24 * 60 },
        { method: 'popup', minutes: 7 * 24 * 60 }
      ]
    },
    source: {
      title: 'CounselorReady',
      url: 'https://counselorready.com/settings.html'
    }
  };
}

/**
 * Sync a single credential to Google Calendar (create or update)
 * @param {Object} user - Mongoose User document
 * @param {Object} credential - Credential object
 */
export async function syncCredentialToCalendar(user, credential) {
  const oauth2Client = await getAuthenticatedClient(user);
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
  const calendarId = user.googleCalendar.calendarId || 'primary';

  const eventBody = buildCredentialEventBody(credential);
  const credentialIdStr = credential._id.toString();

  // Check if event already exists
  const existing = user.googleCalendar.eventIds.find(
    e => e.credentialId?.toString() === credentialIdStr && e.type === 'credential'
  );

  try {
    if (existing?.googleEventId) {
      // Update existing event
      await calendar.events.update({
        calendarId,
        eventId: existing.googleEventId,
        requestBody: eventBody
      });
    } else {
      // Create new event
      const res = await calendar.events.insert({
        calendarId,
        requestBody: eventBody
      });

      user.googleCalendar.eventIds.push({
        credentialId: credential._id,
        googleEventId: res.data.id,
        type: 'credential'
      });
      await user.save();
    }
  } catch (err) {
    console.error(`Google Calendar sync error for credential ${credentialIdStr}:`, err.message);
    throw err;
  }
}

/**
 * Sync insurance to Google Calendar
 * @param {Object} user - Mongoose User document
 */
export async function syncInsuranceToCalendar(user) {
  if (!user.liabilityInsurance?.expirationDate && !user.liabilityInsurance?.renewalDate) {
    return;
  }

  const oauth2Client = await getAuthenticatedClient(user);
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
  const calendarId = user.googleCalendar.calendarId || 'primary';

  const eventBody = buildInsuranceEventBody(user.liabilityInsurance);

  const existing = user.googleCalendar.eventIds.find(e => e.type === 'insurance');

  try {
    if (existing?.googleEventId) {
      await calendar.events.update({
        calendarId,
        eventId: existing.googleEventId,
        requestBody: eventBody
      });
    } else {
      const res = await calendar.events.insert({
        calendarId,
        requestBody: eventBody
      });

      user.googleCalendar.eventIds.push({
        googleEventId: res.data.id,
        type: 'insurance'
      });
      await user.save();
    }
  } catch (err) {
    console.error('Google Calendar insurance sync error:', err.message);
    throw err;
  }
}

/**
 * Sync all credentials + insurance to Google Calendar
 * @param {Object} user - Mongoose User document
 * @param {Array} credentials - Array of credential objects
 */
export async function syncAllToCalendar(user, credentials) {
  const results = { synced: 0, errors: 0 };

  for (const credential of credentials) {
    if (!credential.expirationDate) continue;
    try {
      await syncCredentialToCalendar(user, credential);
      results.synced++;
    } catch (err) {
      results.errors++;
    }
  }

  try {
    await syncInsuranceToCalendar(user);
    results.synced++;
  } catch (err) {
    // Insurance sync is optional
    results.errors++;
  }

  user.googleCalendar.lastSyncAt = new Date();
  await user.save();

  return results;
}

/**
 * Remove a Google Calendar event for a credential
 * @param {Object} user - Mongoose User document
 * @param {string} credentialId - The credential ID
 */
export async function removeEventFromCalendar(user, credentialId) {
  const credentialIdStr = credentialId.toString();
  const existing = user.googleCalendar.eventIds.find(
    e => e.credentialId?.toString() === credentialIdStr && e.type === 'credential'
  );

  if (!existing?.googleEventId) return;

  try {
    const oauth2Client = await getAuthenticatedClient(user);
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    const calendarId = user.googleCalendar.calendarId || 'primary';

    await calendar.events.delete({
      calendarId,
      eventId: existing.googleEventId
    });
  } catch (err) {
    console.error('Google Calendar event delete error:', err.message);
  }

  // Remove from eventIds array
  user.googleCalendar.eventIds = user.googleCalendar.eventIds.filter(
    e => !(e.credentialId?.toString() === credentialIdStr && e.type === 'credential')
  );
  await user.save();
}

/**
 * Disconnect Google Calendar — revoke tokens and clear fields
 * @param {Object} user - Mongoose User document
 */
export async function disconnectGoogleCalendar(user) {
  if (user.googleCalendar?.accessToken) {
    try {
      const oauth2Client = getOAuth2Client();
      await oauth2Client.revokeToken(user.googleCalendar.accessToken);
    } catch (err) {
      // Revoke may fail if token is already expired — that's OK
      console.error('Token revoke error (non-fatal):', err.message);
    }
  }

  user.googleCalendar = {
    connected: false,
    email: null,
    accessToken: null,
    refreshToken: null,
    tokenExpiry: null,
    calendarId: 'primary',
    syncEnabled: false,
    lastSyncAt: null,
    eventIds: []
  };
  await user.save();
}

export default {
  getAuthURL,
  handleCallback,
  getAuthenticatedClient,
  syncCredentialToCalendar,
  syncInsuranceToCalendar,
  syncAllToCalendar,
  removeEventFromCalendar,
  disconnectGoogleCalendar
};
