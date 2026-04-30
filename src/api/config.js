// API Configuration
export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://api.boldtribe.in/api/',
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
}

// API Endpoints
export const ENDPOINTS = {
  // Auth endpoints
  auth: {
    login: 'user/visitor/login',
    logout: '/auth/logout',
    register: 'user/visitor/register',
  },
  // Coffee/Refreshment endpoints
  refreshment: {
    getItems: 'cafeteria/items',
    getItemById: (id) => `cafeteria/items/${id}`,
    getMenu: 'cafeteria/menu',
    createOrder: 'cafeteria/order',
    getOrders: '/refreshment/orders',
  },
  // Printing/Utilities endpoints
  utilities: {
    getAll: 'utilities',
    getById: (id) => `utilities/${id}`,
    getPricing: '/utilities/pricing',
    createPrintJob: '/utilities/print',
    getJobs: '/utilities/jobs',
    placeOrder: 'utilities/order/place',
  },
}
