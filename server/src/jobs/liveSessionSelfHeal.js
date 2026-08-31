/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 */

/**
 * Live Session Self-Heal Cron Job
 *
 * Finds LiveSession documents stuck in status 'scheduled' or 'live' whose
 * scheduledEnd passed 2+ hours ago — meaning the Whereby room.session.ended
 * webhook never fired (network blip, Whereby outage, or the room simply
 * never started). Left alone, these sessions keep matching the
 * sessionProducerTick.js query on every run, so every registrant keeps
 * being evaluated for drop-detection / break-reminder / wrap-up dispatch
 * indefinitely.
 *
 * For each stuck session this job:
 *   1. Closes any still-open attendance segments at scheduledEnd
 *   2. Marks the session 'completed'
 *   3. Marks producer.wrapUpSentAt so the next producer tick does not treat
 *      this as a freshly-completed session and fire a late wrap-up email
 *      pipeline against data (transcript/recording) that likely never
 *      finished processing for an orphaned session
 *
 * Scheduled via node-cron every 6 hours, alongside certificateSelfHeal.js.
 */

import LiveSession from '../models/LiveSession.js';

const LOG = '[LiveSessionSelfHeal]';
const STUCK_AFTER_MS = 2 * 60 * 60000; // 2 hours past scheduledEnd

/**
 * Main self-heal runner. Called by the cron schedule.
 * Returns stats object for logging.
 */
export async function runLiveSessionSelfHeal() {
  console.log(`${LOG} Starting stuck live-session scan...`);

  const stats = {
    scanned: 0,
    healed: 0,
    errors: 0
  };

  const cutoff = new Date(Date.now() - STUCK_AFTER_MS);

  let stuckSessions;
  try {
    stuckSessions = await LiveSession.find({
      status: { $in: ['scheduled', 'live'] },
      scheduledEnd: { $lte: cutoff }
    });
  } catch (err) {
    console.error(`${LOG} query error:`, err.message);
    stats.errors++;
    return stats;
  }

  stats.scanned = stuckSessions.length;
  console.log(`${LOG} Found ${stats.scanned} stuck session(s)`);

  if (stats.scanned === 0) {
    console.log(`${LOG} Nothing to heal.`);
    return stats;
  }

  for (const session of stuckSessions) {
    try {
      await healOne(session, stats);
    } catch (err) {
      console.error(`${LOG} Unhandled error healing session ${session._id}:`, err.message);
      stats.errors++;
    }
  }

  console.log(`${LOG} Complete:`, stats);
  return stats;
}

/**
 * Heal a single stuck session.
 * @param {Object} session - a live LiveSession document
 * @param {Object} stats - shared stats counter (mutated)
 */
async function healOne(session, stats) {
  const previousStatus = session.status;
  const endedAt = session.scheduledEnd;

  for (const a of session.attendance) {
    if (!a.leftAt) {
      a.leftAt = endedAt;
      a.durationMin = Math.max(0, Math.round((endedAt - a.joinedAt) / 60000));
    }
  }

  session.status = 'completed';
  session.producer = session.producer || {};
  session.producer.wrapUpSentAt = session.producer.wrapUpSentAt || new Date();

  await session.save();

  console.warn(
    `${LOG} Closed stuck session ${session._id} ("${session.title}") — was '${previousStatus}', scheduledEnd ${endedAt.toISOString()}, no room.session.ended webhook received.`
  );
  stats.healed++;
}
