# CounselorReady Feature Guide

**Your complete guide to every feature on the platform.**

CounselorReady is built for licensed counselors and mental health professionals who need to earn continuing education (CE) credits, track credentials, and stay audit-ready. This guide walks you through every feature so you can get the most out of your account.

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Dashboard](#dashboard)
3. [Course Catalog](#course-catalog)
4. [Course Player](#course-player)
5. [Credentials Manager](#credentials-manager)
6. [CE Planner](#ce-planner)
7. [Audit Kit](#audit-kit)
8. [Board Alerts](#board-alerts)
9. [Supervision Tracker](#supervision-tracker)
10. [Insurance Panel Tracker](#insurance-panel-tracker)
11. [Achievements & Gamification](#achievements--gamification)
12. [Referral Program](#referral-program)
13. [Smart Recommendations](#smart-recommendations)
14. [Group Licenses & Team Management](#group-licenses--team-management)
15. [Organization Dashboard](#organization-dashboard)
16. [Settings & Account](#settings--account)
17. [Subscription Plans](#subscription-plans)
18. [Notifications](#notifications)
19. [Accessibility](#accessibility)
20. [Legacy Vault](#legacy-vault)

---

## Getting Started

### Creating Your Account

1. Visit the landing page and click **Start 7-Day Free Trial**.
2. Fill out the registration form with your name, email, and password.
3. You'll be logged in automatically and taken to your Dashboard.

No credit card is required to start your trial. You can cancel anytime.

### Logging In

Go to the **Sign In** page, enter your email and password, and click **Log In**. If you're already logged in, you'll be redirected to the Course Catalog automatically.

### Navigation

The top navigation bar gives you quick access to the most-used features:

| Nav Item | What It Opens |
|----------|--------------|
| **Dashboard** | Your home overview with stats and quick actions |
| **Courses** | Browse and enroll in CE courses |
| **Credentials** | Manage licenses, certifications, and certificates |
| **CE Planner** | View your personalized CE completion strategy |
| **Audit Kit** | Generate audit-ready document packages |
| **Alerts** | See state licensing board updates |

Additional features are available under the **More** menu (three-dot icon):

- Supervision Tracker
- Insurance Panel Tracker
- Achievements
- Referrals
- Recommendations
- Team (Organization Dashboard)
- Group Licenses
- Legacy Vault

---

## Dashboard

**Path:** `/dashboard`

Your Dashboard is the first thing you see after logging in. It gives you a snapshot of where you stand.

### What You'll See

- **Welcome message** with your first name
- **Four stat cards:**
  - **CE Hours Earned** — total hours this renewal cycle
  - **Courses Completed** — all-time course completions
  - **Certificates Stored** — uploaded certificates on file
  - **Active Credentials** — licenses and certifications you're tracking

### Quick Actions

The Dashboard provides one-click buttons to jump to common tasks:

- **Browse Courses** — go to the course catalog
- **Upload Certificate** — add an external CE certificate
- **Add Credential** — start tracking a new license or certification
- **Generate Audit** — create an audit-ready package
- **Supervision** — log supervision hours
- **Recommendations** — see personalized course suggestions
- **Achievements** — check your badges and streaks

### Recent Activity

Shows your enrolled courses with progress bars so you can quickly resume where you left off.

### CE Progress Sidebar

Displays each of your credentials with a visual progress bar showing how many CE hours you've completed versus how many are required.

### Upcoming Renewals

Lists credentials approaching their expiration date with a countdown showing days remaining, so nothing sneaks up on you.

---

## Course Catalog

**Path:** `/courses`

Browse, search, and enroll in NBCC-approved continuing education courses.

### Searching and Filtering

- **Search bar** — type a keyword to search by course title or description
- **Category filter** — use the dropdown to narrow results by CE category (Ethics, General, Supervision, etc.)
- **View toggle** — switch between **Grid** view (cards) and **List** view (rows)

### Course Cards

Each course card displays:

- Course thumbnail
- Title and description
- **CE Hours** — how many credits the course is worth
- **Duration** — estimated time to complete
- **Category tags**
- **Progress bar** — if you've started the course
- **"Completed" badge** — if you've already finished it

### Actions

- Click **Start Course** to begin a new course
- Click **Continue Learning** to pick up where you left off
- Click **Review Course** to revisit a completed course

---

## Course Player

**Path:** `/courses/:slug` (click into any course)

The Course Player is where you actually take courses and earn CE credits.

### Course Overview Tab

When you first open a course, you'll see:

- Course title, subtitle, and full description
- Module and lesson count, total duration, and CEU value
- Access tier (which subscription plan is required)
- A **Course Content** outline listing all modules and lessons

Click **Start Course** or **Enroll Now** to begin.

### Lesson Viewer

Once you start a course, the lesson viewer shows:

- **Video player** for video-based lessons
- **Rich text content** for reading-based lessons
- **"Mark as Complete" button** — click this after finishing each lesson

The **right sidebar** displays:

- Your overall progress percentage
- An expandable course outline with checkmarks on completed lessons
- Lesson durations and access labels

Lessons must be completed in order. Locked lessons show a lock icon until prior lessons are finished.

---

## Credentials Manager

**Path:** `/credentials`

Track every professional license and certification in one place.

### Credentials Tab

Add and manage your professional credentials:

1. Click **Add Credential**
2. Fill in the details:
   - Credential name (e.g., "Licensed Professional Counselor")
   - Issuing body and state
   - License/certification number
   - Issue and expiration dates
   - CE hours required for renewal
   - Category breakdown (e.g., 6 hours Ethics, 24 hours General)
3. Save — your credential now appears in your list with a progress tracker

Each credential card shows:
- CE hours completed vs. required
- Category-by-category breakdown
- Days until expiration
- Color-coded status (on track, needs attention, expired)

### Certificates Tab

Store and organize all your CE certificates:

- **Upload certificates** via file upload, camera capture, or document scan
- View certificate details including title, provider, date, hours, and category
- **Download** stored certificates anytime
- Sort by date, category, or CE hours

### Templates

Pre-built credential templates for common license types make setup faster. Select your state and license type, and the requirements are auto-filled.

### AI Certificate Scanner

Upload an image or PDF of an external certificate, and the AI automatically extracts:
- Course title
- Provider name
- CE hours
- Completion date
- Category

This saves you from manually entering details for certificates earned outside the platform.

---

## CE Planner

**Path:** `/ce-planner`

Get a personalized strategy for completing your CE requirements on time.

### Summary Cards

At the top, four cards show:
- **Active Credentials** — how many you're tracking
- **Total Hours Remaining** — across all credentials
- **Needs Attention** — credentials at risk
- **On Track** — credentials with enough time

### Per-Credential Plans

For each credential, you'll see:

- **Urgency badge** — color-coded by how soon action is needed:
  - **Red (Expired/Critical)** — already past due or very close
  - **Yellow (Urgent)** — needs attention soon
  - **Blue (Upcoming)** — renewal approaching
  - **Green (On Track)** — plenty of time
- **Expiration date** and days remaining
- **Suggested weekly pace** — how many hours per week you should study
- **Progress bar** — overall hours completed vs. required
- **Category breakdown** — which specific categories still need hours
- **Recommended courses** — courses matched to your unfilled categories

If you haven't added any credentials yet, you'll be prompted to add them first.

---

## Audit Kit

**Path:** `/audit-kit`

Generate a complete audit-ready document package with one click.

### How to Use It

1. Optionally set a **date range** to limit which certificates are included
2. Click **Generate Package**
3. Review the summary showing total credentials, certificates, CE hours, and courses

### What's Included

- **Audit Readiness Checklist** — green checkmarks or red X's for:
  - All credentials complete
  - CE hour requirements met
  - Renewal deadlines approaching
  - Documents uploaded
- **Credentials Detail** — each credential with license number, issuing body, CE progress, expiration date, and category breakdown
- **CE Certificates Table** — every certificate with title, provider, date, hours, category, and verification code
- **Certificate Files** — download links to actual certificate PDFs

### Export Options

- **Download Full Package (JSON)** — a complete data snapshot of everything
- **Download CE Log (CSV)** — a spreadsheet with columns for title, provider, completion date, hours, category, and verification code — perfect for submitting to your licensing board

---

## Board Alerts

**Path:** `/board-alerts`

Stay informed about licensing rule changes that affect your credentials.

### Filtering Alerts

- **All** — see everything
- **Unread** — only alerts you haven't opened
- **Urgent** — only high-priority alerts
- **State filter** — if you hold licenses in multiple states, filter by state

### Alert Information

Each alert includes:
- **Severity level** — Urgent (red), Important (yellow), or Informational (blue)
- **Title and summary**
- **Detailed explanation** of the change
- **Category** — CE Requirement Change, Renewal Process, Fee Change, etc.
- **Effective date** — when the change takes effect
- **Source link** — link to the official board announcement
- **Affected credential types**

Click **Mark Read** to dismiss the unread badge on any alert.

---

## Supervision Tracker

**Path:** `/supervision`

Log and track supervision hours toward licensure — essential for pre-licensed professionals (LPC-Associates, etc.).

### Creating a Supervision Log

1. Click **+ New Log**
2. Enter:
   - Supervisor's name and credentials
   - Supervisor's license number
   - License type you're working toward (e.g., LPC, LMHC)
   - State
   - Total hours required
   - Start date
3. Save — your log appears in the left sidebar

### Logging Sessions

Select a supervision log, then click **+ Add Session** to record:

- **Date** of the session
- **Hours** — in 0.25-hour increments (e.g., 1.5 hours)
- **Session type** — Individual, Group, Live Observation, or Triadic
- **Modality** — In Person or Telehealth
- **Topics covered** — comma-separated list
- **Notes** — any additional details

### Tracking Progress

Each log displays:
- **Progress cards** — Hours Logged, Hours Required, Hours Remaining
- **Session history** — every session with date, hours, type, modality, and topics
- **Status badge** — Active, On Hold, or Completed

You can **edit** log details or **delete** individual sessions or entire logs.

---

## Insurance Panel Tracker

**Path:** `/insurance-tracker`

Track your applications to get credentialed with insurance companies.

### Adding a Panel

1. Click **+ Add Panel**
2. Fill in:
   - Insurance company name
   - Panel type (In-Network, Out-of-Network, or Both)
   - Application date
   - Status (Not Started, Gathering Documents, Submitted, Under Review, Approved, Denied, Recredentialing)
   - CAQH ID
   - Contact info and portal URL
   - Follow-up dates
   - Notes

### Tracking Applications

Each panel entry shows:
- Company name and panel type
- Application date and **days since application**
- Color-coded status badge

Click to expand and see:
- Provider number, effective date, recredentialing due date
- Contact information with portal link
- **Documents checklist** — track which documents you've submitted:
  - W-9, License Copy, Insurance Certificate, NPI Confirmation, CAQH Profile, Diploma, Board Certification, DEA Certificate
- **Status history timeline** — see when each status change occurred

Quick stats at the top show how many panels are Approved, Pending, and Need Follow-Up.

---

## Achievements & Gamification

**Path:** `/achievements`

Stay motivated with levels, badges, streaks, and a community leaderboard.

### Overview Tab

- **Your Level and XP** — displayed in a large gradient card with a progress bar to the next level
- **Stat cards:**
  - Current Streak (consecutive days active)
  - Longest Streak
  - Courses Completed
  - CE Hours Earned
- **Weekly CE Goal** — set a weekly target (1–10 hours) and track your progress with a visual bar

### Badges Tab

Browse all available badges with emoji icons and descriptions. Badges you've earned are highlighted; unearned badges are grayed out. Badges are awarded for milestones like:
- Completing your first course
- Earning a streak
- Reaching CE hour milestones
- And more

### Leaderboard Tab

See how you rank against other CounselorReady users:
- Your current rank and XP total
- A ranked table showing the top users with their XP, level, streak, and badge count
- Gold, silver, and bronze medals for the top 3

---

## Referral Program

**Path:** `/referrals`

Earn credit by inviting colleagues to CounselorReady.

### How It Works

1. **Share your unique referral link** — copy it from the Referrals page
2. **Your colleague signs up** using that link
3. **You earn $10 credit** when they subscribe to a paid plan

### What You'll See

- **Your referral link** — a unique URL you can copy and share
- **Your referral code** — displayed in CODE: XXXXX format
- **Stats:** Total Link Clicks, Sign Ups, Conversions, and Credit Balance
- **Referral History table** showing each person you've referred with their email, join date, and status (Pending, Registered, Subscribed, or Rewarded)

---

## Smart Recommendations

**Path:** `/recommendations`

Get AI-powered course suggestions tailored to your credential needs.

### What You'll See

- **Summary cards** showing CE Hours Needed, Courses Completed, and Courses Available
- **Expiration alerts** — an amber banner highlighting credentials approaching expiration with the hours still needed
- **Recommended courses** — each with:
  - Course title, CE hours, category, and access tier
  - **Reason tags** explaining why it's suggested (e.g., "Needed for renewal", "In your specialty area")
  - **Relevance score** (0–100) showing how closely the course matches your needs

Click any recommended course to go directly to its detail page.

To get the best recommendations, make sure your credential profiles are filled out with CE requirements and categories.

---

## Group Licenses & Team Management

**Path:** `/group-licenses`

Manage CE subscriptions for teams and organizations.

### Creating a Group License

1. Click **+ New Group License**
2. Enter:
   - Organization name
   - Plan type — Team ($15.99/seat) or Enterprise (custom pricing)
   - Number of seats (minimum 5)
   - Contact email
3. Save — your group license is created

### Managing Members

- Click **+ Invite Members** to add people by email (one per line or comma-separated)
- View all members with their name, email, and status (Active or Invited)
- Track seat usage: Active, Total, and Available

### Compliance Overview

For each member, see their CE completion progress as a percentage bar:
- **Green** — 100% complete
- **Amber** — still in progress

---

## Organization Dashboard

**Path:** `/organization`

A centralized view for organization administrators to monitor team-wide CE compliance and activity.

---

## Settings & Account

**Path:** `/settings`

Manage your account across four tabs.

### Profile

- Edit your **first name** and **last name**
- View your **email** (contact support to change it)
- Select your **state** from a dropdown of all 50 states + DC
- Click **Save Changes**

### Notifications

- **Credential Reminders** — toggle on/off to receive expiration notifications
- **Marketing Emails** — toggle on/off for new course and feature announcements
- **Reminder Frequency** — choose when to be notified: 6 months, 3 months, 1 month, or 1 week before expiration
- Click **Save Preferences**

### Subscription

- View your current plan, status, and renewal/trial end date
- **Upgrade** — if on the Free plan, see available plans with pricing and feature lists
- **Cancel** — cancel your subscription (except Lifetime plans)
- View **billing history** (transaction records)

### Security

- Change your password:
  1. Enter your current password
  2. Enter a new password (minimum 8 characters)
  3. Confirm the new password
  4. Click **Change Password**

---

## Subscription Plans

CounselorReady offers four tiers:

| Plan | Price | Key Features |
|------|-------|-------------|
| **Free** | $0/forever | 4 CE hours, unlimited certificate uploads, certificate vault |
| **Starter** | $19.99/mo | Unlimited CE courses, credential tracking, AI certificate scanning, audit reports |
| **Professional** | $29.99/mo | Everything in Starter + specialty tracking, certification-level courses |
| **VIP** | $49.99/mo | Everything in Professional + multi-state tracking, text & calendar reminders, hardship pause month, quarterly consultation sessions, early webinar access |

Start with a **7-day free trial** — no credit card required.

---

## Notifications

A **bell icon** in the navigation bar shows your unread notification count. Click it to see recent notifications including:

- Course completion confirmations
- Credential renewal reminders
- Platform announcements
- Referral activity updates

You can **mark individual notifications as read** or click **Mark All Read** to clear the badge.

Notification preferences can be configured in **Settings > Notifications**.

---

## Accessibility

CounselorReady includes built-in accessibility features:

- **Skip to Content** link — allows keyboard users to jump past navigation
- **Accessibility Panel** — adjustable settings for visual preferences
- Full keyboard navigation support throughout the platform

---

## Legacy Vault

**Path:** `/legacy-vault`

Your secure digital vault for critical professional documents and practice succession planning. Legacy Vault ensures your practice is protected and your wishes are honored if you're ever unable to manage it yourself.

Access Legacy Vault from the **More** menu in the top navigation bar.

### At a Glance

When you open Legacy Vault, four summary cards show your current status:

| Card | What It Shows |
|------|--------------|
| **Documents** | Total documents stored in your vault |
| **Contacts** | Number of active succession contacts |
| **Expiring Soon** | Documents approaching their expiration date (within 30 days) |
| **Plan Status** | Your succession plan status — Not Started, In Progress, or Complete |

Below the stats, four tabs organize everything:

---

### Documents Tab

Store and manage important professional documents with expiration tracking.

#### Uploading a Document

1. Click **Add Document**
2. Fill in the details:
   - **Title** (required) — e.g., "Georgia LPC License" or "Malpractice Policy"
   - **Category** — choose from the list below
   - **Description** — optional notes about the document
   - **Expiration Date** — if applicable, the date this document expires
   - **File** — upload a PDF, JPG, PNG, or WebP file (max 10MB)
   - **Notes** — any additional context
   - **Mark as Confidential** — flag sensitive documents
3. Click **Save Document**

Files are uploaded securely via Cloudinary with authenticated access — they cannot be accessed without signing in.

#### Document Categories

| Category | Use For |
|----------|---------|
| License | State professional licenses (LPC, LMHC, LCSW, etc.) |
| Insurance | Liability, malpractice, or health insurance documents |
| Will | Personal or professional will and testament |
| Practice Agreement | Partnership agreements, operating agreements |
| Business Entity | LLC articles, EIN letters, business registrations |
| Tax Document | W-9s, 1099s, tax returns related to practice |
| Malpractice | Malpractice insurance policies and certificates |
| Emergency Plan | Practice emergency response plans |
| Client Records Plan | Plans for client record retention and transfer |
| Power of Attorney | Legal power of attorney documents |
| Lease Agreement | Office lease or rental agreements |
| EHR Credentials | Login info or access docs for your EHR system |
| Other | Anything else |

#### Expiration Tracking

Documents with an expiration date show color-coded badges:

- **Green** — valid, not expiring soon
- **Amber** — expiring within 30 days (or your custom reminder window)
- **Red** — already expired

The **Expiring Soon** stat card on the summary bar counts documents expiring within 30 days so you can take action before they lapse.

#### Downloading and Deleting

- Click the **download icon** on any document to open it via a secure signed URL (valid for 5 minutes)
- Click the **trash icon** to permanently delete a document and its file from storage
- Confidential documents display an **eye-off icon** for quick identification

---

### Contacts Tab

Define the people who should be notified or take action if you're unable to manage your practice.

#### Adding a Contact

1. Click **Add Contact**
2. Fill in the details:
   - **Name** (required)
   - **Role** — their responsibility (see table below)
   - **Access Level** — what they're authorized to do
   - **Email** and **Phone**
   - **Organization** — their practice or firm
   - **License #** — if they're a licensed clinician
   - **Responsibilities** — specific tasks they should handle
   - **Notes** — any additional context
   - **Primary Contact** — check this for your main point of contact
3. Click **Add Contact**

#### Contact Roles

| Role | Description |
|------|------------|
| Clinical Executor | Takes over clinical responsibilities and client care |
| Business Executor | Handles business, financial, and operational matters |
| Emergency Contact | First person notified in an emergency |
| Attorney | Legal representative for practice matters |
| Accountant | Financial and tax matters |
| EHR Administrator | Access and management of your EHR system |
| Supervisor | Your clinical supervisor |
| Colleague | Trusted colleague for general support |
| Other | Any other role |

#### Access Levels

| Level | What It Means |
|-------|--------------|
| **Full Access** | Can access all vault documents |
| **Limited Access** | Can access only specific documents you designate |
| **Notify Only** | Receives alerts but cannot access vault contents |

#### Managing Contacts

- The **star icon** marks your primary contact
- Click the **pencil icon** to edit any contact's details
- Click the **trash icon** to remove a contact (soft delete — can be restored)

---

### Succession Plan Tab

Create a structured continuity plan so your practice can transition smoothly if needed.

#### Plan Status

Use the status dropdown to track where you are:

- **Not Started** — you haven't begun filling in the plan
- **In Progress** — partially completed
- **Complete** — all sections filled out and reviewed

#### Practice Details

Fill in the basics about your practice:

- **Practice Name** — your business or DBA name
- **Practice Type** — Solo Practice, Group Practice, Agency, or Other
- **Estimated Active Clients** — how many clients you're currently serving
- **EHR System** — which electronic health record system you use (e.g., SimplePractice, TherapyNotes, TheraNest)

#### Continuity Instructions

Four text fields capture the critical information your successors will need:

1. **Client Notification Plan** — How should clients be notified? Who should contact them? What should the message say?
2. **Records Transfer Plan** — Where are client records stored? How should they be transferred? What are the retention requirements?
3. **Financial Instructions** — Outstanding invoices, insurance billing, bank accounts, pending insurance claims
4. **Additional Instructions** — Anything else that doesn't fit in the other categories

#### Saving

Click **Save Plan** after making changes. The button is highlighted when you have unsaved changes. The plan records when it was last reviewed so you can track whether it's up to date.

---

### Check-In & Recovery Tab

Two critical safety features: a dead man's switch and vault recovery.

#### Dead Man's Switch

A periodic check-in system that confirms you're active. If you miss check-ins, your succession contacts can be notified.

**Setting Up:**

1. Toggle **Enable Check-In** to turn it on
2. Choose your **Check-In Interval** — how often you need to check in:
   - 7 days
   - 14 days
   - 30 days (default)
   - 60 days
   - 90 days

**Using It:**

- Three status cards show your **Last Check-In** date, **Next Due** date, and current **Status**
- When the next check-in is due, click **Check In Now** to reset the timer
- If you're overdue, the status shows in red with how many days past due

**What happens when you miss check-ins:** The system tracks missed check-ins. In a future update, your emergency contacts will receive automated notifications after consecutive missed check-ins.

#### Recovery Token

Generate and download a recovery token that can be used to restore vault access.

1. Click **Generate Recovery Token**
2. A text file automatically downloads containing your unique token
3. **Store this file in a safe place** — a physical safe, a trusted family member, or your attorney's office

If you already have a token, clicking **Regenerate Token** will create a new one and invalidate the previous token.

The page shows whether you have an active recovery token and when it was created.

---

### Best Practices

1. **Upload documents as soon as you receive them** — licenses, insurance renewals, and malpractice certificates should go into the vault immediately
2. **Set expiration dates** on every document that has one — the system will alert you before they lapse
3. **Add at least two succession contacts** — a clinical executor and an emergency contact at minimum
4. **Complete your succession plan** — even a partial plan is better than none; update it annually
5. **Use meaningful categories** — this makes it easy to find documents during an audit or emergency
6. **Enable the dead man's switch** — set a reasonable interval (30 or 60 days) and make checking in part of your monthly routine
7. **Generate a recovery token** and store it separately from your vault — with your attorney, in a safe deposit box, or with a trusted family member
8. **Review your plan annually** — practices evolve; update your client count, EHR system, and instructions as things change

---

## Need Help?

- **Website:** [CounselorReady.com](https://counselorready.com)
- **Provider:** GA Integrated Therapeutic Perspectives LLC
- **NBCC Approved Continuing Education Provider** — ACEP #7760
