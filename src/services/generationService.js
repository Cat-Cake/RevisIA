import { apiClient } from './apiClient'

export const generationService = {
  async generateSummary(documentId) {
    return apiClient.post(`/api/documents/${documentId}/summary`)
  },

  async getSummary(documentId) {
    return apiClient.get(`/api/documents/${documentId}/summary`)
  },

  async generateFlashcards(documentId, count) {
    return apiClient.post(`/api/documents/${documentId}/flashcards`, count ? { count } : undefined)
  },

  async getFlashcards(documentId) {
    return apiClient.get(`/api/documents/${documentId}/flashcards`)
  },

  async generateQuiz(documentId, count) {
    return apiClient.post(`/api/documents/${documentId}/quiz`, count ? { count } : undefined)
  },

  async getQuiz(documentId) {
    return apiClient.get(`/api/documents/${documentId}/quiz`)
  },

  async submitQuiz(documentId, answers) {
    return apiClient.post(`/api/documents/${documentId}/quiz/submit`, answers)
  },
}
