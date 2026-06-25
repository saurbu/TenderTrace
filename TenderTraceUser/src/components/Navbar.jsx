import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div
      className={`sticky top-0 z-50 flex items-center justify-between px-18 py-4 transition-all duration-300
      ${
        scrolled
          ? 'bg-black/50 backdrop-blur-md shadow-md'
          : 'bg-transparent'
      }`}
    >
      <div
        className="flex-shrink-0 flex items-center cursor-pointer"
        onClick={() => navigate('/')}
      >
        <span
          className={`text-2xl font-bold tracking-wider transition-colors duration-300 ${
            scrolled ? 'text-white' : 'text-black'
          }`}
        >
          TenderTrace{' '}
          
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            const section = document.getElementById('live-projects')
            if (section) {
              section.scrollIntoView({ behavior: 'smooth' })
            }
          }}
          className="bg-gray-200 rounded-full tracking-widest uppercase px-4 py-2 text-sm cursor-pointer"
        >
          Live Projects
        </button>

        <button 
        onClick={() => {
            const section = document.getElementById('tenders-section')
            if (section) {
              section.scrollIntoView({ behavior: 'smooth' })
            }
          }}
        className="bg-gray-200 rounded-full tracking-widest uppercase px-4 py-2 text-sm cursor-pointer">
          Tenders
        </button>

        <button
          onClick={() => navigate('/about')}
          className="bg-gray-200 rounded-full tracking-widest uppercase px-4 py-2 text-sm cursor-pointer"
        >
          About
        </button>
      </div>
    </div>
  )
}

export default Navbar