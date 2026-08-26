import { apiClient } from './apiClient'

export const resultService = {
  async list() {
    return apiClient.get('/api/results')
  },

  async getById(id) {
    return apiClient.get(`/api/results/${id}`)
  },
}
