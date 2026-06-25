import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

const ConsNavbar = ({ onOpenUploadModal }) => {
  const navigate = useNavigate()
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [email, setEmail] = useState("")
  const dropdownRef = useRef(null)

  useEffect(() => {
    const storedEmail = localStorage.getItem("email")
    if (storedEmail) {
      setEmail(storedEmail)
    }
  }, [])

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
    <nav className="bg-white text-gray-900 border-b border-gray-200 shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">

          <div
            className="flex-shrink-0 flex items-center cursor-pointer"
            
          >
            <span className="text-2xl font-bold tracking-wider">
              TenderTrace <span className="text-blue-600 text-lg">| Constructor</span>
            </span>
          </div>

          <div className="flex items-center space-x-4 sm:space-x-6">

            {/* <span className="text-sm font-medium border border-blue-200 text-blue-700 px-3 py-1 rounded-full bg-blue-50 hidden md:inline-block">
              Constructor
            </span> */}

            {/* <button
              onClick={onOpenUploadModal}
              className="bg-blue-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-700 transition duration-200 shadow-sm flex items-center"
            >
              Upload Details
            </button> */}

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2"
              >
                <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center border">
                  👤
                </div>
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-md shadow-lg py-1 border">


                  <button
                    onClick={() => {
                      navigate('/')
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                  >
                    Logout
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

