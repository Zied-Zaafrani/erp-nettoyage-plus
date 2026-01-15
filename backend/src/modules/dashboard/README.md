# Dashboard & Reporting Module

**Status:** ✅ Complete  
**Last Updated:** January 15, 2026

## Overview

The Dashboard & Reporting module provides comprehensive analytics, KPIs, and reports for monitoring operations, tracking performance, and generating regulatory reports per the Operations Manual requirements.

---

## Features

### Dashboard Features
- **Summary Statistics:** Overall counts for clients, sites, contracts, interventions, agents
- **Today's Interventions:** Real-time view of scheduled work
- **Weekly View:** 7-day intervention planning
- **Zone Performance:** Metrics per geographical zone
- **Activity Feed:** Recent system events and actions

### Reporting Features
- **Daily Reports:** Per Operations Manual page 17 (submitted by Zone Chiefs)
- **Weekly Reports:** Per Operations Manual page 19 (due every Tuesday)
- **Monthly Reports:** Per Operations Manual page 20 (first Tuesday of month)
- **KPI Metrics:** Role-specific performance indicators

---

## API Endpoints

### Dashboard Endpoints

#### GET /api/dashboard/summary
Get overall system statistics.

**Access:** All authenticated users

**Response:**
```typescript
{
  totalClients: 47,
  activeClients: 45,
  totalSites: 47,
  activeSites: 47,
  totalContracts: 47,
  activeContracts: 47,
  totalInterventions: 1250,
  completedInterventions: 1100,
  totalAgents: 178,
  activeAgents: 170,
  pendingAbsences: 5
}
```

---

#### GET /api/dashboard/interventions-today
Get all interventions scheduled for today.

**Access:** All authenticated users

**Response:**
```typescript
[
  {
    id: "uuid",
    interventionCode: "INT-0001",
    siteName: "BCEAO",
    clientName: "Banque Centrale",
    scheduledDate: "2026-01-15",
    scheduledStartTime: "07:00",
    scheduledEndTime: "15:00",
    status: "SCHEDULED",
    assignedAgents: 3,
    checklistCompleted: false
  }
]
```

---

#### GET /api/dashboard/interventions-week
Get interventions for current week (Sunday-Saturday).

**Access:** All authenticated users

**Response:** Same structure as interventions-today

---

#### GET /api/dashboard/zone-performance/:zoneId
Get performance metrics for a specific zone.

**Access:** Zone Chiefs and above

**Response:**
```typescript
{
  zoneId: "uuid",
  zoneName: "Zone Nord",
  zoneCode: "Z1",
  totalSites: 12,
  totalAgents: 45,
  interventionsThisMonth: 120,
  completedInterventions: 115,
  completionRate: 95.83,
  averageQualityScore: 4.2,
  checklistCompletionRate: 98.5,
  incidentsCount: 2
}
```

---

#### GET /api/dashboard/recent-activity?limit=20
Get recent system activity feed.

**Access:** All authenticated users

**Query Parameters:**
- `limit` (optional, default: 20): Number of activities to return

**Response:**
```typescript
[
  {
    id: "uuid",
    type: "INTERVENTION_COMPLETED",
    title: "Intervention Completed",
    description: "INT-0045 at BCEAO",
    timestamp: "2026-01-15T14:30:00Z",
    userId: "uuid",
    userName: "Mohamed Ahmed"
  }
]
```

**Activity Types:**
- `INTERVENTION_CREATED`
- `INTERVENTION_COMPLETED`
- `ABSENCE_REQUESTED`
- `CONTRACT_SIGNED`
- `CLIENT_ADDED`
- `INCIDENT_REPORTED`

---

### Reporting Endpoints

#### GET /api/reports/daily/:date?zoneId=xxx
Get daily report for specific date.

**Access:** Zone Chiefs and above

**URL Parameters:**
- `date` (required): Date in format YYYY-MM-DD

**Query Parameters:**
- `zoneId` (optional): Filter by zone

**Example:** `/api/reports/daily/2026-01-15?zoneId=abc123`

