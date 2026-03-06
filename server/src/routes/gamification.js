/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import express from 'express';
import Gamification from '../models/Gamification.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Badge definitions
const BADGE_DEFS = {
  first_course: { name: 'First Steps', description: 'Completed your first course', icon: 'trophy' },
  five_courses: { name: 'Dedicated Learner', description: 'Completed 5 courses', icon: 'star' },
  ten_courses: { name: 'CE Champion', description: 'Completed 10 courses', icon: 'crown' },
  twenty_five_courses: { name: 'Master Practitioner', description: 'Completed 25 courses', icon: 'gem' },
  streak_7: { name: 'Week Warrior', description: '7-day learning streak', icon: 'flame' },
  streak_30: { name: 'Monthly Maven', description: '30-day learning streak', icon: 'fire' },
  streak_100: { name: 'Centurion', description: '100-day learning streak', icon: 'medal' },
  first_cert: { name: 'Certified', description: 'Earned your first certificate', icon: 'award' },
  ten_hours: { name: '10 Hour Club', description: 'Earned 10+ CE hours', icon: 'clock' },
  fifty_hours: { name: 'Half Century', description: 'Earned 50+ CE hours', icon: 'zap' },
  quiz_ace: { name: 'Quiz Ace', description: 'Passed 10 quizzes', icon: 'check-circle' }
};

// XP rewards
const XP_VALUES = {
  course_complete: 100,
  quiz_pass: 25,
  daily_login: 5,
  streak_milestone: 50,
  certificate_earned: 75
};

