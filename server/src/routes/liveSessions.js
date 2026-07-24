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
import cloudinary from 'cloudinary';
import { Readable } from 'stream';
import LiveSession from '../models/LiveSession.js';
import { protect, requireAdmin } from '../middleware/auth.js';
import { createMeeting, deleteMeeting } from '../services/wherebyService.js';
import { issueLiveSessionCertificates, issueSeriesCertificates } from '../services/liveSessionCompletionService.js';
import { triggerNewLiveSessionAnnouncement } from '../services/notificationTriggerService.js';
import { sendLiveSessionRegistrationConfirmation } from '../services/emailService.js';
import { parseRunOfShowMarkdown, parseRunOfShowDocx } from '../services/runOfShowParser.js';

const router = express.Router();
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

// Cloudinary raw-upload config for live-session handouts. Mirrors the stream
// pattern in routes/fileUpload.js but is kept independent (module boundary).
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Handout mimetype → LiveSession handoutSchema.fileType enum. Any mimetype not
// in this map is rejected by the multer fileFilter before it reaches Cloudinary.
const HANDOUT_MIME_TO_TYPE = {
  'application/pdf': 'pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
  'image/png': 'png',
  'image/jpeg': 'jpg',
};

const handoutUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB
  fileFilter: (req, file, cb) => {
    if (HANDOUT_MIME_TO_TYPE[file.mimetype]) cb(null, true);
    else cb(new Error(`File type not allowed: ${file.mimetype}. Accepted: PDF, DOCX, PPTX, XLSX, PNG, JPG`), false);
  },
});

// Run-of-Show docx upload — memory-buffered, .docx only. Mirrors courseBuilder.js's
// docxUpload so the /run-of-show/preview route can hand the buffer to mammoth.
const rosDocxUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      file.originalname?.endsWith('.docx')
    ) {
      cb(null, true);
    } else {
      cb(new Error('Only .docx files are accepted'));
    }
  },
});

// Per-segment slide upload — PNG/JPG only. Reuses the handout Cloudinary
// machinery (memory buffer → upload_stream), image resource type.
const SLIDE_MIME = { 'image/png': true, 'image/jpeg': true };
const slideUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (SLIDE_MIME[file.mimetype]) cb(null, true);
    else cb(new Error(`Slide images must be PNG or JPG (got ${file.mimetype}).`), false);
  },
});

const JOIN_WINDOW_BEFORE_MIN = 15; // doors open 15 min early
const JOIN_WINDOW_AFTER_MIN = 30;  // grace after scheduled end (overruns)

const DEFAULT_EVALUATION_QUESTIONS = [
  { question: 'Quality of course content', type: 'rating', required: true },
  { question: 'Clarity of instruction', type: 'rating', required: true },
  { question: 'Overall course satisfaction', type: 'rating', required: true },
  { question: 'Usefulness of course materials', type: 'rating', required: true },
  { question: 'Ease of access to course materials', type: 'rating', required: true },
  { question: 'Overall Course Rating', type: 'rating', required: true },
  { question: 'Level of interactivity in the course', type: 'rating', required: true },
  { question: 'Relevance to professional practice', type: 'rating', required: true },
  { question: 'The Presenter was timely in addressing questions or issues', type: 'rating', required: true },
  { question: 'Satisfaction with the online platform', type: 'rating', required: true },
  { question: 'Timeliness of the information provided', type: 'rating', required: true },
  { question: 'The cost of the course was affordable compared to others providing similar credit hours', type: 'rating', required: true },
  { question: 'Was the course engaging?', type: 'yes_no', required: true },
  { question: 'Would you recommend this course to others?', type: 'yes_no', required: true },
  { question: 'Additional comments or suggestions (optional)', type: 'text', required: false }
];

/* ════════════════════════ PUBLIC / LEARNER ════════════════════════ */

