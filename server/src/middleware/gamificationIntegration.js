/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */

/**
 * Gamification Integration Middleware
 *
 * Intercepts successful responses from specific endpoints and fires
 * gamification activity updates asynchronously. This approach requires
 * NO changes to existing route handlers.
 *
 * Integrated endpoints:
 *   POST /api/auth/login                                    → daily_login
 *   POST /api/interactive-courses/:id/attestation            → course_complete
 *   POST /api/interactive-courses/:id/certificate            → certificate_earned
 *   POST /api/interactive-courses/:id/assessment             → quiz_pass (if passed)
 *   POST /api/interactive-courses/:id/progress/section/:s/quiz → quiz_pass (if passed)
 *   POST /api/courses/:id/lessons/:lid/quiz                  → quiz_pass (if passed)
 */

import Gamification from '../models/Gamification.js';

// ── XP & badge constants (mirrored from gamification routes) ──

const XP_VALUES = {
  course_complete: 100,
  quiz_pass: 25,
  daily_login: 5,
  streak_milestone: 50,
  certificate_earned: 75
};

const BADGE_DEFS = {
  first_course:        { name: 'First Steps',        description: 'Completed your first course',  icon: 'trophy' },
  five_courses:        { name: 'Dedicated Learner',   description: 'Completed 5 courses',          icon: 'star' },
  ten_courses:         { name: 'CE Champion',         description: 'Completed 10 courses',         icon: 'crown' },
  twenty_five_courses: { name: 'Master Practitioner',  description: 'Completed 25 courses',         icon: 'gem' },
  streak_7:            { name: 'Week Warrior',         description: '7-day learning streak',        icon: 'flame' },
  streak_30:           { name: 'Monthly Maven',        description: '30-day learning streak',       icon: 'fire' },
  streak_100:          { name: 'Centurion',            description: '100-day learning streak',      icon: 'medal' },
  first_cert:          { name: 'Certified',            description: 'Earned your first certificate', icon: 'award' },
  ten_hours:           { name: '10 Hour Club',         description: 'Earned 10+ CE hours',          icon: 'clock' },
  fifty_hours:         { name: 'Half Century',         description: 'Earned 50+ CE hours',          icon: 'zap' },
  quiz_ace:            { name: 'Quiz Ace',             description: 'Passed 10 quizzes',            icon: 'check-circle' }
};

// ── Core gamification logic (works directly with the model) ──

async function recordActivity(userId, type, metadata = {}) {
  try {
    let profile = await Gamification.findOne({ userId });
    if (!profile) {
      profile = await Gamification.create({ userId });
    }

    // Record streak
    profile.recordActivity();

    // Award XP
    const xpGain = XP_VALUES[type] || 5;
    profile.xp += xpGain;
    profile.level = profile.calculateLevel();

    // Update stats
    if (type === 'course_complete') {
      profile.totalCoursesCompleted += 1;
      if (metadata.ceHours) {
        profile.totalCEHoursEarned += metadata.ceHours;
        profile.weeklyHoursCompleted += metadata.ceHours;
      }
    } else if (type === 'quiz_pass') {
      profile.totalQuizzesPassed += 1;
    }

    // Check for new badges
    const hasBadge = (key) => profile.badges.some(b => b.key === key);

    const courseMilestones = [
      [1,  'first_course'],
      [5,  'five_courses'],
      [10, 'ten_courses'],
      [25, 'twenty_five_courses']
    ];
    for (const [threshold, key] of courseMilestones) {
      if (profile.totalCoursesCompleted >= threshold && !hasBadge(key)) {
        profile.badges.push({ key, ...BADGE_DEFS[key] });
      }
    }

    const streakMilestones = [
      [7,   'streak_7',   XP_VALUES.streak_milestone],
      [30,  'streak_30',  XP_VALUES.streak_milestone],
      [100, 'streak_100', XP_VALUES.streak_milestone * 2]
    ];
    for (const [threshold, key, bonusXp] of streakMilestones) {
      if (profile.currentStreak >= threshold && !hasBadge(key)) {
        profile.badges.push({ key, ...BADGE_DEFS[key] });
        profile.xp += bonusXp;
      }
    }

    if (profile.totalQuizzesPassed >= 10 && !hasBadge('quiz_ace')) {
      profile.badges.push({ key: 'quiz_ace', ...BADGE_DEFS.quiz_ace });
    }
    if (profile.totalCEHoursEarned >= 10 && !hasBadge('ten_hours')) {
      profile.badges.push({ key: 'ten_hours', ...BADGE_DEFS.ten_hours });
    }
    if (profile.totalCEHoursEarned >= 50 && !hasBadge('fifty_hours')) {
      profile.badges.push({ key: 'fifty_hours', ...BADGE_DEFS.fifty_hours });
    }
    if (type === 'certificate_earned' && !hasBadge('first_cert')) {
      profile.badges.push({ key: 'first_cert', ...BADGE_DEFS.first_cert });
    }

    await profile.save();
  } catch (err) {
    // Fire-and-forget — never break the original response
    console.error('[Gamification] activity recording failed:', err.message);
  }
}

