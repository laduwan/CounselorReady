/**
 * rawMarkdownRoute.js
 * 
 * FALLBACK OPTION: If updating the InteractiveCourse model is too risky,
 * this adds a tiny standalone route that serves rawMarkdown directly 
 * from MongoDB, bypassing Mongoose schema entirely.
 * 
 * Add to server/src/routes/rawMarkdownRoute.js
 * Then register in index.js:
 *   import rawMarkdownRoutes from './routes/rawMarkdownRoute.js';
 *   app.use('/api/rawmd', rawMarkdownRoutes);
 * 
 * The viewer will try /api/rawmd/:slug first, fall back to sections[] if empty.
 */

import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

// GET /api/rawmd/:slug — returns rawMarkdown for a course, bypassing Mongoose model
router.get('/:slug', async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const course = await db.collection('interactivecourses').findOne(
      { slug: req.params.slug },
      { projection: { rawMarkdown: 1, _id: 0 } }
    );
    
    if (!course || !course.rawMarkdown) {
      return res.json({ rawMarkdown: null });
    }
    
    res.json({ rawMarkdown: course.rawMarkdown });
  } catch (err) {
    console.error('rawMarkdown fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch rawMarkdown' });
  }
});

export default router;