// GET /api/live-sessions/upcoming — published upcoming live courses (catalog)
router.get('/upcoming', async (req, res) => {
  try {
    const sessions = await LiveSession.find({
      isPublished: true,
      sessionType: 'live-course',
      status: { $in: ['scheduled', 'live'] },
      scheduledEnd: { $gte: new Date() },
      visibility: { $ne: 'private' }
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

// PATCH /api/live-sessions/admin/publish-all — bulk publish/unpublish every session.
// Deliberately does NOT fire the new-session announcement email (unlike the
// per-session PATCH /:id), so flipping many drafts at once never blasts users
// with one email per session. Body: { publish: true | false }.
router.patch('/admin/publish-all', protect, requireAdmin, async (req, res) => {
  try {
    const publish = req.body?.publish === true;
    const result = await LiveSession.updateMany(
      { isPublished: { $ne: publish } },
      { $set: { isPublished: publish } }
    );
    const modified = result.modifiedCount ?? result.nModified ?? 0;
    res.json({ ok: true, publish, modified });
  } catch (err) {
    console.error('[live] admin/publish-all:', err.message);
    res.status(500).json({ error: 'Failed to update sessions' });
  }
});

// GET /api/live-sessions/code/:accessCode — direct lookup, public AND private sessions
router.get('/code/:accessCode', async (req, res) => {
  try {
    const session = await LiveSession.findOne({
      accessCode: req.params.accessCode.toUpperCase().trim()
    });
    if (!session || (!session.isPublished && session.sessionType === 'live-course')) {
      return res.status(404).json({ error: 'Session not found' });
    }
    res.json({ session: session.toPublicJSON() });
  } catch (err) {
    console.error('[live] code lookup:', err.message);
    res.status(500).json({ error: 'Failed to load session' });
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

    // For private sessions, a correct access code is itself the authorization —
    // it stands in for VIP tier for THIS session only. Public sessions are untouched.
    const suppliedCode = (req.body.code || '').toUpperCase().trim();
    const hasValidPrivateCode = session.visibility === 'private' &&
      session.accessCode &&
      suppliedCode === session.accessCode;

    // Live sessions are free for current VIP subscribers. Everyone else must pay per-session
    // when the session is priced; if it isn't priced, there's no non-VIP path in.
    if (!isAdmin && !isActiveVip && !hasValidPrivateCode && !(session.price > 0)) {
      return res.status(403).json({
        error: 'Live sessions are a VIP subscriber benefit, or available for individual purchase.',
        reason: 'VIP subscription required',
        requiredTier: 'vip'
      });
    }

    // Paid sessions → Stripe Checkout for non-VIP; fulfillment registers via webhook (WIRING.md)
    if (!isAdmin && !isActiveVip && !hasValidPrivateCode && session.price > 0) {
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
    // Fire-and-forget: registration confirmation + .ics calendar invite (learner)
    // and instructor copy. Email failures must never block/deny a registration.
    sendLiveSessionRegistrationConfirmation(req.user, session, {
      seatsRemaining: Math.max(0, session.capacity - session.registrants.length)
    }).catch(err => console.error('[live] registration confirmation email failed:', err.message));
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

// GET /api/live-sessions/:id/evaluation
router.get('/:id/evaluation', protect, async (req, res) => {
  try {
    const session = await LiveSession.findById(req.params.id);
    if (!session) return res.status(404).json({ error: 'Session not found' });

    const att = session.attendance.find(
      a => a.user && a.user.toString() === req.user._id.toString()
    );
    const questions = session.evaluationQuestions?.length > 0
      ? session.evaluationQuestions
      : DEFAULT_EVALUATION_QUESTIONS;

    res.json({
      required: true,
      completed: att?.evaluationCompleted || false,
      sessionInfo: {
        title: session.title,
        dateCompleted: session.scheduledEnd,
        instructorName: session.presenter?.name || 'CounselorReady'
      },
      questions
    });
  } catch (err) {
    console.error('[live] get evaluation:', err.message);
    res.status(500).json({ error: 'Failed to load evaluation' });
  }
});

// POST /api/live-sessions/:id/evaluation
router.post('/:id/evaluation', protect, async (req, res) => {
  try {
    const { responses } = req.body; // Array of { questionIndex, response }
    const session = await LiveSession.findById(req.params.id);
    if (!session) return res.status(404).json({ error: 'Session not found' });

    const att = session.attendance.find(
      a => a.user && a.user.toString() === req.user._id.toString()
    );
    if (!att) return res.status(404).json({ error: 'No attendance record found for this session.' });

    const questions = session.evaluationQuestions?.length > 0
      ? session.evaluationQuestions
      : DEFAULT_EVALUATION_QUESTIONS;

    for (let i = 0; i < questions.length; i++) {
      if (questions[i].required) {
        const r = (responses || []).find(x => x.questionIndex === i);
        if (!r || r.response === null || r.response === '') {
          return res.status(400).json({ error: `Question ${i + 1} is required` });
        }
      }
    }

    att.evaluationResponses = responses;
    att.evaluationCompleted = true;
    att.evaluationCompletedAt = new Date();
    session.markModified('attendance');
    await session.save();

    res.json({ success: true, message: 'Evaluation submitted' });
  } catch (err) {
    console.error('[live] submit evaluation:', err.message);
    res.status(500).json({ error: 'Failed to submit evaluation' });
  }
});

// GET /api/live-sessions/:id/assessment — registrant view of the graded quiz.
// Only when enabled AND the session is completed. Questions are returned WITHOUT
// isCorrect/correctAnswer (grading is server-side only).
router.get('/:id/assessment', protect, async (req, res) => {
  try {
    const session = await findByIdOrSlug(req.params.id);
    if (!session) return res.status(404).json({ error: 'Session not found' });
    if (!session.assessment?.enabled) return res.status(404).json({ error: 'No assessment for this session.' });

    const isAdmin = req.user.role === 'admin';
    if (!isAdmin && !session.isRegistered(req.user._id)) {
      return res.status(403).json({ error: 'You are not registered for this session.' });
    }
    if (session.status !== 'completed') {
      return res.status(400).json({ error: 'The assessment opens after the session ends.' });
    }

    const attemptsUsed = (session.assessmentAttempts || []).filter(
      a => a.userId && a.userId.toString() === req.user._id.toString()
    );
    const best = attemptsUsed.reduce((b, a) => (a.scorePct > (b?.scorePct ?? -1) ? a : b), null);

    res.json({
      title: session.title,
      passThresholdPct: session.assessment.passThresholdPct ?? 80,
      maxAttempts: session.assessment.maxAttempts ?? 3,
      attemptsUsed: attemptsUsed.length,
      attemptsRemaining: Math.max(0, (session.assessment.maxAttempts ?? 3) - attemptsUsed.length),
      passed: !!best?.passed,
      lastScorePct: best ? best.scorePct : null,
      // Never leak isCorrect/correctAnswer to a non-admin exam-taker.
      questions: (session.assessment.questions || []).map(q => ({
        text: q.text,
        options: (q.options || []).map(o => ({ text: o.text }))
      }))
    });
  } catch (err) {
    console.error('[live] get assessment:', err.message);
    res.status(500).json({ error: 'Failed to load assessment' });
  }
});

// POST /api/live-sessions/:id/assessment — grade server-side, store an immutable
// attempt, reject after maxAttempts. Body: { answers: [optionIndex per question] }.
router.post('/:id/assessment', protect, async (req, res) => {
  try {
    const { answers } = req.body;
    const session = await findByIdOrSlug(req.params.id);
    if (!session) return res.status(404).json({ error: 'Session not found' });
    if (!session.assessment?.enabled) return res.status(404).json({ error: 'No assessment for this session.' });
    if (!session.isRegistered(req.user._id)) {
      return res.status(403).json({ error: 'You are not registered for this session.' });
    }
    if (session.status !== 'completed') {
      return res.status(400).json({ error: 'The assessment opens after the session ends.' });
    }
    if (!Array.isArray(answers)) {
      return res.status(400).json({ error: 'answers must be an array of option indexes.' });
    }

    const maxAttempts = session.assessment.maxAttempts ?? 3;
    const priorAttempts = (session.assessmentAttempts || []).filter(
      a => a.userId && a.userId.toString() === req.user._id.toString()
    );
    if (priorAttempts.length >= maxAttempts) {
      return res.status(400).json({ error: 'You have used all of your attempts.', attemptsRemaining: 0 });
    }

    // Grade server-side against correctAnswer (falls back to the isCorrect flag).
    const questions = session.assessment.questions || [];
    let correct = 0;
    questions.forEach((q, i) => {
      let correctIdx = (typeof q.correctAnswer === 'number') ? q.correctAnswer : -1;
      if (correctIdx < 0) correctIdx = (q.options || []).findIndex(o => o.isCorrect);
      if (answers[i] === correctIdx) correct++;
    });
    const scorePct = questions.length ? Math.round((correct / questions.length) * 100) : 0;
    const passed = scorePct >= (session.assessment.passThresholdPct ?? 80);

    // Atomic immutable append — the attempt can never be edited once stored.
    await LiveSession.updateOne(
      { _id: session._id },
      { $push: { assessmentAttempts: { userId: req.user._id, answers, scorePct, passed, at: new Date() } } }
    );

    res.json({
      scorePct,
      passed,
      passThresholdPct: session.assessment.passThresholdPct ?? 80,
      attemptsUsed: priorAttempts.length + 1,
      attemptsRemaining: Math.max(0, maxAttempts - (priorAttempts.length + 1))
    });
  } catch (err) {
    console.error('[live] submit assessment:', err.message);
    res.status(500).json({ error: 'Failed to submit assessment' });
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

// POST /api/live-sessions/:id/handouts — admin uploads a handout to Cloudinary
// and appends it to session.handouts[]. Supervision sessions are rejected BEFORE
// any Cloudinary call — Cloudinary has no BAA (HIPAA hard-lock), never relying on
// the save-time pre-validate hook to catch it.
router.post('/:id/handouts', protect, requireAdmin, (req, res, next) => {
  // Wrap multer so filter/size errors return clean JSON instead of an HTML 500.
  handoutUpload.single('file')(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.message });
    next();
  });
}, async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file provided' });

    const session = await findByIdOrSlug(req.params.id);
    if (!session) return res.status(404).json({ error: 'Session not found' });

    // HIPAA hard-lock: supervision sessions may never carry handouts. Reject
    // before uploading anything to Cloudinary.
    if (session.sessionType === 'supervision') {
      return res.status(403).json({
        error: 'Handouts are not permitted on supervision sessions — Cloudinary has no BAA (HIPAA hard-lock).'
      });
    }

    const fileType = HANDOUT_MIME_TO_TYPE[req.file.mimetype];
    const folder = `counselorready/live-sessions/${session._id}`;
    const publicId = `handout_${Date.now()}`;

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.v2.uploader.upload_stream(
        { folder, resource_type: 'raw', public_id: publicId, use_filename: false },
        (err, r) => (err ? reject(err) : resolve(r))
      );
      const readable = new Readable();
      readable.push(req.file.buffer);
      readable.push(null);
      readable.pipe(stream);
    });

    // Force-download URL variant (inject fl_attachment after /upload/)
    const fileUrl = result.secure_url.replace('/upload/', '/upload/fl_attachment/');
    const title = (req.body.title || '').trim() || req.file.originalname.replace(/\.[^.]+$/, '');
    const availability = ['before', 'during', 'after'].includes(req.body.availability)
      ? req.body.availability
      : 'during';

    session.handouts.push({
      title,
      cloudinaryPublicId: result.public_id,
      fileUrl,
      fileType,
      sizeKB: Math.round(result.bytes / 1024),
      availability,
    });
    await session.save(); // pre-validate re-runs the hard-locks (defense in depth)

    const handout = session.handouts[session.handouts.length - 1];
    res.status(201).json({ handout });
  } catch (err) {
    console.error('[live] handout upload:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/live-sessions/:id/handouts/:handoutId — remove a handout and its
// Cloudinary asset. Cloudinary destroy is best-effort and never fails the request.
router.delete('/:id/handouts/:handoutId', protect, requireAdmin, async (req, res) => {
  try {
    const session = await findByIdOrSlug(req.params.id);
    if (!session) return res.status(404).json({ error: 'Session not found' });

    const handout = session.handouts.id(req.params.handoutId);
    if (!handout) return res.status(404).json({ error: 'Handout not found' });

    const publicId = handout.cloudinaryPublicId;
    session.handouts.pull(req.params.handoutId);

    try {
      await cloudinary.v2.uploader.destroy(publicId, { resource_type: 'raw' });
    } catch (e) {
      console.error('[live] handout destroy (non-fatal):', e.message);
    }

    await session.save();
    res.json({ deleted: true });
  } catch (err) {
    console.error('[live] handout delete:', err.message);
    res.status(500).json({ error: err.message });
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

    const wasPublished = session.isPublished;

    // Never allow client payloads to overwrite room URLs or attendance.
    // `autopilot` is pulled out and MERGED (not Object.assign-replaced) so a
    // toggle payload like { autopilot: { enabled: true } } doesn't wipe
    // startedAt/pausedAt written by the tick. `assessmentAttempts` is graded
    // server-side and immutable — never writable from a client PATCH. The
    // `assessment` CONFIG (enable/threshold/maxAttempts/questions) DOES flow
    // through here so the admin question builder can save via PATCH.
    //
    // Safe-assign model is a denylist: everything NOT destructured out below is
    // admin-writable via `safe`. `earlyBirdPrice` and `earlyBirdDeadline` are
    // intentionally admin-writable this way (they are not on the denied list),
    // so the admin session editor can set early-bird pricing through PATCH.
    const { whereby, attendance, registrants, recordings, autopilot, assessmentAttempts, ...safe } = req.body;
    Object.assign(session, safe);

    if (autopilot && typeof autopilot === 'object') {
      if (!session.autopilot) session.autopilot = {};
      if (typeof autopilot.enabled === 'boolean') {
        session.autopilot.enabled = autopilot.enabled;
        // Enabling mid-session: anchor the segment clock to the scheduled start
        // so timed auto-advance lines up with the planned agenda.
        if (autopilot.enabled && session.status === 'live' && !session.autopilot.startedAt) {
          session.autopilot.startedAt = session.scheduledStart;
        }
      }
      if ('startedAt' in autopilot && autopilot.startedAt) {
        session.autopilot.startedAt = new Date(autopilot.startedAt);
      }
      // pausedAt: a truthy value pauses (host takes the wheel); null/false clears (Resume).
      if ('pausedAt' in autopilot) {
        session.autopilot.pausedAt = autopilot.pausedAt ? new Date(autopilot.pausedAt) : undefined;
      }
      session.markModified('autopilot');
    }

    await session.save(); // pre-validate re-runs hard-locks

    // Fire the announcement email only on the false→true transition, and only
    // for public sessions — private/test sessions never trigger a mass email.
    if (!wasPublished && session.isPublished && session.visibility !== 'private') {
      triggerNewLiveSessionAnnouncement({
        sessionTitle: session.title,
        sessionSlug: session.slug,
        accessCode: session.accessCode,
        scheduledStart: session.scheduledStart,
        ceuHours: session.ceuHours,
        category: session.category,
        description: session.description,
        price: session.price
      }).catch(err => console.error('triggerNewLiveSessionAnnouncement failed:', err));
    }

    res.json({ session });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/live-sessions/:id/run-of-show/preview
// Accepts either JSON { markdown } OR a multipart 'file' upload (docx).
// Returns the parsed payload WITHOUT saving — Ke reviews and confirms
// via the commit route below.
router.post('/:id/run-of-show/preview', protect, requireAdmin, rosDocxUpload.single('file'), async (req, res) => {
  try {
    const session = await LiveSession.findById(req.params.id).select('_id title');
    if (!session) return res.status(404).json({ error: 'Session not found' });

    let parsed;
    if (req.file) {
      parsed = await parseRunOfShowDocx(req.file.buffer);
    } else {
      const markdown = (req.body?.markdown || '').trim();
      if (!markdown) return res.status(400).json({ error: 'Provide markdown text or a .docx file.' });
      parsed = parseRunOfShowMarkdown(markdown);
    }

    // Compute hour totals for UI display (helps Ke see if any hour drifts
    // from the 60-min target).
    const totalMin = parsed.agenda.reduce((sum, s) => sum + (s.durationMin || 0), 0);

    res.json({
      sessionTitle: session.title,
      summary: {
        segmentCount: parsed.agenda.length,
        totalMin,
        preFlightCount: parsed.preFlightChecklist.length,
        globalCautionsCount: parsed.globalFacilitatorCautions.length,
        objectivesCount: parsed.objectives?.length || 0,
        segmentsMissingDuration: parsed.agenda.filter(s => !s.durationMin).length
      },
      parsed,
      warnings: parsed.warnings
    });
  } catch (err) {
    console.error('[live] ros preview:', err.message);
    res.status(400).json({ error: err.message });
  }
});

// POST /api/live-sessions/:id/run-of-show/commit
// Body: { agenda, preFlightChecklist, globalFacilitatorCautions }.
// This is the payload Ke got back from /preview, possibly hand-edited.
// Fully REPLACES the session's ROS content — this is a deliberate choice,
// since half-merged imports are worse than a clean overwrite. The Edit modal
// remains available for per-segment tweaks after commit.
router.post('/:id/run-of-show/commit', protect, requireAdmin, async (req, res) => {
  try {
    const session = await LiveSession.findById(req.params.id);
    if (!session) return res.status(404).json({ error: 'Session not found' });

    const { agenda, preFlightChecklist, globalFacilitatorCautions, objectives } = req.body;
    if (!Array.isArray(agenda)) {
      return res.status(400).json({ error: 'agenda must be an array' });
    }

    session.agenda = agenda;
    session.preFlightChecklist = Array.isArray(preFlightChecklist) ? preFlightChecklist : [];
    session.globalFacilitatorCautions = Array.isArray(globalFacilitatorCautions) ? globalFacilitatorCautions : [];
    if (Array.isArray(objectives)) session.objectives = objectives;
    session.markModified('agenda');
    session.markModified('preFlightChecklist');
    session.markModified('globalFacilitatorCautions');
    if (Array.isArray(objectives)) session.markModified('objectives');
    await session.save();

    res.json({
      ok: true,
      segmentCount: session.agenda.length,
      totalMin: session.agenda.reduce((sum, s) => sum + (s.durationMin || 0), 0)
    });
  } catch (err) {
    console.error('[live] ros commit:', err.message);
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

// GET /api/live-sessions/:id/host-state — host-only counterpart to toPublicJSON.
// Returns the full facilitator payload (speaker notes, activity instructions,
// per-segment + global cautions, polls, checklists, scratchpad) for the Host
// Console. NEVER exposed to non-admin viewers, and does NOT modify toPublicJSON
// or the public GET /:id. Writes to hostScratchpad/hostChecklist go through the
// existing PATCH /:id — no new write route here.
router.get('/:id/host-state', protect, requireAdmin, async (req, res) => {
  try {
    const session = await findByIdOrSlug(req.params.id);
    if (!session) return res.status(404).json({ error: 'Session not found' });

    res.json({
      status: session.status,
      alarmLeadSec: session.alarmLeadSec ?? 60,
      attendanceThresholdPct: session.attendanceThresholdPct,
      certificatesIssuedAt: session.certificatesIssuedAt || null,
      autopilot: {
        enabled: !!session.autopilot?.enabled,
        startedAt: session.autopilot?.startedAt || null,
        pausedAt: session.autopilot?.pausedAt || null
      },
      agenda: (session.agenda || []).map(seg => ({
        order: seg.order,
        type: seg.type,
        title: seg.title,
        durationMin: seg.durationMin,
        prompt: seg.prompt,
        clipIndex: seg.clipIndex,
        speakerNotes: seg.speakerNotes,
        activityInstructions: seg.activityInstructions,
        facilitatorCautions: seg.facilitatorCautions || [],
        polls: seg.polls || [],
        media: seg.media || []
      })),
      hostScratchpad: session.hostScratchpad || '',
      hostChecklist: session.hostChecklist || [],
      preFlightChecklist: session.preFlightChecklist || [],
      globalFacilitatorCautions: session.globalFacilitatorCautions || []
    });
  } catch (err) {
    console.error('[live] host-state:', err.message);
    res.status(500).json({ error: 'Failed to load host state' });
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

// POST /api/live-sessions/series/:seriesId/issue-certificates
// Series-level batch issuance. Returns { notReady: true, pendingSessions: [...] }
// if any required session hasn't completed yet, rather than issuing partial certs.
router.post('/series/:seriesId/issue-certificates', protect, requireAdmin, async (req, res) => {
  try {
    const result = await issueSeriesCertificates(req.params.seriesId);
    res.json(result);
  } catch (err) {
    console.error('[live] series issue-certificates:', err.message);
    res.status(400).json({ error: err.message });
  }
});

/* ════════════════════════ WATCH PARTY — ATTENDEE ════════════════════════ */

// GET /api/live-sessions/:id/live-state — lean poll endpoint (3s interval)
router.get('/:id/live-state', protect, async (req, res) => {
  try {
    const session = await LiveSession.findById(req.params.id)
      .select('liveState agenda pollResponses status scheduledStart scheduledEnd registrants attendance breaks alarmLeadSec hostScratchpad hostChecklist globalFacilitatorCautions preFlightChecklist')
      .lean();
    if (!session) return res.status(404).json({ error: 'Session not found' });

    const isAdmin = req.user.role === 'admin';
    const registered = session.registrants.some(
      r => r.user && r.user.toString() === req.user._id.toString()
    );
    if (!isAdmin && !registered) {
      return res.status(403).json({ error: 'Not registered for this session.' });
    }

    const seg = session.agenda?.[session.liveState?.currentSegment ?? 0] ?? null;
    // Host-only fields — strip before sending to non-admin viewers.
    // Attendees only see: title, type, durationMin, prompt (public discussion prompt).
    // Everything else is facilitator-internal.
    const segOut = seg && !isAdmin
      ? {
          ...seg,
          speakerNotes: undefined,
          activityInstructions: undefined,
          facilitatorCautions: undefined,
          polls: undefined,
          // breakoutPrompts stay for the attendee ONLY while this is a breakout
          // segment (they need the prompts to run their group); stripped otherwise.
          breakoutPrompts: seg.type === 'breakout' ? seg.breakoutPrompts : undefined,
          exercise: undefined
          // media (slide images) is public — intentionally NOT stripped.
        }
      : seg;

    const payload = {
      liveState: session.liveState,
      currentSegment: segOut,
      agendaLength: session.agenda?.length || 0,
      isHost: isAdmin,
      status: session.status,
      scheduledStart: session.scheduledStart,
      scheduledEnd: session.scheduledEnd
    };

    // Active poll — exposed to attendees ONLY while launched (never the full
    // agenda polls array). Results included for host always, for attendees only
    // once revealed.
    const ap = session.liveState?.activePoll;
    if (ap && ap.segIdx != null && ap.pollIdx != null && ap.launchedAt) {
      const poll = session.agenda?.[ap.segIdx]?.polls?.[ap.pollIdx];
      if (poll) {
        const myVote = (session.pollResponses || []).find(r =>
          r.userId && r.userId.toString() === req.user._id.toString() &&
          r.segIdx === ap.segIdx && r.pollIdx === ap.pollIdx);
        const out = {
          segIdx: ap.segIdx,
          pollIdx: ap.pollIdx,
          question: poll.question,
          options: (poll.options || []).map(o => ({ text: o.text })),
          launchedAt: ap.launchedAt,
          closedAt: ap.closedAt || null,
          revealed: !!ap.revealed,
          myOptionIdx: myVote ? myVote.optionIdx : null
        };
        if (isAdmin || ap.revealed) {
          out.results = tallyPoll(session.pollResponses, ap.segIdx, ap.pollIdx, poll.options?.length || 0);
        }
        payload.activePoll = out;
      }
    }

    // Live game — host gets the full state; attendees get a redacted copy so
    // unrevealed jeopardy clues / clue columns / feud answers never leak.
    const game = session.liveState?.game;
    if (game && game.type && game.type !== 'none') {
      payload.game = isAdmin ? game : redactGameForAttendee(game);
    }

    // Per-user check-in status — every attendee gets their own, not host-only
    const myAtt = (session.attendance || []).find(
      a => a.user && a.user.toString() === req.user._id.toString() && !a.leftAt
    );
    if (myAtt) {
      const lastCheckin = myAtt.checkins?.[myAtt.checkins.length - 1];
      payload.myCheckin = {
        cameraOptOut: !!myAtt.cameraOptOut,
        removed: !!myAtt.removedForMissedCheckins,
        pending: (lastCheckin && !lastCheckin.respondedAt && !lastCheckin.missed)
          ? { promptedAt: lastCheckin.promptedAt, deadline: lastCheckin.deadline }
          : null,
        justMissedWarning: !!(lastCheckin && lastCheckin.missed && myAtt.consecutiveMissedCheckins === 1)
      };
    }

    if (isAdmin) {
      payload.agenda = session.agenda || [];
      payload.breaks = session.breaks || [];
      payload.alarmLeadSec = session.alarmLeadSec ?? 60;
      payload.hostScratchpad = session.hostScratchpad || '';
      payload.hostChecklist = session.hostChecklist || [];
      payload.globalFacilitatorCautions = session.globalFacilitatorCautions || [];
      payload.preFlightChecklist = session.preFlightChecklist || [];
      payload.currentlyPresent = (session.attendance || [])
        .filter(a => !a.leftAt)
        .map(a => a.displayName || 'Unnamed attendee');
      // Recent missed check-ins, for host awareness (last 5 min)
      const fiveMinAgo = Date.now() - 5 * 60000;
      payload.checkinAlerts = (session.attendance || [])
        .filter(a => a.checkins?.some(c => c.missed && new Date(c.deadline).getTime() > fiveMinAgo))
        .map(a => ({ displayName: a.displayName || 'Unnamed attendee', removed: !!a.removedForMissedCheckins }));
    }

    res.json(payload);
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

// POST /api/live-sessions/:id/camera-status — attendee toggles their own camera-off status
router.post('/:id/camera-status', protect, async (req, res) => {
  try {
    const session = await LiveSession.findById(req.params.id);
    if (!session) return res.status(404).json({ error: 'Session not found' });

    const att = session.attendance.find(
      a => a.user && a.user.toString() === req.user._id.toString() && !a.leftAt
    );
    if (!att) return res.status(403).json({ error: 'Not currently checked in to this session.' });

    att.cameraOptOut = !!req.body.cameraOptOut;
    if (att.cameraOptOut && !att.nextCheckinDueAt) {
      const gapMin = 15 + Math.random() * 5;
      att.nextCheckinDueAt = new Date(Date.now() + gapMin * 60000);
    }
    if (!att.cameraOptOut) {
      // Neutralize any outstanding challenge — no penalty for turning camera back on
      const last = att.checkins[att.checkins.length - 1];
      if (last && !last.respondedAt && !last.missed) last.respondedAt = new Date();
      att.nextCheckinDueAt = undefined;
    }
    session.markModified('attendance');
    await session.save();
    res.json({ cameraOptOut: att.cameraOptOut });
  } catch (err) {
    console.error('[live] camera-status:', err.message);
    res.status(500).json({ error: 'Failed to update camera status' });
  }
});

// POST /api/live-sessions/:id/checkin/respond — attendee answers a pending check-in
router.post('/:id/checkin/respond', protect, async (req, res) => {
  try {
    const session = await LiveSession.findById(req.params.id);
    if (!session) return res.status(404).json({ error: 'Session not found' });

    const att = session.attendance.find(
      a => a.user && a.user.toString() === req.user._id.toString() && !a.leftAt
    );
    if (!att) return res.status(403).json({ error: 'Not currently checked in to this session.' });

    const last = att.checkins[att.checkins.length - 1];
    if (last && !last.respondedAt) {
      last.respondedAt = new Date();
      att.consecutiveMissedCheckins = 0;
      att.nextCheckinDueAt = new Date(Date.now() + (15 + Math.random() * 5) * 60000);
      session.markModified('attendance');
      await session.save();
    }
    res.json({ ok: true });
  } catch (err) {
    console.error('[live] checkin respond:', err.message);
    res.status(500).json({ error: 'Failed to record check-in response' });
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

/* ════════════════════════ NATIVE POLLS ════════════════════════ */

// Returns the poll subdoc at agenda[segIdx].polls[pollIdx], or null.
function findPoll(session, segIdx, pollIdx) {
  return session.agenda?.[segIdx]?.polls?.[pollIdx] || null;
}

// POST /:id/poll/launch — host opens voting on a segment's poll
router.post('/:id/poll/launch', protect, requireAdmin, async (req, res) => {
  try {
    const { segIdx, pollIdx } = req.body;
    if (typeof segIdx !== 'number' || typeof pollIdx !== 'number') {
      return res.status(400).json({ error: 'segIdx and pollIdx must be numbers.' });
    }
    const session = await LiveSession.findById(req.params.id);
    if (!session) return res.status(404).json({ error: 'Session not found' });
    if (!findPoll(session, segIdx, pollIdx)) {
      return res.status(404).json({ error: 'No poll at that segment/poll index.' });
    }
    session.liveState = {
      ...(session.liveState?.toObject?.() ?? session.liveState ?? {}),
      activePoll: { segIdx, pollIdx, launchedAt: new Date(), closedAt: null, revealed: false }
    };
    session.markModified('liveState');
    await session.save();
    res.json({ activePoll: session.liveState.activePoll });
  } catch (err) {
    console.error('[live] poll launch:', err.message);
    res.status(500).json({ error: 'Failed to launch poll' });
  }
});

// POST /:id/poll/close — host stops accepting votes on the active poll
router.post('/:id/poll/close', protect, requireAdmin, async (req, res) => {
  try {
    const { segIdx, pollIdx } = req.body;
    const session = await LiveSession.findById(req.params.id);
    if (!session) return res.status(404).json({ error: 'Session not found' });
    const ap = session.liveState?.activePoll;
    if (!ap || ap.segIdx !== segIdx || ap.pollIdx !== pollIdx) {
      return res.status(400).json({ error: 'That poll is not the active poll.' });
    }
    ap.closedAt = ap.closedAt || new Date();
    session.markModified('liveState');
    await session.save();
    res.json({ activePoll: session.liveState.activePoll });
  } catch (err) {
    console.error('[live] poll close:', err.message);
    res.status(500).json({ error: 'Failed to close poll' });
  }
});

// POST /:id/poll/reveal — host makes results visible to attendees
router.post('/:id/poll/reveal', protect, requireAdmin, async (req, res) => {
  try {
    const { segIdx, pollIdx } = req.body;
    const session = await LiveSession.findById(req.params.id);
    if (!session) return res.status(404).json({ error: 'Session not found' });
    const ap = session.liveState?.activePoll;
    if (!ap || ap.segIdx !== segIdx || ap.pollIdx !== pollIdx) {
      return res.status(400).json({ error: 'That poll is not the active poll.' });
    }
    ap.revealed = true;
    session.markModified('liveState');
    await session.save();
    res.json({ activePoll: session.liveState.activePoll });
  } catch (err) {
    console.error('[live] poll reveal:', err.message);
    res.status(500).json({ error: 'Failed to reveal poll' });
  }
});

// POST /:id/poll/vote — attendee casts ONE vote on the active poll (idempotent)
router.post('/:id/poll/vote', protect, async (req, res) => {
  try {
    const { segIdx, pollIdx, optionIdx } = req.body;
    if ([segIdx, pollIdx, optionIdx].some(n => typeof n !== 'number')) {
      return res.status(400).json({ error: 'segIdx, pollIdx and optionIdx must be numbers.' });
    }
    const session = await LiveSession.findById(req.params.id).select('liveState agenda registrants');
    if (!session) return res.status(404).json({ error: 'Session not found' });
    if (!session.isRegistered(req.user._id)) {
      return res.status(403).json({ error: 'You are not registered for this session.' });
    }
    const ap = session.liveState?.activePoll;
    if (!ap || ap.segIdx !== segIdx || ap.pollIdx !== pollIdx || !ap.launchedAt) {
      return res.status(400).json({ error: 'That poll is not open for voting.' });
    }
    if (ap.closedAt && Date.now() >= new Date(ap.closedAt).getTime()) {
      return res.status(400).json({ error: 'Voting is closed for this poll.' });
    }
    const poll = findPoll(session, segIdx, pollIdx);
    if (!poll) return res.status(404).json({ error: 'Poll not found.' });
    if (optionIdx < 0 || optionIdx >= (poll.options?.length || 0)) {
      return res.status(400).json({ error: 'Invalid option.' });
    }

    // Atomic idempotent write: push only if this user has no vote yet for this
    // (segIdx, pollIdx). No load-modify-save, so concurrent voters never race.
    const result = await LiveSession.updateOne(
      { _id: session._id, pollResponses: { $not: { $elemMatch: { userId: req.user._id, segIdx, pollIdx } } } },
      { $push: { pollResponses: { userId: req.user._id, segIdx, pollIdx, optionIdx, at: new Date() } } }
    );
    res.json({ recorded: true, alreadyVoted: result.modifiedCount === 0 });
  } catch (err) {
    console.error('[live] poll vote:', err.message);
    res.status(500).json({ error: 'Failed to record vote' });
  }
});

// GET /:id/poll/results — admin: active poll, or any (segIdx,pollIdx) via query
// (used by the host TREND view). Registrant: active poll only, once revealed.
router.get('/:id/poll/results', protect, async (req, res) => {
  try {
    const session = await LiveSession.findById(req.params.id)
      .select('liveState agenda pollResponses registrants').lean();
    if (!session) return res.status(404).json({ error: 'Session not found' });
    const isAdmin = req.user.role === 'admin';
    const registered = (session.registrants || []).some(r => r.user && r.user.toString() === req.user._id.toString());
    if (!isAdmin && !registered) return res.status(403).json({ error: 'Not registered for this session.' });

    const ap = session.liveState?.activePoll || null;
    let segIdx, pollIdx;
    if (isAdmin && req.query.segIdx != null && req.query.pollIdx != null) {
      segIdx = parseInt(req.query.segIdx, 10);
      pollIdx = parseInt(req.query.pollIdx, 10);
    } else if (ap) {
      segIdx = ap.segIdx; pollIdx = ap.pollIdx;
    } else {
      return res.json({ activePoll: null, results: null });
    }

    const poll = session.agenda?.[segIdx]?.polls?.[pollIdx];
    if (!poll) return res.status(404).json({ error: 'Poll not found.' });

    // Registrant may only see results for the ACTIVE poll and only once revealed.
    if (!isAdmin && (!ap || ap.segIdx !== segIdx || ap.pollIdx !== pollIdx || !ap.revealed)) {
      return res.status(403).json({ error: 'Results are not available yet.' });
    }

    res.json({
      activePoll: ap,
      segIdx, pollIdx,
      question: poll.question,
      options: (poll.options || []).map(o => ({ text: o.text })),
      results: tallyPoll(session.pollResponses, segIdx, pollIdx, poll.options?.length || 0)
    });
  } catch (err) {
    console.error('[live] poll results:', err.message);
    res.status(500).json({ error: 'Failed to load poll results' });
  }
});

/* ════════════════════════ LIVE SESSION GAMES ════════════════════════════ */
// Host-launched interactive games. State lives in liveState.game (Mixed), built
// by buildInitialGameState() and mutated by applyGameAction() — both pure
// helpers defined in the helpers section below. Attendees receive a redacted
// copy of the state via redactGameForAttendee() on the live-state route so
// unrevealed jeopardy clues / clue columns / feud answers never leak.

// POST /:id/game/launch — host starts a game (replaces any running game)
router.post('/:id/game/launch', protect, requireAdmin, async (req, res) => {
  try {
    const { type, config } = req.body || {};
    if (!['randomizer', 'timer', 'jeopardy', 'clue', 'feud'].includes(type)) {
      return res.status(400).json({ error: 'Unknown game type.' });
    }
    const session = await LiveSession.findById(req.params.id);
    if (!session) return res.status(404).json({ error: 'Session not found' });

    const state = buildInitialGameState(type, config || {}, session);
    session.liveState = {
      ...(session.liveState?.toObject?.() ?? session.liveState ?? {}),
      game: { type, state }
    };
    session.markModified('liveState');
    await session.save();
    res.json({ game: session.liveState.game });
  } catch (err) {
    console.error('[live] game launch:', err.message);
    res.status(400).json({ error: err.message || 'Failed to launch game' });
  }
});

// POST /:id/game/action — host mutates the running game's state
router.post('/:id/game/action', protect, requireAdmin, async (req, res) => {
  try {
    const { action, payload } = req.body || {};
    if (typeof action !== 'string' || !action) {
      return res.status(400).json({ error: 'action is required.' });
    }
    const session = await LiveSession.findById(req.params.id);
    if (!session) return res.status(404).json({ error: 'Session not found' });
    const game = session.liveState?.game;
    if (!game || game.type === 'none') {
      return res.status(400).json({ error: 'No game is running.' });
    }

    applyGameAction(game, action, payload || {});
    session.markModified('liveState');
    await session.save();

    // Randomizer 'spin' resolves server-side after 2s (deceleration illusion),
    // so the pick is authoritative and identical for host + every attendee.
    if (game.type === 'randomizer' && action === 'spin') {
      const chosen = (game.state.names && game.state.names.length)
        ? Math.floor(Math.random() * game.state.names.length) : null;
      const sessionId = session._id;
      setTimeout(async () => {
        try {
          const s2 = await LiveSession.findById(sessionId);
          const g2 = s2?.liveState?.game;
          if (g2 && g2.type === 'randomizer' && g2.state.spinning) {
            g2.state.spinning = false;
            g2.state.pickedIndex = chosen;
            s2.markModified('liveState');
            await s2.save();
          }
        } catch { /* game may have been closed mid-spin — ignore */ }
      }, 2000);
    }

    res.json({ game: session.liveState.game });
  } catch (err) {
    console.error('[live] game action:', err.message);
    res.status(400).json({ error: err.message || 'Failed to apply game action' });
  }
});

// POST /:id/game/close — host ends the running game
router.post('/:id/game/close', protect, requireAdmin, async (req, res) => {
  try {
    const session = await LiveSession.findById(req.params.id);
    if (!session) return res.status(404).json({ error: 'Session not found' });
    session.liveState = {
      ...(session.liveState?.toObject?.() ?? session.liveState ?? {}),
      game: { type: 'none', state: {} }
    };
    session.markModified('liveState');
    await session.save();
    res.json({ game: session.liveState.game });
  } catch (err) {
    console.error('[live] game close:', err.message);
    res.status(500).json({ error: 'Failed to close game' });
  }
});

/* ════════════════════════ SEGMENT SLIDES (media) ════════════════════════ */

// POST /:id/agenda/:segIdx/media — upload a PNG/JPG slide to a segment
router.post('/:id/agenda/:segIdx/media', protect, requireAdmin, (req, res, next) => {
  slideUpload.single('file')(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.message });
    next();
  });
}, async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file provided' });
    const segIdx = parseInt(req.params.segIdx, 10);
    const session = await LiveSession.findById(req.params.id);
    if (!session) return res.status(404).json({ error: 'Session not found' });
    if (session.sessionType === 'supervision') {
      return res.status(403).json({ error: 'Slides are not permitted on supervision sessions.' });
    }
    const seg = session.agenda?.[segIdx];
    if (!seg) return res.status(404).json({ error: 'Segment not found.' });

    const folder = `counselorready/live-sessions/${session._id}/slides`;
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.v2.uploader.upload_stream(
        { folder, resource_type: 'image', public_id: `slide_${segIdx}_${Date.now()}` },
        (e, r) => (e ? reject(e) : resolve(r))
      );
      const readable = new Readable();
      readable.push(req.file.buffer);
      readable.push(null);
      readable.pipe(stream);
    });

    if (!seg.media) seg.media = [];
    seg.media.push({ url: result.secure_url, publicId: result.public_id, caption: (req.body.caption || '').trim() });
    session.markModified('agenda');
    await session.save();
    res.status(201).json({ media: seg.media, segIdx });
  } catch (err) {
    console.error('[live] slide upload:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// DELETE /:id/agenda/:segIdx/media/:mediaIdx — remove a slide (best-effort Cloudinary destroy)
router.delete('/:id/agenda/:segIdx/media/:mediaIdx', protect, requireAdmin, async (req, res) => {
  try {
    const segIdx = parseInt(req.params.segIdx, 10);
    const mediaIdx = parseInt(req.params.mediaIdx, 10);
    const session = await LiveSession.findById(req.params.id);
    if (!session) return res.status(404).json({ error: 'Session not found' });
    const seg = session.agenda?.[segIdx];
    if (!seg || !Array.isArray(seg.media) || !seg.media[mediaIdx]) {
      return res.status(404).json({ error: 'Slide not found.' });
    }
    const [removed] = seg.media.splice(mediaIdx, 1);
    session.markModified('agenda');
    try {
      if (removed?.publicId) await cloudinary.v2.uploader.destroy(removed.publicId, { resource_type: 'image' });
    } catch (e) {
      console.error('[live] slide destroy (non-fatal):', e.message);
    }
    await session.save();
    res.json({ media: seg.media });
  } catch (err) {
    console.error('[live] slide delete:', err.message);
    res.status(500).json({ error: err.message });
  }
});

/* ════════════════════════ BULK CONTENT LOADER ════════════════════════ */

const AI_ROUTE_SYSTEM_PROMPT = 'You are routing slide image files to the correct segments of a CE course. Match each filename to the most appropriate segment index based on the segment titles provided. Return only a JSON array with no other text.';

// Ask Claude to map slide filenames → agenda segment indexes. Returns the parsed
// JSON array [{ filename, segmentIndex, confidence, reason }] (one entry per
// filename). Shared by the POST /ai-route proxy AND the URL path in
// /:id/fetch-and-load so both routing entry points share one implementation.
// The ANTHROPIC_API_KEY never leaves the server — the browser calls the proxy.
async function aiRouteSlides(segments, filenames) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY not configured');
  const names = (filenames || []).map(f => String(f || '').trim()).filter(Boolean);
  if (!names.length) return [];

  const segLines = (segments || [])
    .map((s, i) => `${(s.segmentIndex ?? s.index ?? i)}: ${s.title || '(untitled)'}`)
    .join('\n');
  const userPrompt =
    `Course segments (index: title):\n${segLines || '(no segments)'}\n\n` +
    `Slide filenames:\n${names.map(n => `- ${n}`).join('\n')}\n\n` +
    'Return ONLY a JSON array, one object per slide filename, shaped exactly ' +
    '[{"filename": string, "segmentIndex": number, "confidence": number (0-1), "reason": string}].';

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 1000,
      system: AI_ROUTE_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userPrompt }],
    }),
  });
  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw new Error(`Anthropic API error ${response.status}: ${detail.slice(0, 200)}`);
  }
  const data = await response.json();
  const text = (data.content || []).map(c => c.text || '').join('').trim();
  // Isolate the JSON array in case the model wraps it in prose/fencing.
  const start = text.indexOf('[');
  const end = text.lastIndexOf(']');
  if (start < 0 || end < 0) throw new Error('AI routing did not return a JSON array.');
  return JSON.parse(text.slice(start, end + 1));
}

// Manifest/tabbed-loader contract: route arbitrary content files (slides AND
// handouts) to segments, honoring a per-file hint. Additive — the older
// aiRouteSlides above is untouched and still serves the drop/paste path.
const AI_ROUTE_ITEMS_SYSTEM_PROMPT = 'You are routing content files to CE course segments. Match each file to the most appropriate segment index. Return ONLY a JSON array: [{filename, segmentIndex, confidence, reason}]. No other text.';

// Ask Claude to map content items → segment indexes given segment titles and an
// optional per-file hint. Body items: [{ filename, hint }]. segmentTitles:
// [{ idx, title }]. Returns [{ filename, segmentIndex, confidence, reason }].
async function aiRouteContentItems(segmentTitles, items) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY not configured');
  const list = (items || [])
    .map(it => ({ filename: String(it?.filename || '').trim(), hint: String(it?.hint || '').trim() }))
    .filter(it => it.filename);
  if (!list.length) return [];

  const segLines = (segmentTitles || [])
    .map((s, i) => `${(s.idx ?? s.segmentIndex ?? i)}: ${s.title || '(untitled)'}`)
    .join('\n');
  const userPrompt =
    `Course segments (index: title):\n${segLines || '(no segments)'}\n\n` +
    `Files to route:\n${list.map(it => `- ${it.filename}${it.hint ? ` (hint: ${it.hint})` : ''}`).join('\n')}\n\n` +
    'Return ONLY a JSON array, one object per file, shaped exactly ' +
    '[{"filename": string, "segmentIndex": number, "confidence": number (0-1), "reason": string}].';

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 1000,
      system: AI_ROUTE_ITEMS_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userPrompt }],
    }),
  });
  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw new Error(`Anthropic API error ${response.status}: ${detail.slice(0, 200)}`);
  }
  const data = await response.json();
  const text = (data.content || []).map(c => c.text || '').join('').trim();
  const start = text.indexOf('[');
  const end = text.lastIndexOf(']');
  if (start < 0 || end < 0) throw new Error('AI routing did not return a JSON array.');
  return JSON.parse(text.slice(start, end + 1));
}

// Classify a server-fetched asset as a slide (PNG/JPG) or handout
// (PDF/DOCX/PPTX/XLSX), from its Content-Type first, then its URL extension.
// Images always sort to slides. Returns null for anything unsupported.
function classifyFetchedAsset(contentType, filename) {
  const ct = (contentType || '').split(';')[0].trim().toLowerCase();
  const ext = (filename.split('.').pop() || '').toLowerCase();
  if (ct === 'image/png' || ct === 'image/jpeg' || ext === 'png' || ext === 'jpg' || ext === 'jpeg') {
    return { category: 'slide' };
  }
  const HANDOUT_EXT = { pdf: 'pdf', docx: 'docx', pptx: 'pptx', xlsx: 'xlsx' };
  if (HANDOUT_MIME_TO_TYPE[ct] && HANDOUT_MIME_TO_TYPE[ct] !== 'png' && HANDOUT_MIME_TO_TYPE[ct] !== 'jpg') {
    return { category: 'handout', fileType: HANDOUT_MIME_TO_TYPE[ct] };
  }
  if (HANDOUT_EXT[ext]) return { category: 'handout', fileType: HANDOUT_EXT[ext] };
  return null;
}

// Upload a Buffer to Cloudinary via the same memory-stream pattern the handout
// and slide routes use. Kept independent so those routes stay untouched.
function uploadBufferToCloudinary(buffer, folder, resourceType, publicId) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.v2.uploader.upload_stream(
      { folder, resource_type: resourceType, public_id: publicId, use_filename: false },
      (err, r) => (err ? reject(err) : resolve(r))
    );
    const readable = new Readable();
    readable.push(buffer);
    readable.push(null);
    readable.pipe(stream);
  });
}

// POST /api/live-sessions/ai-route — thin admin-only proxy to Anthropic so the
// ANTHROPIC_API_KEY is never exposed to the frontend. Accepts either contract:
//   • manifest/tabbed loader: { segmentTitles:[{idx,title}], items:[{filename,hint}] }
//   • drop/paste (original):  { segments:[{index/segmentIndex,title}], filenames:[String] }
// Both return { routing:[{ filename, segmentIndex, confidence, reason }] }.
router.post('/ai-route', protect, requireAdmin, async (req, res) => {
  try {
    const { segments, filenames, segmentTitles, items } = req.body || {};
    const routing = (Array.isArray(items) || Array.isArray(segmentTitles))
      ? await aiRouteContentItems(segmentTitles || [], items || [])
      : await aiRouteSlides(segments || [], filenames || []);
    res.json({ routing });
  } catch (err) {
    console.error('[live] ai-route:', err.message);
    res.status(502).json({ error: err.message });
  }
});

// POST /api/live-sessions/:id/fetch-and-load — server-side fetch of a list of
// URLs (Cloudinary/Drive/output links). Each URL is classified as a slide or a
// handout, slides are AI-routed to agenda segments, and everything is uploaded
// without the browser ever downloading or re-uploading a byte. Returns the same
// summary shape as the client-side Load All path.
router.post('/:id/fetch-and-load', protect, requireAdmin, async (req, res) => {
  try {
    const session = await findByIdOrSlug(req.params.id);
    if (!session) return res.status(404).json({ error: 'Session not found' });
    // HIPAA hard-lock: no external content on supervision sessions (no Cloudinary BAA).
    if (session.sessionType === 'supervision') {
      return res.status(403).json({ error: 'Bulk content load is not permitted on supervision sessions.' });
    }

    // ── Explicit-items contract (manifest / tabbed loader) ──
    // Body: { items: [{ url, type:'slide'|'handout', segmentIndex?, label? }] }.
    // The client has already resolved type + segment (via /ai-route), so each
    // URL is fetched server-side and piped straight to the right upload path.
    // Returns { loaded:[{url,type,segmentIndex?,handoutId?}], errors:[{url,error}] }.
    if (Array.isArray(req.body?.items)) {
      const loaded = [];
      const errors = [];
      const HANDOUT_EXT = { pdf: 'pdf', docx: 'docx', pptx: 'pptx', xlsx: 'xlsx', png: 'png', jpg: 'jpg', jpeg: 'jpg' };
      for (const it of req.body.items) {
        const url = String(it?.url || '').trim();
        if (!url) { errors.push({ url: '', error: 'Missing url' }); continue; }
        try {
          const controller = new AbortController();
          const tid = setTimeout(() => controller.abort(), 30000);
          const r = await fetch(url, { signal: controller.signal });
          clearTimeout(tid);
          if (!r.ok) throw new Error(`HTTP ${r.status}`);
          const buf = Buffer.from(await r.arrayBuffer());
          const name = (decodeURIComponent(url.split('?')[0].split('/').pop() || '') || 'file').trim() || 'file';

          if (it.type === 'slide') {
            const segIdx = Number(it.segmentIndex);
            const seg = session.agenda?.[segIdx];
            if (!Number.isInteger(segIdx) || !seg) { errors.push({ url, error: `Segment ${it.segmentIndex} not found` }); continue; }
            const result = await uploadBufferToCloudinary(
              buf, `counselorready/live-sessions/${session._id}/slides`, 'image', `slide_${segIdx}_${Date.now()}`
            );
            if (!seg.media) seg.media = [];
            seg.media.push({ url: result.secure_url, publicId: result.public_id, caption: name });
            session.markModified('agenda');
            loaded.push({ url, type: 'slide', segmentIndex: segIdx });
          } else {
            const ct = (r.headers.get('content-type') || '').split(';')[0].trim().toLowerCase();
            const fileType = (HANDOUT_MIME_TO_TYPE[ct]) || HANDOUT_EXT[(name.split('.').pop() || '').toLowerCase()];
            if (!fileType) { errors.push({ url, error: 'Unsupported handout type' }); continue; }
            const result = await uploadBufferToCloudinary(
              buf, `counselorready/live-sessions/${session._id}`, 'raw', `handout_${Date.now()}`
            );
            const fileUrl = result.secure_url.replace('/upload/', '/upload/fl_attachment/');
            session.handouts.push({
              title: (it.label || '').trim() || name.replace(/\.[^.]+$/, ''),
              cloudinaryPublicId: result.public_id,
              fileUrl,
              fileType,
              sizeKB: Math.round(result.bytes / 1024),
              availability: 'during',
            });
            const handout = session.handouts[session.handouts.length - 1];
            loaded.push({ url, type: 'handout', handoutId: handout._id });
          }
        } catch (e) {
          errors.push({ url, error: e.message });
        }
      }
      await session.save();
      return res.json({ loaded, errors });
    }

    const urls = (req.body?.urls || []).map(u => String(u || '').trim()).filter(Boolean);
    if (!urls.length) return res.status(400).json({ error: 'Provide at least one URL.' });

    const errors = [];
    const fetched = [];
    for (const url of urls) {
      try {
        const controller = new AbortController();
        const tid = setTimeout(() => controller.abort(), 30000);
        const r = await fetch(url, { signal: controller.signal });
        clearTimeout(tid);
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const buf = Buffer.from(await r.arrayBuffer());
        const name = (decodeURIComponent(url.split('?')[0].split('/').pop() || '') || 'file').trim() || 'file';
        const kind = classifyFetchedAsset(r.headers.get('content-type'), name);
        if (!kind) { errors.push(`${name}: unsupported type — skipped.`); continue; }
        fetched.push({ url, name, buf, ...kind });
      } catch (e) {
        errors.push(`${url}: ${e.message}`);
      }
    }

    const slideAssets = fetched.filter(f => f.category === 'slide');
    const handoutAssets = fetched.filter(f => f.category === 'handout');

    // AI-route the fetched slides against the (already-committed) agenda titles.
    let routing = [];
    const agendaLen = (session.agenda || []).length;
    if (slideAssets.length && agendaLen) {
      const segments = (session.agenda || []).map((s, i) => ({ segmentIndex: i, title: s.title || '' }));
      try {
        routing = await aiRouteSlides(segments, slideAssets.map(s => s.name));
      } catch (e) {
        errors.push(`AI routing failed: ${e.message}`);
      }
    }
    const routeFor = (filename) => {
      const hit = routing.find(r => r.filename === filename);
      const idx = hit ? Number(hit.segmentIndex) : NaN;
      const conf = hit ? Number(hit.confidence) : 0;
      if (Number.isInteger(idx) && idx >= 0 && idx < agendaLen && conf >= 0.8) return idx;
      return null;
    };

    let slidesLoaded = 0;
    const segmentsTouched = new Set();
    for (const s of slideAssets) {
      const segIdx = routeFor(s.name);
      if (segIdx == null) { errors.push(`${s.name}: no confident segment match — skipped.`); continue; }
      const seg = session.agenda?.[segIdx];
      if (!seg) { errors.push(`${s.name}: segment ${segIdx} not found — skipped.`); continue; }
      try {
        const result = await uploadBufferToCloudinary(
          s.buf, `counselorready/live-sessions/${session._id}/slides`, 'image', `slide_${segIdx}_${Date.now()}`
        );
        if (!seg.media) seg.media = [];
        seg.media.push({ url: result.secure_url, publicId: result.public_id, caption: s.name });
        slidesLoaded++;
        segmentsTouched.add(segIdx);
      } catch (e) { errors.push(`${s.name}: upload failed (${e.message})`); }
    }
    if (slidesLoaded) session.markModified('agenda');

    let handoutsLoaded = 0;
    for (const h of handoutAssets) {
      try {
        const result = await uploadBufferToCloudinary(
          h.buf, `counselorready/live-sessions/${session._id}`, 'raw', `handout_${Date.now()}`
        );
        const fileUrl = result.secure_url.replace('/upload/', '/upload/fl_attachment/');
        session.handouts.push({
          title: h.name.replace(/\.[^.]+$/, ''),
          cloudinaryPublicId: result.public_id,
          fileUrl,
          fileType: h.fileType,
          sizeKB: Math.round(result.bytes / 1024),
          availability: 'during',
        });
        handoutsLoaded++;
      } catch (e) { errors.push(`${h.name}: upload failed (${e.message})`); }
    }

    await session.save();

    res.json({
      summary: {
        slidesLoaded,
        segmentsTouched: segmentsTouched.size,
        handoutsLoaded,
        skipped: errors.length,
      },
      errors,
      handouts: session.handouts,
      agenda: session.agenda,
    });
  } catch (err) {
    console.error('[live] fetch-and-load:', err.message);
    res.status(500).json({ error: err.message });
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
// Tally votes for one poll into per-option counts + total. Pure function so it
// can be reused by the live-state and poll/results routes.
function tallyPoll(pollResponses, segIdx, pollIdx, optionCount) {
  const counts = new Array(optionCount).fill(0);
  let total = 0;
  for (const r of (pollResponses || [])) {
    if (r.segIdx === segIdx && r.pollIdx === pollIdx && r.optionIdx >= 0 && r.optionIdx < optionCount) {
      counts[r.optionIdx]++;
      total++;
    }
  }
  return { counts, total };
}

async function findByIdOrSlug(idOrSlug) {
  if (/^[0-9a-fA-F]{24}$/.test(idOrSlug)) {
    const byId = await LiveSession.findById(idOrSlug);
    if (byId) return byId;
  }
  return LiveSession.findOne({ slug: idOrSlug.toLowerCase() });
}

/* ── Live game helpers ─────────────────────────────────────────────────── */

// Current live attendee display names (used to seed the randomizer wheel).
function liveAttendeeNames(session) {
  return (session.attendance || [])
    .filter(a => !a.leftAt)
    .map(a => a.displayName || 'Unnamed attendee');
}

const JEOPARDY_DEFAULT_CATEGORIES = ['Statute', 'Confidentiality', 'Competence', 'Supervision', 'Advertising'];
const JEOPARDY_VALUES = [100, 200, 300, 400, 500];

const FEUD_DEFAULT_QUESTIONS = [
  'Name something a licensee tells themselves before skipping documentation.',
  'Name a reason a licensee gives for not updating their board address.',
  'Name a way 43-10A-17(a)(6) surprises experienced clinicians.',
  'Name a common misunderstanding about the competence rule.',
  'Name something supervisors assume protects them from liability.'
];
const FEUD_DEFAULT_POINTS = [40, 30, 15, 8, 5, 2];

// Build the initial state bag for a freshly launched game. `config` is the
// host-supplied override object; anything omitted falls back to defaults.
function buildInitialGameState(type, config, session) {
  if (type === 'randomizer') {
    const names = Array.isArray(config.names) && config.names.length
      ? config.names.map(n => String(n)).filter(Boolean)
      : liveAttendeeNames(session);
    return { names, spinning: false, pickedIndex: null, showToAttendees: false };
  }

  if (type === 'timer') {
    const durationSec = Number.isFinite(config.durationSec) ? Math.max(1, Math.round(config.durationSec)) : 60;
    return { durationSec, configuredSec: durationSec, startedAt: null, running: false, label: String(config.label || '') };
  }

  if (type === 'jeopardy') {
    const catConfig = Array.isArray(config.categories) && config.categories.length ? config.categories : null;
    const categories = (catConfig || JEOPARDY_DEFAULT_CATEGORIES.map(name => ({ name }))).map((c, ci) => {
      const name = typeof c === 'string' ? c : (c.name || JEOPARDY_DEFAULT_CATEGORIES[ci] || `Category ${ci + 1}`);
      const cellsIn = (c && Array.isArray(c.cells)) ? c.cells : [];
      const cells = JEOPARDY_VALUES.map((value, vi) => {
        const cell = cellsIn[vi] || {};
        return {
          value: Number.isFinite(cell.value) ? cell.value : value,
          clue: String(cell.clue || ''),
          answer: String(cell.answer || ''),
          isRevealed: false,
          markedCorrect: false,
          markedIncorrect: false
        };
      });
      return { name, cells };
    });
    const scores = (Array.isArray(config.scores) && config.scores.length
      ? config.scores
      : [{ teamName: 'Team 1' }, { teamName: 'Team 2' }]
    ).map(s => ({ teamName: String(s.teamName || 'Team'), points: Number.isFinite(s.points) ? s.points : 0 }));
    return { categories, scores, activeCell: null };
  }

  if (type === 'clue') {
    let rowsIn = Array.isArray(config.rows) && config.rows.length ? config.rows : null;
    if (!rowsIn) {
      // Default: the five disciplinary-panel cases parsed from the agenda
      // segment titled "The disciplinary panel" (best-effort line split).
      const seg = (session.agenda || []).find(s => /disciplinary panel/i.test(s.title || ''));
      const src = seg ? (seg.activityInstructions || seg.speakerNotes || seg.prompt || '') : '';
      const lines = src.split('\n').map(l => l.trim()).filter(Boolean).slice(0, 5);
      rowsIn = lines.length ? lines.map(l => ({ conduct: l })) : new Array(5).fill(null);
    }
    const rows = rowsIn.map(r => ({
      conduct: String((r && r.conduct) || ''),
      rule: String((r && r.rule) || ''),
      outcome: String((r && r.outcome) || ''),
      revealedCols: [false, false, false]
    }));
    return { rows, activeRow: null };
  }

  if (type === 'feud') {
    const bankIn = Array.isArray(config.questions) && config.questions.length ? config.questions : null;
    const bank = (bankIn || FEUD_DEFAULT_QUESTIONS.map(q => ({ question: q }))).map((q, qi) => {
      const question = typeof q === 'string' ? q : (q.question || FEUD_DEFAULT_QUESTIONS[qi] || `Question ${qi + 1}`);
      const answersIn = (q && Array.isArray(q.answers)) ? q.answers : [];
      const answers = answersIn.slice(0, 6).map((a, ai) => ({
        text: String((typeof a === 'string' ? a : a.text) || ''),
        points: Number.isFinite(a && a.points) ? a.points : (FEUD_DEFAULT_POINTS[ai] || 0),
        isRevealed: false,
        rank: ai + 1
      }));
      return { question, answers };
    });
    const teams = (Array.isArray(config.teams) && config.teams.length
      ? config.teams
      : [{ name: 'Team 1' }, { name: 'Team 2' }]
    ).map(t => ({ name: String(t.name || 'Team'), score: Number.isFinite(t.score) ? t.score : 0 }));
    const first = bank[0] || { question: '', answers: [] };
    return {
      question: first.question,
      answers: first.answers,
      teams,
      strikes: 0,
      activeTeam: 0,
      bank,
      current: 0
    };
  }

  throw new Error('Unknown game type.');
}

// Mutate `game.state` in place per host action. Throws on an action that does
// not apply to the running game type.
function applyGameAction(game, action, payload) {
  const st = game.state || (game.state = {});
  const type = game.type;

  if (type === 'randomizer') {
    if (action === 'spin') { st.spinning = true; st.pickedIndex = null; return; }
    if (action === 'stop') {
      st.spinning = false;
      if (st.pickedIndex == null && st.names && st.names.length) {
        st.pickedIndex = Math.floor(Math.random() * st.names.length);
      }
      return;
    }
    if (action === 'toggle-visibility') { st.showToAttendees = !st.showToAttendees; return; }
    if (action === 'set-names' && Array.isArray(payload.names)) {
      st.names = payload.names.map(n => String(n)).filter(Boolean);
      st.pickedIndex = null;
      return;
    }
    throw new Error(`Unsupported randomizer action: ${action}`);
  }

  if (type === 'timer') {
    const nowMs = Date.now();
    if (action === 'start') {
      if (!st.running) { st.startedAt = new Date(nowMs).toISOString(); st.running = true; }
      return;
    }
    if (action === 'pause') {
      if (st.running && st.startedAt) {
        const elapsed = (nowMs - new Date(st.startedAt).getTime()) / 1000;
        st.durationSec = Math.max(0, Math.round(st.durationSec - elapsed));
      }
      st.running = false; st.startedAt = null;
      return;
    }
    if (action === 'reset') {
      st.running = false; st.startedAt = null;
      st.durationSec = Number.isFinite(payload.durationSec) ? Math.max(1, Math.round(payload.durationSec)) : (st.configuredSec || st.durationSec);
      return;
    }
    if (action === 'set-duration') {
      const d = Math.max(1, Math.round(payload.durationSec));
      if (!Number.isFinite(d)) throw new Error('durationSec must be a number.');
      st.durationSec = d; st.configuredSec = d; st.running = false; st.startedAt = null;
      if (typeof payload.label === 'string') st.label = payload.label;
      return;
    }
    throw new Error(`Unsupported timer action: ${action}`);
  }

  if (type === 'jeopardy') {
    const cell = (ci, vi) => st.categories?.[ci]?.cells?.[vi];
    if (action === 'reveal-cell') {
      const c = cell(payload.catIdx, payload.cellIdx);
      if (!c) throw new Error('No such cell.');
      c.isRevealed = true;
      st.activeCell = { catIdx: payload.catIdx, cellIdx: payload.cellIdx };
      return;
    }
    if (action === 'close-cell') { st.activeCell = null; return; }
    if (action === 'mark-correct') {
      const c = cell(payload.catIdx, payload.cellIdx);
      if (!c) throw new Error('No such cell.');
      c.markedCorrect = true; c.markedIncorrect = false;
      return;
    }
    if (action === 'mark-incorrect') {
      const c = cell(payload.catIdx, payload.cellIdx);
      if (!c) throw new Error('No such cell.');
      c.markedIncorrect = true; c.markedCorrect = false;
      return;
    }
    if (action === 'update-score') {
      const team = st.scores?.[payload.teamIdx];
      if (!team) throw new Error('No such team.');
      if (Number.isFinite(payload.delta)) team.points = (team.points || 0) + payload.delta;
      else if (Number.isFinite(payload.points)) team.points = payload.points;
      return;
    }
    throw new Error(`Unsupported jeopardy action: ${action}`);
  }

  if (type === 'clue') {
    if (action === 'next-row') {
      const total = (st.rows || []).length;
      st.activeRow = st.activeRow == null ? 0 : Math.min(total - 1, st.activeRow + 1);
      return;
    }
    if (action === 'reveal-col') {
      const row = st.rows?.[payload.rowIdx];
      if (!row) throw new Error('No such row.');
      const col = payload.colIdx;
      if (col < 0 || col > 2) throw new Error('colIdx must be 0, 1 or 2.');
      row.revealedCols[col] = true;
      st.activeRow = payload.rowIdx;
      return;
    }
    if (action === 'reset') {
      (st.rows || []).forEach(r => { r.revealedCols = [false, false, false]; });
      st.activeRow = null;
      return;
    }
    throw new Error(`Unsupported clue action: ${action}`);
  }

  if (type === 'feud') {
    if (action === 'buzz') {
      if (Number.isFinite(payload.teamIdx)) st.activeTeam = payload.teamIdx;
      return;
    }
    if (action === 'reveal-answer') {
      const a = st.answers?.[payload.idx];
      if (!a) throw new Error('No such answer.');
      a.isRevealed = true;
      return;
    }
    if (action === 'add-strike') {
      st.strikes = Math.min(3, (st.strikes || 0) + 1);
      if (st.strikes >= 3) {
        st.strikes = 0;
        st.activeTeam = st.activeTeam === 0 ? 1 : 0; // pass to the other team
      }
      return;
    }
    if (action === 'update-score') {
      const team = st.teams?.[payload.teamIdx];
      if (!team) throw new Error('No such team.');
      if (Number.isFinite(payload.delta)) team.score = (team.score || 0) + payload.delta;
      else if (Number.isFinite(payload.points)) team.score = payload.points;
      return;
    }
    if (action === 'next-question') {
      const bank = st.bank || [];
      if (st.current < bank.length - 1) {
        st.current += 1;
        const q = bank[st.current];
        st.question = q.question;
        st.answers = q.answers;
        st.strikes = 0;
      }
      return;
    }
    throw new Error(`Unsupported feud action: ${action}`);
  }

  throw new Error(`Unknown game type: ${type}`);
}

// Produce the attendee-safe copy of a game's state. Host-only secrets — unrevealed
// jeopardy clues/answers, hidden clue columns, unrevealed feud answers, the feud
// question bank — are stripped so they cannot be read from the wire.
function redactGameForAttendee(game) {
  const g = game.toObject ? game.toObject() : JSON.parse(JSON.stringify(game));
  const st = g.state || {};

  if (g.type === 'jeopardy') {
    (st.categories || []).forEach(cat => {
      (cat.cells || []).forEach(cell => {
        cell.answer = undefined;              // attendees never see answers
        if (!cell.isRevealed) cell.clue = ''; // clue only after the cell opens
      });
    });
  } else if (g.type === 'clue') {
    (st.rows || []).forEach(row => {
      const rc = row.revealedCols || [false, false, false];
      if (!rc[0]) row.conduct = '';
      if (!rc[1]) row.rule = '';
      if (!rc[2]) row.outcome = '';
    });
  } else if (g.type === 'feud') {
    st.bank = undefined;   // never leak upcoming questions
    st.current = undefined;
    (st.answers || []).forEach(a => {
      if (!a.isRevealed) { a.text = ''; a.points = null; }
    });
  }
  // randomizer + timer states are safe to send verbatim (the attendee UI hides
  // the randomizer overlay itself unless showToAttendees is true).
  return g;
}

export default router;
