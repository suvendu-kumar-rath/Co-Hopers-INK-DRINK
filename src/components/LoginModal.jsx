import { useState } from 'react'
import { authService } from '../api'

function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true) // Toggle between login and register
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  
  // Registration fields
  const [userName, setUserName] = useState('')
  const [email, setEmail] = useState('')
  const [mobile, setMobile] = useState('')
  const [idProof, setIdProof] = useState(null)
  const [confirmPassword, setConfirmPassword] = useState('')
  const [cabinNumber, setCabinNumber] = useState('')
  const [roomNumber, setRoomNumber] = useState('')
  
  // UI states
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      const response = await authService.login({ mobile: phone, password })
      console.log('Login successful:', response)
      setSuccess('Login successful!')
      setTimeout(() => {
        onLoginSuccess && onLoginSuccess()
        resetForm()
      }, 1000)
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (!userName || !email || !mobile || !password || !cabinNumber || !roomNumber) {
      setError('Please fill in all required fields')
      setLoading(false)
      return
    }

    if (!idProof) {
      setError('Please upload your ID Proof')
      setLoading(false)
      return
    }

    try {
      const response = await authService.register({
        userName,
        email,
        mobile,
        password,
        confirmPassword,
        idProof,
        cabinNumber,
        roomNumber,
      })
      console.log('Registration successful:', response)
      setSuccess('Registration successful! You are now logged in.')
      setTimeout(() => {
        onLoginSuccess && onLoginSuccess()
        resetForm()
      }, 1500)
    } catch (err) {
      setError(err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    setIdProof(file)
  }

  const resetForm = () => {
    setPhone('')
    setPassword('')
    setUserName('')
    setEmail('')
    setMobile('')
    setIdProof(null)
    setConfirmPassword('')
    setCabinNumber('')
    setRoomNumber('')
    setError(null)
    setSuccess(null)
    setIsLogin(true)
  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
    setError(null)
    setSuccess(null)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn" onClick={onClose}>
      <div className="bg-white rounded-3xl p-10 max-w-md w-11/12 relative shadow-2xl animate-slideUp max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <button 
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-4xl w-10 h-10 flex items-center justify-center transition-colors duration-200 border-none bg-transparent cursor-pointer p-0"
          onClick={onClose}
        >
          ×
        </button>
        
        <div className="text-center mb-8">
          <h2 className="text-4xl mb-2 bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent font-semibold">
            {isLogin ? 'Login' : 'Register'}
          </h2>
          <p className="text-sm text-gray-600">
            {isLogin ? 'Welcome back! Please login to your account.' : 'Create a new account to get started.'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm">
            {success}
          </div>
        )}

        {isLogin ? (
          // Login Form
          <form className="flex flex-col gap-6" onSubmit={handleLogin}>
            <div className="flex flex-col gap-2">
              <label htmlFor="phone" className="font-semibold text-gray-800 text-sm">Phone Number</label>
              <input
                type="tel"
                id="phone"
                placeholder="Enter your phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="p-4 border-2 border-gray-200 rounded-xl text-base transition-all duration-300 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="font-semibold text-gray-800 text-sm">Password</label>
              <div className="relative flex items-center">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="flex-1 p-4 pr-12 border-2 border-gray-200 rounded-xl text-base transition-all duration-300 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 bg-transparent border-none cursor-pointer text-xl p-2 opacity-60 hover:opacity-100 transition-opacity duration-200"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="p-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-none rounded-xl text-lg font-semibold cursor-pointer transition-all duration-300 mt-2 hover:-translate-y-1 hover:shadow-xl active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>

            <div className="text-center mt-4">
              <p className="text-gray-600 text-sm">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={toggleMode}
                  className="text-indigo-600 font-semibold hover:text-indigo-700 bg-transparent border-none cursor-pointer underline"
                >
                  Register here
                </button>
              </p>
            </div>
          </form>
        ) : (
          // Registration Form
          <form className="flex flex-col gap-5" onSubmit={handleRegister}>
            <div className="flex flex-col gap-2">
              <label htmlFor="userName" className="font-semibold text-gray-800 text-sm">Username</label>
              <input
                type="text"
                id="userName"
                placeholder="Enter your username"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="p-3 border-2 border-gray-200 rounded-xl text-base transition-all duration-300 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="reg-email" className="font-semibold text-gray-800 text-sm">Email</label>
              <input
                type="email"
                id="reg-email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="p-3 border-2 border-gray-200 rounded-xl text-base transition-all duration-300 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="mobile" className="font-semibold text-gray-800 text-sm">Mobile</label>
              <input
                type="tel"
                id="mobile"
                placeholder="Enter your mobile number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="p-3 border-2 border-gray-200 rounded-xl text-base transition-all duration-300 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="reg-password" className="font-semibold text-gray-800 text-sm">Password</label>
              <div className="relative flex items-center">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="reg-password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="flex-1 p-3 pr-12 border-2 border-gray-200 rounded-xl text-base transition-all duration-300 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 bg-transparent border-none cursor-pointer text-xl p-2 opacity-60 hover:opacity-100 transition-opacity duration-200"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="confirm-password" className="font-semibold text-gray-800 text-sm">Confirm Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="confirm-password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="p-3 border-2 border-gray-200 rounded-xl text-base transition-all duration-300 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="cabinNumber" className="font-semibold text-gray-800 text-sm">Cabin Number</label>
              <input
                type="text"
                id="cabinNumber"
                placeholder="Enter your cabin number (e.g. c-3)"
                value={cabinNumber}
                onChange={(e) => setCabinNumber(e.target.value)}
                className="p-3 border-2 border-gray-200 rounded-xl text-base transition-all duration-300 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="roomNumber" className="font-semibold text-gray-800 text-sm">Room Number</label>
              <input
                type="text"
                id="roomNumber"
                placeholder="Enter your room number (e.g. 630)"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                className="p-3 border-2 border-gray-200 rounded-xl text-base transition-all duration-300 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="idProof" className="font-semibold text-gray-800 text-sm">ID Proof</label>
              <input
                type="file"
                id="idProof"
                accept="image/*"
                onChange={handleFileChange}
                className="p-3 border-2 border-gray-200 rounded-xl text-base transition-all duration-300 outline-none focus:border-indigo-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                required
              />
              {idProof && (
                <p className="text-xs text-gray-500 mt-1">Selected: {idProof.name}</p>
              )}
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="p-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-none rounded-xl text-lg font-semibold cursor-pointer transition-all duration-300 mt-2 hover:-translate-y-1 hover:shadow-xl active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Registering...' : 'Register'}
            </button>

            <div className="text-center mt-4">
              <p className="text-gray-600 text-sm">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={toggleMode}
                  className="text-indigo-600 font-semibold hover:text-indigo-700 bg-transparent border-none cursor-pointer underline"
                >
                  Login here
                </button>
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default LoginModal
