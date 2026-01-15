# Interventions Module

## Overview
The **Interventions Module** manages actual cleaning work execution. This is the core operational module that links contracts to real-world work with GPS tracking, photo proof, and quality control.

## Key Features
- ✅ **Auto-code Generation**: INT-0001, INT-0002, etc.
- ✅ **GPS Tracking**: Check-in/out with coordinates and timestamps
- ✅ **Photo Management**: Upload and store work photos
- ✅ **Status Workflow**: SCHEDULED → IN_PROGRESS → COMPLETED/CANCELLED/RESCHEDULED
- ✅ **Quality Control**: Rating scores and feedback
- ✅ **Calendar View**: Date range filtering for scheduling
- ✅ **Contract Validation**: Ensure interventions are within contract period
- ✅ **Personnel Assignment**: Zone chiefs, team chiefs, and agents

## Entities

### Intervention
- `id` (UUID, Primary Key)
- `interventionCode` (String, Unique) - Auto-generated (INT-0001)
- `contractId` (UUID, Foreign Key → Contracts)
- `siteId` (UUID, Foreign Key → Sites)
- `scheduledDate` (Date)
- `scheduledStartTime` / `scheduledEndTime` (Time - HH:MM format)
- `actualStartTime` / `actualEndTime` (DateTime)
- `status` (Enum) - SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED, RESCHEDULED
- `assignedZoneChiefId`, `assignedTeamChiefId`, `assignedAgentIds` (Array)
- GPS fields: `gpsCheckInLat`, `gpsCheckInLng`, `gpsCheckInTime`, `gpsCheckOutLat`, `gpsCheckOutLng`, `gpsCheckOutTime`
- `photoUrls` (Array) - Uploaded work photos
- `qualityScore` (Number, 1-5)
- `clientFeedback` (Text)
- `incidentReported` (Boolean)
- `incidentDetails` (Text)
- `createdAt`, `updatedAt`, `deletedAt` (Timestamps)

## API Endpoints

### 1. Create Intervention
- **POST** `/api/interventions`
- **Body**: CreateInterventionDto
- **Access**: SUPER_ADMIN, DIRECTOR, SECTOR_CHIEF, ZONE_CHIEF, TEAM_CHIEF
- **Returns**: Created intervention with auto-generated code

### 2. Get All Interventions
- **GET** `/api/interventions?page=1&limit=10&contractId=...&siteId=...&status=...&startDate=...&endDate=...`
- **Query Params**: page, limit, contractId, siteId, status, startDate, endDate
- **Access**: All roles
- **Returns**: Paginated list with filters

### 3. Get Calendar View
- **GET** `/api/interventions/calendar?startDate=2024-01-01&endDate=2024-01-31`
- **Query Params**: startDate (required), endDate (required)
- **Access**: All roles
- **Returns**: Array of interventions in date range

### 4. Get Single Intervention
- **GET** `/api/interventions/:id`
- **Access**: All roles
- **Returns**: Intervention with relations (contract, site, personnel)

### 5. Update Intervention
- **PATCH** `/api/interventions/:id`
- **Body**: UpdateInterventionDto
- **Access**: SUPER_ADMIN, DIRECTOR, SECTOR_CHIEF, ZONE_CHIEF, TEAM_CHIEF
- **Returns**: Updated intervention

### 6. Delete Intervention
- **DELETE** `/api/interventions/:id`
- **Access**: SUPER_ADMIN, DIRECTOR, SECTOR_CHIEF
- **Returns**: Void (soft delete)

### 7. Start Intervention
- **POST** `/api/interventions/:id/start`
- **Access**: ZONE_CHIEF, TEAM_CHIEF, AGENT
- **Returns**: Intervention with status IN_PROGRESS

### 8. Complete Intervention
- **POST** `/api/interventions/:id/complete`
- **Access**: ZONE_CHIEF, TEAM_CHIEF, AGENT
- **Returns**: Intervention with status COMPLETED
- **Validation**: Requires GPS checkout

### 9. Cancel Intervention
- **POST** `/api/interventions/:id/cancel`
- **Access**: SUPER_ADMIN, DIRECTOR, SECTOR_CHIEF, ZONE_CHIEF, TEAM_CHIEF
- **Returns**: Intervention with status CANCELLED

### 10. Reschedule Intervention
- **POST** `/api/interventions/:id/reschedule`
- **Body**: RescheduleInterventionDto
- **Access**: SUPER_ADMIN, DIRECTOR, SECTOR_CHIEF, ZONE_CHIEF, TEAM_CHIEF
- **Returns**: Rescheduled intervention

