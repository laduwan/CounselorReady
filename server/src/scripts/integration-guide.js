// ============================================================================
// INTEGRATION GUIDE — Merged Notification System (Email + SMS)
//
// 7 files total. Here's exactly where each goes and what to do.
// ============================================================================


// ═══════════════════════════════════════════════════════════════════════════
// FILE MAP
// ═══════════════════════════════════════════════════════════════════════════
//
// FILE                               → DESTINATION                                   ACTION
// ─────────────────────────────────────────────────────────────────────────────────────────────
// user-model-notifications-patch.js  → server/src/models/User.js                     PATCH (replace notifications field)
// notification-routes.js             → server/src/routes/auth.js                      PATCH (replace 2 routes)
// notificationTriggerService.js      → server/src/services/notificationTriggerService.js  NEW FILE
// dailyNotificationCheck.js          → server/src/jobs/dailyNotificationCheck.js      NEW FILE
// settings-notifications.html        → settings.html                                  PATCH (replace notification <section>)
// test-sms-route.js                  → server/src/routes/notifications.js             PATCH (add 1 route)
// integration-guide.js               → (reference only — don't deploy)
//
// INSTALL: npm install node-cron


// ═══════════════════════════════════════════════════════════════════════════
// STEP 1: User Model (server/src/models/User.js)
// ═══════════════════════════════════════════════════════════════════════════
//
// Open User.js and find the existing `notifications: { ... }` block.
// Replace the entire block with the contents of user-model-notifications-patch.js.
//
// Also make sure these fields exist on the schema (add if missing):
//
//   phone: String,
//   smsVerified: { type: Boolean, default: false },
//   smsRemindersEnabled: { type: Boolean, default: false },


// ═══════════════════════════════════════════════════════════════════════════
// STEP 2: Auth Routes (server/src/routes/auth.js)
// ═══════════════════════════════════════════════════════════════════════════
//
// Find and replace the existing PUT /update-notifications route with the
// one from notification-routes.js.
//
// Add the GET /notification-preferences route if it doesn't already exist.


// ═══════════════════════════════════════════════════════════════════════════
// STEP 3: Create Trigger Service (NEW FILE)
// ═══════════════════════════════════════════════════════════════════════════
//
// Drop notificationTriggerService.js into server/src/services/.
//
// Verify the imports at the top match your project:
//   - import { sendEmail } from './emailService.js';        ← your Resend service
//   - import { sendSMSReminder } from './reminderService.js'; ← your Twilio service
//
// Adjust the import paths if yours are named differently.


// ═══════════════════════════════════════════════════════════════════════════
// STEP 4: Create Daily Cron Job (NEW FILE)
// ═══════════════════════════════════════════════════════════════════════════
//
// Drop dailyNotificationCheck.js into server/src/jobs/.
//
// Then wire it up in server.js:
//
import cron from 'node-cron';
import { runDailyNotificationCheck } from './jobs/dailyNotificationCheck.js';

// Daily at 9 AM Eastern
cron.schedule('0 9 * * *', () => {
  console.log('Running daily notification check...');
  runDailyNotificationCheck();
}, { timezone: 'America/New_York' });

// Weekly digest — Sunday at 6 PM Eastern
import { triggerWeeklyDigest } from './services/notificationTriggerService.js';

cron.schedule('0 18 * * 0', async () => {
  console.log('Running weekly digest...');
  const User = (await import('./models/User.js')).default;
  const users = await User.find({
    'notifications.email.weeklyDigest': true,
    'notifications.unsubscribeAll': { $ne: true }
  });
  for (const user of users) {
    await triggerWeeklyDigest(user._id, {
      credentials: [],        // Populate from user's credential data
      recentCompletions: [],   // Populate from last 7 days of completions
      upcomingRenewals: []
    });
  }
}, { timezone: 'America/New_York' });


// ═══════════════════════════════════════════════════════════════════════════
// STEP 5: Settings Page (settings.html)
// ═══════════════════════════════════════════════════════════════════════════
//
// Find the existing <section> with "Notification Preferences" heading.
// Replace the entire <section>...</section> with settings-notifications.html.
// Also delete the old saveNotifications() function from the page's <script>.


// ═══════════════════════════════════════════════════════════════════════════
// STEP 6: Test SMS Route (server/src/routes/notifications.js)
// ═══════════════════════════════════════════════════════════════════════════
//
// Add the route from test-sms-route.js into your notifications route file.
// Add this import at the top if not already there:
//   import { sendTestSMS } from '../services/reminderService.js';


// ═══════════════════════════════════════════════════════════════════════════
// STEP 7: Wire Triggers Into Existing Code
// ═══════════════════════════════════════════════════════════════════════════
//
// Add this import to each file that needs triggers:

import {
  triggerCourseCompleted,
  triggerCertificateReady,
  triggerCeMilestone,
  triggerNewCourseAnnouncement
} from '../services/notificationTriggerService.js';

// WHERE TO CALL EACH TRIGGER:
//
// ┌──────────────────────────┬────────────────────────────────────┬─────────────────────────────────────┐
// │ Trigger                  │ File                               │ When                                │
// ├──────────────────────────┼────────────────────────────────────┼─────────────────────────────────────┤
// │ triggerCourseCompleted   │ routes/courses.js                  │ After posttest pass + course saved  │
// │ triggerCertificateReady  │ routes/certificates.js             │ After certificate generated         │
// │ triggerCeMilestone       │ routes/courses.js (same as above)  │ After updating user's CE totals     │
// │ triggerNewCourseAnnounce │ routes/admin.js                    │ When admin publishes a new course   │
// │ (daily cron handles)     │ server.js via cron                 │ Renewal, low hours, expiration, etc │
// └──────────────────────────┴────────────────────────────────────┴─────────────────────────────────────┘
//
// Example — in your course completion handler:
//
//   await triggerCourseCompleted(user._id, {
//     courseTitle: course.title,
//     ceHours: course.ceHours,
//     contentArea: course.contentArea
//   });
//
//   await triggerCeMilestone(user._id, {
//     totalHours: updatedTotalHours,
//     requiredHours: credential.hoursRequired,
//     credentialType: credential.type
//   });
