// ============================================
// USER TYPES - PHASE 1 MVP
// ============================================

export type UserRole = 
  | 'SUPER_ADMIN'
  | 'SUPERVISOR'
  | 'AGENT'
  | 'CLIENT';

export type UserStatus = 'ACTIVE' | 'SUSPENDED' | 'ARCHIVED';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
  status: UserStatus;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface CreateUserDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
}

export interface UpdateUserDto {
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  role?: UserRole;
  status?: UserStatus;
  isActive?: boolean;
}

// ============================================
// AUTH TYPES
// ============================================

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface RegisterDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

// ============================================
// CLIENT TYPES
// ============================================

export type ClientType = 'INDIVIDUAL' | 'COMPANY' | 'MULTISITE';
export type ClientStatus = 'PROSPECT' | 'ACTIVE' | 'SUSPENDED' | 'ARCHIVED';

export interface Client {
  id: string;
  clientCode: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  clientType: ClientType;
  type?: ClientType; // Alias for compatibility
  status: ClientStatus;
  contactPerson?: string;
  contactPhone?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  sites?: Site[];
  contracts?: Contract[];
}

export interface CreateClientDto {
  clientCode?: string;
  name: string;
  email: string | null;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  postalCode?: string | null;
  country?: string | null;
  type?: ClientType; // frontend uses `type`
  clientType?: ClientType; // legacy
  notes?: string | null;
}

export interface UpdateClientDto extends Partial<CreateClientDto> {
  status?: ClientStatus;
}

// ============================================
// SITE TYPES
// ============================================

export type SiteStatus = 'ACTIVE' | 'INACTIVE' | 'UNDER_MAINTENANCE';

