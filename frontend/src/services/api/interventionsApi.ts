import { api } from './axios-instance';

export interface Intervention {
  id: string;
  interventionCode: string;
  contractId: string;
  siteId: string;
  scheduledDate: string;
  scheduledStartTime: string;
  scheduledEndTime: string;
  actualStartTime?: string | null;
  actualEndTime?: string | null;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'POSTPONED';
  assignedZoneChiefId?: string | null;
  assignedTeamChiefId?: string | null;
  assignedAgentIds?: string[] | null;
  checklistTemplateId?: string | null;
  checklistCompleted?: boolean;
  gpsCheckInLat?: number | null;
  gpsCheckInLng?: number | null;
  gpsCheckInTime?: string | null;
  gpsCheckOutLat?: number | null;
  gpsCheckOutLng?: number | null;
  gpsCheckOutTime?: string | null;
  photoUrls?: string[] | null;
  qualityScore?: number | null;
  clientRating?: number | null;
  clientFeedback?: string | null;
  incidents?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface ListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  contractId?: string;
  siteId?: string;
  dateFrom?: string;
  dateTo?: string;
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

export const interventionsApi = {
  /**
   * Get all interventions with pagination and filters
   */
  async list(params: ListParams): Promise<PagedResponse<Intervention>> {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.search) queryParams.append('search', params.search);
    if (params.status) queryParams.append('status', params.status);
    if (params.contractId) queryParams.append('contractId', params.contractId);
    if (params.siteId) queryParams.append('siteId', params.siteId);
    if (params.dateFrom) queryParams.append('dateFrom', params.dateFrom);
    if (params.dateTo) queryParams.append('dateTo', params.dateTo);

    const { data } = await api.get(`/interventions?${queryParams.toString()}`);
    return data;
  },

  /**
   * Get a single intervention by ID
   */
  async getById(id: string): Promise<Intervention> {
    const { data } = await api.get(`/interventions/${id}`);
    return data;
  },

  /**
   * Create a new intervention
   */
  async create(intervention: Partial<Intervention>): Promise<Intervention> {
    const { data } = await api.post('/interventions', intervention);
    return data;
  },

  /**
   * Update an intervention
   */
  async update(id: string, intervention: Partial<Intervention>): Promise<Intervention> {
    const { data } = await api.patch(`/interventions/${id}`, intervention);
    return data;
  },

  /**
   * Delete an intervention
   */
  async delete(id: string): Promise<void> {
    await api.delete(`/interventions/${id}`);
  },

  /**
   * Get interventions by contract
   */
  async getByContract(contractId: string): Promise<Intervention[]> {
    const { data } = await api.get(`/interventions?contractId=${contractId}`);
    return Array.isArray(data) ? data : data.data || [];
  },

  /**
   * GPS Check In
   */
  async gpsCheckIn(id: string, latitude: number, longitude: number): Promise<Intervention> {
    const { data } = await api.post(`/interventions/${id}/checkin`, {
      latitude,
      longitude,
    });
    return data;
  },

  /**
   * GPS Check Out
   */
  async gpsCheckOut(id: string, latitude: number, longitude: number): Promise<Intervention> {
    const { data } = await api.post(`/interventions/${id}/checkout`, {
      latitude,
      longitude,
    });
    return data;
  },

  /**
   * Update quality score
   */
  async updateQualityScore(id: string, score: number): Promise<Intervention> {
    const { data } = await api.patch(`/interventions/${id}`, { qualityScore: score });
    return data;
  },

  /**
   * Add photos
   */
  async addPhotos(id: string, photoUrls: string[]): Promise<Intervention> {
    const { data } = await api.patch(`/interventions/${id}`, { photoUrls });
    return data;
  },

  /**
   * Assign agents
   */
  async assignAgents(
    id: string,
    agentIds: string[],
    zoneChiefId?: string,
    teamChiefId?: string,
  ): Promise<Intervention> {
    const { data } = await api.patch(`/interventions/${id}`, {
      assignedAgentIds: agentIds,
      assignedZoneChiefId: zoneChiefId,
      assignedTeamChiefId: teamChiefId,
    });
    return data;
  },
};
