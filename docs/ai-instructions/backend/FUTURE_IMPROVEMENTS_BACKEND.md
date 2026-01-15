# Backend Future Improvements

**Last Updated:** January 15, 2026  
**Backend Completion:** 100% (All MVP modules complete)

## January 15, 2026 - Code Review Findings

### ✅ What's Complete
All 11 core MVP modules fully implemented:
1. Authentication & Authorization (JWT, roles, guards)
2. Users Management (complete CRUD, 371 lines)
3. Clients Management (auto-codes, 406 lines)
4. Sites Management (client validation, 346 lines)
5. Contracts Management (lifecycle, pricing, 400+ lines)
6. Zones & Assignments (4 zones, history tracking)
7. Schedules (recurrence patterns, auto-generation)
8. Interventions (GPS, photos, workflow, 512 lines)
9. Checklists (templates, instances, items, 372 lines)
10. Absences (workflow, overlap detection, 440 lines)
11. Dashboard & Reporting (KPIs, reports, 550+ lines) ✅ NEW

### 📊 Backend Status
- **Lines of Code:** ~6,000+ (services only)
- **Entities:** 13 (User, Client, Site, Contract, Zone, 3 assignment tables, Schedule, Intervention, 3 checklist tables, Absence)
- **Endpoints:** 110+ REST endpoints
- **Documentation:** 11 module READMEs + 4 project docs
- **Code Quality:** 0 TypeScript errors, consistent patterns
- **Completion:** 100% ✅

---

## Remaining Work for Production

### 🔴 CRITICAL PRIORITY - Needed Before Launch

#### 1. Dashboard & Reporting Module
**Status:** Not started  
**Priority:** 🔴 CRITICAL for demo  
**Effort:** 2 days  

**Required Endpoints:**
- GET /api/dashboard/summary (total clients, sites, contracts, interventions)
- GET /api/dashboard/interventions-today
- GET /api/dashboard/interventions-week
- GET /api/dashboard/zone-performance/:zoneId
- GET /api/dashboard/recent-activity
- GET /api/reports/daily/:date (matches Operations Manual page 17)
- GET /api/reports/weekly/:startDate (matches Operations Manual page 19)
- GET /api/reports/monthly/:year/:month (matches Operations Manual page 20)
- GET /api/reports/kpi/:roleType

**Data Points Needed (from Operations Manual):**
- Check-list completion rates per zone
- Uniform compliance tracking
- Stock availability status
- Incidents count
- Site visit counts by Chef de Zone
- Agent utilization metrics

**Business Rules:**
- Daily reports: submitted by Chefs de Zone
- Weekly reports: due every Tuesday
- Monthly reports: first Tuesday of month
- KPIs tracked per role (Chef de Zone, Chef d'équipe, etc.)

---

#### 2. File Upload Module
**Status:** Photos stored as URLs only  
**Priority:** 🟡 MEDIUM  
**Effort:** 1 day  

**Current State:**
- ✅ `photoUrls: string[]` in Intervention and ChecklistItem
- ❌ No actual file upload endpoint

**Required:**
- POST /api/uploads/photo (multipart/form-data)
- File validation (size < 5MB, types: jpg, png, heic)
- Image compression/resizing (reduce storage costs)
- Storage integration:
  - Option A: Supabase Storage (recommended - already using Supabase)
  - Option B: AWS S3
  - Option C: Cloudinary (includes optimization)
- Return URL for database storage
- DELETE /api/uploads/:filename (cleanup)

---

### 🟡 MEDIUM PRIORITY - Operations Alignment

#### 3. Pointage/Attendance Tracking
**Status:** Not implemented  
**Priority:** 🟡 MEDIUM  
**Effort:** 3 days  

**Operations Manual Requirement:** "Fiche de pointage" (page 17)

**Required Features:**
- Agent check-in/out times per site
- Daily timesheet generation
- Attendance reports by zone
- Integration with Interventions module
- Late arrival tracking
- Absence correlation

**Suggested Implementation:**
```typescript
Attendance Entity:
- id, agentId, siteId, date
- checkInTime, checkOutTime
- status (ON_TIME, LATE, EARLY_LEAVE, ABSENT)
- notes
```

---

#### 4. Bureau-by-Bureau Enhanced Tracking
**Status:** Supported but not enforced  
**Priority:** 🟡 MEDIUM  
**Effort:** 1 day  

**Operations Manual:** Detailed bureau tracking (page 16)

**Current State:**
- ✅ ChecklistItem supports `zoneName: "Bureau 1"`
- ✅ Can track "Nettoyé" and "Désinfecté" as separate items
- ⚠️ Not enforced in checklist templates

**Enhancement:**
- Add template validation: ensure bureau numbers are sequential
- Add bulk bureau item creation helper
- Frontend component to display bureau grid with checkmarks

---

### 🟢 LOW PRIORITY - Code Quality & Performance

#### 5. Database Performance Optimization
**Status:** Basic indexes only  
**Priority:** 🟢 LOW (after launch)  
**Effort:** 2 days  

**Add Indexes:**
- interventions: (contractId, scheduledDate)
- interventions: (status, scheduledDate)
- absences: (agentId, status, startDate)
- checklist_items: (checklistInstanceId, isCompleted)
- zones: (status)

**Query Optimization:**
- Add pagination cursors for large datasets
- Implement Redis caching for dashboard queries
- Add database connection pooling config

---

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
