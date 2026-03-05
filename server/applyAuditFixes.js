/**
 * CounselorReady Wiring Audit — Apply All 5 Fixes
 * Run from repo root: node applyAuditFixes.js
 * 
 * Fix 1 (HIGH):  Stripe course purchase redirect URLs
 * Fix 2 (MEDIUM): Enroll route slug lookup
 * Fix 3 (LOW):   Delete misplaced files in routes/
 * Fix 4 (LOW):   Standardize frontend env vars → CLIENT_URL
 * Fix 5 (LOW):   Delete unused StorageUsage model
 * 
 * GAITP LLC • NBCC ACEP #7760
 */

import fs from 'fs';
import path from 'path';

const DRY_RUN = process.argv.includes('--dry-run');
const log = (icon, msg) => console.log(`${icon}  ${msg}`);
const sep = () => console.log('─'.repeat(60));

let fixCount = 0;
let skipCount = 0;
let errorCount = 0;

// ─── Helpers ────────────────────────────────────────────────

function replaceInFile(filePath, searchStr, replaceStr, label) {
  if (!fs.existsSync(filePath)) {
    log('⚠️', `SKIP: ${filePath} not found`);
    skipCount++;
    return false;
  }
  const content = fs.readFileSync(filePath, 'utf-8');
  if (!content.includes(searchStr)) {
    // Check if already fixed
    if (content.includes(replaceStr)) {
      log('✅', `ALREADY FIXED: ${label}`);
      skipCount++;
      return false;
    }
    log('⚠️', `SKIP: Search string not found for "${label}" in ${filePath}`);
    skipCount++;
    return false;
  }
  if (DRY_RUN) {
    log('🔍', `DRY RUN would fix: ${label}`);
    return true;
  }
  const updated = content.replace(searchStr, replaceStr);
  fs.writeFileSync(filePath, updated, 'utf-8');
  log('✅', `FIXED: ${label}`);
  fixCount++;
  return true;
}

function deleteFile(filePath, label) {
  if (!fs.existsSync(filePath)) {
    log('✅', `ALREADY GONE: ${label}`);
    skipCount++;
    return false;
  }
  if (DRY_RUN) {
    log('🔍', `DRY RUN would delete: ${filePath}`);
    return true;
  }
  fs.unlinkSync(filePath);
  log('🗑️', `DELETED: ${label}`);
  fixCount++;
  return true;
}

// ─── Fix 1: Stripe Course Purchase Redirects (HIGH) ─────────

function fix1_stripeRedirects() {
  sep();
  log('🔴', 'FIX 1 (HIGH): Stripe Course Purchase Redirect URLs');
  const file = 'server/src/routes/payments.js';

  // Fix success_url
  replaceInFile(
    file,
    'success_url: `${baseUrl}/course-player.html?slug=${course.slug}&purchased=true`',
    'success_url: `${baseUrl}/learn/${course.slug}?purchased=true`',
    'Course purchase success_url → /learn/${slug}'
  );

  // Fix cancel_url
  replaceInFile(
    file,
    'cancel_url: `${baseUrl}/course-details.html?slug=${course.slug}&canceled=true`',
    'cancel_url: `${baseUrl}/learn?canceled=true`',
    'Course purchase cancel_url → /learn'
  );
}

// ─── Fix 2: Enroll Route Slug Lookup (MEDIUM) ───────────────

function fix2_enrollRoute() {
  sep();
  log('🟡', 'FIX 2 (MEDIUM): Enroll Route Slug Lookup');
  const file = 'server/src/routes/interactiveCourseRoutes.js';

  // Replace raw ObjectId lookup with findCourseByIdOrSlug
  replaceInFile(
    file,
    `const course = await Course.findOne({ _id: req.params.id, status: 'published' });`,
    `const found = await findCourseByIdOrSlug(req.params.id);
    const course = found && found.status === 'published' ? found : null;`,
    'Enroll route → findCourseByIdOrSlug()'
  );
}

// ─── Fix 3: Delete Misplaced Files in routes/ (LOW) ─────────

function fix3_misplacedFiles() {
  sep();
  log('🟢', 'FIX 3 (LOW): Delete Misplaced Files in routes/');
  const routesDir = 'server/src/routes';
  const junkFiles = [
    'User.js',
    'debugCertificates.js',
    'fixCertificates.js',
    'testCloudinarySigning.js',
    'lti(1).js',
  ];

  for (const file of junkFiles) {
    deleteFile(path.join(routesDir, file), `routes/${file}`);
  }
}

// ─── Fix 4: Standardize Env Vars (LOW) ──────────────────────

