# Clients & Contracts API - Quick Test Guide

## 🚀 Getting Started

### Prerequisites
- Backend running on `http://localhost:3000`
- Authenticated user with appropriate role
- Postman or similar API client

### Base URL
```
http://localhost:3000/api
```

---

## 👥 CLIENTS API TESTING

### 1. Create a Client

**POST** `/clients`

```json
{
  "name": "Acme Corporation",
  "type": "COMPANY",
  "email": "contact@acme.com",
  "phone": "+222-123-456",
  "address": "123 Main Street",
  "city": "Nouakchott",
  "postalCode": "00100",
  "country": "Mauritania",
  "contactPerson": "John Doe",
  "contactPhone": "+222-789-012",
  "notes": "Important client",
  "status": "PROSPECT"
}
```

**Expected Response** (201):
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "clientCode": "CLI-0001",
  "name": "Acme Corporation",
  "type": "COMPANY",
  "email": "contact@acme.com",
  "phone": "+222-123-456",
  "address": "123 Main Street",
  "city": "Nouakchott",
  "postalCode": "00100",
  "country": "Mauritania",
  "contactPerson": "John Doe",
  "contactPhone": "+222-789-012",
  "notes": "Important client",
  "status": "PROSPECT",
  "createdAt": "2026-01-17T10:00:00Z",
  "updatedAt": "2026-01-17T10:00:00Z",
  "deletedAt": null
}
```

---

### 2. Get All Clients

**GET** `/clients?page=1&limit=10&status=ACTIVE&type=COMPANY`

**Query Parameters**:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `search`: Search by name, email, or contact person
- `status`: Filter by status (PROSPECT, ACTIVE, SUSPENDED, ARCHIVED)
- `type`: Filter by type (INDIVIDUAL, COMPANY, MULTISITE)
- `city`: Filter by city
- `sortBy`: Sort field (name, email, type, status, createdAt)
- `sortOrder`: ASC or DESC

**Expected Response** (200):
```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "clientCode": "CLI-0001",
      "name": "Acme Corporation",
      "type": "COMPANY",
      "email": "contact@acme.com",
      "phone": "+222-123-456",
      "city": "Nouakchott",
      "status": "ACTIVE",
      "contactPerson": "John Doe",
      "createdAt": "2026-01-17T10:00:00Z"
    }
  ],
  "meta": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

---

### 3. Get Client by ID

**GET** `/clients/:id`

**URL Parameters**:
- `id`: UUID of client

