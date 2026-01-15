# Contracts Module

This module manages service contracts between Nettoyage Plus and its clients. Contracts define the terms of cleaning services, including type (permanent or one-time), frequency, pricing, and service scope.

## Purpose

- Manage permanent and one-time service contracts
- Link contracts to clients and sites
- Track contract lifecycle (draft, active, suspended, completed, terminated)
- Define service scope and pricing
- Support contract renewal

## Key Features

- **Contract Types**: PERMANENT (recurring) and ONE_TIME (single intervention)
- **Frequencies**: DAILY, WEEKLY, BIWEEKLY, MONTHLY, QUARTERLY, CUSTOM
- **Status Tracking**: DRAFT → ACTIVE → SUSPENDED/COMPLETED/TERMINATED
- **Auto-Generated Codes**: CNT-0001, CNT-0002, etc.
- **Batch Operations**: Create, update, delete, and restore multiple contracts
- **Business Rules**: Validates client/site relationships, date ranges, and status transitions

## Business Rules

1. **Contract must reference existing client and site**
2. **Site must belong to the specified client**
3. **End date must be after start date**
4. **Permanent contracts require frequency**
5. **Active contracts cannot be deleted** (must be suspended or terminated first)
6. **Only active/suspended contracts can be terminated**

## Endpoints

### Single Operations
- `POST /api/contracts` - Create contract
- `GET /api/contracts` - List all contracts (with filters)
- `GET /api/contracts/search` - Search contracts
- `GET /api/contracts/:id` - Get single contract
- `PATCH /api/contracts/:id` - Update contract
- `DELETE /api/contracts/:id` - Soft delete contract
- `POST /api/contracts/:id/restore` - Restore deleted contract

### Batch Operations
- `POST /api/contracts/batch` - Create multiple contracts
- `PATCH /api/contracts/batch/update` - Update multiple contracts
- `POST /api/contracts/batch/delete` - Delete multiple contracts
- `POST /api/contracts/batch/restore` - Restore multiple contracts

### Contract Actions
- `POST /api/contracts/:id/suspend` - Suspend active contract
- `POST /api/contracts/:id/terminate` - Terminate contract
- `POST /api/contracts/:id/renew` - Create renewal contract

## Available Functions

### ContractsService

- `create(dto)` - Create a new contract
- `createBatch(dto)` - Create multiple contracts
- `findAll(page, limit, filters)` - Get all contracts with pagination
- `search(dto)` - Search contracts by criteria
- `findOne(id)` - Find contract by ID
- `update(id, dto)` - Update existing contract
- `updateBatch(dto)` - Update multiple contracts
- `remove(id)` - Soft delete contract
- `removeBatch(dto)` - Soft delete multiple contracts
- `restore(id)` - Restore deleted contract
- `restoreBatch(dto)` - Restore multiple contracts
- `suspend(id)` - Suspend active contract
- `terminate(id)` - Terminate contract
- `renew(id, startDate, endDate)` - Create renewal contract
- `generateContractCode()` - Generate unique code (private)
- `validateClientAndSite(clientId, siteId)` - Validate references (private)
- `validateDates(startDate, endDate)` - Validate date ranges (private)
- `validateContractType(dto)` - Validate type/frequency (private)

## Contract Data Structure

```typescript
Contract {
  id: UUID
  contractCode: string (CNT-0001)
  clientId: UUID
  siteId: UUID
  type: ContractType (PERMANENT | ONE_TIME)
  frequency: ContractFrequency (DAILY | WEEKLY | MONTHLY | etc.)
  startDate: Date
  endDate: Date (nullable)
  status: ContractStatus (DRAFT | ACTIVE | SUSPENDED | COMPLETED | TERMINATED)
  pricing: JSON { hourlyRate?, monthlyFee?, currency, billingCycle, etc. }
  serviceScope: JSON { zones[], tasks[], schedules[], specialInstructions }
  notes: string
  createdAt: DateTime
  updatedAt: DateTime
  deletedAt: DateTime (soft delete)
}
```

## Role Permissions

- **SUPER_ADMIN, DIRECTOR, SECTOR_CHIEF**: Full access (create, update, delete, restore, suspend, terminate, renew)
- **ASSISTANT**: Create, update, view
- **ZONE_CHIEF, TEAM_CHIEF**: View only
- **ACCOUNTANT**: View only (for billing)
- **AGENT, CLIENT**: No access

## Database Relations

- **Client** (Many-to-One): Each contract belongs to one client
- **Site** (Many-to-One): Each contract belongs to one site
- **Cascade**: RESTRICT on client/site delete (cannot delete if contracts exist)

## Usage Example

```typescript
// Create permanent daily contract
POST /api/contracts
{
  "clientId": "uuid",
  "siteId": "uuid",
  "type": "PERMANENT",
  "frequency": "DAILY",
  "startDate": "2026-02-01",
  "pricing": {
    "monthlyFee": 50000,
    "currency": "MRU",
    "billingCycle": "MONTHLY"
  },
  "serviceScope": {
    "zones": ["Reception", "Bureaux", "Sanitaires"],
    "tasks": ["Nettoyage", "Désinfection"],
    "schedules": [
      { "startTime": "07:00", "endTime": "15:00" }
    ]
  }
}
```

## Files

- `entities/contract.entity.ts` - Contract database entity
- `dto/` - Data transfer objects (create, update, search, batch)
- `contracts.service.ts` - Business logic
- `contracts.controller.ts` - API endpoints
- `contracts.module.ts` - Module definition

## Related Modules

- **Clients**: Contract must reference existing client
- **Sites**: Contract must reference existing site
- **Interventions**: Contracts generate scheduled interventions (future)
