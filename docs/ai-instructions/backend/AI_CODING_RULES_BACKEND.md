# Backend Coding Rules - Nettoyage Plus

**Domain:** Backend (NestJS + PostgreSQL + TypeScript)  
**Primary Developer:** Zied Zaafrani  
**Last Updated:** December 26, 2025

---

## Philosophy: Build Capabilities, Not Restrictions

The backend is a **flexible toolbox**. It provides capabilities that the frontend and admin panel control.

**Wrong Approach:** "Only admins can delete"  
**Right Approach:** Backend has delete capability → Admin panel controls who can use it

**Wrong Approach:** "Search by ID only"  
**Right Approach:** Backend accepts multiple search methods → Frontend chooses which to expose

---

## Core Principles

### 1. Modularity
- Every module should work for **any business**, not just cleaning companies
- Avoid company-specific logic in core modules
- Example: Don't hardcode "cleaning agents" - make it "employees" or "users"

### 2. Capability-First Design
- Build ALL CRUD operations (Create, Read, Update, Delete, Restore)
- Don't restrict operations in backend - let frontend/permissions decide
- Provide flexible search options (by ID, by email, by name, by custom field)

### 3. Separation of Concerns
- **Backend**: Provides secure APIs with ALL capabilities
- **Frontend**: Decides which capabilities to expose to which users
- **Admin Panel**: Configures permissions dynamically

### 4. Ask Before Restricting
If you think a feature should be restricted:
- Don't hardcode the restriction in backend
- Add to QUESTIONS_BACKEND.md: "Should [feature] be available? If yes, should it be permission-controlled?"

---

## Tech Stack

**Framework:** NestJS (Node.js + TypeScript)  
**Database:** PostgreSQL via Supabase  
**ORM:** TypeORM  
**Auth:** JWT tokens  
**File Storage:** Firebase/Supabase Storage

---

## Project Structure

### Module Organization
```
src/modules/[module-name]/
├── dto/                  # Data transfer objects
├── entities/             # Database models
├── [name].controller.ts  # HTTP routes
├── [name].service.ts     # Business logic
├── [name].repository.ts  # optional, if complex queries
├── [name].module.ts      # Module definition
└── README.md             # Module documentation
```

### Shared Code
```
src/
├── common/
│   ├── decorators/      # Custom decorators
│   ├── guards/          # Auth guards, role guards
│   ├── interceptors/    # Response transformers
│   ├── pipes/           # Validation pipes
│   └── filters/         # Exception filters
├── shared/
│   ├── utils/           # Helper functions
│   ├── constants/       # App-wide constants
│   └── types/           # Shared TypeScript types
└── config/
    └── configuration.ts # Environment config
```

---

## Naming Conventions

### Be Descriptive and Consistent
- **Files**: `clients.controller.ts`, `client.entity.ts`
- **Classes**: `ClientsController`, `ClientsService`, `Client`
- **Variables**: `clientData`, `foundUser`, `isActive` (not `data`, `temp`, `x`)
- **Booleans**: Always prefix: `isActive`, `hasPermission`, `canDelete`
- **Arrays**: Plural: `clients`, `users` (not `clientList`, `clientArray`)

---

## Database Design Standards

### Required Fields on All Entities
Every database entity needs:
- `id` - Primary key (use UUID, not auto-increment integers)
- `createdAt` - Timestamp when created
- `updatedAt` - Timestamp when last modified
- `deletedAt` - Timestamp for soft deletes (nullable)

