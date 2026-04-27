# User Activity Wiring Map

> How user activity events flow from source → service → storage → consumers.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          ROUTE HANDLERS (Event Sources)                 │
│                                                                         │
│  auth.js ─── courses.js ─── payments.js ─── certificates.js            │
│  interactiveCourseRoutes.js ─── researchReady.js                       │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │
                    logActivity(type, data, options)
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│              activityTrackingService.js  (Central Hub)                   │
│                                                                         │
│  1. Write to UserActivity collection (MongoDB)                          │
│  2. Push to admin.adminActivityFeed[] (legacy, max 500)                 │
│  3. Send admin email notification (Resend API, if enabled)              │
└──────┬──────────────────┬──────────────────┬────────────────────────────┘
       │                  │                  │
       ▼                  ▼                  ▼
┌──────────────┐  ┌───────────────┐  ┌──────────────────┐
│  UserActivity │  │ User.admin    │  │  Resend API      │
│  Collection   │  │ ActivityFeed[]│  │  (Email)         │
│  (MongoDB)    │  │ (embedded)    │  │                  │
└──────┬────────┘  └──────┬────────┘  └──────────────────┘
       │                  │
       ▼                  ▼
┌──────────────┐  ┌───────────────┐
│ analytics.js │  │ adminUsers.js │
│ (3 endpoints)│  │ (2 endpoints) │
└──────────────┘  └───────────────┘
```

---

## Event Sources → Activity Types

### `auth.js` (Authentication)

| Line | Event | Activity Type | Notify Admin | Blocking |
|------|-------|--------------|-------------|----------|
| 75 | User registers | `user_registered` | Yes | `await` |
| 186 | User logs in | `user_login` | No | fire-and-forget |

### `courses.js` (Standard Courses)

| Line | Event | Activity Type | Notify Admin | Blocking |
|------|-------|--------------|-------------|----------|
| 444 | Enrolls in course | `user_enrolled` | Yes | `await` |
| 561 | Starts first lesson | `course_started` | Yes | fire-and-forget |
| 720 | Passes quiz | `quiz_passed` | Yes | `await` |
| 734 | Completes course | `course_completed` | Yes | `await` |
| 749 | Fails quiz | `quiz_failed` | Yes | `await` |

### `interactiveCourseRoutes.js` (Interactive Courses)

| Line | Event | Activity Type | Notify Admin | Blocking |
|------|-------|--------------|-------------|----------|
| 260 | Enrolls | `user_enrolled` | Yes | `.catch(()=>{})` |
| 377 | Passes assessment | `quiz_passed` | Yes | `.catch(()=>{})` |
| 379 | Fails assessment | `quiz_failed` | Yes | `.catch(()=>{})` |
| 500 | Submits evaluation | `lesson_completed` | Yes | `.catch(()=>{})` |
| 582 | Completes attestation | `course_completed` | Yes | `.catch(()=>{})` |
| 758 | Completes course | `course_completed` | Yes | `.catch(()=>{})` |
| 759 | Generates certificate | `certificate_generated` | Yes | `.catch(()=>{})` |

### `payments.js` (Stripe Webhooks)

| Line | Event | Activity Type | Notify Admin | Blocking |
|------|-------|--------------|-------------|----------|
| 601 | Course purchase succeeds | `payment_succeeded` | Yes | fire-and-forget |
| 625 | Subscription payment succeeds | `payment_succeeded` | Yes | fire-and-forget |
| 663 | Subscription activated | `subscription_started` | Yes | fire-and-forget |
| 701 | Subscription canceled | `subscription_canceled` | Yes | fire-and-forget |
| 726 | Payment fails | `payment_failed` | Yes | fire-and-forget |

### `researchReady.js` (Research-Ready / RNR Courses)

| Line | Event | Activity Type | Notify Admin | Blocking |
|------|-------|--------------|-------------|----------|
| 155 | Creates RNR request | `user_enrolled` | Yes | fire-and-forget |
| 276 | Generates test | `course_started` | Yes | fire-and-forget |
| 525 | Submits test | `course_completed` | Yes | fire-and-forget |
| 530 | Certificate created | `certificate_generated` | Yes | fire-and-forget |

### `certificates.js` (Certificate Downloads)

| Line | Event | Activity Type | Notify Admin | Blocking |
|------|-------|--------------|-------------|----------|
| 445 | Certificate generated | `certificate_generated` | Yes | fire-and-forget |

---

## Storage Layer

### 1. `UserActivity` Collection (Primary)

**Model:** `server/src/models/UserActivity.js`

```
Schema:
  userId        ObjectId  → User (required, indexed)
  type          String    enum[14 types] (required, indexed)
  userName      String
  userEmail     String
  courseId       ObjectId  → Course (indexed)
  courseName    String
  data          Mixed     (flexible payload)
  timestamp     Date      (indexed, default: now)

