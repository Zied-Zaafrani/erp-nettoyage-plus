# Users Page & Tab Redesign — Step-by-Step Plan

## Step 1: Access Permissions

- Only users with the **Super Admin** or **Admin** or **Superviseur** role can access the Users page/tab.
- **Agents** and **Clients** cannot access or view the Users page/tab.
- Access is enforced in both frontend and backend.

---

## Step 2: Roles and Responsibilities (Users Page Context Only)

- **Super Admin**
  - Has full, unrestricted access to all user management features.
  - Can view, create, edit, assign, and archive all Admins, Supervisors, Agents, and Clients.
  - Can assign roles,or create, edit, and assign custom roles (e.g., Quality Controller, Accountant, Assistant, etc.) as described in the operations book.
  - Only one Super Admin can be logged in at a time for security and control.
  - Can manage and audit all user actions and permissions.

- **Admin**
  - Full access to all user management features on the Users page.
  - Can create, edit, assign, and archive supervisors, agents, and clients.
  - Cannot create, see, edit, assign, or archive any other Admins or the Super Admin on the Users page.

- **Superviseur**
  - Can view the list of their assigned agents on the Users page.
  - Cannot create new agents.
  - Can only edit limited fields for their assigned agents (e.g., attendance status, site assignment, performance notes).
  - Cannot edit personal details, contract info, or change agent roles.
  - Cannot see or manage other supervisors, admins, or clients on the Users page.

- **Agent**
  - Cannot access the Users page.
  - No visibility or management rights over any users.

- **Client**
  - Cannot access the Users page.
  - No visibility or management rights over any users.

---

## Step 3: Detail Field-Level Permissions (Users Page Context Only)

- **Super Admin**
  - Can view and edit all fields for all users, including roles, personal details, assignments, and status.
  - Can create and assign custom roles.
  - Can change any user's status (active, inactive, archived, etc.).
  - Can reset passwords and manage security settings for any user.

- **Admin**
  - Can view and edit all fields for Supervisors, Agents, and Clients.
  - Cannot view or edit fields for other Admins or the Super Admin.
  - Can change status (active, inactive, archived) for Supervisors, Agents, and Clients.
  - Can reset passwords for Supervisors, Agents, and Clients.

- **Superviseur**
  - Can view all fields for their assigned Agents.
  - Can edit only operational fields for their Agents:
    - Attendance status
    - Site assignment
    - Performance notes
  - Cannot edit personal details, contract info, or change agent roles.
  - Cannot view or edit any fields for Admins, other Supervisors, or Clients.

---

## Step 4: Map Role Hierarchy, Assignment Logic, and Statuses (Users Page Context Only)

### Role Hierarchy

- **Super Admin**
  - Top-level authority; manages all roles and users.
- **Admin**
  - Manages Supervisors, Agents, and Clients.
- **Superviseur**
  - Manages only their assigned Agents.
- **Agent**
  - Reports to a single Supervisor(work) or Admin(app problems).
- **Client**
  - No management authority; only views their own data or report to admin(app problems).

### Assignment Logic

- **Super Admin** and **Admin** can assign Supervisors to Agents, and Agents to sites.
- **Superviseur** can only manage assignments for their own Agents (e.g., assign to sites, update attendance).
- **Agents** are always assigned to a Supervisor and one or more sites.
- **Clients** are linked to their own contracts and sites, but not to personnel.

### User Statuses

- **Active**: User Employee is currently employed/engaged and has access to the system (where applicable).
- **Inactive**: User Employee is temporarily not working (e.g., on leave, not assigned to a site, on break, ended shift), but still part of the organization.
- **Archived**: User is no longer part of the organization (soft delete); cannot log in or be assigned.

#### Client Statuses

- **Current**: Client is under an active contract and can access their portal.
- **Former**: Client's contract has ended; No cuurent work or contract is with them but still has access to the portal to see old contracts and works, or to leave a review, and historical data is retained.
- **Archived**: Client is fully removed from active operations (soft delete); no access, but data is kept for records.


