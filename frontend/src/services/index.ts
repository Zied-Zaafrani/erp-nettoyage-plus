import apiClient, { buildQueryString, setAuthToken, clearAuthToken, setStoredUser } from './api';
import {
  // Auth
  LoginCredentials,
  AuthResponse,
  RegisterDto,
  // User
  User,
  CreateUserDto,
  UpdateUserDto,
  UserFilters,
  // Client
  Client,
  CreateClientDto,
  UpdateClientDto,
  ClientFilters,
  // Site
  Site,
  CreateSiteDto,
  UpdateSiteDto,
  SiteFilters,
  // Contract
  Contract,
  CreateContractDto,
  UpdateContractDto,
  ContractFilters,
  // Schedule
  Schedule,
  CreateScheduleDto,
  UpdateScheduleDto,
  // Intervention
  Intervention,
  CreateInterventionDto,
  UpdateInterventionDto,
  StartInterventionDto,
  CompleteInterventionDto,
  InterventionFilters,
  // Absence
  Absence,
  CreateAbsenceDto,
  ReviewAbsenceDto,
  AbsenceFilters,
  // Dashboard
  DashboardSummary,
  // Common
  PaginatedResponse,
  PaginationParams,
} from '@/types';

// ============================================
// AUTH SERVICE
// ============================================

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { data } = await apiClient.post<AuthResponse>('/auth/login', credentials);
    setAuthToken(data.accessToken);
    setStoredUser(data.user);
    return data;
  },

  async register(dto: RegisterDto): Promise<AuthResponse> {
    const { data } = await apiClient.post<AuthResponse>('/auth/register', dto);
    setAuthToken(data.accessToken);
    setStoredUser(data.user);
    return data;
  },

  async getMe(): Promise<User> {
    const { data } = await apiClient.get<User>('/auth/me');
    setStoredUser(data);
    return data;
  },

  logout(): void {
    clearAuthToken();
  },
};

// ============================================
// USERS SERVICE
// ============================================

export const usersService = {
  async getAll(filters?: UserFilters): Promise<PaginatedResponse<User>> {
    const { data } = await apiClient.get<PaginatedResponse<User>>(
      `/users${buildQueryString(filters || {})}`
    );
    return data;
  },

  async getById(id: string): Promise<User> {
    const { data } = await apiClient.get<User>(`/users/${id}`);
    return data;
  },

  async search(query: string, filters?: UserFilters): Promise<PaginatedResponse<User>> {
    const { data } = await apiClient.get<PaginatedResponse<User>>(
      `/users/search${buildQueryString({ search: query, ...filters })}`
    );
    return data;
  },

  async create(dto: CreateUserDto): Promise<User> {
    const { data } = await apiClient.post<User>('/users', dto);
    return data;
  },

  async createBatch(dtos: CreateUserDto[]): Promise<User[]> {
    const { data } = await apiClient.post<User[]>('/users/batch', { users: dtos });
    return data;
  },

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    const { data } = await apiClient.patch<User>(`/users/${id}`, dto);
    return data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/users/${id}`);
  },

  async deleteBatch(ids: string[]): Promise<void> {
    await apiClient.post('/users/batch/delete', { ids });
  },

  async restore(id: string): Promise<User> {
    const { data } = await apiClient.post<User>(`/users/${id}/restore`);
    return data;
  },

  async restoreBatch(ids: string[]): Promise<User[]> {
    const { data } = await apiClient.post<User[]>('/users/batch/restore', { ids });
    return data;
  },
};

// ============================================
// CLIENTS SERVICE
// ============================================

export const clientsService = {
  async getAll(filters?: ClientFilters): Promise<PaginatedResponse<Client>> {
    const { data } = await apiClient.get<PaginatedResponse<Client>>(
      `/clients${buildQueryString(filters || {})}`
    );
    return data;
  },

  async getById(id: string): Promise<Client> {
    const { data } = await apiClient.get<Client>(`/clients/${id}`);
    return data;
  },

  async search(query: string, filters?: ClientFilters): Promise<PaginatedResponse<Client>> {
    const { data } = await apiClient.get<PaginatedResponse<Client>>(
      `/clients/search${buildQueryString({ search: query, ...filters })}`
    );
    return data;
  },

  async create(dto: CreateClientDto): Promise<Client> {
    const { data } = await apiClient.post<Client>('/clients', dto);
    return data;
  },

  async createBatch(dtos: CreateClientDto[]): Promise<Client[]> {
    const { data } = await apiClient.post<Client[]>('/clients/batch', { clients: dtos });
    return data;
  },

  async update(id: string, dto: UpdateClientDto): Promise<Client> {
    const { data } = await apiClient.patch<Client>(`/clients/${id}`, dto);
    return data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/clients/${id}`);
  },

  async deleteBatch(ids: string[]): Promise<void> {
    await apiClient.post('/clients/batch/delete', { ids });
  },

  async restore(id: string): Promise<Client> {
    const { data } = await apiClient.post<Client>(`/clients/${id}/restore`);
    return data;
  },

  async restoreBatch(ids: string[]): Promise<Client[]> {
    const { data } = await apiClient.post<Client[]>('/clients/batch/restore', { ids });
    return data;
  },
};

