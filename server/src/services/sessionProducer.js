/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 */

/**
 * sessionProducer — event handlers called from webhooksWhereby.js and
 * the sessionProducerTick cron. All state is persisted on the LiveSession
 * document; no in-memory timers (Render restarts kill them).
 *
 * COMPLIANCE LOCKS:
 *   - Supervision sessions: logistics (rejoin links, break reminders) only.
 *     No transcription, AI summaries, catch-up, recordings, or handouts.
 *   - Catch-up content never counts toward certificate eligibility.
 *   - Break minutes are excluded from the NBCC attendance denominator
 *     (handled in LiveSession.attendedMinutesAdjusted / instructionalMinutes).
 *   - Room links always go through live-room.html?session=<slug>, never
 *     the raw Whereby URL.
 */

import { Resend } from 'resend';
import Anthropic from '@anthropic-ai/sdk';
import LiveSession from '../models/LiveSession.js';
import User from '../models/User.js';

const resend = new Resend(process.env.RESEND_API_KEY);
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const FROM = 'CounselorReady <noreply@counselorready.com>';
const SITE = process.env.SITE_URL || 'https://counselorready.com';

// Only send SMS if the env flag is explicitly enabled; default false (Phase 2 decision pending)
const SMS_ENABLED = process.env.SMS_SESSION_LOGISTICS_ENABLED === 'true';

