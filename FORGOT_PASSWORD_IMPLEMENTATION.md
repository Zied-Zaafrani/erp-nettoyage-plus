# Password Reset Implementation

## Overview
The forgot password functionality is now implemented with a complete flow:

### Frontend Flow
1. User clicks "Forgot password?" on login page
2. Navigates to `/forgot-password` form
3. Enters email address
4. Frontend calls `POST /api/auth/forgot-password`
5. Redirects to confirmation page `/forgot-password/sent`

### Backend Implementation
**Endpoint:** `POST /api/auth/forgot-password`
**File:** `backend/src/modules/auth/auth.controller.ts`

Currently logs the password reset request for security (doesn't reveal if email exists).

## Production Email Setup

To enable actual email sending in production, you need to:

### 1. Install Email Service Package
```bash
cd backend
npm install @nestjs-modules/mailer nodemailer
npm install -D @types/nodemailer
```

### 2. Configure Email Service
Add to `.env` (Railway environment variables):
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@nettoyageplus.com
```

### 3. Update AuthService
In `backend/src/modules/auth/auth.service.ts`, replace the TODO section with:

```typescript
import * as crypto from 'crypto';

// In forgotPassword method:
const resetToken = crypto.randomBytes(32).toString('hex');
const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

// Save token to user (requires adding fields to User entity)
user.resetPasswordToken = resetToken;
user.resetPasswordExpires = resetTokenExpiry;
await this.userRepository.save(user);

// Send email
const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
await this.emailService.sendPasswordReset(user.email, resetUrl);
```

### 4. Create Email Module
Add `backend/src/modules/email/email.service.ts` with nodemailer configuration.

### 5. Add Reset Token Fields to User Entity
```typescript
@Column({ nullable: true })
resetPasswordToken?: string;

@Column({ type: 'timestamp', nullable: true })
resetPasswordExpires?: Date;
```

### 6. Create Reset Password Endpoint
Add endpoint to handle the actual password reset with the token.

## Current Status
✅ Frontend form collecting email
✅ Backend endpoint receiving requests
✅ Security-conscious response (doesn't leak user existence)
✅ Error handling with toast notifications
⏳ Email sending (logs only, ready for production email service)

## Testing
You can test the current implementation:
1. Go to login page
2. Click "Forgot password?"
3. Enter any email
4. Check backend logs to see the request was received
5. Confirmation page appears

The backend is deployed on Railway and will accept these requests once pushed.
