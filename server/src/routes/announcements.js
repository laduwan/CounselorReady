import express from 'express';

const router = express.Router();

// Placeholder announcements routes
// These routes have been temporarily disabled during deployment fix
// Full implementation to be added later

router.get('/', (req, res) => {
  res.json({ 
    announcements: [],
    message: 'Announcements feature coming soon'
  });
});

router.post('/', (req, res) => {
  res.status(501).json({ 
    message: 'Announcements feature not yet implemented'
  });
});

export default router;