**Expected Response** (200):
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "clientCode": "CLI-0001",
  "name": "Acme Corporation",
  "type": "COMPANY",
  "email": "contact@acme.com",
  "phone": "+222-123-456",
  "address": "123 Main Street",
  "city": "Nouakchott",
  "postalCode": "00100",
  "country": "Mauritania",
  "contactPerson": "John Doe",
  "contactPhone": "+222-789-012",
  "notes": "Important client",
  "status": "ACTIVE",
  "createdAt": "2026-01-17T10:00:00Z",
  "updatedAt": "2026-01-17T10:00:00Z",
  "deletedAt": null
}
```

---

### 4. Update Client

**PATCH** `/clients/:id`

```json
{
  "status": "ACTIVE",
  "notes": "Updated notes",
  "contactPhone": "+222-999-888"
}
```

**Expected Response** (200): Updated client object

---

### 5. Search Client

**GET** `/clients/search?email=contact@acme.com`

**Query Parameters**:
- `id`: Client UUID
- `email`: Client email
- `name`: Client name

**Expected Response** (200): Single client object

---

### 6. Delete Client (Soft)

**DELETE** `/clients/:id`

**Expected Response** (200):
```json
{
  "message": "Client deleted successfully",
  "id": "550e8400-e29b-41d4-a716-446655440000"
}
```

---

## 📋 CONTRACTS API TESTING

### 1. Create a Contract

**POST** `/contracts`

```json
{
  "clientId": "550e8400-e29b-41d4-a716-446655440000",
  "siteId": "660e8400-e29b-41d4-a716-446655440000",
  "type": "PERMANENT",
  "frequency": "WEEKLY",
  "startDate": "2026-01-20",
  "endDate": "2027-01-20",
  "status": "DRAFT",
  "pricing": {
    "monthlyFee": 5000,
    "currency": "MRU",
    "billingCycle": "MONTHLY",
    "paymentTerms": "Net 30 days"
  },
  "serviceScope": {
    "zones": ["Reception", "Bureaux", "Sanitaires"],
    "tasks": ["Nettoyage", "Désinfection"],
    "specialInstructions": "Pay special attention to high-traffic areas"
  },
  "notes": "Weekly cleaning contract"
}
```

**Expected Response** (201):
```json
{
  "id": "770e8400-e29b-41d4-a716-446655440000",
  "contractCode": "CNT-0001",
  "clientId": "550e8400-e29b-41d4-a716-446655440000",
  "siteId": "660e8400-e29b-41d4-a716-446655440000",
  "type": "PERMANENT",
  "frequency": "WEEKLY",
  "startDate": "2026-01-20",
  "endDate": "2027-01-20",
  "status": "DRAFT",
  "pricing": {
    "monthlyFee": 5000,
    "currency": "MRU",
    "billingCycle": "MONTHLY",
    "paymentTerms": "Net 30 days"
  },
  "serviceScope": {
    "zones": ["Reception", "Bureaux", "Sanitaires"],
    "tasks": ["Nettoyage", "Désinfection"],
    "specialInstructions": "Pay special attention to high-traffic areas"
  },
  "notes": "Weekly cleaning contract",
  "createdAt": "2026-01-17T10:00:00Z",
  "updatedAt": "2026-01-17T10:00:00Z",
  "deletedAt": null
}
```

---

### 2. Get All Contracts

**GET** `/contracts?page=1&limit=10&status=ACTIVE&type=PERMANENT`

**Query Parameters**:
- `page`: Page number
- `limit`: Items per page
- `status`: Filter by status (DRAFT, ACTIVE, SUSPENDED, COMPLETED, TERMINATED)
- `type`: Filter by type (PERMANENT, ONE_TIME)
- `clientId`: Filter by client
- `siteId`: Filter by site

**Expected Response** (200):
```json
{
  "data": [
    {
      "id": "770e8400-e29b-41d4-a716-446655440000",
      "contractCode": "CNT-0001",
      "clientId": "550e8400-e29b-41d4-a716-446655440000",
      "siteId": "660e8400-e29b-41d4-a716-446655440000",
      "type": "PERMANENT",
      "frequency": "WEEKLY",
      "startDate": "2026-01-20",
      "endDate": "2027-01-20",
      "status": "ACTIVE",
      "createdAt": "2026-01-17T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

---

### 3. Get Contract by ID

**GET** `/contracts/:id`

**Expected Response** (200): Full contract object

---

### 4. Update Contract

**PATCH** `/contracts/:id`

```json
{
  "status": "ACTIVE",
  "frequency": "BIWEEKLY",
  "notes": "Updated frequency to biweekly"
}
```

**Note**: Cannot update `clientId` or `siteId` after creation

**Expected Response** (200): Updated contract object

---

### 5. Delete Contract (Soft)

**DELETE** `/contracts/:id`

**Expected Response** (200):
```json
{
  "message": "Contract deleted successfully",
  "id": "770e8400-e29b-41d4-a716-446655440000"
}
```

---

## ❌ Error Handling

### Common Error Responses

**400 - Bad Request**
```json
{
  "statusCode": 400,
  "message": "End date must be after start date",
  "error": "BadRequestException"
}
```

**404 - Not Found**
```json
{
  "statusCode": 404,
  "message": "Client with ID xxx not found",
  "error": "NotFoundException"
}
```

**409 - Conflict**
```json
{
  "statusCode": 409,
  "message": "Client with email contact@acme.com already exists",
  "error": "ConflictException"
}
```

**401 - Unauthorized**
```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "UnauthorizedException"
}
```

**403 - Forbidden**
```json
{
  "statusCode": 403,
  "message": "Insufficient permissions",
  "error": "ForbiddenException"
}
```

---

## 📊 Batch Operations

### Batch Create Clients

**POST** `/clients/batch`

```json
{
  "clients": [
    {
      "name": "Client 1",
      "email": "client1@example.com",
      "type": "INDIVIDUAL"
    },
    {
      "name": "Client 2",
      "email": "client2@example.com",
      "type": "COMPANY"
    }
  ]
}
```

**Response**:
```json
{
  "created": [
    { "id": "...", "clientCode": "CLI-0001", "name": "Client 1", ... },
    { "id": "...", "clientCode": "CLI-0002", "name": "Client 2", ... }
  ],
  "errors": []
}
```

---

### Batch Delete

**POST** `/clients/batch/delete`

```json
{
  "ids": [
    "550e8400-e29b-41d4-a716-446655440000",
    "550e8400-e29b-41d4-a716-446655440001"
  ]
}
```

---

## 🔐 Authentication

All requests require JWT token in Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

---

## 💾 Data Persistence

- All deletes are **soft deletes** (data retained with `deletedAt` timestamp)
- Use restore endpoints to recover deleted records
- Original data never fully deleted

---

**Last Updated**: January 17, 2026
