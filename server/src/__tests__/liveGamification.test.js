/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 */
/**
 * Live-session gamification wiring (liveSessionCompletionService.js).
 *
 * Design constraint made machine-checkable: certificate issuance must be
 * UNAFFECTED when gamification fails — the gamification call is fire-and-forget
 * and every one of its errors is swallowed inside its own try/catch.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

const h = vi.hoisted(() => {
  const makeProfile = () => ({
    userId: 'u1',
    xp: 0,
    level: 1,
    badges: [],
    totalLiveSessionsCompleted: 0,
    totalCEHoursEarned: 0,
    weeklyHoursCompleted: 0,
    recordActivity: vi.fn(),
    calculateLevel: vi.fn(function () { return Math.floor(this.xp / 500) + 1; }),
    save: vi.fn().mockResolvedValue(undefined),
  });
  // mode 'normal' → findOne resolves the shared profile; mode 'throw' → every
  // Gamification call throws (the CRITICAL-test failure injection).
  const state = { mode: 'normal', profile: null };
  return { state, makeProfile };
});

vi.mock('../models/Gamification.js', () => ({
  default: {
    findOne: vi.fn(() => {
      if (h.state.mode === 'throw') throw new Error('gamification down');
      return Promise.resolve(h.state.profile);
    }),
    create: vi.fn(() => {
      if (h.state.mode === 'throw') throw new Error('gamification down');
      h.state.profile = h.makeProfile();
      return Promise.resolve(h.state.profile);
    }),
  },
}));

// Certificate: used as `new Certificate({...})` + `.save()` AND static findOne.
vi.mock('../models/Certificate.js', () => {
  const Certificate = vi.fn(function (data) {
    Object.assign(this, data);
    this._id = 'cert1';
    this.save = vi.fn().mockResolvedValue(this);
  });
  Certificate.findOne = vi.fn().mockResolvedValue(null);
  return { default: Certificate };
});
vi.mock('../models/User.js', () => ({
  default: {
    findById: vi.fn().mockResolvedValue({
      _id: 'u1',
      email: 'learner@example.com',
      profile: { firstName: 'Test', lastName: 'Learner' },
    }),
  },
}));
vi.mock('../models/UserCredential.js', () => ({ default: { find: vi.fn().mockResolvedValue([]) } }));
vi.mock('../models/LiveSession.js', () => ({ default: { findById: vi.fn() } }));
vi.mock('../models/SessionSeries.js', () => ({ default: { findById: vi.fn() } }));
vi.mock('../utils/certificate.js', () => ({
  generateCertificate: vi.fn().mockResolvedValue(Buffer.from('pdf')),
  generateCertificateNumber: vi.fn().mockResolvedValue('CR-LIVE-0001'),
  buildApprovalBlock: vi.fn().mockReturnValue([{ body: 'NBCC' }]),
}));
vi.mock('cloudinary', async () => {
  const { PassThrough } = await import('stream');
  return {
    v2: {
      uploader: {
        upload_stream: (opts, cb) => {
          const s = new PassThrough();
          s.on('finish', () => cb(null, { secure_url: 'https://res.cloudinary.test/cert.pdf' }));
          s.resume();
          return s;
        },
      },
    },
  };
});

const LiveSession = (await import('../models/LiveSession.js')).default;
const { issueLiveSessionCertificates } = await import('../services/liveSessionCompletionService.js');

function makeSession() {
  return {
    _id: 'sess1',
    sessionType: 'live-course',
    status: 'completed',
    seriesId: null,
    title: 'Ethics Live Webinar',
    ceuHours: 1.5,
    category: 'Ethics',
    nbccContentAreas: ['Counselor Professional Identity and Practice Issues'],
    objectives: [],
    presenter: { name: 'Dr. Presenter' },
    scheduledEnd: new Date('2026-07-01T17:00:00Z'),
    attendanceThresholdPct: 90,
    registrants: [{ user: 'u1' }],
    attendance: [{ user: 'u1', evaluationCompleted: true }],
    assessment: { enabled: false },
    assessmentAttempts: [],
    meetsAttendanceThreshold: vi.fn().mockReturnValue(true),
    attendedMinutes: vi.fn().mockReturnValue(120),
    scheduledDurationMin: vi.fn().mockReturnValue(120),
    save: vi.fn().mockResolvedValue(undefined),
  };
}

beforeEach(() => {
  h.state.mode = 'normal';
  h.state.profile = null;
  LiveSession.findById.mockResolvedValue(makeSession());
});

describe('live-session gamification wiring', () => {
  it('records live_session_complete: increments totalLiveSessionsCompleted and adds CE hours', async () => {
    const result = await issueLiveSessionCertificates('sess1');
    expect(result.issued).toHaveLength(1);

    // The gamification block is fire-and-forget — wait for its save.
    await vi.waitFor(() => expect(h.state.profile?.save).toHaveBeenCalled());

    const profile = h.state.profile;
    expect(profile.totalLiveSessionsCompleted).toBe(1);
    expect(profile.totalCEHoursEarned).toBe(1.5);
    expect(profile.weeklyHoursCompleted).toBe(1.5);
    // XP for BOTH live_session_complete (100) and certificate_earned (75)
    expect(profile.xp).toBe(175);
    expect(profile.recordActivity).toHaveBeenCalled();
  });

  it('first completion awards the first_live_session badge', async () => {
    await issueLiveSessionCertificates('sess1');
    await vi.waitFor(() => expect(h.state.profile?.save).toHaveBeenCalled());

    const keys = h.state.profile.badges.map(b => b.key);
    expect(keys).toContain('first_live_session');
    // 1 session < 5 — no live_five yet
    expect(keys).not.toContain('live_five');
  });

  it('CRITICAL: certificate issuance still succeeds when every Gamification call throws', async () => {
    h.state.mode = 'throw';

    const result = await issueLiveSessionCertificates('sess1');

    // Certificate path is identical and unaffected:
    expect(result.issued).toHaveLength(1);
    expect(result.issued[0]).toMatchObject({ userId: 'u1', certificateNumber: 'CR-LIVE-0001', certificateId: 'cert1' });
    expect(result.failed).toHaveLength(0);

    // Let the fire-and-forget block run + swallow its error; nothing must reject.
    await new Promise(r => setTimeout(r, 10));
    expect(h.state.profile).toBeNull(); // gamification never got to create a profile
  });
});
