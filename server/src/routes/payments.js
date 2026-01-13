import express from 'express';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Placeholder - will be fully implemented with Stripe
router.get('/subscription', protect, async (req, res) => {
  res.json({ subscription: req.user.subscription });
});

export default router;
