/**
 * User roles in the system
 * Dynamic permissions will be controlled via admin panel
 * Backend provides ALL capabilities, frontend/admin controls access
 *
 * Hierarchy (from USER_ROLES.md):
 * SUPER_ADMIN → DIRECTOR → SECTOR_CHIEF → ZONE_CHIEF → TEAM_CHIEF → AGENT
 * Plus: ASSISTANT, QUALITY_CONTROLLER, ACCOUNTANT, CLIENT
 */
export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  DIRECTOR = 'DIRECTOR',
  ASSISTANT = 'ASSISTANT',
  SECTOR_CHIEF = 'SECTOR_CHIEF',
  ZONE_CHIEF = 'ZONE_CHIEF',
  TEAM_CHIEF = 'TEAM_CHIEF',
  AGENT = 'AGENT',
  QUALITY_CONTROLLER = 'QUALITY_CONTROLLER',
  ACCOUNTANT = 'ACCOUNTANT',
  CLIENT = 'CLIENT',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  ARCHIVED = 'ARCHIVED',
}
