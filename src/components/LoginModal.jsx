import { useState } from 'react'

function LoginModal({ isOpen, onClose }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    // Add your login logic here
    console.log('Login attempt with:', { email, password })
    
    // Example: You can add API call here
    // After successful login, close the modal
    // onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn" onClick={onClose}>
      <div className="bg-white rounded-3xl p-10 max-w-md w-11/12 relative shadow-2xl animate-slideUp" onClick={(e) => e.stopPropagation()}>
        <button 
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-4xl w-10 h-10 flex items-center justify-center transition-colors duration-200 border-none bg-transparent cursor-pointer p-0"
          onClick={onClose}
        >
          ×
        </button>
        
        <div className="text-center mb-8">
          <h2 className="text-4xl mb-2 bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent font-semibold">Login</h2>
          <p className="text-sm text-gray-600">Welcome back! Please login to your account.</p>
        </div>

        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="font-semibold text-gray-800 text-sm">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            className="p-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-none rounded-xl text-lg font-semibold cursor-pointer transition-all duration-300 mt-2 hover:-translate-y-1 hover:shadow-xl active:translate-y-0"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  )
}

export default LoginModal
