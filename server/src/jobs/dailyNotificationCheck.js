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
  triggerCourseReminder,
  triggerTrialEndingSoon,
  triggerTrialEndingTomorrow,
  triggerTrialEnded,
  triggerNonPaidCheckIn
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
    }).select('_id notifications liabilityInsurance subscription email profile createdAt');

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

        // 4. Check trial expiry
        try {
          if (user.subscription?.status === 'trial' && user.subscription?.trialEndsAt) {
            const trialEnd = new Date(user.subscription.trialEndsAt);
            const daysRemaining = Math.ceil((trialEnd - now) / (1000 * 60 * 60 * 24));

            if (daysRemaining === 2) {
              await triggerTrialEndingSoon(user._id, { trialEndsAt: trialEnd, daysRemaining });
              stats.remindersSent++;
            } else if (daysRemaining === 1) {
              await triggerTrialEndingTomorrow(user._id, { trialEndsAt: trialEnd });
              stats.remindersSent++;
            } else if (daysRemaining <= 0) {
              // Mark expired (passive auth check also does this, but do it proactively)
              await User.updateOne(
                { _id: user._id, 'subscription.status': 'trial' },
                { $set: { 'subscription.status': 'expired' } }
              );
              await triggerTrialEnded(user._id);
              stats.remindersSent++;
            }
          }
        } catch (e) {
          stats.errors++;
          console.error(`[DailyNotif] Trial check error for user ${user._id}:`, e.message);
        }

        // 5. Non-paid user check-in — every ~75 days for free + expired users
        try {
          const nonPayingStatuses = ['free', 'expired', 'canceled'];
          if (nonPayingStatuses.includes(user.subscription?.status) && user.createdAt) {
            const daysSinceRegistration = Math.floor((now - new Date(user.createdAt)) / (1000 * 60 * 60 * 24));
            // Fire on day 75, 150, 225, 300, 375... — every ~2.5 months
            // Skip if too new or if not on a 75-day boundary (±0 days)
            if (daysSinceRegistration >= 75 && daysSinceRegistration % 75 === 0) {
              await triggerNonPaidCheckIn(user._id, { daysSinceRegistration });
              stats.remindersSent++;
            }
          }
        } catch (e) {
          stats.errors++;
          console.error(`[DailyNotif] Check-in error for user ${user._id}:`, e.message);
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
