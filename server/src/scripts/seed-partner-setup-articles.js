// Seed script: Partner onboarding + setup instructions help articles
// Run from ~/project/src/server:
//   node --input-type=module < seed-partner-setup-articles.js

import mongoose from 'mongoose';

await mongoose.connect(process.env.MONGODB_URI);
const db = mongoose.connection.db;

const articles = [
  // ─────────────────────────────────────────────────────────────
  // ARTICLE 1: Getting Started — Partner Onboarding Walkthrough
  // ─────────────────────────────────────────────────────────────
  {
    title: 'Partner Onboarding: Your First Steps',
    slug: 'partner-onboarding-walkthrough',
    summary: 'A step-by-step walkthrough of setting up your CounselorReady partner academy — from account creation to your first live course.',
    content: `# Partner Onboarding: Your First Steps

Welcome to CounselorReady Partners. This article walks you through every step of getting your branded CE academy live — from creating your account to publishing your first course and collecting revenue.

Your partner dashboard includes an **Onboarding Checklist** at \`/partner/onboarding\` that tracks your progress through each step. You can return to it any time.

---

## Step 1 — Create Your Account

Go to [counselorready.com/become-a-partner](https://counselorready.com/become-a-partner) and fill out the signup form:

- **Company name** — the name of your organization (appears on your portal and certificates)
- **Subdomain** — your branded address on CounselorReady, e.g. \`yourorg.counselorready.com\`. Use lowercase letters, numbers, and hyphens only. You can add a custom domain later.
- **Your name and email** — this becomes your partner admin account
- **Password** — minimum 8 characters

Your 14-day free trial starts immediately. No credit card is required to create an account.

---

## Step 2 — Customize Your Branding

Go to **Partner Dashboard → Branding** (or \`/partner/branding\`).

Set up your organization's visual identity:

- **Company name** — shown on your portal, in learner emails, and on certificates
- **Logo** — upload your logo (PNG or JPG). It appears in the header of your learner portal and as a letterhead mark on certificates.
- **Primary color** — the main brand color used for buttons and headings (hex code, e.g. \`#1E5F74\`)
- **Accent color** — used for badges and highlights
- **Tagline** — optional short phrase shown under your company name
- **Certificate footer** — optional text printed at the bottom of your certificates, such as your address, contact info, or a board-approval statement. Keep to 1–2 lines.
- **Custom domain** — optional (Growth plan and above). Enter your domain here to start the verification process.

Click **Save** when done. Your branding is applied immediately across your portal and new certificates.

---

## Step 3 — Add Your First Course

Go to **Partner Dashboard → Courses** (or \`/partner/courses\`).

Click **New Course** to open the CourseBuilder. Your course has several key fields:

- **Title** — the course name learners see
- **Description** — a summary of the course content and who it's for
- **CE Hours** — the number of continuing education hours the course awards
- **Price** — set to \`0\` for free, or enter a dollar amount for paid courses
- **Learning Objectives** — list what learners will be able to do after completing the course (required for most approving bodies)
- **Approving Body** — add the accrediting body and your provider number under the **Approvals** tab. This appears on learner certificates. You can add multiple bodies if your course is approved by more than one.
- **Course Content** — build your course using the content blocks: text, knowledge checks, scenario trees, flashcards, matching activities, accordion panels, and reflection prompts.

When your course is ready, set its status to **Published**. Learners can enroll immediately.

> **Tip:** Draft courses are visible only to you and your team. Published courses are visible to learners and (if enabled) listed in the marketplace.

---

## Step 4 — Invite Team Members or Learners

Go to **Partner Dashboard → Users** (or \`/partner/users\`).

Enter one or more email addresses to send invitations. Invited users receive an email with a link to create their account and access your portal. You can invite:

- **Staff or co-instructors** who help manage courses
- **Learners or cohort members** who will enroll in your courses

Invitations use your customized email template (see Setup Instructions for how to edit the invitation email).

---

## Step 5 — Set Up Billing

Go to **Partner Dashboard → Billing** (or \`/partner/billing\`).

Select a plan before your 14-day trial ends. Plans are billed monthly:

| Plan | Price | Courses | Users |
|------|-------|---------|-------|
| Starter | $99/mo | 10 | 100 |
| Growth | $199/mo | 50 | 500 |
| Professional | $399/mo | 200 | 5,000 |
| Enterprise | $799/mo | Unlimited | Unlimited |

Starter and Growth plans include a 2-month introductory rate ($49/mo and $99/mo respectively) for new partners.

---

## Step 6 — Set Up Payouts (for paid courses)

Go to **Partner Dashboard → Payouts** (or \`/partner/connect\`).

If you sell paid courses, connect your Stripe account so revenue flows directly to your bank. Click **Connect with Stripe** — you'll be taken to Stripe's hosted onboarding flow where you'll enter your business and bank information directly with Stripe. CounselorReady never sees your banking details.

Once connected, Stripe splits every course sale automatically at checkout: **85% to your account, 15% platform fee to CounselorReady**. Stripe generates your 1099-K at year-end if you meet the threshold — no action needed on your part.

---

## You're Live

Once you've completed billing and published at least one course, your academy is fully operational. Share your portal link (\`yourorg.counselorready.com\`) or individual course links with your audience.

Your **Onboarding Checklist** at \`/partner/onboarding\` shows a green checkmark for each completed step. The optional steps (custom domain, payouts) don't block your progress percentage.
`,
    category: 'integrations',
    audience: 'both',
    searchTags: [
      'partner', 'onboarding', 'getting started', 'partner setup',
      'first steps', 'create account', 'partner signup', 'new partner',
      'partner academy', 'launch', 'walkthrough'
    ],
    icon: 'fa-rocket',
    order: 2,
    featured: true,
    isPublished: true,
    views: 0,
    helpful: 0,
    notHelpful: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // ─────────────────────────────────────────────────────────────
  // ARTICLE 2: Partner Setup Instructions (detailed reference)
  // ─────────────────────────────────────────────────────────────
  {
    title: 'Partner Portal Setup: Detailed Instructions',
    slug: 'partner-portal-setup-instructions',
    summary: 'Detailed setup instructions for every section of the partner portal — branding, courses, email templates, custom domain, payouts, and more.',
    content: `# Partner Portal Setup: Detailed Instructions

This article is a detailed reference for each section of your partner portal. For a quick first-steps walkthrough, see [Partner Onboarding: Your First Steps](/help.html#partner-onboarding-walkthrough).

---

## Branding (\`/partner/branding\`)

Your branding settings control how your academy looks to learners and how your certificates are presented.

### Logo
Upload a PNG or JPG logo. It appears as a letterhead mark at the top of every certificate your learners receive, and in the header of your portal. Recommended size: at least 320×120px, transparent background preferred.

### Colors
- **Primary color** — main brand color (buttons, headings, certificate accent). Enter as a hex code (e.g. \`#1E5F74\`).
- **Accent color** — secondary brand color (badges, highlights). Defaults to gold (\`#D4A855\`) if not set.

### Certificate Footer
A short text block (1–2 lines) printed at the bottom of every certificate. Use it for your organization's address, contact email, or a board-disclosure statement such as: *"This certificate is issued under [Organization]'s own provider approval. Retain for your licensing board records."*

### Custom Domain
Available on Growth plan and above. Enter your desired domain (e.g. \`learn.yourorg.com\`) here, then follow the verification steps at \`/partner/domain\`.

---

## Custom Domain Verification (\`/partner/domain\`)

Three steps:

1. **Set your domain** — enter it in the Branding settings first (\`/partner/branding\`). The domain field here pre-fills once it's saved.
2. **Get your TXT record** — click *Start Verification*. You'll receive a DNS record (type TXT, name \`_cr-verify.yourdomain.com\`, value \`cr-verify=...\`). Add this record in your DNS provider (Cloudflare, GoDaddy, Route 53, etc.).
3. **Check verification** — DNS propagation takes up to 48 hours. Click *Check Verification* to confirm. Once verified, your portal is accessible at your custom domain.

---

## Courses (\`/partner/courses\`)

### Creating a Course
Click **New Course** to open the CourseBuilder. Key fields:

- **Title** — required
- **Description** — displayed on the course listing and certificate
- **CE Hours** — the number of credits the course awards. Must match your approving body's records.
- **Price** — \`0\` for free enrollment; any positive number creates a paid course (requires Stripe Connect)
- **Learning Objectives** — bullet points describing what learners will be able to do. Required by most approving bodies.
- **Approvals** — add each body that has approved this course: select the body (APA, ASWB, NAADAC, State Board, Other, etc.), enter your provider number and provider name, select the delivery format, and add the hour breakdown (e.g. 2 core hours + 1 ethics hour). You can add multiple approval rows for courses with multiple approvals.

### Course Status
- **Draft** — only visible to partner admins. Use this while building.
- **Published** — visible to learners; can be enrolled in.

### Bulk Upload (\`/partner/bulk-upload\`) — Growth plan and above
Paste a JSON array of course objects to create multiple courses at once (up to 50 per upload). Each object requires \`title\`, \`description\`, and \`ceHours\` at minimum.

---

## Email Templates (\`/partner/email-templates\`)

Customize the automated emails your learners receive.

### Welcome Email
Sent when a new user is added to your portal. Fields:
- **Subject** — email subject line (max 200 characters)
- **Heading** — large text inside the email (max 200 characters)
- **Body** — main message (max 1,000 characters). Use \`{{firstName}}\` to personalize with the learner's first name.
- **Button text** — the CTA button label (max 50 characters)
- **Footer text** — small text at the bottom of the email (max 500 characters)

### Invitation Email
Sent when you invite a user via \`/partner/users\`. Same fields as above. Use \`{{inviterName}}\` to insert your name as the inviting admin.

Click **Save Templates** after editing. Changes apply to all future emails immediately.

---

## Users (\`/partner/users\`)

### Inviting Users
Enter email addresses (one or more at a time) to send invitation emails. Invited users create their own password on first login.

### User Roles
- **Partner Admin** — full access to the partner dashboard, course authoring, and settings
- **Learner** — access to courses and their own certificates only

---

## Payouts (\`/partner/connect\`)

### Connecting Stripe
Click **Connect with Stripe** to start Stripe Express onboarding. You'll enter your business information, bank account details, and tax information directly with Stripe — CounselorReady never stores this data.

Once connected, all paid course sales split automatically at checkout: 85% to your Stripe account, 15% to CounselorReady. No manual settlement required.

### Stripe Fees
Stripe's standard processing fee (2.9% + 30¢ per transaction) is charged to your connected account and comes out of your 85% share.

### 1099-K Tax Forms
Stripe generates and delivers 1099-K forms directly to your registered email when you meet the annual threshold. No action required from you.

---

## Earnings (\`/partner/earnings\`)

View your pending and paid earnings from course sales. The earnings ledger shows each sale, the gross amount, your 85% share, and the platform fee. Payouts happen automatically via your Stripe connection — the ledger is for your records.

---

## Reports (\`/partner/reports\`)

View learner completion rates, course enrollment numbers, and revenue by course. Use this to identify your highest-performing content and track growth over time.

---

## Marketplace (\`/partner/marketplace\`)

Opt individual courses into the CounselorReady marketplace to reach licensed counselors who are already browsing for CE. Marketplace listing is per-course — you control which courses appear and can remove them at any time.

Revenue from marketplace sales follows the same 85/15 split as direct sales.

---

## Premium Add-Ons (\`/partner/billing#addons\`)

Optional monthly add-ons that extend your portal's capabilities:

| Add-On | Price |
|--------|-------|
| Certificate Tracking | $25/mo |
| Credential Management | $20/mo |
| Compliance Tracking | $25/mo |
| Clinical Tools | $30/mo |
| Full Bundle (all four) | $100/mo |

Add-ons are billed monthly on top of your base plan. Cancel or add at any time from your billing page.
`,
    category: 'integrations',
    audience: 'both',
    searchTags: [
      'partner setup', 'partner instructions', 'branding', 'custom domain',
      'DNS verification', 'email templates', 'course builder', 'payouts',
      'Stripe Connect', 'earnings', 'marketplace', 'bulk upload',
      'invite users', 'partner billing', 'add-ons', 'certificate footer'
    ],
    icon: 'fa-gear',
    order: 3,
    featured: false,
    isPublished: true,
    views: 0,
    helpful: 0,
    notHelpful: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Upsert both articles
for (const article of articles) {
  await db.collection('helparticles').deleteOne({ slug: article.slug });
  const result = await db.collection('helparticles').insertOne(article);
  console.log(`✓ Inserted: "${article.title}" — slug: ${article.slug} (${result.insertedId})`);
}

console.log('\nDone. Visit https://counselorready.com/help.html to verify.');
await mongoose.disconnect();
