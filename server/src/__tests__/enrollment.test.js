/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';

// Mutable holder so the mocked `protect` middleware can inject the current
// test user onto req.user. vi.hoisted lets the mock factory reference it
// despite vi.mock hoisting.
const auth = vi.hoisted(() => ({ user: null }));

// Mock all dependencies before importing (same approach as contentGating.test.js).
// The mongoose stub is slightly fuller than that file's: interactiveCourseRoutes.js
// now also imports models (Gamification, UserCredential) whose schemas reference
// mongoose.Schema.Types.ObjectId and call chainable schema methods at load time.
// The bare-class stub in contentGating.test.js throws on those, so we provide
// Schema.Types and no-op chainable methods to let the import chain load.
vi.mock('mongoose', () => {
  class Schema {
    constructor() {}
    pre() { return this; }
    post() { return this; }
    index() { return this; }
    set() { return this; }
    plugin() { return this; }
    method() { return this; }
    static() { return this; }
    add() { return this; }
    virtual() { return { get() { return this; }, set() { return this; } }; }
  }
  Schema.Types = { ObjectId: String, Mixed: Object, Decimal128: Number, Map };
  const mongoose = {
    Schema,
    model: () => ({}),
    models: {},
    Types: { ObjectId: { isValid: () => true } }
  };
  return { default: mongoose, Schema };
});

// CourseProgress is used both as a static (findOne/countDocuments) and as a
// constructor (`new CourseProgress({...})` then `.save()`), so the mock is a
// vi.fn constructor with statics hung off it.
vi.mock('../models/InteractiveCourse.js', () => {
  const CourseProgress = vi.fn(function (data) {
    Object.assign(this, data);
    this.save = vi.fn().mockResolvedValue(this);
  });
  CourseProgress.findOne = vi.fn();
  CourseProgress.countDocuments = vi.fn();
  return {
    Course: { findById: vi.fn(), findOne: vi.fn() },
    CourseProgress,
    ContentInteraction: {}
  };
});
// interactiveCourseRoutes.js also imports these two models at module load.
// Their real schemas reference mongoose.Schema.Types.ObjectId, which the
// lightweight mongoose mock above does not provide — so they must be mocked
// too (the original contentGating.test.js predates these imports).
vi.mock('../models/Gamification.js', () => ({ default: {} }));
vi.mock('../models/UserCredential.js', () => ({ default: {} }));
vi.mock('../models/Certificate.js', () => ({ default: {} }));
vi.mock('../models/Evaluation.js', () => ({ default: {} }));
vi.mock('../models/User.js', () => ({ default: { updateOne: vi.fn().mockResolvedValue({}) } }));
vi.mock('../middleware/auth.js', () => ({
  protect: (req, res, next) => { req.user = auth.user; next(); },
  optionalAuth: (req, res, next) => { req.user = auth.user; next(); },
  requireAdmin: (req, res, next) => next()
}));
vi.mock('../middleware/tenantScope.js', () => ({
  attachTenantScope: (req, res, next) => next()
}));
vi.mock('../services/activityTrackingService.js', () => ({
  // Returns a promise: the enroll handler chains `.catch()` on the result.
  logActivity: vi.fn().mockResolvedValue(undefined),
  ACTIVITY_TYPES: {}
}));
vi.mock('../utils/certificate.js', () => ({
  generateCertificate: vi.fn(),
  generateCertificateNumber: vi.fn(),
  buildApprovalBlock: vi.fn()
}));
// interactiveCourseRoutes.js imports a cascade of service/config/util modules
// at load time, several of which instantiate external clients on import
// (e.g. freeCourseLimitEmail.js → `new Resend(process.env.RESEND_API_KEY)`,
// config/twilio.js → a Twilio client). Mocking the wrapper modules keeps the
// real clients — and their required API keys — out of the test.
vi.mock('../services/freeCourseLimitEmail.js', () => ({ checkAndSendFreeLimit: vi.fn() }));
vi.mock('../services/rewardsService.js', () => ({
  awardCourseCompletion: vi.fn(),
  awardCertificate: vi.fn(),
  awardCourseEvaluation: vi.fn()
}));
vi.mock('../services/emailNotifications.js', () => ({ sendCertificateEmail: vi.fn() }));
vi.mock('../config/sms.js', () => ({ smsConfig: {} }));
vi.mock('../config/twilio.js', () => ({ default: {} }));
vi.mock('../utils/sms.js', () => ({ sendSMS: vi.fn() }));
vi.mock('../utils/email.js', () => ({ sendEmail: vi.fn() }));
vi.mock('../utils/certificatePdf.js', () => ({ generateCertificatePDF: vi.fn() }));
vi.mock('../utils/approvalText.js', () => ({ buildApprovalText: vi.fn() }));
vi.mock('twilio', () => ({ default: () => ({}) }));
// Depth-independent guards: several modules in the import tree construct these
// external clients at load time and throw without API keys. Mocking the
// packages themselves covers every importer regardless of how deep it sits.
vi.mock('resend', () => ({
  Resend: class { constructor() { this.emails = { send: vi.fn() }; } }
}));