function fix4_envVars() {
  sep();
  log('🟢', 'FIX 4 (LOW): Standardize Frontend URL Env Vars → CLIENT_URL');

  // Files that use FRONTEND_URL for the frontend
  // (Only replace where it clearly means the React frontend, not the API)
  const frontendUrlFiles = [
    'server/src/routes/payments.js',
    'server/src/routes/lti.js',
  ];

  for (const file of frontendUrlFiles) {
    if (!fs.existsSync(file)) {
      log('⚠️', `SKIP: ${file} not found`);
      skipCount++;
      continue;
    }
    const content = fs.readFileSync(file, 'utf-8');

    // Replace FRONTEND_URL references that mean the React frontend
    if (content.includes('process.env.FRONTEND_URL')) {
      if (DRY_RUN) {
        log('🔍', `DRY RUN would replace FRONTEND_URL → CLIENT_URL in ${file}`);
      } else {
        const updated = content.replace(
          /process\.env\.FRONTEND_URL/g,
          'process.env.CLIENT_URL'
        );
        fs.writeFileSync(file, updated, 'utf-8');
        log('✅', `FIXED: FRONTEND_URL → CLIENT_URL in ${file}`);
        fixCount++;
      }
    } else {
      log('✅', `ALREADY FIXED: No FRONTEND_URL in ${file}`);
      skipCount++;
    }
  }

  // Handle PLATFORM_URL in email templates
  const emailFiles = [
    'server/src/services/emailService.js',
  ];

  for (const file of emailFiles) {
    if (!fs.existsSync(file)) {
      log('⚠️', `SKIP: ${file} not found`);
      skipCount++;
      continue;
    }
    const content = fs.readFileSync(file, 'utf-8');
    if (content.includes('process.env.PLATFORM_URL')) {
      if (DRY_RUN) {
        log('🔍', `DRY RUN would replace PLATFORM_URL → CLIENT_URL in ${file}`);
      } else {
        const updated = content.replace(
          /process\.env\.PLATFORM_URL/g,
          'process.env.CLIENT_URL'
        );
        fs.writeFileSync(file, updated, 'utf-8');
        log('✅', `FIXED: PLATFORM_URL → CLIENT_URL in ${file}`);
        fixCount++;
      }
    } else {
      log('✅', `ALREADY FIXED: No PLATFORM_URL in ${file}`);
      skipCount++;
    }
  }

  // Handle BASE_URL where it means the frontend (LTI, xAPI)
  // NOTE: Only replace where context clearly means frontend URL.
  // Some BASE_URL uses genuinely mean the API — those are left alone.
  const baseUrlFiles = [
    'server/src/routes/lti.js',
  ];

  for (const file of baseUrlFiles) {
    if (!fs.existsSync(file)) continue;
    const content = fs.readFileSync(file, 'utf-8');

    // Look for BASE_URL used as frontend redirect (not API base)
    // This is context-dependent — only fix known patterns
    if (content.includes("process.env.BASE_URL || 'https://counselorready.com'")) {
      if (DRY_RUN) {
        log('🔍', `DRY RUN would replace BASE_URL frontend fallback in ${file}`);
      } else {
        const updated = content.replace(
          /process\.env\.BASE_URL \|\| 'https:\/\/counselorready\.com'/g,
          "process.env.CLIENT_URL || 'https://counselorready.com'"
        );
        fs.writeFileSync(file, updated, 'utf-8');
        log('✅', `FIXED: BASE_URL frontend fallback → CLIENT_URL in ${file}`);
        fixCount++;
      }
    }
  }

  log('💡', 'NOTE: Update your .env to ensure CLIENT_URL=https://counselorready.com');
  log('💡', 'NOTE: You can remove FRONTEND_URL and PLATFORM_URL from .env after deploy');
}

// ─── Fix 5: Delete Unused StorageUsage Model (LOW) ──────────

function fix5_storageUsage() {
  sep();
  log('🟢', 'FIX 5 (LOW): Delete Unused StorageUsage Model');
  deleteFile('server/src/models/StorageUsage.js', 'models/StorageUsage.js');
}

// ─── Main ───────────────────────────────────────────────────

console.log('\n');
console.log('╔══════════════════════════════════════════════════════════╗');
console.log('║   CounselorReady Wiring Audit — Fix All 5 Issues       ║');
console.log('║   GAITP LLC • NBCC ACEP #7760                         ║');
console.log('╚══════════════════════════════════════════════════════════╝');
if (DRY_RUN) {
  console.log('\n  🔍  DRY RUN MODE — no files will be changed\n');
}

fix1_stripeRedirects();
fix2_enrollRoute();
fix3_misplacedFiles();
fix4_envVars();
fix5_storageUsage();

sep();
console.log('\n  📊  Summary');
console.log(`     ✅ Fixed:   ${fixCount}`);
console.log(`     ⏭️  Skipped: ${skipCount}`);
console.log(`     ❌ Errors:  ${errorCount}`);

if (DRY_RUN) {
  console.log('\n  Run without --dry-run to apply changes.');
} else if (fixCount > 0) {
  console.log('\n  ✅ All fixes applied. Review changes, then:');
  console.log('     1. git add -A');
  console.log('     2. git commit -m "fix: apply wiring audit fixes (5 items)"');
  console.log('     3. git push origin main');
  console.log('     4. Render auto-deploys from main');
}
console.log('\n');
