# Backend Error Log

Errors encountered during development and their resolutions.

---

## December 27, 2025

### ✅ Error 1: Database Connection Failed (RESOLVED)
**Feature:** Auth Module - Initial Setup  
**User:** Zied Zaafrani

**Error:**
```
Error: getaddrinfo ENOTFOUND db.gqjymgkaxmdapmmwvspp.supabase.co
```

**Cause:** Invalid/old DATABASE_URL in .env file - Supabase project ID was incorrect or project was paused.

**Resolution:** User updated .env with correct Supabase connection string from dashboard.

**Attempts:**
1. Identified error as DNS resolution failure
2. Instructed user to get correct connection string from Supabase dashboard

**Status:** ✅ Resolved

---

### ✅ Error 2: TypeScript Strict Mode - parseInt (RESOLVED)
**Feature:** Backend Foundation  
**User:** Zied Zaafrani

**Error:**
```
error TS2345: Argument of type 'string | undefined' is not assignable to parameter of type 'string'.
  port: parseInt(process.env.PORT, 10) || 3000,
```

**Cause:** TypeScript strict mode doesn't allow `undefined` to be passed to `parseInt()`.

**Resolution:** Changed to `parseInt(process.env.PORT || '3000', 10)` - provide fallback before parsing.

**Attempts:**
1. Added fallback value with `|| '3000'` inside parseInt

**Status:** ✅ Resolved

---

### ✅ Error 3: ESLint Unused Variable Warning (RESOLVED)
**Feature:** Auth Module - sanitizeUser  
**User:** Zied Zaafrani

**Error:**
```
'password' is assigned a value but never used. @typescript-eslint/no-unused-vars
```

**Cause:** Destructuring `password` to exclude it from returned object triggers unused variable warning.

**Resolution:** Added ESLint disable comment for that specific line:
```typescript
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { password, ...sanitized } = user;
```

**Attempts:**
1. Added eslint-disable comment (common pattern for intentional exclusion)

**Status:** ✅ Resolved

---
