import { API_CONFIG } from './config'

/**
 * Custom API client using fetch
 */
class ApiClient {
  constructor(config) {
    this.baseURL = config.baseURL
    this.timeout = config.timeout
    this.headers = config.headers
  }

  /**
   * Handle API response
   */
  async handleResponse(response) {
    const contentType = response.headers.get('content-type')
    const isJson = contentType && contentType.includes('application/json')
    const data = isJson ? await response.json() : await response.text()

    if (!response.ok) {
      const error = new Error(data.message || 'API request failed')
      error.status = response.status
      error.data = data
      throw error
    }

    return data
  }

  /**
   * Make API request
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    const mergedHeaders = {
      ...this.headers,
      ...options.headers,
    }
    // Remove headers explicitly set to undefined (e.g. to omit Content-Type for FormData)
    const filteredHeaders = Object.fromEntries(
      Object.entries(mergedHeaders).filter(([, v]) => v !== undefined)
    )
    const config = {
      ...options,
      headers: filteredHeaders,
    }

    // Add authorization token if available
    const rawToken = localStorage.getItem('authToken')
    if (rawToken) {
      // Strip any existing 'Bearer ' prefix to avoid double-prefixing
      const token = rawToken.replace(/^Bearer\s+/i, '')
      config.headers['Authorization'] = `Bearer ${token}`
    }

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), this.timeout)

      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)
      return await this.handleResponse(response)
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout')
      }
      throw error
    }
  }

  /**
   * GET request
   */
  get(endpoint, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'GET',
    })
  }

  /**
   * POST request
   */
  post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  /**
   * PUT request
   */
  put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  /**
   * PATCH request
   */
  patch(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  /**
   * DELETE request
   */
  delete(endpoint, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'DELETE',
    })
  }

  /**
   * POST multipart/form-data request (browser sets Content-Type with boundary)
   */
  postFormData(endpoint, formData, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': undefined, // let browser set multipart/form-data with boundary
        ...options.headers,
      },
    })
  }
}

// Create and export a singleton instance
const apiClient = new ApiClient(API_CONFIG)
export default apiClient
