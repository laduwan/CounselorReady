/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 *
 * diagnosticsService.js — pure, DB-free diagnosis functions used by the admin
 * "Diagnose" buttons (routes/adminUsers.js) and the CLI diagnostics. Each takes
 * already-loaded records and returns { gates[], verdict, detail, fix }.
 * Faithful to the real logic: certificateSelfHeal.js, UserCredential.js, and
 * User.canAccessCourse().
 */
const TIER = { free: 0, starter: 1, professional: 2, vip: 3 };
const ACTIVE_SUB = ['active', 'trial', 'lifetime', 'paused'];

// --- "Completed but no certificate" ---------------------------------------
export function diagnoseCertificateChain({ user, course, progress, evaluationDoc, certificateDoc }) {
  const gates = [];
  const pass = (label, detail) => gates.push({ ok: true, label, detail });
  const fail = (label, detail, fix) => { gates.push({ ok: false, label, detail, fix }); return { gates, verdict: label, detail, fix }; };

  if (!user) return fail('No user account', 'No user found.', 'Check the account.');
  if (!course) return fail('No course found', 'No course matched.', 'Check the course title/slug/_id.');
  pass('User & course found', `${user.email} — "${course.title}"`);
  if (!progress) return fail('No progress record', 'No progress record for this user+course — they never started it under this account/course.', 'Confirm the account and the exact course record.');
  pass('Progress record exists', `status="${progress.status}"`);
  if (!progress.assessmentPassed) return fail('Assessment not passed', 'assessmentPassed is false.', 'Have them complete/pass the assessment; if they believe they passed, check scoring.');
  pass('Assessment passed', 'assessmentPassed = true');
  const evalSubmitted = evaluationDoc && evaluationDoc.status === 'submitted';
  if (!progress.evaluationCompleted || !evalSubmitted) return fail('Evaluation not submitted', `evaluationCompleted=${!!progress.evaluationCompleted}, submitted Evaluation doc=${evalSubmitted ? 'yes' : 'no'}. The most common reason a "finished" course yields no certificate.`, 'Have them submit the course evaluation.');
  pass('Evaluation submitted', 'evaluationCompleted = true & Evaluation submitted');
  if (!progress.attestationCompleted) return fail('Attestation not completed', 'attestationCompleted is false.', 'Have them complete the attestation step.');
  pass('Attestation completed', 'attestationCompleted = true');
  if (progress.status !== 'completed' && progress.status !== 'certified') return fail('Status not "completed"', `All flags true but status is "${progress.status}" — the completion flip didn't run.`, 'Re-trigger completion or let self-heal re-evaluate.');
  pass('Status is completed', `status = "${progress.status}"`);
  if (!progress.certificateId) {
    if (certificateDoc) return fail('Certificate exists but is NOT linked', `A Certificate (${certificateDoc.certificateNumber || certificateDoc._id}) exists but progress.certificateId is empty.`, 'The self-heal cron re-links this automatically (every 6h). No data loss.');
    return fail('Requirements met, certificate never generated', 'All gates pass but no certificateId and no Certificate document — generation failed silently (Cloudinary timeout / crash).', 'The self-heal cron regenerates this automatically (every 6h); run it now to fix immediately.');
  }
  const certLabel = certificateDoc?.certificateNumber || progress.certificateId;
  pass('Certificate issued & linked', `certificate ${certLabel}`);
  return { gates, verdict: 'Certificate WAS issued', detail: `Certificate ${certLabel} exists and is linked. Issuance succeeded.`, fix: 'Not an issuance problem. If they still can\'t see it, check the certificates page / completion email, not generation.' };
}

