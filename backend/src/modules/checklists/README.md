# Checklists Module

## Overview
The **Checklists Module** manages quality control task templates and their execution during interventions. This module ensures consistent quality standards across all cleaning operations with systematic task tracking, photo proof, and supervisor reviews.

## Key Features
- ✅ **Template Management**: Define reusable checklist templates (Daily, Weekly, Monthly, Quarterly)
- ✅ **Instance Creation**: Generate checklist from template for each intervention
- ✅ **Task Tracking**: Track completion status of individual tasks
- ✅ **Photo Requirements**: Attach photo proof to tasks
- ✅ **Zone-based Structure**: Organize tasks by zones (Hall, Bureaux, Sanitaires, etc.)
- ✅ **Completion Percentage**: Real-time progress tracking
- ✅ **Quality Review**: Zone Chief quality scoring (1-5)
- ✅ **Automatic Status Updates**: NOT_STARTED → IN_PROGRESS → COMPLETED

## Entities

### ChecklistTemplate
- `id` (UUID, Primary Key)
- `name` (String) - e.g., "Checklist Quotidienne", "Checklist Hebdomadaire"
- `description` (Text)
- `frequency` (Enum) - DAILY, WEEKLY, MONTHLY, QUARTERLY
- `siteSize` (Enum, nullable) - Template can be specific to SMALL, MEDIUM, or LARGE sites
- `zones` (JSON) - Array of zone configurations: `[{ zoneName: "Bureaux", tasks: ["Vider poubelles", "Dépoussiérage"] }]`
- `isActive` (Boolean) - Enable/disable template
- `createdAt`, `updatedAt`, `deletedAt` (Timestamps)

### ChecklistInstance
- `id` (UUID, Primary Key)
- `interventionId` (UUID, Foreign Key → Interventions)
- `templateId` (UUID, Foreign Key → ChecklistTemplates)
- `status` (Enum) - NOT_STARTED, IN_PROGRESS, COMPLETED
- `startedAt` (DateTime) - When first item completed
- `completedAt` (DateTime) - When all items completed
- `completionPercentage` (Number, 0-100) - Auto-calculated
- `qualityScore` (Number, 1-5) - From Zone Chief review
- `reviewedBy` (UUID, Foreign Key → Users)
- `reviewNotes` (Text) - Zone Chief comments
- `createdAt`, `updatedAt` (Timestamps)

### ChecklistItem
- `id` (UUID, Primary Key)
- `checklistInstanceId` (UUID, Foreign Key → ChecklistInstances)
- `zoneName` (String) - e.g., "Bureau 1", "Sanitaire 2", "Hall"
- `taskDescription` (Text) - Task to complete
- `isCompleted` (Boolean)
- `completedAt` (DateTime)
- `completedBy` (UUID, Foreign Key → Users)
- `photoUrls` (Array) - Proof photos
- `notes` (Text) - Agent notes
- `qualityRating` (Number, 1-5) - Per-item quality
- `createdAt`, `updatedAt` (Timestamps)

## API Endpoints

### Template Management

#### 1. Create Template
- **POST** `/api/checklists/templates`
- **Body**: CreateTemplateDto
- **Access**: SUPER_ADMIN, DIRECTOR, SECTOR_CHIEF, QUALITY_CONTROLLER
- **Returns**: Created template

#### 2. Get All Templates
- **GET** `/api/checklists/templates?frequency=DAILY&isActive=true`
- **Query Params**: frequency, isActive
- **Access**: All roles
- **Returns**: Filtered list of templates

#### 3. Get Single Template
- **GET** `/api/checklists/templates/:id`
- **Access**: All roles
- **Returns**: Template with zone configurations

#### 4. Update Template
- **PATCH** `/api/checklists/templates/:id`
- **Body**: UpdateTemplateDto
- **Access**: SUPER_ADMIN, DIRECTOR, SECTOR_CHIEF, QUALITY_CONTROLLER
- **Returns**: Updated template

#### 5. Delete Template
- **DELETE** `/api/checklists/templates/:id`
- **Access**: SUPER_ADMIN, DIRECTOR, SECTOR_CHIEF
- **Returns**: Void (soft delete)

### Instance Management

