/**
 * User roles in the system - PHASE 1 MVP
 * Dynamic permissions will be controlled via admin panel
 * Backend provides ALL capabilities, frontend/admin controls access
 *
 * Phase 1 Hierarchy:
 * SUPER_ADMIN → SUPERVISOR → AGENT
 * Plus: CLIENT
 */
export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  SUPERVISOR = 'SUPERVISOR',
  AGENT = 'AGENT',
  CLIENT = 'CLIENT',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  ARCHIVED = 'ARCHIVED',
}
