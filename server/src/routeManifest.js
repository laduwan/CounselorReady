/**
 * CounselorReady Route Manifest
 * ═══════════════════════════════
 * SINGLE SOURCE OF TRUTH for all route registrations.
 * 
 * WHY THIS EXISTS:
 * Routes were being lost every time index.js was edited — imports would
 * get dropped, features would silently break. This manifest file ensures
 * that ALL routes survive any edit to index.js. 
 * 
 * index.js just calls: mountAllRoutes(app)
 * 
 * TO ADD A NEW ROUTE:
 * 1. Create the route file in server/src/routes/
 * 2. Add it to the ROUTE_MANIFEST array below
 * 3. That's it. It auto-mounts on next deploy.
 * 
 * DO NOT mount routes directly in index.js — add them here instead.
 */

import authRoutes from './routes/auth.js';
import interactiveCourseRoutes from './routes/interactiveCourseRoutes.js';
import coursesRoutes from './routes/courses.js';
import adminRoutes from './routes/admin.js';
import usersRoutes from './routes/users.js';
import certificatesRoutes from './routes/certificates.js';
import credentialsRoutes from './routes/credentials.js';
import paymentsRoutes from './routes/payments.js';
import analyticsRoutes from './routes/analytics.js';
import migrationRoutes from './routes/migration.js';
import announcementsRoutes from './routes/announcements.js';
import remindersRoutes from './routes/reminders.js';
import scanRoutes from './routes/scan.js';
import scormRoutes from './routes/scorm.js';
import ltiRoutes from './routes/lti.js';
import xapiRoutes from './routes/xapi.js';
import cebrokerRoutes from './routes/cebroker.js';
import helpRoutes from './routes/help.js';
import bulkUploadRoutes from './routes/bulkUpload.js';
import courseBuilderRoutes from './routes/courseBuilder.js';
import narrationRoutes from './routes/narration.js';
import aiRoutes from './routes/ai.js';
import aiCourseGeneratorRoutes from './routes/aiCourseGenerator.js';
import gamificationRoutes from './routes/gamification.js';
import referralsRoutes from './routes/referrals.js';
import boardAlertsRoutes from './routes/boardAlerts.js';
import cePlannerRoutes from './routes/cePlanner.js';
import imageUploadRoutes from './routes/imageUpload.js';
import adminStatsRoutes from './routes/adminStats.js';
import researchReadyRoutes from './routes/researchReady.js';
import toolsRoutes from './routes/tools.js';
import partnersRoutes from './routes/partners.js';
import notificationsRoutes from './routes/notifications.js';
import recommendationsRoutes from './routes/recommendations.js';
import rewardsRoutes from './routes/rewards.js';
import blogRoutes from './routes/blog.js';
import remediationRoutes from './routes/remediation.js';
import adminRewardsRoutes from './routes/adminRewards.js';
import securityRoutes from './routes/security.js';
import supervisionRoutes from './routes/supervision.js';
import insuranceCredentialsRoutes from './routes/insuranceCredentials.js';
import legacyVaultRoutes from './routes/legacyVault.js';
import groupLicensesRoutes from './routes/groupLicenses.js';
import scholarlyArticlesRoutes from './routes/scholarlyArticles.js';
import toolRoutes from './routes/toolRoutes.js';
import toolAnalyticsRoutes from './routes/toolAnalytics.js';

/**
 * Route Manifest — add new routes here.
 * Format: [mountPath, routeHandler, label]
 */
