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
  catchupSummary: String      // cached AI-generated gap summary (live-course only)
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
    credentials: String
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
  isPublished: { type: Boolean, default: false, index: true },

  registrants: [registrantSchema],
  attendance: [attendanceSchema],

  // Certificate eligibility: % of scheduled duration attended
  attendanceThresholdPct: { type: Number, default: 90, min: 50, max: 100 },
  certificatesIssuedAt: Date,

  // Recording — live-course only; hard-locked off for supervision
  recordingEnabled: { type: Boolean, default: false },
  recordings: [recordingSchema],

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

  // Run-of-show agenda (live-course only; hard-locked empty for supervision)
  agenda: [{
    order: { type: Number, required: true },
    type: { type: String, enum: ['lecture', 'clip', 'discussion', 'breakout', 'break'], required: true },
    title: String,
    durationMin: { type: Number, min: 1 },
    prompt: String,
    clipIndex: Number
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
    }
  },

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
    catchupFollowupSentAt: Date
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
