# Absences Module

## Overview
The **Absences Module** manages employee absence tracking including vacation requests, sick leave, and other types of absences. It provides a complete workflow from request submission through approval/rejection.

## Key Features
- ✅ **Absence Request Management**: Agents can submit absence requests
- ✅ **Approval Workflow**: Zone Chiefs and supervisors can approve/reject requests
- ✅ **Absence Types**: VACATION, SICK_LEAVE, UNPAID, AUTHORIZED, UNAUTHORIZED
- ✅ **Status Tracking**: PENDING, APPROVED, REJECTED, CANCELLED
- ✅ **Conflict Detection**: Prevents overlapping approved absences
- ✅ **Working Days Calculation**: Automatically calculates total working days (excludes weekends)
- ✅ **Absence Balance**: Track vacation days used/remaining per year
- ✅ **Calendar View**: See absences for a date range or zone
- ✅ **Self-Cancellation**: Agents can cancel their own pending/approved absences

## Entities

### Absence
- `id` (UUID, Primary Key)
- `agentId` (UUID, Foreign Key → Users)
- `absenceType` (Enum) - VACATION, SICK_LEAVE, UNPAID, AUTHORIZED, UNAUTHORIZED
- `startDate` (Date)
- `endDate` (Date)
- `totalDays` (Number) - Working days between start and end (auto-calculated, excludes weekends)
- `reason` (Text) - Agent's reason for absence
- `status` (Enum) - PENDING, APPROVED, REJECTED, CANCELLED
- `requestedAt` (DateTime) - When request was submitted
- `reviewedBy` (UUID, Foreign Key → Users, nullable) - Who approved/rejected
- `reviewedAt` (DateTime, nullable)
- `reviewNotes` (Text, nullable) - Reason for approval/rejection
- `attachmentUrl` (String, nullable) - URL to medical certificate or supporting document
- `createdAt`, `updatedAt`, `deletedAt` (Timestamps)

## API Endpoints

### 1. Create Absence Request
- **POST** `/api/absences`
- **Body**: CreateAbsenceDto
  ```json
  {
    "agentId": "uuid",
    "absenceType": "VACATION",
    "startDate": "2026-02-01",
    "endDate": "2026-02-07",
    "reason": "Congés annuels",
    "attachmentUrl": "https://..." // Optional
  }
  ```
- **Access**: AGENT, TEAM_CHIEF
- **Returns**: Created absence with PENDING status
- **Validation**:
  - Agent must exist and have AGENT/TEAM_CHIEF role
  - End date must be after start date
  - Cannot overlap with existing approved absences
  - Calculates working days automatically

### 2. Get All Absences
- **GET** `/api/absences?agentId=...&zoneId=...&type=...&status=...&dateFrom=...&dateTo=...`
- **Query Params**:
  - `agentId` (Optional) - Filter by specific agent
  - `zoneId` (Optional) - Filter by zone (all agents in that zone)
  - `type` (Optional) - Filter by absence type
  - `status` (Optional) - Filter by status
  - `dateFrom` (Optional) - Filter absences ending on or after this date
  - `dateTo` (Optional) - Filter absences starting on or before this date
- **Access**: All authenticated users
- **Returns**: Array of absences with agent and reviewer details

### 3. Get Pending Absences
- **GET** `/api/absences/pending`
- **Access**: ZONE_CHIEF, SECTOR_CHIEF, DIRECTOR, SUPER_ADMIN
- **Returns**: All absences awaiting approval, sorted by request date

### 4. Get Absence Calendar
- **GET** `/api/absences/calendar?zoneId=...&dateFrom=...&dateTo=...`
- **Query Params**:
  - `zoneId` (Optional) - Filter by zone
  - `dateFrom` (Optional) - Start date (defaults to first day of current month)
  - `dateTo` (Optional) - End date (defaults to last day of current month)
- **Access**: All authenticated users
- **Returns**: Approved absences in date range for calendar display

### 5. Get Absence Balance
- **GET** `/api/absences/balance/:agentId?year=2026`
- **Params**: agentId (UUID)
- **Query**: year (Optional, defaults to current year)
- **Access**: All authenticated users
- **Returns**: Absence balance for the year
  ```json
  {
    "year": 2026,
    "vacationDaysAllocated": 25,
    "vacationDaysUsed": 10,
    "vacationDaysRemaining": 15,
    "sickDaysUsed": 3,
    "unpaidDaysUsed": 0,
    "authorizedDaysUsed": 2
  }
  ```
- **Note**: French law allocates 25 vacation days per year

### 6. Get Single Absence
- **GET** `/api/absences/:id`
- **Access**: All authenticated users
- **Returns**: Absence details with relations

### 7. Update Absence
- **PATCH** `/api/absences/:id`
- **Body**: UpdateAbsenceDto (partial CreateAbsenceDto)
- **Access**: AGENT, TEAM_CHIEF (only their own)
- **Returns**: Updated absence
- **Validation**:
  - Only agent who created it can update
  - Can only update if status is PENDING
  - Recalculates working days if dates changed

### 8. Review Absence (Approve/Reject)
- **POST** `/api/absences/:id/review`
- **Body**: ReviewAbsenceDto
  ```json
  {
    "status": "APPROVED", // or "REJECTED"
    "reviewNotes": "Approved for requested dates"
  }
  ```
- **Access**: ZONE_CHIEF, SECTOR_CHIEF, DIRECTOR, SUPER_ADMIN
- **Returns**: Updated absence with review details
- **Validation**:
  - Can only review if status is PENDING
  - Status must be APPROVED or REJECTED
  - Records reviewer ID and timestamp

