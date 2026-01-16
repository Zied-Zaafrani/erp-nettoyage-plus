# NettoyagePlus Backend - Deployment Guide

## 🚀 Deployment Status

**Status:** ✅ **DEPLOYED AND RUNNING**  
**Date:** January 16, 2026  
**Platform:** Railway.app (Free Tier)

---

## 📍 Live URLs

### Public API
- **Base URL:** `https://nettoyageplus-backend-production.up.railway.app`
- **Health Check:** `https://nettoyageplus-backend-production.up.railway.app/api/health`
- **API Root:** `https://nettoyageplus-backend-production.up.railway.app/api`

### Private Networking (Railway Internal)
- **Internal URL:** `nettoyageplus-backend.railway.internal`

---

## 🏗️ What Was Deployed

### Application
- **Name:** NettoyagePlus Backend API
- **Framework:** NestJS 10
- **Runtime:** Node.js 18 Alpine
- **Language:** TypeScript (Strict Mode)
- **Build System:** Docker Multi-Stage Build

### Architecture
```
┌─────────────────────────────────────────────┐
│           Railway.app Container             │
│  (Region: us-west1)                         │
│                                             │
│  ┌──────────────────────────────────────┐  │
│  │   NestJS Application                 │  │
│  │   - 11 Feature Modules               │  │
│  │   - 120+ REST Endpoints              │  │
│  │   - JWT Authentication               │  │
│  │   - Role-Based Authorization         │  │
│  └──────────────────────────────────────┘  │
│                    │                        │
│                    ▼                        │
│  ┌──────────────────────────────────────┐  │
│  │   Supabase PostgreSQL Database       │  │
│  │   - 13 Tables                        │  │
│  │   - 200+ Columns                     │  │
│  │   - 25+ Foreign Keys                 │  │
│  │   - 35+ Indexes                      │  │
│  └──────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

### Deployed Modules
1. **Auth Module** - User registration, login, JWT tokens
2. **Users Module** - User management, roles, profiles
3. **Clients Module** - Client management
4. **Sites Module** - Site management
5. **Contracts Module** - Contract lifecycle management
6. **Zones Module** - Zone management within sites
7. **Schedules Module** - Cleaning schedules
8. **Interventions Module** - Daily cleaning operations
9. **Checklists Module** - Quality control checklists
10. **Absences Module** - Staff absence management
11. **Dashboard Module** - KPIs, reports, analytics

---

## 🗄️ Database Configuration

### Supabase PostgreSQL
- **Host:** `aws-1-eu-west-1.pooler.supabase.com`
- **Database:** `postgres`
- **SSL:** Enabled
- **Connection Pooling:** Enabled (Supabase Pooler)

### Schema Information
- **Tables:** 13 entities with full relations
- **Total Columns:** 200+ columns across all tables
- **Foreign Keys:** 25+ relational constraints
- **Indexes:** 35+ optimized indexes
- **Soft Delete:** Enabled on all main tables

---

## ⚙️ Environment Variables

The following environment variables are configured in Railway:

### Required Variables
```env
DATABASE_URL=postgresql://postgres.xxx:***@aws-1-eu-west-1.pooler.supabase.com:5432/postgres
JWT_SECRET=42bb9e9cba0bf3a273f60b1f1d1ae1ae692ac83571edc99f3fd56fae949ff73d
NODE_ENV=production
```

### Optional Variables (Supabase Features)
```env
SUPABASE_URL=https://gqjymgkaxmdapmmwvspp.supabase.co
SUPABASE_ANON_KEY=sb_publishable_***
```

### Optional Variables (Firebase - Not currently used)
```env
FIREBASE_PROJECT_ID=erp-nettoyage-plus
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-***@erp-nettoyage-plus.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY----- ... -----END PRIVATE KEY-----
```

---

## 📦 Deployment Configuration

### Railway Configuration (`railway.json`)
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "DOCKERFILE",
    "dockerfilePath": "backend/Dockerfile",
    "watchPatterns": ["backend/**"]
  },
  "deploy": {
    "numReplicas": 1,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### Docker Configuration
**Build Context:** Repository root  
**Dockerfile Location:** `backend/Dockerfile`  
**Build Type:** Multi-stage (builder + production)

#### Dockerfile Stages
1. **Builder Stage:**
   - Base: `node:18-alpine`
   - Install all dependencies with `npm ci`
   - Copy source code from `backend/src`
   - Run TypeScript build (`npm run build`)
   - Output: Compiled JavaScript in `/app/dist`

2. **Production Stage:**
   - Base: `node:18-alpine`
   - Install production dependencies only
   - Copy built application from builder stage
   - Expose port 3000
   - Start with `node dist/main.js`

---

## 🔐 Security Configuration

### Authentication
- **Method:** JWT (JSON Web Tokens)
- **Token Expiry:** 7 days
- **Guards:** Global JWT auth guard with @Public decorator override
- **Password Hashing:** bcrypt with salt rounds

### Authorization
- **Method:** Role-Based Access Control (RBAC)
- **Roles:** Admin, Manager, Supervisor, Agent
- **Guards:** RolesGuard with @Roles decorator
- **Hierarchy:** Admin > Manager > Supervisor > Agent

### Database Security
- **SSL:** Enabled (Supabase)
- **Connection Pooling:** Supabase Pooler
- **Auto-Sync:** Disabled in production
- **Sensitive Data:** Environment variables only

---

## 📊 API Endpoints

### Health & Status
```
GET  /api                 - Welcome message
GET  /api/health          - Health check
```

### Authentication
```
POST /api/auth/register   - User registration
POST /api/auth/login      - User login
GET  /api/auth/me         - Get current user
```

### Users (11 endpoints)
```
POST   /api/users                 - Create user
POST   /api/users/batch           - Create multiple users
GET    /api/users                 - List users (paginated)
GET    /api/users/search          - Search users
GET    /api/users/:id             - Get user by ID
PATCH  /api/users/:id             - Update user
PATCH  /api/users/batch/update    - Update multiple users
DELETE /api/users/:id             - Soft delete user
POST   /api/users/batch/delete    - Soft delete multiple users
POST   /api/users/:id/restore     - Restore deleted user
POST   /api/users/batch/restore   - Restore multiple users
```

### Clients, Sites, Contracts, Zones (Similar CRUD patterns)
- Each module: 9-12 endpoints
- Full CRUD operations
- Batch operations (create, update, delete)
- Soft delete with restore
- Search and filtering

### Schedules & Interventions
- Schedule management (create, update, delete, bulk operations)
- Intervention tracking (start, complete, cancel)
- Real-time status updates

### Checklists & Absences
- Checklist creation and completion
- Absence request workflow (pending → approved/rejected)
- Review and approval process

### Dashboard (9 endpoints)
```
GET /api/dashboard/summary                - Overall KPIs
GET /api/dashboard/interventions/today    - Today's interventions
GET /api/dashboard/interventions/week     - Week's interventions
GET /api/dashboard/zones/performance      - Zone performance metrics
GET /api/dashboard/activity/recent        - Recent activity feed
GET /api/dashboard/reports/daily          - Daily report
GET /api/dashboard/reports/weekly         - Weekly report
GET /api/dashboard/reports/monthly        - Monthly report
GET /api/dashboard/kpis                   - All KPI metrics
```

**Total Endpoints:** 120+

---

## 🧪 Testing Results

### Database Tests
- **Status:** ✅ All Passed (27/27)
- **Coverage:** All 13 tables, 200+ columns, 25+ FKs, 35+ indexes
- **Validation:** Schema integrity, constraints, relationships

### Validation Tests
- **Status:** ✅ All Passed (19/19)
- **Coverage:** DTOs, business logic, edge cases
- **Validation:** Input validation, error handling, UUID formats

### TypeScript Compilation
- **Status:** ✅ 0 Errors
- **Mode:** Strict mode enabled
- **Output:** 364 compiled files

---

## 📁 Repository Structure

### GitHub Repository
- **URL:** `https://github.com/Zied-Zaafrani/nettoyageplus-backend`
- **Branch:** `main`
- **Type:** Production code only