### 11. GPS Check-in
- **POST** `/api/interventions/:id/checkin`
- **Body**: GpsCheckInDto (latitude, longitude, accuracy?)
- **Access**: ZONE_CHIEF, TEAM_CHIEF, AGENT
- **Returns**: Intervention with GPS check-in data and status IN_PROGRESS

### 12. GPS Check-out
- **POST** `/api/interventions/:id/checkout`
- **Body**: GpsCheckOutDto (latitude, longitude, accuracy?)
- **Access**: ZONE_CHIEF, TEAM_CHIEF, AGENT
- **Returns**: Intervention with GPS check-out data

### 13. Add Photo
- **POST** `/api/interventions/:id/photos`
- **Body**: { photoUrl: string }
- **Access**: ZONE_CHIEF, TEAM_CHIEF, AGENT
- **Returns**: Intervention with new photo added

## Business Rules

### Contract Validation
- ✅ Contract must exist and be ACTIVE
- ✅ Intervention date must be within contract start/end period
- ✅ Site must belong to contract's client

### Personnel Validation
- ✅ Must assign at least 1 agent (AGENT role)
- ✅ Zone chief must have ZONE_CHIEF role
- ✅ Team chief must have TEAM_CHIEF role

### Time Validation
- ✅ End time must be after start time
- ✅ Times follow HH:MM format (24-hour)

### Status Transitions
- ✅ SCHEDULED → IN_PROGRESS (via start() or checkIn())
- ✅ IN_PROGRESS → COMPLETED (via complete() - requires GPS checkout)
- ✅ SCHEDULED/IN_PROGRESS → CANCELLED (via cancel())
- ✅ SCHEDULED → RESCHEDULED (via reschedule())
- ❌ Cannot update/delete COMPLETED or CANCELLED interventions
- ❌ Cannot delete IN_PROGRESS interventions

### GPS Requirements
- ✅ Check-in records: latitude, longitude, timestamp, starts intervention
- ✅ Check-out records: latitude, longitude, timestamp
- ✅ Must check-in before check-out
- ✅ GPS check-out required to complete intervention

## DTOs

### CreateInterventionDto
```typescript
{
  contractId: string;          // Required
  siteId: string;              // Required
  scheduledDate: Date;         // Required
  scheduledStartTime: string;  // Required (HH:MM)
  scheduledEndTime: string;    // Required (HH:MM)
  assignedAgentIds: string[];  // Required (min 1 agent)
  assignedZoneChiefId?: string;
  assignedTeamChiefId?: string;
  specialInstructions?: string;
}
```

### UpdateInterventionDto
All fields optional:
- `scheduledDate`, `scheduledStartTime`, `scheduledEndTime`
- `assignedAgentIds`, `assignedZoneChiefId`, `assignedTeamChiefId`
- `status`, `qualityScore`, `clientFeedback`
- `incidentReported`, `incidentDetails`
- `specialInstructions`

### GpsCheckInDto / GpsCheckOutDto
```typescript
{
  latitude: number;    // -90 to 90
  longitude: number;   // -180 to 180
  accuracy?: number;   // GPS accuracy in meters
}
```

### RescheduleInterventionDto
```typescript
{
  newDate: Date;
  newStartTime: string;  // HH:MM
  newEndTime: string;    // HH:MM
}
```

## Service Methods

| Method | Description | Returns |
|--------|-------------|---------|
| `create(dto)` | Create new intervention with auto-code | Intervention |
| `findAll(filters)` | Get paginated list with filters | { data, total, page, limit } |
| `getCalendar(startDate, endDate)` | Get calendar view | Intervention[] |
| `findOne(id)` | Get single intervention | Intervention |
| `update(id, dto)` | Update intervention | Intervention |
| `remove(id)` | Soft delete | void |
| `start(id)` | Start intervention | Intervention |
| `complete(id)` | Complete intervention | Intervention |
| `cancel(id)` | Cancel intervention | Intervention |
| `reschedule(id, dto)` | Reschedule intervention | Intervention |
| `checkIn(id, gpsDto)` | GPS check-in | Intervention |
| `checkOut(id, gpsDto)` | GPS check-out | Intervention |
| `addPhoto(id, url)` | Add photo URL | Intervention |

## Dependencies
- **ContractsModule**: Validate contract status and dates
- **SitesModule**: Validate site belongs to client
- **UsersModule**: Validate personnel roles

## Integration Points
- **Planning Module** (future): Auto-generate interventions from contracts
- **Checklists Module** (future): Link quality control checklists
- **Mobile App**: Agents use for check-in/out, photos, completion

## Status
✅ **100% Complete** - Entity, DTOs, Service, Controller, Module all implemented
- 13 endpoints
- Auto-code generation
- GPS tracking
- Photo management
- Status workflow
- Contract validation
- 0 TypeScript errors
