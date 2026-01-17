import { api } from './axios-instance';

export interface Client {
  id: string;
  clientCode: string;
  name: string;
  type: 'INDIVIDUAL' | 'COMPANY' | 'MULTISITE';
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  postalCode?: string | null;
  country?: string | null;
  contactPerson?: string | null;
  contactPhone?: string | null;
  userId?: string | null;
  notes?: string | null;
  status: 'PROSPECT' | 'ACTIVE' | 'SUSPENDED' | 'ARCHIVED';
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
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

export interface ListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  type?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export const clientsApi = {
  /**
   * Get all clients with pagination and filters
   */
  async list(params: ListParams): Promise<PagedResponse<Client>> {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.search) queryParams.append('search', params.search);
    if (params.status) queryParams.append('status', params.status);
    if (params.type) queryParams.append('type', params.type);
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    const { data } = await api.get(`/clients?${queryParams.toString()}`);
    return data;
  },

  /**
   * Get a single client by ID
   */
  async getById(id: string): Promise<Client> {
    const { data } = await api.get(`/clients/${id}`);
    return data;
  },

  /**
   * Create a new client
   */
  async create(client: Partial<Client>): Promise<Client> {
    const { data } = await api.post('/clients', client);
    return data;
  },

  /**
   * Update a client
   */
  async update(id: string, client: Partial<Client>): Promise<Client> {
    const { data } = await api.patch(`/clients/${id}`, client);
    return data;
  },

  /**
   * Delete a client (soft delete)
   */
  async delete(id: string): Promise<void> {
    await api.delete(`/clients/${id}`);
  },

  /**
   * Search clients
   */
  async search(query: string): Promise<Client[]> {
    const { data } = await api.get(`/clients/search?search=${query}`);
    return Array.isArray(data) ? data : data.data || [];
  },

  /**
   * Get contracts for a client
   */
  async getContracts(clientId: string): Promise<any[]> {
    const { data } = await api.get(`/clients/${clientId}/contracts`);
    return Array.isArray(data) ? data : data.data || [];
  },

  /**
   * Get interventions for a client
   */
  async getInterventions(clientId: string): Promise<any[]> {
    const { data } = await api.get(`/clients/${clientId}/interventions`);
    return Array.isArray(data) ? data : data.data || [];
  },

  /**
   * Create multiple clients at once
   */
  async createBatch(clients: Partial<Client>[]): Promise<{ created: Client[]; errors: any[] }> {
    const { data } = await api.post('/clients/batch', { clients });
    return data;
  },

  /**
   * Update multiple clients at once
   */
  async updateBatch(updates: Array<{ id: string; data: Partial<Client> }>): Promise<{ updated: Client[]; errors: any[] }> {
    const { data } = await api.patch('/clients/batch', { updates });
    return data;
  },

  /**
   * Delete multiple clients at once
   */
  async deleteBatch(ids: string[]): Promise<void> {
    await api.post('/clients/batch/delete', { ids });
  },

  /**
   * Get client by email
   */
  async getByEmail(email: string): Promise<Client> {
    const { data } = await api.get(`/clients/search?email=${email}`);
    return data;
  },
};