#### 6. Create Instance from Template
- **POST** `/api/checklists/instances`
- **Body**: CreateInstanceDto (interventionId, templateId)
- **Access**: SUPER_ADMIN, DIRECTOR, SECTOR_CHIEF, ZONE_CHIEF, TEAM_CHIEF
- **Returns**: Instance with all items created from template
- **Validation**: Intervention must exist, no duplicate instance

#### 7. Get All Instances
- **GET** `/api/checklists/instances?interventionId=...&status=...`
- **Query Params**: interventionId, status
- **Access**: All roles
- **Returns**: Filtered list of instances

#### 8. Get Instance by Intervention
- **GET** `/api/checklists/instances/intervention/:interventionId`
- **Access**: All roles
- **Returns**: Checklist instance for specific intervention

#### 9. Get Single Instance
- **GET** `/api/checklists/instances/:id`
- **Access**: All roles
- **Returns**: Instance with all items and relations

#### 10. Get Completion Stats
- **GET** `/api/checklists/instances/:id/stats`
- **Access**: All roles
- **Returns**: CompletionStats (totalItems, completedItems, percentage, withPhotos)

#### 11. Review Instance
- **POST** `/api/checklists/instances/:id/review`
- **Body**: ReviewInstanceDto (reviewedBy, qualityScore, reviewNotes)
- **Access**: ZONE_CHIEF, QUALITY_CONTROLLER, SECTOR_CHIEF, DIRECTOR, SUPER_ADMIN
- **Returns**: Reviewed instance
- **Validation**: Only completed checklists can be reviewed

### Item Management

#### 12. Complete Item
- **POST** `/api/checklists/items/:id/complete`
- **Body**: CompleteItemDto (completedBy, photoUrls?, notes?, qualityRating?)
- **Access**: ZONE_CHIEF, TEAM_CHIEF, AGENT
- **Returns**: Completed item
- **Side Effects**: Updates instance status and completion percentage

#### 13. Uncomplete Item
- **POST** `/api/checklists/items/:id/uncomplete`
- **Access**: ZONE_CHIEF, TEAM_CHIEF
- **Returns**: Item reverted to incomplete
- **Side Effects**: Updates instance completion percentage

#### 14. Add Photo to Item
- **POST** `/api/checklists/items/:id/photos`
- **Body**: { photoUrl: string }
- **Access**: ZONE_CHIEF, TEAM_CHIEF, AGENT
- **Returns**: Item with new photo added

## Business Rules

### Template Rules
- ✅ Templates can be frequency-specific (DAILY, WEEKLY, MONTHLY, QUARTERLY)
- ✅ Templates can be site-size-specific (SMALL, MEDIUM, LARGE) or generic
- ✅ Zones define task structure: `{ zoneName: "Bureaux", tasks: ["Task 1", "Task 2"] }`
- ✅ Templates can be activated/deactivated without deletion

### Instance Rules
- ✅ One instance per intervention (no duplicates)
- ✅ Instance auto-creates items from template zones
- ✅ Status auto-updates based on completion:
  - NOT_STARTED → First item completed → IN_PROGRESS
  - All items completed → COMPLETED
- ✅ Completion percentage auto-calculated
- ✅ Only COMPLETED instances can be reviewed

### Item Rules
- ✅ Items cannot be re-completed once done
- ✅ Supervisors (ZONE_CHIEF, TEAM_CHIEF) can uncomplete items for corrections
- ✅ Photos can be added at any time
- ✅ Quality ratings are optional (1-5 scale)
- ✅ Completing an item updates parent instance

## DTOs

### CreateTemplateDto
```typescript
{
  name: string;                  // Required
  description?: string;
  frequency: ChecklistFrequency; // Required (DAILY, WEEKLY, MONTHLY, QUARTERLY)
  siteSize?: SiteSize;          // Optional (SMALL, MEDIUM, LARGE)
  zones: [                       // Required (min 1 zone)
    {
      zoneName: string;          // e.g., "Bureaux", "Sanitaires"
      tasks: string[];           // Array of task descriptions
    }
  ];
  isActive?: boolean;            // Default true
}
```

### CreateInstanceDto
```typescript
{
  interventionId: string;  // Required
  templateId: string;      // Required
}
```

### CompleteItemDto
```typescript
{
  completedBy: string;       // Required (User ID)
  photoUrls?: string[];      // Optional
  notes?: string;            // Optional
  qualityRating?: number;    // Optional (1-5)
}
```

