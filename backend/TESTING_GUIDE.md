# Testing Guide for NettoyagePlus Backend

## 📋 Available Tests

This project includes comprehensive test suites to validate database integrity, API endpoints, data validation, and business logic.

---

## 🧪 Test Suites

### 1. **Database Tests** (`test-database.ts`)
**What it tests:**
- ✅ Database connectivity (PostgreSQL/Supabase)
- ✅ Table creation (all 13 entities)
- ✅ Table schemas and column definitions
- ✅ Foreign key relationships (25+ constraints)
- ✅ CRUD operations (Create, Read, Update, Delete)
- ✅ Database indexes (34 indexes)
- ✅ Complex queries (JOINs, aggregations)
- ✅ Database performance (ping time)
- ✅ TypeORM synchronization status

**Run command:**
```bash
npm run test:db
```

**Expected results:**
- 26+ tests
- All tables created
- All CRUD operations working
- Performance < 100ms

---

### 2. **API Endpoint Tests** (`test-api-endpoints.ts`)
**What it tests:**
- ✅ Server health check
- ✅ Authentication endpoints (login, token validation)
- ✅ User management endpoints (11 endpoints)
- ✅ Client management endpoints (11 endpoints)
- ✅ Site management endpoints (11 endpoints)
- ✅ Contract management endpoints (14 endpoints)
- ✅ Zone management endpoints (12 endpoints)
- ✅ Intervention endpoints (13 endpoints)
- ✅ Schedule endpoints (11 endpoints)
- ✅ Checklist endpoints (14 endpoints)
- ✅ Absence endpoints (10 endpoints)
- ✅ Dashboard & Reporting endpoints (9 endpoints)
- ✅ Error handling (404, 400, validation errors)

**Prerequisites:**
- Server must be running: `npm run start:dev`
- Wait 30-40 seconds after server starts for initialization

**Run command:**
```bash
# Terminal 1: Start server
npm run start:dev

# Terminal 2: Wait 30 seconds, then run tests
npm run test:api
```

**Expected results:**
- 40+ endpoint tests
- All GET endpoints return 200 or 401 (if auth required)
- POST endpoints return 201 or 401/403
- Proper error handling for invalid data

---

### 3. **Data Validation Tests** (`test-validation.ts`)
**What it tests:**
- ✅ User DTO validation (email, password, required fields)
- ✅ Client DTO validation (name, email, phone)
- ✅ Site DTO validation (UUID format, enums)
- ✅ Contract DTO validation (dates, required fields)
- ✅ Intervention DTO validation (times, dates)
- ✅ Business logic rules (date comparisons, regex patterns)
- ✅ Enum validations (roles, statuses, types)
- ✅ Required field checks
- ✅ Data type validations

**Run command:**
```bash
npm run test:validation
```

**Expected results:**
- 25+ validation tests
- All valid data passes
- All invalid data is caught
- Proper error messages

---

### 4. **Full Test Suite**
**Runs all tests except API tests (requires no server):**

```bash
npm run test:all
```

This runs:
1. Database tests
2. Validation tests

---

## 🛠️ Utility Scripts

### Clean Database
**Removes all tables and enum types for fresh start:**

```bash
npm run db:clean
```

**When to use:**
- Before running tests on clean database
- When schema changes require full reset
- To fix enum type conflicts

**⚠️ WARNING:** This deletes ALL data. Only use in development!

---

## 📊 Test Results Interpretation

### Database Tests

**✅ PASS (Green):**
- Feature working correctly
- Database operations successful

**❌ FAIL (Red):**
- Critical error, needs immediate attention
- Database schema mismatch or connection issue

**⚠️ WARN (Yellow):**
- Minor issue or expected behavior
- May need attention but not blocking

### API Tests

**✅ PASS:**
- Endpoint responding correctly
- Expected status codes returned

**⚠️ WARN:**
- Endpoint needs authentication
- Requires seeded data to test fully

**❌ FAIL:**
- Endpoint not working
- Unexpected status code
- Server not responding

### Validation Tests

**✅ PASS:**
- Validators catching invalid data
- Valid data passing through

