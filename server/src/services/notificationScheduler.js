/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
// services/notificationScheduler.js
// Scheduled tasks for course progress reminders and notifications
// ===============================================================

import cron from 'node-cron';
import { Resend } from 'resend';
import { CourseProgress } from '../models/InteractiveCourse.js';
import UserCourseProgress from '../models/UserCourseProgress.js';
import User from '../models/User.js';
import Certificate from '../models/Certificate.js';
import Course from '../models/Course.js';
import {
  getCourseProgressReminderEmail,
  getCEMilestoneEmail,
  getIncompleteCourseReminderEmail
} from './emailTemplates.js';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.FROM_EMAIL || 'CounselorReady <noreply@counselorready.com>';
const PLATFORM_URL = process.env.PLATFORM_URL || 'https://counselorready.com';

// Resend caps at 10 req/s — pace sequential sends in loops to stay under it.
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

/**
 * Send email using Resend
 */
async function sendEmail(to, template) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: template.subject,
      html: template.html,
      text: template.text
    });

    if (error) throw new Error(error.message);
    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error(`Failed to send email to ${to}:`, error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Send progress reminder to users who haven't accessed course in X days
 */
export async function sendProgressReminders() {
  console.log('📧 Running progress reminder job...');
  
  const reminderDays = [3, 7, 14, 30];
  const now = new Date();
  let totalSent = 0;
  
  for (const days of reminderDays) {
    const cutoffDate = new Date(now - days * 24 * 60 * 60 * 1000);
    const rangeStart = new Date(cutoffDate - 24 * 60 * 60 * 1000);
    
    try {
      // Find in-progress courses not accessed recently
      const staleProgress = await CourseProgress.find({
        status: 'in_progress',
        lastAccessedAt: { $gte: rangeStart, $lt: cutoffDate }
      })
      .populate('userId', 'email profile notificationPreferences')
      .populate('courseId', 'title slug');

      console.log(`  Found ${staleProgress.length} courses idle for ~${days} days`);

      for (const progress of staleProgress) {
        if (!progress.userId || !progress.courseId) continue;
        
        // Skip if user has disabled notifications
        if (progress.userId.notificationPreferences?.progressReminders === false) {
          continue;
        }

        const firstName = progress.userId.profile?.firstName || 'there';
        
        const template = getCourseProgressReminderEmail({
          firstName,
          courseTitle: progress.courseId.title,
          progressPercent: progress.overallProgress || progress.percentComplete || 0,
          lastAccessedDays: days,
          resumeUrl: `${PLATFORM_URL}/courses/${progress.courseId.slug}`
        });

        const result = await sendEmail(progress.userId.email, template);
        await sleep(150);
        if (result.success) totalSent++;
      }
    } catch (error) {
      console.error(`  Error processing ${days}-day reminders:`, error.message);
    }
  }
  
  console.log(`📧 Progress reminder job complete. Sent ${totalSent} emails.`);
}

/**
 * Check and send CE milestone emails
 */
export async function checkCEMilestones() {
  console.log('🏆 Running CE milestone check...');
  
  const milestones = [10, 25, 50, 100, 150, 200, 250, 300];
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
  let totalSent = 0;
  
  try {
    // Get users with recent certificates (last 24 hours)
    const recentCerts = await Certificate.find({
      createdAt: { $gte: yesterday },
      isRevoked: false
    }).distinct('user');

    for (const userId of recentCerts) {
      // Calculate total CE hours
      const totalHoursResult = await Certificate.aggregate([
        { $match: { user: userId, isRevoked: false } },
        { $group: { _id: null, total: { $sum: '$ceHours' } } }
      ]);

      const hours = totalHoursResult[0]?.total || 0;
      
      // Get the most recent certificate to calculate previous hours
      const recentCert = await Certificate.findOne({ 
        user: userId, 
        createdAt: { $gte: yesterday } 
      }).sort({ createdAt: -1 });
      
      const prevHours = hours - (recentCert?.ceHours || 0);
      
      // Check if crossed a milestone
      for (let i = 0; i < milestones.length; i++) {
        const milestone = milestones[i];
        
        if (hours >= milestone && prevHours < milestone) {
          const user = await User.findById(userId);
          if (!user) continue;
          if (user.notificationPreferences?.milestoneEmails === false) continue;
          
          const nextMilestone = milestones[i + 1] || null;
          const firstName = user.profile?.firstName || 'there';
          
          const template = getCEMilestoneEmail({
            firstName,
            totalHours: hours,
            milestone,
            nextMilestone
          });

          const result = await sendEmail(user.email, template);
          await sleep(150);
          if (result.success) {
            totalSent++;
            console.log(`  Sent ${milestone} hour milestone email to ${user.email}`);
          }
          break; // Only send one milestone email per user
        }
      }
    }
  } catch (error) {
    console.error('  Error checking milestones:', error.message);
  }
  
  console.log(`🏆 CE milestone check complete. Sent ${totalSent} emails.`);
}

/**
 * Clean up stale progress records
 */
export async function cleanupStaleProgress() {
  console.log('🧹 Running stale progress cleanup...');
  
  try {
    // Mark as abandoned if no activity for 90 days and < 10% complete
    const cutoffDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
    
    const result = await CourseProgress.updateMany(
      {
        status: 'in_progress',
        lastAccessedAt: { $lt: cutoffDate },
        $or: [
          { overallProgress: { $lt: 10 } },
          { percentComplete: { $lt: 10 } }
        ]
      },
      {
        $set: { status: 'abandoned' }
      }
    );
    
    console.log(`🧹 Marked ${result.modifiedCount} progress records as abandoned`);
  } catch (error) {
    console.error('  Error cleaning up:', error.message);
  }
}

/**
 * Generate daily statistics
 */
export async function generateDailyStats() {
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
  
  try {
    const stats = {
      date: new Date().toISOString().split('T')[0],
      newEnrollments: await CourseProgress.countDocuments({ 
        $or: [
          { enrolledAt: { $gte: yesterday } },
          { createdAt: { $gte: yesterday } }
        ]
      }),
      completions: await CourseProgress.countDocuments({ 
        completedAt: { $gte: yesterday } 
      }),
      certificatesIssued: await Certificate.countDocuments({ 
        createdAt: { $gte: yesterday } 
      }),
      totalCEHoursAwarded: (await Certificate.aggregate([
        { $match: { createdAt: { $gte: yesterday } } },
        { $group: { _id: null, total: { $sum: '$ceHours' } } }
      ]))[0]?.total || 0
    };
    
    console.log('📊 Daily Stats:', stats);
    return stats;
  } catch (error) {
    console.error('Error generating stats:', error.message);
    return null;
  }
}

/**
 * Send reminders to users who enrolled/paid but haven't completed their courses.
 * Targets users with active subscriptions who have in-progress or not-started courses
 * that haven't been accessed in at least 7 days.
 */
export async function sendIncompleteCourseReminders() {
  console.log('📧 Running incomplete course reminder job...');
  let totalSent = 0;

  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    // Find all incomplete course progress records (both legacy and interactive)
    const [legacyProgress, interactiveProgress] = await Promise.all([
      UserCourseProgress.find({
        status: { $in: ['not_started', 'in_progress'] },
        lastAccessedAt: { $lt: sevenDaysAgo }
      }).populate('courseId', 'title slug ceHours ceuHours'),
      CourseProgress.find({
        status: { $in: ['not_started', 'in_progress'] },
        lastAccessedAt: { $lt: sevenDaysAgo }
      }).populate('courseId', 'title slug ceHours')
    ]);

    // Group by userId
    const userCourses = {};

    for (const p of legacyProgress) {
      if (!p.courseId) continue;
      const uid = p.userId.toString();
      if (!userCourses[uid]) userCourses[uid] = [];
      userCourses[uid].push({
        title: p.courseId.title,
        slug: p.courseId.slug,
        percentComplete: p.percentComplete || 0,
        ceHours: p.courseId.ceHours || p.courseId.ceuHours || 0,
        resumeUrl: `${PLATFORM_URL}/learn/${p.courseId.slug}`
      });
    }

    for (const p of interactiveProgress) {
      if (!p.courseId) continue;
      const uid = p.userId.toString();
      if (!userCourses[uid]) userCourses[uid] = [];
      // Avoid duplicate entries if the same course appears in both models
      const alreadyListed = userCourses[uid].some(c => c.slug === p.courseId.slug);
      if (alreadyListed) continue;
      userCourses[uid].push({
        title: p.courseId.title,
        slug: p.courseId.slug,
        percentComplete: p.overallProgress || p.percentComplete || 0,
        ceHours: p.courseId.ceHours || 0,
        resumeUrl: `${PLATFORM_URL}/learn/${p.courseId.slug}`
      });
    }

    // Send one email per user with all their incomplete courses
    for (const [userId, courses] of Object.entries(userCourses)) {
      try {
        const user = await User.findById(userId);
        if (!user) continue;

        // Only remind users with active subscriptions (they paid)
        if (!user.hasActiveSubscription()) continue;

        // Respect notification preferences
        if (user.notificationPreferences?.progressReminders === false) continue;

        const firstName = user.profile?.firstName || 'there';

        const template = getIncompleteCourseReminderEmail({
          firstName,
          courses,
          dashboardUrl: `${PLATFORM_URL}/dashboard`
        });

        const result = await sendEmail(user.email, template);
        await sleep(150);
        if (result.success) {
          totalSent++;
          console.log(`  Sent incomplete course reminder to ${user.email} (${courses.length} courses)`);
        }
      } catch (userErr) {
        console.error(`  Error sending reminder to user ${userId}:`, userErr.message);
      }
    }
  } catch (error) {
    console.error('  Error in incomplete course reminders:', error.message);
  }

  console.log(`📧 Incomplete course reminder job complete. Sent ${totalSent} emails.`);
}

