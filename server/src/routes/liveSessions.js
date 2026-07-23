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
import { issueLiveSessionCertificates } from '../services/liveSessionCompletionService.js';
import { triggerNewLiveSessionAnnouncement } from '../services/notificationTriggerService.js';
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

    // Never allow client payloads to overwrite room URLs or attendance
    const { whereby, attendance, registrants, recordings, ...safe } = req.body;
    Object.assign(session, safe);
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
      .select('liveState agenda status scheduledStart scheduledEnd registrants attendance breaks alarmLeadSec hostScratchpad hostChecklist')
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
    // speakerNotes is host-only — strip it before sending to non-admin viewers
    const segOut = seg && !isAdmin ? { ...seg, speakerNotes: undefined } : seg;

    const payload = {
      liveState: session.liveState,
      currentSegment: segOut,
      agendaLength: session.agenda?.length || 0,
      isHost: isAdmin,
      status: session.status,
      scheduledStart: session.scheduledStart,
      scheduledEnd: session.scheduledEnd
    };

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
