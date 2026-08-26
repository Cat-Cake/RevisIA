import { apiClient } from './apiClient'

export const documentService = {
  async upload(file) {
    const formData = new FormData()
    formData.append('file', file)
    return apiClient.post('/api/documents', formData)
  },

  async list() {
    return apiClient.get('/api/documents')
  },

  async getById(id) {
    return apiClient.get(`/api/documents/${id}`)
  },

  async remove(id) {
    return apiClient.delete(`/api/documents/${id}`)
  },
}
