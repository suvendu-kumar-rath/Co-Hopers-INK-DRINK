import { useState, useEffect } from 'react'
import './App.css'
import CoffeeBooking from './components/CoffeeBooking'
import Utilities from './components/Utilities'
import LoginModal from './components/LoginModal'
import ProfileDropdown from './components/ProfileDropdown'
import { orderService } from './api'

function App() {
  const [selectedOption, setSelectedOption] = useState(null)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('authToken'))
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user')
    return stored ? JSON.parse(stored) : null
  })
  const [orderHistory, setOrderHistory] = useState([])
  const [orderLoading, setOrderLoading] = useState(false)
  const [orderError, setOrderError] = useState(null)

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

  const handleViewHistory = async () => {
    setSelectedOption('history')
    setOrderLoading(true)
    setOrderError(null)
    try {
      const response = await orderService.getOrderHistory()
      setOrderHistory(response.data || response || [])
    } catch (error) {
      console.error('Error fetching order history:', error)
      setOrderError(error.message || 'Failed to load order history')
    } finally {
      setOrderLoading(false)
    }
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
              <ProfileDropdown 
                user={user}
                onLogout={handleLogout}
                onViewHistory={handleViewHistory}
              />
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
            <ProfileDropdown 
              user={user}
              onLogout={handleLogout}
              onViewHistory={handleViewHistory}
            />
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
            {selectedOption === 'refreshment' ? 'Refreshment' : selectedOption === 'utilities' ? 'Utilities' : 'Order History'}
          </h1>
        </div>
      
        <div className="mt-8">
          {selectedOption === 'refreshment' && <CoffeeBooking />}
          {selectedOption === 'utilities' && <Utilities />}
          {selectedOption === 'history' && (
            <div className="bg-white rounded-lg p-8 shadow-lg">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800">Your Order History</h2>
              
              {orderLoading && (
                <div className="text-center py-12">
                  <p className="text-gray-500">Loading your orders...</p>
                </div>
              )}
              
              {orderError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
                  <p className="font-semibold">Error</p>
                  <p className="text-sm">{orderError}</p>
                </div>
              )}
              
              {!orderLoading && !orderError && orderHistory.length === 0 && (
                <div className="text-center text-gray-500 py-12">
                  <p className="text-lg">📋 No orders yet</p>
                  <p className="text-sm mt-2">Your orders will appear here</p>
                </div>
              )}
              
              {!orderLoading && !orderError && orderHistory.length > 0 && (
                <div className="space-y-4">
                  {orderHistory.map((order, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-semibold text-gray-800">Order #{order.id || order.orderId || index + 1}</p>
                          <p className="text-sm text-gray-500">{order.date || order.createdAt || 'Date not available'}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          order.status === 'completed' ? 'bg-green-100 text-green-800' :
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {order.status || 'Completed'}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                        <div>
                          <p className="text-gray-600">Items</p>
                          <p className="font-medium">{order.itemCount || 1} item(s)</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Amount</p>
                          <p className="font-medium">₹{order.totalAmount || order.amount || '0'}</p>
                        </div>
                      </div>
                      
                      {order.items && order.items.length > 0 && (
                        <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                          <p className="font-medium mb-1">Items:</p>
                          <ul className="list-inside">
                            {order.items.map((item, idx) => (
                              <li key={idx}>• {item.name || item.itemName} x {item.quantity || 1}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
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
