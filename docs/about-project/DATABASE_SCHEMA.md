# Database Schema - Nettoyage Plus

**Last Updated:** January 15, 2026  
**Status:** All 13 entities implemented and synced with code

---

## Implemented Core Entities (✅ Complete)

### Users
- id (UUID, PK)
- email (unique), password (bcrypt hashed)
- firstName, lastName, phone
- role (enum: SUPER_ADMIN, DIRECTOR, ASSISTANT, SECTOR_CHIEF, ZONE_CHIEF, TEAM_CHIEF, AGENT, QUALITY_CONTROLLER, ACCOUNTANT, CLIENT)
- status (enum: ACTIVE, SUSPENDED, ARCHIVED)
- emailVerified (boolean, default: false)
- emailVerifiedAt (DateTime, nullable)
- failedLoginAttempts (integer, default: 0)
- lastFailedLoginAt (DateTime, nullable)
- lastLoginAt (DateTime, nullable)
- createdAt, updatedAt, deletedAt (soft delete)

### Clients
- id (UUID, PK)
- clientCode (unique, auto-generated: CLI-0001, CLI-0002, etc.)
- name, type (enum: INDIVIDUAL, COMPANY, MULTI_SITE)
- userId (FK → Users, nullable, SET NULL on delete) - for client portal login
- email (unique, nullable), phone, address, city, postalCode, country
- contactPerson, contactPhone - secondary contact
- notes (text)
- status (enum: PROSPECT, ACTIVE, SUSPENDED, TERMINATED)
- createdAt, updatedAt, deletedAt

### Sites
- id (UUID, PK)
- clientId (FK → Clients, CASCADE on delete)
- name, size (enum: SMALL, MEDIUM, LARGE, default: MEDIUM)
- address, city, postalCode, country (location details)
- accessInstructions (text), workingHours (e.g., "Mon-Fri 8:00-17:00")
- contactPerson, contactPhone, contactEmail (on-site contact)
- notes (text)
- status (enum: ACTIVE, INACTIVE, UNDER_MAINTENANCE, CLOSED, default: ACTIVE)
- createdAt, updatedAt, deletedAt

### Contracts
- id (UUID, PK)
- contractCode (unique, auto-generated: CNT-0001, CNT-0002, etc.)
- clientId (FK → Clients, RESTRICT on delete)
- siteId (FK → Sites, RESTRICT on delete)
- type (enum: PERMANENT, ONE_TIME)
- frequency (enum: DAILY, WEEKLY, BIWEEKLY, MONTHLY, QUARTERLY, CUSTOM - required for PERMANENT)
- startDate, endDate (Date, endDate nullable for indefinite)
- status (enum: DRAFT, ACTIVE, SUSPENDED, COMPLETED, TERMINATED)
- pricing (JSONB: hourly rate, monthly fee, etc.)
- serviceScope (JSONB: tasks, zones, schedules)
- notes (text)
- createdAt, updatedAt, deletedAt

### Zones
- id (UUID, PK)
- zoneName (string, e.g., "Zone Nord", "Zone Sud")
- zoneCode (unique, e.g., "Z1", "Z2")
- zoneChiefId (FK → Users, nullable, role: ZONE_CHIEF)
- status (enum: ACTIVE, INACTIVE, REORGANIZING)
- description (text)
- createdAt, updatedAt, deletedAt

### SiteAssignment
- id (UUID, PK)
- siteId (FK → Sites, CASCADE on delete)
- zoneId (FK → Zones, CASCADE on delete)
- assignedAt (DateTime)
- unassignedAt (DateTime, nullable)
- isActive (boolean)
- createdAt, updatedAt

### AgentZoneAssignment
- id (UUID, PK)
- userId (FK → Users, CASCADE on delete)
- zoneId (FK → Zones, CASCADE on delete)
- role (enum: ZONE_CHIEF, TEAM_CHIEF, AGENT)
- assignedAt (DateTime)
- unassignedAt (DateTime, nullable)
- isActive (boolean)
- createdAt, updatedAt

### Schedules
- id (UUID, PK)
- contractId (FK → Contracts, RESTRICT on delete)
- siteId (FK → Sites, RESTRICT on delete)
- zoneId (FK → Zones, SET NULL on delete, nullable)
- recurrencePattern (enum: DAILY, WEEKLY, BIWEEKLY, MONTHLY, QUARTERLY, CUSTOM)
- daysOfWeek (integer[], nullable, for WEEKLY: 0=Sunday, 1=Monday, etc.)
- dayOfMonth (integer, nullable, for MONTHLY: 1-31)
- startTime, endTime (Time, HH:MM format)
- status (enum: ACTIVE, PAUSED, EXPIRED)
- validFrom, validUntil (Date, validUntil nullable)
- defaultZoneChiefId, defaultTeamChiefId (UUID, nullable)
- defaultAgentIds (UUID[], nullable)
- generatedInterventionIds (string[], tracks generated interventions)
- exceptionDates (string[], ISO date strings to skip)
- notes (text)
- createdAt, updatedAt, deletedAt

