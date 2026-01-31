// interactiveCourseRoutes.js
// Add to your Express app: app.use('/api/interactive-courses', interactiveCourseRoutes);

import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

// Get the interactivecourses collection
const getCollection = () => mongoose.connection.db.collection('interactivecourses');

// GET /api/interactive-courses - List all published courses
router.get('/', async (req, res) => {
  try {
    const courses = await getCollection()
      .find({ status: { $ne: 'draft' } })
      .project({
        title: 1,
        slug: 1,
        description: 1,
        ceCredits: 1,
        duration: 1,
        targetAudience: 1,
        thumbnail: 1,
        'sections.title': 1,
        status: 1
      })
      .toArray();

    // Add section count
    const coursesWithMeta = courses.map(course => ({
      ...course,
      sectionCount: course.sections?.length || 0
    }));

    res.json(coursesWithMeta);
  } catch (error) {
    console.error('Error fetching interactive courses:', error);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

// GET /api/interactive-courses/:slug - Get full course by slug
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    
    const course = await getCollection().findOne({ slug });
    
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Don't return drafts to unauthenticated users
    // (In production, add auth check here)
    
    res.json(course);
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ error: 'Failed to fetch course' });
  }
});

// POST /api/interactive-courses/:slug/progress - Save user progress
router.post('/:slug/progress', async (req, res) => {
  try {
    const { slug } = req.params;
    const { userId, sectionIndex, completed, quizScores, reflections } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'userId required' });
    }

    // In production, save to a separate progress collection
    // For now, just acknowledge
    console.log('Progress saved:', { slug, userId, sectionIndex, completed });
    
    res.json({ success: true, message: 'Progress saved' });
  } catch (error) {
    console.error('Error saving progress:', error);
    res.status(500).json({ error: 'Failed to save progress' });
  }
});

export default router;