Compound Indexes:
  { userId, type, timestamp }
  { type, timestamp }
  { userId, timestamp }

TTL Index:
  timestamp → auto-delete after 2 years (63,072,000 seconds)
```

### 2. `User.adminActivityFeed[]` (Legacy / Backward Compat)

**Model:** `server/src/models/User.js` (line ~232)

```
Embedded array on every admin User document:
  type        String
  data        Mixed
  userId      ObjectId
  userName    String
  userEmail   String
  timestamp   Date

Behavior:
  - $push with $position: 0 (newest first)
  - $slice: 500 (max 500 entries)
  - Written via User.updateMany({ role: 'admin' })
```

---

## Consumer Endpoints

### From `UserActivity` Collection (analytics.js)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/analytics/my-activity` | User | Own activity (last 20-50) |
| GET | `/api/analytics/admin/user/:userId/timeline` | Admin | Full user timeline (paginated, filterable by type) |
| GET | `/api/analytics/admin/activity/search` | Admin | Search all activities (by type, email, days) |

### From `User.adminActivityFeed[]` (adminUsers.js)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/admin/activity` | Admin | Recent feed (default 50, filter by type) |
| DELETE | `/api/admin/activity/clear` | Admin | Clear admin's feed array |

---

## Email Notification Wiring

```
logActivity(type, data, { notifyAdmin: true })
        │
        ▼
  sendAdminNotification(type, data, userInfo)
        │
        ▼
  ┌─ Requires: RESEND_API_KEY env var
  │  Recipients: ADMIN_NOTIFICATION_EMAILS (comma-separated, default: admin@counselorready.com)
  │  From: CounselorReady <noreply@counselorready.com>
  │
  ▼
  Types with email templates (10 of 14):
    ✅ user_registered       ✅ user_enrolled
    ✅ course_completed      ✅ quiz_passed
    ✅ quiz_failed           ✅ subscription_started
    ✅ subscription_canceled ✅ payment_succeeded
    ✅ payment_failed        ✅ certificate_generated

  No email template (4 of 14):
    ❌ user_login            ❌ course_started
    ❌ course_failed         ❌ lesson_completed
```

---

## Data Flow Summary

```
User Action
    │
    ▼
Route Handler ──logActivity()──→ activityTrackingService.js
                                        │
                         ┌──────────────┼──────────────┐
                         ▼              ▼              ▼
                   UserActivity    adminActivityFeed  Resend Email
                   (MongoDB)       (User doc embed)   (10 types)
                         │              │
                    ┌────┴────┐    ┌────┴────┐
                    ▼         ▼    ▼         ▼
               analytics  analytics  admin    admin
               /my-activity  /admin  /activity /activity
                          /timeline           /clear
                          /search
```

**Total call sites:** 24 `logActivity()` calls across 6 route files
**Activity types:** 14 distinct types
**Email-capable types:** 10 of 14

---

## Partner / Whitelabel System Wiring

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      ENTRY POINTS (How partners get created)                │
│                                                                             │
│  POST /api/partners                (Admin-only — manual creation)           │
│  POST /api/partners/:id/set-admin  (Admin-only — promote user to p_admin)  │
│                                                                             │
│  ⚠ NO public self-service signup / registration path exists                 │
│  ⚠ NO "Become a Partner" landing or application form                       │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Current Setup Flow (Admin-Driven)