// --- "Credential tracker isn't working" -----------------------------------
export function diagnoseCredentialTracker({ user, entitlement, credentials = [], certificates = [], now = new Date() }) {
  const gates = [];
  const pass = (label, detail) => gates.push({ ok: true, label, detail });
  const fail = (label, detail, fix) => { gates.push({ ok: false, label, detail, fix }); return { gates, verdict: label, detail, fix }; };
  if (!user) return fail('No user account', 'No user found.', 'Check the account.');
  const isAdmin = user.role === 'admin';
  if (!isAdmin && entitlement?.isPartnerUser) {
    if (entitlement.addonEnabled === false) return fail('Feature gated — partner add-on disabled', 'Partner-org user whose partner does NOT have the credentialManagement add-on, so every credential API call 403s. Looks broken but is gated by design.', 'Enable credentialManagement on the partner, or confirm they should have it. Not a code bug.');
    pass(entitlement.addonEnabled == null ? 'Entitlement (unverified)' : 'Entitlement', entitlement.addonEnabled == null ? 'Partner user; verify credentialManagement is enabled on the partner.' : 'Partner user with add-on enabled.');
  } else pass('Entitlement', isAdmin ? 'Admin — gate bypassed.' : 'Direct subscriber — gate bypassed.');
  if (!credentials.length) return fail('No credentials created', 'Entitled but zero credential records — empty because nothing was added, not broken.', 'Have the user add a credential. Nothing to repair.');
  pass('Credentials exist', `${credentials.length} credential(s).`);
  const loggedCertIds = new Set();
  for (const c of credentials) for (const log of (c.ceuLogs || [])) if (log.certificateId) loggedCertIds.add(String(log.certificateId));
  const certs = certificates.filter(Boolean);
  if (certs.length) {
    const unlogged = certs.filter(cert => !loggedCertIds.has(String(cert._id)));
    if (unlogged.length === certs.length) return fail('CE not allocated from certificates', `${certs.length} certificate(s) but NONE appear in any credential's ceuLogs — earned CE isn't flowing in, so hours never move.`, 'Trace courseCompletionService allocation (category/dedup), then run POST /api/credentials/recalculate.');
    if (unlogged.length) pass('CE allocation (partial)', `${certs.length - unlogged.length}/${certs.length} logged; ${unlogged.length} not yet (category mismatch/timing).`);
    else pass('CE allocation', `All ${certs.length} certificates reflected in ceuLogs.`);
  } else pass('CE allocation', 'No platform certificates yet.');
  const drifted = [];
  for (const c of credentials) { const sum = (c.ceuLogs || []).reduce((s, l) => s + (l.hours || 0), 0); if (Math.abs(sum - (c.totalCEUsCompleted || 0)) > 0.001) drifted.push({ c, sum }); }
  if (drifted.length) { const d = drifted[0]; return fail('Totals out of sync with logs', `On "${d.c.name || d.c.licenseType || d.c._id}", totalCEUsCompleted=${d.c.totalCEUsCompleted} but ceuLogs sum to ${d.sum}.`, 'Run POST /api/credentials/recalculate — rebuilds totals from ceuLogs.'); }
  pass('Totals consistent', 'totalCEUsCompleted matches ceuLogs on every credential.');
  const stale = credentials.filter(c => { if (!c.expirationDate) return false; const past = new Date(c.expirationDate) < now; return (past && c.status === 'active') || (!past && c.status === 'expired'); });
  if (stale.length) { const s = stale[0]; return fail('Status not refreshed', `"${s.name || s.licenseType || s._id}" shows "${s.status}" but its expirationDate disagrees — the pre-save status hook didn't run.`, 'Run /recalculate or re-save the credential.'); }
  pass('Status current', 'Every credential status agrees with its expiration date.');
  return { gates, verdict: 'Tracker data is healthy', detail: 'Entitlement, credentials, CE allocation, totals, and status all check out.', fix: 'If it still looks broken, it\'s client render/load (check the GET /api/credentials response), not the data.' };
}

// --- "I paid but the course didn't unlock" --------------------------------
export function diagnosePaymentUnlock({ user, course }) {
  const gates = [];
  const pass = (label, detail) => gates.push({ ok: true, label, detail });
  const fail = (label, detail, fix) => { gates.push({ ok: false, label, detail, fix }); return { gates, verdict: label, detail, fix }; };
  if (!user) return fail('No user account', 'No user for that email.', 'Confirm which account actually paid (paying while logged into a different account is common).');
  if (!course) return fail('No course found', 'No course matched.', 'Check the course title/slug/_id.');
  pass('User & course found', `${user.email} — "${course.title}"`);
  const isFree = course.accessTier === 'free' || !course.accessTier;
  if (isFree) return fail('Course is free — no purchase needed', 'accessTier "free" (or none) → canAccessCourse returns true for everyone.', 'A locked view is a client render/session issue, not payment.');
  pass('Course is paid/gated', `accessTier="${course.accessTier}", price=${course.price ?? 0}`);
  const pcs = user.purchasedCourses || [];
  const idMatch = course.price && pcs.some(pc => pc.courseId?.toString() === course._id?.toString());
  const slugMatch = pcs.some(pc => pc.slug && course.slug && pc.slug === course.slug);
  if (idMatch) { const rec = pcs.find(pc => pc.courseId?.toString() === course._id?.toString()); return { gates: [...gates, { ok: true, label: 'Purchase recorded & id-matched', detail: `stripeSessionId=${rec?.stripeSessionId || 'n/a'}` }], verdict: 'Purchase IS recorded — unlock should work', detail: 'canAccessCourse returns true via purchasedCourses.', fix: 'If still locked, it\'s the access-check READ path or a stale client — confirm the serving route checks purchasedCourses; have them re-login / hard refresh.' }; }
  if (slugMatch && !idMatch) { const rec = pcs.find(pc => pc.slug === course.slug); return fail('Purchase exists but courseId does NOT match', `A purchase matches this course's slug ("${course.slug}") but its stored courseId (${rec?.courseId}) != the served _id (${course._id}). canAccessCourse compares by courseId only → locked despite payment.`, 'Reconcile purchasedCourses.courseId to the served course _id (likely two course records for the same course).'); }
  const hasSub = ACTIVE_SUB.includes(user.subscription?.status);
  const userTier = hasSub ? (TIER[user.subscription?.plan] || 0) : 0;
  const requiredTier = TIER[course.accessTier] || 0;
  if (userTier >= requiredTier) return { gates: [...gates, { ok: true, label: 'Subscription tier grants access', detail: `userTier=${userTier} (${user.subscription?.plan}/${user.subscription?.status}) >= required ${requiredTier}` }], verdict: 'Subscription tier already grants access', detail: 'Active subscription meets the requirement, so canAccessCourse returns true.', fix: 'A locked view is client/session or read-path, not payment.' };
  return fail('No purchase recorded — webhook/attribution gap', `No purchasedCourses entry matches, and tier (${userTier}) < required (${requiredTier}). The à-la-carte payment never wrote to this account. ${pcs.length ? `(User has ${pcs.length} other purchase(s), so purchasing works.)` : '(No purchases at all.)'}`, 'Chase checkout.session.completed: (1) Stripe shows payment for this email? (2) webhook returned 200? (3) session metadata had type=course_purchase, courseId, userId? (4) is that userId THIS account? Missing STRIPE_WEBHOOK_SECRET or metadata are the usual culprits.');
}
