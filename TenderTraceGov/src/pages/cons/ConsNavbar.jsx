import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

const ConsNavbar = ({ onOpenUploadModal }) => {
  const navigate = useNavigate()
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <nav className="bg-white/90 backdrop-blur-md text-gray-900 border-b border-gray-100 shadow-sm sticky top-0 z-40 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center cursor-pointer group" onClick={() => navigate('/')}>
            <span className="text-2xl font-black tracking-tighter text-gray-900 group-hover:text-blue-700 transition-colors">
              TenderTrace <span className="text-blue-600 font-medium text-lg ml-1">| Constructor</span>
            </span>
          </div>
          
          <div className="flex items-center space-x-4 sm:space-x-6">
            <button
              onClick={() => {
                const section = document.getElementById('my-projects')
                if (section) section.scrollIntoView({ behavior: 'smooth' })
              }}
              className="text-gray-600 hover:text-blue-600 font-semibold px-3 py-2 text-sm transition-colors"
            >
              My Projects
            </button>

            <span className="text-sm font-medium border border-blue-200 text-blue-700 px-3 py-1 rounded-full bg-blue-50 hidden md:inline-block">
              Constructor
            </span>
            
            <button
              onClick={onOpenUploadModal}
              className="bg-blue-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-700 transition duration-200 shadow-sm flex items-center"
            >
              <i className="ri-upload-cloud-2-line mr-2"></i> Upload Details
            </button>

            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 focus:outline-none ml-2"
              >
                <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center border border-gray-300 hover:border-blue-400 transition-colors">
                  <i className="ri-user-settings-line text-gray-600 text-lg"></i>
                </div>
              </button>
              
              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-100 ring-1 ring-black ring-opacity-5 animate-fade-in-down">
                  <div className="px-4 py-3 border-b border-gray-100 md:hidden">
                    <p className="text-sm font-medium text-gray-900">Constructor Profile</p>
                  </div>
                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      navigate('/');
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 flex items-center"
                  >
                    <i className="ri-logout-box-r-line mr-2"></i> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default ConsNavbar
