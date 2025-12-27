# Database Schema - Nettoyage Plus

**Last Updated:** December 27, 2025

---

## Core Entities

### Users
- id (UUID, PK)
- email, password_hash
- role (enum: ADMIN, SUPERVISOR, ZONE_CHIEF, TEAM_CHIEF, AGENT, ACCOUNTANT, QUALITY_CONTROLLER, CLIENT)
- status (enum: ACTIVE, SUSPENDED, ARCHIVED)
- createdAt, updatedAt, deletedAt

### Clients
- id (UUID, PK)
- name, type (enum: INDIVIDUAL, COMPANY, MULTI_SITE)
- contact (email, phone, address)
- status (enum: ACTIVE, SUSPENDED, TERMINATED)
- createdAt, updatedAt, deletedAt

### Sites
- id (UUID, PK)
- clientId (FK → Clients)
- name, address, access_instructions
- size (enum: SMALL, MEDIUM, LARGE)
- working_hours
- createdAt, updatedAt, deletedAt

### Contracts
- id (UUID, PK)
- clientId (FK → Clients)
- siteId (FK → Sites)
- type (enum: PERMANENT, ONE_TIME)
- start_date, end_date
- frequency (for permanent: DAILY, WEEKLY, etc.)
- status (enum: ACTIVE, SUSPENDED, COMPLETED)
- createdAt, updatedAt, deletedAt

### Interventions
- id (UUID, PK)
- contractId (FK → Contracts)
- siteId (FK → Sites)
- type (enum: RECURRING, ONE_TIME)
- scheduled_date, completed_date
- status (enum: PLANNED, IN_PROGRESS, COMPLETED, CANCELLED)
- createdAt, updatedAt, deletedAt

### Employees
- id (UUID, PK)
- userId (FK → Users)
- personal_info (name, ID card, contract_type)
- zoneId (FK → Zones)
- status (enum: ACTIVE, ABSENT, ON_LEAVE)
- createdAt, updatedAt, deletedAt

### Zones
- id (UUID, PK)
- name (zone_1, zone_2, etc.)
- chiefId (FK → Employees) - Zone Chief
- createdAt, updatedAt, deletedAt

---

## Operations

### Assignments
- id (UUID, PK)
- interventionId (FK → Interventions)
- employeeId (FK → Employees)
- role (enum: CHIEF, AGENT)
- createdAt, updatedAt, deletedAt

### Attendance
- id (UUID, PK)
- employeeId (FK → Employees)
- siteId (FK → Sites)
- check_in_time, check_out_time
- gps_location (lat, lng)
- photo_url
- date
- createdAt

### CheckLists
- id (UUID, PK)
- interventionId (FK → Interventions)
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