// ─── Twilio (lazy-loaded so server still starts without TWILIO_* vars) ────────
let twilioClient = null;
async function getTwilio() {
  if (!SMS_ENABLED) return null;
  if (twilioClient) return twilioClient;
  const { default: twilio } = await import('twilio');
  twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  return twilioClient;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** True if the given Date falls inside any declared break window. */
function insideBreakWindow(session, when) {
  return (session.breaks || []).some(b => {
    const start = b.startsAt.getTime();
    const end = start + b.durationMin * 60000;
    const t = (when instanceof Date ? when : new Date(when)).getTime();
    return t >= start && t < end;
  });
}

/** Room URL that goes through our gated page — never the raw Whereby URL. */
function gatedRoomUrl(session) {
  return `${SITE}/live-room.html?session=${encodeURIComponent(session.slug)}`;
}

/** Replay deep-link with optional seek offset. */
function replayDeepLink(session, offsetSec) {
  const base = `${SITE}/live-room.html?session=${encodeURIComponent(session.slug)}&replay=1`;
  return offsetSec != null ? `${base}&t=${Math.round(offsetSec)}` : base;
}

/**
 * Gap segments for a user: pairs where leftAt is followed by a later joinedAt,
 * plus a trailing gap from last leftAt to scheduledEnd (if early leave).
 * Gaps inside declared break windows are excluded.
 * @returns {Array<{leftAt: Date, nextJoinAt: Date|null, gapMin: number, offsetSec: number}>}
 */
export function computeGaps(session, userId) {
  const segments = session.attendance
    .filter(a => a.user && a.user.toString() === userId.toString() && a.joinedAt && a.leftAt)
    .sort((a, b) => a.joinedAt - b.joinedAt);

  if (segments.length === 0) return [];

  const gaps = [];
  const sessionStart = session.scheduledStart.getTime();
  const sessionEnd = session.scheduledEnd.getTime();

  for (let i = 0; i < segments.length - 1; i++) {
    const left = segments[i].leftAt;
    const next = segments[i + 1].joinedAt;
    const gapMin = Math.round((next - left) / 60000);
    if (gapMin >= 3 && !insideBreakWindow(session, left)) {
      gaps.push({
        leftAt: left,
        nextJoinAt: next,
        gapMin,
        offsetSec: Math.round((left.getTime() - sessionStart) / 1000)
      });
    }
  }

  // Trailing gap: last leftAt to scheduledEnd
  const last = segments[segments.length - 1];
  if (last.leftAt.getTime() < sessionEnd) {
    const gapMin = Math.round((sessionEnd - last.leftAt.getTime()) / 60000);
    if (gapMin >= 3 && !insideBreakWindow(session, last.leftAt)) {
      gaps.push({
        leftAt: last.leftAt,
        nextJoinAt: null,
        gapMin,
        offsetSec: Math.round((last.leftAt.getTime() - sessionStart) / 1000)
      });
    }
  }

  return gaps;
}

// ─── Email helpers ─────────────────────────────────────────────────────────────

async function sendEmail({ to, subject, html }) {
  try {
    await resend.emails.send({ from: FROM, to, subject, html });
  } catch (err) {
    console.error('[sessionProducer] email error:', err.message);
  }
}

async function sendSms(to, body) {
  if (!SMS_ENABLED) return;
  try {
    const client = getTwilio();
    if (!client) return;
    await client.messages.create({
      from: process.env.TWILIO_FROM_NUMBER,
      to,
      body
    });
  } catch (err) {
    console.error('[sessionProducer] SMS error:', err.message);
  }
}

function emailShell(bodyHtml) {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8">
<style>
  body{font-family:'Lato',sans-serif;background:#F8F7F4;margin:0;padding:0;}
  .wrap{max-width:600px;margin:32px auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #EDE9E3;}
  .hdr{background:linear-gradient(135deg,#8B2542,#6B1D34);padding:28px 32px;}
  .hdr h1{color:#fff;font-family:'Cormorant Garamond',Georgia,serif;font-size:22px;margin:0;}
  .body{padding:28px 32px;color:#284157;font-size:15px;line-height:1.6;}
  .btn{display:inline-block;background:#6B1D34;color:#fff !important;text-decoration:none;padding:12px 28px;border-radius:8px;font-weight:700;margin:16px 0;}
  .footer{padding:16px 32px;font-size:12px;color:#78716c;border-top:1px solid #EDE9E3;}
</style></head><body>
<div class="wrap">
  <div class="hdr"><h1>CounselorReady</h1></div>
  <div class="body">${bodyHtml}</div>
  <div class="footer">GA Integrated Therapeutic Perspectives, LLC · NBCC ACEP #7760</div>
</div></body></html>`;
}

// ─── Email templates ───────────────────────────────────────────────────────────

function rejoinNudgeHtml(session, firstName) {
  return emailShell(`
    <p>Hi ${esc(firstName)},</p>
    <p>It looks like you got disconnected from <strong>${esc(session.title)}</strong>. The session is still in progress — rejoin whenever you're ready.</p>
    <a class="btn" href="${gatedRoomUrl(session)}">Rejoin the Session</a>
    <p style="font-size:13px;color:#57534e;">If you had technical difficulties, please contact support@counselorready.com.</p>
  `);
}

function breakResumeHtml(session, breakLabel, resumeTime) {
  return emailShell(`
    <p><strong>${esc(breakLabel)}</strong> ends at <strong>${resumeTime}</strong>.</p>
    <p>Click below to rejoin <strong>${esc(session.title)}</strong> when you're ready.</p>
    <a class="btn" href="${gatedRoomUrl(session)}">Rejoin for the Next Segment</a>
  `);
}

function incidentBroadcastHtml(session) {
  return emailShell(`
    <p>Hi there,</p>
    <p>We're experiencing brief technical difficulties during <strong>${esc(session.title)}</strong>. Please hold tight — we're working to restore the session.</p>
    <p>Use the link below to rejoin as soon as the room is back:</p>
    <a class="btn" href="${gatedRoomUrl(session)}">Rejoin the Session</a>
    <p style="font-size:13px;color:#57534e;">We apologize for the interruption.</p>
  `);
}

function catchupBlockHtml(gaps, session) {
  if (!gaps || gaps.length === 0) return '';
  let html = `<div style="background:#F8F7F4;border:1px solid #EDE9E3;border-radius:8px;padding:16px;margin:16px 0;">
    <h3 style="margin:0 0 8px;color:#6B1D34;font-size:15px;">Your Personalized Catch-Up</h3>`;
  for (const gap of gaps) {
    const time = gap.leftAt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: 'America/New_York' });
    html += `<div style="margin-bottom:12px;padding-bottom:12px;border-bottom:1px solid #EDE9E3;">
      <p style="font-size:13px;color:#57534e;margin:0 0 6px;">You were away ~${gap.gapMin} min starting around ${time} ET</p>`;
    if (gap.summary) {
      html += `<ul style="margin:0 0 6px;padding-left:18px;font-size:14px;color:#284157;">`;
      for (const bullet of gap.summary) {
        html += `<li>${esc(bullet)}</li>`;
      }
      html += `</ul>`;
    }
    html += `<a href="${replayDeepLink(session, gap.offsetSec)}" style="font-size:13px;color:#4A7C59;">▶ Watch this segment in the replay</a>
    </div>`;
  }
  html += `</div>`;
  return html;
}

function wrapUpHtml(session, user, gaps, handouts, replayUrl) {
  const firstName = user.profile?.firstName || 'there';
  const gapBlock = catchupBlockHtml(gaps, session);

  let handoutsHtml = '';
  if (handouts && handouts.length > 0) {
    handoutsHtml = `<p><strong>Handouts:</strong></p><ul style="padding-left:18px;">`;
    for (const h of handouts) {
      handoutsHtml += `<li><a href="${SITE}/live-room.html?session=${esc(session.slug)}" style="color:#4A7C59;">${esc(h.title)}</a></li>`;
    }
    handoutsHtml += `</ul>`;
  }

  const replayHtml = replayUrl
    ? `<p>The <strong>replay</strong> is available — <a href="${replayDeepLink(session)}" style="color:#4A7C59;">watch it here</a>.</p>`
    : `<p>The replay is being processed and will be available shortly. We'll send you a follow-up email when it's ready.</p>`;

  return emailShell(`
    <p>Hi ${esc(firstName)},</p>
    <p>Thank you for attending <strong>${esc(session.title)}</strong>! We're glad you joined us.</p>
    ${gapBlock}
    ${handoutsHtml}
    ${replayHtml}
    <p>Your CE certificate (${session.ceuHours} hours) will be issued within 24 hours to eligible participants. You'll receive a separate email when it's ready.</p>
    <p style="font-size:13px;color:#57534e;">CE credit is based on verified live attendance minutes and cannot be earned through replay or catch-up content.</p>
  `);
}

function missedSessionHtml(session, user, replayEnabled) {
  const firstName = user.profile?.firstName || 'there';
  return emailShell(`
    <p>Hi ${esc(firstName)},</p>
    <p>We missed you at <strong>${esc(session.title)}</strong>.</p>
    ${replayEnabled ? `<p>Good news — a replay is available for registered participants: <a href="${replayDeepLink(session)}" style="color:#4A7C59;">Watch the replay</a>.</p>` : ''}
    <p>Keep an eye on our upcoming sessions for another opportunity to earn CE credit live.</p>
  `);
}

function replayReadyHtml(session, user) {
  const firstName = user.profile?.firstName || 'there';
  return emailShell(`
    <p>Hi ${esc(firstName)},</p>
    <p>The replay for <strong>${esc(session.title)}</strong> is now available.</p>
    <a class="btn" href="${replayDeepLink(session)}">Watch the Replay</a>
    <p style="font-size:13px;color:#57534e;">Replay viewing does not count toward CE credit.</p>
  `);
}

function esc(s) {
  return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ─── Event handlers (called from webhooksWhereby.js) ──────────────────────────

/**
 * Called when a participant leaves mid-session.
 * Drop detection relies entirely on the cron tick — no in-memory timers.
 */
export function onClientLeft(session, segment) {
  // No-op here: drop detection runs in the cron tick every minute.
  // Supervision sessions still get no content processing.
}

/**
 * Called when room.session.ended fires.
 * The wrap-up pipeline is deferred to the cron tick (≥5 min after ended),
 * giving recording/transcription webhooks time to land.
 * For supervision sessions: no wrap-up content; this is a no-op.
 */
export function onSessionEnded(session) {
  // No-op: cron tick handles wrap-up dispatch.
}

/**
 * Called when recording.finished fires (live-course only).
 * If wrap-up was already sent without a replay link, email registrants
 * that the replay is now available.
 */
export async function onRecordingFinished(session) {
  if (session.sessionType === 'supervision') return; // hard-lock
  if (!session.producer?.wrapUpSentAt) return; // wrap-up not sent yet — wrap-up email will include replay link

  // Wrap-up was already sent without a replay — send follow-up
  const registrantIds = session.registrants.map(r => r.user);
  const users = await User.find({ _id: { $in: registrantIds } }).select('email profile');
  for (const user of users) {
    const attended = session.attendance.some(
      a => a.user && a.user.toString() === user._id.toString()
    );
    if (!attended) continue;
    await sendEmail({
      to: user.email,
      subject: `Replay ready: ${session.title}`,
      html: replayReadyHtml(session, user)
    });
  }
}

/**
 * Called when transcription.finished fires.
 * Live-course only — supervision is refused and logged.
 */
export async function onTranscriptionFinished(session, s3Key) {
  if (session.sessionType === 'supervision') {
    console.error(`[sessionProducer] transcription.finished on SUPERVISION session ${session._id} — refusing to store. Investigate Whereby config immediately.`);
    return;
  }
  session.producer = session.producer || {};
  session.producer.transcriptS3Key = s3Key;
  await session.save();

  // Catch-up follow-up: only meaningful once the wrap-up email already went out
  // (the wrap-up itself includes summaries when a transcript was present at that
  // time). If wrap-up ran before transcription completed, fill the gaps now and
  // send a concise "your catch-up summary is ready" follow-up. Idempotent via
  // producer.catchupFollowupSentAt. Mirrors onRecordingFinished's replay follow-up.
  if (!session.producer.wrapUpSentAt || session.producer.catchupFollowupSentAt) return;

  const registrantIds = session.registrants.map(r => r.user);
  const users = await User.find({ _id: { $in: registrantIds } }).select('email profile');
  for (const user of users) {
    const userId = user._id.toString();
    const attended = session.attendance.some(
      a => a.user && a.user.toString() === userId && a.joinedAt
    );
    if (!attended) continue;

    const gaps = computeGaps(session, userId);
    if (gaps.length === 0) continue;

    await populateCatchupSummaries(session, userId, gaps);

    const firstName = user.profile?.firstName || 'there';
    await sendEmail({
      to: user.email,
      subject: `Your catch-up summary is ready: ${session.title}`,
      html: emailShell(`
        <p>Hi ${esc(firstName)},</p>
        <p>Your personalized catch-up summary for <strong>${esc(session.title)}</strong> is ready.</p>
        ${catchupBlockHtml(gaps, session)}
        <p style="font-size:13px;color:#57534e;">Catch-up content does not count toward CE credit.</p>
      `)
    });
  }

  session.producer.catchupFollowupSentAt = new Date();
  await session.save();
}

// ─── Wrap-up pipeline ─────────────────────────────────────────────────────────

/**
 * Run the post-session wrap-up for a completed live-course session.
 * Idempotent: checks producer.wrapUpSentAt before doing anything.
 */
export async function runWrapUp(session) {
  if (session.sessionType === 'supervision') return; // hard-lock
  if (session.producer?.wrapUpSentAt) return;        // already ran

  const registrantIds = session.registrants.map(r => r.user);
  const users = await User.find({ _id: { $in: registrantIds } }).select('email profile');

  const hasReplay = session.recordings.some(r => r.replayEnabled && r.status === 'ready');
  const handouts = (session.handouts || []).filter(h => h.availability === 'after' || h.availability === 'during');

  for (const user of users) {
    const userId = user._id.toString();
    const userAttended = session.attendance.some(
      a => a.user && a.user.toString() === userId && a.joinedAt
    );

    if (!userAttended) {
      // Never-joined registrant
      const replayEnabled = hasReplay && session.recordingEnabled;
      await sendEmail({
        to: user.email,
        subject: `We missed you — ${session.title}`,
        html: missedSessionHtml(session, user, replayEnabled)
      });
      continue;
    }

    // Compute gaps for this user
    const gaps = computeGaps(session, userId);

    // Attempt AI summaries if transcript is available
    if (session.producer?.transcriptS3Key && gaps.length > 0) {
      await populateCatchupSummaries(session, userId, gaps);
    }

    await sendEmail({
      to: user.email,
      subject: `Thank you for attending: ${session.title}`,
      html: wrapUpHtml(session, user, gaps, handouts, hasReplay ? true : null)
    });
  }

  session.producer = session.producer || {};
  session.producer.wrapUpSentAt = new Date();
  await session.save();
}

// ─── AI catch-up summaries (Tier 2, live-course + transcript only) ─────────────

/**
 * For each gap that doesn't yet have a cached summary, slice the transcript
 * by wall-clock window and call Haiku to produce 3–5 bullet points.
 * Results cached on the attendance segment as catchupSummary.
 *
 * Transcript format assumption: segments have a `start` field in seconds
 * relative to recording start ≈ scheduledStart. Document this offset here:
 * offset = segment.start → wall-clock = scheduledStart + segment.start seconds.
 *
 * NOTE: Whereby transcription API shape is unverified (open question in spec).
 * This function is guarded by `transcriptS3Key` presence; it degrades
 * gracefully if the transcript is absent or malformed.
 */
async function populateCatchupSummaries(session, userId, gaps) {
  let transcript = null;
  try {
    const { S3Client, GetObjectCommand } = await import('@aws-sdk/client-s3');
    const s3 = new S3Client({ region: process.env.AWS_REGION || 'us-east-1' });
    const cmd = new GetObjectCommand({
      Bucket: process.env.AWS_S3_RECORDINGS_BUCKET,
      Key: session.producer.transcriptS3Key
    });
    const resp = await s3.send(cmd);
    const chunks = [];
    for await (const chunk of resp.Body) chunks.push(chunk);
    transcript = JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch (err) {
    console.warn('[sessionProducer] transcript load failed (non-fatal):', err.message);
    return;
  }

  const sessionStartMs = session.scheduledStart.getTime();

  for (const gap of gaps) {
    // Check cache on attendance segment
    const segment = session.attendance.find(
      a => a.user && a.user.toString() === userId &&
           a.leftAt && Math.abs(a.leftAt.getTime() - gap.leftAt.getTime()) < 5000
    );
    if (segment?.catchupSummary) {
      gap.summary = JSON.parse(segment.catchupSummary);
      continue;
    }

    // Slice transcript by gap window (seconds relative to session start)
    const gapStartSec = (gap.leftAt.getTime() - sessionStartMs) / 1000;
    const gapEndSec = gap.nextJoinAt
      ? (gap.nextJoinAt.getTime() - sessionStartMs) / 1000
      : (session.scheduledEnd.getTime() - sessionStartMs) / 1000;

    const segments = Array.isArray(transcript?.segments)
      ? transcript.segments
      : Array.isArray(transcript?.words)
        ? transcript.words
        : [];

    const slice = segments
      .filter(s => s.start >= gapStartSec && s.start < gapEndSec)
      .map(s => s.text || s.word || '')
      .join(' ')
      .trim();

    if (!slice) continue;

    try {
      const msg = await anthropic.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 512,
        system: 'Summarize what a CE webinar attendee missed during this segment in 3–5 plain-language bullets. Facts from the transcript only; no speculation; no clinical advice.',
        messages: [{ role: 'user', content: slice }]
      });
      const text = msg.content?.[0]?.text || '';
      const bullets = text.split('\n').filter(l => l.trim().startsWith('-') || l.trim().match(/^\d+\./)).map(l => l.replace(/^[-\d.)\s]+/, '').trim()).filter(Boolean);
      if (bullets.length > 0) {
        gap.summary = bullets;
        if (segment) {
          segment.catchupSummary = JSON.stringify(bullets);
        }
      }
    } catch (err) {
      console.warn('[sessionProducer] AI summary error (non-fatal):', err.message);
    }
  }

  await session.save();
}

// ─── Shared attendance close-out (webhook + failsafe) ─────────────────────────

/**
 * Close any still-open attendance segments at `endedAt`, computing durationMin
 * exactly the way the room.session.ended webhook handler does. Mutates the
 * session in place and returns true if any segment was closed; the CALLER is
 * responsible for saving. Extracted so the runaway-session failsafe in the cron
 * tick can reuse it rather than duplicating the loop.
 */
export function closeDanglingSegments(session, endedAt) {
  let dirty = false;
  for (const a of session.attendance) {
    if (!a.leftAt) {
      a.leftAt = endedAt;
      a.durationMin = Math.max(0, Math.round((endedAt - a.joinedAt) / 60000));
      dirty = true;
    }
  }
  return dirty;
}

// ─── Cron tick actions (called from sessionProducerTick.js) ───────────────────

/**
 * Break-segment transitions for the autopilot clock.
 *
 * Break segments in the agenda participate in the autopilot clock like any
 * other segment. Their windows are computed off scheduledStart + the cumulative
 * durations of every preceding segment (breaks included). When the clock has
 * advanced INTO a break window, we append that window to session.breaks[] so the
 * NBCC attendance denominator (attendedMinutesAdjusted / instructionalMinutes)
 * stays correct. Advancing OUT of a break needs no action.
 *
 * Idempotent across ticks: a break is only appended if no overlapping entry
 * already exists, so re-running the tick never double-records the same break.
 */
export async function processBreakTransitions(session) {
  const agenda = session.agenda || [];
  if (agenda.length === 0 || !session.scheduledStart) return false;

  const now = Date.now();
  const sorted = [...agenda].sort((a, b) => (a.order || 0) - (b.order || 0));

  let cursor = session.scheduledStart.getTime();
  let dirty = false;

  for (const seg of sorted) {
    const durMin = seg.durationMin || 0;
    const segStart = cursor;
    const segEnd = cursor + durMin * 60000;
    cursor = segEnd;

    if (seg.type !== 'break' || durMin <= 0) continue;
    if (now < segStart) continue; // autopilot clock hasn't reached this break yet

    // Idempotent: skip if an existing break entry overlaps this window
    const overlaps = (session.breaks || []).some(b => {
      const bStart = b.startsAt.getTime();
      const bEnd = bStart + b.durationMin * 60000;
      return bStart < segEnd && bEnd > segStart;
    });
    if (overlaps) continue;

    session.breaks.push({
      label: seg.title || 'Break',
      startsAt: new Date(segStart),
      durationMin: durMin
    });
    dirty = true;
  }

  if (dirty) await session.save();
  return dirty;
}

/**
 * Drop detection for a single live session.
 * Sends a rejoin email (and optional SMS) to users whose most recent
 * segment closed 3–10 minutes ago with no newer segment.
 */
export async function processDropDetection(session) {
  const now = Date.now();
  const isDirty = { val: false };

  // Group attendance by user, keep only the most recent segment per user
  const latest = new Map();
  for (const a of session.attendance) {
    const uid = a.user ? a.user.toString() : null;
    if (!uid) continue;
    const prev = latest.get(uid);
    if (!prev || a.joinedAt > prev.joinedAt) latest.set(uid, a);
  }

  for (const [userId, seg] of latest) {
    if (!seg.leftAt) continue; // still open — not dropped
    if (seg.rejoinNudgeSentAt) continue; // already nudged for this gap
    const ageMs = now - seg.leftAt.getTime();
    if (ageMs < 3 * 60000 || ageMs > 10 * 60000) continue; // outside 3–10 min window
    if (now >= session.scheduledEnd.getTime()) continue; // session over
    if (insideBreakWindow(session, new Date(now))) continue;

    const user = await User.findById(userId).select('email profile phone');
    if (!user) continue;

    const firstName = user.profile?.firstName || 'there';
    await sendEmail({
      to: user.email,
      subject: `Did you get disconnected? — ${session.title}`,
      html: rejoinNudgeHtml(session, firstName)
    });

    const reg = session.registrants.find(r => r.user && r.user.toString() === userId);
    if (reg?.phoneOptIn && user.phone) {
      await sendSms(user.phone, `Hi ${firstName}, it looks like you got disconnected from "${session.title}". Rejoin here: ${gatedRoomUrl(session)}`);
    }

    seg.rejoinNudgeSentAt = new Date();
    isDirty.val = true;
  }

  if (isDirty.val) await session.save();
}

/**
 * Break resume reminders for a single live session.
 */
export async function processBreakReminders(session) {
  const now = Date.now();
  let dirty = false;

  for (const br of (session.breaks || [])) {
    if (br.resumeReminderSentAt) continue;
    const resumeTime = br.startsAt.getTime() + br.durationMin * 60000;
    const timeUntilResume = resumeTime - now;
    if (timeUntilResume < 0 || timeUntilResume > 3 * 60000) continue; // only 3 min before resume

    const resumeTimeStr = new Date(resumeTime).toLocaleTimeString('en-US', {
      hour: 'numeric', minute: '2-digit', timeZone: session.timezone || 'America/New_York'
    });

    const registrantIds = session.registrants.map(r => r.user);
    const users = await User.find({ _id: { $in: registrantIds } }).select('email profile phone');

    for (const user of users) {
      await sendEmail({
        to: user.email,
        subject: `${br.label || 'Break'} ending soon — ${session.title}`,
        html: breakResumeHtml(session, br.label || 'Break', resumeTimeStr)
      });
      const reg = session.registrants.find(r => r.user && r.user.toString() === user._id.toString());
      if (reg?.phoneOptIn && user.phone) {
        await sendSms(user.phone, `${br.label || 'Break'} ends at ${resumeTimeStr}. Rejoin "${session.title}": ${gatedRoomUrl(session)}`);
      }
    }

    br.resumeReminderSentAt = new Date();
    dirty = true;
  }

  if (dirty) await session.save();
}

/**
 * Breakage detection for a single live session.
 * If >50% of currently-open segments closed within the same 2-min window
 * and no incident broadcast has been sent, broadcast to all registrants.
 */
export async function processBreakageDetection(session) {
  if (session.producer?.incidentBroadcastAt) return;

  const now = Date.now();
  const twoMinAgo = now - 2 * 60000;

  // Count recently-closed segments (closed in the last 2 min)
  const recentlyClosed = session.attendance.filter(
    a => a.leftAt && a.leftAt.getTime() >= twoMinAgo && a.leftAt.getTime() <= now
  );

  // Count open segments (no leftAt)
  const openCount = session.attendance.filter(a => !a.leftAt).length;
  const totalActive = recentlyClosed.length + openCount;

  if (totalActive < 2) return; // need at least 2 participants to detect a mass drop
  if (recentlyClosed.length / totalActive <= 0.5) return;

  // Broadcast incident
  const registrantIds = session.registrants.map(r => r.user);
  const users = await User.find({ _id: { $in: registrantIds } }).select('email profile');
  for (const user of users) {
    await sendEmail({
      to: user.email,
      subject: `Technical difficulties — ${session.title}`,
      html: incidentBroadcastHtml(session)
    });
  }

  // Notify admin via existing service (import inline to avoid circular dep risk)
  try {
    const { notifyAdmin } = await import('./adminNotificationService.js');
    await notifyAdmin({
      type: 'LIVE_SESSION_INCIDENT',
      message: `Mass drop detected on live session "${session.title}" (${session._id}). ${recentlyClosed.length} of ${totalActive} active participants dropped within 2 minutes.`,
      sessionId: session._id
    });
  } catch {
    console.error('[sessionProducer] Admin notification failed for incident on session', session._id);
  }

  session.producer = session.producer || {};
  session.producer.incidentBroadcastAt = new Date();
  await session.save();
}

const CHECKIN_WINDOW_MIN = 3;
const CHECKIN_MIN_GAP_MIN = 15;
const CHECKIN_MAX_GAP_MIN = 20;

function randomNextCheckinDueAt(from) {
  const gapMin = CHECKIN_MIN_GAP_MIN + Math.random() * (CHECKIN_MAX_GAP_MIN - CHECKIN_MIN_GAP_MIN);
  return new Date(from.getTime() + gapMin * 60000);
}

/**
 * Random presence check-ins for camera-off attendees on live-course sessions.
 * Fires a challenge every 15–20 min; a missed 3-min window is a strike,
 * second consecutive strike removes the attendee (client redirect on poll).
 */
export async function processCheckins(session) {
  if (session.sessionType !== 'live-course') return; // no camera-off mechanic on supervision
  const now = new Date();
  let changed = false;

  for (const att of session.attendance) {
    if (att.leftAt || !att.cameraOptOut || att.removedForMissedCheckins) continue;

    const lastCheckin = att.checkins[att.checkins.length - 1];
    const hasPendingUnanswered = lastCheckin && !lastCheckin.respondedAt && !lastCheckin.missed;

    if (hasPendingUnanswered) {
      if (now > lastCheckin.deadline) {
        lastCheckin.missed = true;
        att.consecutiveMissedCheckins = (att.consecutiveMissedCheckins || 0) + 1;
        changed = true;
        if (att.consecutiveMissedCheckins >= 2) {
          att.removedForMissedCheckins = true;
        } else {
          att.nextCheckinDueAt = randomNextCheckinDueAt(now);
        }
      }
      continue;
    }

    // No pending challenge — is it time for a new one?
    if (!att.nextCheckinDueAt) {
      att.nextCheckinDueAt = randomNextCheckinDueAt(now);
      changed = true;
      continue;
    }
    if (now >= att.nextCheckinDueAt) {
      att.checkins.push({
        promptedAt: now,
        deadline: new Date(now.getTime() + CHECKIN_WINDOW_MIN * 60000)
      });
      att.nextCheckinDueAt = undefined;
      changed = true;
    }
  }

  if (changed) {
    session.markModified('attendance');
    await session.save();
  }
}

export default {
  onClientLeft,
  onSessionEnded,
  onRecordingFinished,
  onTranscriptionFinished,
  runWrapUp,
  processDropDetection,
  processBreakReminders,
  processBreakageDetection,
  processBreakTransitions,
  processCheckins,
  closeDanglingSegments,
  computeGaps
};
