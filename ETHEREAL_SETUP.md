# ETHEREAL SMTP Setup Guide

## Problem
The Ethereal SMTP credentials in your `.env` file are invalid (535 Authentication failed).

## Solution

### Step 1: Generate New Ethereal Credentials
1. Go to https://ethereal.email/create
2. Create a new test account (no signup needed, it generates automatically)
3. You'll get:
   - Email address (e.g., `test123@ethereal.email`)
   - Password (auto-generated)
4. Copy both values

### Step 2: Update .env File
Replace these values in `backend/.env`:

```env
SMTP_HOST=smtp.ethereal.email
SMTP_PORT=587
SMTP_USER=your.generated.email@ethereal.email
SMTP_PASS=your.generated.password
SMTP_FROM=noreply@nettoyageplus.com
FRONTEND_URL=http://localhost:5173
```

### Step 3: Verify Configuration
The backend logs will show:
```
✅ Email transporter configured with smtp.ethereal.email:587
```

### Step 4: Test Password Reset
1. Call `/api/auth/forgot-password` with any email
2. Check backend logs for:
   - `✅ Password reset email sent to ...`
   - Preview URL (Ethereal emails)

## For Production
Replace Ethereal credentials with your company SMTP:
- `SMTP_HOST` - Your company's SMTP server
- `SMTP_PORT` - Usually 587 (STARTTLS) or 465 (SSL)
- `SMTP_USER` - Your company email username
- `SMTP_PASS` - Your company email password
- `SMTP_FROM` - Your company sender email

No code changes needed - just update environment variables!
