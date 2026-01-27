CounselorReady
NBCC-Approved Continuing Education Platform for Mental Health Professionals ACEP Provider #7760 | GA Integrated Therapeutic Perspectives LLC
 
Overview
CounselorReady is a full-stack web application that provides continuing education courses, credential tracking, and certificate management for licensed counselors and mental health professionals. The platform is approved by NBCC (National Board for Certified Counselors) and supports CE requirements across all 50 states.
 
Features
For Counselors
Feature	Description
CE Course Library	NBCC-approved courses with video, text, and quiz content
Course Player	Interactive player with progress tracking, time enforcement, quizzes
Certificate Generation	Auto-generated PDF certificates upon course completion
Credential Manager	Track state licenses (LPC, LMHC, etc.) and national certifications (NCC, BC-TMH)
AI Certificate Scanner	Upload external certificates; AI extracts title, provider, hours, dates
CE Progress Tracking	Visual progress bars showing hours earned vs. required per credential
Audit Trail	Generate compliance reports for license renewals
Public Verification	Shareable URLs to verify certificate authenticity
For Administrators
Feature	Description
Course Builder	Create courses with modules, lessons, quizzes, resources
User Management	View/edit users, manage subscriptions, grant access
Analytics Dashboard	NPS scores, course completions, engagement metrics
Migration Tools	Import from TalentLMS, SCORM packages, JSON/CSV
Announcement System	Send platform-wide or targeted announcements
Help Center	Manage FAQs and help articles
Coupon Management	Create discount codes for subscriptions
Platform Features
Feature	Description
4-Tier Subscriptions	Free, Starter ($19.99), Professional ($29.99), VIP ($49.99)
Hardship Pause	VIP perk allowing subscription pause during financial hardship
LTI Integration	Connect with external LMS platforms
SCORM Support	Import/export SCORM packages
xAPI Tracking	Learning record store integration
Email Notifications	Course completions, renewal reminders, announcements
 
Tech Stack Backend
Runtime: Node.js 18+
Framework: Express.js
Database: MongoDB (Atlas)
ODM: Mongoose
Authentication: JWT (JSON Web Tokens)
File Storage: Cloudinary
Email: Resend
Payments: Stripe
PDF Generation: pdf-lib, PDFKit
AI Integration: Anthropic Claude API (certificate scanning)
Frontend
Build Tool: Vite
Styling: Tailwind CSS
JavaScript: Vanilla JS (no framework)
Icons: Heroicons, Lucide
Deployment
Hosting: Render.com
Database: MongoDB Atlas
CDN: Cloudinary
 
Project Structure
 
Installation
Prerequisites
Node.js 18+
MongoDB Atlas account
Cloudinary account
Resend account (email)
Stripe account (payments)
Anthropic API key (AI scanning - optional)
1. Clone Repository
 
2. Backend Setup
3. Frontend Setup
 
4. Verify Installation
 
Environment Variables
Create server/.env with the following:
 
API Reference
Authentication
 
Users
 
Courses
 
Certificates
 
Credentials
 
AI Scanning
 
Admin (requires admin role)
 
 
 
Data Models
User
Profile (name, email, timezone)
Subscription (tier, status, Stripe IDs)
Preferences (notifications, CE goals)
Admin flags
Course
Title, description, thumbnail
Modules → Lessons (video, text, quiz)
CE hours, categories
Pricing, access levels
Analytics (enrollments, completions)
UserCourseProgress
User + Course reference
Lessons completed
Quiz attempts
Status (not_started, in_progress, completed)
Time tracking
Certificate
Course reference (if platform-generated)
Title, provider, CE hours
Completion date
Category (Ethics, General, etc.)
File URL, verification code
UserCredential
Type (state_license, national_cert, specialty)
License/cert number
Issue/expiration dates
CE requirements
Progress tracking
CredentialTemplate
State-specific requirements
CE hours, categories
Renewal cycle
Issuing body
 
Deployment (Render)
1. Push to GitHub
 
2. Create Render Web Service
1.	Go to render.com → New → Web Service
2.	Connect GitHub repository
3.	Configure:
Name: CounselorReady-API
Region: Oregon (US West)
Branch: main
Root Directory: server
Runtime: Node
Build Command: npm install
Start Command: npm start
3. Add Environment Variables
Add all variables from .env in Render dashboard.
4. Deploy
Click "Create Web Service" - auto-deploys on every push.
5. Static Site (Frontend)
 
Scripts
Seed Credential Templates
 
Add ACEP Template
Testing
Manual Testing
 
Troubleshooting
Common Issues
MongoDB connection fails
Check MONGODB_URI format
Whitelist IP in Atlas Network Access
Certificates not generating
Ensure course has ceuHours field set
Check Cloudinary credentials
AI scan not working
Verify ANTHROPIC_API_KEY is set
Check file size (max 10MB)
Stripe webhooks failing
Verify STRIPE_WEBHOOK_SECRET matches dashboard
Check endpoint URL is accessible
Credential templates not loading
Run node src/scripts/seedCredentialTemplates.js
Check route order in credentials.js (templates before :id)
 
License
Proprietary - GA Integrated Therapeutic Perspectives LLC
 
Support
Website: CounselorReady.com
Provider: GA Integrated Therapeutic Perspectives LLC
 
Credits
Built by GA Integrated Therapeutic Perspectives LLC
NBCC Approved Continuing Education Provider (ACEP #776
