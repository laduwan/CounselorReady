import express from 'express';
import Course from '../models/Course.js';
import CredentialTemplate from '../models/CredentialTemplate.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Simple admin check - any logged-in user for now
const isAdmin = (req, res, next) => next();

// POST /api/admin/seed-templates - Seed credential templates
router.post('/seed-templates', protect, isAdmin, async (req, res) => {
  try {
    // Check if already seeded
    const existing = await CredentialTemplate.countDocuments();
    if (existing > 0) {
      return res.json({ message: `Templates already seeded (${existing} found)`, count: existing });
    }
    
    const templates = [
      // Georgia
      {
        type: 'state_license',
        name: 'LPC',
        code: 'LPC',
        state: 'GA',
        issuingBody: 'Georgia Composite Board of Professional Counselors, Social Workers, and Marriage & Family Therapists',
        renewalCycle: 24,
        totalCEUsRequired: 35,
        requirements: [
          { category: 'Ethics', hoursRequired: 5 },
          { category: 'General', hoursRequired: 30 }
        ],
        isActive: true
      },
      {
        type: 'state_license',
        name: 'LAPC',
        code: 'LAPC',
        state: 'GA',
        issuingBody: 'Georgia Composite Board',
        renewalCycle: 24,
        totalCEUsRequired: 35,
        requirements: [
          { category: 'Ethics', hoursRequired: 5 },
          { category: 'General', hoursRequired: 30 }
        ],
        isActive: true
      },
      {
        type: 'state_license',
        name: 'LCSW',
        code: 'LCSW',
        state: 'GA',
        issuingBody: 'Georgia Composite Board',
        renewalCycle: 24,
        totalCEUsRequired: 35,
        requirements: [
          { category: 'Ethics', hoursRequired: 5 },
          { category: 'General', hoursRequired: 30 }
        ],
        isActive: true
      },
      {
        type: 'state_license',
        name: 'LMFT',
        code: 'LMFT',
        state: 'GA',
        issuingBody: 'Georgia Composite Board',
        renewalCycle: 24,
        totalCEUsRequired: 35,
        requirements: [
          { category: 'Ethics', hoursRequired: 5 },
          { category: 'General', hoursRequired: 30 }
        ],
        isActive: true
      },
      // Texas
      {
        type: 'state_license',
        name: 'LPC',
        code: 'LPC',
        state: 'TX',
        issuingBody: 'Texas Behavioral Health Executive Council',
        renewalCycle: 24,
        totalCEUsRequired: 24,
        requirements: [
          { category: 'Ethics', hoursRequired: 3 },
          { category: 'General', hoursRequired: 21 }
        ],
        isActive: true
      },
      // Florida
      {
        type: 'state_license',
        name: 'LMHC',
        code: 'LMHC',
        state: 'FL',
        issuingBody: 'Florida Board of Clinical Social Work, Marriage & Family Therapy, and Mental Health Counseling',
        renewalCycle: 24,
        totalCEUsRequired: 30,
        requirements: [
          { category: 'Ethics', hoursRequired: 3 },
          { category: 'General', hoursRequired: 27 }
        ],
        isActive: true
      },
      // South Carolina
      {
        type: 'state_license',
        name: 'LPC',
        code: 'LPC',
        state: 'SC',
        issuingBody: 'South Carolina Board of Examiners for Licensure of Professional Counselors',
        renewalCycle: 24,
        totalCEUsRequired: 40,
        requirements: [
          { category: 'Ethics', hoursRequired: 6 },
          { category: 'General', hoursRequired: 34 }
        ],
        isActive: true
      },
      // Alabama
      {
        type: 'state_license',
        name: 'LPC',
        code: 'LPC',
        state: 'AL',
        issuingBody: 'Alabama Board of Examiners in Counseling',
        renewalCycle: 24,
        totalCEUsRequired: 24,
        requirements: [
          { category: 'Ethics', hoursRequired: 3 },
          { category: 'General', hoursRequired: 21 }
        ],
        isActive: true
      },
      // Tennessee
      {
        type: 'state_license',
        name: 'LPC-MHSP',
        code: 'LPC-MHSP',
        state: 'TN',
        issuingBody: 'Tennessee Board of Licensed Professional Counselors',
        renewalCycle: 24,
        totalCEUsRequired: 40,
        requirements: [
          { category: 'Ethics', hoursRequired: 3 },
          { category: 'General', hoursRequired: 37 }
        ],
        isActive: true
      },
      // North Carolina
      {
        type: 'state_license',
        name: 'LCMHC',
        code: 'LCMHC',
        state: 'NC',
        issuingBody: 'North Carolina Board of Licensed Clinical Mental Health Counselors',
        renewalCycle: 24,
        totalCEUsRequired: 40,
        requirements: [
          { category: 'Ethics', hoursRequired: 3 },
          { category: 'General', hoursRequired: 37 }
        ],
        isActive: true
      },
      // Idaho
      {
        type: 'state_license',
        name: 'LPC',
        code: 'LPC',
        state: 'ID',
        issuingBody: 'Idaho Licensing Board of Professional Counselors and Marriage and Family Therapists',
        renewalCycle: 24,
        totalCEUsRequired: 20,
        requirements: [
          { category: 'Ethics', hoursRequired: 3 },
          { category: 'General', hoursRequired: 17 }
        ],
        isActive: true
      },
      // National Certs
      {
        type: 'national_cert',
        name: 'NCC',
        code: 'NCC',
        issuingBody: 'National Board for Certified Counselors (NBCC)',
        renewalCycle: 60,
        totalCEUsRequired: 100,
        requirements: [
          { category: 'General', hoursRequired: 100 }
        ],
        isActive: true
      },
      {
        type: 'national_cert',
        name: 'ACS',
        code: 'ACS',
        issuingBody: 'National Board for Certified Counselors (NBCC)',
        renewalCycle: 60,
        totalCEUsRequired: 75,
        requirements: [
          { category: 'Supervision', hoursRequired: 25 },
          { category: 'General', hoursRequired: 50 }
        ],
        isActive: true
      },
      // Specialty Certs
      {
        type: 'specialty_cert',
        name: 'BC-TMH',
        code: 'BC-TMH',
        issuingBody: 'Center for Credentialing & Education (CCE)',
        renewalCycle: 24,
        totalCEUsRequired: 20,
        requirements: [
          { category: 'Telehealth', hoursRequired: 20 }
        ],
        isActive: true
      },
      {
        type: 'specialty_cert',
        name: 'CCTP',
        code: 'CCTP',
        issuingBody: 'International Association of Trauma Professionals (IATP)',
        renewalCycle: 24,
        totalCEUsRequired: 20,
        requirements: [
          { category: 'Trauma', hoursRequired: 20 }
        ],
        isActive: true
      }
    ];
    
    await CredentialTemplate.insertMany(templates);
    res.json({ message: `Seeded ${templates.length} credential templates`, count: templates.length });
  } catch (error) {
    console.error('Seed error:', error);
    res.status(500).json({ error: 'Failed to seed templates' });
  }
});

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

