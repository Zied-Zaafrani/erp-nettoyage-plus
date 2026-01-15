# Phase 1 MVP - Implementation Status

**Last Updated:** January 15, 2026  
**Overall Progress:** ~55% Complete  
**Estimated Time to Launch:** 5-6 weeks

---

## Phase 1 MVP Requirements

### Objectif
Avoir un outil immédiatement utilisable pour gérer les opérations de base.

### Modules Requis
1. Gestion des Clients & Contrats (contrats permanents + interventions ponctuelles)
2. Gestion des Sites / Lieux d'intervention
3. Gestion des Interventions et du Planning (planning récurrent + ponctuel)
4. Gestion du Personnel (fiche employé, absences, affectations)
5. Application Mobile pour les Agents (missions, pointage GPS, photos)
6. Notifications et Communication (missions, changements)
7. Gestion des Rôles et Autorisations (Admin, Superviseur, Agent, Client)

---

## ✅ Completed Modules (50%)

### [x] 1. Authentication & Authorization (100%)
- [x] JWT authentication with global guards
- [x] Role-based authorization (@Roles decorator)
- [x] Public/Protected endpoint control
- [x] Password security (18 chars minimum, bcrypt hashing)
- [x] 10 roles defined (SUPER_ADMIN, DIRECTOR, ASSISTANT, SECTOR_CHIEF, ZONE_CHIEF, TEAM_CHIEF, AGENT, ACCOUNTANT, QUALITY_CONTROLLER, CLIENT)
- [x] User status management (ACTIVE, SUSPENDED, ARCHIVED)
- [x] @CurrentUser() decorator for accessing authenticated user

**Files:**
- `backend/src/modules/auth/`
- `backend/src/common/guards/`
- `backend/src/common/decorators/`

---

### [x] 2. Gestion des Clients (100%)
- [x] Client CRUD operations (single + batch)
- [x] Client types: INDIVIDUAL, COMPANY, MULTI_SITE
- [x] Client status: PROSPECT, ACTIVE, SUSPENDED, TERMINATED
- [x] Auto-generated client codes (CLI-0001, CLI-0002, etc.)
- [x] Search, filter, pagination
- [x] Soft delete with restore
- [x] Optional user account linking (portal access)
- [x] Email uniqueness validation

**Endpoints:**
- POST /api/clients (create single)
- POST /api/clients/batch (create multiple)
- GET /api/clients (list with filters)
- GET /api/clients/search (find by id/email/name)
- GET /api/clients/:id (get single)
- PATCH /api/clients/:id (update single)
- PATCH /api/clients/batch/update (update multiple)
- DELETE /api/clients/:id (soft delete)
- POST /api/clients/batch/delete (bulk delete)
- POST /api/clients/:id/restore (restore deleted)
- POST /api/clients/batch/restore (bulk restore)

**Files:**
- `backend/src/modules/clients/`
- `backend/src/shared/types/client.types.ts`

---

### [x] 3. Gestion des Sites (100%)
- [x] Site CRUD operations (single + batch)
- [x] Site sizes: SMALL, MEDIUM, LARGE (matches 10 grands, 16 moyens, 21 petits sites)
- [x] Site status: ACTIVE, INACTIVE, UNDER_MAINTENANCE, CLOSED
- [x] Linked to clients (CASCADE delete)
- [x] Access instructions and working hours
- [x] Contact information (person, phone, email)
- [x] Search, filter by client/size/status/location
- [x] Pagination and sorting
- [x] Soft delete with restore
- [x] Client validation on creation

**Endpoints:**
- POST /api/sites (create single)
- POST /api/sites/batch (create multiple)
- GET /api/sites (list with filters)
- GET /api/sites/search (find by id/name)
- GET /api/sites/:id (get single)
- PATCH /api/sites/:id (update single - clientId immutable)
- PATCH /api/sites/batch/update (update multiple)
- DELETE /api/sites/:id (soft delete)
- POST /api/sites/batch/delete (bulk delete)
- POST /api/sites/:id/restore (restore deleted)
- POST /api/sites/batch/restore (bulk restore)

**Business Rules:**
- Site ownership (clientId) cannot be changed after creation
- Every site must belong to an existing client
- Sites are cascade deleted when client is deleted

**Files:**
- `backend/src/modules/sites/`
- `backend/src/shared/types/site.types.ts`

---

### [x] 4. Gestion du Personnel - Basic (60%)
- [x] User accounts for all employees (178 agents + supervisors)
- [x] All roles defined matching organizational structure
- [x] User CRUD operations (single + batch)
- [x] Search by email, phone, role, status
- [x] User status management
- [x] Login tracking (lastLoginAt)
- [x] Email verification fields (prepared for future)
- [x] Failed login tracking fields (prepared for future)
- [x] Soft delete with restore
- [ ] **MISSING:** Absence tracking (congés, maladies)
- [ ] **MISSING:** Site/Zone assignments
- [ ] **MISSING:** Team structure management
- [ ] **MISSING:** Schedule/availability management

