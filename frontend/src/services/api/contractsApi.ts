import { api } from './axios-instance';

export interface Contract {
  id: string;
  contractCode: string;
  clientId: string;
  siteId: string;
  type: 'PERMANENT' | 'AD_HOC';
  frequency?: 'DAILY' | 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY' | null;
  startDate: string;
  endDate?: string | null;
  status: 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'CANCELLED';
  pricing?: {
    basePrice?: number;
    currency?: string;
    [key: string]: any;
  } | null;
  serviceScope?: {
    [key: string]: any;
  } | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  client?: any;
  site?: any;
}

export interface ListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  type?: string;
  clientId?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface PagedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const contractsApi = {
  /**
   * Get all contracts with pagination and filters
   */
  async list(params: ListParams): Promise<PagedResponse<Contract>> {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.search) queryParams.append('search', params.search);
    if (params.status) queryParams.append('status', params.status);
    if (params.type) queryParams.append('type', params.type);
    if (params.clientId) queryParams.append('clientId', params.clientId);
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    const { data } = await api.get(`/contracts?${queryParams.toString()}`);
    return data;
  },

  /**
   * Get a single contract by ID
   */
  async getById(id: string): Promise<Contract> {
    const { data } = await api.get(`/contracts/${id}`);
    return data;
  },

  /**
   * Create a new contract
   */
  async create(contract: Partial<Contract>): Promise<Contract> {
    const { data } = await api.post('/contracts', contract);
    return data;
  },

  /**
   * Update a contract
   */
  async update(id: string, contract: Partial<Contract>): Promise<Contract> {
    const { data } = await api.patch(`/contracts/${id}`, contract);
    return data;
  },

  /**
   * Delete a contract
   */
  async delete(id: string): Promise<void> {
    await api.delete(`/contracts/${id}`);
  },

  /**
   * Get contracts by client
   */
  async getByClient(clientId: string): Promise<Contract[]> {
    const { data } = await api.get(`/contracts?clientId=${clientId}`);
    return Array.isArray(data) ? data : data.data || [];
  },

  /**
   * Get contracts by site
   */
  async getBySite(siteId: string): Promise<Contract[]> {
    const { data } = await api.get(`/contracts?siteId=${siteId}`);
    return Array.isArray(data) ? data : data.data || [];
  },
};
