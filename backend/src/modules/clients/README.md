# Clients Module

## What This Module Does

Manages customer records for Nettoyage Plus. A client is any person or organization that contracts cleaning services with the company.

## Key Features

**Client Information Stored:**
- Basic details: Name, email, phone, address
- Client type: Individual person, single company, or multi-location organization
- Status: Prospect (potential), Active, Suspended, or Terminated
- Unique client code automatically assigned (CLI-0001, CLI-0002, etc.)
- Optional link to user account for client portal access

**What You Can Do:**
- Create new clients individually or in bulk
- Search and filter clients by type, status, city, or keywords
- Update client information
- Temporarily delete clients (can be restored later)
- View all sites and contracts belonging to a client

**Business Rules:**
- Each client gets a unique code when created
- Email addresses must be unique
- Clients need verified email to request services online
- Cannot delete clients that have active sites

## Available Functions

**create()** - Creates a new client with auto-generated client code

**createBatch()** - Creates multiple clients at once, returns successes and errors

**findAll()** - Lists all clients with pagination, filtering by type/status/city, and search

**findOne()** - Finds a single client by ID, email, or name

**findById()** - Gets a specific client by their unique ID

**update()** - Updates client information (validates email uniqueness)

**updateBatch()** - Updates multiple clients at once

**remove()** - Soft deletes a client (can be restored later)

**removeBatch()** - Soft deletes multiple clients at once

**restore()** - Restores a previously deleted client

**restoreBatch()** - Restores multiple deleted clients at once

**generateClientCode()** - Internal function that creates unique client codes (CLI-0001, CLI-0002, etc.)

## Files Structure

```
clients/
├── dto/
│   ├── index.ts                  # Barrel export
│   ├── create-client.dto.ts      # Create client validation
│   ├── update-client.dto.ts      # Update client validation
│   ├── search-client.dto.ts      # Search/pagination params
│   └── batch-operations.dto.ts   # Batch operation DTOs
├── entities/
│   └── client.entity.ts          # Client database entity
├── clients.controller.ts         # HTTP endpoints
├── clients.service.ts            # Business logic
├── clients.module.ts             # Module definition
└── README.md                     # This file
```
