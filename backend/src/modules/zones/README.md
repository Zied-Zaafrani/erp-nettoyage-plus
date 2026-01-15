# Zones Module

This module manages the organizational structure of Nettoyage Plus operations across 4 geographical zones. Each zone contains multiple sites and cleaning agents, managed by Zone Chiefs and Team Chiefs.

## Purpose

- Organize operations into geographical zones
- Assign sites to specific zones
- Assign agents to zones with team structure
- Track zone performance and metrics
- Support hierarchical management structure

## Key Features

- **4 Zones Structure**: Zone 1, Zone 2, Zone 3, Zone 4-5-6
- **Site Assignments**: Assign 47 sites across zones
- **Agent Assignments**: Assign 178 agents to zones
- **Team Structure**: Zone Chief → Team Chiefs → Agents
- **Assignment History**: Track reassignments over time
- **Active/Inactive Status**: Manage zone operational status

## Business Rules

1. **Each zone has one Zone Chief** (role: ZONE_CHIEF)
2. **Sites can only belong to one active zone** at a time
3. **Agents can only belong to one active zone** at a time
4. **Zone Chiefs manage 5-7 Team Chiefs**
5. **Team Chiefs manage cleaning agents** at specific sites
6. **Cannot delete zone with active assignments**
7. **Reassignment automatically deactivates previous assignment**

## Zone Distribution (From Operations Document)

- **Zone 1**: 9 sites, 37 agents
- **Zone 2**: 8 sites, 48 agents
- **Zone 3**: 11 sites, 36 agents
- **Zone 4-5-6**: 15 sites, 57 agents
- **Total**: 47 sites, 178 agents

## Endpoints

### Zone Management
- `POST /api/zones` - Create new zone
- `GET /api/zones` - List all zones
- `GET /api/zones/:id` - Get single zone
- `PATCH /api/zones/:id` - Update zone
- `DELETE /api/zones/:id` - Soft delete zone

### Assignment Management
- `POST /api/zones/:id/assign-site` - Assign site to zone
- `POST /api/zones/:id/assign-agent` - Assign agent to zone
- `GET /api/zones/:id/sites` - Get zone's sites
- `GET /api/zones/:id/agents` - Get zone's agents
- `DELETE /api/zones/assignments/site/:assignmentId` - Unassign site
- `DELETE /api/zones/assignments/agent/:assignmentId` - Unassign agent

### Performance
- `GET /api/zones/:id/performance` - Get zone metrics

## Available Functions

### ZonesService

- `create(dto)` - Create a new zone
- `findAll(includeDeleted)` - Get all zones
- `findOne(id)` - Find zone by ID
- `update(id, dto)` - Update existing zone
- `remove(id)` - Soft delete zone (only if no active assignments)
- `assignSite(zoneId, dto)` - Assign site to zone
- `assignAgent(zoneId, dto)` - Assign agent to zone
- `getZoneSites(zoneId)` - Get all active site assignments
- `getZoneAgents(zoneId)` - Get all active agent assignments
- `getZonePerformance(zoneId)` - Get zone performance metrics
- `unassignSite(assignmentId)` - Deactivate site assignment
- `unassignAgent(assignmentId)` - Deactivate agent assignment
- `validateZoneChief(userId)` - Validate user is Zone Chief (private)
- `validateTeamChief(userId)` - Validate user is Team Chief (private)
- `validateAgent(userId)` - Validate user is Agent (private)

## Data Structures

```typescript
Zone {
  id: UUID
  zoneName: string (Zone 1, Zone 2, etc.)
  zoneCode: string (Z1, Z2, etc. - unique)
  zoneChiefId: UUID (FK → Users with role ZONE_CHIEF)
  status: ZoneStatus (ACTIVE | INACTIVE | REORGANIZING)
  description: string
  createdAt: DateTime
  updatedAt: DateTime
  deletedAt: DateTime (soft delete)
}

SiteAssignment {
  id: UUID
  siteId: UUID (FK → Sites)
  zoneId: UUID (FK → Zones)
  teamChiefId: UUID (FK → Users with role TEAM_CHIEF, optional)
  startDate: Date
  endDate: Date (nullable for current assignment)
  isActive: boolean
  createdAt: DateTime
  updatedAt: DateTime
}

AgentZoneAssignment {
  id: UUID
  agentId: UUID (FK → Users with role AGENT)
  zoneId: UUID (FK → Zones)
  teamChiefId: UUID (FK → Users with role TEAM_CHIEF, optional)
  startDate: Date
  endDate: Date (nullable for current)
  isActive: boolean
  createdAt: DateTime
  updatedAt: DateTime
}
```

## Role Permissions

- **SUPER_ADMIN, DIRECTOR, SECTOR_CHIEF**: Full access (create, update, delete, assign)
- **ZONE_CHIEF**: View zones, view/assign agents in their zone
- **TEAM_CHIEF**: View zones, view assigned sites and agents
- **ASSISTANT**: View only
- **AGENT**: No access

## Database Relations

- **Zone Chief** (Many-to-One): Each zone has one Zone Chief (User)
- **Sites** (One-to-Many through SiteAssignment): Zone has multiple sites
- **Agents** (One-to-Many through AgentZoneAssignment): Zone has multiple agents
- **Team Chiefs**: Linked at site/agent assignment level
- **Cascade**: Sites and agents are CASCADE deleted from assignments

## Usage Example

```typescript
// Create Zone 1
POST /api/zones
{
  "zoneName": "Zone 1",
  "zoneCode": "Z1",
  "zoneChiefId": "uuid-of-zone-chief",
  "description": "9 sites, 37 agents"
}

// Assign site to Zone 1
POST /api/zones/{zoneId}/assign-site
{
  "siteId": "uuid-of-site",
  "teamChiefId": "uuid-of-team-chief",
  "startDate": "2026-01-15"
}

// Assign agent to Zone 1
POST /api/zones/{zoneId}/assign-agent
{
  "agentId": "uuid-of-agent",
  "teamChiefId": "uuid-of-team-chief",
  "startDate": "2026-01-15"
}
```

## Files

- `entities/zone.entity.ts` - Zone database entity
- `entities/site-assignment.entity.ts` - Site-to-Zone assignment
- `entities/agent-zone-assignment.entity.ts` - Agent-to-Zone assignment
- `dto/` - Data transfer objects
- `zones.service.ts` - Business logic
- `zones.controller.ts` - API endpoints
- `zones.module.ts` - Module definition

## Related Modules

- **Users**: Zone Chiefs, Team Chiefs, and Agents
- **Sites**: Sites assigned to zones
- **Interventions**: Future - interventions scheduled per zone
- **Planning**: Future - zone-based scheduling
