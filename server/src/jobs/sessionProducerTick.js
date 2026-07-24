/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 */

/**
 * sessionProducerTick — runs every minute, America/New_York.
 * Mirrors certificateSelfHeal.js structure.
 *
 * Queries only:
 *   - Sessions with status 'live'
 *   - Sessions ended < 30 min ago (for wrap-up dispatch)
 *
 * Each tick performs:
 *   1. Drop detection — rejoin nudge emails for disconnected users
 *   2. Break reminders — resume emails/SMS 3 min before break ends
 *   3. Breakage detection — mass-drop incident broadcast
 *   4. Wrap-up dispatch — post-session email pipeline (≥5 min after end)
 *
 * Live Session Autopilot (additive — all gated on session.autopilot.enabled):
 *   A. Auto-start   — scheduled sessions whose scheduledStart has passed
 *   B. Auto-advance — timed agenda segment progression on live sessions
 *   C. Auto-certs   — issue certificates ≥15 min after a completed session ends
 *   D. Reminders    — T-24h / T-1h registrant emails (all published live-courses)
 *
 * No new cron and no setInterval — the existing 1-minute cron is the clock.
 */

import LiveSession, { breakOverlapMin } from '../models/LiveSession.js';
import { issueLiveSessionCertificates } from '../services/liveSessionCompletionService.js';
import {
  processDropDetection,
  processBreakReminders,
  processBreakageDetection,
  processCheckins,
  runWrapUp,
  sendLiveSessionReminders,
  sendAutopilotCertAdminSummary,
  sendAutopilotEmptyAttendanceWarning
} from '../services/sessionProducer.js';

const LOG = '[ProducerTick]';

const CERT_GRACE_MIN = 15;   // wait this long after a session ends before auto-issuing
const H24_MS = 24 * 60 * 60000;
const H1_MS = 60 * 60000;

export async function runSessionProducerTick() {
  const now = new Date();
  const thirtyMinAgo = new Date(now.getTime() - 30 * 60000);

  let sessions = [];
  try {
    sessions = await LiveSession.find({
      $or: [
        { status: 'live' },
        { status: 'completed', updatedAt: { $gte: thirtyMinAgo }, 'producer.wrapUpSentAt': { $exists: false } }
      ]
    });
  } catch (err) {
    console.error(`${LOG} query error:`, err.message);
    sessions = [];
  }

  for (const session of sessions) {
    try {
      if (session.status === 'live') {
        await processDropDetection(session);
        await processBreakReminders(session);
        await processBreakageDetection(session);
        await processCheckins(session);
        // Autopilot B: timed segment advance (own try/catch so a bad agenda
        // never blocks the other live-session processing above).
        try {
          await processAutopilotAdvance(session, now);
        } catch (err) {
          console.error(`${LOG} autopilot-advance error on ${session._id}:`, err.message);
        }
      }

      // Wrap-up: completed sessions ended ≥ 5 min ago, wrap-up not yet sent
      if (
        session.status === 'completed' &&
        !session.producer?.wrapUpSentAt &&
        session.updatedAt &&
        now.getTime() - session.updatedAt.getTime() >= 5 * 60000
      ) {
        await runWrapUp(session);
      }
    } catch (err) {
      console.error(`${LOG} error processing session ${session._id}:`, err.message);
    }
  }

  // ─── Autopilot batch sub-tasks (run regardless of the live-set above; each
  //     wrapped so one failure never kills the tick) ─────────────────────────
  try {
    await processAutopilotAutoStart(now);
  } catch (err) {
    console.error(`${LOG} autopilot auto-start batch error:`, err.message);
  }
  try {
    await processAutopilotCertificates(now);
  } catch (err) {
    console.error(`${LOG} autopilot auto-cert batch error:`, err.message);
  }
  try {
    await processLiveSessionReminders(now);
  } catch (err) {
    console.error(`${LOG} live-session reminder batch error:`, err.message);
  }
}

