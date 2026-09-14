/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 */

/**
 * liveRoomService — makes sure every live session has a Whereby room that
 * covers its CURRENT scheduled window.
 *
 * Why: the admin create route provisions a room, but other paths don't —
 * bulk seed scripts that call LiveSession.create() directly (Jul 24 Ethics
 * cohorts), rescheduleLiveSessions.js (moves DB times, leaves the room on the
 * old window), and any room Whereby expired/deleted. A session with no room
 * crashes /join; a room on the wrong window closes early or never opens.
 *
 * Used by:
 *   routes/liveSessions.js  POST /:id/join     → ensureRoom() before minting the URL
 *   jobs/liveSessionSelfHeal.js (every 6 h)    → runLiveRoomCheck() for the next 7 days
 *   scripts/checkLiveRooms.js                  → manual dry run / apply
 *
 * Room states:
 *   ok       room exists and its window covers [scheduledStart, scheduledEnd]
 *   missing  no room on the record, or Whereby 404s it
 *   stale    room exists but its window doesn't cover the session
 *   unknown  legacy room with no stored window and no remote check requested
 *            (treated as ok; the 6-hourly check verifies + backfills it)
 *
 * Safety rules:
 *   - New room is created FIRST; the DB is switched with a conditional
 *     updateOne (only if the record still points at the old room). If another
 *     request won the race, our extra room is deleted and theirs is used.
 *   - Old room is deleted only after the switch succeeds.
 *   - A session that is already LIVE is never moved to a new room (it would
 *     split the people already inside); only a missing room is filled.
 *   - completed / cancelled sessions are never touched.
 */

import LiveSession from '../models/LiveSession.js';
import { createMeeting, deleteMeeting, getMeeting } from './wherebyService.js';
import { createRoom, deleteRoom, getRoom } from './dailyService.js';

/** Route room operations to the correct provider based on session.roomProvider. */
function isDaily(session) {
  return (session.roomProvider || 'whereby') === 'daily';
}
async function provisionRoom(session) {
  return isDaily(session) ? createRoom(session) : createMeeting(session);
}
async function removeRoom(session) {
  return isDaily(session) ? deleteRoom(session.whereby?.roomName) : deleteMeeting(session.whereby?.meetingId);
}
async function fetchRoom(session) {
  return isDaily(session) ? getRoom(session.whereby?.roomName) : getMeeting(session.whereby?.meetingId);
}
import { sendAdminAlert } from './adminNotificationService.js';

const LOG = '[LiveRoom]';
const DAY = 24 * 60 * 60000;

const fmtET = (d) => new Date(d).toLocaleString('en-US', {
  timeZone: 'America/New_York', weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
}) + ' ET';

const TOLERANCE_MS = 60000; // ignore sub-minute rounding on Whereby's side

function covers(winStart, winEnd, session) {
  return new Date(winStart).getTime() <= new Date(session.scheduledStart).getTime() + TOLERANCE_MS
    && new Date(winEnd).getTime() >= new Date(session.scheduledEnd).getTime() - TOLERANCE_MS;
}

/**
 * @param {object} session  LiveSession doc or lean object
 * @param {{remote?: boolean}} opts  remote=true asks Whereby (existence + window)
 * @returns {Promise<{state, detail, window?: {start, end}}>}
 */
export async function inspectRoom(session, { remote = false } = {}) {
  const w = session.whereby || {};
  if (!w.meetingId || !w.viewerRoomUrl) return { state: 'missing', detail: 'no room on the session record' };

  if (remote) {
    const m = await fetchRoom(session);
    if (!m) return { state: 'missing', detail: `room ${w.meetingId} no longer exists at Whereby` };
    const window = { start: new Date(m.startDate), end: new Date(m.endDate) };
    if (!covers(window.start, window.end, session)) {
      return { state: 'stale', detail: `room ${w.meetingId} is set for ${fmtET(window.start)} → ${fmtET(window.end)}`, window };
    }
    return { state: 'ok', detail: `room ${w.meetingId}`, window };
  }

  if (w.windowStart && w.windowEnd) {
    return covers(w.windowStart, w.windowEnd, session)
      ? { state: 'ok', detail: `room ${w.meetingId}` }
      : { state: 'stale', detail: `room ${w.meetingId} is set for ${fmtET(w.windowStart)} → ${fmtET(w.windowEnd)}` };
  }
  return { state: 'unknown', detail: `room ${w.meetingId} (window not recorded)` };
}

/**
 * Make sure the session has a correct room. Mutates session.whereby in memory
 * when it changes, so a caller holding a hydrated doc can keep using it.
 *
 * @param {object} session  hydrated LiveSession doc (or lean — in-memory update still applied)
 * @param {{remote?: boolean, dryRun?: boolean}} opts
 * @returns {Promise<{action: 'none'|'created'|'regenerated'|'skipped'|'would-create'|'would-regenerate', state, detail, meetingId?, oldMeetingId?}>}
 */
