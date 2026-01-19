# Testing JWT Fixes

## Quick Test Checklist

### 1. Test Local Backend
```bash
# Terminal 1 - Start backend
cd backend
npm run start:dev

# Terminal 2 - Start frontend
cd frontend
npm run dev
```

### 2. Test Login with Different Roles

**Before testing**, make sure you have users in the database with different roles. If not, seed them:

```bash
cd backend
npm run seed-admin  # or your seed script
```

**Test scenarios:**

| User Role | Expected Dashboard | Test Steps |
|-----------|-------------------|-----------|
| SUPER_ADMIN | Admin Dashboard with full access | Login with admin account → Should see all management pages |
| SUPERVISOR | Supervisor Dashboard with management access | Login with supervisor → Can access users, clients, contracts |
| AGENT | Agent Dashboard with limited access | Login with agent → Can only see interventions/schedules |
| CLIENT | Client Portal (if implemented) | Login with client → Limited to own data |

### 3. Test Page Refresh
1. Login with SUPER_ADMIN account
2. Navigate to `/users` page
3. **Refresh page** (Ctrl+R or Cmd+R)
4. ✅ Should stay on `/users` page with correct admin access
5. ❌ Bug would have redirected you to agent dashboard with error

### 4. Test Account Switching
1. Login with SUPER_ADMIN
2. Open DevTools → Application → localStorage
3. Copy the `accessToken`
4. Logout
5. Clear localStorage
6. Login with AGENT account
7. ✅ Should see AGENT dashboard
8. ✅ Refresh should stay on agent dashboard
9. ❌ Bug would have shown admin dashboard

### 5. Test Railway Backend

**Switch to Railway:**
```
# Edit frontend/.env.local
VITE_API_URL=https://nettoyageplus-api.up.railway.app/api
```

Then restart:
```bash
npm run dev
```

Test same scenarios as local backend.

---

## Signs the Bugs Are Fixed ✅

- [ ] Login works for any user role
- [ ] After login, user sees dashboard matching their role
- [ ] Page refresh maintains dashboard without error
- [ ] Switching accounts works correctly
- [ ] Token persists in localStorage as `accessToken`
- [ ] Can switch between local and Railway APIs via `.env.local`
- [ ] No "default AGENT dashboard" for all users

---

## Debugging Commands

### Check localStorage
```javascript
// In browser console
localStorage.getItem('accessToken')  // Should return token
localStorage.getItem('user')         // Should return user object with role
```

### Check JWT token contents
```javascript
// Decode JWT (install jwt-decode if needed)
const jwtDecode = require('jwt-decode');
const token = localStorage.getItem('accessToken');
console.log(jwtDecode(token));  // Should show { sub, email, role, iat, exp }
```

### Check current user
```javascript
// In browser console
fetch('/api/auth/me', {
  headers: { 'Authorization': 'Bearer ' + localStorage.getItem('accessToken') }
})
.then(r => r.json())
.then(console.log)  // Should show user with correct role
```

---

## Common Issues & Solutions

### "Still seeing AGENT dashboard for all users"
- [ ] Did you rebuild/restart the frontend? `npm run dev`
- [ ] Check `.env.local` exists with correct API URL
- [ ] Clear browser localStorage and login again
- [ ] Check Network tab in DevTools for failed requests

### "401 Unauthorized on Railway"
- [ ] Make sure you pushed the code changes to git
- [ ] Railway auto-deploys on git push
- [ ] Check that the database has users with correct roles
- [ ] Try logging out and logging back in

### "CORS errors"
- [ ] Verify `VITE_API_URL` in `.env.local`
- [ ] Check that backend is running
- [ ] Restart frontend after changing `.env.local`

---

## Next: Push to Production

Once all tests pass locally:

```bash
# Commit fixes
git add .
git commit -m "Fix JWT authentication bugs and add API configuration"

# Push to Railway
git push origin main

# Railway will auto-deploy!
```

Then test again on Railway with your test users.

---

**Last Updated:** January 17, 2026
**Status:** All fixes implemented and ready for testing
