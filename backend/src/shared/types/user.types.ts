/**
 * User roles in the system
 * Dynamic permissions will be controlled via admin panel
 * Backend provides ALL capabilities, frontend/admin controls access
 */
export enum UserRole {
  ADMIN = 'ADMIN',
  SUPERVISOR = 'SUPERVISOR',
  ZONE_CHIEF = 'ZONE_CHIEF',
  TEAM_CHIEF = 'TEAM_CHIEF',
  AGENT = 'AGENT',
  ACCOUNTANT = 'ACCOUNTANT',
  QUALITY_CONTROLLER = 'QUALITY_CONTROLLER',
  CLIENT = 'CLIENT',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  ARCHIVED = 'ARCHIVED',
}
