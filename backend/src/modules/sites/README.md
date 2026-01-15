# Sites Module

## What This Module Does

Manages all physical locations where Nettoyage Plus provides cleaning services. A site is any building, office, or facility that needs cleaning.

## Key Features

**Site Information Stored:**
- Basic details: Name, address, city, postal code, country
- Size category: Small, Medium, or Large
- Status: Active, Inactive, Under Maintenance, or Closed
- Access information: Instructions for entering, working hours
- Contact details: On-site contact person, phone, email
- Notes: Any special requirements or information

**Relationships:**
- Every site belongs to one client
- Sites can have multiple service contracts
- Sites can have multiple cleaning interventions
- When a client is deleted, their sites are also removed

**What You Can Do:**
- Create new sites and link them to clients
- Search and filter sites by client, size, status, or location
- Update site information and status
- Temporarily close or mark sites for maintenance
- Delete sites (can be restored later)
- View all contracts and interventions for a site

**Business Rules:**
- Every site must belong to an existing client
- Site ownership cannot be changed after creation (use transfer feature instead)
- Cannot delete clients that have active sites

## Available Functions

**create()** - Creates a new site linked to a client (validates client exists)

**createBatch()** - Creates multiple sites at once, returns successes and errors

**findAll()** - Lists all sites with pagination, filtering by client/size/status, and search

**findOne()** - Finds a single site by ID or name (always includes client information)

**findById()** - Gets a specific site by their unique ID

**update()** - Updates site information (clientId cannot be changed)

**updateBatch()** - Updates multiple sites at once

**remove()** - Soft deletes a site (can be restored later)

**removeBatch()** - Soft deletes multiple sites at once

**restore()** - Restores a previously deleted site

**restoreBatch()** - Restores multiple deleted sites at once