// ── Get or create my gamification profile ──
router.get('/my', protect, async (req, res) => {
  try {
    let profile = await Gamification.findOne({ userId: req.user._id });
    if (!profile) {
      profile = await Gamification.create({ userId: req.user._id });
    }

    // Reset weekly hours if week has passed
    if (profile.weekResetDate && new Date() > profile.weekResetDate) {
      profile.weeklyHoursCompleted = 0;
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      profile.weekResetDate = nextWeek;
      await profile.save();
    }

    res.json({
      ...profile.toObject(),
      level: profile.calculateLevel(),
      xpToNextLevel: 500 - (profile.xp % 500),
      availableBadges: Object.entries(BADGE_DEFS).map(([key, val]) => ({
        key,
        ...val,
        earned: profile.badges.some(b => b.key === key)
      }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Record an activity (called by other services) ──
router.post('/activity', protect, async (req, res) => {
  try {
    const { type, metadata } = req.body;
    let profile = await Gamification.findOne({ userId: req.user._id });
    if (!profile) {
      profile = await Gamification.create({ userId: req.user._id });
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
      if (metadata?.ceHours) {
        profile.totalCEHoursEarned += metadata.ceHours;
        profile.weeklyHoursCompleted += metadata.ceHours;
      }
    } else if (type === 'quiz_pass') {
      profile.totalQuizzesPassed += 1;
    }

    // Check for new badges
    const newBadges = [];
    const hasBadge = (key) => profile.badges.some(b => b.key === key);

    if (profile.totalCoursesCompleted >= 1 && !hasBadge('first_course')) {
      const badge = { key: 'first_course', ...BADGE_DEFS.first_course };
      profile.badges.push(badge);
      newBadges.push(badge);
    }
    if (profile.totalCoursesCompleted >= 5 && !hasBadge('five_courses')) {
      const badge = { key: 'five_courses', ...BADGE_DEFS.five_courses };
      profile.badges.push(badge);
      newBadges.push(badge);
    }
    if (profile.totalCoursesCompleted >= 10 && !hasBadge('ten_courses')) {
      const badge = { key: 'ten_courses', ...BADGE_DEFS.ten_courses };
      profile.badges.push(badge);
      newBadges.push(badge);
    }
    if (profile.totalCoursesCompleted >= 25 && !hasBadge('twenty_five_courses')) {
      const badge = { key: 'twenty_five_courses', ...BADGE_DEFS.twenty_five_courses };
      profile.badges.push(badge);
      newBadges.push(badge);
    }
    if (profile.currentStreak >= 7 && !hasBadge('streak_7')) {
      const badge = { key: 'streak_7', ...BADGE_DEFS.streak_7 };
      profile.badges.push(badge);
      newBadges.push(badge);
      profile.xp += XP_VALUES.streak_milestone;
    }
    if (profile.currentStreak >= 30 && !hasBadge('streak_30')) {
      const badge = { key: 'streak_30', ...BADGE_DEFS.streak_30 };
      profile.badges.push(badge);
      newBadges.push(badge);
      profile.xp += XP_VALUES.streak_milestone;
    }
    if (profile.currentStreak >= 100 && !hasBadge('streak_100')) {
      const badge = { key: 'streak_100', ...BADGE_DEFS.streak_100 };
      profile.badges.push(badge);
      newBadges.push(badge);
      profile.xp += XP_VALUES.streak_milestone * 2;
    }
    if (profile.totalQuizzesPassed >= 10 && !hasBadge('quiz_ace')) {
      const badge = { key: 'quiz_ace', ...BADGE_DEFS.quiz_ace };
      profile.badges.push(badge);
      newBadges.push(badge);
    }
    if (profile.totalCEHoursEarned >= 10 && !hasBadge('ten_hours')) {
      const badge = { key: 'ten_hours', ...BADGE_DEFS.ten_hours };
      profile.badges.push(badge);
      newBadges.push(badge);
    }
    if (profile.totalCEHoursEarned >= 50 && !hasBadge('fifty_hours')) {
      const badge = { key: 'fifty_hours', ...BADGE_DEFS.fifty_hours };
      profile.badges.push(badge);
      newBadges.push(badge);
    }

    if (type === 'certificate_earned' && !hasBadge('first_cert')) {
      const badge = { key: 'first_cert', ...BADGE_DEFS.first_cert };
      profile.badges.push(badge);
      newBadges.push(badge);
    }

    await profile.save();

    res.json({
      xpGained: xpGain,
      totalXp: profile.xp,
      level: profile.level,
      currentStreak: profile.currentStreak,
      newBadges
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Set weekly goal ──
router.put('/weekly-goal', protect, async (req, res) => {
  try {
    const { hours } = req.body;
    let profile = await Gamification.findOne({ userId: req.user._id });
    if (!profile) {
      profile = await Gamification.create({ userId: req.user._id });
    }

    profile.weeklyGoalHours = Math.max(0.5, Math.min(40, hours));
    if (!profile.weekResetDate) {
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      profile.weekResetDate = nextWeek;
    }
    await profile.save();

    res.json({ weeklyGoalHours: profile.weeklyGoalHours });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Leaderboard ──
router.get('/leaderboard', protect, async (req, res) => {
  try {
    const { period } = req.query; // 'weekly', 'monthly', 'alltime'

    const leaders = await Gamification.find()
      .sort({ xp: -1 })
      .limit(20)
      .populate('userId', 'profile.firstName profile.lastName');

    const leaderboard = leaders.map((g, i) => ({
      rank: i + 1,
      name: g.userId
        ? `${g.userId.profile?.firstName || ''} ${g.userId.profile?.lastName?.[0] || ''}.`.trim()
        : 'Anonymous',
      xp: g.xp,
      level: g.calculateLevel(),
      streak: g.currentStreak,
      badges: g.badges.length
    }));

    // Find current user's rank
    const myProfile = await Gamification.findOne({ userId: req.user._id });
    let myRank = null;
    if (myProfile) {
      const higherCount = await Gamification.countDocuments({ xp: { $gt: myProfile.xp } });
      myRank = higherCount + 1;
    }

    res.json({ leaderboard, myRank, myXp: myProfile?.xp || 0 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