// ── Route matchers ──

const ROUTE_PATTERNS = [
  {
    // POST /api/auth/login  →  daily_login
    method: 'POST',
    match: /^\/api\/auth\/login$/,
    extract(req, body) {
      // Only on successful login (body has token)
      if (!body?.token) return null;
      // userId comes from the response body (user._id) since req.user isn't set on login
      const userId = body.user?._id || body.user?.id;
      if (!userId) return null;
      return { userId, type: 'daily_login' };
    }
  },
  {
    // POST /api/interactive-courses/:id/attestation  →  course_complete
    method: 'POST',
    match: /^\/api\/interactive-courses\/[^/]+\/attestation$/,
    extract(req, body) {
      if (!body?.success) return null;
      return { userId: req.user?._id, type: 'course_complete', metadata: {} };
    }
  },
  {
    // POST /api/interactive-courses/:id/certificate  →  certificate_earned
    // This endpoint returns a PDF (res.send with Buffer), so body is a Buffer
    method: 'POST',
    match: /^\/api\/interactive-courses\/[^/]+\/certificate$/,
    extract(req, body) {
      // Certificate route sends PDF buffer on success; if body is an object with error, skip
      if (body && typeof body === 'object' && body.error) return null;
      return { userId: req.user?._id, type: 'certificate_earned', metadata: {} };
    }
  },
  {
    // POST /api/interactive-courses/:id/assessment  →  quiz_pass
    method: 'POST',
    match: /^\/api\/interactive-courses\/[^/]+\/assessment$/,
    extract(req, body) {
      if (!body?.success || !body?.data?.passed) return null;
      return { userId: req.user?._id, type: 'quiz_pass' };
    }
  },
  {
    // POST /api/interactive-courses/:id/progress/section/:idx/quiz  →  quiz_pass
    method: 'POST',
    match: /^\/api\/interactive-courses\/[^/]+\/progress\/section\/\d+\/quiz$/,
    extract(req, body) {
      if (!body?.success || !body?.passed) return null;
      return { userId: req.user?._id, type: 'quiz_pass' };
    }
  },
  {
    // POST /api/courses/:id/lessons/:lessonId/quiz  →  quiz_pass
    method: 'POST',
    match: /^\/api\/courses\/[^/]+\/lessons\/[^/]+\/quiz$/,
    extract(req, body) {
      if (!body?.result?.passed) return null;
      return { userId: req.user?._id, type: 'quiz_pass' };
    }
  }
];

// ── The middleware ──

export default function gamificationIntegration(req, res, next) {
  // Only intercept POST requests to relevant paths (quick pre-filter)
  if (req.method !== 'POST') return next();

  const matched = ROUTE_PATTERNS.some(p => p.match.test(req.path));
  if (!matched) return next();

  // Patch res.json to intercept the response body
  const originalJson = res.json.bind(res);
  res.json = function (body) {
    // Send the original response first (unblocked)
    const result = originalJson(body);

    // Then fire gamification async
    for (const pattern of ROUTE_PATTERNS) {
      if (pattern.method === req.method && pattern.match.test(req.path)) {
        const activity = pattern.extract(req, body);
        if (activity && activity.userId) {
          recordActivity(activity.userId, activity.type, activity.metadata || {}).catch(() => {});
        }
        break;
      }
    }

    return result;
  };

  // Patch res.send for the certificate route (sends PDF buffer, not JSON)
  const originalSend = res.send.bind(res);
  res.send = function (body) {
    const result = originalSend(body);

    // Only check for certificate route (the only one using res.send with a buffer)
    if (req.path.match(/\/certificate$/) && res.statusCode >= 200 && res.statusCode < 300) {
      for (const pattern of ROUTE_PATTERNS) {
        if (pattern.method === req.method && pattern.match.test(req.path)) {
          const activity = pattern.extract(req, body);
          if (activity && activity.userId) {
            recordActivity(activity.userId, activity.type, activity.metadata || {}).catch(() => {});
          }
          break;
        }
      }
    }

    return result;
  };

  next();
}
