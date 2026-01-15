/**
 * Client Type - How the client is categorized
 */
export enum ClientType {
  INDIVIDUAL = 'INDIVIDUAL', // Single person, residential
  COMPANY = 'COMPANY', // Business with single location
  MULTI_SITE = 'MULTI_SITE', // Business with multiple locations
}

/**
 * Client Status - Current state of the client relationship
 */
export enum ClientStatus {
  ACTIVE = 'ACTIVE', // Active client with ongoing services
  SUSPENDED = 'SUSPENDED', // Temporarily paused (e.g., payment issues)
  TERMINATED = 'TERMINATED', // Relationship ended
  PROSPECT = 'PROSPECT', // Potential client, not yet active
}
