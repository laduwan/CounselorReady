/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import express from 'express';
import Course from '../models/Course.js';
import UserCourseProgress from '../models/UserCourseProgress.js';
import UserCredential from '../models/UserCredential.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// ── Get personalized CE recommendations ──
router.get('/', protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const userState = req.user.profile?.state || req.user.primaryState;

    // Gather user context
    const [completedProgress, credentials, allCourses] = await Promise.all([
      UserCourseProgress.find({ userId, completed: true }).select('courseId'),
      UserCredential.find({ userId }).select('state code credentialType expirationDate totalRequired totalEarned'),
      Course.find({ status: 'published' }).select('title slug ceHours category tags accessTier description')
    ]);

    const completedIds = new Set(completedProgress.map(p => p.courseId.toString()));

    // Filter out completed courses
    const available = allCourses.filter(c => !completedIds.has(c._id.toString()));

    // Score each course based on relevance
    const scored = available.map(course => {
      let score = 0;
      const reasons = [];

      // Boost courses in categories matching credential gaps
      for (const cred of credentials) {
        const hoursNeeded = (cred.totalRequired || 0) - (cred.totalEarned || 0);
        if (hoursNeeded > 0) {
          // Expiring soon = higher priority
          if (cred.expirationDate) {
            const daysUntilExpiry = (new Date(cred.expirationDate) - new Date()) / (1000 * 60 * 60 * 24);
            if (daysUntilExpiry < 90) {
              score += 30;
              reasons.push(`Credential ${cred.code || cred.credentialType} expires in ${Math.round(daysUntilExpiry)} days`);
            } else if (daysUntilExpiry < 180) {
              score += 15;
              reasons.push(`Credential ${cred.code || cred.credentialType} renewal approaching`);
            }
          }

          // Hours gap bonus
          if (course.ceHours && course.ceHours <= hoursNeeded) {
            score += 10;
            reasons.push(`Fills ${course.ceHours} of ${hoursNeeded} hours needed`);
          }
        }
      }

      // State relevance
      if (course.tags?.includes(userState)) {
        score += 10;
        reasons.push('Relevant to your state');
      }

      // Ethics courses always valuable
      if (course.category === 'ethics' || course.tags?.includes('ethics')) {
        score += 8;
        reasons.push('Ethics CE (universally required)');
      }

      // Accessible tier bonus
      const tierLevel = { free: 0, starter: 1, professional: 2, vip: 3 };
      const userTier = req.user.getSubscriptionTier();
      const courseTier = tierLevel[course.accessTier] || 0;
      if (courseTier <= userTier) {
        score += 5;
        reasons.push('Included in your plan');
      }

      return { course, score, reasons };
    });

    // Sort by score descending, return top 10
    scored.sort((a, b) => b.score - a.score);
    const recommendations = scored.slice(0, 10).map(s => ({
      ...s.course.toObject(),
      relevanceScore: s.score,
      reasons: s.reasons
    }));

    // Summary
    const totalHoursNeeded = credentials.reduce((sum, c) => {
      return sum + Math.max(0, (c.totalRequired || 0) - (c.totalEarned || 0));
    }, 0);

    const upcomingExpirations = credentials
      .filter(c => c.expirationDate && (new Date(c.expirationDate) - new Date()) < 180 * 24 * 60 * 60 * 1000)
      .map(c => ({
        credential: c.code || c.credentialType,
        expirationDate: c.expirationDate,
        hoursNeeded: Math.max(0, (c.totalRequired || 0) - (c.totalEarned || 0))
      }));

    res.json({
      recommendations,
      summary: {
        totalHoursNeeded,
        coursesCompleted: completedIds.size,
        coursesAvailable: available.length,
        upcomingExpirations
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
