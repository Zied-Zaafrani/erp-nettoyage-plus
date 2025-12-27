# Auth Module

## Purpose
Handles user authentication and authorization for the Nettoyage Plus API. Provides JWT-based authentication with role-based access control.

## Entities
This module uses the `User` entity from `/modules/users/entities/user.entity.ts`.

## Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | Public | Register a new user account |
| POST | `/api/auth/login` | Public | Login with email and password |
| GET | `/api/auth/me` | Protected | Get current authenticated user |

### POST /api/auth/register

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "role": "AGENT"
}
```

**Response (201):**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "AGENT",
    "status": "ACTIVE",
    "createdAt": "2025-12-27T12:00:00.000Z"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

### POST /api/auth/login

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "user": { ... },
  "accessToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

### GET /api/auth/me

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Response (200):**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "AGENT",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

## Usage

### Protecting Routes
All routes are protected by default (global JwtAuthGuard). To make a route public:

```typescript
import { Public } from '../../common/decorators';

@Public()
@Get('public-endpoint')
async publicEndpoint() { ... }
```

### Restricting to Specific Roles
```typescript
import { Roles } from '../../common/decorators';
import { UserRole } from '../../shared/types/user.types';

@Roles(UserRole.ADMIN, UserRole.SUPERVISOR)
@Get('admin-only')
async adminEndpoint() { ... }
```

### Getting Current User
```typescript
import { CurrentUser } from '../../common/decorators';

@Get('profile')
async getProfile(@CurrentUser() user: any) {
  return user;
}

// Or get specific field
@Get('my-id')
async getMyId(@CurrentUser('id') userId: string) {
  return { userId };
}
```

## Dependencies
- `@nestjs/jwt` - JWT token generation
- `@nestjs/passport` - Passport integration
- `passport-jwt` - JWT strategy
- `bcrypt` - Password hashing
- `class-validator` - DTO validation

## Configuration
Environment variables required:
- `JWT_SECRET` - Secret key for signing tokens
- `JWT_EXPIRATION` - Token expiration time (default: 7d)

## Notes
- Passwords are hashed using bcrypt (10 rounds)
- Tokens include user ID, email, and role in payload
- Soft-deleted or suspended users cannot login
- Email is stored lowercase and must be unique
- Default role for new users is AGENT

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

---
**Last Updated:** December 27, 2025
