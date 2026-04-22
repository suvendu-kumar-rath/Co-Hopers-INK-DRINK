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
   */
  async createOrder(orderData) {
    try {
      const response = await apiClient.post(ENDPOINTS.refreshment.createOrder, orderData)
      return response
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
