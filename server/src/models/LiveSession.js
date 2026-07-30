/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */

/**
 * LiveSession — synchronous Whereby-backed sessions (live CE courses + clinical supervision).
 *
 * HIPAA architecture: PHI never touches this collection. We store only session
 * metadata (who registered, join/leave timestamps, durations). The PHI surface
 * is the live video stream itself, covered by the Whereby BAA.
 *
 * Hard-locked invariants (enforced in pre('validate'), NOT admin-configurable):
 *   - sessionType 'supervision'  => recordingEnabled is forced false
 *   - sessionType 'supervision'  => handouts are rejected (Cloudinary has no BAA)
 */
import mongoose from 'mongoose';

const registrantSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  registeredAt: { type: Date, default: Date.now },
  paid: { type: Boolean, default: false },
  stripeCheckoutSessionId: String,
  phoneOptIn: { type: Boolean, default: false }   // SMS consent for session logistics
}, { _id: false });

const attendanceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  // Whereby participant/display metadata so admins can reconcile edge cases
  displayName: String,
  wherebyParticipantId: String,
  joinedAt: { type: Date, required: true },
  leftAt: Date,
  durationMin: { type: Number, default: 0 },
  rejoinNudgeSentAt: Date,    // set when a drop-detection nudge fires; prevents duplicate sends
  catchupSummary: String,     // cached AI-generated gap summary (live-course only)
  // Camera-off presence check-ins (host-configured 3-min response window)
  cameraOptOut: { type: Boolean, default: false },
  nextCheckinDueAt: Date, // when the next random check-in should fire
  consecutiveMissedCheckins: { type: Number, default: 0 },
  removedForMissedCheckins: { type: Boolean, default: false },
  checkins: [{
    promptedAt: { type: Date, required: true },
    deadline: { type: Date, required: true }, // promptedAt + 3 min
    respondedAt: Date,
    missed: { type: Boolean, default: false }
  }],
  evaluationCompleted: { type: Boolean, default: false },
  evaluationCompletedAt: Date,
  evaluationResponses: [{
    questionIndex: Number,
    response: mongoose.Schema.Types.Mixed
  }]
}, { _id: true });

const handoutSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  cloudinaryPublicId: { type: String, required: true },
  fileUrl: { type: String, required: true },
  fileType: { type: String, enum: ['pdf', 'docx', 'pptx', 'xlsx', 'png', 'jpg'], default: 'pdf' },
  sizeKB: Number,
  availability: { type: String, enum: ['before', 'during', 'after'], default: 'during' }
}, { _id: true });

const recordingSchema = new mongoose.Schema({
  s3Key: { type: String, required: true },
  s3Bucket: String,
  durationMin: Number,
  recordedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['processing', 'ready', 'archived'], default: 'ready' },
  replayEnabled: { type: Boolean, default: false }
}, { _id: true });

const liveSessionSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  description: { type: String, default: '' },
  presenter: {
    name: { type: String, default: 'Kejuiana Johnson, MA, LPC, NCC, CPCS, BC-TMH' },
    credentials: String,
    degree: { type: String, default: 'MA' },
    licenseNumber: { type: String, default: 'LPC009587' },
    licenseState: { type: String, default: 'GA' },
    category: {
      type: String,
      enum: ['category1', 'category2', 'category3'],
      default: 'category1' // masters + license, per ACEP presenter categories
    },
    qualificationStatement: {
      type: String,
      default: 'Kejuiana Johnson is a Licensed Professional Counselor (GA LPC009587) with clinical and supervisory experience relevant to this content area.'
    },
    // Camera-off avatar (passed to Whereby as avatarUrl). Set via env so the URL
    // is changeable without a code deploy. Whereby requires an https, square
    // png/jpg (<=64x64) Cloudinary URL with NO query params.
    photoUrl: { type: String, default: process.env.LIVE_PRESENTER_AVATAR_URL || '' }
  },

  sessionType: {
    type: String,
    enum: ['live-course', 'supervision'],
    required: true,
    index: true
  },

  // Live-course CE metadata (ignored for supervision)
  courseRef: { type: mongoose.Schema.Types.ObjectId, ref: 'InteractiveCourse' },
  ceuHours: { type: Number, min: 0, default: 0 },
  nbccContentAreas: [String],
  category: { type: String, default: 'Other' },
  objectives: [{ type: String, trim: true }],
  targetAudience: [{ type: String, trim: true }],
  references: [{ type: String, trim: true }],

  // Supervision metadata (ignored for live-course)
  supervisionFormat: {
    type: String,
    enum: ['individual', 'group', 'triadic', null],
    default: null
  },

  // Scheduling
  scheduledStart: { type: Date, required: true, index: true },
  scheduledEnd: { type: Date, required: true },
  timezone: { type: String, default: 'America/New_York' },

  // Whereby room (URLs are NEVER sent to unauthenticated clients;
  // viewerRoomUrl/hostRoomUrl only leave the server via the gated /join endpoint)
  whereby: {
    meetingId: { type: String, index: true },
    roomName: String,
    viewerRoomUrl: String,
    hostRoomUrl: String
  },

  // Access & pricing
  capacity: { type: Number, default: 50, min: 1, max: 200 },
  price: { type: Number, default: 0, min: 0 }, // USD; 0 = free / included
  // Optional early-bird pricing. When earlyBirdPrice is set and now <=
  // earlyBirdDeadline, the discounted price applies; consumers decide how to
  // display/charge it. Both omitted => standard `price` only (unchanged).
  earlyBirdPrice: { type: Number, min: 0 },
  earlyBirdDeadline: { type: Date },

  // ─── Registration cutoff ─────────────────────────────────────────────
  // Registration closes this many hours before scheduledStart. Platform
  // default is 72h, which gives Ke time to send materials, confirm the
  // roster, and provision the Whereby room. Override per session by setting
  // a different number; set 0 to keep registration open right up to (and
  // through) the session, which is the pre-cutoff legacy behavior.
  // Admins are never blocked by this — see routes/liveSessions.js register.
  registrationCutoffHours: { type: Number, default: 72, min: 0, max: 2160 },

  isPublished: { type: Boolean, default: false, index: true },
  visibility: {
    type: String,
    enum: ['public', 'private'],
    default: 'public'
  },
  accessCode: { type: String, trim: true, uppercase: true },

  // ─── Series linkage (optional) ───────────────────────────────────────
  // If set, this session is part of a SessionSeries. Standalone sessions
  // leave this null and behave exactly as before — no breaking change.
  seriesId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SessionSeries',
    default: null,
    index: true
  },

  // Position and requirement within the series. Ignored when seriesId is null.
  // - order:    display + issuance order (1, 2, 3...). Not a strict foreign
  //             key, just a sort hint; Stage 2 uses it to determine "which
  //             session in the series is last" for cert-issuance timing.
  // - required: when true, this session must be attended for the series
  //             certificate to issue. Default true (matches most series).
  seriesMembership: {
    order: { type: Number, default: 1, min: 1 },
    required: { type: Boolean, default: true }
  },

  registrants: [registrantSchema],
  attendance: [attendanceSchema],

  // Certificate eligibility: % of scheduled duration attended
  attendanceThresholdPct: { type: Number, default: 90, min: 50, max: 100 },
  certificatesIssuedAt: Date,

  // ─── Autopilot (Live Session Autopilot) ──────────────────────────────
  // When enabled, the 1-minute sessionProducerTick cron auto-starts the
  // session at scheduledStart and walks agenda segments on the clock. A
  // manual host action (▶ Go) sets pausedAt to hand control back to the host;
  // a Resume clears pausedAt. Additive — default disabled means legacy
  // behavior is byte-for-byte unchanged.
  autopilot: {
    enabled: { type: Boolean, default: false },
    startedAt: Date, // clock origin for timed segment advance
    pausedAt: Date   // set when the host takes the wheel; cleared on Resume
  },

  // Optional custom evaluation questions; falls back to DEFAULT_EVALUATION_QUESTIONS
  // (server/src/routes/liveSessions.js) when empty, same pattern as course.evaluationQuestions
  evaluationQuestions: [{
    question: String,
    type: { type: String, enum: ['rating', 'yes_no', 'text'] },
    required: { type: Boolean, default: true }
  }],

  // ─── Optional post-session graded assessment ─────────────────────────
  // When enabled, a passing attempt becomes an ADDITIONAL certificate gate
  // (on top of attendance + evaluation). Disabled by default → attendance-only
  // behavior is byte-for-byte unchanged. Options use the platform's canonical
  // [{text, isCorrect}] shape (never flat [String]) plus a correctAnswer index.
  assessment: {
    enabled: { type: Boolean, default: false },
    passThresholdPct: { type: Number, default: 80, min: 1, max: 100 },
    maxAttempts: { type: Number, default: 3, min: 1 },
    questions: [{
      _id: false,
      text: { type: String, trim: true },
      options: [{ _id: false, text: { type: String, trim: true }, isCorrect: { type: Boolean, default: false } }],
      correctAnswer: { type: Number } // index into options
    }]
  },

  // Graded assessment attempts — written server-side only, immutable once stored.
  assessmentAttempts: [{
    _id: false,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    answers: [Number],
    scorePct: Number,
    passed: Boolean,
    at: { type: Date, default: Date.now }
  }],

  // Recording — live-course only; hard-locked off for supervision
  recordingEnabled: { type: Boolean, default: false },
  recordings: [recordingSchema],

  // Host-only instructor dashboard settings
  alarmLeadSec: { type: Number, default: 60, min: 0, max: 600 }, // host-only: seconds before segment end to play the warning tone
  hostScratchpad: { type: String, default: '' }, // host-only private notes, never shown to attendees
  hostChecklist: [{
    text: { type: String, required: true, trim: true },
    done: { type: Boolean, default: false }
  }],

  // Handouts — live-course only; hard-locked empty for supervision
  handouts: [handoutSchema],

  // Watch-party clips (live-course only; hard-locked empty for supervision)
  // 10-min ceiling enforced in pre-validate; URLs served via presigned endpoint only
  clips: [{
    title: { type: String, required: true },
    s3Key: { type: String, required: true },
    s3Bucket: String,
    durationSec: { type: Number, required: true, min: 1, max: 600 }
  }],

  // ─── Facilitator prep (session-level) ────────────────────────────────
  // Pre-flight checklist shown to the host in the Run of Show modal.
  // Filled in ahead of time as part of session prep.
  preFlightChecklist: [{
    _id: false,
    text: { type: String, required: true, trim: true },
    critical: { type: Boolean, default: false } // e.g. "DO NOT show poll results between rungs"
  }],

  // Session-level cautions that apply throughout, not tied to a segment.
  // Shown persistently in the host panel during the live session.
  globalFacilitatorCautions: [{
    _id: false,
    text: { type: String, required: true, trim: true }
  }],

  // Run-of-show agenda (live-course only; hard-locked empty for supervision)
  agenda: [{
    order: { type: Number, required: true },
    type: { type: String, enum: ['lecture', 'clip', 'discussion', 'breakout', 'break'], required: true },
    title: String,
    durationMin: { type: Number, min: 1 },
    prompt: String,             // public — shown to all attendees
    speakerNotes: String,       // host-only — private cues
    clipIndex: Number,

    // ─── New in Stage 1 ──────────────────────────────────────────────
    // Freeform "how to run this segment" — printed teacher-facing text,
    // separate from short speaker cues. Host-only.
    activityInstructions: String,

    // Structured warnings for THIS segment specifically (as opposed to
    // globalFacilitatorCautions which span the whole session).
    facilitatorCautions: [{
      _id: false,
      text: { type: String, required: true, trim: true },
      critical: { type: Boolean, default: false }
    }],

    // Polls belonging to this segment. Each has options and reveal timing.
    polls: [{
      question: { type: String, required: true, trim: true },
      options: [{ _id: false, text: { type: String, required: true, trim: true } }],
      revealAfter: {
        // when to reveal results to attendees:
        //  'immediately' = as soon as vote closes
        //  'after-segment' = wait until segment ends (Ke's "escalation ladder" pattern)
        //  'manual' = host clicks to reveal
        type: String,
        enum: ['immediately', 'after-segment', 'manual'],
        default: 'immediately'
      },
      correctOptionIndex: Number // optional; null = no "correct" answer
    }],

    // Prompts for breakout rooms if this segment is type='breakout'.
    // Ignored on other segment types (validation not enforced here to keep
    // this schema-only task truly schema-only; Stage 2 or 3 can add checks).
    breakoutPrompts: [{
      _id: false,
      text: { type: String, required: true, trim: true },
      timeboxMin: Number // optional per-prompt timebox
    }],

    // Structured exercise details (writing exercises, worksheets, etc.).
    exercise: {
      type: {
        _id: false,
        instructions: String,        // what participants do
        timeboxMin: Number,          // how long they work
        deliverable: String,         // what they produce (e.g. "3 bullet points on chart paper")
        debriefFormat: String        // how findings are shared (e.g. "1 person reads aloud")
      },
      default: undefined // omit entirely when segment has no exercise
    },

    // Per-segment slide media (PNG/JPG). Public — auto-rendered in the
    // attendee NOW card when the segment activates. Uploaded via the Run of
    // Show editor, stored on Cloudinary (same machinery as handouts).
    media: [{
      _id: false,
      url: { type: String, required: true },
      publicId: String,   // Cloudinary public_id, for deletion
      caption: String
    }]
  }],

  // Live sync state — host writes, attendees poll via GET /:id/live-state
  liveState: {
    currentSegment: { type: Number, default: 0 },
    segmentStartedAt: Date,
    playback: {
      clipIndex: Number,
      playing: { type: Boolean, default: false },
      positionSec: { type: Number, default: 0 },
      stateUpdatedAt: Date
    },
    // Native poll session. Points at agenda[segIdx].polls[pollIdx]. null when no
    // poll is live. launchedAt→attendees can vote; closedAt→voting rejected;
    // revealed→results visible to attendees.
    activePoll: {
      type: {
        _id: false,
        segIdx: Number,
        pollIdx: Number,
        launchedAt: Date,
        closedAt: Date,
        revealed: { type: Boolean, default: false }
      },
      default: null
    },

    // ─── Live session game props ─────────────────────────────────────────
    // Host-launched interactive games (randomizer, shared timer, jeopardy,
    // clue reveal, family-feud). type='none' means no game is running. state
    // is a free-form (Mixed) bag whose shape depends on type — built and
    // mutated by the /:id/game/* routes in liveSessions.js. Additive: the
    // default of type:'none' means legacy sessions behave byte-for-byte the
    // same. markModified('liveState') is required on every state mutation
    // (Mixed subtree is not change-tracked automatically).
    game: {
      type: {
        type: String,
        enum: ['none', 'randomizer', 'timer', 'jeopardy', 'clue', 'feud'],
        default: 'none'
      },
      state: { type: mongoose.Schema.Types.Mixed, default: {} }
    }
  },

  // Native poll votes — one per user per (segIdx, pollIdx), enforced by an
  // atomic guarded $push at the vote route. Embedded (not a separate
  // collection): at schema-max capacity 200 × ~10 polls ≈ 2,000 ~100-byte
  // subdocs (~200 KB), far under the 16 MB doc cap and smaller than the
  // existing attendance[] with its checkins.
  pollResponses: [{
    _id: false,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    segIdx: { type: Number, required: true },
    pollIdx: { type: Number, required: true },
    optionIdx: { type: Number, required: true },
    at: { type: Date, default: Date.now }
  }],

  // Scheduled breaks — excluded from the NBCC attendance denominator
  breaks: [{
    label: { type: String, default: 'Break' },
    startsAt: { type: Date, required: true },
    durationMin: { type: Number, required: true, min: 1, max: 120 },
    resumeReminderSentAt: Date
  }],

  // Session producer state — written by sessionProducer.js / sessionProducerTick.js
  producer: {
    wrapUpSentAt: Date,
    incidentBroadcastAt: Date,
    transcriptS3Key: String,   // set by transcription.finished webhook (live-course only)
    // Self-hosted transcription (AWS Transcribe) state — written by transcriptionService.js
    transcribeJobName: String,
    transcribeStatus: { type: String, enum: ['none', 'in_progress', 'completed', 'failed'], default: 'none' },
    catchupFollowupSentAt: Date,
    // Autopilot certificate auto-issuance stamp — set once the tick has
    // handled cert issuance (or warned on empty attendance). Separate from
    // certificatesIssuedAt so a manual issue and an autopilot issue never
    // fight each other.
    certificatesAutoIssuedAt: Date,
    // T-24h / T-1h registrant reminder stamps — set once each reminder has
    // been dispatched so the tick never double-sends.
    remindersSent: {
      h24: Date,
      h1: Date
    },
    // Set once the registration-closed roster email has been sent to the
    // admin, so the tick never double-sends for the same session.
    rosterEmailSentAt: Date
  },

  status: {
    type: String,
    enum: ['scheduled', 'live', 'completed', 'cancelled'],
    default: 'scheduled',
    index: true
  }
}, { timestamps: true });