**Endpoints:**
- POST /api/users (create single)
- POST /api/users/batch (create multiple)
- GET /api/users (list with filters)
- GET /api/users/search (find by id/email/phone)
- GET /api/users/:id (get single)
- PATCH /api/users/:id (update single)
- PATCH /api/users/batch/update (update multiple)
- DELETE /api/users/:id (soft delete)
- POST /api/users/batch/delete (bulk delete)
- POST /api/users/:id/restore (restore deleted)
- POST /api/users/batch/restore (bulk restore)

**Files:**
- `backend/src/modules/users/`
- `backend/src/shared/types/user.types.ts`
- `backend/src/shared/utils/password.util.ts`

---

## ❌ Missing Critical Modules (50%)

### [x] 5. Gestion des Contrats (100% - COMPLETE ✅)

**Priority:** ✅ COMPLETED - January 15, 2026

**Completed Features:**
- [x] Contract entity and database schema
- [x] Contract types: PERMANENT, ONE_TIME
- [x] Contract frequency: DAILY, WEEKLY, BIWEEKLY, MONTHLY, QUARTERLY, CUSTOM
- [x] Link to client and site(s)
- [x] Auto-generated contract codes (CNT-0001, CNT-0002, etc.)
- [x] Contract status: DRAFT, ACTIVE, SUSPENDED, COMPLETED, TERMINATED
- [x] Start date, end date, renewal options
- [x] Pricing and billing information
- [x] Service scope definition (which tasks, which zones)
- [x] CRUD operations (single + batch)
- [x] Search, filter, pagination
- [x] Soft delete with restore
- [x] Contract lifecycle management (suspend, terminate, renew)

**Business Rules Implemented:**
- ✅ Contract must reference existing client and site
- ✅ Site must belong to specified client
- ✅ Cannot delete client/site with active contracts (RESTRICT)
- ✅ Contract end date must be after start date
- ✅ Frequency required for PERMANENT contracts
- ✅ Active contracts cannot be deleted (must suspend/terminate first)

**Endpoints Implemented:**
- ✅ POST /api/contracts (create single)
- ✅ POST /api/contracts/batch (create multiple)
- ✅ GET /api/contracts (list with filters)
- ✅ GET /api/contracts/search (search by criteria)
- ✅ GET /api/contracts/:id (get single)
- ✅ PATCH /api/contracts/:id (update single)
- ✅ PATCH /api/contracts/batch/update (update multiple)
- ✅ DELETE /api/contracts/:id (soft delete)
- ✅ POST /api/contracts/batch/delete (bulk delete)
- ✅ POST /api/contracts/:id/restore (restore deleted)
- ✅ POST /api/contracts/batch/restore (bulk restore)
- ✅ POST /api/contracts/:id/renew (create renewal)
- ✅ POST /api/contracts/:id/suspend (suspend active)
- ✅ POST /api/contracts/:id/terminate (terminate contract)

**Database Schema:**
```typescript
Contract Entity: ✅ IMPLEMENTED
- id: UUID (PK)
- contractCode: string (unique, auto-generated)
- clientId: UUID (FK → Clients)
- siteId: UUID (FK → Sites)
- type: ContractType (PERMANENT, ONE_TIME)
- frequency: ContractFrequency (DAILY, WEEKLY, BIWEEKLY, MONTHLY, QUARTERLY, CUSTOM)
- startDate: Date
- endDate: Date (nullable for indefinite)
- status: ContractStatus
- pricing: JSON (hourly rate, monthly fee, etc.)
- serviceScope: JSON (tasks, zones, schedules)
- notes: text
- createdAt, updatedAt, deletedAt
```

**Files:**
- `backend/src/modules/contracts/entities/contract.entity.ts`
- `backend/src/modules/contracts/dto/` (create, update, search, batch)
- `backend/src/modules/contracts/contracts.service.ts`
- `backend/src/modules/contracts/contracts.controller.ts`
- `backend/src/modules/contracts/contracts.module.ts`
- `backend/src/modules/contracts/README.md`
- `backend/src/shared/types/contract.types.ts`

**Time Spent:** 1 day (faster than estimated)

---

### [x] 5.5. Gestion des Zones (100% - COMPLETE ✅)

**Priority:** ✅ COMPLETED - January 15, 2026

**Completed Features:**
- [x] Zone entity and database schema (4 geographical zones)
- [x] Zone Chief assignment tracking
- [x] Site-to-Zone assignment with history
- [x] Agent-to-Zone assignment with history
- [x] Automatic deactivation of previous assignments
- [x] Zone status: ACTIVE, INACTIVE, REORGANIZING
- [x] Role validation (ZONE_CHIEF, TEAM_CHIEF, AGENT)
- [x] CRUD operations
- [x] Assignment management endpoints

**Business Rules Implemented:**
- ✅ One active zone assignment per site at a time
- ✅ One active zone assignment per agent at a time
- ✅ Automatic deactivation when reassigning
- ✅ Cannot delete zones with active assignments
- ✅ Role validation for personnel

