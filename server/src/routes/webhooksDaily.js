/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 *
 * Daily Webhook — receives room lifecycle events for live-course sessions.
 * Mounted at /api/webhooks/daily. Raw body parser applied in index.js.
 * Signature header: x-daily-signature (HMAC-SHA256, same format as Whereby).
 * Set DAILY_WEBHOOK_SECRET from the hmac returned when registering the webhook.
 *
 * Events: participant.joined, participant.left, meeting.ended, recording.ready-to-download
 */

import express from 'express';
import crypto from 'crypto';
import LiveSession from '../models/LiveSession.js';
import User from '../models/User.js';
import {
  onClientLeft,
  onSessionEnded,
  onRecordingFinished
} from '../services/sessionProducer.js';

const router = express.Router();
const TOLERANCE_SECONDS = 5 * 60;

function verifyDailySignature(payload, headers, secret) {
  const header = headers['x-daily-signature'];
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
  const secret = process.env.DAILY_WEBHOOK_SECRET;
  const raw = Buffer.isBuffer(req.body)
    ? req.body
    : Buffer.from(typeof req.body === 'string' ? req.body : JSON.stringify(req.body || {}));

  if (secret && !verifyDailySignature(raw, req.headers, secret)) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  let event;
  try {
    event = JSON.parse(raw.toString('utf8'));
  } catch {
    return res.status(400).json({ error: 'Invalid JSON' });
  }

  try {
    await handleEvent(event);
  } catch (err) {
    console.error('[daily-webhook] handler error:', err.message);
  }
  res.json({ received: true });
});

async function handleEvent(event) {
  const type = event.action || event.type;
  const data = event.payload || {};
  const roomName = String(data.room || '');
  if (!roomName) return;

  const session = await LiveSession.findOne({ 'whereby.roomName': roomName });
  if (!session) {
    console.warn(`[daily-webhook] no LiveSession for roomName ${roomName} (${type})`);
    return;
  }

  if (session.sessionType === 'supervision') {
    console.error(`[daily-webhook] received event for SUPERVISION session ${session._id} — Daily should never be used for supervision. Investigate.`);
    return;
  }

  switch (type) {
    case 'participant.joined': {
      const displayName = data.user_name || '';
      const participantId = data.session_id || '';
      const user = await matchUser(session, displayName);
      session.attendance.push({
        user: user?._id,
        displayName,
        wherebyParticipantId: participantId,
        joinedAt: new Date(event.event_ts ? event.event_ts * 1000 : Date.now())
      });
      if (session.status === 'scheduled') session.status = 'live';
      await session.save();
      break;
    }

    case 'participant.left': {
      const participantId = data.session_id || '';
      const displayName = data.user_name || '';
      const leftAt = new Date(event.event_ts ? event.event_ts * 1000 : Date.now());
      const segment = [...session.attendance]
        .reverse()
        .find(a => !a.leftAt && (
          participantId
            ? a.wherebyParticipantId === participantId
            : a.displayName === displayName
        ));
      if (segment) {
        segment.leftAt = leftAt;
        segment.durationMin = Math.max(0, Math.round((leftAt - segment.joinedAt) / 60000));
        await session.save();
        onClientLeft(session, segment);
      }
      break;
    }

    case 'meeting.ended': {
      const endedAt = new Date(event.event_ts ? event.event_ts * 1000 : Date.now());
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
      onSessionEnded(session);
      break;
    }

    case 'recording.ready-to-download': {
      const s3Key = data.s3key || data.key || '';
      session.recordings.push({
        s3Key,
        s3Bucket: data.bucket || process.env.AWS_S3_RECORDINGS_BUCKET,
        durationMin: data.duration_seconds ? Math.round(data.duration_seconds / 60) : undefined,
        recordedAt: new Date(event.event_ts ? event.event_ts * 1000 : Date.now()),
        status: 'ready',
        replayEnabled: false
      });
      await session.save();
      await onRecordingFinished(session);
      break;
    }

    default:
      break;
  }
}

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