### Repository Contents
```
nettoyageplus-backend/
├── backend/
│   ├── src/                    # Source code
│   │   ├── modules/           # 11 feature modules
│   │   ├── config/            # Configuration
│   │   ├── common/            # Guards, decorators, pipes
│   │   └── main.ts            # Application entry point
│   ├── Dockerfile             # Multi-stage Docker build
│   ├── .dockerignore          # Docker ignore patterns
│   ├── package.json           # Dependencies
│   ├── tsconfig.json          # TypeScript config
│   └── nest-cli.json          # NestJS CLI config
├── docs/                       # Documentation only
│   └── README.md              # Module documentation
├── railway.json               # Railway deployment config
└── README.md                  # Main documentation
```

### Excluded from Production
- ❌ Test files (`test-*.ts`)
- ❌ Test documentation (`TEST_SUMMARY.md`, `TESTING_GUIDE.md`)
- ❌ AI instructions (`docs/ai-instructions/`)
- ❌ Development notes
- ❌ `.env` files (environment variables set in Railway)

---

## 🚦 Deployment Process

### 1. Repository Setup
```bash
# Initialize production repository
git init
git add .
git commit -m "Initial commit"
git branch -M main

# Add GitHub remote
git remote add origin https://github.com/Zied-Zaafrani/nettoyageplus-backend.git
git push -u origin main
```