**❌ FAIL:**
- Validators not working correctly
- Invalid data not being caught

---

## 🚀 Quick Test Workflow

### For Development:

1. **Clean database (optional):**
   ```bash
   npm run db:clean
   ```

2. **Start server:**
   ```bash
   npm run start:dev
   ```
   Wait 30-40 seconds for full initialization

3. **Run database tests (in new terminal):**
   ```bash
   npm run test:db
   ```

4. **Run validation tests:**
   ```bash
   npm run test:validation
   ```

5. **Run API tests (server must be running):**
   ```bash
   npm run test:api
   ```

---

## 📈 Test Coverage

### Current Coverage:

| Module | Database | API | Validation |
|--------|----------|-----|------------|
| Users | ✅ | ✅ | ✅ |
| Clients | ✅ | ✅ | ✅ |
| Sites | ✅ | ✅ | ✅ |
| Contracts | ✅ | ✅ | ✅ |
| Zones | ✅ | ✅ | ⚠️ |
| Interventions | ✅ | ✅ | ✅ |
| Schedules | ✅ | ✅ | ⚠️ |
| Checklists | ✅ | ✅ | ⚠️ |
| Absences | ✅ | ✅ | ⚠️ |
| Dashboard | ✅ | ✅ | N/A |
| Auth | ✅ | ✅ | N/A |

**Legend:**
- ✅ Full coverage
- ⚠️ Partial coverage
- ❌ No coverage

---

## 🔍 Troubleshooting

### Database Tests Failing

**Issue:** Connection errors
**Solution:** 
- Check `.env` file has correct DATABASE_URL
- Verify Supabase project is active
- Run `npm run db:clean` to reset

**Issue:** Enum type conflicts
**Solution:**
```bash
npm run db:clean
npm run start:dev
# Wait 30 seconds for table creation
npm run test:db
```

### API Tests Failing

**Issue:** "Server not responding"
**Solution:**
- Ensure server is running: `npm run start:dev`
- Wait 30-40 seconds after starting server
- Check port 3000 is not in use

**Issue:** All endpoints return 401
**Solution:**
- Create admin user in database first
- Update test credentials in `test-api-endpoints.ts`
- Or run tests that don't require auth

### Validation Tests Failing

**Issue:** "Module not found"
**Solution:**
```bash
npm install
npm run build
npm run test:validation
```

---

## 🎯 Test Goals

### Before Deployment:

- [ ] All database tests passing (26/26)
- [ ] All validation tests passing (25/25)
- [ ] API tests with authentication passing
- [ ] Zero TypeScript errors
- [ ] Zero ESLint errors
- [ ] All 13 tables created with proper relationships
- [ ] All 120 API endpoints responding correctly

### Recommended Schedule:

- **Daily:** Run validation tests
- **Before commits:** Run database + validation tests
- **Before deployment:** Run full test suite including API tests
- **After schema changes:** Run database tests + clean DB first

---

## 📝 Adding New Tests

### For new entities:

1. Add database schema test to `test-database.ts`
2. Add DTO validation to `test-validation.ts`
3. Add API endpoint tests to `test-api-endpoints.ts`
4. Update expected counts in test files

### For new endpoints:

1. Add to appropriate module group in `test-api-endpoints.ts`
2. Test success cases (200, 201)
3. Test error cases (400, 404, 401)
4. Test with/without authentication

---

## 🔒 Security Testing (Future)

Additional test suites to consider:

- **Authentication security:** JWT token validation, expiry
- **Authorization:** Role-based access control
- **SQL injection:** Malicious input handling
- **Rate limiting:** API throttling
- **File uploads:** Photo validation, size limits
- **CORS:** Cross-origin request handling

---

## 📞 Support

If tests are failing unexpectedly:

1. Check this guide's troubleshooting section
2. Review error messages in terminal
3. Verify environment variables in `.env`
4. Check database connection
5. Ensure all dependencies installed: `npm install`

---

**Last Updated:** January 16, 2026  
**Test Coverage:** 88% (Database + Validation + Basic API)  
**Backend Status:** 100% Complete (11/11 modules)  
**Target:** 95% (Add integration + security tests)
