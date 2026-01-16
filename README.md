# CounselorReady

NBCC-Approved CE Platform for Mental Health Professionals (ACEP #7760)

## Features

### For Counselors
- **CE Course Library** - NBCC-approved continuing education courses
- **Smart CE Tracking** - AI-powered tracking across all 50 states
- **Credential Manager** - Track licenses, certifications, renewals
- **Certificate Vault** - Store & organize all CE certificates
- **Verification System** - Public certificate verification URLs
- **CE Transcript** - One-click PDF transcript generation

### For Platform
- **4-Tier Pricing** - Free, Starter ($19.99), Professional ($29.99), VIP ($49.99)
- **Hardship Pause** - VIP perk with loyalty-based grace periods
- **Course Migration** - Import from TalentLMS, JSON, CSV
- **Analytics Dashboard** - NPS scores, satisfaction tracking, course metrics
- **SCORM/LTI/xAPI** - Enterprise LMS integrations

---

## Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB Atlas account
- Cloudinary account
- Resend account
- Stripe account

### Backend Setup

```bash
cd server
npm install
cp .env.example .env    # Edit with your credentials
npm run seed            # Load state requirements + sample courses
npm start               # Starts on port 5000
```

### Frontend Setup

```bash
cd client
npm install
npm run dev             # Starts on port 5173
```

### Verify Installation

```bash
curl http://localhost:5000/health
# Should return: {"status":"ok","mongodb":"connected",...}
```

---

## Environment Variables

See `server/.env.example` for complete template. Required variables:

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | 64+ character secret key |
| `CLIENT_URL` | Frontend URL (no trailing slash) |
| `CLOUDINARY_*` | Cloud name, API key, secret |
| `RESEND_API_KEY` | Email service API key |
| `STRIPE_SECRET_KEY` | Stripe API key |
| `STRIPE_PRICE_*` | Price IDs for each tier |

---

## Deployment

### Render (Recommended)

1. Push to GitHub
2. Create Web Service on render.com
3. Settings:
   - Root Directory: `server`
   - Build: `npm install`
   - Start: `npm start`
4. Add environment variables
5. Deploy

See `server/BACKEND-SETUP.md` for detailed instructions.

---

## API Documentation

### Core Endpoints

```
POST /api/auth/register     - Create account
POST /api/auth/login        - Login
GET  /api/courses           - List courses
POST /api/courses/:id/enroll - Enroll in course
GET  /api/certificates      - List certificates
GET  /api/certificates/verify/:code - PUBLIC verification
```

### Admin Endpoints

```
GET  /api/admin/users       - List all users
POST /api/admin/courses     - Create course
GET  /api/migration/export  - Export courses JSON
POST /api/migration/import/talentlms - Import from TalentLMS
```

Full API reference in `server/BACKEND-SETUP.md`

---

## Project Structure

```
CounselorReady/
├── client/                 # Frontend (Vite + Tailwind)
│   └── public/            # Static HTML pages
├── server/                # Backend (Express + MongoDB)
│   ├── src/
│   │   ├── models/        # Mongoose schemas
│   │   ├── routes/        # API endpoints
│   │   ├── services/      # Email, reminders
│   │   └── utils/         # PDF generation, helpers
│   ├── BACKEND-SETUP.md   # Detailed backend docs
│   └── .env.example       # Environment template
└── README.md
```

---

## Key Technologies

- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Frontend**: Vanilla JS, Tailwind CSS, Vite
- **Payments**: Stripe
- **Email**: Resend
- **Storage**: Cloudinary
- **PDF**: pdf-lib
- **Auth**: JWT

---

## Support

GA Integrated Therapeutic Perspectives LLC
NBCC Approved Continuing Education Provider (ACEP #7760)