**Status Logic:**
- Only Super Admin can change user statuses with force.
- Status changes are logged for audit purposes.
- Every employee can mark the end of theire shift, when they take break, or any other case where they change status between active and inactive.
- Archived users can be restored by Super Admin or Admin.
- Super Admin has no status.

---

## Step 5: Design Users Page UI/UX Structure

### 5.1 Navigation & Entry Points

- **Sidebar Navigation**
  - All roles with access (Super Admin, Admin, Superviseur) see a navigation item for user management.
  - The label and dropdown content adapt by role:
    - **Super Admin:** Label is "Users". Dropdown shows: Admins, Supervisors, Agents, Clients, plus any custom roles.
    - **Admin:** Label is "Users". Dropdown shows: Supervisors, Agents, Clients.
    - **Superviseur:** Label is "Your Agents". Dropdown shows: Agents only (their assigned team).

- **Dropdown Behavior**
  - Clicking the navigation item animates a dropdown with the relevant role categories.
  - Selecting a category navigates to a filtered list/table for that role.

- **Double-Click Behavior**
  - Double-clicking the navigation item (or a dedicated "All" option) opens a page showing all users visible to that role (e.g., Super Admin sees all, Admin sees Supervisors/Agents/Clients, Superviseur sees their Agents and clients he is working with).

- **No Access**
  - Agents and Clients do not see any user management navigation.

---

### 5.2 List/Table View (per role)

#### Super Admin
- Sees a unified table for each role (Admins, Supervisors, Agents, Clients, Custom Roles) via dropdown or tabs.
- Double-clicking "Users" shows all users in a single table.
- Columns: Name, Email, Role, Status, Actions.
- Actions per row: Edit, Activate/Deactivate (Archive/Restore), Sleep/Awake (for employees).
- Multi-select: Enables batch actions (Activate, Deactivate, Sleep, Awake, Batch Add).
- Filters: By role(if in the all tab), status, search bar.
- "Create New" and "Batch Add" buttons always visible.

#### Admin
- Sees tables for Supervisors, Agents, and Clients via dropdown or tabs.
- Double-clicking "Users" shows all visible users in a single table.
- Columns: Name, Email, Role, Status, Actions.
- Actions per row: Edit, Activate/Deactivate (Archive/Restore), Sleep/Awake (for employees).
- Multi-select: Enables batch actions for allowed roles.
- Filters: By role, status, assignment, site, search bar.
- "Create New" and "Batch Add" for Supervisors, Agents, Clients.

#### Superviseur
- Can view only their assigned Agents.
- Columns: Name, Email, Status, Assignment, Actions.
- Actions: Edit (limited fields), Sleep/Awake, Performance Notes.
- No batch add or batch role assignment.
- Filters: By status, assignment, search bar.
- No "Create New" button.

#### Agent & Client
- No access to Users page/tab.

---

### 5.3 User Detail Page

- Opens when clicking a user’s name.
- Shows: Name, Email, Role, Status, Assignment (site/team), Contact info, History (status/activity log), Notes, Contextual details.
- Actions (per role): Reset Password, Confirm Email, Assign Role, Assign Agents (for supervisors), Archive/Restore, Sleep/Awake, Edit (fields per permissions).

---

### 5.4 Batch Actions & Filters

- Multi-select checkboxes for batch actions (permitted by role).
- Batch: Activate, Deactivate, Sleep, Awake, Delete, Restore, Assign Role, Batch Add.
- Filters: Role, Status, Assignment, Site, Search.

---

### 5.5 Role-Based Visibility

- Super Admin: Sees and manages all.
- Admin: Sees/manages Supervisors, Agents, Clients.
- Superviseur: Sees/manages only their Agents.
- Agent/Client: No access.

---

**Next:**  
Detail the UI/UX for each role’s main list/table and user detail page, including which actions and fields are visible/editable.