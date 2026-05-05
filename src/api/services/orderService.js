import apiClient from '../client'
import { ENDPOINTS } from '../config'

/**
 * Order Service
 */
export const orderService = {
  /**
   * Get user order history
   */
  async getOrderHistory() {
    try {
      const response = await apiClient.get(ENDPOINTS.orders.getHistory)
      return response
    } catch (error) {
      console.error('Failed to fetch order history:', error)
      throw error
    }
  },
}