/* ════════════════════════ AUTOPILOT: A — AUTO-START ════════════════════════ */

/**
 * Auto-start scheduled autopilot sessions whose start time has arrived.
 * status 'scheduled' + autopilot.enabled + scheduledStart <= now → status 'live',
 * stamp autopilot.startedAt (the clock origin). scheduledEnd sanity guard keeps
 * us from resurrecting a session whose window already fully elapsed.
 */
async function processAutopilotAutoStart(now) {
  const due = await LiveSession.find({
    status: 'scheduled',
    'autopilot.enabled': true,
    scheduledStart: { $lte: now },
    scheduledEnd: { $gte: now }
  });
  for (const session of due) {
    try {
      session.status = 'live';
      session.autopilot.startedAt = session.autopilot.startedAt || now;
      session.markModified('autopilot');
      await session.save();
      console.log(`${LOG} autopilot auto-started "${session.title}" (${session._id})`);
    } catch (err) {
      console.error(`${LOG} autopilot auto-start error on ${session._id}:`, err.message);
    }
  }
}

/* ════════════════════════ AUTOPILOT: B — AUTO-ADVANCE ══════════════════════ */

/**
 * Compute which agenda segment the clock is on for an autopilot session.
 * Elapsed = (now - startedAt) minus the elapsed portion of any declared break
 * window (the segment clock pauses through breaks). Segments without durationMin
 * count as 0 and are skipped by the clock (host can still select them manually).
 * Returns the index of the current timed segment, clamped to the last timed one.
 */
export function computeAutopilotSegmentIndex(session, nowMs) {
  const agenda = session.agenda || [];
  if (!agenda.length || !session.autopilot?.startedAt) return session.liveState?.currentSegment ?? 0;

  const startedMs = session.autopilot.startedAt.getTime();
  let elapsedMin = (nowMs - startedMs) / 60000;
  for (const br of (session.breaks || [])) {
    const bStart = br.startsAt.getTime();
    const bEnd = bStart + br.durationMin * 60000;
    elapsedMin -= breakOverlapMin(startedMs, nowMs, bStart, bEnd);
  }
  if (elapsedMin < 0) elapsedMin = 0;

  let cum = 0;
  let lastTimed = session.liveState?.currentSegment ?? 0;
  for (let i = 0; i < agenda.length; i++) {
    const dur = agenda[i].durationMin || 0; // no durationMin → 0, skipped by the clock
    if (dur === 0) continue;
    cum += dur;
    lastTimed = i;
    if (elapsedMin < cum) return i;
  }
  return lastTimed; // past the end of the timed agenda → hold on the last timed segment
}

/**
 * Advance a live autopilot session's current segment to match the clock.
 * Uses the SAME write path as the manual POST /:id/live-state/segment route.
 * No-op when paused (host took the wheel) or when the index already matches.
 */
async function processAutopilotAdvance(session, now) {
  if (!session.autopilot?.enabled) return;
  if (session.autopilot.pausedAt) return;        // host has taken manual control
  if (!session.autopilot.startedAt) return;      // no clock origin yet
  if (!(session.agenda && session.agenda.length)) return;

  const targetIdx = computeAutopilotSegmentIndex(session, now.getTime());
  const currentIdx = session.liveState?.currentSegment ?? 0;
  if (targetIdx === currentIdx) return;

  session.liveState = {
    ...(session.liveState?.toObject?.() ?? session.liveState ?? {}),
    currentSegment: targetIdx,
    segmentStartedAt: new Date()
  };
  session.markModified('liveState');
  await session.save();
  console.log(`${LOG} autopilot advanced "${session.title}" segment ${currentIdx} → ${targetIdx}`);
}

/* ════════════════════════ AUTOPILOT: C — AUTO-CERTIFICATES ═════════════════ */