### Interventions
- id (UUID, PK)
- interventionCode (unique, auto-generated: INT-0001, INT-0002, etc.)
- contractId (FK → Contracts, RESTRICT on delete)
- siteId (FK → Sites, RESTRICT on delete)
- scheduledDate (Date)
- scheduledStartTime, scheduledEndTime (Time, HH:MM format)
- actualStartTime, actualEndTime (DateTime, nullable)
- status (enum: SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED, RESCHEDULED)
- assignedZoneChiefId (FK → Users, nullable, role: ZONE_CHIEF)
- assignedTeamChiefId (FK → Users, nullable, role: TEAM_CHIEF)
- assignedAgentIds (UUID[], array of agent IDs)
- checklistTemplateId (UUID, nullable)
- checklistCompleted (boolean, default: false)
- gpsCheckInLat, gpsCheckInLng (decimal(10,7), nullable)
- gpsCheckInTime (DateTime, nullable)
- gpsCheckOutLat, gpsCheckOutLng (decimal(10,7), nullable)
- gpsCheckOutTime (DateTime, nullable)
- photoUrls (string[], array of image URLs)
- qualityScore (integer, 1-5, nullable, from Zone Chief)
- clientRating (integer, 1-5, nullable)
- clientFeedback (text, nullable)
- incidents (text, nullable)
- notes (text)
- createdAt, updatedAt, deletedAt

### ChecklistTemplate
- id (UUID, PK)
- name (string, e.g., "Checklist Quotidienne")
- description (text)
- frequency (enum: DAILY, WEEKLY, MONTHLY, QUARTERLY)
- siteSize (enum: SMALL, MEDIUM, LARGE, nullable - applies to all if null)
- zones (JSON: array of {zoneName: string, tasks: string[]})
- isActive (boolean, default: true)
- createdAt, updatedAt, deletedAt

### ChecklistInstance
- id (UUID, PK)
- interventionId (FK → Interventions, CASCADE on delete)
- templateId (FK → ChecklistTemplates, RESTRICT on delete)
- status (enum: NOT_STARTED, IN_PROGRESS, COMPLETED)
- startedAt, completedAt (DateTime, nullable)
- completionPercentage (integer, 0-100, auto-calculated)
- qualityScore (integer, 1-5, nullable, from Zone Chief review)
- reviewedBy (FK → Users, nullable)
- reviewNotes (text, nullable)
- createdAt, updatedAt

### ChecklistItem
- id (UUID, PK)
- checklistInstanceId (FK → ChecklistInstances, CASCADE on delete)
- zoneName (string, e.g., "Bureau 1", "Sanitaire 2")
- taskDescription (text)
- isCompleted (boolean, default: false)
- completedAt (DateTime, nullable)
- completedBy (FK → Users, nullable)
- notes (text, nullable)
- createdAt, updatedAt

