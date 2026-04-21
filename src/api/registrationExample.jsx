import { useState } from 'react'
import { authService } from '../api'

/**
 * Registration Form Component Example
 * 
 * This component demonstrates how to use the registration API
 * with FormData for file uploads (idProof)
 */
export const RegistrationFormExample = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    mobile: '',
    password: '',
    userType: 'visitor', // or 'member'
  })
  const [idProof, setIdProof] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    setIdProof(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      // Create FormData object
      const data = new FormData()
      data.append('username', formData.username)
      data.append('email', formData.email)
      data.append('mobile', formData.mobile)
      data.append('password', formData.password)
      data.append('userType', formData.userType)
      
      // Add file if selected
      if (idProof) {
        data.append('idProof', idProof)
      }

      // Call registration API
      const response = await authService.register(data)
      
      console.log('Registration successful:', response)
      setSuccess(true)
      
      // Response structure:
      // {
      //   status: 201,
      //   success: true,
      //   message: "Created Successfully",
      //   data: {
      //     user: { id, username, email, mobile, userType, ... },
      //     token: "..."
      //   }
      // }

      // Token is automatically stored in localStorage
      // You can redirect user or show success message
      
    } catch (err) {
      setError(err.message || 'Registration failed')
      console.error('Registration error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="registration-form">
      <h2>Visitor Registration</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Mobile</label>
          <input
            type="tel"
            name="mobile"
            value={formData.mobile}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>User Type</label>
          <select
            name="userType"
            value={formData.userType}
            onChange={handleInputChange}
            required
          >
            <option value="visitor">Visitor</option>
            <option value="member">Member</option>
          </select>
        </div>

        <div className="form-group">
          <label>ID Proof (Image)</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            required
          />
          {idProof && <p className="file-name">{idProof.name}</p>}
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>

      {error && (
        <div className="error-message">
          <p>Error: {error}</p>
        </div>
      )}

      {success && (
        <div className="success-message">
          <p>Registration successful! You are now logged in.</p>
        </div>
      )}
    </div>
  )
}

/**
 * Simple usage without component
 */
export const registerUserExample = async (userData, idProofFile) => {
  const formData = new FormData()
  formData.append('username', userData.userName)
  formData.append('email', userData.email)
  formData.append('mobile', userData.mobile)
  formData.append('password', userData.password)
  formData.append('userType', userData.userType || 'visitor')
  formData.append('idProof', idProofFile)

  try {
    const response = await authService.register(formData)
    
    // Access user data
    const user = response.data.user
    const token = response.data.token // Already stored in localStorage
    
    console.log('Registered user:', user)
    console.log('User ID:', user.id)
    console.log('Token:', token)
    
    return response
  } catch (error) {
    console.error('Registration failed:', error)
    throw error
  }
}