// ============================================
// SITES SERVICE
// ============================================

export const sitesService = {
  async getAll(filters?: SiteFilters): Promise<PaginatedResponse<Site>> {
    const { data } = await apiClient.get<PaginatedResponse<Site>>(
      `/sites${buildQueryString(filters || {})}`
    );
    return data;
  },

  async getById(id: string): Promise<Site> {
    const { data } = await apiClient.get<Site>(`/sites/${id}`);
    return data;
  },

  async create(dto: CreateSiteDto): Promise<Site> {
    const { data } = await apiClient.post<Site>('/sites', dto);
    return data;
  },

  async update(id: string, dto: UpdateSiteDto): Promise<Site> {
    const { data } = await apiClient.patch<Site>(`/sites/${id}`, dto);
    return data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/sites/${id}`);
  },

  async restore(id: string): Promise<Site> {
    const { data } = await apiClient.post<Site>(`/sites/${id}/restore`);
    return data;
  },
};

// ============================================
// CONTRACTS SERVICE
// ============================================

export const contractsService = {
  async getAll(filters?: ContractFilters): Promise<PaginatedResponse<Contract>> {
    const { data } = await apiClient.get<PaginatedResponse<Contract>>(
      `/contracts${buildQueryString(filters || {})}`
    );
    return data;
  },

  async getById(id: string): Promise<Contract> {
    const { data } = await apiClient.get<Contract>(`/contracts/${id}`);
    return data;
  },

  async create(dto: CreateContractDto): Promise<Contract> {
    const { data } = await apiClient.post<Contract>('/contracts', dto);
    return data;
  },

  async update(id: string, dto: UpdateContractDto): Promise<Contract> {
    const { data } = await apiClient.patch<Contract>(`/contracts/${id}`, dto);
    return data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/contracts/${id}`);
  },

  async restore(id: string): Promise<Contract> {
    const { data } = await apiClient.post<Contract>(`/contracts/${id}/restore`);
    return data;
  },

  async suspend(id: string): Promise<Contract> {
    const { data } = await apiClient.post<Contract>(`/contracts/${id}/suspend`);
    return data;
  },

  async terminate(id: string): Promise<Contract> {
    const { data } = await apiClient.post<Contract>(`/contracts/${id}/terminate`);
    return data;
  },

  async renew(id: string, endDate: string): Promise<Contract> {
    const { data } = await apiClient.post<Contract>(`/contracts/${id}/renew`, { endDate });
    return data;
  },
};

// ============================================
// SCHEDULES SERVICE
// ============================================

