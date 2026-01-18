import axios from './axios-instance';

export const absencesApi = {
  getAll: (params?: any) => axios.get('/absences', { params }),
  getById: (id: string) => axios.get(`/absences/${id}`),
  create: (data: any) => axios.post('/absences', data),
  update: (id: string, data: any) => axios.put(`/absences/${id}`, data),
  delete: (id: string) => axios.delete(`/absences/${id}`),
};
