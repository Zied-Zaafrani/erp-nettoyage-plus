/**
 * User roles in the system
 * Dynamic permissions will be controlled via admin panel
 * Backend provides ALL capabilities, frontend/admin controls access
 *
 * Hierarchy:
 * SUPER_ADMIN → DIRECTOR → SECTOR_CHIEF → ZONE_CHIEF → TEAM_CHIEF → AGENT
 * Plus: ASSISTANT, SUPERVISOR, QUALITY_CONTROLLER, ACCOUNTANT, CLIENT
 */
export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  DIRECTOR = 'DIRECTOR',
  SECTOR_CHIEF = 'SECTOR_CHIEF',
  ZONE_CHIEF = 'ZONE_CHIEF',
  TEAM_CHIEF = 'TEAM_CHIEF',
  ASSISTANT = 'ASSISTANT',
  SUPERVISOR = 'SUPERVISOR',
  QUALITY_CONTROLLER = 'QUALITY_CONTROLLER',
  ACCOUNTANT = 'ACCOUNTANT',
  AGENT = 'AGENT',
  CLIENT = 'CLIENT',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  ARCHIVED = 'ARCHIVED',
}
