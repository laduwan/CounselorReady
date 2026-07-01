/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
// routes/aiCourseGenerator.js
import express from 'express';
import { protect } from '../middleware/auth.js';
import { generateCourseDraft } from '../services/courseDraftGenerator.js';

const router = express.Router();

// Middleware to check if user is admin
const requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Admin access required' });
  }
};


// @route   POST /api/ai-course-generator/generate
// @desc    Generate course outline and content using Claude
// @access  Private/Admin
router.post('/generate', protect, requireAdmin, async (req, res) => {
  try {
    const { topic, ceHours, level, category, uploadedContent } = req.body;

    if (!topic && !uploadedContent) {
      return res.status(400).json({ error: 'Either topic or uploadedContent is required' });
    }

    // Set headers for streaming
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    res.write(`data: ${JSON.stringify({ type: 'progress', message: 'Generating course…', percent: 10 })}\n\n`);

    const { course } = await generateCourseDraft({ topic, uploadedContent, ceHours, level, category });

    res.write(`data: ${JSON.stringify({ type: 'complete', course })}\n\n`);
    res.end();
  } catch (error) {
    console.error('AI Course Generation Error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate course', details: error.toString() });
  }
});


export default router;
