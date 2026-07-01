// Seed script: Partner Program help article
// Run from ~/project/src/server:
//   node --input-type=module < seed-partner-help-article.js

import mongoose from 'mongoose';

await mongoose.connect(process.env.MONGODB_URI);
const db = mongoose.connection.db;

const slug = 'partner-program-overview';

// Remove any existing version first
await db.collection('helparticles').deleteOne({ slug });

const article = {
  title: 'Partner Program: Benefits, Features & Pricing',
  slug,
  summary: 'Launch your own branded CE academy on CounselorReady — white-label platform, direct Stripe payouts, and full course authoring tools. Here\'s everything you need to know.',
  content: `# Partner Program: Benefits, Features & Pricing

CounselorReady's Partner Program lets CE providers, counselor educators, supervisors, and mental health organizations launch their own branded continuing-education academy — built on CounselorReady's platform infrastructure.

---

## Who Is It For?

The partner program is designed for:

- **CE providers** who create and sell continuing education content for licensed counselors
- **LPC supervisors and training programs** who want to offer structured CE to their supervisees or cohorts
- **Mental health organizations and group practices** who want to offer branded CE as a member or staff benefit
- **Counselor educators and university programs** looking to extend their reach with online CE delivery

---

## What You Get

### Your Own Branded Academy
Your partners portal runs under your brand — your logo, your colors, your company name on every certificate. You can optionally configure a custom domain (e.g. \`learn.yourorganization.com\`) on Growth and higher plans.

### Full Course Authoring Tools
Build interactive courses with the CounselorReady CourseBuilder: text blocks, knowledge checks, scenario trees, flashcards, matching activities, and more. Set your own pricing, CE hours, and learning objectives per course.

### Certificate Generation
Learners receive certificates automatically on course completion. Certificates carry **your organization's name, logo, and approving body information** — not CounselorReady's. You add your own accrediting body (APA, ASWB, NAADAC, a state board, or your own ACEP number) to each course.

> **Important:** Partner certificates do not automatically carry NBCC ACEP #7760 accreditation. CounselorReady's NBCC ACEP accreditation (GAITP LLC, ACEP #7760) is available on a case-by-case basis for courses you submit for our formal review process. Most partners issue credits under their own approving body.

### Direct Stripe Payouts
Connect your own Stripe account via Stripe Express. When a learner buys your course, Stripe splits the payment automatically at checkout — your share (85%) goes directly to your bank account, and CounselorReady retains a 15% platform fee. You never wait for a payout cycle; money moves at the time of purchase.

### Marketplace Distribution
List your courses on the CounselorReady marketplace and reach our growing audience of licensed counselors, LPCs, LMHCs, LCSWs, and NCCs who are already looking for CE. You earn 85% of every sale regardless of whether the learner found you through the marketplace or your own link.

### Learner Management
Invite your own team members, staff, or learner cohorts. Manage enrollments, track completions, and view earnings reports from your partner dashboard.

### Premium Add-Ons
Enhance your partner portal with optional monthly add-ons:
- **Certificate Tracking** ($25/mo) — expanded certificate management and tracking tools
- **Credential Management** ($20/mo) — credential tracking features for your learners
- **Compliance Tracking** ($25/mo) — compliance reporting and audit tools
- **Clinical Tools** ($30/mo) — access to clinical productivity tools for your team
- **Full Bundle** ($100/mo) — all four add-ons at a discount

---

## Pricing

All plans include a **14-day free trial** with no credit card required to start. Plans are billed monthly.

| Plan | Monthly Price | Courses | Users | Custom Domain | Bulk Upload |
|------|--------------|---------|-------|--------------|------------|
| **Starter** | $99/mo *(intro: $49/mo for 2 months)* | Up to 10 | Up to 100 | — | — |
| **Growth** | $199/mo *(intro: $99/mo for 2 months)* | Up to 50 | Up to 500 | — | ✓ |
| **Professional** | $399/mo | Up to 200 | Up to 5,000 | ✓ | ✓ |
| **Enterprise** | $799/mo | Unlimited | Unlimited | ✓ | ✓ |

**15% platform fee** applies to all course sales across all plans. Stripe processing fees are charged to your connected account (not deducted from your platform fee).

---

## How to Get Started

1. Go to [counselorready.com/become-a-partner](https://counselorready.com/become-a-partner)
2. Create your partner account (company name, subdomain, your info)
3. Your 14-day free trial begins immediately — no card required
4. Customize your branding, build your first course, and set up Stripe payouts from your partner dashboard
5. Choose a paid plan from the billing page before your trial ends

---

## Frequently Asked Questions

**Do I need my own NBCC accreditation?**
No. You can issue CE credits under any approving body appropriate to your courses — APA, ASWB, NAADAC, a state licensing board, or your own ACEP number if you have one. CounselorReady's NBCC ACEP accreditation is available case-by-case for courses submitted for our formal review, but it is not a requirement.

**What is the 15% platform fee?**
CounselorReady retains 15% of every course sale as a platform fee. Your 85% is transferred directly to your Stripe account at the time of purchase — you never float the funds.

**Can I sell my courses outside CounselorReady?**
Yes. You can share direct links to your courses anywhere. The marketplace listing is optional and in addition to direct sales.

**What happens after my trial ends?**
You'll need to select a paid plan to continue. Your courses, learners, and data are preserved. If you don't select a plan, your portal will be paused until you do.

**Can I offer courses for free to my staff or members?**
Yes. You can set any course's price to $0, which allows direct enrollment at no charge. No Stripe transaction occurs on free courses.

---

*Questions about the partner program? Contact us through the [Help Center](https://counselorready.com/help.html) or email your question through the contact form.*
`,
  category: 'integrations',
  audience: 'both',
  searchTags: [
    'partner', 'partner program', 'become a partner', 'CE provider',
    'white label', 'branded academy', 'course authoring', 'payouts',
    'stripe connect', 'marketplace', 'pricing', 'plans', 'educator',
    'supervisor', 'organization', 'ACEP', 'accreditation', '15% fee'
  ],
  icon: 'fa-handshake',
  order: 1,
  featured: true,
  isPublished: true,
  views: 0,
  helpful: 0,
  notHelpful: 0,
  createdAt: new Date(),
  updatedAt: new Date()
};

const result = await db.collection('helparticles').insertOne(article);
console.log('Inserted:', result.insertedId, '— slug:', slug);
await mongoose.disconnect();
