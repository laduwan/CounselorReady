/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import mongoose from 'mongoose';

const badgeSchema = new mongoose.Schema({
  key: { type: String, required: true },       // e.g., 'first_course', 'streak_7'
  name: { type: String, required: true },       // Display name
  description: String,
  icon: String,                                  // emoji or icon key
  earnedAt: { type: Date, default: Date.now }
}, { _id: false });

const gamificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },

  // XP & Level
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },

  // Streaks
  currentStreak: { type: Number, default: 0 },       // consecutive days with activity
  longestStreak: { type: Number, default: 0 },
  lastActivityDate: Date,                              // to calculate streak continuity
  streakFreezeAvailable: { type: Number, default: 1 }, // forgiveness days

  // Weekly goals
  weeklyGoalHours: { type: Number, default: 2 },      // CE hours per week goal
  weeklyHoursCompleted: { type: Number, default: 0 },
  weekResetDate: Date,

  // Badges
  badges: [badgeSchema],

  // Stats
  totalCoursesCompleted: { type: Number, default: 0 },
  totalLiveSessionsCompleted: { type: Number, default: 0 },
  totalCEHoursEarned: { type: Number, default: 0 },
  totalQuizzesPassed: { type: Number, default: 0 },
  totalTimeSpentMinutes: { type: Number, default: 0 }
}, {
  timestamps: true
});

gamificationSchema.index({ xp: -1 }); // for leaderboard

// XP thresholds for levels
gamificationSchema.methods.calculateLevel = function () {
  // Every 500 XP = 1 level
  return Math.floor(this.xp / 500) + 1;
};

// Check and update streak
gamificationSchema.methods.recordActivity = function () {
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  const lastDate = this.lastActivityDate
    ? this.lastActivityDate.toISOString().split('T')[0]
    : null;

  if (lastDate === today) return; // already counted today

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  if (lastDate === yesterdayStr) {
    this.currentStreak += 1;
  } else if (lastDate && lastDate !== today) {
    // Missed a day — check streak freeze
    if (this.streakFreezeAvailable > 0) {
      this.streakFreezeAvailable -= 1;
      this.currentStreak += 1;
    } else {
      this.currentStreak = 1;
    }
  } else {
    this.currentStreak = 1;
  }

  if (this.currentStreak > this.longestStreak) {
    this.longestStreak = this.currentStreak;
  }

  this.lastActivityDate = now;
};

const Gamification = mongoose.model('Gamification', gamificationSchema);
export default Gamification;
