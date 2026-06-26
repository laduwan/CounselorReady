From 52edb1461144f4dae1a207f3ef0e221891c31878 Mon Sep 17 00:00:00 2001
From: CounselorReady Dev <dev@counselorready.com>
Date: Fri, 26 Jun 2026 11:10:00 +0000
Subject: [PATCH] feat(billing): add $15 Basic tier (unlimited 1-3 CE-hr
 courses) + card-on-file at signup

Basic tier:
- User.subscription.plan enum gains 'basic'
- pricingRules: BASIC_MAX_CE_HOURS=3 + basicCovers(); canAccessCourse() gates Basic on actual course CE hours
- checkCourseAccess passes course doc through
- interactiveCourseRoutes: both access gates cap Basic at 3 CE hrs (OVER_BASIC_HOUR_LIMIT -> upgrade/purchase)
- payments PRICE_IDS/PLAN_DETAILS + createStripePrices provision STRIPE_PRICE_BASIC (1500c)
- subscription.html: Basic plan card + PLANS entry + button state

Card at signup:
- auth /register collects paymentMethodId, creates+attaches Stripe customer BEFORE User.create; stores stripeCustomerId
- gated by REQUIRE_CARD_ON_SIGNUP (default on); partner signups exempt
- register.html: Stripe Elements card field + createPaymentMethod before submit
---
 client/public/register.html                  | 60 +++++++++++++++++++-
 client/public/subscription.html              | 37 +++++++++++-
 server/src/middleware/checkCourseAccess.js   |  1 +
 server/src/models/User.js                    |  2 +-
 server/src/routes/auth.js                    | 49 +++++++++++++++-
 server/src/routes/interactiveCourseRoutes.js | 19 ++++++-
 server/src/routes/payments.js                |  2 +
 server/src/scripts/createStripePrices.js     |  1 +
 server/src/utils/pricingRules.js             | 45 ++++++++++++++-
 9 files changed, 208 insertions(+), 8 deletions(-)

diff --git a/client/public/register.html b/client/public/register.html
index 7034f85..2f73632 100644
--- a/client/public/register.html
+++ b/client/public/register.html
@@ -135,6 +135,18 @@
             </div>
           </div>
 
+          <!-- Payment Method -->
+          <div id="cardField">
+            <label class="block text-sm font-medium text-forest-700 mb-2">
+              Card Details
+            </label>
+            <div id="card-element" class="w-full px-4 py-3 border border-forest-200 rounded-xl focus-within:ring-2 focus-within:ring-burgundy-500 focus-within:border-burgundy-500 transition-all"></div>
+            <p id="card-errors" class="text-red-600 text-sm mt-2" role="alert"></p>
+            <p class="text-xs text-forest-500 mt-2">
+              Your card is securely stored to verify your account. You won't be charged during your free trial.
+            </p>
+          </div>
+
           <!-- Policy Acknowledgment -->
           <div class="bg-forest-50 border border-forest-200 rounded-xl p-4">
             <label class="flex items-start gap-3 cursor-pointer">
@@ -176,7 +188,7 @@
         <div class="mt-6 text-center">
           <p class="text-sm text-forest-600">
             <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
-            7-day free trial • No credit card required
+            7-day free trial • Cancel anytime
           </p>
         </div>
 
@@ -195,6 +207,8 @@
 
   <!-- Footer -->
 
+  <script src="https://js.stripe.com/v3/"></script>
+  <script src="/js/stripe-config.js"></script>
   <script>
     const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:5000' : 'https://api.counselorready.com';
     
@@ -226,6 +240,30 @@
         return;
       }
 
