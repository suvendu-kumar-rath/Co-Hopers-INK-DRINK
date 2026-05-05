import { useState, useRef, useEffect } from 'react'
import './ProfileDropdown.css'

function ProfileDropdown({ user, onLogout, onViewHistory }) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    onLogout()
    setIsOpen(false)
  }

  const handleViewHistory = () => {
    onViewHistory()
    setIsOpen(false)
  }

  return (
    <div className="profile-dropdown" ref={dropdownRef}>
      <button 
        className="profile-icon-btn"
        onClick={() => setIsOpen(!isOpen)}
        title={user?.username || 'Profile'}
      >
        <div className="profile-icon">
          {user?.username?.charAt(0)?.toUpperCase() || 'U'}
        </div>
      </button>

      {isOpen && (
        <div className="profile-menu">
          <div className="profile-menu-header">
            <div className="profile-info">
              <div className="profile-name">{user?.username || 'User'}</div>
              <div className="profile-email">{user?.email || 'No email'}</div>
            </div>
          </div>

          <div className="profile-menu-divider"></div>

          <button 
            className="profile-menu-item"
            onClick={handleViewHistory}
          >
            <span className="menu-icon">📋</span>
            <span className="menu-text">Order History</span>
          </button>

          <button 
            className="profile-menu-item"
            onClick={handleLogout}
          >
            <span className="menu-icon">🚪</span>
            <span className="menu-text">Logout</span>
          </button>
        </div>
      )}
    </div>
  )
}

export default ProfileDropdown
