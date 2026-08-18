/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 */

/**
 * liveSessions — synchronous sessions (live CE webinars + clinical supervision).
 * Mounted at /api/live-sessions (see WIRING.md for index.js + routeManifest entries).
 *
 * ROUTE ORDER RULE: named routes (/upcoming, /mine) MUST precede /:id routes.
 *
 * Access-control architecture:
 *   - Whereby room URLs, S3 replay URLs, and Cloudinary handout URLs NEVER
 *     appear in public payloads or page source. They are returned only from
 *     the gated endpoints below, to authenticated registered users, inside
 *     the appropriate time/availability window.
 */
import express from 'express';
import Stripe from 'stripe';
import multer from 'multer';
import mammoth from 'mammoth';
import LiveSession from '../models/LiveSession.js';
import { protect, requireAdmin } from '../middleware/auth.js';
import { createMeeting, deleteMeeting } from '../services/wherebyService.js';
import { issueLiveSessionCertificates } from '../services/liveSessionCompletionService.js';

const router = express.Router();
const agendaUpload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

const JOIN_WINDOW_BEFORE_MIN = 15; // doors open 15 min early
const JOIN_WINDOW_AFTER_MIN = 30;  // grace after scheduled end (overruns)

/**
 * parseAgendaMarkdown — deterministic (no-AI) parser for the Run of Show importer.
 *
 * Does NOT rewrite, summarize, or paraphrase any text — every character of the
 * script the presenter wrote lands in the `script` field verbatim. This is
 * intentional: unlike course content generation, an agenda script is read aloud
 * live, so exact wording matters more than it does anywhere else in the platform.
 *
 * Expected format:
 *   # Hour 1: Framing and Statute        <- level-1 headings are ignored (organizational only)
 *   ## [breakout] Case A — the record that doesn't separate (25 min)
 *   Prompt: What would you have flagged in this note?
 *   <everything else here is the speaker script, preserved as-is>
 *
 * - `##` or `###` starts a new segment.
 * - An optional `[type]` tag at the start of the heading sets segment type
 *   (lecture/discussion/breakout/clip/break); falls back to keyword sniffing
 *   in the title, then defaults to 'lecture'.
 * - An optional `(NN min)` anywhere in the heading sets durationMin.
 * - An optional line starting with `Prompt:` (case-insensitive) anywhere in the
 *   body is pulled out as the segment's `prompt`; everything else is `script`.
 */
