import { useState, useEffect } from 'react'
import './App.css'
import CoffeeBooking from './components/CoffeeBooking'
import Utilities from './components/Utilities'
import LoginModal from './components/LoginModal'

function App() {
  const [selectedOption, setSelectedOption] = useState(null)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('authToken'))
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user')
    return stored ? JSON.parse(stored) : null
  })

  useEffect(() => {
    const checkAuth = () => {
      setIsLoggedIn(!!localStorage.getItem('authToken'))
      const stored = localStorage.getItem('user')
      setUser(stored ? JSON.parse(stored) : null)
    }
    window.addEventListener('storage', checkAuth)
    return () => window.removeEventListener('storage', checkAuth)
  }, [])

  const handleLoginSuccess = () => {
    setIsLoggedIn(!!localStorage.getItem('authToken'))
    const stored = localStorage.getItem('user')
    setUser(stored ? JSON.parse(stored) : null)
    setIsLoginModalOpen(false)
  }

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
    setIsLoggedIn(false)
    setUser(null)
  }

  const handleSelectOption = (option) => {
    if (!isLoggedIn) {
      setIsLoginModalOpen(true)
      return
    }
    setSelectedOption(option)
  }

  const handleBack = () => {
    setSelectedOption(null)
  }

  // Main menu view
  if (!selectedOption) {
    return (
      <div className="min-h-screen">
        {/* Header Section */}
        <header className="header-section">
          <div className="header-container">
            <img src="/logo192.png" alt="CoHopers Logo" className="header-logo" />
            {isLoggedIn ? (
              <div className="header-user">
                {user && <span className="header-username">Hi, {user.username}</span>}
                <button className="header-logout-btn" onClick={handleLogout}>Logout</button>
              </div>
            ) : (
              <button className="header-login-btn" onClick={() => setIsLoginModalOpen(true)}>Login</button>
            )}
          </div>
        </header>
        
        {/* Main Content */}
        <div className="p-8 max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-2 text-gray-800">Cohopers Utilities</h1>
            <p className="text-lg text-gray-600">Select a service to continue</p>
          </div>
        
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 p-4">
            <div 
              className="bg-gradient-to-br from-pink-400 via-pink-500 to-red-500 rounded-3xl p-12 text-center cursor-pointer transition-all duration-300 hover:-translate-y-3 shadow-xl hover:shadow-2xl text-white"
              onClick={() => handleSelectOption('refreshment')}
            >
              <div className="text-6xl mb-4">☕</div>
              <h2 className="text-3xl mb-2 font-semibold">Refreshment</h2>
              <p className="text-base opacity-90">Book coffee and tea</p>
            </div>
          
            <div 
              className="bg-gradient-to-br from-cyan-400 via-blue-500 to-cyan-300 rounded-3xl p-12 text-center cursor-pointer transition-all duration-300 hover:-translate-y-3 shadow-xl hover:shadow-2xl text-white"
              onClick={() => handleSelectOption('utilities')}
            >
              <div className="text-6xl mb-4">🖨️</div>
              <h2 className="text-3xl mb-2 font-semibold">Utilities</h2>
              <p className="text-base opacity-90">Printing facilities</p>
            </div>
          </div>

          <LoginModal 
            isOpen={isLoginModalOpen} 
            onClose={() => setIsLoginModalOpen(false)}
            onLoginSuccess={handleLoginSuccess}
          />
        </div>
      </div>
    )
  }

  // Component view
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen">
        <header className="header-section">
          <div className="header-container">
            <img src="/logo192.png" alt="CoHopers Logo" className="header-logo" />
            <button className="header-login-btn" onClick={() => setIsLoginModalOpen(true)}>Login</button>
          </div>
        </header>

        <div className="p-8 max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Login Required</h1>
            <p className="text-gray-600 mt-2">Please log in to access Refreshment and Utilities.</p>
          </div>

          <div className="flex justify-center">
            <button
              className="header-login-btn"
              onClick={() => setIsLoginModalOpen(true)}
            >
              Login
            </button>
          </div>

          <LoginModal
            isOpen={isLoginModalOpen}
            onClose={() => setIsLoginModalOpen(false)}
            onLoginSuccess={handleLoginSuccess}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <header className="header-section">
        <div className="header-container">
          <img src="/logo192.png" alt="CoHopers Logo" className="header-logo" />
          {isLoggedIn ? (
            <div className="header-user">
              {user && <span className="header-username">Hi, {user.username}</span>}
              <button className="header-logout-btn" onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <button className="header-login-btn" onClick={() => setIsLoginModalOpen(true)}>Login</button>
          )}
        </div>
      </header>
      
      {/* Main Content */}
      <div className="p-8 max-w-6xl mx-auto">
        <div className="text-center mb-12 relative">
          <button 
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-gray-100 border-2 border-gray-300 px-5 py-3 rounded-lg font-medium transition-all duration-300 hover:bg-gray-200 hover:border-gray-400 hover:scale-105"
            onClick={handleBack}
          >
            ← Back
          </button>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
            {selectedOption === 'refreshment' ? 'Refreshment' : 'Utilities'}
          </h1>
        </div>
      
        <div className="mt-8">
          {selectedOption === 'refreshment' ? <CoffeeBooking /> : <Utilities />}
        </div>

        <LoginModal 
          isOpen={isLoginModalOpen} 
          onClose={() => setIsLoginModalOpen(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      </div>
    </div>
  )
}

export default App
