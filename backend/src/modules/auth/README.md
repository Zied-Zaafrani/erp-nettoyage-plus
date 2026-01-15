# Authentication Module

## What This Module Does

Controls who can access the Nettoyage Plus system. This module verifies user identities and ensures only authorized people can perform actions.

## Key Features

**User Registration:**
- Create new user accounts with email and password
- Password is securely encrypted and stored
- Each user is assigned a role (determines what they can do)

**User Login:**
- Users log in with email and password
- System generates a secure token (like a digital key)
- Token is used to access protected parts of the system
- Tokens expire after 7 days for security

**Access Control:**
- Different roles have different permissions
- Some features require specific roles (e.g., only admins can delete users)
- System automatically checks permissions on every action

**Security Features:**
- Passwords are never stored in plain text
- Tracks last login time
- Prepared for future features: email verification, failed login tracking, account lockout

## Available Functions

**register()** - Creates a new user account, hashes password, generates JWT token

**login()** - Validates credentials, updates last login time, returns JWT token

**validateUser()** - Verifies email and password match, returns user if valid

**generateToken()** - Creates a secure JWT token containing user ID, email, and role

## Files
```
auth/
├── dto/
│   ├── index.ts
│   ├── login.dto.ts
│   └── register.dto.ts
├── strategies/
│   └── jwt.strategy.ts
├── auth.controller.ts
├── auth.module.ts
├── auth.service.ts
└── README.md
```
