import express from 'express';
import { protect, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Placeholder - admin routes
router.get('/stats', protect, requireAdmin, async (req, res) => {
  res.json({ message: 'Admin routes coming soon' });
});

export default router;
