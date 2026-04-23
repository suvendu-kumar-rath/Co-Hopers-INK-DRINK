# API Structure Documentation

## Overview
This directory contains all API-related code organized in a clean, maintainable structure.

## Structure
```
src/api/
├── config.js                    # API configuration and endpoints
├── client.js                    # HTTP client (fetch wrapper)
├── services/                    # Service modules
│   ├── authService.js          # Authentication APIs
│   ├── refreshmentService.js   # Coffee/Tea booking APIs
│   └── utilitiesService.js     # Printing/Utilities APIs
└── index.js                     # Main export file
```

## Environment Variables
The API base URL is stored in `.env` file:
```
VITE_API_BASE_URL=https://api.boldtribe.in/api/
```

**Note**: In Vite, environment variables must be prefixed with `VITE_` to be accessible in the client code.

## Usage Examples

### 1. Authentication
```javascript
import { authService } from '@/api'

// Login
const login = async () => {
  try {
    const response = await authService.login({
      email: 'user@example.com',
      password: 'password123'
    })
    console.log('Login successful:', response)
  } catch (error) {
    console.error('Login failed:', error.message)
  }
}

// Register (with FormData for file upload)
const register = async () => {
  try {
    const formData = new FormData()
    formData.append('username', 'John Doe')
    formData.append('email', 'john@example.com')
    formData.append('mobile', '1234567890')
    formData.append('password', 'password123')
    formData.append('userType', 'visitor') // or 'member'
    formData.append('idProof', fileInput.files[0]) // File object
    
    const response = await authService.register(formData)
    console.log('Registration successful:', response.data.user)
    console.log('Token:', response.data.token) // Auto-stored in localStorage
  } catch (error) {
    console.error('Registration failed:', error.message)
  }
}

// Check if authenticated
if (authService.isAuthenticated()) {
  console.log('User is logged in')
}

// Logout
await authService.logout()
```

### 2. Refreshment Service
```javascript
import { refreshmentService } from '@/api'

// Get menu
const menu = await refreshmentService.getMenu()

// Create order (multipart/form-data — supports paymentScreenshot file upload)
const formData = new FormData()
formData.append('orders', JSON.stringify([
  { orderType: 'Coffee', itemName: 'Cappuccino', quantity: 2 },
  { orderType: 'Tea',    itemName: 'Green Tea',  quantity: 1 },
]))
formData.append('specialInstructions', 'Extra hot please')
formData.append('utrNumber', 'UTR1234567890')
formData.append('isPersonal', 'true')
formData.append('isMonthlyPayment', 'false')
formData.append('paymentScreenshot', screenshotFile) // File object (optional)

const order = await refreshmentService.createOrder(formData)

// Get orders
const orders = await refreshmentService.getOrders()
```

### 3. Utilities Service
```javascript
import { utilitiesService } from '@/api'

// Get pricing
const pricing = await utilitiesService.getPricing()

// Create print job
const job = await utilitiesService.createPrintJob({
  fileUrl: 'https://example.com/document.pdf',
  copies: 2,
  color: true
})

// Get jobs
const jobs = await utilitiesService.getJobs()
```

### 4. Direct API Client Usage
```javascript
import { apiClient } from '@/api'

// Custom GET request
const data = await apiClient.get('/custom/endpoint')

// Custom POST request
const result = await apiClient.post('/custom/endpoint', {
  key: 'value'
})
```

## Features

- **Automatic token management**: Auth token is automatically added to requests
- **Error handling**: Comprehensive error handling with custom error messages
- **Timeout support**: 10-second timeout for all requests
- **Type-safe**: Clear service interfaces
- **Centralized configuration**: All endpoints and config in one place
- **FormData support**: Handles file uploads for registration

## API Response Structure

### Registration Response
```javascript
{
  status: 201,
  success: true,
  message: "Created Successfully",
  data: {
    user: {
      role: "user",
      id: 102,
      username: "Suvendu",
      email: "suvendukumar20@gmail.com",
      mobile: "7008747987",
      userType: "visitor",
      idProof: "1776680240489-956130512.png",
      updatedAt: "2026-04-20T10:17:20.587Z",
      createdAt: "2026-04-20T10:17:20.587Z"
    },
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

## Adding New Endpoints

1. Add endpoint to `config.js`:
```javascript
export const ENDPOINTS = {
  newService: {
    getData: '/new-service/data',
    createItem: '/new-service/create',
  },
}
```

2. Create service file in `services/`:
```javascript
// services/newService.js
import apiClient from '../client'
import { ENDPOINTS } from '../config'

export const newService = {
  async getData() {
    return await apiClient.get(ENDPOINTS.newService.getData)
  },
}
```

3. Export from `index.js`:
```javascript
export { newService } from './services/newService'
```

## Notes

- The API client automatically includes the Authorization header if a token is stored
- All services include proper error handling and logging
- Tokens are stored in localStorage (consider using httpOnly cookies for production)