**Response:**
```typescript
[
  {
    date: "2026-01-15",
    zoneId: "uuid",
    zoneName: "Zone Nord",
    zoneChief: "Ahmed Mohamed",
    sitesVisited: [
      {
        siteId: "uuid",
        siteName: "BCEAO",
        interventionId: "uuid",
        checkInTime: "2026-01-15T07:00:00Z",
        checkOutTime: "2026-01-15T15:00:00Z",
        agentsPresent: ["uuid1", "uuid2"],
        checklistCompleted: true,
        qualityScore: 5,
        issues: []
      }
    ],
    issuesFound: [],
    checklistCompletionRate: 100,
    uniformCompliance: true,
    stockAvailability: "Adequate",
    incidentsCount: 0,
    summary: "Completed 12 interventions"
  }
]
```

---

#### GET /api/reports/weekly/:startDate?zoneId=xxx
Get weekly report starting from specified date.

**Access:** Zone Chiefs and above

**URL Parameters:**
- `startDate` (required): Week start date (YYYY-MM-DD)

**Query Parameters:**
- `zoneId` (optional): Filter by zone

**Example:** `/api/reports/weekly/2026-01-13?zoneId=abc123`

**Response:**
```typescript
{
  weekStart: "2026-01-13",
  weekEnd: "2026-01-20",
  zoneId: "uuid",
  zoneName: "Zone Nord",
  totalInterventions: 84,
  completedInterventions: 82,
  completionRate: 97.62,
  averageQualityScore: 4.3,
  totalIncidents: 1,
  sitesCovered: 12,
  agentUtilization: [],
  topPerformers: [],
  areasForImprovement: []
}
```

---

#### GET /api/reports/monthly/:year/:month
Get monthly report for specified year and month.

**Access:** Directors and above

**URL Parameters:**
- `year` (required): Year (e.g., 2026)
- `month` (required): Month (1-12)

**Example:** `/api/reports/monthly/2026/1`

**Response:**
```typescript
{
  month: 1,
  year: 2026,
  totalClients: 47,
  totalContracts: 47,
  totalInterventions: 350,
  completionRate: 96.5,
  averageQualityScore: 4.2,
  clientSatisfaction: 4.5,
  totalRevenue: 0,
  zonePerformance: [],
  kpis: {
    roleType: "OVERALL",
    interventionCompletionRate: 96.5,
    checklistCompletionRate: 98.0,
    averageQualityScore: 4.2,
    clientSatisfactionRate: 90.0,
    incidentRate: 1.5,
    absenceRate: 3.2,
    responseTime: 0
  }
}
```

---

#### GET /api/reports/kpi/:roleType?startDate=xxx&endDate=xxx
Get KPI metrics for specific role type.

**Access:** Zone Chiefs and above

**URL Parameters:**
- `roleType` (required): ZONE_CHIEF, TEAM_CHIEF, AGENT, or OVERALL

**Query Parameters:**
- `startDate` (optional): Start date (YYYY-MM-DD), defaults to start of current month
- `endDate` (optional): End date (YYYY-MM-DD), defaults to today

**Example:** `/api/reports/kpi/ZONE_CHIEF?startDate=2026-01-01&endDate=2026-01-31`

**Response:**
```typescript
{
  roleType: "ZONE_CHIEF",
  interventionCompletionRate: 97.5,
  checklistCompletionRate: 98.5,
  averageQualityScore: 4.3,
  clientSatisfactionRate: 92.0,
  incidentRate: 1.2,
  absenceRate: 2.8,
  responseTime: 0
}
```

**KPI Definitions:**
- **Intervention Completion Rate:** % of scheduled interventions completed
- **Checklist Completion Rate:** % of completed interventions with full checklists
- **Average Quality Score:** Mean quality score (1-5) from Zone Chief reviews
- **Client Satisfaction Rate:** % satisfaction from client ratings (converted to 100 scale)
- **Incident Rate:** % of interventions with reported incidents
- **Absence Rate:** % of working days with approved absences
- **Response Time:** Average hours from intervention creation to completion (TODO)

---

## Business Rules

### Daily Reports
- Submitted by Zone Chiefs at end of each day
- Must include: sites visited, issues found, checklist completion, uniform compliance
- Required fields: zone, date, site visits
- Due: End of business day (17:00)

### Weekly Reports
- Submitted by Zone Chiefs every Tuesday
- Covers previous week (Monday-Sunday)
- Includes: completion rates, quality scores, incidents, agent utilization
- Due: Every Tuesday before 12:00