/* ── Hard-locked compliance invariants ─────────────────────────────────── */
liveSessionSchema.pre('validate', function (next) {
  if (this.sessionType === 'supervision') {
    // Recording physically impossible for supervision — Whereby room is also
    // created with recording.type='none' in wherebyService; this is defense in depth.
    this.recordingEnabled = false;
    if (this.recordings && this.recordings.length > 0) {
      return next(new Error('Recordings are not permitted on supervision sessions (HIPAA hard-lock).'));
    }
    if (this.handouts && this.handouts.length > 0) {
      return next(new Error('Handouts are not permitted on supervision sessions — Cloudinary has no BAA (HIPAA hard-lock).'));
    }
    if (this.clips && this.clips.length > 0) {
      return next(new Error('Watch-party clips are not permitted on supervision sessions (compliance hard-lock).'));
    }
    if (this.agenda && this.agenda.length > 0) {
      return next(new Error('Agenda is not permitted on supervision sessions (compliance hard-lock).'));
    }
    this.ceuHours = 0;
  }
  // Clip duration ceiling
  if (this.clips) {
    for (const clip of this.clips) {
      if (clip.durationSec > 600) {
        return next(new Error(`Clip "${clip.title}" exceeds the 10-minute ceiling (durationSec must be ≤ 600). CounselorReady shows clips only, not full films.`));
      }
    }
  }
  if (this.scheduledEnd <= this.scheduledStart) {
    return next(new Error('scheduledEnd must be after scheduledStart.'));
  }
  next();
});

