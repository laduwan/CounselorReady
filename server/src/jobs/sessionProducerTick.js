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
 *   4. Break transitions — record autopilot break windows into session.breaks[]
 *   5. Wrap-up dispatch — post-session email pipeline (≥5 min after end)
 *   6. Runaway failsafe — live sessions past scheduledEnd + 30 min are force-completed
 */

import LiveSession from '../models/LiveSession.js';
import {
  processDropDetection,
  processBreakReminders,
  processBreakageDetection,
  processBreakTransitions,
  processCheckins,
  runWrapUp,
  closeDanglingSegments
} from '../services/sessionProducer.js';

const LOG = '[ProducerTick]';

export async function runSessionProducerTick() {
  const now = new Date();
  const thirtyMinAgo = new Date(now.getTime() - 30 * 60000);

  let sessions;
  try {
    sessions = await LiveSession.find({
      $or: [
        { status: 'live' },
        { status: 'completed', updatedAt: { $gte: thirtyMinAgo }, 'producer.wrapUpSentAt': { $exists: false } }
      ]
    });
  } catch (err) {
    console.error(`${LOG} query error:`, err.message);
    return;
  }

  if (sessions.length === 0) return;

  for (const session of sessions) {
    try {
      // Runaway failsafe: a 'live' session whose room never fired
      // room.session.ended (Whereby webhook dropped, host closed the tab, etc.)
      // is force-completed 30 min past its scheduledEnd. Dangling attendance
      // segments are closed at scheduledEnd via the same logic the webhook uses,
      // so the NBCC attendance denominator isn't inflated by the overrun.
      if (
        session.status === 'live' &&
        session.scheduledEnd &&
        now.getTime() > session.scheduledEnd.getTime() + 30 * 60000
      ) {
        closeDanglingSegments(session, session.scheduledEnd);
        session.status = 'completed';
        await session.save();
        continue; // no longer live — wrap-up runs on a later tick
      }

      if (session.status === 'live') {
        await processDropDetection(session);
        await processBreakReminders(session);
        await processBreakageDetection(session);
        await processCheckins(session);
        // Autopilot break transitions — keep session.breaks[] the source of
        // truth so attendedMinutesAdjusted excludes every break window.
        await processBreakTransitions(session);
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
}
