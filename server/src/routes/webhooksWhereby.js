/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 */

/**
 * Whereby Webhook — receives room/recording lifecycle events and writes the
 * verified attendance trail used for NBCC live-CE certificate eligibility.
 *
 * Mounted at /api/webhooks/whereby. Raw body parser applied at the app level
 * in index.js (before express.json), mirroring the Stripe + Resend webhooks,
 * so req.body here is a Buffer.
 *
 * Signature: Whereby signs with a `whereby-signature` header of the form
 *   t=<unix-ts>,v1=<hmac-sha256-hex of "<ts>.<rawBody>">
 * Set WHEREBY_WEBHOOK_SECRET from Dashboard → Configure → Webhooks.
 *
 * Events handled:
 *   room.client.joined   → open an attendance segment
 *   room.client.left     → close the segment, compute durationMin
 *   room.session.ended   → close any dangling segments, mark session completed
 *   recording.finished   → record S3 key on the session
 * Unknown event types are acknowledged (200) and ignored.
 */
import express from 'express';
import crypto from 'crypto';
import LiveSession from '../models/LiveSession.js';
import User from '../models/User.js';

const router = express.Router();
const TOLERANCE_SECONDS = 5 * 60;

function verifyWherebySignature(payload, headers, secret) {
  const header = headers['whereby-signature'];
  if (!header || !secret) return false;

  const parts = Object.fromEntries(
    header.split(',').map(kv => kv.split('=').map(s => s.trim()))
  );
  const ts = parts.t;
  const sig = parts.v1;
  if (!ts || !sig) return false;

  const age = Math.abs(Math.floor(Date.now() / 1000) - parseInt(ts, 10));
  if (Number.isNaN(age) || age > TOLERANCE_SECONDS) return false;

  const expected = crypto
    .createHmac('sha256', secret)
    .update(`${ts}.${payload.toString('utf8')}`)
    .digest('hex');

  try {
    return crypto.timingSafeEqual(Buffer.from(expected, 'hex'), Buffer.from(sig, 'hex'));
  } catch {
    return false;
  }
}

router.post('/', async (req, res) => {
  const secret = process.env.WHEREBY_WEBHOOK_SECRET;
  const raw = Buffer.isBuffer(req.body)
    ? req.body
    : Buffer.from(typeof req.body === 'string' ? req.body : JSON.stringify(req.body || {}));

  if (secret && !verifyWherebySignature(raw, req.headers, secret)) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  let event;
  try {
    event = JSON.parse(raw.toString('utf8'));
  } catch {
    return res.status(400).json({ error: 'Invalid JSON' });
  }

  // Ack fast; process inline (events are small) but never let errors 500 a retry storm
  try {
    await handleEvent(event);
  } catch (err) {
    console.error('[whereby-webhook] handler error:', err.message);
  }
  res.json({ received: true });
});

async function handleEvent(event) {
  const type = event.type;
  const data = event.data || {};
  const meetingId = String(data.meetingId || '');
  if (!meetingId) return;

  const session = await LiveSession.findOne({ 'whereby.meetingId': meetingId });
  if (!session) {
    console.warn(`[whereby-webhook] no LiveSession for meetingId ${meetingId} (${type})`);
    return;
  }

  switch (type) {
    case 'room.client.joined': {
      const displayName = data.displayName || '';
      const user = await matchUser(session, displayName);
      session.attendance.push({
        user: user?._id,
        displayName,
        wherebyParticipantId: data.participantId || data.id || '',
        joinedAt: new Date(event.createdAt || Date.now())
      });
      if (session.status === 'scheduled') session.status = 'live';
      await session.save();
      break;
    }

    case 'room.client.left': {
      const pid = data.participantId || data.id || '';
      const leftAt = new Date(event.createdAt || Date.now());
      // Close the most recent open segment for this participant
      const segment = [...session.attendance]
        .reverse()
        .find(a => !a.leftAt && (pid ? a.wherebyParticipantId === pid : a.displayName === (data.displayName || '')));
      if (segment) {
        segment.leftAt = leftAt;
        segment.durationMin = Math.max(0, Math.round((leftAt - segment.joinedAt) / 60000));
        await session.save();
      }
      break;
    }

    case 'room.session.ended': {
      const endedAt = new Date(event.createdAt || Date.now());
      let dirty = false;
      for (const a of session.attendance) {
        if (!a.leftAt) {
          a.leftAt = endedAt;
          a.durationMin = Math.max(0, Math.round((endedAt - a.joinedAt) / 60000));
          dirty = true;
        }
      }
      if (session.status === 'live') { session.status = 'completed'; dirty = true; }
      if (dirty) await session.save();
      break;
    }

    case 'recording.finished': {
      // Defense in depth: supervision sessions can never persist recordings.
      if (session.sessionType === 'supervision') {
        console.error(`[whereby-webhook] recording.finished on SUPERVISION session ${session._id} — refusing to store. Investigate Whereby room config immediately.`);
        return;
      }
      session.recordings.push({
        s3Key: data.key || data.s3Key || data.fileName || '',
        s3Bucket: data.bucket || process.env.AWS_S3_RECORDINGS_BUCKET,
        durationMin: data.duration ? Math.round(data.duration / 60) : undefined,
        recordedAt: new Date(event.createdAt || Date.now()),
        status: 'ready',
        replayEnabled: false // admin flips this on after review
      });
      await session.save();
      break;
    }

    default:
      break; // acknowledged, ignored
  }
}

/**
 * Match a Whereby participant back to a registered user by display name.
 * /join injects "FirstName LastName" (or email) as displayName, so this is
 * deterministic for participants who entered through our gated flow.
 */
async function matchUser(session, displayName) {
  if (!displayName) return null;
  const registrantIds = session.registrants.map(r => r.user);
  const candidates = await User.find({ _id: { $in: registrantIds } })
    .select('email profile.firstName profile.lastName');

  const norm = s => (s || '').trim().toLowerCase();
  const target = norm(displayName);

  return candidates.find(u => {
    const full = norm(`${u.profile?.firstName || ''} ${u.profile?.lastName || ''}`);
    return full === target || norm(u.email) === target;
  }) || null;
}

export default router;
