import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const Navbar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = (sectionId) => {
    if (location.pathname !== '/') {
      navigate('/')
      setTimeout(() => {
        const section = document.getElementById(sectionId)
        if (section) section.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    } else {
      const section = document.getElementById(sectionId)
      if (section) section.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-black/70 backdrop-blur-md shadow-lg border-b border-white/10' : 'bg-white border-b border-gray-200 shadow-sm'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">

          <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => navigate('/')}>
            <span className={`text-2xl font-bold tracking-wider transition-colors duration-300 ${isScrolled ? 'text-white' : 'text-gray-900'}`}>
              TenderTrace <span className={`text-lg transition-colors duration-300 ${isScrolled ? 'text-blue-400' : 'text-blue-600'}`}>| User</span>
            </span>
          </div>

          <div className="flex items-center space-x-4 sm:space-x-8">
            <button
              onClick={() => handleNavClick('live-projects')}
              className={`font-semibold transition-colors duration-300 uppercase tracking-wide text-sm ${isScrolled ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-blue-600'}`}
            >
              Live Projects
            </button>

            <button
              onClick={() => handleNavClick('tenders-section')}
              className={`font-semibold transition-colors duration-300 uppercase tracking-wide text-sm ${isScrolled ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-blue-600'}`}
            >
              Tenders
            </button>

            <button
              onClick={() => navigate('/about')}
              className={`font-semibold transition-colors duration-300 uppercase tracking-wide text-sm ${isScrolled ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-blue-600'}`}
            >
              About
            </button>

          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
