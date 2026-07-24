/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 */

/**
 * generateICS.js — build an RFC 5545 (.ics) calendar invite string.
 *
 * Used by the live-session registration confirmation emails so attendees and
 * the instructor get an "Add to Calendar" block with a 1-hour reminder.
 *
 * event shape:
 *   {
 *     title, description, location,
 *     startUTC: Date, endUTC: Date,
 *     uid,                              // e.g. `${session._id}-${user._id}@counselorready.com`
 *     organizerEmail, organizerName,
 *     attendeeEmail, attendeeName
 *   }
 *
 * Returns: a string containing a single VCALENDAR/VEVENT with METHOD:REQUEST.
 */

function pad(n) {
  return String(n).padStart(2, '0');
}

// Format a Date as UTC basic form: YYYYMMDDTHHmmssZ (RFC 5545 §3.3.5).
function toICSDate(value) {
  const d = new Date(value);
  return (
    d.getUTCFullYear().toString() +
    pad(d.getUTCMonth() + 1) +
    pad(d.getUTCDate()) +
    'T' +
    pad(d.getUTCHours()) +
    pad(d.getUTCMinutes()) +
    pad(d.getUTCSeconds()) +
    'Z'
  );
}

// Escape a TEXT value per RFC 5545 §3.3.11: backslash, semicolon, comma, and
// newlines. Order matters — escape backslashes first.
function escapeICSText(value) {
  return String(value == null ? '' : value)
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r\n|\r|\n/g, '\\n');
}

export function generateICS(event) {
  const {
    title = '',
    description = '',
    location = '',
    startUTC,
    endUTC,
    uid,
    organizerEmail = '',
    organizerName = '',
    attendeeEmail = '',
    attendeeName = '',
  } = event || {};

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//CounselorReady//Live Sessions//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${toICSDate(new Date())}`,
    `DTSTART:${toICSDate(startUTC)}`,
    `DTEND:${toICSDate(endUTC)}`,
    `SUMMARY:${escapeICSText(title)}`,
    `DESCRIPTION:${escapeICSText(description)}`,
    `LOCATION:${escapeICSText(location)}`,
    `ORGANIZER;CN=${escapeICSText(organizerName)}:MAILTO:${organizerEmail}`,
    `ATTENDEE;CN=${escapeICSText(attendeeName)}:MAILTO:${attendeeEmail}`,
    'STATUS:CONFIRMED',
    'BEGIN:VALARM',
    'TRIGGER:-PT1H',
    'ACTION:DISPLAY',
    'DESCRIPTION:Reminder',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ];

  // RFC 5545 requires CRLF line breaks between content lines.
  return lines.join('\r\n');
}

export default generateICS;