```
Step 1: CounselorReady admin creates partner
        POST /api/partners  { name, slug, branding, contact, defaultPlan }
                    │
                    ▼
        Partner doc created in MongoDB (billing.status = 'trial')
                    │
Step 2: Admin promotes an existing user to partner_admin
        POST /api/partners/:id/set-admin  { email }
                    │
                    ▼
        User.role = 'partner_admin', User.partnerId = partner._id
                    │
Step 3: Partner admin logs in → Layout.jsx shows "Partner Admin" sidebar
        (detected via user.role === 'partner_admin')
                    │
                    ▼
        Redirected to /partner/onboarding (Getting Started checklist)
```

### Partner Detection Middleware

**File:** `server/src/middleware/partner.js` → `detectPartner()`
**Mounted at:** `app.use('/api/', detectPartner)` (all API requests)

```
Request arrives
    │
    ├── 1. X-Partner-Slug header?        → lookup by slug
    ├── 2. ?partner=<slug> query param?  → lookup by slug
    ├── 3. Subdomain of PRIMARY_DOMAIN?  → extract slug from host
    ├── 4. Custom domain?               → lookup Partner.branding.customDomain
    └── 5. req.user.partnerId?          → lookup by ObjectId
    │
    ▼
req.partner = Partner doc | null
```

### Partner User Registration

**File:** `server/src/routes/auth.js` (POST /api/auth/register)

```
User registers with { partnerSlug: 'acme' }
    │
    ├── Resolve partner → Partner.findOne({ slug, active: true })
    ├── Set user.partnerId = partner._id
    ├── Set user.subscription.plan = partner.defaultPlan
    ├── Send partner-branded welcome email (sendPartnerWelcomeEmail)
    └── Log activity: user_registered
```

### Models

```
Partner (server/src/models/Partner.js)
├── name, slug (unique)
├── branding: { logoUrl, primaryColor, companyName, tagline, customDomain, colorScheme, accentColor }
├── contact: { email, website, phone }
├── active (Boolean)
├── defaultPlan (free|starter|professional|vip|annual_vip)
├── domainVerification: { verificationToken, verified, verifiedAt }
├── billing: { stripeCustomerId, stripeSubscriptionId, plan, status, trialEndsAt }
├── emailTemplates: { welcome: {...}, invitation: {...} }
├── createdBy (→ User)
└── adminNotes: [{ text, createdBy, createdAt }]

PartnerAuditLog (server/src/models/PartnerAuditLog.js)
├── partnerId (→ Partner)
├── action (enum: branding_updated, domain_verified, course_created, user_invited, ...)
├── performedBy (→ User)
├── performedByRole (admin | partner_admin)
├── details (String)
└── metadata (Mixed)
```

### Partner API Endpoints

#### Public
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/partners/slug/:slug` | Look up partner by slug (for branding) |
| GET | `/api/partners/slug/:slug/courses` | Public course catalog for a partner |

#### Partner Admin (`requirePartnerAdmin`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/partners/my` | Get own partner profile |
| PUT | `/api/partners/my-branding` | Update branding settings |
| GET | `/api/partners/my/courses` | List own courses |
| POST | `/api/partners/my/courses` | Create course (quota enforced) |
| PUT | `/api/partners/my/courses/:courseId` | Update course |
| DELETE | `/api/partners/my/courses/:courseId` | Delete course |
| POST | `/api/partners/my/courses/bulk` | Bulk upload courses |
| POST | `/api/partners/my/domain/verify-init` | Start domain verification |
| POST | `/api/partners/my/domain/verify-check` | Check DNS verification |
| GET | `/api/partners/my/billing` | View billing info |
| POST | `/api/partners/my/billing/checkout` | Create Stripe checkout session |
| POST | `/api/partners/my/billing/portal` | Open Stripe billing portal |
| GET | `/api/partners/my/users` | List partner's users |
| POST | `/api/partners/my/users/invite` | Invite user (quota enforced) |
| DELETE | `/api/partners/my/users/:userId` | Remove user |
| GET | `/api/partners/my/stats` | Dashboard stats |
| GET | `/api/partners/my/quota` | Check quota usage |
| GET | `/api/partners/my/onboarding` | Onboarding checklist status |
| GET | `/api/partners/my/email-templates` | Get email templates |
| PUT | `/api/partners/my/email-templates` | Update email templates |
| GET | `/api/partners/my/reports/users` | User report |
| GET | `/api/partners/my/reports/courses` | Course report |
| GET | `/api/partners/my/reports/completions` | Completion report |

