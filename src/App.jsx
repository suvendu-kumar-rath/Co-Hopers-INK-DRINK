import { useState } from 'react'
import CoffeeBooking from './components/CoffeeBooking'
import Printing from './components/Printing'
import LoginModal from './components/LoginModal'
// import logo from './assets/logo.png' // Uncomment after saving logo.png

function App() {
  const [selectedOption, setSelectedOption] = useState(null)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

  const handleSelectOption = (option) => {
    setSelectedOption(option)
  }

  const handleBack = () => {
    setSelectedOption(null)
  }

  // Main menu view
  if (!selectedOption) {
    return (
      <div className="min-h-screen p-8 max-w-6xl mx-auto">
        <div className="text-center mb-12 relative">
          <button 
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
            onClick={() => setIsLoginModalOpen(true)}
          >
            Login
          </button>
          {/* <img src={logo} alt="CoHopers Logo" className="mx-auto mb-6 w-64 md:w-80" /> */}
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
        />
      </div>
    )
  }

  // Component view
  return (
    <div className="min-h-screen p-8 max-w-6xl mx-auto">
      <div className="text-center mb-12 relative">
        <button 
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-gray-100 border-2 border-gray-300 px-5 py-3 rounded-lg font-medium transition-all duration-300 hover:bg-gray-200 hover:border-gray-400 hover:scale-105"
          onClick={handleBack}
        >
          ← Back
        </button>
        <button 
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
          onClick={() => setIsLoginModalOpen(true)}
        >
          Login
        </button>
        {/* <img src={logo} alt="CoHopers Logo" className="mx-auto mb-4 w-48 md:w-64" /> */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
          {selectedOption === 'refreshment' ? 'Refreshment' : 'Utilities'}
        </h1>
      </div>
      
      <div className="mt-8">
        {selectedOption === 'refreshment' ? <CoffeeBooking /> : <Printing />}
      </div>

      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </div>
  )
}

export default App
