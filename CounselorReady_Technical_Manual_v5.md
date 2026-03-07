# CounselorReady Technical Manual v5

**Version:** 5.0
**Date:** March 7, 2026
**Owner:** CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC
**Classification:** Proprietary and Confidential

---

## Table of Contents

1. [Platform Overview](#1-platform-overview)
2. [Architecture](#2-architecture)
3. [Technology Stack](#3-technology-stack)
4. [Project Structure](#4-project-structure)
5. [Design System](#5-design-system)
6. [Authentication & Authorization](#6-authentication--authorization)
7. [Database Schema](#7-database-schema)
8. [API Reference](#8-api-reference)
9. [Client Application](#9-client-application)
10. [Features](#10-features)
11. [Third-Party Integrations](#11-third-party-integrations)
12. [Security](#12-security)
13. [Deployment](#13-deployment)
14. [Environment Variables](#14-environment-variables)
15. [Accessibility (WCAG 2.1 AA)](#15-accessibility-wcag-21-aa)

---

## 1. Platform Overview

CounselorReady is a continuing education (CE) management platform designed for licensed mental health professionals. The platform enables counselors, therapists, social workers, and psychologists to:

- **Complete CE courses** — interactive, NBCC/ACEP-approved online courses with quizzes, evaluations, and certificates
- **Track credentials** — manage state licenses, national certifications, and specialty credentials with renewal deadline alerts
- **Store certificates** — upload, scan, and organize CE certificates with optional CE Broker integration
- **Plan CE requirements** — smart CE planner that maps courses to credential requirements
- **Generate audit kits** — one-click compliance packages for licensing board audits
- **Monitor board alerts** — real-time state licensing board regulatory updates
- **Track supervision hours** — pre-licensure clinicians log individual and group supervision
- **Manage insurance panels** — track credentialing applications and recredentialing dates
- **Earn achievements** — gamified learning with XP, streaks, levels, and badges
- **Refer colleagues** — referral program with credits and conversion tracking
- **Group licensing** — organizations purchase team/enterprise seat-based plans

---

## 2. Architecture

### High-Level Architecture

```
┌─────────────────────────────────┐
│         Client (SPA)            │
│   React 18 + Vite + Tailwind   │
│   Deployed: Render Static Site  │
└──────────────┬──────────────────┘
               │ HTTPS / REST API
               │ Bearer JWT Auth
┌──────────────▼──────────────────┐
│       API Server (Node.js)      │
│   Express 4 + Mongoose 8       │
│   Deployed: Render Web Service  │
└──────────────┬──────────────────┘
               │
    ┌──────────┼──────────┐
    │          │          │
┌───▼───┐ ┌───▼───┐ ┌───▼───┐
│MongoDB│ │  S3/  │ │Stripe │
│ Atlas │ │Cloudi-│ │  API  │
│       │ │nary   │ │       │
└───────┘ └───────┘ └───────┘
```

### Communication Pattern

- **Client → Server:** Axios HTTP client with automatic JWT Bearer token injection
- **Auth flow:** JWT tokens stored in `localStorage`, attached via `Authorization: Bearer <token>` header
- **Cold start handling:** Client retries failed requests up to 3 times with increasing timeouts (10s, 20s, 30s) to accommodate Render free-tier cold starts

---

## 3. Technology Stack

### Server

| Component | Technology | Version |
|-----------|-----------|---------|
| Runtime | Node.js | ES Modules |
| Framework | Express | 4.18.2 |
| Database | MongoDB via Mongoose | 8.0.3 |
| Auth | JSON Web Tokens (jsonwebtoken) | 9.0.2 |
| Password hashing | bcryptjs | 2.4.3 |
| Payments | Stripe | 14.10.0 |
| Email | Resend | 2.1.0 |
| SMS | Twilio | 4.19.0 |
| AI | Anthropic SDK (Claude) | 0.24.0 |
| File uploads | Multer | 1.4.5 |
| Cloud storage | AWS S3 SDK + Cloudinary | 3.525.0 / 1.41.0 |
| PDF generation | PDFKit + pdf-lib | 0.14.0 / 1.17.1 |
| Calendar | ical-generator | 6.0.1 |
| SCORM parsing | adm-zip + fast-xml-parser | 0.5.10 / 4.3.2 |
| Scheduling | node-cron | 3.0.3 |
| Security | helmet + express-rate-limit | 7.1.0 / 7.1.5 |

### Client

| Component | Technology | Version |
|-----------|-----------|---------|
| Framework | React | 18.2.0 |
| Build tool | Vite | 5.0.8 |
| Routing | React Router DOM | 6.21.1 |
| CSS | Tailwind CSS | 3.4.0 |
| Icons | Lucide React | 0.294.0 |
| HTTP | Axios | 1.6.2 |
| PDF rendering | pdfjs-dist | 5.4.624 |
| PDF creation | jsPDF | 2.5.1 |
| DOCX parsing | Mammoth | 1.11.0 |
| Sanitization | DOMPurify | 3.1.0 |
| AI (client) | Anthropic SDK | 0.24.0 |

---

## 4. Project Structure

```
CounselorReady/
├── client/                         # React SPA
│   ├── public/
│   │   ├── _redirects              # Render/Netlify SPA routing rules
│   │   └── ...
│   ├── src/
│   │   ├── App.jsx                 # Root component, routing
│   │   ├── index.css               # Global styles, Tailwind layers
│   │   ├── context/
│   │   │   └── AuthContext.jsx     # Auth state management
│   │   ├── services/
│   │   │   └── api.js              # Axios instance
│   │   ├── components/
│   │   │   ├── Layout.jsx          # Authenticated page layout (nav + sidebar)
│   │   │   ├── AccessibilityProvider.jsx  # WCAG 2.1 AA provider
│   │   │   ├── ErrorBoundary.jsx   # React error boundary
│   │   │   ├── CourseViewer.jsx    # Full-screen course learning view
│   │   │   ├── CourseBuilder.jsx   # Admin course creation tool
│   │   │   ├── CloudinaryUploader.jsx
│   │   │   ├── NarrationPanel.jsx  # AI narration for courses
│   │   │   └── InteractiveCourseComponents.jsx
│   │   ├── pages/
│   │   │   ├── Landing.jsx         # Public landing page
│   │   │   ├── Login.jsx           # Sign in
│   │   │   ├── Register.jsx        # Sign up (7-day free trial)
│   │   │   ├── Dashboard.jsx       # User home dashboard
│   │   │   ├── InteractiveCourseCatalog.jsx  # Course browsing
│   │   │   ├── CourseView.jsx      # Course detail/enrollment
│   │   │   ├── Credentials.jsx     # License & credential management
│   │   │   ├── CEPlanner.jsx       # CE planning & tracking
│   │   │   ├── AuditKit.jsx        # Compliance audit package generator
│   │   │   ├── BoardAlerts.jsx     # Licensing board updates
│   │   │   ├── InsuranceTracker.jsx    # Insurance panel tracking
│   │   │   ├── SupervisionTracker.jsx  # Supervision hours log
│   │   │   ├── Gamification.jsx    # Achievements, XP, leaderboard
│   │   │   ├── Referrals.jsx       # Referral program
│   │   │   ├── GroupLicenseDashboard.jsx  # Org seat management
│   │   │   ├── OrganizationDashboard.jsx # Organization admin
│   │   │   ├── Recommendations.jsx # Smart course recommendations
│   │   │   ├── Settings.jsx        # Account settings
│   │   │   └── AdminBulkUpload.jsx # Admin bulk course upload
│   │   └── utils/
│   │       └── copyright.jsx       # Footer branding
│   ├── tailwind.config.cjs         # Design tokens & color palette
│   ├── package.json
│   └── vite.config.js
│
├── server/                         # Express API
│   ├── src/
│   │   ├── index.js                # Entry point, middleware, route mounting
│   │   ├── middleware/
│   │   │   └── auth.js             # JWT auth, subscription, admin guards
│   │   ├── models/                 # 22 Mongoose models (see §7)
│   │   ├── routes/                 # 46 route files (see §8)
│   │   ├── services/
│   │   │   └── notificationScheduler.js  # Cron-based notification service
│   │   ├── utils/
│   │   │   └── seed.js             # Database seeding
│   │   └── templates/              # Certificate PDF templates (not publicly served)
│   └── package.json
│
└── README.md
```

---

## 5. Design System

### 5.1 Color Palette

The platform uses a **burgundy-first** color scheme. All primary interactive elements (buttons, links, checkboxes, focus rings) use the burgundy palette. Supporting palettes provide semantic meaning.

#### Primary — Burgundy

| Token | Hex | Usage |
|-------|-----|-------|
| `burgundy-50` | `#FDF5F7` | — |
| `burgundy-100` | `#FAE8EB` | Card borders, progress bar tracks, badge backgrounds |
| `burgundy-200` | `#F5D0D6` | Spinner border, loading states |
| `burgundy-300` | `#E8A4B2` | — |
| `burgundy-400` | `#D4708A` | — |
| `burgundy-500` | `#C94D65` | Focus rings, input focus borders |
| `burgundy-600` | `#A83350` | Progress bar fills, stat accents, credential text |
| `burgundy-700` | `#8B2542` | **Primary action color** — buttons, links, logo, checkboxes |
| `burgundy-800` | `#6B1D34` | Headings, tertiary buttons, hover states |
| `burgundy-900` | `#4A1524` | Display text, stat numbers, page titles |

#### Secondary — Forest (Green, for neutral/nature accents)

| Token | Hex | Usage |
|-------|-----|-------|
| `forest-50` – `forest-100` | `#F2F7F4` – `#E4EBE6` | Subtle backgrounds, icon containers |
| `forest-400` – `forest-500` | `#7A9E84` – `#4A7C59` | Muted text, descriptors |
| `forest-600` – `forest-700` | `#3D6A4A` – `#305538` | Body text, labels, subtitles |
| `forest-800` | `#234027` | Strong text emphasis |

#### Accent — Honey (Gold/Amber)

| Token | Hex | Usage |
|-------|-----|-------|
| `honey-50` – `honey-200` | `#FDF9F0` – `#F3E0B5` | Renewal warning backgrounds, deadline cards |
| `honey-500` – `honey-600` | `#C49545` – `#A67936` | VIP buttons, certificate icons, warning badges |
| `honey-700` | `#865E2C` | Warning text |

#### Neutral — Stone

| Token | Hex | Usage |
|-------|-----|-------|
| `stone-50` | `#FAFAF9` | Page background (`bg-stone-50`) |
| `stone-100` – `stone-200` | `#F5F5F4` – `#E7E5E4` | Card backgrounds, dividers |
| `stone-600` – `stone-700` | `#57534E` – `#44403C` | Secondary icons, muted labels |

#### Legacy Aliases (Backward Compatibility)

The following aliases are defined in `tailwind.config.cjs` and point to the same values as their canonical palettes:

- `moss` → same values as `forest` / `hunter` (green)
- `dustyrose` → same values as `burgundy`
- `hunter` → same values as `forest`
- `navy` → reserved (blue tones, not actively used)
- `eggshell` → reserved (cream tones)

### 5.2 Typography

| Font Role | Family | Weight Range | Usage |
|-----------|--------|------|-------|
| Display (`font-display`) | Cormorant Garamond | 400–700 | Headings, stat numbers, page titles |
| Body (`font-body`, `font-sans`) | Lato | 300–700 | Body text, labels, buttons, form fields |
| UI (fallback) | Inter | 300–700 | Loaded but used as supplemental |

### 5.3 Component Classes (Global CSS)

Defined in `client/src/index.css` via Tailwind's `@layer components`:

| Class | Definition |
|-------|-----------|
| `.btn-primary` | `bg-burgundy-700 hover:bg-burgundy-800 text-white` rounded-lg button |
| `.btn-secondary` | White background, `text-burgundy-700 border border-burgundy-700` |
| `.btn-tertiary` | `bg-burgundy-800 hover:bg-burgundy-700 text-white` |
| `.card` | White background, rounded-xl, shadow-sm, `border-forest-200` |
| `.input-field` | Full-width input with `focus:ring-burgundy-500 focus:border-burgundy-500` |
| `.badge` | Inline-flex pill |
| `.badge-success` | `bg-forest-100 text-forest-700` |
| `.badge-warning` | `bg-honey-400 text-burgundy-900` |
| `.badge-info` | `bg-burgundy-100 text-burgundy-800` |
| `.spinner` | Animated spin, `border-burgundy-200 border-t-burgundy-700` |
| `.header-nav` | White, sticky top, `border-b border-burgundy-100` |
| `.link-primary` | `text-forest-600 hover:text-forest-700` with underline |
| `.link-secondary` | `text-burgundy-800 hover:text-burgundy-700` with underline |
| `.progress-bar` | `bg-forest-100` track |
| `.progress-fill` | `bg-forest-600` fill |
| `.alert-success` | `bg-forest-100 border-forest-200 text-forest-700` |
| `.alert-warning` | `bg-honey-400/20 border-honey-400 text-burgundy-900` |
| `.alert-error` | `bg-burgundy-100 border-burgundy-200 text-burgundy-800` |
| `.alert-info` | `bg-stone-100 border-stone-200 text-forest-700` |
| `.focus-ring` | `focus:ring-2 focus:ring-burgundy-500 focus:ring-offset-2` |

### 5.4 Dashboard Stat Card Layout

The Dashboard uses a **vertical stat card** design in a 2×2 (mobile) / 4-column (desktop) grid:

```
┌─────────────────────────┐
│ CE Hours Earned    [⏰] │  ← label top-left, icon top-right
│                         │
│ 24                      │  ← large display number
│ This cycle              │  ← descriptor
└─────────────────────────┘
```

Four stat cards: **CE Hours Earned**, **Courses Completed**, **Certificates Stored**, **Active Credentials**.

---

## 6. Authentication & Authorization

### 6.1 Authentication Flow

1. **Registration:** `POST /api/auth/register` — creates User, hashes password with bcryptjs, returns JWT
2. **Login:** `POST /api/auth/login` — validates credentials, returns JWT
3. **Token storage:** JWT stored in `localStorage` on client
4. **Token injection:** Axios interceptor attaches `Authorization: Bearer <token>` to every request
5. **Token verification:** `auth.js` middleware decodes JWT, loads User from database, attaches to `req.user`
6. **Token expiry:** Default `7d` (configurable via `JWT_EXPIRES_IN` env var)

### 6.2 Middleware Guards

| Middleware | Purpose |
|-----------|---------|
| `protect` | Requires valid JWT token; loads user; checks trial expiration |
| `requireSubscription` | Requires `user.hasActiveSubscription()` returns true |
| `requireAdmin` | Requires `user.role === 'admin'` |
| `optionalAuth` | Attaches user if token present, continues if not |

### 6.3 Client-Side Route Protection

| Wrapper | Behavior |
|---------|----------|
| `<ProtectedRoute>` | Redirects to `/login` if not authenticated |
| `<AdminRoute>` | Redirects to `/login` if not authenticated, `/courses` if not admin |
| `<PublicRoute>` | Redirects to `/courses` if already authenticated |

### 6.4 Subscription Tiers

| Plan | Features |
|------|----------|
| `free` | Limited access |
| `starter` | Basic CE tracking |
| `professional` | Full course access, credential tracking |
| `vip` / `annual_vip` | All features + quarterly consultations |
| `lifetime` | Permanent full access |

Subscription statuses: `free`, `trial`, `active`, `canceled`, `expired`, `past_due`, `paused`, `lifetime`

---

## 7. Database Schema

### 7.1 Models Overview

The application uses **22 Mongoose models** stored in MongoDB:

| Model | Collection | Purpose |
|-------|-----------|---------|
| **User** | users | User accounts, profiles, subscriptions, notification preferences |
| **Course** | courses | Traditional/SCORM courses with modules, lessons, assessments |
| **InteractiveCourse** | interactivecourses | Section-based interactive courses with embedded quizzes |
| **Certificate** | certificates | CE completion certificates (uploaded or platform-generated) |
| **UserCredential** | usercredentials | User's tracked licenses and certifications |
| **CredentialTemplate** | credentialtemplates | Pre-configured credential definitions (e.g., "LPC - Georgia") |
| **UserCourseProgress** | usercourseprogresses | Enrollment, progress, quiz attempts, completion status |
| **GroupLicense** | grouplicenses | Organization seat-based subscription management |
| **Organization** | organizations | Practice/agency accounts with team member management |
| **Referral** | referrals | User referral codes, tracking, and reward earning |
| **SupervisionLog** | supervisionlogs | Pre-licensure supervision hour tracking |
| **Gamification** | gamifications | XP, levels, streaks, badges, weekly goals |
| **Notification** | notifications | In-app notification queue |
| **InsuranceCredential** | insurancecredentials | Insurance panel credentialing applications |
| **BoardAlert** | boardalerts | State licensing board regulatory updates |
| **Announcement** | announcements | Platform-wide or targeted announcements |
| **HelpArticle** | helparticles | Knowledge base / help center content |
| **Evaluation** | evaluations | Post-course evaluation surveys |
| **Message** | messages | User-admin messaging system |
| **PlatformSurvey** | platformsurveys | NPS and satisfaction surveys |
| **StorageUsage** | storageusages | Cloud storage usage tracking |
| **LtiConsumer** | lticonsumers | LTI 1.1 consumer key/secret pairs |

### 7.2 Key Model Details

#### User

Core user record with embedded subscription, profile, insurance, and notification settings.

```
email             String, required, unique
passwordHash      String, required
profile           { firstName, lastName, avatar, state, timezone, phone }
purchasedCourses  [ObjectId → Course]
subscription      { status, plan, stripeCustomerId, stripeSubscriptionId,
                    currentPeriodStart, currentPeriodEnd, trialEndsAt }
hardshipPause     { available, banked, usedTotal, history, isActive }
liabilityInsurance { provider, policyNumber, coverage details }
role              String (default: 'user', also: 'admin')
memberSince       Date
lastLoginAt       Date
```

**Indexes:** `email`, `subscription.status`, `profile.state`

#### Course

Traditional course model supporting native, external, SCORM, and interactive import types.

```
slug              String, required, unique
title             String, required
description       String, required
importType        enum: native | external | scorm | starter | interactive
accessType        enum: free | paid | subscription
accessTier        enum: free | professional | vip
ceuEligible       Boolean
ceuHours          Number
approvals         [{ body, providerNumber, status }]
modules           [{ title, lessons: [{ title, content, type, duration }] }]
assessment        { title, timeLimit, passThreshold, questions }
status            enum: draft | published | archived
```

**Indexes:** `slug`, `status`, `accessType`, full-text on `title`/`description`/`tags`

#### InteractiveCourse

Section-based interactive course with embedded content blocks and quizzes.

```
title, slug       String, required, unique
ceHours           Number, required
ceProvider         String
sections          [{ title, contentBlocks, quizQuestions }]
assessment        { questions, timeLimit, passThreshold }
presenter         { name, credentials, licenseNumber }
status            enum: draft | published | archived
totalEstimatedTime Number (minutes)
```

**Related:** InteractiveCourseProgress (embedded in same file)
```
userId, courseId   ObjectId refs
sectionProgress   [{ sectionIndex, completed, quizScore }]
overallProgress   Number (0-100)
status            enum: not_started | in_progress | completed | certified
certificateId     ObjectId → Certificate
```

#### Certificate

```
userId            ObjectId → User, required
courseId           ObjectId → Course (optional for uploads)
title, provider   String, required
completionDate    Date, required
ceHours           Number, required
category          enum (Ethics, Supervision, Trauma, etc.)
approvingBody     enum: NBCC | ACEP | ACA | state boards
source            enum: upload | platform | import
fileUrl, fileKey   String (S3/Cloudinary)
certificateNumber  String, unique
verificationCode   String
```

#### UserCredential

```
userId            ObjectId → User
credentialType    enum: state_license | national_cert | specialty_cert | training | custom
templateId        ObjectId → CredentialTemplate
name, code        String, required
issuingBody       String, required
licenseNumber     String
expirationDate    Date
renewalCycle      Number (months)
totalCEUsRequired Number
totalCEUsCompleted Number
requirements      [{ category, hoursRequired, hoursCompleted }]
ceuLogs           [{ date, hours, category, source, courseId }]
status            enum: active | expiring_soon | expired | renewed
```

**Virtual fields:** `daysUntilExpiration`, `percentComplete`

#### GroupLicense

```
organizationName  String, required
adminUserId       ObjectId → User
totalSeats        Number, min: 5
seats             [{ userId, email, status: pending|active|revoked }]
plan              enum: team | enterprise
pricePerSeat      Number
assignedCourses   [{ courseId, dueDate, mandatory }]
status            enum: active | suspended | canceled
```

#### SupervisionLog

```
userId            ObjectId → User
supervisor        { name, credentials, licenseNumber, email }
licenseType       String (e.g., "LPC", "LCSW")
totalHoursRequired Number
sessions          [{ date, hours, type: individual|group, modality, topics }]
status            enum: in_progress | completed | on_hold
```

**Virtual fields:** `totalLoggedHours`, `individualHours`, `groupHours`, `progressPercent`

#### Gamification

```
userId            ObjectId → User, unique
xp, level         Number
currentStreak     Number
longestStreak     Number
weeklyGoalHours   Number
badges            [{ key, name, description, icon, earnedAt }]
totalCoursesCompleted  Number
totalCEHoursEarned     Number
```

---

## 8. API Reference

### 8.1 Route Mounting

All API routes are mounted under `/api/` on the Express server:

| Mount Path | Route File | Description |
|-----------|-----------|-------------|
| `/api/auth` | `auth.js` | Register, login, forgot/reset password, profile |
| `/api/courses` | `courses.js` | Course listing, enrollment, progress, completion |
| `/api/interactive-courses` | `interactiveCourseRoutes.js` | Interactive course catalog, progress, certificates |
| `/api/admin` | `admin.js` | Admin dashboard, user management, course admin |
| `/api/admin/courses` | `bulkUpload.js` | Bulk course upload (CSV/JSON) |
| `/api/users` | `users.js` | User profile updates |
| `/api/certificates` | `certificates.js` | Certificate CRUD, upload, verification |
| `/api/credentials` | `credentials.js` | Credential CRUD, CE hour logging, dashboard |
| `/api/payments` | `payments.js` | Stripe checkout, subscriptions, webhooks |
| `/api/analytics` | `analytics.js` | Platform usage analytics |
| `/api/migration` | `migration.js` | Data migration utilities |
| `/api/announcements` | `announcements.js` | Platform announcements |
| `/api/reminders` | `reminders.js` | CE renewal reminders |
| `/api/scan` | `scan.js` | Certificate scanning / OCR |
| `/api/scorm` | `scorm.js` | SCORM package upload and parsing |
| `/api/lti` | `lti.js` | LTI 1.1 launch and integration |
| `/api/xapi` | `xapi.js` | xAPI statement tracking |
| `/api/cebroker` | `cebroker.js` | CE Broker integration |
| `/api/help` | `help.js` | Help center articles |
| `/api/ai` | `ai.js` | AI-powered features (Claude) |
| `/api/ai-course-generator` | `aiCourseGenerator.js` | AI course content generation |
| `/api/course-builder` | `courseBuilder.js` | Course creation API |
| `/api/narration` | `narration.js` | AI-generated course narration |
| `/api/uploads` | `uploads.js` | General file uploads |
| `/api/organizations` | `organizations.js` | Organization/team management |
| `/api/ce-planner` | `cePlanner.js` | CE requirement planning |
| `/api/insurance-credentials` | `insuranceCredentials.js` | Insurance panel tracking |
| `/api/audit-kit` | `auditKit.js` | Audit compliance package generation |
| `/api/board-alerts` | `boardAlerts.js` | State board regulatory alerts |
| `/api/group-licenses` | `groupLicenses.js` | Group seat-based licensing |
| `/api/recommendations` | `recommendations.js` | Smart course recommendations |
| `/api/supervision` | `supervision.js` | Supervision hour logging |
| `/api/referrals` | `referrals.js` | Referral program |
| `/api/gamification` | `gamification.js` | XP, badges, streaks, leaderboard |
| `/api/notifications` | `notifications.js` | In-app notification management |

### 8.2 Health Check

```
GET /health
```

Returns server status, MongoDB connection state, environment, and version.

---

## 9. Client Application

### 9.1 Routing

| Path | Component | Access | Description |
|------|-----------|--------|-------------|
| `/` | `Landing` | Public | Marketing landing page |
| `/login` | `Login` | Public (redirects if authed) | Sign in form |
| `/register` | `Register` | Public (redirects if authed) | 7-day free trial registration |
| `/dashboard` | `Dashboard` | Protected | User home with stats, quick actions, activity |
| `/courses` | `InteractiveCourseCatalog` | Protected | Course browsing and enrollment |
| `/courses/:slug` | `CourseView` | Protected | Course detail and enrollment |
| `/learn/:slug` | `CourseViewer` | Protected | Full-screen course learning experience |
| `/credentials` | `Credentials` | Protected | License & credential management |
| `/ce-planner` | `CEPlanner` | Protected | CE requirement planning |
| `/audit-kit` | `AuditKit` | Protected | Audit compliance package |
| `/board-alerts` | `BoardAlerts` | Protected | State board regulatory updates |
| `/insurance-tracker` | `InsuranceTracker` | Protected | Insurance panel tracking |
| `/supervision` | `SupervisionTracker` | Protected | Supervision hour logging |
| `/achievements` | `Gamification` | Protected | XP, badges, streaks, leaderboard |
| `/referrals` | `Referrals` | Protected | Referral program dashboard |
| `/group-licenses` | `GroupLicenseDashboard` | Protected | Organization seat management |
| `/organization` | `OrganizationDashboard` | Protected | Organization admin dashboard |
| `/recommendations` | `Recommendations` | Protected | Smart course suggestions |
| `/settings` | `Settings` | Protected | Account settings, notifications |
| `/admin/course-builder` | `CourseBuilder` | Admin only | Course creation tool |

### 9.2 State Management

- **AuthContext** (`context/AuthContext.jsx`): Manages user state, login/register/logout, token persistence, subscription status checks
- **No additional state library** — component-level `useState`/`useEffect` for all page data

### 9.3 API Client

`services/api.js` exports a configured Axios instance:
- Base URL: `VITE_API_URL` environment variable (e.g., `https://api.counselorready.com`)
- Automatic `Authorization` header attachment
- Cold start retry logic (3 attempts with progressive timeouts)

---

## 10. Features

### 10.1 Course System

- **Course types:** Native (built-in editor), SCORM (uploaded packages), External (linked), Interactive (section-based with quizzes)
- **Course flow:** Catalog → Enroll → Learn (module/lesson progression) → Quiz → Evaluation → Attestation → Certificate
- **Quiz system:** Supports 6 answer formats including multiple choice, true/false, select-all, and checkmark-based
- **Certificates:** Auto-generated PDF certificates with verification codes, or user-uploaded external certificates
- **CE Broker:** Optional integration for automatic CE reporting

### 10.2 Credential Tracking

- **Templates:** Pre-configured credential definitions for all 50 states + DC (e.g., "LPC - Georgia", "LCSW - New York")
- **CE mapping:** Tracks hours completed vs. required, broken down by category (Ethics, Supervision, Trauma, etc.)
- **Renewal alerts:** Automated notifications as expiration dates approach
- **Document storage:** Upload credential documentation (licenses, certificates)

### 10.3 CE Planner

- Analyzes user's credentials and calculates total CE hours needed
- Suggests courses that fulfill specific category requirements
- Shows weekly study pace needed to meet deadlines

### 10.4 Audit Kit

- One-click generation of compliance packages for licensing board audits
- Aggregates certificates, credential documentation, and CE hour summaries
- Downloadable as organized PDF/ZIP

### 10.5 Board Alerts

- State-specific licensing board regulatory updates
- Categorized by severity: info, important, urgent
- Covers CE requirement changes, renewal process updates, fee changes

### 10.6 Insurance Panel Tracking

- Track credentialing applications across insurance companies
- Monitor application status, provider numbers, recredentialing dates
- CAQH attestation date tracking
- Document checklist per panel

### 10.7 Supervision Tracker

- Pre-licensure clinicians log individual and group supervision hours
- Tracks against state-specific requirements (total hours, individual vs. group ratios)
- Supervisor information and sign-off tracking

### 10.8 Gamification

- **XP system:** Earn experience points for course completions, quiz passes, logins
- **Levels:** Progress through levels based on XP accumulation
- **Streaks:** Daily/weekly activity streaks with freeze protection
- **Badges:** Achievement badges for milestones (first course, 10 hours, etc.)
- **Leaderboard:** Community rankings by XP
- **Weekly goals:** Configurable CE hour targets

### 10.9 Referral Program

- Unique referral codes per user
- Track clicks, signups, and conversions
- Credit-based reward system
- Dashboard showing referral performance

### 10.10 Group Licensing

- Organizations purchase team (5+ seats) or enterprise plans
- Admin invites members via email
- Assign mandatory courses with due dates
- Compliance requirement tracking across the team

### 10.11 AI Features

- **Course generation:** AI-powered course content creation using Claude (Anthropic)
- **Quiz generation:** Automatic quiz question generation from course content
- **Narration:** AI-generated audio narration for course lessons
- **Recommendations:** Smart course suggestions based on credential requirements and completion history

### 10.12 Notifications

- In-app notification center with read/dismiss functionality
- Types: credential expiring, CE reminder, course completed, badge earned, referral, supervision, system
- Urgency levels: info, warning, urgent
- Scheduled via node-cron notification scheduler

---

## 11. Third-Party Integrations

| Service | Purpose | SDK/API |
|---------|---------|---------|
| **Stripe** | Payment processing, subscriptions, webhooks | `stripe` npm package |
| **MongoDB Atlas** | Cloud database | `mongoose` ODM |
| **Anthropic (Claude)** | AI course generation, quiz creation, narration | `@anthropic-ai/sdk` |
| **Cloudinary** | Image/file cloud storage and transformation | `cloudinary` npm package |
| **AWS S3** | File storage (certificates, documents) | `@aws-sdk/client-s3` |
| **Resend** | Transactional email delivery | `resend` npm package |
| **Twilio** | SMS notifications and reminders | `twilio` npm package |
| **CE Broker** | Automated CE credit reporting | Custom API integration |
| **LTI 1.1** | Learning tool interoperability | Custom implementation |
| **xAPI** | Learning experience tracking statements | Custom implementation |
| **SCORM** | Course package import (1.2 / 2004) | `adm-zip` + `fast-xml-parser` |

---

## 12. Security

### 12.1 Server Security

| Measure | Implementation |
|---------|---------------|
| **Helmet** | Security headers (XSS, clickjacking, MIME sniffing protection) |
| **CORS** | Whitelist-based origin validation; all origins allowed in dev |
| **Rate limiting** | Global: 200 req/15min; Auth: 7 req/15min; Password reset: 3 req/hr; AI: 15 req/hr |
| **Password hashing** | bcryptjs with default salt rounds |
| **JWT** | RS256-signed tokens with configurable expiry |
| **Input validation** | Mongoose schema validation; DOMPurify on client |
| **CSP** | Disabled on API server (API-only); client served via static hosting with _redirects |
| **Webhook verification** | Stripe webhook signature verification with raw body parsing |

### 12.2 Sensitive Path Blocking

The `_redirects` file blocks access to:
- `/.env`, `/.env.*` — environment files
- `/.git/*` — git repository
- `/wp-admin`, `/wp-login*` — WordPress scanner honeypot (returns 404)
- `/api/debug`, `/api/debug/*` — debug endpoints

### 12.3 Client Security

- **DOMPurify** — HTML sanitization for user-generated content rendering
- **Token management** — JWT cleared from localStorage on logout or auth failure
- **Protected routes** — React Router wrappers prevent unauthorized component rendering

---

## 13. Deployment

### 13.1 Infrastructure

| Component | Host | Type |
|-----------|------|------|
| **Client** | Render | Static Site |
| **Server** | Render | Web Service |
| **Database** | MongoDB Atlas | Managed cluster |
| **Files** | Cloudinary + AWS S3 | Cloud storage |

### 13.2 Client Build

```bash
cd client
npm install
npm run build        # Vite build → dist/
```

Output: `client/dist/` — deployed as a static site with `_redirects` for SPA routing.

### 13.3 Server Start

```bash
cd server
npm install
npm start            # node src/index.js
```

Development: `npm run dev` (uses `node --watch` for auto-restart)

### 13.4 Database Seeding

```bash
cd server
npm run seed         # node src/utils/seed.js
```

### 13.5 Cold Start Handling

Render free-tier services spin down after inactivity. The client handles this with:
- 3-attempt retry logic with progressive timeouts (10s → 20s → 30s)
- "Server is waking up..." loading indicator shown to users
- Server timeout set to 120s to accommodate long AI generation requests

---

## 14. Environment Variables

### Server (`server/.env`)

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 5000) |
| `NODE_ENV` | `development` or `production` |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret key for JWT signing |
| `JWT_EXPIRES_IN` | Token expiry duration (default: `7d`) |
| `CLIENT_URL` | Client application URL (for CORS) |
| `STRIPE_SECRET_KEY` | Stripe API secret key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `ANTHROPIC_API_KEY` | Claude AI API key |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `AWS_ACCESS_KEY_ID` | AWS S3 access key |
| `AWS_SECRET_ACCESS_KEY` | AWS S3 secret key |
| `AWS_REGION` | AWS S3 region |
| `AWS_S3_BUCKET` | S3 bucket name |
| `RESEND_API_KEY` | Resend email API key |
| `TWILIO_ACCOUNT_SID` | Twilio account SID |
| `TWILIO_AUTH_TOKEN` | Twilio auth token |
| `TWILIO_PHONE_NUMBER` | Twilio sending phone number |

### Client (`client/.env`)

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | API server base URL (e.g., `https://counselorready-api.onrender.com/api`) |

---

## 15. Accessibility (WCAG 2.1 AA)

The platform implements WCAG 2.1 AA compliance through the `AccessibilityProvider` component:

### Features

| Feature | Implementation |
|---------|---------------|
| **Skip to Content** | "Skip to main content" link, visible on focus |
| **High Contrast Mode** | `filter: contrast(1.25)` + thicker borders on interactive elements |
| **Reduced Motion** | Disables all animations and transitions |
| **Enhanced Focus Indicators** | 3px solid burgundy (`#8B2542`) outline + 4px box shadow on `:focus-visible` |
| **Dyslexia-Friendly Font** | OpenDyslexic font with increased letter/word spacing |
| **Screen Reader Support** | `.sr-only` utility class for visually hidden labels |

### Keyboard Navigation

All interactive elements are keyboard-accessible. Focus indicators use the burgundy brand color (`#8B2542`) for consistent visual identity.

### Color Contrast

The burgundy-700 (`#8B2542`) on white background exceeds WCAG AA contrast ratio requirements (7.4:1 for normal text).

---

## Changelog (v4 → v5)

### Design System

- **BREAKING:** Replaced all `moss` (green, `#3D6A4A`) color references with `burgundy` (`#8B2542`) platform-wide across 19 component files
- Updated `.btn-primary` from `bg-moss-600` to `bg-burgundy-700`
- Updated `.btn-secondary` from `text-moss-600 border-moss-600` to `text-burgundy-700 border-burgundy-700`
- Updated focus-visible indicators from green (`#4A7C59`) to burgundy (`#8B2542`)
- Login and Register pages converted from moss to burgundy branding

### Dashboard

- Reverted stat cards from horizontal (icon-left, value-right) layout to **vertical** layout (label top-left, icon top-right, big number below, descriptor at bottom)
- Restored 4-card grid (2×2 mobile, 4-column desktop) — removed the 5th "Total Learning Time" card and Award icon that were added in v4
- Stat cards: CE Hours Earned, Courses Completed, Certificates Stored, Active Credentials

### Pages Affected by Color Migration

Login, Register, Dashboard, Recommendations, GroupLicenseDashboard, Referrals, Gamification, SupervisionTracker, AdminBulkUpload, AuditKit, BoardAlerts, CEPlanner, Credentials, InsuranceTracker, OrganizationDashboard, Settings, App.jsx, AccessibilityProvider

---

*Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC. All rights reserved. Proprietary and confidential. Unauthorized copying or distribution is strictly prohibited.*
