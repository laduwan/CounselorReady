import express from 'express';

const router = express.Router();

// Placeholder scan routes
// These routes have been temporarily disabled during deployment fix
// Full AI scanning implementation to be added later

router.post('/', (req, res) => {
  res.status(503).json({ 
    message: 'AI scan service temporarily unavailable',
    note: 'Feature will be re-enabled soon'
  });
});

router.post('/credential', (req, res) => {
  res.status(503).json({ 
    message: 'Credential scanning temporarily unavailable',
    note: 'Feature will be re-enabled soon'
  });
});

router.get('/test', (req, res) => {
  res.json({ 
    message: 'Scan service placeholder',
    status: 'disabled'
  });
});

export default router;
