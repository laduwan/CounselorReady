import express from 'express';

const router = express.Router();

// Placeholder course builder routes
// These routes have been temporarily disabled during deployment fix
// Full course builder implementation to be added later

router.get('/health', (req, res) => {
  res.json({ 
    message: 'Course builder placeholder',
    status: 'ok',
    note: 'Full course builder routes to be implemented'
  });
});

router.get('/templates', (req, res) => {
  res.json({ 
    templates: [],
    message: 'Course builder templates coming soon'
  });
});

export default router;
