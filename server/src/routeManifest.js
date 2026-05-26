/**
 * CounselorReady Route Manifest
 * ═══════════════════════════════
 * SINGLE SOURCE OF TRUTH for declared API route registrations.
 *
 * NOTE — mountAllRoutes() is NOT currently used. index.js mounts manually.
 * The manifest is consumed by verifyRoutes() in index.js as the declared
 * set, which is cross-checked against the paths actually mounted at boot.
 *
 * If anyone ever adopts mountAllRoutes() to replace the manual mounts,
 * sub-paths (e.g. '/api/admin/stats') MUST precede catch-alls
 * (e.g. '/api/admin') in this array — otherwise the catch-all is
 * registered first and Express will shadow the sub-paths.
 *
 * TO ADD A NEW ROUTE:
 *   1. Create the route file in server/src/routes/
 *   2. Add an import + an entry to ROUTE_MANIFEST below
 *   3. Add the matching app.use(...) to index.js
 *   4. Boot the server — the integrity check will confirm everything mounts.
 */

import authRoutes from './routes/auth.js';
import interactiveCourseRoutes from './routes/interactiveCourseRoutes.js';
import coursesRoutes from './routes/courses.js';
import adminRoutes from './routes/admin.js';
import adminAuditRoutes from './routes/adminAudit.js';
import adminCoursesRoutes from './routes/adminCourses.js';
import adminUsersRoutes from './routes/adminUsers.js';
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
import boardSourcesRoutes from './routes/boardSources.js';
import googleCalendarRoutes from './routes/googleCalendar.js';
import resendWebhookRoutes from './routes/webhooksResend.js';
import cePlannerRoutes from './routes/cePlanner.js';
import imageUploadRoutes from './routes/imageUpload.js';
import fileUploadRoutes from './routes/fileUpload.js';
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
import adminStripeRoutes from './routes/adminStripe.js';
import adminCouponsRoutes from './routes/adminCoupons.js';
import adminCoursePresentationRoutes from './routes/adminCoursePresentation.js';
import organizationsRoutes from './routes/organizations.js';
import auditKitRoutes from './routes/auditKit.js';
import uploadsRoutes from './routes/uploads.js';

/**
 * Route Manifest — declared route registrations.
 * Format: [mountPath, routeHandler, label]
 *
 * Ordering rule: all '/api/admin/<subpath>' entries MUST appear before
 * the bare '/api/admin' catch-all entries. Sub-paths first, catch-alls last.
 */
export const ROUTE_MANIFEST = [
  // ── Core ──
  ['/api/auth',                  authRoutes,                'Auth'],
  ['/api/interactive-courses',   interactiveCourseRoutes,   'Interactive Courses (full pipeline)'],
  ['/api/courses',               coursesRoutes,             'Courses (legacy)'],
  ['/api/users',                 usersRoutes,               'Users'],
  ['/api/certificates',          certificatesRoutes,        'Certificates'],
  ['/api/credentials',           credentialsRoutes,         'Credentials'],
  ['/api/payments',              paymentsRoutes,            'Payments'],
  ['/api/notifications',         notificationsRoutes,       'Notifications'],

  // ── Admin sub-paths (MUST come before the '/api/admin' catch-alls) ──
  ['/api/admin/stats',           adminStatsRoutes,          'Admin Stats'],
  ['/api/admin/stripe',          adminStripeRoutes,         'Admin Stripe'],
  ['/api/admin/coupons',         adminCouponsRoutes,        'Admin Coupons'],
  ['/api/admin/audit',           adminAuditRoutes,          'Admin Audit'],
  ['/api/admin/courses',         bulkUploadRoutes,          'Admin Bulk Upload'],
  ['/api/admin/rewards',         adminRewardsRoutes,        'Admin Rewards'],
  ['/api/admin/course-presentation', adminCoursePresentationRoutes, 'Admin Course Presentation'],

  // ── Admin catch-alls (stacked on '/api/admin') ──
  ['/api/admin',                 adminRoutes,               'Admin (core)'],
  ['/api/admin',                 adminCoursesRoutes,        'Admin Courses (catch-all stack)'],
  ['/api/admin',                 adminUsersRoutes,          'Admin Users (catch-all stack)'],

  // ── Features ──
  ['/api/gamification',          gamificationRoutes,        'Gamification / Achievements'],
  ['/api/referrals',             referralsRoutes,           'Referrals (Pass the Key)'],
  ['/api/rewards',               rewardsRoutes,             'Rewards / MMP Points'],
  ['/api/board-alerts',          boardAlertsRoutes,         'Board Alerts'],
  ['/api/board-sources',         boardSourcesRoutes,        'Board Sources (admin monitor mgmt)'],
  ['/api/google-calendar',       googleCalendarRoutes,      'Google Calendar (OAuth + sync)'],
  ['/api/webhooks/resend',       resendWebhookRoutes,       'Resend email webhook (open/click tracking)'],
  ['/api/ce-planner',            cePlannerRoutes,           'CE Planner'],
  ['/api/recommendations',       recommendationsRoutes,     'Recommendations'],
  ['/api/research-ready',        researchReadyRoutes,       'Researched & Ready'],
  ['/api/scan',                  scanRoutes,                'Credential Scanner'],
  ['/api/images',                imageUploadRoutes,         'Image Upload'],
  ['/api/files',                 fileUploadRoutes,          'Course File Upload'],
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
  ['/api/organizations',         organizationsRoutes,       'Organizations'],
  ['/api/audit-kit',             auditKitRoutes,            'Audit Kit'],
  ['/api/uploads',               uploadsRoutes,             'Uploads'],
];

/**
 * Mount all routes and log the manifest on startup.
 *
 * NOTE: This function is NOT currently used by index.js. index.js mounts
 * manually. If adopting mountAllRoutes(), sub-paths MUST precede catch-alls
 * in ROUTE_MANIFEST or they will be shadowed.
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
