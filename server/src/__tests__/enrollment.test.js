/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

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
vi.mock('../models/InteractiveCourse.js', () => ({
  Course: { findOne: vi.fn() },
  CourseProgress: { findOne: vi.fn() },
  ContentInteraction: {}
}));
// interactiveCourseRoutes.js also imports these two models at module load.
// Their real schemas reference mongoose.Schema.Types.ObjectId, which the
// lightweight mongoose mock above does not provide — so they must be mocked
// too (the original contentGating.test.js predates these imports).
vi.mock('../models/Gamification.js', () => ({ default: {} }));
vi.mock('../models/UserCredential.js', () => ({ default: {} }));
vi.mock('../models/Certificate.js', () => ({ default: {} }));
vi.mock('../models/Evaluation.js', () => ({ default: {} }));
vi.mock('../models/User.js', () => ({ default: {} }));
vi.mock('../middleware/auth.js', () => ({
  protect: (req, res, next) => next(),
  optionalAuth: (req, res, next) => next(),
  requireAdmin: (req, res, next) => next()
}));
vi.mock('../middleware/tenantScope.js', () => ({
  attachTenantScope: (req, res, next) => next()
}));
vi.mock('../services/activityTrackingService.js', () => ({
  logActivity: vi.fn(),
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
// real clients — and their required API keys — out of the test. The original
// contentGating.test.js predates these imports, which is why it currently
// fails to load on main.
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

const { CourseProgress } = await import('../models/InteractiveCourse.js');
const { _gateContent: gateContent } = await import('../routes/interactiveCourseRoutes.js');

// FREE_CE_HOUR_LIMIT in interactiveCourseRoutes.js is 4.
const FREE_CE_HOUR_LIMIT = 4;

// Course whose _id has a working toString(), matching the purchase-check pattern:
//   pc.courseId?.toString() === courseObj._id.toString()
// accessType defaults to a *non-free* tier so the `accessType === 'free'`
// early-return (which would short-circuit before the purchase/sub/free-hour
// checks) does not fire. Tests that want a free course override accessType.
function makeCourse(overrides = {}) {
  return {
    _id: { toString: () => 'course123' },
    title: 'Test Course',
    slug: 'test-course',
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

// Assert the caller received the full, ungated course object.
function expectFullContent(result) {
  expect(result._isPreview).toBeUndefined();
  expect(result.sections[0].contentBlocks).toHaveLength(3);
  expect(result.assessment.questions).toHaveLength(2);
}

// Assert the caller received the stripped preview.
function expectStripped(result) {
  expect(result._isPreview).toBe(true);
  expect(result.assessment.questions).toEqual([]);
}

describe('gateContent — purchasedCourses access check', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Enrollment lookup is awaited inside gateContent but does not by itself
    // grant access; default it to null so each test starts clean.
    CourseProgress.findOne.mockResolvedValue(null);
  });

  it('1. grants full content when purchasedCourses contains the matching courseId (free plan + exhausted free hours)', async () => {
    const course = makeCourse();
    const user = {
      _id: 'user1',
      role: 'user',
      subscription: { plan: 'free', status: 'free' },
      freeHoursUsed: 10, // well past FREE_CE_HOUR_LIMIT — purchase must still win
      purchasedCourses: [
        { courseId: { toString: () => 'course123' }, slug: 'test-course', purchasedAt: new Date() }
      ]
    };
    const result = await gateContent(course, user);
    expectFullContent(result);
  });

  it('2. does NOT grant access via the purchase path when purchasedCourses holds a DIFFERENT courseId', async () => {
    const course = makeCourse();
    const user = {
      _id: 'user1',
      role: 'user',
      subscription: { plan: 'free', status: 'free' },
      freeHoursUsed: FREE_CE_HOUR_LIMIT, // exhausted so the only way to full is purchase/sub
      purchasedCourses: [
        { courseId: { toString: () => 'differentCourse' }, slug: 'other-course', purchasedAt: new Date() }
      ]
    };
    const result = await gateContent(course, user);
    // Non-matching purchase → falls through → free hours exhausted → stripped
    expectStripped(result);
    expect(result._freeHoursExhausted).toBe(true);
  });

  it('3. falls through to the subscription/free-hours check when purchasedCourses is an empty array', async () => {
    const course = makeCourse();
    const user = {
      _id: 'user1',
      role: 'user',
      subscription: { plan: 'free', status: 'free' },
      freeHoursUsed: 0,
      purchasedCourses: []
    };
    const result = await gateContent(course, user);
    // No purchase → free-tier with budget remaining → full content + free-hours meta
    expectFullContent(result);
    expect(result._freeHoursRemaining).toBe(FREE_CE_HOUR_LIMIT);
    expect(result._freeHoursUsed).toBe(0);
  });
});

describe('gateContent — subscription, free-hours, and trial gating', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    CourseProgress.findOne.mockResolvedValue(null);
  });

  it('4. serves content to a free-tier user with 0 freeHoursUsed (free-hours path)', async () => {
    const course = makeCourse();
    const user = {
      _id: 'user1',
      role: 'user',
      subscription: { plan: 'free', status: 'free' },
      freeHoursUsed: 0
    };
    const result = await gateContent(course, user);
    expectFullContent(result);
    expect(result._freeHoursRemaining).toBe(FREE_CE_HOUR_LIMIT);
  });

  it('5. strips content for a free-tier user at/over FREE_CE_HOUR_LIMIT freeHoursUsed', async () => {
    const course = makeCourse();
    const user = {
      _id: 'user1',
      role: 'user',
      subscription: { plan: 'free', status: 'free' },
      freeHoursUsed: FREE_CE_HOUR_LIMIT
    };
    const result = await gateContent(course, user);
    expectStripped(result);
    expect(result._freeHoursExhausted).toBe(true);
    expect(result._freeHoursUsed).toBe(FREE_CE_HOUR_LIMIT);
  });

  it('6. grants full content to a user with an active trial', async () => {
    const course = makeCourse();
    const user = {
      _id: 'user1',
      role: 'user',
      subscription: { plan: 'professional', status: 'trial' }
    };
    const result = await gateContent(course, user);
    expectFullContent(result);
  });

  it('7. strips content for a user with an expired trial and no purchase', async () => {
    const course = makeCourse();
    const user = {
      _id: 'user1',
      role: 'user',
      subscription: { plan: 'professional', status: 'expired' },
      // Expired (non-active) subscription falls through to the free-hours check;
      // with hours exhausted and no purchase, the content is stripped.
      freeHoursUsed: FREE_CE_HOUR_LIMIT,
      purchasedCourses: []
    };
    const result = await gateContent(course, user);
    expectStripped(result);
    expect(result._freeHoursExhausted).toBe(true);
  });
});
