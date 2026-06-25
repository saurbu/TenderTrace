import React from 'react'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
  const navigate = useNavigate()

  return (
    <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-sm flex items-center justify-between px-6 py-3">
      <div
        className="text-xl font-bold cursor-pointer"
        onClick={() => navigate('/')}
      >
        TenderTrace
      </div>

    </div>
  )
}

export default Navbar