/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 */

/**
 * wherebyService — thin wrapper around the Whereby Embedded REST API.
 *
 * Env required:
 *   WHEREBY_API_KEY  — API key from the Whereby Embedded dashboard
 *
 * HIPAA notes:
 *   - The account-level HIPAA add-on + signed BAA must be active in the
 *     Whereby dashboard before supervision sessions go live.
 *   - Cloud recording destination (your S3 bucket) is configured account-wide
 *     in Whereby Dashboard → Configure → Recording. Recordings to
 *     Whereby-provided storage are NOT HIPAA-compliant — always use own S3.
 *   - Supervision rooms are created with recording.type='none' so recording
 *     is impossible at the provider level, not just hidden in our UI.
 */

const WHEREBY_API_BASE = 'https://api.whereby.dev/v1';

function apiKey() {
  const key = process.env.WHEREBY_API_KEY;
  if (!key) throw new Error('WHEREBY_API_KEY is not set');
  return key;
}

async function wherebyFetch(path, options = {}) {
  const res = await fetch(`${WHEREBY_API_BASE}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${apiKey()}`,
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Whereby API ${res.status} on ${path}: ${body}`);
  }
  // DELETE returns 204 No Content
  if (res.status === 204) return null;
  return res.json();
}

/**
 * Create a Whereby meeting for a LiveSession.
 * @param {object} session - LiveSession doc (pre-save is fine; needs type/dates/slug)
 * @returns {{meetingId, roomName, viewerRoomUrl, hostRoomUrl}}
 */
export async function createMeeting(session) {
  const isSupervision = session.sessionType === 'supervision';

  const body = {
    isLocked: true, // knock-to-enter; host admits participants
    roomNamePrefix: `cr-${session.slug}`.slice(0, 39),
    roomMode: 'group',
    // Whereby pads availability around these; we gate the real window in /join
    startDate: session.scheduledStart.toISOString(),
    endDate: session.scheduledEnd.toISOString(),
    fields: ['hostRoomUrl'],
    recording: isSupervision
      ? { type: 'none', destination: null } // HIPAA hard-lock — supervision can never record
      : (session.recordingEnabled
          ? {
              type: 'cloud',
              destination: null, // uses account-wide S3 destination configured in Whereby dashboard
              startTrigger: 'automatic-2nd-participant'
            }
          : { type: 'none', destination: null })
  };

  const data = await wherebyFetch('/meetings', {
    method: 'POST',
    body: JSON.stringify(body)
  });

  return {
    meetingId: data.meetingId,
    roomName: data.roomName,
    viewerRoomUrl: data.roomUrl,
    hostRoomUrl: data.hostRoomUrl
  };
}

/** Delete a Whereby meeting (cancellation cleanup). Safe to call twice. */
export async function deleteMeeting(meetingId) {
  if (!meetingId) return;
  try {
    await wherebyFetch(`/meetings/${meetingId}`, { method: 'DELETE' });
  } catch (err) {
    // 404 = already gone; anything else is logged but non-fatal for cancel flow
    console.warn(`[whereby] deleteMeeting(${meetingId}): ${err.message}`);
  }
}

export default { createMeeting, deleteMeeting };