/* ── Helpers ───────────────────────────────────────────────────────────── */

/**
 * Moment registration closes. Returns null when the session has opted out of
 * the cutoff (registrationCutoffHours === 0), meaning registration stays open
 * until status leaves 'scheduled'/'live'.
 */
liveSessionSchema.methods.registrationDeadline = function () {
  const hrs = typeof this.registrationCutoffHours === 'number'
    ? this.registrationCutoffHours
    : 72;
  if (hrs <= 0 || !this.scheduledStart) return null;
  return new Date(this.scheduledStart.getTime() - hrs * 3600000);
};

/**
 * True when a learner may still register. Does NOT consider capacity or
 * VIP/payment eligibility — those stay in the route where they already live.
 */
liveSessionSchema.methods.isRegistrationOpen = function (now = new Date()) {
  if (!['scheduled', 'live'].includes(this.status)) return false;
  const deadline = this.registrationDeadline();
  if (!deadline) return true;
  return now.getTime() < deadline.getTime();
};

liveSessionSchema.methods.isRegistered = function (userId) {
  return this.registrants.some(r => r.user && r.user.toString() === userId.toString());
};

liveSessionSchema.methods.scheduledDurationMin = function () {
  return Math.round((this.scheduledEnd - this.scheduledStart) / 60000);
};

