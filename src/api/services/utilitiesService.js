import apiClient from '../client'
import { ENDPOINTS } from '../config'

/**
 * Utilities Service (Printing)
 */
export const utilitiesService = {
  /**
   * Get all utilities posted by admin
   */
  async getAll() {
    try {
      const response = await apiClient.get(ENDPOINTS.utilities.getAll)
      return response
    } catch (error) {
      console.error('Failed to fetch utilities:', error)
      throw error
    }
  },

  async getById(id) {
    try {
      const response = await apiClient.get(ENDPOINTS.utilities.getById(id))
      return response
    } catch (error) {
      console.error('Failed to fetch utility:', error)
      throw error
    }
  },

  /**
   * Get pricing information
   */
  async getPricing() {
    try {
      const response = await apiClient.get(ENDPOINTS.utilities.getPricing)
      return response
    } catch (error) {
      console.error('Failed to fetch pricing:', error)
      throw error
    }
  },

  /**
   * Create new print job
   */
  async createPrintJob(printData) {
    try {
      const response = await apiClient.post(ENDPOINTS.utilities.createPrintJob, printData)
      return response
    } catch (error) {
      console.error('Failed to create print job:', error)
      throw error
    }
  },

  /**
   * Get user's print jobs
   */
  async getJobs() {
    try {
      const response = await apiClient.get(ENDPOINTS.utilities.getJobs)
      return response
    } catch (error) {
      console.error('Failed to fetch jobs:', error)
      throw error
    }
  },

  /**
   * Place a utility order
   * @param {Object} params
   * @param {Array}  params.orders            - Array of order objects
   * @param {string} [params.specialInstruction]
   * @param {File}   params.printFile         - File to upload
   */
  async placeOrder({ orders, specialInstruction, printFile }) {
    try {
      const formData = new FormData()
      formData.append('orders', JSON.stringify(orders))
      if (specialInstruction) {
        formData.append('specialInstruction', specialInstruction)
      }
      if (printFile) {
        formData.append('printFile', printFile)
      }
      const response = await apiClient.postFormData(ENDPOINTS.utilities.placeOrder, formData)
      return response
    } catch (error) {
      console.error('Failed to place utility order:', error)
      throw error
    }
  },
}
