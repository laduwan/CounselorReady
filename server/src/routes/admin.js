import express from 'express';
import Course from '../models/Course.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Simple admin check - any logged-in user for now
const isAdmin = (req, res, next) => next();

// GET all courses (including drafts)
router.get('/courses', protect, isAdmin, async (req, res) => {
  try {
    const courses = await Course.find({}).sort({ createdAt: -1 });
    res.json({ courses });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get courses' });
  }
});

// GET single course
router.get('/courses/:id', protect, isAdmin, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found' });
    res.json({ course });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get course' });
  }
});

// CREATE course
router.post('/courses', protect, isAdmin, async (req, res) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).json({ course });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create course' });
  }
});

// UPDATE course
router.put('/courses/:id', protect, isAdmin, async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!course) return res.status(404).json({ error: 'Course not found' });
    res.json({ course });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update course' });
  }
});

// UPDATE specific lesson
router.put('/courses/:id/lesson', protect, isAdmin, async (req, res) => {
  try {
    const { moduleIndex, lessonIndex, lesson } = req.body;
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found' });
    
    if (course.modules[moduleIndex] && course.modules[moduleIndex].lessons[lessonIndex]) {
      Object.assign(course.modules[moduleIndex].lessons[lessonIndex], lesson);
      await course.save();
      res.json({ course, message: 'Lesson updated' });
    } else {
      res.status(404).json({ error: 'Lesson not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update lesson' });
  }
});

// ADD module
router.post('/courses/:id/module', protect, isAdmin, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found' });
    
    course.modules.push({
      title: req.body.title || 'New Module',
      description: req.body.description || '',
      order: course.modules.length + 1,
      lessons: []
    });
    await course.save();
    res.json({ course });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add module' });
  }
});

// ADD lesson
router.post('/courses/:id/module/:moduleIndex/lesson', protect, isAdmin, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found' });
    
    const moduleIndex = parseInt(req.params.moduleIndex);
    if (!course.modules[moduleIndex]) return res.status(404).json({ error: 'Module not found' });
    
    course.modules[moduleIndex].lessons.push({
      title: req.body.title || 'New Lesson',
      type: req.body.type || 'text',
      content: req.body.content || '',
      duration: req.body.duration || 10,
      order: course.modules[moduleIndex].lessons.length + 1,
      isFree: req.body.isFree || false
    });
    await course.save();
    res.json({ course });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add lesson' });
  }
});

// DELETE course
router.delete('/courses/:id', protect, isAdmin, async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: 'Course deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete course' });
  }
});

export default router;
