# User Roles - Nettoyage Plus

**Last Updated:** December 27, 2025

---

## Roles (From Operational Plan + Project Summary)

### SUPER_ADMIN
- System configuration and management
- All access across entire system
- Can modify permissions

### DIRECTOR
- Overall operations supervision
- Strategic decisions
- Reviews reports (daily, weekly, monthly)
- Validates adjustments

### ASSISTANT
- Administrative support for director
- Organizes meetings
- Handles communications and documents
- Tracks planned tasks

### QUALITY_CTRL
- Random site inspections
- Quality reports and recommendations
- Reviews monthly reports

### SECTOR_CHIEF
- Coordinates zone chiefs
- Reviews daily reports from zones
- Manages mobile teams and vehicle fleet
- Weekly meetings with zone chiefs
- Sends consolidated reports to director

### ZONE_CHIEF
- Daily site visits (random)
- Checks check-lists and attendance
- Verifies stocks, uniforms, equipment
- Resolves reported issues
- Sends daily reports to sector chief
- Weekly meetings with team chiefs

### TEAM_CHIEF
- Organizes agent tasks on-site
- Completes check-lists and attendance sheets
- Controls daily quality
- Tracks stock and equipment status
- Sends reports to zone chief

### AGENT
- Executes cleaning tasks
- Completes check-lists
- Reports issues
- Check-in/out with GPS + photos (mobile app)

### ACCOUNTANT
- Financial module access
- Invoicing and payments

### CLIENT
- Views their contracts and sites
- Access to their invoices
- Can submit complaints and feedback

---

## Permission Philosophy

**Backend provides capabilities** → **Frontend/Admin configures access**

- Backend has all CRUD operations
- Admin panel decides who can use them
- Permissions are configurable, not hardcoded

---

## Access Channels

**Mobile App:** Agent, Team Chief, Zone Chief, Quality Controller  
**Web ERP:** All other roles  
**Client Portal:** Client role only

---

**Note:** From operational plan organigramme + project summary role definitions. System allows multiple accounts per role.