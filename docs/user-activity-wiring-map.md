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