**Why UUID over auto-increment?**
- Don't expose internal counting to users
- More secure (can't guess next ID)
- Easier to merge databases later

### Status Fields
Use enums for any status:
```typescript
// Good
status: 'ACTIVE' | 'SUSPENDED' | 'ARCHIVED'

// Bad
status: 1 | 2 | 3  // What does "2" mean?
```

### Soft Delete Pattern
- Never hard delete data (use soft delete: set `deletedAt` timestamp)
- Provide restore capability (clear `deletedAt`)
- Exclude soft-deleted items from normal queries by default
- Provide option to include deleted items (for admin views)

**Why soft delete?**
- Audit trail (who deleted what and when)
- Accidental deletion recovery
- Compliance (some industries must keep deleted data)

---

## Controller Guidelines

### Controllers Are Route Handlers
Controllers should:
- Define HTTP routes (GET, POST, PATCH, DELETE)
- Validate input using DTOs
- Call service methods
- Return results

Controllers should NOT:
- Contain business logic (put in service)
- Query database directly (use service)
- Handle errors manually (use exception filters)

### Flexible Endpoints
Design endpoints to accept multiple query methods:

**Bad - Restricts to one search method:**
```
GET /clients/:id
```

**Good - Flexible search:**
```
GET /clients/search?id=uuid
GET /clients/search?email=user@example.com  
GET /clients/search?name=John
```

Let the frontend choose which method to use.

### Build ALL Operations
For every entity, provide:
- Create
- Create multiple
- Read single
- Read multiple/list
- Update
- Update multiple
- Delete/soft-delete
- Delete/soft-delete multiple
- Restore
- Restore multiple
- Batch operations

Don't skip operations thinking "users won't need this" - build the capability, let frontend/admin control access.

---

## Service Layer Guidelines

### Services Contain Business Logic
Services should:
- Validate business rules
- Interact with database (via repository/ORM)
- Handle complex operations
- Throw appropriate exceptions

### Error Handling Philosophy
When something goes wrong:
- Use descriptive exceptions: `NotFoundException`, `ConflictException`, `BadRequestException`
- Include helpful messages: "Client with email {email} not found"
- Never expose internal errors to users (catch and wrap them)

### Don't Assume User Needs
**Example - Finding a record:**

**Bad - Assumes ID search only:**
```typescript
async findOne(id: string): Promise<Client>
```

**Good - Flexible search:**
```typescript
async findOne(criteria: {
  id?: string;
  email?: string;
  name?: string;
  clientCode?: string;
}): Promise<Client>
```

This lets different clients search different ways without changing backend.

### Transaction Handling
For operations that modify multiple tables:
- Use database transactions
- If one step fails, roll back all changes
- Example: Creating contract + assigning agents + generating invoice = one transaction

---

## DTO (Data Transfer Objects) Guidelines

### DTOs Define API Contract
Use DTOs to:
- Validate incoming data
- Define what fields are required/optional
- Transform data types
- Document API structure

### Validation Rules
- Use `class-validator` decorators: `@IsString()`, `@IsEmail()`, `@IsOptional()`
- Validate at the edge (controller input) - don't trust data
- Provide clear error messages for validation failures

### Don't Over-Specify
**Bad - Too restrictive:**
```typescript
class CreateClientDto {
  @IsString()
  @MinLength(5)
  @MaxLength(50)
  name: string; // What if a company has 51-char name?
}
```

**Good - Reasonable limits:**
```typescript
class CreateClientDto {
  @IsString()
  @MaxLength(255) // Database column limit
  name: string;
}
```

---

## Security Principles

### What NEVER to Expose
- Raw database IDs (use UUIDs which are non-sequential)
- Password hashes
- JWT secrets or tokens of other users
- Internal error stack traces
- System paths or configuration

### What ALWAYS to Do
- Validate ALL user input
- Use parameterized queries (TypeORM does this)
- Hash passwords (use bcrypt, never plain text)
- Store sensitive config in environment variables
- Use HTTPS in production

### Authentication vs Authorization
**Authentication** = "Who are you?" (Login with email/password)  
**Authorization** = "What can you do?" (Permissions/roles)

Build both capabilities in backend:
- Authentication: Verify user identity → Issue JWT token
- Authorization: Provide endpoints to check permissions → Let frontend/admin configure who can do what

**Don't hardcode roles** like "admin can delete, user can't":
- Build dynamic permission system
- Store permissions in database
- Let super admin configure via admin panel

---

## Modularity Checklist

Before completing any module, ask:

### The "Any Company" Test
- [ ] Could this module work for a car rental company?
- [ ] Could this work for a restaurant?
- [ ] Could this work for a hospital?

If answer is "no" → Make it more generic.

### The "Configuration" Test
- [ ] Can behavior be changed without code changes?
- [ ] Are business rules in database/config (not hardcoded)?
- [ ] Can different clients have different settings?

### The "Permission" Test
- [ ] Does this restriction NEED to be in backend?
- [ ] Or can frontend/admin panel control it?
- [ ] Am I limiting future flexibility?

---

## Code Quality Standards

### Before Marking Code Complete
- [ ] Code runs without errors
- [ ] No `console.log()` statements (use proper logging)
- [ ] No `any` types (use proper TypeScript types)
- [ ] Variables have descriptive names
- [ ] Error handling in place
- [ ] Input validation using DTOs
- [ ] Follows module structure
- [ ] README.md written/updated

### TypeScript Usage
- Use proper types, avoid `any`
- Define interfaces for complex objects
- Use enums for fixed sets of values
- Enable strict mode in `tsconfig.json`

---

## Performance Considerations

### Database Queries
- Only fetch fields you need (don't SELECT *)
- Use pagination for list endpoints
- Add database indexes for frequently searched fields
- Avoid N+1 query problems (use eager loading wisely)

### When to Optimize
- Don't optimize prematurely
- Measure first (is it actually slow?)
- Optimize when needed (user feedback, monitoring data)

---

## Documentation Requirements

### Every Module Needs README.md
Include:
- **Purpose**: What this module does
- **Entities**: Database tables/models
- **Endpoints**: Available API routes
- **Usage**: How to use this module
- **Dependencies**: What it depends on
- **Notes**: Important considerations or limitations

### Code Comments
- Comment WHY, not WHAT
- Good: `// Soft delete to preserve audit trail`
- Bad: `// Set deletedAt to current date`

---

## Testing Strategy

### What to Test
- **Happy path**: Normal usage works
- **Edge cases**: Empty arrays, null values, boundary conditions
- **Error scenarios**: Invalid input, missing data, conflicts

### When to Write Tests
- Critical business logic
- Complex calculations
- Authentication/authorization
- Payment processing
- Data migrations

Don't test simple CRUD operations unless they have special logic.

---

## When You're Unsure

### Ask These Questions
1. **"Is this truly modular?"** - Could another business use this?
2. **"Am I restricting unnecessarily?"** - Should this be configurable?
3. **"Is this secure?"** - Am I exposing sensitive data?
4. **"Is business logic in the right place?"** - Controller? No. Service? Yes.
5. **"Did I validate input?"** - Never trust user data

### Decision Framework

**If you need to make a design choice:**
1. Check if similar pattern exists in other modules
2. Check `/docs/ai-instructions/backend/QUESTIONS_BACKEND.md` for answered questions
3. If still unclear → Add question to `QUESTIONS_BACKEND.md` → STOP and wait
4. Don't assume → Ask Zied

**If you hit an error:**
1. Try to fix (attempt 1)
2. Try alternative approach (attempt 2)  
3. Still broken? → Log to `ERROR_LOG_BACKEND.md` → Ask for guidance

---

## Common Patterns to Reuse

### Before Writing New Code
1. Check `/src/shared/` for utilities
2. Check `/src/common/` for guards, decorators, filters, ...
3. Check other modules for similar patterns
4. If pattern will be reused → Extract to `/shared/` or `/common/`

### Examples of Reusable Code
- Pagination logic
- Search/filter utilities
- Date formatting
- File upload handling
- Email sending
- Audit logging

---

## Logging

### Use Proper Logger
- Use NestJS built-in logger (not `console.log`)
- Log important events: created, updated, deleted, errors
- Include context: which user, which entity, what action
- Don't log sensitive data (passwords, tokens)

### Log Levels
- **Log**: Normal operations (created client, sent email)
- **Warn**: Something unusual but not breaking (deprecated endpoint used)
- **Error**: Something failed (database error, API call failed)
- **Debug**: Detailed info for troubleshooting (development only)

---

## Environment Configuration

### Never Hardcode Config
**Bad:**
```typescript
const apiKey = 'sk_live_12345';
```

**Good:**
```typescript
const apiKey = this.configService.get('API_KEY');
```

### Use .env Files
- `.env` - Local development
- `.env.production` - Production settings
- Never commit .env files to Git

---

## Git Workflow

**Remember:** Git operations only happen when Zied explicitly asks.

When asked to save:
1. Read `/docs/ai-instructions/shared/GIT_INSTRUCTIONS.md`
2. Follow instructions exactly
3. Confirm before executing

---

## Key Takeaways

1. **Build capabilities, not restrictions** - Backend provides tools, frontend controls access
2. **Modularity first** - Works for any company, not just this one
3. **Flexible by default** - Multiple search methods, configurable behavior
4. **Ask before assuming** - Questions are better than wrong implementations
5. **Security matters** - Validate input, protect sensitive data
6. **Document everything** - Future you (and others) will thank you

---

**Version:** 2.0  
**Last Updated:** December 26, 2025  
**Maintained By:** Zied Zaafrani

---

**Remember:** You're building a flexible platform, not a rigid application. When in doubt, build the capability and let configuration/permissions control it.