/**
 * checkFreeMonthlyLimit.js
 * CounselorReady — Middleware to enforce the free-tier monthly course limit.
 *
 * Free (unsubscribed) users may enroll in up to 4 one-hour courses per
 * calendar month.  Allowance does NOT roll over.
 *
 * Usage:
 *   import checkFreeMonthlyLimit from '../middleware/checkFreeMonthlyLimit.js';
 *   router.post('/:id/enroll', protect, checkFreeMonthlyLimit, enrollHandler);
 */

import mongoose from 'mongoose';

export default async function checkFreeMonthlyLimit(req, res, next) {
  try {
    // Only gate free-plan users
    const plan = req.user?.subscription?.plan ?? 'free';
    const status = req.user?.subscription?.status ?? 'free';
    const activeStatuses = ['active', 'trial', 'lifetime', 'paused'];

    if (plan !== 'free' && activeStatuses.includes(status)) {
      // Paid subscriber — no monthly cap
      return next();
    }

    // Admins bypass
    if (req.user?.role === 'admin') {
      return next();
    }

    const User = mongoose.models.User ||
      mongoose.model('User', new mongoose.Schema({}, { strict: false }));

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    const check = user.canEnrollFree();

    if (!check.allowed) {
      return res.status(403).json({
        success: false,
        error: 'Monthly free course limit reached',
        reason: check.reason,
        limit: check.limit,
        resetsAt: check.resetsAt,
        message: `Free accounts can enroll in up to ${check.limit} courses per month. Upgrade your plan for unlimited access.`
      });
    }

    // Attach user doc so the enrollment handler can call useFreeMonthlySlot()
    req.freeUserDoc = user;
    next();
  } catch (err) {
    console.error('[checkFreeMonthlyLimit]', err.message);
    res.status(500).json({ error: 'Free limit check failed', detail: err.message });
  }
}