### 9. Cancel Absence
- **POST** `/api/absences/:id/cancel`
- **Access**: AGENT, TEAM_CHIEF (only their own)
- **Returns**: Absence with CANCELLED status
- **Validation**:
  - Only agent who created it can cancel
  - Cannot cancel if already started (past start date)
  - Cannot cancel if already REJECTED

### 10. Delete Absence
- **DELETE** `/api/absences/:id`
- **Access**: SUPER_ADMIN, DIRECTOR only
- **Returns**: Success message
- **Note**: Soft delete (deletedAt timestamp)

## Business Rules

### Absence Request Rules
1. Only AGENT and TEAM_CHIEF roles can request absences
2. End date must be after or equal to start date
3. Cannot create overlapping approved absences for the same agent
4. Working days calculated automatically (excludes weekends: Saturday, Sunday)
5. Status defaults to PENDING on creation

### Approval Rules
1. Only ZONE_CHIEF, SECTOR_CHIEF, DIRECTOR, SUPER_ADMIN can approve/reject
2. Can only review absences with PENDING status
3. Review status must be APPROVED or REJECTED (not PENDING or CANCELLED)
4. Reviewer ID and timestamp are recorded automatically

### Cancellation Rules
1. Only the agent who created the absence can cancel it
2. Cannot cancel absences that have already started (past start date)
3. Cannot cancel REJECTED absences (no need to cancel what was denied)
4. Approved absences can be cancelled before they start

### Balance Calculation
1. Standard allocation: 25 vacation days per year (French legal requirement)
2. Only APPROVED absences count toward totals
3. Balance calculated for specific calendar year
4. Separate tracking for: VACATION, SICK_LEAVE, UNPAID, AUTHORIZED

## Usage Examples

### Example 1: Agent Requests Vacation
```bash
# Agent requests 5 days vacation
POST /api/absences
{
  "agentId": "agent-uuid",
  "absenceType": "VACATION",
  "startDate": "2026-03-10",
  "endDate": "2026-03-14",
  "reason": "Vacances familiales"
}

Response:
{
  "id": "absence-uuid",
  "agentId": "agent-uuid",
  "absenceType": "VACATION",
  "startDate": "2026-03-10",
  "endDate": "2026-03-14",
  "totalDays": 5, // Calculated automatically
  "status": "PENDING",
  "requestedAt": "2026-01-15T10:30:00Z",
  ...
}
```

### Example 2: Zone Chief Approves Request
```bash
# Zone Chief reviews and approves
POST /api/absences/absence-uuid/review
{
  "status": "APPROVED",
  "reviewNotes": "Approved - no conflicts with schedule"
}

Response:
{
  "id": "absence-uuid",
  "status": "APPROVED",
  "reviewedBy": "zone-chief-uuid",
  "reviewedAt": "2026-01-15T14:00:00Z",
  "reviewNotes": "Approved - no conflicts with schedule",
  ...
}
```

### Example 3: Check Agent Balance
```bash
# Check how many vacation days left
GET /api/absences/balance/agent-uuid?year=2026

Response:
{
  "year": 2026,
  "vacationDaysAllocated": 25,
  "vacationDaysUsed": 10,
  "vacationDaysRemaining": 15,
  "sickDaysUsed": 2,
  "unpaidDaysUsed": 0,
  "authorizedDaysUsed": 1
}
```

### Example 4: View Zone Absences Calendar
```bash
# See all approved absences in Zone 1 for February
GET /api/absences/calendar?zoneId=zone1-uuid&dateFrom=2026-02-01&dateTo=2026-02-29

Response: [
  {
    "id": "absence1-uuid",
    "agent": { "firstName": "Jean", "lastName": "Dupont" },
    "absenceType": "VACATION",
    "startDate": "2026-02-10",
    "endDate": "2026-02-14",
    "totalDays": 5
  },
  {
    "id": "absence2-uuid",
    "agent": { "firstName": "Marie", "lastName": "Martin" },
    "absenceType": "SICK_LEAVE",
    "startDate": "2026-02-20",
    "endDate": "2026-02-21",
    "totalDays": 2
  }
]
```

## Integration with Other Modules

### With Schedules Module
- Check agent absences before generating interventions
- Automatically exclude unavailable agents from scheduling
- Trigger schedule adjustments when absence approved

### With Zones Module
- Zone Chiefs see absences for their zone agents
- Filter absences by zone for capacity planning

### With Users Module
- Validate agent roles before allowing absence requests
- Track reviewer identity for audit trail

## Error Handling

- **404 Not Found**: Absence or agent doesn't exist
- **400 Bad Request**: Invalid dates, overlapping absences, invalid status transitions
- **403 Forbidden**: User doesn't have permission to perform action
- **422 Unprocessable Entity**: Validation errors in DTO

## Performance Considerations

- Working days calculation is efficient for typical absence durations (1-30 days)
- Overlapping absence check uses database queries (indexed on agentId and dates)
- Balance calculation aggregates approved absences (cached results recommended for high traffic)

## Future Enhancements

- [ ] Email/SMS notifications on approval/rejection
- [ ] Configurable vacation day allocations per agent
- [ ] Carry-over of unused vacation days to next year
- [ ] Holidays calendar integration (exclude public holidays from working days)
- [ ] Absence quotas per type (max sick days, etc.)
- [ ] Bulk approval/rejection for multiple requests
- [ ] Absence reports and analytics (most common types, peak periods)
- [ ] Integration with payroll system

---

**Module Status**: ✅ Complete and ready for testing
**Last Updated**: January 15, 2026
