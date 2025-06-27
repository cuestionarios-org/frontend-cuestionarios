import apiClient from './api'

export const competitionService = {
  getAll: () => apiClient.get('/competitions'),
  getById: (id) => apiClient.get(`/competitions/${id}`),
  create: (data) => apiClient.post('/competitions', data),
  update: (id, data) => apiClient.put(`/competitions/${id}`, data),
}
