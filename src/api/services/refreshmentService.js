import apiClient from '../client'
import { ENDPOINTS } from '../config'

/**
 * Refreshment Service (Coffee/Tea)
 */
export const refreshmentService = {
  /**
   * Get cafeteria items from cafeteria/items endpoint
   */
  async getItems() {
    try {
      const response = await apiClient.get(ENDPOINTS.refreshment.getItems)
      return response
    } catch (error) {
      console.error('Failed to fetch cafeteria items:', error)
      throw error
    }
  },

  /**
   * Get a single cafeteria item by ID
   */
  async getItemById(id) {
    try {
      const response = await apiClient.get(ENDPOINTS.refreshment.getItemById(id))
      return response
    } catch (error) {
      console.error('Failed to fetch item by id:', error)
      throw error
    }
  },

  /**
   * Get menu items
   */
  async getMenu() {
    try {
      const response = await apiClient.get(ENDPOINTS.refreshment.getMenu)
      return response
    } catch (error) {
      console.error('Failed to fetch menu:', error)
      throw error
    }
  },

  /**
   * Create new order
   * Sends a multipart/form-data POST because paymentScreenshot is a File.
   *
   * @param {FormData} formData - fields:
   *   orders              {string}  JSON-stringified array of { orderType, itemName, quantity }
   *   specialInstructions {string}
   *   utrNumber           {string}
   *   isPersonal          {string}  "true" | "false"
   *   isMonthlyPayment    {string}  "true" | "false"
   *   paymentScreenshot   {File}    (optional)
   */
  async createOrder(formData) {
    try {
      const base = apiClient.baseURL.replace(/\/$/, '')
      const endpoint = ENDPOINTS.refreshment.createOrder.replace(/^\//, '')
      const url = `${base}/${endpoint}`

      const headers = {}
      const token = localStorage.getItem('authToken')
      if (token) headers['Authorization'] = `Bearer ${token}`

      const response = await fetch(url, { method: 'POST', headers, body: formData })
      const data = await response.json()

      if (!response.ok) {
        const error = new Error(data.message || 'Failed to create order')
        error.status = response.status
        error.data = data
        throw error
      }

      return data
    } catch (error) {
      console.error('Failed to create order:', error)
      throw error
    }
  },

  /**
   * Get user's orders
   */
  async getOrders() {
    try {
      const response = await apiClient.get(ENDPOINTS.refreshment.getOrders)
      return response
    } catch (error) {
      console.error('Failed to fetch orders:', error)
      throw error
    }
  },
}
