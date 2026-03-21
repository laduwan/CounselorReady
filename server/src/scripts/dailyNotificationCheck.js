// ============================================================================
// NEW FILE: server/src/jobs/dailyNotificationCheck.js
//
// Run this daily via cron, Render Cron Job, or node-cron.
// Scans all users for upcoming renewals, low hours, expirations, 
// and abandoned courses, then fires the appropriate triggers.
//
// SETUP OPTIONS:
//   Option A (node-cron in server.js):
//     import cron from 'node-cron';
//     import { runDailyNotificationCheck } from './jobs/dailyNotificationCheck.js';
//     cron.schedule('0 9 * * *', runDailyNotificationCheck); // 9 AM daily
//
//   Option B (Render Cron Job):
//     Command: node -e "import('./src/jobs/dailyNotificationCheck.js').then(m => m.runDailyNotificationCheck())"
//     Schedule: 0 9 * * *
// ============================================================================

import User from '../models/User.js';
import {
  triggerCeRenewalReminder,
  triggerLowHoursAlert,
  triggerCredentialExpiring,
  triggerInsuranceExpiring,
  triggerCourseReminder
} from '../services/notificationTriggerService.js';

export async function runDailyNotificationCheck() {
  console.log('[NotificationCheck] Starting daily check at', new Date().toISOString());
  
  const stats = {
    usersChecked: 0,
    ceReminders: 0,
    lowHoursAlerts: 0,
    credentialAlerts: 0,
    insuranceAlerts: 0,
    courseReminders: 0,
    errors: 0
  };

  try {
    // Get all active users with credentials or insurance
    const users = await User.find({
      'notifications.unsubscribeAll': { $ne: true }
    }).select('email firstName credentials liabilityInsurance courseProgress notifications');

    for (const user of users) {
      stats.usersChecked++;

      try {
        // ── Check credential renewals ──
        if (user.credentials && user.credentials.length > 0) {
          for (const cred of user.credentials) {
            if (!cred.renewalDate) continue;

            const daysRemaining = Math.ceil((new Date(cred.renewalDate) - new Date()) / (1000 * 60 * 60 * 24));
            
            if (daysRemaining <= 0) continue; // Already expired — handled by credentialExpiring
            if (daysRemaining > 90) continue; // Too far out

            // CE renewal reminder (checks user's preferred reminder intervals internally)
            await triggerCeRenewalReminder(user._id, {
              credentialType: cred.type,
              state: cred.state,
              renewalDate: cred.renewalDate,
              daysRemaining,
              hoursCompleted: cred.hoursCompleted || 0,
              hoursRequired: cred.hoursRequired || 35
            });
            stats.ceReminders++;

            // Low hours check (checks threshold internally)
            await triggerLowHoursAlert(user._id, {
              credentialType: cred.type,
              state: cred.state,
              renewalDate: cred.renewalDate,
              daysRemaining,
              hoursCompleted: cred.hoursCompleted || 0,
              hoursRequired: cred.hoursRequired || 35
            });
            stats.lowHoursAlerts++;
          }

          // Credential expiration check
          for (const cred of user.credentials) {
            if (!cred.expirationDate) continue;
            
            const daysRemaining = Math.ceil((new Date(cred.expirationDate) - new Date()) / (1000 * 60 * 60 * 24));
            
            if (daysRemaining > 90 || daysRemaining < -7) continue;
            
            // Only fire at specific intervals: 90, 30, 14, 7, 3, 1, 0
            const alertDays = [90, 30, 14, 7, 3, 1, 0];
            if (alertDays.includes(daysRemaining)) {
              await triggerCredentialExpiring(user._id, {
                credentialType: cred.type,
                state: cred.state,
                expirationDate: cred.expirationDate,
                daysRemaining
              });
              stats.credentialAlerts++;
            }
          }
        }

        // ── Check insurance expiration ──
        if (user.liabilityInsurance?.expirationDate) {
          const daysRemaining = Math.ceil(
            (new Date(user.liabilityInsurance.expirationDate) - new Date()) / (1000 * 60 * 60 * 24)
          );
          
          if (daysRemaining <= 60 && daysRemaining >= -3) {
            await triggerInsuranceExpiring(user._id, {
              provider: user.liabilityInsurance.provider || 'your provider',
              expirationDate: user.liabilityInsurance.expirationDate,
              daysRemaining
            });
            stats.insuranceAlerts++;
          }
        }

        // ── Check abandoned courses (no activity in 7+ days) ──
        if (user.courseProgress && user.courseProgress.length > 0) {
          const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
          
          for (const progress of user.courseProgress) {
            if (progress.completedAt) continue; // Already finished
            if (!progress.lastAccessedAt) continue;
            if (new Date(progress.lastAccessedAt) > sevenDaysAgo) continue; // Active recently
            
            // Only send one course reminder per day per user
            await triggerCourseReminder(user._id, {
              courseTitle: progress.courseTitle || 'your course',
              courseSlug: progress.courseSlug || '',
              percentComplete: progress.percentComplete || 0,
              lastAccessedAt: progress.lastAccessedAt
            });
            stats.courseReminders++;
            break; // Only one reminder per user per day
          }
        }

      } catch (userErr) {
        console.error(`[NotificationCheck] Error processing user ${user._id}:`, userErr);
        stats.errors++;
      }
    }

  } catch (err) {
    console.error('[NotificationCheck] Fatal error:', err);
    stats.errors++;
  }

  console.log('[NotificationCheck] Complete:', stats);
  return stats;
}