export interface Site {
  id: string;
  name: string;
  address: string;
  city?: string;
  postalCode?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
  accessInstructions?: string;
  status: SiteStatus;
  clientId: string;
  client?: Client;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface CreateSiteDto {
  name: string;
  address: string;
  city?: string;
  postalCode?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
  accessInstructions?: string;
  clientId: string;
}

export interface UpdateSiteDto extends Partial<CreateSiteDto> {
  status?: SiteStatus;
}

// ============================================
// CONTRACT TYPES
// ============================================

export type ContractType = 'PERMANENT' | 'ONE_TIME';
export type ContractStatus = 'DRAFT' | 'ACTIVE' | 'SUSPENDED' | 'TERMINATED' | 'COMPLETED';
export type ContractFrequency = 'DAILY' | 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'CUSTOM';

export interface Contract {
  id: string;
  contractCode: string;
  contractType: ContractType;
  type?: ContractType; // Alias for compatibility
  status: ContractStatus;
  startDate: string;
  endDate?: string | null;
  monthlyValue?: number;
  totalValue?: number;
  currency: string;
  paymentTerms?: string;
  description?: string;
  terms?: string;
  frequency?: ContractFrequency; // For contract details
  pricing?: Record<string, any>; // Contract pricing details
  serviceScope?: Record<string, any>; // Service zones, tasks, areas
  notes?: string; // Contract notes/comments
  clientId: string;
  siteId: string;
  client?: Client;
  site?: Site;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface CreateContractDto {
  contractCode: string;
  contractType: ContractType;
  startDate: string;
  endDate?: string;
  monthlyValue?: number;
  totalValue?: number;
  currency?: string;
  paymentTerms?: string;
  description?: string;
  terms?: string;
  clientId: string;
  siteId: string;
}

export interface UpdateContractDto extends Partial<CreateContractDto> {
  status?: ContractStatus;
}

// ============================================
// SCHEDULE TYPES
// ============================================

export type RecurrencePattern = 'DAILY' | 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY' | 'QUARTERLY';
export type ScheduleStatus = 'ACTIVE' | 'PAUSED' | 'COMPLETED';

export interface Schedule {
  id: string;
  contractId: string;
  siteId: string;
  zoneId?: string;
  recurrencePattern: RecurrencePattern;
  daysOfWeek?: number[];
  dayOfMonth?: number;
  startTime: string;
  endTime: string;
  validFrom: string;
  validUntil?: string;
  status: ScheduleStatus;
  defaultZoneChiefId?: string;
  defaultTeamChiefId?: string;
  defaultAgentIds?: string[];
  exceptionDates?: string[];
  notes?: string;
  contract?: Contract;
  site?: Site;
  zone?: any;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface CreateScheduleDto {
  contractId: string;
  siteId: string;
  zoneId?: string;
  recurrencePattern: RecurrencePattern;
  daysOfWeek?: number[];
  dayOfMonth?: number;
  startTime: string;
  endTime: string;
  validFrom: string;
  validUntil?: string;
  defaultZoneChiefId?: string;
  defaultTeamChiefId?: string;
  defaultAgentIds?: string[];
  exceptionDates?: string[];
  notes?: string;
}

export interface UpdateScheduleDto extends Partial<CreateScheduleDto> {
  status?: ScheduleStatus;
}

// ============================================
// INTERVENTION TYPES - PHASE 1
// ============================================

export type InterventionStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'missed';

export interface Intervention {
  id: string;
  interventionCode: string; // Unique code for intervention
  scheduledDate: string;
  scheduledStartTime: string;
  scheduledEndTime: string;
  actualStartTime?: string;
  actualEndTime?: string;
  status: InterventionStatus;
  notes?: string;
  startLatitude?: number;
  startLongitude?: number;
  endLatitude?: number;
  endLongitude?: number;
  photoUrls?: string[];
  contractId?: string; // Contract reference
  scheduleId?: string;
  siteId: string;
  agentId: string;
  contract?: Contract; // Full contract data
  schedule?: Schedule;
  site?: Site;
  agent?: User;
  createdAt: string;
  updatedAt: string;
}

export interface CreateInterventionDto {
  contractId: string;
  siteId: string;
  scheduledDate: string;
  scheduledStartTime: string;
  scheduledEndTime: string;
  assignedAgentIds: string[];
  assignedZoneChiefId?: string;
  assignedTeamChiefId?: string;
  checklistTemplateId?: string;
  notes?: string;
}

export interface UpdateInterventionDto {
  scheduledDate?: string;
  scheduledStartTime?: string;
  scheduledEndTime?: string;
  notes?: string;
}

export interface StartInterventionDto {
  latitude?: number;
  longitude?: number;
}

export interface CompleteInterventionDto {
  latitude?: number;
  longitude?: number;
  notes?: string;
  photoUrls?: string[];
}

// ============================================
// ABSENCE TYPES
// ============================================

export type AbsenceType = 'VACATION' | 'SICK_LEAVE' | 'UNPAID' | 'AUTHORIZED' | 'UNAUTHORIZED';
export type AbsenceStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';

export interface Absence {
  id: string;
  agentId: string;
  absenceType: AbsenceType;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason?: string;
  status: AbsenceStatus;
  requestedAt: string;
  reviewedBy?: string;
  reviewer?: User;
  reviewedAt?: string;
  reviewNotes?: string;
  attachmentUrl?: string;
  agent?: User;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface CreateAbsenceDto {
  agentId: string;
  absenceType: AbsenceType;
  startDate: string;
  endDate: string;
  reason?: string;
  attachmentUrl?: string;
}

export interface ReviewAbsenceDto {
  status: AbsenceStatus;
  reviewNotes?: string;
}

// ============================================
// DASHBOARD TYPES - PHASE 1 (Simplified)
// ============================================

export interface DashboardSummary {
  totalInterventions: number;
  completedInterventions: number;
  pendingInterventions: number;
  completionRate: number;
  totalClients: number;
  activeClients: number;
  totalAgents: number;
  availableAgents: number;
  totalContracts: number;
  activeContracts: number;
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta?: PaginationMeta;
  pagination?: PaginationMeta; // Alternative structure for compatibility
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}

export interface ApiError {
  statusCode: number;
  message: string;
  error?: string;
}

// ============================================
// FILTER/QUERY TYPES
// ============================================

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface SearchParams extends PaginationParams {
  search?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface UserFilters extends SearchParams {
  role?: UserRole;
  status?: UserStatus;
  isActive?: boolean;
  includeDeleted?: boolean;
}

export interface ClientFilters extends SearchParams {
  clientType?: ClientType;
  status?: ClientStatus;
}

export interface SiteFilters extends SearchParams {
  clientId?: string;
  status?: SiteStatus;
}

export interface ContractFilters extends SearchParams {
  clientId?: string;
  siteId?: string;
  contractType?: ContractType;
  status?: ContractStatus;
}

export interface InterventionFilters extends SearchParams {
  clientId?: string;
  agentId?: string;
  siteId?: string;
  status?: InterventionStatus;
  startDate?: string;
  endDate?: string;
}

export interface AbsenceFilters extends SearchParams {
  userId?: string;
  absenceType?: AbsenceType;
  status?: AbsenceStatus;
  startDate?: string;
  endDate?: string;
}
