# 🚀 Quick Start Reference - Clients & Contracts Module

## ⚡ 60-Second Setup

### Start Backend
```bash
cd backend
npm install
npm run typeorm migration:run
npm run dev
# Backend running on http://localhost:3000
```

### Start Frontend
```bash
cd frontend
npm install
npm run dev
# Frontend running on http://localhost:5173
```

### Access the App
```
http://localhost:5173/clients      # Clients management
http://localhost:5173/contracts    # Contracts management
```

---

## 📍 Page URLs

| Feature | Frontend URL | Backend API |
|---------|----------|-----------|
| List Clients | `/clients` | `GET /api/clients` |
| Create Client | `/clients/create` | `POST /api/clients` |
| View Client | `/clients/:id` | `GET /api/clients/:id` |
| Edit Client | `/clients/:id/edit` | `PATCH /api/clients/:id` |
| List Contracts | `/contracts` | `GET /api/contracts` |
| Create Contract | `/contracts/create` | `POST /api/contracts` |
| View Contract | `/contracts/:id` | `GET /api/contracts/:id` |
| Edit Contract | `/contracts/:id/edit` | `PATCH /api/contracts/:id` |

---

## 📝 Data Models

### Client
```json
{
  "id": "uuid",
  "clientCode": "CLI-0001",
  "name": "Company Name",
  "type": "COMPANY|INDIVIDUAL|MULTISITE",
  "email": "email@example.com",
  "phone": "+222-123-456",
  "address": "123 Main St",
  "city": "Nouakchott",
  "postalCode": "00100",
  "country": "Mauritania",
  "contactPerson": "John Doe",
  "contactPhone": "+222-789-012",
  "notes": "Any notes",
  "status": "PROSPECT|ACTIVE|SUSPENDED|ARCHIVED"
}
```

### Contract
```json
{
  "id": "uuid",
  "contractCode": "CNT-0001",
  "clientId": "uuid",
  "siteId": "uuid",
  "type": "PERMANENT|ONE_TIME",
  "frequency": "DAILY|WEEKLY|BIWEEKLY|MONTHLY|QUARTERLY|CUSTOM",
  "startDate": "2026-01-20",
  "endDate": "2027-01-20",
  "status": "DRAFT|ACTIVE|SUSPENDED|COMPLETED|TERMINATED",
  "pricing": {
    "monthlyFee": 5000,
    "currency": "MRU",
    "billingCycle": "MONTHLY"
  },
  "serviceScope": {
    "zones": ["Reception", "Bureaux"],
    "tasks": ["Nettoyage", "Désinfection"]
  }
}
```

---

## 🧪 Quick Test

### 1. Create a Client
```bash
curl -X POST http://localhost:3000/api/clients \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Client",
    "email": "test@example.com",
    "type": "COMPANY",
    "status": "PROSPECT"
  }'
```

### 2. Create a Contract
```bash
curl -X POST http://localhost:3000/api/contracts \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "clientId": "CLIENT_UUID_HERE",
    "siteId": "SITE_UUID_HERE",
    "type": "PERMANENT",
    "frequency": "WEEKLY",
    "startDate": "2026-01-20",
    "status": "DRAFT"
  }'
```

### 3. List Clients
```bash
curl -X GET "http://localhost:3000/api/clients?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## ✅ Common Tasks

### Create New Client
1. Click "Create Client" button
2. Fill in form fields
3. Click "Save"
4. Redirected to clients list

### Edit Client
1. Click on client in list
2. Click "Edit" button
3. Modify fields
4. Click "Save"
5. Redirected to detail page

### Create Contract
1. Click "Create Contract" button
2. Select Client (auto-loads sites)
3. Select Site
4. Choose Type (PERMANENT/ONE_TIME)
5. If PERMANENT: Select Frequency
6. Set dates
7. Click "Save"

### Delete Records
1. Click on record to view
2. Click "Delete" button
3. Confirm in modal
4. Record removed from list

---

## 🔍 Search & Filter

### Filter Clients
- **By Status**: PROSPECT, ACTIVE, SUSPENDED, ARCHIVED
- **By Type**: INDIVIDUAL, COMPANY, MULTISITE
- **Search**: Name, Email, Contact Person

### Filter Contracts
- **By Status**: DRAFT, ACTIVE, SUSPENDED, COMPLETED, TERMINATED
- **By Type**: PERMANENT, ONE_TIME
- **By Client**: Select from dropdown
- **Search**: Contract code

---

## ⚠️ Important Notes

1. **Client Code** - Auto-generated (CLI-0001, CLI-0002, etc.)
2. **Contract Code** - Auto-generated (CNT-0001, CNT-0002, etc.)
3. **Email Uniqueness** - Each client must have unique email
4. **Contract Dates** - End date must be after start date
5. **Soft Delete** - Deleted records can be restored
6. **Frequency Required** - Only for PERMANENT contracts
7. **Client/Site Lock** - Cannot change after contract created

---

## 🐛 Troubleshooting

### 401 Unauthorized
- Check JWT token is valid
- Ensure token in Authorization header
- Login again if expired

### 400 Bad Request
- Verify all required fields provided
- Check date format (YYYY-MM-DD)
- Ensure email is valid format

### 404 Not Found
- Client/Contract may be deleted
- Check UUID is correct
- Use search/filter to find records

### 409 Conflict
- Email already in use (clients)
- Code already exists (contracts)

---

## 📚 Documentation Files

- `BUILD_SUMMARY.md` - Overview of build
- `CLIENTS_CONTRACTS_COMPLETE.md` - Full documentation
- `API_TESTING_GUIDE.md` - API endpoint reference

---

## 🎯 User Roles

| Role | Can | Cannot |
|------|-----|--------|
| SUPER_ADMIN | Everything | None |
| DIRECTOR | Create/Edit/Delete | None (except other admins) |
| ASSISTANT | Create/Edit/Delete | None |
| SECTOR_CHIEF | Create/Edit/Delete | None |
| ZONE_CHIEF | View Only | Modify |
| ACCOUNTANT | View Only | Modify |

---

## 🔗 Key Files

**Backend**
- `backend/src/modules/clients/` - Clients module
- `backend/src/modules/contracts/` - Contracts module

**Frontend**
- `frontend/src/pages/clients/` - Clients pages
- `frontend/src/pages/contracts/` - Contracts pages
- `frontend/src/App.tsx` - Route definitions

---

## 📞 Need Help?

1. Check browser console for errors
2. Check backend logs for API errors
3. Review CLIENTS_CONTRACTS_COMPLETE.md
4. Check API_TESTING_GUIDE.md for examples
5. Verify database migrations ran

---

**Last Updated**: January 17, 2026  
**Version**: 1.0 - Production Ready