// =====================
// USER MANAGEMENT FOR SUPPORT
// =====================

import User from '../models/User.js';
import UserCourseProgress from '../models/UserCourseProgress.js';
import UserCredential from '../models/UserCredential.js';

// GET single user by ID
router.get('/users/:id', protect, isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

// GET user course progress for support
router.get('/users/:id/progress', protect, isAdmin, async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Get user details
    const user = await User.findById(userId).select('name email subscription createdAt primaryState');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Get all course progress for this user
    const progress = await UserCourseProgress.find({ userId })
      .populate('courseId', 'title ceHours modules category')
      .sort({ updatedAt: -1 });
    
    // Format the progress data
    const courseProgress = progress.map(p => {
      const course = p.courseId;
      const totalModules = course?.modules?.length || 0;
      const completedModules = p.completedLessons?.length || 0;
      const totalLessons = course?.modules?.reduce((sum, m) => sum + (m.lessons?.length || 0), 0) || 1;
      const progressPercent = Math.round((completedModules / totalLessons) * 100);
      
      return {
        courseId: course?._id,
        title: course?.title || 'Unknown Course',
        category: course?.category || 'General',
        ceHours: course?.ceHours || 0,
        totalModules,
        completedModules: Math.min(completedModules, totalModules),
        totalLessons,
        completedLessonsCount: p.completedLessons?.length || 0,
        progress: Math.min(progressPercent, 100),
        completed: p.completed,
        completedAt: p.completedAt,
        lastAccessed: p.updatedAt,
        enrolledAt: p.createdAt,
        currentModule: p.currentModule,
        currentLesson: p.currentLesson
      };
    });
    
    // Get user credentials
    const credentials = await UserCredential.find({ userId }).select('name state expirationDate totalCEUsRequired totalCEUsCompleted licenseNumber');
    
    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        registeredAt: user.createdAt,
        primaryState: user.primaryState,
        subscription: {
          plan: user.subscription?.plan || 'free',
          status: user.subscription?.status || 'active',
          startDate: user.subscription?.startDate,
          endDate: user.subscription?.endDate
        }
      },
      courseProgress,
      credentials,
      stats: {
        totalCourses: courseProgress.length,
        completedCourses: courseProgress.filter(c => c.completed).length,
        inProgressCourses: courseProgress.filter(c => !c.completed && c.progress > 0).length,
        notStartedCourses: courseProgress.filter(c => c.progress === 0).length,
        totalCredentials: credentials.length,
        totalCEHoursEarned: courseProgress.filter(c => c.completed).reduce((sum, c) => sum + (c.ceHours || 0), 0)
      }
    });
  } catch (error) {
    console.error('Get user progress error:', error);
    res.status(500).json({ error: 'Failed to get user progress' });
  }
});

// GET all users (for admin user list)
router.get('/users', protect, isAdmin, async (req, res) => {
  try {
    const { search, limit = 50, skip = 0 } = req.query;
    
    let query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    const users = await User.find(query)
      .select('name email subscription.plan createdAt')
      .sort({ createdAt: -1 })
      .skip(parseInt(skip))
      .limit(parseInt(limit));
    
    const total = await User.countDocuments(query);
    
    res.json({ users, total });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to get users' });
  }
});

// RESET user's course progress (admin only)
router.post('/users/:userId/courses/:courseId/reset', protect, isAdmin, async (req, res) => {
  try {
    const { userId, courseId } = req.params;
    
    const progress = await UserCourseProgress.findOne({ userId, courseId });
    
    if (!progress) {
      return res.status(404).json({ error: 'Course progress not found' });
    }
    
    // Reset progress
    progress.completedLessons = [];
    progress.quizAttempts = [];
    progress.currentModule = 0;
    progress.currentLesson = 0;
    progress.status = 'not_started';
    progress.completed = false;
    progress.completedAt = null;
    progress.progressPercent = 0;
    
    await progress.save();
    
    res.json({ 
      message: 'Course progress reset successfully',
      progress 
    });
  } catch (error) {
    console.error('Reset progress error:', error);
    res.status(500).json({ error: 'Failed to reset course progress' });
  }
});

export default router;
