/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock all dependencies before importing
// interactiveCourseRoutes.js now imports models (Gamification, UserCredential)
// whose schemas reference mongoose.Schema.Types.ObjectId and call chainable
// schema methods at load time, so the mongoose stub provides Schema.Types and
// no-op chainable methods to let the import chain load.
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
// (e.g. freeCourseLimitEmail.js → `new Resend(...)`). Mock the wrapper modules
// and the resend/twilio packages so the real clients (and their API keys) stay
// out of the test.
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
vi.mock('resend', () => ({
  Resend: class { constructor() { this.emails = { send: vi.fn() }; } }
}));

const { CourseProgress } = await import('../models/InteractiveCourse.js');
const { _gateContent: gateContent, _stripContent: stripContent } = await import('../routes/interactiveCourseRoutes.js');

function makeCourse(overrides = {}) {
  return {
    _id: 'course123',
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
    accessType: 'free',
    ...overrides
  };
}

describe('stripContent', () => {
  it('removes contentBlocks except sectionDivider', () => {
    const course = makeCourse();
    const result = stripContent(course);
    expect(result.sections[0].contentBlocks).toHaveLength(1);
    expect(result.sections[0].contentBlocks[0].type).toBe('sectionDivider');
    expect(result.sections[1].contentBlocks).toHaveLength(0);
  });

  it('strips sectionDivider to only safe fields', () => {
    const course = makeCourse();
    const result = stripContent(course);
    const divider = result.sections[0].contentBlocks[0];
    expect(Object.keys(divider)).toEqual(['type', 'title', 'subtitle', 'sectionNumber']);
  });

  it('strips assessment questions but keeps metadata', () => {
    const course = makeCourse();
    const result = stripContent(course);
    expect(result.assessment.questions).toEqual([]);
    expect(result.assessment.questionCount).toBe(2);
    expect(result.assessment.passingScore).toBe(80);
    expect(result.assessment.maxAttempts).toBe(3);
  });

  it('removes rawMarkdown', () => {
    const course = makeCourse();
    const result = stripContent(course);
    expect(result.rawMarkdown).toBeUndefined();
  });

  it('sets _isPreview flag', () => {
    const course = makeCourse();
    const result = stripContent(course);
    expect(result._isPreview).toBe(true);
  });

  it('preserves section titles and order', () => {
    const course = makeCourse();
    const result = stripContent(course);
    expect(result.sections[0].title).toBe('Section 1');
    expect(result.sections[0].order).toBe(0);
    expect(result.sections[1].title).toBe('Section 2');
  });
});

describe('gateContent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('strips content for no user (unauthenticated)', async () => {
    const course = makeCourse();
    const result = await gateContent(course, null);
    expect(result._isPreview).toBe(true);
    expect(result.assessment.questions).toEqual([]);
  });

  it('strips content for undefined user', async () => {
    const course = makeCourse();
    const result = await gateContent(course, undefined);
    expect(result._isPreview).toBe(true);
  });

  it('returns full content for admin users', async () => {
    const course = makeCourse();
    const admin = { _id: 'admin1', role: 'admin' };
    const result = await gateContent(course, admin);
    expect(result._isPreview).toBeUndefined();
    expect(result.sections[0].contentBlocks).toHaveLength(3);
    expect(result.assessment.questions).toHaveLength(2);
  });

  it('returns full content for enrolled user on free course', async () => {
    const course = makeCourse({ accessType: 'free' });
    const user = { _id: 'user1', role: 'user' };
    CourseProgress.findOne.mockResolvedValue({ userId: 'user1', courseId: 'course123' });
    const result = await gateContent(course, user);
    expect(result._isPreview).toBeUndefined();
    expect(result.sections[0].contentBlocks).toHaveLength(3);
  });

  it('returns full content for enrolled user with matching subscription tier', async () => {
    const course = makeCourse({ accessType: 'professional' });
    const user = { _id: 'user1', role: 'user', subscription: { plan: 'professional', status: 'active' } };
    CourseProgress.findOne.mockResolvedValue({ userId: 'user1', courseId: 'course123' });
    const result = await gateContent(course, user);
    expect(result._isPreview).toBeUndefined();
  });

  it('returns full content for enrolled user with higher subscription tier', async () => {
    const course = makeCourse({ accessType: 'starter' });
    const user = { _id: 'user1', role: 'user', subscription: { plan: 'vip', status: 'active' } };
    CourseProgress.findOne.mockResolvedValue({ userId: 'user1', courseId: 'course123' });
    const result = await gateContent(course, user);
    expect(result._isPreview).toBeUndefined();
  });

  it('strips content for enrolled user with lower subscription tier', async () => {
    const course = makeCourse({ accessType: 'professional' });
    const user = { _id: 'user1', role: 'user', subscription: { plan: 'starter', status: 'active' } };
    CourseProgress.findOne.mockResolvedValue({ userId: 'user1', courseId: 'course123' });
    const result = await gateContent(course, user);
    expect(result._isPreview).toBe(true);
  });

  it('strips content for enrolled user with inactive subscription', async () => {
    const course = makeCourse({ accessType: 'professional' });
    const user = { _id: 'user1', role: 'user', subscription: { plan: 'professional', status: 'expired' } };
    CourseProgress.findOne.mockResolvedValue({ userId: 'user1', courseId: 'course123' });
    const result = await gateContent(course, user);
    expect(result._isPreview).toBe(true);
  });

  it('returns full content for enrolled user who purchased individually', async () => {
    const course = makeCourse({ accessType: 'professional' });
    const user = { _id: 'user1', role: 'user', subscription: { plan: 'free', status: 'active' } };
    CourseProgress.findOne.mockResolvedValue({ userId: 'user1', courseId: 'course123', purchased: true });
    const result = await gateContent(course, user);
    expect(result._isPreview).toBeUndefined();
  });

  it('strips content for authenticated but unenrolled user', async () => {
    const course = makeCourse();
    const user = { _id: 'user1', role: 'user' };
    CourseProgress.findOne.mockResolvedValue(null);
    const result = await gateContent(course, user);
    expect(result._isPreview).toBe(true);
  });
});
