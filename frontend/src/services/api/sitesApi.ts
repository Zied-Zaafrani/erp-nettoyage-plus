import { api } from './axios-instance';

export interface Site {
  id: string;
  name: string;
  address?: string | null;
  city?: string | null;
  postalCode?: string | null;
  country?: string | null;
  notes?: string | null;
  coordinates?: {
    latitude?: number;
    longitude?: number;
  } | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface ListParams {
  page?: number;
  limit?: number;
  search?: string;
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

export const sitesApi = {
  /**
   * Get all sites with pagination and filters
   */
  async list(params: ListParams): Promise<PagedResponse<Site>> {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.search) queryParams.append('search', params.search);
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    const { data } = await api.get(`/sites?${queryParams.toString()}`);
    return data;
  },

  /**
   * Get a single site by ID
   */
  async getById(id: string): Promise<Site> {
    const { data } = await api.get(`/sites/${id}`);
    return data;
  },

  /**
   * Create a new site
   */
  async create(site: Partial<Site>): Promise<Site> {
    const { data } = await api.post('/sites', site);
    return data;
  },

  /**
   * Update a site
   */
  async update(id: string, site: Partial<Site>): Promise<Site> {
    const { data } = await api.patch(`/sites/${id}`, site);
    return data;
  },

  /**
   * Delete a site
   */
  async delete(id: string): Promise<void> {
    await api.delete(`/sites/${id}`);
  },

  /**
   * Search sites
   */
  async search(query: string): Promise<Site[]> {
    const { data } = await api.get(`/sites/search?search=${query}`);
    return Array.isArray(data) ? data : data.data || [];
  },
};