### Monthly Reports
- Generated for Directors by first Tuesday of month
- Comprehensive performance across all zones
- Includes: financial metrics, KPIs, zone comparisons
- Due: First Tuesday of each month

### Access Control
- **Summary & Today's View:** All authenticated users
- **Zone Performance:** Zone Chiefs and above
- **Daily/Weekly Reports:** Zone Chiefs and above
- **Monthly Reports:** Directors and above
- **KPI Metrics:** Zone Chiefs and above

---

## Data Sources

### Dashboard Summary
- **Clients:** Clients table (status = ACTIVE)
- **Sites:** Sites table (status = ACTIVE)
- **Contracts:** Contracts table (status = ACTIVE)
- **Interventions:** Interventions table (all records)
- **Agents:** Users table (role = AGENT, status = ACTIVE)
- **Absences:** Absences table (status = PENDING)

### Zone Performance
- **Sites:** SiteAssignment table (isActive = true)
- **Agents:** AgentZoneAssignment table (isActive = true)
- **Interventions:** Filtered by date range
- **Checklists:** ChecklistInstance table
- **Quality Scores:** Intervention.qualityScore field

### Reports
- **Daily:** Completed interventions for date + checklist data
- **Weekly:** Aggregated interventions for 7-day period
- **Monthly:** Full month aggregation with KPI calculations
- **KPIs:** Calculated from interventions, checklists, absences

---

## Frontend Integration

### Dashboard Page
```typescript
// Fetch summary on page load
const summary = await fetch('/api/dashboard/summary').then(r => r.json());

// Display today's interventions
const today = await fetch('/api/dashboard/interventions-today').then(r => r.json());

// Show recent activity
const activity = await fetch('/api/dashboard/recent-activity?limit=10').then(r => r.json());
```

### Zone Chief View
```typescript
// Zone-specific performance
const zoneId = 'abc123';
const performance = await fetch(`/api/dashboard/zone-performance/${zoneId}`).then(r => r.json());

// Daily report submission
const date = '2026-01-15';
const report = await fetch(`/api/reports/daily/${date}?zoneId=${zoneId}`).then(r => r.json());
```

### Director View
```typescript
// Monthly overview
const monthly = await fetch('/api/reports/monthly/2026/1').then(r => r.json());

// KPI dashboard
const kpis = await fetch('/api/reports/kpi/OVERALL?startDate=2026-01-01&endDate=2026-01-31')
  .then(r => r.json());
```

---

## Future Enhancements

### Short-term (Phase 2)
- [ ] Agent utilization details in weekly report
- [ ] Top performers identification algorithm
- [ ] Revenue calculation from contract pricing
- [ ] Response time tracking (creation to completion)
- [ ] Export reports as PDF

### Medium-term (Phase 3)
- [ ] Incident tracking integration
- [ ] Stock management integration
- [ ] Uniform compliance tracking
- [ ] Predictive analytics (forecast interventions)
- [ ] Benchmarking across zones

### Long-term (Phase 4)
- [ ] Real-time dashboard with WebSocket
- [ ] Custom report builder
- [ ] Data visualization enhancements
- [ ] Mobile dashboard app
- [ ] AI-powered insights

---

## Testing

### Manual Testing Checklist
- [ ] Summary returns correct counts
- [ ] Today's interventions filters by current date
- [ ] Week view covers Sunday-Saturday
- [ ] Zone performance calculates rates correctly
- [ ] Activity feed shows recent events in order
- [ ] Daily report groups by zone
- [ ] Weekly report aggregates 7 days
- [ ] Monthly report covers full month
- [ ] KPIs calculate percentages correctly
- [ ] Date parsing works for all endpoints

### Test Data Requirements
- At least 5 clients with ACTIVE status
- At least 10 sites with interventions
- At least 20 interventions (various statuses)
- At least 5 completed interventions with quality scores
- At least 3 checklists with completion data
- At least 2 absences with PENDING status

---

## Notes

- All date parameters use ISO 8601 format (YYYY-MM-DD)
- All timestamps use ISO 8601 with timezone (YYYY-MM-DDTHH:mm:ssZ)
- Percentages rounded to 2 decimal places
- Activity feed limited to last 7 days by default
- Zone performance metrics calculated for current month
- KPIs default to current month if no date range specified