const { Course, CourseProgress } = await import('../models/InteractiveCourse.js');
const { default: User } = await import('../models/User.js');
const routerModule = await import('../routes/interactiveCourseRoutes.js');
const { _gateContent: gateContent } = routerModule;
const router = routerModule.default;

// New policy constants (mirrors interactiveCourseRoutes.js).
const FREE_COURSES_PER_MONTH = 4;

const THIS_MONTH = new Date().toISOString().slice(0, 7); // "YYYY-MM"
const LAST_MONTH = (() => {
  const d = new Date();
  d.setMonth(d.getMonth() - 1);
  return d.toISOString().slice(0, 7);
})();

// Express app mounting the real router so route handlers run end-to-end.
const app = express();
app.use(express.json());
app.use('/api/interactive-courses', router);

// Course whose _id has a working toString(), matching the purchase-check pattern:
//   pc.courseId?.toString() === course._id.toString()
// accessType defaults to a *non-free* tier so the `accessType === 'free'`
// early-return does not fire. Tests that want a free course override accessType.
function makeCourse(overrides = {}) {
  return {
    _id: { toString: () => 'course123' },
    title: 'Test Course',
    slug: 'test-course',
    ceHours: 1,
    sections: [
      {
        title: 'Section 1',
        _id: 'sec1',
        order: 0,
        contentBlocks: [
          { type: 'sectionDivider', title: 'Intro', subtitle: 'Welcome', sectionNumber: 1 },
          { type: 'text', content: 'Secret learning content here' },
          { type: 'quiz', questions: [{ q: 'What is 2+2?', options: ['3', '4'] }] }
        ]
      },
      {
        title: 'Section 2',
        _id: 'sec2',
        order: 1,
        contentBlocks: [
          { type: 'text', content: 'More secret content' }
        ]
      }
    ],
    assessment: {
      questions: [{ q: 'Final Q1' }, { q: 'Final Q2' }],
      passingScore: 80,
      maxAttempts: 3
    },
    rawMarkdown: '# Secret markdown',
    accessType: 'professional',
    ...overrides
  };
}

function freeUser(overrides = {}) {
  return {
    _id: 'user1',
    role: 'user',
    email: 'free@example.com',
    subscription: { plan: 'free', status: 'free' },
    ...overrides
  };
}

// Assert the caller received the full, ungated course object.
function expectFullContent(result) {
  expect(result._isPreview).toBeUndefined();
  expect(result.sections[0].contentBlocks).toHaveLength(3);
  expect(result.assessment.questions).toHaveLength(2);
}

// Assert the caller received the stripped preview.
function expectStripped(result) {
  expect(result._isPreview).toBe(true);
  expect(result.sections[0]._stripped).toBe(true);
  expect(result.sections[0].contentBlocks).toHaveLength(1);
}

beforeEach(() => {
  vi.clearAllMocks();
  auth.user = null;
  CourseProgress.findOne.mockResolvedValue(null);
  CourseProgress.countDocuments.mockResolvedValue(0);
  User.updateOne.mockResolvedValue({});
});