### ReviewInstanceDto
```typescript
{
  reviewedBy: string;        // Required (User ID)
  qualityScore: number;      // Required (1-5)
  reviewNotes?: string;      // Optional
}
```

## Service Methods

| Method | Description | Returns |
|--------|-------------|---------|
| `createTemplate(dto)` | Create checklist template | ChecklistTemplate |
| `findAllTemplates(filters)` | Get templates with filters | ChecklistTemplate[] |
| `findOneTemplate(id)` | Get single template | ChecklistTemplate |
| `updateTemplate(id, dto)` | Update template | ChecklistTemplate |
| `removeTemplate(id)` | Soft delete template | void |
| `createInstance(dto)` | Create instance from template | ChecklistInstance |
| `findAllInstances(filters)` | Get instances with filters | ChecklistInstance[] |
| `findOneInstance(id)` | Get single instance | ChecklistInstance |
| `getInstanceByIntervention(id)` | Get instance for intervention | ChecklistInstance |
| `completeItem(id, dto)` | Mark item complete | ChecklistItem |
| `uncompleteItem(id)` | Revert item to incomplete | ChecklistItem |
| `addPhotoToItem(id, url)` | Add photo URL | ChecklistItem |
| `reviewInstance(id, dto)` | Zone Chief quality review | ChecklistInstance |
| `getCompletionStats(id)` | Get completion statistics | CompletionStats |

## Usage Example

### 1. Create Daily Checklist Template
```typescript
POST /api/checklists/templates
{
  "name": "Checklist Quotidienne - Petits Sites",
  "frequency": "DAILY",
  "siteSize": "SMALL",
  "zones": [
    {
      "zoneName": "Hall d'entrée",
      "tasks": [
        "Balayage et lavage du sol",
        "Dépoussiérage des surfaces",
        "Vider les poubelles"
      ]
    },
    {
      "zoneName": "Bureaux",
      "tasks": [
        "Vider les poubelles de chaque bureau",
        "Dépoussiérage des bureaux",
        "Nettoyer les vitres"
      ]
    },
    {
      "zoneName": "Sanitaires",
      "tasks": [
        "Nettoyer et désinfecter les installations",
        "Réapprovisionner les consommables",
        "Laver les sols"
      ]
    }
  ]
}
```

### 2. Create Instance for Intervention
```typescript
POST /api/checklists/instances
{
  "interventionId": "intervention-uuid",
  "templateId": "template-uuid"
}
// Returns instance with all items auto-created
```

### 3. Agent Completes Task
```typescript
POST /api/checklists/items/item-uuid/complete
{
  "completedBy": "agent-uuid",
  "photoUrls": ["https://storage/photo1.jpg", "https://storage/photo2.jpg"],
  "notes": "Bureau nettoyé et désinfecté",
  "qualityRating": 5
}
```

### 4. Zone Chief Reviews
```typescript
POST /api/checklists/instances/instance-uuid/review
{
  "reviewedBy": "zone-chief-uuid",
  "qualityScore": 4,
  "reviewNotes": "Bon travail, mais attention aux coins"
}
```

## Integration Points
- **Interventions**: One checklist instance per intervention
- **Users**: Track who completed tasks and who reviewed
- **Mobile App**: Agents complete tasks, upload photos, mark items done

## Typical Workflow

1. **Admin Creates Template** → Define zones and tasks for daily cleaning
2. **Schedule Generates Intervention** → Automatically create intervention
3. **System Creates Checklist Instance** → Link template to intervention
4. **Agent Starts Work** → Mobile app shows checklist
5. **Agent Completes Tasks** → Mark items done, upload photos
6. **System Updates Progress** → 0% → 50% → 100%
7. **Zone Chief Reviews** → Quality score and feedback
8. **Reports Generated** → Daily/weekly quality metrics

## Performance Notes
- Efficient item creation via batch insert
- Auto-calculation of completion percentage
- Lazy loading of relations for performance
- Indexed foreign keys for fast lookups

## Status
✅ **100% Complete** - 3 Entities, DTOs, Service, Controller, Module all implemented
- 14 endpoints
- Template management (5 endpoints)
- Instance management (6 endpoints)
- Item management (3 endpoints)
- Quality review workflow
- Photo management
- Completion tracking
- 0 TypeScript errors
