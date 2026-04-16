import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const Navbar = ({ type = '' }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className='relative mb-20'>

      <div
        className={`fixed top-0 left-0 w-full z-50 flex items-center justify-between px-4 md:px-8 py-3 transition-all duration-300
        ${scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm text-gray-900'
            : 'bg-white shadow-sm text-gray-900 border-b border-gray-100'
          }`}
      >
        {/* Logo */}
        <div
          className="flex-shrink-0 flex items-center cursor-pointer"
          onClick={() => window.location.href = '/'}
        >
          <span className="text-xl md:text-2xl font-bold tracking-wider">
            TenderTrace
            {type && (
              <span className="text-blue-600 text-base md:text-lg">
                {" "} | {type}
              </span>
            )}
          </span>
        </div>

        {/* Menu Button */}
        <button
          onClick={() => setIsOpen(true)}
          className='bg-gray-200 hover:bg-gray-300 transition rounded-full text-xl px-3 py-1 cursor-pointer'
        >
          ☰
        </button>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className='fixed inset-0 bg-black/40 z-40'
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className='flex justify-between items-center p-4 border-b'>
          <h3 className='text-lg font-semibold'>Menu</h3>
          <button onClick={() => setIsOpen(false)}>✖</button>
        </div>

        <div className='flex flex-col gap-4 p-4'>
          <Link to="/" onClick={() => setIsOpen(false)} className='text-lg hover:text-blue-500'>
            Home
          </Link>

          <Link to="/gov-login" onClick={() => setIsOpen(false)} className='text-lg hover:text-blue-500'>
            Login as Government
          </Link>

          <Link to="/constructor-login" onClick={() => setIsOpen(false)} className='text-lg hover:text-blue-500'>
            Login as Constructor
          </Link>
        </div>
      </div>

    </div>
  )
}

export default Navbar