describe('POST /:id/enroll — monthly free-course policy', () => {
  it('1. free user, 0 courses this month, ceHours=1 → enrolls (201) and consumes one slot', async () => {
    Course.findById.mockResolvedValue(makeCourse({ ceHours: 1 }));
    auth.user = freeUser({ freeCoursesUsedThisMonth: 0, freeCoursesResetMonth: THIS_MONTH });

    const res = await request(app).post('/api/interactive-courses/course123/enroll');

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(CourseProgress).toHaveBeenCalledTimes(1); // progress doc created
    // Slot consumed once: count bumped to 1 for the current month.
    expect(User.updateOne).toHaveBeenCalledTimes(1);
    const [, update] = User.updateOne.mock.calls[0];
    expect(update.$set.freeCoursesUsedThisMonth).toBe(1);
    expect(update.$set.freeCoursesResetMonth).toBe(THIS_MONTH);
  });

  it('2. free user, ceHours=3 → 403 OVER_FREE_HOUR_LIMIT, no progress created', async () => {
    Course.findById.mockResolvedValue(makeCourse({ ceHours: 3 }));
    auth.user = freeUser({ freeCoursesUsedThisMonth: 0, freeCoursesResetMonth: THIS_MONTH });

    const res = await request(app).post('/api/interactive-courses/course123/enroll');

    expect(res.status).toBe(403);
    expect(res.body.code).toBe('OVER_FREE_HOUR_LIMIT');
    expect(CourseProgress).not.toHaveBeenCalled();
    expect(User.updateOne).not.toHaveBeenCalled();
  });

  it('3. free user, freeCoursesUsedThisMonth=4 this month → 403 MONTHLY_LIMIT', async () => {
    Course.findById.mockResolvedValue(makeCourse({ ceHours: 1 }));
    auth.user = freeUser({ freeCoursesUsedThisMonth: 4, freeCoursesResetMonth: THIS_MONTH });

    const res = await request(app).post('/api/interactive-courses/course123/enroll');

    expect(res.status).toBe(403);
    expect(res.body.code).toBe('MONTHLY_LIMIT');
    expect(res.body.freeCoursesUsedThisMonth).toBe(4);
    expect(res.body.freeCoursesLimit).toBe(FREE_COURSES_PER_MONTH);
    expect(CourseProgress).not.toHaveBeenCalled();
  });

  it('4. free user, freeCoursesUsedThisMonth=4 but reset month is last month → allowed (counter reset)', async () => {
    Course.findById.mockResolvedValue(makeCourse({ ceHours: 1 }));
    auth.user = freeUser({ freeCoursesUsedThisMonth: 4, freeCoursesResetMonth: LAST_MONTH });

    const res = await request(app).post('/api/interactive-courses/course123/enroll');

    expect(res.status).toBe(201);
    expect(CourseProgress).toHaveBeenCalledTimes(1);
    // Reset path: new count starts at 1 and the month key is rewritten.
    const [, update] = User.updateOne.mock.calls[0];
    expect(update.$set.freeCoursesUsedThisMonth).toBe(1);
    expect(update.$set.freeCoursesResetMonth).toBe(THIS_MONTH);
    expect(update.$set.freeLimitEmailSentThisMonth).toBe(false);
  });
});

describe('GET /:id/progress — auto-create gating', () => {
  it('6. free user, 3-hour course, no progress → 403 and no progress doc created', async () => {
    Course.findById.mockResolvedValue(makeCourse({ ceHours: 3 }));
    auth.user = freeUser({ freeCoursesUsedThisMonth: 0, freeCoursesResetMonth: THIS_MONTH });

    const res = await request(app).get('/api/interactive-courses/course123/progress');

    expect(res.status).toBe(403);
    expect(res.body.code).toBe('OVER_FREE_HOUR_LIMIT');
    expect(CourseProgress).not.toHaveBeenCalled();
    expect(User.updateOne).not.toHaveBeenCalled();
  });

  it('free user, 1-hour course, no progress → progress auto-created and slot consumed', async () => {
    Course.findById.mockResolvedValue(makeCourse({ ceHours: 1 }));
    auth.user = freeUser({ freeCoursesUsedThisMonth: 0, freeCoursesResetMonth: THIS_MONTH });

    const res = await request(app).get('/api/interactive-courses/course123/progress');

    expect(res.status).toBe(200);
    expect(CourseProgress).toHaveBeenCalledTimes(1);
    expect(User.updateOne).toHaveBeenCalledTimes(1);
  });
});

describe('gateContent — enrollment-gated content for free-tier users', () => {
  it('5a. free user NOT enrolled → stripped preview with _requiresEnrollment', async () => {
    CourseProgress.findOne.mockResolvedValue(null);
    const course = makeCourse({ ceHours: 1 });
    const user = freeUser({ freeCoursesUsedThisMonth: 0, freeCoursesResetMonth: THIS_MONTH });

    const result = await gateContent(course, user);

    expectStripped(result);
    expect(result._requiresEnrollment).toBe(true);
  });

  it('5b. free user ENROLLED → full content', async () => {
    CourseProgress.findOne.mockResolvedValue({ _id: 'prog1' }); // enrolled
    const course = makeCourse({ ceHours: 1 });
    const user = freeUser({ freeCoursesUsedThisMonth: 0, freeCoursesResetMonth: THIS_MONTH });

    const result = await gateContent(course, user);

    expectFullContent(result);
  });

  it('7a. purchased course → full content regardless of month count', async () => {
    CourseProgress.findOne.mockResolvedValue(null);
    const course = makeCourse({ ceHours: 5 });
    const user = freeUser({
      freeCoursesUsedThisMonth: 99,
      freeCoursesResetMonth: THIS_MONTH,
      purchasedCourses: [
        { courseId: { toString: () => 'course123' }, slug: 'test-course', purchasedAt: new Date() }
      ]
    });

    const result = await gateContent(course, user);
    expectFullContent(result);
  });

  it('7b. active paid subscription → full content regardless of hours/month count', async () => {
    CourseProgress.findOne.mockResolvedValue(null);
    const course = makeCourse({ ceHours: 5 });
    const user = {
      _id: 'user1',
      role: 'user',
      email: 'pro@example.com',
      subscription: { plan: 'professional', status: 'active' },
      freeCoursesUsedThisMonth: 99,
      freeCoursesResetMonth: THIS_MONTH
    };

    const result = await gateContent(course, user);
    expectFullContent(result);
  });
});