**Endpoints Implemented:**
- ✅ POST /api/zones (create zone)
- ✅ GET /api/zones (list all zones)
- ✅ GET /api/zones/:id (get single zone)
- ✅ PATCH /api/zones/:id (update zone)
- ✅ DELETE /api/zones/:id (delete zone)
- ✅ POST /api/zones/:id/assign-site (assign site to zone)
- ✅ POST /api/zones/:id/unassign-site (unassign site)
- ✅ POST /api/zones/:id/assign-agent (assign agent to zone)
- ✅ POST /api/zones/:id/unassign-agent (unassign agent)
- ✅ GET /api/zones/:id/sites (get zone's sites)
- ✅ GET /api/zones/:id/agents (get zone's agents)
- ✅ GET /api/zones/:id/history (get assignment history)

**Database Schema:**
```typescript
Zone Entity: ✅ IMPLEMENTED
- id: UUID (PK)
- name: string (e.g., "Zone Nord", "Zone Sud")
- description: text
- zoneChiefId: UUID (FK → Users, nullable)
- status: ZoneStatus (ACTIVE, INACTIVE, REORGANIZING)
- createdAt, updatedAt, deletedAt

SiteAssignment Entity: ✅ IMPLEMENTED
- id: UUID (PK)
- zoneId: UUID (FK → Zones)
- siteId: UUID (FK → Sites)
- assignedAt: DateTime
- unassignedAt: DateTime (nullable)
- isActive: boolean

AgentZoneAssignment Entity: ✅ IMPLEMENTED
- id: UUID (PK)
- zoneId: UUID (FK → Zones)
- userId: UUID (FK → Users)
- role: UserRole (ZONE_CHIEF, TEAM_CHIEF, AGENT)
- assignedAt: DateTime
- unassignedAt: DateTime (nullable)
- isActive: boolean
```

**Files:**
- `backend/src/modules/zones/entities/zone.entity.ts`
- `backend/src/modules/zones/entities/site-assignment.entity.ts`
- `backend/src/modules/zones/entities/agent-zone-assignment.entity.ts`
- `backend/src/modules/zones/dto/` (create, update, assign-site, assign-agent)
- `backend/src/modules/zones/zones.service.ts`
- `backend/src/modules/zones/zones.controller.ts`
- `backend/src/modules/zones/zones.module.ts`
- `backend/src/modules/zones/README.md`
- `backend/src/shared/types/zone.types.ts`

**Time Spent:** 1 day

---

### [x] 6. Gestion des Interventions (100% - COMPLETE ✅)

**Priority:** ✅ COMPLETED - January 15, 2026

**Completed Features:**
- [x] Intervention entity and database schema
- [x] Link to contract, site, and personnel
- [x] Auto-generated intervention codes (INT-0001, INT-0002, etc.)
- [x] Scheduled date/time and actual execution times
- [x] Status tracking: SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED, RESCHEDULED
- [x] Assigned team (Zone Chief, Team Chief, Agents)
- [x] GPS check-in/check-out tracking with coordinates and timestamps
- [x] Photo uploads for proof of work (URL array)
- [x] Quality control scoring (1-5 scale)
- [x] Client feedback/rating
- [x] Incident reporting
- [x] CRUD operations with validation
- [x] Filter by date, site, status, contract
- [x] Calendar view endpoint
- [x] Status workflow management
- [x] Rescheduling functionality

**Business Rules Implemented:**
- ✅ Intervention must reference valid contract and site
- ✅ Cannot schedule intervention outside contract period
- ✅ Site must belong to contract's client
- ✅ Must assign at least one agent (AGENT role)
- ✅ Zone chief must have ZONE_CHIEF role
- ✅ Team chief must have TEAM_CHIEF role
- ✅ GPS check-in required to start intervention
- ✅ GPS check-out required to complete intervention
- ✅ Must check-in before check-out
- ✅ End time must be after start time
- ✅ Cannot update/delete completed or cancelled interventions
- ✅ Cannot delete in-progress interventions

**Endpoints Implemented:**
- ✅ POST /api/interventions (create)
- ✅ GET /api/interventions (list with filters)
- ✅ GET /api/interventions/calendar (calendar view)
- ✅ GET /api/interventions/:id (get single)
- ✅ PATCH /api/interventions/:id (update)
- ✅ DELETE /api/interventions/:id (soft delete)
- ✅ POST /api/interventions/:id/start (start intervention)
- ✅ POST /api/interventions/:id/complete (complete intervention)
- ✅ POST /api/interventions/:id/cancel (cancel intervention)
- ✅ POST /api/interventions/:id/reschedule (reschedule)
- ✅ POST /api/interventions/:id/checkin (GPS check-in)
- ✅ POST /api/interventions/:id/checkout (GPS check-out)
- ✅ POST /api/interventions/:id/photos (add photo URL)

**Database Schema:**
```typescript
Intervention Entity: ✅ IMPLEMENTED
- id: UUID (PK)
- interventionCode: string (unique, auto-generated)
- contractId: UUID (FK → Contracts)
- siteId: UUID (FK → Sites)
- scheduledDate: Date
- scheduledStartTime: Time (HH:MM)
- scheduledEndTime: Time (HH:MM)
- actualStartTime: DateTime (nullable)
- actualEndTime: DateTime (nullable)
- status: InterventionStatus (SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED, RESCHEDULED)
- assignedZoneChiefId: UUID (FK → Users, nullable)
- assignedTeamChiefId: UUID (FK → Users, nullable)
- assignedAgentIds: UUID[] (array of User IDs)
- gpsCheckInLat: decimal(10,7)
- gpsCheckInLng: decimal(10,7)
- gpsCheckInTime: DateTime
- gpsCheckOutLat: decimal(10,7)
- gpsCheckOutLng: decimal(10,7)
- gpsCheckOutTime: DateTime
- photoUrls: string[] (array of URLs)
- qualityScore: integer (1-5, nullable)
- clientFeedback: text (nullable)
- incidentReported: boolean (default false)
- incidentDetails: text (nullable)
- specialInstructions: text (nullable)
- createdAt, updatedAt, deletedAt
```

**Files:**
- `backend/src/modules/interventions/entities/intervention.entity.ts`
- `backend/src/modules/interventions/dto/` (create, update, gps-checkin, gps-checkout, reschedule)
- `backend/src/modules/interventions/interventions.service.ts`
- `backend/src/modules/interventions/interventions.controller.ts`
- `backend/src/modules/interventions/interventions.module.ts`
- `backend/src/modules/interventions/README.md`
- `backend/src/shared/types/intervention.types.ts`

**Time Spent:** 1 day

---

### [ ] 7. Gestion du Planning / Scheduling (0% - CRITICAL)

**Priority:** 🔴 CRITICAL - Core business operation

**Required Features:**
- [ ] Intervention entity and database schema
- [ ] Link to contract, site, and personnel
- [ ] Auto-generated intervention codes (INT-0001, INT-0002, etc.)
- [ ] Scheduled date/time and actual execution times
- [ ] Status tracking: SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED, RESCHEDULED
- [ ] Assigned team (Zone Chief, Team Chief, Agents)
- [ ] GPS check-in/check-out tracking
- [ ] Photo uploads for proof of work
- [ ] Task checklist integration
- [ ] Quality control scoring
- [ ] Client feedback/rating
- [ ] Incident reporting
- [ ] CRUD operations
- [ ] Filter by date, site, status, personnel
- [ ] Calendar view data

**Business Rules:**
- Intervention must reference valid contract and site
- Cannot schedule intervention outside contract period
- Must assign at least one agent
- GPS coordinates required for check-in/check-out
- Photos required for completion
- Checklist must be completed before marking as done

**Endpoints Needed:**
- POST /api/interventions
- POST /api/interventions/batch
- GET /api/interventions
- GET /api/interventions/calendar (calendar view data)
- GET /api/interventions/:id
- PATCH /api/interventions/:id
- PATCH /api/interventions/batch/update
- DELETE /api/interventions/:id
- POST /api/interventions/:id/start (change status to IN_PROGRESS)
- POST /api/interventions/:id/complete (change status to COMPLETED)
- POST /api/interventions/:id/cancel
- POST /api/interventions/:id/reschedule

**Database Schema:**
```typescript
Intervention Entity:
- id: UUID (PK)
- interventionCode: string (unique, auto-generated)
- contractId: UUID (FK → Contracts)
- siteId: UUID (FK → Sites)
- scheduledDate: Date
- scheduledStartTime: Time
- scheduledEndTime: Time
- actualStartTime: DateTime (nullable)
- actualEndTime: DateTime (nullable)
- status: InterventionStatus
- assignedZoneChiefId: UUID (FK → Users)
- assignedTeamChiefId: UUID (FK → Users)
- assignedAgentIds: UUID[] (array of User IDs)
- checklistTemplateId: UUID (FK → ChecklistTemplates)
- checklistCompleted: boolean
- gpsCheckInLat: float
- gpsCheckInLng: float
- gpsCheckInTime: DateTime
- gpsCheckOutLat: float
- gpsCheckOutLng: float
- gpsCheckOutTime: DateTime
- photoUrls: string[] (array of URLs)
- qualityScore: integer (1-5)
- clientRating: integer (1-5)
- clientFeedback: text
- incidents: text
- notes: text
- createdAt, updatedAt, deletedAt
```

**Estimated Time:** 4-5 days

---

### [ ] 7. Gestion du Planning / Scheduling (0% - CRITICAL)

**Priority:** 🔴 CRITICAL - Required for operations

**Required Features:**
- [ ] Recurring schedule generation from contracts
- [ ] Daily schedule for all zones (07h00-15h00 petits sites, 07h00-17h00 grands sites)
- [ ] Agent availability management
- [ ] Automatic intervention generation based on contract frequency
- [ ] Schedule templates (daily, weekly, monthly patterns)
- [ ] Zone-based schedule views
- [ ] Agent workload balancing
- [ ] Schedule conflict detection
- [ ] Manual schedule adjustments
- [ ] Schedule approval workflow
- [ ] Export schedules (PDF, Excel)

**Business Rules:**
- Schedules generated from active contracts only
- Daily schedules: 07h00-15h00 for small/medium sites
- Daily schedules: 07h00-17h00 for large sites (with 15h00-17h00 permanence)
- Cannot assign agent to multiple sites at same time
- Respect agent absences when scheduling
- Zone chiefs manage their zone schedules

**Endpoints Needed:**
- POST /api/schedules/generate (generate from contracts)
- GET /api/schedules/daily/:date
- GET /api/schedules/weekly/:startDate
- GET /api/schedules/monthly/:year/:month
- GET /api/schedules/zone/:zoneId
- GET /api/schedules/agent/:agentId
- PATCH /api/schedules/:id
- POST /api/schedules/conflicts (check for conflicts)
- POST /api/schedules/:id/approve

**Database Schema:**
```typescript
Schedule Entity:
- id: UUID (PK)
- contractId: UUID (FK → Contracts)
- siteId: UUID (FK → Sites)
- recurrencePattern: RecurrencePattern (DAILY, WEEKLY, MONTHLY, CUSTOM)
- dayOfWeek: integer (0-6, nullable)
- dayOfMonth: integer (1-31, nullable)
- startTime: Time
- endTime: Time
- isActive: boolean
- validFrom: Date
- validUntil: Date (nullable)
- assignedZoneId: UUID (FK → Zones)
- generatedInterventionIds: UUID[] (tracking)
- createdAt, updatedAt, deletedAt

RecurringScheduleRule Entity:
- id: UUID (PK)
- scheduleId: UUID (FK → Schedules)
- frequency: string (DAILY, WEEKLY, BIWEEKLY, MONTHLY, QUARTERLY)
- interval: integer (every X days/weeks/months)
- daysOfWeek: integer[] (for weekly patterns)
- exceptions: Date[] (skip these dates)
```

**Estimated Time:** 3-4 days

---

### [x] 8. Zones & Site Assignments (100% - COMPLETE ✅)

**Priority:** ✅ COMPLETED - January 15, 2026

**Completed Features:**
- [x] Zone entity (supports 4 zones as per operations document)
- [x] Zone structure: Zone 1, Zone 2, Zone 3, Zone 4-5-6
- [x] Assign Zone Chief to each zone
- [x] Site-to-Zone assignments with history tracking
- [x] Agent-to-Zone assignments with history tracking
- [x] Team structure (Team Chiefs linked at assignment level)
- [x] Assignment history tracking (startDate, endDate, isActive)
- [x] Zone performance metrics endpoint
- [x] CRUD operations for zones
- [x] Automatic reassignment (deactivates previous on new assignment)
- [x] Validate user roles (ZONE_CHIEF, TEAM_CHIEF, AGENT)

**Business Rules Implemented:**
- ✅ Each zone has one Zone Chief (role: ZONE_CHIEF)
- ✅ Sites can only belong to one active zone at a time
- ✅ Agents can only belong to one active zone at a time
- ✅ Team Chiefs linked at site/agent assignment level
- ✅ Cannot delete zone with active assignments
- ✅ Automatic deactivation of previous assignments on reassignment
- ✅ Total capacity: 47 sites, 178 agents across 4 zones

**Endpoints Implemented:**
- ✅ POST /api/zones (create zone)
- ✅ GET /api/zones (list all zones)
- ✅ GET /api/zones/:id (get single zone)
- ✅ PATCH /api/zones/:id (update zone)
- ✅ DELETE /api/zones/:id (soft delete)
- ✅ POST /api/zones/:id/assign-site (assign site with team chief)
- ✅ POST /api/zones/:id/assign-agent (assign agent with team chief)
- ✅ GET /api/zones/:id/sites (get zone's sites)
- ✅ GET /api/zones/:id/agents (get zone's agents)
- ✅ GET /api/zones/:id/performance (zone metrics)
- ✅ DELETE /api/zones/assignments/site/:assignmentId (unassign site)
- ✅ DELETE /api/zones/assignments/agent/:assignmentId (unassign agent)

**Database Schema:**
```typescript
Zone Entity: ✅ IMPLEMENTED
- id: UUID (PK)
- zoneName: string (Zone 1, Zone 2, etc.)
- zoneCode: string (Z1, Z2, etc. - unique)
- zoneChiefId: UUID (FK → Users, role: ZONE_CHIEF)
- status: ZoneStatus (ACTIVE, INACTIVE, REORGANIZING)
- description: text
- createdAt, updatedAt, deletedAt

SiteAssignment Entity: ✅ IMPLEMENTED
- id: UUID (PK)
- siteId: UUID (FK → Sites, CASCADE)
- zoneId: UUID (FK → Zones, CASCADE)
- teamChiefId: UUID (FK → Users, role: TEAM_CHIEF, optional)
- startDate: Date
- endDate: Date (nullable for current assignment)
- isActive: boolean
- createdAt, updatedAt

AgentZoneAssignment Entity: ✅ IMPLEMENTED
- id: UUID (PK)
- agentId: UUID (FK → Users, CASCADE)
- zoneId: UUID (FK → Zones, CASCADE)
- teamChiefId: UUID (FK → Users, nullable)
- startDate: Date
- endDate: Date (nullable for current)
- isActive: boolean
- createdAt, updatedAt
```

**Files:**
- `backend/src/modules/zones/entities/zone.entity.ts`
- `backend/src/modules/zones/entities/site-assignment.entity.ts`
- `backend/src/modules/zones/entities/agent-zone-assignment.entity.ts`
- `backend/src/modules/zones/dto/` (create, update, assign DTOs)
- `backend/src/modules/zones/zones.service.ts`
- `backend/src/modules/zones/zones.controller.ts`
- `backend/src/modules/zones/zones.module.ts`
- `backend/src/modules/zones/README.md`
- `backend/src/shared/types/zone.types.ts`

**Time Spent:** 1 day (on schedule)

---

### [ ] 9. Absences Management (0% - HIGH)

**Priority:** 🟠 HIGH - Important for scheduling

**Required Features:**
- [ ] Absence entity (congés, maladie, absence non payée)
- [ ] Absence types: VACATION, SICK_LEAVE, UNPAID, AUTHORIZED, UNAUTHORIZED
- [ ] Absence request workflow: PENDING, APPROVED, REJECTED
- [ ] Date range validation
- [ ] Calendar integration
- [ ] Notification to Zone Chief/Team Chief
- [ ] Impact on scheduling (auto-adjust)
- [ ] Absence balance tracking (vacation days left)
- [ ] Historical absence reports
- [ ] CRUD operations
- [ ] Approval workflow endpoints

**Business Rules:**
- Agents must request absences in advance (except sick leave)
- Zone Chiefs approve absences for their agents
- Cannot approve absence if it conflicts with critical interventions
- Maximum consecutive absence days configurable
- Annual vacation days allocated per agent

**Endpoints Needed:**
- POST /api/absences (request absence)
- GET /api/absences
- GET /api/absences/agent/:agentId
- GET /api/absences/zone/:zoneId
- GET /api/absences/pending (for approvers)
- GET /api/absences/:id
- PATCH /api/absences/:id
- POST /api/absences/:id/approve
- POST /api/absences/:id/reject
- DELETE /api/absences/:id
- GET /api/absences/calendar/:year/:month
- GET /api/absences/balance/:agentId

**Database Schema:**
```typescript
Absence Entity:
- id: UUID (PK)
- agentId: UUID (FK → Users)
- absenceType: AbsenceType
- startDate: Date
- endDate: Date
- totalDays: integer (calculated)
- reason: text
- status: AbsenceStatus (PENDING, APPROVED, REJECTED, CANCELLED)
- requestedAt: DateTime
- reviewedBy: UUID (FK → Users, nullable)
- reviewedAt: DateTime (nullable)
- reviewNotes: text
- attachmentUrl: string (medical certificate, etc.)
- createdAt, updatedAt, deletedAt

AbsenceBalance Entity:
- id: UUID (PK)
- agentId: UUID (FK → Users)
- year: integer
- vacationDaysAllocated: integer
- vacationDaysUsed: integer
- vacationDaysRemaining: integer (calculated)
- sickDaysUsed: integer
- unpaidDaysUsed: integer
- updatedAt: DateTime
```

**Estimated Time:** 2 days

---

### [ ] 10. Check-lists & Quality Control (0% - CRITICAL)

**Priority:** 🔴 CRITICAL - Quality control requirement from operations

**Required Features:**
- [ ] Checklist templates from operations document
- [ ] Daily tasks template (Hall, Bureaux, Sanitaires, Cuisine, Terrasses, etc.)
- [ ] Weekly tasks template
- [ ] Monthly tasks template
- [ ] Quarterly tasks template
- [ ] Bureau-by-bureau tracking (Bureau 1 ✓ Nettoyé ✓ Désinfecté)
- [ ] Zone-specific checklists
- [ ] Photo requirements per task
- [ ] Time tracking per zone/task
- [ ] Completion percentage tracking
- [ ] Quality scoring (Zone Chief verification)
- [ ] Daily/Weekly/Monthly report generation
- [ ] Template management (CRUD)
- [ ] Checklist instance per intervention

**Business Rules:**
- Each intervention must use appropriate checklist template
- Agents complete checklist items during intervention
- Photos required for proof of completion
- Zone Chiefs verify checklist completion
- Incomplete checklists block intervention completion
- Reports consolidate data from multiple sites

**Endpoints Needed:**
- POST /api/checklist-templates
- GET /api/checklist-templates
- GET /api/checklist-templates/:id
- PATCH /api/checklist-templates/:id
- DELETE /api/checklist-templates/:id
- GET /api/checklists/intervention/:interventionId
- POST /api/checklists (create from template)
- PATCH /api/checklists/:id/item/:itemId (mark complete)
- POST /api/checklists/:id/photo (upload photo)
- GET /api/checklists/:id/report
- GET /api/reports/daily/:date
- GET /api/reports/weekly/:startDate
- GET /api/reports/monthly/:year/:month

**Database Schema:**
```typescript
ChecklistTemplate Entity:
- id: UUID (PK)
- name: string (Checklist Quotidienne, Hebdomadaire, etc.)
- frequency: ChecklistFrequency (DAILY, WEEKLY, MONTHLY, QUARTERLY)
- siteSize: SiteSize (SMALL, MEDIUM, LARGE - nullable for all)
- zones: JSON[] (array of zone configs)
  [
    { name: "Bureaux", tasks: ["Vider poubelles", "Dépoussiérage", ...] },
    { name: "Sanitaires", tasks: ["Nettoyer installations", ...] }
  ]
- isActive: boolean
- createdAt, updatedAt, deletedAt

ChecklistInstance Entity:
- id: UUID (PK)
- interventionId: UUID (FK → Interventions)
- templateId: UUID (FK → ChecklistTemplate)
- startedAt: DateTime
- completedAt: DateTime (nullable)
- completionPercentage: integer (0-100)
- qualityScore: integer (1-5, from Zone Chief review)
- reviewedBy: UUID (FK → Users, nullable)
- reviewNotes: text
- createdAt, updatedAt

ChecklistItem Entity:
- id: UUID (PK)
- checklistInstanceId: UUID (FK → ChecklistInstance)
- zoneName: string (Bureau 1, Sanitaire 2, etc.)
- taskDescription: text
- isCompleted: boolean
- completedAt: DateTime (nullable)
- completedBy: UUID (FK → Users, nullable)
- photoUrls: string[] (array of photo URLs)
- notes: text
- qualityRating: integer (1-5)
- createdAt, updatedAt
```

**Estimated Time:** 3-4 days

---

### [ ] 11. Mobile Backend APIs (0% - CRITICAL)

**Priority:** 🔴 CRITICAL - Agents can't work without mobile app

**Required Features:**
- [ ] Agent daily mission list
- [ ] Mission details (site, tasks, checklist)
- [ ] GPS check-in endpoint
- [ ] GPS check-out endpoint
- [ ] Photo upload endpoint (multiple photos per intervention)
- [ ] Checklist task completion endpoint
- [ ] Real-time status updates
- [ ] Offline support (sync when back online)
- [ ] Push notification integration
- [ ] Agent location tracking
- [ ] Emergency incident reporting
- [ ] Chat/messaging with Zone Chief
- [ ] Document access (site instructions, safety docs)

**Endpoints Needed:**
- GET /api/mobile/missions/today (today's interventions for logged-in agent)
- GET /api/mobile/missions/upcoming (next 7 days)
- GET /api/mobile/missions/:id (mission details)
- POST /api/mobile/missions/:id/checkin (GPS checkin)
- POST /api/mobile/missions/:id/checkout (GPS checkout)
- POST /api/mobile/missions/:id/photos (upload photos)
- POST /api/mobile/missions/:id/checklist/item/:itemId (mark task complete)
- GET /api/mobile/missions/:id/checklist (get full checklist)
- PATCH /api/mobile/missions/:id/status (update status)
- POST /api/mobile/incidents (report incident)
- GET /api/mobile/profile (agent profile)
- GET /api/mobile/notifications (agent notifications)
- POST /api/mobile/sync (offline sync)
- GET /api/mobile/documents (site-specific documents)

**Additional Requirements:**
- JWT authentication (same as web)
- File upload handling (photos up to 5MB each)
- GPS coordinate validation
- Real-time status broadcasting (WebSocket or SSE)
- Compression for mobile data efficiency
- Rate limiting for uploads

**Estimated Time:** 4-5 days

---

### [ ] 12. Notifications System (0% - HIGH)

**Priority:** 🟠 HIGH - Important for communication

**Required Features:**
- [ ] In-app notifications
- [ ] Push notifications (mobile)
- [ ] SMS notifications (optional)
- [ ] Email notifications (optional)
- [ ] Notification preferences per user
- [ ] Notification types:
  - [ ] New mission assignment
  - [ ] Schedule change
  - [ ] Absence approval/rejection
  - [ ] Quality issue alert
  - [ ] Emergency notification
  - [ ] Daily reminder
  - [ ] Checklist not completed warning
- [ ] Notification history
- [ ] Mark as read/unread
- [ ] Real-time delivery

**Endpoints Needed:**
- GET /api/notifications (user's notifications)
- GET /api/notifications/unread
- PATCH /api/notifications/:id/read
- PATCH /api/notifications/mark-all-read
- DELETE /api/notifications/:id
- GET /api/notifications/preferences
- PATCH /api/notifications/preferences
- POST /api/notifications/test (admin: send test notification)

**Implementation:**
- Firebase Cloud Messaging (FCM) for push notifications
- WebSocket or Server-Sent Events for real-time in-app
- Optional: Twilio for SMS
- Optional: SendGrid/Mailgun for email

**Database Schema:**
```typescript
Notification Entity:
- id: UUID (PK)
- userId: UUID (FK → Users)
- type: NotificationType
- title: string
- message: text
- data: JSON (additional context)
- isRead: boolean
- readAt: DateTime (nullable)
- priority: NotificationPriority (LOW, MEDIUM, HIGH, URGENT)
- actionUrl: string (nullable - deep link)
- createdAt: DateTime

NotificationPreference Entity:
- id: UUID (PK)
- userId: UUID (FK → Users)
- notificationType: NotificationType
- enableInApp: boolean
- enablePush: boolean
- enableSMS: boolean
- enableEmail: boolean
- updatedAt: DateTime
```

**Estimated Time:** 3 days

---

## 📊 Implementation Timeline

### Phase 1A: Core Business Logic ✅ 50% COMPLETE
**Priority:** CRITICAL - Foundation for operations

- [x] **Week 1:** ✅ COMPLETED (January 15, 2026)
  - [x] Day 1-2: Contracts Module (entity, DTOs, basic CRUD) ✅
  - [x] Day 3-4: Contracts Module (status management, business rules) ✅
  - [ ] Day 5: Zones Module (entity, DTOs, CRUD) - NEXT

- [ ] **Week 2:**
  - [ ] Day 1-2: Site/Agent Assignments to Zones
  - [ ] Day 3: Database schema updates and migrations
  - [ ] Day 4-5: Testing and documentation

---

### Phase 1B: Operations Management
**Priority:** CRITICAL - Daily operations

- [ ] **Week 3:**
  - [ ] Day 1-3: Interventions Module (entity, DTOs, CRUD, status management)
  - [ ] Day 4-5: Planning/Scheduling Module (entity, DTOs, schedule generation)

- [ ] **Week 4:**
  - [ ] Day 1-2: Scheduling (recurrence patterns, conflict detection)
  - [ ] Day 3-4: Checklist Templates Module (from operations document)
  - [ ] Day 5: Testing and documentation

---

### Phase 1C: Quality Control & Mobile
**Priority:** CRITICAL - Quality and field operations

- [ ] **Week 5:**
  - [ ] Day 1-3: Checklist Instances (completion tracking, photo uploads)
  - [ ] Day 4-5: Mobile Backend APIs (mission list, GPS tracking)

- [ ] **Week 6:**
  - [ ] Day 1-2: Mobile APIs (photo uploads, checklist completion)
  - [ ] Day 3-4: Mobile APIs (offline sync, real-time updates)
  - [ ] Day 5: Testing and documentation

---

### Phase 1D: Supporting Features
**Priority:** HIGH - Enhanced functionality

- [ ] **Week 7:**
  - [ ] Day 1-2: Absences Module
  - [ ] Day 3-5: Notifications System
  - [ ] Day 6-7: Integration testing and bug fixes

---

### Phase 1E: Testing & Documentation
**Priority:** CRITICAL - Quality assurance

- [ ] **Week 8:**
  - [ ] Day 1-2: End-to-end testing
  - [ ] Day 3: Performance testing
  - [ ] Day 4-5: Documentation updates
  - [ ] Day 6-7: Bug fixes and refinements

---

## 🔍 Testing Checklist

### Unit Tests
- [ ] All service methods have unit tests
- [ ] All DTOs validated with test cases
- [ ] Business logic edge cases covered
- [ ] Error handling tested

### Integration Tests
- [ ] API endpoints tested with Postman/Thunder Client
- [ ] Database operations tested
- [ ] Authentication/authorization tested
- [ ] File uploads tested
- [ ] GPS coordinate validation tested

### End-to-End Tests
- [ ] Complete intervention workflow (create → assign → execute → complete)
- [ ] Contract creation → schedule generation → intervention creation
- [ ] Agent mobile flow (login → view missions → checkin → complete → checkout)
- [ ] Zone Chief workflow (review interventions → verify quality → generate reports)
- [ ] Absence request → approval → schedule adjustment

### Performance Tests
- [ ] API response times < 200ms for most endpoints
- [ ] Photo upload handles 5MB files
- [ ] Batch operations handle 100+ records
- [ ] Schedule generation for full month completes in < 5 seconds
- [ ] Report generation for 47 sites completes in < 10 seconds

---

## 📋 Documentation Checklist

### API Documentation
- [ ] All endpoints documented in Swagger/OpenAPI
- [ ] Request/response examples for each endpoint
- [ ] Error codes and messages documented
- [ ] Authentication requirements specified

### Module READMEs
- [ ] Contracts module README
- [ ] Interventions module README
- [ ] Zones module README
- [ ] Checklists module README
- [ ] Absences module README
- [ ] Mobile APIs README
- [ ] Notifications README

### Database Documentation
- [ ] Complete database schema diagram
- [ ] Entity relationships documented
- [ ] Indexes documented
- [ ] Migration scripts documented

### Deployment Documentation
- [ ] Environment variables documented
- [ ] Deployment steps documented
- [ ] Database setup instructions
- [ ] Third-party service setup (Firebase, file storage)

---
