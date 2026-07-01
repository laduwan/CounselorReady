// Seed script: All missing help articles
// Run from ~/project/src/server:
//   node --input-type=module < seed-all-missing-help-articles.js

import mongoose from 'mongoose';
await mongoose.connect(process.env.MONGODB_URI);
const db = mongoose.connection.db;

const articles = [

// ─────────────────────────────────────────────────────────────
// CERTIFICATES & CE SCANNER
// ─────────────────────────────────────────────────────────────
{
  title: 'AI CE Scanner: Upload Certificates from Any Provider',
  slug: 'ai-ce-scanner-upload-certificates',
  summary: 'Upload a CE certificate from any provider and CounselorReady\'s AI automatically extracts the course title, hours, provider, and approval body — then files it under the right credential.',
  content: `# AI CE Scanner: Upload Certificates from Any Provider

CounselorReady's AI CE Scanner lets you store CE certificates you've earned anywhere — not just courses completed on this platform. Upload a certificate image or PDF and the AI extracts all the details automatically.

## How It Works

1. Go to **CE Certificates** (\`/certificates.html\`) from your dashboard or nav.
2. Click **Upload Certificate**.
3. Upload your certificate (JPG, PNG, or PDF).
4. The AI scans the document and extracts:
   - Course title
   - Provider name
   - CE hours
   - Completion date
   - Approving body (NBCC, APA, state board, etc.)
   - Content category (ethics, clinical, telehealth, etc.)
5. Review the extracted details, edit anything that needs correcting, and save.

The certificate is stored under your account and counted toward your credential tracking automatically.

## What Certificates Can I Upload?

Any CE certificate from any provider — NBCC-approved courses, state-specific CE, APA-approved workshops, conference credits, university coursework, employer training, and more. CounselorReady does not verify the legitimacy of uploaded certificates; you are responsible for ensuring the CE meets your board's requirements.

## Can I Download My Certificates?

Yes. All certificates (from CounselorReady courses and uploaded ones) are stored in your account and can be downloaded individually or exported as a complete audit package from the **Audit Kit** (\`/audit-kit.html\`).

## CE Scanner Access

The AI CE Scanner requires a paid subscription. If you're on the Free plan and see "Feature Not Available," upgrade your subscription at \`/subscription.html\`.
`,
  category: 'certificates',
  audience: 'user',
  searchTags: ['CE scanner', 'upload certificate', 'AI scan', 'external CE', 'certificate upload', 'any provider', 'OCR', 'extract hours'],
  icon: 'fa-file-invoice',
  order: 2,
  featured: false,
  isPublished: true,
  views: 0, helpful: 0, notHelpful: 0,
  createdAt: new Date(), updatedAt: new Date()
},

// ─────────────────────────────────────────────────────────────
// AUDIT KIT
// ─────────────────────────────────────────────────────────────
{
  title: 'Audit Kit: Preparing for a Licensing Board Audit',
  slug: 'audit-kit-board-audit-preparation',
  summary: 'Generate a complete, board-ready audit package from your CounselorReady account in seconds — all your CE certificates, hours, and documentation in one downloadable PDF.',
  content: `# Audit Kit: Preparing for a Licensing Board Audit

If your licensing board audits your CE hours, you need organized documentation of every course you've completed. CounselorReady stores this automatically and can generate a complete audit package on demand.

## What's Included in Your Audit Package

- All CE certificates from courses completed on CounselorReady
- All certificates you've uploaded via the AI CE Scanner
- Summary of total CE hours by credential and category
- Provider names and approval body information for each course

## How to Generate Your Audit Package

1. Go to **Audit Kit** (\`/audit-kit.html\`) from your dashboard.
2. Review your stored certificates and hours in the summary.
3. Click **Download PDF** to generate your complete audit package.

The PDF is formatted for board submission — organized, labeled, and ready to send.

## Keep Your Records Current

Your audit package is only as complete as your account. Make sure to:
- Complete courses on CounselorReady to get automatic certificate storage
- Upload certificates from other providers using the AI CE Scanner
- Add your credentials under **Credentials** so hours are filed correctly

## What If My Board Asks for Something Specific?

Different boards have different audit requirements. CounselorReady generates a comprehensive documentation package, but you should verify your board's specific format requirements. If your board requires a particular format not covered by the standard package, contact us through Messages.
`,
  category: 'certificates',
  audience: 'user',
  searchTags: ['audit', 'audit kit', 'board audit', 'licensing board', 'CE documentation', 'audit package', 'audit ready', 'proof of completion'],
  icon: 'fa-shield-halved',
  order: 3,
  featured: false,
  isPublished: true,
  views: 0, helpful: 0, notHelpful: 0,
  createdAt: new Date(), updatedAt: new Date()
},

// ─────────────────────────────────────────────────────────────
// BOARD ALERTS
// ─────────────────────────────────────────────────────────────
{
  title: 'Board Alerts: Licensing Board Rule Monitoring',
  slug: 'board-alerts-licensing-monitoring',
  summary: 'CounselorReady monitors CE requirements for your licensing board and alerts you when rules change — so you\'re never caught off-guard by a requirement update.',
  content: `# Board Alerts: Licensing Board Rule Monitoring

Board Alerts automatically monitors the CE requirements for your licensing board and surfaces changes that could affect your renewal.

## What Board Alerts Shows You

Go to **Board Alerts** (\`/board-alerts.html\`) to see:
- Current CE hour requirements for each of your credentials
- Ethics, supervision, and specialty hour requirements
- Recent rule changes highlighted for your attention
- Renewal cycle and deadline information

The page populates based on the credentials you've added under **Credentials** (\`/credentials.html\`). If you don't see any alerts, make sure you've added at least one credential first.

## How Requirements Are Tracked

CounselorReady maintains a database of licensing board CE requirements for LPC, LMHC, LCSW, LMFT, and related licenses across all US states. When a board updates its requirements, the change is flagged in your Board Alerts view.

## What to Do When You See an Alert

Read the alert details carefully. If a requirement has changed:
- Compare it to your current CE plan
- Adjust your course selections if needed
- Use the **CE Planner** in your Credentials section to update your renewal tracking

Board Alerts is informational — always verify requirement changes directly with your licensing board before making decisions based on them.

## Which Boards Are Covered?

CounselorReady covers state licensing boards for LPCs, LMHCs, LCSWs, LMFTs, and NCCs across all 50 states. Coverage varies by state and license type. If you don't see your board listed, contact us through Messages.
`,
  category: 'credentials',
  audience: 'user',
  searchTags: ['board alerts', 'licensing board', 'CE requirements', 'rule changes', 'renewal requirements', 'board monitoring', 'state board'],
  icon: 'fa-bell',
  order: 3,
  featured: false,
  isPublished: true,
  views: 0, helpful: 0, notHelpful: 0,
  createdAt: new Date(), updatedAt: new Date()
},

// ─────────────────────────────────────────────────────────────
// SMART RECOMMENDATIONS
// ─────────────────────────────────────────────────────────────
{
  title: 'Smart CE Recommendations',
  slug: 'smart-ce-recommendations',
  summary: 'CounselorReady suggests courses based on your credentials, renewal deadlines, and the specific hours you still need — so you always know what to take next.',
  content: `# Smart CE Recommendations

CounselorReady's recommendation engine looks at your credentials, your completion history, and your renewal requirements, then surfaces the courses most likely to move you toward your next renewal.

## How to Use It

Go to **Smart CE Recommendations** from your dashboard. The page shows:
- Courses that satisfy ethics hours you still need
- Courses aligned with your specialty areas or board-specific requirements
- Courses in categories you haven't yet covered this renewal cycle
- New courses that match your past completion patterns

## What Drives the Recommendations?

The system considers:
- Your active credentials and their renewal deadlines
- CE hours already completed this cycle (from courses on CounselorReady and uploaded certificates)
- Hour gaps by category (ethics, supervision, clinical, telehealth, etc.)
- Your license type and state

## Making the Most of Recommendations

For the most accurate recommendations:
- Keep your credentials up to date under **Credentials**
- Upload certificates from courses taken elsewhere so those hours count toward your gaps
- Set your renewal dates accurately in your credential settings

## Can I Turn Off Recommendations?

Recommendations appear based on your account data — there's no opt-out, but they update automatically as you complete more courses and upload certificates.
`,
  category: 'courses',
  audience: 'user',
  searchTags: ['recommendations', 'smart recommendations', 'course suggestions', 'what to take', 'CE gaps', 'personalized', 'AI recommendations'],
  icon: 'fa-lightbulb',
  order: 4,
  featured: false,
  isPublished: true,
  views: 0, helpful: 0, notHelpful: 0,
  createdAt: new Date(), updatedAt: new Date()
},

// ─────────────────────────────────────────────────────────────
// LIVE SESSIONS
// ─────────────────────────────────────────────────────────────
{
  title: 'Live Sessions: Synchronous CE Webinars',
  slug: 'live-sessions-synchronous-ce-webinars',
  summary: 'Attend live, interactive CE webinars directly in your browser. Earn synchronous CE hours with real-time interaction, verified attendance, and automatic certificate delivery.',
  content: `# Live Sessions: Synchronous CE Webinars

CounselorReady Live Sessions are synchronous, NBCC-approved continuing education webinars you attend in real time — directly in your browser, no downloads or plugins required.

## What Makes Live Sessions Different

Unlike self-paced courses, live sessions:
- Run at a scheduled date and time
- Feature a live presenter you can interact with
- Count as **synchronous CE hours**, which some boards require a specific number of
- Issue certificates automatically after verified attendance

## How to Find and Join a Session

1. Go to **Live Sessions** (\`/live-sessions.html\`) from the nav.
2. Browse upcoming sessions by date, topic, or CE hours.
3. Click **Register** on a session you want to attend.
4. At the scheduled time, return to the Live Sessions page and click **Join**.
5. The session opens directly in your browser — no Zoom or external app required.

## Attendance and Certificates

Attendance is verified automatically during the session. You must be present for the required portion of the session to receive CE credit. Your certificate is issued automatically to your account when the session ends and attendance is confirmed.

## Can I Watch a Recording?

Some sessions may be made available as recordings after the live date, but recordings do not count as synchronous CE hours. Check the session details for recording availability.

## Technical Requirements

Live sessions run in your browser using Whereby Embedded. For the best experience:
- Use Chrome, Firefox, Safari, or Edge (updated to the last major version)
- Allow camera and microphone access if the session requires participation
- A stable internet connection is recommended

If you have trouble joining, try refreshing the page or switching browsers.
`,
  category: 'courses',
  audience: 'user',
  searchTags: ['live sessions', 'webinar', 'synchronous CE', 'live CE', 'real-time', 'scheduled session', 'interactive', 'live webinar'],
  icon: 'fa-video',
  order: 5,
  featured: true,
  isPublished: true,
  views: 0, helpful: 0, notHelpful: 0,
  createdAt: new Date(), updatedAt: new Date()
},

// ─────────────────────────────────────────────────────────────
// ACHIEVEMENTS & XP
// ─────────────────────────────────────────────────────────────
{
  title: 'Achievements, XP & the Mindful Momentum Program',
  slug: 'achievements-xp-mindful-momentum',
  summary: 'Earn XP, unlock badges, maintain learning streaks, and climb the leaderboard as you complete CE — the Mindful Momentum Program rewards your professional growth.',
  content: `# Achievements, XP & the Mindful Momentum Program

CounselorReady's **Mindful Momentum Program (MMP)** rewards you for consistent professional development. Every CE activity earns XP, unlocks badges, and builds your streak.

## How to Access Achievements

Go to **Achievements** (\`/achievements.html\`) from your dashboard to see:
- Your current XP total and level
- XP needed to reach the next level
- Your learning streak (consecutive days with CE activity)
- All available badges — earned ones in color, locked ones dimmed
- Your position on the leaderboard

## Earning XP

You earn XP by:
- Completing CE courses on CounselorReady
- Uploading certificates from other providers
- Attending live sessions
- Maintaining daily learning streaks
- Reaching milestones (first course, first ethics hour, etc.)

## Badges

Badges recognize specific achievements — completing your first course, earning ethics hours, finishing a series, reaching XP milestones, and more. Badge requirements are shown on each locked badge card.

## Learning Streaks

A streak counts any day you complete a CE activity on CounselorReady. Streaks reset if you go a full day without activity. The streak counter appears on your Achievements page and your dashboard.

## Leaderboard

The leaderboard ranks all CounselorReady learners by XP. It updates in real time as you and others complete activities. Your rank is shown at the top of your Achievements page.

## Do XP and Badges Affect My CE Credits?

No. XP and badges are recognition rewards only — they don't change your CE hours or affect your credentials. They're a way to track and celebrate your professional growth.
`,
  category: 'getting-started',
  audience: 'user',
  searchTags: ['achievements', 'XP', 'badges', 'leaderboard', 'streak', 'rewards', 'mindful momentum', 'MMP', 'gamification', 'points'],
  icon: 'fa-trophy',
  order: 5,
  featured: false,
  isPublished: true,
  views: 0, helpful: 0, notHelpful: 0,
  createdAt: new Date(), updatedAt: new Date()
},

// ─────────────────────────────────────────────────────────────
// REFERRALS
// ─────────────────────────────────────────────────────────────
{
  title: 'Pass the Key: Referral Program & Rewards',
  slug: 'referrals-pass-the-key-program',
  summary: 'Share CounselorReady with colleagues and earn rewards at every milestone — $5 credits, free courses, and a revenue share for top referrers.',
  content: `# Pass the Key: Referral Program & Rewards

CounselorReady's **Pass the Key** referral program rewards you for sharing the platform with colleagues. Three tracks with escalating rewards based on how many people you refer.

## How to Access Your Referral Link

Go to **Referrals** (\`/referrals.html\`) from your dashboard. Your unique referral link is displayed at the top — share it by email, text, social media, or anywhere else.

## The Three Tracks

### Track 1 — Credit Track
- **$5 account credit** for every colleague who subscribes after using your link
- **$0.50 pending credit** per signup (converts to full credit after they earn 10 CE hours)
- Best for: counselors who want ongoing credits toward their own subscription

### Track 2 — Course Track
- **5 paid referrals** unlocks a free premium course (Intake to Remit or TeleMental Health, with optional Supervision add-on)
- Best for: counselors who want specific course content as a reward

### Track 3 — Revenue Share
- **50 paid referrals** earns a **$100 cash bonus** plus a **10% monthly revenue share** via Stripe Connect
- Best for: counselors with a large network or platform/community

## Tracking Your Referrals

Your referrals page shows all signups who used your link, their status (signed up / subscribed / 10 CE hours reached), and your earned and pending rewards.

## When Are Credits Applied?

Credits appear in your account after the referral condition is met (e.g., the person subscribes, or reaches 10 CE hours). Credits apply automatically to your next billing cycle.

## Can I Refer Organizations?

Yes. If an organization, group practice, or training program signs up using your link, it counts toward your referral total. The organization's admin is the referral for tracking purposes.
`,
  category: 'account',
  audience: 'user',
  searchTags: ['referrals', 'pass the key', 'refer a friend', 'referral program', 'credits', 'rewards', 'revenue share', 'earn money', 'free course'],
  icon: 'fa-key',
  order: 2,
  featured: true,
  isPublished: true,
  views: 0, helpful: 0, notHelpful: 0,
  createdAt: new Date(), updatedAt: new Date()
},

// ─────────────────────────────────────────────────────────────
// SUPERVISION TRACKER
// ─────────────────────────────────────────────────────────────
{
  title: 'Supervision Tracker: Logging Hours Toward Licensure',
  slug: 'supervision-tracker-licensure-hours',
  summary: 'Track your clinical supervision hours toward licensure — log individual and group sessions, track progress against your total requirement, and keep a complete record for your board.',
  content: `# Supervision Tracker: Logging Hours Toward Licensure

The Supervision Tracker helps pre-licensed counselors log and track clinical supervision hours required for full licensure.

## How to Access It

Go to **Supervision Tracker** from your dashboard (look under your credential management tools, or navigate to \`/supervision.html\`).

## Setting Up a Supervision Log

Click **New Supervision Log** and enter:
- **Supervisor name and email** — your licensed clinical supervisor
- **Total hours required** — the number of supervision hours your board requires (e.g., 100 hours)
- **Start date** — when your supervision relationship began
- **Target completion date** — your goal date for completing hours

You can create multiple logs if you have more than one supervisor or if your requirements have different tracks (e.g., individual vs. group).

## Logging Sessions

Once your log is set up, add sessions as you complete them:
- **Date** — the session date
- **Duration** — hours logged for this session
- **Session type** — individual or group
- **Notes** — optional notes about content covered

Your progress bar updates automatically as you add sessions.

## Using Your Records for Licensure

Your supervision log provides a running record for your board application. You can export your logged hours for documentation purposes. Note that CounselorReady's supervision log is a tracking tool — your board may require additional documentation (supervisor attestation letters, etc.) that you arrange directly with your supervisor.
`,
  category: 'credentials',
  audience: 'user',
  searchTags: ['supervision', 'supervision hours', 'licensure', 'pre-licensed', 'clinical supervision', 'supervision log', 'hours toward licensure', 'LPC requirements'],
  icon: 'fa-user-graduate',
  order: 4,
  featured: false,
  isPublished: true,
  views: 0, helpful: 0, notHelpful: 0,
  createdAt: new Date(), updatedAt: new Date()
},

// ─────────────────────────────────────────────────────────────
// INSURANCE PANEL TRACKER
// ─────────────────────────────────────────────────────────────
{
  title: 'Insurance Panel Tracker: Managing Credentialing Applications',
  slug: 'insurance-panel-tracker',
  summary: 'Track your insurance credentialing applications in one place — status, submission dates, effective dates, and follow-up reminders for every panel you\'ve applied to.',
  content: `# Insurance Panel Tracker: Managing Credentialing Applications

The Insurance Panel Tracker helps you organize and follow up on insurance credentialing applications — keeping all your panels in one place so nothing falls through the cracks.

## How to Access It

Navigate to \`/insurance-tracker.html\` or find it in your credential management tools.

## Adding an Insurance Panel

Click **Add Insurance Panel** and enter:
- **Insurance company name** — e.g., Aetna, BCBS, Cigna, United
- **Application submission date** — when you submitted your application
- **Status** — Pending, Approved, Denied, or In Progress
- **Effective date** — when your credentialing becomes active (once approved)
- **Notes** — follow-up details, contact names, reference numbers

## Tracking Multiple Panels

Add as many insurance panels as you're working with. The tracker shows all your panels in a summary view so you can see at a glance which are pending, which are approved, and which need follow-up.

## What the Tracker Doesn't Do

The Insurance Panel Tracker is a documentation tool — it doesn't submit applications, contact payers, or verify your credentialing status with insurance companies. For credentialing support or CAQH assistance, work with a credentialing service or your billing company.
`,
  category: 'credentials',
  audience: 'user',
  searchTags: ['insurance', 'insurance panel', 'credentialing', 'CAQH', 'in-network', 'panel application', 'insurance tracker', 'billing', 'Aetna', 'BCBS'],
  icon: 'fa-hospital',
  order: 5,
  featured: false,
  isPublished: true,
  views: 0, helpful: 0, notHelpful: 0,
  createdAt: new Date(), updatedAt: new Date()
},

// ─────────────────────────────────────────────────────────────
// LEGACY VAULT
// ─────────────────────────────────────────────────────────────
{
  title: 'Legacy Vault: Storing Professional Documents',
  slug: 'legacy-vault-professional-documents',
  summary: 'Securely store important professional documents — licenses, diplomas, NPI letters, supervision records, and more — in one organized, cloud-accessible vault.',
  content: `# Legacy Vault: Storing Professional Documents

The Legacy Vault is a secure document storage area for your professional records. Store licenses, diplomas, NPI assignment letters, supervision records, CE certificates from other platforms, and any other documents you want to keep organized and accessible.

## What to Store in the Vault

- State license certificates
- National certifications (NCC, CCMHC, BC-TMH, etc.)
- Graduate diplomas and transcripts
- NPI assignment confirmation letters
- Supervision agreements and attestation letters
- DEA registration (if applicable)
- Malpractice insurance declarations pages
- Any document you might need for a board audit, credentialing application, or employment verification

## Uploading Documents

1. Go to **Legacy Vault** from your dashboard.
2. Click **Upload Document**.
3. Select a **category** for the document.
4. Upload the file (PDF, JPG, or PNG).
5. Add a title and any notes.
6. Click **Save**.

Your document is stored securely and accessible from any device.

## Organizing Your Vault

Documents are organized by category. You can view all documents or filter by category. The vault summary shows total documents stored, contacts saved, your current plan, and your last check-in date.

## Is the Vault Private?

Yes. Your Legacy Vault documents are private to your account. CounselorReady staff do not access your vault documents except as required to provide support you specifically request.
`,
  category: 'account',
  audience: 'user',
  searchTags: ['legacy vault', 'document storage', 'professional documents', 'license storage', 'diploma', 'NPI', 'secure storage', 'professional records', 'vault'],
  icon: 'fa-vault',
  order: 3,
  featured: false,
  isPublished: true,
  views: 0, helpful: 0, notHelpful: 0,
  createdAt: new Date(), updatedAt: new Date()
},

// ─────────────────────────────────────────────────────────────
// MESSAGES
// ─────────────────────────────────────────────────────────────
{
  title: 'Messages: Contacting Support',
  slug: 'messages-contacting-support',
  summary: 'Send messages to CounselorReady support directly from your account — no email required. All your conversations are stored in one place.',
  content: `# Messages: Contacting Support

The Messages feature lets you contact CounselorReady support directly from your account.

## How to Send a Message

1. Go to **Messages** (\`/messages.html\`) from the nav.
2. Click **New Message** or **Start a new message to contact support**.
3. Type your message and send.

Your message goes directly to the CounselorReady support team. Responses appear in the same thread so the conversation stays organized.

## Response Times

CounselorReady support typically responds within 1 business day. For urgent issues, include "URGENT" at the start of your message subject.

## What to Include in Your Message

To get faster help, include:
- A clear description of the issue or question
- The course name or feature you're asking about
- Any error messages you're seeing
- What you've already tried

## Other Ways to Get Help

- **This Help Center** — search for answers at \`/help.html\`
- **Course-specific issues** — use the feedback button inside the course player
- **Billing questions** — include your account email and the date of the charge
`,
  category: 'account',
  audience: 'user',
  searchTags: ['messages', 'support', 'contact', 'help', 'customer support', 'contact us', 'ticket', 'inbox'],
  icon: 'fa-envelope',
  order: 4,
  featured: false,
  isPublished: true,
  views: 0, helpful: 0, notHelpful: 0,
  createdAt: new Date(), updatedAt: new Date()
},

// ─────────────────────────────────────────────────────────────
// SETTINGS
// ─────────────────────────────────────────────────────────────
{
  title: 'Account Settings: Notifications, Security & Profile',
  slug: 'account-settings-guide',
  summary: 'A guide to every tab in your CounselorReady Settings — notifications, profile, security, account management, and calendar integration.',
  content: `# Account Settings: Notifications, Security & Profile

Access your settings at \`/settings.html\` from the profile menu (gear icon in the top nav). Settings has five tabs.

---

## Notifications Tab

Control how and when CounselorReady contacts you.

- **Email notifications** — always on (required for account security and receipts)
- **SMS notifications** — opt in to text message reminders for renewal deadlines, upcoming live sessions, and course completions. Enter your mobile number to enable.
- **Marketing emails** — opt in/out of newsletters, new course announcements, and promotional content.

Changes save automatically.

---

## Profile Tab

Update your personal and professional information:
- **Name** and **display name**
- **Professional credentials** (e.g., LPC, NCC, LCSW) — shown on your certificates
- **License number and state** — used for board-specific CE tracking
- **Preferred approving body** — used to pre-select the approval body on certificates when you complete courses

---

## Security Tab

- **Change your password** — enter your current password, then your new password (minimum 8 characters)
- **Recovery email** — add a backup email address in case you lose access to your primary email. This is different from your login email.

---

## Account Tab

- **Hardship pause** — if you're experiencing financial hardship, you can request a temporary pause on your subscription. Your account and data are preserved during the pause. See the [Hardship Pause article](/help.html#requesting-hardship-pause) for details.
- **Data export** — request a full export of your account data. You'll receive a download link by email.
- **Delete account** — permanently deletes your account and all data. This cannot be undone. You must type your email address to confirm.

---

## Calendar Tab

Connect your CounselorReady renewal deadlines and live session schedule to your calendar app.

- **Google Calendar** — authorize CounselorReady to add events to your Google Calendar
- **iCal / Outlook** — copy the subscription URL to add your CounselorReady calendar to any calendar app that supports iCal feeds

Events added include: credential renewal deadlines, live session registrations, and CE completion milestones.
`,
  category: 'account',
  audience: 'user',
  searchTags: ['settings', 'notifications', 'SMS', 'email notifications', 'security', 'password', 'recovery email', 'data export', 'delete account', 'calendar', 'profile', 'hardship'],
  icon: 'fa-gear',
  order: 5,
  featured: false,
  isPublished: true,
  views: 0, helpful: 0, notHelpful: 0,
  createdAt: new Date(), updatedAt: new Date()
},

// ─────────────────────────────────────────────────────────────
// ORGANIZATION / MY ORGANIZATION
// ─────────────────────────────────────────────────────────────
{
  title: 'My Organization: Group Practices & Team Management',
  slug: 'my-organization-group-practice',
  summary: 'Create an organization for your group practice, training program, or employer — manage team member seats, assign compliance tracks, and oversee CE completion across your staff.',
  content: `# My Organization: Group Practices & Team Management

The Organization feature lets you manage CE compliance for a team — a group practice, training program, clinical department, or any employer who wants to oversee staff CE.

## Creating an Organization

Go to **My Organization** (\`/organization.html\`) and click **Create Organization**. Enter:
- **Organization name**
- **Organization type** (Group Practice, Training Program, Clinical Department, Other)
- **Contact phone** (optional)

Once created, you become the organization owner and can manage members from the same page.

## Adding Team Members

Invite team members by email. They receive an invitation to join your organization and link their existing CounselorReady account (or create one).

**Member roles:**
- **Owner** — full admin access, billing, and member management
- **Admin** — can manage members and view compliance
- **Member** — their CE data is visible to the organization owner/admin

## Team Compliance

Once your organization has members, go to **Team Compliance** (\`/team-compliance.html\`) to:
- See a compliance matrix of all staff members and their CE status
- Assign training tracks that apply required CE categories to matching members
- Track completion across your team with a dashboard view

## Group Licenses

If your organization is purchasing access for multiple staff members, see **Group Licenses** (\`/group-licenses.html\`) to manage seat-based licensing.

## Who Can See My Team's CE Data?

Organization owners and admins can see member CE completion data. Individual members can only see their own data. Members can leave an organization at any time from their own account settings.
`,
  category: 'account',
  audience: 'both',
  searchTags: ['organization', 'group practice', 'team', 'staff CE', 'team compliance', 'org management', 'employer', 'practice owner', 'CE tracking team'],
  icon: 'fa-building',
  order: 6,
  featured: false,
  isPublished: true,
  views: 0, helpful: 0, notHelpful: 0,
  createdAt: new Date(), updatedAt: new Date()
},

// ─────────────────────────────────────────────────────────────
// TEAM COMPLIANCE
// ─────────────────────────────────────────────────────────────
{
  title: 'Team Compliance & Training Tracks',
  slug: 'team-compliance-training-tracks',
  summary: 'Assign training tracks to your team, monitor CE completion across all staff members, and maintain a compliance matrix your practice can use for audits or accreditation.',
  content: `# Team Compliance & Training Tracks

Team Compliance gives organization owners and admins a real-time view of CE completion across their entire staff.

## Accessing Team Compliance

Go to **Team Compliance** (\`/team-compliance.html\`). You must be an organization owner or admin to access this page. If you see "No practice yet," you need to create an organization first at \`/organization.html\`.

## The Staff Compliance Matrix

The compliance matrix shows every team member with their:
- CE hours completed this renewal cycle
- Required hours by category (ethics, supervision, clinical, etc.)
- Completion percentage toward renewal
- Any overdue requirements

Use the matrix to quickly identify staff who need to complete CE before a deadline.

## Training Tracks

Training tracks are pre-defined CE requirement sets you can assign to staff members. For example:
- **Ethics Track** — requires X ethics CE hours per cycle
- **Telehealth Track** — required CE on telehealth practices
- **New Hire Track** — required onboarding CE for new staff

Assign a track to apply its required trainings to matching members. Recurring items auto-renew on completion so the track stays active across renewal cycles.

## Using Compliance Data for Audits or Accreditation

The compliance matrix can be used to demonstrate staff CE completion for practice accreditation, insurance credentialing, or internal HR audits. Data reflects CE completed through CounselorReady and uploaded certificates — make sure staff are logging all CE through their accounts for a complete picture.

## Partner Organizations

If your organization is using the CounselorReady Partner program, your learner compliance data is also visible in the Partner Dashboard under Reports.
`,
  category: 'admin',
  audience: 'both',
  searchTags: ['team compliance', 'training tracks', 'staff CE', 'compliance matrix', 'practice compliance', 'group CE', 'admin', 'organization compliance'],
  icon: 'fa-clipboard-check',
  order: 1,
  featured: false,
  isPublished: true,
  views: 0, helpful: 0, notHelpful: 0,
  createdAt: new Date(), updatedAt: new Date()
},

// ─────────────────────────────────────────────────────────────
// GROUP LICENSES
// ─────────────────────────────────────────────────────────────
{
  title: 'Group Licenses: Team Seat Management',
  slug: 'group-licenses-team-seats',
  summary: 'Purchase and manage seat-based licenses for your organization — assign seats to team members and manage access from one place.',
  content: `# Group Licenses: Team Seat Management

Group Licenses let organizations purchase CE platform access for their staff in bulk — rather than each person subscribing individually.

## How Group Licenses Work

An organization owner purchases a block of seats. Each seat gives one team member full CounselorReady access (courses, certificate tracking, credential management) at a group rate.

## Accessing Group Licenses

Go to **Group Licenses** (\`/group-licenses.html\`). You must be an organization owner or admin.

## Purchasing Seats

From the Group Licenses page:
1. Choose the number of seats you need
2. Complete payment via the billing flow
3. Seats are available immediately

## Assigning Seats to Team Members

Once seats are purchased, assign them to team members by email address. Assigned members receive an invitation to create or link their CounselorReady account.

## Managing Assignments

You can reassign a seat from one team member to another (e.g., when someone leaves the practice) from the Group Licenses management page. The previous member's account returns to the Free plan; the seat is available to reassign.

## Pricing

Group license pricing is available on the Group Licenses page. Volume discounts apply for larger seat counts. For organizations needing 25+ seats or a custom arrangement, contact us through Messages.
`,
  category: 'subscriptions',
  audience: 'both',
  searchTags: ['group licenses', 'team seats', 'bulk licenses', 'organization license', 'seat management', 'staff access', 'group pricing', 'employer CE'],
  icon: 'fa-users',
  order: 3,
  featured: false,
  isPublished: true,
  views: 0, helpful: 0, notHelpful: 0,
  createdAt: new Date(), updatedAt: new Date()
},

// ─────────────────────────────────────────────────────────────
// RESEARCHED-N-READY
// ─────────────────────────────────────────────────────────────
{
  title: 'Researched-N-Ready: CE-Eligible Scholarly Articles',
  slug: 'researched-n-ready-scholarly-articles',
  summary: 'Researched-N-Ready delivers curated, peer-reviewed articles with a built-in CE posttest — read the article, pass the quiz, earn CE credit.',
  content: `# Researched-N-Ready: CE-Eligible Scholarly Articles

**Researched-N-Ready** is CounselorReady's scholarly article CE format. Each entry pairs a curated, clinically relevant article with a knowledge check — read the article, pass the posttest, earn CE credit.

## How It Works

1. Go to **Researched-N-Ready** (\`/research-ready.html\`) from the nav.
2. Browse articles by topic, CE hours, or specialty area.
3. Click an article to read it.
4. When you're ready, take the **posttest** — a short knowledge check tied to the article content.
5. Pass the posttest to receive your CE credit and certificate.

## What Articles Are Available?

Researched-N-Ready features peer-reviewed and clinically relevant articles across counseling specialties — trauma, ethics, multicultural practice, telehealth, supervision, neuroscience, and more. New articles are added regularly.

## CE Credit and Certificates

CE hours are awarded on successful posttest completion. Certificates are issued automatically to your account. Articles are NBCC-approved for CE credit (GAITP LLC, ACEP #7760).

## Filtering by Hours

Use the hour filter to find articles matching specific CE needs — 1-hour, 2-hour, and 3-hour articles are available. Useful when you need a specific number of hours to complete your renewal cycle.

## Researched-N-Ready vs. Standard Courses

Standard CounselorReady courses are longer interactive experiences with videos, activities, knowledge checks, and a final assessment. Researched-N-Ready articles are shorter reading-based CE — faster to complete, focused on a single topic or research finding.
`,
  category: 'courses',
  audience: 'user',
  searchTags: ['researched-n-ready', 'scholarly articles', 'CE articles', 'reading CE', 'posttest', 'peer-reviewed', 'journal articles', 'article CE', 'quick CE'],
  icon: 'fa-book-open',
  order: 6,
  featured: false,
  isPublished: true,
  views: 0, helpful: 0, notHelpful: 0,
  createdAt: new Date(), updatedAt: new Date()
}

];

// Upsert all articles
let count = 0;
for (const article of articles) {
  await db.collection('helparticles').deleteOne({ slug: article.slug });
  const result = await db.collection('helparticles').insertOne(article);
  console.log(`✓ [${++count}/${articles.length}] "${article.title}" (${article.slug})`);
}

console.log(`\nDone. ${count} articles inserted.`);
console.log('Visit https://counselorready.com/help.html to verify.');
await mongoose.disconnect();
