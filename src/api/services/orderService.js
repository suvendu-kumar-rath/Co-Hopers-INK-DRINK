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
      console.log('Fetching order history from endpoint:', ENDPOINTS.orders.getHistory)
      const response = await apiClient.get(ENDPOINTS.orders.getHistory)
      console.log('Raw order history response:', response)
      return response
    } catch (error) {
      console.error('Failed to fetch order history:', error)
      throw error
    }
  },
}
