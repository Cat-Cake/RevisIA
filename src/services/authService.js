import { apiClient } from './apiClient'

export const authService = {
  async register({ nom, email, mot_de_passe }) {
    return apiClient.post('/api/auth/register', { nom, email, mot_de_passe })
  },

  async login({ email, mot_de_passe }) {
    const data = await apiClient.post('/api/auth/login', { email, mot_de_passe })
    localStorage.setItem('token', data.token)
    return data
  },

  async logout() {
    const data = await apiClient.post('/api/auth/logout')
    localStorage.removeItem('token')
    return data
  },

  async me() {
    return apiClient.get('/api/auth/me')
  },
}
