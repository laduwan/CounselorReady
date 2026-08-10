/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
// adminActivity.js — Active Users panel (deploy-safety check)
import express from 'express';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

const adminOnly = async (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// @route   GET /api/admin/active-users
// @desc    Who's online now / recently active — used to gate safe-to-deploy windows
// @access  Admin only
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const now = Date.now();
    const fiveMinAgo = new Date(now - 5 * 60000);
    const oneDayAgo = new Date(now - 24 * 60 * 60000);

    const users = await User.find({ lastActiveAt: { $gte: oneDayAgo } })
      .select('profile.firstName profile.lastName email subscription.plan role lastActiveAt sessionStartAt')
      .lean();

    const onlineNow = [];
    const recent = [];

    for (const u of users) {
      const name = [u.profile?.firstName, u.profile?.lastName].filter(Boolean).join(' ') || u.email;
      const lastActiveAt = u.lastActiveAt;
      if (lastActiveAt && lastActiveAt >= fiveMinAgo) {
        const sessionStartAt = u.sessionStartAt || lastActiveAt;
        const sessionMinutes = Math.max(0, Math.round((now - new Date(sessionStartAt).getTime()) / 60000));
        onlineNow.push({
          name,
          email: u.email,
          plan: u.subscription?.plan || 'free',
          role: u.role || 'user',
          lastActiveAt,
          sessionStartAt,
          sessionMinutes,
        });
      } else {
        recent.push({ name, email: u.email, lastActiveAt });
      }
    }

    onlineNow.sort((a, b) => b.sessionMinutes - a.sessionMinutes);
    recent.sort((a, b) => new Date(b.lastActiveAt) - new Date(a.lastActiveAt));

    res.json({
      onlineNow,
      recent,
      counts: { online: onlineNow.length, recent24h: recent.length },
    });
  } catch (err) {
    console.error('GET /admin/active-users error:', err);
    res.status(500).json({ error: 'Failed to load active users' });
  }
});

export default router;