/**
 * Instructional minutes = scheduled duration minus all declared break minutes.
 * This is the NBCC attendance denominator.
 */
liveSessionSchema.methods.instructionalMinutes = function () {
  const breakMin = (this.breaks || []).reduce((s, b) => s + b.durationMin, 0);
  return Math.max(1, this.scheduledDurationMin() - breakMin);
};

/**
 * Compute overlap in minutes between a segment [segStart, segEnd] and a break window.
 * Pure helper used by attendedMinutesAdjusted.
 */
export function breakOverlapMin(segStart, segEnd, breakStart, breakEnd) {
  const overlapStart = Math.max(segStart, breakStart);
  const overlapEnd = Math.min(segEnd, breakEnd);
  if (overlapEnd <= overlapStart) return 0;
  return (overlapEnd - overlapStart) / 60000;
}

/** Total verified instructional minutes for a user — break windows clipped out. */
liveSessionSchema.methods.attendedMinutesAdjusted = function (userId) {
  const segments = this.attendance.filter(
    a => a.user && a.user.toString() === userId.toString() && a.joinedAt && a.leftAt
  );
  const breaks = (this.breaks || []).map(b => ({
    start: b.startsAt.getTime(),
    end: b.startsAt.getTime() + b.durationMin * 60000
  }));

  let total = 0;
  for (const seg of segments) {
    const segStart = seg.joinedAt.getTime();
    const segEnd = seg.leftAt.getTime();
    let rawMin = Math.max(0, (segEnd - segStart) / 60000);
    for (const br of breaks) {
      rawMin -= breakOverlapMin(segStart, segEnd, br.start, br.end);
    }
    total += Math.max(0, rawMin);
  }
  return Math.round(total);
};

