/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import express from 'express';
import mongoose from 'mongoose';
import Partner from '../models/Partner.js';
import User from '../models/User.js';
import InteractiveCourse from '../models/InteractiveCourse.js';
import { protect, requireAdmin, requirePartnerAdmin } from '../middleware/auth.js';

const router = express.Router();

// ── Public: look up partner by slug ──
router.get('/slug/:slug', async (req, res) => {
  try {
    const partner = await Partner.findOne({
      slug: req.params.slug.toLowerCase(),
      active: true
    }).select('-createdBy -__v');

    if (!partner) {
      return res.status(404).json({ error: 'Partner not found' });
    }

    res.json({ partner });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Admin: list all partners ──
router.get('/', protect, requireAdmin, async (req, res) => {
  try {
    const partners = await Partner.find()
      .sort({ createdAt: -1 })
      .populate('createdBy', 'email profile.firstName profile.lastName');

    const counts = await User.aggregate([
      { $match: { partnerId: { $exists: true, $ne: null } } },
      { $group: { _id: '$partnerId', count: { $sum: 1 } } }
    ]);
    const countMap = Object.fromEntries(counts.map(c => [c._id.toString(), c.count]));

    const results = partners.map(p => ({
      ...p.toObject(),
      userCount: countMap[p._id.toString()] || 0
    }));

    res.json({ partners: results });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Partner admin: update own branding ──
router.put('/my-branding', protect, requirePartnerAdmin, async (req, res) => {
  try {
    const partnerId = req.partnerId || req.user.partnerId;
    if (!partnerId) {
      return res.status(400).json({ error: 'No partner association found' });
    }

    const partner = await Partner.findById(partnerId);
    if (!partner) {
      return res.status(404).json({ error: 'Partner not found' });
    }

    const { logoUrl, primaryColor, companyName, tagline, colorScheme, accentColor } = req.body;
    if (logoUrl !== undefined) partner.branding.logoUrl = logoUrl;
    if (primaryColor !== undefined) partner.branding.primaryColor = primaryColor;
    if (companyName !== undefined) partner.branding.companyName = companyName;
    if (tagline !== undefined) partner.branding.tagline = tagline;
    if (colorScheme !== undefined) partner.branding.colorScheme = colorScheme;
    if (accentColor !== undefined) partner.branding.accentColor = accentColor;

    await partner.save();
    res.json({ partner });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Partner admin: list own courses ──
router.get('/my/courses', protect, requirePartnerAdmin, async (req, res) => {
  try {
    const partnerId = req.partnerId || req.user.partnerId;
    const courses = await InteractiveCourse.find({ partnerId })
      .select('title slug ceHours status publishedAt totalEstimatedTime description')
      .sort({ createdAt: -1 })
      .lean();

    const db = mongoose.connection.db;
    const courseIds = courses.map(c => c._id);

    let enrollMap = {};
    let completeMap = {};
    if (courseIds.length > 0) {
      const [enrollments, completions] = await Promise.all([
        db.collection('interactivecourseprogresses').aggregate([
          { $match: { courseId: { $in: courseIds } } },
          { $group: { _id: '$courseId', count: { $sum: 1 } } }
        ]).toArray(),
        db.collection('interactivecourseprogresses').aggregate([
          { $match: { courseId: { $in: courseIds }, completed: true } },
          { $group: { _id: '$courseId', count: { $sum: 1 } } }
        ]).toArray()
      ]);
      enrollMap = Object.fromEntries(enrollments.map(e => [e._id.toString(), e.count]));
      completeMap = Object.fromEntries(completions.map(c => [c._id.toString(), c.count]));
    }

    const results = courses.map(c => ({
      ...c,
      enrollments: enrollMap[c._id.toString()] || 0,
      completions: completeMap[c._id.toString()] || 0
    }));

    res.json({ courses: results });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Partner admin: create course ──
router.post('/my/courses', protect, requirePartnerAdmin, async (req, res) => {
  try {
    const partnerId = req.partnerId || req.user.partnerId;
    const { title, description, ceHours, slug, sections, assessment, objectives, presenter, references, targetAudience, categories, tags } = req.body;

    if (!title || !description || !ceHours) {
      return res.status(400).json({ error: 'Title, description, and CE hours are required' });
    }

    const courseSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const existing = await InteractiveCourse.findOne({ slug: courseSlug });
    if (existing) {
      return res.status(400).json({ error: 'A course with this slug already exists' });
    }

    const course = await InteractiveCourse.create({
      title,
      slug: courseSlug,
      description,
      ceHours,
      partnerId,
      sections: sections || [],
      assessment: assessment || {},
      objectives: objectives || [],
      presenter: presenter || {},
      references: references || [],
      targetAudience: targetAudience || [],
      categories: categories || [],
      tags: tags || [],
      author: req.user.profile?.firstName ? `${req.user.profile.firstName} ${req.user.profile.lastName || ''}`.trim() : req.user.email,
      status: 'draft'
    });

    res.status(201).json({ course });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Partner admin: update own course ──
router.put('/my/courses/:courseId', protect, requirePartnerAdmin, async (req, res) => {
  try {
    const partnerId = req.partnerId || req.user.partnerId;
    const course = await InteractiveCourse.findOne({
      _id: req.params.courseId,
      partnerId
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found or not owned by your partner' });
    }

    const allowed = ['title', 'description', 'ceHours', 'status', 'sections', 'assessment', 'objectives', 'presenter', 'references', 'targetAudience', 'categories', 'tags', 'thumbnail'];
    for (const key of allowed) {
      if (req.body[key] !== undefined) {
        course[key] = req.body[key];
      }
    }

    await course.save();
    res.json({ course });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Partner admin: delete own course ──
router.delete('/my/courses/:courseId', protect, requirePartnerAdmin, async (req, res) => {
  try {
    const partnerId = req.partnerId || req.user.partnerId;
    const course = await InteractiveCourse.findOne({
      _id: req.params.courseId,
      partnerId
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found or not owned by your partner' });
    }

    await course.deleteOne();
    res.json({ message: 'Course deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Admin: get single partner ──
router.get('/:id', protect, requireAdmin, async (req, res) => {
  try {
    const partner = await Partner.findById(req.params.id)
      .populate('createdBy', 'email profile.firstName profile.lastName');

    if (!partner) {
      return res.status(404).json({ error: 'Partner not found' });
    }

    const userCount = await User.countDocuments({ partnerId: partner._id });
    res.json({ partner: { ...partner.toObject(), userCount } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Admin: create partner ──
router.post('/', protect, requireAdmin, async (req, res) => {
  try {
    const { name, slug, branding, contact, defaultPlan } = req.body;

    if (!name || !slug) {
      return res.status(400).json({ error: 'Name and slug are required' });
    }

    const existing = await Partner.findOne({ slug: slug.toLowerCase() });
    if (existing) {
      return res.status(400).json({ error: 'A partner with this slug already exists' });
    }

    const partner = await Partner.create({
      name,
      slug: slug.toLowerCase(),
      branding: branding || {},
      contact: contact || {},
      defaultPlan: defaultPlan || 'free',
      createdBy: req.user._id
    });

    res.status(201).json({ partner });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Admin: update partner ──
router.put('/:id', protect, requireAdmin, async (req, res) => {
  try {
    const { name, slug, branding, contact, defaultPlan, active } = req.body;

    const partner = await Partner.findById(req.params.id);
    if (!partner) {
      return res.status(404).json({ error: 'Partner not found' });
    }

    // Check slug uniqueness if changing
    if (slug && slug.toLowerCase() !== partner.slug) {
      const existing = await Partner.findOne({ slug: slug.toLowerCase() });
      if (existing) {
        return res.status(400).json({ error: 'A partner with this slug already exists' });
      }
    }

    if (name !== undefined) partner.name = name;
    if (slug !== undefined) partner.slug = slug.toLowerCase();
    if (branding !== undefined) partner.branding = { ...partner.branding.toObject?.() || partner.branding, ...branding };
    if (contact !== undefined) partner.contact = { ...partner.contact.toObject?.() || partner.contact, ...contact };
    if (defaultPlan !== undefined) partner.defaultPlan = defaultPlan;
    if (active !== undefined) partner.active = active;

    await partner.save();
    res.json({ partner });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Admin: list users for a partner ──
router.get('/:id/users', protect, requireAdmin, async (req, res) => {
  try {
    const users = await User.find({ partnerId: req.params.id })
      .select('email profile.firstName profile.lastName subscription.plan subscription.status createdAt')
      .sort({ createdAt: -1 })
      .lean();

    res.json({ users, total: users.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Admin: partner-scoped analytics ──
router.get('/:id/stats', protect, requireAdmin, async (req, res) => {
  try {
    const partnerId = new mongoose.Types.ObjectId(req.params.id);
    const db = mongoose.connection.db;

    // Get all user IDs for this partner
    const partnerUsers = await User.find({ partnerId }).select('_id').lean();
    const userIds = partnerUsers.map(u => u._id);

    const totalUsers = userIds.length;

    // Active users (logged in within last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const activeUsers = await User.countDocuments({
      partnerId,
      lastLoginAt: { $gte: thirtyDaysAgo }
    });

    // Course completions from both progress collections
    let coursesCompleted = 0;
    let ceHoursEarned = 0;

    if (userIds.length > 0) {
      const [regularCompletions, interactiveCompletions] = await Promise.all([
        db.collection('usercourseprogresses').aggregate([
          { $match: { userId: { $in: userIds }, completed: true } },
          { $group: { _id: null, count: { $sum: 1 }, hours: { $sum: { $ifNull: ['$ceHours', 0] } } } }
        ]).toArray(),
        db.collection('interactivecourseprogresses').aggregate([
          { $match: { userId: { $in: userIds }, completed: true } },
          { $group: { _id: null, count: { $sum: 1 }, hours: { $sum: { $ifNull: ['$ceHours', 0] } } } }
        ]).toArray()
      ]);

      coursesCompleted = (regularCompletions[0]?.count || 0) + (interactiveCompletions[0]?.count || 0);
      ceHoursEarned = (regularCompletions[0]?.hours || 0) + (interactiveCompletions[0]?.hours || 0);
    }

    // Per-course breakdown for partner-owned courses
    const partnerCourses = await InteractiveCourse.find({ partnerId })
      .select('title slug ceHours status')
      .lean();

    let courseBreakdown = [];
    if (partnerCourses.length > 0) {
      const courseIds = partnerCourses.map(c => c._id);
      const [courseEnrollments, courseCompletions] = await Promise.all([
        db.collection('interactivecourseprogresses').aggregate([
          { $match: { courseId: { $in: courseIds } } },
          { $group: { _id: '$courseId', count: { $sum: 1 } } }
        ]).toArray(),
        db.collection('interactivecourseprogresses').aggregate([
          { $match: { courseId: { $in: courseIds }, completed: true } },
          { $group: { _id: '$courseId', count: { $sum: 1 } } }
        ]).toArray()
      ]);

      const enrollMap = Object.fromEntries(courseEnrollments.map(e => [e._id.toString(), e.count]));
      const completeMap = Object.fromEntries(courseCompletions.map(c => [c._id.toString(), c.count]));

      courseBreakdown = partnerCourses.map(c => ({
        courseId: c._id,
        title: c.title,
        enrollments: enrollMap[c._id.toString()] || 0,
        completions: completeMap[c._id.toString()] || 0,
        completionRate: (enrollMap[c._id.toString()] || 0) > 0
          ? Math.round(((completeMap[c._id.toString()] || 0) / enrollMap[c._id.toString()]) * 100)
          : 0
      }));
    }

    res.json({ totalUsers, activeUsers, coursesCompleted, ceHoursEarned, courseBreakdown });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Admin: delete partner ──
router.delete('/:id', protect, requireAdmin, async (req, res) => {
  try {
    const partner = await Partner.findById(req.params.id);
    if (!partner) {
      return res.status(404).json({ error: 'Partner not found' });
    }

    // Unlink users from this partner
    await User.updateMany({ partnerId: partner._id }, { $unset: { partnerId: 1 } });
    await partner.deleteOne();

    res.json({ message: 'Partner deleted and users unlinked' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Admin: promote user to partner_admin ──
router.post('/:id/set-admin', protect, requireAdmin, async (req, res) => {
  try {
    const partner = await Partner.findById(req.params.id);
    if (!partner) {
      return res.status(404).json({ error: 'Partner not found' });
    }

    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ error: 'User not found with that email' });
    }

    user.role = 'partner_admin';
    user.partnerId = partner._id;
    await user.save();

    res.json({ message: `${email} promoted to partner admin for ${partner.name}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Admin: view partner courses ──
router.get('/:id/courses', protect, requireAdmin, async (req, res) => {
  try {
    const courses = await InteractiveCourse.find({ partnerId: req.params.id })
      .select('title slug ceHours status publishedAt totalEstimatedTime')
      .sort({ createdAt: -1 })
      .lean();

    // Attach enrollment/completion counts
    const db = mongoose.connection.db;
    const courseIds = courses.map(c => c._id);

    const [enrollments, completions] = await Promise.all([
      db.collection('interactivecourseprogresses').aggregate([
        { $match: { courseId: { $in: courseIds } } },
        { $group: { _id: '$courseId', count: { $sum: 1 } } }
      ]).toArray(),
      db.collection('interactivecourseprogresses').aggregate([
        { $match: { courseId: { $in: courseIds }, completed: true } },
        { $group: { _id: '$courseId', count: { $sum: 1 } } }
      ]).toArray()
    ]);

    const enrollMap = Object.fromEntries(enrollments.map(e => [e._id.toString(), e.count]));
    const completeMap = Object.fromEntries(completions.map(c => [c._id.toString(), c.count]));

    const results = courses.map(c => ({
      ...c,
      enrollments: enrollMap[c._id.toString()] || 0,
      completions: completeMap[c._id.toString()] || 0
    }));

    res.json({ courses: results });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Admin: view partner course analytics ──
router.get('/:id/courses/:courseId/analytics', protect, requireAdmin, async (req, res) => {
  try {
    const course = await InteractiveCourse.findOne({
      _id: req.params.courseId,
      partnerId: req.params.id
    }).lean();

    if (!course) {
      return res.status(404).json({ error: 'Course not found for this partner' });
    }

    const db = mongoose.connection.db;
    const courseId = new mongoose.Types.ObjectId(req.params.courseId);

    const [enrollments, completions, avgProgress] = await Promise.all([
      db.collection('interactivecourseprogresses').countDocuments({ courseId }),
      db.collection('interactivecourseprogresses').countDocuments({ courseId, completed: true }),
      db.collection('interactivecourseprogresses').aggregate([
        { $match: { courseId } },
        { $group: { _id: null, avg: { $avg: { $ifNull: ['$progressPercent', 0] } } } }
      ]).toArray()
    ]);

    res.json({
      course: { _id: course._id, title: course.title, slug: course.slug },
      enrollments,
      completions,
      completionRate: enrollments > 0 ? Math.round((completions / enrollments) * 100) : 0,
      avgProgress: Math.round(avgProgress[0]?.avg || 0)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
