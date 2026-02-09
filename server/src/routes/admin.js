import express from 'express';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Placeholder admin routes
// These routes have been temporarily disabled during deployment fix
// Full implementation to be added later

router.get('/health', protect, authorize('admin'), (req, res) => {
  res.json({ 
    message: 'Admin routes placeholder',
    status: 'ok',
    note: 'Full admin routes to be implemented'
  });
});

export default router;
