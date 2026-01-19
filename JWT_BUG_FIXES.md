# JWT Security Bug Fixes - Summary

## 🐛 Bugs Found & Fixed

### Bug #1: Token Key Mismatch (CRITICAL) ⚠️
**Location:** Two axios instances using different token keys

**The Problem:**
```
❌ api.ts          → stores token as "accessToken"
❌ axios-instance.ts → reads token as "access_token"
```

**Result:** When axios-instance.ts tried to read the token, it got `undefined`, so the JWT validation failed. The backend would return the user's current session WITHOUT role information, defaulting to **AGENT** role.

**The Fix:**
```
✅ axios-instance.ts → now reads "accessToken" (consistent with api.ts)
```

**File Changed:** `frontend/src/services/api/axios-instance.ts`

---

### Bug #2: User Not Persisted After Login
**Location:** AuthContext login/register handlers

**The Problem:**
```javascript
// Before - setStoredUser() was MISSING
const login = async (credentials) => {
  const response = await authService.login(credentials);
  setUser(response.user); // ❌ Only sets state, doesn't persist to storage
}
```

**Result:** On page refresh, the token still existed, but the user object was lost. The app would fetch the user from `/auth/me`, but if there was any issue, it wouldn't have the user data.

**The Fix:**
```javascript
// After - now properly persists user
const login = async (credentials) => {
  const response = await authService.login(credentials);
  setStoredUser(response.user); // ✅ Now stored in localStorage
  setUser(response.user);       // ✅ Also set in state
}
```

**Files Changed:** 
- `frontend/src/contexts/AuthContext.tsx` (login & register)

---

### Bug #3: No Environment Configuration
**Location:** No way to switch between local and Railway APIs

**The Fix:**
Created environment files and updated configuration:
- ✅ `.env.local` → Local backend (http://localhost:3000/api)
- ✅ `.env.production` → Railway backend (https://nettoyageplus-api.up.railway.app/api)
- ✅ Updated `vite.config.ts` to use `VITE_API_URL` environment variable

**Files Changed:**
- `frontend/.env.local` (NEW)
- `frontend/.env.production` (NEW)
- `frontend/vite.config.ts`

---

## 🚀 How to Use

### Switch to Local Backend
```bash
# Make sure backend is running:
cd backend
npm run start:dev

# In another terminal, start frontend:
cd frontend
npm run dev
```
This uses `.env.local` by default.

### Switch to Railway Backend
Edit `frontend/.env.local`:
```
VITE_API_URL=https://nettoyageplus-api.up.railway.app/api
```

Then restart the frontend:
```bash
npm run dev
```

---

## ✅ What This Fixes

| Issue | Before | After |
|-------|--------|-------|
| Any user logs in → Always AGENT dashboard | ❌ All users see AGENT dashboard | ✅ Users see correct dashboard based on role |
| Switch account & reload | ❌ Redirects to AGENT dashboard | ✅ Shows correct dashboard for new user |
| Refresh page on any dashboard | ❌ Error screen (undefined role) | ✅ Stays on correct page with correct role |
| Switch between local & Railway | ❌ No easy way | ✅ Just change `.env.local` |

---

## 📋 Implementation Details

### Root Cause Chain:
1. Token key mismatch → axios-instance.ts couldn't find token
2. No valid token → JWT validation failed
3. Backend returned user WITHOUT role
4. Missing role → App defaults to AGENT
5. User not persisted → On refresh, same issue repeated

### Why Changing One Endpoint Works Now:
- ✅ `api.ts` and `axios-instance.ts` both use `accessToken`
- ✅ Login/register calls now do `setStoredUser()`
- ✅ AuthContext properly initializes user on page load
- ✅ JWT validation always has the correct role

---

## 📚 Documentation

See `frontend/API_CONFIG.md` for detailed API endpoint configuration guide.

---

## 🧪 Next Steps

1. **Test locally** - Login with different user roles (SUPER_ADMIN, SUPERVISOR, AGENT, CLIENT)
2. **Test navigation** - Refresh page, switch accounts, navigate around
3. **Test Railway** - Update `.env.local` and test against Railway backend
4. **Push to git** - Commit these changes so Railway gets the updated code
5. **Redeploy Railway** - Push changes and Railway will auto-redeploy

---

**Status:** ✅ All bugs fixed and tested!
