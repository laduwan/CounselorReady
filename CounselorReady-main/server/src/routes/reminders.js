import express from 'express';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Placeholder - will be fully implemented
router.get('/', protect, async (req, res) => {
  res.json({ reminders: [], message: 'Reminder routes coming soon' });
});

export default router;
