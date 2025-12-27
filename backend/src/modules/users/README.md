# Users Module

## Purpose
Defines the User entity and user-related types for the Nettoyage Plus system. This module provides the database schema for user accounts.

> **Note:** This module currently only contains the entity definition. Full CRUD operations will be added when the Users management feature is built.

## Entities

### User Entity

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key (auto-generated) |
| email | string | Unique email address (stored lowercase) |
| password | string | Bcrypt hashed password |
| firstName | string | User's first name (optional) |
| lastName | string | User's last name (optional) |
| role | UserRole | User's role in the system |
| status | UserStatus | Account status |
| phone | string | Phone number (optional) |
| lastLoginAt | Date | Timestamp of last login (optional) |
| createdAt | Date | When account was created |
| updatedAt | Date | When account was last modified |
| deletedAt | Date | Soft delete timestamp (null if not deleted) |

### User Roles
```typescript
enum UserRole {
  ADMIN = 'ADMIN',
  SUPERVISOR = 'SUPERVISOR',
  ZONE_CHIEF = 'ZONE_CHIEF',
  TEAM_CHIEF = 'TEAM_CHIEF',
  AGENT = 'AGENT',
  ACCOUNTANT = 'ACCOUNTANT',
  QUALITY_CONTROLLER = 'QUALITY_CONTROLLER',
  CLIENT = 'CLIENT',
}
```

### User Status
```typescript
enum UserStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  ARCHIVED = 'ARCHIVED',
}
```

## Database Table
Table name: `users`

**Indexes:**
- Primary key on `id`
- Unique constraint on `email`

**Soft Delete:**
- Uses `deletedAt` column
- Soft-deleted users excluded from normal queries

## Usage

### Import the Entity
```typescript
import { User } from '../users/entities/user.entity';
```

### Import Types
```typescript
import { UserRole, UserStatus } from '../../shared/types/user.types';
```

### Password Handling
Password is automatically hashed before insert/update:
```typescript
const user = new User();
user.email = 'test@example.com';
user.password = 'plaintext'; // Will be hashed automatically
await userRepository.save(user);
```

### Validate Password
```typescript
const isValid = await user.validatePassword('plaintext');
```

## Dependencies
- `typeorm` - ORM for database operations
- `bcrypt` - Password hashing

## Files
```
users/
├── entities/
│   └── user.entity.ts
└── README.md
```

## Future Endpoints (To Be Built)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | List all users (with pagination) |
| GET | `/api/users/:id` | Get user by ID |
| GET | `/api/users/search` | Search users by criteria |
| POST | `/api/users` | Create new user (admin) |
| PATCH | `/api/users/:id` | Update user |
| DELETE | `/api/users/:id` | Soft delete user |
| POST | `/api/users/:id/restore` | Restore soft-deleted user |

---
**Last Updated:** December 27, 2025
