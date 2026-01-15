# Backend Future Improvements

## January 15, 2026 - Sites Module

### Current State
Sites module fully functional with CRUD operations, client validation, and soft deletes.

### Identified Improvements

**Business Logic (From Q6-Q9):**
- **Site Transfer Endpoint:** Add `POST /sites/:id/transfer` with validation and audit logging (Q6)
- **Client Deletion Protection:** Prevent client deletion if sites exist - add validation check in ClientsService.remove() (Q7)
- **Email Verification Enforcement:** Implement flow where clients without verified email can view but not request services (Q8)
- **Client Code Generation:** Replace current findOne + increment with PostgreSQL sequence to eliminate race conditions (Q9)

**Performance:**
- Add database indexes for frequently queried fields:
  - `sites`: clientId, status, city
  - `clients`: status, city, type
  - `users`: email, role, status
- Make client relation loading optional in Site queries (add `includeClient` param)

**API Enhancements:**
- Batch operations response format - add summary counts (total, succeeded, failed)
- Consolidate search endpoints - consider if `/sites/search?id=` duplicates `sites/:id`

**Code Quality & Documentation:**
- Extract common CRUD patterns to `BaseCrudService<T>` abstract class
- Add validation groups for batch operations to provide better error context
- **Add clarifying comments in AuthService:** Document reliance on User entity password hashing hooks
- **Enhance password validation docs:** Add comments explaining auto-hashing flow in entity lifecycle

**Priority:** Medium  
**Effort:** Medium - Large

---

## January 15, 2026 - README Enhancements

### Current State
- ✅ Clients README: Comprehensive frontend-focused documentation (450+ lines)
- ✅ Auth README: Complete with examples
- ✅ Users README: Complete with API docs
- ✅ Sites README: Basic documentation

### Identified Improvements

**Sites README Enhancement:**
- Apply Clients README template/format
- Add frontend-focused sections:
  - Data structure table with frontend notes
  - Frontend code examples (TypeScript/Fetch)
  - UI/UX recommendations (badges, layouts)
  - Validation rules for forms
  - Error handling guide
  - Business rules with frontend impact

**Auth & Users README:**
- Consider adding frontend code examples
- Add UI/UX recommendations sections
- Add form validation examples

**Priority:** Low (documentation)  
**Effort:** Medium (templated from Clients README)

---

## January 15, 2026 - Clients Module

### Current State
Clients module functional with auto-generated codes (CLI-0001) and optional user linking.

### Identified Improvements

**Data Integrity:**
- Validate `userId` exists before linking (foreign key check in service)
- Add search/filter by `clientCode`
- Consider if one user can be linked to multiple clients (currently allowed)

**Concurrency:**
- Client code generation could have race conditions with simultaneous creates
- Should use database transactions or sequence for production-safe code generation

**Business Logic:**
- Track when user account is deleted (audit trail for client-user unlinks)
- Add option to load user relation when fetching clients

**Priority:** Low - Not blocking other modules  
**Effort:** Small - Medium

---

## January 15, 2026 - Foundation Refinement

### Implemented from Previous List
- ✅ Extract password hashing to shared utility (modularity)
- ✅ Added `emailVerified`, `emailVerifiedAt` fields (prepared for email verification)
- ✅ Added `failedLoginAttempts`, `lastFailedLoginAt` fields (prepared for account lockout)

### Still Pending (Lower Priority)
These can be added later without breaking existing code:

**Security:**
- Add refresh tokens (short-lived access + long-lived refresh)
- Implement account lockout logic after N failed attempts (fields are ready)
- Add rate limiting on auth endpoints
- JWT blacklist for logout (Redis recommended)
- Two-factor authentication (2FA)

**UX:**
- Password reset flow (forgot password email)
- Email verification flow (enforce on login - fields are ready)
- "Remember me" functionality
- View/revoke active sessions

**Performance:**
- Cache user validation (avoid DB hit on every request)
- Redis for session/token management at scale

---

## December 27, 2025 - Authentication Module

### Current State
Basic authentication is working with register, login, and JWT token validation.

### Limitations
- No refresh token mechanism (users must re-login when token expires)
- No password reset/forgot password flow
- No email verification on registration
- No account lockout after failed login attempts
- No logout endpoint (token invalidation)
- No session tracking (can't see active sessions)

### Proposed Improvements

**Security:**
- Add refresh tokens for better security and UX (short-lived access tokens + long-lived refresh tokens)
- Implement account lockout after N failed attempts (configurable)
- Add rate limiting on auth endpoints to prevent brute force
- Store JWT blacklist for logout functionality (Redis recommended)
- Add two-factor authentication (2FA) option

**UX:**
- Password reset flow (email with reset link)
- Email verification on registration
- "Remember me" functionality with extended token life
- View/revoke active sessions

**Performance:**
- Cache user validation results (avoid DB hit on every request)
- Consider Redis for session/token management at scale

**Modularity:**
- Extract password hashing to shared utility (reusable across modules)
- Create base service class with common CRUD patterns

**Priority:** Medium  
**Effort:** Large (multiple features)

---
