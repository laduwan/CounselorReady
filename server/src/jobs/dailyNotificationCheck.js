/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import User from '../models/User.js';
import UserCredential from '../models/UserCredential.js';
import { CourseProgress } from '../models/InteractiveCourse.js';
import {
  triggerCeRenewalReminder,
  triggerLowHoursAlert,
  triggerCredentialExpiring,
  triggerInsuranceExpiring,
  triggerCourseReminder
} from '../services/notificationTriggerService.js';

/**
 * Run daily notification check — scheduled via node-cron at 9 AM ET
 */
export async function runDailyNotificationCheck() {
  console.log('[DailyNotif] Starting daily notification check...');
  const stats = { usersChecked: 0, remindersSent: 0, errors: 0 };

  try {
    // Get all users who haven't unsubscribed
    const users = await User.find({
      'notifications.unsubscribeAll': { $ne: true },
      disabled: { $ne: true }
    }).select('_id notifications liabilityInsurance');

    const now = new Date();

    for (const user of users) {
      stats.usersChecked++;
      try {
        // 1. Check credentials for upcoming renewals and expiration
        const credentials = await UserCredential.find({
          userId: user._id,
          status: { $in: ['active', 'expiring_soon'] }
        });

        for (const cred of credentials) {
          if (!cred.expirationDate) continue;

          const expDate = new Date(cred.expirationDate);
          const daysRemaining = Math.ceil((expDate - now) / (1000 * 60 * 60 * 24));

          if (daysRemaining < 0 || daysRemaining > 90) continue;

          // CE Renewal reminder
          try {
            await triggerCeRenewalReminder(user._id, {
              credentialType: cred.name,
              state: cred.state,
              renewalDate: cred.expirationDate,
              daysRemaining,
              hoursCompleted: cred.totalCEUsCompleted || 0,
              hoursRequired: cred.totalCEUsRequired || 0
            });
            stats.remindersSent++;
          } catch (e) {
            stats.errors++;
          }

          // Low hours alert
          try {
            await triggerLowHoursAlert(user._id, {
              credentialType: cred.name,
              state: cred.state,
              renewalDate: cred.expirationDate,
              daysRemaining,
              hoursCompleted: cred.totalCEUsCompleted || 0,
              hoursRequired: cred.totalCEUsRequired || 0
            });
            stats.remindersSent++;
          } catch (e) {
            stats.errors++;
          }

          // Credential expiring at specific intervals
          const expirationIntervals = [90, 30, 14, 7, 3, 1, 0];
          if (expirationIntervals.includes(daysRemaining)) {
            try {
              await triggerCredentialExpiring(user._id, {
                credentialType: cred.name,
                state: cred.state,
                expirationDate: cred.expirationDate,
                daysRemaining
              });
              stats.remindersSent++;
            } catch (e) {
              stats.errors++;
            }
          }
        }

        // 2. Check liability insurance
        if (user.liabilityInsurance?.expirationDate) {
          const insExpDate = new Date(user.liabilityInsurance.expirationDate);
          const insDaysRemaining = Math.ceil((insExpDate - now) / (1000 * 60 * 60 * 24));

          if (insDaysRemaining >= 0 && insDaysRemaining <= 60) {
            try {
              await triggerInsuranceExpiring(user._id, {
                provider: user.liabilityInsurance.provider,
                expirationDate: user.liabilityInsurance.expirationDate,
                daysRemaining: insDaysRemaining
              });
              stats.remindersSent++;
            } catch (e) {
              stats.errors++;
            }
          }
        }

        // 3. Check stale course progress (not accessed in 7+ days, max 1 per user)
        try {
          const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          const staleProgress = await CourseProgress.findOne({
            userId: user._id,
            status: { $in: ['in_progress', 'started'] },
            updatedAt: { $lt: sevenDaysAgo }
          }).populate('courseId', 'title slug').sort({ updatedAt: -1 });

          if (staleProgress && staleProgress.courseId) {
            await triggerCourseReminder(user._id, {
              courseTitle: staleProgress.courseId.title,
              courseSlug: staleProgress.courseId.slug,
              percentComplete: staleProgress.percentComplete || staleProgress.progressPercent || 0
            });
            stats.remindersSent++;
          }
        } catch (e) {
          stats.errors++;
        }

      } catch (userErr) {
        stats.errors++;
        console.error(`[DailyNotif] Error processing user ${user._id}:`, userErr.message);
      }
    }

    console.log(`[DailyNotif] Complete. Users: ${stats.usersChecked}, Reminders: ${stats.remindersSent}, Errors: ${stats.errors}`);
  } catch (err) {
    console.error('[DailyNotif] Fatal error:', err.message);
  }

  return stats;
}

export default { runDailyNotificationCheck };