/** Total verified minutes for a user across all join/leave segments (unadjusted). */
liveSessionSchema.methods.attendedMinutes = function (userId) {
  return this.attendance
    .filter(a => a.user && a.user.toString() === userId.toString())
    .reduce((sum, a) => sum + (a.durationMin || 0), 0);
};

liveSessionSchema.methods.meetsAttendanceThreshold = function (userId) {
  const required = this.instructionalMinutes() * (this.attendanceThresholdPct / 100);
  return this.attendedMinutesAdjusted(userId) >= required;
};

/** Public-safe projection — strips room URLs and other server-only fields. */
liveSessionSchema.methods.toPublicJSON = function () {
  return {
    _id: this._id,
    title: this.title,
    slug: this.slug,
    description: this.description,
    presenter: this.presenter,
    sessionType: this.sessionType,
    ceuHours: this.ceuHours,
    category: this.category,
    scheduledStart: this.scheduledStart,
    scheduledEnd: this.scheduledEnd,
    timezone: this.timezone,
    capacity: this.capacity,
    seatsRemaining: Math.max(0, this.capacity - this.registrants.length),
    price: this.price,
    earlyBirdPrice: this.earlyBirdPrice,
    earlyBirdDeadline: this.earlyBirdDeadline,
    registrationCutoffHours: this.registrationCutoffHours,
    registrationClosesAt: this.registrationDeadline(),
    registrationOpen: this.isRegistrationOpen(),
    status: this.status,
    recordingEnabled: this.recordingEnabled,
    handouts: (this.handouts || []).map(h => ({
      _id: h._id, title: h.title, fileType: h.fileType, availability: h.availability
    }))
  };
};

liveSessionSchema.index({ status: 1, scheduledStart: 1 });

const LiveSession = mongoose.model('LiveSession', liveSessionSchema);
export default LiveSession;
