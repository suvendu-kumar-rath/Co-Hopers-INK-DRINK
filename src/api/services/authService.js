import apiClient from '../client'
import { ENDPOINTS } from '../config'

/**
 * Authentication Service
 */
export const authService = {
  /**
   * Login user
   */
  async login(credentials) {
    try {
      const response = await apiClient.post(ENDPOINTS.auth.login, credentials)
      
      // Store token if login successful
      if (response.token) {
        localStorage.setItem('authToken', response.token)
      }
      
      return response
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  },

  /**
   * Logout user
   */
  async logout() {
    try {
      await apiClient.post(ENDPOINTS.auth.logout)
      localStorage.removeItem('authToken')
      return true
    } catch (error) {
      console.error('Logout failed:', error)
      // Remove token anyway
      localStorage.removeItem('authToken')
      throw error
    }
  },

  /**
   * Register new user
   * @param {Object} userData - plain object with user fields
   * @param {string} userData.userName
   * @param {string} userData.email
   * @param {string} userData.mobile
   * @param {string} userData.password
   * @param {string} userData.confirmPassword
   * @param {File}   userData.idProof
   * @param {string} userData.cabinNumber
   * @param {string} userData.roomNumber
   */
  async register({ userName, email, mobile, password, confirmPassword, idProof, cabinNumber, roomNumber }) {
    try {
      const base = apiClient.baseURL.replace(/\/$/, '')
      const endpoint = ENDPOINTS.auth.register.replace(/^\//, '')
      const url = `${base}/${endpoint}`

      // Build FormData with only required fields
      const formData = new FormData()
      formData.append('userName', userName)
      formData.append('email', email)
      formData.append('mobile', mobile)
      formData.append('password', password)
      formData.append('confirmPassword', confirmPassword)
      formData.append('idProof', idProof)
      formData.append('cabinNumber', cabinNumber)
      formData.append('roomNumber', roomNumber)

      // Debug: verify every field before sending
      console.log('Registering at URL:', url)
      console.log('FormData fields:')
      for (let [key, value] of formData.entries()) {
        console.log(`  ${key}:`, value instanceof File ? `File(${value.name}, ${value.size}b, ${value.type})` : `"${value}"`)
      }

      const headers = {}
      const token = localStorage.getItem('authToken')
      if (token) headers['Authorization'] = `Bearer ${token}`

      const response = await fetch(url, { method: 'POST', headers, body: formData })
      const data = await response.json()
      console.log('Server response:', data)

      if (!response.ok) {
        const error = new Error(data.message || data.error || 'Registration failed')
        error.status = response.status
        error.data = data
        throw error
      }

      if (data.data?.token) localStorage.setItem('authToken', data.data.token)
      if (data.data?.user)  localStorage.setItem('user', JSON.stringify(data.data.user))

      return data
    } catch (error) {
      console.error('Registration failed:', error)
      throw error
    }
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return !!localStorage.getItem('authToken')
  },

  /**
   * Get stored token
   */
  getToken() {
    return localStorage.getItem('authToken')
  },
}
