// server/src/routes/adminRewards.js
//
// Admin endpoints for the Mastery Mark Points redemption queue.
// All routes require admin role.
//
// Mounted at /api/admin/rewards in index.js

import express from 'express';
import { protect, requireAdmin } from '../middleware/auth.js';
import Redemption from '../models/Redemption.js';
import User from '../models/User.js';
import emailService from '../services/emailService.js';

const { sendGiftCardCode } = emailService;

const router = express.Router();

// All routes require admin
router.use(protect, requireAdmin);

// ─────────────────────────────────────────────────────────────────
// GET /api/admin/rewards/queue
// Returns redemptions filtered by status (default: pending, oldest first)
// Query: ?status=pending|fulfilled|cancelled  (default 'pending')
//        ?limit=N  (default 50, max 200)
// ─────────────────────────────────────────────────────────────────
router.get('/queue', async (req, res) => {
  try {
    const status = req.query.status || 'pending';
    if (!['pending', 'fulfilled', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status filter' });
    }

    const limit = Math.min(parseInt(req.query.limit) || 50, 200);

    // Pending = oldest first (FIFO). Others = newest first.
    const sort = status === 'pending' ? { createdAt: 1 } : { createdAt: -1 };

    const redemptions = await Redemption.find({ status })
      .populate('userId', 'email profile.firstName profile.lastName')
      .populate('fulfilledBy', 'email profile.firstName')
      .populate('cancelledBy', 'email profile.firstName')
      .sort(sort)
      .limit(limit)
      .lean();

    res.json({
      redemptions,
      count: redemptions.length,
      filter: { status, limit },
    });
  } catch (err) {
    console.error('[ADMIN REWARDS] queue failed:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// ─────────────────────────────────────────────────────────────────
// GET /api/admin/rewards/stats
// Returns counts by status for the admin dashboard widget
// ─────────────────────────────────────────────────────────────────
router.get('/stats', async (req, res) => {
  try {
    const [pending, fulfilled, cancelled] = await Promise.all([
      Redemption.countDocuments({ status: 'pending' }),
      Redemption.countDocuments({ status: 'fulfilled' }),
      Redemption.countDocuments({ status: 'cancelled' }),
    ]);

    // Also report value of fulfilled redemptions
    const fulfilledAgg = await Redemption.aggregate([
      { $match: { status: 'fulfilled' } },
      { $group: { _id: null, totalValue: { $sum: '$dollarValue' }, totalPoints: { $sum: '$pointsCost' } } },
    ]);
    const totalFulfilledValue = fulfilledAgg[0]?.totalValue || 0;
    const totalFulfilledPoints = fulfilledAgg[0]?.totalPoints || 0;

    res.json({
      pending,
      fulfilled,
      cancelled,
      totalFulfilledValue,
      totalFulfilledPoints,
    });
  } catch (err) {
    console.error('[ADMIN REWARDS] stats failed:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// ─────────────────────────────────────────────────────────────────
// POST /api/admin/rewards/:id/fulfill
// Body: { giftcardCode: string, giftcardCodeNotes?: string, adminNotes?: string }
// Marks a pending gift card as fulfilled, stores the code, sends email.
// Stripe credits don't go through this — they auto-fulfill at redemption time.
// ─────────────────────────────────────────────────────────────────
router.post('/:id/fulfill', async (req, res) => {
  try {
    const { giftcardCode, giftcardCodeNotes, adminNotes } = req.body || {};

    if (!giftcardCode || typeof giftcardCode !== 'string' || giftcardCode.trim().length < 4) {
      return res.status(400).json({ error: 'Gift card code is required (min 4 characters)' });
    }

    const redemption = await Redemption.findById(req.params.id);
    if (!redemption) {
      return res.status(404).json({ error: 'Redemption not found' });
    }

    if (redemption.status !== 'pending') {
      return res.status(400).json({
        error: `Cannot fulfill — redemption is already ${redemption.status}`,
      });
    }

    if (redemption.type !== 'giftcard_25') {
      return res.status(400).json({
        error: 'Only gift card redemptions need manual fulfillment. Stripe credits auto-fulfill.',
      });
    }

    // Update redemption record
    redemption.status = 'fulfilled';
    redemption.fulfilledAt = new Date();
    redemption.fulfilledBy = req.user._id;
    redemption.giftcardCode = giftcardCode.trim();
    if (giftcardCodeNotes) redemption.giftcardCodeNotes = giftcardCodeNotes.trim();
    if (adminNotes) redemption.adminNotes = adminNotes.trim();
    await redemption.save();

    // Send code to user (fire-and-forget)
    const user = await User.findById(redemption.userId, 'email profile');
    if (user) {
      sendGiftCardCode(user, redemption.toObject())
        .catch(err => console.error('[ADMIN REWARDS] gift card code email failed:', err.message));
    }

    res.json({
      success: true,
      redemption: redemption.toObject(),
      message: 'Gift card marked as fulfilled. Code email sent to user.',
    });
  } catch (err) {
    console.error('[ADMIN REWARDS] fulfill failed:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// ─────────────────────────────────────────────────────────────────
// POST /api/admin/rewards/:id/cancel
// Body: { reason: string }
// Cancels a redemption (any type, any status?), refunds points.
// Note: Stripe credits already fulfilled cannot be reversed via this — would
// need to manually adjust Stripe balance. This is for pending or admin-error cases.
// ─────────────────────────────────────────────────────────────────
router.post('/:id/cancel', async (req, res) => {
  try {
    const { reason } = req.body || {};

    if (!reason || typeof reason !== 'string' || reason.trim().length < 3) {
      return res.status(400).json({ error: 'Cancel reason is required (min 3 characters)' });
    }

    const redemption = await Redemption.findById(req.params.id);
    if (!redemption) {
      return res.status(404).json({ error: 'Redemption not found' });
    }

    if (redemption.status === 'cancelled') {
      return res.status(400).json({ error: 'Redemption is already cancelled' });
    }

    if (redemption.status === 'fulfilled' && redemption.type !== 'giftcard_25') {
      // Stripe credit already fulfilled — admin must reverse via Stripe dashboard
      return res.status(400).json({
        error: 'Stripe credit already applied. To reverse, adjust the customer balance in Stripe directly. This endpoint cannot reverse fulfilled Stripe credits.',
      });
    }

    // Refund points to user
    await User.findByIdAndUpdate(redemption.userId, {
      $inc: { 'careCredits.balance': redemption.pointsCost },
      $push: {
        'careCredits.transactions': {
          amount: redemption.pointsCost,
          type: 'admin_adjustment',
          description: `Refund: ${reason.trim()}`,
          relatedRedemptionId: redemption._id,
          createdAt: new Date(),
        },
      },
    });

    redemption.status = 'cancelled';
    redemption.cancelledAt = new Date();
    redemption.cancelledBy = req.user._id;
    redemption.cancelReason = reason.trim();
    await redemption.save();

    res.json({
      success: true,
      redemption: redemption.toObject(),
      message: `Redemption cancelled. ${redemption.pointsCost} MMP refunded to user.`,
    });
  } catch (err) {
    console.error('[ADMIN REWARDS] cancel failed:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