#### CounselorReady Admin (`requireAdmin`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/partners` | List all partners |
| POST | `/api/partners` | Create partner |
| GET | `/api/partners/:id` | Get partner details |
| PUT | `/api/partners/:id` | Update partner |
| DELETE | `/api/partners/:id` | Delete partner |
| POST | `/api/partners/:id/set-admin` | Promote user to partner_admin |
| GET | `/api/partners/:id/users` | List partner's users |
| GET | `/api/partners/:id/stats` | Partner stats |
| GET | `/api/partners/:id/courses` | Partner courses |
| GET | `/api/partners/:id/courses/:courseId/analytics` | Course analytics |
| GET | `/api/partners/:id/audit-log` | Audit log |
| GET | `/api/partners/:id/health` | Partner health check |
| GET | `/api/partners/:id/notes` | Admin notes |
| POST | `/api/partners/:id/notes` | Add admin note |
| DELETE | `/api/partners/:id/notes/:noteId` | Delete admin note |
| POST | `/api/partners/:id/notify` | Send notification to partner |
| POST | `/api/partners/:id/quick-fix/reset-domain` | Reset domain |
| POST | `/api/partners/:id/quick-fix/resend-welcome` | Resend welcome email |
| POST | `/api/partners/:id/quick-fix/billing-status` | Fix billing status |

### Client Pages

#### Admin-Only
| Route | Component | Description |
|-------|-----------|-------------|
| `/admin/partners` | `AdminPartners` | CRUD partners, set admin, view users/courses |
| `/admin/partner-analytics` | `AdminPartnerAnalytics` | Cross-partner analytics |
| `/admin/partner-support/:id` | `AdminPartnerSupport` | Support tools for a partner |

#### Partner Admin (`PartnerAdminRoute`)
| Route | Component | Description |
|-------|-----------|-------------|
| `/partner/onboarding` | `PartnerOnboarding` | Getting started checklist |
| `/partner/courses` | `PartnerCourseAdmin` | Manage courses |
| `/partner/bulk-upload` | `PartnerBulkUpload` | Bulk course upload |
| `/partner/branding` | `PartnerBrandingSettings` | Logo, colors, tagline |
| `/partner/email-templates` | `PartnerEmailTemplates` | Customize emails |
| `/partner/domain` | `PartnerDomainSettings` | Custom domain + DNS verify |
| `/partner/billing` | `PartnerBilling` | Subscription & invoices |
| `/partner/users` | `PartnerUserManagement` | Invite/remove users |
| `/partner/reports` | `PartnerReports` | Usage reports |
| `/partner/manual` | `PartnerUserManual` | Help docs |

#### Regular Users (with `partnerId`)
| Route | Component | Description |
|-------|-----------|-------------|
| `/partner/courses/catalog` | `PartnerCourseCatalog` | Browse partner's courses |

### Quota Enforcement Middleware

**File:** `server/src/middleware/quotaEnforcement.js`

| Middleware | What it enforces |
|-----------|-----------------|
| `enforceCourseQuota` | Max courses per partner plan |
| `enforceUserQuota` | Max users per partner plan |
| `enforceCustomDomainFeature` | Custom domain requires growth+ plan |
| `enforceBulkUploadFeature` | Bulk upload requires professional+ plan |

### Layout Integration

**File:** `client/src/components/Layout.jsx`

```
Partner detection in Layout:
  URL ?partner=slug  →  stored in localStorage('cr_partner_slug')
                     →  fetched from /api/partners/slug/:slug
                     →  branding applied (logo, colors, company name)

Navigation visibility:
  user.role === 'partner_admin'  →  shows full Partner Admin sidebar
  user.partnerId (regular user)  →  shows only "Partner Courses" link
```