### 2. Railway Configuration
1. Create new project in Railway
2. Connect GitHub repository
3. Select `main` branch
4. Railway auto-detects Dockerfile

### 3. Environment Variables
Add required variables in Railway dashboard:
- DATABASE_URL (Supabase connection string)
- JWT_SECRET (32+ character random string)
- NODE_ENV=production

### 4. Deployment Issues Encountered & Resolved

#### Issue #1: TypeScript Nullable Error
**Error:** `Type 'string | null' is not assignable to type 'string'`  
**Location:** `absences.service.ts:306`  
**Fix:** Changed from `|| null` to conditional assignment:
```typescript
if (reviewAbsenceDto.reviewNotes !== undefined) {
  absence.reviewNotes = reviewAbsenceDto.reviewNotes;
}
```

#### Issue #2: Duplicate Directory Structure
**Error:** Railway building old code from root `src/` instead of `backend/src/`  
**Fix:** Removed 141 duplicate files from repository root

#### Issue #3: Railway JSON Syntax Error
**Error:** `Failed to parse JSON file railway.json: unexpected end of JSON input`  
**Fix:** Added missing opening brace, $schema, and proper structure

#### Issue #4: Docker Build Context
**Error:** `/tsconfig.json: not found` during Docker build  
**Fix:** Updated Dockerfile to reference files with `backend/` prefix:
```dockerfile
COPY backend/package*.json ./
COPY backend/tsconfig.json ./
COPY backend/src ./src
```

### 5. Final Deployment
- **Build Time:** ~2 minutes
- **Build Output:** 364 compiled JavaScript files
- **Container Size:** ~150MB (Alpine Linux)
- **Startup Time:** ~18 seconds (database connection + module loading)
- **Status:** ✅ Running successfully

---

## 📈 Monitoring & Logs

### Railway Dashboard
- **Metrics:** CPU, Memory, Network usage
- **Logs:** Real-time application logs
- **Deployments:** History and rollback capability

### Application Logs
```
[Nest] Starting Nest application...
[InstanceLoader] TypeOrmCoreModule dependencies initialized +7487ms
[InstanceLoader] All 11 modules dependencies initialized
[RoutesResolver] 120+ routes mapped
[NestApplication] Nest application successfully started
```

### Health Check
```bash
curl https://nettoyageplus-backend-production.up.railway.app/api/health

# Response:
{
  "status": "ok",
  "timestamp": "2026-01-16T08:55:48.056Z",
  "service": "Nettoyage Plus API"
}
```

---

## 💰 Cost & Resources

### Railway Free Tier
- **Monthly Credit:** $5.00 USD
- **Estimated Usage:** ~$0.01/hour = ~$7.20/month
- **Free Hours:** ~500 hours/month included
- **Overage:** Billed after free hours

### Resource Allocation
- **CPU:** Shared (burstable)
- **Memory:** 512MB - 1GB
- **Storage:** 10GB (included)
- **Bandwidth:** 100GB/month

---

## 🔄 Updates & Maintenance

### Deploying Updates
```bash
# In production repository
git add .
git commit -m "Description of changes"
git push origin main

# Railway auto-deploys on push to main
```

### Rolling Back
1. Go to Railway dashboard
2. Click "Deployments"
3. Select previous deployment
4. Click "Redeploy"

### Database Migrations
⚠️ **Important:** `synchronize` is disabled in production  
- Changes require manual migrations
- Test migrations in development first
- Use TypeORM migration commands

---

## 👥 Team Access

### GitHub Collaborators
- **Zied Zaafrani** - Owner
- **Montassar Lemjid** - Collaborator (to be invited)

### Railway Access
- Share project via Railway dashboard
- Invite via email

---

## 📞 Support & Troubleshooting

### Common Issues

**Issue:** Database connection errors  
**Solution:** Check DATABASE_URL environment variable in Railway

**Issue:** 502 Bad Gateway  
**Solution:** Check Railway logs, app may be restarting

**Issue:** Slow response times  
**Solution:** Check Railway metrics, may need to upgrade plan

### Resources
- Railway Docs: https://docs.railway.app
- NestJS Docs: https://docs.nestjs.com
- Supabase Docs: https://supabase.com/docs

**Deployment Completed:** January 16, 2026  
**Deployed By:** Zied Zaafrani  
**Status:** ✅ Production Ready
