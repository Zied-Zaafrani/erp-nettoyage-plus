# Users Module

## What This Module Does

Manages all employee and staff accounts in the Nettoyage Plus system. Each user account represents someone who works for or with the company.

## Key Features

**User Information Stored:**
- Personal details: Email, first name, last name, phone
- Account role: Determines job function and system permissions
- Account status: Active, Suspended, or Archived
- Login tracking: When user last logged in

**Available Roles:**
- Super Admin: Full system control
- Director: Company leadership
- Assistant: Administrative support
- Sector Chief: Regional management
- Zone Chief: Area supervisors
- Team Chief: Team leaders
- Agent: Cleaning staff
- Accountant: Financial operations
- Quality Controller: Service quality oversight
- Client: Customer portal access

**What You Can Do:**
- Create user accounts individually or in bulk
- Search users by email, phone, role, or status
- Update user details and change roles
- Suspend or archive accounts (soft delete - can be restored)
- View user activity and login history

**Business Rules:**
- Email addresses must be unique
- Passwords must be at least 18 characters
- Users default to Agent role if not specified
- Deleted users can be restored if needed

## Available Functions

**create()** - Creates a new user account with hashed password

**createBatch()** - Creates multiple users at once, returns successes and errors

**findAll()** - Lists all users with pagination, filtering by role/status, and search

**findOne()** - Finds a single user by ID, email, or phone

**findById()** - Gets a specific user by their unique ID

**update()** - Updates user information (email changes checked for uniqueness)

**updateBatch()** - Updates multiple users at once

**remove()** - Soft deletes a user (can be restored later)

**removeBatch()** - Soft deletes multiple users at once

**restore()** - Restores a previously deleted user

**restoreBatch()** - Restores multiple deleted users at once

**sanitizeUser()** - Internal function that removes password from responses