export const schedulesService = {
  async getAll(params?: PaginationParams & { contractId?: string; agentId?: string }): Promise<PaginatedResponse<Schedule>> {
    const { data } = await apiClient.get<PaginatedResponse<Schedule>>(
      `/schedules${buildQueryString(params || {})}`
    );
    return data;
  },

  async getById(id: string): Promise<Schedule> {
    const { data } = await apiClient.get<Schedule>(`/schedules/${id}`);
    return data;
  },

  async create(dto: CreateScheduleDto): Promise<Schedule> {
    const { data } = await apiClient.post<Schedule>('/schedules', dto);
    return data;
  },

  async update(id: string, dto: UpdateScheduleDto): Promise<Schedule> {
    const { data } = await apiClient.patch<Schedule>(`/schedules/${id}`, dto);
    return data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/schedules/${id}`);
  },

  async restore(id: string): Promise<Schedule> {
    const { data } = await apiClient.post<Schedule>(`/schedules/${id}/restore`);
    return data;
  },
};

// ============================================
// INTERVENTIONS SERVICE
// ============================================

export const interventionsService = {
  async getAll(filters?: InterventionFilters): Promise<PaginatedResponse<Intervention>> {
    const { data } = await apiClient.get<PaginatedResponse<Intervention>>(
      `/interventions${buildQueryString(filters || {})}`
    );
    return data;
  },

  async getById(id: string): Promise<Intervention> {
    const { data } = await apiClient.get<Intervention>(`/interventions/${id}`);
    return data;
  },

  async create(dto: CreateInterventionDto): Promise<Intervention> {
    const { data } = await apiClient.post<Intervention>('/interventions', dto);
    return data;
  },

  async update(id: string, dto: UpdateInterventionDto): Promise<Intervention> {
    const { data } = await apiClient.patch<Intervention>(`/interventions/${id}`, dto);
    return data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/interventions/${id}`);
  },

  async start(id: string, dto?: StartInterventionDto): Promise<Intervention> {
    const { data } = await apiClient.post<Intervention>(`/interventions/${id}/start`, dto || {});
    return data;
  },

  async complete(id: string, dto?: CompleteInterventionDto): Promise<Intervention> {
    const { data } = await apiClient.post<Intervention>(`/interventions/${id}/complete`, dto || {});
    return data;
  },

  async cancel(id: string, reason?: string): Promise<Intervention> {
    const { data } = await apiClient.post<Intervention>(`/interventions/${id}/cancel`, { reason });
    return data;
  },

  async generateFromSchedules(date: string): Promise<Intervention[]> {
    const { data } = await apiClient.post<Intervention[]>('/interventions/generate', { date });
    return data;
  },
};

// ============================================
// ABSENCES SERVICE
// ============================================

export const absencesService = {
  async getAll(filters?: AbsenceFilters): Promise<PaginatedResponse<Absence>> {
    const { data } = await apiClient.get<PaginatedResponse<Absence>>(
      `/absences${buildQueryString(filters || {})}`
    );
    return data;
  },

  async getById(id: string): Promise<Absence> {
    const { data } = await apiClient.get<Absence>(`/absences/${id}`);
    return data;
  },

  async getMyAbsences(filters?: AbsenceFilters): Promise<PaginatedResponse<Absence>> {
    const { data } = await apiClient.get<PaginatedResponse<Absence>>(
      `/absences/my${buildQueryString(filters || {})}`
    );
    return data;
  },

  async create(dto: CreateAbsenceDto): Promise<Absence> {
    const { data } = await apiClient.post<Absence>('/absences', dto);
    return data;
  },

  async review(id: string, dto: ReviewAbsenceDto): Promise<Absence> {
    const { data } = await apiClient.post<Absence>(`/absences/${id}/review`, dto);
    return data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/absences/${id}`);
  },
};

// ============================================
// DASHBOARD SERVICE
// ============================================

export const dashboardService = {
  async getSummary(): Promise<DashboardSummary> {
    const { data } = await apiClient.get<DashboardSummary>('/dashboard/summary');
    return data;
  },

  async getInterventionsToday(): Promise<Intervention[]> {
    const { data } = await apiClient.get<Intervention[]>('/dashboard/interventions/today');
    return data;
  },

  async getInterventionsWeek(): Promise<Intervention[]> {
    const { data } = await apiClient.get<Intervention[]>('/dashboard/interventions/week');
    return data;
  },

  async getDailyReport(date?: string): Promise<Record<string, unknown>> {
    const { data } = await apiClient.get(`/dashboard/reports/daily${date ? `?date=${date}` : ''}`);
    return data;
  },

  async getWeeklyReport(startDate?: string): Promise<Record<string, unknown>> {
    const { data } = await apiClient.get(
      `/dashboard/reports/weekly${startDate ? `?startDate=${startDate}` : ''}`
    );
    return data;
  },

  async getMonthlyReport(year?: number, month?: number): Promise<Record<string, unknown>> {
    const params = new URLSearchParams();
    if (year) params.append('year', String(year));
    if (month) params.append('month', String(month));
    const queryString = params.toString();
    const { data } = await apiClient.get(
      `/dashboard/reports/monthly${queryString ? `?${queryString}` : ''}`
    );
    return data;
  },

  async getKpis(): Promise<Record<string, unknown>> {
    const { data } = await apiClient.get('/dashboard/kpis');
    return data;
  },
};
