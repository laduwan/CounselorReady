/**
 * renewalReminderJob.js
 * Cron job — runs daily at 8 AM ET, sends SMS at 90/30/7 days before credential expiry.
 * Place at: server/src/jobs/renewalReminderJob.js
 *
 * Wire into index.js:
 *   import { startRenewalReminderJob } from './jobs/renewalReminderJob.js';
 *   // inside mongoose.connect callback:
 *   startRenewalReminderJob();
 */

import cron from 'node-cron';
import mongoose from 'mongoose';
import { sendRenewalReminderSMS } from '../services/smsService.js';

const REMINDER_DAYS = [90, 30, 7];

// Lazy model references — avoids import-order issues
function getModels() {
  const User = mongoose.model('User');
  const UserCredential = mongoose.model('UserCredential');
  return { User, UserCredential };
}

async function runRenewalReminders() {
  console.log('[RenewalJob] Running CE renewal reminder check...');
  const { User, UserCredential } = getModels();

  for (const days of REMINDER_DAYS) {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + days);
    const start = new Date(targetDate);
    const end   = new Date(targetDate);
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    const credentials = await UserCredential.find({
      expiresAt: { $gte: start, $lte: end },
      status: { $ne: 'expired' }
    }).lean();

    console.log(`[RenewalJob] ${credentials.length} credentials expiring in ${days} days`);

    for (const cred of credentials) {
      try {
        const user = await User.findById(cred.userId).select('firstName phone smsOptIn').lean();
        if (!user?.phone || !user?.smsOptIn) continue;
        await sendRenewalReminderSMS(user, cred, days);
      } catch (err) {
        console.error(`[RenewalJob] Error for credential ${cred._id}:`, err.message);
      }
    }
  }

  console.log('[RenewalJob] Done.');
}

/**
 * Start the cron job.
 * Schedule: daily at 8:00 AM Eastern (13:00 UTC).
 */
export function startRenewalReminderJob() {
  // '0 13 * * *' = 8 AM ET (UTC-5) / adjust for DST as needed
  cron.schedule('0 13 * * *', runRenewalReminders, {
    timezone: 'America/New_York'
  });
  console.log('[RenewalJob] Scheduled — daily at 8 AM ET');
}

// Allow manual trigger via: node -e "import('./jobs/renewalReminderJob.js').then(m => m.runRenewalReminders())"
export { runRenewalReminders };
