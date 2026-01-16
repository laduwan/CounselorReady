# CounselorReady Backend Setup & Deployment Guide

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Environment Variables](#environment-variables)
3. [Local Development Setup](#local-development-setup)
4. [Database Setup](#database-setup)
5. [Deployment to Render](#deployment-to-render)
6. [API Endpoints Reference](#api-endpoints-reference)
7. [Cron Jobs & Automation](#cron-jobs--automation)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

- **Node.js** v18+ (recommended: v20 LTS)
- **MongoDB Atlas** account (free tier works)
- **Cloudinary** account (for certificate/file storage)
- **Resend** account (for transactional emails)
- **Stripe** account (for payments)
- **GitHub** account (for deployment)

---

## Environment Variables

Create a `.env` file in `/server` directory with these variables:

```env
# ===========================================
# REQUIRED - App will not start without these
# ===========================================

# MongoDB Connection String
# Get from: MongoDB Atlas → Database → Connect → Drivers
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/counselorready?retryWrites=true&w=majority

# JWT Secret (generate a random 64+ character string)
# Generate with: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random

# Server Port (Render sets this automatically)
PORT=5000

# Frontend URL (no trailing slash)
CLIENT_URL=https://counselorready.com

# ===========================================
# CLOUDINARY - File/Certificate Storage
# ===========================================
# Get from: Cloudinary Dashboard → Settings → Access Keys

CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=your-api-secret-here

# ===========================================
# RESEND - Email Service
# ===========================================
# Get from: Resend Dashboard → API Keys

RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxx

# ===========================================
# STRIPE - Payments
# ===========================================
# Get from: Stripe Dashboard → Developers → API Keys
# Use TEST keys for development, LIVE keys for production

STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxxxxx

# Stripe Price IDs (create these in Stripe Dashboard → Products)
STRIPE_PRICE_STARTER=price_xxxxxxxxxxxxxxxx
STRIPE_PRICE_PROFESSIONAL=price_xxxxxxxxxxxxxxxx
STRIPE_PRICE_VIP=price_xxxxxxxxxxxxxxxx

# ===========================================
# OPTIONAL - Enhanced Features
# ===========================================

# OpenAI - For certificate scanning/AI features
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxx

# CE Broker Integration (if using)
CEBROKER_API_KEY=your-cebroker-api-key
CEBROKER_PROVIDER_ID=your-provider-id

# LTI Integration (for external LMS connections)
LTI_KEY=your-lti-consumer-key
LTI_SECRET=your-lti-shared-secret

# Node Environment
NODE_ENV=production
```

### Getting Each Credential:

#### MongoDB Atlas
1. Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create free cluster (M0 tier)
3. Database Access → Add user with read/write permissions
4. Network Access → Add IP `0.0.0.0/0` (allows all - required for Render)
5. Database → Connect → Drivers → Copy connection string
6. Replace `<password>` with your database user password

#### Cloudinary
1. Go to [cloudinary.com](https://cloudinary.com) → Sign up
2. Dashboard shows Cloud Name, API Key, API Secret
3. Settings → Upload → Upload presets → Enable unsigned uploads (optional)

#### Resend
1. Go to [resend.com](https://resend.com) → Sign up
2. API Keys → Create API Key
3. Domains → Add & verify your domain for production emails

#### Stripe
1. Go to [stripe.com](https://stripe.com) → Dashboard
2. Developers → API Keys → Copy Secret Key
3. Products → Create products for each tier:
   - **Starter** - $19.99/month
   - **Professional** - $29.99/month  
   - **VIP** - $49.99/month
4. Copy each Price ID to env vars
5. Webhooks → Add endpoint → URL: `https://your-api.com/api/payments/webhook`
6. Select events: `customer.subscription.*`, `invoice.*`, `payment_intent.*`

---

## Local Development Setup

### 1. Clone & Install

```bash
# Clone repository
git clone https://github.com/yourusername/CounselorReady.git
cd CounselorReady/server

# Install dependencies
npm install
```

### 2. Create Environment File

```bash
# Copy example env (or create from scratch)
cp .env.example .env

# Edit with your values
nano .env
```

### 3. Start Development Server

```bash
# Development mode with hot reload
npm run dev

# OR production mode
npm start
```

### 4. Verify Server is Running

```bash
# Should return: {"status":"ok","timestamp":"..."}
curl http://localhost:5000/health
```

---

## Database Setup

### Initial Schema Creation

MongoDB creates collections automatically on first write. No migration needed.

### Seed Initial Data

```bash
# From /server directory
node seedCourses.js
```

This creates:
- Sample courses with modules/lessons
- Admin user (if not exists)
- Credential templates for all 50 states

### Create Admin User

```javascript
// Run in MongoDB shell or create a script
db.users.updateOne(
  { email: "admin@counselorready.com" },
  { 
    $set: { 
      role: "admin",
      "subscription.plan": "vip",
      "subscription.status": "active"
    }
  }
)
```

Or use the API:
```bash
# Register normally, then update in database
curl -X POST https://api.counselorready.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@counselorready.com","password":"SecurePass123!","name":"Admin User"}'
```

---

## Deployment to Render

### 1. Push to GitHub

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. Create Render Web Service

1. Go to [render.com](https://render.com) → Dashboard
2. New → Web Service
3. Connect your GitHub repository
4. Configure:

| Setting | Value |
|---------|-------|
| Name | `counselorready-api` |
| Region | Oregon (US West) or closest to users |
| Branch | `main` |
| Root Directory | `server` |
| Runtime | Node |
| Build Command | `npm install` |
| Start Command | `npm start` |
| Instance Type | Starter ($7/mo) or higher |

### 3. Add Environment Variables

In Render dashboard → Environment:
- Add ALL variables from your `.env` file
- Render auto-sets `PORT`

### 4. Deploy

Click "Create Web Service" - Render will:
1. Clone your repo
2. Run `npm install`
3. Start with `npm start`
4. Provide URL like `https://counselorready-api.onrender.com`

### 5. Update Frontend

Update `API_URL` in all frontend HTML files:
```javascript
const API_URL = 'https://counselorready-api.onrender.com';
```

### 6. Configure Custom Domain (Optional)

1. Render → Settings → Custom Domains
2. Add `api.counselorready.com`
3. Add CNAME record in your DNS:
   - Name: `api`
   - Value: `counselorready-api.onrender.com`

---

## API Endpoints Reference

### Authentication
```
POST   /api/auth/register          - Create account
POST   /api/auth/login             - Login
POST   /api/auth/forgot-password   - Request reset email
POST   /api/auth/reset-password    - Reset with token
GET    /api/auth/me                - Get current user (protected)
```

### Users
```
GET    /api/users/profile          - Get profile
PUT    /api/users/profile          - Update profile
GET    /api/users/hardship-status  - Get VIP hardship pause status
POST   /api/users/hardship-pause   - Activate hardship pause
POST   /api/users/end-hardship-pause - End pause early
```

### Courses
```
GET    /api/courses                - List all courses
GET    /api/courses/:id            - Get course details
POST   /api/courses/:id/enroll     - Enroll in course
GET    /api/courses/:id/progress   - Get user progress
POST   /api/courses/:id/lessons/:lessonId/complete  - Mark lesson complete
POST   /api/courses/:id/lessons/:lessonId/quiz      - Submit quiz
POST   /api/courses/:id/evaluation - Submit course evaluation
POST   /api/courses/:id/attestation - Submit attestation
POST   /api/courses/:id/time-tracking - Track time spent
```

### Certificates
```
GET    /api/certificates           - List user certificates
POST   /api/certificates           - Upload certificate
POST   /api/certificates/generate/:courseId - Generate course certificate
GET    /api/certificates/download/:id - Download certificate PDF
GET    /api/certificates/verify/:code - PUBLIC: Verify certificate
GET    /api/certificates/transcript - Download CE transcript PDF
GET    /api/certificates/transcript/json - Get transcript data
DELETE /api/certificates/:id       - Delete certificate
```

### Credentials
```
GET    /api/credentials            - List user credentials
POST   /api/credentials            - Add credential
PUT    /api/credentials/:id        - Update credential
DELETE /api/credentials/:id        - Delete credential
GET    /api/credentials/templates  - Get state templates
```

### Payments
```
POST   /api/payments/create-checkout - Create Stripe checkout session
POST   /api/payments/webhook       - Stripe webhook handler
POST   /api/payments/portal        - Create billing portal session
GET    /api/payments/subscription  - Get subscription status
```

### Analytics
```
POST   /api/analytics/course/:id/view  - Track course view
POST   /api/analytics/course/:id/rate  - Rate completed course
GET    /api/analytics/survey/check     - Check if survey needed
POST   /api/analytics/survey/nps       - Submit NPS survey
POST   /api/analytics/survey/satisfaction - Submit satisfaction survey
GET    /api/analytics/admin/overview   - Admin: Platform overview
GET    /api/analytics/admin/feedback   - Admin: All feedback
GET    /api/analytics/admin/export     - Admin: Export CSV
```

### Migration (Admin Only)
```
GET    /api/migration/export       - Export all courses JSON
GET    /api/migration/export/:id   - Export single course
GET    /api/migration/template     - Download CSV template
POST   /api/migration/import/json  - Import from JSON
POST   /api/migration/import/csv   - Import from CSV
POST   /api/migration/import/talentlms - Import from TalentLMS
POST   /api/migration/talentlms/preview - Preview TalentLMS courses
POST   /api/migration/duplicate/:id - Duplicate a course
```

### Admin
```
GET    /api/admin/users            - List all users
GET    /api/admin/courses          - List all courses (admin view)
POST   /api/admin/courses          - Create course
PUT    /api/admin/courses/:id      - Update course
DELETE /api/admin/courses/:id      - Delete course
GET    /api/admin/hardship-metrics - Hardship pause stats
GET    /api/admin/hardship-export  - Export hardship data CSV
```

### Reminders
```
GET    /api/reminders              - Get user reminders
POST   /api/reminders              - Create reminder
PUT    /api/reminders/:id          - Update reminder
DELETE /api/reminders/:id          - Delete reminder
```

### Integrations
```
POST   /api/scorm/upload           - Upload SCORM package
GET    /api/scorm/:id/launch       - Launch SCORM content
POST   /api/lti/launch             - LTI launch endpoint
POST   /api/xapi/statements        - xAPI statement receiver
POST   /api/cebroker/report        - Report to CE Broker
```

---

## Cron Jobs & Automation

The server runs these automated jobs (configured in `/server/src/index.js`):

| Schedule | Job | Description |
|----------|-----|-------------|
| Daily 8:00 AM EST | Credential Reminders | Sends email reminders for expiring credentials |
| Daily 9:00 AM EST | Grace Period Check | Checks failed payments, sends warnings |
| Daily 9:30 AM EST | Hardship Pause Check | Ends expiring pauses, sends notifications |
| Jan 1, 12:00 AM EST | Annual Rollover | Rolls over unused VIP hardship months |

### Manual Trigger (Development)

```javascript
// In Node REPL or script
import { checkAndSendReminders } from './services/reminderService.js';
await checkAndSendReminders();
```

---

## Troubleshooting

### Common Issues

#### "MongoDB connection failed"
```
Error: MongoServerError: bad auth
```
**Fix:** Check MONGODB_URI password is URL-encoded. Special characters like `@` must be `%40`.

#### "JWT malformed"
```
Error: JsonWebTokenError: jwt malformed
```
**Fix:** Ensure JWT_SECRET is set and matches between server restarts.

#### "Cloudinary upload failed"
```
Error: Invalid cloud_name
```
**Fix:** Verify CLOUDINARY_CLOUD_NAME exactly matches your dashboard (case-sensitive).

#### "Email not sending"
```
Error: Resend API error
```
**Fix:** 
1. Verify RESEND_API_KEY is correct
2. Check domain is verified in Resend dashboard
3. For testing, use Resend's test domain

#### "Stripe webhook signature failed"
```
Error: Webhook signature verification failed
```
**Fix:**
1. Get webhook secret from Stripe Dashboard → Webhooks → Your endpoint → Signing secret
2. Update STRIPE_WEBHOOK_SECRET
3. Ensure raw body parser for webhook route

#### Server won't start on Render
**Check:**
1. Build logs for npm install errors
2. Environment variables are set
3. Start command is `npm start` not `npm run dev`
4. Root directory is `server`

### Health Check

```bash
# Check if server is responding
curl https://your-api-url.com/health

# Expected response:
{
  "status": "ok",
  "timestamp": "2025-01-12T...",
  "mongodb": "connected"
}
```

### Logs

**Render:** Dashboard → Logs (real-time)

**Local:** Check terminal output or:
```bash
npm start 2>&1 | tee server.log
```

### Database Inspection

```bash
# Connect to MongoDB shell
mongosh "mongodb+srv://cluster.mongodb.net/counselorready"

# Useful commands
show collections
db.users.countDocuments()
db.courses.find().limit(1).pretty()
db.certificates.find({ userId: ObjectId("...") })
```

---

## File Structure

```
server/
├── src/
│   ├── index.js           # Entry point, Express app, cron jobs
│   ├── middleware/
│   │   └── auth.js        # JWT authentication middleware
│   ├── models/
│   │   ├── User.js        # User schema + hardship pause logic
│   │   ├── Course.js      # Course schema + quiz questions
│   │   ├── Certificate.js # Certificate + verification code
│   │   ├── UserCredential.js
│   │   ├── UserCourseProgress.js
│   │   ├── PlatformSurvey.js
│   │   └── ...
│   ├── routes/
│   │   ├── auth.js        # Authentication routes
│   │   ├── users.js       # User profile routes
│   │   ├── courses.js     # Course + enrollment routes
│   │   ├── certificates.js # Certificate + verification
│   │   ├── credentials.js # Credential tracking
│   │   ├── payments.js    # Stripe integration
│   │   ├── analytics.js   # Surveys + analytics
│   │   ├── migration.js   # Import/export courses
│   │   ├── admin.js       # Admin-only routes
│   │   └── ...
│   ├── services/
│   │   ├── courseEmailService.js   # Completion emails
│   │   ├── hardshipEmailService.js # Hardship pause emails
│   │   └── reminderService.js      # Credential reminders
│   ├── utils/
│   │   ├── certificate.js # PDF generation
│   │   └── ...
│   ├── templates/
│   │   ├── logo.jpg
│   │   └── signature.png
│   └── data/
│       ├── allStates.js   # State CE requirements
│       └── seed.js        # Seed data
├── package.json
└── .env                   # Environment variables (not in git!)
```

---

## Support

For issues:
1. Check this guide's troubleshooting section
2. Review Render logs for errors
3. Test endpoints with curl/Postman
4. Check MongoDB Atlas metrics for connection issues

---

*Last updated: January 2025*