+      // ── Stripe card setup ──────────────────────────────────────────────
+      // Card is required for public signups. If the publishable key is missing
+      // (e.g. local dev), hide the card field and let the backend flag govern.
+      const REQUIRE_CARD = true;
+      let stripe = null;
+      let cardElement = null;
+      const cardField = document.getElementById('cardField');
+      const pk = window.STRIPE_PUBLISHABLE_KEY || '';
+
+      if (REQUIRE_CARD && typeof Stripe !== 'undefined' && pk) {
+        stripe = Stripe(pk);
+        const elements = stripe.elements();
+        cardElement = elements.create('card', {
+          style: { base: { fontSize: '16px', color: '#3d2a30', '::placeholder': { color: '#9ca3af' } } }
+        });
+        cardElement.mount('#card-element');
+        cardElement.on('change', (event) => {
+          document.getElementById('card-errors').textContent = event.error ? event.error.message : '';
+        });
+      } else if (cardField) {
+        // No Stripe available — remove the card UI so signup isn't blocked client-side.
+        cardField.style.display = 'none';
+      }
+
       form.addEventListener('submit', async (e) => {
         e.preventDefault();
         
@@ -255,6 +293,25 @@
           </svg>
         `;
 
+        // Create a PaymentMethod from the card before registering.
+        let paymentMethodId = null;
+        if (stripe && cardElement) {
+          const { paymentMethod, error } = await stripe.createPaymentMethod({
+            type: 'card',
+            card: cardElement,
+            billing_details: { name: `${firstName} ${lastName}`.trim(), email }
+          });
+          if (error) {
+            document.getElementById('card-errors').textContent = error.message;
+            errorText.textContent = error.message;
+            errorMessage.classList.remove('hidden');
+            submitBtn.disabled = false;
+            submitBtn.innerHTML = 'Start Free Trial';
+            return;
+          }
+          paymentMethodId = paymentMethod.id;
+        }
+
         try {
           console.log('Attempting registration to:', `${API_URL}/api/auth/register`);
           
@@ -268,6 +325,7 @@
               lastName, 
               email, 
               password,
+              paymentMethodId,
               agreedToTerms: true,
               agreedAt: new Date().toISOString()
             }),
diff --git a/client/public/subscription.html b/client/public/subscription.html
index 33f304a..5c59058 100644
--- a/client/public/subscription.html
+++ b/client/public/subscription.html
@@ -69,7 +69,7 @@
     <section class="mb-8">
       <h2 class="text-xl font-semibold text-burgundy-900 mb-6 text-center">Choose Your Plan</h2>
       
-      <div class="grid md:grid-cols-4 gap-6">
+      <div class="grid md:grid-cols-5 gap-6">
         
         <!-- Free Plan -->
         <div class="bg-white rounded-xl border border-hunter-200 shadow-sm p-6">
@@ -103,6 +103,35 @@
           </button>
         </div>
 
+        <!-- Basic Plan -->
+        <div class="bg-white rounded-xl border border-hunter-300 shadow-sm p-6">
+          <h3 class="font-display text-xl font-semibold text-hunter-800 mb-2">Basic</h3>
+          <div class="mb-4">
+            <span class="text-3xl font-bold text-hunter-900">$15</span>
+            <span class="text-hunter-600">/month</span>
+          </div>
+          <ul class="space-y-2 mb-6 text-sm text-hunter-700">
+            <li class="flex items-center gap-2">
+              <span class="text-green-500">✓</span> <strong>Unlimited 1–3 CE-hour courses</strong>
+            </li>
+            <li class="flex items-center gap-2">
+              <span class="text-green-500">✓</span> Full credential tracking
+            </li>
+            <li class="flex items-center gap-2">
+              <span class="text-green-500">✓</span> Digital certificates
+            </li>
+            <li class="flex items-center gap-2 text-hunter-400">
+              <span>✗</span> Courses over 3 CE hours
+            </li>
+            <li class="flex items-center gap-2 text-hunter-400">
+              <span>✗</span> Multi-state tracking
+            </li>
+          </ul>
+          <button onclick="selectPlan('basic')" class="w-full py-2 bg-hunter-600 hover:bg-hunter-700 text-white rounded-lg transition-colors font-semibold" id="basicBtn">
+            Upgrade Now
+          </button>
+        </div>
+
         <!-- Starter Plan -->
         <div class="bg-white rounded-xl border border-hunter-300 shadow-sm p-6">
           <h3 class="font-display text-xl font-semibold text-hunter-800 mb-2">Starter</h3>
@@ -333,6 +362,7 @@
     // Plan pricing - 4-tier model
     const PLANS = {
       free: { name: 'Free', price: 0, interval: 'month', priceId: null, maxCourseHours: 4, maxStates: 1, consultsPerQuarter: 0 },
+      basic: { name: 'Basic', price: 15, interval: 'month', priceId: 'price_REPLACE_WITH_BASIC_ID', maxCourseHours: 3, maxStates: 1, consultsPerQuarter: 0 },
       starter: { name: 'Starter', price: 19.99, interval: 'month', priceId: 'price_1TiMorBV8IIVTFOIosEIoMCn', maxCourseHours: 999, maxStates: 1, consultsPerQuarter: 0 },
       professional: { name: 'Professional', price: 29.99, interval: 'month', priceId: 'price_1TiMosBV8IIVTFOIoxYzFOcd', maxCourseHours: 999, maxStates: 1, consultsPerQuarter: 0 },
       vip: { name: 'VIP', price: 49.99, interval: 'month', priceId: 'price_1TiMosBV8IIVTFOIxdJ5FQ0q', maxCourseHours: 999, maxStates: 999, consultsPerQuarter: 1, hardshipMonths: 1 },
@@ -477,6 +507,7 @@
 
     function updatePlanButtons(currentPlan) {
       const freeBtn = document.getElementById('freeBtn');
+      const basicBtn = document.getElementById('basicBtn');
       const starterBtn = document.getElementById('starterBtn');
       const proBtn = document.getElementById('proBtn');
       const vipBtn = document.getElementById('vipBtn');
@@ -498,6 +529,10 @@
       freeBtn.textContent = currentPlan === 'free' ? 'Current Plan' : 'Downgrade';
       freeBtn.disabled = currentPlan === 'free';
       
+      // Basic
+      setButton(basicBtn, currentPlan === 'basic', 'Upgrade Now',
+        'w-full py-2 bg-hunter-600 hover:bg-hunter-700 text-white rounded-lg transition-colors font-semibold');
+
       // Starter
       setButton(starterBtn, currentPlan === 'starter', 'Upgrade Now', 
         'w-full py-2 bg-hunter-600 hover:bg-hunter-700 text-white rounded-lg transition-colors font-semibold');
diff --git a/server/src/middleware/checkCourseAccess.js b/server/src/middleware/checkCourseAccess.js
index eb3cb23..b8eb2c3 100644
--- a/server/src/middleware/checkCourseAccess.js
+++ b/server/src/middleware/checkCourseAccess.js
@@ -59,6 +59,7 @@ export default async function checkCourseAccess(req, res, next) {
       userPlan,
       courseTier,
       hasPurchased,
+      course,
     );
 
     req.userHasAccess = allowed;
diff --git a/server/src/models/User.js b/server/src/models/User.js
index ca05940..b11707d 100644
--- a/server/src/models/User.js
+++ b/server/src/models/User.js
@@ -99,7 +99,7 @@ const userSchema = new mongoose.Schema({
     },
     plan: {
       type: String,
-      enum: ['free', 'starter', 'professional', 'vip', 'annual_vip', 'lifetime'],
+      enum: ['free', 'basic', 'starter', 'professional', 'vip', 'annual_vip', 'lifetime'],
       default: 'free'
     },
     stripeCustomerId: { type: String },
diff --git a/server/src/routes/auth.js b/server/src/routes/auth.js
index 2c91aab..050690b 100644
--- a/server/src/routes/auth.js
+++ b/server/src/routes/auth.js
@@ -21,8 +21,16 @@ import Notification from '../models/Notification.js';
 import { sendRealtimeNotification } from './notifications.js';
 import { processReferralSignup } from '../services/rewardsService.js';
 import twilio from 'twilio';
+import Stripe from 'stripe';
 import logger from '../utils/logger.js';
 
+const stripe = process.env.STRIPE_SECRET_KEY
+  ? new Stripe(process.env.STRIPE_SECRET_KEY)
+  : null;
+
+// Require a card on file to create a public account. Flip to 'false' in Render to disable.
+const REQUIRE_CARD_ON_SIGNUP = process.env.REQUIRE_CARD_ON_SIGNUP !== 'false';
+
 const twilioClient = process.env.TWILIO_ACCOUNT_SID
   ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
   : null;
@@ -66,6 +74,38 @@ router.post('/register', async (req, res) => {
       }
     }
 
+    // ── CARD-ON-FILE REQUIREMENT (public signups only) ───────────────────────
+    // Partner-invited users are covered by their organization, so they're exempt.
+    const cardRequired = REQUIRE_CARD_ON_SIGNUP && !partnerId;
+    const { paymentMethodId } = req.body;
+    let stripeCustomerId;
+
+    if (cardRequired) {
+      if (!stripe) {
+        return res.status(503).json({ error: 'Payment system not configured. Please try again later.' });
+      }
+      if (!paymentMethodId) {
+        return res.status(400).json({ error: 'A payment method is required to create an account.', code: 'CARD_REQUIRED' });
+      }
+      try {
+        const customer = await stripe.customers.create({
+          email: email.toLowerCase(),
+          name: `${firstName} ${lastName || ''}`.trim() || email.toLowerCase(),
+          payment_method: paymentMethodId,
+          invoice_settings: { default_payment_method: paymentMethodId }
+        });
+        stripeCustomerId = customer.id;
+      } catch (cardErr) {
+        logger.warn({ err: cardErr, requestId: req.requestId }, 'Signup card attach failed');
+        return res.status(400).json({
+          error: cardErr?.type === 'StripeCardError'
+            ? cardErr.message
+            : 'We couldn\u2019t validate that card. Please check the details and try again.',
+          code: 'CARD_DECLINED'
+        });
+      }
+    }
+
     const user = await User.create({
       email: email.toLowerCase(),
       passwordHash: password,
@@ -77,13 +117,20 @@ router.post('/register', async (req, res) => {
       subscription: {
         status: 'trial',
         plan: partnerPlan || 'free',
-        trialEndsAt
+        trialEndsAt,
+        ...(stripeCustomerId && { stripeCustomerId })
       },
       ...(partnerId && { partnerId }),
       emailVerified: false,
       emailVerificationToken: verificationTokenHash,
       emailVerificationExpires: Date.now() + 24 * 60 * 60 * 1000,
     });
+
+    // Backfill the Stripe customer with our userId for reconciliation
+    if (stripeCustomerId && stripe) {
+      stripe.customers.update(stripeCustomerId, { metadata: { userId: user._id.toString() } })
+        .catch(err => logger.error({ err, userId: user._id, requestId: req.requestId }, 'Stripe customer metadata backfill failed'));
+    }
     
     // Log activity for admin notification
     await logActivity(ACTIVITY_TYPES.USER_REGISTERED, {
diff --git a/server/src/routes/interactiveCourseRoutes.js b/server/src/routes/interactiveCourseRoutes.js
index a376ee4..fa3e8ea 100644
--- a/server/src/routes/interactiveCourseRoutes.js
+++ b/server/src/routes/interactiveCourseRoutes.js
@@ -18,6 +18,7 @@ import { protect, requireAdmin, optionalAuth } from '../middleware/auth.js';
 import { generateCertificate, generateCertificateNumber, buildApprovalBlock } from '../utils/certificate.js';
 import { logActivity, ACTIVITY_TYPES } from '../services/activityTrackingService.js';
 import { checkAndSendFreeLimit } from '../services/freeCourseLimitEmail.js';
+import { basicCovers, BASIC_MAX_CE_HOURS } from '../utils/pricingRules.js';
 import twilio from 'twilio';
 import { awardCourseCompletion, awardCertificate, awardCourseEvaluation } from '../services/rewardsService.js';
 
@@ -121,7 +122,11 @@ function hasPaidOrFreeAccess(user, course) {
   const status = user.subscription?.status || 'free';
   const plan   = user.subscription?.plan   || 'free';
   // trial is NOT unlimited — it routes through freeTierDecision (2-course / 1-hr caps)
-  return ['active','lifetime'].includes(status) && plan !== 'free';
+  if (!['active','lifetime'].includes(status)) return false;
+  // Basic ($15/mo): unlimited access ONLY to courses at/below the CE-hour ceiling.
+  if (plan === 'basic') return basicCovers(course);
+  // starter / professional / vip / annual_vip / lifetime: unlimited
+  return plan !== 'free';
 }
 
 // Atomically persist consumption of one monthly free slot (month-aware).
@@ -497,6 +502,16 @@ router.post('/:id/enroll', protect, async (req, res) => {
 
     if (isAdmin || isFree || hasPurchased) {
       accessGranted = true;
+    } else if (isActiveSub && subPlan === 'basic') {
+      // Basic ($15/mo): unlimited 1–3 CE-hour courses only.
+      if (basicCovers(course)) {
+        accessGranted = true;
+      } else {
+        freeDenial = {
+          code: 'OVER_BASIC_HOUR_LIMIT',
+          message: `Your Basic plan covers courses up to ${BASIC_MAX_CE_HOURS} CE hours. Upgrade to VIP or purchase this course to enroll.`
+        };
+      }
     } else if (isActiveSub && subPlan !== 'free') {
       accessGranted = true;
     } else {
@@ -508,7 +523,7 @@ router.post('/:id/enroll', protect, async (req, res) => {
     if (!accessGranted) {
       return res.status(403).json({
         success: false,
-        error: freeDenial?.code === 'OVER_FREE_HOUR_LIMIT' ? 'Upgrade required' : 'Subscription required',
+        error: ['OVER_FREE_HOUR_LIMIT','OVER_BASIC_HOUR_LIMIT'].includes(freeDenial?.code) ? 'Upgrade required' : 'Subscription required',
         code: freeDenial?.code || 'SUBSCRIPTION_REQUIRED',
         message: freeDenial?.message || `Subscribe for unlimited access.`,
         freeCoursesUsedThisMonth: effectiveFreeCoursesUsed(user),
diff --git a/server/src/routes/payments.js b/server/src/routes/payments.js
index 3c03c62..64ca12d 100644
--- a/server/src/routes/payments.js
+++ b/server/src/routes/payments.js
@@ -31,6 +31,7 @@ const stripe = process.env.STRIPE_SECRET_KEY
 
 // Price IDs from Stripe Dashboard (set in environment)
 const PRICE_IDS = {
+  basic: process.env.STRIPE_PRICE_BASIC || 'price_basic_monthly',
   starter: process.env.STRIPE_PRICE_STARTER || 'price_starter_monthly',
   professional: process.env.STRIPE_PRICE_PROFESSIONAL || 'price_professional_monthly',
   vip: process.env.STRIPE_PRICE_VIP || 'price_vip_monthly'
@@ -38,6 +39,7 @@ const PRICE_IDS = {
 
 const PLAN_DETAILS = {
   free: { name: 'Free', price: 0, maxCEHours: 4, maxStates: 1 },
+  basic: { name: 'Basic', price: 1500, maxCEHours: 3, maxStates: 1 },
   starter: { name: 'Starter', price: 1999, maxCEHours: 999, maxStates: 1 },
   professional: { name: 'Professional', price: 2999, maxCEHours: 999, maxStates: 1 },
   vip: { name: 'VIP', price: 4999, maxCEHours: 999, maxStates: 999 }
diff --git a/server/src/scripts/createStripePrices.js b/server/src/scripts/createStripePrices.js
index 75f2eb7..65a3527 100644
--- a/server/src/scripts/createStripePrices.js
+++ b/server/src/scripts/createStripePrices.js
@@ -19,6 +19,7 @@ const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
 
 // name, env var the backend reads, amount in CENTS, recurring interval
 const PLANS = [
+  { key: 'basic',        name: 'CounselorReady Basic',        env: 'STRIPE_PRICE_BASIC',        cents: 1500, interval: 'month' },
   { key: 'starter',      name: 'CounselorReady Starter',      env: 'STRIPE_PRICE_STARTER',      cents: 1999, interval: 'month' },
   { key: 'professional', name: 'CounselorReady Professional', env: 'STRIPE_PRICE_PROFESSIONAL', cents: 2999, interval: 'month' },
   { key: 'vip',          name: 'CounselorReady VIP',          env: 'STRIPE_PRICE_VIP',          cents: 4999, interval: 'month' },
diff --git a/server/src/utils/pricingRules.js b/server/src/utils/pricingRules.js
index 8572b86..0ad4f22 100644
--- a/server/src/utils/pricingRules.js
+++ b/server/src/utils/pricingRules.js
@@ -67,6 +67,32 @@ export const PLAN_RANK = {
   vip: 3,
 };
 
+// ─── Basic Plan ($15/mo) ──────────────────────────────────────────────────────
+// Basic is NOT part of the linear word-count rank ladder above. It is a flat-rate
+// plan that grants UNLIMITED access to any course at or below this CE-hour ceiling,
+// regardless of the course's word-count pricingTier. Courses above the ceiling
+// (e.g. 4–6 CE-hour courses) require VIP or an individual purchase.
+export const BASIC_MAX_CE_HOURS = 3;
+
+/**
+ * Does the Basic plan cover this course?
+ * Gates on the course's actual CE hours (faithful to "1, 2, 3 hour courses").
+ * Falls back to word-count ÷ 6,000 (ACEP standard) when ceHours is absent.
+ * Unknown duration → not covered (safe default).
+ *
+ * @param {{ ceHours?: number, ceuHours?: number, wordCount?: number }} course
+ * @returns {boolean}
+ */
+export function basicCovers(course) {
+  if (!course) return false;
+  let hrs = course.ceHours ?? course.ceuHours ?? null;
+  if (hrs == null && typeof course.wordCount === 'number') {
+    hrs = course.wordCount / 6000;
+  }
+  if (hrs == null || Number.isNaN(hrs)) return false;
+  return hrs <= BASIC_MAX_CE_HOURS;
+}
+
 // ─── Core Resolver ───────────────────────────────────────────────────────────
 
 /**
@@ -117,12 +143,13 @@ export function resolvePricingFromCEHours(ceHours, customPremiumPrice = null) {
  * Check whether a user's plan grants access to a course tier.
  * Also returns true if the user has a one-time purchase record for the course.
  *
- * @param {string} userPlan       - 'free' | 'starter' | 'professional' | 'vip'
+ * @param {string} userPlan       - 'free' | 'basic' | 'starter' | 'professional' | 'vip'
  * @param {string} courseTier     - pricingTier on the course document
  * @param {boolean} hasPurchased  - true if user has a purchase record for this course
+ * @param {object} [course]       - full course doc (needed for the Basic CE-hour check)
  * @returns {{ allowed: boolean, reason: string }}
  */
-export function canAccessCourse(userPlan, courseTier, hasPurchased = false) {
+export function canAccessCourse(userPlan, courseTier, hasPurchased = false, course = null) {
   const tier = PRICING_TIERS[courseTier];
 
   if (!tier) {
@@ -143,6 +170,20 @@ export function canAccessCourse(userPlan, courseTier, hasPurchased = false) {
   // Subscription tiers — individual purchase always works
   if (hasPurchased) return { allowed: true, reason: 'purchased' };
 
+  // Basic plan — flat rate, covers any course at/below the CE-hour ceiling.
+  // Not part of PLAN_RANK; evaluated on the course's actual CE hours.
+  if (userPlan === 'basic') {
+    if (course && basicCovers(course)) {
+      return { allowed: true, reason: 'basic_covers' };
+    }
+    return {
+      allowed: false,
+      reason: 'upgrade_required',
+      requiredPlan: 'vip',
+      individualPrice: tier.price,
+    };
+  }
+
   const userRank   = PLAN_RANK[userPlan]  ?? -1;
   const tierRank   = PLAN_RANK[tier.minPlan] ?? 99;
 
-- 
2.43.0

