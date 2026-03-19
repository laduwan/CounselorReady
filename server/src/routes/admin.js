/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
// admin.js — Admin route orchestrator
// Split into sub-files for maintainability:
//   adminUsers.js    — Stats, activity, user management, hardship
//   adminCourses.js  — Credentials, broadcasts, enrollments, course CRUD
//   adminAI.js       — AI quiz/course/module generation

import express from 'express';
import adminUsersRouter from './adminUsers.js';
import adminCoursesRouter from './adminCourses.js';
import adminAIRouter from './adminAI.js';
import adminStatsRouter from './adminStats.js';
import adminStripeRouter from './adminStripe.js';

const router = express.Router();

// Mount all admin sub-routers
router.use('/stats', adminStatsRouter);
router.use('/stripe', adminStripeRouter);
router.use('/', adminUsersRouter);
router.use('/', adminCoursesRouter);
router.use('/', adminAIRouter);

export default router;
