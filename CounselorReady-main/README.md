# CounselorReady

Clinical training and credential tracking platform for counselors.

## Quick Start

### Backend
```bash
cd server
npm install
cp .env.example .env  # Edit with your values
npm run seed          # Load state data + courses
npm start
```

### Frontend
```bash
cd client
npm install
npm run dev
```

## Environment Variables (server/.env)

```
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
PORT=5000
FRONTEND_URL=http://localhost:5173
RESEND_API_KEY=re_...
STRIPE_SECRET_KEY=sk_...
```

## Features

- User authentication with 7-day trial
- Course catalog with progress tracking
- Credential tracker for all 50 states
- CEU logging by category
- Email reminders
- Stripe payments