function parseAgendaMarkdown(rawText) {
  const TYPES = ['lecture', 'clip', 'discussion', 'breakout', 'break'];
  const KEYWORD_TYPE = [
    [/\bbreakout\b/i, 'breakout'],
    [/\bdiscussion\b|\bpoll\b/i, 'discussion'],
    [/\bbreak\b/i, 'break'],
    [/\bclip\b|\bvideo\b/i, 'clip']
  ];

  const lines = (rawText || '').replace(/\r\n/g, '\n').split('\n');
  const segments = [];
  let current = null;

  function pushCurrent() {
    if (!current) return;
    // Extract the Prompt: line (first match) out of the accumulated body.
    const bodyLines = current.bodyLines;
    let prompt = '';
    const keptLines = [];
    let promptTaken = false;
    for (const line of bodyLines) {
      const m = !promptTaken && line.match(/^\s*prompt:\s*(.*)$/i);
      if (m) {
        prompt = m[1].trim();
        promptTaken = true;
      } else {
        keptLines.push(line);
      }
    }
    // Trim leading/trailing blank lines only — internal spacing/paragraphs preserved verbatim.
    while (keptLines.length && keptLines[0].trim() === '') keptLines.shift();
    while (keptLines.length && keptLines[keptLines.length - 1].trim() === '') keptLines.pop();

    segments.push({
      type: current.type,
      title: current.title,
      durationMin: current.durationMin,
      prompt,
      script: keptLines.join('\n')
    });
    current = null;
  }

  for (const rawLine of lines) {
    const headingMatch = rawLine.match(/^(#{2,3})\s+(.*)$/);
    if (headingMatch) {
      pushCurrent();
      let headingText = headingMatch[2].trim();

      let type = null;
      const tagMatch = headingText.match(/^\[(\w+)\]\s*/);
      if (tagMatch && TYPES.includes(tagMatch[1].toLowerCase())) {
        type = tagMatch[1].toLowerCase();
        headingText = headingText.slice(tagMatch[0].length).trim();
      }

      let durationMin = null;
      const durMatch = headingText.match(/\((\d+)\s*min\)/i);
      if (durMatch) {
        durationMin = parseInt(durMatch[1], 10);
        headingText = headingText.replace(durMatch[0], '').trim();
      }

      if (!type) {
        for (const [re, t] of KEYWORD_TYPE) {
          if (re.test(headingText)) { type = t; break; }
        }
      }
      if (!type) type = 'lecture';

      headingText = headingText.replace(/[-–—\s]+$/, '').trim();

      current = { type, title: headingText, durationMin, bodyLines: [] };
      continue;
    }

    // Skip level-1 headings entirely (organizational "# Hour N" dividers only).
    if (/^#\s+/.test(rawLine)) continue;

    if (current) current.bodyLines.push(rawLine);
  }
  pushCurrent();

  return segments.map((s, i) => ({ order: i, ...s }));
}

/* ════════════════════════ PUBLIC / LEARNER ════════════════════════ */

// GET /api/live-sessions/upcoming — published upcoming live courses (catalog)
router.get('/upcoming', async (req, res) => {
  try {
    const sessions = await LiveSession.find({
      isPublished: true,
      sessionType: 'live-course',
      status: { $in: ['scheduled', 'live'] },
      scheduledEnd: { $gte: new Date() }
    }).sort({ scheduledStart: 1 }).limit(50);
    res.json({ sessions: sessions.map(s => s.toPublicJSON()) });
  } catch (err) {
    console.error('[live] upcoming:', err.message);
    res.status(500).json({ error: 'Failed to load upcoming sessions' });
  }
});

// GET /api/live-sessions/mine — sessions the user is registered for (incl. supervision)
router.get('/mine', protect, async (req, res) => {
  try {
    const sessions = await LiveSession.find({
      'registrants.user': req.user._id
    }).sort({ scheduledStart: -1 }).limit(100);
    res.json({
      sessions: sessions.map(s => ({
        ...s.toPublicJSON(),
        attendedMinutes: s.attendedMinutes(req.user._id),
        hasReplay: s.recordings.some(r => r.replayEnabled && r.status === 'ready')
      }))
    });
  } catch (err) {
    console.error('[live] mine:', err.message);
    res.status(500).json({ error: 'Failed to load your sessions' });
  }
});

// GET /api/live-sessions/admin/all — full session list for admin dashboard
router.get('/admin/all', protect, requireAdmin, async (req, res) => {
  try {
    const sessions = await LiveSession.find({})
      .sort({ scheduledStart: -1 })
      .limit(200)
      .lean();
    res.json({ sessions });
  } catch (err) {
    console.error('[live] admin/all:', err.message);
    res.status(500).json({ error: 'Failed to load sessions' });
  }
});

// GET /api/live-sessions/:id — public-safe detail (by id or slug)
router.get('/:id', async (req, res) => {
  try {
    const session = await findByIdOrSlug(req.params.id);
    if (!session || (!session.isPublished && session.sessionType === 'live-course')) {
      return res.status(404).json({ error: 'Session not found' });
    }
    res.json({ session: session.toPublicJSON() });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load session' });
  }
});

// POST /api/live-sessions/:id/register
router.post('/:id/register', protect, async (req, res) => {
  try {
    const session = await findByIdOrSlug(req.params.id);
    if (!session || !session.isPublished) return res.status(404).json({ error: 'Session not found' });
    if (!['scheduled', 'live'].includes(session.status)) {
      return res.status(400).json({ error: 'Registration is closed for this session.' });
    }
    if (session.isRegistered(req.user._id)) {
      return res.json({ registered: true, message: 'Already registered.' });
    }
    if (session.registrants.length >= session.capacity) {
      return res.status(400).json({ error: 'This session is full.' });
    }

    const isAdmin = req.user.role === 'admin';
    // Same currency check as canBookConsultation(): VIP-tier plan AND subscription actually active.
    const isActiveVip = req.user.isVip() &&
      (req.user.subscription.status === 'active' || req.user.subscription.status === 'lifetime');

    // Live sessions are free for current VIP subscribers. Everyone else must pay per-session
    // when the session is priced; if it isn't priced, there's no non-VIP path in.
    if (!isAdmin && !isActiveVip && !(session.price > 0)) {
      return res.status(403).json({
        error: 'Live sessions are a VIP subscriber benefit, or available for individual purchase.',
        reason: 'VIP subscription required',
        requiredTier: 'vip'
      });
    }

    // Paid sessions → Stripe Checkout for non-VIP; fulfillment registers via webhook (WIRING.md)
    if (!isAdmin && !isActiveVip && session.price > 0) {
      if (!stripe) return res.status(500).json({ error: 'Payments unavailable' });
      const checkout = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        line_items: [{
          price_data: {
            currency: 'usd',
            unit_amount: Math.round(session.price * 100),
            product_data: { name: `Live Session: ${session.title}` }
          },
          quantity: 1
        }],
        success_url: `${process.env.CLIENT_URL || 'https://counselorready.com'}/live-sessions.html?registered=${session.slug}`,
        cancel_url: `${process.env.CLIENT_URL || 'https://counselorready.com'}/live-sessions.html?canceled=true`,
        metadata: {
          type: 'live-session',
          liveSessionId: session._id.toString(),
          userId: req.user._id.toString()
        }
      });
      return res.json({ checkoutUrl: checkout.url });
    }

    session.registrants.push({ user: req.user._id, paid: false });
    await session.save();
    res.json({ registered: true });
  } catch (err) {
    console.error('[live] register:', err.message);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// POST /api/live-sessions/:id/join — mint the room URL (the access-control gate)
router.post('/:id/join', protect, async (req, res) => {
  try {
    const session = await findByIdOrSlug(req.params.id);
    if (!session) return res.status(404).json({ error: 'Session not found' });

    const isAdmin = req.user.role === 'admin';
    if (!isAdmin && !session.isRegistered(req.user._id)) {
      return res.status(403).json({ error: 'You are not registered for this session.' });
    }
    if (session.status === 'cancelled') {
      return res.status(400).json({ error: 'This session was cancelled.' });
    }

    const now = Date.now();
    const opens = session.scheduledStart.getTime() - JOIN_WINDOW_BEFORE_MIN * 60000;
    const closes = session.scheduledEnd.getTime() + JOIN_WINDOW_AFTER_MIN * 60000;
    if (!isAdmin && (now < opens || now > closes)) {
      return res.status(400).json({
        error: 'The room is not open yet.',
        opensAt: new Date(opens).toISOString()
      });
    }

    const displayName = `${(req.user.profile?.firstName || '')} ${(req.user.profile?.lastName || '')}`.trim() || req.user.email;
    const baseUrl = isAdmin ? (session.whereby.hostRoomUrl || session.whereby.viewerRoomUrl) : session.whereby.viewerRoomUrl;
    if (!baseUrl) return res.status(500).json({ error: 'Room not provisioned. Contact support.' });

    const sep = baseUrl.includes('?') ? '&' : '?';
    const roomUrl = `${baseUrl}${sep}displayName=${encodeURIComponent(displayName)}`;

    if (session.status === 'scheduled' && now >= opens) {
      session.status = 'live';
      await session.save();
    }

    res.json({
      roomUrl,
      isHost: isAdmin,
      session: session.toPublicJSON()
    });
  } catch (err) {
    console.error('[live] join:', err.message);
    res.status(500).json({ error: 'Failed to join session' });
  }
});

// GET /api/live-sessions/:id/replay — presigned S3 URL, registrants only
router.get('/:id/replay', protect, async (req, res) => {
  try {
    const session = await findByIdOrSlug(req.params.id);
    if (!session) return res.status(404).json({ error: 'Session not found' });
    if (session.sessionType !== 'live-course') return res.status(403).json({ error: 'No replay available.' });

    const isAdmin = req.user.role === 'admin';
    if (!isAdmin && !session.isRegistered(req.user._id)) {
      return res.status(403).json({ error: 'Replays are available to registered attendees only.' });
    }

    const recording = session.recordings.find(r => r.status === 'ready' && (r.replayEnabled || isAdmin));
    if (!recording) return res.status(404).json({ error: 'No replay is available for this session.' });

    // Lazy-import AWS SDK so the server boots fine before deps are installed
    const { S3Client, GetObjectCommand } = await import('@aws-sdk/client-s3');
    const { getSignedUrl } = await import('@aws-sdk/s3-request-presigner');

    const s3 = new S3Client({ region: process.env.AWS_REGION || 'us-east-1' });
    const url = await getSignedUrl(
      s3,
      new GetObjectCommand({
        Bucket: recording.s3Bucket || process.env.AWS_S3_RECORDINGS_BUCKET,
        Key: recording.s3Key
      }),
      { expiresIn: 3600 } // 1 hour
    );

    res.json({ replayUrl: url, expiresInSeconds: 3600, title: session.title });
  } catch (err) {
    console.error('[live] replay:', err.message);
    res.status(500).json({ error: 'Failed to load replay' });
  }
});

// GET /api/live-sessions/:id/handouts/:handoutId — gated handout URL
router.get('/:id/handouts/:handoutId', protect, async (req, res) => {
  try {
    const session = await findByIdOrSlug(req.params.id);
    if (!session) return res.status(404).json({ error: 'Session not found' });

    const isAdmin = req.user.role === 'admin';
    if (!isAdmin && !session.isRegistered(req.user._id)) {
      return res.status(403).json({ error: 'Handouts are available to registered attendees only.' });
    }

    const handout = session.handouts.id(req.params.handoutId);
    if (!handout) return res.status(404).json({ error: 'Handout not found' });

    if (!isAdmin) {
      const now = Date.now();
      const started = now >= session.scheduledStart.getTime() - JOIN_WINDOW_BEFORE_MIN * 60000;
      const ended = session.status === 'completed' || now > session.scheduledEnd.getTime();
      const ok =
        handout.availability === 'before' ||
        (handout.availability === 'during' && started) ||
        (handout.availability === 'after' && ended);
      if (!ok) return res.status(403).json({ error: 'This handout is not available yet.' });
    }

    res.json({ title: handout.title, fileUrl: handout.fileUrl, fileType: handout.fileType });
  } catch (err) {
    console.error('[live] handout:', err.message);
    res.status(500).json({ error: 'Failed to load handout' });
  }
});

/* ════════════════════════ ADMIN ════════════════════════ */

// POST /api/live-sessions — create session + provision Whereby room
router.post('/', protect, requireAdmin, async (req, res) => {
  try {
    const session = new LiveSession(req.body);
    await session.validate(); // run hard-lock invariants BEFORE provisioning the room

    const room = await createMeeting(session);
    session.whereby = room;
    await session.save();

    res.status(201).json({ session });
  } catch (err) {
    console.error('[live] create:', err.message);
    res.status(400).json({ error: err.message });
  }
});

// PATCH /api/live-sessions/:id — update metadata/handouts/publish state
router.patch('/:id', protect, requireAdmin, async (req, res) => {
  try {
    const session = await LiveSession.findById(req.params.id);
    if (!session) return res.status(404).json({ error: 'Session not found' });

    // Never allow client payloads to overwrite room URLs or attendance
    const { whereby, attendance, registrants, recordings, ...safe } = req.body;
    Object.assign(session, safe);
    await session.save(); // pre-validate re-runs hard-locks

    res.json({ session });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/live-sessions/:id — cancel + tear down Whereby room
router.delete('/:id', protect, requireAdmin, async (req, res) => {
  try {
    const session = await LiveSession.findById(req.params.id);
    if (!session) return res.status(404).json({ error: 'Session not found' });

    await deleteMeeting(session.whereby?.meetingId);
    session.status = 'cancelled';
    session.isPublished = false;
    await session.save();

    res.json({ cancelled: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to cancel session' });
  }
});

// GET /api/live-sessions/:id/attendance — verified attendance report
router.get('/:id/attendance', protect, requireAdmin, async (req, res) => {
  try {
    const session = await LiveSession.findById(req.params.id)
      .populate('registrants.user', 'email profile.firstName profile.lastName')
      .populate('attendance.user', 'email profile.firstName profile.lastName');
    if (!session) return res.status(404).json({ error: 'Session not found' });

    const scheduledMin = session.scheduledDurationMin();
    const report = session.registrants.map(r => {
      const attended = session.attendedMinutes(r.user._id);
      return {
        user: r.user,
        registeredAt: r.registeredAt,
        paid: r.paid,
        attendedMinutes: attended,
        attendancePct: scheduledMin ? Math.round((attended / scheduledMin) * 100) : 0,
        qualifies: session.meetsAttendanceThreshold(r.user._id)
      };
    });

    res.json({
      session: { title: session.title, sessionType: session.sessionType, scheduledMin, thresholdPct: session.attendanceThresholdPct },
      report,
      rawAttendance: session.attendance
    });
  } catch (err) {
    console.error('[live] attendance:', err.message);
    res.status(500).json({ error: 'Failed to load attendance' });
  }
});

// POST /api/live-sessions/:id/issue-certificates — cert qualifying attendees
router.post('/:id/issue-certificates', protect, requireAdmin, async (req, res) => {
  try {
    const result = await issueLiveSessionCertificates(req.params.id);
    res.json(result);
  } catch (err) {
    console.error('[live] issue-certificates:', err.message);
    res.status(400).json({ error: err.message });
  }
});

/* ════════════════════════ WATCH PARTY — ATTENDEE ════════════════════════ */

// GET /api/live-sessions/:id/live-state — lean poll endpoint (3s interval)
router.get('/:id/live-state', protect, async (req, res) => {
  try {
    const session = await LiveSession.findById(req.params.id)
      .select('liveState agenda status scheduledStart scheduledEnd registrants')
      .lean();
    if (!session) return res.status(404).json({ error: 'Session not found' });

    const isAdmin = req.user.role === 'admin';
    const registered = session.registrants.some(
      r => r.user && r.user.toString() === req.user._id.toString()
    );
    if (!isAdmin && !registered) {
      return res.status(403).json({ error: 'Not registered for this session.' });
    }

    const rawSeg = session.agenda?.[session.liveState?.currentSegment ?? 0] ?? null;
    // 'script' is the host's speaker script — host-only, never sent to attendees.
    // Mirrors the existing whereby/S3/handout gating pattern: strip on the way out
    // for non-admins rather than trusting the client not to render it.
    let seg = rawSeg;
    if (rawSeg && !isAdmin) {
      const { script, ...attendeeSeg } = rawSeg;
      seg = attendeeSeg;
    }
    // Poll is gated like `script`: attendees never receive the voters list, and never
    // see counts until the host reveals them. The host (admin) sees full tallies.
    const uid = req.user._id.toString();
    let outLiveState = session.liveState || {};
    const poll = outLiveState.poll;
    if (poll) {
      if (isAdmin) {
        outLiveState = { ...outLiveState, poll: { ...poll, voterCount: (poll.voters || []).length, voters: undefined } };
      } else if (poll.active || poll.showResults) {
        const youVoted = (poll.voters || []).some(v => v.toString() === uid);
        const options = poll.showResults
          ? (poll.options || []).map(o => ({ text: o.text, count: o.count }))
          : (poll.options || []).map(o => ({ text: o.text }));
        // openedAt identifies the poll instance so the client can scope its
        // local "already voted" flag per poll, not per session.
        outLiveState = { ...outLiveState, poll: { active: poll.active, question: poll.question, options, showResults: !!poll.showResults, youVoted, openedAt: poll.openedAt } };
      } else {
        outLiveState = { ...outLiveState, poll: undefined };
      }
    }
    res.json({
      liveState: outLiveState,
      currentSegment: seg,
      status: session.status
    });
  } catch (err) {
    console.error('[live] live-state:', err.message);
    res.status(500).json({ error: 'Failed to load live state' });
  }
});

// GET /api/live-sessions/:id/clips/:clipIndex/url — presigned S3 URL, 15-min expiry
router.get('/:id/clips/:clipIndex/url', protect, async (req, res) => {
  try {
    const session = await LiveSession.findById(req.params.id)
      .select('clips registrants status scheduledStart scheduledEnd sessionType')
      .lean();
    if (!session) return res.status(404).json({ error: 'Session not found' });
    if (session.sessionType !== 'live-course') {
      return res.status(403).json({ error: 'No clips on supervision sessions.' });
    }

    const isAdmin = req.user.role === 'admin';
    const registered = session.registrants.some(
      r => r.user && r.user.toString() === req.user._id.toString()
    );
    if (!isAdmin && !registered) {
      return res.status(403).json({ error: 'Clips are available to registered attendees only.' });
    }

    // Session window check
    if (!isAdmin) {
      const now = Date.now();
      const opens = new Date(session.scheduledStart).getTime() - JOIN_WINDOW_BEFORE_MIN * 60000;
      const closes = new Date(session.scheduledEnd).getTime() + JOIN_WINDOW_AFTER_MIN * 60000;
      if (now < opens || now > closes) {
        return res.status(403).json({ error: 'Clips are only available during the session window.' });
      }
    }

    const clipIndex = parseInt(req.params.clipIndex, 10);
    const clip = session.clips?.[clipIndex];
    if (!clip) return res.status(404).json({ error: 'Clip not found.' });

    const { S3Client, GetObjectCommand } = await import('@aws-sdk/client-s3');
    const { getSignedUrl } = await import('@aws-sdk/s3-request-presigner');
    const s3 = new S3Client({ region: process.env.AWS_REGION || 'us-east-1' });
    const url = await getSignedUrl(
      s3,
      new GetObjectCommand({
        Bucket: clip.s3Bucket || process.env.AWS_S3_RECORDINGS_BUCKET,
        Key: clip.s3Key
      }),
      { expiresIn: 900 } // 15 minutes
    );

    res.json({ clipUrl: url, title: clip.title, durationSec: clip.durationSec, expiresInSeconds: 900 });
  } catch (err) {
    console.error('[live] clip-url:', err.message);
    res.status(500).json({ error: 'Failed to load clip URL' });
  }
});

/* ════════════════════════ WATCH PARTY — HOST (admin) ════════════════════════ */

// POST /api/live-sessions/:id/live-state/segment — host advances segment
router.post('/:id/live-state/segment', protect, requireAdmin, async (req, res) => {
  try {
    const { segment } = req.body;
    if (typeof segment !== 'number') {
      return res.status(400).json({ error: 'segment must be a number.' });
    }
    const session = await LiveSession.findById(req.params.id);
    if (!session) return res.status(404).json({ error: 'Session not found' });

    session.liveState = {
      ...(session.liveState?.toObject?.() ?? session.liveState ?? {}),
      currentSegment: segment,
      segmentStartedAt: new Date()
    };
    session.markModified('liveState');
    await session.save();

    res.json({ liveState: session.liveState });
  } catch (err) {
    console.error('[live] segment:', err.message);
    res.status(500).json({ error: 'Failed to update segment' });
  }
});

// POST /api/live-sessions/:id/live-state/playback — host controls clip playback
router.post('/:id/live-state/playback', protect, requireAdmin, async (req, res) => {
  try {
    const { clipIndex, playing, positionSec } = req.body;
    const session = await LiveSession.findById(req.params.id);
    if (!session) return res.status(404).json({ error: 'Session not found' });

    session.liveState = {
      ...(session.liveState?.toObject?.() ?? session.liveState ?? {}),
      playback: { clipIndex, playing: !!playing, positionSec: positionSec ?? 0, stateUpdatedAt: new Date() }
    };
    session.markModified('liveState');
    await session.save();

    res.json({ playback: session.liveState.playback });
  } catch (err) {
    console.error('[live] playback:', err.message);
    res.status(500).json({ error: 'Failed to update playback state' });
  }
});

/* ────────────────────── LIVE POLLS ─────────────────────── */

// POST /:id/live-state/poll/open — host opens a poll (defaults to Yes/No)
router.post('/:id/live-state/poll/open', protect, requireAdmin, async (req, res) => {
  try {
    let { question, options } = req.body;
    if (!question || typeof question !== 'string') return res.status(400).json({ error: 'question is required.' });
    if (!Array.isArray(options)) options = ['Yes', 'No'];
    options = options.map(t => String(t || '').trim()).filter(Boolean).slice(0, 4);
    if (options.length < 2) return res.status(400).json({ error: 'Need at least 2 options.' });

    const session = await LiveSession.findById(req.params.id);
    if (!session) return res.status(404).json({ error: 'Session not found' });

    session.liveState = {
      ...(session.liveState?.toObject?.() ?? session.liveState ?? {}),
      poll: {
        active: true,
        question: question.trim(),
        options: options.map(text => ({ text, count: 0 })),
        voters: [],
        showResults: false,
        openedAt: new Date()
      }
    };
    session.markModified('liveState');
    await session.save();
    res.json({ poll: session.liveState.poll });
  } catch (err) {
    console.error('[live] poll/open:', err.message);
    res.status(500).json({ error: 'Failed to open poll' });
  }
});

// POST /:id/live-state/poll/close — host stops voting (keeps results)
router.post('/:id/live-state/poll/close', protect, requireAdmin, async (req, res) => {
  try {
    const session = await LiveSession.findById(req.params.id);
    if (!session) return res.status(404).json({ error: 'Session not found' });
    if (!session.liveState?.poll) return res.status(400).json({ error: 'No poll to close.' });
    session.liveState.poll.active = false;
    session.markModified('liveState');
    await session.save();
    res.json({ poll: session.liveState.poll });
  } catch (err) {
    console.error('[live] poll/close:', err.message);
    res.status(500).json({ error: 'Failed to close poll' });
  }
});

// POST /:id/live-state/poll/reveal — host shows/hides results ({ show: true|false })
router.post('/:id/live-state/poll/reveal', protect, requireAdmin, async (req, res) => {
  try {
    const show = req.body?.show !== false;
    const session = await LiveSession.findById(req.params.id);
    if (!session) return res.status(404).json({ error: 'Session not found' });
    if (!session.liveState?.poll) return res.status(400).json({ error: 'No poll.' });
    session.liveState.poll.showResults = show;
    session.markModified('liveState');
    await session.save();
    res.json({ poll: session.liveState.poll });
  } catch (err) {
    console.error('[live] poll/reveal:', err.message);
    res.status(500).json({ error: 'Failed to update poll visibility' });
  }
});

// POST /:id/live-state/poll/vote — attendee casts one vote (anonymous, deduped)
router.post('/:id/live-state/poll/vote', protect, async (req, res) => {
  try {
    const { optionIndex } = req.body;
    const session = await LiveSession.findById(req.params.id);
    if (!session) return res.status(404).json({ error: 'Session not found' });

    const isAdmin = req.user.role === 'admin';
    const registered = session.registrants.some(r => r.user && r.user.toString() === req.user._id.toString());
    if (!isAdmin && !registered) return res.status(403).json({ error: 'Not registered for this session.' });

    const poll = session.liveState?.poll;
    if (!poll || !poll.active) return res.status(400).json({ error: 'No poll is open.' });
    if (typeof optionIndex !== 'number' || optionIndex < 0 || optionIndex >= poll.options.length) {
      return res.status(400).json({ error: 'Invalid option.' });
    }
    const uid = req.user._id.toString();
    if (poll.voters.some(v => v.toString() === uid)) {
      return res.status(409).json({ error: 'You have already voted.', youVoted: true });
    }
    poll.options[optionIndex].count += 1;
    poll.voters.push(req.user._id);
    session.markModified('liveState');
    await session.save();
    res.json({ ok: true, youVoted: true });
  } catch (err) {
    console.error('[live] poll/vote:', err.message);
    res.status(500).json({ error: 'Failed to record vote' });
  }
});

// POST /api/live-sessions/:id/clips — add clip metadata
router.post('/:id/clips', protect, requireAdmin, async (req, res) => {
  try {
    const session = await LiveSession.findById(req.params.id);
    if (!session) return res.status(404).json({ error: 'Session not found' });
    const { title, s3Key, s3Bucket, durationSec } = req.body;
    session.clips.push({ title, s3Key, s3Bucket, durationSec });
    await session.save(); // pre-validate enforces supervision lock + 600s ceiling
    res.status(201).json({ clips: session.clips, clipIndex: session.clips.length - 1 });
  } catch (err) {
    console.error('[live] add-clip:', err.message);
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/live-sessions/:id/clips/:clipIndex — remove clip metadata
router.delete('/:id/clips/:clipIndex', protect, requireAdmin, async (req, res) => {
  try {
    const session = await LiveSession.findById(req.params.id);
    if (!session) return res.status(404).json({ error: 'Session not found' });
    const idx = parseInt(req.params.clipIndex, 10);
    if (isNaN(idx) || idx < 0 || idx >= session.clips.length) {
      return res.status(404).json({ error: 'Clip index out of range.' });
    }
    session.clips.splice(idx, 1);
    await session.save();
    res.json({ clips: session.clips });
  } catch (err) {
    console.error('[live] delete-clip:', err.message);
    res.status(500).json({ error: 'Failed to delete clip' });
  }
});

/* ════════════════════════ RUN OF SHOW — GUIDE IMPORTER ════════════════════════
 * PREVIEW-ONLY: neither route below writes to the database. They parse text
 * (pasted or extracted from a .docx) into agenda rows and hand them back to the
 * admin UI, which loads them into the existing Run of Show editor for review.
 * Saving still goes through the existing PATCH /:id, unchanged. */

// POST /api/live-sessions/:id/agenda/import-text — paste path
router.post('/:id/agenda/import-text', protect, requireAdmin, async (req, res) => {
  try {
    const session = await LiveSession.findById(req.params.id).select('sessionType');
    if (!session) return res.status(404).json({ error: 'Session not found' });
    if (session.sessionType !== 'live-course') {
      return res.status(403).json({ error: 'Agenda import is only available for live CE courses.' });
    }
    const { text } = req.body;
    if (!text || !text.trim()) return res.status(400).json({ error: 'No text provided.' });

    const agenda = parseAgendaMarkdown(text);
    if (!agenda.length) {
      return res.status(400).json({ error: 'No segments found. Expected headings like "## Segment Title (25 min)".' });
    }
    res.json({ agenda, segmentCount: agenda.length, totalMinutes: agenda.reduce((s, a) => s + (a.durationMin || 0), 0) });
  } catch (err) {
    console.error('[live] agenda/import-text:', err.message);
    res.status(500).json({ error: 'Failed to parse text.' });
  }
});

// POST /api/live-sessions/:id/agenda/import-docx — file upload path
router.post('/:id/agenda/import-docx', protect, requireAdmin, agendaUpload.single('file'), async (req, res) => {
  try {
    const session = await LiveSession.findById(req.params.id).select('sessionType');
    if (!session) return res.status(404).json({ error: 'Session not found' });
    if (session.sessionType !== 'live-course') {
      return res.status(403).json({ error: 'Agenda import is only available for live CE courses.' });
    }
    if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });

    // convertToMarkdown (not extractRawText) so Word's Heading 1/2/3 styles
    // become '#'/'##'/'###' — the same convention the paste-path parser expects.
    const { value: markdown } = await mammoth.convertToMarkdown({ buffer: req.file.buffer });

    const agenda = parseAgendaMarkdown(markdown);
    if (!agenda.length) {
      return res.status(400).json({ error: 'No segments found. Make sure segment titles use a Word Heading 2 style (or ## in the raw text).' });
    }
    res.json({ agenda, segmentCount: agenda.length, totalMinutes: agenda.reduce((s, a) => s + (a.durationMin || 0), 0) });
  } catch (err) {
    console.error('[live] agenda/import-docx:', err.message);
    res.status(500).json({ error: 'Failed to parse document.' });
  }
});

/* ════════════════════════ CATCH-UP ════════════════════════ */

// POST /api/live-sessions/:id/catchup
// Returns cached AI gap summaries for the requesting user's missed segments.
// 403 for supervision sessions. {queued:true} if transcript not yet available.
router.post('/:id/catchup', protect, async (req, res) => {
  try {
    const session = await findByIdOrSlug(req.params.id);
    if (!session) return res.status(404).json({ error: 'Session not found' });

    if (session.sessionType === 'supervision') {
      return res.status(403).json({ error: 'Catch-up is not available for supervision sessions.' });
    }

    if (!session.isRegistered(req.user._id)) {
      return res.status(403).json({ error: 'You are not registered for this session.' });
    }

    // During a live session: transcript not available yet
    if (session.status === 'live') {
      return res.json({ queued: true, message: 'The session is still in progress. Your personalized catch-up will be available after the session ends.' });
    }

    // Transcript not yet available
    if (!session.producer?.transcriptS3Key) {
      return res.json({ queued: true, message: 'Your catch-up is being prepared. Check back shortly after the session ends.' });
    }

    // Return cached summaries for this user's gap segments
    const { computeGaps } = await import('../services/sessionProducer.js');
    const userId = req.user._id.toString();
    const gaps = computeGaps(session, userId);

    const result = gaps.map(gap => {
      // Pull cached summary from the attendance segment
      const seg = session.attendance.find(
        a => a.user && a.user.toString() === userId &&
             a.leftAt && Math.abs(a.leftAt.getTime() - gap.leftAt.getTime()) < 5000
      );
      return {
        gapMin: gap.gapMin,
        offsetSec: gap.offsetSec,
        replayUrl: `${req.protocol}://${req.get('host')}/live-room.html?session=${session.slug}&replay=1&t=${gap.offsetSec}`,
        summary: seg?.catchupSummary ? JSON.parse(seg.catchupSummary) : null
      };
    });

    res.json({ gaps: result });
  } catch (err) {
    console.error('[live] catchup:', err.message);
    res.status(500).json({ error: 'Failed to load catch-up' });
  }
});

/* ── helpers ── */
async function findByIdOrSlug(idOrSlug) {
  if (/^[0-9a-fA-F]{24}$/.test(idOrSlug)) {
    const byId = await LiveSession.findById(idOrSlug);
    if (byId) return byId;
  }
  return LiveSession.findOne({ slug: idOrSlug.toLowerCase() });
}

export default router;