/**
 * Initialize all scheduled jobs
 */
export function initializeScheduler() {
  console.log('⏰ Initializing notification scheduler...');

  // Progress reminders - run daily at 10 AM
  cron.schedule('0 10 * * *', () => {
    sendProgressReminders().catch(console.error);
  });

  // CE milestone check - run every 6 hours
  cron.schedule('0 */6 * * *', () => {
    checkCEMilestones().catch(console.error);
  });

  // Stale progress cleanup - run weekly on Sunday at 2 AM
  cron.schedule('0 2 * * 0', () => {
    cleanupStaleProgress().catch(console.error);
  });

  // Incomplete course reminders - run weekly on Wednesday at 11 AM
  cron.schedule('0 11 * * 3', () => {
    sendIncompleteCourseReminders().catch(console.error);
  });

  // Daily stats - run at midnight
  cron.schedule('0 0 * * *', () => {
    generateDailyStats().catch(console.error);
  });

  console.log('⏰ Scheduler initialized:');
  console.log('   • Progress reminders: Daily at 10 AM');
  console.log('   • CE milestone check: Every 6 hours');
  console.log('   • Incomplete course reminders: Weekly on Wednesday at 11 AM');
  console.log('   • Stale cleanup: Weekly on Sunday at 2 AM');
  console.log('   • Daily stats: Midnight');
}

export default {
  initializeScheduler,
  sendProgressReminders,
  checkCEMilestones,
  sendIncompleteCourseReminders,
  cleanupStaleProgress,
  generateDailyStats
};