### Absences
- id (UUID, PK)
- agentId (FK → Users, CASCADE on delete)
- absenceType (enum: VACATION, SICK_LEAVE, UNPAID, AUTHORIZED, UNAUTHORIZED)
- startDate, endDate (Date range)
- totalDays (integer, working days, auto-calculated, excludes weekends)
- reason (text, agent's explanation)
- status (enum: PENDING, APPROVED, REJECTED, CANCELLED)
- requestedAt (DateTime, when request submitted)
- reviewedBy (FK → Users, nullable, Zone Chief or supervisor)
- reviewedAt (DateTime, nullable)
- reviewNotes (text, nullable, approval/rejection reason)
- attachmentUrl (varchar(500), nullable, medical certificate, etc.)
- createdAt, updatedAt, deletedAt

**Business Rules:**
- VACATION days: 25 allocated per year (French law)
- Working days exclude weekends (Saturday, Sunday)
- Cannot overlap with existing approved absences
- Only ZONE_CHIEF and above can approve/reject

---

## Future Entities (Not Yet Implemented)
- template_type (enum: DAILY, WEEKLY, MONTHLY, QUARTERLY)
- tasks (JSON: [{task, done, remarks}])
- completed_by (FK → Employees)
- completed_at
- createdAt, updatedAt

---

## Quality Control

### QualityReports
- id (UUID, PK)
- siteId (FK → Sites)
- inspectorId (FK → Employees)
- date, score
- issues (JSON array)
- photos (array of URLs)
- status (enum: EXCELLENT, SATISFACTORY, UNSATISFACTORY)
- createdAt, updatedAt

### Incidents
- id (UUID, PK)
- siteId (FK → Sites)
- reportedBy (FK → Employees)
- description, severity (enum: LOW, MEDIUM, HIGH)
- resolution_notes
- status (enum: REPORTED, IN_PROGRESS, RESOLVED)
- createdAt, updatedAt, deletedAt

---

## Inventory

### Materials
- id (UUID, PK)
- name, category (enum: CONSUMABLE, EQUIPMENT)
- unit (e.g., liters, pieces)
- createdAt, updatedAt, deletedAt

### Stock
- id (UUID, PK)
- materialId (FK → Materials)
- siteId (FK → Sites)
- quantity, minimum_threshold
- last_restock_date
- updatedAt

### StockRequests
- id (UUID, PK)
- siteId (FK → Sites)
- requestedBy (FK → Employees)
- materialId (FK → Materials)
- quantity_requested
- status (enum: PENDING, APPROVED, DELIVERED)
- createdAt, updatedAt

---

## Financial

### Invoices
- id (UUID, PK)
- contractId (FK → Contracts)
- clientId (FK → Clients)
- amount, currency
- issue_date, due_date, paid_date
- status (enum: DRAFT, SENT, PAID, OVERDUE)
- createdAt, updatedAt, deletedAt

### Payments
- id (UUID, PK)
- invoiceId (FK → Invoices)
- amount, payment_method (enum: CASH, BANK_TRANSFER, BANKILY)
- payment_date
- reference_number
- createdAt

---

## Communication

### Notifications
- id (UUID, PK)
- recipientId (FK → Users)
- type (enum: MISSION_UPDATE, INVOICE_READY, SCHEDULE_CHANGE)
- title, message
- read (boolean)
- createdAt

### Complaints
- id (UUID, PK)
- clientId (FK → Clients)
- siteId (FK → Sites)
- description, priority (enum: LOW, MEDIUM, HIGH)
- status (enum: OPEN, IN_PROGRESS, RESOLVED, CLOSED)
- createdAt, updatedAt

### SatisfactionSurveys
- id (UUID, PK)
- clientId (FK → Clients)
- interventionId (FK → Interventions)
- rating (1-5), feedback
- submitted_at
- createdAt

---

## Employee Management

### Absences
- id (UUID, PK)
- agentId (FK → Users)
- absenceType (enum: VACATION, SICK_LEAVE, UNPAID, AUTHORIZED, UNAUTHORIZED)
- startDate, endDate (Date range)
- totalDays (integer - working days, auto-calculated, excludes weekends)
- reason (text - agent's explanation)
- status (enum: PENDING, APPROVED, REJECTED, CANCELLED)
- requestedAt (DateTime - when request submitted)
- reviewedBy (FK → Users, nullable - Zone Chief or supervisor)
- reviewedAt (DateTime, nullable)
- reviewNotes (text, nullable - approval/rejection reason)
- attachmentUrl (varchar(500), nullable - medical certificate, etc.)
- createdAt, updatedAt, deletedAt

**Business Rules:**
- VACATION days: 25 allocated per year (French law)
- Working days exclude weekends (Saturday, Sunday)
- Cannot overlap with existing approved absences
- Only ZONE_CHIEF and above can approve/reject
- Agents can cancel before start date

---

## Prevention & Safety

### PreventionPlans
- id (UUID, PK)
- siteId (FK → Sites)
- risks (JSON: [{risk, severity, prevention_measures}])
- ppe_required (JSON array: safety equipment needed)
- generated_at, valid_until
- createdAt, updatedAt

---

## Reports (Generated/Aggregated Data)

### DailyReports
- id (UUID, PK)
- zoneId (FK → Zones)
- date
- sites_visited (JSON array)
- issues_found (JSON array)
- createdBy (FK → Employees)
- createdAt

### WeeklyReports
- id (UUID, PK)
- zoneId (FK → Zones)
- week_start, week_end
- summary (JSON)
- createdBy (FK → Employees)
- createdAt

### MonthlyReports
- id (UUID, PK)
- month, year
- performance_metrics (JSON)
- createdBy (FK → Employees)
- createdAt

---

## Notes

- **All tables** include: id (UUID), createdAt, updatedAt, deletedAt (soft delete)
- **Enums** define fixed sets of values (type safety + consistency)
- **JSON fields** for flexible/complex data (arrays, nested objects)
- **Foreign Keys (FK)** maintain relationships between tables
- **Soft deletes** preserve history (deletedAt timestamp instead of hard delete)