export async function ensureRoom(session, { remote = false, dryRun = false } = {}) {
  if (session.status === 'completed' || session.status === 'cancelled') {
    return { action: 'skipped', state: 'n/a', detail: `session is ${session.status}` };
  }

  const insp = await inspectRoom(session, { remote });
  const oldId = session.whereby?.meetingId || null;

  if (insp.state === 'ok' || insp.state === 'unknown') {
    // Backfill the stored window for legacy rooms once we've seen it remotely.
    if (insp.window && !dryRun && (!session.whereby?.windowStart || !session.whereby?.windowEnd)) {
      await LiveSession.updateOne(
        { _id: session._id, 'whereby.meetingId': oldId },
        { $set: { 'whereby.windowStart': insp.window.start, 'whereby.windowEnd': insp.window.end } }
      );
    }
    return { action: 'none', state: insp.state, detail: insp.detail, meetingId: oldId };
  }

  if (insp.state === 'stale' && session.status === 'live') {
    return { action: 'skipped', state: insp.state, detail: `${insp.detail} — session is live, not moving people to a new room` };
  }

  const verb = insp.state === 'missing' ? 'create' : 'regenerate';
  if (dryRun) return { action: `would-${verb}`, state: insp.state, detail: insp.detail, oldMeetingId: oldId };

  const plain = typeof session.toObject === 'function' ? session.toObject() : session;
  const room = await provisionRoom(plain);

  // Switch only if nobody else switched it first.
  const guard = oldId
    ? { _id: session._id, 'whereby.meetingId': oldId }
    : { _id: session._id, $or: [{ 'whereby.meetingId': { $exists: false } }, { 'whereby.meetingId': null }, { 'whereby.meetingId': '' }] };
  const res = await LiveSession.updateOne(guard, { $set: { whereby: room } });

  if (!res.modifiedCount) {
    // Lost the race — another request already fixed it. Use theirs, drop ours.
    await removeRoom({ ...plain, roomProvider: plain.roomProvider, whereby: room }).catch(() => {});
    const fresh = await LiveSession.findById(session._id).select('whereby').lean();
    if (fresh?.whereby) session.whereby = fresh.whereby;
    return { action: 'none', state: 'ok', detail: 'fixed concurrently by another request', meetingId: fresh?.whereby?.meetingId };
  }

  session.whereby = room;
  if (oldId) await removeRoom(session).catch(err => console.warn(`${LOG} old room ${oldId} not deleted: ${err.message}`));

  console.warn(`${LOG} ${verb}d room for ${session.slug}: ${insp.detail} → new room ${room.meetingId}`);
  return { action: insp.state === 'missing' ? 'created' : 'regenerated', state: insp.state, detail: insp.detail, meetingId: room.meetingId, oldMeetingId: oldId };
}

// Failure alerts are throttled per session (a failing room + 30 attendees
// retrying would otherwise send 30 emails). Fixes always alert.
const FAIL_ALERT_EVERY_MS = 15 * 60000;
const lastFailAlert = new Map();

/** Admin email for one fix or failure (fire-and-forget). */
export function alertRoomResult(session, result, source) {
  const fixed = result.action === 'created' || result.action === 'regenerated';
  const failed = result.action === 'failed';
  if (!fixed && !failed) return;
  if (failed) {
    const key = String(session._id);
    if (Date.now() - (lastFailAlert.get(key) || 0) < FAIL_ALERT_EVERY_MS) return;
    lastFailAlert.set(key, Date.now());
  }
  sendAdminAlert(failed ? 'live_room_failed' : 'live_room_fixed', {
    Session: session.title,
    Slug: session.slug,
    Starts: fmtET(session.scheduledStart),
    Ends: fmtET(session.scheduledEnd),
    Problem: result.detail,
    Result: failed ? `NOT fixed — ${result.error}` : `${result.action} room ${result.meetingId}${result.oldMeetingId ? ` (replaced ${result.oldMeetingId})` : ''}`,
    'Found by': source
  }).catch(err => console.error(`${LOG} admin alert failed:`, err.message));
}

/**
 * Check every scheduled session starting in the next `days` days (remote check).
 * @returns {Promise<{scanned, ok, fixed, skipped, failed, results: Array}>}
 */
export async function runLiveRoomCheck({ days = 7, dryRun = false, source = 'scheduled room check' } = {}) {
  const now = new Date();
  const sessions = await LiveSession.find({
    status: 'scheduled',
    scheduledEnd: { $gte: now },
    scheduledStart: { $lte: new Date(now.getTime() + days * DAY) }
  }).sort({ scheduledStart: 1 });

  const stats = { scanned: sessions.length, ok: 0, fixed: 0, skipped: 0, failed: 0, results: [] };
  for (const s of sessions) {
    let r;
    try {
      r = await ensureRoom(s, { remote: true, dryRun });
    } catch (err) {
      r = { action: 'failed', state: 'error', detail: 'room check/create failed', error: err.message };
    }
    stats.results.push({ slug: s.slug, starts: fmtET(s.scheduledStart), ...r });
    if (r.action === 'none') stats.ok++;
    else if (r.action === 'failed') stats.failed++;
    else if (r.action === 'skipped') stats.skipped++;
    else stats.fixed++;
    if (!dryRun) alertRoomResult(s, r, source);
  }
  console.log(`${LOG} check (${days}d${dryRun ? ', dry run' : ''}): scanned ${stats.scanned}, ok ${stats.ok}, ${dryRun ? 'would fix' : 'fixed'} ${stats.fixed}, skipped ${stats.skipped}, failed ${stats.failed}`);
  return stats;
}