const ROUTE_MANIFEST = [
  // ── Core ──
  ['/api/auth',                  authRoutes,                'Auth'],
  ['/api/interactive-courses',   interactiveCourseRoutes,   'Interactive Courses (full pipeline)'],
  ['/api/courses',               coursesRoutes,             'Courses (legacy)'],
  ['/api/users',                 usersRoutes,               'Users'],
  ['/api/certificates',          certificatesRoutes,        'Certificates'],
  ['/api/credentials',           credentialsRoutes,         'Credentials'],
  ['/api/payments',              paymentsRoutes,            'Payments'],
  ['/api/notifications',         notificationsRoutes,       'Notifications'],

  // ── Admin ──
  ['/api/admin',                 adminRoutes,               'Admin (includes courses/users/AI/stripe/coupons)'],
  ['/api/admin/courses',         bulkUploadRoutes,          'Bulk Upload'],
  ['/api/admin/stats',           adminStatsRoutes,          'Admin Stats'],
  ['/api/admin/rewards',         adminRewardsRoutes,        'Admin Rewards'],

  // ── Features ──
  ['/api/gamification',          gamificationRoutes,        'Gamification / Achievements'],
  ['/api/referrals',             referralsRoutes,           'Referrals (Pass the Key)'],
  ['/api/rewards',               rewardsRoutes,             'Rewards / MMP Points'],
  ['/api/board-alerts',          boardAlertsRoutes,         'Board Alerts'],
  ['/api/ce-planner',            cePlannerRoutes,           'CE Planner'],
  ['/api/recommendations',       recommendationsRoutes,     'Recommendations'],
  ['/api/research-ready',        researchReadyRoutes,       'Researched & Ready'],
  ['/api/scan',                  scanRoutes,                'Credential Scanner'],
  ['/api/images',                imageUploadRoutes,         'Image Upload'],
  ['/api/announcements',         announcementsRoutes,       'Announcements'],
  ['/api/reminders',             remindersRoutes,           'Reminders'],
  ['/api/analytics',             analyticsRoutes,           'Analytics'],
  ['/api/help',                  helpRoutes,                'Help / Articles'],
  ['/api/blog',                  blogRoutes,                'Blog'],
  ['/api/remediation',           remediationRoutes,         'Remediation'],
  ['/api/tools',                 toolsRoutes,               'Clinical Tools'],
  ['/api/partners',              partnersRoutes,            'Partners'],

  // ── Course Builder / AI ──
  ['/api/course-builder',        courseBuilderRoutes,        'Course Builder'],
  ['/api/narration',             narrationRoutes,           'Narration'],
  ['/api/ai',                    aiRoutes,                  'AI'],
  ['/api/ai-course-generator',   aiCourseGeneratorRoutes,   'AI Course Generator'],

  // ── Integrations ──
  ['/api/migration',             migrationRoutes,           'Migration'],
  ['/api/cebroker',              cebrokerRoutes,            'CE Broker'],
  ['/api/scorm',                 scormRoutes,               'SCORM'],
  ['/api/lti',                   ltiRoutes,                 'LTI'],
  ['/api/xapi',                  xapiRoutes,                'xAPI'],
  ['/api/security',              securityRoutes,            'Security / 2FA'],
  ['/api/supervision',           supervisionRoutes,         'Supervision Logs'],
  ['/api/insurance-credentials', insuranceCredentialsRoutes,'Insurance Credentials'],
  ['/api/legacy-vault',          legacyVaultRoutes,         'Legacy Vault'],
  ['/api/group-licenses',        groupLicensesRoutes,       'Group Licenses'],
  ['/api/scholarly-articles',    scholarlyArticlesRoutes,   'Scholarly Articles'],
  ['/api/tool-actions',          toolRoutes,                'Tool Actions'],
  ['/api/tool-analytics',        toolAnalyticsRoutes,       'Tool Analytics'],
];

/**
 * Mount all routes and log the manifest on startup.
 */
export function mountAllRoutes(app) {
  let mounted = 0;
  let failed = 0;

  for (const [path, handler, label] of ROUTE_MANIFEST) {
    try {
      app.use(path, handler);
      mounted++;
    } catch (err) {
      console.error(`❌ Failed to mount ${label} at ${path}: ${err.message}`);
      failed++;
    }
  }

  console.log(`\n📋 Route Manifest: ${mounted} mounted, ${failed} failed`);
  console.log('   Registered paths:');
  ROUTE_MANIFEST.forEach(([path, , label]) => {
    console.log(`   ├─ ${path.padEnd(30)} ${label}`);
  });
  console.log('');

  return { mounted, failed, total: ROUTE_MANIFEST.length };
}