/**
 * Auto-issue certificates for completed autopilot live-courses ≥15 min after
 * their scheduled end. Idempotent via certificatesIssuedAt (manual issue) AND
 * producer.certificatesAutoIssuedAt (autopilot handled it). NEVER auto-issues
 * on empty attendance — warns the admin instead. Series-linked sessions are
 * excluded (they issue through the series path).
 */
async function processAutopilotCertificates(now) {
  const graceCutoff = new Date(now.getTime() - CERT_GRACE_MIN * 60000);
  const candidates = await LiveSession.find({
    status: 'completed',
    sessionType: 'live-course',
    'autopilot.enabled': true,
    seriesId: null,
    scheduledEnd: { $lte: graceCutoff },
    certificatesIssuedAt: { $exists: false },
    'producer.certificatesAutoIssuedAt': { $exists: false }
  });

  for (const session of candidates) {
    try {
      const hasAttendance = Array.isArray(session.attendance) && session.attendance.length > 0;
      if (!hasAttendance) {
        // Never auto-issue with empty attendance — warn admin and stamp so we
        // don't re-warn every minute.
        await sendAutopilotEmptyAttendanceWarning(session);
        session.producer = session.producer || {};
        session.producer.certificatesAutoIssuedAt = now;
        session.markModified('producer');
        await session.save();
        console.warn(`${LOG} autopilot cert SKIPPED (empty attendance) "${session.title}" (${session._id})`);
        continue;
      }

      // issueLiveSessionCertificates loads + saves its own copy of the doc
      // (sets certificatesIssuedAt). Re-load afterward to stamp the autopilot
      // marker without clobbering what it wrote.
      const result = await issueLiveSessionCertificates(session._id);

      const fresh = await LiveSession.findById(session._id);
      if (fresh) {
        fresh.producer = fresh.producer || {};
        fresh.producer.certificatesAutoIssuedAt = now;
        fresh.markModified('producer');
        await fresh.save();
        await sendAutopilotCertAdminSummary(fresh, result);
      }
      console.log(`${LOG} autopilot auto-issued certificates for "${session.title}" (${session._id}) — ${result?.issued?.length || 0} issued`);
    } catch (err) {
      console.error(`${LOG} autopilot auto-cert error on ${session._id}:`, err.message);
    }
  }
}

/* ════════════════════════ AUTOPILOT: D — REMINDERS ════════════════════════ */

/**
 * T-24h / T-1h reminder emails for registrants of published, scheduled
 * live-course sessions. Each threshold stamps producer.remindersSent.{h24,h1}
 * so it never double-sends. Not gated on autopilot — this is a general live
 * session feature (no such reminders existed before).
 */
async function processLiveSessionReminders(now) {
  const nowMs = now.getTime();
  const sessions = await LiveSession.find({
    isPublished: true,
    sessionType: 'live-course',
    status: 'scheduled',
    scheduledStart: { $gte: now, $lte: new Date(nowMs + H24_MS + 60000) }
  });

  for (const session of sessions) {
    try {
      const untilMs = session.scheduledStart.getTime() - nowMs;
      session.producer = session.producer || {};
      const rs = session.producer.remindersSent || {};
      let dirty = false;

      // T-24h: fire the first reminder once inside the 24h window but still
      // more than an hour out (so a late-published session doesn't get both at
      // once, and one under an hour out only gets the T-1h note).
      if (untilMs <= H24_MS && untilMs > H1_MS && !rs.h24) {
        await sendLiveSessionReminders(session, '24h');
        rs.h24 = now;
        dirty = true;
      }
      // T-1h
      if (untilMs <= H1_MS && untilMs > 0 && !rs.h1) {
        await sendLiveSessionReminders(session, '1h');
        rs.h1 = now;
        dirty = true;
      }

      if (dirty) {
        session.producer.remindersSent = rs;
        session.markModified('producer');
        await session.save();
      }
    } catch (err) {
      console.error(`${LOG} reminder error on ${session._id}:`, err.message);
    }
  }
}
